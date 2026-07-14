import { Link, useNavigate } from "react-router-dom";
import Icon from "../components/Icon";
import { getCurrentUser, clearCurrentUser } from "../lib/database";
import { avatarUrl } from "../lib/images";

// Exact port of student_leaderboads/code.html
const NAV: { title: string; items: { label: string; icon: string; to: string }[] }[] = [
  { title: "Menu", items: [
    { label: "Dashboard", icon: "dashboard", to: "/dashboard" },
    { label: "Courses", icon: "school", to: "/courses" },
    { label: "My Courses", icon: "library_books", to: "/my-courses" },
    { label: "Progress & Streaks", icon: "trending_up", to: "/progress" },
  ]},
  { title: "Activities", items: [
    { label: "Quizzes", icon: "quiz", to: "/quizzes" },
    { label: "Assignments", icon: "assignment", to: "/assignments" },
    { label: "Peer Challenges", icon: "groups", to: "/challenges" },
    { label: "Streak Pot", icon: "local_fire_department", to: "/streak-pot" },
    { label: "My Apprenticeships", icon: "work_history", to: "/apprenticeships" },
  ]},
];
const RESOURCES = [
  { label: "Announcements", icon: "campaign", to: "/announcements" },
  { label: "Downloads", icon: "download", to: "/downloads" },
  { label: "Career Find", icon: "explore", to: "/career-find" },
  { label: "Explore Community", icon: "forum", to: "/community" },
  { label: "Cardboard VR", icon: "view_in_ar", to: "#" },
];
const idle = "flex items-center space-x-3 px-4 py-3 rounded-lg text-[#43474e] hover:bg-[#e0e3e5]/50 hover:text-[#191c1e] transition-colors";

const rows = [
  { rank: 1, name: "Sarah Kumar", points: 3250, streak: 18, courses: 15, quiz: "94%", trend: "up", medal: "#F59E0B" },
  { rank: 2, name: "Arun Raj", points: 3010, streak: 14, courses: 13, quiz: "92%", trend: "flat", medal: "#9CA3AF" },
  { rank: 3, name: "You", points: 2761, streak: 12, courses: 11, quiz: "91%", trend: "up", medal: "#B45309", you: true },
  { rank: 4, name: "Aisha Khan", points: 2600, streak: 8, courses: 10, quiz: "88%", trend: "down" },
];

