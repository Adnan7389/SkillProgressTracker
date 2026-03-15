import { Controller, Post, Get, Param, Body, UseGuards, Request } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { AssessmentsService } from "./assessments.service.js";
import { GenerateAssessmentDto } from "./dto/generate-assessment.dto.js";
import { SubmitAssessmentDto } from "./dto/submit-assessment.dto.js";
import { AuthGuard } from "../../common/guards/auth.guard.js";
import { AuthenticatedRequest } from "../../common/interfaces/authenticated-request.interface.js";

@ApiTags("Assessments")
@ApiBearerAuth()
@Controller("assessments")
@UseGuards(AuthGuard)
export class AssessmentsController {
  constructor(private readonly assessmentsService: AssessmentsService) { }

  @Post("generate")
  @ApiOperation({ summary: "Generate a new AI quiz for a chapter" })
  @ApiResponse({ status: 201, description: "Assessment generated successfully" })
  async generateAssessment(@Request() req: AuthenticatedRequest, @Body() dto: GenerateAssessmentDto) {
    const userId = req.user.id;
    return this.assessmentsService.generateAssessment(userId, dto);
  }

  @Post("submit")
  @ApiOperation({ summary: "Submit answers for an assessment" })
  @ApiResponse({ status: 201, description: "Assessment submitted and graded" })
  async submitAssessment(@Request() req: AuthenticatedRequest, @Body() dto: SubmitAssessmentDto) {
    const userId = req.user.id;
    return this.assessmentsService.submitAssessment(userId, dto);
  }

  @Get("history/:chapterId")
  @ApiOperation({ summary: "Get the history of quiz attempts for a chapter" })
  @ApiResponse({ status: 200, description: "Returns an array of past attempts" })
  async getAttemptHistory(
    @Request() req: AuthenticatedRequest,
    @Param("chapterId") chapterId: string,
  ) {
    const userId = req.user.id;
    return this.assessmentsService.getAttemptHistory(userId, chapterId);
  }
}

