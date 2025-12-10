import { All, Controller, Req, Res } from "@nestjs/common";
import { auth } from "./auth.service.js";
import { toNodeHandler } from "better-auth/node";

@Controller("auth")
export class AuthController {
  @All("*")
  async handleAuth(@Req() req, @Res() res) {
    return toNodeHandler(auth)(req, res);
  }
}
