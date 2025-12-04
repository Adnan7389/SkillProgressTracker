# Step 1 — Requirements & Goals

**Project:** AI-Powered Skill Progress Tracker (Backend-Focused MERN System)
**LLM:** Gemini API (default) / or any low-cost/free LLM

---

## 1. Project Summary

The **Skill Progress Tracker** is a backend-focused MERN platform that helps learners track their progress, skill level, streak, and study sessions — and receive **AI-powered personalized learning suggestions**.

Users can create **any learning path** (React, Backend, DevOps, DBMS, DSA, Cloud, etc.).
The AI generates **chapters/concepts** automatically based on user skill level and learning history.

This system has a single user type (**Learner**) for the MVP.

---

## 2. Stakeholders

* **Learner (single user type)** — regular user learning new skills.
* **Maintainers** — developers maintaining the system.
* **LLM Provider** — Gemini API or free/low-cost LLM service.

---

## 3. Goals (Success Targets)

* Help learners track progress consistently.
* Provide trusted AI suggestions for chapters/concepts to learn next.
* Use low-cost/free LLM options to keep the system sustainable.
* Improve user retention through learning streaks and daily reminders.
* Target suggestion-rating ≥4/5 for at least 60% of suggestions.
* API median latency <200ms for read operations.

---

## 4. Functional Requirements (MVP)

### **A. Core Learning Features**

1. User registration & login (JWT).

2. User can add **any custom stack/course** such as:

   * React
   * Frontend
   * Backend
   * DevOps
   * DBMS
   * DSA
   * Cybersecurity
   * AI/ML

3. Each stack/course includes:

   * User-provided skill level (Beginner / Intermediate / Advanced)
   * Learning goal
   * Any custom notes

4. Learner can:

   * Add chapters (manually) OR
   * Let **AI generate chapters** based on skill level & goals.
   * Mark chapters as completed
   * Log study sessions
   * Track streaks
   * Add notes
   * View progress %

---

### **B. AI Suggestion Engine**

**LLM: Gemini API (preferred) — or any free/low-cost LLM**

AI must generate:

* **Customized chapters/concepts** for the chosen stack.
* **“What to learn next”** suggestions based on:

  * User skill level
  * Completed chapters
  * Time spent
  * Learning streak
  * Weak/neglected areas
* Each AI response must include:

  ```json
  {
    "chapter": "Understanding useEffect",
    "reason": "You completed JSX & state, next logical step",
    "difficulty": "Intermediate",
    "estMinutes": 25,
    "confidence": 0.83
  }
  ```

AI suggestions get saved into history and can receive feedback.

---

### **C. Background Jobs**

* A daily scheduled job:

  * Generates an AI suggestion
  * Sends notification (Email or Telegram)
* Reminders respect the user’s timezone.
* Uses Redis + BullMQ.

---

### **D. Analytics**

* Weekly summary
* Total study time
* Skill-based time distribution
* Streak status
* Weak areas (AI-generated)

---

## 5. Non-Functional Requirements

* **LLM cost efficiency:**

  * Use Gemini 1.5 Flash or other inexpensive LLMs.
  * Cache AI responses to reduce cost.
* **Performance:**

  * Reads <200ms
  * Writes <350ms
* **Reliability:**

  * Queue retries, DLQ
* **Security:**

  * JWT auth, input validation, password hashing
* **Privacy:**

  * Minimal PII
  * Data export/delete supported

---

## 6. Constraints & Assumptions

* Only one user type (Learner) in MVP.
* AI chapters are optional; user can add chapters manually.
* Gemini API is the default LLM for suggestions.
* MongoDB for persistence.
* Redis for caching + queues.
* No “admin panel” needed in MVP.

---

## 7. Success Metrics (KPIs)

* Daily active learners
* Weekly retention
* Average daily study time
* Streak retention (7-day, 30-day)
* AI suggestion acceptance rate
* Cost per 100 AI calls
* Job failure rate
* API latency performance

---

## 8. MVP Scope

### **Included**

* Authentication
* Add any custom stack/course
* User skill level → affects AI generation
* Add chapters manually or via AI
* Log study sessions
* Track learning streak
* Daily suggestion & reminder
* Analytics overview
* Chapter completion tracking
* Suggestion feedback system

### **Excluded (Phase 2+)**

* Full admin system
* Multi-user roles (like mentors)
* Leaderboards
* AI progress prediction
* Paid plans
* Mobile app

---

## 9. Top User Stories

1. **As a learner**, I can add a custom course and define my skill level.
2. **As a learner**, I can generate AI-created chapters based on skill level.
3. **As a learner**, I can log daily learning sessions.
4. **As a learner**, I receive daily AI suggestions about what to study next.
5. **As a learner**, I can track my streak and total progress.
6. **As a learner**, I want weekly summaries showing what I achieved.
7. **As a learner**, I want to rate AI suggestions to improve accuracy.

---

## 10. Acceptance Criteria

### **AI Chapter Generation**

* When the learner enters skill level + course name, the AI returns a list of chapters:

```json
[
  { "title": "JSX Basics", "difficulty": "Beginner", "estMinutes": 30 },
  { "title": "State & Props", "difficulty": "Beginner", "estMinutes": 40 }
]
```

* The chapters must reflect the skill level.

### **Daily AI Suggestion**

* Must consider streak + completed chapters.
* Must respond within 1 second (rule-based fallback allowed).
* Must store suggestion history.

### **Progress Tracking**

* Marking a chapter completed updates progress %.
* Logging a session increases streak if it's a new day.
* Weekly summary email sent every Sunday (configurable).

---

## 11. Risks & Mitigations

| Risk                         | Mitigation                                  |
| ---------------------------- | ------------------------------------------- |
| AI cost becomes too high     | Use Gemini Flash + caching                  |
| AI returns unstable output   | Schema validation + fallback rule-based     |
| Queue overload               | Concurrency limits + DLQ                    |
| Low user engagement          | Streaks + reminders + weekly progress email |
| Incorrect chapter sequencing | Allow user edits + AI reordering            |

---

Here is the **corrected Step 2 — High-Level Solution Overview** rewritten for **MongoDB + TypeScript + AI**.
You can copy–paste directly into your `SkillProgressTracker.md`.

---

# **Step 2 — High-Level Solution Overview (TypeScript + AI + MongoDB)**

## **🎯 What this system is**

A **learning progress tracking platform** for learners like you who study multiple technologies (React, Node.js, TypeScript, Django, DevOps, etc.) and need:

* Organized progress tracking
* Personalized learning path
* AI-recommended next steps
* Daily streak motivation

MVP includes **only one user type: Learner**.

The system will be built with:

* **Frontend:** React + TypeScript
* **Backend:** Node.js/Express + TypeScript
* **Database:** MongoDB (Mongoose ORM)
* **AI:** Gemini API or low-cost alternatives (Groq Llama 3, DeepSeek, etc.)

---

# **🔧 System Capabilities (High-Level)**

