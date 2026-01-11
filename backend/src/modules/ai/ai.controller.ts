// src/modules/ai/ai.controller.ts
// Test endpoint for Day 10 implementation
import { Controller, Get } from '@nestjs/common';
import { AiClientService } from './ai-client.service.js';

@Controller('ai')
export class AiController {
    constructor(private readonly aiClientService: AiClientService) { }

    @Get('test')
    async testAi() {
        try {
            const response = await this.aiClientService.generateText(
                "Say 'Hello, World!' in a fun way."
            );
            return {
                success: true,
                message: response,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }
}
