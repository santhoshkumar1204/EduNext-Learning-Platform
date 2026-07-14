# 🚀 eduNext — Complete Claude Code Prompt List
> Paste each prompt into Claude Code one at a time, in order.
> Always have `eduNext_Project_Flow.md` open in context before starting.
> Each prompt tells Claude Code exactly what file to edit, what design to reference, and what logic to keep.

---

## ⚙️ STEP 0 — Setup (do this ONCE before anything else)

```
I'm going to give you a series of tasks to redesign the eduNext Learning Platform.
Before we start, read and understand this project flow document completely:
[paste contents of eduNext_Project_Flow.md OR attach the file]

Key rules to follow for every task:
1. Keep ALL existing logic, state, useEffect hooks, database calls, and handlers — only replace the JSX/visual layer
2. Never touch: src/lib/database.ts, src/lib/mockData.ts, src/utils/translations.ts, src/contexts/LanguageContext.tsx, or anything in backend/
3. The design system uses Inter + Plus Jakarta Sans fonts, primary green #12A150, navy #002045, and glassmorphism cards
4. Confirm you've understood the full project before we begin.
```

---

## 🌐 PUBLIC PAGES

---

### PROMPT 1 — Landing Page
```
Using eduNext_Project_Flow.md as context, redesign src/pages/Landing.tsx.

Design reference: edunext_landing_page_redesign/screen.png
Design spec: edunext_landing_page_redesign/DESIGN.md

What this page does currently:
- Shows HeroSection, PillarsSection, FAQSection components
- Has a MultiLoginModal that opens on login click
- Language selector (English/Hindi/Punjabi) stored in localStorage
- PWAInstaller component at the bottom
- Navigate to /student-login on "Start Learning", /teacher-login on "Teacher Login"

What to build from the design:
- Top navbar with logo, language selector, nav links (Courses, Assignments, Community, Analytics), login button
- Hero section: "Transform Your Educational Journey" headline + subtext + "Start Learning" CTA button + "Teacher Login" link + hero image on right
- Stats bar: 500+ Active Students | 50+ Interactive Lessons | 100+ Skill Quizzes | 3 Supported Languages
- "A Complete Learning Ecosystem" pillars section with 5 feature cards (Curated Course Catalog, Progress Tracking, Community Doubts, Offline Support, Multi-Language)
- "Teacher Analytics & Engagement" section with chart preview
- FAQ accordion section
- Footer with links

Keep all existing component logic (HeroSection, PillarsSection, FAQSection, MultiLoginModal, PWAInstaller, LanguageProvider). Only restyle them to match the design.
```

---

### PROMPT 2 — Student Login Page
```
Using eduNext_Project_Flow.md as context, redesign src/pages/StudentLogin.tsx.

Design reference: Login_page_edunext/screen.png
Design spec: Login_page_edunext/DESIGN.md

What this page does currently:
- Fields: School Code + Student ID + PIN
- Mock auth against mockUsers (schoolCode=EDU001, studentId=STU001, pin=1234)
- Offline support via Dexie db.users
- On success: navigate('/dashboard')
- On back: navigate('/')

What to build from the design:
- Full split-screen layout: left half = lifestyle photo (student at desk), right half = form
- Top-right: [Student] [Teacher] toggle — Student tab active, Teacher tab links to /teacher-login
- "Welcome back" heading + "Please enter your details to sign in" subtext
- Sign In / Create Account tabs (Sign In active)
- "Continue with Google" button (UI only, no real Google auth)
- OR divider
- Email Address field + Password field (keep the existing schoolCode/studentId/pin fields but style them to match — map School Code → email style input, Student ID → second field, PIN → password style)
- Remember me checkbox + Forgot Password link
- Green "Sign In" button (full width)
- Bottom feature list: Offline Learning ✓ | Multi-Language Learning ✓ | Community Support ✓ | Adaptive Learning ✓
- Left panel bottom: "Learning Designed Around You" card overlay with dot indicators

Keep all existing login logic, error handling, and navigation. Do not break the mock auth.
```

---

### PROMPT 3 — Teacher Login Page
```
Using eduNext_Project_Flow.md as context, redesign src/pages/TeacherLogin.tsx.

Design reference: teacher_login/screen.png
Design spec: teacher_login/DESIGN.md

What this page does currently:
- Fields: Email + Password
- Mock auth: password must be "teacher123"
- On success: navigate('/teacher-dashboard')
- On back: navigate('/')

What to build from the design:
- Same split-screen layout as student login but with a teacher/library photo on the left
- Top-right: [Student] [Teacher] toggle — Teacher tab active, Student tab links to /student-login
- "Welcome Back, Educator" heading
- Subtext: "Sign in to manage courses, track learner engagement, and monitor classroom analytics."
- Sign In / Create Account tabs
- "Continue with Google" button (UI only)
- OR divider
- Email Address field (placeholder: teacher@institution.edu) + Password field
- Remember me + Forgot Password
- Green "Sign In" button
- Bottom info box: "As a Teacher You Can:" with 3 green checkmarks: Create Courses & Upload Materials | Manage Assignments & Quizzes | Monitor Student Analytics & Reports

Keep all existing login logic and mock auth.
```

