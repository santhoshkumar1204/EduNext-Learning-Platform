import { Fragment, useEffect, useState } from "react";
import Icon from "../components/Icon";
import TeacherShell from "../components/TeacherShell";
import { getCurrentUser, getAssignmentsForTeacher, addAssignmentNew, getSubmissionsForAssignment, gradeSubmission } from "../lib/database";
import { Assignment, Submission } from "../lib/mockData";

// Exact port of teacher_assignments/code.html (Assignment Management)
const CARDS = [
  { label: "Assignments Created", value: "142", icon: "library_add", box: "bg-[#0F2B5B]/10 text-[#0F2B5B]", accent: "bg-[#0F2B5B]/10", note: <span className="flex items-center gap-1 text-[#15803D]"><Icon name="trending_up" className="text-[16px]" /> +3 this week</span> },
  { label: "Pending Evaluations", value: "38", icon: "pending_actions", box: "bg-[#645efb]/10 text-[#4b41e1]", accent: "bg-[#c3c0ff]/30", note: <span className="text-[#3e4a3e]">Across 4 courses</span> },
  { label: "Submitted Recently", value: "856", icon: "task", box: "bg-[#a6c5fe]/20 text-[#405f91]", accent: "bg-[#d6e3ff]/30", note: <span className="flex items-center gap-1 text-[#15803D]"><Icon name="trending_up" className="text-[16px]" /> +12% vs last month</span> },
  { label: "Overdue Assignments", value: "12", icon: "assignment_late", box: "bg-[#ffdad6] text-[#EF4444]", accent: "bg-[#ffdad6]/50", note: <span className="text-[#EF4444]">Action required</span> },
];

