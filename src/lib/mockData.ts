// Mock seed data for the eduNext platform.
// Students share schoolCode EDU001 + pin 1234. Teachers use password "teacher123".

export type Role = "student" | "teacher";

export interface User {
  id?: number;
  role: Role;
  // student auth
  schoolCode?: string;
  studentId?: string;
  pin?: string;
  // teacher auth
  email?: string;
  password?: string;
  // profile
  name: string;
  avatar?: string;
  department?: string;
  year?: string;
  institution?: string;
  title?: string;
  bio?: string;
  joinedDate?: string;
  points?: number;
  streak?: number;
  level?: number;
  language?: string;
}

export interface TeacherCourse {
  id?: number;
  title: string;
  description: string;
  language: string;
  level: string;
  category?: string;
  duration: string;
  teacherId: number;
  code?: string;
  semester?: string;
  status?: "Active" | "Draft" | "Archived";
  thumbnail?: string;
  students?: number;
  completion?: number;
  videos?: { title: string; url?: string; duration?: string }[];
  materials?: { title: string; type: string; url?: string }[];
  createdAt?: string;
}

export interface Enrollment {
  id?: number;
  studentId: number;
  courseId: number;
  progress: number;
  lastAccessed?: string;
  status?: "in-progress" | "completed";
}

export interface Lesson {
  id?: number;
  courseId: number;
  title: string;
  duration: string;
  order: number;
  videoUrl?: string;
  completed?: boolean;
}

