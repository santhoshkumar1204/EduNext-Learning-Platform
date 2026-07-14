import Icon from "../components/Icon";
import TeacherShell from "../components/TeacherShell";
import { avatarUrl } from "../lib/images";

// Exact port of teacher_apprenticeships/code.html
const CARDS = [
  { label: "Total Opportunities", value: "142", icon: "work", box: "bg-[#0F2B5B]/10 text-[#0F2B5B]", note: <span className="text-[#15803D] flex items-center gap-1"><Icon name="trending_up" className="text-[16px]" /> +12 this month</span> },
  { label: "Active", value: "89", icon: "bolt", box: "bg-[#645efb]/20 text-[#4b41e1]", note: <span className="text-[#3e4a3e]">Across 45 companies</span> },
  { label: "Expired", value: "53", icon: "history", box: "bg-[#ffdad6]/40 text-[#EF4444]", note: <span className="text-[#EF4444] flex items-center gap-1"><Icon name="warning" className="text-[16px]" /> Action needed on 5</span> },
  { label: "Applications Submitted", value: "324", icon: "send", box: "bg-[#a6c5fe]/30 text-[#405f91]", note: <span className="text-[#15803D] flex items-center gap-1"><Icon name="check_circle" className="text-[16px]" /> 68% placement rate</span> },
];
const postings = [
  { role: "Software Engineering Apprentice", company: "Nimbus Labs", applicants: 14, status: "Active" },
  { role: "Data Analytics Trainee", company: "BrightData", applicants: 9, status: "Active" },
  { role: "Security Operations Apprentice", company: "ShieldNet", applicants: 6, status: "Expired" },
];
const applications = [
  { student: "Simran Kaur", role: "Software Engineering Apprentice", status: "Interview", tone: "bg-[#4b41e1]/10 text-[#4b41e1]" },
  { student: "Rajveer Singh", role: "Data Analytics Trainee", status: "Applied", tone: "bg-[#a6c5fe]/30 text-[#405f91]" },
  { student: "Priya Sharma", role: "Software Engineering Apprentice", status: "Accepted", tone: "bg-[#22C55E]/15 text-[#15803D]" },
];

export default function TeacherApprenticeships() {
  return (
    <TeacherShell active="Apprenticeships">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div><h1 className="text-headline-lg text-[#191c1e]">Apprenticeships</h1><p className="text-body-md text-[#3e4a3e] mt-2">Manage career and industry opportunities for students.</p></div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#bdcabb] text-[#191c1e] rounded-lg hover:bg-[#f3f4f6] transition-colors text-label-bold shadow-sm"><Icon name="download" /> Export</button>
            <button className="flex items-center gap-2 px-6 py-2 bg-[#0F2B5B] text-white rounded-lg hover:bg-[#0A1F44] transition-colors text-label-bold shadow-sm"><Icon name="add" /> Add Opportunity</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {CARDS.map((c) => (
            <div key={c.label} className="bg-white border border-[#bdcabb] rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="flex justify-between items-start mb-4"><h3 className="text-label-bold text-[#3e4a3e]">{c.label}</h3><div className={`p-2 rounded-lg ${c.box}`}><Icon name={c.icon} /></div></div>
              <p className="text-3xl font-bold text-[#191c1e]">{c.value}</p>
              <div className="mt-2 flex items-center gap-1 text-sm">{c.note}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-[#bdcabb] rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-6 border-b border-[#bdcabb] mb-4"><button className="text-label-bold text-[#0F2B5B] border-b-2 border-[#0F2B5B] pb-2">Internal Directory</button><button className="text-label-bold text-[#3e4a3e] pb-2">External Partners</button></div>
            <div className="space-y-4">
              {postings.map((p) => (
                <div key={p.role} className="flex items-center justify-between p-4 border border-[#bdcabb] rounded-lg hover:bg-[#f8f9fb] transition-colors">
                  <div><h3 className="font-bold text-[#191c1e]">{p.role}</h3><p className="text-xs text-[#3e4a3e]">{p.company} · {p.applicants} applicants</p></div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${p.status === "Active" ? "bg-[#22C55E]/15 text-[#15803D]" : "bg-[#e1e2e4] text-[#3e4a3e]"}`}>{p.status}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white border border-[#bdcabb] rounded-xl p-6 shadow-sm h-fit">
            <h3 className="font-bold text-[#191c1e] mb-4 flex items-center gap-2"><Icon name="fact_check" className="text-[#405f91]" /> Student Applications</h3>
            <div className="space-y-4">
              {applications.map((a) => (
                <div key={a.student} className="flex items-center justify-between"><div className="flex items-center gap-2"><img src={avatarUrl(a.student)} alt="" className="w-8 h-8 rounded-full" /><div><p className="text-sm font-semibold text-[#191c1e]">{a.student}</p><p className="text-xs text-[#3e4a3e]">{a.role}</p></div></div><span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${a.tone}`}>{a.status}</span></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </TeacherShell>
  );
}
