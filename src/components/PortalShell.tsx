import { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "./Icon";
import { getCurrentUser, clearCurrentUser } from "../lib/database";

// Shared chrome for the navy "Learning Portal" pages (apprenticeships, assignments, …)
const NAV = [
  { label: "Dashboard", icon: "dashboard", to: "/dashboard" },
  { label: "Courses", icon: "school", to: "/courses" },
  { label: "My Courses", icon: "local_library", to: "/my-courses" },
  { label: "Progress & Streaks", icon: "trending_up", to: "/progress" },
  { label: "Quizzes", icon: "quiz", to: "/quizzes" },
  { label: "Assignments", icon: "assignment", to: "/assignments" },
  { label: "Peer Challenges", icon: "groups", to: "/challenges" },
  { label: "Streak Pot", icon: "workspace_premium", to: "/streak-pot" },
  { label: "My Apprenticeships", icon: "work", to: "/apprenticeships" },
  { label: "Leaderboard", icon: "leaderboard", to: "/leaderboard" },
  { label: "Announcements", icon: "campaign", to: "/announcements" },
  { label: "Downloads", icon: "download", to: "/downloads" },
  { label: "Career Find", icon: "explore", to: "/career-find" },
  { label: "Explore Community", icon: "forum", to: "/community" },
  { label: "Cardboard VR", icon: "view_in_ar", to: "#" },
];

export default function PortalShell({ active, children }: { active: string; children: ReactNode }) {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const initials = (user?.name || "JD").split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  function logout() {
    clearCurrentUser();
    navigate("/");
  }

  const idle = "flex items-center gap-3 px-4 py-3 text-[#43474e] hover:bg-[#e0e3e5] rounded-xl text-label-md hover:translate-x-1 transition-transform duration-200";

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] h-screen flex overflow-hidden">
      {/* SideNavBar */}
      <nav className="hidden md:flex flex-col h-screen w-64 bg-[#f2f4f6] shadow-md py-2 px-4 gap-2 overflow-y-auto flex-shrink-0 relative z-40">
        <div className="flex items-center gap-3 px-4 py-6 mb-4">
          <img src="/logo.png" alt="EduNext logo" className="w-10 h-10 rounded-xl object-contain shadow-lg shadow-[#0F2B5B]/30 shrink-0" />
          <div>
            <h1 className="text-headline-md text-[#0F2B5B]">EduNext</h1>
            <p className="text-label-sm text-[#43474e]">Learning Portal</p>
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-1 overflow-y-auto pr-2">
          {NAV.map((n) =>
            n.label === active ? (
              <Link key={n.label} to={n.to} className="flex items-center gap-3 px-4 py-3 bg-[#0F2B5B] text-white rounded-xl font-bold text-label-md transition-all shadow-sm">
                <Icon name={n.icon} fill /><span>{n.label}</span>
              </Link>
            ) : (
              <Link key={n.label} to={n.to} className={idle}>
                <Icon name={n.icon} /><span>{n.label}</span>
              </Link>
            )
          )}
        </div>
        <div className="mt-auto pt-4 border-t border-[#c4c6cf]/30 flex flex-col gap-1">
          <Link to="#" className={idle}><Icon name="support_agent" /><span>Support</span></Link>
          <button onClick={logout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-label-md hover:translate-x-1 transition-transform duration-200 text-[#EF4444] hover:bg-[#ffdad6]/20 text-left">
            <Icon name="logout" /><span>Sign Out</span>
          </button>
        </div>
      </nav>

      {/* Main */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#f3f4f6]">
        <header className="bg-[#eceef0]/70 backdrop-blur-md shadow-sm flex justify-between items-center w-full px-10 py-2 z-50 sticky top-0 h-16 shrink-0">
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center bg-[#f2f4f6] rounded-full px-4 py-2 border border-[#c4c6cf]/50 focus-within:border-[#0F2B5B] focus-within:bg-white transition-colors w-64 lg:w-96">
              <Icon name="search" className="text-[#74777f] mr-2 text-[20px]" />
              <input className="bg-transparent border-none focus:ring-0 text-body-md w-full p-0 text-[#191c1e] placeholder:text-[#c4c6cf] outline-none" placeholder="Search courses, assignments..." type="text" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full text-[#43474e] hover:bg-[#1a365d]/20 transition-colors"><Icon name="notifications" /></button>
            <button className="p-2 rounded-full text-[#43474e] hover:bg-[#1a365d]/20 transition-colors hidden sm:block"><Icon name="help" /></button>
            <button className="p-2 rounded-full text-[#43474e] hover:bg-[#1a365d]/20 transition-colors hidden sm:block"><Icon name="settings" /></button>
            <div className="w-8 h-8 rounded-full bg-[#1a365d] text-[#86a0cd] flex items-center justify-center font-bold ml-2 cursor-pointer border-2 border-[#f7f9fb] shadow-sm text-sm">{initials}</div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-10">{children}</div>
      </main>
    </div>
  );
}
