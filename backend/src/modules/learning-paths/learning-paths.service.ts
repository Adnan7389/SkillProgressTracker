import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LearningPath } from './schemas/learning-path.schema.js';
import { CreateLearningPathDto } from './dto/create-learning-path.dto.js';
import { UpdateLearningPathDto } from './dto/update-learning-path.dto.js';

@Injectable()
export class LearningPathsService {
    constructor(
        @InjectModel(LearningPath.name)
        private learningPathModel: Model<LearningPath>,
    ) { }

    async create(userId: string, createDto: CreateLearningPathDto) {
        const learningPath = new this.learningPathModel({
            ...createDto,
            userId,
            progress: 0,
        });

        return learningPath.save();
    }

    async findAll(userId: string) {
        return this.learningPathModel
            .find({ userId })
            .sort({ createdAt: -1 })
            .exec();
    }

    async findOne(id: string, userId: string) {
        const learningPath = await this.learningPathModel.findById(id).exec();

        if (!learningPath) {
            throw new NotFoundException('Learning path not found');
        }

        // Check ownership
        // Note: userId is stored as ObjectId in schema, but passed as string here.
        // Mongoose handles casting in queries, but for strict equality check we might need conversion or toString()
        if (learningPath.userId.toString() !== userId) {
            throw new ForbiddenException('Access denied');
        }

        return learningPath;
    }

    async update(id: string, userId: string, updateDto: UpdateLearningPathDto) {
        const learningPath = await this.findOne(id, userId);

        Object.assign(learningPath, updateDto);
        return learningPath.save();
    }

    async remove(id: string, userId: string) {
        const learningPath = await this.findOne(id, userId);
        await learningPath.deleteOne();

        return { message: 'Learning path deleted successfully' };
    }

    async updateProgress(learningPathId: string, progress: number) {
        return this.learningPathModel
            .findByIdAndUpdate(learningPathId, { progress }, { new: true })
            .exec();
    }
}
