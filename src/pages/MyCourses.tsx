import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../components/Icon";
import PortalShell from "../components/PortalShell";
import { getCurrentUser, getEnrolledCourses } from "../lib/database";
import { TeacherCourse } from "../lib/mockData";
import { courseImage } from "../lib/images";

// Exact port of the My Courses design (found in teacher_settings/code.html — "EduNext - My Courses")
type EnrolledCourse = TeacherCourse & { progress: number; lastAccessed?: string; enrollmentStatus?: string };

const STATS = [
  { icon: "book", color: "text-[#003374]", value: "4", label: "Enrolled" },
  { icon: "check_circle", color: "text-[#15803D]", value: "12", label: "Completed" },
  { icon: "pending", color: "text-blue-600", value: "2", label: "In Progress" },
  { icon: "local_fire_department", color: "text-orange-500", value: "14d", label: "Streak" },
  { icon: "schedule", color: "text-purple-600", value: "128h", label: "Hours" },
  { icon: "stars", color: "text-yellow-500", value: "1,250", label: "Points" },
];
const FILTERS = ["All Courses", "In Progress", "Completed", "Not Started", "Saved"];
const SAMPLE: { title: string; school: string; status: string; progress: number; cat: string }[] = [
  { title: "Cyber Security Essentials", school: "University of Tech", status: "In Progress", progress: 32, cat: "Cyber Security" },
  { title: "Digital Marketing Strategy", school: "Global Business School", status: "Completed", progress: 100, cat: "Marketing" },
  { title: "Mathematics and Physics: Collaboration for Discovery", school: "Science Institute", status: "Not Started", progress: 0, cat: "Mathematics" },
];