## 1. **User Skill Profile**

A learner can:

* Add any skill (React, Backend, TypeScript, Git…)
* Set current skill level (Beginner → Advanced)
* Add learning goals & preferred roadmap
* Track what they already know

All saved in MongoDB as flexible documents.

---

## 2. **Custom Learning Stacks (Any Technology)**

Users can add any learning journey:

* “React Roadmap”
* “Node Backend”
* “TypeScript Basics”
* “Full-Stack Development”
* “Django for Beginners”

Each stack contains:

* Chapters
* Concepts
* Milestones
* Estimated learning time
* AI-generated suggestions

MongoDB schema allows flexible and nested chapters.

---

## 3. **AI-Powered “Next Steps” Recommendation Engine**

AI analyzes:

* Skills + ratings
* Learning streak
* Completed chapters
* User’s pace
* Difficulty history
* Notes (optional)

AI returns:

* The next concept to learn
* Difficulty level
* Why this is recommended
* Daily learning task
* Estimated time
* Optional micro-explanation

This will use Gemini API or Groq’s free tier for cheap inference.

---

## 4. **Progress Tracking**

The platform allows users to:

* Mark chapters completed
* Update progress %
* Track learning streak (days active)
* Add reflective notes
* View history of completed modules
* See weekly stats

Backend updates streaks & progress automatically.

---

## 5. **Daily AI Check-In **

AI can generate:

* Daily learning goals
* Quick motivational summaries
* Recommended revision topics

(This can be added after MVP launch.)

---

# **📐 High-Level Architecture (MongoDB Version)**

```
📱 Frontend (React + TypeScript)
 |
 | REST API
 v
🖥️ Backend (Node.js + Express + TypeScript)
 |
 | Mongoose ODM
 v
🗄️ MongoDB (skills, stacks, chapters, progress, notes)
 |
 | HTTP Request
 v
🤖 AI Microservice (Gemini / Groq / DeepSeek)
```

---

# **🧠 AI Interaction Logic**

## Input sent to AI:

```
{
  skills: [...],
  current_levels: {...},
  selected_stack: "React Roadmap",
  completed_chapters: [...],
  learning_streak: 5,
  pace: "medium"
}
```

## AI Output:

```
{
  next_chapter: "React useEffect",
  difficulty: "medium",
  reason: "You already learned component lifecycle basics",
  daily_target: "Learn useEffect basics + 1 practice exercise",
  estimated_time: "45 minutes"
}
```

Backend saves this and displays it on Dashboard.

---

# **🚀 MVP Scope (MongoDB Version)**

## Must-Have Features

* User profile (skills, levels, goals)
* Create any custom learning stack
* Add chapters/concepts
* Update progress
* Track learning streak
* Notes for each chapter
* AI: “What to learn next?” suggestions

## Optional (Next Versions)

* AI-generated full roadmaps
* Community shared roadmaps
* Leaderboards
* Mobile app

---

# **📝 Tech Summary**

* **TypeScript everywhere**
* **React (TS)** for UI
* **Node.js/Express (TS)** for backend
* **MongoDB + Mongoose** for schema flexibility
* **Gemini/Groq/DeepSeek APIs** for AI features
* **Authentication (JWT/Auth.js)**

---

Here is **Step 3 — Define System Components**, fully formatted for direct copy-paste into your `SkillProgressTracker.md`.

---

# **Step 3 — Define System Components**

This step identifies the **core components/modules** your system will be made of.
Each component represents a major part of the architecture and has clear responsibilities.

---

# **📦 1. User Module**

Handles everything related to the learner.

### **Responsibilities**

* Store basic user profile
* Track learning streak
* Save preferred learning pace
* Store overall skill rating summary
* Link the user to multiple stacks

### **Main Data**

* Name
* Email (optional for MVP)
* Skills & current levels
* Learning streak
* Joined stacks

---

# **📦 2. Skills Module**

Users can add ANY skill (React, TypeScript, Backend Development, Git, etc.).

### **Responsibilities**

* Add a new skill
* Update skill level
* Associate skill with stacks
* Provide data to AI for recommendations

### **Main Data**

* skillName
* currentLevel
* confidenceScore (optional)
* tags

---

# **📦 3. Learning Stack Module**

A “stack” = a learning journey the user creates.

Examples:

* “React Roadmap”
* “Backend Development”
* “Data Structures for Interviews”

### **Responsibilities**

* Create/edit/delete stacks
* Group chapters under them
* Track completion percentage

### **Main Data**

* stackName
* description
* relatedSkill (e.g., React)
* chapters[]
* progress %

---

# **📦 4. Chapters & Concepts Module**

Each stack contains **chapters**, and each chapter contains optional smaller **concepts**.

### **Responsibilities**

* CRUD for chapters
* Track chapter completion
* Store difficulty & time estimate
* Save notes
* Provide history for AI

### **Main Data**

* title
* concepts[]
* difficulty (easy/medium/hard)
* estimatedTime
* isCompleted
* completionDate
* userNotes

---

# **📦 5. Progress Tracking Module**

Tracks the user’s daily learning activity.

### **Responsibilities**

* Update learning streak (increase/reset)
* Update progress % of stacks
* Track time spent (optional)
* Log completed chapters
* Generate daily/weekly stats

### **Main Data**

* lastActiveDate
* learningStreak
* completionHistory[]
* stackProgress{}

---

# **📦 6. Notes & Reflections Module**

Users can write notes for:

* A stack
* A chapter
* A concept
* Their improvement
* Errors they faced

### **Responsibilities**

* Save user notes
* Link notes to chapters/stacks
* Provide these notes to AI (optional)

### **Main Data**

* noteText
* relatedItemType (stack/chapter/concept)
* relatedItemId
* createdAt

---

# **📦 7. AI Recommendation Engine Module**

This is the **core AI component**.

### **Responsibilities**

* Take user learning data
* Generate next recommended concept
* Suggest daily tasks
* Create roadmap (later)
* Analyze skill gaps
* Provide motivational messages

### **Input to AI**

* skills
* current levels
* completed chapters
* stack contents
* streak
* progress %
* difficulty history

### **Output from AI**

* next chapter to learn
* why it was selected
* estimated time
* daily learning target
* difficulty & justification
* optional “micro explanation”

### **LLM Options**

* **Gemini API**
* **Groq Llama-3 (free)**
* **DeepSeek R1 (very cheap)**

---

# **📦 8. Authentication Module (Later)**

Not needed for MVP but important for multi-user:

### **Responsibilities**

* Login / Register
* JWT authentication
* Token refresh

For now, the system will treat every user as a single learner.

---

# **📦 9. Dashboard & UI Module**

Although backend-focused, front-end is needed for display.

### **Responsibilities**

* Display stacks
* Show progress stats
* Show streak
* Show AI recommendations
* Show chapters list
* Trigger API requests

---

# **📦 10. Admin/Management Module (Optional Future)**

Later, when building for many users:

