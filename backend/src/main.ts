import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.use(cookieParser());

    app.enableCors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    });

    app.setGlobalPrefix('api/v1');

    await app.listen(process.env.PORT || 5000);
    console.log(`🚀 Server running on http://localhost:${process.env.PORT || 5000}`);
}
bootstrap();
