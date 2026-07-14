import { ReactNode, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Icon from "./Icon";
import TeacherShell from "./TeacherShell";
import { db, getEnrolledCourses } from "../lib/database";
import { User, TeacherCourse } from "../lib/mockData";
import { avatarUrl } from "../lib/images";

// Exact port of the teacher student-detail header + tabs (teacher_students_profile)
export type StudentTab = "overview" | "attention" | "recordings" | "quiz" | "assignments";
const TABS: { key: StudentTab; label: string; icon: string; to: (id: string) => string }[] = [
  { key: "overview", label: "Overview", icon: "dashboard", to: (id) => `/teacher-students/${id}` },
  { key: "attention", label: "Attention Reports", icon: "visibility", to: (id) => `/teacher-students/${id}/attention` },
  { key: "recordings", label: "Webcam Recordings", icon: "videocam", to: () => `/teacher-dashboard/students-recordings` },
  { key: "quiz", label: "Quiz Performance", icon: "quiz", to: (id) => `/teacher-students/${id}/quiz` },
  { key: "assignments", label: "Assignment History", icon: "assignment", to: (id) => `/teacher-students/${id}/assignments` },
];

export default function TeacherStudentShell({ activeTab, children }: { activeTab: StudentTab; children: (ctx: { student: User | undefined; enrollments: (TeacherCourse & { progress: number })[] }) => ReactNode }) {
  const { id } = useParams();
  const [student, setStudent] = useState<User>();
  const [enrollments, setEnrollments] = useState<(TeacherCourse & { progress: number })[]>([]);

  useEffect(() => {
    if (!id) return;
    db.users.get(Number(id)).then(setStudent);
    getEnrolledCourses(Number(id)).then(setEnrollments as any);
  }, [id]);

  const avgCompletion = enrollments.length ? Math.round(enrollments.reduce((s, e) => s + e.progress, 0) / enrollments.length) : 87;

  return (
    <TeacherShell active="Students">
      <div className="max-w-[1280px] mx-auto pb-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[#3e4a3e] mb-6 text-label-bold"><Link to="/teacher-students" className="hover:text-[#2563EB] transition-colors">Students</Link><Icon name="chevron_right" className="text-sm" /><span className="text-[#191c1e]">{student?.name || "Student"}</span></div>

        {/* Header card */}
        <section className="bg-white border border-[#bdcabb] rounded-xl p-8 mb-8 shadow-sm flex flex-col md:flex-row gap-8 items-start relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-[#0F2B5B]"></div>
          <div className="flex-shrink-0 relative">
            <img alt="" className="w-32 h-32 rounded-xl object-cover border border-[#bdcabb] shadow-sm" src={avatarUrl(student?.name || "Student")} />
            <div className="absolute -bottom-3 -right-3 bg-[#22C55E]/15 text-[#15803D] border-2 border-white px-3 py-1 rounded-full flex items-center gap-1 shadow-sm"><div className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse"></div><span className="text-label-sm font-bold">Active</span></div>
          </div>
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div><h1 className="text-headline-lg text-[#191c1e] mb-1">{student?.name || "—"}</h1><p className="text-[#3e4a3e] flex items-center gap-2"><Icon name="mail" className="text-sm" /> {student?.email || `${student?.studentId?.toLowerCase()}@student.edu`}</p></div>
              <button className="bg-[#f3f4f6] border border-[#bdcabb] text-[#191c1e] text-label-bold px-4 py-2 rounded-lg hover:bg-[#e7e8ea] transition-colors flex items-center gap-2"><Icon name="mail" className="text-sm" /> Message Student</button>
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-2 mt-2">
              {[["Department", student?.department || "B.S. Computer Science"], ["Year", student?.year || "Year 2"], ["Enrolled", student?.joinedDate || "Sep 2023"]].map(([l, v]) => (
                <div key={l} className="flex flex-col"><span className="text-[#3e4a3e] text-label-sm uppercase tracking-wider mb-1">{l}</span><span className="text-[#191c1e] font-medium">{v}</span></div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4 min-w-[200px] border-t md:border-t-0 md:border-l border-[#bdcabb] pt-6 md:pt-0 md:pl-8">
            <div><div className="text-[#3e4a3e] text-label-sm uppercase tracking-wider mb-1">Attention Status</div><div className="flex items-center gap-2 text-[#15803D] text-label-bold bg-[#22C55E]/10 px-3 py-1 rounded-full w-fit"><Icon name="visibility" className="text-base" /> High / Focused</div></div>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div><span className="text-[#3e4a3e] text-label-sm block mb-1">Avg Completion</span><span className="text-[#191c1e] text-2xl font-bold">{avgCompletion}%</span></div>
              <div><span className="text-[#3e4a3e] text-label-sm block mb-1">Quiz Avg</span><span className="text-[#0F2B5B] text-2xl font-bold">92%</span></div>
              <div className="col-span-2"><span className="text-[#3e4a3e] text-label-sm block mb-1">Assignment Rate</span><div className="flex items-center gap-2"><div className="flex-1 h-2 bg-[#edeef0] rounded-full overflow-hidden"><div className="h-full bg-[#2563EB] rounded-full" style={{ width: "95%" }}></div></div><span className="text-[#191c1e] text-label-bold">95%</span></div></div>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <div className="border-b border-[#bdcabb] mb-8 flex gap-8 overflow-x-auto">
          {TABS.map((t) => (
            <Link key={t.key} to={t.to(id || "1")} className={`pb-3 border-b-2 text-label-bold flex items-center gap-2 whitespace-nowrap transition-colors ${activeTab === t.key ? "border-[#0F2B5B] text-[#0F2B5B]" : "border-transparent text-[#3e4a3e] hover:text-[#191c1e]"}`}><Icon name={t.icon} className="text-sm" /> {t.label}</Link>
          ))}
        </div>

        {children({ student, enrollments })}
      </div>
    </TeacherShell>
  );
}
