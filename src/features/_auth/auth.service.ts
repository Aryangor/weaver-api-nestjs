// auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@entities/user.entity'; // Adjust the import path as necessary
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    // constructor(
    //     private readonly jwtService: JwtService,
    //     @InjectRepository(User, 'core') // Assuming 'core' is your core database connection name
    //     private readonly userRepository: Repository<User>,
    //     private readonly configService: ConfigService,
    // ) {}
    // async login(
    //     email: string,
    //     password: string,
    // ): Promise<{ accessToken: string; refreshToken: string }> {
    //     const user = await this.userRepository.findOne({ where: { email } });
    //     if (!user || !(await bcrypt.compare(password, user.password))) {
    //         throw new UnauthorizedException('Invalid credentials');
    //     }
    //     const payload = {
    //         sub: user.id,
    //         email: user.email,
    //         name: user.firstName,
    //         role: user.role,
    //     };
    //     const accessToken = await this.jwtService.signAsync(payload, {
    //         secret: this.configService.get<string>('JWT_SECRET'),
    //         expiresIn: '30m',
    //     });
    //     const refreshToken = await this.jwtService.signAsync(payload, {
    //         secret: this.configService.get<string>('JWT_REFRESH_SECRET'), // Separate secret for refresh tokens
    //         expiresIn: '7d',
    //     });
    //     // In a real-world scenario, you might want to store refresh tokens in a database
    //     // associated with the user for security and revocation purposes.
    //     return { accessToken, refreshToken };
    // }
    // async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    //     try {
    //         const payload = await this.jwtService.verifyAsync(refreshToken, {
    //             secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    //         });
    //         const user = await this.userRepository.findOne({
    //             where: { email: payload.email },
    //         });
    //         if (!user) {
    //             throw new UnauthorizedException('Invalid refresh token');
    //         }
    //         const newPayload = {
    //             sub: user.id,
    //             email: user.email,
    //             name: user.firstName,
    //             role: user.role,
    //         };
    //         const newAccessToken = await this.jwtService.signAsync(newPayload, {
    //             secret: this.configService.get<string>('JWT_SECRET'),
    //             expiresIn: '30m',
    //         });
    //         return { accessToken: newAccessToken };
    //     } catch (error) {
    //         throw new UnauthorizedException('Invalid refresh token');
    //     }
    // }
}
