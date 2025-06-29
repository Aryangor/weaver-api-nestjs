import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './@shared/guards/jwt-auth.guard';
import { CONTROLLERS } from './_controllers';
import { PROVIDERS } from './_providers';
import { TypeOrmModule } from '@nestjs/typeorm';
import { fnDbConnection } from 'db-config';
import { User } from '@shared/entities/user.entity';

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot(fnDbConnection()), // Initialize TypeORM with the database configurations
        TypeOrmModule.forFeature([User]), // Register the User entity
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_ACCESS_SECRET'), // Ensure you have JWT_SECRET in your .env file
                signOptions: {
                    expiresIn: configService.get<string>(
                        'JWT_ACCESS_EXPIRES_IN',
                    ),
                }, // Token expiration time
            }),
        }),
    ],
    exports: [JwtModule, JwtAuthGuard],
    providers: PROVIDERS,
    controllers: CONTROLLERS,
})
export class AppModule {}
