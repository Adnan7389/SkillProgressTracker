# Skill Progress Tracker - MVP System Design (NestJS + Better Auth)

> **Modern TypeScript Stack**: This design uses NestJS, Better Auth, and MongoDB to build a production-ready MVP with industry best practices. Perfect for learning modern backend development!

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [System Architecture](#system-architecture)
4. [MongoDB Database Design](#mongodb-database-design)
5. [API Specification](#api-specification)
6. [Backend Architecture](#backend-architecture)
7. [AI Integration (Simplified)](#ai-integration-simplified)
8. [Frontend Overview](#frontend-overview)
9. [Security & Validation](#security--validation)
10. [Development Roadmap](#development-roadmap)
11. [MongoDB Learning Guide](#mongodb-learning-guide)

---

# Project Overview

## What Is This?

The **Skill Progress Tracker** helps learners track their progress across multiple technologies (React, Node.js, Python, etc.) with AI-powered learning recommendations.

**Core Features (MVP)**:
- ✅ User authentication (JWT)
- ✅ Create custom learning paths (e.g., "React Roadmap", "Backend Development")
- ✅ Add chapters to each path
- ✅ Track progress & learning streaks
- ✅ Get AI-powered "what to learn next" suggestions
- ✅ Add notes to chapters

**Single User Type**: Learner (no admin/mentor roles in MVP)

---

## Success Criteria

- Daily active tracking for learners
- Accurate AI suggestions (simple but useful)
- Fast API responses (< 200ms for reads)
- Easy to understand MongoDB schema (great for learning)
- Deployable to free hosting (Vercel + Railway + MongoDB Atlas)

---

## What's Excluded from MVP

❌ Background job queues (Redis/BullMQ)  
❌ Scheduled daily notifications  
❌ Multiple LLM provider support  
❌ Advanced analytics dashboard  
❌ Social features (leaderboards, friends)  
❌ Mobile app  
❌ Email summaries  

> **These are Phase 2 features** - we'll build a solid foundation first!

---

# Technology Stack

## Backend
- **Runtime**: Node.js 18+
- **Framework**: **NestJS 10+** (TypeScript-first, enterprise-grade)
- **Language**: TypeScript
- **Database**: MongoDB with **Mongoose** (via `@nestjs/mongoose`)
- **Authentication**: **Better Auth** (modern, comprehensive auth framework)
- **Validation**: `class-validator` + `class-transformer` (built-in to NestJS)
- **Configuration**: `@nestjs/config`

## Frontend
- **Framework**: React 18+
- **Language**: TypeScript
- **Routing**: React Router v6
- **State Management**: React Query + Context API
- **HTTP Client**: Axios
- **Auth Client**: **Better Auth React** (`better-auth/react`)
- **Styling**: Tailwind CSS

## AI Provider
- **Primary**: Gemini API (free tier)
- **Fallback**: Rule-based recommendation engine

## Hosting (Free Tier)
- **Frontend**: Vercel
- **Backend**: Railway or Render
- **Database**: MongoDB Atlas (512MB free forever)

---

## Why NestJS + Better Auth?

### **NestJS Benefits**
- ✅ **Built for TypeScript**: First-class TS support, no configuration needed
- ✅ **Dependency Injection**: Clean, testable code architecture
- ✅ **Modular Structure**: Forces good organization from day 1
- ✅ **Enterprise Patterns**: Learn industry-standard backend architecture
- ✅ **Excellent MongoDB Integration**: `@nestjs/mongoose` is battle-tested
- ✅ **Built-in Validation**: Less boilerplate than Zod
- ✅ **Great Testing Support**: Jest integration out of the box

### **Better Auth Benefits**
- ✅ **Modern & TypeScript-First**: Built specifically for TypeScript projects
- ✅ **MongoDB Adapter Built-in**: No manual auth schema design
- ✅ **Automatic Security**: CSRF, rate limiting, password hashing
- ✅ **Comprehensive Features**: Email/password, OAuth, 2FA, sessions
- ✅ **Automatic Database Management**: Creates collections & handles migrations
- ✅ **Framework Agnostic**: Works seamlessly with NestJS
- ✅ **Developer Experience**: Clean API, great documentation
- ✅ **Ethiopian-Made**: Supporting African tech innovation! 🇪🇹

---

# System Architecture

## High-Level Overview

```
┌─────────────────────────────────────────┐
│          React Frontend (TS)            │
│  - Auth pages (Better Auth React)       │
│  - Dashboard                             │
│  - Learning paths manager                │
│  - AI suggestions panel                  │
└────────────────┬────────────────────────┘
                 │
                 │ REST API (HTTPS)
                 │
┌────────────────▼────────────────────────┐
│         NestJS Backend (Node + TS)      │
│                                          │
│  ┌──────────────────────────────────┐   │
│  │      Better Auth Handler         │   │
│  │  /api/auth/* endpoints           │   │
│  │  - Email/Password auth           │   │
│  │  - Session management            │   │
│  │  - OAuth providers (optional)    │   │
│  └──────────────────────────────────┘   │
│                                          │
│  NestJS Modules:                         │
│   • Learning Paths Module                │
│   • Chapters Module                      │
│   • AI Recommendation Module             │
│                                          │
│  Guards: @UseGuards(AuthGuard)           │
└────────────────┬────────────────────────┘
                 │
                 │ Mongoose ODM
                 │
┌────────────────▼────────────────────────┐
│            MongoDB Atlas                 │
│                                          │
│  Better Auth Collections (automatic):    │
│    • user                                │
│    • session                             │
│    • account                             │
│    • verification                        │
│                                          │
│  App Collections (you manage):           │
│    • learningpaths                       │
│    • chapters                            │
└─────────────────┬───────────────────────┘
                 │
                 │ HTTP API (Gemini)
                 │
┌────────────────▼────────────────────────┐
│          Gemini AI API                   │
│  (or rule-based fallback)                │
└─────────────────────────────────────────┘
```

---

## Authentication Flow (Better Auth)

```
┌──────────┐                 ┌──────────────┐                ┌──────────┐
│  Client  │                 │   NestJS     │                │ MongoDB  │
│ (React)  │                 │ + BetterAuth │                │          │
└────┬─────┘                 └──────┬───────┘                └────┬─────┘
     │                              │                             │
     │  POST /api/auth/sign-in      │                             │
     │  { email, password }         │                             │
     ├─────────────────────────────>│                             │
     │                              │                             │
     │                              │  Query user collection      │
     │                              ├────────────────────────────>│
     │                              │                             │
     │                              │  User data + session        │
     │                              │<────────────────────────────┤
     │                              │                             │
     │                              │  Create session             │
     │                              ├────────────────────────────>│
     │                              │                             │
     │  Set-Cookie: better-auth    │                             │
     │  { user, session }           │                             │
     │<─────────────────────────────┤                             │
     │                              │                             │
     │                              │                             │
     │  GET /api/learning-paths     │                             │
     │  Cookie: better-auth         │                             │
     ├─────────────────────────────>│                             │
     │                              │                             │
     │                              │  Verify session             │
     │                              ├────────────────────────────>│
     │                              │                             │
     │                              │  Session valid              │
     │                              │<────────────────────────────┤
     │                              │                             │
     │                              │  Query learningpaths        │
     │                              ├────────────────────────────>│
     │                              │                             │
     │  [Learning paths data]       │                             │
     │<─────────────────────────────┤                             │
     │                              │                             │
```

**Key Points**:
- Better Auth handles all authentication automatically
- Sessions stored in MongoDB with automatic expiry
- httpOnly cookies (secure, prevents XSS)
- NestJS guards protect routes using Better Auth session verification

---

# MongoDB Database Design

> 🎓 **MongoDB Learning Note**: MongoDB is a document database. Unlike SQL tables with rigid rows and columns, MongoDB stores flexible JSON-like documents in collections.

## Database Architecture: Better Auth + Your App

With Better Auth, your MongoDB database will have **two separate concerns**:

### **Better Auth Collections (4 - Automatic)**
Better Auth creates and manages these collections automatically:

1. **`user`** - User authentication data (email, password hash, email verification)
2. **`session`** - Active user sessions with expiry timestamps
3. **`account`** - OAuth provider connections (Google, GitHub, etc.)
4. **`verification`** - Email verification tokens, 2FA codes

**You don't design these schemas** - Better Auth handles everything!

### **Application Collections (2 - You Manage)**
Your business logic and domain models:

5. **`learningpaths`** - Custom learning journeys
6. **`chapters`** - Learning units with embedded notes

---

## Why This Separation is Perfect for Learning

✅ **Focus on Your Domain**: Learn MongoDB with `learningpaths` and `chapters`  
✅ **Auth is Handled**: No complex user/session schema design  
✅ **Clear Boundaries**: Auth vs. business logic separation  
✅ **Production-Ready**: Better Auth handles security best practices  
✅ **Extensible**: Easy to add user profile data (streak, preferences) later  

---

## Better Auth Collections (Auto-Managed)

### Collection: `user` (Better Auth)

Better Auth automatically creates this collection for authentication.

```json
{
  "_id": "user_abc123",
  "email": "adnan@example.com",
  "emailVerified": true,
  "name": "Adnan",
  "image": null,
  "createdAt": "2025-12-01T10:00:00.000Z",
  "updatedAt": "2025-12-04T08:30:00.000Z"
}
```

**You don't modify this** - Better Auth manages it!

### Collection: `session` (Better Auth)

Stores active user sessions.

```json
{
  "_id": "session_xyz789",
  "userId": "user_abc123",
  "expiresAt": "2025-12-11T10:00:00.000Z",
  "token": "hashed_session_token",
  "ipAddress": "192.168.1.1",
  "userAgent": "Mozilla/5.0...",
  "createdAt": "2025-12-04T10:00:00.000Z"
}
```

**Better Auth auto-expires old sessions!**

### Collections: `account` & `verification`

- `account`: For OAuth providers (Google, GitHub) - not needed for MVP
- `verification`: Email verification codes, 2FA tokens - auto-managed

---

## Extending Better Auth User Data

For user-specific app data (like learning streak), you have two options:

### **Option 1: Additional Fields in Better Auth User (Recommended for MVP)**

Better Auth allows extending the user model:

```typescript
// src/lib/auth.ts
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  database: mongodbAdapter(client),
  user: {
    additionalFields: {
      learningStreak: {
        type: "number",
        defaultValue: 0
      },
      lastActiveDate: {
        type: "string",
        defaultValue: () => new Date().toISOString().split('T')[0]
      }
    }
  }
});
```

**Pros**: Single user collection, simpler queries  
**Cons**: Mixing auth data with app data

### **Option 2: Separate `userprofiles` Collection (Clean Architecture)**

Keep Better Auth user pure, create your own profile collection:

```typescript
// src/schemas/userprofile.schema.ts
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class UserProfile extends Document {
  @Prop({ required: true, unique: true })
  userId: string; // Links to Better Auth user._id

  @Prop({ default: 0 })
  learningStreak: number;

  @Prop({ default: () => new Date().toISOString().split('T')[0] })
  lastActiveDate: string;
}

export const UserProfileSchema = SchemaFactory.createForClass(UserProfile);
```

**Pros**: Clean separation, easier to migrate auth providers later  
**Cons**: Extra collection, slight query overhead

**For MVP, use **Option 1** (extend Better Auth user)!**

---

## Application Collections (You Manage)

## Collection 1: `users`

Stores learner profile, authentication, and streak data.

### Document Structure

```json
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "name": "Adnan",
  "email": "adnan@example.com",
  "passwordHash": "$2b$12$...",
  "learningStreak": 6,
  "lastActiveDate": "2025-12-04",
  "createdAt": "2025-12-01T10:00:00.000Z",
  "updatedAt": "2025-12-04T08:30:00.000Z"
}
```

### Mongoose Schema

```typescript
// backend/src/models/User.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  learningStreak: number;
  lastActiveDate: string; // YYYY-MM-DD format
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: 1,
    maxlength: 100
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email format']
  },
  passwordHash: {
    type: String,
    required: true
  },
  learningStreak: {
    type: Number,
    default: 0,
    min: 0
  },
  lastActiveDate: {
    type: String,
    default: () => new Date().toISOString().split('T')[0]
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Indexes
userSchema.index({ email: 1 }, { unique: true });

export const User = mongoose.model<IUser>('User', userSchema);
```

### 🎓 MongoDB Learning Notes

**ObjectId**: MongoDB's default unique identifier (12-byte, includes timestamp)

**Indexes**: Make queries faster. `{ email: 1 }` creates an ascending index on email for fast lookups during login.

**Timestamps**: `{ timestamps: true }` auto-manages `createdAt` and `updatedAt` fields.

**Validation**: Mongoose validates data before saving (e.g., email format, required fields).

---

## Collection 2: `learningpaths`

A "learning path" is a roadmap the user creates (e.g., "React Mastery", "Backend Development").

### Document Structure

```json
{
  "_id": ObjectId("507f1f77bcf86cd799439012"),
  "userId": ObjectId("507f1f77bcf86cd799439011"),
  "name": "React Roadmap",
  "description": "Master React from basics to advanced hooks",
  "skillLevel": "beginner",
  "progress": 30,
  "createdAt": "2025-12-01T10:00:00.000Z",
  "updatedAt": "2025-12-04T08:30:00.000Z"
}
```

### Mongoose Schema

```typescript
// backend/src/models/LearningPath.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ILearningPath extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  description: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  progress: number; // 0-100
  createdAt: Date;
  updatedAt: Date;
}

const learningPathSchema = new Schema<ILearningPath>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Learning path name is required'],
    trim: true,
    minlength: 1,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500,
    default: ''
  },
  skillLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  }
}, {
  timestamps: true
});

// Indexes
learningPathSchema.index({ userId: 1, createdAt: -1 }); // User's paths, newest first

export const LearningPath = mongoose.model<ILearningPath>('LearningPath', learningPathSchema);
```

### 🎓 MongoDB Learning Notes

**References**: `ref: 'User'` enables Mongoose's `.populate()` method to join data (like SQL JOIN).

**Compound Index**: `{ userId: 1, createdAt: -1 }` optimizes queries filtering by userId AND sorting by date.

**Enum Validation**: Restricts `skillLevel` to specific values.

---

## Collection 3: `chapters`

Each learning path contains multiple chapters.

### Document Structure

```json
{
  "_id": ObjectId("507f1f77bcf86cd799439013"),
  "learningPathId": ObjectId("507f1f77bcf86cd799439012"),
  "userId": ObjectId("507f1f77bcf86cd799439011"),
  "title": "Understanding React Hooks",
  "description": "Learn useState, useEffect, and custom hooks",
  "difficulty": "medium",
  "estimatedMinutes": 45,
  "isCompleted": false,
  "completionDate": null,
  "notes": [
    {
      "text": "useState is for local component state",
      "createdAt": "2025-12-03T14:20:00.000Z"
    }
  ],
  "createdAt": "2025-12-02T10:00:00.000Z",
  "updatedAt": "2025-12-04T08:30:00.000Z"
}
```

### Mongoose Schema

```typescript
// backend/src/models/Chapter.ts
import mongoose, { Schema, Document } from 'mongoose';

interface INote {
  text: string;
  createdAt: Date;
}

export interface IChapter extends Document {
  learningPathId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedMinutes: number;
  isCompleted: boolean;
  completionDate: Date | null;
  notes: INote[];
  createdAt: Date;
  updatedAt: Date;
}

const noteSchema = new Schema<INote>({
  text: {
    type: String,
    required: true,
    maxlength: 1000
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false }); // no _id for subdocuments

const chapterSchema = new Schema<IChapter>({
  learningPathId: {
    type: Schema.Types.ObjectId,
    ref: 'LearningPath',
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Chapter title is required'],
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000,
    default: ''
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  estimatedMinutes: {
    type: Number,
    min: 5,
    max: 300,
    default: 30
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  completionDate: {
    type: Date,
    default: null
  },
  notes: {
    type: [noteSchema],
    default: []
  }
}, {
  timestamps: true
});

// Indexes
chapterSchema.index({ learningPathId: 1, createdAt: 1 }); // Chapters in order
chapterSchema.index({ userId: 1, isCompleted: 1 }); // Find incomplete chapters
chapterSchema.index({ userId: 1, completionDate: -1 }); // Recently completed

export const Chapter = mongoose.model<IChapter>('Chapter', chapterSchema);
```

### 🎓 MongoDB Learning Notes

**Embedded Documents**: `notes` array is stored directly in chapters (no separate collection needed!).

**_id: false**: Subdocuments usually get automatic IDs; we disable this for notes since we don't need them.

**Multiple Indexes**: Different queries benefit from different indexes. Analyze your query patterns!

**Null vs Undefined**: Use `null` for "not set yet" (like completionDate). Mongoose treats `undefined` as "don't update this field".

---

## Relationships Summary

```
User (1) ──────► (many) LearningPath
                          │
                          └────► (many) Chapter
```

- One user has many learning paths
- One learning path has many chapters
- All queries include `userId` for data isolation

---

## Progress Calculation (No Separate Collection!)

Instead of storing progress logs in a separate collection, we calculate on-the-fly:

```typescript
// Calculate learning path progress
async function updateLearningPathProgress(learningPathId: string) {
  const totalChapters = await Chapter.countDocuments({ learningPathId });
  const completedChapters = await Chapter.countDocuments({ 
    learningPathId, 
    isCompleted: true 
  });
  
  const progress = totalChapters > 0 
    ? Math.round((completedChapters / totalChapters) * 100) 
    : 0;
  
  await LearningPath.findByIdAndUpdate(learningPathId, { progress });
}
```

### 🎓 Why This Approach?

- ✅ No data duplication
- ✅ Always accurate (no sync issues)
- ✅ Simpler code (one less collection to manage)
- ⚠️ Slightly slower (but negligible for MVP scale)

---

## Streak Calculation Logic

Update streak when a chapter is marked complete:

```typescript
async function updateUserStreak(userId: string) {
  const user = await User.findById(userId);
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  
  if (user.lastActiveDate === today) {
    // Already active today, no change
    return;
  }
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  
  if (user.lastActiveDate === yesterdayStr) {
    // Consecutive day: increment streak
    user.learningStreak += 1;
  } else {
    // Streak broken: reset to 1
    user.learningStreak = 1;
  }
  
  user.lastActiveDate = today;
  await user.save();
}
```

---

# API Specification

## Base URL

- Development: `http://localhost:5000/api/v1`
- Production: `https://your-app.railway.app/api/v1`

## Response Format

### Success Response
```json
{
  "data": { ...actual data... },
  "meta": {
    "timestamp": "2025-12-04T11:00:00.000Z",
    "requestId": "uuid-here"
  }
}
```

### Error Response
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Learning path name is required",
    "details": { "field": "name" }
  },
  "meta": {
    "timestamp": "2025-12-04T11:00:00.000Z",
    "requestId": "uuid-here"
  }
}
```

---

## Authentication Endpoints

### POST `/auth/register`
Create a new user account.

**Request Body**:
```json
{
  "name": "Adnan",
  "email": "adnan@example.com",
  "password": "SecurePassword123!"
}
```

**Response** (201 Created):
```json
{
  "data": {
    "message": "User registered successfully"
  }
}
```

**Errors**:
- `400` - Validation failed
- `409` - Email already exists

---

### POST `/auth/login`
Login and receive httpOnly cookie with JWT.

**Request Body**:
```json
{
  "email": "adnan@example.com",
  "password": "SecurePassword123!"
}
```

**Response** (200 OK):
```json
{
  "data": {
    "user": {
      "_id": "507f...",
      "name": "Adnan",
      "email": "adnan@example.com",
      "learningStreak": 6
    }
  }
}
```

**Cookie Set**: `token=<JWT>; HttpOnly; Secure; SameSite=Strict`

**Errors**:
- `401` - Invalid credentials
- `429` - Too many login attempts (rate limited)

---

### POST `/auth/logout`
Clear authentication cookie.

**Headers**: Requires JWT cookie

**Response** (200 OK):
```json
{
  "data": {
    "message": "Logged out successfully"
  }
}
```

---

### GET `/auth/me`
Get current user profile.

**Headers**: Requires JWT cookie

**Response** (200 OK):
```json
{
  "data": {
    "_id": "507f...",
    "name": "Adnan",
    "email": "adnan@example.com",
    "learningStreak": 6,
    "lastActiveDate": "2025-12-04"
  }
}
```

**Errors**:
- `401` - Not authenticated

---

## Learning Paths Endpoints

### GET `/learning-paths`
Get all learning paths for authenticated user.

**Headers**: Requires JWT cookie

**Query Parameters**:
- `sort` (optional): `newest` | `oldest` | `progress_asc` | `progress_desc`

**Response** (200 OK):
```json
{
  "data": [
    {
      "_id": "507f...",
      "name": "React Roadmap",
      "description": "Master React from basics to hooks",
      "skillLevel": "beginner",
      "progress": 30,
      "createdAt": "2025-12-01T10:00:00.000Z"
    }
  ]
}
```

---

### POST `/learning-paths`
Create a new learning path.

**Headers**: Requires JWT cookie

**Request Body**:
```json
{
  "name": "React Roadmap",
  "description": "Master React from basics to hooks",
  "skillLevel": "beginner"
}
```

**Validation**:
- `name`: required, 1-100 chars
- `description`: optional, max 500 chars
- `skillLevel`: required, enum [`beginner`, `intermediate`, `advanced`]

**Response** (201 Created):
```json
{
  "data": {
    "_id": "507f...",
    "name": "React Roadmap",
    "skillLevel": "beginner",
    "progress": 0
  }
}
```

---

### GET `/learning-paths/:id`
Get single learning path with chapter count.

**Headers**: Requires JWT cookie

**Response** (200 OK):
```json
{
  "data": {
    "_id": "507f...",
    "name": "React Roadmap",
    "description": "...",
    "skillLevel": "beginner",
    "progress": 30,
    "chapterCount": 10,
    "completedChapterCount": 3
  }
}
```

---

### PATCH `/learning-paths/:id`
Update learning path details.

**Headers**: Requires JWT cookie

**Request Body** (all fields optional):
```json
{
  "name": "Updated Name",
  "description": "Updated description",
  "skillLevel": "intermediate"
}
```

**Response** (200 OK):
```json
{
  "data": {
    "_id": "507f...",
    "name": "Updated Name",
    ...
  }
}
```

---

### DELETE `/learning-paths/:id`
Delete a learning path and all its chapters.

**Headers**: Requires JWT cookie

**Response** (200 OK):
```json
{
  "data": {
    "message": "Learning path and 10 chapters deleted successfully"
  }
}
```

---

## Chapters Endpoints

### GET `/learning-paths/:pathId/chapters`
Get all chapters for a learning path.

**Headers**: Requires JWT cookie

**Response** (200 OK):
```json
{
  "data": [
    {
      "_id": "507f...",
      "title": "Understanding Hooks",
      "difficulty": "medium",
      "estimatedMinutes": 45,
      "isCompleted": false,
      "notesCount": 2
    }
  ]
}
```

---

### POST `/learning-paths/:pathId/chapters`
Add a new chapter to a learning path.

**Headers**: Requires JWT cookie

**Request Body**:
```json
{
  "title": "Understanding Hooks",
  "description": "Learn useState and useEffect",
  "difficulty": "medium",
  "estimatedMinutes": 45
}
```

**Response** (201 Created):
```json
{
  "data": {
    "_id": "507f...",
    "title": "Understanding Hooks",
    ...
  }
}
```

---

### GET `/chapters/:id`
Get full chapter details including notes.

**Headers**: Requires JWT cookie

**Response** (200 OK):
```json
{
  "data": {
    "_id": "507f...",
    "title": "Understanding Hooks",
    "description": "...",
    "difficulty": "medium",
    "estimatedMinutes": 45,
    "isCompleted": false,
    "completionDate": null,
    "notes": [
      {
        "text": "useState manages local state",
        "createdAt": "2025-12-03T14:20:00.000Z"
      }
    ]
  }
}
```

---

### PATCH `/chapters/:id`
Update chapter details.

**Headers**: Requires JWT cookie

**Request Body** (all optional):
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "difficulty": "hard",
  "estimatedMinutes": 60
}
```

---

### PATCH `/chapters/:id/complete`
Mark chapter as completed (updates progress & streak).

**Headers**: Requires JWT cookie

**Response** (200 OK):
```json
{
  "data": {
    "chapter": {
      "isCompleted": true,
      "completionDate": "2025-12-04T11:00:00.000Z"
    },
    "streak": 7,
    "pathProgress": 40
  }
}
```

---

### POST `/chapters/:id/notes`
Add a note to a chapter.

**Headers**: Requires JWT cookie

**Request Body**:
```json
{
  "text": "useState creates reactive state variables"
}
```

**Response** (201 Created):
```json
{
  "data": {
    "notes": [
      {
        "text": "useState creates reactive state variables",
        "createdAt": "2025-12-04T11:00:00.000Z"
      }
    ]
  }
}
```

---

### DELETE `/chapters/:id`
Delete a chapter.

**Headers**: Requires JWT cookie

**Response** (200 OK):
```json
{
  "data": {
    "message": "Chapter deleted successfully"
  }
}
```

---

## AI Recommendation Endpoint

### POST `/ai/recommend`
Get AI-powered next chapter suggestion.

**Headers**: Requires JWT cookie

**Request Body**:
```json
{
  "learningPathId": "507f...",
  "timeAvailableMinutes": 60
}
```

**Response** (200 OK):
```json
{
  "data": {
    "nextChapterTitle": "React useEffect",
    "reason": "Natural progression after learning useState",
    "difficulty": "medium",
    "estimatedMinutes": 45,
    "exercises": [
      "Build a counter with useEffect",
      "Fetch data from an API"
    ],
    "strategy": "llm"
  }
}
```

**`strategy` values**:
- `llm` - Generated by Gemini AI
- `rule` - Rule-based fallback (when AI unavailable)

**Errors**:
- `429` - Rate limit exceeded (10 requests/min)
- `404` - Learning path not found

---

# Backend Architecture (NestJS)

## Folder Structure

```
backend/
│
├── src/
│   ├── app.module.ts              # Root module
│   ├── main.ts                    # Application entry point
│   │
│   ├── config/
│   │   ├── env.config.ts          # Environment configuration
│   │   ├── mongo.config.ts        # MongoDB configuration
│   │   └── ai.config.ts           # AI provider configuration
│   │
│   ├── common/
│   │   ├── guards/
│   │   │   └── auth.guard.ts      # Better Auth session guard
│   │   ├── decorators/
│   │   │   └── current-user.decorator.ts  # Extract user from request
│   │   ├── interceptors/
│   │   │   ├── transform.interceptor.ts   # Response formatting
│   │   │   └── logging.interceptor.ts     # Request logging
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts   # Global exception handling
│   │   └── utils/
│   │       ├── response.util.ts           # Response formatting helpers
│   │       └── date.util.ts               # Date utilities
│   │
│   ├── auth/
│   │   ├── auth.module.ts         # Better Auth module
│   │   ├── auth.service.ts        # Better Auth integration
│   │   └── auth.controller.ts     # Auth endpoint handler (/api/auth/*)
│   │
│   ├── database/
│   │   └── database.module.ts     # MongoDB/Mongoose configuration module
│   │
│   ├── schemas/
│   │   ├── learning-path.schema.ts  # Mongoose schema for LearningPath
│   │   ├── chapter.schema.ts        # Mongoose schema for Chapter
│   │   └── note.schema.ts           # Embedded schema for notes
│   │
│   ├── modules/
│   │   ├── users/
│   │   │   ├── users.module.ts
│   │   │   ├── users.service.ts       # User-related business logic
│   │   │   └── users.controller.ts    # User endpoints (optional for MVP)
│   │   │
│   │   ├── learning-paths/
│   │   │   ├── learning-paths.module.ts
│   │   │   ├── learning-paths.service.ts
│   │   │   ├── learning-paths.controller.ts
│   │   │   └── dto/
│   │   │       ├── create-learning-path.dto.ts
│   │   │       └── update-learning-path.dto.ts
│   │   │
│   │   ├── chapters/
│   │   │   ├── chapters.module.ts
│   │   │   ├── chapters.service.ts
│   │   │   ├── chapters.controller.ts
│   │   │   └── dto/
│   │   │       ├── create-chapter.dto.ts
│   │   │       ├── update-chapter.dto.ts
│   │   │       └── add-note.dto.ts
│   │   │
│   │   ├── progress/
│   │   │   ├── progress.module.ts
│   │   │   ├── progress.service.ts    # Progress calculation logic
│   │   │   └── progress.controller.ts # Progress endpoints
│   │   │
│   │   ├── streaks/
│   │   │   ├── streaks.module.ts
│   │   │   ├── streaks.service.ts     # Streak calculation logic
│   │   │   └── streaks.controller.ts  # Streak endpoints
│   │   │
│   │   └── ai/
│   │       ├── ai.module.ts
│   │       ├── ai.service.ts          # AI recommendation logic
│   │       ├── ai.controller.ts       # AI endpoints
│   │       ├── ai-client.service.ts   # Gemini API wrapper
│   │       └── dto/
│   │           └── get-recommendation.dto.ts
│   │
│   └── types/
│       ├── user.d.ts                  # User type extensions
│       └── auth-session.d.ts          # Better Auth session types
│
├── test/
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
│
├── .env.example
├── package.json
├── tsconfig.json
├── nest-cli.json
└── README.md
```

---

## NestJS Request Lifecycle

```
1. Client Request (HTTP)
         │
         ▼
2. Global Middleware (Optional)
   - CORS, body parser (built-in)
   - Request ID generation
         │
         ▼
3. Guards (@UseGuards)
   - AuthGuard → Verify Better Auth session
   - Extract user from session
         │
         ▼
4. Interceptors (Before) - @UseInterceptors
   - LoggingInterceptor → Log request details
   - TransformInterceptor → Prepare response format
         │
         ▼
5. Pipes (Validation) - @UsePipes / Auto-validation
   - ValidationPipe → Validate DTO with class-validator
   - Transform input to DTO instances
         │
         ▼
6. Controller Method (@Post, @Get, etc.)
   - Extract route params, body, user via decorators
   - Call service method via dependency injection
         │
         ▼
7. Service (Injectable)
   - Business logic execution
   - Interact with Mongoose models
   - Call other injected services
         │
         ▼
8. Mongoose Schema
   - Schema-level validation
   - Pre/post hooks (if defined)
   - Save to MongoDB
         │
         ▼
9. Interceptors (After)
   - Transform response data
   - Add metadata (timestamp, requestId)
         │
         ▼
10. Exception Filters (if error occurs)
    - HttpExceptionFilter → Format error response
    - Log errors
         │
         ▼
11. Response to Client
    - Standardized JSON format
```

### 🎓 NestJS Concepts Explained

**Guards**: Determine if a request should be handled (authentication, authorization)

**Interceptors**: Transform requests/responses, add logging, bind extra logic

**Pipes**: Transform and validate input data (DTOs with class-validator)

**Dependency Injection**: Services are automatically injected via constructor

**Decorators**: `@Controller`, `@Injectable`, `@Get`, `@Post`, `@Body`, etc.



---

## Example: Create Learning Path (NestJS)

### DTO (Data Transfer Object)
```typescript
// src/modules/learning-paths/dto/create-learning-path.dto.ts
import { IsString, IsEnum, IsOptional, MinLength, MaxLength } from 'class-validator';

export class CreateLearningPathDto {
  @IsString()
  @MinLength(1, { message: 'Name must not be empty' })
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Description must not exceed 500 characters' })
  description?: string;

  @IsEnum(['beginner', 'intermediate', 'advanced'], {
    message: 'Skill level must be beginner, intermediate, or advanced'
  })
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
}
```

### Controller
```typescript
// src/modules/learning-paths/learning-paths.controller.ts
import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { LearningPathsService } from './learning-paths.service';
import { CreateLearningPathDto } from './dto/create-learning-path.dto';
import { UpdateLearningPathDto } from './dto/update-learning-path.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('learning-paths')
@UseGuards(AuthGuard) // All routes require authentication
export class LearningPathsController {
  constructor(private readonly learningPathsService: LearningPathsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentUser('id') userId: string, // Extract user ID from session
    @Body() createDto: CreateLearningPathDto // Auto-validated by ValidationPipe
  ) {
    return this.learningPathsService.create(userId, createDto);
  }

  @Get()
  async findAll(@CurrentUser('id') userId: string) {
    return this.learningPathsService.findAll(userId);
  }

  @Get(':id')
  async findOne(
    @CurrentUser('id') userId: string,
    @Param('id') pathId: string
  ) {
    return this.learningPathsService.findOne(userId, pathId);
  }

  @Patch(':id')
  async update(
    @CurrentUser('id') userId: string,
    @Param('id') pathId: string,
    @Body() updateDto: UpdateLearningPathDto
  ) {
    return this.learningPathsService.update(userId, pathId, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @CurrentUser('id') userId: string,
    @Param('id') pathId: string
  ) {
    return this.learningPathsService.remove(userId, pathId);
  }
}
```

### Service
```typescript
// src/modules/learning-paths/learning-paths.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LearningPath, LearningPathDocument } from '../../schemas/learning-path.schema';
import { CreateLearningPathDto } from './dto/create-learning-path.dto';
import { UpdateLearningPathDto } from './dto/update-learning-path.dto';

@Injectable()
export class LearningPathsService {
  constructor(
    @InjectModel(LearningPath.name)
    private learningPathModel: Model<LearningPathDocument>
  ) {}

  async create(
    userId: string,
    createDto: CreateLearningPathDto
  ): Promise<LearningPath> {
    const learningPath = new this.learningPathModel({
      userId,
      name: createDto.name,
      description: createDto.description || '',
      skillLevel: createDto.skillLevel,
      progress: 0
    });

    await learningPath.save();
    return learningPath;
  }

  async findAll(userId: string): Promise<LearningPath[]> {
    return this.learningPathModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(userId: string, pathId: string): Promise<LearningPath> {
    const learningPath = await this.learningPathModel.findById(pathId).exec();

    if (!learningPath) {
      throw new NotFoundException('Learning path not found');
    }

    if (learningPath.userId.toString() !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return learningPath;
  }

  async update(
    userId: string,
    pathId: string,
    updateDto: UpdateLearningPathDto
  ): Promise<LearningPath> {
    const learningPath = await this.findOne(userId, pathId);

    Object.assign(learningPath, updateDto);
    await learningPath.save();

    return learningPath;
  }

  async remove(userId: string, pathId: string): Promise<void> {
    const learningPath = await this.findOne(userId, pathId);
    await learningPath.deleteOne();
  }
}
```

### Module
```typescript
// src/modules/learning-paths/learning-paths.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LearningPathsController } from './learning-paths.controller';
import { LearningPathsService } from './learning-paths.service';
import { LearningPath, LearningPathSchema } from '../../schemas/learning-path.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LearningPath.name, schema: LearningPathSchema }
    ])
  ],
  controllers: [LearningPathsController],
  providers: [LearningPathsService],
  exports: [LearningPathsService] // Export for use in other modules
})
export class LearningPathsModule {}
```

### Mongoose Schema (NestJS Style)
```typescript
// src/schemas/learning-path.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LearningPathDocument = LearningPath & Document;

@Schema({ timestamps: true })
export class LearningPath {
  @Prop({ type: Types.ObjectId, required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true, trim: true, minlength: 1, maxlength: 100 })
  name: string;

  @Prop({ trim: true, maxlength: 500, default: '' })
  description: string;

  @Prop({
    required: true,
    enum: ['beginner', 'intermediate', 'advanced']
  })
  skillLevel: string;

  @Prop({ default: 0, min: 0, max: 100 })
  progress: number;

  // Timestamps (createdAt, updatedAt) added automatically
}

export const LearningPathSchema = SchemaFactory.createForClass(LearningPath);

// Indexes
LearningPathSchema.index({ userId: 1, createdAt: -1 });
```

---

## NestJS Configuration Examples

### AuthGuard (Better Auth Integration)
```typescript
// src/common/guards/auth.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { auth } from '../../auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    try {
      // Verify Better Auth session
      const session = await auth.api.getSession({
        headers: request.headers
      });
      
      if (!session || !session.user) {
        throw new UnauthorizedException('Invalid or missing session');
      }
      
      // Attach user and session to request object
      request.user = session.user;
      request.session = session.session;
      
      return true;
    } catch (error) {
      throw new UnauthorizedException('Authentication failed');
    }
  }
}
```

### CurrentUser Decorator
```typescript
// src/common/decorators/current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);

// Usage in controller:
// @Get()
// async findAll(@CurrentUser() user: any) { ... }
//
// @Get()
// async findAll(@CurrentUser('id') userId: string) { ... }
```

### Better Auth Service
```typescript
// src/auth/auth.service.ts
import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI!);

export const auth = betterAuth({
  database: mongodbAdapter(client.db()),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false // Set true in production
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24 // Update session every 24 hours
  },
  user: {
    additionalFields: {
      learningStreak: {
        type: 'number',
        defaultValue: 0
      },
      lastActiveDate: {
        type: 'string',
        defaultValue: () => new Date().toISOString().split('T')[0]
      }
    }
  }
});
```

### Better Auth Controller
```typescript
// src/auth/auth.controller.ts
import { All, Controller, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { auth } from './auth.service';

@Controller('auth')
export class AuthController {
  @All('*')
  async handleAuth(@Req() req: Request, @Res() res: Response) {
    // Better Auth handles all /auth/* routes automatically
    return auth.handler(req, res);
  }
}
```

### Main Application Setup
```typescript
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix for all routes
  app.setGlobalPrefix('api/v1', {
    exclude: ['auth/*'] // Better Auth handles /auth/* directly
  });

  // Enable CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  });

  // Global validation pipe (auto-validate DTOs)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip props not in DTO
      forbidNonWhitelisted: true, // Throw error for extra props
      transform: true, // Auto-transform to DTO instances
      transformOptions: {
        enableImplicitConversion: true
      }
    })
  );

  const port = process.env.PORT || 5000;
  await app.listen(port);
  console.log(`🚀 Server running on http://localhost:${port}`);
}

bootstrap();
```

### Root App Module
```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { LearningPathsModule } from './modules/learning-paths/learning-paths.module';
import { ChaptersModule } from './modules/chapters/chapters.module';
import { AiModule } from './modules/ai/ai.module';
import { ProgressModule } from './modules/progress/progress.module';
import { StreaksModule } from './modules/streaks/streaks.module';

@Module({
  imports: [
    // Environment configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),

    // MongoDB connection
    MongooseModule.forRoot(process.env.MONGODB_URI!, {
      dbName: process.env.DB_NAME || 'skill-tracker'
    }),

    // Feature modules
    AuthModule,
    LearningPathsModule,
    ChaptersModule,
    AiModule,
    ProgressModule,
    StreaksModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
```

### HTTP Exception Filter (Optional)
```typescript
// src/common/filters/http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus
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
        message: typeof message === 'string' ? message : (message as any).message,
        timestamp: new Date().toISOString(),
        path: request.url
      }
    });
  }
}

// Apply globally in main.ts:
// app.useGlobalFilters(new HttpExceptionFilter());
```

### Transform Interceptor (Response Formatting)
```typescript
// src/common/interceptors/transform.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
  meta: {
    timestamp: string;
    path: string;
  };
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      map(data => ({
        data,
        meta: {
          timestamp: new Date().toISOString(),
          path: request.url
        }
      }))
    );
  }
}

// Apply globally in main.ts:
// app.useGlobalInterceptors(new TransformInterceptor());
```

---

# AI Integration (Simplified)


## Architecture

For MVP, we use a **simple synchronous approach**:

1. Client clicks "Get Suggestion" button
2. Frontend calls `POST /ai/recommend`
3. Backend checks in-memory cache (24h TTL)
4. If cache miss:
   - Call Gemini API with 5-second timeout
   - On success: cache and return
   - On failure: use rule-based fallback
5. Return suggestion to frontend

**No Redis, no queues, no workers needed!**

---

## AI Service Implementation

```typescript
// src/services/aiService.ts
import { callGeminiAPI } from './aiClient';
import { Chapter } from '../models/Chapter';
import { LearningPath } from '../models/LearningPath';
import { User } from '../models/User';

// In-memory cache: Map<cacheKey, { result, timestamp }>
const cache = new Map<string, { result: any; timestamp: number }>();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

interface AISuggestionInput {
  pathName: string;
  skillLevel: string;
  learningStreak: number;
  timeAvailableMinutes: number;
  completedChapterTitles: string[];
  incompleteChapterTitles: string[];
}

interface AISuggestionResult {
  nextChapterTitle: string;
  reason: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedMinutes: number;
  exercises?: string[];
  strategy: 'llm' | 'rule';
}

export async function getAISuggestion(
  userId: string,
  learningPathId: string,
  timeAvailable: number = 60
): Promise<AISuggestionResult> {
  
  // Check cache
  const today = new Date().toISOString().split('T')[0];
  const cacheKey = `${userId}-${learningPathId}-${today}`;
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    console.log('Returning cached AI suggestion');
    return cached.result;
  }
  
  // Gather data
  const user = await User.findById(userId);
  const path = await LearningPath.findById(learningPathId);
  const chapters = await Chapter.find({ learningPathId });
  
  if (!user || !path) {
    throw new Error('User or learning path not found');
  }
  
  const input: AISuggestionInput = {
    pathName: path.name,
    skillLevel: path.skillLevel,
    learningStreak: user.learningStreak,
    timeAvailableMinutes: timeAvailable,
    completedChapterTitles: chapters
      .filter(c => c.isCompleted)
      .map(c => c.title),
    incompleteChapterTitles: chapters
      .filter(c => !c.isCompleted)
      .map(c => c.title)
  };
  
  try {
    // Try AI first
    const result = await callGeminiAPI(input);
    const suggestion: AISuggestionResult = {
      ...result,
      strategy: 'llm'
    };
    
    // Cache and return
    cache.set(cacheKey, { result: suggestion, timestamp: Date.now() });
    return suggestion;
    
  } catch (error) {
    console.error('AI call failed, using rule-based fallback:', error);
    
    // Fallback to rules
    const fallback = ruleBasedSuggestion(chapters, timeAvailable);
    cache.set(cacheKey, { result: fallback, timestamp: Date.now() });
    return fallback;
  }
}

