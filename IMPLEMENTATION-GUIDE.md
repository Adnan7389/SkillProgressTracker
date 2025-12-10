# Day-by-Day Implementation Guide
# Skill Progress Tracker MVP

> **Duration**: 15 days (Part-time: 2-3 hours/day)  
> **Goal**: Fully functional MVP deployed to production

---

## 📋 Overview

This guide breaks down the entire project into **15 manageable days**. Each day includes:
- 📚 **What to Learn** (30-60 min)
- 💻 **What to Build** (1-2 hours)
- ✅ **Success Criteria** (How to know you're done)
- 🧪 **Testing** (How to verify it works)

---

## 🗓️ Week 1: Foundation & Authentication

### **Day 1: Environment Setup & MongoDB Basics**

#### 📚 What to Learn (1 hour)
- MongoDB Atlas setup
- MongoDB documents vs collections
- Basic CRUD operations
- Read: [MongoDB Basics](LEARNING-GUIDE.md#1️⃣-mongodb-fundamentals-what-you-need)

#### 💻 What to Build (1.5 hours)

**1. Create MongoDB Atlas Account**
```bash
# Go to: https://www.mongodb.com/cloud/atlas
# 1. Sign up (free)
# 2. Create free cluster (M0)
# 3. Create database user
# 4. Whitelist IP: 0.0.0.0/0 (for development)
# 5. Get connection string
```

**2. Test Connection**
```bash
# Install MongoDB Compass (GUI tool)
# Connect using your connection string
# Create database: skill-tracker
# Verify connection works
```

**3. Create Project Folder**
```bash
mkdir skill-tracker-project
cd skill-tracker-project
mkdir backend frontend
```

#### ✅ Success Criteria
- [ ] MongoDB Atlas cluster created
- [ ] Can connect via MongoDB Compass
- [ ] Database `skill-tracker` created
- [ ] Connection string saved in notes

#### 🧪 Testing
```bash
# In MongoDB Compass, try:
# 1. Create collection "test"
# 2. Insert document: { name: "test" }
# 3. Query: find({ name: "test" })
# If these work, you're good!
```

---

### **Day 2: NestJS Setup & Project Structure**

#### 📚 What to Learn (1 hour)
- What is NestJS and why use it
- NestJS modules, controllers, services
- Dependency injection basics
- Read: [NestJS First Steps](https://docs.nestjs.com/first-steps)

#### 💻 What to Build (1.5 hours)

**1. Install NestJS CLI**
```bash
npm install -g @nestjs/cli
nest --version  # Verify installation
```

**2. Create NestJS Project**
```bash
cd backend
nest new .
# Choose: npm
# Wait for installation...
```

**3. Install Dependencies**
```bash
npm install better-auth mongodb @nestjs/mongoose mongoose
npm install @nestjs/config class-validator class-transformer
npm install cookie-parser
npm install --save-dev @types/cookie-parser
```

**4. Test the Server**
```bash
npm run start:dev
# Open: http://localhost:3000
# Should see: "Hello World!"
```

**5. Configure Environment Variables**
```bash
# Create .env file
touch .env
```

Add to `.env`:
```env
NODE_ENV=development
PORT=5000

# Your MongoDB connection string from Day 1
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/skill-tracker

# Generate with: openssl rand -base64 32
BETTER_AUTH_SECRET=paste-generated-secret-here
BETTER_AUTH_URL=http://localhost:5000

# Get from: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your-key-here

FRONTEND_URL=http://localhost:5173
```

**6. Update `main.ts`**
```typescript
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.use(cookieParser());
  
  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  });
  
  app.setGlobalPrefix('api/v1');
  
  await app.listen(process.env.PORT || 5000);
  console.log(`🚀 Server running on http://localhost:${process.env.PORT || 5000}`);
}
bootstrap();
```

#### ✅ Success Criteria
- [ ] NestJS project created
- [ ] Dependencies installed
- [ ] `.env` configured
- [ ] Server runs on port 5000
- [ ] Can access `http://localhost:5000/api/v1`

#### 🧪 Testing
```bash
npm run start:dev
# Visit: http://localhost:5000/api/v1
# Should see "Hello World!"
```

---

### **Day 3: Better Auth Setup**

#### 📚 What to Learn (45 min)
- What is Better Auth
- How session-based authentication works
- Better Auth with MongoDB
- Read: [Better Auth Installation](https://www.better-auth.com/docs/installation)

#### 💻 What to Build (2 hours)

**1. Create lib folder**
```bash
mkdir src/lib
touch src/lib/auth.ts
```

**2. Setup Better Auth (`src/lib/auth.ts`)**
```typescript
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGO_URI!);

export const auth = betterAuth({
  database: mongodbAdapter(client),
  
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // For MVP
    autoSignIn: true,
  },
  
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Update daily
  },
  
  // Extend user model with app fields
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
  
  advanced: {
    useSecureCookies: process.env.NODE_ENV === 'production',
  },
  
  baseURL: process.env.BETTER_AUTH_URL!,
  secret: process.env.BETTER_AUTH_SECRET!,
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
```

**3. Mount Better Auth in `main.ts`**
```typescript
// Add this line BEFORE app.setGlobalPrefix
import { auth } from './lib/auth';

// Add this line AFTER cookieParser and CORS, BEFORE setGlobalPrefix
app.use('/api/auth/*', (req, res) => auth.handler(req, res));
```

**4. Update `app.module.ts`**
```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI!),
  ],
})
export class AppModule {}
```

#### ✅ Success Criteria
- [ ] Better Auth configured
- [ ] Server restarts without errors
- [ ] MongoDB shows new collections: `user`, `session`, `account`, `verification`

#### 🧪 Testing with Postman/Thunder Client

**Test 1: Register User**
```http
POST http://localhost:5000/api/auth/sign-up/email
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "SecurePass123!"
}

# Expected: 200 OK with user data
```

**Test 2: Login**
```http
POST http://localhost:5000/api/auth/sign-in/email
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "SecurePass123!"
}

# Expected: 200 OK with user data + cookie set
```

**Test 3: Get Session**
```http
GET http://localhost:5000/api/auth/session

# Expected: User session data (if logged in)
```

If all 3 tests pass, **authentication is working!** ✅

---

### **Day 4: Auth Guard & User Protection**

#### 📚 What to Learn (30 min)
- NestJS Guards
- How to protect routes
- Read: [NestJS Guards](https://docs.nestjs.com/guards)

#### 💻 What to Build (1.5 hours)

**1. Create Guards Folder**
```bash
mkdir -p src/common/guards
touch src/common/guards/auth.guard.ts
```

**2. Create Auth Guard**
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
      const session = await auth.api.getSession({
        headers: request.headers,
      });
      
      if (!session) {
        throw new UnauthorizedException('No active session');
      }
      
      request.user = session.user;
      request.session = session.session;
      
      return true;
    } catch (error) {
      throw new UnauthorizedException('Authentication failed');
    }
  }
}
```

**3. Create Test Controller**
```bash
nest g controller test --no-spec
```

**4. Add Protected Route**
```typescript
// src/test/test.controller.ts
import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth.guard';

@Controller('test')
export class TestController {
  @Get('public')
  getPublic() {
    return { message: 'This is public' };
  }

  @Get('protected')
  @UseGuards(AuthGuard)
  getProtected(@Request() req) {
    return {
      message: 'This is protected',
      user: req.user,
    };
  }
}
```

#### ✅ Success Criteria
- [ ] Auth guard created
- [ ] Can access public route
- [ ] Protected route requires authentication
- [ ] Protected route returns user data when authenticated

#### 🧪 Testing

**Test 1: Public Route (No Auth)**
```http
GET http://localhost:5000/api/v1/test/public

# Expected: 200 OK
```

**Test 2: Protected Route (No Auth)**
```http
GET http://localhost:5000/api/v1/test/protected

# Expected: 401 Unauthorized
```

**Test 3: Protected Route (With Auth)**
```http
# First, login to get cookie
POST http://localhost:5000/api/auth/sign-in/email
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "SecurePass123!"
}

