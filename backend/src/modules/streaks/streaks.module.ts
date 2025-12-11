// src/modules/streaks/streaks.module.ts
import { Module } from "@nestjs/common";
import { StreaksService } from "./streaks.service.js";

@Module({
  providers: [StreaksService],
  exports: [StreaksService], // Export the service
})
export class StreaksModule {}