### **Future Responsibilities**

* Manage all users
* Manage public templates/roadmaps
* Analytics on learner activity

---

# **📌 Summary Table**

| Component             | Responsibility                |
| --------------------- | ----------------------------- |
| **User**              | Store profile, streak, skills |
| **Skills**            | Track skill level + tags      |
| **Learning Stacks**   | Custom learning journeys      |
| **Chapters/Concepts** | Track learning units          |
| **Progress Tracking** | Streak, history, progress %   |
| **Notes**             | Reflections & chapter notes   |
| **AI Engine**         | Suggest next step             |
| **Auth**              | (Future) User login           |
| **Dashboard**         | Display all data              |

---

# ✔️ Next Step?



*********************************************************

# **Step 4 — System Architecture Diagram**

This step defines how the entire system is structured, how modules communicate, and how data flows between the front-end, back-end, database, and AI engine.

---

# **📐 4.1 Logical Architecture Overview**

```
┌───────────────────────────────┐
│           Learner             │
└───────────────┬───────────────┘
                │
                ▼
┌─────────────────────────────────────────────┐
│              Frontend (React TS)            │
│  - Auth pages                                │
│  - Dashboard                                 │
│  - Stacks manager                            │
│  - Chapters view                             │
│  - Notes editor                              │
│  - AI suggestion screen                      │
└───────────────┬─────────────────────────────┘
                │ API Calls (HTTPS, JWT)
                ▼
┌─────────────────────────────────────────────┐
│     Backend (Node.js + Express + TS)        │
│                                              │
│  Modules:                                    │
│   • Auth Module (JWT + bcrypt)               │
│   • User Module                              │
│   • Skill Module                             │
│   • Stack Module                             │
│   • Chapter Module                           │
│   • Progress Module                           │
│   • Notes Module                              │
│   • AI Recommendation Engine                  │
│                                              │
└───────────────┬─────────────────────────────┘
                │ Mongoose ODM
                ▼
┌─────────────────────────────────────────────┐
│                 MongoDB                      │
│  - users                                      │
│  - skills                                     │
│  - stacks                                     │
│  - chapters                                   │
│  - progress logs                              │
│  - notes                                      │
└───────────────┬─────────────────────────────┘
                │ External API
                ▼
┌─────────────────────────────────────────────┐
│    AI Service (Gemini / Groq / DeepSeek)     │
│  - Receives: skill level, streak, progress   │
│  - Returns: recommended next chapter         │
│            daily tasks, difficulty           │
└─────────────────────────────────────────────┘
```

---

# **📘 4.2 High-Level Technical Architecture**

### **Frontend (React + TypeScript)**

* Communicates via REST API
* Stores JWT in `httpOnly` cookie or memory
* Renders dashboard, stacks, progress
* Calls AI suggestion route via backend
* Performs CRUD operations for chapters/stacks

### **Backend (Node.js + Express + TypeScript)**

Acts as the central controller.

#### Contains:

* **Controllers** — validate & respond to requests
* **Services** — business logic
* **Models** — MongoDB schemas
* **Routes** — `/auth`, `/skills`, `/stacks`, `/progress`, `/ai`, etc.
* **Middlewares** — `authMiddleware`, validation, error handling
* **AI Client** — wrapper for Gemini/Groq API

Handles:

* Authentication
* Data creation + updates
* Progress tracking
* AI request formatting
* Security (JWT, rate limiting)

### **Database (MongoDB)**

Flexible for dynamic content like:

* custom stacks
* chapters with nested concepts
* notes
* streak logs

Collections:

* `users`
* `skills`
* `stacks`
* `chapters`
* `progress`
* `notes`

---

# **🤖 4.3 AI Recommendation Flow**

```
Learner → clicks "Get Recommendation"
    |
    ▼
Frontend → calls backend: POST /api/ai/recommend
    |
    ▼
Backend:
    - compile user learning data
    - send formatted prompt to LLM (Gemini/Groq/DeepSeek)
    - receive AI recommended chapter/task
    - save recommendation history (optional)
    - return response to frontend
    |
    ▼
Frontend displays:
    - next chapter
    - difficulty
    - daily learning task
    - explanation
```

---

# **🔐 4.4 Authentication Architecture**

### **Login Flow**

```
User enters email/password →
Backend verifies credentials →
Backend signs JWT →
JWT stored (httpOnly cookie or header) →
Frontend gets access to protected routes
```

### **Protected Routes**

* `/skills/*`
* `/stacks/*`
* `/chapters/*`
* `/progress/*`
* `/notes/*`
* `/ai/recommend`

### **Middleware**

```
authMiddleware:
    - checks JWT validity
    - extracts userId
    - attaches userId to req.user
```

---

# **📊 4.5 Data Flow Diagram**

```
(1) User Action → Add Stack
(2) Frontend → POST /stacks
(3) Backend → Validate + Save
(4) MongoDB → Save stack
(5) Backend → returns stack info
(6) Frontend → Displays updated list
```

---

# **📦 4.6 Component Integration Diagram**

```
+-------------------+      +------------------------+
|  Auth Module      | ---> |  User Module           |
+-------------------+      +------------------------+
            |                        |
            ▼                        ▼
+-------------------+      +------------------------+
|  Skill Module     | ---> |  Stack Module          |
+-------------------+      +------------------------+
                                     |
                                     ▼
                         +------------------------+
                         |  Chapter Module        |
                         +------------------------+
                                     |
                                     ▼
                         +------------------------+
                         |  Progress Module       |
                         +------------------------+
                                     |
                                     ▼
                         +------------------------+
                         |  AI Recommendation     |
                         +------------------------+
```

---
**********************************************************************************

➡️ **Step 5 — Database Schema Design (MongoDB Native Driver + TypeScript)**


This step defines all collections, fields, relationships, and TypeScript interfaces for data stored in MongoDB.

Because you are using the **MongoDB Native Driver**, schemas are **logical**, not enforced by Mongoose.
Validation will happen on:

* the backend (TypeScript + Zod/Yup/custom validation)
* optional MongoDB JSON Schema (later)

---

# **📌 5.1 Collections Overview**

Your system will require **6 core collections**:

1. `users`
2. `skills`
3. `stacks`
4. `chapters`
5. `progress_logs`
6. `notes`
7. `ai_history` (optional but recommended)

---

# **📁 5.2 MongoDB Collections & Fields**

Below are the **exact fields** each collection will store.

---

## **1. USERS Collection**

Stores learner account + streak + global profile.

### Document Example:

```json
{
  "_id": "ObjectId",
  "name": "Adnan",
  "email": "adnan@example.com",
  "passwordHash": "hashed_password_here",
  "learningStreak": 6,
  "lastActiveDate": "2025-01-02",
  "defaultPace": "medium",
  "createdAt": "2025-01-01",
  "updatedAt": "2025-01-02"
}
```

### TypeScript Interface:

