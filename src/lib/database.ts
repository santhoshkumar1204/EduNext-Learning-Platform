import Dexie, { Table } from "dexie";
import {
  User,
  TeacherCourse,
  Enrollment,
  Lesson,
  Quiz,
  Assignment,
  Submission,
  Doubt,
  mockUsers,
  mockCourses,
  mockEnrollments,
  mockLessons,
  mockQuizzes,
  mockAssignments,
  mockDoubts,
} from "./mockData";

export interface Download {
  id?: number;
  studentId: number;
  title: string;
  type: "video" | "pdf" | "audio";
  course: string;
  size: number; // bytes
  downloadedAt: string;
  blob?: Blob;
}

export interface ProgressRecord {
  id?: number;
  studentId: number;
  courseId: number;
  lessonsCompleted: number;
  totalLessons: number;
  quizAvg: number;
  updatedAt: string;
}

class EduNextDB extends Dexie {
  users!: Table<User, number>;
  courses!: Table<TeacherCourse, number>;
  enrollments!: Table<Enrollment, number>;
  lessons!: Table<Lesson, number>;
  quizzes!: Table<Quiz, number>;
  downloads!: Table<Download, number>;
  assignments!: Table<Assignment, number>;
  submissions!: Table<Submission, number>;
  doubts!: Table<Doubt, number>;
  progress!: Table<ProgressRecord, number>;

  constructor() {
    super("eduNextDB");
    this.version(1).stores({
      users: "++id, role, studentId, email, schoolCode",
      courses: "++id, teacherId, status, category",
      enrollments: "++id, studentId, courseId, status",
      lessons: "++id, courseId, order",
      quizzes: "++id, courseId, lessonId",
      downloads: "++id, studentId, type",
      assignments: "++id, teacherId, courseId",
      submissions: "++id, assignmentId, studentId",
      doubts: "++id, studentId, courseId",
      progress: "++id, studentId, courseId",
    });
  }
}

export const db = new EduNextDB();

// ---------------------------------------------------------------------------
// Seeding
// ---------------------------------------------------------------------------
export async function seedDatabase() {
  try {
    const count = await db.users.count();
    if (count > 0) return; // already seeded
    await db.transaction(
      "rw",
      [db.users, db.courses, db.enrollments, db.lessons, db.quizzes, db.assignments, db.doubts],
      async () => {
        await db.users.bulkAdd(mockUsers);
        await db.courses.bulkAdd(mockCourses);
        await db.enrollments.bulkAdd(mockEnrollments);
        await db.lessons.bulkAdd(mockLessons);
        await db.quizzes.bulkAdd(mockQuizzes);
        await db.assignments.bulkAdd(mockAssignments);
        await db.doubts.bulkAdd(mockDoubts);
      }
    );
  } catch (e) {
    console.error("seedDatabase failed", e);
  }
}

// ---------------------------------------------------------------------------
// Current user session (localStorage)
// ---------------------------------------------------------------------------
const CURRENT_USER_KEY = "eduNext_currentUser";