export default function MyCourses() {
  const user = getCurrentUser();
  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [filter, setFilter] = useState("All Courses");

  useEffect(() => { if (user?.id) getEnrolledCourses(user.id).then(setCourses as any); }, [user?.id]);

  const cards = courses.length
    ? courses.map((c) => ({ title: c.title, school: c.code || "EduNext", status: c.progress >= 100 ? "Completed" : c.progress > 0 ? "In Progress" : "Not Started", progress: c.progress, cat: c.category || "", id: c.id }))
    : SAMPLE;
  const shown = cards.filter((c) => filter === "All Courses" ? true : filter === "Saved" ? false : c.status === filter);

  return (
    <PortalShell active="My Courses">
      <div className="flex flex-col xl:flex-row gap-8 max-w-[1600px] mx-auto">
        {/* Center canvas */}
        <div className="flex-1">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-headline-lg text-[#0F2B5B] mb-2 tracking-tight">My Learning Journey</h2>
              <p className="text-body-md text-[#43474e]">Welcome back! Here's an overview of your progress.</p>
            </div>
            <div className="hidden md:flex gap-3">
              <button className="bg-[#eceef0] text-[#191c1e] px-4 py-2 rounded-lg text-label-md hover:bg-[#e6e8ea] transition-colors flex items-center gap-2"><Icon name="sort" className="text-[20px]" /> Sort</button>
              <Link to="/courses" className="bg-[#0F2B5B] text-white px-4 py-2 rounded-lg text-label-md hover:bg-[#1a365d] transition-colors shadow-sm flex items-center gap-2"><Icon name="search" className="text-[20px]" /> Find Course</Link>
            </div>
          </div>

          {/* Bento stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
            {STATS.map((s) => (
              <div key={s.label} className="glass-card rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-sm hover:-translate-y-1 transition-transform duration-300">
                <Icon name={s.icon} fill className={`mb-2 text-[28px] ${s.color}`} />
                <span className="text-headline-md text-[#0F2B5B]">{s.value}</span>
                <span className="text-label-sm text-[#43474e]">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Continue learning */}
          <h3 className="text-headline-md text-[#0F2B5B] mb-4 tracking-tight">Pick up where you left off</h3>
          <div className="glass-card rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-md mb-10 group relative border border-[#c4c6cf]/30">
            <div className="md:w-2/5 h-48 md:h-auto relative overflow-hidden bg-[#f2f4f6]">
              <img alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src={courseImage("Machine Learning")} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F2B5B]/80 via-[#0F2B5B]/20 to-transparent" />
              <div className="absolute bottom-4 left-4 flex gap-2"><span className="bg-[#0F2B5B]/90 text-white px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">Machine Learning</span></div>
            </div>
            <div className="p-6 md:w-3/5 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2"><h4 className="text-headline-md text-[#0F2B5B] leading-tight">Advanced Machine Learning Project</h4><button className="text-[#43474e] hover:text-[#2563eb] transition-colors"><Icon name="star" /></button></div>
                <p className="text-body-md text-[#43474e] mb-4 flex items-center gap-2"><Icon name="person" className="text-[18px]" /> Dr. Alan Turing</p>
              </div>
              <div>
                <div className="flex justify-between text-label-sm text-[#43474e] mb-2"><span>Up Next: <strong className="text-[#0F2B5B]">Neural Networks Architecture</strong></span><span className="font-bold text-[#2563EB]">68%</span></div>
                <div className="w-full bg-[#e6e8ea] rounded-full h-3 mb-6 overflow-hidden"><div className="h-full bg-[#2563EB] rounded-full" style={{ width: "68%" }} /></div>
                <div className="flex justify-between items-center">
                  <p className="text-label-sm text-[#43474e] flex items-center gap-1"><Icon name="schedule" className="text-[16px]" /> Approx. 45 mins left in module</p>
                  <Link to="/courses" className="bg-gradient-to-b from-[#0F2B5B] to-[#0A1F44] text-white px-6 py-2.5 rounded-lg text-label-md font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2">Continue <Icon name="play_circle" className="text-[18px]" /></Link>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex overflow-x-auto pb-4 mb-6 gap-2 border-b border-[#c4c6cf]">
            {FILTERS.map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-full text-label-md whitespace-nowrap transition-colors ${filter === f ? "bg-[#1a365d] text-[#86a0cd]" : "border border-[#c4c6cf] text-[#43474e] hover:bg-[#f2f4f6]"}`}>{f}</button>
            ))}
          </div>

          {/* Course grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20 md:pb-0">
            {shown.map((c: any) => {
              const done = c.status === "Completed", started = c.status === "In Progress";
              return (
                <div key={c.title} className="glass-card rounded-xl overflow-hidden flex flex-col shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group border border-[#c4c6cf]/30">
                  <div className="h-40 relative overflow-hidden bg-[#eceef0]">
                    <img alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={courseImage(c.cat)} />
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute top-3 left-3">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${done ? "bg-[#22C55E]/90 text-white flex items-center gap-1" : started ? "bg-[#f7f9fb]/90 text-[#0F2B5B]" : "bg-[#e0e3e5]/90 text-[#43474e]"}`}>{done && <Icon name="check" className="text-[12px]" />}{c.status}</span>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h4 className="text-body-lg font-bold text-[#0F2B5B] mb-1 line-clamp-2 group-hover:text-[#003374] transition-colors">{c.title}</h4>
                    <p className="text-label-sm text-[#43474e] mb-4 flex items-center gap-1"><Icon name="school" className="text-[14px]" /> {c.school}</p>
                    <div className="mt-auto">
                      <div className="flex justify-between text-label-sm text-[#43474e] mb-1.5"><span>Progress</span><span className={`font-bold ${done ? "text-[#15803D]" : "text-[#0F2B5B]"}`}>{c.progress}%</span></div>
                      <div className="w-full bg-[#e0e3e5] rounded-full h-2 mb-4 overflow-hidden"><div className={`h-full rounded-full ${done ? "bg-[#22C55E]" : started ? "bg-blue-500" : "bg-[#2563EB]"}`} style={{ width: `${c.progress}%` }} /></div>
                      {done ? (
                        <button className="w-full bg-[#f2f4f6] border border-[#c4c6cf] text-[#43474e] py-2 rounded-lg text-label-md font-bold hover:bg-[#eceef0] transition-colors flex justify-center items-center gap-2"><Icon name="workspace_premium" className="text-[18px]" /> View Certificate</button>
                      ) : started ? (
                        <Link to={c.id ? `/course-video/${c.id}` : "/courses"} className="block w-full text-center border border-[#c4c6cf] text-[#0F2B5B] py-2 rounded-lg text-label-md font-bold hover:bg-[#f2f4f6] transition-colors">Continue Learning</Link>
                      ) : (
                        <Link to={c.id ? `/course-video/${c.id}` : "/courses"} className="block w-full text-center bg-[#d6e3ff] text-[#001b3c] py-2 rounded-lg text-label-md font-bold hover:bg-[#adc7f7] transition-colors">Start Course</Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right aside */}
        <aside className="w-full xl:w-80 flex flex-col gap-8 flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#003374] text-[#6a9dff] flex items-center justify-center text-headline-md font-bold">{(user?.name || "JD").split(" ").map((w) => w[0]).slice(0, 2).join("")}</div>
            <div><h3 className="text-body-lg font-bold text-[#0F2B5B] leading-tight">{user?.name || "Jane Doe"}</h3><p className="text-label-sm text-[#43474e]">Lifelong Learner</p></div>
          </div>

          <div>
            <h3 className="text-label-md text-[#43474e] uppercase tracking-wider mb-4 flex items-center gap-2"><Icon name="emoji_events" className="text-[18px]" /> Achievements</h3>
            <div className="glass-card rounded-xl p-4 border border-[#c4c6cf]/50">
              <div className="flex justify-between items-center mb-4"><div className="flex items-center gap-2"><Icon name="local_fire_department" className="text-orange-500" /><span className="text-body-md font-bold text-[#0F2B5B]">14 Day Streak</span></div><span className="text-label-sm bg-orange-100 text-orange-800 px-2 py-0.5 rounded">Active</span></div>
              <div className="flex justify-between items-center mb-4"><div className="flex items-center gap-2"><Icon name="stars" className="text-yellow-500" /><span className="text-body-md font-bold text-[#0F2B5B]">1,250 Points</span></div><span className="text-label-sm text-[#43474e]">Top 15%</span></div>
              <div className="pt-4 border-t border-[#c4c6cf]/50">
                <p className="text-label-sm text-[#43474e] mb-2">Recent Badges (4)</p>
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><Icon name="bolt" className="text-[16px]" /></div>
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600"><Icon name="done_all" className="text-[16px]" /></div>
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600"><Icon name="dark_mode" className="text-[16px]" /></div>
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600"><Icon name="local_fire_department" className="text-[16px]" /></div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-label-md text-[#43474e] uppercase tracking-wider mb-4 flex items-center gap-2"><Icon name="history" className="text-[18px]" /> Recent Activity</h3>
            <div className="relative pl-3 border-l-2 border-[#e0e3e5] space-y-6">
              {[["Today, 10:30 AM", "Completed Lesson 4: Linear Regression", "Advanced Machine Learning", true], ["Yesterday", "Earned 'Quiz Master' Badge", "Scored 100% on Security Basics Quiz", false], ["Oct 24", "Enrolled in new course", "Mathematics and Physics", false]].map(([t, a, s, hl]) => (
                <div key={a as string} className="relative">
                  <div className={`absolute -left-[17px] top-1 w-3 h-3 rounded-full border-2 border-[#f7f9fb] ${hl ? "bg-[#22C55E]" : "bg-[#e0e3e5]"}`} />
                  <p className="text-label-sm text-[#43474e] mb-0.5">{t as string}</p>
                  <p className="text-body-md text-[#0F2B5B] font-medium">{a as string}</p>
                  <p className={`text-label-sm ${hl ? "text-[#15803D]" : "text-[#43474e]"}`}>{s as string}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-label-md text-[#43474e] uppercase tracking-wider mb-4 flex items-center gap-2"><Icon name="lightbulb" className="text-[18px]" /> Recommended</h3>
            <div className="space-y-3">
              {[["analytics", "bg-blue-100 text-blue-600", "Data Analytics", "Based on Machine Learning"], ["palette", "bg-pink-100 text-pink-600", "UI/UX Design", "Popular in your cohort"]].map(([ic, cl, t, d]) => (
                <Link to="/courses" key={t} className="glass-card rounded-lg p-3 flex gap-3 hover:bg-[#f2f4f6] transition-colors cursor-pointer border border-[#c4c6cf]/30">
                  <div className={`w-12 h-12 rounded flex-shrink-0 flex items-center justify-center ${cl}`}><Icon name={ic} /></div>
                  <div><h4 className="text-label-md font-bold text-[#0F2B5B]">{t}</h4><p className="text-[11px] text-[#43474e]">{d}</p></div>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </PortalShell>
  );
}
