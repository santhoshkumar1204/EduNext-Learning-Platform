import { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "./Icon";
import { getCurrentUser, clearCurrentUser } from "../lib/database";
import { avatarUrl } from "../lib/images";

// Shared chrome for teacher pages — exact port of teacher_dashboard sidebar + topbar.
const NAV = [
  { label: "Dashboard", icon: "dashboard", to: "/teacher-dashboard" },
  { label: "Courses", icon: "menu_book", to: "/teacher-courses" },
  { label: "Students", icon: "group", to: "/teacher-students" },
  { label: "Learning Analytics", icon: "analytics", to: "/teacher-reports" },
  { label: "Attention Analytics", icon: "visibility", to: "/teacher-dashboard/students-recordings" },
  { label: "Quizzes", icon: "quiz", to: "/teacher-quizzes" },
  { label: "Assignments", icon: "assignment", to: "/teacher-assignments" },
  { label: "Community", icon: "forum", to: "/teacher-community" },
  { label: "Announcements", icon: "campaign", to: "/teacher-announcements" },
  { label: "Apprenticeships", icon: "school", to: "/teacher-apprenticeships" },
  { label: "Reports", icon: "description", to: "/teacher-reports" },
];

export default function TeacherShell({ active, children }: { active: string; children: ReactNode }) {
  const navigate = useNavigate();
  const user = getCurrentUser();
  function logout() { clearCurrentUser(); navigate("/"); }

  return (
    <div className="bg-[#f8f9fb] text-[#191c1e] text-body-md min-h-screen flex">
      {/* Sidebar */}
      <nav className="fixed left-0 top-0 h-screen w-64 border-r border-[#bdcabb] bg-[#f8f9fb] flex flex-col py-6 overflow-y-auto z-40">
        <div className="px-6 mb-8 flex items-center gap-3">
          <img src="/logo.png" alt="EduNext logo" className="w-10 h-10 rounded-full object-contain shrink-0" />
          <div className="flex flex-col">
            <span className="text-headline-lg font-bold text-[#0F2B5B] tracking-tight">EduNext</span>
            <span className="text-label-sm text-[#3e4a3e] mt-1">Teacher Dashboard</span>
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-1 px-3">
          {NAV.map((n) => n.label === active ? (
            <Link key={n.label} to={n.to} className="flex items-center gap-3 px-4 py-3 text-[#0F2B5B] font-bold border-r-4 border-[#0F2B5B] bg-[#0F2B5B]/10 rounded-lg transition-colors">
              <Icon name={n.icon} fill /><span className="text-label-bold">{n.label}</span>
            </Link>
          ) : (
            <Link key={n.label} to={n.to} className="flex items-center gap-3 px-4 py-3 text-[#3e4a3e] font-medium rounded-lg hover:bg-[#e7e8ea] transition-colors">
              <Icon name={n.icon} /><span className="text-label-bold">{n.label}</span>
            </Link>
          ))}
        </div>
        <div className="mt-auto flex flex-col gap-1 px-3 pt-6 border-t border-[#bdcabb]/50">
          <Link to="/teacher-profile" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${active === "Profile" ? "text-[#0F2B5B] font-bold border-r-4 border-[#0F2B5B] bg-[#0F2B5B]/10" : "text-[#3e4a3e] font-medium hover:bg-[#e7e8ea]"}`}>
            <Icon name="person" /><span className="text-label-bold">Profile</span>
          </Link>
          <button onClick={logout} className="flex items-center gap-3 px-4 py-3 text-[#3e4a3e] font-medium rounded-lg hover:bg-[#e7e8ea] transition-colors text-left">
            <Icon name="logout" /><span className="text-label-bold">Logout</span>
          </button>
        </div>
      </nav>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen ml-64 max-w-[calc(100%-16rem)]">
        <header className="flex justify-between items-center w-full px-6 h-20 border-b border-[#bdcabb] bg-[#f8f9fb] sticky top-0 z-30">
          <div className="relative w-96 hidden md:block">
            <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6e7a6d]" />
            <input className="w-full h-10 pl-10 pr-4 bg-white border border-[#bdcabb] rounded-full text-sm text-[#191c1e] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all" placeholder="Search courses, students, or reports..." />
          </div>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full flex items-center justify-center text-[#3e4a3e] hover:bg-[#f3f4f6] transition-colors relative"><Icon name="notifications" /><span className="absolute top-2 right-2 w-2 h-2 bg-[#EF4444] rounded-full"></span></button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center text-[#3e4a3e] hover:bg-[#f3f4f6] transition-colors"><Icon name="help" /></button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center text-[#3e4a3e] hover:bg-[#f3f4f6] transition-colors mr-2"><Icon name="apps" /></button>
            <div className="h-8 w-px bg-[#bdcabb]/50 mr-2"></div>
            <Link to="/teacher-profile" className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="flex flex-col items-end"><span className="text-label-bold text-[#191c1e]">{user?.name || "Dr. Amarjeet Kaur"}</span><span className="text-label-sm text-[#3e4a3e]">{user?.title || "Professor"}</span></div>
              <img alt="" className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" src={avatarUrl(user?.name || "Amarjeet Kaur")} />
            </Link>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
