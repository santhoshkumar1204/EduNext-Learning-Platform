import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../components/Icon";
import TeacherShell from "../components/TeacherShell";
import { getCurrentUser, addTeacherCourse } from "../lib/database";

// Exact port of teacher_courses_createnewcourse 0-5 (6-step wizard)
const STEPS = ["Basic Info", "Structure", "Content", "Permissions", "Quizzes", "Publish"];
const label = "block text-label-bold text-[#191c1e] mb-2";
const field = "w-full bg-white border border-[#bdcabb] rounded-lg p-3 text-body-md text-[#191c1e] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]";

export default function CreateCourse() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ title: "", description: "", category: "Computer Science", level: "Beginner", language: "English", modules: ["Module 1: Introduction"], enroll: "All Students" });
  function set<K extends keyof typeof form>(k: K, v: (typeof form)[K]) { setForm((f) => ({ ...f, [k]: v })); }

  async function publish() {
    if (!user?.id) return;
    await addTeacherCourse({ title: form.title || "Untitled Course", description: form.description, category: form.category, level: form.level, language: form.language, duration: "8 weeks", teacherId: user.id, status: "Active", code: "NEW" + Math.floor(Math.random() * 900 + 100), semester: "Fall 2025", thumbnail: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&q=80", students: 0, completion: 0 });
    navigate("/teacher-courses");
  }

  return (
    <TeacherShell active="Courses">
      <div className="max-w-[800px] mx-auto">
        <div className="mb-8"><h2 className="text-headline-lg text-[#191c1e] mb-2">Create New Course</h2><p className="text-body-md text-[#3e4a3e]">Set up the foundational details of your new learning module.</p></div>

        {/* Stepper */}
        <div className="mb-10 flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-[#e7e8ea] -z-10"></div>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-[#0F2B5B] -z-10 transition-all" style={{ width: `${(step / (STEPS.length - 1)) * 100}%` }}></div>
          {STEPS.map((s, i) => (
            <div key={s} className={`flex-col items-center gap-2 bg-[#f8f9fb] px-2 ${i > 0 && i < 5 ? "hidden sm:flex" : "flex"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-label-bold ring-4 ring-[#f8f9fb] ${i <= step ? "bg-[#0F2B5B] text-white" : "bg-[#e7e8ea] text-[#3e4a3e]"}`}>{i < step ? <Icon name="check" className="text-[16px]" /> : i + 1}</div>
              <span className={`text-label-sm ${i === step ? "text-[#0F2B5B] font-bold" : "text-[#3e4a3e]"}`}>{s}</span>
            </div>
          ))}
        </div>

        {/* Form card */}
        <div className="bg-white border border-[#bdcabb] rounded-xl p-8 shadow-sm">
          {step === 0 && (
            <div className="flex flex-col gap-6">
              <div><label className={label}>Course Title</label><input value={form.title} onChange={(e) => set("title", e.target.value)} className={field} placeholder="e.g. Advanced Machine Learning Concepts" /></div>
              <div><label className={label}>Course Description</label><textarea value={form.description} onChange={(e) => set("description", e.target.value)} className={field + " resize-none"} rows={4} placeholder="Briefly describe what students will learn..." /></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div><label className={label}>Category</label><select value={form.category} onChange={(e) => set("category", e.target.value)} className={field}><option>Computer Science</option><option>Mathematics</option><option>Physics</option><option>Data Science</option></select></div>
                <div><label className={label}>Difficulty Level</label><select value={form.level} onChange={(e) => set("level", e.target.value)} className={field}><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></div>
              </div>
              <div><label className={label}>Primary Language</label><div className="max-w-[50%]"><select value={form.language} onChange={(e) => set("language", e.target.value)} className={field}><option>English</option><option>Hindi</option><option>Punjabi</option></select></div></div>
              <div>
                <label className={label}>Course Thumbnail</label>
                <label className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-[#bdcabb] border-dashed rounded-xl bg-[#f3f4f6] hover:bg-[#edeef0] transition-colors cursor-pointer group">
                  <div className="space-y-2 text-center"><Icon name="image" className="text-4xl text-[#3e4a3e] group-hover:text-[#2563eb] transition-colors" /><div className="flex text-sm justify-center"><span className="text-label-bold text-[#2563EB]">Upload a file</span><p className="pl-1 text-body-md text-[#3e4a3e]">or drag and drop</p></div><p className="text-label-sm text-[#3e4a3e]">PNG, JPG, GIF up to 5MB</p><p className="text-label-sm text-[#3e4a3e] mt-2">Recommended size: 1280x720px</p><input type="file" accept="image/*" className="hidden" /></div>
                </label>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="flex flex-col gap-4">
              <h3 className="text-label-bold text-lg text-[#191c1e]">Course Structure</h3>
              <p className="text-sm text-[#3e4a3e]">Organize your course into modules. You'll add lessons in the next step.</p>
              {form.modules.map((m, i) => (
                <div key={i} className="flex items-center gap-3 bg-[#f3f4f6] border border-[#bdcabb] rounded-lg p-3"><Icon name="drag_indicator" className="text-[#6e7a6d]" /><input value={m} onChange={(e) => set("modules", form.modules.map((x, j) => (j === i ? e.target.value : x)))} className="flex-1 bg-transparent outline-none text-body-md" />{form.modules.length > 1 && <button onClick={() => set("modules", form.modules.filter((_, j) => j !== i))} className="text-[#3e4a3e] hover:text-[#EF4444]"><Icon name="delete" /></button>}</div>
              ))}
              <button onClick={() => set("modules", [...form.modules, `Module ${form.modules.length + 1}`])} className="text-label-bold text-[#2563EB] flex items-center gap-1 w-fit"><Icon name="add_circle" /> Add Module</button>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-4">
              <h3 className="text-label-bold text-lg text-[#191c1e]">Lesson Content</h3>
              <p className="text-sm text-[#3e4a3e]">Upload videos and materials for each module.</p>
              {form.modules.map((m) => (
                <div key={m} className="border border-[#bdcabb] rounded-xl p-4"><p className="text-label-bold text-[#191c1e] mb-2">{m}</p><div className="flex gap-2 flex-wrap"><button className="text-xs bg-[#f3f4f6] rounded-lg px-3 py-1.5 flex items-center gap-1 border border-[#bdcabb]"><Icon name="videocam" className="text-[16px]" /> Add Video</button><button className="text-xs bg-[#f3f4f6] rounded-lg px-3 py-1.5 flex items-center gap-1 border border-[#bdcabb]"><Icon name="description" className="text-[16px]" /> Add Material</button></div></div>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-4">
              <h3 className="text-label-bold text-lg text-[#191c1e]">Download Permissions</h3>
              <p className="text-sm text-[#3e4a3e]">Choose who can enroll and how materials are accessed.</p>
              {["All Students", "By School Code", "Invite Only"].map((opt) => (
                <label key={opt} className={`flex items-center gap-3 border-2 rounded-xl p-4 cursor-pointer ${form.enroll === opt ? "border-[#0F2B5B] bg-[#0F2B5B]/5" : "border-[#bdcabb]"}`}><input type="radio" checked={form.enroll === opt} onChange={() => set("enroll", opt)} className="accent-[#0F2B5B]" /><span className="text-body-md text-[#191c1e]">{opt}</span></label>
              ))}
            </div>
          )}

          {step === 4 && (
            <div className="flex flex-col gap-4">
              <h3 className="text-label-bold text-lg text-[#191c1e]">Quizzes</h3>
              <p className="text-sm text-[#3e4a3e]">Add an assessment per module (optional).</p>
              <div className="border-2 border-dashed border-[#bdcabb] rounded-xl p-8 text-center text-[#3e4a3e]"><Icon name="quiz" className="text-4xl mb-2" /><p className="text-sm">No quizzes added yet</p><button className="text-label-bold text-[#2563EB] mt-2">+ Add Quiz Question</button></div>
            </div>
          )}

          {step === 5 && (
            <div className="flex flex-col gap-3">
              <h3 className="text-label-bold text-lg text-[#191c1e]">Review &amp; Publish</h3>
              <div className="bg-[#f3f4f6] rounded-xl p-4 text-sm space-y-1 border border-[#bdcabb]"><p><b>Title:</b> {form.title || "Untitled"}</p><p><b>Category:</b> {form.category} · <b>Level:</b> {form.level} · <b>Language:</b> {form.language}</p><p><b>Modules:</b> {form.modules.join(", ")}</p><p><b>Enrollment:</b> {form.enroll}</p></div>
              <button onClick={publish} className="w-full bg-[#0F2B5B] hover:bg-[#0A1F44] text-white text-label-bold rounded-lg py-3">Publish Course</button>
            </div>
          )}

          {/* Actions */}
          <div className="mt-8 pt-6 border-t border-[#bdcabb] flex justify-between items-center">
            <button onClick={() => (step === 0 ? navigate("/teacher-courses") : setStep((s) => s - 1))} className="px-6 py-2.5 border border-[#bdcabb] text-[#3e4a3e] rounded-lg text-label-bold hover:bg-[#f3f4f6] transition-colors bg-white">{step === 0 ? "Cancel" : "Back"}</button>
            {step < STEPS.length - 1 && <button onClick={() => setStep((s) => s + 1)} className="px-6 py-2.5 bg-[#0F2B5B] text-white rounded-lg text-label-bold hover:bg-[#0A1F44] transition-colors flex items-center gap-2">Save &amp; Continue <Icon name="arrow_forward" className="text-sm" /></button>}
          </div>
        </div>
      </div>
    </TeacherShell>
  );
}
