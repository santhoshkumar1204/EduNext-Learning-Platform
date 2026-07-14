import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../components/Icon";
import TeacherShell from "../components/TeacherShell";
import { getCurrentUser, getTeacherCourses } from "../lib/database";
import { TeacherCourse } from "../lib/mockData";
import { courseImage } from "../lib/images";

// Exact port of teacher_dashboard/code.html (primary #0F2B5B)
const KPIS = [
  { icon: "library_books", label: "Total Courses", value: "12", tag: "+2 this week" },
  { icon: "groups", label: "Total Students", value: "850", tag: "+15 this week" },
  { icon: "assignment_turned_in", label: "Total Assignments", value: "24", tag: "" },
  { icon: "help_center", label: "Total Quizzes", value: "18", tag: "3 need review" },
];
const ACTIONS = [
  { icon: "add_circle", label: "Create New Course", primary: true, to: "/teacher-courses/new" },
  { icon: "quiz", label: "Create Quiz", to: "/teacher-quizzes" },
  { icon: "assignment", label: "Create Assignment", to: "/teacher-assignments" },
  { icon: "campaign", label: "Publish Announcement", to: "/teacher-announcements" },
];
const FALLBACK_COURSES = [
  { title: "Fundamentals of Machine Learning", code: "CS-401", semester: "Fall Semester", students: 342, lessons: 24, completion: "68%", status: "Active", cat: "Programming" },
  { title: "Advanced Python Programming", code: "CS-305", semester: "Fall Semester", students: 285, lessons: 32, completion: "74%", status: "Active", cat: "Programming" },
  { title: "Data Analytics and Visualization", code: "CS-410", semester: "Upcoming Spring", students: 0, lessons: 12, completion: "--%", status: "Draft", cat: "Data Analytics" },
];
const ACTIVITY = [
  { icon: "person_add", title: "New enrollments", body: "in Machine Learning", sub: "45 students joined in the last 24h", time: "10 mins ago" },
  { icon: "task", title: "Assignment submissions", body: "for Week 3", sub: "82/100 submitted. 18 pending review.", time: "2 hours ago", action: "Review Now" },
  { icon: "quiz", title: "Quiz completions", body: "in Python Adv.", sub: "Course average: 85%. 2 students failed.", time: "5 hours ago" },
];