// Rule-based fallback
function ruleBasedSuggestion(
  chapters: any[],
  timeAvailable: number
): AISuggestionResult {
  const incomplete = chapters.filter(c => !c.isCompleted);
  
  // Strategy 1: Find next chapter that fits time
  const nextFitting = incomplete.find(c => c.estimatedMinutes <= timeAvailable);
  if (nextFitting) {
    return {
      nextChapterTitle: nextFitting.title,
      reason: 'Next chapter in your learning path',
      difficulty: nextFitting.difficulty,
      estimatedMinutes: nextFitting.estimatedMinutes,
      strategy: 'rule'
    };
  }
  
  // Strategy 2: Shortest chapter
  const shortest = incomplete.sort((a, b) => 
    a.estimatedMinutes - b.estimatedMinutes
  )[0];
  
  if (shortest) {
    return {
      nextChapterTitle: shortest.title,
      reason: 'Quick win to maintain momentum',
      difficulty: shortest.difficulty,
      estimatedMinutes: shortest.estimatedMinutes,
      strategy: 'rule'
    };
  }
  
  // Strategy 3: Review last completed
  const completed = chapters.filter(c => c.isCompleted);
  const lastCompleted = completed[completed.length - 1];
  
  return {
    nextChapterTitle: lastCompleted?.title || 'Review fundamentals',
    reason: 'Reinforce your knowledge',
    difficulty: 'easy',
    estimatedMinutes: Math.min(30, timeAvailable),
    strategy: 'rule'
  };
}
```

---

## Gemini API Client

```typescript
// src/services/aiClient.ts
import axios from 'axios';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export async function callGeminiAPI(input: any): Promise<any> {
  const prompt = buildPrompt(input);
  
  try {
    const response = await axios.post(
      `${GEMINI_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 300
        }
      },
      {
        timeout: 5000, // 5 second timeout
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
    const text = response.data.candidates[0].content.parts[0].text;
    return parseAIResponse(text);
    
  } catch (error: any) {
    throw new Error(`Gemini API error: ${error.message}`);
  }
}

function buildPrompt(input: any): string {
  return `You are an expert learning coach. Based on the learner's context, suggest the next chapter to study.

Context:
- Learning Path: ${input.pathName}
- Skill Level: ${input.skillLevel}
- Learning Streak: ${input.learningStreak} days
- Time Available: ${input.timeAvailableMinutes} minutes
- Completed Chapters: ${input.completedChapterTitles.join(', ') || 'None'}
- Remaining Chapters: ${input.incompleteChapterTitles.join(', ') || 'All completed'}

Respond with ONLY valid JSON (no markdown, no explanation):
{
  "nextChapterTitle": "string",
  "reason": "string (max 120 chars)",
  "difficulty": "easy|medium|hard",
  "estimatedMinutes": number,
  "exercises": ["exercise 1", "exercise 2"]
}

Rules:
- estimatedMinutes must be <= ${input.timeAvailableMinutes}
- Pick from remaining chapters if available
- If all complete, suggest revision
- Keep reason concise`;
}

function parseAIResponse(text: string): any {
  try {
    // Remove markdown code fences if present
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleaned);
    
    // Validate required fields
    if (!parsed.nextChapterTitle || !parsed.reason || !parsed.difficulty) {
      throw new Error('Missing required fields');
    }
    
    return {
      nextChapterTitle: String(parsed.nextChapterTitle),
      reason: String(parsed.reason).slice(0, 120),
      difficulty: parsed.difficulty,
      estimatedMinutes: Number(parsed.estimatedMinutes) || 30,
      exercises: Array.isArray(parsed.exercises) ? parsed.exercises.slice(0, 3) : []
    };
    
  } catch (error) {
    throw new Error('Invalid AI response format');
  }
}
```

---

## Rate Limiting for AI Endpoint

```typescript
// src/middleware/rateLimiter.ts
import rateLimit from 'express-rate-limit';

export const aiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  message: {
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many AI requests. Please try again later.'
    }
  }
});

// Apply to AI routes
// router.post('/recommend', aiRateLimiter, authMiddleware, getRecommendation);
```

---

# Frontend Overview

## Technology Choices

- **React 18** + **TypeScript**
- **React Router v6** for routing
- **React Query (TanStack Query)** for server state
- **Axios** for API calls
- **Context API** for auth state
- **Tailwind CSS** for styling

---

## Folder Structure

```
frontend/
├── src/
│   ├── api/
│   │   ├── axios.ts              # Axios instance
│   │   ├── auth.ts               # Auth API calls
│   │   ├── learningPaths.ts      # Learning path API
│   │   ├── chapters.ts           # Chapter API
│   │   └── ai.ts                 # AI API
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Card.tsx
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   └── PrivateRoute.tsx
│   │   └── features/
│   │       ├── LearningPathCard.tsx
│   │       ├── ChapterList.tsx
│   │       └── AISuggestionPanel.tsx
│   ├── context/
│   │   └── AuthContext.tsx       # Auth state
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useLearningPaths.ts   # React Query hooks
│   │   └── useChapters.ts
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Dashboard.tsx
│   │   ├── LearningPaths.tsx
│   │   ├── LearningPathDetail.tsx
│   │   └── ChapterDetail.tsx
│   ├── types/
│   │   └── index.ts              # TypeScript interfaces
│   ├── utils/
│   │   └── formatters.ts
│   ├── App.tsx
│   └── main.tsx
├── .env.example
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Authentication Flow

```typescript
// src/context/AuthContext.tsx
import { createContext, useState, useEffect } from 'react';
import { getCurrentUser } from '../api/auth';

interface User {
  _id: string;
  name: string;
  email: string;
  learningStreak: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
}

export const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is logged in on mount
    getCurrentUser()
      .then(userData => setUser(userData))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);
  
  return (
    <AuthContext.Provider value={{ user, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
```

---

## React Query Setup

```typescript
// src/hooks/useLearningPaths.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as learningPathsAPI from '../api/learningPaths';

export function useLearningPaths() {
  return useQuery({
    queryKey: ['learningPaths'],
    queryFn: learningPathsAPI.getAll,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
}

export function useCreateLearningPath() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: learningPathsAPI.create,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['learningPaths'] });
    }
  });
}
```

---

# Security & Validation

## Backend Security Checklist

- ✅ **JWT in httpOnly cookies** (prevents XSS)
- ✅ **CSRF protection** (SameSite=Strict)
- ✅ **Password hashing** (bcrypt, 12 rounds)
- ✅ **Input validation** (Zod schemas)
- ✅ **Rate limiting** (auth: 5/15min, AI: 10/min, general: 100/min)
- ✅ **CORS** (whitelist frontend origin)
- ✅ **Helmet.js** (security headers)
- ✅ **MongoDB injection prevention** (Mongoose escaping)

---

## Environment Variables

### Backend `.env.example`

```bash
# Server
NODE_ENV=development
PORT=5000

# Database
MONGO_URI=mongodb://localhost:27017/skill-tracker
# Or MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/skill-tracker

# JWT
JWT_SECRET=your-secret-key-min-32-characters-long
JWT_EXPIRES_IN=7d

# AI
GEMINI_API_KEY=your-gemini-api-key-here
AI_TIMEOUT_MS=5000

# Frontend (for CORS)
FRONTEND_URL=http://localhost:5173

# Optional
LOG_LEVEL=info
```

### Frontend `.env.example`

```bash
VITE_API_URL=http://localhost:5000/api/v1
```

---

# Development Roadmap

> **Note**: See `NestJS-BetterAuth-Guide.md` for detailed implementation examples

## Phase 1: NestJS Setup & Better Auth (Week 1)
- [ ] Initialize NestJS project (`nest new skill-tracker-backend`)
- [ ] Install dependencies (Better Auth, Mongoose, etc.)
- [ ] Setup Better Auth instance (`src/lib/auth.ts`)
- [ ] Mount Better Auth handler in `main.ts`
- [ ] Configure MongoDB connection with `@nestjs/mongoose`
- [ ] Setup environment variables (`.env`)
- [ ] Test Better Auth endpoints (register, login via Postman)
- [ ] Create Auth Guard using Better Auth sessions

## Phase 2: Learning Paths Module (Week 2)
- [ ] Create Learning Paths module skeleton
- [ ] Define Mongoose schema with `@Schema()` decorator
- [ ] Create DTOs (create, update) with validation
- [ ] Implement service layer (CRUD operations)
- [ ] Implement controller with `@UseGuards(AuthGuard)`
- [ ] Test all endpoints (create, read, update, delete)
- [ ] Implement progress calculation service

## Phase 3: Chapters Module (Week 2-3)
- [ ] Create Chapters module skeleton
- [ ] Define Chapter schema (with embedded notes)
- [ ] Create DTOs (create chapter, update, add note)
- [ ] Implement service layer
- [ ] Implement controller with auth guards
- [ ] Implement streak calculation service
- [ ] Create "mark complete" endpoint (updates streak + progress)
- [ ] Test all chapter operations

## Phase 4: AI Integration (Week 3)
- [ ] Create AI module
- [ ] Implement Gemini API client service
- [ ] Implement in-memory caching (Map)
- [ ] Implement rule-based fallback
- [ ] Create `/ai/recommend` endpoint
- [ ] Test AI responses and fallback logic
- [ ] Add rate limiting (10 req/min)

## Phase 5: Frontend Setup (Week 4)
- [ ] Initialize React + TypeScript (Vite)
- [ ] Install Better Auth React (`better-auth/react`)
- [ ] Create auth client (`src/lib/auth-client.ts`)
- [ ] Setup AuthContext or use `useSession` hook
- [ ] Create Login/Register pages
- [ ] Implement protected routes
- [ ] Setup React Query for API calls
- [ ] Create dashboard layout

## Phase 6: Frontend Features (Week 5)
- [ ] Learning paths list page (with create form)
- [ ] Learning path detail page
- [ ] Chapters list component
- [ ] Chapter detail with completion toggle
- [ ] Notes UI (add/display)
- [ ] AI suggestion panel component
- [ ] Responsive design (mobile-first)
- [ ] Loading states and error handling
- [ ] User profile page (streak display)

## Phase 7: Deployment (Week 6)
- [ ] Setup MongoDB Atlas cluster
- [ ] Create Railway/Render project
- [ ] Configure environment variables on Railway
- [ ] Deploy backend (test endpoints)
- [ ] Create Vercel project for frontend
- [ ] Configure CORS (backend → allow Vercel URL)
- [ ] Update Better Auth URL to production
- [ ] Test full auth flow in production
- [ ] Write README with setup instructions
- [ ] Document API endpoints

---

## Quick Start Commands

### Backend (NestJS)
```bash
# Install NestJS CLI globally
npm install -g @nestjs/cli

# Create new project
nest new skill-tracker-backend

# Install dependencies
npm install better-auth mongodb @nestjs/mongoose mongoose
npm install class-validator class-transformer

# Run development server
npm run start:dev
```

### Frontend (React + Vite)
```bash
# Create new Vite project
npm create vite@latest skill-tracker-frontend -- --template react-ts

# Install dependencies
npm install better-auth @tanstack/react-query axios react-router-dom

# Run development server
npm run dev
```

---

# MongoDB Learning Guide

## 🎓 Key Concepts for Beginners

### 1. Collections vs Tables
- **SQL**: Tables with fixed columns
- **MongoDB**: Collections with flexible documents (JSON-like)

### 2. Documents vs Rows
- **SQL**: Rows with same structure in a table
- **MongoDB**: Documents can have different fields

### 3. ObjectId
- Unique 12-byte identifier for each document
- Includes timestamp (creation time)
- Generated automatically by MongoDB

### 4. Embedded Documents
Instead of multiple tables with foreign keys:
```javascript
// You can embed data directly
{
  title: "Chapter 1",
  notes: [
    { text: "Note 1", createdAt: "..." },
    { text: "Note 2", createdAt: "..." }
  ]
}
```

### 5. Indexes
Make queries faster. Always index:
- Fields you search frequently (e.g., `email`, `userId`)
- Fields you sort by (e.g., `createdAt`)

### 6. Mongoose Benefits
- Schema validation
- Type safety with TypeScript
- Middleware (hooks)
- Virtuals (computed properties)
- Population (like SQL JOINs)

---

## Common MongoDB Operations

### Create (Insert)
```typescript
const user = new User({ name: "Adnan", email: "..." });
await user.save();
```

### Read (Find)
```typescript
// Find all
const users = await User.find();

// Find one
const user = await User.findById(userId);

// Find with conditions
const paths = await LearningPath.find({ 
  userId, 
  skillLevel: 'beginner' 
});

// Find with sorting
const paths = await LearningPath
  .find({ userId })
  .sort({ createdAt: -1 }); // -1 = descending
```

### Update
```typescript
// Update one field
await User.findByIdAndUpdate(userId, { 
  learningStreak: 10 
});

// Update multiple fields
const user = await User.findById(userId);
user.learningStreak = 10;
user.lastActiveDate = today;
await user.save();
```

### Delete
```typescript
await LearningPath.findByIdAndDelete(pathId);

// Delete many
await Chapter.deleteMany({ learningPathId });
```

### Count
```typescript
const total = await Chapter.countDocuments({ learningPathId });
const completed = await Chapter.countDocuments({ 
  learningPathId, 
  isCompleted: true 
});
```

### Population (Join)
```typescript
const path = await LearningPath
  .findById(pathId)
  .populate('userId', 'name email'); // Load user data
```

---

## Best Practices

1. **Always validate input** (Zod + Mongoose schemas)
2. **Use indexes** for frequently queried fields
3. **Avoid deep nesting** (max 2-3 levels)
4. **Use lean()** for read-only queries (faster)
   ```typescript
   const paths = await LearningPath.find().lean(); // Returns plain JS objects
   ```
5. **Handle errors** properly
   ```typescript
   try {
     await user.save();
   } catch (error) {
     if (error.code === 11000) {
       // Duplicate key error (e.g., email already exists)
     }
   }
   ```

---

## Useful Resources

- [MongoDB Official Docs](https://www.mongodb.com/docs/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [MongoDB University (Free Courses)](https://learn.mongodb.com/)
- [MongoDB Atlas Setup Guide](https://www.mongodb.com/docs/atlas/getting-started/)

---

# Next Steps

1. **Review this document** thoroughly
2. **Setup MongoDB Atlas** free cluster
3. **Follow the roadmap** phase by phase
4. **Build, test, learn!**

---

# Summary of Improvements from Original Design

| Aspect | Original | Streamlined |
|--------|----------|-------------|
| Collections | 7 | 3 |
| Background Jobs | BullMQ + Redis | None (synchronous) |
| AI Infrastructure | Complex worker queues | Simple cache + timeout |
| Database ORM | Native driver | Mongoose (better DX) |
| Deployment Complexity | High | Low (free tiers) |
| Learning Curve | Steep | Beginner-friendly |
| Lines of Code | ~15,000 | ~5,000 (estimated) |
| Time to MVP | 8+ weeks | 5-6 weeks |

---

**You now have a production-ready, beginner-friendly system design for your first MongoDB project!** 🎉

Start with Phase 1 and build incrementally. Good luck!
