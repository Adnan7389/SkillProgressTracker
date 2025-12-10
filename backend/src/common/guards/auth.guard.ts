import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { auth } from "../../auth/auth.service.js";

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    try {
      const session = await auth.api.getSession({
        headers: request.headers,
      });

      if (!session) {
        throw new UnauthorizedException("No active session");
      }

      request.user = session.user;
      request.session = session.session;

      return true;
    } catch {
      throw new UnauthorizedException("Authentication failed");
    }
  }
}
