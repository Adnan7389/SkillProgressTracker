import { Controller, Post, UseGuards, Logger } from "@nestjs/common";
import { StreaksService } from "../streaks/streaks.service.js";
import { CronSecretGuard } from "./cron-secret.guard.js";

@Controller("internal")
@UseGuards(CronSecretGuard)
export class InternalController {
  private readonly logger = new Logger(InternalController.name);

  constructor(private readonly streaksService: StreaksService) {}

  @Post("run-reminders")
  async runReminders() {
    this.logger.log("External trigger: run-reminders");
    const data = await this.streaksService.sendStreakReminders();
    return {
      success: true,
      timestamp: new Date().toISOString(),
      data,
    };
  }

  @Post("reset-streaks")
  async resetStreaks() {
    this.logger.log("External trigger: reset-streaks");
    const data = await this.streaksService.handleStreakResets();
    return {
      success: true,
      timestamp: new Date().toISOString(),
      data,
    };
  }
}
