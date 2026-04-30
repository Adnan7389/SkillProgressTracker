import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";

@Injectable()
export class CronSecretGuard implements CanActivate {
  private readonly logger = new Logger(CronSecretGuard.name);

  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const secret = request.headers["x-cron-secret"] as string;
    const expected = this.configService.get<string>("CRON_SECRET");
    const ip = request.ip || request.headers["x-forwarded-for"] || "unknown";

    this.logger.log(
      `[CronGuard] Incoming request → ${request.method} ${request.url} | IP: ${ip} | Secret present: ${!!secret}`,
    );

    if (!secret || secret !== expected) {
      this.logger.warn(
        `[CronGuard] ❌ Unauthorized — secret mismatch or missing | IP: ${ip}`,
      );
      throw new UnauthorizedException("Invalid or missing cron secret");
    }

    this.logger.log(`[CronGuard] ✅ Authorized | IP: ${ip}`);
    return true;
  }
}