export default function TeacherAssignments() {
  const user = getCurrentUser();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [openId, setOpenId] = useState<number | null>(null);
  const [subs, setSubs] = useState<Submission[]>([]);
  const [grades, setGrades] = useState<Record<number, string>>({});
  const [showForm, setShowForm] = useState(false);

  async function load() { if (user?.id) setAssignments(await getAssignmentsForTeacher(user.id)); }
  useEffect(() => { load(); }, [user?.id]);

  async function openSubs(aid: number) {
    if (openId === aid) { setOpenId(null); return; }
    setOpenId(aid); setSubs(await getSubmissionsForAssignment(aid));
  }
  async function grade(subId: number, aid: number) { const g = Number(grades[subId]); if (isNaN(g)) return; await gradeSubmission(subId, g); setSubs(await getSubmissionsForAssignment(aid)); }
  async function add(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); const f = new FormData(e.currentTarget);
    await addAssignmentNew({ teacherId: user!.id!, title: String(f.get("title")), subject: String(f.get("subject")), dueDate: String(f.get("dueDate")), instructions: String(f.get("instructions")), status: "Active" });
    setShowForm(false); load();
  }

  return (
    <TeacherShell active="Assignments">
      <div className="max-w-[1280px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div><h1 className="text-headline-lg text-[#191c1e] mb-1">Assignments</h1><p className="text-body-md text-[#3e4a3e]">Create assignments and review student submissions.</p></div>
          <button onClick={() => setShowForm((s) => !s)} className="bg-[#0F2B5B] text-white text-label-bold py-2.5 px-6 rounded-lg hover:bg-[#0A1F44] shadow-sm transition-all flex items-center gap-2 whitespace-nowrap"><Icon name="add" className="text-[20px]" /> Create Assignment</button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {CARDS.map((c) => (
            <div key={c.label} className="bg-white border border-[#bdcabb] rounded-xl p-6 relative overflow-hidden group">
              <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110 ${c.accent}`}></div>
              <div className="flex justify-between items-start relative z-10"><div><p className="text-label-sm text-[#3e4a3e] mb-1 uppercase tracking-wider">{c.label}</p><h3 className="text-headline-lg text-[#191c1e]">{c.value}</h3></div><div className={`w-10 h-10 rounded-full flex items-center justify-center ${c.box}`}><Icon name={c.icon} /></div></div>
              <div className="mt-4 flex items-center gap-1 text-sm font-medium relative z-10">{c.note}</div>
            </div>
          ))}
        </div>

        {showForm && (
          <div className="bg-white border border-[#bdcabb] rounded-xl p-5 mb-6">
            <form onSubmit={add} className="grid sm:grid-cols-2 gap-3">
              <input name="title" required placeholder="Title" className="border border-[#bdcabb] rounded-lg px-3 py-2 text-sm" />
              <input name="subject" placeholder="Course / Subject" className="border border-[#bdcabb] rounded-lg px-3 py-2 text-sm" />
              <input name="dueDate" type="date" className="border border-[#bdcabb] rounded-lg px-3 py-2 text-sm" />
              <input name="instructions" placeholder="Instructions" className="border border-[#bdcabb] rounded-lg px-3 py-2 text-sm" />
              <button type="submit" className="bg-[#0F2B5B] text-white rounded-lg px-4 py-2 text-sm text-label-bold sm:col-span-2">Create Assignment</button>
            </form>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white border border-[#bdcabb] rounded-t-xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="w-full md:w-96 relative"><Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6e7a6d]" /><input className="w-full pl-10 pr-4 py-2 border border-[#bdcabb] rounded-lg text-[#191c1e] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] bg-[#f8f9fb]" placeholder="Search by title..." /></div>
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <select className="border border-[#bdcabb] rounded-lg py-2 pl-3 pr-8 text-[#191c1e] bg-[#f8f9fb] cursor-pointer"><option>All Courses</option></select>
            <select className="border border-[#bdcabb] rounded-lg py-2 pl-3 pr-8 text-[#191c1e] bg-[#f8f9fb] cursor-pointer"><option>All Statuses</option><option>Active</option><option>Draft</option></select>
            <button className="border border-[#bdcabb] rounded-lg py-2 px-4 text-[#191c1e] text-label-bold hover:bg-[#f3f4f6] flex items-center gap-2 transition-colors"><Icon name="calendar_today" className="text-[18px]" /> Due Date</button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border-x border-b border-[#bdcabb] rounded-b-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[760px]">
              <thead><tr className="bg-[#f3f4f6] border-b border-[#bdcabb] text-[#3e4a3e] text-label-bold"><th className="p-4">Assignment Title &amp; Course</th><th className="p-4">Due Date</th><th className="p-4 text-center">Submissions</th><th className="p-4 text-center">Avg. Marks</th><th className="p-4">Status</th><th className="p-4 text-right">Actions</th></tr></thead>
              <tbody className="divide-y divide-[#bdcabb]/50">
                {assignments.map((a) => (
                  <Fragment key={a.id}>
                    <tr className="hover:bg-[#f8f9fb]">
                      <td className="p-4"><div className="font-semibold text-[#191c1e]">{a.title}</div><div className="text-xs text-[#3e4a3e]">{a.subject}</div></td>
                      <td className="p-4 text-sm text-[#191c1e]">{a.dueDate}</td>
                      <td className="p-4 text-center text-sm">—</td>
                      <td className="p-4 text-center text-sm">—</td>
                      <td className="p-4"><span className="bg-[#22C55E]/15 text-[#15803D] text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">{a.status || "Active"}</span></td>
                      <td className="p-4 text-right"><button onClick={() => openSubs(a.id!)} className="text-[#2563EB] text-label-bold text-sm hover:underline">{openId === a.id ? "Hide" : "View"} Submissions</button></td>
                    </tr>
                    {openId === a.id && (
                      <tr><td colSpan={6} className="p-4 bg-[#f3f4f6]/40">
                        {subs.length === 0 ? <p className="text-sm text-[#3e4a3e]">No submissions yet.</p> : (
                          <div className="space-y-2">{subs.map((s) => (
                            <div key={s.id} className="flex items-center justify-between text-sm"><span className="text-[#191c1e]">Student #{s.studentId} · {s.fileName}</span>{s.status === "graded" ? <span className="font-bold text-[#15803D]">{s.grade}/100</span> : <div className="flex gap-1"><input value={grades[s.id!] || ""} onChange={(e) => setGrades((g) => ({ ...g, [s.id!]: e.target.value }))} placeholder="0-100" className="w-16 border border-[#bdcabb] rounded px-2 py-1 text-xs" /><button onClick={() => grade(s.id!, a.id!)} className="bg-[#0F2B5B] text-white text-xs rounded px-2 py-1 text-label-bold">Grade</button></div>}</div>
                          ))}</div>
                        )}
                      </td></tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </TeacherShell>
  );
}