# Then access protected route (cookie auto-sent)
GET http://localhost:5000/api/v1/test/protected

# Expected: 200 OK with user data
```

---

### **Day 5: Learning Paths Module - Part 1**

#### 📚 What to Learn (45 min)
- NestJS modules structure
- Mongoose schemas with decorators
- DTOs and validation
- Read: [NestJS Mongoose](https://docs.nestjs.com/techniques/mongodb)

#### 💻 What to Build (2 hours)

**1. Generate Learning Paths Module**
```bash
nest g module modules/learning-paths
nest g controller modules/learning-paths --no-spec
nest g service modules/learning-paths --no-spec
```

**2. Create Schema**
```bash
mkdir src/modules/learning-paths/schemas
touch src/modules/learning-paths/schemas/learning-path.schema.ts
```

```typescript
// src/modules/learning-paths/schemas/learning-path.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class LearningPath extends Document {
  @Prop({ type: String, required: true })
  userId: string;

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

// Add index
LearningPathSchema.index({ userId: 1, createdAt: -1 });
```

**3. Create DTOs**
```bash
mkdir src/modules/learning-paths/dto
touch src/modules/learning-paths/dto/create-learning-path.dto.ts
touch src/modules/learning-paths/dto/update-learning-path.dto.ts
```

```typescript
// create-learning-path.dto.ts
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
// update-learning-path.dto.ts
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

**4. Update Module**
```typescript
// learning-paths.module.ts
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
  exports: [LearningPathsService],
})
export class LearningPathsModule {}
```

#### ✅ Success Criteria
- [ ] Learning paths module created
- [ ] Schema defined
- [ ] DTOs created with validation
- [ ] Module configured

#### 🧪 Testing
```bash
npm run start:dev
# Should compile without errors
```

---

### **Day 6: Learning Paths Module - Part 2 (CRUD)**

