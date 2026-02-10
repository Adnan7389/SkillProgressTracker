// src/modules/ai/ai.controller.ts
import { Controller, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '../../common/guards/auth.guard.js';
import { AiService } from './ai.service.js';
import { ResourceDiscoveryService } from './resource-discovery.service.js';
import { GetRecommendationDto } from './dto/get-recommendation.dto.js';
import { GenerateRoadmapDto } from './dto/generate-roadmap.dto.js';
import { AuthenticatedRequest } from '../../common/interfaces/authenticated-request.interface.js';
import { ChaptersService } from '../chapters/chapters.service.js';
import { LearningPathsService } from '../learning-paths/learning-paths.service.js';

@Controller('ai')
@UseGuards(AuthGuard)
export class AiController {
    constructor(
        private readonly aiService: AiService,
        private readonly resourceDiscoveryService: ResourceDiscoveryService,
        private readonly chaptersService: ChaptersService,
        private readonly learningPathsService: LearningPathsService,
    ) { }

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

    @Post('discover-resources/:chapterId')
    async discoverResources(
        @Request() req: AuthenticatedRequest,
        @Param('chapterId') chapterId: string,
    ) {
        const chapter = await this.chaptersService.findOne(chapterId, req.user.id);
        const path = await this.learningPathsService.findOne(
            chapter.learningPathId.toString(),
            req.user.id,
        );

        // Fire-and-forget: start discovery in background, return immediately
        this.resourceDiscoveryService
            .discoverForChapter(chapterId, req.user.id, chapter.title, path.name, path.skillLevel)
            .catch(() => { /* errors are handled internally */ });

        return { message: 'Resource discovery started', chapterId };
    }

    @Post('refresh-resources/:chapterId')
    async refreshResources(
        @Request() req: AuthenticatedRequest,
        @Param('chapterId') chapterId: string,
    ) {
        // Reset status to pending first
        await this.chaptersService.updateResources(chapterId, req.user.id, [], 'pending');

        const chapter = await this.chaptersService.findOne(chapterId, req.user.id);
        const path = await this.learningPathsService.findOne(
            chapter.learningPathId.toString(),
            req.user.id,
        );

        // Fire-and-forget
        this.resourceDiscoveryService
            .discoverForChapter(chapterId, req.user.id, chapter.title, path.name, path.skillLevel)
            .catch(() => { /* errors are handled internally */ });

        return { message: 'Resource refresh started', chapterId };
    }
}

