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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { ChaptersService } from "./chapters.service.js";
import { CreateChapterDto } from "./dto/create-chapter.dto.js";
import { UpdateChapterDto } from "./dto/update-chapter.dto.js";
import { AddNoteDto } from "./dto/add-note.dto.js";
import { AuthGuard } from "../../common/guards/auth.guard.js";
import { AuthenticatedRequest } from "../../common/interfaces/authenticated-request.interface.js";

@ApiTags("Chapters")
@ApiBearerAuth()
@Controller("chapters")
@UseGuards(AuthGuard)
export class ChaptersController {
  constructor(private readonly chaptersService: ChaptersService) {}

  @Post("/in-path/:pathId")
  @ApiOperation({ summary: "Create a new chapter within a learning path" })
  @ApiResponse({ status: 201, description: "The chapter has been successfully created." })
  create(
    @Request() req: AuthenticatedRequest,
    @Param("pathId") pathId: string,
    @Body() createChapterDto: CreateChapterDto,
  ) {
    return this.chaptersService.create(req.user.id, pathId, createChapterDto);
  }

  @Get("/in-path/:pathId")
  @ApiOperation({ summary: "Get all chapters for a specific learning path" })
  @ApiResponse({ status: 200, description: "Returns an array of chapters" })
  findAllByPath(
    @Request() req: AuthenticatedRequest,
    @Param("pathId") pathId: string,
  ) {
    return this.chaptersService.findAllByPath(req.user.id, pathId);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a specific chapter by ID" })
  @ApiResponse({ status: 200, description: "Returns the chapter object" })
  @ApiResponse({ status: 404, description: "Chapter not found" })
  findOne(@Request() req: AuthenticatedRequest, @Param("id") id: string) {
    return this.chaptersService.findOne(id, req.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a chapter's properties" })
  @ApiResponse({ status: 200, description: "The chapter has been successfully updated" })
  update(
    @Request() req: AuthenticatedRequest,
    @Param("id") id: string,
    @Body() updateChapterDto: UpdateChapterDto,
  ) {
    return this.chaptersService.update(id, req.user.id, updateChapterDto);
  }

  @Patch(":id/complete")
  @ApiOperation({ summary: "Mark a chapter as completed" })
  @ApiResponse({ status: 200, description: "Chapter marked as complete" })
  markComplete(@Request() req: AuthenticatedRequest, @Param("id") id: string) {
    return this.chaptersService.markComplete(id, req.user.id, true);
  }

  @Patch(":id/incomplete")
  @ApiOperation({ summary: "Mark a chapter as incomplete" })
  @ApiResponse({ status: 200, description: "Chapter marked as incomplete" })
  markIncomplete(
    @Request() req: AuthenticatedRequest,
    @Param("id") id: string,
  ) {
    return this.chaptersService.markComplete(id, req.user.id, false);
  }

  @Post(":id/notes")
  @ApiOperation({ summary: "Add a personal note to a chapter" })
  @ApiResponse({ status: 201, description: "Note added successfully" })
  addNote(
    @Request() req: AuthenticatedRequest,
    @Param("id") id: string,
    @Body() addNoteDto: AddNoteDto,
  ) {
    return this.chaptersService.addNote(id, req.user.id, addNoteDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a chapter" })
  @ApiResponse({ status: 200, description: "The chapter has been successfully deleted" })
  remove(@Request() req: AuthenticatedRequest, @Param("id") id: string) {
    return this.chaptersService.remove(id, req.user.id);
  }
}

