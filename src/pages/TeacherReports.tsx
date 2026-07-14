import { useState } from "react";
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import Icon from "../components/Icon";
import TeacherShell from "../components/TeacherShell";

// Exact port of teacher_reports/code.html (primary #0F2B5B)
const tabs = ["Attention Reports", "Quiz Reports", "Assignment Reports", "Course Reports"] as const;
const CARDS = [
  { label: "Total Reports Generated", value: "1,248", icon: "bar_chart", box: "bg-[#0F2B5B]/10 text-[#0F2B5B]", note: <span className="text-[#15803D] flex items-center gap-1"><Icon name="trending_up" className="text-xs" /> +12% from last month</span> },
  { label: "Course Reports", value: "432", icon: "school", box: "bg-[#645efb]/20 text-[#4b41e1]", note: <span className="text-[#3e4a3e]">Generated this term</span> },
  { label: "Student Reports", value: "685", icon: "group", box: "bg-[#a6c5fe]/30 text-[#405f91]", note: <span className="text-[#3e4a3e]">Individual profiles</span> },
  { label: "Attention Reports", value: "131", icon: "psychology", box: "bg-[#ffdad6]/50 text-[#EF4444]", note: <span className="text-[#15803D] flex items-center gap-1"><Icon name="trending_up" className="text-xs" /> High engagement detected</span> },
];
const engagement = [{ d: "W1", v: 72 }, { d: "W2", v: 78 }, { d: "W3", v: 70 }, { d: "W4", v: 85 }, { d: "W5", v: 81 }, { d: "W6", v: 88 }, { d: "W7", v: 84 }, { d: "W8", v: 90 }];
const donut = [{ name: "Attentive", value: 75, color: "#2563EB" }, { name: "Rest", value: 25, color: "#e1e2e4" }];
const sessions = [{ date: "Jun 10", course: "Intro to Python", avg: 88, status: "Excellent" as const }, { date: "Jun 9", course: "Web Development", avg: 72, status: "Average" as const }, { date: "Jun 8", course: "Cyber Security", avg: 58, status: "Needs Review" as const }];
const statusTone: Record<string, string> = { Excellent: "bg-[#22C55E]/15 text-[#15803D]", Average: "bg-[#a6c5fe]/30 text-[#405f91]", "Needs Review": "bg-[#ffdad6] text-[#EF4444]" };

