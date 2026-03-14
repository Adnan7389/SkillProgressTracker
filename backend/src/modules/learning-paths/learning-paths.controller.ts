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
import { LearningPathsService } from "./learning-paths.service.js";
import { CreateLearningPathDto } from "./dto/create-learning-path.dto.js";
import { UpdateLearningPathDto } from "./dto/update-learning-path.dto.js";
import { AuthGuard } from "../../common/guards/auth.guard.js";

import { AuthenticatedRequest } from "../../common/interfaces/authenticated-request.interface.js";

@ApiTags("Learning Paths")
@ApiBearerAuth()
@Controller("learning-paths")
@UseGuards(AuthGuard)
export class LearningPathsController {
  constructor(private readonly learningPathsService: LearningPathsService) {}

  @Post()
  @ApiOperation({ summary: "Create a new learning path manually" })
  @ApiResponse({ status: 201, description: "The learning path has been successfully created." })
  create(
    @Request() req: AuthenticatedRequest,
    @Body() createLearningPathDto: CreateLearningPathDto,
  ) {
    return this.learningPathsService.create(req.user.id, createLearningPathDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all learning paths for the current user" })
  @ApiResponse({ status: 200, description: "Returns an array of learning paths" })
  findAll(@Request() req: AuthenticatedRequest) {
    return this.learningPathsService.findAll(req.user.id);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a specific learning path by ID" })
  @ApiResponse({ status: 200, description: "Returns the learning path object" })
  @ApiResponse({ status: 404, description: "Learning path not found" })
  findOne(@Request() req: AuthenticatedRequest, @Param("id") id: string) {
    return this.learningPathsService.findOne(id, req.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a learning path" })
  @ApiResponse({ status: 200, description: "The learning path has been successfully updated" })
  update(
    @Request() req: AuthenticatedRequest,
    @Param("id") id: string,
    @Body() updateLearningPathDto: UpdateLearningPathDto,
  ) {
    return this.learningPathsService.update(
      id,
      req.user.id,
      updateLearningPathDto,
    );
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a learning path" })
  @ApiResponse({ status: 200, description: "The learning path has been successfully deleted" })
  remove(@Request() req: AuthenticatedRequest, @Param("id") id: string) {
    return this.learningPathsService.remove(id, req.user.id);
  }
}