---

## 🎓 STUDENT PAGES

---

### PROMPT 4 — Student Dashboard
```
Using eduNext_Project_Flow.md as context, redesign src/pages/Dashboard.tsx.

Design reference: student_dashboard/screen.png
Design spec: student_dashboard/DESIGN.md

What this page does currently:
- Loads recent courses from IndexedDB (db.enrollments + db.courses)
- Has a sidebar with navigation links
- Shows student name, streak, points, enrolled courses
- Uses SidebarProvider from shadcn/ui

What to build from the design:
- Left sidebar (always visible, white bg):
  - Top: user avatar + name + school switcher dropdown
  - MENU section: Dashboard (active, green highlight), Courses, My Courses, Progress & Streaks
  - ACTIVITIES section: Quizzes, Assignments, Peer Challenges, Streak Pot, My Apprenticeships, Leaderboard
  - RESOURCES section: Announcements, Downloads, Career Find, Explore Community
  - Bottom: Logout
- Top bar: search input + notification bell + user name + level badge + avatar
- Hero banner card (green-to-blue gradient):
  - "Learning Streak: X Days" + "Weekly Goal Progress: X/5 hrs" chips
  - "CURRENT LEARNING JOURNEY" label
  - "Welcome back, [name]" large heading
  - Current active course name + "Ready to dive back in?"
  - Course progress bar + module label + "Continue Learning" button
  - Abstract device illustration on right
- 4 stat cards: Current Streak (flame icon) | Total Points (trophy icon) | Courses Enrolled (graduation icon) | Assignments Pending (clipboard icon)
- "Continue Learning" section with "View All Courses" link:
  - 2 course cards with image, category badge, title, instructor
  - 1 "Explore Catalog" card

Keep all existing data loading from IndexedDB (loadRecentCourses), keep sidebar navigation links and routes.
```

---

### PROMPT 5 — Courses Page
```
Using eduNext_Project_Flow.md as context, redesign src/pages/Courses.tsx.

Design reference: student-courses/screen.png
Design spec: student-courses/DESIGN.md

Keep same student sidebar layout as Dashboard.
Keep all existing course data loading logic.

What to build from the design:
- Same left sidebar as Dashboard
- Search bar + filter dropdowns (Category, Level, Language)
- Course grid with cards: thumbnail image, category chip, title, instructor, duration, level badge, progress bar (if enrolled), enroll/continue button
- Featured/recommended section at top if present in design
```

---

### PROMPT 6 — My Courses Page
```
Using eduNext_Project_Flow.md as context, redesign src/pages/MyCourses.tsx.

Design reference: student_mycourses/screen.png
Design spec: student_mycourses/DESIGN.md

Keep same student sidebar. Keep all IndexedDB enrollment loading logic.

What to build from the design:
- Enrolled courses list/grid with progress bars
- Each course card: thumbnail, title, instructor, progress %, last accessed, "Continue" button → navigates to /lesson/:id
- Filter tabs: All / In Progress / Completed
```

---

### PROMPT 7 — Course Video Page (THE MOST IMPORTANT ONE)
```
Using eduNext_Project_Flow.md as context, redesign src/pages/CourseVideo.tsx.

Design reference: student_webcam_page_incontinuelearning_of_mycourses/screen.png
Design spec: student_webcam_page_incontinuelearning_of_mycourses/DESIGN.md

⚠️ CRITICAL: This page contains the core AI webcam + attention tracking feature.
You MUST keep 100% of the existing logic:
- Webcam stream setup (webcamRef, webcamStreamRef)
- MediaRecorder recording (startRecording, stopRecording, recordedChunksRef)
- setInterval sending Base64 frames to http://localhost:5001/analyze
- Response handling for { emotion, attention_score, eye_status, head_pos }
- Upload to http://localhost:5000/upload on video end
- Auto-redirect to /quiz/:id after recording stops
- The askPermission state and webcam permission flow
- All useRef, useEffect, useParams hooks

Only change the visual layout to match the design:

Layout:
- Top navbar: EduNext logo + search + notifications + settings + avatar
- Left sidebar: course title + thumbnail + "Course Progress X%" bar + module list with icons (✓ completed, ▶ current, 🔒 locked) → clicking a lesson navigates
- Main area top: full-width video player
- Below video: lesson title + instructor + duration + "Lesson X of Y" + "Ask Doubt" button + "Materials" dropdown button + kebab menu
- Below that, 4 info cards in a row:
  1. LIVE WEBCAM FEED — small webcam preview with REC badge + "Webcam Connected" status
  2. LEARNING INSIGHTS — Attention Score % (large) + "Highly Focused" label + Dominant Emotion chip + Attention Trend chip + Blink Rate / Gaze Stability / Focus Duration rows
  3. SESSION INFORMATION — Session Duration / Video Progress % / Current Lesson / Lessons Completed
  4. PRIVACY NOTICE — shield icon + privacy text about webcam usage
```

---

