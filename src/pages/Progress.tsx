import { Link } from "react-router-dom";
import Icon from "../components/Icon";
import PortalShell from "../components/PortalShell";
import { IMG } from "../lib/images";

// Exact port of the Motivation Center design (found in teacher_profile/code.html — "EduNext | Motivation Center")
const days = [["Mon", true], ["Tue", true], ["Wed", true], ["Thu", true], ["Fri", true], ["Sat", false], ["Sun", false]] as const;
const continueCourses = [
  { icon: "psychology", box: "bg-[#0F2B5B]", title: "Advanced Machine Learning", sub: "18 of 24 lessons completed", pct: 75, bar: "bg-[#0F2B5B]" },
  { icon: "shield", box: "bg-[#22c55e]", title: "Cyber Security Essentials", sub: "10 of 22 lessons completed", pct: 45, bar: "bg-[#22c55e]" },
];
const subjects = [
  { name: "Mathematics", pct: 85, stroke: "#0F2B5B" },
  { name: "Programming", pct: 92, stroke: "#22c55e" },
  { name: "Cyber Security", pct: 45, stroke: "#0F2B5B" },
  { name: "Data Analytics", pct: 60, stroke: "#22c55e" },
];
const badges = [
  { icon: "workspace_premium", label: "7 Day Streak", box: "bg-[#22c55e]/10 border-[#22c55e]/20 text-[#22c55e]", locked: false },
  { icon: "military_tech", label: "Quiz Master", box: "bg-[#0F2B5B]/10 border-[#0F2B5B]/20 text-[#0F2B5B]", locked: false },
  { icon: "assignment_turned_in", label: "Assign. Champ", box: "bg-[#22c55e]/10 border-[#22c55e]/20 text-[#22c55e]", locked: false },
  { icon: "lock", label: "30 Day Streak", box: "bg-[#eceef0] border-[#c4c6cf]/30 text-[#74777f]", locked: true },
  { icon: "lock", label: "Fast Learner", box: "bg-[#eceef0] border-[#c4c6cf]/30 text-[#74777f]", locked: true },
  { icon: "groups", label: "Community Contrib.", box: "bg-[#0F2B5B]/10 border-[#0F2B5B]/20 text-[#0F2B5B]", locked: false },
];
const milestones = [
  { icon: "check", box: "bg-[#22c55e]", title: "Completed Course", sub: "Intro to UI Design • 2 hours ago" },
  { icon: "emoji_events", box: "bg-[#0F2B5B]", title: "Passed Quiz", sub: "Python Basics • Yesterday" },
  { icon: "upload_file", box: "bg-[#22c55e]", title: "Submitted Assignment", sub: "Data Structures • 2 days ago" },
];

