import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module.js";
import { ValidationPipe } from "@nestjs/common";
import cookieParser from "cookie-parser";
import { mongoClient, auth } from "./auth/auth.service.js";

import { toNodeHandler } from "better-auth/node";

async function bootstrap() {
  // Connect to MongoDB first
  await mongoClient.connect();
  console.log("✅ MongoDB connected");

  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

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
