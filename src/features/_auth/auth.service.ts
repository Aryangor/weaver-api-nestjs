// auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Response } from 'express';
import { User } from '@entities/user.entity'; // Adjust the import path as necessary
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { TJwtPayload } from '@shared/models/jwt';
import { UserModel } from '../users/user.model';
import { EmailService } from '@shared/services/email.service';

import { readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        @InjectRepository(User) // Assuming 'core' is your core database connection name
        private readonly userRepository: Repository<User>,
        private readonly configService: ConfigService,
        private readonly emailService: EmailService, // Inject EmailService if needed
    ) {}

    async login(
        res: Response,
        email: string,
        password: string,
    ): Promise<Partial<UserModel>> {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user?.password) {
            throw new UnauthorizedException(
                'User not found or password not set!',
            );
        }

        if (user.is_active === false) {
            throw new UnauthorizedException(
                'User is not active! Please contact support to activate the user.',
            );
        }

        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (!user || !passwordsMatch) {
            throw new UnauthorizedException('Invalid credentials!');
        }

        const payload: TJwtPayload = {
            sub: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            is_active: user.is_active,
        };

        const setCookies = await this.setResponseCookies(res, payload);

        if (!setCookies) {
            throw new UnauthorizedException('Failed to set cookies!');
        }

        // Return partial user data
        return {
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
        };
    }

    async resetPassword(email: string): Promise<boolean> {
        // First check that the user with this email exists
        const user = await this.userRepository.findOne({ where: { email } });

        if (!user) {
            throw new UnauthorizedException('User not found!');
        }

        //  Calculate expiry time for the reset token
        if (!user.is_active) {
            throw new UnauthorizedException(
                'User is not active! Please contact support to activate the user.',
            );
        }

        // Calculate expiry time for the reset token, based on the config
        const expiryTime =
            Math.floor(Date.now() / 1000) +
            60 *
                (this.configService.get<number>(
                    'JWT_RESET_PASSWORD_EXPIRES_IN_HOURS',
                ) || 1);

        // Generate a reset password token
        const payload: TJwtPayload = {
            sub: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            is_active: user.is_active,
        };

        const resetToken = await this.jwtService.signAsync(payload, {
            secret: this.configService.get<string>('JWT_RESET_PASSWORD_SECRET'),
            expiresIn: `${this.configService.get<number | string>('JWT_RESET_PASSWORD_EXPIRES_IN_HOURS') || 1}h`,
        });

        // Update the reset token in the database
        user.reset_password_token = resetToken;
        await this.userRepository.save(user);

        // Get the server URL from config or environment
        const serverUrl =
            this.configService.get<string>('CLIENT_URL') ||
            `http://localhost:${process.env.PORT || 3000}`;

        // Calculate email variables
        const first_name = user.first_name;
        const last_name = user.last_name;
        const company =
            this.configService.get<string>('COMPANY_NAME') || 'Weaver App';
        const reset_link = `${serverUrl}/auth/change-password?token=${resetToken}`;
        const expiry_time = `${this.configService.get<number | string>('JWT_RESET_PASSWORD_EXPIRES_IN_HOURS') || 1} hour(s)`;

        // Load and compile the HTML template
        const templatePath = join(
            process.cwd(),
            'src',
            '@shared',
            'templates',
            'emails',
            'reset-password.html',
        );

        let html = readFileSync(templatePath, 'utf8');

        html = html
            .replace(/{{var.first_name}}/g, first_name)
            .replace(/{{var.last_name}}/g, last_name)
            .replace(/{{var.company}}/g, company)
            .replace(/{{var.reset_link}}/g, reset_link)
            .replace(/{{var.expiry_time}}/g, expiry_time);

        // Send the reset password email
        await this.emailService.sendEmail(user.email, 'Reset Password', html);

        return true;
    }

    async changePassword(token: string, password: string): Promise<boolean> {
        // Verify the reset token
        const payload = await this.jwtService.verifyAsync<TJwtPayload>(token, {
            secret: this.configService.get<string>('JWT_RESET_PASSWORD_SECRET'),
        });

        if (!payload) {
            throw new UnauthorizedException('Invalid token!');
        }

        // Find the user by ID
        const user = await this.userRepository.findOne({
            where: { id: payload.sub },
        });

        if (!user) {
            throw new UnauthorizedException('User not found!');
        }

        // Check if the token is the same
        if (user.reset_password_token !== token) {
            throw new UnauthorizedException('Invalid token!');
        }

        // Check if the token hasn't expired
        if (payload.exp && payload.exp < Date.now() / 1000) {
            throw new UnauthorizedException('Token has expired!');
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.reset_password_token = null; // Clear the reset token after use

        // Save the user
        await this.userRepository.save(user);

        return true;
    }

    logout(res: Response): Promise<boolean> {
        // Clear cookies
        res.clearCookie('accessToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });

        return Promise.resolve(true);
    }

    async setResponseCookies(
        res: Response,
        payload: TJwtPayload,
    ): Promise<boolean> {
        // Set tokens as an HTTP-only cookies
        const maxAgeAccess =
            (this.configService.get<number | undefined>(
                'JWT_ACCESS_EXPIRES_IN_MINS',
            ) ?? 30) *
            60 *
            1000; // Convert minutes to milliseconds

        const maxAgeRefresh =
            (this.configService.get<number | undefined>(
                'JWT_REFRESH_EXPIRES_IN_DAYS',
            ) ?? 7) *
            24 *
            60 *
            60 *
            1000; // Convert days to milliseconds

        const accessToken = await this._generatAccessToken(payload);

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            maxAge: maxAgeAccess,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
        });

        const refreshToken = await this._generateRefreshToken(payload);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: maxAgeRefresh,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
        });

        return true;
    }

    private async _generatAccessToken(payload: any): Promise<string> {
        const accessTokenExpiresINMins =
            this.configService.get<string>('JWT_ACCESS_EXPIRES_IN_MINS') ||
            '30'; // Default to 30 minutes if not set

        return await this.jwtService.signAsync(payload, {
            secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
            expiresIn: `${accessTokenExpiresINMins}m`, // Use minutes for access token expiration
        });
    }

    private async _generateRefreshToken(payload: any): Promise<string> {
        const refreshTokenExpiresInDays =
            this.configService.get<string>('JWT_REFRESH_EXPIRES_IN_DAYS') ||
            '7'; // Default to 7 days if not set

        return await this.jwtService.signAsync(payload, {
            secret: this.configService.get<string>('JWT_REFRESH_SECRET'), // Separate secret for refresh tokens
            expiresIn: `${refreshTokenExpiresInDays}d`, // Use days for refresh token expiration
        });
    }
}
