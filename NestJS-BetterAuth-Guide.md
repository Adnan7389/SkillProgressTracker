# NestJS + Better Auth Implementation Guide

> **Supplement to SkillProgressTracker-MVP.md**  
> This guide provides NestJS-specific implementations, Better Auth integration, and code examples.

---

## Table of Contents
1. [Better Auth Setup](#better-auth-setup)
2. [NestJS Project Structure](#nestjs-project-structure)
3. [NestJS Mongoose Schemas](#nestjs-mongoose-schemas)
4. [NestJS Modules Architecture](#nestjs-modules-architecture)
5. [Auth Guard Implementation](#auth-guard-implementation)
6. [Complete Code Examples](#complete-code-examples)
7. [Deployment Configuration](#deployment-configuration)

---

# Better Auth Setup

## Installation

```bash
npm install better-auth
npm install mongodb
```

## Configuration

### Step 1: Environment Variables

```bash
# .env
NODE_ENV=development
PORT=5000

# MongoDB
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/skill-tracker

# Better Auth
BETTER_AUTH_SECRET=your-secret-key-min-32-characters-here
BETTER_AUTH_URL=http://localhost:5000

# AI
GEMINI_API_KEY=your-gemini-key

# Frontend (for CORS)
FRONTEND_URL=http://localhost:5173
```

### Step 2: Create Better Auth Instance

```typescript
// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGO_URI!);

export const auth = betterAuth({
  database: mongodbAdapter(client),
  
  // Email & Password authentication
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Set true for production
    autoSignIn: true,
  },
  
  // Session configuration
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Update session every 24h
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  
  // Extend user model with app-specific fields
  user: {
    additionalFields: {
      learningStreak: {
        type: "number",
        defaultValue: 0,
        required: false,
      },
      lastActiveDate: {
        type: "string",
        defaultValue: () => new Date().toISOString().split('T')[0],
        required: false,
      },
    },
  },
  
  // Security
  advanced: {
    crossSubDomainCookies: {
      enabled: false, // Set true if frontend/backend on different subdomains
    },
    useSecureCookies: process.env.NODE_ENV === 'production',
  },
  
  // Base URL
  baseURL: process.env.BETTER_AUTH_URL!,
  secret: process.env.BETTER_AUTH_SECRET!,
});

// Export types for TypeScript
export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
```

### Step 3: Mount Better Auth in NestJS

```typescript
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { auth } from './lib/auth';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable cookie parsing
  app.use(cookieParser());
  
  // Enable CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  });
  
  // Mount Better Auth handler
  // This handles all /api/auth/* endpoints automatically
  app.use('/api/auth/*', (req, res) => auth.handler(req, res));
  
  // Global prefix for  your app routes
  app.setGlobalPrefix('api/v1');
  
  await app.listen(process.env.PORT || 5000);
  console.log(`🚀 Server running on http://localhost:${process.env.PORT || 5000}`);
}
bootstrap();
```

---

# NestJS Project Structure

```
backend/
├── src/
│   ├── lib/
│   │   └── auth.ts                    # Better Auth instance
│   ├── modules/
│   │   ├── learning-paths/
│   │   │   ├── dto/
│   │   │   │   ├── create-learning-path.dto.ts
│   │   │   │   └── update-learning-path.dto.ts
│   │   │   ├── schemas/
│   │   │   │   └── learning-path.schema.ts
│   │   │   ├── learning-paths.controller.ts
│   │   │   ├── learning-paths.service.ts
│   │   │   └── learning-paths.module.ts
│   │   ├── chapters/
│   │   │   ├── dto/
│   │   │   │   ├── create-chapter.dto.ts
│   │   │   │   ├── update-chapter.dto.ts
│   │   │   │   └── add-note.dto.ts
│   │   │   ├── schemas/
│   │   │   │   └── chapter.schema.ts
│   │   │   ├── chapters.controller.ts
│   │   │   ├── chapters.service.ts
│   │   │   └── chapters.module.ts
│   │   └── ai/
│   │       ├── ai.controller.ts
│   │       ├── ai.service.ts
│   │       ├── ai-client.service.ts
│   │       └── ai.module.ts
│   ├── common/
│   │   ├── guards/
│   │   │   └── auth.guard.ts          # Better Auth guard
│   │   ├── decorators/
│   │   │   └── current-user.decorator.ts
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   └── interceptors/
│   │       └── request-id.interceptor.ts
│   ├── config/
│   │   ├── configuration.ts
│   │   └── validation.schema.ts
│   ├── app.module.ts
│   ├── app.controller.ts
│   ├── app.service.ts
│   └── main.ts
├── test/
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── .env.example
├── .eslintrc.js
├── .prettierrc
├── nest-cli.json
├── package.json
├── tsconfig.json
└── tsconfig.build.json
```

---

# NestJS Mongoose Schemas

## Learning Path Schema (NestJS Style)

```typescript
// src/modules/learning-paths/schemas/learning-path.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class LearningPath extends Document {
  @Prop({ type: String, required: true })
  userId: string; // Better Auth user ID

  @Prop({ required: true, trim: true, maxlength: 100 })
  name: string;

  @Prop({ trim: true, maxlength: 500, default: '' })
  description: string;

  @Prop({ 
    enum: ['beginner', 'intermediate', 'advanced'], 
    required: true 
  })
  skillLevel: string;

  @Prop({ default: 0, min: 0, max: 100 })
  progress: number;
}

export const LearningPathSchema = SchemaFactory.createForClass(LearningPath);

// Add indexes
LearningPathSchema.index({ userId: 1, createdAt: -1 });
```

## Chapter Schema (NestJS Style)

```typescript
// src/modules/chapters/schemas/chapter.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// Note subdocument (embedded)
@Schema({ _id: false })
export class Note {
  @Prop({ required: true, maxlength: 1000 })
  text: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const NoteSchema = SchemaFactory.createForClass(Note);

// Chapter document
@Schema({ timestamps: true })
export class Chapter extends Document {
  @Prop({ type: Types.ObjectId, ref: 'LearningPath', required: true })
  learningPathId: Types.ObjectId;

  @Prop({ type: String, required: true })
  userId: string; // Better Auth user ID

  @Prop({ required: true, trim: true, maxlength: 200 })
  title: string;

  @Prop({ trim: true, maxlength: 1000, default: '' })
  description: string;

  @Prop({ 
    enum: ['easy', 'medium', 'hard'], 
    default: 'medium' 
  })
  difficulty: string;

  @Prop({ min: 5, max: 300, default: 30 })
  estimatedMinutes: number;

  @Prop({ default: false })
  isCompleted: boolean;

  @Prop({ default: null })
  completionDate: Date;

  @Prop({ type: [NoteSchema], default: [] })
  notes: Note[];
}

export const ChapterSchema = SchemaFactory.createForClass(Chapter);

// Add indexes
ChapterSchema.index({ learningPathId: 1, createdAt: 1 });
ChapterSchema.index({ userId: 1, isCompleted: 1 });
ChapterSchema.index({ userId: 1, completionDate: -1 });
```

---

# NestJS Modules Architecture

## Learning Paths Module

```typescript
// src/modules/learning-paths/learning-paths.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LearningPathsController } from './learning-paths.controller';
import { LearningPathsService } from './learning-paths.service';
import { LearningPath, LearningPathSchema } from './schemas/learning-path.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LearningPath.name, schema: LearningPathSchema }
    ]),
  ],
  controllers: [LearningPathsController],
  providers: [LearningPathsService],
  exports: [LearningPathsService], // Export if used by other modules
})
export class LearningPathsModule {}
```

## DTOs (Data Transfer Objects)

```typescript
// src/modules/learning-paths/dto/create-learning-path.dto.ts
import { IsString, IsEnum, IsOptional, MaxLength, MinLength } from 'class-validator';

export class CreateLearningPathDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @IsEnum(['beginner', 'intermediate', 'advanced'])
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
}
```

```typescript
// src/modules/learning-paths/dto/update-learning-path.dto.ts
import { IsString, IsEnum, IsOptional, MaxLength, MinLength } from 'class-validator';

