import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Icon from "../components/Icon";
import Logo from "../components/Logo";
import { getCurrentUser, getLessonsForCourse } from "../lib/database";
import { Lesson } from "../lib/mockData";
import { avatarUrl, courseImage } from "../lib/images";

// Backend contract (DO NOT CHANGE): Flask analyzer + Node uploader.
const ANALYZE_URL = "http://localhost:5001/analyze";
const UPLOAD_BASE = "http://localhost:5000";
const ANALYZE_INTERVAL_MS = 3000;
const SAMPLE_VIDEO = "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";

// Exact port of student_webcam_page (Immersive Learning), webcam→analyze→upload kept.
export default function CourseVideo() {
  const { id } = useParams();
  const courseId = Number(id) || 1;
  const navigate = useNavigate();
  const user = getCurrentUser();

  const webcamRef = useRef<HTMLVideoElement>(null);
  const webcamStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyzeIntervalRef = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sessionId = useRef(`sess-${Date.now()}`);

  const [askPermission, setAskPermission] = useState(true);
  const [webcamConnected, setWebcamConnected] = useState(false);
  const [recording, setRecording] = useState(false);
  const [attentionScore, setAttentionScore] = useState(82);
  const [emotion, setEmotion] = useState("Engaged");
  const [eyeStatus, setEyeStatus] = useState("—");
  const [headPos, setHeadPos] = useState("—");
  const [videoProgress, setVideoProgress] = useState(0);
  const [sessionStart] = useState(Date.now());
  const [sessionDuration, setSessionDuration] = useState("00:00");
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => { getLessonsForCourse(courseId).then(setLessons); }, [courseId]);

  useEffect(() => {
    const t = window.setInterval(() => {
      const s = Math.floor((Date.now() - sessionStart) / 1000);
      setSessionDuration(`${String(Math.floor(s / 60)).padStart(2, "0")}m ${String(s % 60).padStart(2, "0")}s`);
    }, 1000);
    return () => clearInterval(t);
  }, [sessionStart]);

  useEffect(() => () => stopEverything(), []);

  async function startWebcam() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      webcamStreamRef.current = stream;
      if (webcamRef.current) { webcamRef.current.srcObject = stream; await webcamRef.current.play().catch(() => {}); }
      setWebcamConnected(true);
      setAskPermission(false);
      startRecording(stream);
      startAnalyzing();
      videoRef.current?.play().catch(() => {});
    } catch (e) {
      console.error("Webcam unavailable", e);
      setAskPermission(false);
      setWebcamConnected(false);
    }
  }

  function startRecording(stream: MediaStream) {
    try {
      recordedChunksRef.current = [];
      const mr = new MediaRecorder(stream, { mimeType: "video/webm" });
      mr.ondataavailable = (e) => { if (e.data && e.data.size > 0) recordedChunksRef.current.push(e.data); };
      mr.start(1000);
      mediaRecorderRef.current = mr;
      setRecording(true);
    } catch (e) { console.warn("MediaRecorder unavailable", e); }
  }

  function startAnalyzing() {
    if (analyzeIntervalRef.current) return;
    analyzeIntervalRef.current = window.setInterval(captureAndAnalyze, ANALYZE_INTERVAL_MS);
  }

  async function captureAndAnalyze() {
    const video = webcamRef.current, canvas = canvasRef.current;
    if (!video || !canvas || video.videoWidth === 0) return;
    canvas.width = video.videoWidth; canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
    try {
      const res = await fetch(ANALYZE_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ image: dataUrl, studentId: user?.studentId || "STU001", sessionId: sessionId.current }) });
      const data = await res.json();
      if (typeof data.attention_score === "number") setAttentionScore(data.attention_score);
      if (data.emotion) setEmotion(data.emotion);
      if (data.eye_status) setEyeStatus(data.eye_status);
      if (data.head_pos) setHeadPos(data.head_pos);
    } catch { /* backend offline — keep last values */ }
  }

  function stopAnalyzing() { if (analyzeIntervalRef.current) { clearInterval(analyzeIntervalRef.current); analyzeIntervalRef.current = null; } }

  function stopEverything() {
    stopAnalyzing();
    try { mediaRecorderRef.current?.state !== "inactive" && mediaRecorderRef.current?.stop(); } catch {}
    webcamStreamRef.current?.getTracks().forEach((t) => t.stop());
    setRecording(false);
  }

  async function handleVideoEnded() {
    stopAnalyzing();
    setUploading(true);
    const mr = mediaRecorderRef.current;
    const blob: Blob | null = await new Promise((resolve) => {
      if (!mr || mr.state === "inactive") { resolve(recordedChunksRef.current.length ? new Blob(recordedChunksRef.current, { type: "video/webm" }) : null); return; }
      mr.onstop = () => resolve(new Blob(recordedChunksRef.current, { type: "video/webm" }));
      mr.stop();
    });
    webcamStreamRef.current?.getTracks().forEach((t) => t.stop());
    try {
      if (blob && blob.size > 0) {
        const idRes = await fetch(`${UPLOAD_BASE}/next-student-id`);
        const { studentFolder } = await idRes.json();
        const filename = `${studentFolder}_${Date.now()}.webm`;
        await fetch(`${UPLOAD_BASE}/upload?student=${studentFolder}&filename=${filename}`, { method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: blob });
      }
    } catch (e) { console.warn("Upload failed (backend offline?)", e); }
    finally { setUploading(false); navigate(`/quiz/${courseId}`); }
  }

  function onTimeUpdate() { const v = videoRef.current; if (v && v.duration) setVideoProgress(Math.round((v.currentTime / v.duration) * 100)); }

  const completedLessons = lessons.filter((l) => l.completed).length;
  const currentLesson = lessons.find((l) => !l.completed) || lessons[0];

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] h-screen flex flex-col overflow-hidden">
      {/* Top nav */}
      <nav className="bg-white border-b border-[#e0e3e5] flex justify-between items-center px-6 py-3 w-full z-50 shrink-0">
        <Link to="/dashboard" className="flex items-center"><Logo size={26} /></Link>
        <div className="flex items-center gap-6">
          <div className="relative hidden md:block"><Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-[#43474e] text-[20px]" /><input className="pl-10 pr-4 py-2 bg-[#eceef0] rounded-full border border-transparent focus:bg-white focus:border-[#c4c6cf] outline-none text-body-md w-72 transition-all" placeholder="Search courses..." /></div>
          <button className="text-[#43474e] hover:text-[#191c1e] relative"><Icon name="notifications" /><span className="absolute top-0 right-0 w-2 h-2 bg-[#EF4444] rounded-full border border-white"></span></button>
          <button className="text-[#43474e] hover:text-[#191c1e]"><Icon name="settings" /></button>
          <div className="w-9 h-9 rounded-full bg-[#e0e3e5] overflow-hidden border border-[#c4c6cf]"><img alt="" className="w-full h-full object-cover" src={avatarUrl(user?.name || "Student")} /></div>
        </div>
      </nav>

      {/* Workspace */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left course nav */}
        <aside className="w-[18%] min-w-[240px] bg-white border-r border-[#e0e3e5] flex flex-col shrink-0 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-[#e0e3e5] flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className="w-16 h-12 rounded bg-[#e0e3e5] overflow-hidden shrink-0"><img alt="" className="w-full h-full object-cover" src={courseImage("Programming")} /></div>
              <div className="flex flex-col overflow-hidden"><h2 className="text-label-md text-[#191c1e] truncate">Advanced Machine Learning</h2><span className="text-label-sm text-[#43474e] truncate">Dr. Alan Turing</span></div>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center"><span className="text-label-sm text-[#43474e]">Course Progress</span><span className="text-label-sm font-semibold text-[#191c1e]">{lessons.length ? Math.round((completedLessons / lessons.length) * 100) : 18}%</span></div>
              <div className="w-full h-1.5 bg-[#e6e8ea] rounded-full overflow-hidden"><div className="h-full bg-[#2563EB] rounded-full" style={{ width: `${lessons.length ? (completedLessons / lessons.length) * 100 : 18}%` }}></div></div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            <div>
              <h3 className="px-2 text-label-sm text-[#43474e] uppercase tracking-wider mb-2">Module 1: Foundations</h3>
              <ul className="space-y-0.5">
                {(lessons.length ? lessons : [{ id: -1, title: "1.1 Linear Algebra Review", completed: true } as any, { id: -2, title: "1.2 Probability Basics", completed: true } as any]).map((l, i) => {
                  const active = currentLesson?.id === l.id;
                  return (
                    <li key={l.id}><button className={`w-full text-left p-2.5 rounded-lg flex items-center gap-3 transition-colors ${active ? "bg-blue-50 text-blue-900 shadow-sm border border-blue-100" : "hover:bg-[#f2f4f6]"}`}>
                      <Icon name={l.completed ? "check_circle" : active ? "play_circle" : "lock"} fill={l.completed} className={`text-[20px] ${l.completed ? "text-[#15803D]" : active ? "text-[#2563EB]" : "text-[#74777f]"}`} />
                      <span className="flex-1 text-[13px] truncate">{l.title}</span>
                    </button></li>
                  );
                })}
              </ul>
            </div>
          </div>
        </aside>

        {/* Center video area */}
        <section className="flex-1 flex flex-col min-w-0 bg-[#f7f9fb] overflow-y-auto w-full">
          <div className="w-full max-w-[1600px] mx-auto p-6 flex flex-col gap-6">
            {/* Video */}
            <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-md group">
              <video ref={videoRef} src={SAMPLE_VIDEO} controls onEnded={handleVideoEnded} onTimeUpdate={onTimeUpdate} className="w-full h-full object-contain" />
              {askPermission && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-center text-white p-8">
                  <div className="w-24 h-24 bg-[#2563EB]/90 backdrop-blur-md rounded-full flex items-center justify-center text-white shadow-xl mb-4"><Icon name="videocam" className="text-5xl" /></div>
                  <h3 className="text-xl font-bold mb-2">Enable your webcam to begin</h3>
                  <p className="text-white/70 max-w-md mb-6 text-sm">EduNext measures attention and engagement during the lesson. Recording stays private to your instructor.</p>
                  <div className="flex gap-3">
                    <button onClick={startWebcam} className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-semibold rounded-lg px-6 py-2.5 transition">Allow &amp; Start</button>
                    <button onClick={() => { setAskPermission(false); videoRef.current?.play().catch(() => {}); }} className="bg-white/10 text-white font-semibold rounded-lg px-6 py-2.5 hover:bg-white/20">Continue without webcam</button>
                  </div>
                </div>
              )}
            </div>

            {/* Info bar */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 shrink-0 pb-4 border-b border-[#e0e3e5]">
              <div>
                <h1 className="text-[28px] text-[#191c1e] mb-2 font-semibold">{currentLesson?.title || "2.1 Perceptrons & Activation Functions"}</h1>
                <div className="flex items-center gap-4 text-[#43474e] text-sm flex-wrap">
                  <span className="flex items-center gap-1.5"><Icon name="person" className="text-[20px]" /> Dr. Alan Turing</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c4c6cf]"></span>
                  <span className="flex items-center gap-1.5"><Icon name="schedule" className="text-[20px]" /> {currentLesson?.duration || "15:42"}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c4c6cf]"></span>
                  <span className="flex items-center gap-1.5"><Icon name="play_lesson" className="text-[20px]" /> Lesson {Math.min(completedLessons + 1, lessons.length || 3)} of {lessons.length || 12}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <button className="px-5 py-2.5 rounded-lg border border-[#c4c6cf] text-[#191c1e] hover:bg-[#f2f4f6] transition-colors text-sm flex items-center gap-2"><Icon name="forum" className="text-[20px]" /> Ask Doubt</button>
                <button className="px-5 py-2.5 rounded-lg bg-[#2563EB] text-white hover:bg-[#1d4ed8] transition-colors text-sm shadow-sm flex items-center gap-2"><Icon name="folder_open" className="text-[20px]" /> Materials <Icon name="arrow_drop_down" className="text-[20px]" /></button>
                <button className="px-3 py-2.5 rounded-lg border border-[#c4c6cf] text-[#191c1e] hover:bg-[#f2f4f6] transition-colors flex items-center"><Icon name="more_vert" className="text-[24px]" /></button>
              </div>
            </div>

            {uploading && <div className="flex items-center gap-2 text-sm text-[#2563EB] bg-blue-50 rounded-lg px-4 py-2"><Icon name="progress_activity" className="animate-spin text-[18px]" /> Saving your session recording…</div>}

            {/* Monitoring cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-6">
              {/* Webcam */}
              <div className="bg-white border border-[#e0e3e5] rounded-xl p-4 flex flex-col gap-3 shadow-sm">
                <h3 className="text-xs text-[#43474e] uppercase tracking-wider font-semibold">Live Webcam Feed</h3>
                <div className="relative w-full aspect-video bg-[#e0e3e5] rounded-lg overflow-hidden border border-[#e0e3e5]">
                  <video ref={webcamRef} muted playsInline className="w-full h-full object-cover" />
                  {recording && <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md"><div className="w-1.5 h-1.5 rounded-full bg-[#EF4444] animate-pulse"></div><span className="text-[10px] text-white font-medium tracking-wide">REC</span></div>}
                  {!webcamConnected && <div className="absolute inset-0 flex items-center justify-center text-[#74777f] text-xs">No webcam</div>}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#43474e]"><Icon name="videocam" className={webcamConnected ? "text-[16px] text-[#15803D]" : "text-[16px] text-[#74777f]"} /> {webcamConnected ? "Webcam Connected" : "Webcam Off"}</div>
              </div>

              {/* Insights */}
              <div className="bg-white border border-[#e0e3e5] rounded-xl p-4 flex flex-col gap-3 shadow-sm">
                <h3 className="text-xs text-[#43474e] uppercase tracking-wider font-semibold">Learning Insights</h3>
                <div className="flex flex-col gap-4 mt-1">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col"><span className="text-xs text-[#43474e]">Attention Score</span><span className="text-3xl font-bold text-[#191c1e]">{attentionScore}%</span></div>
                    <div className="px-3 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-semibold border border-blue-100">{attentionScore >= 80 ? "Highly Focused" : attentionScore >= 60 ? "Engaged" : "Distracted"}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 rounded-lg bg-[#f7f9fb] border border-[#e0e3e5]"><span className="block text-[10px] text-[#43474e] uppercase font-semibold">Dominant Emotion</span><span className="text-sm font-medium text-[#191c1e] capitalize">{emotion}</span></div>
                    <div className="p-2 rounded-lg bg-[#f7f9fb] border border-[#e0e3e5]"><span className="block text-[10px] text-[#43474e] uppercase font-semibold">Attention Trend</span><div className="flex items-center gap-1"><Icon name="trending_up" className="text-[#15803D] text-sm" /><span className="text-sm font-medium text-[#191c1e]">{attentionScore >= 70 ? "Improving" : "Steady"}</span></div></div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs py-1 border-b border-[#e0e3e5]/50"><span className="text-[#43474e]">Eye Status</span><span className="font-medium text-[#191c1e] capitalize">{eyeStatus}</span></div>
                    <div className="flex justify-between items-center text-xs py-1 border-b border-[#e0e3e5]/50"><span className="text-[#43474e]">Head Position</span><span className="font-medium text-[#191c1e] capitalize">{headPos}</span></div>
                    <div className="flex justify-between items-center text-xs py-1"><span className="text-[#43474e]">Focus Duration</span><span className="font-medium text-[#191c1e]">{sessionDuration}</span></div>
                  </div>
                </div>
              </div>

              {/* Session info */}
              <div className="bg-white border border-[#e0e3e5] rounded-xl p-4 flex flex-col gap-3 shadow-sm">
                <h3 className="text-xs text-[#43474e] uppercase tracking-wider font-semibold">Session Information</h3>
                <div className="flex flex-col gap-3 mt-1">
                  <div className="flex justify-between items-center text-sm py-1 border-b border-[#e0e3e5]/50"><span className="text-[#43474e]">Session Duration</span><span className="font-medium text-[#191c1e]">{sessionDuration}</span></div>
                  <div className="flex justify-between items-center text-sm py-1 border-b border-[#e0e3e5]/50"><span className="text-[#43474e]">Video Progress</span><span className="font-medium text-[#191c1e]">{videoProgress}%</span></div>
                  <div className="flex justify-between items-center text-sm py-1 border-b border-[#e0e3e5]/50"><span className="text-[#43474e]">Current Lesson</span><span className="font-medium text-[#191c1e]">#{Math.min(completedLessons + 1, lessons.length || 3)} of {lessons.length || 12}</span></div>
                  <div className="flex justify-between items-center text-sm py-1"><span className="text-[#43474e]">Lessons Completed</span><span className="font-medium text-[#191c1e]">{completedLessons} / {lessons.length || 12}</span></div>
                </div>
              </div>

              {/* Privacy */}
              <div className="bg-blue-50/30 border border-[#e0e3e5] rounded-xl p-5 flex flex-col gap-3 shadow-sm h-full justify-center">
                <div className="flex gap-3 items-start">
                  <Icon name="privacy_tip" className="text-[24px] text-[#2563EB] shrink-0 mt-0.5" />
                  <div><h3 className="text-sm text-[#191c1e] font-semibold mb-2">Privacy Notice</h3><p className="text-xs text-[#43474e] leading-relaxed">Webcam monitoring activates only after your permission is granted. Monitoring data is used to support learning analytics and attention tracking within EduNext.</p></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
