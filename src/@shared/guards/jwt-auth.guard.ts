/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// guards/jwt-auth.guard.ts
import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('Invalid authorization header');
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            throw new UnauthorizedException('No JWT token found');
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get<string>('JWT_SECRET'), // Ensure you have JWT_SECRET in your .env file
            });
            // Attach the user payload to the request object for use in controllers/services
            request['user'] = payload;
            return true; // Allow the request to proceed
        } catch (error) {
            throw new UnauthorizedException('Invalid JWT token');
        }
    }
}
