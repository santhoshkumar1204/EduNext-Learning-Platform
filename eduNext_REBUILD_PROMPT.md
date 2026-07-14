# eduNext — Full Rebuild Prompt for Claude Code

Paste this entire prompt into Claude Code. This is one single task.

---

## THE GOAL

Rebuild the entire eduNext platform from scratch in this repo.

The **logic, database, and features** must be identical to the original repo at:
`https://github.com/santhoshkumar1204/edunext-backup` (branch: `ml`)

The **design** must match the new designs in the `_generated` pages that already exist in this repo — but rebuilt properly as real React TSX components, not raw HTML strings in DesignShell wrappers.

**In one sentence:** Same functionality as the original backup repo. New design from the `_generated` folder screens. Proper React code throughout.

---

## RULES — READ THESE FIRST

1. **Never use `DesignShell` or `dangerouslySetInnerHTML`** — every page must be proper JSX
2. **Never hardcode fake data** — always pull from `src/lib/database.ts` and `src/lib/mockData.ts`
3. **Never touch these files** — `src/lib/database.ts`, `src/lib/mockData.ts`, `src/utils/translations.ts`, `src/contexts/LanguageContext.tsx`, `backend/`, `machine_learning/`
4. **Use `<Link>` from react-router-dom** for all navigation — no text-matching hacks
5. **Use `getCurrentUser()`** on every protected page — redirect to login if null
6. **The design system** is: primary green `#12A150`, navy `#002045`, Inter + Plus Jakarta Sans fonts, glassmorphism cards (`bg-white/80 backdrop-blur-md`), rounded-xl corners
7. **Do all pages in one go** — don't stop and ask questions, just build

---

## DESIGN SYSTEM (apply to every page)

```css
Colors:
  --primary: #12A150        /* green buttons, active states, progress bars */
  --primary-dark: #006e2f   /* hover state */
  --navy: #002045           /* headings, sidebar */
  --accent: #4F46E5         /* links */
  --bg: #f7f9fb             /* page background */
  --surface: white          /* cards */
  --muted: #64748b          /* secondary text */
  --border: #e2e8f0

Fonts:
  headings: 'Plus Jakarta Sans', sans-serif (font-bold)
  body: 'Inter', sans-serif

Cards: bg-white rounded-2xl shadow-sm border border-gray-100
Glass cards: bg-white/80 backdrop-blur-md border border-white/20 shadow-sm
Buttons (primary): bg-[#12A150] text-white rounded-lg hover:bg-[#006e2f]
Inputs: bg-gray-50 border border-gray-200 rounded-lg focus:border-[#12A150] focus:ring-2 focus:ring-[#12A150]/20
Sidebar: white bg, 256px wide, fixed left, border-r border-gray-100
Active nav item: bg-[#12A150]/10 text-[#12A150] font-semibold rounded-xl
```

---

## SHARED COMPONENTS TO CREATE FIRST

Before building pages, create these reusable components:

### `src/components/StudentSidebar.tsx`
Props: `active: string` (the current page name)

Sidebar with these nav items (each as `<Link>` to the correct route):
- **MENU:** Dashboard `/dashboard`, Courses `/courses`, My Courses `/my-courses`, Progress & Streaks `/progress`
- **ACTIVITIES:** Quizzes `/quizzes`, Assignments `/assignments`, Peer Challenges `/challenges`, Streak Pot `/streak-pot`, My Apprenticeships `/apprenticeships`, Leaderboard `/leaderboard`
- **RESOURCES:** Announcements `/announcements`, Downloads `/downloads`, Career Find `/career-find`, Explore Community `/community`
- Bottom: Logout (calls `clearCurrentUser()` then navigate to `/`)

Top of sidebar: show `getCurrentUser()?.name` + avatar initial in a green circle.
Active item highlights with `bg-[#12A150]/10 text-[#12A150]`.

### `src/components/TeacherSidebar.tsx`
Props: `active: string`

