import Icon from "./Icon";
import Logo from "./Logo";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser, clearCurrentUser } from "../lib/database";

interface NavItem {
  label: string;
  to: string;
  icon: string;
}

const MAIN: NavItem[] = [
  { label: "Dashboard", to: "/teacher-dashboard", icon: "dashboard" },
  { label: "Courses", to: "/teacher-courses", icon: "menu_book" },
  { label: "Students", to: "/teacher-students", icon: "groups" },
  { label: "Learning Analytics", to: "/teacher-dashboard", icon: "analytics" },
  { label: "Webcam Recordings", to: "/teacher-dashboard/students-recordings", icon: "videocam" },
  { label: "Quizzes", to: "/teacher-quizzes", icon: "quiz" },
  { label: "Assignments", to: "/teacher-assignments", icon: "assignment" },
  { label: "Community", to: "/teacher-community", icon: "forum" },
  { label: "Announcements", to: "/teacher-announcements", icon: "campaign" },
  { label: "Apprenticeships", to: "/teacher-apprenticeships", icon: "work" },
  { label: "Reports", to: "/teacher-reports", icon: "summarize" },
];

export default function TeacherSidebar({ active }: { active: string }) {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const initial = (user?.name || "T").charAt(0).toUpperCase();

  function logout() {
    clearCurrentUser();
    navigate("/");
  }

  function NavLink({ item }: { item: NavItem }) {
    const isActive = item.label === active;
    return (
      <Link
        to={item.to}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${
          isActive ? "bg-[#0F2B5B]/10 text-[#0F2B5B] font-semibold" : "text-gray-600 hover:bg-blue-50/60 hover:text-[#0F2B5B]"
        }`}
      >
        <Icon name={item.icon} className="text-[20px]" />
        {item.label}
      </Link>
    );
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-100 flex flex-col z-40">
      <div className="px-5 h-16 flex flex-col justify-center border-b border-gray-100 shrink-0">
        <Logo size={24} />
        <span className="text-[11px] text-gray-400 ml-9 -mt-1">Teacher Dashboard</span>
      </div>

      <div className="p-3 shrink-0">
        <Link
          to="/teacher-courses/new"
          className="flex items-center justify-center gap-2 w-full bg-[#0F2B5B] hover:bg-[#0A1F44] text-white font-semibold rounded-xl py-2.5 text-sm transition"
        >
          <Icon name="add" className="text-[20px]" />
          Create New Course
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto thin-scroll px-3 pb-4 space-y-1">
        {MAIN.map((item) => (
          <NavLink key={item.label + item.to} item={item} />
        ))}
      </div>

      <div className="p-3 border-t border-gray-100 shrink-0 space-y-1">
        <Link
          to="/teacher-settings"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${
            active === "Settings" ? "bg-[#0F2B5B]/10 text-[#0F2B5B] font-semibold" : "text-gray-600 hover:bg-blue-50/60 hover:text-[#0F2B5B]"
          }`}
        >
          <Icon name="settings" className="text-[20px]" />
          Settings
        </Link>
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-9 h-9 rounded-full bg-navy text-white flex items-center justify-center font-bold text-sm">
            {initial}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-navy text-xs truncate">{user?.name || "Teacher"}</p>
            <p className="text-[11px] text-gray-400 truncate">{user?.title || "Educator"}</p>
          </div>
          <button onClick={logout} title="Logout" className="text-gray-400 hover:text-error text-[20px]"><Icon name="logout" /></button>
        </div>
      </div>
    </aside>
  );
}
