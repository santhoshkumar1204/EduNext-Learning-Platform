import Icon from "../components/Icon";
import TeacherShell from "../components/TeacherShell";

// Exact port of teacher_quizzes/code.html (Quiz Management)
const STATS = [
  { icon: "monitoring", box: "bg-[#0F2B5B]/10 text-[#0F2B5B]", label: "Average Score", value: "78.4%", note: <span className="text-label-sm text-[#15803D] flex items-center"><Icon name="arrow_upward" className="text-[14px]" /> 2.1%</span> },
  { icon: "emoji_events", box: "bg-[#a6c5fe]/30 text-[#405f91]", label: "Highest Score", value: "100%", note: <span className="text-label-sm text-[#3e4a3e]">in 5 Quizzes</span> },
  { icon: "group_add", box: "bg-[#645efb]/20 text-[#4b41e1]", label: "Total Attempts", value: "1,492", note: <span className="text-label-sm text-[#3e4a3e]">This Semester</span> },
];
const QUIZZES = [
  { title: "Midterm Review: Cell Biology & Genetics", status: "Published", course: "Biology 101", lesson: "Week 4: Cellular Structures", diff: "Medium", diffColor: "#405f91", qs: 25, time: "45 mins", attempts: 142, avg: "82%", draft: false },
  { title: "Pop Quiz: Organic Nomenclature", status: "Draft", course: "Chemistry 201", lesson: "Week 2: Alkanes", diff: "Hard", diffColor: "#EF4444", qs: 10, time: "15 mins", attempts: "-", avg: "-", draft: true },
  { title: "Final Assessment: Loops & Functions", status: "Published", course: "Intro to CS", lesson: "Week 8: Iteration", diff: "Easy", diffColor: "#15803D", qs: 30, time: "60 mins", attempts: 318, avg: "88%", draft: false },
];