Nav items:
- Dashboard `/teacher-dashboard`, Courses `/teacher-courses`, Students `/teacher-students`, Learning Analytics `/teacher-dashboard`, Attention Analytics (expandable label) → Webcam Recordings `/teacher-dashboard/students-recordings`, Quizzes `/teacher-quizzes`, Assignments `/teacher-assignments`, Community `/teacher-community`, Announcements `/teacher-announcements`, Apprenticeships `/teacher-apprenticeships`, Reports `/teacher-reports`
- Bottom: Settings `/teacher-settings`, Logout

Top: `+ Create New Course` green button → navigate to `/teacher-courses/new`
Bottom: show teacher name + avatar from `getCurrentUser()`.

### `src/components/TopBar.tsx`
Props: `title?: string`
Shows: search input (decorative), notification bell icon, `getCurrentUser()?.name`, avatar circle.

---

## PAGES TO BUILD

Build every page below. Delete the corresponding `_generated` file when you replace it with the real one.

---

### 1. `/` → `src/pages/Landing.tsx`

Look at `_generated/LandingDesign.tsx` for the visual design.

Logic from original:
- Top navbar: EduNext logo, language selector (EN/HI/PU via `useLanguage()`), nav links, online/synced badges
- Hero: "Transform Your Educational Journey" + "Start Learning" → `/student-login`, "Teacher Login" → `/teacher-login`
- Stats bar: 500+ students, 50+ lessons, 100+ quizzes, 3 languages
- Pillars section: 5 feature cards
- Teacher analytics section
- FAQ accordion (use `useState` for open/close)
- PWA install prompt (check `window.beforeinstallprompt`)
- Footer

---

### 2. `/student-login` → `src/pages/StudentLogin.tsx` (already good — keep it, just verify)

Already properly built. Verify it uses `studentLogin()` from database.ts and navigates to `/dashboard` on success.

---

### 3. `/teacher-login` → `src/pages/TeacherLogin.tsx` (already good — keep it, just verify)

Already properly built. Verify it uses `teacherLogin()` and navigates to `/teacher-dashboard`.

---

### 4. `/dashboard` → `src/pages/Dashboard.tsx`

Look at `_generated/DashboardDesign.tsx` for visual design.

Logic:
```typescript
const user = getCurrentUser();
if (!user || user.role !== 'student') { navigate('/student-login'); return null; }

// Load enrolled courses
const [enrolledCourses, setEnrolledCourses] = useState([]);
useEffect(() => {
  getEnrolledCourses(user.id!).then(setEnrolledCourses);
}, []);
```

Layout:
- `<StudentSidebar active="Dashboard" />` on left
- `<TopBar />` on top right
- Hero banner (green-to-blue gradient): "Welcome back, {user.name}" + active course + progress bar + "Continue Learning" → `/my-courses`
- 4 stat cards: streak (`user.streak ?? 5`), points (`user.points ?? 150`), courses enrolled (`enrolledCourses.length`), assignments pending (load from `getAllAssignments()` and filter)
- "Continue Learning" cards: map `enrolledCourses.slice(0,2)` showing title, instructor, progress bar, "Continue" → `/my-courses`
- "Explore Catalog" card → `/courses`

---

### 5. `/courses` → `src/pages/Courses.tsx`

Look at `_generated/CoursesDesign.tsx` for visual design.

Logic:
```typescript
const [courses, setCourses] = useState([]);
const [search, setSearch] = useState('');
const [filter, setFilter] = useState('all');
useEffect(() => { getAllCourses().then(setCourses); }, []);
const filtered = courses.filter(c =>
  c.title.toLowerCase().includes(search.toLowerCase()) &&
  (filter === 'all' || c.level === filter)
);
```

Layout: `<StudentSidebar active="Courses" />` + course grid with search + filter dropdowns + course cards (title, description, level badge, language, "View Course" → `/my-courses`).

---

### 6. `/my-courses` → `src/pages/MyCourses.tsx`

Look at `_generated/MyCoursesDesign.tsx` for visual design.

