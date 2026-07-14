import Icon from "../components/Icon";
import { useParams, useNavigate } from "react-router-dom";

const UPLOAD_BASE = "http://localhost:5000";

export default function PlayVideoPage() {
  const { student, filename } = useParams();
  const navigate = useNavigate();
  const src = `${UPLOAD_BASE}/video/${student}/${filename}`;

  return (
    <div className="min-h-screen bg-navy text-white flex flex-col">
      <header className="h-16 flex items-center justify-between px-6 border-b border-white/10">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/80 hover:text-white text-sm font-semibold">
          <Icon name="arrow_back" /> Back to Recordings
        </button>
        <span className="text-sm text-white/60">{student} · {filename}</span>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-4xl">
          <video src={src} controls autoPlay className="w-full rounded-2xl bg-black aspect-video shadow-2xl" />
          <p className="text-center text-white/50 text-sm mt-4">
            Webcam session recording for {student?.replace("-", " ")}. If the video does not load, ensure the Node
            backend (port 5000) is running.
          </p>
        </div>
      </main>
    </div>
  );
}
