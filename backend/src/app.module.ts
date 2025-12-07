import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller.js';
import { AuthModule } from './auth/auth.module.js';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        // Only connect to MongoDB if MONGO_URI is provided
        ...(process.env.MONGO_URI
            ? [MongooseModule.forRoot(process.env.MONGO_URI)]
            : []
        ),
        AuthModule,
    ],
    controllers: [AppController],
})
export class AppModule { }
