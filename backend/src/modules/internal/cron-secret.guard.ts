import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";

@Injectable()
export class CronSecretGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const secret = request.headers["x-cron-secret"] as string;
    const expected = this.configService.get<string>("CRON_SECRET");

    if (!secret || secret !== expected) {
      throw new UnauthorizedException("Invalid or missing cron secret");
    }

    return true;
  }
}