### PROMPT 8 — Quizzes List Page
```
Using eduNext_Project_Flow.md as context, redesign src/pages/Quizzes.tsx.

Design reference: student_quiz/screen.png
Design spec: student_quiz/DESIGN.md

Keep same student sidebar. Keep all existing quiz loading logic.

What to build from the design:
- Quiz cards with: course name, quiz title, number of questions, time limit, score (if completed), status badge (Completed/Pending/Locked), "Take Quiz" / "Review" button → navigates to /quiz/:id
- Filter tabs or dropdowns for course/status
```

---

### PROMPT 9 — Quiz Question Page
```
Using eduNext_Project_Flow.md as context, redesign src/pages/QuizTake.tsx.

Design reference: student_quiz_questionpage/screen.png
Design spec: student_quiz_questionpage/DESIGN.md

Keep all existing quiz logic (QuizInterface component, question state, answer submission, score calculation, navigate back to dashboard on finish).

What to build from the design:
- Quiz header: quiz title + progress (Q X of Y) + timer countdown
- Question card: question text + 4 answer options as selectable cards
- Navigation: Previous / Next buttons + Submit button on last question
- Progress bar showing completion
- Results screen after submission: score, correct/incorrect breakdown, "Back to Dashboard" button
```

---

### PROMPT 10 — Progress & Streaks Page
```
Using eduNext_Project_Flow.md as context, redesign src/pages/Progress.tsx.

Design reference: student_progress&streaks/screen.png
Design spec: student_progress&streaks/DESIGN.md

Keep same student sidebar. Keep all existing progress data loading.

What to build from the design:
- "Your Motivation Center" heading + "Current Streak: X Days" badge (top right)
- 3 stat cards: Longest Streak | Weekly Goal Progress (with bar) | Total Learning Hours
- Weekly Streak Tracker: 7 day circles (Mon–Sun) with green checkmarks for completed days
- Weekly Streak Pot card: piggy bank icon + "claim your reward in X days" + Current Contribution $X + Reward Progress bar (Day 1 → Today → Target)
- "Continue Your Journey" section: enrolled course cards with progress % + Resume button
- Achievements grid: badge icons (7 Day Streak, Quiz Master, Assign. Champ, 30 Day Streak, Fast Learner, Community Contrib.) — locked ones are greyed
- Subject Mastery: circular progress charts per subject (Mathematics, Programming, Cyber Security, Data Analytics)
- Recent Milestones: timeline list (Completed Course / Passed Quiz / Submitted Assignment)
- Bottom motivational banner: dark card with quote + "Start Today's Session" button
```

---

### PROMPT 11 — Assignments Page
```
Using eduNext_Project_Flow.md as context, redesign src/pages/Assignments.tsx.

Design reference: student_assignments/screen.png
Design spec: student_assignments/DESIGN.md

Keep same student sidebar. Keep all existing assignment loading from IndexedDB and submission logic.

What to build from the design:
- Assignment cards with: title, subject, due date, status badge (Pending/Submitted/Graded/Overdue), instructions, file attachment option, Submit button
- Filter tabs: All / Pending / Submitted / Graded
- Graded assignments show score/grade
```

---

### PROMPT 12 — Peer Challenges Page
```
Using eduNext_Project_Flow.md as context, redesign src/pages/Challenges.tsx.

Design reference: student_peerchallenges/screen.png
Design spec: student_peerchallenges/DESIGN.md

Keep same student sidebar. Keep all existing challenges logic.

What to build from the design:
- Challenge cards with: title, subject, difficulty badge, participants count, deadline, points reward, "Join Challenge" / "View" button
- Leaderboard preview for active challenges
- Filter by subject/difficulty
```

---

### PROMPT 13 — Streak Pot Page
```
Using eduNext_Project_Flow.md as context, redesign src/pages/StreakPot.tsx.

Design reference: student_streakpot/screen.png
Design spec: student_streakpot/DESIGN.md

Keep same student sidebar. Keep all existing streak/pot logic.

What to build from the design:
- Large piggy bank / pot illustration
- Current pot value + contributors
- Your streak status + contribution
- Leaderboard of top streak holders
- Rules/how it works section
```

---

### PROMPT 14 — Leaderboard Page
```
Using eduNext_Project_Flow.md as context, redesign src/pages/Leaderboard.tsx.

Design reference: student_leaderboads/screen.png
Design spec: student_leaderboads/DESIGN.md

Keep same student sidebar. Keep all existing leaderboard data loading.

What to build from the design:
- Top 3 podium with avatars, names, points
- Full ranked table: rank | avatar | name | school | points | badges | streak
- Filter: All Time / This Week / This Month
- Highlight the current user's row
```

---

### PROMPT 15 — Announcements Page
```
Using eduNext_Project_Flow.md as context, redesign src/pages/Announcements.tsx.

Design reference: student_announcements/screen.png
Design spec: student_announcements/DESIGN.md

Keep same student sidebar. Keep all existing announcements data loading.

What to build from the design:
- Announcement cards with: title, from (teacher/admin), date, content preview, read/unread badge, "Read More" expand
- Filter: All / Unread / By Course
- Mark all as read button
```

---