```ts
export interface User {
  _id?: ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  learningStreak: number;
  lastActiveDate: string;
  defaultPace: "slow" | "medium" | "fast";
  createdAt: string;
  updatedAt: string;
}
```

---

## **2. SKILLS Collection**

Each skill the user decides to track.

### Document Example:

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "skillName": "React",
  "currentLevel": "beginner",
  "confidenceScore": 40,
  "tags": ["frontend", "javascript"],
  "createdAt": "2025-01-01"
}
```

### TypeScript Interface:

```ts
export interface Skill {
  _id?: ObjectId;
  userId: ObjectId;
  skillName: string;
  currentLevel: "beginner" | "intermediate" | "advanced";
  confidenceScore: number;
  tags: string[];
  createdAt: string;
}
```

---

## **3. STACKS Collection**

A “stack” = a custom learning roadmap.

### Document Example:

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "stackName": "React Roadmap",
  "description": "Learning React from basics to advanced",
  "relatedSkill": "React",
  "progress": 30,
  "createdAt": "2025-01-01"
}
```

### TypeScript Interface:

```ts
export interface Stack {
  _id?: ObjectId;
  userId: ObjectId;
  stackName: string;
  description: string;
  relatedSkill: string;
  progress: number; // 0–100
  createdAt: string;
}
```

---

## **4. CHAPTERS Collection**

Each stack has multiple chapters.

### Document Example:

```json
{
  "_id": "ObjectId",
  "stackId": "ObjectId",
  "userId": "ObjectId",
  "title": "React useState",
  "concepts": ["What is state?", "Updating state"],
  "difficulty": "easy",
  "estimatedTime": 40,
  "isCompleted": false,
  "completionDate": null,
  "notes": [],
  "order": 1,
  "createdAt": "2025-01-01"
}
```

### TypeScript Interface:

```ts
export interface Chapter {
  _id?: ObjectId;
  stackId: ObjectId;
  userId: ObjectId;
  title: string;
  concepts: string[];
  difficulty: "easy" | "medium" | "hard";
  estimatedTime: number;
  isCompleted: boolean;
  completionDate: string | null;
  notes: ObjectId[]; // note IDs
  order: number;
  createdAt: string;
}
```

---

## **5. PROGRESS_LOGS Collection**

Stores completion or learning event history.

### Document Example:

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "stackId": "ObjectId",
  "chapterId": "ObjectId",
  "action": "completed_chapter",
  "date": "2025-01-02"
}
```

### TypeScript Interface:

```ts
export interface ProgressLog {
  _id?: ObjectId;
  userId: ObjectId;
  stackId: ObjectId;
  chapterId: ObjectId;
  action: "completed_chapter" | "updated_progress" | "streak_updated";
  date: string;
}
```

---

## **6. NOTES Collection**

User notes for chapters/stacks.

### Document Example:

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "relatedType": "chapter",
  "relatedId": "ObjectId",
  "noteText": "React state changes are asynchronous",
  "createdAt": "2025-01-02"
}
```

### TypeScript Interface:

```ts
export interface Note {
  _id?: ObjectId;
  userId: ObjectId;
  relatedType: "stack" | "chapter";
  relatedId: ObjectId;
  noteText: string;
  createdAt: string;
}
```

---

## **7. AI_HISTORY Collection (optional but recommended)**

Logs every AI suggestion for debugging & learning analytics.

### Document Example:

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "stackId": "ObjectId",
  "inputData": { ... },
  "aiOutput": {
    "nextChapter": "useEffect",
    "difficulty": "medium",
    "reason": "Based on your previous chapter",
    "estimatedTime": "45 minutes"
  },
  "createdAt": "2025-01-05"
}
```

### TypeScript Interface:

```ts
export interface AIHistory {
  _id?: ObjectId;
  userId: ObjectId;
  stackId: ObjectId;
  inputData: any;
  aiOutput: any;
  createdAt: string;
}
```

---

# **📊 5.3 Relationships Summary**

| Collection    | Relation                                             |
| ------------- | ---------------------------------------------------- |
| users         | 1 → many skills, stacks, notes, progress, ai_history |
| skills        | belongs to user                                      |
| stacks        | belongs to user, has many chapters                   |
| chapters      | belongs to stack & user                              |
| notes         | belongs to chapter/stack & user                      |
| progress_logs | linked to user + stack + chapter                     |
| ai_history    | linked to user + stack                               |

---

# **📁 5.4 Directory Structure for Database Layer**

```
/src
  /db
    mongodb.ts          # connect to MongoDB (native)
    index.ts            # export db instance
  /repositories
    userRepo.ts
    skillRepo.ts
    stackRepo.ts
    chapterRepo.ts
    progressRepo.ts
    notesRepo.ts
    aiHistoryRepo.ts
  /interfaces
    User.ts
    Skill.ts
    Stack.ts
    Chapter.ts
    ProgressLog.ts
    Note.ts
    AIHistory.ts
