// src/modules/ai/ai.controller.ts
import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '../../common/guards/auth.guard.js';
import { AiService } from './ai.service.js';
import { GetRecommendationDto } from './dto/get-recommendation.dto.js';
import { GenerateRoadmapDto } from './dto/generate-roadmap.dto.js';
import { AuthenticatedRequest } from '../../common/interfaces/authenticated-request.interface.js';

@Controller('ai')
@UseGuards(AuthGuard)
export class AiController {
    constructor(private readonly aiService: AiService) { }

    @Post('recommend')
    getRecommendation(
        @Request() req: AuthenticatedRequest,
        @Body() getRecommendationDto: GetRecommendationDto,
    ) {
        return this.aiService.getRecommendation(
            req.user.id,
            getRecommendationDto.learningPathId,
        );
    }

    @Post('generate-roadmap')
    generateRoadmap(
        @Request() req: AuthenticatedRequest,
        @Body() generateRoadmapDto: GenerateRoadmapDto,
    ) {
        return this.aiService.generateRoadmap(
            req.user.id,
            generateRoadmapDto.topic,
            generateRoadmapDto.skillLevel,
        );
    }
}