### PROMPT 16 — Downloads Page
```
Using eduNext_Project_Flow.md as context, redesign src/pages/Downloads.tsx.

Design reference: student_downloads/screen.png
Design spec: student_downloads/DESIGN.md

Keep same student sidebar. Keep all existing Dexie downloads logic (IndexedDB blob storage).

What to build from the design:
- Downloaded files list: icon (pdf/video/audio), title, course, size, downloaded date, "Open" / "Delete" buttons
- Storage usage bar showing used vs available space
- Filter by type (Videos / PDFs / Audio)
- Empty state if no downloads
```

---

### PROMPT 17 — Explore Community Page
```
Using eduNext_Project_Flow.md as context, redesign src/pages/Community.tsx.

Design reference: student_explorecommunity/screen.png
Design spec: student_explorecommunity/DESIGN.md

Keep same student sidebar. Keep all existing community/doubts logic.

What to build from the design:
- Discussion feed: question cards with title, author, course tag, time ago, upvotes, answers count, "Answer" button
- Post new question button/form
- Filter by course, most recent, most upvoted
- Your questions section
```

---

### PROMPT 18 — Apprenticeships Page
```
Using eduNext_Project_Flow.md as context, redesign src/pages/Apprenticeships.tsx.

Design reference: student_apprenticeship/screen.png
Design spec: student_apprenticeship/DESIGN.md

Keep same student sidebar. Keep all existing logic.

What to build from the design:
- Opportunity cards: company name, role title, duration, stipend, skills required, application deadline, "Apply" button
- Filter by field/duration/location
- My Applications section showing status (Applied/Interview/Accepted/Rejected)
```

---

### PROMPT 19 — Career Find Page
```
Using eduNext_Project_Flow.md as context, redesign src/pages/CareerFind.tsx.

Keep same student sidebar. Keep all existing logic.
Use the same design system (green/navy, Inter font, glassmorphism cards) from the DESIGN.md tokens.

What to build:
- Job/career listings relevant to student's courses
- Filter by field, type (internship/full-time), location
- Each card: role, company, location, type badge, skills match %, "View Details" button
```

---

### PROMPT 20 — Student Profile Page (NEW)
```
Using eduNext_Project_Flow.md as context, CREATE a new file: src/pages/StudentProfile.tsx
Also add the route in App.tsx: <Route path="/profile" element={<StudentProfile />} />

Design reference: student_profile/screen.png
Design spec: student_profile/DESIGN.md

This is a NEW page — no existing file to keep logic from.

What to build from the design:
- Top navbar (no sidebar on this page — top nav only): EduNext logo + search + nav links (Dashboard, My Learning, Profile active) + notifications + avatar
- Profile header banner (green gradient): avatar with online indicator + name + email + badges (Level 4 Scholar, 150 Points, 5 Day Streak) + Edit Profile / Certificates / Report buttons
- Profile Completion bar: 85% + checklist (Photo Added ✓, Email Verified ✓, Language Selected ✓, Learning Goal Set ○) + "Complete Now" link
- Two-column layout:
  LEFT (main):
  - Learning Overview: 6 stat cards (Courses Enrolled 12, Courses Completed 8, Quiz Accuracy 92%, Learning Hours 45h, Assignments 24, Contributions 15)
  - Learning Journey: active course card with thumbnail + title + instructor + progress bar + "Continue Learning" button + Monthly Learning Hours + Weekly Goal Progress
  - Achievement Showcase: badge grid (Course Champion, Quiz Master, Contributor, Consistent + locked badges) + "View All" link
  RIGHT (sidebar):
  - Preferences & Goals card: Preferred Language, Accessibility Features, Offline Learning, Learning Goal
  - Community Impact card: Questions Asked, Answers Given, Helpful Votes, Community Likes, Community Rank
- Recent Learning Activity: timeline with Today/Yesterday/Last Week sections

Connect to getCurrentUser() from database.ts for real user data.
```

---

### PROMPT 21 — Student Settings Page (NEW)
```
Using eduNext_Project_Flow.md as context, CREATE a new file: src/pages/StudentSettings.tsx
Also add the route in App.tsx: <Route path="/settings" element={<StudentSettings />} />

Design reference: student_settings/screen.png
Design spec: student_settings/DESIGN.md

This is a NEW page — no existing file to keep logic from.

What to build from the design (sections with cards):
- Breadcrumb: Dashboard > Profile > Settings
- "Student Settings" heading + subtitle
- Profile Information section: avatar + "Change Photo" + Full Name / Email Address / Phone Number / Institution / Department / Academic Year fields + Save button
- Learning Preferences section: Primary Language dropdown + Learning Goal dropdown + Learning Style + Interests (comma-separated)  + Reset Preferences / Save Changes buttons
- Notifications section: toggles for Assignment Deadlines / Quiz Reminders / Community Activity / Course Announcements / Learning Streak
- Accessibility section: Font Size dropdown + toggles for High Contrast / Reduce Motion / Always Show Captions / Screen Reader Optimization / Dyslexia Friendly Mode
- Offline Learning section: Auto-Download Course Material toggle + Download Over Wi-Fi Only toggle + Storage Usage bar + "Manage Downloads" button
- Appearance section: 3 theme cards (Light Mode selected / Dark Mode / System Default) with radio buttons
- Privacy & Security section: Password (last changed X months ago + "Change Password" btn) + Two-Factor Auth toggle + Active Sessions "View Sessions" btn + Save Search History toggle + Device Management "Manage Devices" btn
- Learning Analytics section: Anonymous Analytics / Research Participation / Experience Improvements toggles
- Support & Feedback section: Help Center / Contact Support / Report an Issue / Suggest a Feature links + "Contact Us" button

Use getCurrentUser() and localStorage for persistence where relevant.
```

