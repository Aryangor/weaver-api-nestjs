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

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        @InjectRepository(User) // Assuming 'core' is your core database connection name
        private readonly userRepository: Repository<User>,
        private readonly configService: ConfigService,
    ) {}
    async login(
        res: Response,
        email: string,
        password: string,
    ): Promise<boolean> {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user?.password) {
            throw new UnauthorizedException(
                'User not found or password not set!',
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

        return await this.setResponseCookies(res, payload);
    }

    async setResponseCookies(res: Response, payload: any): Promise<boolean> {
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
