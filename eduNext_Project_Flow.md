# 📋 eduNext — Complete Project Flow & Design Handoff
> **For Claude Code:** This is the single source of truth. It covers the existing codebase logic, the full updated route map (including new pages from the design), the design system tokens, and exact instructions on what to build vs what to only restyle.

---

## 🎨 Design System

All 42 pages share one consistent design system called **"Lumina Learning System"**.

### Color Tokens
```
Primary (Deep Navy):       #002045 / #1A365D
Primary Action Green:      #12A150 / #006e2f
Secondary Container Green: #6bff8f
Accent Blue (links):       #4F46E5
Background:                #f7f9fb
Surface (cards):           #ffffff (70-80% opacity with backdrop-blur: 12px)
On-Surface (text):         #191c1e
Muted text:                #43474e
Border:                    #D1D5DB
Subtle bg:                 #F3F4F6
Error:                     #ba1a1a
```

### Typography
```
Font families: Inter (body/labels) + Plus Jakarta Sans (display headlines)
headline-xl:   Inter 48px/700  line-height:56px  tracking:-0.02em
headline-lg:   Inter 32px/700  line-height:40px  tracking:-0.01em
headline-md:   Inter 24px/600  line-height:32px
body-lg:       Inter 18px/400  line-height:28px
body-md:       Inter 16px/400  line-height:24px
label-md:      Inter 14px/600  line-height:20px  tracking:0.01em
label-sm:      Inter 12px/500  line-height:16px
```

### Elevation / Glassmorphism
```
Level 0 - Background:   #f7f9fb solid or subtle gradient
Level 1 - Cards:        bg-white/80 backdrop-blur-md border border-white/20 shadow-sm
Level 2 - Modals:       bg-white/90 backdrop-blur-xl shadow-lg
Level 3 - Active:       ring-2 ring-primary shadow-primary/20
```

### Shape / Spacing
```
Radius:  buttons/inputs: 8px | cards: 16px | feature sections: 24px | pills: 9999px
Spacing base unit: 8px
Container max: 1280px
Desktop gutters: 24px, margins: 40px
Mobile margins: 16px
```