---

## 👩‍🏫 TEACHER PAGES

---

### PROMPT 22 — Teacher Dashboard
```
Using eduNext_Project_Flow.md as context, redesign src/pages/TeacherDashboard.tsx.

Design reference: teacher_dashboard/screen.png
Design spec: teacher_dashboard/DESIGN.md

What this page does currently:
- Tabs: courses, assignments, analytics, doubts
- Loads courses/assignments/doubts from IndexedDB
- Add/edit/delete course functionality with modal (multi-step: title, desc, language, level, duration, upload videos/materials)
- Grade submissions
- Reply to doubts with text/file/voice
- Uses getCurrentUser() + role guard (redirects if not teacher)

What to build from the design:

LEFT SIDEBAR (full height, always visible):
- "EduNext" logo + "Teacher Dashboard" subtitle
- Teacher name + avatar at bottom
- "+ Create New Course" green CTA button (triggers existing course creation flow)
- Nav items: Dashboard (active) | Courses | Students → /teacher-students | Learning Analytics | Attention Analytics (expandable) → Webcam Recordings → /teacher-dashboard/students-recordings | Quizzes → /teacher-quizzes | Assignments | Community → /teacher-community | Announcements | Apprenticeships | Reports → /teacher-reports
- Bottom: Settings → /teacher-settings | Logout

MAIN CONTENT (Dashboard tab):
- "Welcome back, Dr. [name]" heading + subtitle
- 4 stat cards: Total Courses (+2 this week) | Total Students (+15 this week) | Total Assignments | Total Quizzes (3 need review)
- Quick Actions row: Create New Course (green, filled) | Create Quiz | Create Assignment | Publish Announcement
- Active Courses section (cards): course image + Active/Draft badge + title + code + semester + Students/Lessons/Completion stats + "Manage" + "Analytics" buttons
- Recent Activity feed: each item has icon + description + time ago + optional action button (Review Now, Reply)

Keep ALL existing tab logic (courses, assignments, analytics, doubts) — only the default landing view changes to this design. The existing tabs can remain as sub-views.
```

---

### PROMPT 23 — Create New Course Flow (6 Steps)
```
Using eduNext_Project_Flow.md as context, redesign the Create New Course modal/flow inside TeacherDashboard.tsx (or extract to a separate CreateCourse component if needed).

Design references (6 step screens):
- Step 1: teacher_courses_createnewcourse/screen.png   → Basic Info
- Step 2: teacher_courses_createnewcourse1/screen.png  → Structure
- Step 3: teacher_courses_createnewcourse2/screen.png  → Content
- Step 4: teacher_courses_createnewcourse3/screen.png  → Permissions
- Step 5: teacher_courses_createnewcourse4/screen.png  → Quizzes
- Step 6: teacher_courses_createnewcourse5/screen.png  → Publish

What to build from the designs:
- Full page layout (not modal) with teacher sidebar on left
- 6-step progress indicator at top: 1 Basic Info → 2 Structure → 3 Content → 4 Permissions → 5 Quizzes → 6 Publish
- Active step is filled green circle, others are outlined grey

Step 1 (Basic Info): Course Title input + Course Description textarea + Category dropdown + Difficulty Level dropdown + Primary Language dropdown + Course Thumbnail upload (drag & drop zone)
Step 2 (Structure): Module/section builder — add modules, add lessons within modules
Step 3 (Content): Upload video files per lesson + upload materials/PDFs
Step 4 (Permissions): Who can enroll (All / School Code / Invite only) + enrollment settings
Step 5 (Quizzes): Add quiz questions per module
Step 6 (Publish): Review summary + Publish button

Keep ALL existing addTeacherCourse() logic from database.ts. The form data must still save to IndexedDB correctly.
```

---

### PROMPT 24 — Teacher Courses Tab
```
Using eduNext_Project_Flow.md as context, redesign the Courses view inside TeacherDashboard.tsx (or as a separate tab/page).

Design reference: teacher_courses/screen.png
Design spec: teacher_courses/DESIGN.md

Keep same teacher sidebar. Keep all existing getTeacherCourses(), deleteTeacherCourse(), updateTeacherCourse() logic.

What to build from the design:
- "Courses" heading + subtitle + "+ Create New Course" button
- Filter tabs: All / Active / Draft / Archived
- Course cards grid: thumbnail + Active/Draft badge + title + course code + semester + Students count / Lessons count / Completion % + "Manage" button + "Analytics" button
- Empty state if no courses
```

---

