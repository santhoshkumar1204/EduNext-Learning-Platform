import { Link } from "react-router-dom";
import Icon from "../components/Icon";
import { getCurrentUser } from "../lib/database";
import { avatarUrl } from "../lib/images";

// Exact port of student_announcements/code.html
const NAV = [
  { label: "Dashboard", icon: "dashboard", to: "/dashboard" },
  { label: "Courses", icon: "school", to: "/courses" },
  { label: "My Courses", icon: "local_library", to: "/my-courses" },
  { label: "Progress & Streaks", icon: "trending_up", to: "/progress" },
  { label: "Quizzes", icon: "quiz", to: "/quizzes" },
  { label: "Assignments", icon: "assignment", to: "/assignments" },
  { label: "Peer Challenges", icon: "groups", to: "/challenges" },
  { label: "Streak Pot", icon: "local_fire_department", to: "/streak-pot" },
  { label: "My Apprenticeships", icon: "work_outline", to: "/apprenticeships" },
  { label: "Leaderboard", icon: "leaderboard", to: "/leaderboard" },
];
const NAV2 = [
  { label: "Downloads", icon: "download", to: "/downloads" },
  { label: "Career Find", icon: "explore", to: "/career-find" },
  { label: "Explore Community", icon: "forum", to: "/community" },
  { label: "Cardboard VR", icon: "view_in_ar", to: "#" },
];

const itemCls =
  "flex items-center gap-3 px-4 py-3 rounded-xl text-[#43474e] hover:bg-[#e0e3e5] transition-all duration-200 active:scale-95 text-label-md";

