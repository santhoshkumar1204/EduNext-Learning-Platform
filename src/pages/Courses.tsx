import { Link, useNavigate } from "react-router-dom";
import Icon from "../components/Icon";
import { getCurrentUser, clearCurrentUser } from "../lib/database";
import { IMG, COURSE_IMG } from "../lib/images";

// Exact port of student-courses/code.html (primary #0F2B5B, secondary #22C55E)
const NAV: { title: string; items: { label: string; icon: string; to: string }[] }[] = [
  { title: "Menu", items: [
    { label: "Dashboard", icon: "dashboard", to: "/dashboard" },
  ]},
];
const MENU_AFTER = [
  { label: "My Courses", icon: "local_library", to: "/my-courses" },
  { label: "Progress & Streaks", icon: "trending_up", to: "/progress" },
];
const ACTIVITIES = [
  { label: "Quizzes", icon: "quiz", to: "/quizzes" },
  { label: "Assignments", icon: "assignment", to: "/assignments" },
  { label: "Peer Challenges", icon: "groups", to: "/challenges" },
  { label: "Streak Pot", icon: "local_fire_department", to: "/streak-pot" },
  { label: "My Apprenticeships", icon: "work_outline", to: "/apprenticeships" },
  { label: "Leaderboard", icon: "leaderboard", to: "/leaderboard" },
];
const RESOURCES = [
  { label: "Announcements", icon: "campaign", to: "/announcements" },
  { label: "Downloads", icon: "download", to: "/downloads" },
  { label: "Career Find", icon: "search_insights", to: "/career-find" },
  { label: "Explore Community", icon: "forum", to: "/community" },
  { label: "Cardboard VR", icon: "view_in_ar", to: "#" },
];
const idle = "flex items-center gap-3 px-4 py-3 rounded-xl text-[#43474e] hover:bg-[#e6e8ea] transition-colors";

function StandardCard({ img, cat, catColor, title, instructor, rating, reviews, weeks }: any) {
  return (
    <div className="bg-[#f7f9fb]/80 backdrop-blur-md border border-[#c4c6cf]/20 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col">
      <div className="relative h-40 overflow-hidden">
        <img alt="" className="w-full h-full object-cover" src={img} />
        <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded text-[11px] flex items-center gap-1"><Icon name="schedule" className="text-[14px]" /> {weeks}</div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="mb-2"><span className="text-label-sm uppercase tracking-wider" style={{ color: catColor }}>{cat}</span></div>
        <h3 className="text-[18px] font-semibold leading-snug text-[#191c1e] mb-2 line-clamp-2">{title}</h3>
        <div className="flex items-center justify-between text-[#43474e] text-[13px] mb-4 mt-auto">
          <div className="flex items-center gap-1"><Icon name="person" className="text-[16px]" /><span>{instructor}</span></div>
          <div className="flex items-center gap-1 text-[#22C55E] font-medium"><Icon name="star" fill className="text-[16px]" /><span>{rating}</span><span className="text-[#74777f] text-[12px]">({reviews})</span></div>
        </div>
        <div className="flex gap-2 mt-2 pt-4 border-t border-[#c4c6cf]/20">
          <button className="flex-1 border border-[#c4c6cf] text-[#191c1e] rounded-lg py-2 text-label-md hover:bg-[#e0e3e5] transition-colors">Details</button>
          <Link to="/my-courses" className="flex-1 bg-[#0F2B5B] text-white rounded-lg py-2 text-label-md hover:bg-[#1a365d] transition-colors shadow-sm text-center">Enroll</Link>
        </div>
      </div>
    </div>
  );
}