function Ring({ pct, stroke }: { pct: number; stroke: string }) {
  return (
    <div className="relative w-16 h-16 mx-auto mb-2">
      <svg className="w-full h-full" viewBox="0 0 36 36">
        <path className="fill-none stroke-[#e6e8ea]" strokeWidth="3" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
        <path fill="none" stroke={stroke} strokeWidth="3" strokeDasharray={`${pct}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-label-sm font-bold text-[#0F2B5B]">{pct}%</span>
    </div>
  );
}

export default function Progress() {
  const card = "bg-white border border-black/5 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300";

  return (
    <PortalShell active="Progress & Streaks">
      <div className="max-w-[1280px] mx-auto">
        {/* Header */}
        <section className="mb-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div><h2 className="text-headline-lg text-[#0F2B5B] mb-1">Your Motivation Center</h2><p className="text-body-md text-[#43474e]">Stay focused, keep your streaks alive, and unlock your potential.</p></div>
            <div className="flex items-center gap-4 bg-[#22c55e]/10 px-6 py-3 rounded-2xl border border-[#22c55e]/20">
              <div className="w-10 h-10 bg-[#22c55e] rounded-full flex items-center justify-center shadow-lg shadow-[#22c55e]/20"><Icon name="local_fire_department" fill className="text-white text-xl" /></div>
              <div><p className="text-label-sm font-bold text-[#22c55e] uppercase tracking-wider">Current Streak</p><p className="text-headline-md font-bold text-[#0F2B5B]">14 Days</p></div>
            </div>
          </div>
        </section>

        {/* Streak overview */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className={`${card} p-6 rounded-2xl flex items-center gap-5`}><div className="w-12 h-12 bg-[#0F2B5B]/5 rounded-xl flex items-center justify-center text-[#0F2B5B]"><Icon name="history" className="text-2xl" /></div><div><p className="text-label-sm text-[#43474e] font-medium">Longest Streak</p><p className="text-headline-md font-bold text-[#0F2B5B]">45 Days</p></div></div>
          <div className={`${card} p-6 rounded-2xl flex items-center gap-5`}><div className="w-12 h-12 bg-[#22c55e]/5 rounded-xl flex items-center justify-center text-[#22c55e]"><Icon name="task_alt" className="text-2xl" /></div><div className="flex-1"><p className="text-label-sm text-[#43474e] font-medium">Weekly Goal Progress</p><div className="flex items-center gap-3"><p className="text-headline-md font-bold text-[#0F2B5B]">85%</p><div className="flex-1 h-2 bg-[#eceef0] rounded-full overflow-hidden"><div className="h-full bg-[#22c55e] rounded-full" style={{ width: "85%" }} /></div></div></div></div>
          <div className={`${card} p-6 rounded-2xl flex items-center gap-5`}><div className="w-12 h-12 bg-[#0F2B5B]/5 rounded-xl flex items-center justify-center text-[#0F2B5B]"><Icon name="schedule" className="text-2xl" /></div><div><p className="text-label-sm text-[#43474e] font-medium">Total Learning Hours</p><p className="text-headline-md font-bold text-[#0F2B5B]">124h</p></div></div>
        </section>

        {/* Weekly tracker */}
        <section className="mb-12">
          <div className={`${card} p-8 rounded-3xl`}>
            <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
              <h3 className="text-headline-md text-[#0F2B5B]">Weekly Streak Tracker</h3>
              <div className="flex gap-8"><div className="text-center"><p className="text-label-sm text-[#43474e]">Active This Week</p><p className="font-bold text-[#22c55e]">5/7 Days</p></div><div className="text-center"><p className="text-label-sm text-[#43474e]">Best Monthly</p><p className="font-bold text-[#0F2B5B]">22 Days</p></div></div>
            </div>
            <div className="flex justify-between items-center max-w-2xl mx-auto">
              {days.map(([d, on]) => (
                <div key={d} className="flex flex-col items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${on ? "bg-[#22c55e] shadow-md" : "bg-[#eceef0] border-2 border-[#c4c6cf]/20"}`}>{on ? <Icon name="check" className="text-white" /> : <Icon name="circle" className="text-[#c4c6cf]" />}</div>
                  <span className={`text-label-md font-bold ${on ? "text-[#0F2B5B]" : "text-[#43474e]"}`}>{d}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Streak Pot */}
        <section className="mb-12">
          <div className={`${card} p-10 rounded-[2.5rem] bg-gradient-to-br from-white to-[#22c55e]/5 flex flex-col md:flex-row items-center gap-12 border-2 border-[#22c55e]/10`}>
            <div className="w-32 h-32 rounded-full bg-[#22c55e] flex items-center justify-center shadow-xl shadow-[#22c55e]/20 shrink-0"><Icon name="savings" fill className="text-white text-6xl" /></div>
            <div className="flex-1 w-full">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
                <div><h3 className="text-headline-lg text-[#0F2B5B] mb-1">Weekly Streak Pot</h3><p className="text-body-md text-[#43474e]">Keep your streak to claim your reward in <span className="font-bold text-[#22c55e]">6 days</span>.</p></div>
                <div className="text-right"><p className="text-label-sm font-bold text-[#43474e] uppercase tracking-widest mb-1">Current Contribution</p><p className="text-headline-xl font-black text-[#22c55e]">$25.00</p></div>
              </div>
              <div className="relative pt-2">
                <div className="flex items-center justify-between mb-2"><span className="text-label-md font-bold text-[#0F2B5B]">Reward Progress</span><span className="text-label-md font-bold text-[#22c55e]">70% to Milestone</span></div>
                <div className="w-full h-6 bg-[#e6e8ea] rounded-full overflow-hidden border border-white p-1"><div className="h-full bg-gradient-to-r from-[#22c55e]/60 to-[#22c55e] rounded-full shadow-inner" style={{ width: "70%" }} /></div>
                <div className="flex justify-between mt-3 text-label-sm text-[#43474e] font-medium"><span>Day 1</span><span className="text-[#0F2B5B] font-bold">Today: Day 14</span><span>Target: Day 20</span></div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            {/* Continue journey */}
            <section>
              <h3 className="text-headline-md text-[#0F2B5B] mb-6">Continue Your Journey</h3>
              <div className="space-y-4">
                {continueCourses.map((c) => (
                  <div key={c.title} className={`${card} p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6`}>
                    <div className="flex items-center gap-4"><div className={`w-14 h-14 ${c.box} rounded-xl flex items-center justify-center shrink-0`}><Icon name={c.icon} className="text-white" /></div><div><h4 className="font-bold text-[#0F2B5B]">{c.title}</h4><p className="text-label-md text-[#43474e]">{c.sub}</p></div></div>
                    <div className="flex items-center gap-8 w-full md:w-auto">
                      <div className="flex flex-col items-end shrink-0"><p className="text-label-sm font-bold text-[#0F2B5B]">{c.pct}% Complete</p><div className="w-32 h-1.5 bg-[#eceef0] rounded-full mt-1"><div className={`h-full ${c.bar} rounded-full`} style={{ width: `${c.pct}%` }} /></div></div>
                      <Link to="/courses" className="bg-[#0F2B5B] text-white px-5 py-2.5 rounded-xl text-label-md hover:bg-[#0F2B5B]/90 transition-colors shrink-0">Resume</Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Subject mastery */}
            <section>
              <h3 className="text-headline-md text-[#0F2B5B] mb-6">Subject Mastery</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {subjects.map((s) => (<div key={s.name} className={`${card} p-4 rounded-xl text-center`}><p className="text-label-md font-bold text-[#0F2B5B] mb-3">{s.name}</p><Ring pct={s.pct} stroke={s.stroke} /></div>))}
              </div>
            </section>
          </div>

          <div className="space-y-12">
            {/* Achievements */}
            <section>
              <h3 className="text-headline-md text-[#0F2B5B] mb-6">Achievements</h3>
              <div className={`${card} p-6 rounded-2xl`}>
                <div className="grid grid-cols-3 gap-6">
                  {badges.map((b) => (
                    <div key={b.label} className={`flex flex-col items-center gap-2 ${b.locked ? "opacity-40 grayscale" : ""}`}>
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 ${b.box}`}><Icon name={b.icon} fill={!b.locked} className="text-3xl" /></div>
                      <span className={`text-[10px] text-center font-bold leading-tight ${b.locked ? "text-[#43474e]" : "text-[#0F2B5B]"}`}>{b.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Milestones */}
            <section>
              <h3 className="text-headline-md text-[#0F2B5B] mb-6">Recent Milestones</h3>
              <div className={`${card} p-6 rounded-2xl`}>
                <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-[#e6e8ea]">
                  {milestones.map((m) => (
                    <div key={m.title} className="flex items-start gap-4 relative z-10"><div className={`w-6 h-6 rounded-full ${m.box} flex items-center justify-center ring-4 ring-white shrink-0`}><Icon name={m.icon} className="text-white text-[14px]" /></div><div><p className="text-label-md font-bold text-[#0F2B5B]">{m.title}</p><p className="text-label-sm text-[#43474e]">{m.sub}</p></div></div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Footer banner */}
        <section className="mt-16">
          <div className="overflow-hidden rounded-[2rem] bg-[#0F2B5B] flex flex-col md:flex-row h-72 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)]">
            <div className="md:w-3/5 p-10 flex flex-col justify-center text-white">
              <h3 className="text-headline-lg mb-4">Focus on your future.</h3>
              <p className="text-body-md opacity-80 mb-8 max-w-md">Every minute you spend learning today is an investment in the person you'll be tomorrow. Keep the flame burning.</p>
              <Link to="/courses" className="w-fit bg-[#22c55e] text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform">Start Today's Session</Link>
            </div>
            <div className="md:w-2/5 relative hidden md:block"><img alt="" className="absolute inset-0 w-full h-full object-cover" src={IMG.studentsStudying} /><div className="absolute inset-0 bg-gradient-to-r from-[#0F2B5B] via-[#0F2B5B]/20 to-transparent" /></div>
          </div>
        </section>
      </div>
    </PortalShell>
  );
}