export default function TeacherReports() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Attention Reports");
  return (
    <TeacherShell active="Reports">
      <div className="max-w-[1280px] mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 gap-4">
          <div><h2 className="text-headline-lg text-[#191c1e] mb-2">Reports</h2><p className="text-body-md text-[#3e4a3e]">Generate and export learning analytics reports.</p></div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 border border-[#6e7a6d] rounded-lg text-[#191c1e] text-label-bold hover:bg-[#f3f4f6] transition-colors flex items-center gap-2"><Icon name="picture_as_pdf" className="text-sm" /> Export PDF</button>
            <button className="px-4 py-2 border border-[#6e7a6d] rounded-lg text-[#191c1e] text-label-bold hover:bg-[#f3f4f6] transition-colors flex items-center gap-2"><Icon name="table_view" className="text-sm" /> Export Excel</button>
            <button className="px-6 py-2 bg-[#0F2B5B] text-white rounded-lg text-label-bold hover:bg-[#0A1F44] transition-colors shadow-sm">Generate Report</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {CARDS.map((c) => (
            <div key={c.label} className="bg-white border border-[#bdcabb] rounded-xl p-6 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between mb-4"><span className="text-label-bold text-[#3e4a3e]">{c.label}</span><div className={`w-8 h-8 rounded-full flex items-center justify-center ${c.box}`}><Icon name={c.icon} className="text-sm" /></div></div>
              <div className="text-3xl font-bold text-[#191c1e]">{c.value}</div>
              <div className="mt-2 text-sm flex items-center gap-1">{c.note}</div>
            </div>
          ))}
        </div>

        <div className="mb-6 border-b border-[#bdcabb]"><nav className="-mb-px flex space-x-8 overflow-x-auto">{tabs.map((t) => <button key={t} onClick={() => setTab(t)} className={`whitespace-nowrap py-4 px-1 border-b-2 text-label-bold ${tab === t ? "border-[#0F2B5B] text-[#0F2B5B]" : "border-transparent text-[#3e4a3e] hover:text-[#191c1e]"}`}>{t}</button>)}</nav></div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-white border border-[#bdcabb] rounded-xl p-6">
              <div className="flex justify-between items-center mb-4"><h3 className="text-label-bold text-[#191c1e]">Engagement Trends</h3><select className="bg-[#f8f9fb] border border-[#bdcabb] rounded-md text-sm py-1 px-2 text-[#3e4a3e]"><option>Last 30 Days</option><option>This Semester</option></select></div>
              <ResponsiveContainer width="100%" height={260}><LineChart data={engagement}><CartesianGrid strokeDasharray="3 3" stroke="#e1e2e4" /><XAxis dataKey="d" fontSize={12} stroke="#6e7a6d" /><YAxis fontSize={12} stroke="#6e7a6d" domain={[0, 100]} /><Tooltip /><Line type="monotone" dataKey="v" stroke="#2563EB" strokeWidth={3} dot={{ r: 4 }} /></LineChart></ResponsiveContainer>
            </div>
            <div className="bg-white border border-[#bdcabb] rounded-xl overflow-hidden">
              <h3 className="text-label-bold text-[#191c1e] p-5 pb-0">Recent Attention Sessions</h3>
              <table className="w-full text-sm mt-3"><thead className="bg-[#f3f4f6] text-[#3e4a3e] text-left text-xs uppercase"><tr><th className="px-5 py-3">Date</th><th className="px-5 py-3">Course</th><th className="px-5 py-3 w-48">Avg Attention</th><th className="px-5 py-3">Status</th></tr></thead>
                <tbody className="divide-y divide-[#bdcabb]/50">{sessions.map((s, i) => (<tr key={i}><td className="px-5 py-3 text-[#191c1e]">{s.date}</td><td className="px-5 py-3 text-[#3e4a3e]">{s.course}</td><td className="px-5 py-3"><div className="flex items-center gap-2"><div className="flex-1 h-2 bg-[#edeef0] rounded-full overflow-hidden"><div className="h-full bg-[#2563EB] rounded-full" style={{ width: `${s.avg}%` }}></div></div><span className="text-xs text-[#3e4a3e]">{s.avg}%</span></div></td><td className="px-5 py-3"><span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${statusTone[s.status]}`}>{s.status}</span></td></tr>))}</tbody>
              </table>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white border border-[#bdcabb] rounded-xl p-6 text-center">
              <h3 className="text-label-bold text-[#191c1e] mb-2">Avg Attention Score</h3>
              <div className="relative w-40 h-40 mx-auto"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={donut} dataKey="value" innerRadius={55} outerRadius={70} startAngle={90} endAngle={-270} stroke="none">{donut.map((d) => <Cell key={d.name} fill={d.color} />)}</Pie></PieChart></ResponsiveContainer><span className="absolute inset-0 flex items-center justify-center text-3xl font-extrabold text-[#191c1e]">75%</span></div>
              <p className="text-xs text-[#3e4a3e] mt-2">Class average across all current sessions</p>
            </div>
            <div className="bg-white border border-[#bdcabb] rounded-xl p-6">
              <h3 className="text-label-bold text-[#191c1e] mb-4">Emotion Distribution</h3>
              {[["Focused", 65, "#2563EB"], ["Confused", 20, "#405f91"], ["Distracted", 15, "#EF4444"]].map(([l, v, c]) => (<div key={l as string} className="mb-3"><div className="flex justify-between text-xs mb-1"><span className="text-[#3e4a3e]">{l}</span><span className="text-[#191c1e] font-semibold">{v}%</span></div><div className="h-2 bg-[#edeef0] rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${v}%`, background: c as string }}></div></div></div>))}
            </div>
            <div className="bg-white border border-[#bdcabb] rounded-xl p-6"><h3 className="text-label-bold text-[#191c1e] mb-2">Blink Analytics</h3><div className="flex justify-between text-sm py-1"><span className="text-[#3e4a3e]">Avg Blink Rate</span><span className="font-semibold text-[#191c1e]">18 / min</span></div><div className="flex justify-between text-sm py-1"><span className="text-[#3e4a3e]">Fatigue Indicator</span><span className="bg-[#22C55E]/15 text-[#15803D] text-xs px-2 py-0.5 rounded-full font-bold">Low</span></div></div>
          </div>
        </div>
      </div>
    </TeacherShell>
  );
}
