import Icon from "./Icon";
import Logo from "./Logo";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser, clearCurrentUser } from "../lib/database";

interface NavItem {
  label: string;
  to: string;
  icon: string;
}

const MENU: NavItem[] = [
  { label: "Dashboard", to: "/dashboard", icon: "dashboard" },
  { label: "Courses", to: "/courses", icon: "menu_book" },
  { label: "My Courses", to: "/my-courses", icon: "school" },
  { label: "Progress & Streaks", to: "/progress", icon: "trending_up" },
];
const ACTIVITIES: NavItem[] = [
  { label: "Quizzes", to: "/quizzes", icon: "quiz" },
  { label: "Assignments", to: "/assignments", icon: "assignment" },
  { label: "Peer Challenges", to: "/challenges", icon: "groups" },
  { label: "Streak Pot", to: "/streak-pot", icon: "savings" },
  { label: "My Apprenticeships", to: "/apprenticeships", icon: "work" },
  { label: "Leaderboard", to: "/leaderboard", icon: "leaderboard" },
];
const RESOURCES: NavItem[] = [
  { label: "Announcements", to: "/announcements", icon: "campaign" },
  { label: "Downloads", to: "/downloads", icon: "download" },
  { label: "Career Find", to: "/career-find", icon: "travel_explore" },
  { label: "Explore Community", to: "/community", icon: "forum" },
];

function Group({ title, items, active }: { title: string; items: NavItem[]; active: string }) {
  return (
    <div className="mb-5">
      <p className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">{title}</p>
      <nav className="space-y-1">
        {items.map((item) => {
          const isActive = item.label === active;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${
                isActive ? "bg-[#0F2B5B]/10 text-[#0F2B5B] font-semibold" : "text-gray-600 hover:bg-blue-50/60 hover:text-[#0F2B5B]"
              }`}
            >
              <Icon name={item.icon} className="text-[20px]" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default function StudentSidebar({ active }: { active: string }) {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const initial = (user?.name || "S").charAt(0).toUpperCase();

  function logout() {
    clearCurrentUser();
    navigate("/");
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-100 flex flex-col z-40">
      <Link to="/dashboard" className="flex items-center px-5 h-16 border-b border-gray-100 shrink-0">
        <Logo size={26} />
      </Link>

      <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100 shrink-0">
        <div className="w-10 h-10 rounded-full bg-[#0F2B5B] text-white flex items-center justify-center font-bold">
          {initial}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-navy text-sm truncate">{user?.name || "Student"}</p>
          <p className="text-xs text-gray-400 truncate">{user?.studentId || "STU001"}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto thin-scroll px-3 py-4">
        <Group title="Menu" items={MENU} active={active} />
        <Group title="Activities" items={ACTIVITIES} active={active} />
        <Group title="Resources" items={RESOURCES} active={active} />
      </div>

      <div className="p-3 border-t border-gray-100 shrink-0">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-red-50 hover:text-error w-full transition"
        >
          <Icon name="logout" className="text-[20px]" />
          Logout
        </button>
      </div>
    </aside>
  );
}
