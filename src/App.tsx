import { Routes, Route, useLocation } from "react-router-dom";

import Landing from "./pages/Landing";
import StudentLogin from "./pages/StudentLogin";
import TeacherLogin from "./pages/TeacherLogin";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import MyCourses from "./pages/MyCourses";
import LessonRedirect from "./pages/LessonRedirect";
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
  const location = useLocation();
  return (
    <div key={location.pathname} className="page-enter">
    <Routes location={location}>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/student-login" element={<StudentLogin />} />
      <Route path="/teacher-login" element={<TeacherLogin />} />

      {/* Student */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/my-courses" element={<MyCourses />} />
      <Route path="/lesson/:id" element={<LessonRedirect />} />
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

      {/* Teacher */}
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
    </div>
  );
}
