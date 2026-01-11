// src/modules/ai/ai.module.ts
import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { AiController } from './ai.controller.js';
import { AiService } from './ai.service.js';
import { AiClientService } from './ai-client.service.js';

@Module({
    imports: [
        // In-memory cache for 24 hours (86400 seconds)
        CacheModule.register({
            ttl: 86400,
        }),
    ],
    controllers: [AiController],
    providers: [AiService, AiClientService],
    exports: [AiService],
})
export class AiModule { }