```

---

************************************************************************************

➡️ **Next: Step 6 — API Design (Endpoints + Request/Response Examples)**


This step defines every API route your Skill Progress Tracker needs for MVP.

---

# **📌 6.1 API Overview**

Your backend will expose the following modules:

| Module   | Purpose                      |
| -------- | ---------------------------- |
| Auth     | Login, Register, JWT         |
| Skills   | Track skill levels           |
| Stacks   | Create learning roadmaps     |
| Chapters | Break stacks into chapters   |
| Progress | Log learning/streak progress |
| Notes    | Save personal notes          |
| AI       | Get AI recommendations       |

All **protected routes** require a valid **JWT**.

---

# **🔐 6.2 Auth Endpoints**

## **POST /auth/register**

Create new user.

### **Body**

```json
{
  "name": "Adnan",
  "email": "adnan@example.com",
  "password": "password123"
}
```

### **Response**

```json
{
  "message": "User registered successfully"
}
```

---

## **POST /auth/login**

User login + return JWT.

### **Body**

```json
{
  "email": "adnan@example.com",
  "password": "password123"
}
```

### **Response**

```json
{
  "token": "JWT_TOKEN_HERE"
}
```

---

# **👤 6.3 User Profile Endpoints**

## **GET /user/me**

Returns the logged-in user's profile.

### **Response**

```json
{
  "_id": "123",
  "name": "Adnan",
  "email": "adnan@example.com",
  "learningStreak": 6,
  "lastActiveDate": "2025-01-02"
}
```

---

# **🧠 6.4 Skills Module**

## **POST /skills**

Add a skill the user wants to track.

### **Body**

```json
{
  "skillName": "React",
  "currentLevel": "beginner",
  "confidenceScore": 40,
  "tags": ["frontend", "javascript"]
}
```

### **Response**

```json
{
  "_id": "skillId",
  "skillName": "React",
  "currentLevel": "beginner"
}
```

---

## **GET /skills**

Get all the user's skills.

### **Response**

```json
[
  {
    "_id": "1",
    "skillName": "React",
    "currentLevel": "beginner",
    "confidenceScore": 40
  }
]
```

---

## **PATCH /skills/:id**

Update level or confidence.

### **Body**

```json
{
  "currentLevel": "intermediate",
  "confidenceScore": 60
}
```

### **Response**

```json
{ "message": "Skill updated" }
```

---

## **DELETE /skills/:id**

Delete skill.

---

# **🌐 6.5 Stacks Module**

## **POST /stacks**

Create a learning stack/roadmap.

### **Body**

```json
{
  "stackName": "React Roadmap",
  "description": "Learn React basics → advanced",
  "relatedSkill": "React"
}
```

### **Response**

```json
{
  "_id": "stackId",
  "stackName": "React Roadmap",
  "progress": 0
}
```

---

## **GET /stacks**

Returns all stacks for the user.

---

## **GET /stacks/:id**

Returns single stack details + progress.

---

## **PATCH /stacks/:id**

Update name/description.

---

## **DELETE /stacks/:id**

Remove a stack and its chapters.

---

# **📚 6.6 Chapters Module**

## **POST /stacks/:stackId/chapters**

Add a chapter to the stack.

### **Body**

```json
{
  "title": "Understanding React State",
  "concepts": ["state basics", "immutability"],
  "difficulty": "easy",
  "estimatedTime": 30,
  "order": 1
}
```

---

## **GET /stacks/:stackId/chapters**

Get chapters belonging to a stack.

---

## **PATCH /chapters/:id**

Edit a chapter.

---

## **PATCH /chapters/:id/complete**

Mark as completed.

### **Response**

```json
{ "message": "Chapter marked as completed" }
```

---

## **DELETE /chapters/:id**

Delete chapter.

---

# **📊 6.7 Progress Module**

## **POST /progress/log**

Logs an event (chapter completion, streak, etc.)

### **Body**

```json
{
  "stackId": "stackId",
  "chapterId": "chapterId",
  "action": "completed_chapter"
}
```

### **Response**

```json
{ "message": "Progress logged" }
```

---

## **GET /progress/streak**

Return the user’s current streak.

### **Response**

```json
{
  "streak": 6,
  "lastActiveDate": "2025-02-01"
}
```

---

# **📝 6.8 Notes Module**

## **POST /notes**

Add a note for a chapter or stack.

### **Body**

```json
{
  "relatedType": "chapter",
  "relatedId": "chapterId",
  "noteText": "State updates are async"
}
```

---

## **GET /notes/:relatedType/:relatedId**

Get notes for a chapter/stack.

---

## **PATCH /notes/:id**

Update note text.

---

## **DELETE /notes/:id**

Delete note.

---

# **🤖 6.9 AI Recommendation Module**

This uses Gemini / Groq / DeepSeek.

## **POST /ai/recommend**

Get personalized chapter/task suggestions.

### **Body**

```json
{
  "stackId": "stackId"
}
```

### **Backend Internally Sends to AI:**

```json
{
  "skillLevel": "beginner",
  "confidenceScore": 40,
  "learningStreak": 6,
  "completedChapters": 3,
  "remainingChapters": ["props", "useEffect", "routing"]
}
```

### **AI Response Example**

```json
{
  "nextChapter": "React useEffect",
  "difficulty": "medium",
  "reason": "Based on your progress and streak",
  "estimatedTime": "45 minutes"
}
```

---

# **🧵 6.10 AI History Module**

## **GET /ai/history**

Returns list of AI suggestions.

---

# **🔐 6.11 Route Protection Example**

Every non-auth route requires:

```
Authorization: Bearer <token>
```

Middleware:

```ts
authMiddleware(req, res, next)
```

---
****************************************************************************

➡️ **Next: Step 7 — High-Level Backend Architecture (folder structure, modules, services, controllers, middleware)**

This step organizes the backend code structure, showing how all modules, services, controllers, and middleware fit together for a **TypeScript + Node.js + MongoDB Native Driver** backend.

---

# **📁 7.1 Recommended Folder Structure**

```
/src
  /config
    db.ts              # MongoDB connection setup
    env.ts             # Environment variables
  /controllers
    authController.ts
    userController.ts
    skillController.ts
    stackController.ts
    chapterController.ts
    progressController.ts
    noteController.ts
    aiController.ts
  /services
    authService.ts
    userService.ts
    skillService.ts
    stackService.ts
    chapterService.ts
    progressService.ts
    noteService.ts
    aiService.ts
  /repositories
    userRepo.ts
    skillRepo.ts
    stackRepo.ts
    chapterRepo.ts
    progressRepo.ts
    noteRepo.ts
    aiHistoryRepo.ts
  /middleware
    authMiddleware.ts
    errorMiddleware.ts
    validateRequest.ts
  /routes
    authRoutes.ts
    userRoutes.ts
    skillRoutes.ts
    stackRoutes.ts
    chapterRoutes.ts
    progressRoutes.ts
    noteRoutes.ts
    aiRoutes.ts
  /interfaces
    User.ts
    Skill.ts
    Stack.ts
    Chapter.ts
    ProgressLog.ts
    Note.ts
    AIHistory.ts
  /utils
    hash.ts             # password hashing
    jwt.ts              # JWT signing & verification
    logger.ts
  /app.ts               # Express app setup
  /server.ts            # Start server & connect DB
```

---

# **📌 7.2 Module Responsibilities**

### **1. Controllers**

* Handle incoming HTTP requests
* Call the corresponding service
* Return JSON response

**Example:** `stackController.ts`

```ts
export const createStack = async (req, res) => {
  const stack = await stackService.createStack(req.userId, req.body);
  res.status(201).json(stack);
};
```

---

### **2. Services**

* Contain **business logic**
* Validate inputs (if not using middleware)
* Call repositories to interact with DB
* Call AI service when needed

**Example:** `aiService.ts`

```ts
export const getNextChapter = async (userId: ObjectId, stackId: ObjectId) => {
  const userData = await userRepo.findById(userId);
  const stackData = await stackRepo.findById(stackId);
  // format input for AI
  const aiInput = { ... };
  const aiOutput = await callAI(aiInput);
  return aiOutput;
};
```

---

### **3. Repositories**

* Direct **MongoDB native driver operations**
* CRUD operations for each collection
* Encapsulates DB logic from services

**Example:** `stackRepo.ts`

```ts
export const createStack = async (db, userId, stackData) => {
  const stack = { ...stackData, userId, progress: 0, createdAt: new Date().toISOString() };
  const result = await db.collection("stacks").insertOne(stack);
  return result.ops[0];
};
```

---

### **4. Middleware**

* `authMiddleware.ts` → verify JWT, attach userId to `req.user`
* `errorMiddleware.ts` → centralized error handling
* `validateRequest.ts` → validate request body using Zod/Yup/custom logic

---

### **5. Routes**

* Map URL paths → controllers
* Example: `POST /stacks` → `stackController.createStack`
* Use `authMiddleware` for protected routes

---

### **6. Interfaces**

* TypeScript interfaces for **all collections**
* Example: `Stack.ts`, `User.ts`, `Chapter.ts`, etc.
* Ensures type safety throughout the backend

---

### **7. Utils**

* JWT generation / verification (`jwt.ts`)
* Password hashing (`hash.ts`)
* Logging / debugging (`logger.ts`)

---

# **📐 7.3 Request Flow Example**

```
Frontend (POST /stacks)
      │
      ▼