export default function Leaderboard() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  function logout() { clearCurrentUser(); navigate("/"); }

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] text-body-md min-h-screen flex antialiased">
      {/* Sidebar */}
      <nav className="hidden md:flex flex-col h-screen w-72 sticky top-0 bg-[#f2f4f6] shadow-md p-6 space-y-2 z-20">
        <div className="mb-8 px-4 flex items-center space-x-3">
          <img src="/logo.png" alt="EduNext logo" className="w-10 h-10 rounded-lg object-contain shrink-0" />
          <div><h1 className="text-headline-md font-bold text-[#0F2B5B]">EduNext</h1><p className="text-label-sm text-[#43474e]">Learning Portal</p></div>
        </div>
        <div className="flex-1 overflow-y-auto space-y-1">
          {NAV.map((sec) => (
            <div key={sec.title}>
              <p className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-[#c4c6cf]">{sec.title}</p>
              {sec.items.map((n) => <Link key={n.label} to={n.to} className={idle}><Icon name={n.icon} /><span className="text-label-md">{n.label}</span></Link>)}
            </div>
          ))}
          {/* Leaderboard active (under Activities in design it's after apprenticeships) */}
          <Link to="/leaderboard" className="flex items-center space-x-3 px-4 py-3 bg-[#0F2B5B] text-white rounded-lg font-bold shadow-sm"><Icon name="leaderboard" /><span className="text-label-md">Leaderboard</span></Link>
          <p className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-[#c4c6cf] mt-4">Resources</p>
          {RESOURCES.map((n) => <Link key={n.label} to={n.to} className={idle}><Icon name={n.icon} /><span className="text-label-md">{n.label}</span></Link>)}
        </div>
        <button onClick={logout} className={idle + " w-full text-left"}><Icon name="logout" /><span className="text-label-md">Sign Out</span></button>
      </nav>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-[#f7f9fb]/80 backdrop-blur-xl w-full top-0 sticky shadow-sm z-10 border-b border-white/20">
          <div className="flex justify-between items-center px-10 py-4 w-full max-w-[1280px] mx-auto">
            <div className="hidden md:flex flex-1 max-w-xl mx-8 relative">
              <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-[#43474e]" />
              <input className="w-full bg-[#e6e8ea] border-none rounded-full py-2 pl-10 pr-4 focus:ring-2 focus:ring-[#0F2B5B] focus:bg-white transition-all text-[#191c1e] outline-none" placeholder="Search courses, skills, or students..." />
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-[#0F2B5B] hover:bg-[#1a365d]/50 rounded-full"><Icon name="notifications" /></button>
              <Link to="/settings" className="p-2 text-[#0F2B5B] hover:bg-[#1a365d]/50 rounded-full hidden sm:block"><Icon name="settings" /></Link>
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#e6e8ea]"><img alt="" className="w-full h-full object-cover" src={avatarUrl(user?.name || "Student")} /></div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-10">
          <div className="max-w-[1280px] mx-auto space-y-8">
            <div>
              <h2 className="text-headline-xl text-[#0F2B5B] font-bold">Leaderboard</h2>
              <p className="text-body-lg text-[#43474e] mt-2">See how you rank among your peers and celebrate achievements</p>
            </div>

            {/* Personal ranking */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#c4c6cf]/30 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#1a365d]"><img alt="" className="w-full h-full object-cover" src={avatarUrl(user?.name || "You")} /></div>
                <div>
                  <h3 className="text-headline-md font-bold text-[#0F2B5B]">Your Performance</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center justify-center px-2 py-1 rounded bg-[#DCFCE7] text-[#15803D] text-label-sm font-bold">Rank #3</span>
                    <span className="text-[#43474e] text-label-md flex items-center gap-1"><Icon name="arrow_upward" className="text-sm text-[#15803D]" /> Moving up</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 w-full md:w-auto">
                {[["Total Points", "2761", "text-[#0F2B5B]"], ["Current Streak", "12", "text-[#15803D]"], ["Courses", "11", "text-[#0F2B5B]"], ["Quiz Avg", "91%", "text-[#0F2B5B]"]].map(([l, v, c]) => (
                  <div key={l} className="text-center md:text-left"><p className="text-label-sm text-[#43474e] uppercase tracking-wider mb-1">{l}</p><p className={`text-headline-md font-bold ${c} flex items-center justify-center md:justify-start gap-1`}>{v}{l === "Current Streak" && <Icon name="local_fire_department" fill className="text-base" />}</p></div>
                ))}
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex gap-4">
                {[["This Week", "This Month", "All Time"], ["Overall", "Courses", "Quizzes", "Assignments", "Community", "Peer Challenges"]].map((opts, i) => (
                  <div key={i} className="relative"><select className="appearance-none bg-white border border-[#c4c6cf]/50 rounded-lg py-2 pl-4 pr-10 text-label-md text-[#191c1e] focus:ring-2 focus:ring-[#0F2B5B] outline-none cursor-pointer">{opts.map((o) => <option key={o}>{o}</option>)}</select><Icon name="expand_more" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#43474e] pointer-events-none" /></div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Table */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-[#c4c6cf]/30 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead><tr className="bg-[#f2f4f6] border-b border-[#c4c6cf]/30">
                        <th className="py-4 px-6 text-label-sm text-[#43474e] uppercase tracking-wider font-semibold">Rank</th>
                        <th className="py-4 px-6 text-label-sm text-[#43474e] uppercase tracking-wider font-semibold">Student</th>
                        <th className="py-4 px-6 text-label-sm text-[#43474e] uppercase tracking-wider font-semibold text-right">Points</th>
                        <th className="py-4 px-6 text-label-sm text-[#43474e] uppercase tracking-wider font-semibold text-center">Streak</th>
                        <th className="py-4 px-6 text-label-sm text-[#43474e] uppercase tracking-wider font-semibold text-center hidden md:table-cell">Courses</th>
                        <th className="py-4 px-6 text-label-sm text-[#43474e] uppercase tracking-wider font-semibold text-center hidden sm:table-cell">Quiz Avg</th>
                      </tr></thead>
                      <tbody className="divide-y divide-[#c4c6cf]/20">
                        {rows.map((r) => (
                          <tr key={r.rank} className={r.you ? "bg-[#0F2B5B]/5 border-l-4 border-l-[#0F2B5B]" : "hover:bg-[#f7f9fb] transition-colors"}>
                            <td className="py-4 px-6"><div className="flex items-center gap-2">
                              <span className={`text-headline-md font-bold w-6 text-center ${r.you ? "text-[#0F2B5B]" : r.rank <= 3 ? "text-[#191c1e]" : "text-[#43474e] text-body-md"}`}>{r.rank}</span>
                              <Icon name={r.trend === "up" ? "arrow_upward" : r.trend === "down" ? "arrow_downward" : "arrow_forward"} className={`text-sm ${r.trend === "up" ? "text-[#15803D]" : r.trend === "down" ? "text-[#EF4444]" : "text-[#c4c6cf]"}`} />
                              {r.medal && <span style={{ color: r.medal }}><Icon name="military_tech" fill className="text-xl" /></span>}
                            </div></td>
                            <td className="py-4 px-6"><div className="flex items-center gap-3"><div className={`w-10 h-10 rounded-full overflow-hidden shrink-0 ${r.you ? "border-2 border-[#0F2B5B]" : "bg-[#e6e8ea]"}`}><img alt="" className="w-full h-full object-cover" src={avatarUrl(r.name === "You" ? user?.name || "You" : r.name)} /></div><span className={`text-label-md font-bold ${r.rank === 4 && !r.you ? "text-[#191c1e]" : "text-[#0F2B5B]"}`}>{r.name === "You" ? "You" : r.name}</span></div></td>
                            <td className="py-4 px-6 text-right text-label-md font-bold text-[#0F2B5B]">{r.points}</td>
                            <td className="py-4 px-6 text-center"><span className="inline-flex items-center gap-1 text-label-sm bg-[#eceef0] px-2 py-1 rounded-full">{r.streak} <Icon name="local_fire_department" fill className="text-[14px] text-[#15803D]" /></span></td>
                            <td className="py-4 px-6 text-center text-[#191c1e] hidden md:table-cell">{r.courses}</td>
                            <td className="py-4 px-6 text-center text-[#191c1e] hidden sm:table-cell">{r.quiz}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                {/* Position highlight */}
                <div className="bg-[#0F2B5B] text-white rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md mt-6">
                  <div className="flex items-center gap-3"><Icon name="trending_up" className="text-2xl" /><div><p className="text-label-md font-bold">Your Position: Rank #3</p><p className="text-label-sm text-[#adc7f7]">2761 Points</p></div></div>
                  <div className="bg-[#1a365d] text-[#86a0cd] px-4 py-2 rounded-lg text-label-sm text-center"><span className="font-bold">249 points</span> to reach Rank #2</div>
                </div>
              </div>

              {/* Right info */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-[#c4c6cf]/30 p-6">
                  <h3 className="text-label-md font-bold text-[#0F2B5B] mb-4 flex items-center"><Icon name="info" className="mr-2 text-[#0F2B5B]" /> How Ranking Works</h3>
                  <p className="text-label-sm text-[#43474e] mb-4">Your leaderboard score is a combined measure of your overall engagement and performance on EduNext.</p>
                  <ul className="space-y-3 text-label-sm text-[#43474e]">
                    <li className="flex items-start gap-2"><Icon name="school" fill className="text-sm text-[#0F2B5B] mt-0.5" /><span><strong>Courses &amp; Quizzes:</strong> Points for completion and high scores.</span></li>
                    <li className="flex items-start gap-2"><Icon name="local_fire_department" fill className="text-sm text-[#15803D] mt-0.5" /><span><strong>Streaks:</strong> Bonus multipliers for consecutive days active.</span></li>
                    <li className="flex items-start gap-2"><Icon name="assignment" fill className="text-sm text-[#0F2B5B] mt-0.5" /><span><strong>Assignments:</strong> Earn points for timely and quality submissions.</span></li>
                    <li className="flex items-start gap-2"><Icon name="forum" fill className="text-sm text-[#1a365d] mt-0.5" /><span><strong>Community:</strong> Get rewarded for helping peers and participating in discussions.</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
