import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Icon from "../components/Icon";
import { getQuizzesForCourse } from "../lib/database";
import { Quiz } from "../lib/mockData";

// Exact port of the "Quiz Mode" design (found in student_peerchallenges/code.html)
export default function QuizTake() {
  const { id } = useParams();
  const courseId = Number(id) || 1;
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(480);

  useEffect(() => {
    getQuizzesForCourse(courseId).then((qs) => {
      const q = qs[0] || null;
      setQuiz(q);
      if (q?.timeLimit) setTimeLeft(q.timeLimit);
    });
  }, [courseId]);

  useEffect(() => {
    if (!quiz || submitted) return;
    const t = setInterval(() => setTimeLeft((s) => (s <= 1 ? 0 : s - 1)), 1000);
    return () => clearInterval(t);
  }, [quiz, submitted]);

  if (!quiz) return <div className="min-h-screen flex items-center justify-center bg-[#f7f9fb] text-[#43474e]">No quiz available.</div>;

  const total = quiz.questions.length;
  const q = quiz.questions[current];
  const score = quiz.questions.filter((qq) => answers[qq.id] === qq.correctIndex).length;
  const pct = Math.round((score / total) * 100);
  const progress = Math.round((current / total) * 100);
  const mm = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const ss = String(timeLeft % 60).padStart(2, "0");

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#f7f9fb] flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg max-w-lg w-full p-8 text-center border border-[#c4c6cf]/30">
          <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4 ${pct >= 60 ? "bg-[#22C55E]/15" : "bg-[#ffdad6]"}`}><Icon name={pct >= 60 ? "celebration" : "sentiment_dissatisfied"} className={`text-4xl ${pct >= 60 ? "text-[#15803D]" : "text-[#EF4444]"}`} /></div>
          <h1 className="text-2xl font-bold text-[#0F2B5B] mb-1">{pct >= 60 ? "Well done!" : "Keep practising!"}</h1>
          <p className="text-[#43474e] mb-6">You scored {pct}% on {quiz.title}</p>
          <button onClick={() => navigate("/dashboard")} className="w-full bg-[#0F2B5B] hover:bg-[#1a365d] text-white font-semibold rounded-lg py-3">Back to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-[#f7f9fb]/80 border-b border-white/20 backdrop-blur-xl shadow-sm fixed top-0 left-0 w-full z-50">
        <div className="px-6 md:px-10 py-4 max-w-[1280px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/quizzes" className="text-[#43474e] hover:text-[#0F2B5B] transition-colors flex items-center"><Icon name="close" className="mr-2" /><span className="hidden md:inline text-label-md">Exit Quiz</span></Link>
            <div className="h-6 w-px bg-[#c4c6cf] hidden md:block"></div>
            <div>
              <h1 className="text-headline-md text-[#0F2B5B] truncate max-w-[200px] md:max-w-md">{quiz.title}</h1>
              <div className="flex items-center gap-2 mt-1"><span className="text-label-sm text-[#43474e]">Question {current + 1} of {total}</span><span className="px-2 py-0.5 bg-[#e0e3e5] text-[#43474e] rounded-full text-label-sm border border-[#c4c6cf]">Medium</span></div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-[#c4c6cf]"><Icon name="timer" className="text-[#0F2B5B]" /><span className="text-label-md text-[#191c1e] font-mono tracking-widest">{mm}:{ss}</span></div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-grow pt-[100px] pb-24 px-4 md:px-10 max-w-4xl mx-auto w-full flex flex-col gap-8">
        {/* Progress */}
        <section className="glass-panel rounded-xl p-6 flex flex-col gap-4 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#0F2B5B]/10 rounded-full blur-3xl"></div>
          <div className="flex justify-between items-end relative z-10">
            <div><p className="text-label-sm text-[#43474e] uppercase tracking-wider mb-1">Progress</p><p className="text-headline-md text-[#0F2B5B]">{progress}% Complete</p></div>
            <p className="text-label-md text-[#43474e]">{total - current} Questions Remaining</p>
          </div>
          <div className="w-full bg-[#e0e3e5] rounded-full h-3 relative overflow-hidden z-10"><div className="bg-[#2563EB] h-3 rounded-full transition-all duration-1000 ease-out relative" style={{ width: `${progress}%` }}><div className="absolute right-0 top-0 bottom-0 w-8 bg-white/30 rounded-r-full animate-pulse"></div></div></div>
        </section>

        {/* Question */}
        <section className="glass-panel rounded-2xl p-8 md:p-12 shadow-lg relative">
          <div className="mb-8">
            <span className="inline-block px-3 py-1 bg-[#d8e2ff] text-[#001a42] rounded-full text-label-sm mb-4">Module 1: Foundations</span>
            <h2 className="text-headline-lg md:text-headline-xl text-[#191c1e] leading-tight">{q.question}</h2>
          </div>
          <div className="flex flex-col gap-4">
            {q.options.map((opt, i) => {
              const selected = answers[q.id] === i;
              return (
                <button key={i} onClick={() => setAnswers((a) => ({ ...a, [q.id]: i }))} className={`flex items-center p-6 border-2 rounded-xl text-left transition-all duration-200 ${selected ? "bg-[#d6e3ff] border-[#0F2B5B]" : "border-[#c4c6cf] hover:bg-white hover:border-[#0F2B5B]/50 hover:shadow-md"}`}>
                  <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 mr-4 flex items-center justify-center transition-colors ${selected ? "bg-[#0F2B5B] border-[#0F2B5B]" : "border-[#74777f]"}`}>{selected && <Icon name="check" className="text-[16px] text-white" />}</div>
                  <div className="flex-grow"><span className="text-label-md text-[#43474e] mr-3 inline-block w-6 text-center bg-[#eceef0] rounded">{String.fromCharCode(65 + i)}</span><span className="text-body-lg text-[#191c1e]">{opt}</span></div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Navigator */}
        <div className="flex justify-center flex-wrap gap-2 py-4">
          {quiz.questions.map((qq, i) => {
            const answered = answers[qq.id] != null;
            const isCurrent = i === current;
            return (
              <button key={i} onClick={() => setCurrent(i)} className={`w-10 h-10 rounded-full text-label-md flex items-center justify-center transition-transform hover:scale-105 ${isCurrent ? "bg-[#0F2B5B] text-white shadow-md ring-2 ring-[#0F2B5B] ring-offset-2 ring-offset-[#f7f9fb]" : answered ? "bg-[#DCFCE7] text-[#15803D] shadow-sm" : "bg-[#e0e3e5] text-[#43474e] hover:bg-[#e6e8ea]"}`}>{i + 1}</button>
            );
          })}
        </div>
      </main>

      {/* Bottom controls */}
      <div className="fixed bottom-0 left-0 w-full bg-[#f7f9fb]/90 backdrop-blur-md border-t border-[#c4c6cf] py-4 px-4 md:px-10 z-40">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <button disabled={current === 0} onClick={() => setCurrent((c) => Math.max(0, c - 1))} className="px-6 py-3 border border-[#74777f] rounded-lg text-label-md text-[#43474e] hover:bg-white hover:text-[#0F2B5B] transition-colors flex items-center gap-2 disabled:opacity-40"><Icon name="arrow_back" /> Previous</button>
          <div className="text-center hidden md:block"><p className="text-label-sm text-[#43474e] flex items-center justify-center gap-1"><Icon name="cloud_done" className="text-[16px] text-[#15803D]" /> Progress Saved Automatically</p></div>
          {current < total - 1 ? (
            <button onClick={() => setCurrent((c) => c + 1)} className="px-8 py-3 bg-[#0F2B5B] text-white rounded-lg text-label-md shadow-md hover:bg-[#1a365d] hover:-translate-y-0.5 transition-all flex items-center gap-2">Next <Icon name="arrow_forward" /></button>
          ) : (
            <button onClick={() => setSubmitted(true)} className="px-8 py-3 bg-[#0F2B5B] text-white rounded-lg text-label-md shadow-md hover:opacity-90 hover:-translate-y-0.5 transition-all flex items-center gap-2">Submit <Icon name="check" /></button>
          )}
        </div>
      </div>
    </div>
  );
}
