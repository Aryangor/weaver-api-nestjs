import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Validate every single request that comes into the app
    app.useGlobalPipes(new ValidationPipe());

    // Parse cookies from incoming requests
    app.use(cookieParser());

    await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
