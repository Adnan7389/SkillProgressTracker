# Learning Guide: Essential Topics for Skill Progress Tracker

This guide covers **only the topics you need** to build this project. Skip everything else for now!

---

## 📚 Learning Order (Recommended)

1. **Start Here**: MongoDB Basics (2-3 hours)
2. **Then**: NestJS Core Concepts (4-5 hours)
3. **Finally**: Better Auth Integration (1-2 hours)
4. **Bonus**: TypeScript basics (if needed)

**Total Time**: ~8-10 hours of focused learning before you start building.

---

# 1️⃣ MongoDB Fundamentals (What You Need)

## ✅ Must Learn

### **A. Basic Concepts** (30 min)
- [ ] What is a document vs collection
- [ ] ObjectId (MongoDB's unique ID)
- [ ] How JSON-like documents work
- [ ] Difference from SQL (no rigid tables)

**Resources**:
- MongoDB University: [M001 Course (Free)](https://learn.mongodb.com/courses/mongodb-basics) - Watch only Chapter 1-2
- Or read: [MongoDB Docs - What is MongoDB](https://www.mongodb.com/docs/manual/introduction/)

### **B. CRUD Operations** (1 hour)
You'll do these operations constantly:

```javascript
// CREATE
db.collection.insertOne({ name: "React Roadmap" })

// READ
db.collection.find({ userId: "123" })
db.collection.findOne({ _id: ObjectId("...") })

// UPDATE
db.collection.updateOne({ _id: "..." }, { $set: { progress: 50 } })

// DELETE
db.collection.deleteOne({ _id: "..." })
```

**Practice**:
- [MongoDB Playground](https://mongoplayground.net/) - Try these operations
- Or use MongoDB Compass (GUI tool)

### **C. Mongoose (ODM) Basics** (1.5 hours)

**What is Mongoose?** Think of it as TypeScript's way to talk to MongoDB safely.

**You need to know:**

1. **Schemas** - Define structure
```typescript
const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true }
});
```

2. **Models** - Use schemas to interact with DB
```typescript
const User = mongoose.model('User', userSchema);
await User.create({ name: "Adnan", email: "..." });
```

3. **Queries**
```typescript
await User.find({ email: "adnan@example.com" });
await User.findById(userId);
await User.findByIdAndUpdate(userId, { name: "New Name" });
```

**Resources**:
- [Mongoose Quick Start](https://mongoosejs.com/docs/index.html) - Read "Getting Started"
- [Mongoose Schemas Guide](https://mongoosejs.com/docs/guide.html)

### **D. Useful Mongoose Features** (30 min)

**For this project, you'll use:**

1. **Embedded Documents** (like notes inside chapters)
```typescript
const chapterSchema = new Schema({
  title: String,
  notes: [{ text: String, createdAt: Date }] // Embedded!
});
```

2. **Timestamps** (auto createdAt/updatedAt)
```typescript
const schema = new Schema({...}, { timestamps: true });
```

3. **Indexes** (make queries faster)
```typescript
schema.index({ userId: 1, createdAt: -1 });
```

4. **Validation**
```typescript
email: {
  type: String,
  required: true,
  match: /^\S+@\S+\.\S+$/
}
```

---

## ❌ Skip for Now (Not Needed for MVP)

- ❌ Aggregation pipelines
- ❌ Transactions
- ❌ Sharding
- ❌ Replication
- ❌ GridFS
- ❌ Map-Reduce
- ❌ Advanced indexing strategies

You can learn these in Phase 2!

---

# 2️⃣ NestJS Fundamentals (What You Need)

## ✅ Must Learn

### **A. Core Architecture** (1 hour)

**The 3 Main Pieces:**

1. **Modules** = Folders that group related code
```typescript
@Module({
  imports: [MongooseModule.forFeature([...])],
  controllers: [LearningPathsController],
  providers: [LearningPathsService],
})
export class LearningPathsModule {}
```

2. **Controllers** = Handle HTTP requests
```typescript
@Controller('learning-paths')
export class LearningPathsController {
  @Post()
  create(@Body() dto: CreateDto) {
    // Handle POST /learning-paths
  }
}
```

3. **Services** = Business logic (talks to database)
```typescript
@Injectable()
export class LearningPathsService {
  constructor(@InjectModel(LearningPath.name) private model: Model<LearningPath>) {}
  
  async create(data) {
    return this.model.create(data);
  }
}
```

**Resources**:
- [NestJS First Steps](https://docs.nestjs.com/first-steps) - Follow the guide (30 min)
- [NestJS Overview](https://docs.nestjs.com/first-steps) - Read "Controllers" and "Providers"

### **B. Dependency Injection** (30 min)

**What is it?** NestJS automatically creates and passes instances for you.

```typescript
// Instead of this (manual):
const service = new LearningPathsService(model);

// NestJS does this (automatic):
constructor(private service: LearningPathsService) {}
// service is now ready to use!
```

**Why it matters**: You don't manually create classes. NestJS injects them.

**Resources**:
- [NestJS Providers](https://docs.nestjs.com/providers)

### **C. Decorators** (30 min)

**What are they?** Those `@Something()` things that add behavior.

**You'll use these constantly:**

```typescript
// Class decorators
@Controller('users')
@Injectable()
@Schema()

// Method decorators
@Get()
@Post()
@Patch()
@Delete()
@UseGuards(AuthGuard)

// Parameter decorators
@Body()
@Param('id')
@Request()
```

**Resources**:
- [NestJS Controllers](https://docs.nestjs.com/controllers) - Focus on decorators section

### **D. Validation with DTOs** (45 min)

**DTOs = Data Transfer Objects** = Define what data is allowed in requests.

```typescript
export class CreateLearningPathDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @IsEnum(['beginner', 'intermediate', 'advanced'])
  skillLevel: string;
}
```

**Why?** Automatic validation - if user sends invalid data, NestJS rejects it!

**Resources**:
- [NestJS Validation](https://docs.nestjs.com/techniques/validation)
- [class-validator docs](https://github.com/typestack/class-validator)

### **E. Guards (For Authentication)** (30 min)

**What?** Code that runs before your route to check authentication.

```typescript
@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    // Check if user is logged in
    // Return true = allow, false = block
  }
}

// Usage:
@UseGuards(AuthGuard)
@Get('profile')
getProfile() { }
```

**Resources**:
- [NestJS Guards](https://docs.nestjs.com/guards)

### **F. Mongoose Integration** (1 hour)

**How NestJS + Mongoose work together:**

```typescript
// 1. Define schema
@Schema({ timestamps: true })
export class LearningPath {
  @Prop({ required: true })
  name: string;
}

export const LearningPathSchema = SchemaFactory.createForClass(LearningPath);

// 2. Register in module
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LearningPath.name, schema: LearningPathSchema }
    ])
  ]
})

// 3. Inject in service
constructor(
  @InjectModel(LearningPath.name) 
  private model: Model<LearningPath>
) {}
```

**Resources**:
- [NestJS Mongoose](https://docs.nestjs.com/techniques/mongodb)

### **G. Configuration (@nestjs/config)** (30 min)

**For environment variables:**

```typescript
// Load .env file
ConfigModule.forRoot({ isGlobal: true })

// Use in code
constructor(private configService: ConfigService) {}

const dbUri = this.configService.get<string>('MONGO_URI');
```

**Resources**:
- [NestJS Configuration](https://docs.nestjs.com/techniques/configuration)

---

## ❌ Skip for Now (Not Needed for MVP)

- ❌ Microservices
- ❌ WebSockets
- ❌ GraphQL
- ❌ CQRS
- ❌ Event Emitters
- ❌ Task Scheduling
- ❌ Queues
- ❌ Swagger (OpenAPI) - nice to have but skip for now
- ❌ Custom decorators
- ❌ Interceptors (unless for logging)
- ❌ Pipes beyond validation

---

# 3️⃣ Better Auth Essentials (What You Need)

## ✅ Must Learn

### **A. Core Concept** (15 min)

**What is Better Auth?** A library that handles authentication completely.

**You don't write:**
- Password hashing
- JWT creation
- Session management
- Cookie handling

**Better Auth does all of this!**

### **B. Installation & Setup** (30 min)

```typescript
// 1. Install
npm install better-auth mongodb

// 2. Create auth instance
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

export const auth = betterAuth({
  database: mongodbAdapter(client),
  emailAndPassword: { enabled: true },
  // That's it!
});

// 3. Mount in NestJS
app.use('/api/auth/*', (req, res) => auth.handler(req, res));
```

**Resources**:
- [Better Auth Installation](https://www.better-auth.com/docs/installation)

### **C. Using Sessions in Your App** (30 min)

**Get current user in your controllers:**

```typescript
// Create guard
@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const session = await auth.api.getSession({ headers: request.headers });
    
    if (!session) return false;
    
    request.user = session.user; // Attach user to request
    return true;
  }
}

// Use in controller
@UseGuards(AuthGuard)
@Get('profile')
getProfile(@Request() req) {
  const userId = req.user.id; // Get current user!
}
```

**Resources**:
- [Better Auth Session Management](https://www.better-auth.com/docs/concepts/session-management)

### **D. Frontend Integration** (30 min)

```typescript
// React side
import { createAuthClient } from "better-auth/react";

export const { signIn, signUp, useSession } = createAuthClient({
  baseURL: "http://localhost:5000"
});

// Usage
await signIn.email({ email, password });
const { data: session } = useSession();
```

**Resources**:
- Check `NestJS-BetterAuth-Guide.md` (you already have this!)

### **E. Extending User Model** (15 min)

**Add custom fields (like learning streak):**

```typescript
export const auth = betterAuth({
  user: {
    additionalFields: {
      learningStreak: {
        type: "number",
        defaultValue: 0
      }
    }
  }
});
```

---

## ❌ Skip for Now (Not Needed for MVP)

- ❌ OAuth providers (Google, GitHub) - add in Phase 2
- ❌ Two-factor authentication (2FA)
- ❌ Email verification
- ❌ Password reset flows
- ❌ Custom session stores
- ❌ Advanced security options

---

# 4️⃣ TypeScript Essentials (If Needed)

## ✅ Basics You Need

If you're new to TypeScript, learn these:

### **A. Types & Interfaces** (30 min)
```typescript
interface User {
  id: string;
  name: string;
  email: string;
}

type SkillLevel = 'beginner' | 'intermediate' | 'advanced';
```

### **B. Decorators** (covered in NestJS)

### **C. Async/Await** (30 min)
```typescript
async function getData() {
  const result = await fetchSomething();
  return result;
}
```

**Resources**:
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html) - Read "The Basics"

---

# 📅 Recommended 3-Day Learning Plan

## **Day 1: MongoDB** (3-4 hours)
- ✅ Morning: MongoDB basics (documents, collections, CRUD)
- ✅ Afternoon: Mongoose (schemas, models, queries)
- ✅ Practice: Create a simple schema in MongoDB Compass

## **Day 2: NestJS** (4-5 hours)
- ✅ Morning: NestJS architecture (modules, controllers, services)
- ✅ Afternoon: Decorators, DTOs, Guards
- ✅ Evening: Follow NestJS "First Steps" tutorial
- ✅ Practice: Build a simple "Hello World" API

## **Day 3: Better Auth + Integration** (2-3 hours)
- ✅ Morning: Better Auth setup
- ✅ Afternoon: NestJS + Mongoose integration
- ✅ Practice: Set up auth in your NestJS app

**After Day 3**: Start building the project! 🚀

---

# 🎯 How to Use This Guide

### **Step 1: Pick Your Learning Style**

**Option A - Video Learner:**
- NestJS: [NestJS Crash Course](https://www.youtube.com/results?search_query=nestjs+crash+course+2024) (YouTube)
- MongoDB: [MongoDB Crash Course](https://www.youtube.com/results?search_query=mongodb+crash+course)

**Option B - Documentation Reader:**
- Follow the links in each section above
- Read official docs

**Option C - Learn by Doing:**
- Skim the concepts
- Start building
- Look up topics when you need them

### **Step 2: Don't Over-Learn**

**Red Flag 🚩**: Spending more than 10 hours learning before coding

**Instead**:
- Learn basics (8-10 hours max)
- Start building
- Learn more as you encounter problems

### **Step 3: Use Your Guides**

You already have:
- ✅ `SkillProgressTracker-MVP.md` - Full architecture
- ✅ `NestJS-BetterAuth-Guide.md` - Complete code examples

**When stuck**: Search these files first!

---

# 🔖 Quick Reference Cheat Sheet

## MongoDB Queries (You'll Use Daily)
```typescript
// Find all
await Model.find({ userId });

// Find one by ID
await Model.findById(id);

// Create
await Model.create({ name: "..." });

// Update
await Model.findByIdAndUpdate(id, { name: "New" }, { new: true });

// Delete
await Model.findByIdAndDelete(id);

// Count
await Model.countDocuments({ userId, isCompleted: true });
```

## NestJS Controller Patterns
```typescript
@Controller('resource')
export class ResourceController {
  constructor(private service: ResourceService) {}

  @Post()
  create(@Body() dto: CreateDto) {}

  @Get()
  findAll(@Request() req) {}

  @Get(':id')
  findOne(@Param('id') id: string) {}

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDto) {}

  @Delete(':id')
  remove(@Param('id') id: string) {}
}
```

## Better Auth Integration
```typescript
// Get session
const session = await auth.api.getSession({ headers: request.headers });

// Get user ID
const userId = session.user.id;

// In guard
if (!session) throw new UnauthorizedException();
```

---

# ✅ Learning Checklist

Track your progress:

## MongoDB
- [ ] Understand documents vs collections
- [ ] Can write basic queries (find, create, update, delete)
- [ ] Understand Mongoose schemas
- [ ] Know how to use Model.create() and Model.find()
- [ ] Understand embedded documents

## NestJS
- [ ] Understand modules, controllers, services
- [ ] Can create a basic CRUD controller
- [ ] Know how to use @Body(), @Param(), @Request()
- [ ] Understand dependency injection basics
- [ ] Can create and use a Guard
- [ ] Know how to validate with DTOs

## Better Auth
- [ ] Can set up Better Auth in NestJS
- [ ] Understand how sessions work
- [ ] Can protect routes with auth guard
- [ ] Know how to get current user in controller

---

# 🎓 After You Finish Learning

**You're ready to build when you can:**
- ✅ Create a NestJS module with controller + service
- ✅ Define a Mongoose schema
- ✅ Create a POST endpoint that saves to MongoDB
- ✅ Create a GET endpoint that retrieves data
- ✅ Protect a route with an auth guard

**If you can do these 5 things, START BUILDING!** You'll learn the rest while coding. 🚀

---

**Questions?** Start with the official tutorials, then come back to this guide when you're building the actual project!
