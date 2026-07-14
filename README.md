# eduNext — Lumina Learning Platform

A React + TypeScript + Vite learning platform with a student portal, a teacher
portal, and an AI webcam attention-tracking feature. Built from the eduNext
design handoff (42 screens, "Lumina Learning System" design system).

## Quick start

```bash
npm install
npm run dev          # frontend at http://localhost:5173
```

For the AI webcam feature, run the two backends in separate terminals:

```bash
npm run server       # Node webcam-upload server  -> http://localhost:5000
npm run flask        # Flask attention analyzer    -> http://localhost:5001
```

> The Flask analyzer needs `flask`, `flask-cors`, `opencv-python`, `numpy`,
> `tensorflow` for real face/emotion detection (`pip install -r backend/requirements.txt`).
> If those libraries (or the Keras weights) are missing, it **automatically falls
> back** to a stdlib HTTP server + heuristic so the frontend keeps working.

## Demo credentials

| Role    | Fields                                   | Values                          |
| ------- | ---------------------------------------- | ------------------------------- |
| Student | School Code / Student ID / PIN           | `EDU001` / `STU001` / `1234`    |
| Teacher | Email / Password                         | any email / `teacher123`        |

Other students: `STU002`–`STU005` (same school code + PIN).

## Project structure

```
src/
  App.tsx                 All routes
  main.tsx                Bootstraps + seeds IndexedDB
  lib/
    database.ts           Dexie schema + helpers (auth, courses, quizzes…)
    mockData.ts           Seed students / teachers / courses / quizzes
    utils.ts              cn(), formatBytes(), timeAgo()
  contexts/LanguageContext.tsx   English / Hindi / Punjabi
  utils/translations.ts
  components/
    StudentSidebar.tsx TeacherSidebar.tsx TopBar.tsx
    Layout.tsx              StudentLayout / TeacherLayout (route guard + shell)
    TeacherStudentShell.tsx Shared student-detail header + tabs
    ui.tsx                  Card, StatCard, Badge, ProgressBar, PageHeader, EmptyState
  pages/
    *.tsx                  41 proper React pages (no raw-HTML shells), all
                           Dexie-wired, navigating via <Link>
backend/
  server.cjs              Node upload server (port 5000)
  app.py                  Flask analyzer (port 5001, graceful fallback)
  video_analyzer.py       OpenCV + Keras pipeline
machine_learning/weights/ Drop emotion_model_best.keras here
designs/                  The 42 source design folders (screen.png + DESIGN.md + code.html)
```

## How the pages were built

Every page is hand-written React/TSX (no raw-HTML shells, no
`dangerouslySetInnerHTML`). Pages pull their data from the Dexie layer in
`src/lib/database.ts` / `src/lib/mockData.ts`, navigate with `<Link>`, and are
guarded by `StudentLayout` / `TeacherLayout` (redirect to login if there's no
matching session). The design system — primary green `#12A150`, navy `#002045`,
Inter + Plus Jakarta Sans, glassmorphism cards — is applied consistently via the
shared sidebars, top bar, and `components/ui.tsx` primitives. The original design
screens live under `designs/` for visual reference.

The **CourseVideo** AI page keeps the full webcam pipeline:

1. Ask webcam permission → `getUserMedia`
2. `MediaRecorder` records the session as `.webm`
3. Every 3s a canvas frame is POSTed to `localhost:5001/analyze`
4. On video end → stop recording → `GET /next-student-id` → `POST /upload` → redirect to the quiz

## Routes

All 40+ routes from the handoff are wired in `src/App.tsx` (student dashboard,
courses, my-courses, course-video, quizzes, progress, assignments, challenges,
leaderboard, streak-pot, announcements, downloads, career-find, community,
apprenticeships, profile, settings; teacher dashboard, courses, create-course
steps, students list/profile/attention/assignments/quiz, recordings, quizzes,
assignments, reports, community, announcements, apprenticeships, profile,
settings).
```
```

## Build

```bash
npm run build        # tsc --noEmit + vite build  (verified clean)
npm run preview
```
