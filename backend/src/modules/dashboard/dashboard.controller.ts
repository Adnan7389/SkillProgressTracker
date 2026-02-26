import { Controller, Get, UseGuards } from "@nestjs/common";
import { DashboardService } from "./dashboard.service.js";
import { AuthGuard } from "../../common/guards/auth.guard.js";
import { CurrentUser } from "../../common/decorators/current-user.decorator.js";

@Controller("dashboard")
@UseGuards(AuthGuard)
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) { }

    @Get("stats")
    async getStats(@CurrentUser("id") userId: string) {
        return this.dashboardService.getStats(userId);
    }
}