Logic:
```typescript
const user = getCurrentUser();
const [courses, setCourses] = useState([]);
useEffect(() => { getEnrolledCourses(user!.id!).then(setCourses); }, []);
```

Layout: `<StudentSidebar active="My Courses" />` + enrolled course cards with progress bars + "Continue" button → `/lesson/{course.id}`.

---

### 7. `/lesson/:id` → redirect to `/course-video/:id`

In App.tsx: `<Route path="/lesson/:id" element={<Navigate to="/course-video/:id" replace />} />`
Actually use: `<Route path="/lesson/:id" element={<LessonRedirect />} />` with a component that reads the id param and redirects.

---

### 8. `/course-video/:id` → `src/pages/CourseVideo.tsx` ⭐ MOST IMPORTANT

Look at `_generated/CourseVideoDesign.tsx` for visual layout.

**ALL of this logic must be kept exactly:**

```typescript
// Webcam + AI attention tracking
const webcamRef = useRef<HTMLVideoElement>(null);
const webcamStreamRef = useRef<MediaStream | null>(null);
const mediaRecorderRef = useRef<MediaRecorder | null>(null);
const recordedChunksRef = useRef<Blob[]>([]);
const [attentionScore, setAttentionScore] = useState(0);
const [emotion, setEmotion] = useState('Neutral');
const [webcamAllowed, setWebcamAllowed] = useState(false);
const [sessionDuration, setSessionDuration] = useState(0);

// Ask webcam permission
async function startWebcam() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
  webcamStreamRef.current = stream;
  if (webcamRef.current) webcamRef.current.srcObject = stream;
  setWebcamAllowed(true);
  startRecording(stream);
  startAnalysisInterval();
}

// Send frames to Flask AI server every 3 seconds
function startAnalysisInterval() {
  const interval = setInterval(async () => {
    if (!webcamRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = webcamRef.current.videoWidth;
    canvas.height = webcamRef.current.videoHeight;
    canvas.getContext('2d')?.drawImage(webcamRef.current, 0, 0);
    const base64 = canvas.toDataURL('image/jpeg').split(',')[1];
    try {
      const res = await fetch('http://localhost:5001/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64, studentId: user?.studentId, sessionId })
      });
      const data = await res.json();
      setAttentionScore(data.attention_score ?? 0);
      setEmotion(data.emotion ?? 'Neutral');
    } catch {}
  }, 3000);
  return interval;
}

// MediaRecorder
function startRecording(stream: MediaStream) {
  const recorder = new MediaRecorder(stream);
  mediaRecorderRef.current = recorder;
  recorder.ondataavailable = (e) => { if (e.data.size > 0) recordedChunksRef.current.push(e.data); };
  recorder.start();
}

// On video end — upload recording and redirect to quiz
async function handleVideoEnd() {
  mediaRecorderRef.current?.stop();
  webcamStreamRef.current?.getTracks().forEach(t => t.stop());
  const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
  const idRes = await fetch('http://localhost:5000/next-student-id');
  const { studentNumber } = await idRes.json();
  const studentFolder = `Student-${studentNumber}`;
  const filename = `${studentFolder}_${Date.now()}.webm`;
  const formData = new FormData();
  formData.append('video', blob, filename);
  await fetch(`http://localhost:5000/upload?student=${studentFolder}&filename=${filename}`, {
    method: 'POST', body: formData
  });
  navigate(`/quiz/${courseId}`);
}
```

Visual layout from design:
- Left sidebar: module list with lesson titles, lock/check icons, course progress bar
- Main: full-width `<video>` player
- Below video: lesson title + instructor + "Ask Doubt" btn + "Materials" btn
- 4 info cards:
  1. **LIVE WEBCAM FEED** — `<video ref={webcamRef} autoPlay muted className="w-full rounded-lg" />` with REC badge
  2. **LEARNING INSIGHTS** — attentionScore%, emotion, trend
  3. **SESSION INFORMATION** — duration counter, video progress, lesson number
  4. **PRIVACY NOTICE** — shield icon + privacy text

---

### 9. `/quiz/:id` → `src/pages/QuizTake.tsx` (already good — keep it, just verify)

Verify it loads quiz from `db.quizzes.get(id)`, handles answer selection, calculates score, and navigates back to `/dashboard` on finish.

---

### 10. `/quizzes` → `src/pages/Quizzes.tsx`

Look at `_generated/QuizzesDesign.tsx` for visual design.

Logic:
```typescript
const [quizzes, setQuizzes] = useState([]);
useEffect(() => { getAllQuizzes().then(setQuizzes); }, []);
```

Layout: `<StudentSidebar active="Quizzes" />` + quiz cards (title, course, question count, time limit, status badge, "Take Quiz" → `/quiz/{quiz.id}`).

---

### 11. `/progress` → `src/pages/Progress.tsx`

Look at `_generated/ProgressDesign.tsx` for visual design.

Logic:
```typescript
const user = getCurrentUser();
const streak = user?.streak ?? 5;
const points = user?.points ?? 150;
const [courses, setCourses] = useState([]);
useEffect(() => { getEnrolledCourses(user!.id!).then(setCourses); }, []);
```

Layout: `<StudentSidebar active="Progress & Streaks" />` + motivation center with streak tracker (7-day grid), weekly pot card, subject mastery circles (use Recharts PieChart), achievement badges, recent milestones, motivational banner.

---

### 12. `/assignments` → `src/pages/Assignments.tsx`

Look at `_generated/AssignmentsDesign.tsx` for visual design.

Logic:
```typescript
const user = getCurrentUser();
const [assignments, setAssignments] = useState([]);
const [submissions, setSubmissions] = useState([]);

