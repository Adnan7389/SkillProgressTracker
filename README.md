# SkillProgressTracker 🚀

A modern, AI-powered learning path generator and progress tracker. SkillProgressTracker helps users master new skills by generating structured roadmaps, discovering curated resources (docs and videos), and tracking learning consistency through streaks and progress bars.

## 📋 Table of Contents
- [Overview](#-overview)
- [Key Features](#-key-features)
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

**Target Users**: Self-taught developers, students, and professionals looking to upskill efficiently.

---

## 🔥 Key Features

### 🤖 AI-Powered Roadmaps
- **Dynamic Generation**: Uses Google Gemini AI to create tailored learning paths based on topic and skill level (Beginner, Intermediate, Advanced).
- **Intelligent Recommendations**: AI analyzes your progress and recommends the most logical next step.

### 📚 Resource Discovery
- **Multi-Source Curation**: Automatically attaches 3-5 curated resources (official MDN/docs and YouTube tutorials) to every chapter.
- **Asynchronous Discovery**: Resources are fetched in the background using parallel processing.

### 📈 Progress & Gamification
- **Visual Progress**: Real-time progress bars for each learning path.
- **Consistency Tracking**: Integrated streak system to encourage daily learning.
- **Chapter Notes**: Users can take and save notes directly within each chapter.

### 🔐 Secure Authentication
- **Session-Based Auth**: Powered by `better-auth` for secure, cookie-based authentication.
- **Protected Routes**: Ensuring user data privacy across the dashboard and learning paths.

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

1.  **Frontend (React)**: Handles the UI/UX, state management with Zustand, and communicates with the backend via a RESTful API.
2.  **Backend (NestJS)**:
    - **Controllers**: Handle HTTP requests and routing.
    - **Services**: Contain business logic (AI prompt engineering, resource discovery, progress calculation).
    - **Modules**: Domain-driven structure (`AiModule`, `LearningPathsModule`, `ChaptersModule`, `AuthModule`).
    - **Database (MongoDB)**: Stores users, learning paths, chapters, and resources using Mongoose schemas.
3.  **AI Layer**: Connects to Google Gemini API to generate structured JSON roadmaps and learning materials.

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

### Backend Setup
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
   ```
4. Start the development server:
   ```bash
   npm run start:dev
   ```

### Frontend Setup
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

---

## 📖 Usage Guide
1.  **Dashboard**: Upon logging in, view your current learning paths and daily streak.
2.  **Generate Path**: Click "Create New Path", enter a topic, select your level, and let the AI generate a roadmap for you.
3.  **Study**: Click on a chapter to see curated documentation and videos.
4.  **Track**: Mark chapters as completed to see your progress bar move. Maintain your streak by completing at least one chapter every 24 hours.

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