### PROMPT 25 — Teacher Students List (NEW)
```
Using eduNext_Project_Flow.md as context, CREATE a new file: src/pages/TeacherStudentsList.tsx
Also add the route in App.tsx: <Route path="/teacher-students" element={<TeacherStudentsList />} />

Design reference: teacher_studentslist/screen.png
Design spec: teacher_studentslist/DESIGN.md

This is a NEW page.

What to build from the design:
- Keep same teacher sidebar (with Students nav item active/highlighted)
- "Students" heading + "Manage and monitor students enrolled in your courses" subtitle
- 3 filter dropdowns: Course (All Courses) + Attention Status (All Statuses) + Performance (All Levels) + "More Filters" button
- 4 stat cards: Total Students 1,248 | Active Learners 982 | Requiring Attention 47 (red warning icon) | Avg. Completion 68%
- Students table with columns: STUDENT (avatar + name + email) | COURSES | COMPLETION % | ATTENTION % (red if low) | QUIZ AVG | LAST ACTIVE | STATUS badge (LOW/MEDIUM/HIGH) | ACTION ("View Profile" green button → navigates to /teacher-students/:id)
- Pagination: page numbers at bottom

Connect to db.users (mockUsers filtered to role='student') for real data. Use mock attention/completion numbers for display.
```

---

### PROMPT 26 — Teacher Student Profile (NEW)
```
Using eduNext_Project_Flow.md as context, CREATE a new file: src/pages/TeacherStudentProfile.tsx
Also add the route in App.tsx: <Route path="/teacher-students/:id" element={<TeacherStudentProfile />} />

Design reference: teacher_students_profile/screen.png
Design spec: teacher_students_profile/DESIGN.md

This is a NEW page. Use useParams() to get the student id.

What to build from the design:
- Keep same teacher sidebar (Students nav item active)
- Breadcrumb: Students > [Student Name]
- Profile card (full width): student photo + name + email + Department + Year + Enrolled date + Active badge + "Message Student" button
- Right side of profile card: ATTENTION STATUS badge (High/Focused green) + Avg Completion % + Quiz Avg % + Assignment Rate progress bar
- Tab navigation: Overview | Attention Reports | Webcam Recordings | Quiz Performance | Assignment History
  - Each tab navigates to the appropriate sub-route or shows inline content
  - Overview tab (default):
    - LEFT: "Current Enrollments" card — list of courses with progress bars, last accessed, next action
    - RIGHT column: Learning Streak card (green, X days + motivational text) + Program Progress card (Completed X / In Progress X) + Last Active card

Load student data from mockUsers by id. Load enrollments from db.enrollments where userId matches.
```

---

### PROMPT 27 — Teacher Student Attention Report (NEW)
```
Using eduNext_Project_Flow.md as context, CREATE a new file: src/pages/TeacherStudentAttention.tsx
Also add the route in App.tsx: <Route path="/teacher-students/:id/attention" element={<TeacherStudentAttention />} />

Design reference: teacher_students_attentionreport/screen.png
Design spec: teacher_students_attentionreport/DESIGN.md

This is a NEW page — "Attention Reports" tab of the student detail view.

What to build from the design:
- Same teacher sidebar + same student profile header (name, photo, stats)
- "Attention Reports" tab active in the tab bar
- Attention score over time line chart (Recharts LineChart)
- Per-session breakdown table: date, course, avg attention score, emotion distribution, duration
- Session detail cards showing: attention timeline, dominant emotions, focus periods
- Use mock data for display since real data comes from attention_log.csv via the backend
```

---

### PROMPT 28 — Teacher Student Assignment History (NEW)
```
Using eduNext_Project_Flow.md as context, CREATE a new file: src/pages/TeacherStudentAssignments.tsx
Also add the route in App.tsx: <Route path="/teacher-students/:id/assignments" element={<TeacherStudentAssignments />} />

Design reference: teacher_students_assignmenthistory/screen.png
Design spec: teacher_students_assignmenthistory/DESIGN.md

"Assignment History" tab of the student detail view.

What to build from the design:
- Same teacher sidebar + student profile header + "Assignment History" tab active
- Table: Assignment Title | Course | Due Date | Submitted Date | Grade | Status badge
- Grade input for ungraded submissions (use existing gradeSubmission() function from database.ts)
```

---

### PROMPT 29 — Teacher Student Quiz Performance (NEW)
```
Using eduNext_Project_Flow.md as context, CREATE a new file: src/pages/TeacherStudentQuiz.tsx
Also add the route in App.tsx: <Route path="/teacher-students/:id/quiz" element={<TeacherStudentQuiz />} />

Design reference: teacher_students_quizperformance/screen.png
Design spec: teacher_students_quizperformance/DESIGN.md

"Quiz Performance" tab of the student detail view.

What to build from the design:
- Same teacher sidebar + student profile header + "Quiz Performance" tab active
- Quiz score history: bar chart per quiz (Recharts BarChart)
- Table: Quiz Name | Course | Score % | Date Taken | Time Taken | Status (Pass/Fail)
- Overall stats: avg score, pass rate, best subject
```

---