export class UpdateLearningPathDto {
  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(100)
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @IsEnum(['beginner', 'intermediate', 'advanced'])
  @IsOptional()
  skillLevel?: 'beginner' | 'intermediate' | 'advanced';
}
```

## Controller

```typescript
// src/modules/learning-paths/learning-paths.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '../../common/guards/auth.guard';
import { LearningPathsService } from './learning-paths.service';
import { CreateLearningPathDto } from './dto/create-learning-path.dto';
import { UpdateLearningPathDto } from './dto/update-learning-path.dto';

@Controller('learning-paths')
@UseGuards(AuthGuard) // Protect all routes
export class LearningPathsController {
  constructor(private readonly learningPathsService: LearningPathsService) {}

  @Post()
  async create(@Request() req, @Body() createDto: CreateLearningPathDto) {
    const userId = req.user.id;
    return this.learningPathsService.create(userId, createDto);
  }

  @Get()
  async findAll(@Request() req) {
    const userId = req.user.id;
    return this.learningPathsService.findAll(userId);
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    const userId = req.user.id;
    return this.learningPathsService.findOne(id, userId);
  }

  @Patch(':id')
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateDto: UpdateLearningPathDto,
  ) {
    const userId = req.user.id;
    return this.learningPathsService.update(id, userId, updateDto);
  }

  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    const userId = req.user.id;
    return this.learningPathsService.remove(id, userId);
  }
}
```

## Service

```typescript
// src/modules/learning-paths/learning-paths.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LearningPath } from './schemas/learning-path.schema';
import { CreateLearningPathDto } from './dto/create-learning-path.dto';
import { UpdateLearningPathDto } from './dto/update-learning-path.dto';

