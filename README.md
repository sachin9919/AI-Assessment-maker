# VedaAI - AI Assessment Creator

VedaAI is a modern, responsive full-stack platform that empowers educators to design, generate, and customize assignments and question papers using AI. Teachers can specify topic guidelines, question types, scoring, and upload supporting material to create formatted exams with complete answer keys.

## Features

- **Dynamic Exam Builder:** Form-driven configuration for due dates, diverse question types, custom counts, and individual weights.
- **AI-Powered Generation:** Leverages Google Gemini for structured question drafting and difficulty profiling (Easy, Medium, Hard).
- **Background Pipeline:** Handled via BullMQ and Upstash Redis for fast, asynchronous prompt queuing and generation.
- **Live Notifications:** Uses Socket.IO for real-time progress updates during the assessment compilation phase.
- **Export Options:** Interactive PDF compilation featuring multi-page optimization and direct download.
- **Unified Navigation:** Custom-designed interfaces for:
  - **Assignments:** Dashboard lists, create form, and result screens.
  - **My Groups:** Class organization and student groupings.
  - **AI Teacher's Toolkit:** Prompt resources and tool generators (Lesson Plan, Rubric, Question Bank).
  - **My Library:** Central catalog of saved assessments and template banks.
  - **Settings:** Custom configuration and Google Classroom integrations.
- **Secure Access:** Cookie-secured JWT auth shielding user-scoped records.

## Tech Stack

- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS, Zustand, Socket.IO Client.
- **Backend:** Node.js, Express, TypeScript, Mongoose, BullMQ, Socket.IO.
- **Database & Storage:** MongoDB Atlas (Persistent store), Upstash Redis (Task broker), Cloudinary (Resource uploads).
- **AI Engine:** Google Gemini AI API.

## Project Structure

```
├── backend/            # Express REST API & Background Queue Workers
├── frontend/           # Next.js Dashboard Client Web Application
├── shared/             # Common schema definitions and TypeScript interfaces
├── render.yaml         # Infrastructure deployment blueprint for Render services
└── DEPLOY_RENDER.md    # Production hosting guide
```

## Local Development Setup

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas cluster
- Upstash Redis database
- Google Gemini API credentials
- Cloudinary developer account

### 2. Backend Configuration
Navigate to the `backend` folder, install dependencies, and create a `.env` file:
```bash
cd backend
npm install
```
`.env` contents:
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
MONGO_URI=your_mongodb_atlas_uri
UPSTASH_REDIS_URL=your_upstash_redis_uri
GEMINI_API_KEY=your_gemini_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
JWT_SECRET=your_jwt_secret_phrase
JWT_EXPIRY=7d
```
Start the development API:
```bash
npm run dev
```

### 3. Frontend Configuration
Navigate to the `frontend` folder, install dependencies, and create a `.env.local` file:
```bash
cd frontend
npm install
```
`.env.local` contents:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
BACKEND_URL=http://localhost:5000
```
Start the Next.js development client:
```bash
npm run dev
```
Access the application at `http://localhost:3000`.

## Production Deployment

This project includes a pre-configured `render.yaml` deployment blueprint. Follow the instructions in `DEPLOY_RENDER.md` to deploy both the Express API and Next.js client directly to Render.