### PROMPT 30 — Teacher Webcam Recordings Page
```
Using eduNext_Project_Flow.md as context, redesign src/pages/TeacherDashboardStudents.tsx.

Design reference: teacher_attentionanalytics_webcam_recordings/screen.png
Design spec: teacher_attentionanalytics_webcam_recordings/DESIGN.md

What this page does currently:
- Lists all student recordings from backend/uploads/students/
- Each recording links to /play-video/:student/:filename

What to build from the design:
- Keep same teacher sidebar (Attention Analytics > Webcam Recordings active)
- Student profile card at top: photo + name + Student ID + "Webcam Recordings" label
- Course Filter dropdown + Date Range picker
- Recording cards:
  - Left: webcam thumbnail/still with duration overlay (e.g. "45:00")
  - Right: lesson name + Course tag chip + date + time + TEACHER NOTES section (editable text area for notes)
  - "View" button → navigates to /play-video/:student/:filename

Keep all existing backend API calls to fetch recordings. Only restyle.
```

---

### PROMPT 31 — Teacher Quizzes Page (NEW)
```
Using eduNext_Project_Flow.md as context, CREATE a new file: src/pages/TeacherQuizzes.tsx
Also add the route in App.tsx: <Route path="/teacher-quizzes" element={<TeacherQuizzes />} />

Design reference: teacher_quizzes/screen.png
Design spec: teacher_quizzes/DESIGN.md

This is a NEW page.

What to build from the design:
- Keep same teacher sidebar (Quizzes nav item active)
- "Quizzes" heading + "+ Create Quiz" button
- Filter: by course + status (Active/Draft/Archived)
- Quiz cards: quiz name + course + question count + avg score + attempts + status badge + "Edit" / "View Results" / "Delete" buttons
- Stats overview: Total Quizzes | Avg Score | Total Attempts | Pass Rate

Connect to db.quizzes for real data where available, mock data otherwise.
```

---

### PROMPT 32 — Teacher Assignments Tab
```
Using eduNext_Project_Flow.md as context, update the Assignments view inside TeacherDashboard.tsx.

Design reference: teacher_assignments/screen.png
Design spec: teacher_assignments/DESIGN.md

Keep all existing addAssignmentNew(), getAssignmentsForTeacher(), getSubmissionsForAssignment(), gradeSubmission() logic.

What to build from the design:
- "Assignments" section with "+ Add Assignment" button
- Assignment cards: title + subject + due date + total submissions / graded / pending counts + status + "View Submissions" / "Edit" / "Delete" buttons
- Submissions panel: when "View Submissions" clicked, show list of student submissions with grade input
```

---

### PROMPT 33 — Teacher Reports Page (NEW)
```
Using eduNext_Project_Flow.md as context, CREATE a new file: src/pages/TeacherReports.tsx
Also add the route in App.tsx: <Route path="/teacher-reports" element={<TeacherReports />} />

Design reference: teacher_reports/screen.png
Design spec: teacher_reports/DESIGN.md

This is a NEW page.

What to build from the design:
- Keep same teacher sidebar (Reports nav item active)
- "Reports" heading + Export PDF button + Export Excel button + "Generate Report" green button
- 4 stat cards: Total Reports Generated 1,248 (+12% from last month) | Course Reports 432 | Student Reports 685 | Attention Reports 131 (High engagement detected)
- Tab bar: Attention Reports (active) | Quiz Reports | Assignment Reports | Course Reports

Attention Reports tab:
  LEFT (main):
  - "Engagement Trends" chart card with "Last 30 Days" dropdown → Recharts LineChart
  - "Recent Attention Sessions" table: Session Date | Course | Avg Attention (progress bar) | Status badge (Excellent/Average/Needs Review)
  RIGHT sidebar:
  - "Avg Attention Score" donut chart: 75% (Recharts PieChart) + "Class average across all current sessions" label
  - "Emotion Distribution" card: Focused 65% | Confused 20% | Distracted 15% (progress bars)
  - "Blink Analytics" card: Avg Blink Rate 18/min + Fatigue Indicator Low (green)

Use mock data for charts. Export buttons are UI only (no real export logic needed).
```

---

### PROMPT 34 — Teacher Community Page
```
Using eduNext_Project_Flow.md as context, redesign src/pages/TeacherCommunity.tsx.

Design reference: teacher_community/screen.png
Design spec: teacher_community/DESIGN.md

Keep same teacher sidebar. Keep all existing doubts/replies logic from TeacherDashboard's doubts tab (move that logic here if it fits better, or keep it consistent).

What to build from the design:
- Student questions/doubts feed
- Each question: student avatar + name + course + question text + attachments + time ago + Reply button
- Reply form: text area + file attach + voice record button (keep existing voice recording logic)
- Replied questions show teacher response
- Edit/delete reply options for teacher's own replies
```

---

### PROMPT 35 — Teacher Announcements
```
Using eduNext_Project_Flow.md as context, update the Announcements view in TeacherDashboard.tsx (or create src/pages/TeacherAnnouncements.tsx if cleaner).

Design reference: teacher_announcements/screen.png
Design spec: teacher_announcements/DESIGN.md

Keep same teacher sidebar. Keep all existing announcement creation/management logic.

What to build from the design:
- "Announcements" heading + "+ Publish Announcement" button
- Announcement cards: title + target (All Students / Specific Course) + date + content preview + Edit / Delete buttons
- Create form: title + content + target audience + schedule option
```

