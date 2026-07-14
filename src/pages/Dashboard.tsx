import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "../components/Icon";
import { getCurrentUser, clearCurrentUser, getEnrolledCourses, getAllAssignments } from "../lib/database";
import { TeacherCourse } from "../lib/mockData";

// Exact port of student_dashboard/code.html (primary #0F2B5B, secondary #2563EB, accent #F59E0B)
type EnrolledCourse = TeacherCourse & { progress: number; lastAccessed?: string; enrollmentStatus?: string };

const HERO_IMGS = [
  "https://images.unsplash.com/photo-1513258496099-48168024aec0?w=700&q=80",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=700&q=80",
  "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=700&q=80",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=700&q=80",
];

const MENU = [
  { label: "Dashboard", icon: "dashboard", to: "/dashboard", active: true },
  { label: "Courses", icon: "menu_book", to: "/courses" },
  { label: "My Courses", icon: "school", to: "/my-courses" },
  { label: "Progress & Streaks", icon: "trending_up", to: "/progress" },
];
const ACTIVITIES = [
  { label: "Quizzes", icon: "quiz", to: "/quizzes" },
  { label: "Assignments", icon: "assignment", to: "/assignments" },
  { label: "Peer Challenges", icon: "group_work", to: "/challenges" },
  { label: "Streak Pot", icon: "local_fire_department", to: "/streak-pot" },
  { label: "My Apprenticeships", icon: "work", to: "/apprenticeships" },
  { label: "Leaderboard", icon: "leaderboard", to: "/leaderboard" },
];
const RESOURCES = [
  { label: "Announcements", icon: "campaign", to: "/announcements" },
  { label: "Downloads", icon: "download", to: "/downloads" },
  { label: "Career Find", icon: "explore", to: "/career-find" },
  { label: "Explore Community", icon: "forum", to: "/community" },
];