Route (stackRoutes.ts) → authMiddleware
      │
      ▼
Controller (stackController.ts) → calls Service
      │
      ▼
Service (stackService.ts) → calls Repository
      │
      ▼
Repository (stackRepo.ts) → MongoDB Native Driver
      │
      ▼
Return stack → Controller → Response → Frontend
```

---

# **📊 7.4 AI Flow in Backend**

```
Frontend → POST /ai/recommend → authMiddleware
      │
      ▼
Controller → aiService
      │
      ▼
aiService:
  - gathers user, stack, chapter info
  - formats input for Gemini API
  - calls AI API
      │
      ▼
AI API → returns recommendation
      │
      ▼
Service saves optional AIHistory → returns JSON → Frontend
```

---

# **📌 7.5 Notes**

* Use **one instance of MongoDB client** in `db.ts` and reuse across repositories
* **Services** should not directly access MongoDB; always go through **repositories**
* Middleware ensures **security**, **error handling**, and **input validation**
* All endpoints **return JSON** with status codes (`200`, `201`, `400`, `401`, `404`, `500`)

---
*************************************************************************

➡️ **Next: Step 8 — Detailed AI Integration Design (Prompt Engineering + Backend Handling + Rate Limits + History Logging)**

Below is **Step 8 — Detailed AI Integration Design**. It covers prompt engineering, input/output schemas, backend handling, rate-limiting/caching, cost-control, fallbacks, logging, and example TypeScript snippets for calling Gemini (or alternate LLMs).

# **Step 8 — Detailed AI Integration Design (Gemini / Low-cost LLM)**

> Goal: safely, reliably, and cost-effectively call an LLM (Gemini preferred) to generate personalized chapter/ concept suggestions for a learner, validate the result, persist it, and surface it to the frontend.

---

## **8.1 High-level design**

* **AI Client**: a single module `aiClient.ts` that wraps the LLM provider (Gemini, Groq, etc). Exposes `generateSuggestion(context): Promise<AISuggestionResult>`.
* **aiService**: business-layer service that:

  * Constructs structured input from user data
  * Calls `aiClient.generateSuggestion`
  * Validates & sanitizes output
  * Persists to `ai_history`
  * Returns result to controller
* **Workers/Queue**: heavy LLM calls happen inside `aiWorker` via BullMQ (`ai:suggestion` jobs) to avoid blocking request threads.
* **Fallback**: rule-based suggestion engine (fast, free) if LLM unavailable or cost limit reached.
* **Caching**: cache recent suggestions per (userId, stackId, day) to reduce repeated LLM calls.
* **Rate limits & cost control**: global and per-user call quotas, daily budget caps, and throttling.
* **Metrics & Logging**: record latency, token usage (if provider returns), success/failure, and suggestion acceptance.

---

## **8.2 Input schema (what we send to LLM)**

Construct a compact JSON object to include only what the LLM needs:

```ts
interface AISuggestionInput {
  userId: string;                // for logging only (not sent to remote LLM if privacy needed)
  stackId: string;
  stackName: string;
  skillName?: string;
  skillLevel: "beginner" | "intermediate" | "advanced";
  learningStreak: number;
  timeAvailableMinutes: number;  // today
  completedChapters: { id: string; title: string; difficulty: string }[];
  remainingChaptersTitles: string[]; // optional short list
  recentNotes?: string[];         // short text snippets (avoid PII)
  userGoal?: string;              // e.g., "get frontend job"
  preferredPace?: "slow" | "medium" | "fast";
}
```

**Notes**

* Keep input short and factual (avoid large text to reduce cost).
* Truncate notes and history (e.g., last 3 notes, last 7 days).
* Remove or anonymize any sensitive PII before sending (e.g., emails).

---

## **8.3 Prompt engineering (recommended template)**

Use a structured prompt that asks the LLM to return JSON only.

```
You are an expert learning coach. Given the learner context in JSON, return a single valid JSON object (no extra text) with exactly the fields described.

InputContext:
<JSON: AISuggestionInput>

Respond with JSON:
{
  "nextChapterTitle": "string",
  "reason": "string (short)",
  "difficulty": "easy|medium|hard",
  "estMinutes": number,
  "confidence": 0.0-1.0,
  "exercises": [ "short exercise 1", "short exercise 2" ]   // optional, at most 3
}

