import { Link } from "react-router-dom";
import PortalShell from "../components/PortalShell";
import Icon from "../components/Icon";
import { IMG, avatarUrl } from "../lib/images";

// Exact port of student_apprenticeship/code.html
const stats = [
  { label: "Available Opportunities", value: "12", color: "text-[#0F2B5B]" },
  { label: "Applied", value: "3", color: "text-[#455f88]" },
  { label: "Active Apprenticeships", value: "1", color: "text-[#0F2B5B]" },
  { label: "Completed", value: "2", color: "text-[#191c1e]" },
];

const opportunities = [
  { tag: "AI/ML", title: "Machine Learning Apprentice", mentor: "Dr. Amarjeet Kaur", weeks: "8 Weeks", mode: "Remote", modeIcon: "public", seats: "5 Seats Available", skills: ["Python", "Scikit-Learn", "Data Analysis"], deadline: "30 June 2026" },
  { tag: "Web Dev", title: "Frontend Developer Apprentice", mentor: "Sarah Jenkins", weeks: "6 Weeks", mode: "Hybrid", modeIcon: "business", seats: "2 Seats Available", skills: ["HTML/CSS", "JavaScript", "React Basics"], deadline: "15 July 2026" },
];

export default function Apprenticeships() {
  return (
    <PortalShell active="My Apprenticeships">
      <div className="max-w-[1200px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Breadcrumb & Header */}
        <div className="col-span-1 lg:col-span-12 mb-2 flex flex-col gap-4">
          <nav className="flex items-center text-label-sm text-[#43474e] gap-2">
            <Link to="/dashboard" className="hover:text-[#0F2B5B] transition-colors">Dashboard</Link>
            <Icon name="chevron_right" className="text-[16px]" />
            <span className="text-[#191c1e] font-medium">Apprenticeships</span>
          </nav>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-headline-lg text-[#191c1e]">Apprenticeships</h1>
              <p className="text-body-md text-[#43474e] mt-1">Apply your learning through real-world projects, mentorship, and industry-aligned experiences.</p>
            </div>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
            {stats.map((s) => (
              <div key={s.label} className="glass-panel p-4 rounded-xl flex flex-col">
                <span className="text-label-sm text-[#43474e] uppercase tracking-wider">{s.label}</span>
                <span className={`text-headline-md mt-1 ${s.color}`}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Left column (8) */}
        <div className="col-span-1 lg:col-span-8 flex flex-col gap-6">
          {/* Recommended */}
          <div className="relative overflow-hidden rounded-xl bg-[#0F2B5B] text-white shadow-sm flex flex-col md:flex-row">
            <div className="absolute inset-0 z-0 opacity-20"><img alt="" className="w-full h-full object-cover" src={IMG.heroClassroom} /></div>
            <div className="relative z-10 p-6 md:p-8 flex-1 flex flex-col justify-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0F2B5B] text-white text-label-sm mb-4 w-max">
                <Icon name="star" className="text-[16px]" /><span>Recommended For You</span>
              </div>
              <h2 className="text-headline-lg mb-2">Cyber Security Apprentice</h2>
              <p className="text-body-md text-[#d6e3ff] mb-6">Recommended because you completed: Cyber Security Essentials</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div className="flex flex-col"><span className="text-label-sm text-[#d6e3ff] uppercase">Duration</span><span className="text-label-md mt-1 flex items-center gap-1"><Icon name="schedule" className="text-[16px]" /> 6 Weeks</span></div>
                <div className="flex flex-col"><span className="text-label-sm text-[#d6e3ff] uppercase">Mode</span><span className="text-label-md mt-1 flex items-center gap-1"><Icon name="public" className="text-[16px]" /> Remote</span></div>
                <div className="flex flex-col"><span className="text-label-sm text-[#d6e3ff] uppercase">Mentor</span><span className="text-label-md mt-1 flex items-center gap-1"><Icon name="person" className="text-[16px]" /> Industry Expert</span></div>
              </div>
              <button className="bg-[#0F2B5B] text-white px-6 py-2.5 rounded-lg text-label-md hover:bg-[#0A1F44] transition-colors shadow-sm w-max font-bold">View Details &amp; Apply</button>
            </div>
          </div>

          {/* Available Opportunities */}
          <div className="glass-panel rounded-2xl p-6 md:p-8 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-headline-md text-[#191c1e] flex items-center gap-2"><Icon name="work" className="text-[#0F2B5B]" /> Available Opportunities</h2>
            </div>
            <div className="flex flex-wrap gap-3 pb-4 border-b border-[#c4c6cf]/30">
              {[["Domain", "AI/ML", "Web Dev", "Cyber Security"], ["Skill Level", "Beginner", "Intermediate", "Advanced"], ["Duration", "< 4 Weeks", "4-8 Weeks", "> 8 Weeks"], ["Mode", "Remote", "Hybrid", "On-Site"]].map((opts, i) => (
                <select key={i} className="bg-white border border-[#c4c6cf] text-[#191c1e] text-label-sm rounded-lg px-3 py-1.5 focus:ring-[#0F2B5B] focus:border-[#0F2B5B] outline-none">
                  {opts.map((o) => <option key={o}>{o}</option>)}
                </select>
              ))}
            </div>
            <div className="flex flex-col gap-4">
              {opportunities.map((o) => (
                <div key={o.title} className="border border-[#c4c6cf]/50 rounded-xl p-5 hover:border-[#0F2B5B]/50 transition-colors bg-white">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#eceef0] text-[#43474e] text-[11px] mb-2"><span>{o.tag}</span></div>
                      <h3 className="text-lg font-semibold text-[#191c1e] mb-1">{o.title}</h3>
                      <p className="text-[#43474e] text-sm flex items-center gap-2 mb-3"><Icon name="person" className="text-[16px]" /> Mentor: {o.mentor}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-[#43474e] mb-4">
                        <span className="flex items-center gap-1"><Icon name="schedule" className="text-[16px]" /> {o.weeks}</span>
                        <span className="flex items-center gap-1"><Icon name={o.modeIcon} className="text-[16px]" /> {o.mode}</span>
                        <span className="flex items-center gap-1"><Icon name="groups" className="text-[16px]" /> {o.seats}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-[#43474e] uppercase">Required Skills:</span>
                        <div className="flex gap-2 flex-wrap">{o.skills.map((s) => <span key={s} className="px-2 py-1 bg-[#f2f4f6] rounded text-xs text-[#191c1e]">{s}</span>)}</div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3 justify-between min-w-[140px]">
                      <div className="text-right"><span className="text-xs text-[#43474e] block">Deadline</span><span className="text-sm text-[#EF4444] font-medium">{o.deadline}</span></div>
                      <button className="w-full px-4 py-2 bg-[#0F2B5B] text-white rounded-lg text-sm hover:bg-[#0F2B5B]/90 transition-colors">Apply</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column (4) */}
        <div className="col-span-1 lg:col-span-4 flex flex-col gap-6">
          {/* My Applications */}
          <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4">
            <h3 className="text-headline-md text-[#191c1e] flex items-center gap-2"><Icon name="fact_check" className="text-[#455f88]" /> My Applications</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between p-3 rounded-xl border border-[#c4c6cf]/30 bg-white">
                <div className="flex flex-col"><span className="text-label-md text-[#191c1e]">Cyber Security Apprentice</span><span className="text-xs text-[#43474e] mt-0.5">Applied: 2 Days Ago</span></div>
                <span className="px-2.5 py-1 bg-[#22C55E]/15 text-[#15803D] rounded text-xs">Accepted</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl border border-[#c4c6cf]/30 bg-white">
                <div className="flex flex-col"><span className="text-label-md text-[#191c1e]">Data Science Intern</span><span className="text-xs text-[#43474e] mt-0.5">Applied: 1 Week Ago</span></div>
                <span className="px-2.5 py-1 bg-[#455f88]/10 text-[#455f88] rounded text-xs">Under Review</span>
              </div>
            </div>
          </div>

          {/* Learning Path Sync */}
          <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4 border border-[#0F2B5B]/20 bg-[#0F2B5B]/5">
            <h3 className="text-headline-md text-[#191c1e] flex items-center gap-2"><Icon name="alt_route" className="text-[#0F2B5B]" /> Learning Path Sync</h3>
            <div className="flex flex-col gap-3 relative">
              <div className="absolute left-4 top-8 bottom-8 w-[2px] bg-[#c4c6cf]/30 -z-0"></div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full text-[#15803D] flex items-center justify-center shrink-0 z-10 bg-white"><Icon name="check_circle" className="text-[16px]" /></div>
                <div className="flex flex-col pt-1"><span className="text-xs text-[#43474e] uppercase">Completed</span><span className="text-sm text-[#191c1e]">Cyber Security Course</span></div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full text-[#15803D] flex items-center justify-center shrink-0 z-10 bg-white"><Icon name="sports_score" className="text-[16px]" /></div>
                <div className="flex flex-col pt-1"><span className="text-xs text-[#43474e] uppercase">Quiz Score</span><span className="text-sm text-[#191c1e]">92%</span></div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full text-[#0F2B5B] flex items-center justify-center shrink-0 z-10 bg-white"><Icon name="verified" className="text-[16px]" /></div>
                <div className="flex flex-col pt-1"><span className="text-xs uppercase text-[#0F2B5B]">Eligible For</span><span className="text-sm text-[#191c1e] font-semibold">Cyber Security Apprenticeship</span></div>
              </div>
            </div>
          </div>

          {/* Certificates */}
          <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4">
            <h3 className="text-headline-md text-[#191c1e] flex items-center gap-2"><Icon name="workspace_premium" className="text-[#d97706]" /> Certificates</h3>
            <div className="grid grid-cols-2 gap-3">
              {[["Machine Learning", "ML"], ["Cyber Security", "CS"]].map(([name, seed]) => (
                <div key={name} className="border border-[#c4c6cf]/30 rounded-xl p-3 flex flex-col items-center text-center bg-white">
                  <img alt={name} className="w-16 h-16 object-contain mb-2" src={avatarUrl(seed)} />
                  <span className="text-xs text-[#191c1e] font-medium leading-tight">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-12 h-16"></div>
      </div>
    </PortalShell>
  );
}