@Injectable()
export class LearningPathsService {
  constructor(
    @InjectModel(LearningPath.name)
    private learningPathModel: Model<LearningPath>,
  ) {}

  async create(userId: string, createDto: CreateLearningPathDto) {
    const learningPath = new this.learningPathModel({
      ...createDto,
      userId,
      progress: 0,
    });
    
    return learningPath.save();
  }

  async findAll(userId: string) {
    return this.learningPathModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string, userId: string) {
    const learningPath = await this.learningPathModel.findById(id).exec();
    
    if (!learningPath) {
      throw new NotFoundException('Learning path not found');
    }
    
    if (learningPath.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }
    
    return learningPath;
  }

  async update(id: string, userId: string, updateDto: UpdateLearningPathDto) {
    const learningPath = await this.findOne(id, userId);
    
    Object.assign(learningPath, updateDto);
    return learningPath.save();
  }

  async remove(id: string, userId: string) {
    const learningPath = await this.findOne(id, userId);
    await learningPath.deleteOne();
    
    return { message: 'Learning path deleted successfully' };
  }

  async updateProgress(learningPathId: string, progress: number) {
    return this.learningPathModel
      .findByIdAndUpdate(learningPathId, { progress }, { new: true })
      .exec();
  }
}
```

---

# Auth Guard Implementation

## Better Auth Guard

```typescript
// src/common/guards/auth.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { auth } from '../../lib/auth';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    try {
      // Get session from Better Auth
      const session = await auth.api.getSession({
        headers: request.headers,
      });
      
      if (!session) {
        throw new UnauthorizedException('No active session');
      }
      
      // Attach user to request
      request.user = session.user;
      request.session = session.session;
      
      return true;
    } catch (error) {
      throw new UnauthorizedException('Authentication failed');
    }
  }
}
```

## Current User Decorator

```typescript
// src/common/decorators/current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

