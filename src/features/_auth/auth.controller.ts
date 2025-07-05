import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '@shared/dto/login.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    async login(
        @Body() loginDto: LoginDto,
        @Res({ passthrough: true })
        response: Response,
    ) {
        return await this.authService.login(
            response,
            loginDto.email,
            loginDto.password,
        );
    }

    @Post('logout')
    async logout(@Res({ passthrough: true }) response: Response) {
        return await this.authService.logout(response);
    }
}