useEffect(() => {
  getAllAssignments().then(setAssignments);
  db.submissions.where('studentId').equals(user!.id!).toArray().then(setSubmissions);
}, []);

async function handleSubmit(assignmentId: number, file: File) {
  await submitAssignment({
    assignmentId,
    studentId: user!.id!,
    submittedAt: new Date().toISOString(),
    fileName: file.name,
    status: 'submitted'
  });
}
```

Layout: `<StudentSidebar active="Assignments" />` + filter tabs (All/Pending/Submitted/Graded) + assignment cards with due date, file upload input, submit button.

---

### 13. `/challenges` → `src/pages/Challenges.tsx`

Look at `_generated/ChallengesDesign.tsx` for visual design.
Layout: `<StudentSidebar active="Peer Challenges" />` + challenge cards with difficulty badges, participants, deadline, points. Use mock data from `mockUsers` for leaderboard.

---

### 14. `/streak-pot` → `src/pages/StreakPot.tsx`

Look at `_generated/StreakPotDesign.tsx` for visual design.
Layout: `<StudentSidebar active="Streak Pot" />` + pot visualization + top streak holders from `mockUsers` sorted by streak.

---

### 15. `/leaderboard` → `src/pages/Leaderboard.tsx`

Look at `_generated/LeaderboardDesign.tsx` for visual design.

Logic:
```typescript
const [students, setStudents] = useState([]);
useEffect(() => {
  db.users.where('role').equals('student').toArray().then(users =>
    setStudents(users.sort((a, b) => (b.points ?? 0) - (a.points ?? 0)))
  );
}, []);
```

Layout: `<StudentSidebar active="Leaderboard" />` + top 3 podium + ranked table. Highlight current user's row.

---

### 16. `/announcements` → `src/pages/Announcements.tsx`

Look at `_generated/AnnouncementsDesign.tsx` for visual design.
Logic: load from `db.assignments` (or create a simple announcements mock array). Layout: `<StudentSidebar active="Announcements" />` + announcement cards.

---

### 17. `/downloads` → `src/pages/Downloads.tsx`

Look at `_generated/DownloadsDesign.tsx` for visual design.

Logic:
```typescript
const user = getCurrentUser();
const [downloads, setDownloads] = useState([]);
useEffect(() => { getDownloads(user!.id!).then(setDownloads); }, []);
async function handleDelete(id: number) {
  await deleteDownload(id);
  setDownloads(d => d.filter(x => x.id !== id));
}
```

Layout: `<StudentSidebar active="Downloads" />` + file list with type icons + storage bar + delete buttons.

---

### 18. `/community` → `src/pages/Community.tsx`

Look at `_generated/CommunityDesign.tsx` for visual design.

Logic:
```typescript
const user = getCurrentUser();
const [doubts, setDoubts] = useState([]);
const [question, setQuestion] = useState('');
useEffect(() => { getDoubts().then(setDoubts); }, []);
async function handlePost() {
  await addDoubt({ studentId: user!.id!, studentName: user!.name, question, createdAt: new Date().toISOString() });
  setQuestion('');
  getDoubts().then(setDoubts);
}
```

Layout: `<StudentSidebar active="Explore Community" />` + post question form + doubt cards with upvotes, reply count, "Answer" button.

---

### 19. `/apprenticeships` → `src/pages/Apprenticeships.tsx`

Look at `_generated/ApprenticeshipsDesign.tsx` for visual design.
Layout: `<StudentSidebar active="My Apprenticeships" />` + opportunity cards with company, role, duration, stipend, "Apply" button. Use static mock data for cards.

---

### 20. `/career-find` → `src/pages/CareerFind.tsx` (already exists — restyle it)

Keep existing logic. Apply design system (green/navy/Inter). Layout: `<StudentSidebar active="Career Find" />`.

---

### 21. `/profile` → `src/pages/StudentProfile.tsx`

Look at `_generated` (or `student_profile/screen.png` for reference).

Logic:
```typescript
const user = getCurrentUser();
const [courses, setCourses] = useState([]);
useEffect(() => { getEnrolledCourses(user!.id!).then(setCourses); }, []);
const completed = courses.filter(c => c.enrollmentStatus === 'completed').length;
```

Layout: top navbar (no sidebar), profile banner (green gradient), profile completion bar, 2-column layout: Learning Overview stats + Learning Journey active course + Achievement badges | Preferences & Goals + Community Impact.

---

### 22. `/settings` → `src/pages/StudentSettings.tsx`

Logic: read/write preferences to localStorage. `const [lang, setLang] = useState(localStorage.getItem('eduNext_language') || 'english');`

Layout: breadcrumb, sections for Profile Info / Learning Preferences / Notifications / Accessibility / Offline / Appearance / Privacy / Support. Each section is a card. Toggles use `useState`. "Save Changes" writes to localStorage.

---

### 23. `/teacher-dashboard` → `src/pages/TeacherDashboard.tsx`

Look at `_generated/TeacherDashboardDesign.tsx` for visual design.

**This is the most complex page — keep ALL the original logic from the backup:**

```typescript
const currentUser = getCurrentUser();
if (!currentUser || currentUser.role !== 'teacher') { navigate('/teacher-login'); return null; }

