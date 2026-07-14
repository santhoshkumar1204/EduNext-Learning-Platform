import { Link, useNavigate } from "react-router-dom";
import Icon from "../components/Icon";
import { getCurrentUser, clearCurrentUser } from "../lib/database";
import { avatarUrl } from "../lib/images";

// Exact port of student_downloads/code.html
const SECTIONS: { title: string; items: { label: string; icon: string; to: string }[] }[] = [
  { title: "Learning", items: [
    { label: "Dashboard", icon: "dashboard", to: "/dashboard" },
    { label: "Courses", icon: "school", to: "/courses" },
    { label: "My Courses", icon: "local_library", to: "/my-courses" },
    { label: "Progress & Streaks", icon: "trending_up", to: "/progress" },
  ]},
  { title: "Assessments", items: [
    { label: "Quizzes", icon: "quiz", to: "/quizzes" },
    { label: "Assignments", icon: "assignment", to: "/assignments" },
    { label: "Peer Challenges", icon: "groups", to: "/challenges" },
  ]},
  { title: "Engagement", items: [
    { label: "Streak Pot", icon: "workspace_premium", to: "/streak-pot" },
    { label: "My Apprenticeships", icon: "work", to: "/apprenticeships" },
    { label: "Leaderboard", icon: "leaderboard", to: "/leaderboard" },
  ]},
  { title: "Resources", items: [
    { label: "Announcements", icon: "campaign", to: "/announcements" },
  ]},
];
const RES_AFTER = [
  { label: "Career Find", icon: "explore", to: "/career-find" },
  { label: "Explore Community", icon: "forum", to: "/community" },
  { label: "Cardboard VR", icon: "view_in_ar", to: "#" },
];
const idle = "flex items-center gap-3 px-3 py-2.5 text-[#43474e] hover:bg-[#e0e3e5] rounded-xl group transition-all";

