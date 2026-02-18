import { Controller, Post, Get, Param, Body, UseGuards, Request } from "@nestjs/common";
import { AssessmentsService } from "./assessments.service.js";
import { GenerateAssessmentDto } from "./dto/generate-assessment.dto.js";
import { SubmitAssessmentDto } from "./dto/submit-assessment.dto.js";
import { AuthGuard } from "../../common/guards/auth.guard.js";

@Controller("assessments")
@UseGuards(AuthGuard)
export class AssessmentsController {
  constructor(private readonly assessmentsService: AssessmentsService) { }

  @Post("generate")
  async generateAssessment(@Request() req, @Body() dto: GenerateAssessmentDto) {
    const userId = req.user.id;
    return this.assessmentsService.generateAssessment(userId, dto);
  }

  @Post("submit")
  async submitAssessment(@Request() req, @Body() dto: SubmitAssessmentDto) {
    const userId = req.user.id;
    return this.assessmentsService.submitAssessment(userId, dto);
  }

  @Get("history/:chapterId")
  async getAttemptHistory(
    @Request() req,
    @Param("chapterId") chapterId: string,
  ) {
    const userId = req.user.id;
    return this.assessmentsService.getAttemptHistory(userId, chapterId);
  }
}
