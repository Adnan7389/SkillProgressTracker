import { Module } from "@nestjs/common";
import { InternalController } from "./internal.controller.js";
import { StreaksModule } from "../streaks/streaks.module.js";

@Module({
  imports: [StreaksModule],
  controllers: [InternalController],
})
export class InternalModule {}
