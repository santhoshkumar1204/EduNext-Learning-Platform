import { useState } from "react";
import { Link } from "react-router-dom";
import PortalShell from "../components/PortalShell";
import Icon from "../components/Icon";

// Exact port of student_assignments/code.html (single submission view)
export default function Assignments() {
  const [tab, setTab] = useState<"file" | "text">("file");
  const [checks, setChecks] = useState([true, true, false]);

  return (
    <PortalShell active="Assignments">
      <div className="max-w-[1200px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Breadcrumb */}
        <div className="col-span-1 lg:col-span-12 mb-2 flex flex-col gap-4">
          <nav className="flex items-center text-label-sm text-[#43474e] gap-2 flex-wrap">
            <Link to="/dashboard" className="hover:text-[#0F2B5B] transition-colors">Dashboard</Link>
            <Icon name="chevron_right" className="text-[16px]" />
            <Link to="/my-courses" className="hover:text-[#0F2B5B] transition-colors">Introduction to Machine Learning</Link>
            <Icon name="chevron_right" className="text-[16px]" />
            <span className="text-[#191c1e] font-medium">Machine Learning Case Study</span>
          </nav>
        </div>

        {/* Left column (8) */}
        <div className="col-span-1 lg:col-span-8 flex flex-col gap-6">
          {/* Header card */}
          <div className="glass-panel rounded-2xl p-6 md:p-8 flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0F2B5B]/10 text-[#0F2B5B] text-label-sm mb-3"><Icon name="science" className="text-[14px]" /><span>Introduction to Machine Learning</span></div>
                <h1 className="text-headline-lg text-[#191c1e] mb-2">Machine Learning Case Study</h1>
                <p className="text-[#43474e] text-body-md flex items-center gap-2"><Icon name="person" className="text-[18px]" /> Instructor: Dr. Amarjeet Kaur</p>
              </div>
              <div className="flex flex-col gap-2 min-w-[160px]">
                <div className="bg-[#ffdad6]/30 border border-[#ffdad6] text-[#191c1e] rounded-xl p-3 flex flex-col items-center justify-center">
                  <span className="text-label-sm text-[#43474e] uppercase tracking-wider">Due Date</span>
                  <span className="text-headline-md text-[#EF4444] flex items-center gap-1"><Icon name="calendar_clock" className="text-[20px]" /> 10 Jun 2026</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#c4c6cf]/30">
              <div className="flex flex-col"><span className="text-label-sm text-[#43474e]">Status</span><span className="text-label-md text-[#455f88] flex items-center gap-1 mt-1"><Icon name="pending_actions" className="text-[16px]" /> Pending</span></div>
              <div className="flex flex-col"><span className="text-label-sm text-[#43474e]">Marks</span><span className="text-label-md text-[#191c1e] mt-1">20 Points</span></div>
              <div className="flex flex-col"><span className="text-label-sm text-[#43474e]">Difficulty</span><span className="text-label-md text-[#d97706] flex items-center gap-1 mt-1"><Icon name="signal_cellular_alt" className="text-[16px]" /> Medium</span></div>
              <div className="flex flex-col"><span className="text-label-sm text-[#43474e]">Format</span><span className="text-label-md text-[#191c1e] mt-1">PDF / Text</span></div>
            </div>
          </div>

          {/* Description */}
          <div className="glass-panel rounded-2xl p-6 md:p-8 flex flex-col gap-6">
            <h2 className="text-headline-md text-[#191c1e] flex items-center gap-2"><Icon name="description" className="text-[#0F2B5B]" /> Assignment Details</h2>
            <div className="max-w-none text-[#43474e]">
              <p className="text-body-md mb-4">Analyze the provided dataset using at least two different supervised learning algorithms (e.g., Random Forest, SVM, or Gradient Boosting). Compare their performance, accuracy, and computational efficiency.</p>
              <h3 className="text-label-md text-[#191c1e] mt-6 mb-2">Objectives:</h3>
              <ul className="list-disc pl-5 space-y-1 text-body-md">
                <li>Understand and apply supervised learning models to real-world data.</li>
                <li>Evaluate model performance using appropriate metrics (Precision, Recall, F1-Score).</li>
                <li>Document the data preprocessing steps and feature selection rationale.</li>
              </ul>
              <h3 className="text-label-md text-[#191c1e] mt-6 mb-2">Requirements:</h3>
              <ul className="list-disc pl-5 space-y-1 text-body-md">
                <li>Submit a comprehensive PDF report (minimum 2 pages).</li>
                <li>Include code snippets or link to a Jupyter Notebook repository.</li>
                <li>Provide clear visualizations (charts/graphs) supporting your conclusions.</li>
              </ul>
            </div>
          </div>

          {/* Submission */}
          <div className="glass-panel rounded-2xl p-6 md:p-8 flex flex-col gap-6">
            <h2 className="text-headline-md text-[#191c1e] flex items-center gap-2"><Icon name="upload_file" className="text-[#0F2B5B]" /> Your Submission</h2>
            <div className="flex border-b border-[#c4c6cf]/30 mb-2">
              <button onClick={() => setTab("file")} className={`px-4 py-2 border-b-2 text-label-md ${tab === "file" ? "border-[#0F2B5B] text-[#0F2B5B]" : "border-transparent text-[#43474e] hover:text-[#191c1e]"}`}>File Upload</button>
              <button onClick={() => setTab("text")} className={`px-4 py-2 border-b-2 text-label-md ${tab === "text" ? "border-[#0F2B5B] text-[#0F2B5B]" : "border-transparent text-[#43474e] hover:text-[#191c1e]"}`}>Text Entry</button>
            </div>

            {tab === "file" ? (
              <>
                <label className="file-drop-zone border-2 border-dashed border-[#c4c6cf] rounded-xl p-8 flex flex-col items-center justify-center text-center bg-[#f7f9fb]/50 cursor-pointer hover:bg-[#f2f4f6]/50">
                  <div className="w-16 h-16 rounded-full bg-[#1a365d]/20 text-[#0F2B5B] flex items-center justify-center mb-4"><Icon name="cloud_upload" className="text-[32px]" /></div>
                  <h3 className="text-label-md text-[#191c1e] mb-1">Drag and drop files here</h3>
                  <p className="text-body-md text-[#43474e] mb-4">or click to browse from your computer</p>
                  <span className="bg-white text-[#191c1e] border border-[#c4c6cf] px-6 py-2 rounded-lg text-label-md shadow-sm hover:bg-[#f2f4f6] transition-colors">Select Files</span>
                  <p className="text-label-sm text-[#74777f] mt-4">Supported formats: PDF, DOCX, PPT, ZIP, JPEG, PNG<br />Maximum file size: 50MB</p>
                  <input type="file" className="hidden" />
                </label>
                <div className="flex flex-col gap-2 mt-2">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-[#c4c6cf]/50 bg-white">
                    <div className="flex items-center gap-3"><Icon name="picture_as_pdf" className="text-[#EF4444]" /><span className="text-label-md text-[#191c1e]">ML_CaseStudy_Draft.pdf</span><span className="text-label-sm text-[#43474e]">(2.4 MB)</span></div>
                    <button className="text-[#43474e] hover:text-[#EF4444] transition-colors p-1"><Icon name="close" className="text-[20px]" /></button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <label className="text-label-md text-[#191c1e]">Comments / Text Submission</label>
                <textarea className="w-full rounded-xl border border-[#c4c6cf] bg-white p-4 text-body-md text-[#191c1e] focus:ring-2 focus:ring-[#0F2B5B] focus:border-[#0F2B5B] resize-y outline-none" placeholder="Add any comments or paste your text submission here..." rows={4}></textarea>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-between mt-4 pt-4 border-t border-[#c4c6cf]/30 gap-4">
              <span className="text-label-sm text-[#43474e] flex items-center gap-1"><Icon name="cloud_done" className="text-[16px]" /> Last Saved: 2 minutes ago</span>
              <div className="flex gap-3 w-full sm:w-auto">
                <button className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg border border-[#c4c6cf] bg-white text-[#191c1e] text-label-md hover:bg-[#f2f4f6] transition-colors shadow-sm">Save Draft</button>
                <button className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg bg-gradient-to-b from-[#0F2B5B] to-[#001530] text-white text-label-md hover:scale-[1.02] hover:shadow-md transition-all">Submit Assignment</button>
              </div>
            </div>
          </div>
        </div>

        {/* Right column (4) */}
        <div className="col-span-1 lg:col-span-4 flex flex-col gap-6">
          {/* Checklist */}
          <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4">
            <h3 className="text-headline-md text-[#191c1e] flex items-center gap-2"><Icon name="checklist" className="text-[#0F2B5B]" /> Checklist</h3>
            <div className="flex flex-col gap-3">
              {["Read all assignment guidelines and objectives.", "File uploaded meets the size & format requirements.", "Reviewed document for formatting and typos."].map((t, i) => (
                <label key={i} className="flex items-start gap-3 cursor-pointer group">
                  <input checked={checks[i]} onChange={() => setChecks((c) => c.map((v, j) => (j === i ? !v : v)))} className="mt-1 w-5 h-5 rounded border-[#c4c6cf] text-[#0F2B5B] focus:ring-[#0F2B5B] bg-[#f7f9fb] accent-[#0F2B5B]" type="checkbox" />
                  <span className="text-body-md text-[#191c1e] group-hover:text-[#0F2B5B] transition-colors">{t}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Related Materials */}
          <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4">
            <h3 className="text-headline-md text-[#191c1e] flex items-center gap-2"><Icon name="menu_book" className="text-[#455f88]" /> Related Materials</h3>
            <div className="flex flex-col gap-2">
              {[["Lecture 4 Notes", "PDF • 1.2 MB", "notes"], ["Dataset Reference", "PDF • 4.5 MB", "picture_as_pdf"], ["Recorded Session", "Video • 45 mins", "play_circle"]].map(([title, meta, icon]) => (
                <a key={title} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#f2f4f6] transition-colors border border-transparent hover:border-[#c4c6cf]/30 group" href="#">
                  <div className="w-10 h-10 rounded-lg bg-[#1a365d]/10 text-[#0F2B5B] flex items-center justify-center group-hover:bg-[#0F2B5B] group-hover:text-white transition-colors"><Icon name={icon} /></div>
                  <div className="flex flex-col"><span className="text-label-md text-[#191c1e]">{title}</span><span className="text-label-sm text-[#43474e]">{meta}</span></div>
                </a>
              ))}
            </div>
          </div>

          {/* Evaluation placeholder */}
          <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4 border-dashed border-2 border-[#c4c6cf]/50 opacity-70 bg-white/50">
            <h3 className="text-headline-md text-[#191c1e] flex items-center gap-2"><Icon name="grading" className="text-[#74777f]" /> Evaluation</h3>
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <Icon name="hourglass_empty" className="text-[48px] text-[#c4c6cf] mb-2" />
              <p className="text-label-md text-[#43474e]">Awaiting Submission &amp; Grading</p>
              <p className="text-body-md text-[#74777f] mt-1 text-sm">Feedback and marks will appear here once the instructor grades your work.</p>
            </div>
          </div>
        </div>

        <div className="col-span-12 h-16"></div>
      </div>
    </PortalShell>
  );
}
