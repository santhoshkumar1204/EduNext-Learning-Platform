import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../components/Icon";
import TeacherShell from "../components/TeacherShell";
import { db } from "../lib/database";
import { User } from "../lib/mockData";
import { avatarUrl } from "../lib/images";

// Exact port of teacher_studentslist/code.html (Student Directory)
function statsFor(u: User) {
  const seed = (u.id ?? 1) * 37;
  const completion = 35 + (seed % 55);
  const attention = 42 + ((seed * 3) % 53);
  const quiz = 68 + ((seed * 7) % 30);
  const level = attention >= 80 ? "High" : attention >= 65 ? "Medium" : "Low";
  return { completion, attention, quiz, level };
}
const levelCls: Record<string, string> = { High: "bg-[#22C55E]/10 text-[#15803D]", Medium: "bg-[#405f91]/10 text-[#405f91]", Low: "bg-[#EF4444]/10 text-[#EF4444]" };
const attCls: Record<string, string> = { High: "text-[#15803D]", Medium: "text-[#405f91]", Low: "text-[#EF4444]" };

export default function TeacherStudentsList() {
  const [students, setStudents] = useState<User[]>([]);
  useEffect(() => { db.users.where("role").equals("student").toArray().then(setStudents); }, []);

  return (
    <TeacherShell active="Students">
      <div className="max-w-[1280px] mx-auto pb-12">
        <div className="mb-8"><h2 className="text-headline-lg text-[#191c1e] mb-2">Students</h2><p className="text-[#3e4a3e] text-body-md max-w-2xl">Manage and monitor students enrolled in your courses.</p></div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white p-4 rounded-xl border border-[#bdcabb] shadow-sm">
          {[["Course", "All Courses", "Intro to CS", "Data Structures", "Artificial Intelligence"], ["Attention Status", "All Statuses", "Needs Attention (Low)", "Medium Attention", "High Attention"], ["Performance", "All Levels", "Excelling (>90%)", "On Track (70-89%)", "At Risk (<70%)"]].map((o, i) => (
            <div key={i} className="flex-1 min-w-[200px]"><label className="block text-label-sm text-[#3e4a3e] mb-1 ml-1">{o[0]}</label><select className="w-full bg-[#f8f9fb] border border-[#bdcabb] rounded-lg px-4 py-2.5 text-[#191c1e] focus:border-[#2563EB] cursor-pointer">{o.slice(1).map((x) => <option key={x}>{x}</option>)}</select></div>
          ))}
          <div className="flex items-end"><button className="w-full md:w-auto bg-[#f3f4f6] text-[#191c1e] border border-[#bdcabb] text-label-bold py-2.5 px-6 rounded-lg hover:bg-[#e7e8ea] transition-colors flex items-center justify-center gap-2"><Icon name="filter_list" className="text-[20px]" /> More Filters</button></div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[["Total Students", "1,248", "groups", "text-[#0F2B5B] bg-[#0F2B5B]/10"], ["Active Learners", "982", "local_fire_department", "text-[#405f91] bg-[#405f91]/10"], ["Requiring Attention", "47", "warning", "text-[#EF4444] bg-[#EF4444]/10"], ["Avg. Completion", "68%", "donut_large", "text-[#4b41e1] bg-[#4b41e1]/10"]].map(([label, val, icon, cl]) => (
            <div key={label} className="bg-white p-6 rounded-xl border border-[#bdcabb] shadow-sm flex flex-col justify-between"><div className="flex items-center justify-between mb-4"><span className="text-label-bold text-[#3e4a3e]">{label}</span><span className={`p-2 rounded-lg ${cl}`}><Icon name={icon} fill /></span></div><div className="text-3xl font-bold text-[#191c1e]">{val}</div></div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white border border-[#bdcabb] rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[820px]">
              <thead className="bg-[#f3f4f6] border-b border-[#bdcabb]"><tr className="text-[#3e4a3e] text-[11px] uppercase tracking-wider"><th className="px-6 py-4 text-label-bold">Student</th><th className="px-6 py-4 text-label-bold">Courses</th><th className="px-6 py-4 text-label-bold">Completion</th><th className="px-6 py-4 text-label-bold">Attention</th><th className="px-6 py-4 text-label-bold">Quiz Avg</th><th className="px-6 py-4 text-label-bold">Last Active</th><th className="px-6 py-4 text-label-bold">Status</th><th className="px-6 py-4 text-label-bold text-right">Action</th></tr></thead>
              <tbody className="divide-y divide-[#bdcabb]/50">
                {students.map((s) => {
                  const st = statsFor(s);
                  return (
                    <tr key={s.id} className="hover:bg-[#f8f9fb] transition-colors">
                      <td className="px-6 py-4"><div className="flex items-center gap-3"><img className="w-10 h-10 rounded-full object-cover border border-[#bdcabb]" src={avatarUrl(s.name)} alt="" /><div><div className="font-bold text-[#191c1e] text-sm">{s.name}</div><div className="text-xs text-[#3e4a3e]">{s.email || `${s.studentId?.toLowerCase()}@student.edu`}</div></div></div></td>
                      <td className="px-6 py-4"><div className="text-xs text-[#191c1e]">{s.department}</div></td>
                      <td className="px-6 py-4 text-sm font-medium text-[#191c1e]">{st.completion}%</td>
                      <td className={`px-6 py-4 text-sm font-medium ${attCls[st.level]}`}>{st.attention}%</td>
                      <td className="px-6 py-4 text-sm text-[#191c1e]">{st.quiz}%</td>
                      <td className="px-6 py-4 text-xs text-[#3e4a3e]">2 days ago</td>
                      <td className="px-6 py-4"><span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${levelCls[st.level]}`}>{st.level}</span></td>
                      <td className="px-6 py-4 text-right"><Link to={`/teacher-students/${s.id}`} className="bg-[#0F2B5B] text-white text-xs text-label-bold py-1.5 px-4 rounded-lg hover:opacity-90 transition-opacity">View Profile</Link></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-8 flex justify-center items-center gap-2">
          <button className="p-2 border border-[#bdcabb] rounded-md bg-white text-[#3e4a3e]"><Icon name="chevron_left" className="text-[18px]" /></button>
          <button className="w-8 h-8 rounded-md bg-[#0F2B5B] text-white text-label-bold text-sm flex items-center justify-center">1</button>
          {[2, 3].map((n) => <button key={n} className="w-8 h-8 rounded-md bg-white border border-[#bdcabb] text-[#191c1e] text-label-bold text-sm flex items-center justify-center hover:bg-[#f3f4f6]">{n}</button>)}
          <span className="text-[#3e4a3e]">...</span>
          <button className="p-2 border border-[#bdcabb] rounded-md bg-white text-[#3e4a3e] hover:bg-[#f3f4f6]"><Icon name="chevron_right" className="text-[18px]" /></button>
        </div>
      </div>
    </TeacherShell>
  );
}
