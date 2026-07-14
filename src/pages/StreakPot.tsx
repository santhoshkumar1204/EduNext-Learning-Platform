import { Link, useNavigate } from "react-router-dom";
import Icon from "../components/Icon";
import { getCurrentUser, clearCurrentUser } from "../lib/database";
import { avatarUrl } from "../lib/images";

// Exact port of the "Streak Pot" design (found in student_quiz/code.html)
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
  ]},
];
const AFTER = [
  { label: "My Apprenticeships", icon: "work_history", to: "/apprenticeships" },
  { label: "Leaderboard", icon: "leaderboard", to: "/leaderboard" },
];
const RESOURCES = [
  { label: "Announcements", icon: "campaign", to: "/announcements" },
  { label: "Downloads", icon: "download", to: "/downloads" },
  { label: "Career Find", icon: "explore", to: "/career-find" },
  { label: "Explore Community", icon: "forum", to: "/community" },
  { label: "Cardboard VR", icon: "view_in_ar", to: "#" },
];
const idle = "flex items-center space-x-3 px-4 py-3 rounded-lg text-[#43474e] hover:bg-[#e0e3e5]/50 hover:text-[#191c1e] transition-colors";

const VAULT = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=700&q=80";
const contributors = [
  { rank: 1, name: "Sarah Jenkins", streak: 85, pts: "3,200", badge: "bg-yellow-100 text-yellow-600" },
  { rank: 2, name: "Michael Torres", streak: 72, pts: "2,850", badge: "bg-gray-200 text-gray-600" },
  { rank: 3, name: "Aisha Khan", streak: 68, pts: "2,600", badge: "bg-orange-100 text-orange-600" },
];

