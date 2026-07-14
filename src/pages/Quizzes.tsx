import { Link, useNavigate } from "react-router-dom";
import Icon from "../components/Icon";
import { getCurrentUser, clearCurrentUser } from "../lib/database";
import { COURSE_IMG } from "../lib/images";

// Exact port of the "My Quizzes" design (found in student_streakpot/code.html)
const NAV = [
  { label: "Dashboard", icon: "dashboard", to: "/dashboard" },
  { label: "Courses", icon: "school", to: "/courses" },
  { label: "My Courses", icon: "local_library", to: "/my-courses" },
  { label: "Progress & Streaks", icon: "trending_up", to: "/progress" },
  { label: "Quizzes", icon: "quiz", to: "/quizzes", active: true },
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
const idle = "flex items-center gap-3 px-4 py-3 text-[#43474e] hover:bg-[#e0e3e5] rounded-xl text-label-md transition-colors";

const quizCards = [
  { img: COURSE_IMG["Cyber Security"], qs: "10 Qs", time: "15 Mins", title: "Cyber Security Fundamentals", who: "Prof Michael Chen", topics: ["Authentication", "Network Security", "Threat Detection"] },
  { img: COURSE_IMG["Mathematics"], qs: "12 Qs", time: "20 Mins", title: "Game Theory Strategies", who: "Dr. Sarah Jenkins", topics: ["Nash Equilibrium", "Payoffs", "Dominance"] },
  { img: COURSE_IMG["Programming"], qs: "15 Qs", time: "10 Mins", title: "Python Fundamentals", who: "Prof. Alan Turing", topics: ["Loops", "Lists", "Logic"] },
];

export default function Quizzes() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  function logout() { clearCurrentUser(); navigate("/"); }

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] text-body-md flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col py-2 px-4 gap-2 overflow-y-auto bg-[#f2f4f6] h-screen w-64 shadow-md flex-shrink-0 z-40 border-r border-[#e0e3e5]">
        <div className="flex-1 py-4 flex flex-col gap-1">
          {NAV.map((n) => n.active ? (
            <Link key={n.label} to={n.to} className="flex items-center gap-3 px-4 py-3 bg-[#0F2B5B] text-white rounded-xl font-bold text-label-md shadow-sm"><Icon name={n.icon} fill /> {n.label}</Link>
          ) : (
            <Link key={n.label} to={n.to} className={idle}><Icon name={n.icon} /> {n.label}</Link>
          ))}
        </div>
        <div className="mt-auto pt-4 border-t border-[#e0e3e5] flex flex-col gap-1 pb-4">
          <Link to="#" className={idle}><Icon name="support_agent" /> Support</Link>
          <button onClick={logout} className={idle + " w-full text-left"}><Icon name="logout" /> Sign Out</button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto bg-white relative w-full">
        <div className="px-4 md:px-10 py-8 max-w-[1280px] mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <h1 className="text-headline-xl text-[#0F2B5B] mb-2">My Quizzes</h1>
              <p className="text-body-lg text-[#43474e] max-w-2xl">Practice, revise, and strengthen concepts through adaptive assessments.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="bg-white border border-[#c4c6cf] text-[#0F2B5B] text-label-md py-3 px-6 rounded-full hover:bg-[#eceef0] transition-colors shadow-sm flex items-center justify-center gap-2 whitespace-nowrap"><Icon name="auto_awesome" className="text-[20px]" /> Generate Revision Quiz</button>
              <button className="bg-gradient-to-b from-[#0F2B5B] to-[#1a365d] text-white text-label-md py-3 px-6 rounded-full hover:shadow-md hover:scale-[1.02] transition-all flex items-center justify-center gap-2 whitespace-nowrap"><Icon name="bolt" className="text-[20px]" /> Take Quick Practice</button>
            </div>
          </div>

          {/* Summary 6 stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
            {[["task_alt", "Quizzes Completed", "42"], ["analytics", "Avg Score", "87%"], ["emoji_events", "Best Score", "95%"], ["history", "Total Attempts", "128"]].map(([icon, label, val]) => (
              <div key={label} className="glass-card p-4 rounded-xl flex flex-col justify-between h-full"><div className="flex items-center justify-between mb-2"><Icon name={icon} className="text-[#0F2B5B]/60" /></div><div><p className="text-label-sm text-[#43474e] mb-1">{label}</p><p className="text-headline-lg text-[#0F2B5B]">{val}</p></div></div>
            ))}
            <div className="glass-card p-4 rounded-xl flex flex-col justify-between h-full relative overflow-hidden"><div className="absolute -right-4 -top-4 w-16 h-16 bg-[#22C55E]/10 rounded-full blur-xl"></div><div className="flex items-center justify-between mb-2 relative z-10"><Icon name="favorite" className="text-[#15803D]" /></div><div className="relative z-10"><p className="text-label-sm text-[#43474e] mb-1">Learning Health</p><div className="flex items-center gap-2"><p className="text-headline-md text-[#0F2B5B]">Good</p><span className="bg-[#DCFCE7] text-[#15803D] text-xs px-2 py-0.5 rounded-full font-semibold">Healthy</span></div></div></div>
            <div className="glass-card p-4 rounded-xl flex flex-col justify-between h-full relative overflow-hidden"><div className="absolute -right-4 -top-4 w-16 h-16 bg-[#EF4444]/10 rounded-full blur-xl"></div><div className="flex items-center justify-between mb-2 relative z-10"><Icon name="warning" className="text-[#EF4444]" /></div><div className="relative z-10"><p className="text-label-sm text-[#43474e] mb-1">Weak Concepts</p><div className="flex items-center gap-2"><p className="text-headline-md text-[#EF4444]">2</p><span className="bg-[#ffdad6] text-[#93000a] text-xs px-2 py-0.5 rounded-full font-semibold">Needs Review</span></div></div></div>
          </div>

          {/* Subject filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-[#e0e3e5]/50">
            <button className="bg-[#0F2B5B] text-white text-label-md py-2 px-4 rounded-full whitespace-nowrap flex-shrink-0 shadow-sm">All Subjects</button>
            {["Programming", "Machine Learning", "Cyber Security", "Data Analytics", "Game Theory", "Mathematics"].map((f) => <button key={f} className="bg-[#f7f9fb] text-[#191c1e] border border-[#c4c6cf] hover:bg-[#eceef0] text-label-md py-2 px-4 rounded-full whitespace-nowrap flex-shrink-0 transition-colors">{f}</button>)}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Left */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              <section>
                <div className="flex items-center justify-between mb-6"><h2 className="text-headline-md text-[#0F2B5B]">Available Quizzes</h2><button className="text-[#0F2B5B] text-label-md hover:underline flex items-center gap-1">View All <Icon name="arrow_forward" className="text-[18px]" /></button></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {quizCards.map((q) => (
                    <Link to="/quiz/1" key={q.title} className="glass-card rounded-2xl overflow-hidden flex flex-col group cursor-pointer h-full border border-[#e0e3e5]">
                      <div className="h-40 w-full relative overflow-hidden bg-[#e0e3e5]">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                        <img alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={q.img} />
                        <div className="absolute bottom-3 left-4 z-20 flex gap-2"><span className="bg-white/90 backdrop-blur-sm text-[#0F2B5B] text-[10px] px-2 py-1 rounded-md uppercase tracking-wider font-bold">{q.qs}</span><span className="bg-white/90 backdrop-blur-sm text-[#0F2B5B] text-[10px] px-2 py-1 rounded-md uppercase tracking-wider font-bold flex items-center gap-1"><Icon name="schedule" className="text-[12px]" /> {q.time}</span></div>
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="text-[20px] font-semibold leading-tight text-[#0F2B5B] mb-2 group-hover:text-[#003374] transition-colors">{q.title}</h3>
                        <p className="text-[14px] text-[#43474e] mb-4 flex items-center gap-1"><Icon name="person" className="text-[16px]" /> {q.who}</p>
                        <div className="mt-auto"><p className="text-label-sm text-[#74777f] mb-2">Topics Covered:</p><div className="flex flex-wrap gap-2">{q.topics.map((t) => <span key={t} className="bg-[#eceef0] text-[#191c1e] text-xs px-2.5 py-1 rounded-full">{t}</span>)}</div></div>
                      </div>
                    </Link>
                  ))}
                  <div className="glass-card rounded-2xl p-6 border-dashed border-2 border-[#c4c6cf] flex flex-col items-center justify-center text-center bg-[#f2f4f6]/30 h-full min-h-[280px]">
                    <Icon name="add_circle" className="text-[48px] text-[#74777f] mb-4" />
                    <h3 className="text-[18px] font-semibold text-[#0F2B5B] mb-2">Want more practice?</h3>
                    <p className="text-[14px] text-[#43474e] mb-4 max-w-[200px]">Unlock additional premium quizzes in the course catalog.</p>
                    <Link to="/courses" className="bg-[#1a365d] text-[#86a0cd] text-label-md px-4 py-2 rounded-full hover:bg-[#0F2B5B] hover:text-white transition-colors">Browse Catalog</Link>
                  </div>
                </div>
              </section>
            </div>

            {/* Right */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="bg-white rounded-2xl p-5 border border-[#e0e3e5] shadow-sm">
                <h3 className="text-[18px] font-semibold text-[#0F2B5B] mb-4 flex items-center gap-2"><Icon name="rocket_launch" className="text-[#0F2B5B]" /> Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[["edit_document", "Practice Quiz", "text-[#0F2B5B] bg-[#1a365d]/10"], ["autorenew", "Revision Quiz", "text-[#0F2B5B] bg-[#003374]/10"], ["psychology", "Adaptive Quiz", "text-[#2563EB] bg-[#2563EB]/10"], ["swords", "Challenge Quiz", "text-[#EF4444] bg-[#ffdad6]/20"]].map(([icon, label, cl]) => (
                    <button key={label} className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#f7f9fb] hover:bg-[#eceef0] transition-colors border border-[#c4c6cf]/30 text-center group"><div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform ${cl}`}><Icon name={icon} className="text-[20px]" /></div><span className="text-[13px] text-[#191c1e]">{label}</span></button>
                  ))}
                </div>
              </div>

              <div className="bg-[#ffdad6]/30 rounded-2xl p-5 border border-[#ffdad6]/50 shadow-sm relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#EF4444]/5 rounded-full blur-2xl"></div>
                <h3 className="text-[18px] font-semibold text-[#191c1e] mb-1 flex items-center gap-2 relative z-10"><Icon name="troubleshoot" className="text-[#EF4444]" /> Needs Attention</h3>
                <p className="text-[13px] text-[#43474e] mb-4 relative z-10">We noticed you struggling with these concepts.</p>
                <div className="flex flex-col gap-3 relative z-10">
                  {[["Nash Equilibrium", "play_circle", "Watch concept explanation"], ["Network Authentication", "assignment_turned_in", "Take revision quiz"]].map(([area, icon, action]) => (
                    <div key={area} className="bg-white p-3 rounded-xl shadow-sm border border-[#EF4444]/10 border-l-4 border-l-[#EF4444]"><p className="text-[14px] text-[#191c1e] mb-1">Weak Area: {area}</p><button className="text-[#0F2B5B] text-[12px] flex items-center gap-1 hover:underline"><Icon name={icon} className="text-[14px]" /> {action}</button></div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-[#e0e3e5] shadow-sm">
                <h3 className="text-[18px] font-semibold text-[#0F2B5B] mb-4 flex items-center gap-2"><Icon name="recommend" className="text-[#0F2B5B]/70" /> Recommended Next</h3>
                <div className="flex flex-col gap-3">
                  {[["sync", "Revision Quiz: Nash Eq.", "Strengthen your weak area", "bg-[#003374]/20 text-[#0F2B5B]"], ["edit_document", "Practice: Authentication", "Based on recent activity", "bg-[#1a365d]/20 text-[#0F2B5B]"], ["fact_check", "Concept Check: Python", "Keep your streak alive", "bg-[#22C55E]/20 text-[#15803D]"]].map(([icon, title, sub, cl]) => (
                    <a key={title} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#eceef0] transition-colors group" href="#"><div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${cl}`}><Icon name={icon} className="text-[20px]" /></div><div><p className="text-[14px] text-[#191c1e] group-hover:text-[#0F2B5B] transition-colors">{title}</p><p className="text-[12px] text-[#74777f]">{sub}</p></div></a>
                  ))}
                </div>
              </div>

              <div className="bg-[#f2f4f6] rounded-2xl p-5 border border-[#e0e3e5]/50">
                <h3 className="text-[16px] font-semibold text-[#191c1e] mb-4 flex items-center gap-2"><Icon name="schedule" className="text-[18px] text-[#74777f]" /> Recent Activity</h3>
                <div className="relative pl-3 border-l-2 border-[#e0e3e5] flex flex-col gap-5 ml-2">
                  {[["Completed Cyber Security Quiz", "Scored", "88%", "2 hours ago", "#15803D"], ["Completed Game Theory Quiz", "Scored", "92%", "Yesterday", "#15803D"], ["Retook Authentication Quiz", "Improved", "+15%", "2 days ago", "#0F2B5B"]].map(([t, lbl, val, time, c]) => (
                    <div key={t} className="relative"><div className="absolute -left-[19px] top-1 w-3 h-3 rounded-full ring-4 ring-[#f2f4f6]" style={{ background: c }}></div><p className="text-[13px] text-[#191c1e]">{t}</p><p className="text-[12px] text-[#74777f] mt-0.5">{lbl} <span className="font-semibold" style={{ color: c }}>{val}</span> • {time}</p></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="h-12 w-full"></div>
        </div>
      </main>
    </div>
  );
}
