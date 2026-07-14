import { Link } from "react-router-dom";
import Icon from "../components/Icon";
import Logo from "../components/Logo";
import { getCurrentUser } from "../lib/database";
import { avatarUrl } from "../lib/images";

// Full port of "teacher profile/code.html" — navy/blue palette (brand-primary #0F2B5B), green = success accents only.
const badges = [
  { icon: "verified", label: "Verified Educator", cl: "bg-[#0F2B5B]/10 text-[#0F2B5B]" },
  { icon: "workspace_premium", label: "Top Mentor", cl: "bg-[#F59E0B]/10 text-[#D97706]" },
  { icon: "forum", label: "Community Contributor", cl: "bg-[#22C55E]/10 text-[#15803D]" },
];
const stats = [["Courses Published", "12"], ["Active Students", "1,240"], ["Assignments Reviewed", "4,520"], ["Community Contributions", "350"]];
const actions: [string, string, string][] = [
  ["add_circle", "Create Course", "/teacher-courses/new"],
  ["upload_file", "Upload Materials", "#"],
  ["assignment_add", "Create Assignment", "/teacher-assignments"],
  ["fact_check", "Review Submissions", "/teacher-assignments"],
  ["analytics", "View Analytics", "/teacher-reports"],
];
const courses = [
  { title: "Advanced Machine Learning", img: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&q=80", rating: "4.9/5", students: "245 Students", pending: "18 Assignments Pending", progress: 82 },
  { title: "Digital Marketing Strategy", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80", rating: "4.8/5", students: "180 Students", pending: "5 Assignments Pending", progress: 75 },
];
const reviewQueue = [
  { course: "Advanced ML", student: "Sarah Jenkins", submitted: "2 hours ago" },
  { course: "Digital Marketing", student: "Michael Chang", submitted: "5 hours ago" },
  { course: "Advanced ML", student: "Elena Rodriguez", submitted: "Yesterday" },
];
const doubts = [
  { q: '"Can someone explain Nash Equilibrium?"', priority: "High Priority", cl: "bg-[#EF4444]/10 text-[#DC2626]", time: "1h ago" },
  { q: '"Need help with Python Linked Lists"', priority: "Medium Priority", cl: "bg-[#F59E0B]/10 text-[#D97706]", time: "3h ago" },
  { q: '"Difference between Classification and Regression"', priority: "Medium Priority", cl: "bg-[#F59E0B]/10 text-[#D97706]", time: "5h ago" },
];
const engagement = [
  { label: "Attendance Rate", value: "94%", w: 94 },
  { label: "Assignment Submission", value: "88%", w: 88 },
  { label: "Course Completion", value: "91%", w: 91 },
  { label: "Discussion Participation", value: "High", w: 85 },
];
const achievements = [
  { icon: "library_books", text: "15 Courses Published" },
  { icon: "groups", text: "300+ Students Guided" },
  { icon: "star", text: "4.8 Average Rating" },
  { icon: "forum", text: "120 Community Answers" },
  { icon: "task_alt", text: "95% Review Rate" },
];
const activity = [
  { text: "Published new module", time: "1h ago", active: true },
  { text: "Answered student doubt", time: "3h ago" },
  { text: "Reviewed 5 assignments", time: "Yesterday" },
  { text: "Updated course syllabus", time: "Oct 24" },
];

export default function TeacherProfile() {
  const user = getCurrentUser();
  const name = user?.name || "Prof. David Chen";
  const navLink = "text-[#43474e] hover:text-[#0F2B5B] transition-colors hover:scale-95 duration-150";

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] min-h-screen flex flex-col pt-16">
      {/* Top nav */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-[#f7f9fb]/80 backdrop-blur-xl border-b border-[#c4c6cf]/20 shadow-sm">
        <div className="flex justify-between items-center h-16 px-4 md:px-10 max-w-[1280px] mx-auto">
          <Link to="/teacher-dashboard"><Logo size={28} /></Link>
          <div className="hidden md:flex gap-6 items-center">
            <Link to="/teacher-dashboard" className={navLink}>Dashboard</Link>
            <Link to="/teacher-courses" className={navLink}>Courses</Link>
            <Link to="/teacher-students" className={navLink}>Students</Link>
            <a href="#" className={navLink}>Resources</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/teacher-courses/new" className="hidden md:block bg-[#0F2B5B] text-white text-label-md px-4 py-2 rounded-full hover:scale-105 transition-transform shadow-md hover:shadow-lg">Create Class</Link>
            <div className="w-8 h-8 rounded-full overflow-hidden bg-[#e0e3e5] border border-[#c4c6cf]/30 flex items-center justify-center"><img alt="" className="w-full h-full object-cover" src={avatarUrl(name)} /></div>
            <button className="md:hidden text-[#191c1e]"><Icon name="menu" /></button>
          </div>
        </div>
      </nav>

      <main className="max-w-[1280px] mx-auto w-full pb-6">
        {/* Banner */}
        <div className="w-full bg-gradient-to-r from-[#0F2B5B] to-[#2563EB] h-32 md:h-48 relative"></div>
        <div className="px-4 md:px-10 -mt-16 md:-mt-20 relative z-10 flex flex-col gap-10 lg:gap-16">
          {/* Profile header */}
          <section className="bg-white rounded-lg p-6 md:p-8 shadow-sm border border-[#c4c6cf]/20 flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="relative w-32 h-32 md:w-40 md:h-40 shrink-0">
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-md"><img alt={name} className="w-full h-full object-cover" src={avatarUrl(name)} /></div>
              <button className="absolute bottom-2 right-2 w-8 h-8 bg-white border border-[#c4c6cf] rounded-full flex items-center justify-center text-[#0F2B5B] shadow-sm hover:bg-[#f2f4f6] transition-colors"><Icon name="edit" className="text-[16px]" /></button>
            </div>
            <div className="flex-1 flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-headline-lg text-[#191c1e]">{name}</h1>
                  <div className="flex gap-2 flex-wrap">{badges.map((b) => <span key={b.label} className={`flex items-center gap-1 px-2.5 py-1 text-label-sm rounded-full ${b.cl}`}><Icon name={b.icon} className="text-[14px]" /> {b.label}</span>)}</div>
                </div>
                <p className="text-body-lg text-[#43474e]">{user?.title || "Senior Educator & Curriculum Architect"}</p>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                <span className="flex items-center gap-1.5 text-label-sm text-[#43474e]"><Icon name="school" className="text-[16px]" /> {user?.institution || "Global Tech University"}</span>
                <span className="flex items-center gap-1.5 text-label-sm text-[#43474e]"><Icon name="work_history" className="text-[16px]" /> 15+ Years Experience</span>
                <span className="flex items-center gap-1.5 text-label-sm text-[#43474e]"><Icon name="calendar_today" className="text-[16px]" /> Joined EduNext: Oct 2023</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-1">{["Machine Learning", "AI Ethics", "Data Science"].map((t) => <span key={t} className="px-3 py-1 bg-[#f2f4f6] border border-[#c4c6cf]/30 text-[#43474e] text-label-sm rounded-full">{t}</span>)}</div>
            </div>
            <div className="flex flex-col gap-3 w-full md:w-auto shrink-0">
              <button className="w-full bg-[#0F2B5B] text-white text-label-md px-6 py-2.5 rounded-full hover:bg-[#0F2B5B]/90 transition-colors shadow-sm flex items-center justify-center gap-2"><Icon name="edit" className="text-[18px]" /> Edit Profile</button>
              <button className="w-full bg-white border border-[#c4c6cf] text-[#191c1e] text-label-md px-6 py-2.5 rounded-full hover:bg-[#f2f4f6] transition-colors shadow-sm flex items-center justify-center gap-2"><Icon name="download" className="text-[18px]" /> Download Report</button>
              <Link to="/teacher-settings" className="w-full bg-white border border-[#c4c6cf] text-[#191c1e] text-label-md px-6 py-2.5 rounded-full hover:bg-[#f2f4f6] transition-colors shadow-sm flex items-center justify-center gap-2"><Icon name="settings" className="text-[18px]" /> Account Settings</Link>
            </div>
          </section>

          {/* Stats */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {stats.map(([l, v]) => (<div key={l} className="bg-white rounded-lg p-5 shadow-sm border border-[#c4c6cf]/20 hover:-translate-y-1 transition-transform duration-300"><div className="text-label-md text-[#43474e] mb-2">{l}</div><div className="text-headline-xl text-[#191c1e]">{v}</div></div>))}
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column */}
            <div className="lg:col-span-2 flex flex-col gap-10">
              {/* Quick Actions */}
              <section>
                <h2 className="text-headline-md text-[#191c1e] mb-4 flex items-center gap-2"><Icon name="bolt" /> Quick Actions</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {actions.map(([icon, label, to]) => (
                    <Link key={label} to={to} className="flex flex-col items-center justify-center gap-3 p-4 bg-white border border-[#c4c6cf]/20 rounded-lg hover:shadow-md hover:-translate-y-1 transition-all">
                      <div className="w-12 h-12 rounded-full bg-[#0F2B5B]/10 flex items-center justify-center text-[#0F2B5B]"><Icon name={icon} /></div>
                      <span className="text-label-sm text-center text-[#191c1e]">{label}</span>
                    </Link>
                  ))}
                </div>
              </section>

              {/* Current Active Courses */}
              <section>
                <h2 className="text-headline-md text-[#191c1e] mb-6 flex items-center gap-2"><Icon name="dashboard" /> Current Active Courses</h2>
                <div className="flex flex-col gap-4">
                  {courses.map((c) => (
                    <div key={c.title} className="bg-white rounded-lg overflow-hidden shadow-sm border border-[#c4c6cf]/20 flex flex-col sm:flex-row hover:shadow-md transition-shadow">
                      <div className="sm:w-1/3 h-48 sm:h-auto relative"><img alt={c.title} className="w-full h-full object-cover" src={c.img} /></div>
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="text-headline-md text-[#191c1e]">{c.title}</h3>
                            <span className="flex items-center gap-1 text-label-sm text-[#191c1e] bg-[#eceef0] py-1 px-2 rounded-md"><Icon name="star" className="text-[14px] text-[#F59E0B]" /> {c.rating}</span>
                          </div>
                          <div className="flex gap-4 mb-4 flex-wrap">
                            <span className="text-label-sm text-[#43474e] flex items-center gap-1"><Icon name="group" className="text-[16px]" /> {c.students}</span>
                            <span className="text-label-sm text-[#43474e] flex items-center gap-1"><Icon name="assignment" className="text-[16px]" /> {c.pending}</span>
                          </div>
                          <div className="flex flex-col gap-1 mb-4">
                            <div className="flex justify-between text-label-sm text-[#43474e]"><span>Course Progress (Avg)</span><span className="text-[#15803D] font-bold">{c.progress}%</span></div>
                            <div className="h-2 bg-[#eceef0] rounded-full overflow-hidden"><div className="h-full bg-[#22C55E] rounded-full transition-all duration-1000" style={{ width: `${c.progress}%` }}></div></div>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <Link to="/teacher-courses" className="bg-[#0F2B5B] text-white text-label-md px-5 py-2 rounded-full hover:bg-[#0F2B5B]/90 transition-colors flex items-center gap-2">Continue Managing <Icon name="arrow_forward" className="text-[18px]" /></Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Assignment Review Queue */}
              <section>
                <h2 className="text-headline-md text-[#191c1e] mb-6 flex items-center gap-2"><Icon name="checklist" /> Assignment Review Queue</h2>
                <div className="bg-white rounded-lg shadow-sm border border-[#c4c6cf]/20 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#f2f4f6] border-b border-[#c4c6cf]/20">
                          <th className="p-4 text-label-sm text-[#43474e] font-semibold">Course</th>
                          <th className="p-4 text-label-sm text-[#43474e] font-semibold">Student Name</th>
                          <th className="p-4 text-label-sm text-[#43474e] font-semibold">Submitted</th>
                          <th className="p-4 text-label-sm text-[#43474e] font-semibold text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#c4c6cf]/20">
                        {reviewQueue.map((r, i) => (
                          <tr key={i} className="hover:bg-[#f7f9fb] transition-colors">
                            <td className="p-4 text-body-md text-[#191c1e]">{r.course}</td>
                            <td className="p-4 text-body-md text-[#191c1e]">{r.student}</td>
                            <td className="p-4 text-label-sm text-[#43474e]">{r.submitted}</td>
                            <td className="p-4 text-right"><Link to="/teacher-assignments" className="text-[#0F2B5B] text-label-sm font-semibold hover:underline">Review</Link></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            </div>

            {/* Right column */}
            <div className="flex flex-col gap-8">
              {/* Student Doubts */}
              <section className="bg-white rounded-lg p-6 shadow-sm border border-[#c4c6cf]/20">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-headline-md text-[#191c1e] flex items-center gap-2"><Icon name="help_center" /> Student Doubts</h2>
                </div>
                <div className="flex flex-col gap-4">
                  {doubts.map((d, i) => (
                    <div key={i} className="p-4 bg-[#f7f9fb] rounded-md border border-[#c4c6cf]/20">
                      <div className="flex justify-between items-start mb-2">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider ${d.cl}`}>{d.priority}</span>
                        <span className="text-[12px] text-[#43474e]">{d.time}</span>
                      </div>
                      <p className="text-body-md text-[#191c1e] mb-3">{d.q}</p>
                      <Link to="/teacher-community" className="text-[#0F2B5B] text-label-sm font-semibold hover:underline flex items-center gap-1">Respond <Icon name="chevron_right" className="text-[14px]" /></Link>
                    </div>
                  ))}
                </div>
                <Link to="/teacher-community" className="block text-center w-full mt-4 py-2 border border-[#c4c6cf] text-[#191c1e] text-label-md rounded-full hover:bg-[#f2f4f6] transition-colors">View All Doubts</Link>
              </section>

              {/* Student Engagement */}
              <section className="bg-white rounded-lg p-6 shadow-sm border border-[#c4c6cf]/20">
                <h2 className="text-headline-md text-[#191c1e] mb-6 flex items-center gap-2"><Icon name="monitoring" /> Student Engagement</h2>
                <div className="flex flex-col gap-5">
                  {engagement.map((e) => (
                    <div key={e.label} className="flex flex-col gap-1.5">
                      <div className="flex justify-between text-label-sm"><span className="text-[#191c1e]">{e.label}</span><span className="font-bold text-[#191c1e]">{e.value}</span></div>
                      <div className="h-2 bg-[#eceef0] rounded-full overflow-hidden"><div className="h-full bg-[#0F2B5B] rounded-full transition-all duration-1000" style={{ width: `${e.w}%` }}></div></div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Achievements */}
              <section className="bg-white rounded-lg p-6 shadow-sm border border-[#c4c6cf]/20">
                <h2 className="text-headline-md text-[#191c1e] mb-6 flex items-center gap-2"><Icon name="emoji_events" /> Achievements</h2>
                <div className="flex flex-col gap-3">
                  {achievements.map((a) => (
                    <div key={a.text} className="flex items-center gap-3 p-3 bg-[#f7f9fb] rounded-md border border-[#c4c6cf]/20">
                      <Icon name={a.icon} className="text-[#0F2B5B]" /><span className="text-body-md text-[#191c1e]">{a.text}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Recent Activity */}
              <section className="bg-white rounded-lg p-6 shadow-sm border border-[#c4c6cf]/20">
                <h2 className="text-headline-md text-[#191c1e] mb-6 flex items-center gap-2"><Icon name="history" /> Recent Activity</h2>
                <div className="relative border-l-2 border-[#c4c6cf]/30 ml-3 flex flex-col gap-6">
                  {activity.map((a, i) => (
                    <div key={i} className="relative pl-6">
                      <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white ${a.active ? "bg-[#0F2B5B]" : "bg-[#c4c6cf]"}`}></div>
                      <p className="text-body-md text-[#191c1e]">{a.text}</p>
                      <p className="text-label-sm text-[#43474e]">{a.time}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#f2f4f6] w-full py-12 border-t border-[#c4c6cf]/30 mt-12">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-4">
            <span className="text-headline-md text-[#0F2B5B] font-bold">EduNext</span>
            <p className="text-label-sm text-[#191c1e]">© 2024 EduNext Platform. Empowering Lifelong Educators.</p>
          </div>
          <div className="flex flex-wrap gap-6 md:justify-end items-center">
            {["Privacy Policy", "Terms of Service", "Help Center", "Teaching Standards"].map((l) => (
              <a key={l} href="#" className="text-label-sm text-[#43474e] hover:text-[#0F2B5B] underline transition-all">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
