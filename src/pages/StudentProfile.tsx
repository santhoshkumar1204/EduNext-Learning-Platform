import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "../components/Icon";
import Logo from "../components/Logo";
import { getCurrentUser, clearCurrentUser, getEnrolledCourses } from "../lib/database";
import { TeacherCourse } from "../lib/mockData";
import { avatarUrl } from "../lib/images";

// Full port of code.html (Student Profile) — navy/blue palette, green reserved for success/completion accents.
type Tone = "navy" | "green" | "blue" | "gray";
const toneIcon: Record<Tone, string> = {
  navy: "text-[#0F2B5B] bg-[#0F2B5B]/10",
  green: "text-[#15803D] bg-[#22C55E]/10",
  blue: "text-[#2563EB] bg-[#2563EB]/10",
  gray: "text-[#74777f] bg-[#eceef0]",
};
const toneBorder: Record<string, string> = { green: "border-b-4 border-b-[#22C55E]", blue: "border-b-4 border-b-[#2563EB]" };

const overview: { icon: string; value: string; label: string; tone: Tone; accent?: "green" | "blue" }[] = [
  { icon: "menu_book", value: "12", label: "Courses Enrolled", tone: "navy" },
  { icon: "task_alt", value: "8", label: "Courses Completed", tone: "green", accent: "green" },
  { icon: "target", value: "92%", label: "Quiz Accuracy", tone: "blue", accent: "blue" },
  { icon: "schedule", value: "45h", label: "Learning Hours", tone: "navy" },
  { icon: "assignment", value: "24", label: "Assignments", tone: "gray" },
  { icon: "forum", value: "15", label: "Contributions", tone: "gray" },
];

const medalColor: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  yellow: { bg: "bg-yellow-400", border: "border-yellow-500", text: "text-yellow-600", badge: "bg-yellow-600" },
  blue: { bg: "bg-blue-400", border: "border-blue-500", text: "text-blue-600", badge: "bg-blue-600" },
  green: { bg: "bg-green-400", border: "border-green-500", text: "text-green-600", badge: "bg-green-600" },
  orange: { bg: "bg-orange-400", border: "border-orange-500", text: "text-orange-600", badge: "bg-orange-600" },
};
const medals = [
  { name: "Course Champion", sub: "Completed 5 Courses", icon: "workspace_premium", color: "yellow", lvl: "LVL 3" },
  { name: "Quiz Master", sub: "90%+ Accuracy", icon: "quiz", color: "blue", lvl: "LVL 2" },
  { name: "Contributor", sub: "50+ Upvotes", icon: "forum", color: "green", lvl: "LVL 4" },
  { name: "Consistent", sub: "5 Day Streak", icon: "local_fire_department", color: "orange", lvl: "LVL 1" },
];

const community: { icon: string; value: string; label: string; cls: string }[] = [
  { icon: "help", value: "8", label: "Questions Asked", cls: "text-[#0F2B5B]" },
  { icon: "forum", value: "12", label: "Answers Given", cls: "text-[#15803D]" },
  { icon: "thumb_up", value: "42", label: "Helpful Votes", cls: "text-[#2563EB]" },
  { icon: "favorite", value: "156", label: "Community Likes", cls: "text-orange-500" },
];

const dotColor: Record<string, string> = { green: "bg-[#22C55E]", navy: "bg-[#0F2B5B]", blue: "bg-[#2563EB]", gray: "bg-[#74777f]" };
const txtColor: Record<string, string> = { green: "text-[#15803D]", navy: "text-[#0F2B5B]", blue: "text-[#2563EB]", gray: "text-[#74777f]" };
const timeline: { group: string; items: { icon: string; color: string; title: string; meta: string }[] }[] = [
  { group: "TODAY", items: [
    { icon: "quiz", color: "green", title: "Completed Quiz: Game Theory", meta: "Scored 95% • 2 hours ago" },
    { icon: "play_arrow", color: "navy", title: "Continued Lesson: Strategic Moves", meta: "Watched 45 mins • 5 hours ago" },
  ]},
  { group: "YESTERDAY", items: [
    { icon: "upload_file", color: "blue", title: "Submitted Assignment: UI Phase 1", meta: "Pending Review • 1:30 PM" },
    { icon: "forum", color: "gray", title: "Replied to Discussion", meta: "Topic: Nash Equilibrium Examples • 10:15 AM" },
  ]},
  { group: "LAST WEEK", items: [
    { icon: "workspace_premium", color: "green", title: "Earned Certificate", meta: "Course: Intro to Data Structures • Oct 12" },
  ]},
];