### Component Rules
- **Primary buttons:** solid green (#12A150) bg, white text, slight scale-up on hover
- **Secondary buttons:** white bg, 1px #D1D5DB border
- **Inputs:** off-white bg → white bg + green border on focus, labels always above
- **Cards:** glass backdrop-filter, 4px upward translate on hover
- **Progress bars:** 12px+ height, fully rounded caps, green fill, pulse animation when active
- **Chips/Tags:** pill radius (32px), low-saturation primary/tertiary colors

---

## 🗺️ Complete Route Map (Updated — includes new pages)

### Public Routes
```
/                          → Landing.tsx                      [REDESIGN]
/student-login             → StudentLogin.tsx                 [REDESIGN]
/teacher-login             → TeacherLogin.tsx                 [REDESIGN]
```

### Student Routes
```
/dashboard                 → Dashboard.tsx                    [REDESIGN]
/courses                   → Courses.tsx                      [REDESIGN]
/my-courses                → MyCourses.tsx                    [REDESIGN]
/lesson/:id                → LessonPage.tsx                   [REDESIGN]
/course-video/:id          → CourseVideo.tsx                  [REDESIGN] ⭐ AI webcam
/quiz/:id                  → QuizTake.tsx                     [REDESIGN]
/quizzes                   → Quizzes.tsx                      [REDESIGN]
/progress                  → Progress.tsx                     [REDESIGN]
/assignments               → Assignments.tsx                  [REDESIGN]
/challenges                → Challenges.tsx                   [REDESIGN]
/leaderboard               → Leaderboard.tsx                  [REDESIGN]
/streak-pot                → StreakPot.tsx                    [REDESIGN]
/announcements             → Announcements.tsx                [REDESIGN]
/downloads                 → Downloads.tsx                    [REDESIGN]
/career-find               → CareerFind.tsx                   [REDESIGN]
/community                 → Community.tsx                    [REDESIGN]
/apprenticeships           → Apprenticeships.tsx              [REDESIGN]
/profile                   → StudentProfile.tsx               [🆕 NEW PAGE]
/settings                  → StudentSettings.tsx              [🆕 NEW PAGE]
```

### Teacher Routes
```
/teacher-dashboard         → TeacherDashboard.tsx             [REDESIGN]
/teacher-students          → TeacherStudentsList.tsx          [🆕 NEW PAGE]
/teacher-students/:id      → TeacherStudentProfile.tsx        [🆕 NEW PAGE]
/teacher-students/:id/attention   → TeacherStudentAttention.tsx   [🆕 NEW PAGE]
/teacher-students/:id/assignments → TeacherStudentAssignments.tsx [🆕 NEW PAGE]
/teacher-students/:id/quiz        → TeacherStudentQuiz.tsx        [🆕 NEW PAGE]
/teacher-dashboard/students-recordings → TeacherDashboardStudents.tsx [REDESIGN]
/play-video/:student/:filename     → PlayVideoPage.jsx            [REDESIGN]
/teacher-quizzes           → TeacherQuizzes.tsx               [🆕 NEW PAGE]
/teacher-reports           → TeacherReports.tsx               [🆕 NEW PAGE]
/teacher-community         → TeacherCommunity.tsx             [REDESIGN]
/teacher-announcements     → (inside TeacherDashboard or new route) [REDESIGN]
/teacher-apprenticeships   → (teacher view)                   [REDESIGN]
/teacher-profile           → TeacherProfile.tsx               [🆕 NEW PAGE]
/teacher-settings          → TeacherSettings.tsx              [🆕 NEW PAGE]
```

### Misc / Legacy Routes (keep but lower priority)
```
/vr-cardboard              → VRCardboard.tsx
/schools                   → Schools.tsx
/teachers                  → Teachers.tsx
/mentors                   → Mentors.tsx
/ngos                      → NGOs.tsx
/image-to-3d               → ImageTo3D.tsx
/about                     → About.tsx
/contact                   → Contact.tsx
/index                     → Index.tsx
*                          → NotFound.tsx
```

---

## 🔄 Complete User Flows

### Student Flow
```
/ (Landing)
  ├── "Start Learning" → /student-login
  │     Layout: Split screen — left: lifestyle photo, right: form
  │     Toggle: [Student] [Teacher] tabs at top right
  │     Fields: School Code + Student ID + PIN  (student tab)
  │     Mock creds: schoolCode=EDU001, studentId=STU001, pin=1234
  │     → On success: /dashboard
  │
  └── "Teacher Login" → /teacher-login
        Same split-screen layout, Teacher tab active
        Fields: Email + Password
        Mock creds: any teacher email, password=teacher123
        → On success: /teacher-dashboard

/dashboard (Student Dashboard)
  Sidebar sections:
    MENU:
      Dashboard → /dashboard         [active]
      Courses → /courses
      My Courses → /my-courses
      Progress & Streaks → /progress
    ACTIVITIES:
      Quizzes → /quizzes
      Assignments → /assignments
      Peer Challenges → /challenges
      Streak Pot → /streak-pot
      My Apprenticeships → /apprenticeships
      Leaderboard → /leaderboard
    RESOURCES:
      Announcements → /announcements
      Downloads → /downloads
      Career Find → /career-find
      Explore Community → /community
    BOTTOM:
      Logout

  Main content:
    - Hero banner: "Welcome back, [name]" + current course + progress bar + "Continue Learning" btn
    - Stat cards: Current Streak | Total Points | Courses Enrolled | Assignments Pending
    - "Continue Learning" course cards (from IndexedDB enrollments)

/my-courses → lists enrolled courses with progress
  └── Click "Continue" → /lesson/:id

/lesson/:id → lesson content viewer
  └── Click "Watch Video" → /course-video/:id

/course-video/:id  ⭐ THE CORE AI PAGE
  Layout:
    - Left sidebar: course modules list with progress indicators
    - Main: video player (full width top)
    - Below video: lesson title + Ask Doubt btn + Materials btn
    - 4 info cards below:
        1. LIVE WEBCAM FEED — shows webcam thumbnail with REC indicator + "Webcam Connected"
        2. LEARNING INSIGHTS — Attention Score %, Dominant Emotion, Attention Trend, Blink Rate, Gaze Stability, Focus Duration
        3. SESSION INFORMATION — Session Duration, Video Progress, Current Lesson, Lessons Completed
        4. PRIVACY NOTICE — text about webcam usage
  Logic (DO NOT CHANGE):
    - Webcam permission prompt on load
    - MediaRecorder records webcam as .webm
    - setInterval → canvas capture → Base64 → POST localhost:5001/analyze
    - Response: { emotion, attention_score, eye_status, head_pos }
    - On video end → stop recording → POST blob to localhost:5000/upload → redirect to /quiz/:id

/quiz/:id → quiz interface
  → Submit → back to /dashboard

/profile → Student profile page (NEW)
  Shows: avatar, name, school, stats, badges, enrolled courses

/settings → Student settings page (NEW)
  Shows: language preference, notification settings, account info
```

---

### Teacher Flow
```
/teacher-login
  Same split-screen as student login, Teacher tab active
  Left: teacher/library photo
  Right: "Welcome Back, Educator" + email/password form + "As a Teacher You Can:" info box

/teacher-dashboard
  Sidebar (LEFT, always visible):
    Logo: EduNext / Teacher Dashboard
    Teacher name + avatar
    + Create New Course (green CTA button)
    ---
    Dashboard → /teacher-dashboard
    Courses → /teacher-dashboard (courses tab)
    Students → /teacher-students
    Learning Analytics → /teacher-dashboard (analytics tab)
    Attention Analytics (expandable):
      └── Webcam Recordings → /teacher-dashboard/students-recordings
    Quizzes → /teacher-quizzes
    Assignments → /teacher-dashboard (assignments tab)
    Community → /teacher-community
    Announcements → /teacher-dashboard (announcements tab)
    Apprenticeships → /teacher-apprenticeships
    Reports → /teacher-reports
    ---
    Settings → /teacher-settings
    Logout

  Main content:
    - "Welcome back, Dr. [name]"
    - 4 stat cards: Total Courses | Total Students | Total Assignments | Total Quizzes
    - Quick Actions: Create New Course | Create Quiz | Create Assignment | Publish Announcement
    - Active Courses section (cards with Manage + Analytics buttons)
    - Recent Activity feed

/teacher-students  (🆕 NEW PAGE — TeacherStudentsList.tsx)
  - Filters: Course | Attention Status | Performance | More Filters
  - 4 stat cards: Total Students | Active Learners | Requiring Attention | Avg. Completion
  - Table: Student | Courses | Completion | Attention | Quiz Avg | Last Active | Status | Action
  - Each row has "View Profile" button → /teacher-students/:id
  - Pagination

/teacher-students/:id  (🆕 NEW PAGE — TeacherStudentProfile.tsx)
  - Breadcrumb: Students > [Student Name]
  - Profile card: photo, name, email, department, year, enrolled date, active status
  - Right panel: Attention Status badge + Avg Completion % + Quiz Avg % + Assignment Rate progress bar
  - Tabs: Overview | Attention Reports | Webcam Recordings | Quiz Performance | Assignment History
  - Overview tab: Current Enrollments (with progress bars) + Recent Activity feed
  - Right sidebar: Learning Streak card + Program Progress + Last Active

/teacher-students/:id/attention  (🆕 — TeacherStudentAttention.tsx)
  - Same profile header
  - Attention Reports tab active
  - Charts showing attention over time per session

/teacher-students/:id/assignments  (🆕 — TeacherStudentAssignments.tsx)
  - Assignment History tab active
  - Table of all submitted assignments with grades

/teacher-students/:id/quiz  (🆕 — TeacherStudentQuiz.tsx)
  - Quiz Performance tab active
  - Quiz scores per course

/teacher-dashboard/students-recordings  (REDESIGN)
  - Student profile header with photo + name + Student ID + "Webcam Recordings" label
  - Course Filter + Date Range filter
  - Each recording card: thumbnail (webcam still) | lesson name | course tag | date + time | Teacher Notes section | View button
  - View button → /play-video/:student/:filename

/play-video/:student/:filename
  - Dedicated video player
  - Back button → returns to recordings list

/teacher-quizzes  (🆕 NEW PAGE)
  - List of all quizzes across courses
  - Create quiz button
  - Per quiz: name, course, attempts, avg score

/teacher-reports  (🆕 NEW PAGE)
  - Header: Reports + Export PDF + Export Excel + Generate Report buttons
  - 4 stat cards: Total Reports | Course Reports | Student Reports | Attention Reports
  - Tabs: Attention Reports | Quiz Reports | Assignment Reports | Course Reports
  - Attention Reports tab:
      Left: Engagement Trends line chart (Last 30 Days)
      Below: Recent Attention Sessions table (Date | Course | Avg Attention progress bar | Status badge)
      Right: Avg Attention Score donut chart (75%) + Emotion Distribution bars (Focused/Confused/Distracted) + Blink Analytics

/teacher-profile  (🆕 NEW PAGE)
  - Teacher profile info, bio, subject areas

/teacher-settings  (🆕 NEW PAGE)
  - Notification preferences, account settings
```

---

## 🧩 Components Breakdown

### Existing Components (restyle only)
| Component | File | Used In |
|---|---|---|
| Layout | `Layout.tsx` | Most pages — controls nav visibility |
| HeroSection | `HeroSection.tsx` | Landing — big hero + CTA |
| PillarsSection | `PillarsSection.tsx` | Landing — "Core Platform" features |
| FAQSection | `FAQSection.tsx` | Landing — accordion FAQ |
| MultiLoginModal | `MultiLoginModal.tsx` | Landing — login modal |
| StudentDashboard | `StudentDashboard.tsx` | Dashboard main content |
| TeacherSidebar | `TeacherSidebar.tsx` | Teacher pages — left sidebar |
| LessonViewer | `LessonViewer.tsx` | LessonPage |
| ModuleCard | `ModuleCard.tsx` | Courses / MyCourses |
| QuizInterface | `QuizInterface.tsx` | QuizTake |
| StreakTracker | `StreakTracker.tsx` | Dashboard |
| BadgeDisplay | `BadgeDisplay.tsx` | Progress / Dashboard |
| AnimatedCounter | `AnimatedCounter.tsx` | Various stat displays |
| LanguageSelector | `LanguageSelector.tsx` | Landing / Dashboard |
| PWAInstaller | `PWAInstaller.tsx` | Landing |

### New Components to Create
| Component | Used In |
|---|---|
| `TeacherStudentsList.tsx` | /teacher-students |
| `TeacherStudentProfile.tsx` | /teacher-students/:id |
| `TeacherStudentTabs.tsx` | Student detail tabs (Attention/Webcam/Quiz/Assignments) |
| `TeacherReports.tsx` | /teacher-reports |
| `TeacherQuizzes.tsx` | /teacher-quizzes |
| `StudentProfile.tsx` | /profile |
| `StudentSettings.tsx` | /settings |
| `TeacherProfile.tsx` | /teacher-profile |
| `TeacherSettings.tsx` | /teacher-settings |
| `AttentionScoreCard.tsx` | CourseVideo, Reports |
| `WebcamFeed.tsx` | CourseVideo (extracted from inline) |

---

## 🗄️ Data Layer (DO NOT CHANGE)

### IndexedDB via Dexie (`src/lib/database.ts`)
Tables:
- `users` — Student & Teacher accounts
- `courses` — Teacher-created courses (TeacherCourse type: title, desc, language, level, duration, teacherId, videos[], materials[])
- `enrollments` — Student ↔ Course with progress %
- `lessons` — Individual lessons per course
- `quizzes` — Quiz questions per lesson
- `downloads` — Offline downloaded content (with Blob)
- `assignments` — Teacher-posted (title, subject, dueDate, instructions)
- `submissions` — Student assignment submissions
- `doubts` — Student questions/doubts with attachments
- `progress` — Per-student progress records

Key functions:
- `getCurrentUser()` / `setCurrentUser(user)` / `clearCurrentUser()`
- `getTeacherCourses(teacherId)` / `addTeacherCourse(course)` / `updateTeacherCourse()` / `deleteTeacherCourse(id)`
- `addAssignmentNew()` / `getAssignmentsForTeacher()` / `getSubmissionsForAssignment()` / `gradeSubmission()`
- `db.enrollments.where('studentId').equals(1).toArray()`

### Mock Data (`src/lib/mockData.ts`)
**Students** (all schoolCode: EDU001, pin: 1234):
- STU001 — Simran Kaur
- STU002 — Rajveer Singh
- STU003 — Priya Sharma
- STU004 — Arjun Patel
- STU005 — Manpreet Kaur

**Teachers** (password: teacher123):
- Various teacher emails in mockUsers array

---

## ⭐ Core AI Feature — CourseVideo.tsx (DO NOT CHANGE LOGIC)

```
On page load:
  1. Load course from IndexedDB via getTeacherCourses()
  2. Ask webcam permission (askPermission state)
  3. On allow → start webcam stream (webcamRef)
  4. Start MediaRecorder on webcamStreamRef

While video plays (setInterval every ~3s):
  → canvas.drawImage(webcamRef) → toDataURL('image/jpeg')
  → POST http://localhost:5001/analyze
     body: { image: base64string, studentId, sessionId }
  ← response: { emotion, attention_score, eye_status, head_pos }
  → update attentionScore state, emotion state (for UI display)

On video end:
  → mediaRecorder.stop()
  → blob created from recordedChunks
  → GET http://localhost:5000/next-student-id
  → POST http://localhost:5000/upload?student=Student-X&filename=Student-X_timestamp.webm
  → navigate('/quiz/:id')

UI to build around this (from design):
  - Left sidebar: module list with lock/check icons
  - Top: full-width video player
  - Below: 4 cards side by side:
      [LIVE WEBCAM FEED] [LEARNING INSIGHTS] [SESSION INFORMATION] [PRIVACY NOTICE]
```

---

## 🐍 Backend Servers (DO NOT CHANGE)

### Node.js (`backend/server.cjs`) — Port 5000
| Endpoint | Method | What it does |
|---|---|---|
| `/next-student-id` | GET | Auto-increments Student-N folder ID |
| `/upload?student=X&filename=Y` | POST | Saves webcam .webm blob to disk |
| `/recordings/:student` | GET | Lists recordings for a student |

### Python Flask (`backend/app.py`) — Port 5001
| Endpoint | Method | What it does |
|---|---|---|
| `/analyze` | POST | Base64 frame → OpenCV + Keras → returns attention JSON |

**AI Pipeline in `video_analyzer.py`:**
1. Base64 decode → OpenCV frame
2. Haar Cascade → detect face
3. Haar Cascade → detect eyes in face
4. Keras CNN (48×48 grayscale) → emotion: Negative / Neutral / Positive
5. Score: base 60 + head centered +20 + eyes open +20 = max 100
6. Log to `attention_log.csv`
7. Return `{ emotion, attention_score, eye_status, head_pos }`

---

## 🌐 Language Support (Keep)
- English / Hindi / Punjabi
- `LanguageContext` + `translations.ts`
- Persisted in localStorage as `eduNext_language`

---

## 📁 Full Folder Structure

```
/
├── src/
│   ├── App.tsx                  ← ADD all new routes here
│   ├── pages/
│   │   ├── Landing.tsx                        REDESIGN
│   │   ├── StudentLogin.tsx                   REDESIGN
│   │   ├── TeacherLogin.tsx                   REDESIGN
│   │   ├── Dashboard.tsx                      REDESIGN
│   │   ├── TeacherDashboard.tsx               REDESIGN
│   │   ├── TeacherDashboardStudents.tsx        REDESIGN
│   │   ├── CourseVideo.tsx                    REDESIGN (keep all logic)
│   │   ├── LessonPage.tsx                     REDESIGN
│   │   ├── QuizTake.tsx                       REDESIGN
│   │   ├── Quizzes.tsx                        REDESIGN
│   │   ├── PlayVideoPage.jsx                  REDESIGN
│   │   ├── MyCourses.tsx                      REDESIGN
│   │   ├── Courses.tsx                        REDESIGN
│   │   ├── Progress.tsx                       REDESIGN
│   │   ├── Assignments.tsx                    REDESIGN
│   │   ├── Downloads.tsx                      REDESIGN
│   │   ├── Announcements.tsx                  REDESIGN
│   │   ├── StreakPot.tsx                       REDESIGN
│   │   ├── Challenges.tsx                     REDESIGN
│   │   ├── Community.tsx                      REDESIGN
│   │   ├── TeacherCommunity.tsx               REDESIGN
│   │   ├── CareerFind.tsx                     REDESIGN
│   │   ├── Apprenticeships.tsx                REDESIGN
│   │   ├── Leaderboard.tsx                    REDESIGN
│   │   ├── StudentProfile.tsx                 🆕 CREATE NEW
│   │   ├── StudentSettings.tsx                🆕 CREATE NEW
│   │   ├── TeacherStudentsList.tsx            🆕 CREATE NEW
│   │   ├── TeacherStudentProfile.tsx          🆕 CREATE NEW
│   │   ├── TeacherStudentAttention.tsx        🆕 CREATE NEW
│   │   ├── TeacherStudentAssignments.tsx      🆕 CREATE NEW
│   │   ├── TeacherStudentQuiz.tsx             🆕 CREATE NEW
│   │   ├── TeacherQuizzes.tsx                 🆕 CREATE NEW
│   │   ├── TeacherReports.tsx                 🆕 CREATE NEW
│   │   ├── TeacherProfile.tsx                 🆕 CREATE NEW
│   │   └── TeacherSettings.tsx               🆕 CREATE NEW
│   ├── components/
│   │   ├── [all existing components]          RESTYLE
│   │   └── [new components listed above]      🆕 CREATE NEW
│   ├── contexts/
│   │   └── LanguageContext.tsx                KEEP AS IS
│   ├── lib/
│   │   ├── database.ts                        KEEP AS IS
│   │   └── mockData.ts                        KEEP AS IS
│   └── utils/
│       └── translations.ts                    KEEP AS IS
│
├── backend/
│   ├── server.cjs                             KEEP AS IS
│   ├── app.py                                 KEEP AS IS
│   └── video_analyzer.py                      KEEP AS IS
│
└── machine_learning/
    └── weights/emotion_model_best.keras        KEEP AS IS
```

---

## 📐 Design File → Route Mapping (42 design files)

| Design Zip | Route | File | Status |
|---|---|---|---|
| `edunext_landing_page_redesign` | `/` | Landing.tsx | REDESIGN |
| `Login_page_edunext` | `/student-login` | StudentLogin.tsx | REDESIGN |
| `teacher_login` | `/teacher-login` | TeacherLogin.tsx | REDESIGN |
| `student_dashboard` | `/dashboard` | Dashboard.tsx | REDESIGN |
| `student-courses` | `/courses` | Courses.tsx | REDESIGN |
| `student_mycourses` | `/my-courses` | MyCourses.tsx | REDESIGN |
| `student_webcam_page_incontinuelearning_of_mycourses` | `/course-video/:id` | CourseVideo.tsx | REDESIGN |
| `student_quiz` | `/quizzes` | Quizzes.tsx | REDESIGN |
| `student_quiz_questionpage` | `/quiz/:id` | QuizTake.tsx | REDESIGN |
| `student_progress&streaks` | `/progress` | Progress.tsx | REDESIGN |
| `student_assignments` | `/assignments` | Assignments.tsx | REDESIGN |
| `student_peerchallenges` | `/challenges` | Challenges.tsx | REDESIGN |
| `student_leaderboads` | `/leaderboard` | Leaderboard.tsx | REDESIGN |
| `student_streakpot` | `/streak-pot` | StreakPot.tsx | REDESIGN |
| `student_announcements` | `/announcements` | Announcements.tsx | REDESIGN |
| `student_downloads` | `/downloads` | Downloads.tsx | REDESIGN |
| `student_explorecommunity` | `/community` | Community.tsx | REDESIGN |
| `student_apprenticeship` | `/apprenticeships` | Apprenticeships.tsx | REDESIGN |
| `student_profile` | `/profile` | StudentProfile.tsx | 🆕 NEW |
| `student_settings` | `/settings` | StudentSettings.tsx | 🆕 NEW |
| `teacher_dashboard` | `/teacher-dashboard` | TeacherDashboard.tsx | REDESIGN |
| `teacher_courses` | `/teacher-dashboard` (courses tab) | TeacherDashboard.tsx | REDESIGN |
| `teacher_courses_createnewcourse` | modal step 0 | Inside TeacherDashboard | REDESIGN |
| `teacher_courses_createnewcourse1` | modal step 1 | Inside TeacherDashboard | REDESIGN |
| `teacher_courses_createnewcourse2` | modal step 2 | Inside TeacherDashboard | REDESIGN |
| `teacher_courses_createnewcourse3` | modal step 3 | Inside TeacherDashboard | REDESIGN |
| `teacher_courses_createnewcourse4` | modal step 4 | Inside TeacherDashboard | REDESIGN |
| `teacher_courses_createnewcourse5` | modal step 5 | Inside TeacherDashboard | REDESIGN |
| `teacher_studentslist` | `/teacher-students` | TeacherStudentsList.tsx | 🆕 NEW |
| `teacher_students_profile` | `/teacher-students/:id` | TeacherStudentProfile.tsx | 🆕 NEW |
| `teacher_students_attentionreport` | `/teacher-students/:id/attention` | TeacherStudentAttention.tsx | 🆕 NEW |
| `teacher_students_assignmenthistory` | `/teacher-students/:id/assignments` | TeacherStudentAssignments.tsx | 🆕 NEW |
| `teacher_students_quizperformance` | `/teacher-students/:id/quiz` | TeacherStudentQuiz.tsx | 🆕 NEW |
| `teacher_attentionanalytics_webcam_recordings` | `/teacher-dashboard/students-recordings` | TeacherDashboardStudents.tsx | REDESIGN |
| `teacher_quizzes` | `/teacher-quizzes` | TeacherQuizzes.tsx | 🆕 NEW |
| `teacher_assignments` | `/teacher-dashboard` (assignments tab) | TeacherDashboard.tsx | REDESIGN |
| `teacher_reports` | `/teacher-reports` | TeacherReports.tsx | 🆕 NEW |
| `teacher_community` | `/teacher-community` | TeacherCommunity.tsx | REDESIGN |
| `teacher_announcements` | `/teacher-dashboard` (announcements tab) | TeacherDashboard.tsx | REDESIGN |
| `teacher_apprenticeships` | `/teacher-apprenticeships` | TeacherApprenticeships.tsx | REDESIGN |
| `teacher_profile` | `/teacher-profile` | TeacherProfile.tsx | 🆕 NEW |
| `teacher_settings` | `/teacher-settings` | TeacherSettings.tsx | 🆕 NEW |

---

## 🎯 Instructions for Claude Code

### Rule 1 — Logic stays, visuals change
- For **REDESIGN** pages: keep ALL state, useEffect, database calls, handlers — only replace the JSX
- For **NEW** pages: build fresh UI + connect to existing Dexie db / mockData where relevant

### Rule 2 — App.tsx needs updating
Add these new routes to App.tsx:
```tsx
<Route path="/profile" element={<StudentProfile />} />
<Route path="/settings" element={<StudentSettings />} />
<Route path="/teacher-students" element={<TeacherStudentsList />} />
<Route path="/teacher-students/:id" element={<TeacherStudentProfile />} />
<Route path="/teacher-students/:id/attention" element={<TeacherStudentAttention />} />
<Route path="/teacher-students/:id/assignments" element={<TeacherStudentAssignments />} />
<Route path="/teacher-students/:id/quiz" element={<TeacherStudentQuiz />} />
<Route path="/teacher-quizzes" element={<TeacherQuizzes />} />
<Route path="/teacher-reports" element={<TeacherReports />} />
<Route path="/teacher-profile" element={<TeacherProfile />} />
<Route path="/teacher-settings" element={<TeacherSettings />} />
```

### Rule 3 — Never touch these files
```
src/lib/database.ts
src/lib/mockData.ts
src/utils/translations.ts
src/contexts/LanguageContext.tsx
backend/server.cjs
backend/app.py
backend/video_analyzer.py
machine_learning/
```

### Rule 4 — CourseVideo.tsx is sacred
The webcam recording + Flask AI flow must stay 100% intact. Only the visual layout around it changes (use the 4-card layout from the design).

### Rule 5 — Apply one page at a time
Each design zip contains:
- `screen.png` — the visual reference
- `DESIGN.md` — color tokens, typography, component rules

Work through them one by one. When done with a page, the route should look exactly like `screen.png`.

### Rule 6 — Sidebar navigation
**Student sidebar** links (in order): Dashboard, Courses, My Courses, Progress & Streaks, Quizzes, Assignments, Peer Challenges, Streak Pot, My Apprenticeships, Leaderboard, Announcements, Downloads, Career Find, Explore Community, Logout + profile avatar at top

**Teacher sidebar** links (in order): Dashboard, Courses, Students, Learning Analytics, Attention Analytics (expandable → Webcam Recordings), Quizzes, Assignments, Community, Announcements, Apprenticeships, Reports + Settings, Logout at bottom + "Create New Course" green CTA button