---

### PROMPT 36 — Teacher Apprenticeships
```
Using eduNext_Project_Flow.md as context, redesign teacher apprenticeships view.

Design reference: teacher_apprenticeships/screen.png
Design spec: teacher_apprenticeships/DESIGN.md

Keep same teacher sidebar. Keep all existing logic.

What to build from the design:
- Apprenticeship/internship postings that teacher has shared
- Student application tracking
```

---

### PROMPT 37 — Teacher Profile Page (NEW)
```
Using eduNext_Project_Flow.md as context, CREATE a new file: src/pages/TeacherProfile.tsx
Also add the route in App.tsx: <Route path="/teacher-profile" element={<TeacherProfile />} />

Design reference: teacher_profile/screen.png
Design spec: teacher_profile/DESIGN.md

This is a NEW page.

What to build from the design:
- Keep same teacher sidebar
- Teacher profile header: avatar + name + title/role + institution + "Edit Profile" button
- Stats: Total Courses | Total Students | Avg Rating | Years Teaching
- Bio/About section
- Subjects/expertise tags
- Recent courses taught
- Student feedback/ratings overview

Connect to getCurrentUser() from database.ts for real teacher data.
```

---

### PROMPT 38 — Teacher Settings Page (NEW)
```
Using eduNext_Project_Flow.md as context, CREATE a new file: src/pages/TeacherSettings.tsx
Also add the route in App.tsx: <Route path="/teacher-settings" element={<TeacherSettings />} />

Design reference: teacher_settings/screen.png
Design spec: teacher_settings/DESIGN.md

This is a NEW page.

What to build from the design (same structure as student settings but teacher-specific):
- Keep same teacher sidebar (Settings nav item active)
- Profile Information: name, email, institution, department, title
- Teaching Preferences: primary language, course notification settings
- Notifications: toggles for student submissions / quiz completions / doubts / new enrollments / system alerts
- Privacy & Security: password change + 2FA + active sessions
- Account section: export data / delete account

Use getCurrentUser() for data.
```

---

## 🔗 FINAL STEP — Wire Up All New Routes

### PROMPT 39 — Update App.tsx with all new routes
```
Using eduNext_Project_Flow.md as context, update src/App.tsx to add all the new routes created in the previous steps.

Add these imports and routes (only add ones that don't already exist):

Imports to add:
import StudentProfile from "./pages/StudentProfile";
import StudentSettings from "./pages/StudentSettings";
import TeacherStudentsList from "./pages/TeacherStudentsList";
import TeacherStudentProfile from "./pages/TeacherStudentProfile";
import TeacherStudentAttention from "./pages/TeacherStudentAttention";
import TeacherStudentAssignments from "./pages/TeacherStudentAssignments";
import TeacherStudentQuiz from "./pages/TeacherStudentQuiz";
import TeacherQuizzes from "./pages/TeacherQuizzes";
import TeacherReports from "./pages/TeacherReports";
import TeacherProfile from "./pages/TeacherProfile";
import TeacherSettings from "./pages/TeacherSettings";

Routes to add (before the * catch-all route):
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

Keep all existing routes untouched.
```

---

## ✅ CHECKLIST

Use this to track progress:

### Public
- [ ] 1. Landing Page
- [ ] 2. Student Login
- [ ] 3. Teacher Login

### Student
- [ ] 4. Student Dashboard
- [ ] 5. Courses
- [ ] 6. My Courses
- [ ] 7. Course Video (AI Webcam) ⭐
- [ ] 8. Quizzes List
- [ ] 9. Quiz Question Page
- [ ] 10. Progress & Streaks
- [ ] 11. Assignments
- [ ] 12. Peer Challenges
- [ ] 13. Streak Pot
- [ ] 14. Leaderboard
- [ ] 15. Announcements
- [ ] 16. Downloads
- [ ] 17. Explore Community
- [ ] 18. Apprenticeships
- [ ] 19. Career Find
- [ ] 20. Student Profile (NEW)
- [ ] 21. Student Settings (NEW)

### Teacher
- [ ] 22. Teacher Dashboard
- [ ] 23. Create New Course (6 steps)
- [ ] 24. Teacher Courses Tab
- [ ] 25. Teacher Students List (NEW)
- [ ] 26. Teacher Student Profile (NEW)
- [ ] 27. Teacher Student Attention (NEW)
- [ ] 28. Teacher Student Assignments (NEW)
- [ ] 29. Teacher Student Quiz (NEW)
- [ ] 30. Teacher Webcam Recordings
- [ ] 31. Teacher Quizzes (NEW)
- [ ] 32. Teacher Assignments Tab
- [ ] 33. Teacher Reports (NEW)
- [ ] 34. Teacher Community
- [ ] 35. Teacher Announcements
- [ ] 36. Teacher Apprenticeships
- [ ] 37. Teacher Profile (NEW)
- [ ] 38. Teacher Settings (NEW)

### Final
- [ ] 39. Update App.tsx with all new routes