export default function TeacherDashboard() {
  const user = getCurrentUser();
  const [courses, setCourses] = useState<TeacherCourse[]>([]);

  useEffect(() => { if (user?.id) getTeacherCourses(user.id).then(setCourses); }, [user?.id]);

  const cards = courses.length >= 2
    ? courses.slice(0, 3).map((c, i) => ({ title: c.title, code: c.code || "CS-10" + i, semester: c.semester || "Fall Semester", students: c.students ?? 0, lessons: 24, completion: (c.completion ?? 0) + "%", status: c.status || "Active", cat: c.category || "Programming", thumb: c.thumbnail }))
    : FALLBACK_COURSES;

  return (
    <TeacherShell active="Dashboard">
      <div className="max-w-[1280px] mx-auto space-y-12">
        {/* Welcome + KPIs */}
        <section>
          <div className="mb-8 flex justify-between items-end">
            <div>
              <h1 className="text-headline-lg text-[#191c1e]">Welcome back, {user?.name || "Dr. Amarjeet Kaur"}</h1>
              <p className="text-[#3e4a3e] mt-2">Here's an overview of your teaching dashboard today.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {KPIS.map((k) => (
              <div key={k.label} className="bg-white p-6 rounded-xl border border-[#bdcabb] flex flex-col justify-between">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-lg bg-[#f3f4f6] flex items-center justify-center text-[#191c1e]"><Icon name={k.icon} /></div>
                  {k.tag && <span className="bg-[#f3f4f6] text-[#191c1e] px-2 py-1 rounded text-xs">{k.tag}</span>}
                </div>
                <div><p className="text-[#3e4a3e] text-label-bold mb-1">{k.label}</p><h3 className="text-3xl font-bold text-[#191c1e]">{k.value}</h3></div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-label-bold text-lg text-[#191c1e] mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ACTIONS.map((a) => (
              <Link key={a.label} to={a.to} className={`p-5 rounded-xl flex items-center gap-4 transition-colors text-left ${a.primary ? "bg-[#0F2B5B] hover:bg-[#0A1F44] text-white" : "bg-white border border-[#bdcabb] hover:bg-[#f3f4f6] text-[#191c1e]"}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${a.primary ? "bg-white/20" : "bg-[#edeef0]"}`}><Icon name={a.icon} /></div>
                <span className="text-label-bold text-base">{a.label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Active Courses */}
        <section>
          <div className="flex justify-between items-center mb-6"><h2 className="text-label-bold text-lg text-[#191c1e]">Active Courses</h2><Link to="/teacher-courses" className="text-[#191c1e] text-label-bold text-sm hover:underline">View All</Link></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cards.map((c: any) => (
              <div key={c.title} className="bg-white rounded-xl border border-[#bdcabb] overflow-hidden flex flex-col">
                <div className="relative h-48 w-full overflow-hidden border-b border-[#bdcabb]">
                  <img alt="" className={`w-full h-full object-cover ${c.status === "Draft" ? "opacity-80" : ""}`} src={c.thumb || courseImage(c.cat)} />
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded text-label-bold text-xs text-[#191c1e] border border-[#bdcabb]">{c.status}</div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-headline-lg text-xl text-[#191c1e] mb-2">{c.title}</h3>
                  <p className="text-sm text-[#3e4a3e] mb-6">{c.code} • {c.semester}</p>
                  <div className={`flex justify-between items-center mb-8 mt-auto py-4 border-t border-b border-[#bdcabb]/50 ${c.status === "Draft" ? "opacity-60" : ""}`}>
                    <div className="text-center"><span className="block text-xs text-[#3e4a3e] mb-1">Students</span><span className="text-label-bold text-[#191c1e]">{c.students}</span></div>
                    <div className="w-px h-8 bg-[#bdcabb]/50"></div>
                    <div className="text-center"><span className="block text-xs text-[#3e4a3e] mb-1">Lessons</span><span className="text-label-bold text-[#191c1e]">{c.lessons}</span></div>
                    <div className="w-px h-8 bg-[#bdcabb]/50"></div>
                    <div className="text-center"><span className="block text-xs text-[#3e4a3e] mb-1">Completion</span><span className="text-label-bold text-[#191c1e]">{c.completion}</span></div>
                  </div>
                  <div className="flex gap-4">
                    {c.status === "Draft" ? (
                      <Link to="/teacher-courses/new" className="flex-1 text-center bg-[#edeef0] hover:bg-[#e7e8ea] text-[#191c1e] text-label-bold text-sm py-2.5 rounded transition-colors">Continue Editing</Link>
                    ) : (
                      <>
                        <Link to="/teacher-courses" className="flex-1 text-center bg-white hover:bg-[#f3f4f6] text-[#191c1e] text-label-bold text-sm py-2.5 rounded border border-[#bdcabb] transition-colors">Manage</Link>
                        <Link to="/teacher-reports" className="flex-1 text-center bg-[#edeef0] hover:bg-[#e7e8ea] text-[#191c1e] text-label-bold text-sm py-2.5 rounded transition-colors">Analytics</Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Activity */}
        <section className="bg-white rounded-xl border border-[#bdcabb] p-8">
          <div className="flex justify-between items-center mb-8"><h2 className="text-label-bold text-lg text-[#191c1e]">Recent Activity</h2><button className="text-label-bold text-sm text-[#191c1e] hover:underline">View All</button></div>
          <div className="flex flex-col gap-6">
            {ACTIVITY.map((a, i) => (
              <div key={i} className={`flex items-start gap-6 ${i < ACTIVITY.length - 1 ? "pb-6 border-b border-[#bdcabb]/50" : ""}`}>
                <div className="w-12 h-12 rounded bg-[#edeef0] flex items-center justify-center text-[#191c1e] flex-shrink-0"><Icon name={a.icon} /></div>
                <div className="flex-1 flex justify-between items-start">
                  <div>
                    <p className="text-[#191c1e]"><span className="text-label-bold">{a.title}</span> {a.body}</p>
                    <p className="text-sm text-[#3e4a3e] mt-1">{a.sub}</p>
                    {a.action && <Link to="/teacher-assignments" className="inline-block mt-3 text-sm text-label-bold text-[#191c1e] border border-[#bdcabb] px-3 py-1.5 rounded hover:bg-[#f3f4f6] transition-colors">{a.action}</Link>}
                  </div>
                  <span className="text-xs text-[#3e4a3e] whitespace-nowrap">{a.time}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </TeacherShell>
  );
}
