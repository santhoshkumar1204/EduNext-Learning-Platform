import { Link, useNavigate } from "react-router-dom";
import Icon from "../components/Icon";
import { getCurrentUser, clearCurrentUser } from "../lib/database";

// Exact port of student_explorecommunity/code.html
const NAV: { title: string; items: { label: string; icon: string; to: string }[] }[] = [
  { title: "MENU", items: [
    { label: "Dashboard", icon: "grid_view", to: "/dashboard" },
    { label: "Courses", icon: "school", to: "/courses" },
    { label: "My Courses", icon: "library_books", to: "/my-courses" },
    { label: "Progress & Streaks", icon: "trending_up", to: "/progress" },
  ]},
  { title: "ACTIVITIES", items: [
    { label: "Quizzes", icon: "quiz", to: "/quizzes" },
    { label: "Assignments", icon: "assignment", to: "/assignments" },
    { label: "Peer Challenges", icon: "groups", to: "/challenges" },
    { label: "Streak Pot", icon: "local_fire_department", to: "/streak-pot" },
    { label: "My Apprenticeships", icon: "work_history", to: "/apprenticeships" },
    { label: "Leaderboard", icon: "leaderboard", to: "/leaderboard" },
  ]},
];
const RES_BEFORE = [
  { label: "Announcements", icon: "campaign", to: "/announcements" },
  { label: "Downloads", icon: "download", to: "/downloads" },
  { label: "Career Find", icon: "explore", to: "/career-find" },
];
const idle = "flex items-center gap-3 px-4 py-2.5 rounded-lg text-[#43474e] hover:bg-[#e6e8ea] transition-all";

