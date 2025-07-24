import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
    ChangePasswordDto,
    LoginDto,
    ResetPasswordDto,
} from 'src/features/_auth/dto/auth.dto';
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

    @Post('reset-password')
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        return await this.authService.resetPassword(resetPasswordDto.email);
    }

    @Post('change-password')
    async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
        return await this.authService.changePassword(
            changePasswordDto.token,
            changePasswordDto.password,
        );
    }

    @Post('logout')
    async logout(@Res({ passthrough: true }) response: Response) {
        return await this.authService.logout(response);
    }
}