// All state from original:
const [courses, setCourses] = useState([]);
const [doubts, setDoubts] = useState([]);
const [assignments, setAssignments] = useState([]);
const [submissions, setSubmissions] = useState([]);
const [replyText, setReplyText] = useState('');
const [replyFiles, setReplyFiles] = useState([]);
const [isRecording, setIsRecording] = useState(false);

// Load all data on mount
useEffect(() => { loadData(); }, []);

// All functions from original:
// loadCourses(), loadDoubts(), loadAssignmentsAndSubmissions()
// handleAddCourse(), handleEditCourse(), handleDeleteCourse()
// handleAddAssignment(), gradeSubmission()
// handleReply(), handleEditReply(), handleDeleteReply()
// startVoiceRecording(), stopVoiceRecording()
// downloadAttachment()
```

Layout (new design):
- `<TeacherSidebar active="Dashboard" />` on left
- `<TopBar />` on top
- Main content = tabbed view:
  - **Overview tab** (default): welcome heading + 4 stat cards (courses, students, assignments, quizzes) + Quick Actions row + Active Courses cards + Recent Activity feed
  - **Courses tab**: course cards grid with Manage/Analytics/Delete buttons + Add Course form
  - **Assignments tab**: assignment list + Add Assignment form + grade submissions
  - **Doubts tab**: doubt feed with reply form (text + file + voice recording)
  - **Analytics tab**: Recharts LineChart (attendance), BarChart (scores), PieChart (performance)

---

### 24. `/teacher-courses` → `src/pages/TeacherCourses.tsx`

Look at `_generated/TeacherCoursesDesign.tsx` for visual design.

Logic: same course loading as TeacherDashboard. `getTeacherCourses(currentUser.id!)`.

Layout: `<TeacherSidebar active="Courses" />` + filter tabs (All/Active/Draft/Archived) + course cards grid + "+ Create New Course" → `/teacher-courses/new`.

---

### 25. `/teacher-courses/new` → Multi-step form `src/pages/CreateCourse.tsx`

Look at `_generated/CreateCourse0Design.tsx` through `CreateCourse5Design.tsx`.

6 steps managed with `useState<number>(0)` for current step.

Step progress indicator at top: `[1 Basic Info] → [2 Structure] → [3 Content] → [4 Permissions] → [5 Quizzes] → [6 Publish]`

State:
```typescript
const [step, setStep] = useState(0);
const [form, setForm] = useState({
  title: '', description: '', category: '', level: 'beginner', language: 'english',
  thumbnail: null, modules: [], videos: [], materials: [], quizzes: []
});
```

On final step "Publish": call `addTeacherCourse({ ...form, teacherId: currentUser.id!, status: 'Active' })` then navigate to `/teacher-courses`.

---

### 26. `/teacher-students` → `src/pages/TeacherStudentsList.tsx`

Look at `_generated/TeacherStudentsListDesign.tsx`.

Logic:
```typescript
const [students, setStudents] = useState([]);
useEffect(() => {
  db.users.where('role').equals('student').toArray().then(setStudents);
}, []);
```

Layout: `<TeacherSidebar active="Students" />` + 4 stat cards + filter dropdowns + students table (name, email, courses, completion%, attention%, quiz avg, status badge, "View Profile" → `/teacher-students/{student.id}`).

---

### 27. `/teacher-students/:id` → `src/pages/TeacherStudentProfile.tsx`

Look at `_generated/TeacherStudentProfileDesign.tsx`.

Logic:
```typescript
const { id } = useParams();
const [student, setStudent] = useState(null);
const [enrollments, setEnrollments] = useState([]);
useEffect(() => {
  db.users.get(Number(id)).then(setStudent);
  getEnrolledCourses(Number(id)).then(setEnrollments);
}, [id]);
```

Layout: `<TeacherSidebar active="Students" />` + breadcrumb + profile card + tab bar (Overview / Attention Reports / Webcam Recordings / Quiz Performance / Assignment History). Each tab shows relevant content. "View Profile" tabs navigate using `useState<string>('overview')` for active tab.

---

### 28–30. Student detail sub-pages

These are tabs within `TeacherStudentProfile` — implement them as inline tab content rather than separate routes, but also register the routes:

- `/teacher-students/:id/attention` → `src/pages/TeacherStudentAttention.tsx` — Recharts LineChart of attention over time, session table
- `/teacher-students/:id/assignments` → `src/pages/TeacherStudentAssignments.tsx` — table of submissions with grade input using `gradeSubmission()`
- `/teacher-students/:id/quiz` → `src/pages/TeacherStudentQuiz.tsx` — quiz scores Recharts BarChart + table

---

### 31. `/teacher-dashboard/students-recordings` → `src/pages/TeacherDashboardStudents.tsx`

Look at `_generated/TeacherRecordingsDesign.tsx`.

Logic (keep existing — calls the Node.js backend):
```typescript
const [recordings, setRecordings] = useState([]);
useEffect(() => {
  fetch('http://localhost:5000/recordings/all')
    .then(r => r.json())
    .then(setRecordings)
    .catch(() => setRecordings([]));
}, []);
```

Layout: `<TeacherSidebar active="Webcam Recordings" />` + student selector + date filter + recording cards (thumbnail, lesson name, course tag, date, teacher notes textarea, "View" → `/play-video/{student}/{filename}`).

---

### 32. `/play-video/:student/:filename` → `src/pages/PlayVideoPage.tsx` (already exists — keep)

Verify it calls `http://localhost:5000/recordings/{student}` and renders a `<video>` player.