export default function TeacherQuizzes() {
  return (
    <TeacherShell active="Quizzes">
      <div className="max-w-[1280px] mx-auto flex flex-col gap-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div><h1 className="text-headline-lg text-[#191c1e]">Quiz Management</h1><p className="text-body-md text-[#3e4a3e] mt-1">Create and manage assessments for your courses.</p></div>
          <button className="flex items-center gap-2 bg-[#0F2B5B] text-white px-5 py-2.5 rounded-lg text-label-bold hover:bg-[#0A1F44] shadow-sm transition-all active:scale-95"><Icon name="add" className="text-[20px]" /> Create Quiz</button>
        </div>

        {/* Stats */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((s) => (
            <div key={s.label} className="bg-white border border-[#bdcabb] rounded-xl p-5 shadow-sm relative overflow-hidden group">
              <div className="flex items-center gap-3 mb-3"><div className={`w-10 h-10 rounded-full flex items-center justify-center ${s.box}`}><Icon name={s.icon} /></div><span className="text-label-bold text-[#3e4a3e]">{s.label}</span></div>
              <div className="flex items-baseline gap-2"><span className="text-headline-lg text-[#191c1e]">{s.value}</span>{s.note}</div>
            </div>
          ))}
          <div className="bg-white border border-[#bdcabb] rounded-xl p-5 shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 rounded-full bg-[#ffdad6]/50 flex items-center justify-center text-[#EF4444]"><Icon name="warning" /></div><span className="text-label-bold text-[#3e4a3e]">Weak Topics</span></div>
            <div className="flex flex-col"><span className="text-body-md text-[#191c1e] font-semibold truncate">Cellular Respiration</span><span className="text-label-sm text-[#EF4444] flex items-center gap-1 mt-1"><Icon name="trending_down" className="text-[14px]" /> 45% Avg Success</span></div>
          </div>
        </section>

        {/* Filters */}
        <section className="bg-white p-4 rounded-xl border border-[#bdcabb] shadow-sm flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-3 flex-1">
            <div className="relative w-full md:w-64"><Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3e4a3e] text-[18px]" /><input className="w-full bg-[#f8f9fb] border border-[#bdcabb] rounded-lg py-1.5 pl-9 pr-3 text-body-md text-[#191c1e] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] h-10" placeholder="Search quizzes..." /></div>
            {[["All Courses", "Biology 101", "Chemistry 201"], ["All Lessons", "Lesson 1", "Lesson 2"], ["Difficulty", "Easy", "Medium", "Hard"], ["Status", "Published", "Draft"]].map((o, i) => (
              <select key={i} className="bg-[#f8f9fb] border border-[#bdcabb] text-[#191c1e] text-body-md rounded-lg focus:ring-[#2563EB] focus:border-[#2563EB] p-2 h-10 min-w-[120px]">{o.map((x) => <option key={x}>{x}</option>)}</select>
            ))}
          </div>
          <button className="text-[#3e4a3e] hover:text-[#191c1e] flex items-center gap-1 text-label-bold px-2 py-1 rounded hover:bg-[#f3f4f6] transition-colors"><Icon name="filter_alt_off" className="text-[18px]" /> Clear</button>
        </section>

        {/* Quiz cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {QUIZZES.map((q) => (
            <article key={q.title} className="bg-white border border-[#bdcabb] rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col">
              <div className="p-5 border-b border-[#bdcabb]/50">
                <div className="flex justify-between items-start mb-2"><h3 className="text-label-bold text-[#191c1e] text-lg leading-tight line-clamp-2">{q.title}</h3><span className={`text-label-sm px-2.5 py-0.5 rounded border whitespace-nowrap ${q.draft ? "bg-[#e1e2e4] text-[#3e4a3e] border-[#bdcabb]" : "bg-[#22C55E]/15 text-[#15803D] border-[#22C55E]/30"}`}>{q.status}</span></div>
                <div className="flex flex-col gap-1 mt-3"><span className="text-body-md text-[#3e4a3e] flex items-center gap-2"><Icon name="menu_book" className="text-[16px]" /> {q.course}</span><span className="text-body-md text-[#3e4a3e] flex items-center gap-2"><Icon name="play_lesson" className="text-[16px]" /> {q.lesson}</span></div>
                <div className="mt-4 inline-flex items-center gap-1 bg-[#e7e8ea] px-2 py-1 rounded text-[#3e4a3e] text-label-sm"><div className="w-2 h-2 rounded-full" style={{ background: q.diffColor }}></div> {q.diff}</div>
              </div>
              <div className={`p-5 grid grid-cols-2 gap-4 bg-[#f8f9fb]/50 flex-1 ${q.draft ? "opacity-70" : ""}`}>
                {[["Questions", q.qs], ["Time Limit", q.time], ["Attempts", q.attempts], ["Avg Score", q.avg]].map(([l, v], i) => (
                  <div key={l as string}><span className="block text-label-sm text-[#3e4a3e] mb-1">{l}</span><span className={`text-label-bold ${i === 3 && !q.draft ? "text-[#15803D]" : "text-[#191c1e]"}`}>{v}</span></div>
                ))}
              </div>
              <div className="p-3 border-t border-[#bdcabb]/50 flex justify-between bg-white rounded-b-xl">
                <button className="p-2 text-[#3e4a3e] hover:text-[#2563EB] hover:bg-[#2563EB]/10 rounded transition-colors" title="Edit"><Icon name="edit" /></button>
                <button className="p-2 text-[#3e4a3e] hover:text-[#405f91] hover:bg-[#a6c5fe]/20 rounded transition-colors" title="View Analytics"><Icon name="bar_chart" /></button>
                <button className="p-2 text-[#3e4a3e] hover:text-[#191c1e] hover:bg-[#e7e8ea] rounded transition-colors" title="Duplicate"><Icon name="content_copy" /></button>
                <button className="p-2 text-[#3e4a3e] hover:text-[#EF4444] hover:bg-[#ffdad6]/30 rounded transition-colors" title="Delete"><Icon name="delete" /></button>
              </div>
            </article>
          ))}
        </section>
      </div>
    </TeacherShell>
  );
}