export function getCurrentUser(): User | null {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function setCurrentUser(user: User) {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

export function clearCurrentUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

// ---------------------------------------------------------------------------
// Auth helpers
// ---------------------------------------------------------------------------
export async function studentLogin(schoolCode: string, studentId: string, pin: string): Promise<User | null> {
  const user = await db.users
    .where("studentId")
    .equalsIgnoreCase(studentId.trim())
    .first();
  if (user && user.role === "student" && user.schoolCode === schoolCode.trim() && user.pin === pin.trim()) {
    setCurrentUser(user);
    return user;
  }
  return null;
}

export async function teacherLogin(email: string, password: string): Promise<User | null> {
  // Mock rule: any teacher email with password "teacher123" works.
  if (password !== "teacher123") return null;
  let user = await db.users.where("email").equalsIgnoreCase(email.trim()).first();
  if (!user) {
    // accept any teacher email — fall back to the first teacher profile
    user = await db.users.where("role").equals("teacher").first();
  }
  if (user) {
    setCurrentUser({ ...user, email: email.trim() });
    return { ...user, email: email.trim() };
  }
  return null;
}

// ---------------------------------------------------------------------------
// Courses
// ---------------------------------------------------------------------------
export async function getTeacherCourses(teacherId: number): Promise<TeacherCourse[]> {
  return db.courses.where("teacherId").equals(teacherId).toArray();
}

export async function getAllCourses(): Promise<TeacherCourse[]> {
  return db.courses.toArray();
}

export async function addTeacherCourse(course: TeacherCourse): Promise<number> {
  return db.courses.add({ ...course, createdAt: new Date().toISOString() });
}

export async function updateTeacherCourse(id: number, changes: Partial<TeacherCourse>) {
  return db.courses.update(id, changes);
}

export async function deleteTeacherCourse(id: number) {
  return db.courses.delete(id);
}

// ---------------------------------------------------------------------------
// Enrollments
// ---------------------------------------------------------------------------
export async function getEnrollmentsForStudent(studentId: number): Promise<Enrollment[]> {
  return db.enrollments.where("studentId").equals(studentId).toArray();
}

export async function getEnrolledCourses(studentId: number) {
  const enrollments = await getEnrollmentsForStudent(studentId);
  const courses = await db.courses.toArray();
  return enrollments
    .map((e) => {
      const course = courses.find((c) => c.id === e.courseId);
      return course ? { ...course, progress: e.progress, lastAccessed: e.lastAccessed, enrollmentStatus: e.status } : null;
    })
    .filter(Boolean) as (TeacherCourse & { progress: number; lastAccessed?: string; enrollmentStatus?: string })[];
}

// ---------------------------------------------------------------------------
// Lessons / Quizzes
// ---------------------------------------------------------------------------
export async function getLessonsForCourse(courseId: number): Promise<Lesson[]> {
  return db.lessons.where("courseId").equals(courseId).sortBy("order");
}

export async function getQuizzesForCourse(courseId: number): Promise<Quiz[]> {
  return db.quizzes.where("courseId").equals(courseId).toArray();
}

export async function getAllQuizzes(): Promise<Quiz[]> {
  return db.quizzes.toArray();
}

// ---------------------------------------------------------------------------
// Assignments / Submissions
// ---------------------------------------------------------------------------
export async function addAssignmentNew(assignment: Assignment): Promise<number> {
  return db.assignments.add(assignment);
}

export async function getAssignmentsForTeacher(teacherId: number): Promise<Assignment[]> {
  return db.assignments.where("teacherId").equals(teacherId).toArray();
}

export async function getAllAssignments(): Promise<Assignment[]> {
  return db.assignments.toArray();
}

export async function getSubmissionsForAssignment(assignmentId: number): Promise<Submission[]> {
  return db.submissions.where("assignmentId").equals(assignmentId).toArray();
}

export async function submitAssignment(sub: Submission): Promise<number> {
  return db.submissions.add({ ...sub, status: "submitted" });
}

export async function gradeSubmission(submissionId: number, grade: number) {
  return db.submissions.update(submissionId, { grade, status: "graded" });
}

// ---------------------------------------------------------------------------
// Doubts
// ---------------------------------------------------------------------------
export async function getDoubts(): Promise<Doubt[]> {
  return db.doubts.toArray();
}

export async function addDoubt(doubt: Doubt): Promise<number> {
  return db.doubts.add(doubt);
}

export async function replyToDoubt(id: number, reply: string) {
  return db.doubts.update(id, { reply, repliedAt: new Date().toISOString() });
}

// ---------------------------------------------------------------------------
// Downloads
// ---------------------------------------------------------------------------
export async function getDownloads(studentId: number): Promise<Download[]> {
  return db.downloads.where("studentId").equals(studentId).toArray();
}

export async function addDownload(download: Download): Promise<number> {
  return db.downloads.add(download);
}

export async function deleteDownload(id: number) {
  return db.downloads.delete(id);
}