export interface Quiz {
  id?: number;
  courseId: number;
  lessonId?: number;
  title: string;
  questions: QuizQuestion[];
  timeLimit?: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface Assignment {
  id?: number;
  teacherId: number;
  courseId?: number;
  title: string;
  subject: string;
  dueDate: string;
  instructions: string;
  status?: string;
}

export interface Submission {
  id?: number;
  assignmentId: number;
  studentId: number;
  submittedAt: string;
  fileName?: string;
  grade?: number | null;
  status?: "submitted" | "graded";
}

export interface Doubt {
  id?: number;
  studentId: number;
  studentName: string;
  courseId?: number;
  courseName?: string;
  question: string;
  attachment?: string;
  createdAt: string;
  reply?: string;
  repliedAt?: string;
}

export const mockUsers: User[] = [
  // ----- Students -----
  { role: "student", schoolCode: "EDU001", studentId: "STU001", pin: "1234", name: "Simran Kaur", department: "Computer Science", year: "3rd Year", institution: "Lumina Institute of Technology", points: 1850, streak: 12, level: 4, language: "en", joinedDate: "2024-08-15", avatar: "https://i.pravatar.cc/150?img=47" },
  { role: "student", schoolCode: "EDU001", studentId: "STU002", pin: "1234", name: "Rajveer Singh", department: "Information Technology", year: "2nd Year", institution: "Lumina Institute of Technology", points: 1420, streak: 7, level: 3, language: "en", joinedDate: "2024-09-01", avatar: "https://i.pravatar.cc/150?img=12" },
  { role: "student", schoolCode: "EDU001", studentId: "STU003", pin: "1234", name: "Priya Sharma", department: "Data Science", year: "3rd Year", institution: "Lumina Institute of Technology", points: 2310, streak: 21, level: 5, language: "hi", joinedDate: "2024-07-20", avatar: "https://i.pravatar.cc/150?img=45" },
  { role: "student", schoolCode: "EDU001", studentId: "STU004", pin: "1234", name: "Arjun Patel", department: "Cyber Security", year: "4th Year", institution: "Lumina Institute of Technology", points: 980, streak: 3, level: 2, language: "en", joinedDate: "2024-10-05", avatar: "https://i.pravatar.cc/150?img=33" },
  { role: "student", schoolCode: "EDU001", studentId: "STU005", pin: "1234", name: "Manpreet Kaur", department: "Computer Science", year: "1st Year", institution: "Lumina Institute of Technology", points: 640, streak: 5, level: 2, language: "pa", joinedDate: "2024-11-12", avatar: "https://i.pravatar.cc/150?img=20" },
  // ----- Teachers -----
  { role: "teacher", email: "anita.rao@lumina.edu", password: "teacher123", name: "Dr. Anita Rao", title: "Professor of Computer Science", department: "Computer Science", institution: "Lumina Institute of Technology", bio: "Educator and researcher focused on accessible, engagement-driven learning. 12 years teaching CS fundamentals and applied AI.", language: "en", joinedDate: "2018-06-01", avatar: "https://i.pravatar.cc/150?img=5" },
  { role: "teacher", email: "vikram.mehta@lumina.edu", password: "teacher123", name: "Dr. Vikram Mehta", title: "Associate Professor, Data Science", department: "Data Science", institution: "Lumina Institute of Technology", bio: "Passionate about data literacy and analytics education.", language: "en", joinedDate: "2020-01-10", avatar: "https://i.pravatar.cc/150?img=15" },
];

export const mockCourses: TeacherCourse[] = [
  { title: "Introduction to Python Programming", description: "Master the fundamentals of Python — variables, control flow, functions, and building your first real programs.", language: "English", level: "Beginner", category: "Programming", duration: "8 weeks", teacherId: 6, code: "CS101", semester: "Fall 2025", status: "Active", thumbnail: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&q=80", students: 248, completion: 72, createdAt: "2025-08-01" },
  { title: "Web Development Bootcamp", description: "Build modern, responsive websites with HTML, CSS, JavaScript, and React from the ground up.", language: "English", level: "Intermediate", category: "Web Development", duration: "12 weeks", teacherId: 6, code: "CS204", semester: "Fall 2025", status: "Active", thumbnail: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&q=80", students: 186, completion: 54, createdAt: "2025-08-10" },
  { title: "Data Analytics with Python", description: "Turn raw data into insight using pandas, NumPy, and visualization libraries.", language: "English", level: "Intermediate", category: "Data Analytics", duration: "10 weeks", teacherId: 7, code: "DS210", semester: "Fall 2025", status: "Active", thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80", students: 142, completion: 61, createdAt: "2025-08-05" },
  { title: "Cyber Security Essentials", description: "Understand threats, encryption, secure networks, and defensive best practices.", language: "English", level: "Advanced", category: "Cyber Security", duration: "9 weeks", teacherId: 6, code: "CY301", semester: "Fall 2025", status: "Draft", thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80", students: 0, completion: 0, createdAt: "2025-09-01" },
  { title: "Mathematics for Machine Learning", description: "Linear algebra, calculus, and probability — the math foundations behind modern ML.", language: "English", level: "Intermediate", category: "Mathematics", duration: "11 weeks", teacherId: 7, code: "MA220", semester: "Fall 2025", status: "Active", thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80", students: 97, completion: 40, createdAt: "2025-08-20" },
];

// courseId is 1-based to match Dexie auto-increment ordering of mockCourses.
export const mockEnrollments: Enrollment[] = [
  { studentId: 1, courseId: 1, progress: 72, lastAccessed: "2026-06-10", status: "in-progress" },
  { studentId: 1, courseId: 2, progress: 45, lastAccessed: "2026-06-09", status: "in-progress" },
  { studentId: 1, courseId: 5, progress: 100, lastAccessed: "2026-05-28", status: "completed" },
  { studentId: 2, courseId: 1, progress: 30, lastAccessed: "2026-06-08", status: "in-progress" },
  { studentId: 3, courseId: 3, progress: 88, lastAccessed: "2026-06-11", status: "in-progress" },
];

export const mockLessons: Lesson[] = [
  { courseId: 1, title: "Welcome & Setting Up Python", duration: "08:24", order: 1, completed: true },
  { courseId: 1, title: "Variables and Data Types", duration: "14:10", order: 2, completed: true },
  { courseId: 1, title: "Control Flow: if / else", duration: "16:45", order: 3, completed: true },
  { courseId: 1, title: "Loops and Iteration", duration: "18:02", order: 4, completed: false },
  { courseId: 1, title: "Functions and Scope", duration: "21:30", order: 5, completed: false },
  { courseId: 1, title: "Working with Lists", duration: "15:55", order: 6, completed: false },
  { courseId: 2, title: "How the Web Works", duration: "12:00", order: 1, completed: true },
  { courseId: 2, title: "HTML Structure", duration: "19:20", order: 2, completed: false },
];

export const mockQuizzes: Quiz[] = [
  {
    courseId: 1,
    lessonId: 4,
    title: "Python Loops & Iteration Quiz",
    timeLimit: 600,
    questions: [
      { id: 1, question: "Which keyword starts a loop that runs while a condition is true?", options: ["for", "while", "loop", "repeat"], correctIndex: 1 },
      { id: 2, question: "What does range(5) produce?", options: ["1 to 5", "0 to 5", "0 to 4", "1 to 4"], correctIndex: 2 },
      { id: 3, question: "Which statement skips to the next loop iteration?", options: ["break", "stop", "continue", "skip"], correctIndex: 2 },
      { id: 4, question: "How do you exit a loop early?", options: ["exit", "break", "return", "end"], correctIndex: 1 },
      { id: 5, question: "What is the output of len([1,2,3])?", options: ["2", "3", "4", "Error"], correctIndex: 1 },
    ],
  },
  {
    courseId: 2,
    title: "Web Fundamentals Quiz",
    timeLimit: 480,
    questions: [
      { id: 1, question: "What does HTML stand for?", options: ["Hyper Trainer Marking Language", "HyperText Markup Language", "HyperText Markdown Language", "Hyper Tool Multi Language"], correctIndex: 1 },
      { id: 2, question: "Which tag creates a hyperlink?", options: ["<link>", "<href>", "<a>", "<url>"], correctIndex: 2 },
      { id: 3, question: "CSS is used for?", options: ["Logic", "Styling", "Database", "Routing"], correctIndex: 1 },
    ],
  },
];

export const mockAssignments: Assignment[] = [
  { teacherId: 6, courseId: 1, title: "Build a Number Guessing Game", subject: "Python Programming", dueDate: "2026-06-18", instructions: "Write a Python program that asks the user to guess a random number between 1 and 100, giving hints until they win.", status: "Pending" },
  { teacherId: 6, courseId: 2, title: "Personal Portfolio Page", subject: "Web Development", dueDate: "2026-06-22", instructions: "Create a single-page responsive portfolio using HTML and CSS.", status: "Pending" },
  { teacherId: 7, courseId: 3, title: "Sales Data Analysis Report", subject: "Data Analytics", dueDate: "2026-06-15", instructions: "Analyze the provided CSV dataset and submit a short report with three visualizations.", status: "Submitted" },
];

export const mockDoubts: Doubt[] = [
  { studentId: 2, studentName: "Rajveer Singh", courseId: 1, courseName: "Introduction to Python Programming", question: "I'm confused about the difference between a while loop and a for loop. When should I use each one?", createdAt: "2026-06-10T09:30:00", reply: "" },
  { studentId: 4, studentName: "Arjun Patel", courseId: 2, courseName: "Web Development Bootcamp", question: "My flexbox items aren't centering vertically. What am I missing?", createdAt: "2026-06-09T16:12:00", reply: "Make sure the parent has display:flex and align-items:center set. Happy to look at your code!", repliedAt: "2026-06-09T18:00:00" },
];