export default function StreakPot() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  function logout() { clearCurrentUser(); navigate("/"); }

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] text-body-md min-h-screen flex antialiased">
      {/* Sidebar */}
      <nav className="hidden md:flex flex-col h-screen w-72 sticky top-0 bg-[#f2f4f6] shadow-md p-6 space-y-2 z-20">
        <div className="mb-8 px-4 flex items-center space-x-3"><img src="/logo.png" alt="EduNext logo" className="w-10 h-10 rounded-lg object-contain shrink-0" /><div><h1 className="text-headline-md font-bold text-[#0F2B5B]">EduNext</h1><p className="text-label-sm text-[#43474e]">Learning Portal</p></div></div>
        <div className="flex-1 overflow-y-auto space-y-1">
          {NAV.map((sec) => (
            <div key={sec.title}><p className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-[#c4c6cf]">{sec.title}</p>{sec.items.map((n) => <Link key={n.label} to={n.to} className={idle}><Icon name={n.icon} /><span className="text-label-md">{n.label}</span></Link>)}
              {sec.title === "Activities" && <>
                <Link to="/streak-pot" className="flex items-center space-x-3 px-4 py-3 bg-[#0F2B5B] text-white rounded-lg font-bold shadow-sm translate-x-1"><Icon name="local_fire_department" fill /><span className="text-label-md">Streak Pot</span></Link>
                {AFTER.map((n) => <Link key={n.label} to={n.to} className={idle}><Icon name={n.icon} /><span className="text-label-md">{n.label}</span></Link>)}
              </>}
            </div>
          ))}
          <p className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-[#c4c6cf] mt-4">Resources</p>
          {RESOURCES.map((n) => <Link key={n.label} to={n.to} className={idle}><Icon name={n.icon} /><span className="text-label-md">{n.label}</span></Link>)}
        </div>
        <button onClick={logout} className={idle + " w-full text-left"}><Icon name="logout" /><span className="text-label-md">Sign Out</span></button>
      </nav>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-[#f7f9fb]/80 backdrop-blur-xl w-full top-0 sticky shadow-sm z-10 border-b border-white/20">
          <div className="flex justify-between items-center px-10 py-4 w-full max-w-[1280px] mx-auto">
            <div className="hidden md:flex flex-1 max-w-xl mx-8 relative"><Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-[#43474e]" /><input className="w-full bg-[#e6e8ea] border-none rounded-full py-2 pl-10 pr-4 focus:ring-2 focus:ring-[#0F2B5B] focus:bg-white transition-all text-[#191c1e] outline-none" placeholder="Search courses, skills, or students..." /></div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-[#0F2B5B] hover:bg-[#1a365d]/50 rounded-full"><Icon name="notifications" /></button>
              <Link to="/settings" className="p-2 text-[#0F2B5B] hover:bg-[#1a365d]/50 rounded-full hidden sm:block"><Icon name="settings" /></Link>
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#e6e8ea]"><img alt="" className="w-full h-full object-cover" src={avatarUrl(user?.name || "Student")} /></div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-10">
          <div className="max-w-[1280px] mx-auto space-y-6">
            {/* Hero */}
            <section className="glass-card rounded-xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#0F2B5B]/5 to-transparent pointer-events-none"></div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 relative z-10">
                <div className="flex flex-col justify-center space-y-6">
                  <div>
                    <div className="inline-flex items-center space-x-2 bg-[#DCFCE7] text-[#15803D] px-3 py-1 rounded-full mb-4"><Icon name="stars" fill className="text-sm" /><span className="text-label-sm font-bold tracking-wider uppercase">Emerald Tier Active</span></div>
                    <h2 className="text-headline-xl text-[#0F2B5B] font-bold mb-2">EduNext Streak Pot</h2>
                    <p className="text-body-lg text-[#43474e]">Consistency powers the community. Every day you learn, you contribute energy to the collective pot. Reach the milestones together to unlock exclusive EduNext Community rewards and premium resources.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4 border border-[#c4c6cf]/30"><p className="text-label-sm text-[#43474e] uppercase tracking-wider mb-1">Pot Level</p><span className="text-headline-lg font-bold text-[#0F2B5B]">Level 4</span></div>
                    <div className="bg-white rounded-lg p-4 border border-[#c4c6cf]/30"><p className="text-label-sm text-[#43474e] uppercase tracking-wider mb-1">Active Contributors</p><div className="flex items-baseline space-x-2"><span className="text-headline-lg font-bold text-[#0F2B5B]">5,420</span><Icon name="group" fill className="text-[#15803D]" /></div></div>
                  </div>
                </div>
                <div className="relative h-64 lg:h-96 rounded-xl bg-white/50 border border-[#c4c6cf]/20 flex items-center justify-center overflow-hidden">
                  <img alt="" className="w-full h-full object-cover rounded-xl z-0" src={VAULT} />
                  <div className="absolute bottom-4 left-4 bg-[#f7f9fb]/80 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20 z-10"><p className="text-label-sm font-bold text-[#0F2B5B]">Current Pot Energy: 72% Charged</p></div>
                </div>
              </div>
            </section>

            {/* Collective progress */}
            <section className="glass-card rounded-xl p-8 relative">
              <div className="flex justify-between items-end mb-6"><div><h3 className="text-headline-md font-bold text-[#0F2B5B]">Collective Progress</h3><p className="text-body-md text-[#43474e] mt-1">We need 8% more to unlock the next milestone.</p></div><span className="text-headline-lg font-bold text-[#15803D]">72%</span></div>
              <div className="relative pt-4 pb-8">
                <div className="h-6 bg-[#e6e8ea] rounded-full overflow-hidden w-full relative"><div className="h-full bg-gradient-to-r from-emerald-400 to-[#22C55E] rounded-full flex items-center justify-end pr-2 relative" style={{ width: "72%" }}><div className="w-2 h-2 bg-white rounded-full animate-pulse"></div></div></div>
                <div className="absolute top-0 w-full h-full pointer-events-none">
                  {[["25%", true], ["50%", true], ["75%", false]].map(([pos, done], i) => (
                    <div key={pos as string} className="absolute -ml-3 top-2 flex flex-col items-center" style={{ left: pos as string }}><div className={`w-6 h-6 rounded-full border-4 border-[#f7f9fb] flex items-center justify-center z-10 ${done ? "bg-[#22C55E]" : "bg-[#e0e3e5]"}`}><Icon name={done ? "check" : "lock"} className={`text-[10px] ${done ? "text-white" : "text-[#74777f]"}`} /></div><span className="text-label-sm text-[#43474e] mt-6">{pos}</span></div>
                  ))}
                  <div className="absolute right-0 top-2 flex flex-col items-center"><div className="w-6 h-6 rounded-full bg-[#e0e3e5] border-4 border-[#f7f9fb] flex items-center justify-center z-10"><Icon name="lock" className="text-[10px] text-[#74777f]" /></div><span className="text-label-sm text-[#43474e] mt-6 mr-2">100%</span></div>
                </div>
              </div>
            </section>

            {/* Milestone rewards */}
            <section>
              <h3 className="text-headline-md font-bold text-[#0F2B5B] mb-6">Milestone Rewards</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <RewardCard pct="25%" icon="military_tech" title="Community Achievement Badge" desc="Exclusive digital badge awarded to all participants." state="unlocked" />
                <RewardCard pct="50%" icon="menu_book" title="Learning Resources Unlock" desc="Unlock Premium Learning Resources including curated study guides and expert-led masterclasses." state="unlocked" />
                <div className="glass-card rounded-xl p-6 border-t-4 border-t-[#1a365d] relative overflow-hidden hover:-translate-y-1 transition-transform duration-300 shadow-md">
                  <div className="absolute -right-4 -top-4 w-16 h-16 bg-[#1a365d]/10 rounded-full blur-xl"></div>
                  <div className="flex justify-between items-start mb-4 relative z-10"><div className="w-10 h-10 rounded-full bg-[#1a365d] text-[#86a0cd] flex items-center justify-center"><Icon name="celebration" /></div><span className="text-label-sm bg-[#f7f9fb] px-2 py-1 rounded-full text-[#43474e] font-bold">75%</span></div>
                  <h4 className="text-label-md font-bold text-[#0F2B5B] mb-1 relative z-10">Community Celebration Event</h4>
                  <p className="text-label-sm text-[#43474e] relative z-10">Exclusive Community Event: A live interactive workshop with global industry leaders.</p>
                  <div className="mt-4 w-full bg-[#e6e8ea] rounded-full h-1.5"><div className="bg-[#0F2B5B] h-1.5 rounded-full" style={{ width: "96%" }}></div></div>
                </div>
                <RewardCard pct="100%" icon="workspace_premium" title="Grand Community Reward" desc="A major surprise unlock for the entire student body." state="locked" />
              </div>
            </section>

            {/* Stats & info */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-6">
                <div className="glass-card rounded-xl p-6">
                  <h3 className="text-headline-md font-bold text-[#0F2B5B] mb-4 flex items-center"><Icon name="person" className="mr-2" /> My Contribution</h3>
                  <div className="space-y-4">
                    <Row label="Current Streak" valueNode={<span className="text-[#15803D] flex items-center">{user?.streak ?? 12} Days <Icon name="local_fire_department" fill className="text-sm ml-1" /></span>} />
                    <Row label="Longest Streak" value="28 Days" />
                    <Row label="Points Contributed" value="450 pts" />
                    <div className="flex justify-between items-center p-3 bg-[#1a365d] text-[#86a0cd] rounded-lg"><span className="text-label-sm">Platform Rank</span><span className="text-headline-md font-bold">#42</span></div>
                  </div>
                </div>
                <div className="glass-card rounded-xl p-6 border-t-4 border-t-[#0F2B5B]">
                  <h3 className="text-label-md font-bold text-[#0F2B5B] mb-4 flex items-center"><Icon name="flag" className="mr-2" /> Next Personal Milestone</h3>
                  <div className="space-y-3"><div className="flex justify-between items-center"><span className="text-xs text-[#43474e]">Current Streak</span><span className="text-xs font-bold">12 Days</span></div><div className="w-full bg-[#e6e8ea] h-1.5 rounded-full"><div className="bg-[#0F2B5B] h-1.5 rounded-full" style={{ width: "60%" }}></div></div><div className="flex justify-between items-center"><span className="text-xs text-[#43474e]">Next Goal: 20 Days</span><span className="text-xs font-bold text-[#0F2B5B]">8 Days Left</span></div></div>
                </div>
                <div className="glass-card rounded-xl p-6 bg-[#d8e2ff] text-[#001a42]">
                  <h4 className="text-label-md font-bold mb-2 flex items-center"><Icon name="info" className="mr-2 text-sm" /> How it Works</h4>
                  <p className="text-label-sm text-[#004395] leading-relaxed">1. Learn Daily: Complete lessons to stay active.<br />2. Maintain Streaks: Longer streaks boost your impact.<br />3. Earn Contribution Points: Every action adds energy.<br />4. Fill the Community Pot: Watch the collective energy rise.<br />5. Unlock Collective Rewards: Reach milestones for the whole community.</p>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-6">
                <div className="glass-card rounded-xl p-6">
                  <div className="flex justify-between items-center mb-6"><h3 className="text-headline-md font-bold text-[#0F2B5B] flex items-center"><Icon name="emoji_events" className="mr-2" /> Top Streak Contributors</h3><button className="text-[#0F2B5B] text-label-sm hover:underline">View All</button></div>
                  <div className="space-y-3">
                    {contributors.map((c) => (
                      <div key={c.rank} className="flex items-center justify-between p-3 hover:bg-[#f7f9fb] rounded-lg transition-colors border border-transparent hover:border-[#c4c6cf]/20">
                        <div className="flex items-center space-x-4"><div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${c.badge}`}>{c.rank}</div><div className="w-10 h-10 rounded-full overflow-hidden bg-[#e6e8ea]"><img alt="" className="w-full h-full object-cover" src={avatarUrl(c.name)} /></div><div><p className="text-label-md font-bold text-[#0F2B5B]">{c.name}</p><p className="text-label-sm text-[#43474e] flex items-center"><Icon name="local_fire_department" fill className="text-[12px] text-[#15803D] mr-1" /> {c.streak} Day Streak</p></div></div>
                        <div className="text-right"><p className="text-label-md font-bold text-[#0F2B5B]">{c.pts}</p><p className="text-label-sm text-[#43474e]">pts</p></div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-headline-md font-bold text-[#0F2B5B] mb-4 flex items-center"><Icon name="emoji_events" className="mr-2" /> Recent Unlocks</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="glass-card rounded-xl p-4 flex items-center space-x-4 border border-[#c4c6cf]/30"><div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><Icon name="calendar_month" fill /></div><div><p className="text-label-md font-bold text-[#0F2B5B]">100 Day Community Streak</p><p className="text-label-sm text-[#43474e]">Achieved 2 days ago</p></div></div>
                    <div className="glass-card rounded-xl p-4 flex items-center space-x-4 border border-[#c4c6cf]/30"><div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600"><Icon name="group_add" /></div><div><p className="text-label-md font-bold text-[#0F2B5B]">500 Active Learners</p><p className="text-label-sm text-[#43474e]">Achieved last week</p></div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function RewardCard({ pct, icon, title, desc, state }: { pct: string; icon: string; title: string; desc: string; state: "unlocked" | "locked" }) {
  const unlocked = state === "unlocked";
  return (
    <div className={`glass-card rounded-xl p-6 border-t-4 ${unlocked ? "border-t-[#22C55E] opacity-75" : "border-t-[#c4c6cf] bg-white/40"}`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${unlocked ? "bg-emerald-100 text-[#15803D]" : "bg-[#e0e3e5] text-[#74777f]"}`}><Icon name={icon} fill /></div>
        <span className={`text-label-sm bg-[#f7f9fb] px-2 py-1 rounded-full ${unlocked ? "text-[#43474e]" : "text-[#c4c6cf]"}`}>{pct}</span>
      </div>
      <h4 className={`text-label-md font-bold mb-1 ${unlocked ? "text-[#0F2B5B]" : "text-[#74777f]"}`}>{title}</h4>
      <p className={`text-label-sm ${unlocked ? "text-[#43474e]" : "text-[#c4c6cf]"}`}>{desc}</p>
      <div className={`mt-4 flex items-center text-sm font-semibold ${unlocked ? "text-[#15803D]" : "text-[#74777f]"}`}><Icon name={unlocked ? "check_circle" : "lock"} className="text-sm mr-1" /> {unlocked ? "Unlocked" : "Locked"}</div>
    </div>
  );
}

function Row({ label, value, valueNode }: { label: string; value?: string; valueNode?: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center p-3 bg-[#f7f9fb] rounded-lg"><span className="text-label-sm text-[#43474e]">{label}</span><span className="text-label-md font-bold text-[#0F2B5B]">{valueNode ?? value}</span></div>
  );
}
