import { Link, useNavigate } from "react-router-dom";
import Icon from "../components/Icon";
import { getCurrentUser, clearCurrentUser } from "../lib/database";

// Exact port of the "Peer Challenges" design (found in student_quiz_questionpage/code.html)
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
  ]},
];
const AFTER = [
  { label: "Streak Pot", icon: "local_fire_department", to: "/streak-pot" },
  { label: "My Apprenticeships", icon: "handshake", to: "/apprenticeships" },
  { label: "Leaderboard", icon: "leaderboard", to: "/leaderboard" },
];
const RESOURCES = [
  { label: "Announcements", icon: "campaign", to: "/announcements" },
  { label: "Downloads", icon: "download", to: "/downloads" },
  { label: "Career Find", icon: "explore", to: "/career-find" },
  { label: "Explore Community", icon: "forum", to: "/community" },
  { label: "Cardboard VR", icon: "view_in_ar", to: "#" },
];
const idle = "flex items-center gap-3 px-3 py-2 text-[#43474e] hover:bg-[#e6e8ea] rounded-lg hover:translate-x-1 transition-transform duration-200 text-label-md";

const challenges = [
  { title: "Math Sprint Challenge", diff: "Easy", diffCl: "bg-[#DCFCE7] text-[#15803D]", desc: "Solve 20 arithmetic problems as fast as possible.", joined: "24/30 Joined", time: "2h 15m left", progress: 65, bar: "#2563EB", points: "100 Points" },
  { title: "Code Logic Battle", diff: "Medium", diffCl: "bg-[#003374] text-[#6a9dff]", desc: "Test your algorithmic thinking against peers in real-time.", joined: "18/25 Joined", time: "4h 30m left", progress: 40, bar: "#004395", points: "200 Points" },
  { title: "UI Design Sprint", diff: "Hard", diffCl: "bg-[#ffdad6] text-[#93000a]", desc: "Create a high-fidelity prototype for a mobile dashboard in under 24 hours.", joined: "12/20 Joined", time: "1d 2h left", progress: 10, bar: "#EF4444", points: "500 Points" },
];
const board = [
  { rank: 1, name: "Alex Johnson", init: "A", initCl: "bg-[#1a365d] text-[#86a0cd]", pts: "3,450", won: 12, streak: 15 },
  { rank: 2, name: "Maria Garcia", init: "M", initCl: "bg-[#003374] text-[#6a9dff]", pts: "3,120", won: 9, streak: 8 },
  { rank: 3, name: "Sam Lee", init: "S", initCl: "bg-[#0F2B5B] text-white", pts: "2,980", won: 11, streak: 12 },
];