---

### 33. `/teacher-quizzes` → `src/pages/TeacherQuizzes.tsx`

Look at `_generated/TeacherQuizzesDesign.tsx`.
Logic: `getAllQuizzes()`. Layout: `<TeacherSidebar active="Quizzes" />` + quiz cards with course, questions, avg score + "+ Create Quiz" button (simple modal with title + questions).

---

### 34. `/teacher-assignments` → `src/pages/TeacherAssignments.tsx`

Look at `_generated/TeacherAssignmentsDesign.tsx`.
Logic: same assignment logic as TeacherDashboard assignments tab — `getAssignmentsForTeacher()`, `gradeSubmission()`. Layout: `<TeacherSidebar active="Assignments" />`.

---

### 35. `/teacher-reports` → `src/pages/TeacherReports.tsx`

Look at `_generated/TeacherReportsDesign.tsx`.
Layout: `<TeacherSidebar active="Reports" />` + 4 stat cards + tab bar (Attention/Quiz/Assignment/Course reports) + Recharts charts (LineChart for engagement, PieChart for attention score 75%, progress bars for emotion distribution, blink analytics card). Export buttons are UI-only.

---

### 36. `/teacher-community` → `src/pages/TeacherCommunity.tsx`

Look at `_generated/TeacherCommunityDesign.tsx`.
Logic: same doubts logic as TeacherDashboard doubts tab — `getDoubts()`, `replyToDoubt()`. Layout: `<TeacherSidebar active="Community" />` + doubt cards + reply form with text/file/voice.

