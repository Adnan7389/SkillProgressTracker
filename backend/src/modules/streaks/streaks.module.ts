// src/modules/streaks/streaks.module.ts
import { Module } from "@nestjs/common";
import { StreaksService } from "./streaks.service.js";
import { NotificationsModule } from "../notifications/notifications.module.js";

@Module({
  imports: [NotificationsModule],
  providers: [StreaksService],
  exports: [StreaksService], // Export the service
})
export class StreaksModule { }
