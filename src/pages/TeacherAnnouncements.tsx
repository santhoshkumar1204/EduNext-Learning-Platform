import { useState } from "react";
import Icon from "../components/Icon";
import TeacherShell from "../components/TeacherShell";

// Exact port of teacher_announcements/code.html
interface Ann { id: number; title: string; target: string; date: string; body: string; status: string; }
const CARDS = [
  { label: "Total", value: "142", icon: "campaign", box: "text-[#405f91] bg-[#405f91]/10" },
  { label: "Published", value: "118", icon: "check_circle", box: "text-[#15803D] bg-[#22C55E]/10" },
  { label: "Scheduled", value: "16", icon: "schedule", box: "text-[#4b41e1] bg-[#4b41e1]/10" },
  { label: "Drafts", value: "8", icon: "edit", box: "text-[#3e4a3e] bg-[#e1e2e4]" },
];

export default function TeacherAnnouncements() {
  const [items, setItems] = useState<Ann[]>([
    { id: 1, title: "Mid-term Exam Schedule Released", target: "All Students", date: "Jun 10", body: "Mid-terms begin June 24. Please review the syllabus and reach out with any questions.", status: "Published" },
    { id: 2, title: "New React Module Live", target: "Web Development", date: "Jun 8", body: "A new module on React Hooks is now available in the Web Development Bootcamp.", status: "Published" },
    { id: 3, title: "Holiday Notice", target: "All Students", date: "Jun 15", body: "Support unavailable June 15 due to a public holiday.", status: "Scheduled" },
  ]);
  const [showForm, setShowForm] = useState(false);

  function add(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); const f = new FormData(e.currentTarget);
    setItems((p) => [{ id: Date.now(), title: String(f.get("title")), target: String(f.get("target")), date: "Today", body: String(f.get("body")), status: "Published" }, ...p]);
    setShowForm(false); e.currentTarget.reset();
  }

  return (
    <TeacherShell active="Announcements">
      <div className="max-w-[1280px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div><h2 className="text-headline-lg text-[#191c1e]">Announcements</h2><p className="text-[#3e4a3e] mt-1">Create and manage communications for your students.</p></div>
          <button onClick={() => setShowForm((s) => !s)} className="bg-[#0F2B5B] hover:bg-[#0A1F44] text-white px-6 py-3 rounded-lg text-label-bold flex items-center justify-center gap-2 transition-colors shadow-sm whitespace-nowrap"><Icon name="add" className="text-[20px]" /> Create Announcement</button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {CARDS.map((c) => (
            <div key={c.label} className="bg-white p-5 rounded-xl border border-[#bdcabb] shadow-sm flex flex-col gap-2"><div className="flex items-center justify-between"><span className="text-[#3e4a3e] text-label-bold">{c.label}</span><span className={`p-1.5 rounded-md ${c.box}`}><Icon name={c.icon} /></span></div><div className="text-2xl font-bold text-[#191c1e]">{c.value}</div></div>
          ))}
        </div>

        {showForm && (
          <div className="bg-white border border-[#bdcabb] rounded-xl p-5 mb-6">
            <form onSubmit={add} className="space-y-3">
              <input name="title" required placeholder="Title" className="w-full border border-[#bdcabb] rounded-lg px-3 py-2 text-sm" />
              <select name="target" className="w-full border border-[#bdcabb] rounded-lg px-3 py-2 text-sm"><option>All Students</option><option>Web Development</option><option>Intro to CS</option></select>
              <textarea name="body" placeholder="Announcement content…" rows={3} className="w-full border border-[#bdcabb] rounded-lg px-3 py-2 text-sm" />
              <button type="submit" className="bg-[#0F2B5B] text-white rounded-lg px-4 py-2 text-sm text-label-bold">Publish</button>
            </form>
          </div>
        )}

        <div className="space-y-4">
          {items.map((a) => (
            <div key={a.id} className="bg-white border border-[#bdcabb] rounded-xl p-5 shadow-sm flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1"><h3 className="font-bold text-[#191c1e]">{a.title}</h3><span className="bg-[#405f91]/10 text-[#405f91] text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">{a.target}</span><span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${a.status === "Scheduled" ? "bg-[#4b41e1]/10 text-[#4b41e1]" : "bg-[#22C55E]/10 text-[#15803D]"}`}>{a.status}</span></div>
                <p className="text-xs text-[#3e4a3e] mb-2">{a.date}</p>
                <p className="text-sm text-[#3e4a3e]">{a.body}</p>
              </div>
              <div className="flex gap-1 shrink-0"><button className="text-[#3e4a3e] hover:text-[#191c1e]"><Icon name="edit" /></button><button onClick={() => setItems((p) => p.filter((x) => x.id !== a.id))} className="text-[#3e4a3e] hover:text-[#EF4444]"><Icon name="delete" /></button></div>
            </div>
          ))}
        </div>
      </div>
    </TeacherShell>
  );
}
