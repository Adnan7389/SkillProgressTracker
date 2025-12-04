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

## 🗓️ Week 2: Complete Backend

### **Day 8: Chapters Module - Part 2 (CRUD + Completion)**

*(Continue with Chapters service, controller, and mark complete functionality)*

### **Day 9: Streak Calculation Service**

*(Implement streak logic, update user streak on chapter completion)*

### **Day 10: AI Integration - Part 1 (Gemini Client)**

*(Setup Gemini API, create AI client service, implement caching)*

### **Day 11: AI Integration - Part 2 (Rule-based Fallback)**

*(Implement fallback logic, create recommendation endpoint)*

---

## 🗓️ Week 3: Frontend & Deployment

### **Day 12: Frontend Setup + Better Auth React**

*(Create Vite React app, setup Better Auth client, auth pages)*

### **Day 13: Learning Paths UI**

*(Dashboard, list view, create/edit forms)*

### **Day 14: Chapters UI + AI Panel**

*(Chapter list, completion toggle, AI suggestions)*

### **Day 15: Deployment & Testing**

*(Deploy to Railway/Render + Vercel, configure production env)*

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
