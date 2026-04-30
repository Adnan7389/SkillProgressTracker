# Pathwise 🚀

A modern, AI-powered learning path generator and progress tracker. Pathwise helps users master new skills by generating structured roadmaps, discovering curated resources (docs and videos), and tracking learning consistency through streaks and progress bars.

🔗 **Live App**: [https://pathwise-app.vercel.app](https://pathwise-app.vercel.app)

## 📋 Table of Contents
- [Overview](#-overview)
- [Key Features](#-key-features)
- [Recent Updates](#-recent-updates)
- [Tech Stack](#-tech-stack)
- [Architecture Summary](#-architecture-summary)
- [Folder Structure](#-folder-structure)
- [Setup Instructions](#-setup-instructions)
- [API Documentation](#-api-documentation)
- [Usage Guide](#-usage-guide)
- [Scripts & Commands](#-scripts--commands)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview
SkillProgressTracker is designed for lifelong learners who want to streamline their educational journey. Instead of manually searching for tutorials and documentation, users can simply enter a topic (e.g., "React Performance" or "Stock Market Basics") and their current skill level. The system leverages AI to:
1.  **Generate a Logical Roadmap**: Creates a structured sequence of chapters.
2.  **Discover Resources**: Automatically finds official documentation and high-quality YouTube videos for each chapter.
3.  **Track Progress**: Monitor completion status and maintain learning streaks to stay motivated.
4.  **AI Assessments**: Test your knowledge with dynamically generated quizzes for every chapter.

**Target Users**: Self-taught developers, students, and professionals looking to upskill efficiently.

---

## 🔥 Key Features

### 🤖 AI-Powered Roadmaps
- **Dynamic Generation**: Uses Google Gemini AI to create tailored learning paths based on topic and skill level (Beginner, Intermediate, Advanced).
- **Intelligent Recommendations**: AI analyzes your progress and recommends the most logical next step.

### 📚 Resource Discovery
- **Multi-Source Curation**: Automatically attaches 3-5 curated resources (official MDN/docs and YouTube tutorials) to every chapter.
- **Asynchronous Discovery**: Resources are fetched in the background using parallel processing.

### 📝 AI-Powered Assessments
- **Dynamic Quiz Generation**: Automatically generates 3-5 multiple-choice questions (MCQs) per chapter using Gemini.
- **Instant Scoring & Feedback**: Get immediate results with AI-generated explanations for every answer.
- **Knowledge Verification**: Ensures active learning and conceptual mastery before moving to the next topic.

### 📈 Progress & Gamification
- **Visual Progress**: Real-time progress bars for each learning path.
- **Consistency Tracking**: Integrated streak system to encourage daily learning.
- **Chapter Notes**: Users can take and save notes directly within each chapter.

### 📱 Offline & PWA Support
- **Progressive Web App**: Installable on any device with a dedicated mobile experience and offline access.
- **Service Worker Caching**: Leverages Workbox with `NetworkFirst` strategies for learning paths and `CacheFirst` for static assets and fonts.

### 🗺️ Interactive Onboarding
- **Guided UI Tour**: A 2-step interactive overlay that teaches new users about AI generation and streak tracking.
- **Smart Suggestions**: Quick-start learning chips (e.g., UI/UX, Machine Learning) to pre-fill the AI generator.

### 🧪 Advanced Analytics
- **Performance Metrics**: Comprehensive metrics on total study time, completion rates, and focus paths.
- **Skill Breakdown**: Visual breakdown of learning intensity across various skill levels.

### 🔔 Consistency Notifications
- **Timezone-Aware Reminders**: SMTP-integrated email system that triggers reminders at each user's configured hour (default: 6 PM local time) for users at risk of losing their streak.
- **External Scheduling**: Secure internal API endpoints (`/api/v1/internal/run-reminders`, `/api/v1/internal/reset-streaks`) triggered by external schedulers (e.g., cron-job.org) for reliable execution on free-tier hosting.
- **Idempotent Execution**: Duplicate triggers within the same day are safely ignored — users never receive duplicate reminder emails.

### 🔐 Secure Authentication
- **Session-Based Auth**: Powered by `better-auth` for secure, cookie-based authentication.
- **Protected Routes**: Ensuring user data privacy across the dashboard and learning paths.

---

## 🆕 Recent Updates

### 🚀 Phase 1: Onboarding & Empty States
- **Persistent Onboarding State**: Tracks tour completion via `localStorage` in the UI store.
- **Guided Welcome Tour**: Interactive Dashboard overlay for first-time user guidance.
- **AI Topic Suggestions**: Clickable suggestions for rapid roadmap generation.

### 🌐 Phase 2: Offline / PWA Support
- **PWA Branding**: Custom purple/indigo gradient icons (192px, 512px) for a premium OS feel.
- **Workbox Integration**: Advanced caching strategies for seamless offline usage.
- **Type-Safe PWA**: Full TypeScript support for service worker registration and client declarations.

### 🎮 Phase 3: Notifications & Gamification
- **External Cron Architecture**: Replaced internal `@nestjs/schedule` cron jobs with secure, externally-triggered API endpoints for reliable execution on Render's free tier.
- **Email Notification System**: Styled HTML templates for high-engagement streak reminders.
- **Enhanced Streak UI**: Dynamic glow effects, orange accent themes, and "MASTER" badges for 7+ day streaks.

### 🏗️ Infrastructure Updates
- **Full-Stack Dockerization**: Multi-stage builds for optimized container orchestration.
- **NGINX Proxying**: High-performance routing for API requests and client-side SPA navigation.

---

## 💻 Tech Stack

### Backend
- **Framework**: [NestJS](https://nestjs.com/) (TypeScript)
- **Database**: [MongoDB](https://www.mongodb.com/) (Mongoose ODM)
- **Authentication**: [Better Auth](https://www.better-auth.com/)
- **AI Integration**: [Google Generative AI](https://ai.google.dev/) (Gemini Flash)
- **Validation**: [Zod](https://zod.dev/) & `class-validator`
- **Caching**: `@nestjs/cache-manager` with Mongoose integration

### Frontend
- **Framework**: [React](https://reactjs.org/) (Vite)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query/latest)
- **Icons**: [Lucide React](https://lucide.dev/)
- **HTTP Client**: Axios

---

## 🏗️ Architecture Summary
The system follows a decoupled **Client-Server** architecture:

1.  **Frontend (React)**: Handles the UI/UX, state management with Zustand, and communicates with the backend via a RESTful API. Features a PWA layer for offline capabilities.
2.  **Backend (NestJS)**:
    - **Controllers**: Handle HTTP requests and routing.
    - **Services**: Contain business logic (AI prompt engineering, resource discovery, progress calculation).
    - **Modules**: Domain-driven structure including `NotificationsModule`, `StreaksModule`, `ChallengesModule`, and `InternalModule`.
    - **External Scheduling**: Secure internal endpoints triggered by external schedulers (cron-job.org) for streak resets and reminder emails. Secured via `x-cron-secret` header validation.
    - **Database (MongoDB)**: Stores users, learning paths, chapters, and resources using Mongoose schemas.
3.  **AI Layer**: Connects to Google Gemini API to generate structured JSON roadmaps and learning materials.
4.  **Infrastructure**: Fully containerized with Docker, using NGINX for proxying and serving the frontend.

---

## 📂 Folder Structure

```text
SkillProgressTracker/
├── backend/                # NestJS API
│   ├── src/
│   │   ├── auth/           # Better Auth configuration & services
│   │   ├── common/         # Guards, pipes, and interceptors
│   │   ├── modules/
│   │   │   ├── ai/         # Gemini integration & resource discovery
│   │   │   ├── learning-paths/ # Path management (CRUD)
│   │   │   ├── chapters/   # Chapter management
│   │   │   ├── internal/   # Secure cron-triggered endpoints (reminders, resets)
│   │   │   ├── streaks/    # Streak tracking & timezone-aware reminders
│   │   │   ├── notifications/ # Email transporter & templates
│   │   │   └── progress/   # Progress tracking logic
│   │   └── main.ts         # Server entry point
├── frontend/               # React Vite Application
│   ├── src/
│   │   ├── api/            # API client configurations
│   │   ├── components/     # Reusable UI & domain components
│   │   ├── pages/          # Main application views (Dashboard, PathDetails)
│   │   ├── store/          # Zustand global state
│   │   └── App.tsx         # Routing and main layout
└── docs/                   # Project documentation & guides
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account (or local MongoDB instance)
- Google AI Studio API Key ([Get it here](https://aistudio.google.com/app/apikey))

### Docker Setup (Recommended)
1. Ensure you have Docker and Docker Compose installed.
2. Build and start the entire stack:
   ```bash
   docker-compose up --build
   ```
3. The app will be available at `http://localhost:5173` with the API at `http://localhost:5000`.

### Manual Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   BETTER_AUTH_SECRET=your_generated_secret
   BETTER_AUTH_URL=http://localhost:5000
   GEMINI_API_KEY=your_gemini_key
   FRONTEND_URL=http://localhost:5173
   
   # Notifications (SMTP)
   SMTP_HOST=smtp.resend.com
   SMTP_PORT=465
   SMTP_USER=resend
   SMTP_PASS=your_resend_api_key
   EMAIL_FROM="SkillTracker" <noreply@skilltracker.ai>
    
   # Internal Cron Security (generate with: openssl rand -base64 32)
   CRON_SECRET=your_cron_secret_min_16_chars
   ```
4. Start the development server:
   ```bash
   npm run start:dev
   ```

### Manual Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## 📡 API Documentation

### Authentication
- `POST /api/auth/sign-up/email`: Register a new user.
- `POST /api/auth/sign-in/email`: Login and receive session cookie.
- `GET /api/auth/session`: Retrieve current user session.

### Learning Paths
- `POST /api/v1/learning-paths`: Create a new manual learning path.
- `GET /api/v1/learning-paths`: List all learning paths for the user.
- `GET /api/v1/learning-paths/:id`: Get specific path details.
- `PATCH /api/v1/learning-paths/:id`: Update path name or description.
- `DELETE /api/v1/learning-paths/:id`: Delete a learning path.

### AI Roadmap Generation
- `POST /api/v1/ai/generate`: Generate a full roadmap with chapters and resources.
  - **Body**: `{ "topic": "React Hooks", "skillLevel": "intermediate" }`

### Chapters & Progress
- `GET /api/v1/chapters/:id`: Get chapter details.
- `PATCH /api/v1/chapters/:id/complete`: Mark a chapter as finished.
- `POST /api/v1/chapters/:id/notes`: Save a note for a chapter.

### Assessments & Challenges
- `POST /api/v1/assessments/generate`: Generate a new quiz for a chapter.
- `POST /api/v1/assessments/submit`: Submit answers and get a score/feedback.
- `GET /api/v1/assessments/history/:chapterId`: View past quiz attempts for a chapter.
- `POST /api/v1/challenges/generate`: Generate a practical mini-challenge for a chapter.
- `POST /api/v1/challenges/:id/respond`: Submit a response for a practical challenge.
- `GET /api/v1/challenges/history/:chapterId`: View past challenge history.

### Internal (Cron-Triggered)
> Secured with `x-cron-secret` header. Returns `401` if the secret is missing or invalid.

- `POST /api/v1/internal/run-reminders`: Trigger timezone-aware streak reminder emails. Only sends to users whose local hour matches their configured `reminderHour`.
- `POST /api/v1/internal/reset-streaks`: Reset streaks for users who haven't been active since before yesterday.

### Dashboard & Analytics
- `GET /api/v1/dashboard/stats`: Retrieve comprehensive user statistics and progress metrics.

---

## 📖 Usage Guide
1.  **Onboarding**: First-time users are greeted with a guided tour to help them understand AI generation and streak tracking.
2.  **Generate Path**: Use the AI generator or click a **topic suggestion** to quickly build a learning path.
3.  **Study & Annotate**: Use curated resources and **take detailed notes** to improve future AI-generated challenges.
4.  **Track & Install**: Install the **PWA** for mobile access and real-time progress updates.
5.  **Practical Mastery**: Complete both AI quizzes and **practical challenges** to verify conceptual and application-based knowledge.
6.  **Engagement**: Check the dashboard for **advanced analytics** and watch for **email reminders** to keep your streak alive.

---

## 🛠️ Scripts & Commands

### Backend
| Command | Description |
| :--- | :--- |
| `npm run start:dev` | Start development server with hot reload |
| `npm run build` | Build the project for production |
| `npm run start:prod` | Run the production build |
| `npm run test` | Run unit tests |

### Frontend
| Command | Description |
| :--- | :--- |
| `npm run dev` | Start Vite development server |
| `npm run build` | Build for production |
| `npm run preview` | Locally preview production build |
| `npm run lint` | Run ESLint |

---

## 🤝 Contributing
1. Fork the project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## 📄 License
Distributed under the **UNLICENSED** (Private/Internal) License. See `backend/package.json` for details.