export default function Announcements() {
  const user = getCurrentUser();

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] text-body-md antialiased flex selection:bg-[#d6e3ff] selection:text-[#001b3c] min-h-screen">
      {/* SideNavBar */}
      <aside className="flex flex-col h-screen fixed left-0 top-0 py-2 px-4 overflow-y-auto w-72 bg-[#f2f4f6] shadow-none z-50">
        <div className="flex items-center gap-4 px-4 py-6 mb-4">
          <img src="/logo.png" alt="EduNext logo" className="w-10 h-10 rounded-xl object-contain shadow-sm shrink-0" />
          <div>
            <h2 className="text-headline-md font-black text-[#0F2B5B]">EduNext</h2>
            <p className="text-label-sm text-[#43474e]">Learning Portal</p>
          </div>
        </div>
        <nav className="flex flex-col gap-1 w-full pb-8">
          {NAV.map((n) => (
            <Link key={n.label} to={n.to} className={itemCls}>
              <Icon name={n.icon} /> {n.label}
            </Link>
          ))}
          {/* ACTIVE ITEM */}
          <Link to="/announcements" className="flex items-center gap-3 px-4 py-3 bg-[#0F2B5B] text-white rounded-xl text-label-md transition-all duration-200 active:scale-95">
            <Icon name="campaign" fill /> Announcements
          </Link>
          {NAV2.map((n) => (
            <Link key={n.label} to={n.to} className={itemCls}>
              <Icon name={n.icon} /> {n.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content Canvas */}
      <main className="ml-72 flex-1 min-h-screen flex flex-col relative w-[calc(100%-18rem)]">
        {/* TopNavBar */}
        <nav className="flex justify-between items-center w-full px-10 py-4 sticky top-0 bg-[#f7f9fb]/80 backdrop-blur-xl shadow-sm z-40 text-body-md">
          <div className="relative w-96 group">
            <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-[#74777f] group-focus-within:text-[#0F2B5B] transition-colors" />
            <input className="w-full bg-[#e0e3e5]/50 border-none rounded-full py-2.5 pl-12 pr-4 text-[#191c1e] focus:bg-white focus:ring-2 focus:ring-[#adc7f7] transition-all outline-none text-body-md placeholder:text-[#74777f] shadow-sm" placeholder="Search announcements, courses, or users..." type="text" />
          </div>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full bg-[#e0e3e5] hover:bg-[#1a365d]/20 transition-colors flex items-center justify-center text-[#43474e] active:opacity-80 relative">
              <Icon name="notifications" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#2563EB] shadow-[0_0_8px_rgba(37,99,235,0.5)] border border-[#f7f9fb]"></span>
            </button>
            <Link to="/settings" className="w-10 h-10 rounded-full bg-[#e0e3e5] hover:bg-[#1a365d]/20 transition-colors flex items-center justify-center text-[#43474e] active:opacity-80">
              <Icon name="settings" />
            </Link>
            <div className="h-8 w-px bg-[#c4c6cf] mx-2"></div>
            <button className="w-10 h-10 rounded-full overflow-hidden border-2 border-transparent hover:border-[#d6e3ff] transition-all active:opacity-80">
              <img alt="User Profile" className="w-full h-full object-cover" src={avatarUrl(user?.name || "Student")} />
            </button>
          </div>
        </nav>

        {/* Page Content */}
        <div className="p-10 space-y-10 max-w-[1280px] mx-auto w-full">
          {/* Header */}
          <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 border-b border-[#c4c6cf]/30 pb-8">
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <h1 className="text-headline-xl text-[#0F2B5B] tracking-tight">Announcements</h1>
                <span className="bg-[#2563EB]/10 text-[#2563EB] px-3 py-1 rounded-full text-label-md flex items-center gap-1.5 border border-[#2563EB]/30 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse"></span>
                  12 New Updates
                </span>
              </div>
              <p className="text-body-lg text-[#43474e] max-w-2xl leading-relaxed">Stay updated with course, assignment, community, and platform updates. Never miss a critical milestone in your learning journey.</p>
            </div>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-[#e0e3e5] hover:bg-[#e0e3e5] text-[#0F2B5B] text-label-md rounded-lg transition-all shadow-sm border border-[#c4c6cf]/20 group">
              <Icon name="done_all" className="text-[20px] group-hover:scale-110 transition-transform" /> Mark All Read
            </button>
          </header>

          {/* Quick Summary (Bento) */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "mark_email_unread", n: "3", l: "Unread", box: "bg-[#2563EB]/10 text-[#2563EB]" },
              { icon: "assignment", n: "2", l: "Assignments Due", box: "bg-[#d6e3ff]/30 text-[#001b3c]" },
              { icon: "event", n: "1", l: "Upcoming Event", box: "bg-[#d8e2ff]/40 text-[#001a42]" },
              { icon: "forum", n: "5", l: "Community Mentions", box: "bg-[#455f88]/10 text-[#0F2B5B]" },
            ].map((c) => (
              <div key={c.l} className="glass-card rounded-xl p-5 shadow-sm hover:-translate-y-1 transition-all duration-300 flex items-center gap-4 group">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform ${c.box}`}>
                  <Icon name={c.icon} fill />
                </div>
                <div>
                  <div className="text-headline-md text-[#0F2B5B] leading-none mb-1">{c.n}</div>
                  <div className="text-label-sm text-[#43474e] uppercase tracking-wider">{c.l}</div>
                </div>
              </div>
            ))}
          </section>

          {/* Filters & Feed */}
          <section className="flex flex-col gap-6">
            <div className="flex gap-3 overflow-x-auto pb-2">
              <button className="px-4 py-2 rounded-full bg-[#0F2B5B] text-white text-label-md whitespace-nowrap shadow-sm">All Updates</button>
              {["Course Updates", "Assignments", "Community", "Events", "System"].map((f) => (
                <button key={f} className="px-4 py-2 rounded-full bg-[#e0e3e5] hover:bg-[#e0e3e5] text-[#191c1e] text-label-md whitespace-nowrap transition-colors border border-[#c4c6cf]/20">{f}</button>
              ))}
              <div className="w-px h-8 bg-[#c4c6cf]/40 mx-1"></div>
              <button className="px-4 py-2 rounded-full bg-[#2563EB]/10 hover:bg-[#2563EB]/20 text-[#2563EB] text-label-md whitespace-nowrap transition-colors border border-[#2563EB]/30 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]"></span> Unread
              </button>
            </div>

            <div className="space-y-4">
              {/* Item 1: Unread Assignment */}
              <article className="bg-white rounded-xl border border-[#c4c6cf]/30 border-l-[6px] border-l-[#2563EB] shadow-sm hover:shadow-md transition-all duration-300 p-6 relative group overflow-hidden">
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#2563EB]/5 to-transparent pointer-events-none"></div>
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="flex items-center gap-3">
                    <span className="bg-[#d6e3ff]/50 text-[#001b3c] px-3 py-1 rounded-md text-label-sm border border-[#d6e3ff] flex items-center gap-1.5"><Icon name="assignment" className="text-[14px]" /> Assignment</span>
                    <span className="text-[#43474e] text-label-sm flex items-center gap-1"><Icon name="schedule" className="text-[14px]" /> 2 hours ago</span>
                  </div>
                  <button className="text-[#74777f] hover:text-[#0F2B5B] transition-colors p-1 rounded-full hover:bg-[#e0e3e5]"><Icon name="more_horiz" /></button>
                </div>
                <div className="relative z-10">
                  <h3 className="text-headline-md text-[#0F2B5B] mb-2 group-hover:text-[#1a365d] transition-colors">New Assignment Posted: Machine Learning Fundamentals</h3>
                  <p className="text-body-md text-[#43474e] mb-6 flex items-center gap-2">
                    <span className="font-medium text-[#191c1e]">Dr. Amarjeet Kaur</span>
                    <span className="w-1 h-1 rounded-full bg-[#c4c6cf]"></span>
                    <span className="text-[#EF4444] font-medium bg-[#ffdad6]/50 px-2 py-0.5 rounded text-sm">Due in 5 Days</span>
                  </p>
                  <div className="flex items-center gap-3">
                    <Link to="/assignments" className="bg-[#0F2B5B] hover:bg-[#1a365d] text-white px-5 py-2 rounded-lg text-label-md transition-colors shadow-sm flex items-center gap-2">View Assignment <Icon name="arrow_forward" className="text-[18px]" /></Link>
                    <button className="bg-transparent hover:bg-[#e0e3e5] text-[#0F2B5B] px-5 py-2 rounded-lg text-label-md transition-colors">Mark as Read</button>
                  </div>
                </div>
              </article>

              {/* Item 2: Unread Course Material */}
              <article className="bg-white rounded-xl border border-[#c4c6cf]/30 border-l-[6px] border-l-[#2563EB] shadow-sm hover:shadow-md transition-all duration-300 p-6 relative group overflow-hidden">
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#2563EB]/5 to-transparent pointer-events-none"></div>
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="flex items-center gap-3">
                    <span className="bg-[#d8e2ff]/50 text-[#001a42] px-3 py-1 rounded-md text-label-sm border border-[#d8e2ff] flex items-center gap-1.5"><Icon name="menu_book" className="text-[14px]" /> Course Update</span>
                    <span className="text-[#43474e] text-label-sm flex items-center gap-1"><Icon name="schedule" className="text-[14px]" /> 5 hours ago</span>
                  </div>
                  <button className="text-[#74777f] hover:text-[#0F2B5B] transition-colors p-1 rounded-full hover:bg-[#e0e3e5]"><Icon name="more_horiz" /></button>
                </div>
                <div className="relative z-10">
                  <h3 className="text-headline-md text-[#0F2B5B] mb-2 group-hover:text-[#1a365d] transition-colors">Course Material Updated: Cyber Security Essentials</h3>
                  <p className="text-body-md text-[#43474e] mb-6 flex items-center gap-2">
                    <span className="font-medium text-[#191c1e]">Prof. Sarah Jenkins</span>
                    <span className="w-1 h-1 rounded-full bg-[#c4c6cf]"></span>
                    <span className="text-[#0F2B5B] font-medium bg-[#d6e3ff]/30 px-2 py-0.5 rounded text-sm">New Notes Added - Module 4</span>
                  </p>
                  <div className="flex items-center gap-3">
                    <Link to="/my-courses" className="bg-[#eceef0] hover:bg-[#e0e3e5] border border-[#c4c6cf]/50 text-[#0F2B5B] px-5 py-2 rounded-lg text-label-md transition-colors shadow-sm flex items-center gap-2">Open Course <Icon name="open_in_new" className="text-[18px]" /></Link>
                  </div>
                </div>
              </article>

              {/* Item 3: Read Community Mention */}
              <article className="bg-[#f7f9fb] rounded-xl border border-[#e0e3e5] shadow-sm p-6 opacity-80 hover:opacity-100 transition-opacity">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <span className="bg-[#e6e8ea] text-[#191c1e] px-3 py-1 rounded-md text-label-sm border border-[#c4c6cf]/30 flex items-center gap-1.5"><Icon name="forum" className="text-[14px]" /> Community</span>
                    <span className="text-[#43474e] text-label-sm flex items-center gap-1"><Icon name="schedule" className="text-[14px]" /> Yesterday, 2:30 PM</span>
                  </div>
                </div>
                <h3 className="text-headline-md text-[#191c1e] mb-2">Community Discussion Trending: Strategic Thinking in Game Theory</h3>
                <p className="text-body-md text-[#43474e] mb-6 flex items-center gap-2">
                  <span className="bg-[#e0e3e5] px-2 py-0.5 rounded text-sm">24 New Replies</span>
                  <span className="w-1 h-1 rounded-full bg-[#c4c6cf]"></span>
                  <span>Mentioned by @alex_student</span>
                </p>
                <div className="flex items-center gap-3">
                  <Link to="/community" className="bg-[#eceef0] hover:bg-[#e0e3e5] border border-[#c4c6cf]/50 text-[#0F2B5B] px-5 py-2 rounded-lg text-label-md transition-colors shadow-sm">Join Discussion</Link>
                </div>
              </article>

              {/* Item 4: Upcoming Live Session */}
              <article className="bg-white rounded-xl border border-[#c4c6cf]/30 shadow-sm hover:shadow-md transition-shadow p-6 group">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <span className="bg-[#003374]/10 text-[#003374] px-3 py-1 rounded-md text-label-sm border border-[#003374]/30 flex items-center gap-1.5"><Icon name="videocam" className="text-[14px]" /> Event</span>
                    <span className="text-[#43474e] text-label-sm flex items-center gap-1"><Icon name="schedule" className="text-[14px]" /> Yesterday</span>
                  </div>
                </div>
                <h3 className="text-headline-md text-[#0F2B5B] mb-2 group-hover:text-[#1a365d] transition-colors">Upcoming Live Session: Advanced Data Analytics Q&amp;A</h3>
                <p className="text-body-md text-[#43474e] mb-6 flex items-center gap-2">
                  <Icon name="event_upcoming" className="text-[18px] text-[#003374]" />
                  <span className="font-medium text-[#003374]">Tomorrow, 5:00 PM EST</span>
                </p>
                <div className="flex items-center gap-3">
                  <button className="bg-[#0F2B5B] hover:bg-[#1a365d] text-white px-5 py-2 rounded-lg text-label-md transition-colors shadow-sm flex items-center gap-2">Register <Icon name="how_to_reg" className="text-[18px]" /></button>
                </div>
              </article>

              {/* Item 5: System Notification */}
              <article className="bg-[#f7f9fb] rounded-xl border border-[#e0e3e5] shadow-sm p-6 opacity-80 hover:opacity-100 transition-opacity">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <span className="bg-[#e0e3e5] text-[#191c1e] px-3 py-1 rounded-md text-label-sm border border-[#c4c6cf]/30 flex items-center gap-1.5"><Icon name="settings_system_daydream" className="text-[14px]" /> System</span>
                    <span className="text-[#43474e] text-label-sm flex items-center gap-1"><Icon name="schedule" className="text-[14px]" /> Oct 12</span>
                  </div>
                </div>
                <h3 className="text-headline-md text-[#191c1e] mb-2">Profile Completion Reminder</h3>
                <p className="text-body-md text-[#43474e] mb-6">Your profile is currently 85% complete. Adding your professional experience helps peers connect with you.</p>
                <div className="flex items-center gap-3">
                  <Link to="/profile" className="bg-[#eceef0] hover:bg-[#e0e3e5] border border-[#c4c6cf]/50 text-[#0F2B5B] px-5 py-2 rounded-lg text-label-md transition-colors shadow-sm">Complete Profile</Link>
                </div>
              </article>
            </div>
          </section>

          <div className="h-20"></div>
        </div>
      </main>
    </div>
  );
}
