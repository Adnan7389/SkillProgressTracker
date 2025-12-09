import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Request,
} from '@nestjs/common';
import { LearningPathsService } from './learning-paths.service.js';
import { CreateLearningPathDto } from './dto/create-learning-path.dto.js';
import { UpdateLearningPathDto } from './dto/update-learning-path.dto.js';
import { AuthGuard } from '../../common/guards/auth.guard.js';

import { AuthenticatedRequest } from '../../common/interfaces/authenticated-request.interface.js';

@Controller('learning-paths')
@UseGuards(AuthGuard)
export class LearningPathsController {
    constructor(private readonly learningPathsService: LearningPathsService) { }

    @Post()
    create(@Request() req: AuthenticatedRequest, @Body() createLearningPathDto: CreateLearningPathDto) {
        return this.learningPathsService.create(req.user.id, createLearningPathDto);
    }

    @Get()
    findAll(@Request() req: AuthenticatedRequest) {
        return this.learningPathsService.findAll(req.user.id);
    }

    @Get(':id')
    findOne(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
        return this.learningPathsService.findOne(id, req.user.id);
    }

    @Patch(':id')
    update(@Request() req: AuthenticatedRequest, @Param('id') id: string, @Body() updateLearningPathDto: UpdateLearningPathDto) {
        return this.learningPathsService.update(id, req.user.id, updateLearningPathDto);
    }

    @Delete(':id')
    remove(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
        return this.learningPathsService.remove(id, req.user.id);
    }
}