const linkCls = "flex items-center gap-3 px-4 py-3 rounded-xl text-[#475569] hover:bg-white hover:text-[#2563eb] hover:shadow-sm font-medium transition-all";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [pending, setPending] = useState(3);

  useEffect(() => {
    if (!user || user.role !== "student") { navigate("/student-login"); return; }
    getEnrolledCourses(user.id!).then(setCourses as any);
    getAllAssignments().then((a) => setPending(a.filter((x) => x.status !== "Submitted").length || 3));
  }, []);

  const first = (user?.name || "Santhosh").split(" ")[0];
  const active = courses[0];
  const badgeColors = ["#0F2B5B", "#2563eb"];

  function logout() { clearCurrentUser(); navigate("/"); }

  return (
    <div className="bg-[#f8fafc] text-[#0f172a] antialiased overflow-x-hidden flex min-h-screen">
      <style>{`
        .glass-panel { background: rgba(255,255,255,0.7); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.2); }
        .sidebar-scroll::-webkit-scrollbar { width: 4px; }
        .sidebar-scroll::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }
        .shadow-soft { box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03); }
        .shadow-soft-lg { box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -2px rgba(0,0,0,0.025); }
        @keyframes heroFade { 0%{opacity:1;transform:scale(1)} 20%{opacity:1;transform:scale(1.05)} 25%{opacity:0;transform:scale(1.05)} 95%{opacity:0;transform:scale(1)} 100%{opacity:1;transform:scale(1)} }
        .hero-carousel-img { position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover; opacity:0; animation: heroFade 20s infinite; }
        .hero-carousel-img:nth-child(1){animation-delay:0s} .hero-carousel-img:nth-child(2){animation-delay:5s}
        .hero-carousel-img:nth-child(3){animation-delay:10s} .hero-carousel-img:nth-child(4){animation-delay:15s}
      `}</style>

      {/* SideNavBar */}
      <nav className="bg-[#f1f5f9] text-[#0f172a] h-screen w-64 fixed left-0 top-0 hidden md:flex flex-col shadow-soft z-50 border-r border-[#e2e8f0]">
        <div className="p-5 border-b border-[#e2e8f0]">
          <Link to="/profile" className="flex items-center gap-4 p-2 hover:bg-[#f1f5f9] rounded-xl cursor-pointer transition-colors group">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0F2B5B] to-[#2563eb] flex items-center justify-center text-white font-bold text-lg shadow-sm">{first.charAt(0)}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#0f172a] truncate group-hover:text-[#2563eb] transition-colors">{user?.name || "Santhoshkumar"}</p>
            </div>
            <Icon name="unfold_more" className="text-[#94a3b8] text-sm" />
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto sidebar-scroll py-6 px-4 flex flex-col gap-8">
          <div>
            <p className="px-3 text-[11px] font-bold text-[#94a3b8] uppercase tracking-widest mb-3">Menu</p>
            <ul className="flex flex-col gap-1">
              {MENU.map((n) => (
                <li key={n.label}>
                  {n.active ? (
                    <Link to={n.to} className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#0F2B5B] bg-white shadow-md font-bold transition-all border border-[#0F2B5B]/10">
                      <Icon name={n.icon} fill className="text-[20px]" /><span className="text-sm">{n.label}</span>
                    </Link>
                  ) : (
                    <Link to={n.to} className={linkCls}><Icon name={n.icon} className="text-[20px]" /><span className="text-sm">{n.label}</span></Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="px-3 text-[11px] font-bold text-[#94a3b8] uppercase tracking-widest mb-3">Activities</p>
            <ul className="flex flex-col gap-1">
              {ACTIVITIES.map((n) => (
                <li key={n.label}><Link to={n.to} className={linkCls}><Icon name={n.icon} className="text-[20px]" /><span className="text-sm">{n.label}</span></Link></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="px-3 text-[11px] font-bold text-[#94a3b8] uppercase tracking-widest mb-3">Resources</p>
            <ul className="flex flex-col gap-1">
              {RESOURCES.map((n) => (
                <li key={n.label}><Link to={n.to} className={linkCls}><Icon name={n.icon} className="text-[20px]" /><span className="text-sm">{n.label}</span></Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-auto p-4 border-t border-[#e2e8f0]/50 flex flex-col gap-1">
          <Link to="/settings" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#475569] hover:bg-white hover:text-[#2563eb] hover:shadow-sm font-medium transition-all"><Icon name="settings" className="text-[20px]" /><span className="text-sm">Settings</span></Link>
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#475569] hover:bg-[#ef4444]/10 hover:text-[#ef4444] font-medium transition-all"><Icon name="logout" className="text-[20px]" /><span className="text-sm">Logout</span></button>
        </div>
      </nav>

      {/* Main */}
      <div className="flex-1 flex flex-col md:ml-64 w-full bg-[#f8fafc] min-h-screen">
        {/* TopNavBar */}
        <header className="bg-[#ffffff]/90 text-[#0f172a] top-0 sticky z-40 backdrop-blur-lg border-b border-[#e2e8f0]/50 flex justify-between items-center w-full px-8 h-16">
          <div className="flex items-center gap-6 flex-1">
            <div className="relative w-full max-w-md">
              <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8] text-[20px]" />
              <input className="pl-10 pr-4 py-2 rounded-lg bg-[#f1f5f9] border-transparent focus:border-[#2563eb] focus:bg-white focus:ring-0 text-sm w-full placeholder-[#94a3b8] transition-all outline-none" placeholder="Search courses, resources..." type="text" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-[#f1f5f9] transition-colors text-[#475569] relative">
              <Icon name="notifications" className="text-[22px]" />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-[#ef4444] rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-[#e2e8f0]/50 cursor-pointer">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-[#0f172a]">{first}</p>
                <p className="text-[10px] font-bold text-[#0F2B5B] uppercase tracking-wider">Level {user?.level ?? 4}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0F2B5B] to-[#2563eb] flex items-center justify-center text-white font-bold text-sm shadow-sm">{first.charAt(0)}</div>
            </div>
          </div>
        </header>

        {/* Canvas */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* Hero */}
          <section className="rounded-3xl p-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-r from-[#0F2B5B] to-[#2563eb] shadow-soft-lg text-white">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#f59e0b]/20 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4"></div>
            <div className="relative z-10 flex flex-col gap-5 max-w-2xl w-full">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full w-fit border border-white/20">
                  <Icon name="local_fire_department" fill className="text-sm text-[#f59e0b]" /><span className="text-xs font-semibold text-white">Learning Streak: {user?.streak ?? 5} Days</span>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full w-fit border border-white/20">
                  <Icon name="target" className="text-sm text-white" /><span className="text-xs font-semibold text-white">Weekly Goal Progress: 3/5 hrs</span>
                </div>
              </div>
              <div>
                <p className="text-white/80 font-semibold text-sm uppercase tracking-wider mb-2">Current Learning Journey</p>
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">Welcome back, {first}</h2>
                <p className="text-white/80 text-lg max-w-xl">Current Active Course: <strong>{active?.title || "Game Theory Foundations"}</strong>. Ready to dive back in?</p>
              </div>
              <div className="mt-2 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 w-full max-w-md">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold">{active?.title || "Game Theory Foundations"}</span>
                  <span className="text-xs text-white/80">Module 4</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2 mb-3">
                  <div className="bg-[#f59e0b] h-2 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]" style={{ width: `${active?.progress ?? 65}%` }}></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/80">{active?.progress ?? 65}% Complete</span>
                  <Link to={active ? `/course-video/${active.id}` : "/my-courses"} className="px-5 py-2 bg-white text-[#0f172a] rounded-lg font-bold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2"><span>Continue Learning</span><Icon name="play_arrow" className="text-[18px]" /></Link>
                </div>
              </div>
            </div>
            <div className="relative z-10 w-full md:w-[400px] h-[280px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 hidden lg:block transform rotate-2 hover:rotate-0 transition-transform duration-500">
              {HERO_IMGS.map((src, i) => (<img key={i} alt="" className="hero-carousel-img" src={src} />))}
            </div>
          </section>

          {/* Stat cards */}
          <section>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <StatCard label="Current Streak" value={`${user?.streak ?? 5}`} suffix="days" icon="local_fire_department" box="bg-[#f59e0b]/10 text-[#f59e0b]" />
              <StatCard label="Total Points" value={`${user?.points ?? 150}`} icon="emoji_events" box="bg-[#2563eb]/10 text-[#2563eb]" />
              <StatCard label="Courses Enrolled" value={`${courses.length || 12}`} icon="school" box="bg-[#0F2B5B]/10 text-[#0F2B5B]" />
              <StatCard label="Assignments Pending" value={`${pending}`} icon="assignment_late" box="bg-[#ef4444]/10 text-[#ef4444]" />
            </div>
          </section>

          {/* Continue Learning */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-xl text-[#0f172a]">Continue Learning</h3>
              <Link to="/courses" className="text-sm font-semibold text-[#2563eb] hover:text-[#2563eb]/80 flex items-center gap-1 transition-colors">View All Courses <Icon name="arrow_forward" className="text-[18px]" /></Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(courses.slice(0, 2).length ? courses.slice(0, 2) : [null, null]).map((c, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden border border-[#e2e8f0] shadow-soft hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col group cursor-pointer">
                  <div className="h-48 w-full relative overflow-hidden">
                    <img alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={c?.thumbnail || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80"} />
                    <div className="absolute top-3 left-4"><span className="px-2.5 py-1 text-white text-[10px] font-bold uppercase tracking-wider rounded-md shadow-sm" style={{ background: badgeColors[i % 2] }}>{c?.category || (i === 0 ? "Strategy" : "Security")}</span></div>
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <h4 className="font-bold text-lg text-[#0f172a] line-clamp-1 group-hover:text-[#2563eb] transition-colors mb-2">{c?.title || (i === 0 ? "Game Theory Foundations" : "Cyber Security Essentials")}</h4>
                    <p className="text-xs text-[#475569] mb-4">Instructor: Dr. Sarah Jenkins</p>
                    <div className="flex items-center gap-4 mb-4 text-xs text-[#94a3b8] font-medium">
                      <div className="flex items-center gap-1"><Icon name="schedule" className="text-sm" /><span>{c?.duration || "12h 30m"}</span></div>
                      <div className="flex items-center gap-1"><Icon name="menu_book" className="text-sm" /><span>8/12 Lessons</span></div>
                    </div>
                    <div className="mt-auto space-y-3">
                      <div className="w-full bg-[#e2e8f0] rounded-full h-1.5 overflow-hidden"><div className="h-1.5 rounded-full transition-all duration-1000" style={{ width: `${c?.progress ?? (i === 0 ? 65 : 32)}%`, background: badgeColors[i % 2] }}></div></div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#0f172a]">{c?.progress ?? (i === 0 ? 65 : 32)}% Complete</span>
                        <Link to={c ? `/course-video/${c.id}` : "/my-courses"} className="px-4 py-2 bg-[#2563eb] text-white rounded-lg text-xs font-bold hover:bg-[#2563eb]/80 transition-colors">Continue Learning</Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {/* Explore Card */}
              <Link to="/courses" className="bg-[#f1f5f9] rounded-2xl border-2 border-[#e2e8f0] border-dashed flex flex-col items-center justify-center text-center p-6 hover:bg-[#e2e8f0] transition-all duration-300 hover:-translate-y-2 hover:shadow-lg cursor-pointer min-h-[280px] group">
                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-[#0F2B5B] shadow-sm mb-4 group-hover:scale-110 transition-transform"><Icon name="search" className="text-[28px]" /></div>
                <h4 className="font-bold text-lg text-[#0f172a] mb-2">Explore Catalog</h4>
                <p className="text-sm text-[#475569] max-w-[200px]">Find your next course and learn something new today.</p>
                <span className="mt-4 px-4 py-2 bg-white border border-[#e2e8f0] rounded-lg text-sm font-semibold hover:bg-[#f1f5f9] transition-colors">Browse Courses</span>
              </Link>
            </div>
          </section>

          {/* Lower grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Upcoming Assignments */}
              <section>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-lg text-[#0f172a]">Upcoming Assignments</h3>
                  <Link to="/assignments" className="text-sm font-semibold text-[#2563eb] hover:underline">View All</Link>
                </div>
                <div className="bg-white rounded-2xl p-1 border border-[#e2e8f0] shadow-soft">
                  <div className="flex items-center justify-between p-4 hover:bg-[#f1f5f9] rounded-xl transition-colors group cursor-pointer border-b border-[#e2e8f0]/50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[#ef4444]/10 text-[#ef4444] flex items-center justify-center shrink-0"><Icon name="schedule" /></div>
                      <div><h5 className="font-bold text-sm text-[#0f172a] group-hover:text-[#2563eb] transition-colors">Network Analysis Report</h5><p className="text-xs text-[#475569] mt-0.5">Cyber Security Essentials</p></div>
                    </div>
                    <div className="text-right"><p className="text-sm font-bold text-[#ef4444]">Due Tomorrow</p><p className="text-xs text-[#94a3b8] mt-0.5">11:59 PM</p></div>
                  </div>
                  <div className="flex items-center justify-between p-4 hover:bg-[#f1f5f9] rounded-xl transition-colors group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[#f59e0b]/10 text-[#f59e0b] flex items-center justify-center shrink-0"><Icon name="assignment" /></div>
                      <div><h5 className="font-bold text-sm text-[#0f172a] group-hover:text-[#2563eb] transition-colors">Strategic Matrix Essay</h5><p className="text-xs text-[#475569] mt-0.5">Game Theory Foundations</p></div>
                    </div>
                    <div className="text-right"><p className="text-sm font-bold text-[#0f172a]">Oct 24</p><p className="text-xs text-[#94a3b8] mt-0.5">5:00 PM</p></div>
                  </div>
                </div>
              </section>

              {/* Community Preview */}
              <section>
                <div className="flex items-center justify-between mb-5"><h3 className="font-bold text-lg text-[#0f172a]">Community Discussions</h3></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Link to="/community" className="bg-white rounded-2xl p-5 border border-[#e2e8f0] shadow-soft hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group block">
                    <div className="flex items-center gap-2 mb-3"><span className="px-2 py-0.5 bg-[#0F2B5B]/10 text-[#0F2B5B] text-[10px] font-bold rounded uppercase tracking-wide">Popular</span><span className="text-xs text-[#94a3b8] font-medium">Cyber Security</span></div>
                    <h5 className="font-bold text-sm text-[#0f172a] mb-2 group-hover:text-[#2563eb] transition-colors line-clamp-2">Can someone explain symmetric vs asymmetric encryption with real-world examples?</h5>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2"><div className="w-6 h-6 bg-[#e2e8f0] rounded-full flex items-center justify-center text-[10px] font-bold text-[#475569]">AK</div><span className="text-xs font-medium text-[#475569]">Alex K.</span></div>
                      <div className="flex items-center gap-1 text-[#94a3b8]"><Icon name="chat_bubble" className="text-[14px]" /><span className="text-xs font-medium">12</span></div>
                    </div>
                  </Link>
                  <Link to="/community" className="bg-white rounded-2xl p-5 border border-[#e2e8f0] shadow-soft hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group block">
                    <div className="flex items-center gap-2 mb-3"><span className="px-2 py-0.5 bg-[#2563eb]/10 text-[#2563eb] text-[10px] font-bold rounded uppercase tracking-wide">Recent Doubt</span><span className="text-xs text-[#94a3b8] font-medium">Game Theory</span></div>
                    <h5 className="font-bold text-sm text-[#0f172a] mb-2 group-hover:text-[#2563eb] transition-colors line-clamp-2">Stuck on the Nash Equilibrium calculation for Question 3. Any hints?</h5>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2"><div className="w-6 h-6 bg-[#e2e8f0] rounded-full flex items-center justify-center text-[10px] font-bold text-[#475569]">MS</div><span className="text-xs font-medium text-[#475569]">Maria S.</span></div>
                      <div className="flex items-center gap-1 text-[#94a3b8]"><Icon name="chat_bubble" className="text-[14px]" /><span className="text-xs font-medium">4</span></div>
                    </div>
                  </Link>
                </div>
              </section>
            </div>

            {/* Right widgets */}
            <div className="flex flex-col gap-6">
              <section className="bg-white rounded-2xl p-5 border border-[#e2e8f0] shadow-soft">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-base text-[#0f172a] flex items-center gap-2"><Icon name="cloud_done" className="text-[20px] text-[#0F2B5B]" /> Offline Materials</h3>
                </div>
                <div className="p-4 bg-[#f1f5f9] rounded-xl mb-4 flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#0F2B5B] shadow-sm"><Icon name="folder_zip" /></div>
                  <div><p className="text-sm font-bold text-[#0f172a]">Game Theory Ch.1-3</p><p className="text-xs text-[#475569]">142 MB • Synced 2h ago</p></div>
                </div>
                <Link to="/downloads" className="block text-center w-full py-2 bg-white border border-[#e2e8f0] text-[#0f172a] rounded-lg text-sm font-semibold hover:bg-[#f1f5f9] transition-colors">Manage Downloads</Link>
              </section>
              <section className="bg-gradient-to-br from-white to-[#f1f5f9] rounded-2xl p-5 border border-[#e2e8f0] shadow-soft flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-white rounded-full mb-3 flex items-center justify-center shadow-sm text-[#2563eb]"><Icon name="view_in_ar" className="text-[24px]" /></div>
                <h4 className="font-bold text-sm text-[#0f172a] mb-1">Make your own VR</h4>
                <p className="text-xs text-[#475569] mb-4 px-2">Build a Google Cardboard headset for immersive learning.</p>
                <button className="w-full py-2 bg-[#2563eb]/10 text-[#2563eb] rounded-lg text-sm font-semibold hover:bg-[#2563eb]/20 transition-colors">Start Tutorial</button>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function StatCard({ label, value, suffix, icon, box }: { label: string; value: string; suffix?: string; icon: string; box: string }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-[#e2e8f0] shadow-soft flex items-center justify-between hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div>
        <p className="font-medium text-sm text-[#475569] mb-2">{label}</p>
        <div className="flex items-baseline gap-1">
          <p className="text-3xl font-extrabold text-[#0f172a]">{value}</p>
          {suffix && <span className="text-sm font-medium text-[#94a3b8]">{suffix}</span>}
        </div>
      </div>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${box}`}><Icon name={icon} fill className="text-[24px]" /></div>
    </div>
  );
}