#### 📚 What to Learn (30 min)
- NestJS controllers and routing
- Service layer pattern
- Read: [NestJS Controllers](https://docs.nestjs.com/controllers)

#### 💻 What to Build (2 hours)

**1. Implement Service**
```typescript
// learning-paths.service.ts
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

**2. Implement Controller**
```typescript
// learning-paths.controller.ts
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
@UseGuards(AuthGuard)
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

**3. Enable Validation**
```typescript
// main.ts - add after cookieParser
import { ValidationPipe } from '@nestjs/common';

app.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
}));
```

#### ✅ Success Criteria
- [ ] All CRUD operations implemented
- [ ] Routes protected with AuthGuard
- [ ] Validation working
- [ ] User can only access their own data

#### 🧪 Testing (Postman)

**Create Learning Path**
```http
POST http://localhost:5000/api/v1/learning-paths
Content-Type: application/json

{
  "name": "React Roadmap",
  "description": "Learn React from basics to advanced",
  "skillLevel": "beginner"
}

# Expected: 201 Created
```

**Get All Learning Paths**
```http
GET http://localhost:5000/api/v1/learning-paths

# Expected: Array of learning paths
```

**Update Learning Path**
```http
PATCH http://localhost:5000/api/v1/learning-paths/{id}
Content-Type: application/json

{
  "name": "Updated React Roadmap",
  "skillLevel": "intermediate"
}
```

**Delete Learning Path**
```http
DELETE http://localhost:5000/api/v1/learning-paths/{id}
```

---

### **Day 7: Chapters Module - Part 1**

#### 📚 What to Learn (30 min)
- Embedded documents in Mongoose
- Subdocuments vs references
- Review: `NestJS-BetterAuth-Guide.md` Chapter schema

#### 💻 What to Build (2 hours)

**1. Generate Module**
```bash
nest g module modules/chapters
nest g controller modules/chapters --no-spec
nest g service modules/chapters --no-spec
```

**2. Create Schema with Embedded Notes**
```typescript
// src/modules/chapters/schemas/chapter.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ _id: false })
export class Note {
  @Prop({ required: true, maxlength: 1000 })
  text: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const NoteSchema = SchemaFactory.createForClass(Note);

@Schema({ timestamps: true })
export class Chapter extends Document {
  @Prop({ type: Types.ObjectId, ref: 'LearningPath', required: true })
  learningPathId: Types.ObjectId;

  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ required: true, trim: true, maxlength: 200 })
  title: string;

  @Prop({ trim: true, maxlength: 1000, default: '' })
  description: string;

  @Prop({ enum: ['easy', 'medium', 'hard'], default: 'medium' })
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

ChapterSchema.index({ learningPathId: 1, createdAt: 1 });
ChapterSchema.index({ userId: 1, isCompleted: 1 });
ChapterSchema.index({ userId: 1, completionDate: -1 });
```

**3. Create DTOs**
```typescript
// dto/create-chapter.dto.ts
import { IsString, IsEnum, IsNumber, IsOptional, MaxLength, Min, Max } from 'class-validator';

export class CreateChapterDto {
  @IsString()
  @MaxLength(200)
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;

  @IsEnum(['easy', 'medium', 'hard'])
  @IsOptional()
  difficulty?: 'easy' | 'medium' | 'hard';

  @IsNumber()
  @IsOptional()
  @Min(5)
  @Max(300)
  estimatedMinutes?: number;
}
``

`

**4. Configure Module**
```typescript
// chapters.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChaptersController } from './chapters.controller';
import { ChaptersService } from './chapters.service';
import { Chapter, ChapterSchema } from './schemas/chapter.schema';
import { LearningPathsModule } from '../learning-paths/learning-paths.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Chapter.name, schema: ChapterSchema }
    ]),
    LearningPathsModule, // For progress update
  ],
  controllers: [ChaptersController],
  providers: [ChaptersService],
})
export class ChaptersModule {}
```

#### ✅ Success Criteria
- [ ] Chapter schema with embedded notes created
- [ ] DTOs defined
- [ ] Module configured
- [ ] Compiles without errors

---

### **Day 8: Chapters Module - Part 2 (CRUD + Completion)**

#### 📚 What to Learn (45 min)
- Implementing `PATCH` and `DELETE` routes in NestJS.
- Handling nested routes (e.g., `/learning-paths/:pathId/chapters`).
- Service-to-service communication (calling `LearningPathsService` from `ChaptersService`).
- Read: [NestJS Controllers](https://docs.nestjs.com/controllers), [NestJS Providers](https://docs.nestjs.com/providers).

#### 💻 What to Build (2 hours)

**1. Create Additional DTOs**
```bash
# In backend directory
touch src/modules/chapters/dto/update-chapter.dto.ts
touch src/modules/chapters/dto/add-note.dto.ts
```

```typescript
// src/modules/chapters/dto/update-chapter.dto.ts
import { IsString, IsEnum, IsNumber, IsOptional, MaxLength, Min, Max } from 'class-validator';

export class UpdateChapterDto {
  @IsString()
  @IsOptional()
  @MaxLength(200)
  title?: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;

  @IsEnum(['easy', 'medium', 'hard'])
  @IsOptional()
  difficulty?: 'easy' | 'medium' | 'hard';

  @IsNumber()
  @IsOptional()
  @Min(5)
  @Max(300)
  estimatedMinutes?: number;
}
```

```typescript
// src/modules/chapters/dto/add-note.dto.ts
import { IsString, MaxLength } from 'class-validator';

export class AddNoteDto {
  @IsString()
  @MaxLength(1000)
  text: string;
}
```

**2. Implement Chapters Service**
Update `chapters.service.ts` with the full business logic. This includes creating chapters, finding them, updating, deleting, marking as complete, and adding notes. The "mark complete" action also triggers a progress update in the parent `LearningPath`.

```typescript
// src/modules/chapters/chapters.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chapter } from './schemas/chapter.schema.js';
import { CreateChapterDto } from './dto/create-chapter.dto.js';
import { UpdateChapterDto } from './dto/update-chapter.dto.js';
import { AddNoteDto } from './dto/add-note.dto.js';
import { LearningPathsService } from '../learning-paths/learning-paths.service.js';

@Injectable()
export class ChaptersService {
  constructor(
    @InjectModel(Chapter.name) private readonly chapterModel: Model<Chapter>,
    private readonly learningPathsService: LearningPathsService,
  ) {}

  async create(userId: string, learningPathId: string, createDto: CreateChapterDto) {
    // Ensure user owns the learning path first
    await this.learningPathsService.findOne(learningPathId, userId);

    const chapter = new this.chapterModel({
      ...createDto,
      userId,
      learningPathId,
    });
    
    const savedChapter = await chapter.save();
    await this.updateLearningPathProgress(learningPathId);
    return savedChapter;
  }

  async findAllByPath(userId: string, learningPathId: string) {
    await this.learningPathsService.findOne(learningPathId, userId);
    return this.chapterModel.find({ learningPathId }).sort({ createdAt: 1 }).exec();
  }

  async findOne(id: string, userId: string) {
    const chapter = await this.chapterModel.findById(id).exec();
    if (!chapter) {
      throw new NotFoundException('Chapter not found');
    }
    if (chapter.userId.toString() !== userId) {
      throw new ForbiddenException('Access denied');
    }
    return chapter;
  }

  async update(id: string, userId: string, updateDto: UpdateChapterDto) {
    const chapter = await this.findOne(id, userId);
    Object.assign(chapter, updateDto);
    return chapter.save();
  }

  async remove(id: string, userId: string) {
    const chapter = await this.findOne(id, userId);
    await chapter.deleteOne();
    await this.updateLearningPathProgress(chapter.learningPathId.toString());
    return { message: 'Chapter deleted successfully' };
  }

  async markComplete(id: string, userId: string, isCompleted: boolean) {
    const chapter = await this.findOne(id, userId);
    chapter.isCompleted = isCompleted;
    chapter.completionDate = isCompleted ? new Date() : null;
    
    // In Day 9, we will also update user streak here
    
    const savedChapter = await chapter.save();
    await this.updateLearningPathProgress(chapter.learningPathId.toString());
    return savedChapter;
  }

  async addNote(id: string, userId: string, addNoteDto: AddNoteDto) {
    const chapter = await this.findOne(id, userId);
    chapter.notes.push({ ...addNoteDto, createdAt: new Date() });
    return chapter.save();
  }
  
  private async updateLearningPathProgress(learningPathId: string) {
    const chapters = await this.chapterModel.find({ learningPathId }).exec();
    const completedCount = chapters.filter(c => c.isCompleted).length;
    const progress = chapters.length > 0 ? Math.round((completedCount / chapters.length) * 100) : 0;
    
    await this.learningPathsService.updateProgress(learningPathId, progress);
  }
}
```

**3. Implement Chapters Controller**
Update `chapters.controller.ts` with the new routes. Note the use of multiple `@Param` decorators to get both `pathId` and `chapterId`.

```typescript
// src/modules/chapters/chapters.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ChaptersService } from './chapters.service.js';
import { CreateChapterDto } from './dto/create-chapter.dto.js';
import { UpdateChapterDto } from './dto/update-chapter.dto.js';
import { AddNoteDto } from './dto/add-note.dto.js';
import { AuthGuard } from '../../common/guards/auth.guard.js';
import { AuthenticatedRequest } from '../../common/interfaces/authenticated-request.interface.js';

@Controller('chapters')
@UseGuards(AuthGuard)
export class ChaptersController {
  constructor(private readonly chaptersService: ChaptersService) {}

  @Post('/in-path/:pathId')
  create(
    @Request() req: AuthenticatedRequest,
    @Param('pathId') pathId: string,
    @Body() createChapterDto: CreateChapterDto,
  ) {
    return this.chaptersService.create(req.user.id, pathId, createChapterDto);
  }

  @Get('/in-path/:pathId')
  findAllByPath(
    @Request() req: AuthenticatedRequest,
    @Param('pathId') pathId: string,
  ) {
    return this.chaptersService.findAllByPath(req.user.id, pathId);
  }

  @Get(':id')
  findOne(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.chaptersService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() updateChapterDto: UpdateChapterDto,
  ) {
    return this.chaptersService.update(id, req.user.id, updateChapterDto);
  }

  @Patch(':id/complete')
  markComplete(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    return this.chaptersService.markComplete(id, req.user.id, true);
  }

  @Patch(':id/incomplete')
  markIncomplete(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    return this.chaptersService.markComplete(id, req.user.id, false);
  }
  
  @Post(':id/notes')
  addNote(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() addNoteDto: AddNoteDto,
  ) {
    return this.chaptersService.addNote(id, req.user.id, addNoteDto);
  }

  @Delete(':id')
  remove(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.chaptersService.remove(id, req.user.id);
  }
}
```

#### ✅ Success Criteria
- [ ] CRUD endpoints for chapters are functional.
- [ ] Marking a chapter as complete updates `isCompleted` and the learning path's `progress` percentage.
- [ ] User can only access chapters within learning paths they own.

#### 🧪 Testing (Postman)
First, create a Learning Path and get its ID. Then:

**Create Chapter** (`{pathId}` is the ID of the parent learning path)
```http
POST http://localhost:5000/api/v1/chapters/in-path/{pathId}
Content-Type: application/json

{
  "title": "Intro to React Hooks",
  "estimatedMinutes": 45
}
```
*Save the returned chapter ID as `{chapterId}`.*

**Mark Complete**
```http
PATCH http://localhost:5000/api/v1/chapters/{chapterId}/complete
```
*Check your database: the `LearningPath` document should now have a `progress` value > 0.*

**Add Note**
```http
POST http://localhost:5000/api/v1/chapters/{chapterId}/notes
Content-Type: application/json

{
  "text": "useState is for managing local component state."
}
```

---

### **Day 9: Streak Calculation Service**

#### 📚 What to Learn (30 min)
- JavaScript `Date` object manipulation.
- Separating business logic into highly focused services.
- How to extend Better Auth's user data update functionality.
- Read: [MDN Date Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

#### 💻 What to Build (1.5 hours)

**1. Generate Streaks Module**
This service will be responsible for one thing: calculating and updating user learning streaks.

```bash
nest g module modules/streaks
nest g service modules/streaks --no-spec
```

**2. Implement Streaks Service**
The core logic resides here. It compares the user's `lastActiveDate` to today's and yesterday's dates to determine if the streak should be incremented or reset.

```typescript
// src/modules/streaks/streaks.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { auth } from '../../lib/auth.js';

@Injectable()
export class StreaksService {
  private readonly logger = new Logger(StreaksService.name);

  async updateUserStreak(userId: string) {
    try {
      const user = await auth.database.getUser(userId);
      if (!user) {
        this.logger.warn(`User not found for streak update: ${userId}`);
        return;
      }

      const today = new Date();
      const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate) : null;

      // Dates are tricky; normalize them to ignore time of day
      const todayDateString = today.toISOString().split('T')[0];
      const lastActiveDateString = lastActive?.toISOString().split('T')[0];

      // Already updated today, do nothing
      if (lastActiveDateString === todayDateString) {
        return;
      }
      
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);
      const yesterdayDateString = yesterday.toISOString().split('T')[0];

      let newStreak = 1; // Default to 1 for a new activity
      if (lastActiveDateString === yesterdayDateString) {
        // It's a consecutive day
        newStreak = (user.learningStreak || 0) + 1;
      }
      
      this.logger.log(`Updating streak for user ${userId} to ${newStreak}`);
      
      await auth.database.updateUser(userId, {
        learningStreak: newStreak,
        lastActiveDate: todayDateString,
      });

    } catch (error) {
      this.logger.error(`Failed to update streak for user ${userId}`, error.stack);
    }
  }
}
```

**3. Update Streaks and Chapters Modules**
```typescript
// src/modules/streaks/streaks.module.ts
import { Module } from '@nestjs/common';
import { StreaksService } from './streaks.service.js';

@Module({
  providers: [StreaksService],
  exports: [StreaksService], // Export the service
})
export class StreaksModule {}
```

```typescript
// src/modules/chapters/chapters.module.ts
// ... imports
import { StreaksModule } from '../streaks/streaks.module.js'; // Import StreaksModule

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Chapter.name, schema: ChapterSchema }
    ]),
    LearningPathsModule,
    StreaksModule, // Add StreaksModule here
  ],
  // ...
})
export class ChaptersModule {}
```

**4. Connect to Chapter Completion**
Inject `StreaksService` into `ChaptersService` and call `updateUserStreak` when a chapter is marked as complete.

```typescript
// src/modules/chapters/chapters.service.ts
import { StreaksService } from '../streaks/streaks.service.js';

// ... in ChaptersService class
export class ChaptersService {
  constructor(
    // ... other injections
    private readonly streaksService: StreaksService,
  ) {}

  async markComplete(id: string, userId: string, isCompleted: boolean) {
    const chapter = await this.findOne(id, userId);
    chapter.isCompleted = isCompleted;
    chapter.completionDate = isCompleted ? new Date() : null;

    if (isCompleted) {
      // HERE: Trigger the streak update
      await this.streaksService.updateUserStreak(userId);
    }
    
    const savedChapter = await chapter.save();
    await this.updateLearningPathProgress(chapter.learningPathId.toString());
    return savedChapter;
  }
  
  // ... rest of the service
}
```

#### ✅ Success Criteria
- [ ] When a chapter is marked complete for the first time on a given day, the user's `learningStreak` and `lastActiveDate` are updated.
- [ ] Completing a chapter on a consecutive day increments the streak.
- [ ] Completing a chapter after a day of inactivity resets the streak to 1.
- [ ] Completing multiple chapters on the same day does not increment the streak more than once.

#### 🧪 Testing
1.  Log in as a user.
2.  In Postman, call `PATCH http://localhost:5000/api/v1/chapters/{chapterId}/complete`.
3.  Check your `user` collection in MongoDB Compass. The `learningStreak` should be `1` and `lastActiveDate` should be today's date.
4.  Call the "mark complete" endpoint again for another chapter. The streak should remain `1`.
5.  (Advanced) Manually change `lastActiveDate` in the database to yesterday's date, then call the endpoint again. The streak should become `2`.

---

### **Day 10: AI Integration - Part 1 (Gemini Client)**

#### 📚 What to Learn (30 min)
- How to use the Google Gemini API with Node.js.
- API Key management and security.
- Basic principles of in-memory caching.
- Read: [Google AI for Node.js Quickstart](https://ai.google.dev/tutorials/node_quickstart)

#### 💻 What to Build (2 hours)

**1. Install Gemini Client**
```bash
cd backend
npm install @google/generative-ai
```

**2. Generate AI Module**
```bash
nest g module modules/ai
nest g controller modules/ai --no-spec
nest g service modules/ai --no-spec
nest g service modules/ai/ai-client --no-spec
```

**3. Implement AI Client Service**
This service is a thin wrapper around the Gemini client. It handles the API key and the actual call to the Google API.

```typescript
// src/modules/ai/ai-client.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AiClientService {
  private readonly logger = new Logger(AiClientService.name);
  private readonly genAI: GoogleGenerativeAI;
  
  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      this.logger.warn('GEMINI_API_KEY is not configured. AI features will be disabled.');
      return;
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async generateText(prompt: string): Promise<string> {
    if (!this.genAI) {
      throw new Error('AI client is not initialized. Is GEMINI_API_KEY set?');
    }
    
    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      this.logger.error('Error generating text with Gemini API', error);
      throw new Error('Failed to get response from AI model.');
    }
  }
}
```

**4. Configure AI Module**
```typescript
// src/modules/ai/ai.module.ts
import { Module, CacheModule } from '@nestjs/common';
import { AiController } from './ai.controller.js';
import { AiService } from './ai.service.js';
import { AiClientService } from './ai-client.service.js';

@Module({
  imports: [
    // In-memory cache for 24 hours (86400 seconds)
    CacheModule.register({
      ttl: 86400, 
    }),
  ],
  controllers: [AiController],
  providers: [AiService, AiClientService],
})
export class AiModule {}
```

**5. Add AI Module to `app.module.ts`**
Make sure the `AiModule` is imported in `src/app.module.ts`.

#### ✅ Success Criteria
- [ ] Gemini client installed and configured.
- [ ] `AiClientService` can successfully make a request to the Gemini API.
- [ ] API key is securely loaded from environment variables.

#### 🧪 Testing
Add a temporary test endpoint to your `ai.controller.ts` to verify the connection.

```typescript
// src/modules/ai/ai.controller.ts
import { Controller, Get } from '@nestjs/common';
import { AiClientService } from './ai-client.service.js';

@Controller('ai')
export class AiController {
  constructor(private readonly aiClientService: AiClientService) {}
  
  @Get('test')
  async testAi() {
    return this.aiClientService.generateText("Say 'Hello, World!' in a fun way.");
  }
}
```

Then, in Postman:
```http
GET http://localhost:5000/api/v1/ai/test

# Expected: A fun "Hello, World!" message from the AI.
```
*Don't forget to remove this test endpoint later!*

---

### **Day 11: AI Integration - Part 2 (Recommendation Logic)**

#### 📚 What to Learn (30 min)
- Prompt engineering best practices.
- Designing fallback logic for external service failures.
- Using NestJS's built-in `CacheModule`.
- Read: [NestJS Caching](https://docs.nestjs.com/techniques/caching)

#### 💻 What to Build (2.5 hours)

**1. Create DTO for AI Recommendation**
```bash
mkdir src/modules/ai/dto
touch src/modules/ai/dto/get-recommendation.dto.ts
```
```typescript
// src/modules/ai/dto/get-recommendation.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class GetRecommendationDto {
  @IsString()
  @IsNotEmpty()
  learningPathId: string;
}
```

**2. Implement AI Service (The "Brain")**
This service orchestrates the process: it gets data, checks the cache, builds a prompt, calls the AI client, and handles fallbacks.

```typescript
// src/modules/ai/ai.service.ts
import { Injectable, Inject, CACHE_MANAGER, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { AiClientService } from './ai-client.service.js';
import { LearningPathsService } from '../learning-paths/learning-paths.service.js';
import { ChaptersService } from '../chapters/chapters.service.js';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly aiClientService: AiClientService,
    private readonly learningPathsService: LearningPathsService,
    private readonly chaptersService: ChaptersService,
  ) {}

  async getRecommendation(userId: string, learningPathId: string) {
    const cacheKey = `rec-${userId}-${learningPathId}`;
    const cachedData = await this.cacheManager.get(cacheKey);
    if (cachedData) {
      this.logger.log('Returning cached AI recommendation');
      return { ...cachedData, strategy: 'cache' };
    }

    try {
      const result = await this.generateNewRecommendation(userId, learningPathId);
      await this.cacheManager.set(cacheKey, result);
      return { ...result, strategy: 'llm' };
    } catch (error) {
      this.logger.error('AI generation failed, using fallback', error.stack);
      const fallback = await this.getFallbackRecommendation(userId, learningPathId);
      return { ...fallback, strategy: 'fallback' };
    }
  }

  private async generateNewRecommendation(userId: string, learningPathId: string) {
    const path = await this.learningPathsService.findOne(learningPathId, userId);
    const chapters = await this.chaptersService.findAllByPath(userId, learningPathId);

    const completed = chapters.filter(c => c.isCompleted).map(c => c.title).join(', ') || 'None';
    const incomplete = chapters.filter(c => !c.isCompleted).map(c => c.title).join(', ') || 'None';

    const prompt = `
      You are a helpful learning assistant. Based on the following information, recommend the very next single chapter to study.
      - Learning Path: "${path.name}"
      - User's Skill Level: ${path.skillLevel}
      - Chapters already completed: ${completed}
      - Chapters remaining: ${incomplete}
      
      Respond in JSON format with the fields: "nextChapterTitle", "reason".
      The "nextChapterTitle" must be an exact match from the remaining chapters list.
      The "reason" should be a brief, encouraging explanation of why this is the best next step.
      Example: {"nextChapterTitle": "Introduction to JSX", "reason": "It's the foundational syntax for building components in React."}
    `;

    const responseText = await this.aiClientService.generateText(prompt);
    return JSON.parse(responseText);
  }

  private async getFallbackRecommendation(userId: string, learningPathId: string) {
    const chapters = await this.chaptersService.findAllByPath(userId, learningPathId);
    const firstIncomplete = chapters.find(c => !c.isCompleted);

    if (firstIncomplete) {
      return {
        nextChapterTitle: firstIncomplete.title,
        reason: 'This is the next chapter in your learning path.',
      };
    }

    return {
      nextChapterTitle: 'All chapters completed!',
      reason: 'Congratulations! You have completed all the chapters in this learning path.',
    };
  }
}
```

**3. Implement AI Controller Endpoint**
```typescript
// src/modules/ai/ai.controller.ts
import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '../../common/guards/auth.guard.js';
import { AiService } from './ai.service.js';
import { GetRecommendationDto } from './dto/get-recommendation.dto.js';
import { AuthenticatedRequest } from '../../common/interfaces/authenticated-request.interface.js';

@Controller('ai')
@UseGuards(AuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('recommend')
  getRecommendation(
    @Request() req: AuthenticatedRequest,
    @Body() getRecommendationDto: GetRecommendationDto,
  ) {
    return this.aiService.getRecommendation(req.user.id, getRecommendationDto.learningPathId);
  }
}
```
*Note: Make sure `LearningPathsModule` and `ChaptersModule` export their services, and `AiModule` imports them.*

#### ✅ Success Criteria
- [ ] `/ai/recommend` endpoint returns a valid JSON recommendation.
- [ ] A successful response includes `strategy: 'llm'`.
- [ ] If the Gemini API fails, a fallback response is returned with `strategy: 'fallback'`.
- [ ] Subsequent requests for the same path return a cached response with `strategy: 'cache'`.

#### 🧪 Testing (Postman)
1.  **Test Success**: Call the endpoint with a valid learning path ID.
    ```http
    POST http://localhost:5000/api/v1/ai/recommend
    Content-Type: application/json
    
    {
      "learningPathId": "your-path-id"
    }
    ```
2.  **Test Fallback**: Temporarily put a fake `GEMINI_API_KEY` in your `.env` and restart the server. Call the endpoint again. You should get the fallback response.
3.  **Test Cache**: Restore the correct API key and restart. Call the endpoint. The first time, it should hit the LLM. The second time, it should be faster and you should see the "Returning cached" log in your console.

---

## 🗓️ Week 3: Frontend & Deployment

### **Day 12: Frontend Setup + Better Auth React**

#### 📚 What to Learn (30 min)
- Scaffolding a React + TypeScript project with Vite.
- Setting up the `better-auth/react` library.
- Basic routing with `react-router-dom`.

#### 💻 What to Build (2.5 hours)

**1. Create Vite React App**
```bash
cd .. 
# Now in root folder
cd frontend
npm create vite@latest . -- --template react-ts
npm install
```

**2. Install Frontend Dependencies**
```bash
npm install axios react-router-dom better-auth-react
```

**3. Configure Better Auth React**
You need to wrap your application in the `BetterAuth` provider.

```typescript
// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BetterAuth } from 'better-auth-react';
import './index.css'; // Basic styling

const authOptions = {
  // The base URL of your NestJS backend API
  api: 'http://localhost:5000/api', 
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BetterAuth options={authOptions}>
      <App />
    </BetterAuth>
  </React.StrictMode>,
);
```

**4. Create Pages & Routing**
Create a `pages` directory and basic page components: `Dashboard.tsx`, `Login.tsx`, `Register.tsx`, `Home.tsx`.

```typescript
// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuth } from 'better-auth-react';

// Import your pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

// A simple component to handle protected routes
function ProtectedRoute({ children }) {
  const { session, status } = useAuth();

  if (status === 'loading') return <div>Loading...</div>;
  if (!session) {
    // Redirect to login or show an unauthorized message
    window.location.href = '/login';
    return null;
  }
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

**5. Build Login/Register Forms**
Use the `useAuth` hook to access sign-in and sign-up functions.
```typescript
// src/pages/Login.tsx (Simplified)
import { useAuth } from 'better-auth-react';
import { useState } from 'react';

export default function Login() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await signIn.email({ email, password });
    if (error) {
      alert(error.message);
    } else {
      window.location.href = '/dashboard'; // Redirect on success
    }
  };
  
  // Return a form with email/password inputs and submit button
}
```

#### ✅ Success Criteria
- [ ] React project is created and runs with `npm run dev`.
- [ ] Users can register and log in via the frontend forms.
- [ ] `/dashboard` route is protected; unauthorized users are redirected.
- [ ] Logged-in user data is available via the `useAuth` hook.

#### 🧪 Testing
1. Run the frontend: `npm run dev`.
2. Go to `http://localhost:5173/register` and create an account.
3. You should be redirected to the dashboard.
4. Log out (you'll need to add a logout button using `signOut()`).
5. Go to `http://localhost:5173/login` and log back in.
6. Try to access `http://localhost:5173/dashboard` in a private browser window. You should be redirected.

---

### **Day 13: Learning Paths UI**

#### 📚 What to Learn (45 min)
- Data fetching with `useEffect` and `useState`.
- Client-side API service structure.
- Conditional rendering and list mapping in React.

#### 💻 What to Build (2 hours)

**1. Create an API Client**
Create a helper file for `axios` to automatically handle auth and base URLs.

```typescript
// src/lib/api.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  withCredentials: true, // IMPORTANT: This sends cookies with requests
});
```

**2. Fetch and Display Learning Paths**
On your `Dashboard.tsx` page, fetch the user's learning paths and display them.

```typescript
// src/pages/Dashboard.tsx
import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { useAuth } from 'better-auth-react';

export default function Dashboard() {
  const { session } = useAuth();
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaths = async () => {
      try {
        const response = await api.get('/learning-paths');
        setPaths(response.data);
      } catch (error) {
        console.error("Failed to fetch learning paths", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaths();
  }, []);

  if (loading) return <div>Loading your learning paths...</div>;

  return (
    <div>
      <h1>Welcome, {session.user.name}!</h1>
      <h2>Your Learning Paths</h2>
      {paths.map(path => (
        <div key={path._id}>
          <h3>{path.name} ({path.progress}%)</h3>
          <p>{path.description}</p>
        </div>
      ))}
      {/* Form to create new path will go here */}
    </div>
  );
}
```

**3. Implement "Create Learning Path" Form**
Add a form to the dashboard to allow users to create new paths.

```typescript
// In Dashboard.tsx, add state for the form
const [newName, setNewName] = useState('');
const [newSkillLevel, setNewSkillLevel] = useState('beginner');

const handleCreatePath = async (e) => {
  e.preventDefault();
  try {
    const response = await api.post('/learning-paths', {
      name: newName,
      skillLevel: newSkillLevel,
    });
    // Add new path to the list to re-render
    setPaths(prevPaths => [response.data, ...prevPaths]);
    setNewName(''); // Reset form
  } catch (error) {
    console.error("Failed to create path", error);
    alert('Error creating path.');
  }
};

// Add the form to your JSX
<form onSubmit={handleCreatePath}>
  <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Path Name" />
  <select value={newSkillLevel} onChange={e => setNewSkillLevel(e.target.value)}>
    <option value="beginner">Beginner</option>
    <option value="intermediate">Intermediate</option>
    <option value="advanced">Advanced</option>
  </select>
  <button type="submit">Create Path</button>
</form>
```

#### ✅ Success Criteria
- [ ] Dashboard displays a list of the logged-in user's learning paths.
- [ ] Users can successfully create a new learning path using the form.
- [ ] The UI updates instantly (optimistically or via re-fetch) after creating a new path.

#### 🧪 Testing
1.  Load the dashboard. Your learning paths created via Postman should appear.
2.  Use the form to create a new learning path.
3.  The new path should appear at the top of the list immediately.
4.  Verify in MongoDB Compass that the new `learningpaths` document was created with the correct `userId`.

---

### **Day 14: Chapters UI + AI Panel**

#### 📚 What to Learn (30 min)
- Passing state and callbacks between parent and child components.
- Structuring a detail page in React.
- Displaying loading/error states for API calls.

#### 💻 What to Build (2.5 hours)

**1. Create a `LearningPathDetail` Page**
- Create a new route `/path/:id`.
- When a user clicks a learning path on the dashboard, navigate them to this page.
- On this page, fetch both the path details (`/learning-paths/:id`) and its chapters (`/chapters/in-path/:id`).

**2. Implement Chapter List and Completion Toggle**
```typescript
// Simplified component for a single chapter
function ChapterItem({ chapter, onToggleComplete }) {
  const handleToggle = async () => {
    const endpoint = chapter.isCompleted ? `/chapters/${chapter._id}/incomplete` : `/chapters/${chapter._id}/complete`;
    try {
      await api.patch(endpoint);
      onToggleComplete(); // Tell parent to re-fetch data
    } catch (error) {
      console.error("Failed to update chapter", error);
    }
  };

  return (
    <div>
      <input 
        type="checkbox" 
        checked={chapter.isCompleted}
        onChange={handleToggle}
      />
      {chapter.title}
    </div>
  );
}
```

**3. Implement AI Suggestion Panel**
On the detail page, add a button to get an AI recommendation.

```typescript
// In LearningPathDetail.tsx
const [recommendation, setRecommendation] = useState(null);

const handleGetRecommendation = async () => {
  try {
    const response = await api.post('/ai/recommend', { learningPathId: id });
    setRecommendation(response.data);
  } catch (error) {
    console.error("Failed to get recommendation", error);
  }
};

// ... in JSX
<button onClick={handleGetRecommendation}>Get AI Suggestion</button>
{recommendation && (
  <div>
    <h4>AI Recommends: {recommendation.nextChapterTitle}</h4>
    <p>Reason: {recommendation.reason}</p>
  </div>
)}
```

#### ✅ Success Criteria
- [ ] Users can navigate to a detail page for each learning path.
- [ ] The detail page lists all chapters.
- [ ] Clicking the checkbox marks a chapter as complete/incomplete and updates the UI.
- [ ] The "Get AI Suggestion" button fetches and displays a recommendation from the backend.

#### 🧪 Testing
1.  Navigate to a learning path's detail page.
2.  Mark a chapter as complete. The checkbox should update. Go to the main dashboard; the progress bar for that path should be updated.
3.  Click the AI suggestion button. A recommendation should appear.
4.  Click it again. The response should be much faster (due to caching).

---

### **Day 15: Deployment & Final Testing**

#### 📚 What to Learn (30 min)
- Environment variable management in Vercel and Railway.
- Differences between development and production builds.
- Final end-to-end (E2E) testing.

#### 💻 What to Build (2 hours)

**1. Prepare for Deployment**
- Ensure your `package.json` files have correct `build` scripts.
- For the backend, ensure `npm run build` is run before `npm run start:prod`. Most platforms do this automatically.
- For the frontend, Vercel will automatically run `npm run build`.

**2. Deploy Backend to Railway (or Render)**
1.  Sign up for a Railway account and connect your GitHub.
2.  Create a new project and select your repository.
3.  Railway will detect the `Dockerfile` or `package.json` and ask for settings. If it doesn't, you may need to configure the service.
4.  Go to the "Variables" tab for your new service.
5.  Add all the secrets from your `.env` file: `MONGO_URI`, `BETTER_AUTH_SECRET`, `GEMINI_API_KEY`, and `FRONTEND_URL` (this will be your Vercel URL, which you'll get in the next step).
6.  Railway will provide you with a public URL for your backend (e.g., `my-app.up.railway.app`).

**3. Deploy Frontend to Vercel**
1.  Sign up for a Vercel account and connect your GitHub.
2.  Create a new project and select your repository.
3.  Vercel will detect it's a Vite app. In the "Root Directory" settings, select the `frontend` folder.
4.  Expand the "Environment Variables" section.
5.  Add a new variable:
    - **Name**: `VITE_API_URL`
    - **Value**: The full URL of your deployed backend (e.g., `https://my-app.up.railway.app/api`).
6.  Click "Deploy".
7.  Vercel will build and deploy your site, giving you a public URL.

**4. Final Configuration**
- Take your Vercel URL (e.g., `my-frontend.vercel.app`) and update the `FRONTEND_URL` environment variable in your Railway backend settings. This is crucial for CORS to work correctly.

#### ✅ Success Criteria
- [ ] Backend is successfully deployed and running on a public URL.
- [ ] Frontend is successfully deployed and running on a public URL.
- [ ] A new user can register, log in, create a learning path, add chapters, and get an AI suggestion on the live production site.

#### 🧪 Testing
- **The ultimate test!** Open your Vercel URL in a browser.
- Go through the entire user journey from start to finish:
  1. Register a new account.
  2. Log in.
  3. Create a learning path.
  4. Add a few chapters to it.
  5. Mark one chapter as complete.
  6. Get an AI suggestion.
- If all of that works, **you have successfully built and deployed the MVP!** 🎉

---

## 📝 Notes

**This is a living document!** After Day 7, would you like me to:
1. Continue with detailed Day 8-15 guides?
2. Adjust the pace/content based on your progress?

**Tip**: Don't rush! It's better to fully understand Days 1-7 than to rush through all 15 days.

---

## 🎯 Quick Reference

**When stuck:**
1. Check `SkillProgressTracker-MVP.md` for architecture
2. Check `NestJS-BetterAuth-Guide.md` for code examples
3. Check `LEARNING-GUIDE.md` for concept explanations
4. Google the error message
5. Ask for help!

**Best practices:**
- ✅ Test after each step
- ✅ Commit to git daily
- ✅ Keep notes of issues/solutions
- ✅ Take breaks!

Good luck! 🚀
