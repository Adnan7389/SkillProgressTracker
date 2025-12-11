// src/modules/chapters/chapters.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Chapter } from "./schemas/chapter.schema.js";
import { CreateChapterDto } from "./dto/create-chapter.dto.js";
import { UpdateChapterDto } from "./dto/update-chapter.dto.js";
import { AddNoteDto } from "./dto/add-note.dto.js";
import { LearningPathsService } from "../learning-paths/learning-paths.service.js";
import { StreaksService } from "../streaks/streaks.service.js";

@Injectable()
export class ChaptersService {
  constructor(
    @InjectModel(Chapter.name) private readonly chapterModel: Model<Chapter>,
    private readonly learningPathsService: LearningPathsService,
    private readonly streaksService: StreaksService,
  ) {}

  async create(
    userId: string,
    learningPathId: string,
    createDto: CreateChapterDto,
  ) {
    // Ensure user owns the learning path first
    await this.learningPathsService.findOne(learningPathId, userId);

    const chapter = new this.chapterModel({
      ...createDto,
      userId,
      learningPathId,
    });

    const savedChapter = await chapter.save();
    await this.updateLearningPathProgress(learningPathId);
    return savedChapter;
  }

  async findAllByPath(userId: string, learningPathId: string) {
    await this.learningPathsService.findOne(learningPathId, userId);
    return this.chapterModel
      .find({ learningPathId })
      .sort({ createdAt: 1 })
      .exec();
  }

  async findOne(id: string, userId: string) {
    const chapter = await this.chapterModel.findById(id).exec();
    if (!chapter) {
      throw new NotFoundException("Chapter not found");
    }
    if (chapter.userId.toString() !== userId) {
      throw new ForbiddenException("Access denied");
    }
    return chapter;
  }

  async update(id: string, userId: string, updateDto: UpdateChapterDto) {
    const chapter = await this.findOne(id, userId);
    Object.assign(chapter, updateDto);
    return chapter.save();
  }

  async remove(id: string, userId: string) {
    const chapter = await this.findOne(id, userId);
    await chapter.deleteOne();
    await this.updateLearningPathProgress(chapter.learningPathId.toString());
    return { message: "Chapter deleted successfully" };
  }

  async markComplete(id: string, userId: string, isCompleted: boolean) {
    const chapter = await this.findOne(id, userId);
    chapter.isCompleted = isCompleted;
    chapter.completionDate = isCompleted ? new Date() : null;

    if (isCompleted) {
      await this.streaksService.updateUserStreak(userId);
    }

    const savedChapter = await chapter.save();
    await this.updateLearningPathProgress(chapter.learningPathId.toString());
    return savedChapter;
  }

  async addNote(id: string, userId: string, addNoteDto: AddNoteDto) {
    const chapter = await this.findOne(id, userId);
    chapter.notes.push({ ...addNoteDto, createdAt: new Date() });
    return chapter.save();
  }

  private async updateLearningPathProgress(learningPathId: string) {
    const chapters = await this.chapterModel.find({ learningPathId }).exec();
    const completedCount = chapters.filter((c) => c.isCompleted).length;
    const progress =
      chapters.length > 0
        ? Math.round((completedCount / chapters.length) * 100)
        : 0;

    await this.learningPathsService.updateProgress(learningPathId, progress);
  }
}
