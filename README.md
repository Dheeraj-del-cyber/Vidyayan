# 🎓 Vidyayan (विद्यायन)

> **A Learning-Continuity Workspace for Children of Migrant Families**  
> Preserving educational progress, bridging state curriculum gaps, and supporting multi-lingual learning across state migrations in India.

---

## 📌 Table of Contents

- [Overview & Mission](#-overview--mission)
- [Key Features](#-key-features)
  - [1. Student Dashboard & Profile Management](#1-student-dashboard--profile-management)
  - [2. Daily Date-Based Tasks & Strict Watch Mode](#2-daily-date-based-tasks--strict-watch-mode)
  - [3. Learning Progress & Analytics Graph](#3-learning-progress--analytics-graph)
  - [4. Curriculum Bridge & Syllabus Finder](#4-curriculum-bridge--syllabus-finder)
  - [5. Multilingual Lesson Translation](#5-multilingual-lesson-translation)
  - [6. Secure User Authentication](#6-secure-user-authentication)
- [Project Architecture](#-project-architecture)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [1. Backend & Database Setup](#1-backend--database-setup)
  - [2. Frontend Setup](#2-frontend-setup)
- [API Endpoints](#-api-endpoints)
- [License](#-license)

---

## 🌟 Overview & Mission

When families migrate across state borders for work, children often face severe learning disruptions due to differences in state syllabi, medium of instruction, and academic calendars. 

**Vidyayan** provides a seamless digital learning continuity record that:
- **Tracks persistent academic progress** regardless of geographic relocations.
- **Maps learning gaps** between origin and destination state curriculums.
- **Translates lessons** into the child's native language.
- **Enforces interactive daily learning tasks** with strict verification mechanisms.

---

## 🔥 Key Features

### 1. Student Dashboard & Profile Management
- **Interactive Student Cards**: View registered children with class level, photo avatar, and quick access to study routines.
- **Add / Edit Student Modal**: Add new student profiles or update existing ones with form validation and photo uploads.
- **Demo Data Generator**: Single-click `"Generate Demo Student"` button to populate test profiles instantaneously during testing.
- **Delete Student Record**: Low-profile icon-only delete action (`<Trash2 />`) with confirmation prompts to remove obsolete records.

### 2. Daily Date-Based Tasks & Strict Watch Mode
- **Date-Grouped Accordion**: Tasks organized chronologically (*Today*, *Yesterday*, *Tomorrow*) with collapsible task cards.
- **Interactive YouTube Embeds**: Embedded video lessons tied directly to specific syllabus chapters.
- **Strict Video Verification**: Enforces full video view duration before unlocking the completion button (`"Watching Video... 34s remaining"`). Children cannot skip or instantly mark videos as completed without watching.
- **Interactive Micro-Quizzes**: Multiple-choice questions for knowledge verification with instant feedback and animated tick bars.

### 3. Learning Progress & Analytics Graph
- **Liquid Wave Mastery Gauge**: Animated circular gauge displaying overall mastery percentage (68%) with undulating liquid waves and floating bubbles.
- **Warm Light Hero Banner**: Soft orange banner (`#fff5ee` → `#ffebd9`) highlighting active learning streaks, bridged gaps, and total study hours.
- **High-Contrast Mastery Graph**:
  - High-precision SVG curve graph styled in crisp dark slate black (`#0f172a`).
  - Animated line path drawing (`@keyframes drawGraphLine`), translucent area fill, pulsing node rings, and popover tooltips.
  - Interactive Y-axis percentage scale (`0%` - `100%`) and growth badge (`+32% Growth`).
  - **Subject Filter Tabs**: Filter weekly performance dynamically across *Overall*, *Mathematics*, *Science*, *English*, and *Social Science*.
- **Persistent Learning Record**: Dedicated panel documenting completed chapters, bridged gaps, pending gaps, and live synchronization status.

### 4. Curriculum Bridge & Syllabus Finder
- **State Transition Gap Analyzer**: Maps subject-wise chapter overlaps and differences when moving between states (e.g., Maharashtra → Karnataka).
- **PDF Syllabus Extractor**: Server-side Python engine utilizing `pypdf` to parse and analyze uploaded state syllabus documents.

### 5. Multilingual Lesson Translation
- **Express Translation Proxy**: Backend proxy interfacing with LibreTranslate to enable real-time lesson translations.
- **Supported Languages**: Hindi, Kannada, Marathi, Tamil, Telugu, Gujarati, Bengali, and English.

### 6. Secure User Authentication
- **Registration Form**: Collects full family migration context (phone, password, native language, origin state, destination state, migration month & year).
- **Security**: Passwords hashed using `bcrypt`. Stateful API calls authenticated via JSON Web Tokens (JWT).
- **Route Guarding**: All app views are protected behind authentication middleware.

---

## 📁 Project Architecture

```
vidyayan/
├── frontend/                 # React 18 + Vite Web Application
│   ├── src/
│   │   ├── AddStudent.jsx    # Add / Edit Student component with Demo Generator
│   │   ├── DailyTasks.jsx    # Date-based daily task accordion & strict video mode
│   │   ├── Progress.jsx      # Progress analytics & black curve SVG line graph
│   │   ├── StudentDashboard.jsx # Main Dashboard view with student cards
│   │   ├── CurriculumBridge.jsx # State-to-state syllabus mapping
│   │   ├── TranslateLesson.jsx  # Multilingual lesson translator
│   │   ├── Login.jsx & Register.jsx # Authentication pages
│   │   ├── studentsStore.js  # Persistent student store (localStorage synced)
│   │   ├── progress.css      # Progress page & SVG graph animations
│   │   └── daily-tasks.css   # Daily task accordion & timer styles
│   ├── index.html
│   └── vite.config.js
│
├── backend/                  # Node.js + Express API Server
│   ├── routes/
│   │   ├── authRoutes.js     # User registration and JWT login routes
│   │   ├── translateRoutes.js# LibreTranslate API proxy route
│   │   └── syllabusRoutes.js # Python PDF syllabus extractor launcher
│   ├── extract_pdf.py        # Python script using pypdf for PDF parsing
│   ├── server.js             # Express app entry point & database initializer
│   └── requirements.txt      # Python dependencies
│
└── database/                 # SQLite Database Layer
    ├── schema.sql            # Table definitions (users, students, progress)
    └── vidyayan.db           # Auto-generated SQLite database instance
```

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Lucide React, Custom CSS (Variables, Glassmorphism, Animations)
- **Backend**: Node.js, Express.js, JSON Web Tokens (JWT), Bcrypt
- **Database**: SQLite3
- **PDF Processing Engine**: Python 3, `pypdf`
- **Icons & Typography**: Lucide Icons, Google Fonts (*Fraunces*, *Outfit*, *Inter*)

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your system:
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Python**: v3.9 or higher (with `pip`)

---

### 1. Backend & Database Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Install Python dependencies for PDF parsing:
   ```bash
   python -m pip install -r requirements.txt
   ```

4. Create the environment configuration:
   ```bash
   cp .env.example .env
   ```
   *(Optional: Adjust `PYTHON_EXECUTABLE`, `JWT_SECRET`, or `PORT` in `.env` if needed)*

5. Start the backend dev server:
   ```bash
   npm run dev
   ```
   The backend API will run at **`http://localhost:4000`**. The SQLite database (`database/vidyayan.db`) will be automatically created on first boot.

---

### 2. Frontend Setup

1. Open a new terminal tab and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to **`http://localhost:5173`**.

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Create a new user account with migration details.
- `POST /api/auth/login` - Authenticate user credentials and return JWT token.

### Translation & Syllabus
- `POST /api/translate` - Proxy lesson text translation requests to LibreTranslate.
- `POST /api/syllabus/extract` - Extract structured text from uploaded syllabus PDF files.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.
