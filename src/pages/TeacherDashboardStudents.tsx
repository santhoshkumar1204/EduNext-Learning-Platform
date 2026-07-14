import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../components/Icon";
import TeacherShell from "../components/TeacherShell";
import { avatarUrl, IMG } from "../lib/images";

// Exact port of teacher_attentionanalytics_webcam_recordings/code.html
const UPLOAD_BASE = "http://localhost:5000";

const SAMPLES = [
  { student: "Student-1", file: "binary_trees.webm", title: "Binary Trees Overview", course: "Data Structures", courseCl: "bg-[#0F2B5B]/10 text-[#0F2B5B] border-[#0F2B5B]/20", date: "Oct 24, 2023", time: "10:00 AM", dur: "45:00", thumb: IMG.studentsStudying, notes: "Alex showed excellent attention during the core algorithm explanation, but appeared distracted around the 30-minute mark when discussing AVL tree balancing. Might need to review that section with him." },
  { student: "Student-1", file: "neural_nets.webm", title: "Neural Networks Fundamentals", course: "Intro to AI", courseCl: "bg-[#405f91]/15 text-[#405f91] border-[#405f91]/20", date: "Oct 22, 2023", time: "14:30 PM", dur: "60:00", thumb: IMG.heroClassroom, notes: "Solid engagement throughout the full hour. Asked several insightful questions via chat during the backpropagation segment. Good posture and clear focus." },
];

export default function TeacherDashboardStudents() {
  const [recordings, setRecordings] = useState<{ student: string; file: string }[]>([]);
  useEffect(() => {
    fetch(`${UPLOAD_BASE}/recordings`).then((r) => r.json()).then((data) => {
      if (Array.isArray(data)) setRecordings(data.flatMap((g: any) => (g.files || []).map((f: string) => ({ student: g.student, file: f }))));
    }).catch(() => setRecordings([]));
  }, []);

  // Show real recordings if any, else the design's sample cards.
  const cards = recordings.length ? recordings.map((r, i) => ({ ...SAMPLES[i % 2], student: r.student, file: r.file, title: r.file.replace(/\.webm$/, ""), date: "Today" })) : SAMPLES;

  return (
    <TeacherShell active="Attention Analytics">
      <div className="max-w-[1280px] mx-auto">
        {/* Student context header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-[#bdcabb] pb-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#edeef0] shadow-sm border border-[#bdcabb]"><img alt="" className="w-full h-full object-cover" src={avatarUrl("Alex Mercer")} /></div>
            <div>
              <h2 className="text-headline-lg text-[#191c1e] m-0">Alex Mercer</h2>
              <div className="flex items-center gap-2 mt-1 text-[#3e4a3e] text-label-bold"><Icon name="badge" className="text-[18px]" /><span>Student ID: CS-2024-089</span><span className="w-1 h-1 rounded-full bg-[#bdcabb] mx-1"></span><Icon name="videocam" className="text-[18px] text-[#2563EB]" /><span className="text-[#2563EB] font-bold">Webcam Recordings</span></div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex flex-col gap-1"><label className="text-label-sm text-[#3e4a3e]">Course Filter</label><select className="border border-[#bdcabb] rounded-lg px-3 py-2 bg-white text-[#191c1e] focus:ring-1 focus:ring-[#2563EB] focus:border-[#2563EB] outline-none"><option>All Courses</option><option>Data Structures</option><option>Intro to AI</option></select></div>
            <div className="flex flex-col gap-1"><label className="text-label-sm text-[#3e4a3e]">Date Range</label><input className="border border-[#bdcabb] rounded-lg px-3 py-2 bg-white text-[#191c1e] focus:ring-1 focus:ring-[#2563EB] outline-none" type="date" /></div>
          </div>
        </div>

        {/* Recordings */}
        <div className="flex flex-col gap-6">
          {cards.map((rec: any, i: number) => (
            <div key={i} className="bg-white border border-[#bdcabb] rounded-xl p-5 shadow-sm flex flex-col lg:flex-row gap-6 hover:border-[#2563EB]/50 transition-colors group">
              <Link to={`/play-video/${rec.student}/${rec.file}`} className="relative w-full lg:w-64 aspect-video rounded-lg overflow-hidden bg-[#edeef0] shrink-0 cursor-pointer block">
                <img alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={rec.thumb} />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Icon name="play_circle" fill className="text-white text-4xl" /></div>
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-label-sm px-2 py-1 rounded backdrop-blur-sm">{rec.dur}</div>
              </Link>
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="text-2xl text-[#191c1e] m-0 mb-1">{rec.title}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-[#3e4a3e] text-label-bold mb-4"><span className={`px-2 py-1 rounded-md border ${rec.courseCl}`}>{rec.course}</span><div className="flex items-center gap-1"><Icon name="calendar_today" className="text-[16px]" /> {rec.date}</div><div className="flex items-center gap-1"><Icon name="schedule" className="text-[16px]" /> {rec.time}</div></div>
                  </div>
                  <Link to={`/play-video/${rec.student}/${rec.file}`} className="flex items-center gap-2 bg-[#f8f9fb] text-[#2563EB] border border-[#bdcabb] hover:bg-[#edeef0] px-4 py-2 rounded-lg text-label-bold transition-colors shrink-0"><Icon name="visibility" className="text-[18px]" /> View</Link>
                </div>
                <div className="mt-auto bg-[#f3f4f6] rounded-lg p-4 border border-[#bdcabb]/50 relative">
                  <Icon name="format_quote" fill className="absolute top-4 left-4 text-[#405f91]/40" />
                  <div className="pl-8"><h4 className="text-label-sm text-[#3e4a3e] uppercase tracking-wider mb-1">Teacher Notes</h4><p className="text-body-md text-[#191c1e] m-0">{rec.notes}</p></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </TeacherShell>
  );
}
