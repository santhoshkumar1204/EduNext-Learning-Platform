import { useEffect, useState } from "react";
import Icon from "../components/Icon";
import TeacherShell from "../components/TeacherShell";
import { getDoubts, replyToDoubt } from "../lib/database";
import { Doubt } from "../lib/mockData";
import { timeAgo } from "../lib/utils";

// Exact port of teacher_community/code.html (Community Management)
const CARDS = [
  { icon: "help_center", box: "bg-[#ffdad6]/20 text-[#EF4444]", label: "Open Doubts", value: "24" },
  { icon: "check_circle", box: "bg-[#22C55E]/15 text-[#15803D]", label: "Resolved Today", value: "18" },
  { icon: "timer", box: "bg-[#a6c5fe]/20 text-[#405f91]", label: "Avg Response", value: "2.4h" },
  { icon: "trending_up", box: "bg-[#645efb]/20 text-[#4b41e1]", label: "Top Topic", value: "Calculus Ch 4" },
];

export default function TeacherCommunity() {
  const [doubts, setDoubts] = useState<Doubt[]>([]);
  const [reply, setReply] = useState<Record<number, string>>({});
  async function load() { setDoubts(await getDoubts()); }
  useEffect(() => { load(); }, []);
  async function handleReply(id: number) { if (!reply[id]?.trim()) return; await replyToDoubt(id, reply[id].trim()); setReply((r) => ({ ...r, [id]: "" })); load(); }

  return (
    <TeacherShell active="Community">
      <div className="max-w-[1280px] mx-auto">
        <div className="mb-8"><h1 className="text-headline-lg text-[#191c1e] mb-1">Community</h1><p className="text-body-md text-[#3e4a3e]">Manage student doubts and discussions across all your active courses.</p></div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {CARDS.map((c) => (
            <div key={c.label} className="bg-white border border-[#bdcabb] p-4 rounded-xl flex flex-col justify-between hover:shadow-sm transition-shadow">
              <div className="flex justify-between items-start mb-4"><div className={`p-2 rounded-lg ${c.box}`}><Icon name={c.icon} /></div></div>
              <div><p className="text-[#3e4a3e] text-label-sm uppercase tracking-wider mb-1">{c.label}</p><h3 className={`text-[#191c1e] font-bold ${c.label === "Top Topic" ? "text-label-bold truncate" : "text-2xl"}`}>{c.value}</h3></div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          {doubts.map((d) => (
            <div key={d.id} className="bg-white border border-[#bdcabb] rounded-xl p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0F2B5B]/10 text-[#0F2B5B] flex items-center justify-center font-bold shrink-0">{d.studentName.charAt(0)}</div>
                <div className="flex-1">
                  <p className="text-sm"><b className="text-[#191c1e]">{d.studentName}</b> <span className="text-[#3e4a3e]">· {d.courseName || "General"} · {timeAgo(d.createdAt)}</span></p>
                  <p className="text-[#191c1e] mt-1">{d.question}</p>
                  {d.reply ? (
                    <div className="mt-3 bg-[#0F2B5B]/5 border-l-2 border-[#0F2B5B] rounded-r-lg p-3"><p className="text-xs font-semibold text-[#0F2B5B] mb-1">Your reply</p><p className="text-sm text-[#3e4a3e]">{d.reply}</p></div>
                  ) : (
                    <div className="flex gap-2 mt-3">
                      <input value={reply[d.id!] || ""} onChange={(e) => setReply((r) => ({ ...r, [d.id!]: e.target.value }))} placeholder="Write a reply…" className="flex-1 border border-[#bdcabb] rounded-lg px-3 py-2 text-sm" />
                      <button onClick={() => handleReply(d.id!)} className="bg-[#0F2B5B] text-white rounded-lg px-4 py-2 text-sm text-label-bold">Reply</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </TeacherShell>
  );
}