Rules:
- Output must be valid JSON (no surrounding code fences).
- Keep fields short. 'reason' max 120 chars.
- 'estMinutes' must be <= timeAvailableMinutes. If no suitable chapter fits, return a "revision" suggestion with estMinutes <= timeAvailable and confidence >= 0.5.
```

---

## **8.4 Output schema (what we expect back)**

```ts
interface AISuggestionResult {
  nextChapterTitle: string;
  reason: string;
  difficulty: "easy" | "medium" | "hard";
  estMinutes: number;
  confidence: number; // 0.0 - 1.0
  exercises?: string[]; // optional short list
  raw?: any; // raw provider response for debugging
}
```

**Validation**

* Validate presence and types for required fields.
* `estMinutes` must be a positive integer <= `timeAvailableMinutes` (if provided).
* `confidence` should be clamped [0,1].
* If the response fails validation, use rule-based fallback and log the invalid response to `ai_history` with `status: "invalid"`.

---

## **8.5 Rate limiting & cost control**

Implement three layers:

1. **Per-user daily quota** (e.g., 10 LLM suggestions/day).
2. **Global daily budget** (e.g., 5000 tokens/day or $X/day). Track token estimates or call counts.
3. **Per-request throttling** (e.g., allow 1 LLM call per user per minute).

If quota exceeded: return rule-based suggestion and queue a notification to admin or the user that LLM is temporarily unavailable.

---

## **8.6 Caching**

Cache by key: `ai:suggestion:${userId}:${stackId}:${date}` — keep for 24 hours. If cache exists return directly. Cache both success and safe fallback results.

Use Redis for caching with TTL 24 hours.

---

## **8.7 Fallback: rule-based suggestion engine**

Simple deterministic logic:

1. If user has incomplete chapters in current stack, pick the first incomplete chapter whose estimatedTime <= timeAvailableMinutes.
2. If none fits, propose a revision of last completed chapter (short revision task).
3. If no chapters exist, generate generic beginner chapters using a minimal template.

Persist fallback suggestions like normal suggestions with `strategy: "rule"`. This keeps UX smooth when LLM unavailable.

---

## **8.8 Worker & Job design**

**Job name**: `ai:suggestion`

**Job payload**

```ts
{
  userId: string,
  stackId: string,
  timeAvailableMinutes?: number,
  forceRefresh?: boolean
}
```

**Worker steps**

1. Check cache; if present and not `forceRefresh`, return cached suggestion.
2. Ensure user hasn't exceeded per-user quota.
3. Build `AISuggestionInput` by querying DB (user, stack, chapters, notes).
4. Enqueue provider call to `aiClient.generateSuggestion()` (or call directly here).
5. Validate response; if valid:

   * Save to `ai_history` with `status: "ok"`.
   * Update cache.
   * Optionally send push/notification if job initiated by scheduler.
6. If invalid or provider fails:

   * Record error in `ai_history` with `status: "error"`.
   * Generate rule-based fallback, persist as `strategy: "rule"`.
7. Emit metrics (latency, success/failure, provider tokens).

**Retry/Idempotency**

* Job idempotency by `jobId = ai:${userId}:${stackId}:${date}`.
* Retries with exponential backoff; if fails > 3 attempts, write to DLQ collection for manual review.

---

## **8.9 ai_history document structure**

```ts
interface AIHistoryDoc {
  _id?: ObjectId;
  userId: ObjectId;
  stackId: ObjectId;
  input: AISuggestionInput;   // truncated/hashed if needed for privacy
  output?: AISuggestionResult;
  strategy: "llm" | "rule";
  status: "ok" | "invalid" | "error";
  provider?: string;          // e.g., "gemini"
  errorMessage?: string;
  costEstimate?: { tokens?: number; estimatedUsd?: number };
  createdAt: string;
}
```

---

## **8.10 Privacy & Safety**

* **PII minimization**: do not send email, full names, or other sensitive fields to remote LLM. Use `userId` for logging only.
* **Redaction**: strip or truncate long notes or pasted code.
* **User control**: allow users to opt out of sending their notes to the LLM (toggle in preferences).
* **Validate** returned JSON strictly. Never render raw LLM text to UI without sanitization.

---

## **8.11 Cost & Token Tracking (optional)**

If LLM provider returns token usage, persist `costEstimate` in `ai_history`. Aggregate daily usage per provider and trigger alerts if approaching daily budget.

---

## **8.12 Example TypeScript client (simplified)**

> This is a provider-agnostic client. Replace internals with Gemini SDK or fetch to provider endpoint.

```ts
// src/services/aiClient.ts
import fetch from "node-fetch";
import { AISuggestionInput, AISuggestionResult } from "../interfaces/AI";

const GEMINI_URL = process.env.GEMINI_URL!;
const GEMINI_KEY = process.env.GEMINI_KEY!;

export async function generateSuggestion(input: AISuggestionInput): Promise<AISuggestionResult> {
  // Build prompt
  const prompt = `You are an expert learning coach. Return JSON only as described. Input:${JSON.stringify(input)}`;

  // Example using fetch (replace with proper SDK)
  const res = await fetch(GEMINI_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${GEMINI_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt, max_tokens: 250 })
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`LLM error: ${res.status} ${body}`);
  }

  const json = await res.json();
  // provider-specific: extract model text
  const text = json?.choices?.[0]?.message?.content ?? json?.result ?? JSON.stringify(json);

  // parse JSON safely
  try {
    const parsed = JSON.parse(text);
    // basic shape check
    if (!parsed.nextChapterTitle) throw new Error("missing nextChapterTitle");
    return {
      nextChapterTitle: String(parsed.nextChapterTitle),
      reason: String(parsed.reason ?? ""),
      difficulty: parsed.difficulty,
      estMinutes: Number(parsed.estMinutes ?? 0),
      confidence: Number(parsed.confidence ?? 0),
      exercises: parsed.exercises ?? [],
      raw: json
    };
  } catch (err) {
    throw new Error(`Invalid LLM output: ${err.message}`);
  }
}
```

---

## **8.13 Example aiService flow (simplified)**

```ts
// src/services/aiService.ts
import { generateSuggestion } from "./aiClient";
import { getUserById, getStackById, getChaptersForStack } from "../repositories";
import { redisClient } from "../utils/redis";

export async function getOrCreateAISuggestion(userId: string, stackId: string, timeAvailable = 60) {
  const cacheKey = `ai:suggestion:${userId}:${stackId}:${new Date().toISOString().slice(0,10)}`;
  const cached = await redisClient.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const user = await getUserById(userId);
  const stack = await getStackById(stackId);
  const chapters = await getChaptersForStack(stackId);

  const input = {
    userId, stackId, stackName: stack.stackName, skillLevel: user.skillLevelFor(stack.relatedSkill),
    learningStreak: user.learningStreak,
    timeAvailableMinutes: timeAvailable,
    completedChapters: chapters.filter(c => c.isCompleted).map(c => ({ id: c._id, title: c.title, difficulty: c.difficulty })),
    remainingChaptersTitles: chapters.filter(c => !c.isCompleted).map(c => c.title),
    recentNotes: await getRecentNotes(userId, 3)
  };

  try {
    const suggestion = await generateSuggestion(input);
    // Validate suggestion here (additional checks)
    // Persist to ai_history (save input/output, strategy=llm, status=ok)
    await saveAIHistory({ userId, stackId, input, output: suggestion, strategy: "llm", status: "ok" });
    await redisClient.set(cacheKey, JSON.stringify(suggestion), { EX: 60 * 60 * 24 });
    return suggestion;
  } catch (err) {
    // Log error, persist ai_history with status=error
    await saveAIHistory({ userId, stackId, input, errorMessage: String(err), strategy: "llm", status: "error" });
    // Fallback to rule-based
    const fallback = ruleBasedSuggestion(chapters, timeAvailable);
    await saveAIHistory({ userId, stackId, input, output: fallback, strategy: "rule", status: "ok" });
    await redisClient.set(cacheKey, JSON.stringify(fallback), { EX: 60 * 60 * 24 });
    return fallback;
  }
}
```

---

## **8.14 Metrics & Monitoring**

Emit the following metrics:

* `ai.request.count` (labels: provider, status)
* `ai.request.latency_ms` (histogram)
* `ai.request.errors` (counter)
* `ai.tokens.used` (sum) — if provider returns token usage
* `ai.fallback.count` (counter)

Set alert when:

* `ai.request.errors` > threshold
* `ai.tokens.used` nearing daily budget

---

## **8.15 Testing (unit & integration)**

* **Unit tests** for `generateSuggestion` mocking provider responses:

  * Valid JSON => correct parsed result
  * Invalid JSON => thrown, fallback invoked
  * Missing fields => invalid => fallback
* **Integration tests** for `aiService` using local test double / mocked Redis and DB
* **Contract tests** verifying `ai_history` records correct schema

---

## **8.16 Safety checklist (pre-launch)**

* [ ] Validate all LLM output before storing.
* [ ] Implement per-user opt-out for sending personal notes.
* [ ] Add daily budget for provider usage and monitor.
* [ ] Ensure caching to reduce duplicate calls.
* [ ] Show UI indication when suggestion is rule-based fallback.

---

## **8.17 Summary**

* LLM calls should be performed in workers with caching and fallback.
* Use strict prompt templates and JSON-only responses.
* Validate outputs and persist into `ai_history`.
* Track costs and rate-limit usage.
* Provide a deterministic rule-based fallback to maintain UX.

---

****************************************************

# **Step 9 — Frontend Architecture**

## **9.1 Technology Choices**

* **React + TypeScript**
* **React Router** (routing)
* **React Query** (server state + caching)
* **Context API / Zustand** (auth & UI state)
* **CSS Modules / Tailwind** (your choice)
* **Axios / Fetch** (API client)

---

## **9.2 Recommended Folder Structure**

```
/src
  /api                # Axios instances + API functions
  /components         # Shared UI components
  /hooks              # Reusable custom hooks
  /context            # Auth context, user context
  /layouts            # Dashboard layout, auth layout
  /pages              # Route pages
      /auth
      /dashboard
      /stacks
      /chapters
      /progress
      /notes
      /ai
  /services           # Frontend logic wrappers
  /types              # TS interfaces
  /utils              # helpers
  main.tsx
  App.tsx
