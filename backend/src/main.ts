import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module.js";
import { ValidationPipe } from "@nestjs/common";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { mongoClient, auth } from "./auth/auth.service.js";

import { toNodeHandler } from "better-auth/node";

async function bootstrap() {
  // Connect to MongoDB first
  await mongoClient.connect();
  console.log("✅ MongoDB connected");

  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  // Security: HTTP header protection
  app.use(helmet());

  // Security: Global rate limit (100 requests per 15 minutes per IP)
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      standardHeaders: true,
      legacyHeaders: false,
      message: { message: "Too many requests, please try again later.", statusCode: 429 },
    }),
  );

  // Security: Strict rate limit for AI endpoints (5 requests per 15 minutes per IP)
  app.use(
    "/api/v1/ai",
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 5,
      standardHeaders: true,
      legacyHeaders: false,
      message: { message: "AI rate limit exceeded. Please wait before generating again.", statusCode: 429 },
    }),
  );

  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  });

  // Mount Better Auth handler
  app.getHttpAdapter().getInstance().use("/api/auth/*", toNodeHandler(auth));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix("api/v1");

  await app.listen(process.env.PORT || 5000);
  console.log(
    `🚀 Server running on http://localhost:${process.env.PORT || 5000}`,
  );

  // Graceful shutdown
  process.on("SIGTERM", async () => {
    console.log("🔄 SIGTERM received, closing connections...");
    await mongoClient.close();
    await app.close();
    console.log("✅ Application closed gracefully");
  });
}
bootstrap();