export default function Community() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  function logout() { clearCurrentUser(); navigate("/"); }

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] flex h-screen overflow-hidden text-body-md">
      {/* Sidebar */}
      <nav className="hidden md:flex flex-col h-screen fixed left-0 top-0 border-r border-[#c4c6cf] bg-[#f2f4f6] overflow-y-auto w-64 z-40 shadow-sm p-4">
        <div className="flex items-center gap-3 px-2 mb-8"><img src="/logo.png" alt="EduNext logo" className="w-10 h-10 rounded-full object-contain shrink-0" /><div className="flex flex-col gap-1"><h1 className="text-headline-md font-bold text-[#0F2B5B]">EduNext</h1><p className="text-label-sm text-[#43474e]">Learning Portal</p></div></div>
        <div className="flex flex-col gap-2 flex-1">
          {NAV.map((sec) => (
            <div key={sec.title}>
              <p className="text-[10px] font-bold text-[#74777f] uppercase tracking-wider px-4 mb-1 mt-2">{sec.title}</p>
              {sec.items.map((n) => <Link key={n.label} to={n.to} className={idle}><Icon name={n.icon} className="text-[20px]" /><span className="text-label-md">{n.label}</span></Link>)}
            </div>
          ))}
          <p className="text-[10px] font-bold text-[#74777f] uppercase tracking-wider px-4 mt-4 mb-1">RESOURCES</p>
          {RES_BEFORE.map((n) => <Link key={n.label} to={n.to} className={idle}><Icon name={n.icon} className="text-[20px]" /><span className="text-label-md">{n.label}</span></Link>)}
          <Link to="/community" className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-[#0F2B5B] text-white font-bold shadow-sm"><Icon name="forum" className="text-[20px]" /><span className="text-label-md">Explore Community</span></Link>
          <Link to="#" className={idle}><Icon name="view_in_ar" className="text-[20px]" /><span className="text-label-md">Cardboard VR</span></Link>
        </div>
        <div className="mt-auto flex flex-col gap-2 border-t border-[#c4c6cf] pt-4">
          <Link to="#" className={idle}><Icon name="help" /><span className="text-label-md">Help</span></Link>
          <button onClick={logout} className={idle + " w-full text-left"}><Icon name="logout" /><span className="text-label-md">Logout</span></button>
          <button className="mt-4 bg-[#0F2B5B] text-white py-2 px-4 rounded-lg text-label-md hover:bg-[#1a365d] transition-colors w-full">Upgrade to Pro</button>
        </div>
      </nav>

      {/* Main */}
      <main className="flex-1 ml-0 md:ml-64 h-full overflow-y-auto relative">
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-[#f2f4f6] to-[#f7f9fb] -z-10 pointer-events-none"></div>
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-8 md:py-12">
          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <h1 className="text-headline-xl text-[#191c1e] tracking-tight">Community Discussions</h1>
              <p className="text-body-md text-[#43474e] mt-2 max-w-2xl">Ask questions, share knowledge, and learn together.</p>
            </div>
            <button className="bg-[#0F2B5B] text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 text-label-md shadow-[0_4px_14px_rgba(15,43,91,0.2)] hover:-translate-y-0.5 transition-all duration-200 shrink-0"><Icon name="add_circle" fill className="text-[20px]" /> Ask Question</button>
          </header>

          {/* Filters bar */}
          <div className="glass-panel rounded-xl p-4 mb-8 shadow-sm flex flex-col lg:flex-row gap-4 items-center justify-between border-[#c4c6cf]/50 z-10 relative">
            <div className="relative w-full lg:w-96 shrink-0"><Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-[#43474e]" /><input className="w-full bg-[#f7f9fb] text-[#191c1e] border border-[#c4c6cf] rounded-lg pl-10 pr-4 py-2.5 text-body-md focus:outline-none focus:border-[#0F2B5B] transition-colors" placeholder="Search discussions..." /></div>
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              {[["All Subjects", "Computer Science", "Mathematics", "Physics"], ["All Courses", "Intro to Programming", "Data Structures"], ["Status: All", "Open", "Answered"]].map((opts, i) => (
                <select key={i} className="bg-[#f7f9fb] border border-[#c4c6cf] text-[#43474e] text-label-md rounded-lg px-4 py-2.5 focus:border-[#0F2B5B] cursor-pointer outline-none">{opts.map((o) => <option key={o}>{o}</option>)}</select>
              ))}
              <div className="h-8 w-px bg-[#c4c6cf] hidden md:block mx-2"></div>
              <div className="flex items-center gap-2 bg-[#f2f4f6] rounded-lg p-1 border border-[#c4c6cf]/50">
                <button className="px-3 py-1.5 rounded-md bg-white text-[#0F2B5B] text-label-md shadow-sm">Latest</button>
                <button className="px-3 py-1.5 rounded-md text-[#43474e] text-label-md hover:bg-[#eceef0] transition-colors">Active</button>
                <button className="px-3 py-1.5 rounded-md text-[#43474e] text-label-md hover:bg-[#eceef0] transition-colors">Helpful</button>
              </div>
            </div>
          </div>

          {/* Feed */}
          <div className="flex flex-col gap-5 pb-16">
            {/* Card 1 Answered */}
            <article className="glass-panel rounded-xl p-6 hover:-translate-y-1 transition-all duration-300">
              <div className="flex justify-between items-start mb-3 gap-4">
                <h2 className="text-headline-md text-[#0F2B5B] font-semibold leading-tight">Implementing a custom Hook for WebSocket connections in React</h2>
                <span className="bg-[#DCFCE7] text-[#15803D] px-3 py-1 rounded-full text-label-sm flex items-center gap-1 shrink-0"><Icon name="check_circle" className="text-[14px]" /> Answered</span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4 text-[#43474e] text-label-sm">
                <div className="flex items-center gap-1.5"><div className="w-5 h-5 rounded-full bg-[#003374] text-[#6a9dff] flex items-center justify-center text-[10px] font-bold">AJ</div><span>Alice Johnson</span></div>
                <div className="flex items-center gap-1.5"><Icon name="book" className="text-[16px] text-[#74777f]" /> Advanced Frontend</div>
                <div className="flex items-center gap-1.5"><Icon name="category" className="text-[16px] text-[#74777f]" /> Computer Science</div>
                <div className="flex items-center gap-1.5"><Icon name="schedule" className="text-[16px] text-[#74777f]" /> 2 hours ago</div>
              </div>
              <p className="text-body-md text-[#191c1e]/90 line-clamp-2 mb-6">I'm trying to create a reusable React Hook to manage a WebSocket connection. I want it to automatically reconnect on disconnect and handle incoming messages via a callback. However, I'm running into stale closure issues inside my useEffect. How can I ensure the socket always has access to the latest state?</p>
              <div className="flex justify-between items-center border-t border-[#c4c6cf]/30 pt-4">
                <div className="flex gap-4 md:gap-6 text-[#43474e] text-label-sm">
                  <div className="flex items-center gap-1.5"><Icon name="forum" className="text-[18px]" /> 4 Replies</div>
                  <div className="flex items-center gap-1.5"><Icon name="thumb_up" className="text-[18px]" /> 12 Helpful</div>
                  <div className="flex items-center gap-1.5"><Icon name="visibility" className="text-[18px]" /> 85 Views</div>
                </div>
                <button className="text-[#0F2B5B] text-label-md hover:bg-[#0F2B5B]/5 px-4 py-2 rounded-lg transition-colors border border-transparent hover:border-[#0F2B5B]/20">View Discussion</button>
              </div>
            </article>

            {/* Card 2 You */}
            <article className="glass-panel rounded-xl p-6 hover:-translate-y-1 transition-all duration-300 ring-1 ring-[#0F2B5B]/10">
              <div className="flex justify-between items-start mb-3 gap-4">
                <h2 className="text-headline-md text-[#0F2B5B] font-semibold leading-tight">PostgreSQL query optimization: Indexing JSONB arrays</h2>
                <span className="bg-[#1a365d] text-[#86a0cd] px-3 py-1 rounded-full text-label-sm flex items-center gap-1 shrink-0"><Icon name="pending" className="text-[14px]" /> Open</span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4 text-[#43474e] text-label-sm">
                <div className="flex items-center gap-1.5"><div className="w-5 h-5 rounded-full bg-[#0F2B5B] text-white flex items-center justify-center text-[10px] font-bold">{(user?.name || "S").charAt(0)}</div><span className="font-bold text-[#0F2B5B]">{user?.name?.split(" ")[0] || "Santhosh"} (You)</span></div>
                <div className="flex items-center gap-1.5"><Icon name="book" className="text-[16px] text-[#74777f]" /> Database Systems</div>
                <div className="flex items-center gap-1.5"><Icon name="category" className="text-[16px] text-[#74777f]" /> Data Engineering</div>
                <div className="flex items-center gap-1.5"><Icon name="schedule" className="text-[16px] text-[#74777f]" /> 5 hours ago</div>
              </div>
              <p className="text-body-md text-[#191c1e]/90 line-clamp-2 mb-6">I have a table storing user configurations in a JSONB column. One of the keys contains an array of string tags. I need to frequently query rows where this array contains a specific tag. I've tried a GIN index, but the query planner still does a sequential scan. What am I missing in the index definition or query syntax?</p>
              <div className="flex justify-between items-center border-t border-[#c4c6cf]/30 pt-4">
                <div className="flex gap-4 md:gap-6 text-[#43474e] text-label-sm">
                  <div className="flex items-center gap-1.5"><Icon name="forum" className="text-[18px]" /> 1 Reply</div>
                  <div className="flex items-center gap-1.5"><Icon name="thumb_up" className="text-[18px]" /> 2 Helpful</div>
                  <div className="flex items-center gap-1.5"><Icon name="visibility" className="text-[18px]" /> 42 Views</div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-[#43474e] hover:text-[#0F2B5B] hover:bg-[#0F2B5B]/5 rounded-full transition-colors"><Icon name="edit" className="text-[20px]" /></button>
                  <button className="p-2 text-[#43474e] hover:text-[#EF4444] hover:bg-[#EF4444]/5 rounded-full transition-colors"><Icon name="delete" className="text-[20px]" /></button>
                  <button className="bg-[#f7f9fb] border border-[#c4c6cf] text-[#191c1e] text-label-md px-4 py-2 rounded-lg hover:bg-[#eceef0] transition-colors ml-2 shadow-sm">View Discussion</button>
                </div>
              </div>
            </article>

            {/* Card 3 Open */}
            <article className="glass-panel rounded-xl p-6 hover:-translate-y-1 transition-all duration-300">
              <div className="flex justify-between items-start mb-3 gap-4">
                <h2 className="text-headline-md text-[#0F2B5B] font-semibold leading-tight">Understanding backpropagation in deep neural networks</h2>
                <span className="bg-[#1a365d] text-[#86a0cd] px-3 py-1 rounded-full text-label-sm flex items-center gap-1 shrink-0"><Icon name="pending" className="text-[14px]" /> Open</span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4 text-[#43474e] text-label-sm">
                <div className="flex items-center gap-1.5"><div className="w-5 h-5 rounded-full bg-[#455f88] text-white flex items-center justify-center text-[10px] font-bold">MR</div><span>Marcus Reed</span></div>
                <div className="flex items-center gap-1.5"><Icon name="book" className="text-[16px] text-[#74777f]" /> Intro to AI</div>
                <div className="flex items-center gap-1.5"><Icon name="category" className="text-[16px] text-[#74777f]" /> Machine Learning</div>
                <div className="flex items-center gap-1.5"><Icon name="schedule" className="text-[16px] text-[#74777f]" /> 1 day ago</div>
              </div>
              <p className="text-body-md text-[#191c1e]/90 line-clamp-2 mb-6">The chain rule makes sense mathematically, but I'm struggling to visualize how the error gradients flow backwards through multiple hidden layers in a practical implementation. Does anyone have a good mental model or a simplified code example of updating weights in a 2-layer network?</p>
              <div className="flex justify-between items-center border-t border-[#c4c6cf]/30 pt-4">
                <div className="flex gap-4 md:gap-6 text-[#43474e] text-label-sm">
                  <div className="flex items-center gap-1.5"><Icon name="forum" className="text-[18px]" /> 8 Replies</div>
                  <div className="flex items-center gap-1.5"><Icon name="thumb_up" className="text-[18px]" /> 34 Helpful</div>
                  <div className="flex items-center gap-1.5"><Icon name="visibility" className="text-[18px]" /> 210 Views</div>
                </div>
                <button className="text-[#0F2B5B] text-label-md hover:bg-[#0F2B5B]/5 px-4 py-2 rounded-lg transition-colors border border-transparent hover:border-[#0F2B5B]/20">View Discussion</button>
              </div>
            </article>
          </div>

          <div className="flex justify-center mt-4"><button className="bg-[#f7f9fb] border border-[#c4c6cf] text-[#191c1e] text-label-md px-6 py-2.5 rounded-full shadow-sm hover:bg-[#eceef0] transition-colors flex items-center gap-2">Load More Discussions <Icon name="expand_more" className="text-[18px]" /></button></div>
        </div>
      </main>
    </div>
  );
}