export default function Courses() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  function logout() { clearCurrentUser(); navigate("/"); }

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] text-body-md flex min-h-screen selection:bg-[#0F2B5B]/20">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-[#f7f9fb] border-r border-[#c4c6cf]/20 flex flex-col z-40">
        <div className="px-6 py-8 flex items-center gap-3"><img src="/logo.png" alt="EduNext logo" className="w-10 h-10 rounded-full object-contain shrink-0" /><div className="flex flex-col"><h1 className="text-headline-md font-bold text-[#0F2B5B] tracking-tight">EduNext</h1><span className="text-label-sm text-[#43474e] uppercase tracking-widest mt-1">Premium Learning</span></div></div>
        <nav className="flex-1 overflow-y-auto px-4 pb-8 flex flex-col gap-1">
          <div className="text-[11px] font-bold text-[#c4c6cf] uppercase tracking-wider px-4 mb-2">Menu</div>
          <Link to="/dashboard" className={idle}><Icon name="dashboard" className="text-[22px]" /><span className="text-label-md">Dashboard</span></Link>
          <Link to="/courses" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white shadow-sm text-[#0F2B5B] font-bold transition-all"><Icon name="school" fill className="text-[22px]" /><span className="text-label-md">Courses</span></Link>
          {MENU_AFTER.map((n) => <Link key={n.label} to={n.to} className={idle}><Icon name={n.icon} className="text-[22px]" /><span className="text-label-md">{n.label}</span></Link>)}
          <div className="text-[11px] font-bold text-[#c4c6cf] uppercase tracking-wider px-4 mt-6 mb-2">Activities</div>
          {ACTIVITIES.map((n) => <Link key={n.label} to={n.to} className={idle}><Icon name={n.icon} className="text-[22px]" /><span className="text-label-md">{n.label}</span></Link>)}
          <div className="text-[11px] font-bold text-[#c4c6cf] uppercase tracking-wider px-4 mt-6 mb-2">Resources</div>
          {RESOURCES.map((n) => <Link key={n.label} to={n.to} className={idle}><Icon name={n.icon} className="text-[22px]" /><span className="text-label-md">{n.label}</span></Link>)}
          <div className="mt-auto pt-8"><button onClick={logout} className={idle + " w-full text-left"}><Icon name="logout" className="text-[22px]" /><span className="text-label-md">Logout</span></button></div>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 min-h-screen w-full md:ml-64 flex flex-col relative">
        <header className="px-4 md:px-10 pt-10 pb-6 flex flex-col gap-6 bg-gradient-to-b from-[#f7f9fb] to-[#f7f9fb]">
          <div className="flex items-center justify-between"><h1 className="text-headline-xl text-[#0F2B5B]">Discover Courses</h1></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[["library_books", "Total Courses", "1,248", "bg-[#1a365d]/10 text-[#0F2B5B]"], ["category", "Categories", "36", "bg-[#0F2B5B]/10 text-[#0F2B5B]"], ["translate", "Languages", "14", "bg-[#003374]/10 text-[#0F2B5B]"], ["school", "Active Teachers", "312", "bg-[#0F2B5B]/5 text-[#0F2B5B]"]].map(([icon, label, val, box]) => (
              <div key={label} className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-sm rounded-xl p-4 flex items-center gap-4 hover:-translate-y-1 transition-transform">
                <div className={`h-12 w-12 rounded-full flex items-center justify-center ${box}`}><Icon name={icon} /></div>
                <div><p className="text-label-sm text-[#43474e]">{label}</p><p className="text-headline-md text-[#191c1e]">{val}</p></div>
              </div>
            ))}
          </div>
        </header>

        {/* Search & filters */}
        <section className="px-4 md:px-10 py-2 sticky top-0 z-30 bg-[#f7f9fb]/80 backdrop-blur-lg border-b border-[#c4c6cf]/20 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between max-w-[1280px] mx-auto">
            <div className="relative w-full md:w-1/3"><Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-[#74777f]" /><input className="w-full pl-12 pr-4 py-3 bg-[#f7f9fb] border border-[#c4c6cf] rounded-xl text-body-md focus:ring-2 focus:ring-[#0F2B5B]/20 focus:border-[#0F2B5B] outline-none" placeholder="Search for subjects, skills, or teachers..." /></div>
            <div className="flex-1 flex overflow-x-auto pb-2 md:pb-0 gap-2 w-full items-center">
              {["Category", "Difficulty", "Duration"].map((f) => <button key={f} className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-[#e6e8ea] rounded-full hover:text-[#0F2B5B] transition-colors"><span className="text-label-md">{f}</span><Icon name="keyboard_arrow_down" className="text-[18px]" /></button>)}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 w-full md:w-auto justify-end"><span className="text-label-sm text-[#43474e]">Sort by:</span><select className="bg-transparent border-none text-label-md text-[#0F2B5B] focus:ring-0 cursor-pointer outline-none"><option>Most Relevant</option><option>Highest Rated</option><option>Newest</option></select></div>
          </div>
        </section>

        <div className="max-w-[1280px] mx-auto w-full px-4 md:px-10 py-10 flex flex-col gap-16">
          {/* Trending */}
          <section>
            <div className="flex justify-between items-end mb-6"><h2 className="text-headline-lg text-[#191c1e]">Trending Now</h2><a className="text-label-md text-[#0F2B5B] hover:underline flex items-center gap-1" href="#">See all <Icon name="arrow_forward" className="text-[18px]" /></a></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { img: IMG.studentsStudying, badge: "Trending", badgeIcon: "local_fire_department", badgeBg: "bg-[#0F2B5B] text-white", cats: [["Computer Science", "bg-[#0F2B5B]/10 text-[#0F2B5B]"], ["Intermediate", "bg-[#e0e3e5] text-[#43474e]"]], title: "Advanced Machine Learning Algorithms", desc: "Master predictive modeling and neural networks with hands-on Python projects.", who: "Dr. Robert Chen", init: "DR", rating: "4.9 (2.1k)" },
                { img: COURSE_IMG["Data Analytics"], badge: "Newly Added", badgeIcon: "new_releases", badgeBg: "bg-[#22C55E] text-white", cats: [["Business Analytics", "bg-[#003374]/20 text-[#0F2B5B]"], ["Beginner", "bg-[#e0e3e5] text-[#43474e]"]], title: "Data-Driven Decision Making", desc: "Learn how to translate raw data into actionable strategic insights.", who: "Sarah Jenkins", init: "SJ", rating: "4.8 (850)" },
              ].map((c) => (
                <div key={c.title} className="group relative bg-white/60 backdrop-blur-lg border border-white/50 shadow-md rounded-2xl overflow-hidden flex flex-col md:flex-row hover:shadow-lg transition-all duration-300">
                  <div className="w-full md:w-2/5 h-48 md:h-auto relative">
                    <img alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={c.img} />
                    <div className={`absolute top-4 left-4 ${c.badgeBg} px-3 py-1 rounded-full text-label-sm flex items-center gap-1 shadow-sm`}><Icon name={c.badgeIcon} className="text-[16px]" /> {c.badge}</div>
                  </div>
                  <div className="p-6 flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex gap-2 mb-3">{c.cats.map(([t, cl]) => <span key={t} className={`px-2 py-1 rounded text-label-sm ${cl}`}>{t}</span>)}</div>
                      <h3 className="text-headline-md text-[#191c1e] mb-2 line-clamp-2">{c.title}</h3>
                      <p className="text-body-md text-[#43474e] line-clamp-2 mb-4">{c.desc}</p>
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-[#0F2B5B]/20 flex items-center justify-center text-label-sm text-[#0F2B5B] font-bold">{c.init}</div>
                        <div className="flex flex-col"><span className="text-label-sm text-[#191c1e]">{c.who}</span><div className="flex items-center text-[#22C55E]"><Icon name="star" fill className="text-[14px]" /><span className="text-[12px] ml-1">{c.rating}</span></div></div>
                      </div>
                      <Link to="/my-courses" className="bg-gradient-to-b from-[#0F2B5B] to-[#1a365d] text-white px-5 py-2 rounded-lg text-label-md hover:shadow-md hover:scale-105 transition-all">Enroll</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* All courses */}
          <section>
            <div className="flex justify-between items-end mb-6"><h2 className="text-headline-lg text-[#191c1e]">All Available Courses</h2></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <StandardCard img={COURSE_IMG["Web Development"]} cat="Web Development" catColor="#0F2B5B" title="Full-Stack React & Node.js Masterclass" instructor="Alex Morgan" rating="4.9" reviews="1.2k" weeks="8 Weeks" />
              <StandardCard img={COURSE_IMG["Data Analytics"]} cat="Finance" catColor="#0F2B5B" title="Corporate Finance Fundamentals" instructor="Elena Rostova" rating="4.7" reviews="890" weeks="6 Weeks" />
              <StandardCard img={COURSE_IMG["Programming"]} cat="Programming" catColor="#0F2B5B" title="Python for Data Science" instructor="Dr. Anita Rao" rating="4.8" reviews="3.4k" weeks="10 Weeks" />
              <StandardCard img={COURSE_IMG["Cyber Security"]} cat="Cyber Security" catColor="#0F2B5B" title="Ethical Hacking Essentials" instructor="Michael Chen" rating="4.6" reviews="1.1k" weeks="9 Weeks" />
            </div>
            <div className="mt-8 flex justify-center"><button className="px-6 py-3 border border-[#74777f] rounded-full text-label-md text-[#191c1e] hover:bg-[#e0e3e5] transition-colors">Load More Courses</button></div>
          </section>
        </div>
      </main>
    </div>
  );
}