export default function Challenges() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  function logout() { clearCurrentUser(); navigate("/"); }

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] text-body-md min-h-screen flex">
      <style>{`.pbc{width:100%;height:8px;background:#e6e8ea;border-radius:9999px;overflow:hidden}.pbf{height:100%;background:#2563EB;border-radius:9999px}`}</style>
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col bg-[#f2f4f6] h-screen w-64 fixed left-0 top-0 overflow-y-auto border-r border-[#c4c6cf]/20 shadow-md p-4 gap-1 z-40">
        <div className="mb-6 px-2 flex items-center gap-3"><img src="/logo.png" alt="EduNext logo" className="w-10 h-10 rounded-full object-contain shrink-0" /><div><h1 className="text-headline-md font-bold text-[#0F2B5B]">EduNext</h1><p className="text-label-sm text-[#43474e]">Learning Portal</p></div></div>
        <nav className="flex flex-col gap-1 flex-1">
          {NAV.map((sec) => (
            <div key={sec.title}><div className="text-xs font-bold text-[#74777f] uppercase tracking-wider mb-1 mt-2 px-3">{sec.title}</div>{sec.items.map((n) => <Link key={n.label} to={n.to} className={idle}><Icon name={n.icon} /><span>{n.label}</span></Link>)}
              {sec.title === "Activities" && <>
                <Link to="/challenges" className="flex items-center gap-3 px-3 py-2 bg-[#0F2B5B] text-white rounded-lg font-bold text-label-md"><Icon name="groups" /><span>Peer Challenges</span></Link>
                {AFTER.map((n) => <Link key={n.label} to={n.to} className={idle}><Icon name={n.icon} /><span>{n.label}</span></Link>)}
              </>}
            </div>
          ))}
          <div className="text-xs font-bold text-[#74777f] uppercase tracking-wider mb-1 mt-4 px-3">Resources</div>
          {RESOURCES.map((n) => <Link key={n.label} to={n.to} className={idle}><Icon name={n.icon} /><span>{n.label}</span></Link>)}
        </nav>
        <div className="mt-auto flex flex-col gap-2 pt-4 border-t border-[#c4c6cf]/20">
          <Link to="#" className={idle}><Icon name="help" /><span>Help Center</span></Link>
          <button onClick={logout} className={idle + " w-full text-left"}><Icon name="logout" /><span>Logout</span></button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 md:ml-64 p-4 md:p-10 min-h-screen">
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-headline-xl text-[#0F2B5B]">Peer Challenges</h2>
            <p className="text-body-lg text-[#43474e] mt-2 max-w-2xl">Compete with fellow learners, earn points, and climb the leaderboard.</p>
          </div>
          <div className="flex items-center gap-4 bg-[#f2f4f6] rounded-full px-4 py-2 border border-[#c4c6cf]/20">
            <div className="flex items-center gap-2 text-[#15803D] text-label-md"><Icon name="wifi" fill /><span>Online</span></div>
            <div className="h-4 w-px bg-[#c4c6cf]"></div>
            <div className="flex items-center gap-2 text-[#15803D] text-label-md"><Icon name="sync_saved_locally" /><span>All Synced</span></div>
          </div>
        </header>

        {/* Metrics */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[["emoji_events", "bg-[#1a365d]/10 text-[#0F2B5B]", "Current Standing", "Rank #18"], ["stars", "bg-[#0F2B5B]/10 text-[#0F2B5B]", "Total Earned", "1,250 Points"], ["bolt", "bg-[#003374]/10 text-[#0F2B5B]", "Engagement", "3 Active"]].map(([icon, box, label, val]) => (
            <div key={label} className="glass-card rounded-xl p-6 flex items-center gap-4"><div className={`w-12 h-12 rounded-full flex items-center justify-center ${box}`}><Icon name={icon} className="text-3xl" /></div><div><p className="text-label-sm text-[#43474e] uppercase tracking-wider">{label}</p><p className="text-headline-lg text-[#0F2B5B]">{val}</p></div></div>
          ))}
        </section>

        {/* Tabs */}
        <div className="flex overflow-x-auto gap-2 mb-8 border-b border-[#c4c6cf]/30 pb-2">
          <button className="px-4 py-2 text-label-md text-[#0F2B5B] border-b-2 border-[#0F2B5B] whitespace-nowrap">Active Challenges</button>
          {["My Challenges", "Completed Challenges"].map((t) => <button key={t} className="px-4 py-2 text-label-md text-[#43474e] hover:text-[#0F2B5B] transition-colors whitespace-nowrap">{t}</button>)}
          <button className="px-4 py-2 text-label-md text-[#43474e] hover:text-[#0F2B5B] transition-colors whitespace-nowrap flex items-center gap-2"><Icon name="leaderboard" className="text-[18px]" /> Leaderboard</button>
        </div>

        {/* Challenge cards */}
        <section className="mb-12">
          <h3 className="text-headline-md text-[#0F2B5B] mb-6">Discover New Challenges</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((c) => (
              <div key={c.title} className="glass-card rounded-xl p-6 flex flex-col h-full hover:-translate-y-1 transition-transform duration-300">
                <div className="flex justify-between items-start mb-4"><h4 className="text-lg font-bold text-[#0F2B5B]">{c.title}</h4><span className={`px-2 py-1 rounded-full text-label-sm text-xs ${c.diffCl}`}>{c.diff}</span></div>
                <p className="text-sm text-[#43474e] mb-6 flex-grow">{c.desc}</p>
                <div className="flex justify-between items-center mb-4 text-sm text-[#43474e]"><div className="flex items-center gap-1"><Icon name="group" className="text-[16px]" /><span>{c.joined}</span></div><div className="flex items-center gap-1"><Icon name="schedule" className="text-[16px]" /><span>{c.time}</span></div></div>
                <div className="mb-4"><div className="flex justify-between text-xs mb-1"><span className="text-[#43474e] font-medium">Progress</span><span className="text-[#0F2B5B] font-bold">{c.progress}%</span></div><div className="pbc"><div className="pbf" style={{ width: `${c.progress}%`, background: c.bar }}></div></div></div>
                <div className="flex justify-between items-center mt-auto pt-4 border-t border-[#c4c6cf]/20"><div className="flex items-center gap-1 text-[#0F2B5B] font-bold"><Icon name="workspace_premium" /><span>{c.points}</span></div><Link to="/quiz/1" className="bg-[#0F2B5B] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#0F2B5B]/90 transition-colors">Join Challenge</Link></div>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom: leaderboard + side */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="glass-card rounded-xl p-6">
              <div className="flex justify-between items-center mb-6"><h3 className="text-headline-md text-[#0F2B5B] flex items-center gap-2"><Icon name="emoji_events" className="text-[#0F2B5B]" /> Global Leaderboard</h3><Link to="/leaderboard" className="text-[#0F2B5B] text-sm font-medium hover:underline">View All</Link></div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead><tr className="border-b border-[#c4c6cf]/30 text-[#43474e] text-xs uppercase tracking-wider"><th className="py-3 px-4 font-medium">Rank</th><th className="py-3 px-4 font-medium">Student</th><th className="py-3 px-4 font-medium">Points</th><th className="py-3 px-4 font-medium">Won</th><th className="py-3 px-4 font-medium text-right">Streak</th></tr></thead>
                  <tbody className="text-sm">
                    {board.map((r) => (
                      <tr key={r.rank} className="border-b border-[#c4c6cf]/10 hover:bg-[#eceef0]/50 transition-colors">
                        <td className="py-3 px-4 font-bold text-[#0F2B5B]">{r.rank}</td>
                        <td className="py-3 px-4 font-medium"><div className="flex items-center gap-2"><div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${r.initCl}`}>{r.init}</div>{r.name}</div></td>
                        <td className="py-3 px-4 text-[#0F2B5B] font-semibold">{r.pts}</td>
                        <td className="py-3 px-4 text-[#43474e]">{r.won}</td>
                        <td className="py-3 px-4 text-right text-[#003374] font-medium"><span className="flex items-center justify-end gap-1"><Icon name="local_fire_department" className="text-[16px]" /> {r.streak}</span></td>
                      </tr>
                    ))}
                    <tr className="bg-[#0F2B5B]/5 border-l-4 border-[#0F2B5B]">
                      <td className="py-3 px-4 font-bold text-[#0F2B5B]">18</td>
                      <td className="py-3 px-4 font-bold text-[#0F2B5B]"><div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-[#0F2B5B] text-white flex items-center justify-center text-xs">{(user?.name || "Y").charAt(0)}</div>You</div></td>
                      <td className="py-3 px-4 text-[#0F2B5B] font-bold">1,250</td>
                      <td className="py-3 px-4 text-[#43474e] font-medium">4</td>
                      <td className="py-3 px-4 text-right text-[#003374] font-bold"><span className="flex items-center justify-end gap-1"><Icon name="local_fire_department" className="text-[16px]" /> 3</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>
          <div className="space-y-8">
            <section className="glass-card rounded-xl p-6">
              <h3 className="text-lg font-bold text-[#0F2B5B] mb-4">Your Badges</h3>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-[#f7f9fb] p-2 rounded-lg border border-[#c4c6cf]/20 shadow-sm"><Icon name="military_tech" fill className="text-[#0F2B5B]" /><span className="text-xs font-medium text-[#191c1e]">Initiate</span></div>
                <div className="flex items-center gap-2 bg-[#f7f9fb] p-2 rounded-lg border border-[#c4c6cf]/20 shadow-sm"><Icon name="workspace_premium" fill className="text-[#003374]" /><span className="text-xs font-medium text-[#191c1e]">Top 10</span></div>
                <div className="flex items-center gap-2 bg-[#f7f9fb] p-2 rounded-lg border border-[#c4c6cf]/20 shadow-sm opacity-50 grayscale"><Icon name="trophy" fill /><span className="text-xs font-medium text-[#191c1e]">Champion</span></div>
              </div>
            </section>
            <section className="glass-card rounded-xl p-6">
              <div className="flex justify-between items-center mb-4"><h3 className="text-lg font-bold text-[#0F2B5B]">Resume</h3><span className="bg-[#1a365d] text-[#86a0cd] text-xs px-2 py-1 rounded-full">1 Active</span></div>
              <div className="border border-[#c4c6cf]/20 rounded-lg p-4 bg-white">
                <h4 className="text-sm font-bold text-[#0F2B5B] mb-1">Science Quiz Battle</h4>
                <p className="text-xs text-[#43474e] mb-3">Physics module.</p>
                <div className="mb-3"><div className="pbc" style={{ height: "8px" }}><div className="pbf" style={{ width: "80%" }}></div></div></div>
                <Link to="/quiz/1" className="block text-center w-full bg-[#f7f9fb] hover:bg-[#e0e3e5] border border-[#c4c6cf]/30 text-[#0F2B5B] px-4 py-2 rounded-lg text-sm transition-colors">Continue</Link>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
