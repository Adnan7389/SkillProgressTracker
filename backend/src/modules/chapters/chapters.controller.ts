// src/modules/chapters/chapters.controller.ts
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
} from "@nestjs/common";
import { ChaptersService } from "./chapters.service.js";
import { CreateChapterDto } from "./dto/create-chapter.dto.js";
import { UpdateChapterDto } from "./dto/update-chapter.dto.js";
import { AddNoteDto } from "./dto/add-note.dto.js";
import { AuthGuard } from "../../common/guards/auth.guard.js";
import { AuthenticatedRequest } from "../../common/interfaces/authenticated-request.interface.js";

@Controller("chapters")
@UseGuards(AuthGuard)
export class ChaptersController {
  constructor(private readonly chaptersService: ChaptersService) { }

  @Post("/in-path/:pathId")
  create(
    @Request() req: AuthenticatedRequest,
    @Param("pathId") pathId: string,
    @Body() createChapterDto: CreateChapterDto,
  ) {
    return this.chaptersService.create(req.user.id, pathId, createChapterDto);
  }

  @Get("/in-path/:pathId")
  findAllByPath(
    @Request() req: AuthenticatedRequest,
    @Param("pathId") pathId: string,
  ) {
    return this.chaptersService.findAllByPath(req.user.id, pathId);
  }

  @Get(":id")
  findOne(@Request() req: AuthenticatedRequest, @Param("id") id: string) {
    return this.chaptersService.findOne(id, req.user.id);
  }

  @Patch(":id")
  update(
    @Request() req: AuthenticatedRequest,
    @Param("id") id: string,
    @Body() updateChapterDto: UpdateChapterDto,
  ) {
    return this.chaptersService.update(id, req.user.id, updateChapterDto);
  }

  @Patch(":id/complete")
  markComplete(@Request() req: AuthenticatedRequest, @Param("id") id: string) {
    return this.chaptersService.markComplete(id, req.user.id, true);
  }

  @Patch(":id/incomplete")
  markIncomplete(
    @Request() req: AuthenticatedRequest,
    @Param("id") id: string,
  ) {
    return this.chaptersService.markComplete(id, req.user.id, false);
  }

  @Post(":id/notes")
  addNote(
    @Request() req: AuthenticatedRequest,
    @Param("id") id: string,
    @Body() addNoteDto: AddNoteDto,
  ) {
    return this.chaptersService.addNote(id, req.user.id, addNoteDto);
  }

  @Delete(":id")
  remove(@Request() req: AuthenticatedRequest, @Param("id") id: string) {
    return this.chaptersService.remove(id, req.user.id);
  }
}