---

### 37. `/teacher-announcements` → `src/pages/TeacherAnnouncements.tsx`

Look at `_generated/TeacherAnnouncementsDesign.tsx`.
Layout: `<TeacherSidebar active="Announcements" />` + announcement cards + "+ Publish Announcement" form.

---

### 38. `/teacher-apprenticeships` → `src/pages/TeacherApprenticeships.tsx`

Look at `_generated/TeacherApprenticeshipsDesign.tsx`.
Layout: `<TeacherSidebar active="Apprenticeships" />` + postings list + student applications.

---

### 39. `/teacher-profile` → `src/pages/TeacherProfile.tsx`

Look at `_generated/TeacherProfileDesign.tsx`.
Logic: `getCurrentUser()`. Layout: `<TeacherSidebar active="" />` + profile banner + stats + bio + courses taught list from `getTeacherCourses()`.

---

### 40. `/teacher-settings` → `src/pages/TeacherSettings.tsx`

Look at `_generated/TeacherSettingsDesign.tsx`.
Layout: `<TeacherSidebar active="Settings" />` + same settings sections as student but teacher-specific fields.

---

## FINAL STEP — Update App.tsx

Once all pages are built, update `src/App.tsx` with every route. Delete the `_generated` folder entirely. The final App.tsx should have NO references to `_generated` or `DesignShell`.

