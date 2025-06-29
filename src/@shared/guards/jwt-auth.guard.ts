import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from 'src/features/_auth/auth.service';
import { TJwtPayload } from '@shared/models/jwt';
import { Request, Response } from 'express';

type TCookie = {
    accessToken?: string;
    refreshToken?: string;
};

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly authService: AuthService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const response = context.switchToHttp().getResponse<Response>();

        // Get tokens from cookies
        const cookies: TCookie = request.cookies || {};
        const accessToken = cookies.accessToken;
        const refreshToken = cookies.refreshToken;

        if (accessToken) {
            try {
                const payload = await this.jwtService.verifyAsync(accessToken, {
                    secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
                });

                request['user'] = payload;

                return true;
            } catch (error) {
                // Access token invalid, will try refresh token below
            }
        }

        // Try refresh token if access token is invalid or missing
        if (refreshToken) {
            try {
                const refreshPayload: TJwtPayload =
                    await this.jwtService.verifyAsync(refreshToken, {
                        secret: this.configService.get<string>(
                            'JWT_REFRESH_SECRET',
                        ),
                    });

                const payload: TJwtPayload = {
                    sub: refreshPayload.sub,
                    email: refreshPayload.email,
                    first_name: refreshPayload.first_name,
                    last_name: refreshPayload.last_name,
                    is_active: refreshPayload.is_active,
                };

                request['user'] = payload;

                return await this.authService.setResponseCookies(
                    response,
                    payload,
                );
            } catch (error) {
                // Refresh token invalid
                throw new UnauthorizedException('Invalid JWT refresh token');
            }
        }

        throw new UnauthorizedException('No valid JWT token found in cookies');
    }
}
