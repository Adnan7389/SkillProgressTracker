import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    UseGuards,
    Request,
} from "@nestjs/common";
import { ChallengesService } from "./challenges.service.js";
import { GenerateChallengeDto } from "./dto/generate-challenge.dto.js";
import { SubmitResponseDto } from "./dto/submit-response.dto.js";
import { AuthGuard } from "../../common/guards/auth.guard.js";
import { AuthenticatedRequest } from "../../common/interfaces/authenticated-request.interface.js";

@Controller("challenges")
@UseGuards(AuthGuard)
export class ChallengesController {
    constructor(private readonly challengesService: ChallengesService) { }

    @Post("generate")
    generate(
        @Request() req: AuthenticatedRequest,
        @Body() dto: GenerateChallengeDto,
    ) {
        return this.challengesService.generate(req.user.id, dto.chapterId);
    }

    @Get("chapter/:chapterId")
    findByChapter(
        @Request() req: AuthenticatedRequest,
        @Param("chapterId") chapterId: string,
    ) {
        return this.challengesService.findByChapter(req.user.id, chapterId);
    }

    @Get("history/:chapterId")
    getHistory(
        @Request() req: AuthenticatedRequest,
        @Param("chapterId") chapterId: string,
    ) {
        return this.challengesService.getHistory(req.user.id, chapterId);
    }

    @Post(":id/respond")
    submitResponse(
        @Request() req: AuthenticatedRequest,
        @Param("id") id: string,
        @Body() dto: SubmitResponseDto,
    ) {
        return this.challengesService.submitResponse(
            req.user.id,
            id,
            dto.response,
        );
    }
}
