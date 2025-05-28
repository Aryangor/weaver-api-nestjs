// auth.controller.ts
import {
    Controller,
    Post,
    Body,
    HttpCode,
    HttpStatus,
    Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '@dtos/login.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    // @Post('login')
    // @HttpCode(HttpStatus.OK)
    // async login(
    //     @Body() loginDto: LoginDto,
    //     @Res({ passthrough: true }) res: Response,
    // ) {
    //     const { accessToken, refreshToken } = await this.authService.login(
    //         loginDto.email,
    //         loginDto.password,
    //     );

    //     // Set refresh token as an HTTP-only cookie
    //     res.cookie('refreshToken', refreshToken, {
    //         httpOnly: true,
    //         maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    //         secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
    //         sameSite: 'strict', // Prevent CSRF attacks
    //         path: '/api/auth/refresh', // Only accessible by the refresh token endpoint
    //     });

    //     return { accessToken };
    // }
}