// Usage in controller:
// @Get('profile')
// async getProfile(@CurrentUser() user: User) {
//   return user;
// }
```

---

# Complete Code Examples

## App Module Configuration

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { LearningPathsModule } from './modules/learning-paths/learning-paths.module';
import { ChaptersModule } from './modules/chapters/chapters.module';
import { AiModule } from './modules/ai/ai.module';
import configuration from './config/configuration';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    
    // MongoDB
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
      }),
      inject: [ConfigService],
    }),
    
    // Feature modules
    LearningPathsModule,
    ChaptersModule,
    AiModule,
  ],
})
export class AppModule {}
```

## Configuration File

```typescript
// src/config/configuration.ts
export default () => ({
  port: parseInt(process.env.PORT, 10) || 5000,
  database: {
    uri: process.env.MONGO_URI,
  },
  betterAuth: {
    secret: process.env.BETTER_AUTH_SECRET,
    url: process.env.BETTER_AUTH_URL,
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
  },
  frontend: {
    url: process.env.FRONTEND_URL,
  },
});
```

## Global Exception Filter

```typescript
// src/common/filters/http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    response.status(status).json({
      error: {
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message,
      },
    });
  }
}

// Apply globally in main.ts:
// app.useGlobalFilters(new HttpExceptionFilter());
```

---

# Deployment Configuration

## Railway Deployment

### Step 1: Create `railway.json`

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm run build"
  },
  "deploy": {
    "startCommand": "npm run start:prod",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### Step 2: Update `package.json` Scripts

```json
{
  "scripts": {
    "build": "nest build",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main"
  }
}
```

### Step 3: Environment Variables on Railway

Add these in Railway dashboard:
- `MONGO_URI`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL` (your Railway URL)
- `GEMINI_API_KEY`
- `FRONTEND_URL` (your Vercel URL)
- `NODE_ENV=production`

---

# Frontend Integration with Better Auth

## Install Better Auth React

```bash
cd frontend
npm install better-auth
```

## Create Auth Client

```typescript
// src/lib/auth-client.ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL, // http://localhost:5000
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
} = authClient;
```

## Auth Context (Optional)

```typescript
// src/context/AuthContext.tsx
import { createContext, useContext } from 'react';
import { useSession } from '../lib/auth-client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { data: session, isPending } = useSession();
  
  return (
    <AuthContext.Provider value={{ session, isPending }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

## Login Component Example

```typescript
// src/pages/Login.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn } from '../lib/auth-client';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await signIn.email({
        email,
        password,
      }, {
        onSuccess: () => {
          navigate('/dashboard');
        },
        onError: (ctx) => {
          setError(ctx.error.message);
        },
      });
    } catch (err) {
      setError('Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      {error && <p>{error}</p>}
      <button type="submit">Login</button>
    </form>
  );
}
```

## Protected Route

```typescript
// src/components/PrivateRoute.tsx
import { Navigate } from 'react-router-dom';
import { useSession } from '../lib/auth-client';

export function PrivateRoute({ children }) {
  const { data: session, isPending } = useSession();
  
  if (isPending) {
    return <div>Loading...</div>;
  }
  
  if (!session) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}
```

---

# Testing

## E2E Test Example

```typescript
// test/learning-paths.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('LearningPathsController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/learning-paths (POST)', () => {
    return request(app.getHttpServer())
      .post('/learning-paths')
      .send({
        name: 'Test Path',
        skillLevel: 'beginner',
      })
      .expect(201);
  });

  afterAll(async () => {
    await app.close();
  });
});
```

---

# Summary

This guide provides:

✅ Complete Better Auth setup with NestJS  
✅ NestJS Mongoose schemas with decorators  
✅ Modular architecture following NestJS best practices  
✅ Auth guards using Better Auth sessions  
✅ DTOs with validation  
✅ Service layer with MongoDB operations  
✅ Frontend integration examples  
✅ Deployment configuration for Railway  

**Next Steps**:
1. Follow the main `SkillProgressTracker-MVP.md` for overall architecture
2. Use this guide for NestJS + Better Auth specific implementations
3. Start with Phase 1: Setup NestJS project and Better Auth
4. Build modules incrementally (Learning Paths → Chapters → AI)

Happy coding! 🚀
