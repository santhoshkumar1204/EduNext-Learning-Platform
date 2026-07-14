import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Icon from "../components/Icon";
import { teacherLogin } from "../lib/database";
import { IMG } from "../lib/images";

const perks = [
  "Create Courses & Upload Materials",
  "Manage Assignments & Quizzes",
  "Monitor Student Analytics & Reports",
];

const SLIDES = [
  IMG.teacherLogin,
  IMG.teacher,
  "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80",
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
];

export default function TeacherLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("anita.rao@lumina.edu");
  const [password, setPassword] = useState("teacher123");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await teacherLogin(email, password);
      if (user) navigate("/teacher-dashboard");
      else setError("Invalid credentials. Password is teacher123.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen flex bg-white">
      {/* Left — teacher photo */}
      <div className="hidden lg:block w-1/2 h-screen relative overflow-hidden">
        {SLIDES.map((src, i) => (
          <img key={i} src={src} alt="Teacher" className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000" style={{ opacity: i === slide ? 1 : 0 }} />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent" />
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)} aria-label={`Show slide ${i + 1}`} className={`h-1.5 rounded-full transition-all ${i === slide ? "w-8 bg-white" : "w-2 bg-white/50 hover:bg-white/70"}`} />
          ))}
        </div>
      </div>

      {/* Right — form */}
      <div className="w-full lg:w-1/2 h-screen overflow-y-auto flex flex-col px-8 sm:px-16 py-8">
        <div className="w-full max-w-md m-auto">
          <div className="flex justify-between items-center mb-8">
            <Link to="/" className="flex items-center gap-1 text-sm font-semibold text-gray-500 hover:text-navy transition-colors"><Icon name="arrow_back" className="text-[18px]" /> Home</Link>
            <div className="flex bg-gray-100 rounded-full p-1">
              <Link to="/student-login" className="px-5 py-1.5 rounded-full text-gray-500 text-sm font-semibold hover:text-navy">Student</Link>
              <span className="px-5 py-1.5 rounded-full bg-white shadow-sm text-navy text-sm font-semibold">Teacher</span>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-navy mb-1 font-display">Welcome Back, Educator</h1>
          <p className="text-gray-500 mb-6">Sign in to manage courses, track learner engagement, and monitor classroom analytics.</p>

          <div className="flex gap-6 border-b border-gray-200 mb-6">
            <span className="pb-2 border-b-2 border-[#0F2B5B] text-[#0F2B5B] font-semibold text-sm">Sign In</span>
            <span className="pb-2 text-gray-400 font-semibold text-sm">Create Account</span>
          </div>

          <button type="button" className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-3 font-semibold text-gray-700 hover:bg-gray-50 transition mb-5">
            <img src="https://www.google.com/favicon.ico" alt="" className="w-5 h-5" />
            Continue with Google
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="h-px bg-gray-200 flex-1" />
            <span className="text-xs text-gray-400 font-medium">OR</span>
            <div className="h-px bg-gray-200 flex-1" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Icon name="mail" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="teacher@institution.edu" className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 pl-11 pr-4 text-navy focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Icon name="lock" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 pl-11 pr-4 text-navy focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition" />
              </div>
            </div>

            {error && <p className="text-sm text-error bg-red-50 rounded-lg px-3 py-2">{error}</p>}

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="rounded accent-[#0F2B5B]" />
                Remember me
              </label>
              <a href="#" className="text-[#2563EB] font-semibold">Forgot Password?</a>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-[#0F2B5B] hover:bg-[#0A1F44] text-white font-semibold rounded-lg py-3 transition hover:scale-[1.01] disabled:opacity-60">
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <div className="mt-6 bg-[#0F2B5B]/5 border border-[#0F2B5B]/20 rounded-xl p-5">
            <p className="font-semibold text-navy mb-3 flex items-center gap-2">
              <Icon name="verified" className="text-[#0F2B5B] text-[18px]" /> As a Teacher You Can:
            </p>
            <ul className="space-y-2">
              {perks.map((p) => (
                <li key={p} className="flex items-center gap-2 text-sm text-gray-700">
                  <Icon name="check_circle" className="text-[#15803D] text-[18px]" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