```

---

## **9.3 Core Pages**

| Page                   | Description                                |
| ---------------------- | ------------------------------------------ |
| **Login / Register**   | Email + password                           |
| **Dashboard**          | Shows progress %, streak, current stack    |
| **Stacks Page**        | Add new stacks (React, Node, Django, etc.) |
| **Stack Detail Page**  | Chapters inside that stack                 |
| **Chapter Viewer**     | Mark complete, add notes                   |
| **Notes Page**         | Full notes editor                          |
| **AI Suggestion Page** | Shows AI-generated "what to learn next"    |

---

## **9.4 State Management Strategy**

### **React Query (strongly recommended)**

* Cache stacks, chapters, progress logs
* Auto-refetch when needed

### **Context API**

* Store auth tokens + user info
* Provide `AuthProvider` + `useAuth()` hook

---

## **9.5 Authentication Flow (Frontend)**

* On login → server returns JWT in **httpOnly cookie**
* Frontend reads user via `/me` endpoint
* Protect routes using `<PrivateRoute />`
* Handle logout by clearing cookies (backend endpoint)

---

## **9.6 API Calling Pattern**

Example:

```ts
const { data: stacks } = useQuery(['stacks'], () =>
  api.get('/stacks').then(res => res.data)
);
```

---

# **Step 10 — Deployment Architecture**

## **10.1 Hosting Choices (Free-Friendly)**

| Component       | Recommended Hosting                      |
| --------------- | ---------------------------------------- |
| **Frontend**    | Vercel (free)                            |
| **Backend**     | Railway / Render (free tier)             |
| **Database**    | MongoDB Atlas (free forever)             |
| **AI Provider** | Gemini API (free tier) / Groq / DeepSeek |

---

## **10.2 Deployment Pipeline**

```
GitHub Repo → GitHub Actions → Deploy to Vercel/Railway
```

### Backend Deployment Steps

* Railway detects Node project
* Set environment variables
* Deploy
* Connect to MongoDB URI

### Frontend Deployment Steps

* Vercel reads `package.json`
* Build & deploy automatically

---

## **10.3 Environment Variables**

```
MONGO_URI=
JWT_SECRET=
GEMINI_API_KEY=
PORT=
```

---

## **10.4 Security During Deployment**

* Use **httpOnly** secure cookies
* Use **CORS** properly
* Force HTTPS in production

---

# **Step 11 — Scalability & Performance**

## **11.1 Performance Strategies**

* Use **indexes** in MongoDB

  * `users.email`
  * `stacks.userId`
  * `chapters.stackId`
* Use **React Query caching** to reduce API load
* Use streaming AI responses in future versions

---

## **11.2 Scaling Backend**

* Stateless Node backend → suitable for horizontal scaling
* Use a distributed cache (Redis) if traffic grows
* Rate limit AI endpoint

---

## **11.3 MongoDB Scaling**

* MongoDB Atlas automatically scales reads/writes
* Sharding done automatically when needed

---

# **Step 12 — Security Design**

## **12.1 Authentication**

* **JWT** with access & refresh tokens
* Access token stored in **httpOnly cookie**

---

## **12.2 Password Handling**

* Hash passwords with bcrypt (12 rounds)
* Never store plain text

---

## **12.3 Input Validation**

* Use Zod (recommended)
* Validate:

  * email format
  * password length
  * stack names
  * chapter text

---

## **12.4 API Security**

* Rate limit: 100 requests/min per IP
* AI routes stricter: 10/min
* Sanitize notes to prevent XSS

---

## **12.5 CORS**

Allow:

```
origin: https://your-frontend.vercel.app
credentials: true
```

---

# **Step 13 — Monitoring & Observability**

## **13.1 Logging**

* Use **Pino** or **Winston**
* Log:

  * user login failures
  * AI calls
  * progress updates
  * unexpected errors

---

## **13.2 Error Tracking**

Use Sentry (free tier).

---

## **13.3 Health Checks**

Create endpoint:

```
GET /health → { status: "ok", uptime }
```

---

## **13.4 Metrics (Optional)**

* Track daily active users
* Track AI recommendation usage
* Track learning streaks

---

# **Step 14 — CI/CD Pipeline**

## **14.1 GitHub Actions**

Create two workflows:

* **build-and-test.yml**
* **deploy.yml**

---

## **14.2 Pipeline Stages**

```
Lint → Type Check → Test → Build → Deploy
```

---

## **14.3 Branching Model**

* `main` → production
* `dev` → development
* Feature branches: `feat/stack-crud`

---

## **14.4 PR Requirements**

* Lint pass
* Tests pass
* Code review

---

# **Step 15 — Development Roadmap (MVP)**

## **Phase 1 — Week 1: Core Backend**

* Setup Node.js TS project
* MongoDB connection
* Auth module (register/login)
* User profile
* Stacks CRUD
* Chapters CRUD

---

## **Phase 2 — Week 2: Progress & Notes**

* Progress logs
* Notes CRUD
* Learning streak calculation
* Dashboard data endpoint

---

## **Phase 3 — Week 3: AI Integration**

* Add Gemini/DeepSeek/Groq API
* Build recommendation engine
* Tune prompt templates
* Add recommendation history

---

## **Phase 4 — Week 4: Frontend MVP**

* Auth pages
* Dashboard page
* Stacks list & create page
* Stack detail page
* Chapter detail page
* Notes page

---

## **Phase 5 — Week 5: AI UI + Finishing**

* AI page + modal
* Daily suggestion UI
* UX polish
* Deploy backend + frontend

---

## **Future Features**

* Leaderboards
* Friends system
* Reminders
* Multi-device sync
* Mobile app version
* Social learning groups

---

# ✔️ You now have a **complete system design (end-to-end)** for your Skill Progress Tracker.
