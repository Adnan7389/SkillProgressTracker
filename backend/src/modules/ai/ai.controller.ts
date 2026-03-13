import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { AuthGuard } from "../../common/guards/auth.guard.js";
import { AiService } from "./ai.service.js";
import { ResourceDiscoveryService } from "./resource-discovery.service.js";
import { GetRecommendationDto } from "./dto/get-recommendation.dto.js";
import { GenerateRoadmapDto } from "./dto/generate-roadmap.dto.js";
import { AuthenticatedRequest } from "../../common/interfaces/authenticated-request.interface.js";
import { ChaptersService } from "../chapters/chapters.service.js";
import { LearningPathsService } from "../learning-paths/learning-paths.service.js";

@ApiTags("AI")
@ApiBearerAuth()
@Controller("ai")
@UseGuards(AuthGuard)
export class AiController {
  constructor(
    private readonly aiService: AiService,
    private readonly resourceDiscoveryService: ResourceDiscoveryService,
    private readonly chaptersService: ChaptersService,
    private readonly learningPathsService: LearningPathsService,
  ) { }

  @Post("recommend")
  @ApiOperation({ summary: "Get a study recommendation for a learning path" })
  @ApiResponse({ status: 200, description: "Returns an AI-generated study recommendation" })
  getRecommendation(
    @Request() req: AuthenticatedRequest,
    @Body() getRecommendationDto: GetRecommendationDto,
  ) {
    return this.aiService.getRecommendation(
      req.user.id,
      getRecommendationDto.learningPathId,
    );
  }

  @Post("generate-roadmap")
  @ApiOperation({ summary: "Queue a new AI roadmap generation" })
  @ApiResponse({ status: 202, description: "Job queued successfully, returns jobId" })
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

  @Get("job-status/:jobId")
  @ApiOperation({ summary: "Get the status of a background AI job" })
  @ApiResponse({ status: 200, description: "Returns the current status and progress of the job" })
  getJobStatus(@Param("jobId") jobId: string) {
    return this.aiService.getJobStatus(jobId);
  }

  @Post("discover-resources/:chapterId")
  @ApiOperation({ summary: "Start background resource discovery for a chapter" })
  @ApiResponse({ status: 202, description: "Discovery process started" })
  async discoverResources(
    @Request() req: AuthenticatedRequest,
    @Param("chapterId") chapterId: string,
  ) {
    const chapter = await this.chaptersService.findOne(chapterId, req.user.id);
    const path = await this.learningPathsService.findOne(
      chapter.learningPathId.toString(),
      req.user.id,
    );

    // Fire-and-forget: start discovery in background, return immediately
    this.resourceDiscoveryService
      .discoverForChapter(
        chapterId,
        req.user.id,
        chapter.title,
        path.name,
        path.skillLevel,
      )
      .catch(() => {
        /* errors are handled internally */
      });

    return { message: "Resource discovery started", chapterId };
  }

  @Post("refresh-resources/:chapterId")
  @ApiOperation({ summary: "Refresh resources for a chapter (resets current resources)" })
  @ApiResponse({ status: 202, description: "Resource refresh started" })
  async refreshResources(
    @Request() req: AuthenticatedRequest,
    @Param("chapterId") chapterId: string,
  ) {
    // Reset status to pending first
    await this.chaptersService.updateResources(
      chapterId,
      req.user.id,
      [],
      "pending",
    );

    const chapter = await this.chaptersService.findOne(chapterId, req.user.id);
    const path = await this.learningPathsService.findOne(
      chapter.learningPathId.toString(),
      req.user.id,
    );

    // Fire-and-forget
    this.resourceDiscoveryService
      .discoverForChapter(
        chapterId,
        req.user.id,
        chapter.title,
        path.name,
        path.skillLevel,
      )
      .catch(() => {
        /* errors are handled internally */
      });

    return { message: "Resource refresh started", chapterId };
  }
}