```tsx
import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import StudentLogin from "./pages/StudentLogin";
import TeacherLogin from "./pages/TeacherLogin";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import MyCourses from "./pages/MyCourses";
import CourseVideo from "./pages/CourseVideo";
import QuizTake from "./pages/QuizTake";
import Quizzes from "./pages/Quizzes";
import Progress from "./pages/Progress";
import Assignments from "./pages/Assignments";
import Challenges from "./pages/Challenges";
import StreakPot from "./pages/StreakPot";
import Leaderboard from "./pages/Leaderboard";
import Announcements from "./pages/Announcements";
import Downloads from "./pages/Downloads";
import Community from "./pages/Community";
import Apprenticeships from "./pages/Apprenticeships";
import CareerFind from "./pages/CareerFind";
import StudentProfile from "./pages/StudentProfile";
import StudentSettings from "./pages/StudentSettings";
import TeacherDashboard from "./pages/TeacherDashboard";
import TeacherCourses from "./pages/TeacherCourses";
import CreateCourse from "./pages/CreateCourse";
import TeacherStudentsList from "./pages/TeacherStudentsList";
import TeacherStudentProfile from "./pages/TeacherStudentProfile";
import TeacherStudentAttention from "./pages/TeacherStudentAttention";
import TeacherStudentAssignments from "./pages/TeacherStudentAssignments";
import TeacherStudentQuiz from "./pages/TeacherStudentQuiz";
import TeacherDashboardStudents from "./pages/TeacherDashboardStudents";
import PlayVideoPage from "./pages/PlayVideoPage";
import TeacherQuizzes from "./pages/TeacherQuizzes";
import TeacherAssignments from "./pages/TeacherAssignments";
import TeacherReports from "./pages/TeacherReports";
import TeacherCommunity from "./pages/TeacherCommunity";
import TeacherAnnouncements from "./pages/TeacherAnnouncements";
import TeacherApprenticeships from "./pages/TeacherApprenticeships";
import TeacherProfile from "./pages/TeacherProfile";
import TeacherSettings from "./pages/TeacherSettings";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/student-login" element={<StudentLogin />} />
      <Route path="/teacher-login" element={<TeacherLogin />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/my-courses" element={<MyCourses />} />
      <Route path="/lesson/:id" element={<Navigate to="/my-courses" replace />} />
      <Route path="/course-video/:id" element={<CourseVideo />} />
      <Route path="/quiz/:id" element={<QuizTake />} />
      <Route path="/quizzes" element={<Quizzes />} />
      <Route path="/progress" element={<Progress />} />
      <Route path="/assignments" element={<Assignments />} />
      <Route path="/challenges" element={<Challenges />} />
      <Route path="/streak-pot" element={<StreakPot />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/announcements" element={<Announcements />} />
      <Route path="/downloads" element={<Downloads />} />
      <Route path="/community" element={<Community />} />
      <Route path="/apprenticeships" element={<Apprenticeships />} />
      <Route path="/career-find" element={<CareerFind />} />
      <Route path="/profile" element={<StudentProfile />} />
      <Route path="/settings" element={<StudentSettings />} />
      <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
      <Route path="/teacher-courses" element={<TeacherCourses />} />
      <Route path="/teacher-courses/new" element={<CreateCourse />} />
      <Route path="/teacher-students" element={<TeacherStudentsList />} />
      <Route path="/teacher-students/:id" element={<TeacherStudentProfile />} />
      <Route path="/teacher-students/:id/attention" element={<TeacherStudentAttention />} />
      <Route path="/teacher-students/:id/assignments" element={<TeacherStudentAssignments />} />
      <Route path="/teacher-students/:id/quiz" element={<TeacherStudentQuiz />} />
      <Route path="/teacher-dashboard/students-recordings" element={<TeacherDashboardStudents />} />
      <Route path="/play-video/:student/:filename" element={<PlayVideoPage />} />
      <Route path="/teacher-quizzes" element={<TeacherQuizzes />} />
      <Route path="/teacher-assignments" element={<TeacherAssignments />} />
      <Route path="/teacher-reports" element={<TeacherReports />} />
      <Route path="/teacher-community" element={<TeacherCommunity />} />
      <Route path="/teacher-announcements" element={<TeacherAnnouncements />} />
      <Route path="/teacher-apprenticeships" element={<TeacherApprenticeships />} />
      <Route path="/teacher-profile" element={<TeacherProfile />} />
      <Route path="/teacher-settings" element={<TeacherSettings />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
```

---

## VERIFY BEFORE FINISHING

Run `npm run build` and make sure there are zero TypeScript errors. Fix any that appear. The final build must compile cleanly.