const prefs: { icon: string; label: string; value: string; muted?: boolean }[] = [
  { icon: "language", label: "Preferred Language", value: "English" },
  { icon: "accessibility", label: "Accessibility Features", value: "High Contrast, Captions" },
  { icon: "cloud_off", label: "Offline Learning", value: "Enabled" },
  { icon: "target", label: "Learning Goal", value: "Not Set", muted: true },
];

const completion: [string, boolean][] = [["Photo Added", true], ["Email Verified", true], ["Language Selected", true], ["Learning Goal Set", false]];

export default function StudentProfile() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [courses, setCourses] = useState<(TeacherCourse & { progress: number })[]>([]);

  useEffect(() => { getEnrolledCourses(user?.id || 1).then(setCourses as any); }, [user?.id]);
  function logout() { clearCurrentUser(); navigate("/"); }

  const active = courses[0];
  const name = user?.name || "Santhosh Kumar";
  const email = user?.email || "santhosh.k@globaltech.edu";
  const courseTitle = active?.title || "Game Theory Foundations";
  const courseProgress = active?.progress ?? 65;

  const navLink = "text-[#43474e] hover:text-[#0F2B5B] hover:scale-105 transition-transform duration-200 text-label-md font-semibold";
  const dropItem = "flex items-center gap-3 px-4 py-2 hover:bg-[#f2f4f6] transition-colors text-[#191c1e] text-label-md w-full text-left";

  return (
    <div
      className="text-[#191c1e] antialiased min-h-screen flex flex-col bg-[#f7f9fb]"
      style={{ backgroundImage: "radial-gradient(circle at 100% 0%, rgba(173,199,247,0.30) 0%, transparent 25%), radial-gradient(circle at 0% 100%, rgba(173,198,255,0.30) 0%, transparent 25%)", backgroundAttachment: "fixed" }}
    >
      {/* Top nav */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-[#f7f9fb]/80 border-b border-white/20 backdrop-blur-xl shadow-sm">
        <div className="flex justify-between items-center px-4 md:px-10 py-3 max-w-[1280px] mx-auto">
          <Link to="/dashboard" className="flex items-center"><Logo size={28} /></Link>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex gap-6">
              <Link to="/dashboard" className={navLink}>Dashboard</Link>
              <Link to="/my-courses" className={navLink}>My Learning</Link>
              <span className="text-[#0F2B5B] font-bold border-b-2 border-[#0F2B5B] text-label-md">Profile</span>
            </div>
            <div className="flex items-center gap-4 relative">
              <button className="text-[#43474e] hover:text-[#0F2B5B] transition-colors relative"><Icon name="notifications" /><span className="absolute top-0 right-0 w-2 h-2 bg-[#EF4444] rounded-full"></span></button>
              <div className="relative group">
                <button className="flex items-center gap-2 focus:outline-none">
                  <img alt="" className="w-10 h-10 rounded-full border-2 border-[#d6e3ff] object-cover hover:border-[#0F2B5B] transition-colors cursor-pointer" src={avatarUrl(name)} />
                </button>
                <div className="absolute right-0 top-full pt-2 hidden group-hover:block z-50">
                  <div className="w-48 bg-white border border-[#c4c6cf] rounded-xl shadow-lg py-2 overflow-hidden">
                    <Link to="/profile" className={dropItem}><Icon name="person" className="text-[20px]" /> My Profile</Link>
                    <Link to="/settings" className={dropItem}><Icon name="settings" className="text-[20px]" /> Settings</Link>
                    <a href="#" className={dropItem}><Icon name="help" className="text-[20px]" /> Help Center</a>
                    <div className="border-t border-[#c4c6cf] my-1"></div>
                    <button onClick={logout} className={`${dropItem} !text-[#EF4444] hover:!bg-[#ffdad6]/50`}><Icon name="logout" className="text-[20px]" /> Logout</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="flex-grow pt-28 pb-16 px-4 md:px-10 max-w-[1280px] mx-auto w-full flex flex-col gap-12">
        {/* Hero */}
        <section className="glass-panel rounded-2xl p-8 relative overflow-hidden flex flex-col items-center md:items-start gap-8 mt-4 shadow-sm">
          <div className="absolute top-0 left-0 w-full bg-gradient-to-r from-[#0F2B5B] to-[#2563EB] -z-10 rounded-t-2xl h-8"></div>
          <div className="w-full flex flex-col md:flex-row gap-8 items-center md:items-end mt-2">
            <div className="relative flex-shrink-0 z-10">
              <img alt={name} className="w-36 h-36 rounded-full border-4 border-white shadow-md object-cover" src={avatarUrl(name)} />
              <div className="absolute bottom-2 right-2 w-8 h-8 bg-[#22C55E] rounded-full border-2 border-white flex items-center justify-center shadow-sm"><Icon name="verified" className="text-white text-sm" /></div>
            </div>
            <div className="flex-1 flex flex-col md:flex-row md:justify-between w-full gap-6 pb-2">
              <div className="flex flex-col items-center md:items-start z-10">
                <h1 className="text-headline-xl text-[#191c1e] mb-1 text-center md:text-left drop-shadow-sm">{name}</h1>
                <p className="text-body-lg text-[#43474e] flex items-center justify-center md:justify-start gap-2 mb-4"><Icon name="mail" className="text-lg" /> {email}</p>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <div className="flex items-center gap-2 bg-[#22C55E]/15 px-3 py-1.5 rounded-full border border-[#22C55E]/30 shadow-sm"><Icon name="school" className="text-[#15803D] text-sm" /><span className="text-label-md text-[#191c1e] text-sm">Level {user?.level ?? 4} Scholar</span></div>
                  <div className="flex items-center gap-2 bg-[#2563EB]/10 px-3 py-1.5 rounded-full border border-[#2563EB]/20 shadow-sm"><Icon name="stars" fill className="text-[#2563EB] text-sm" /><span className="text-label-md text-[#191c1e] text-sm">{user?.points ?? 150} Points</span></div>
                  <div className="flex items-center gap-2 bg-[#EF4444]/10 px-3 py-1.5 rounded-full border border-[#EF4444]/20 shadow-sm"><Icon name="local_fire_department" fill className="text-[#EF4444] text-sm" /><span className="text-label-md text-[#191c1e] text-sm">{user?.streak ?? 5} Day Streak</span></div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-3 items-center md:items-end lg:items-center justify-end w-full md:w-auto z-10">
                <button className="w-full sm:w-auto bg-[#0F2B5B] text-white px-6 py-2.5 rounded-full text-label-md hover:bg-[#0F2B5B]/90 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"><Icon name="edit" className="text-sm" /> Edit Profile</button>
                <button className="w-full sm:w-auto bg-white text-[#191c1e] px-5 py-2.5 rounded-full text-label-md hover:bg-[#f2f4f6] transition-all shadow-sm border border-[#c4c6cf] flex items-center justify-center gap-2"><Icon name="workspace_premium" className="text-sm" /> Certificates</button>
                <button className="w-full sm:w-auto bg-white text-[#191c1e] px-5 py-2.5 rounded-full text-label-md hover:bg-[#f2f4f6] transition-all shadow-sm border border-[#c4c6cf] flex items-center justify-center gap-2"><Icon name="download" className="text-sm" /> Report</button>
              </div>
            </div>
          </div>
        </section>

        {/* Profile Completion */}
        <section className="glass-panel rounded-xl p-6 border border-[#c4c6cf]/50 flex flex-col md:flex-row items-center gap-6 shadow-sm">
          <div className="w-full md:w-1/3 flex flex-col gap-2 border-r-0 md:border-r border-[#c4c6cf]/50 pr-0 md:pr-6">
            <h3 className="text-on-surface text-lg font-semibold">Profile Completion</h3>
            <div className="flex items-center gap-3">
              <div className="w-full bg-[#e6e8ea] rounded-full h-2 overflow-hidden flex-1"><div className="bg-[#0F2B5B] h-2 rounded-full transition-all duration-1000" style={{ width: "85%" }}></div></div>
              <span className="text-label-md text-[#0F2B5B] font-bold">85%</span>
            </div>
          </div>
          <div className="w-full md:w-2/3 flex flex-wrap gap-4 items-center justify-start md:justify-around">
            {completion.map(([label, done]) => (
              <div key={label} className={`flex items-center gap-2 ${done ? "text-[#191c1e]" : "text-[#74777f] opacity-60"}`}>
                <Icon name={done ? "check_circle" : "radio_button_unchecked"} className={`text-sm ${done ? "text-[#15803D]" : "text-[#74777f]"}`} />
                <span className="text-label-sm">{label}</span>
              </div>
            ))}
            <Link to="/settings" className="text-[#0F2B5B] text-label-md hover:underline ml-auto md:ml-0 text-sm">Complete Now</Link>
          </div>
        </section>

        {/* Learning Overview & Journey */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <section className="lg:col-span-8 flex flex-col gap-8">
            <div className="flex flex-col gap-6">
              <h2 className="text-headline-md text-[#191c1e] flex items-center gap-2"><Icon name="monitoring" className="text-[#0F2B5B]" /> Learning Overview</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {overview.map((s) => (
                  <div key={s.label} className={`glass-panel rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-sm border border-[#c4c6cf]/30 hover:-translate-y-1 hover:shadow-lg transition-all ${s.accent ? toneBorder[s.accent] : ""}`}>
                    <span className={`mb-3 text-3xl p-2 rounded-full ${toneIcon[s.tone]}`}><Icon name={s.icon} className="text-3xl" /></span>
                    <span className="text-headline-lg text-[#191c1e] font-bold">{s.value}</span>
                    <span className="text-label-md text-[#43474e] mt-1">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <h2 className="text-headline-md text-[#191c1e] flex items-center gap-2"><Icon name="route" className="text-[#0F2B5B]" /> Learning Journey</h2>
              <div className="glass-panel rounded-xl overflow-hidden shadow-md border border-[#c4c6cf]/40 flex flex-col md:flex-row">
                <div className="w-full md:w-2/5 h-48 md:h-auto relative">
                  <img alt="" className="w-full h-full object-cover" src={active?.thumbnail || "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80"} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[#191c1e] px-3 py-1 rounded-full text-label-sm shadow-sm flex items-center gap-1 text-xs"><Icon name="play_circle" className="text-[14px] text-[#0F2B5B]" /> Active Course</span>
                </div>
                <div className="w-full md:w-3/5 p-6 flex flex-col justify-between bg-white/50">
                  <div>
                    <h3 className="text-on-surface mb-1 text-xl font-bold">{courseTitle}</h3>
                    <p className="text-body-md text-[#43474e] mb-4 flex items-center gap-2 text-sm"><Icon name="person" className="text-sm" /> Prof. Elena Rostova</p>
                    <div className="flex justify-between items-end mb-2">
                      <p className="text-label-sm text-[#43474e] uppercase tracking-wider font-bold">Progress</p>
                      <span className="text-headline-md text-[#0F2B5B] font-bold text-lg">{courseProgress}%</span>
                    </div>
                    <div className="w-full bg-[#e6e8ea] rounded-full h-2 overflow-hidden mb-6"><div className="bg-[#0F2B5B] h-2 rounded-full transition-all duration-1000" style={{ width: `${courseProgress}%` }}></div></div>
                  </div>
                  <div className="flex justify-end">
                    <Link to={active ? `/course-video/${active.id}` : "/course-video/1"} className="bg-[#0F2B5B] text-white px-6 py-2.5 rounded-full text-label-md hover:bg-[#0F2B5B]/90 transition-all shadow-md hover:shadow-lg flex items-center gap-2">Continue Learning <Icon name="arrow_forward" className="text-sm" /></Link>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="glass-panel p-5 rounded-xl border border-[#c4c6cf]/30 flex items-center gap-4 shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-[#0F2B5B]/10 flex items-center justify-center"><Icon name="schedule" className="text-[#0F2B5B]" /></div>
                  <div><p className="text-label-sm text-[#43474e] mb-0.5">Monthly Learning Hours</p><p className="text-headline-md text-[#191c1e] font-bold">18.5h <span className="text-sm font-normal text-[#15803D] ml-1">+2h this week</span></p></div>
                </div>
                <div className="glass-panel p-5 rounded-xl border border-[#c4c6cf]/30 flex items-center gap-4 shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-[#2563EB]/10 flex items-center justify-center flex-shrink-0"><Icon name="flag" className="text-[#2563EB]" /></div>
                  <div className="flex-1">
                    <p className="text-label-sm text-[#43474e] mb-1">Weekly Goal Progress</p>
                    <div className="flex justify-between items-center mb-1"><span className="text-sm font-medium text-[#191c1e]">3 of 5 hrs</span></div>
                    <div className="w-full bg-[#e6e8ea] rounded-full h-1.5 overflow-hidden"><div className="bg-[#2563EB] h-1.5 rounded-full transition-all duration-1000" style={{ width: "60%" }}></div></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Right sidebar */}
          <aside className="lg:col-span-4 flex flex-col gap-8">
            <div className="glass-panel rounded-xl p-6 shadow-sm border border-[#c4c6cf]/30">
              <h3 className="text-on-surface mb-5 flex items-center gap-2 text-lg font-semibold border-b border-[#c4c6cf] pb-3"><Icon name="tune" className="text-[#0F2B5B]" /> Preferences &amp; Goals</h3>
              <div className="space-y-5">
                {prefs.map((p) => (
                  <div key={p.label} className={`flex items-center gap-4 ${p.muted ? "opacity-60" : ""}`}>
                    <span className="text-[#43474e] bg-[#eceef0] p-2.5 rounded-lg shadow-sm"><Icon name={p.icon} /></span>
                    <div><p className="text-label-sm text-[#43474e]">{p.label}</p><p className={`text-body-md text-[#191c1e] font-medium ${p.muted ? "italic" : ""} text-sm`}>{p.value}</p></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel rounded-xl p-6 shadow-sm border border-[#c4c6cf]/30">
              <h3 className="text-on-surface mb-5 flex items-center gap-2 text-lg font-semibold border-b border-[#c4c6cf] pb-3"><Icon name="groups" className="text-[#0F2B5B]" /> Community Impact</h3>
              <div className="grid grid-cols-2 gap-4">
                {community.map((c) => (
                  <div key={c.label} className="bg-white p-4 rounded-xl border border-[#c4c6cf]/50 text-center shadow-sm hover:shadow-md transition-shadow">
                    <Icon name={c.icon} className={`mb-1 ${c.cls}`} />
                    <p className="text-headline-md text-[#191c1e] font-bold">{c.value}</p>
                    <p className="text-label-sm text-[#43474e] text-xs">{c.label}</p>
                  </div>
                ))}
                <div className="col-span-2 bg-gradient-to-r from-[#2563EB]/15 to-[#0F2B5B]/15 p-4 rounded-xl border border-[#2563EB]/30 text-center shadow-sm flex items-center justify-between">
                  <div className="text-left"><p className="text-label-sm text-[#43474e] uppercase tracking-wider text-xs font-bold">Community Rank</p><p className="text-headline-md text-[#2563EB] font-bold">Top 10%</p></div>
                  <Icon name="military_tech" fill className="text-4xl text-[#2563EB] opacity-80" />
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Achievements & Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-4">
          <section className="col-span-1 md:col-span-7 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-headline-md text-[#191c1e] flex items-center gap-2"><Icon name="emoji_events" className="text-[#0F2B5B]" /> Achievement Showcase</h2>
              <a href="#" className="text-label-md text-[#0F2B5B] hover:underline">View All</a>
            </div>
            <div className="glass-panel rounded-xl p-6 shadow-sm border border-[#c4c6cf]/30 flex-1">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {medals.map((m) => {
                  const c = medalColor[m.color];
                  return (
                    <div key={m.name} className="flex flex-col items-center group cursor-pointer relative bg-white p-4 rounded-xl border border-[#c4c6cf]/30 shadow-sm hover:shadow-md transition-all">
                      <div className="relative w-20 h-24 mb-3 group-hover:-translate-y-1 transition-transform duration-300">
                        <div className={`absolute inset-0 ${c.bg} rounded-t-full rounded-b-xl shadow-inner border-2 ${c.border} overflow-hidden`}><div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent"></div></div>
                        <div className={`absolute top-4 left-1/2 -translate-x-1/2 w-12 h-12 bg-white rounded-full border-2 ${c.border} flex items-center justify-center shadow-md`}><Icon name={m.icon} fill className={`${c.text} text-2xl`} /></div>
                        <div className="absolute bottom-2 w-full text-center"><div className={`inline-block ${c.badge} text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm`}>{m.lvl}</div></div>
                      </div>
                      <span className="text-label-md text-[#191c1e] text-center font-bold">{m.name}</span>
                      <span className="text-xs text-[#43474e] text-center mt-1">{m.sub}</span>
                    </div>
                  );
                })}
                {["Top Performer", "Mentorship"].map((name) => (
                  <div key={name} className="flex flex-col items-center relative bg-white p-4 rounded-xl border border-dashed border-[#c4c6cf]/50 opacity-60">
                    <div className="relative w-20 h-24 mb-3 grayscale">
                      <div className="absolute inset-0 bg-gray-300 rounded-t-full rounded-b-xl border-2 border-gray-400"></div>
                      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-12 bg-white rounded-full border-2 border-gray-400 flex items-center justify-center"><Icon name="lock" className="text-gray-500 text-2xl" /></div>
                    </div>
                    <span className="text-label-md text-[#191c1e] text-center font-bold text-sm">{name}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="col-span-1 md:col-span-5 flex flex-col gap-6">
            <h2 className="text-headline-md text-[#191c1e] flex items-center gap-2"><Icon name="history" className="text-[#0F2B5B]" /> Recent Learning Activity</h2>
            <div className="glass-panel rounded-xl p-6 h-[400px] overflow-y-auto thin-scroll shadow-sm border border-[#c4c6cf]/30 flex-1">
              <div className="relative border-l-2 border-[#e0e3e5] ml-3 space-y-8">
                {timeline.map((grp) => (
                  <div key={grp.group} className="relative pt-2 first:pt-0">
                    <span className="absolute -left-[45px] top-0 text-[10px] font-bold text-[#43474e] uppercase tracking-wide bg-[#f7f9fb] px-1">{grp.group}</span>
                    {grp.items.map((it, i) => (
                      <div key={i} className="relative pl-6 mt-4">
                        <div className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full ${dotColor[it.color]} border-2 border-white shadow-sm z-10`}></div>
                        <div className="bg-white rounded-xl p-4 border border-[#c4c6cf]/50 shadow-sm hover:shadow-md hover:border-[#0F2B5B]/50 transition-all">
                          <p className="text-label-md text-[#191c1e] flex items-center gap-2 font-medium"><Icon name={it.icon} className={`text-sm ${txtColor[it.color]}`} /> {it.title}</p>
                          <p className="text-xs text-[#43474e] mt-1.5 ml-6">{it.meta}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 px-4 md:px-10 flex flex-col md:flex-row justify-between items-center max-w-[1280px] mx-auto bg-white border-t border-[#c4c6cf] mt-auto">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
          <span className="text-headline-md font-bold text-[#0F2B5B]">EduNext</span>
          <span className="text-label-sm text-[#43474e] ml-4">© 2024 EduNext Academy. All rights reserved.</span>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          {["Privacy Policy", "Terms of Service", "Help Center", "Contact Support"].map((l) => (
            <a key={l} href="#" className="text-label-sm text-[#43474e] hover:text-[#0F2B5B] transition-colors">{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
