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

@Controller('learning-paths')
@UseGuards(AuthGuard)
export class LearningPathsController {
    constructor(private readonly learningPathsService: LearningPathsService) { }

    @Post()
    create(@Request() req, @Body() createLearningPathDto: CreateLearningPathDto) {
        // req.user.id from AuthGuard
        return this.learningPathsService.create(req.user.id, createLearningPathDto);
    }

    @Get()
    findAll(@Request() req) {
        return this.learningPathsService.findAll(req.user.id);
    }

    @Get(':id')
    findOne(@Request() req, @Param('id') id: string) {
        return this.learningPathsService.findOne(id, req.user.id);
    }

    @Patch(':id')
    update(@Request() req, @Param('id') id: string, @Body() updateLearningPathDto: UpdateLearningPathDto) {
        return this.learningPathsService.update(id, req.user.id, updateLearningPathDto);
    }

    @Delete(':id')
    remove(@Request() req, @Param('id') id: string) {
        return this.learningPathsService.remove(id, req.user.id);
    }
}
