import { Controller, Get, UseGuards, Request } from "@nestjs/common";
import { AuthGuard } from "../common/guards/auth.guard.js";

@Controller("test")
export class TestController {
  @Get("public")
  getPublic() {
    return { message: "This is public" };
  }

  @Get("protected")
  @UseGuards(AuthGuard)
  getProtected(@Request() req) {
    return {
      message: "This is protected",
      user: req.user,
    };
  }
}