export default function Downloads() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  function logout() { clearCurrentUser(); navigate("/"); }

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] text-body-md antialiased overflow-hidden h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <nav className="hidden md:flex flex-col h-screen w-64 bg-[#f2f4f6] border-r border-[#e6e8ea] py-2 px-4 gap-2 overflow-y-auto flex-shrink-0 z-40 shadow-md">
        <div className="px-2 py-4 mb-4 flex flex-col items-center border-b border-[#e0e3e5]/50">
          <div className="w-16 h-16 rounded-full overflow-hidden mb-3 shadow-inner"><img alt="" className="w-full h-full object-cover" src={avatarUrl(user?.name || "Simran Kaur")} /></div>
          <div className="text-center">
            <h2 className="text-headline-md text-[#0F2B5B] truncate w-48 px-2">{user?.name || "Simran Kaur"}</h2>
            <p className="text-label-md text-[#43474e] mt-1">Student</p>
          </div>
        </div>
        <div className="flex-1 space-y-1">
          {SECTIONS.map((sec) => (
            <div key={sec.title}>
              <p className="px-3 text-xs font-semibold text-[#43474e] uppercase tracking-wider mb-2 mt-4">{sec.title}</p>
              {sec.items.map((n) => (
                <Link key={n.label} to={n.to} className={idle}><Icon name={n.icon} className="text-[20px] group-hover:text-[#0F2B5B]" /><span className="text-label-md truncate">{n.label}</span></Link>
              ))}
            </div>
          ))}
          {/* Active: Downloads */}
          <Link to="/downloads" className="flex items-center gap-3 px-3 py-2.5 bg-[#0F2B5B] text-white rounded-xl font-bold shadow-sm"><Icon name="download" fill className="text-[20px]" /><span className="text-label-md truncate">Downloads</span></Link>
          {RES_AFTER.map((n) => (
            <Link key={n.label} to={n.to} className={idle}><Icon name={n.icon} className="text-[20px] group-hover:text-[#0F2B5B]" /><span className="text-label-md truncate">{n.label}</span></Link>
          ))}
        </div>
        <div className="mt-auto pt-4 border-t border-[#e0e3e5]/50 space-y-1 mb-2">
          <Link to="#" className={idle}><Icon name="support_agent" className="text-[20px]" /><span className="text-label-md">Support</span></Link>
          <button onClick={logout} className={idle + " w-full text-left"}><Icon name="logout" className="text-[20px]" /><span className="text-label-md">Sign Out</span></button>
        </div>
      </nav>

      {/* Main */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="hidden md:flex justify-between items-center w-full px-10 py-2 z-30 bg-[#f7f9fb]/80 backdrop-blur-xl shadow-sm sticky top-0 h-16 flex-shrink-0 border-b border-[#eceef0]">
          <div className="flex items-center gap-4">
            <button className="text-[#43474e] hover:bg-[#e0e3e5] p-2 rounded-full"><Icon name="menu" /></button>
            <div className="h-6 w-px bg-[#e0e3e5] mx-1"></div>
            <div className="flex items-center gap-2 text-[#43474e] text-sm"><Link to="/dashboard" className="hover:text-[#0F2B5B]">Home</Link><Icon name="chevron_right" className="text-sm" /><span className="font-medium text-[#0F2B5B]">Downloads</span></div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-64"><Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-[#43474e] text-lg" /><input className="w-full pl-10 pr-4 py-1.5 bg-[#e0e3e5] border-transparent focus:bg-white rounded-full text-sm outline-none" placeholder="Search EduNext..." /></div>
            <button className="text-[#43474e] hover:bg-[#1a365d]/20 p-2 rounded-full relative"><Icon name="notifications" /><span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#EF4444] rounded-full border border-[#f7f9fb]"></span></button>
            <Link to="/settings" className="text-[#43474e] hover:bg-[#1a365d]/20 p-2 rounded-full"><Icon name="settings" /></Link>
            <button className="text-[#43474e] hover:bg-[#1a365d]/20 p-2 rounded-full"><Icon name="help" /></button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-10 space-y-6 pb-24 relative z-10">
          <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-[#0F2B5B]/10 via-[#1a365d]/5 to-transparent -z-10 pointer-events-none"></div>

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-[#DBEAFE] text-[#2563EB] flex items-center justify-center shadow-sm"><Icon name="cloud_download" fill /></div>
                <h1 className="text-headline-xl text-[#0F2B5B]">Downloads</h1>
              </div>
              <p className="text-body-lg text-[#43474e] max-w-2xl">Access your downloaded resources anytime, even offline. Keep your learning uninterrupted.</p>
            </div>
            <button className="px-4 py-2 border border-[#c4c6cf] text-[#0F2B5B] rounded-lg text-label-md hover:bg-[#e0e3e5] transition-colors flex items-center gap-2 bg-[#f7f9fb]"><Icon name="sync" className="text-[18px]" /> Sync Now</button>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-card rounded-2xl p-5 flex flex-col justify-between items-start"><div className="w-8 h-8 rounded-full bg-[#0F2B5B]/10 text-[#0F2B5B] flex items-center justify-center mb-4"><Icon name="description" className="text-[18px]" /></div><div><p className="text-headline-md text-[#191c1e]">42</p><p className="text-label-sm text-[#43474e] mt-1">Files &amp; Documents</p></div></div>
            <div className="glass-card rounded-2xl p-5 flex flex-col justify-between items-start"><div className="w-8 h-8 rounded-full bg-[#0F2B5B]/10 text-[#0F2B5B] flex items-center justify-center mb-4"><Icon name="play_circle" className="text-[18px]" /></div><div><p className="text-headline-md text-[#191c1e]">8</p><p className="text-label-sm text-[#43474e] mt-1">Video Lectures</p></div></div>
            <div className="glass-card rounded-2xl p-5 flex flex-col justify-between items-start"><div className="w-8 h-8 rounded-full bg-[#0F2B5B]/10 text-[#0F2B5B] flex items-center justify-center mb-4"><Icon name="storage" className="text-[18px]" /></div><div><p className="text-headline-md text-[#191c1e]">1.8 <span className="text-lg font-normal text-[#43474e]">GB</span></p><div className="w-full bg-[#e0e3e5] h-1.5 rounded-full mt-2 overflow-hidden"><div className="bg-[#0F2B5B] h-full w-[45%] rounded-full"></div></div><p className="text-[10px] text-[#43474e] mt-1">Used of 4.0 GB</p></div></div>
            <div className="glass-card rounded-2xl p-5 flex flex-col justify-between items-start bg-gradient-to-br from-[#f7f9fb] to-[#22C55E]/10 border-[#22C55E]/20"><div className="w-8 h-8 rounded-full bg-[#22C55E] text-white flex items-center justify-center mb-4"><Icon name="check_circle" className="text-[18px]" /></div><div><p className="text-label-md text-[#191c1e]">System Ready</p><p className="text-label-sm text-[#43474e] mt-1">Last download: Today, 09:41 AM</p></div></div>
          </div>

          {/* Main grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Filter bar */}
              <div className="glass-card rounded-2xl p-4 shadow-sm">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1"><Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-[#43474e] text-lg" /><input className="w-full pl-10 pr-4 py-2.5 bg-[#f2f4f6] border border-[#c4c6cf] focus:bg-white rounded-xl text-body-md outline-none" placeholder="Search downloaded content..." /></div>
                  <button className="px-4 py-2 border border-[#c4c6cf] text-[#191c1e] rounded-xl text-label-md hover:bg-[#e0e3e5] transition-colors flex items-center justify-center gap-2 bg-[#f7f9fb]"><Icon name="sort" className="text-[18px]" /> Sort</button>
                </div>
                <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
                  <button className="px-4 py-1.5 bg-[#0F2B5B] text-white rounded-full text-label-sm whitespace-nowrap shadow-sm">All</button>
                  {["Documents", "Videos", "Assignments", "Course Materials"].map((f) => <button key={f} className="px-4 py-1.5 bg-[#e6e8ea] text-[#191c1e] rounded-full text-label-sm whitespace-nowrap hover:bg-[#e0e3e5] transition-colors">{f}</button>)}
                </div>
              </div>

              {/* Resource items */}
              <div className="space-y-4">
                {/* PDF */}
                <div className="glass-card rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center border border-[#c4c6cf]/30">
                  <div className="w-12 h-12 rounded-xl bg-[#ffdad6]/50 text-[#93000a] flex items-center justify-center flex-shrink-0"><Icon name="picture_as_pdf" fill /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1"><h3 className="text-label-md text-[#191c1e] truncate">Machine Learning Notes - Chapter 4</h3><span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-[#DCFCE7] text-[#15803D]"><Icon name="offline_pin" className="text-[12px] mr-1" /> Offline</span></div>
                    <p className="text-[13px] text-[#43474e] truncate">From: Fundamentals of Machine Learning CS401</p>
                    <div className="flex items-center gap-3 mt-2 text-[12px] text-[#74777f]"><span className="flex items-center gap-1"><Icon name="insert_drive_file" className="text-[14px]" /> 2.4 MB</span><span>•</span><span>Downloaded Oct 24</span></div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto mt-3 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#e0e3e5]">
                    <button className="flex-1 sm:flex-none px-4 py-2 bg-[#0F2B5B] text-white rounded-lg text-label-sm hover:bg-[#0F2B5B]/90 transition-colors shadow-sm flex items-center justify-center gap-2"><Icon name="visibility" className="text-[16px]" /> View</button>
                    <button className="p-2 text-[#43474e] hover:bg-[#ffdad6] hover:text-[#EF4444] rounded-lg transition-colors"><Icon name="delete" className="text-[20px]" /></button>
                  </div>
                </div>
                {/* Video */}
                <div className="glass-card rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center border border-[#c4c6cf]/30">
                  <div className="w-12 h-12 rounded-xl bg-[#003374]/50 text-[#6a9dff] flex items-center justify-center flex-shrink-0 relative overflow-hidden"><Icon name="play_circle" fill className="z-10" /><div className="absolute inset-0 bg-[#0F2B5B]/10"></div></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1"><h3 className="text-label-md text-[#191c1e] truncate">Introduction to Game Theory Concepts</h3><span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-[#DCFCE7] text-[#15803D]"><Icon name="offline_pin" className="text-[12px] mr-1" /> Offline</span></div>
                    <p className="text-[13px] text-[#43474e] truncate">From: Advanced Economics 301</p>
                    <div className="flex items-center gap-3 mt-2 text-[12px] text-[#74777f]"><span className="flex items-center gap-1"><Icon name="hd" className="text-[14px]" /> 720p</span><span>•</span><span className="flex items-center gap-1"><Icon name="schedule" className="text-[14px]" /> 45 mins</span><span>•</span><span>120 MB</span></div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto mt-3 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#e0e3e5]">
                    <button className="flex-1 sm:flex-none px-4 py-2 bg-[#0F2B5B] text-white rounded-lg text-label-sm hover:bg-[#0F2B5B]/90 transition-colors shadow-sm flex items-center justify-center gap-2"><Icon name="play_arrow" className="text-[16px]" /> Play Offline</button>
                    <button className="p-2 text-[#43474e] hover:bg-[#ffdad6] hover:text-[#EF4444] rounded-lg transition-colors"><Icon name="delete" className="text-[20px]" /></button>
                  </div>
                </div>
                {/* Zip (update avail) */}
                <div className="glass-card rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center border border-[#c4c6cf]/30 opacity-75">
                  <div className="w-12 h-12 rounded-xl bg-[#e0e3e5] text-[#43474e] flex items-center justify-center flex-shrink-0"><Icon name="folder_zip" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1"><h3 className="text-label-md text-[#191c1e] truncate">Project Assets &amp; Code Templates</h3><span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-[#e0e3e5] text-[#43474e]"><Icon name="sync_problem" className="text-[12px] mr-1" /> Update Avail.</span></div>
                    <p className="text-[13px] text-[#43474e] truncate">From: Web Development Bootcamp</p>
                    <div className="flex items-center gap-3 mt-2 text-[12px] text-[#74777f]"><span className="flex items-center gap-1"><Icon name="folder" className="text-[14px]" /> 45.2 MB</span><span>•</span><span>Downloaded Sep 12</span></div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto mt-3 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#e0e3e5]">
                    <button className="flex-1 sm:flex-none px-4 py-2 border border-[#c4c6cf] text-[#191c1e] rounded-lg text-label-sm hover:bg-[#e0e3e5] transition-colors shadow-sm flex items-center justify-center gap-2 bg-[#f7f9fb]"><Icon name="sync" className="text-[16px]" /> Update</button>
                    <button className="p-2 text-[#43474e] hover:bg-[#ffdad6] hover:text-[#EF4444] rounded-lg transition-colors"><Icon name="delete" className="text-[20px]" /></button>
                  </div>
                </div>
              </div>

              <div className="flex justify-center mt-6"><button className="px-6 py-2 border border-[#c4c6cf] rounded-full text-[#43474e] text-sm hover:bg-[#e0e3e5] transition-colors bg-[#f7f9fb]/50 backdrop-blur-sm">Load More Files</button></div>
            </div>

            {/* Right widgets */}
            <div className="space-y-6">
              <div className="glass-card rounded-3xl p-6 border-t-4 border-t-[#0F2B5B] shadow-sm relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#0F2B5B]/5 rounded-full blur-2xl"></div>
                <h3 className="text-lg font-semibold text-[#191c1e] flex items-center gap-2 mb-6"><Icon name="pie_chart" className="text-[#0F2B5B]" /> Storage</h3>
                <div className="flex items-center justify-center mb-6">
                  <div className="relative w-32 h-32 flex items-center justify-center rounded-full bg-[#e0e3e5]">
                    <svg className="w-full h-full -rotate-90 absolute inset-0" viewBox="0 0 36 36">
                      <path className="text-[#e0e3e5]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="100, 100" strokeWidth="4"></path>
                      <path className="text-[#0F2B5B]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="45, 100" strokeWidth="4"></path>
                      <path className="text-[#0F2B5B]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="15, 100" strokeDashoffset="-45" strokeWidth="4"></path>
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center text-center"><span className="text-xl font-semibold text-[#191c1e]">45%</span><span className="text-[10px] text-[#43474e] uppercase tracking-wider">Used</span></div>
                  </div>
                </div>
                <div className="space-y-3 mb-6">
                  {[["Course Videos", "#0F2B5B", "1.2 GB"], ["Documents", "#0F2B5B", "0.6 GB"], ["Free Space", "#e0e3e5", "2.2 GB"]].map(([l, c, v]) => (
                    <div key={l} className="flex justify-between items-center text-sm"><div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full" style={{ background: c as string }}></span><span className="text-[#43474e]">{l}</span></div><span className="font-medium text-[#191c1e]">{v}</span></div>
                  ))}
                </div>
                <button className="w-full py-2.5 border border-[#c4c6cf] text-[#0F2B5B] rounded-xl text-sm hover:bg-[#1a365d]/10 transition-colors flex items-center justify-center gap-2 bg-[#f7f9fb]"><Icon name="settings" className="text-[18px]" /> Manage Storage Settings</button>
              </div>

              <div className="glass-card rounded-2xl p-5 bg-[#003374]/10 border-[#0F2B5B]/20">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#0F2B5B] text-white flex items-center justify-center flex-shrink-0 mt-1"><Icon name="lightbulb" className="text-[18px]" /></div>
                  <div><h4 className="text-label-md text-[#191c1e] mb-1">Smart Downloads Active</h4><p className="text-sm text-[#43474e]">EduNext automatically downloads next modules when connected to Wi-Fi. <a className="text-[#0F2B5B] hover:underline" href="#">Change preferences</a>.</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
