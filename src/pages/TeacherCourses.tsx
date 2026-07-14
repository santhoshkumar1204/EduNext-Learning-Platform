import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../components/Icon";
import TeacherShell from "../components/TeacherShell";
import { getCurrentUser, getTeacherCourses } from "../lib/database";
import { TeacherCourse } from "../lib/mockData";
import { courseImage } from "../lib/images";

// Exact port of teacher_courses/code.html (Courses Management)
const FALLBACK: any[] = [
  { title: "Fundamentals of Machine Learning", category: "Computer Science", level: "Beginner", students: "1,245", lessons: 24, status: "Published", cat: "Programming" },
  { title: "Advanced Python Programming", category: "Programming", level: "Advanced", students: "--", lessons: 42, status: "Draft", cat: "Programming" },
  { title: "Data Analytics and Visualization", category: "Data Science", level: "Intermediate", students: "320", lessons: 18, status: "Published", cat: "Data Analytics" },
];

export default function TeacherCourses() {
  const user = getCurrentUser();
  const [courses, setCourses] = useState<TeacherCourse[]>([]);
  useEffect(() => { if (user?.id) getTeacherCourses(user.id).then(setCourses); }, [user?.id]);

  const list = courses.length ? courses.map((c) => ({ title: c.title, category: c.category || "Computer Science", level: c.level, students: c.students ? `${c.students}` : "--", lessons: c.videos?.length ?? 24, status: c.status === "Active" ? "Published" : "Draft", cat: c.category, thumb: c.thumbnail })) : FALLBACK;

  return (
    <TeacherShell active="Courses">
      <div className="max-w-[1440px] mx-auto pb-12">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
          <div><h2 className="text-headline-lg text-[#191c1e] font-bold tracking-tight">Courses</h2><p className="text-body-md text-[#3e4a3e] mt-2">Manage your educational content, track student progress, and organize your curriculum.</p></div>
          <Link to="/teacher-courses/new" className="bg-[#0F2B5B] text-white py-2.5 px-6 rounded-lg text-label-bold flex items-center justify-center gap-2 hover:opacity-90 transition-colors shadow-sm whitespace-nowrap h-fit"><Icon name="add" className="text-[20px]" /> Add New Course</Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mb-8 items-start lg:items-center">
          <div className="relative w-full lg:w-96"><Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-[#bdcabb]" /><input className="w-full pl-10 pr-4 py-2.5 bg-[#f8f9fb] border border-[#bdcabb] rounded-lg text-body-md focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all" placeholder="Search Courses..." /></div>
          <div className="flex flex-wrap gap-3 w-full lg:w-auto">
            {[["Category: All", "Computer Science", "Data Science", "Programming"], ["Difficulty: All", "Beginner", "Intermediate", "Advanced"], ["Status: All", "Published", "Draft"]].map((opts, i) => (
              <select key={i} className="px-4 py-2.5 bg-[#f8f9fb] border border-[#bdcabb] rounded-lg text-body-md text-[#3e4a3e] focus:outline-none focus:border-[#2563EB]">{opts.map((o) => <option key={o}>{o}</option>)}</select>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {list.map((c: any, idx: number) => {
            const draft = c.status === "Draft";
            return (
              <article key={idx} className={`bg-[#f8f9fb] rounded-xl border border-[#bdcabb] overflow-hidden hover:shadow-md transition-shadow flex flex-col lg:flex-row h-auto lg:h-[240px] group ${draft ? "opacity-90" : ""}`}>
                <div className="relative w-full lg:w-[420px] shrink-0 bg-[#e1e2e4] overflow-hidden">
                  <img alt="" className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${draft ? "grayscale-[20%]" : ""}`} src={c.thumb || courseImage(c.cat)} />
                  <div className="absolute top-4 left-4"><span className={`px-3 py-1.5 rounded-md text-label-bold text-label-sm uppercase tracking-wider shadow-sm ${draft ? "bg-[#e1e2e4] text-[#3e4a3e] border border-[#bdcabb]" : "bg-[#22C55E] text-white"}`}>{c.status}</span></div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3 text-[#3e4a3e] text-label-sm uppercase tracking-wider"><span className="font-semibold">{c.category}</span><span className="w-1.5 h-1.5 rounded-full bg-[#bdcabb]"></span><span className={`font-medium ${c.level === "Advanced" ? "text-[#4b41e1]" : "text-[#15803D]"}`}>{c.level}</span></div>
                    <h3 className="text-[22px] font-bold text-[#191c1e] mb-4 line-clamp-2">{c.title}</h3>
                    <div className="flex flex-wrap items-center gap-6 text-[#3e4a3e] text-sm">
                      <div className="flex items-center gap-2"><Icon name="group" className="text-[20px] text-[#6e7a6d]" /><span className="font-medium">{c.students} Students Enrolled</span></div>
                      <div className="flex items-center gap-2"><Icon name="menu_book" className="text-[20px] text-[#6e7a6d]" /><span className="font-medium">{c.lessons} Lessons</span></div>
                      <div className="flex items-center gap-2"><Icon name="language" className="text-[20px] text-[#6e7a6d]" /><span className="font-medium">English</span></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-6 pt-6 border-t border-[#e1e2e4]">
                    <div className="flex gap-3 flex-wrap">
                      <Link to="/teacher-courses/new" className="bg-[#0F2B5B]/10 text-[#0F2B5B] text-label-bold px-4 py-2 rounded-lg hover:bg-[#0F2B5B] hover:text-white transition-colors flex items-center gap-2"><Icon name="settings" className="text-[18px]" /> Manage</Link>
                      <Link to="/teacher-reports" className="bg-[#f8f9fb] text-[#3e4a3e] border border-[#bdcabb] text-label-bold px-4 py-2 rounded-lg hover:bg-[#f3f4f6] transition-colors flex items-center gap-2"><Icon name="analytics" className="text-[18px]" /> Analytics</Link>
                      <button className="bg-[#f8f9fb] text-[#3e4a3e] border border-[#bdcabb] text-label-bold px-4 py-2 rounded-lg hover:bg-[#f3f4f6] transition-colors flex items-center gap-2"><Icon name="edit" className="text-[18px]" /> Edit</button>
                    </div>
                    <div className="flex items-center gap-4">
                      <button className="text-[#3e4a3e] text-label-bold hover:text-[#EF4444] transition-colors flex items-center gap-1 px-2 py-2"><Icon name="unpublished" className="text-[20px]" /> {draft ? "Publish" : "Unpublish"}</button>
                      <button className="p-2 text-[#3e4a3e] hover:bg-[#f3f4f6] rounded-lg transition-colors"><Icon name="more_vert" className="text-[24px]" /></button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </TeacherShell>
  );
}
