import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../components/Icon";
import {
  loginWithEmail,
  loginWithGoogle,
  resetPassword,
} from "../services/authService";

// Exact port of Login_page_edunext/code.html
const SLIDES = [
  "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1000&q=80", // online learning
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1000&q=80", // collaboration
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1000&q=80", // teacher mentorship
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1000&q=80", // accessibility
];

export default function StudentLogin() {
  const navigate = useNavigate();
  // Email field maps to Student ID, Password to PIN; school code fixed for the demo.
  const [email, setEmail] = useState("student1@edunext.com");
  const [password, setPassword] = useState("student123");
  const [error, setError] = useState("");
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      await loginWithEmail(email.trim(), password.trim(), "student");
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid student credentials.");
    }
  }

  async function handleGoogleLogin() {
    setError("");

    try {
      await loginWithGoogle("student");
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Google sign-in failed.");
    }
  }

  async function handleForgotPassword(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Enter your email first to reset password.");
      return;
    }

    try {
      await resetPassword(email.trim());
      setError("Password reset email sent. Check your inbox.");
    } catch (err: any) {
      setError(err.message || "Could not send reset email.");
    }
  }

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] h-screen w-screen overflow-hidden antialiased">
      <div className="flex h-full w-full">
        {/* Left Panel: Visual Storytelling Carousel */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-[#0F2B5B] items-end justify-center overflow-hidden">
          <div className="absolute inset-0 w-full h-full">
            {SLIDES.map((src, i) => (
              <img
                key={i}
                alt=""
                className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700"
                style={{
                  opacity: i === slide ? 1 : 0,
                  zIndex: i === slide ? 1 : 0,
                }}
                src={src}
              />
            ))}
          </div>
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F2B5B]/90 via-[#0F2B5B]/20 to-transparent z-10 pointer-events-none"></div>
          {/* Storytelling overlay & indicators */}
          <div className="relative z-20 w-full p-12 flex flex-col items-center pb-10">
            <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 mb-8 text-center max-w-md shadow-2xl">
              <h3 className="text-white text-headline-md mb-2">
                Learning Designed Around You
              </h3>
              <p className="text-white/80 text-body-md">
                Empowering your educational journey anytime, anywhere.
              </p>
            </div>
            <div className="flex gap-2">
              {SLIDES.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${i === slide ? "w-8 bg-[#0F2B5B]" : "w-2 bg-white/50"}`}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel: Authentication Form */}
        <div className="w-full lg:w-1/2 flex flex-col items-center bg-[#f7f9fb] overflow-y-auto px-6 py-12 lg:px-12 relative animate-fade-in">
          {/* Role Switcher */}
          <div className="w-full max-w-md flex justify-between items-center mb-8">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-1 text-label-md text-[#43474e] hover:text-[#0F2B5B] transition-colors"
            >
              <Icon name="arrow_back" className="text-[18px]" /> Home
            </button>
            <div className="inline-flex bg-[#e0e3e5] rounded-lg p-1">
              <button className="px-4 py-1.5 rounded-md bg-white text-[#191c1e] text-label-md shadow-sm transition-all">
                Student
              </button>
              <button
                onClick={() => navigate("/teacher-login")}
                className="px-4 py-1.5 rounded-md text-[#43474e] text-label-md hover:text-[#191c1e] transition-all"
              >
                Teacher
              </button>
            </div>
          </div>

          <div className="w-full max-w-md flex-grow flex flex-col justify-center">
            {/* Mobile Logo */}
            <div className="flex lg:hidden items-center justify-center gap-3 mb-8">
              <img
                src="/logo.png"
                alt="EduNext logo"
                className="w-12 h-12 rounded-xl object-contain shadow-md shrink-0"
              />
              <span className="text-headline-lg text-[#0F2B5B]">EduNext</span>
            </div>

            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-headline-lg text-[#0F2B5B] mb-2">
                Welcome back
              </h2>
              <p className="text-body-md text-[#43474e]">
                Please enter your details to sign in.
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="flex border-b border-[#c4c6cf] mb-8">
              <button className="flex-1 pb-3 text-label-md text-[#0F2B5B] border-b-2 border-[#0F2B5B] transition-colors">
                Sign In
              </button>
              <button className="flex-1 pb-3 text-label-md text-[#43474e] hover:text-[#191c1e] transition-colors border-b-2 border-transparent hover:border-[#c4c6cf]">
                Create Account
              </button>
            </div>

            {/* Google Sign In */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white border border-[#c4c6cf] rounded-xl text-[#191c1e] text-label-md hover:bg-[#f2f4f6] transition-all duration-200 shadow-sm hover:shadow active:scale-[0.98]"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.67 15.63 16.89 16.8 15.72 17.58V20.34H19.29C21.37 18.42 22.56 15.6 22.56 12.25Z"
                  fill="#4285F4"
                ></path>
                <path
                  d="M12 23C14.97 23 17.46 22.02 19.29 20.34L15.72 17.58C14.73 18.24 13.48 18.65 12 18.65C9.13 18.65 6.7 16.71 5.81 14.12H2.14V16.97C3.96 20.59 7.69 23 12 23Z"
                  fill="#34A853"
                ></path>
                <path
                  d="M5.81 14.12C5.58 13.44 5.45 12.73 5.45 12C5.45 11.27 5.58 10.56 5.81 9.88V7.03H2.14C1.39 8.52 0.95 10.21 0.95 12C0.95 13.79 1.39 15.48 2.14 16.97L5.81 14.12Z"
                  fill="#FBBC05"
                ></path>
                <path
                  d="M12 5.35C13.62 5.35 15.07 5.91 16.21 7.01L19.38 3.84C17.45 2.04 14.97 1 12 1C7.69 1 3.96 3.41 2.14 7.03L5.81 9.88C6.7 7.29 9.13 5.35 12 5.35Z"
                  fill="#EA4335"
                ></path>
              </svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-grow h-px bg-[#c4c6cf]/50"></div>
              <span className="px-4 text-label-sm text-[#74777f] uppercase tracking-wider">
                or
              </span>
              <div className="flex-grow h-px bg-[#c4c6cf]/50"></div>
            </div>

            {/* Form */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label
                  className="block text-label-md text-[#0F2B5B] mb-1.5"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-[#74777f] group-focus-within:text-[#2563EB] transition-colors">
                    <Icon name="mail" className="text-lg" />
                  </span>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white border border-[#c4c6cf] rounded-xl text-[#191c1e] focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all outline-none hover:border-[#74777f] shadow-sm"
                    id="email"
                    placeholder="student@example.com"
                    type="text"
                  />
                </div>
              </div>
              <div>
                <label
                  className="block text-label-md text-[#0F2B5B] mb-1.5"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-[#74777f] group-focus-within:text-[#2563EB] transition-colors">
                    <Icon name="lock" className="text-lg" />
                  </span>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white border border-[#c4c6cf] rounded-xl text-[#191c1e] focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all outline-none hover:border-[#74777f] shadow-sm"
                    id="password"
                    placeholder="••••••••"
                    type="password"
                  />
                </div>
              </div>

              {error && (
                <p className="text-sm text-[#EF4444] bg-[#ffdad6]/60 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    className="w-4 h-4 rounded border-[#c4c6cf] text-[#0F2B5B] focus:ring-[#0F2B5B]/50 transition-colors cursor-pointer accent-[#0F2B5B]"
                    type="checkbox"
                    defaultChecked
                  />
                  <span className="text-label-md text-[#43474e] group-hover:text-[#0F2B5B] transition-colors">
                    Remember me
                  </span>
                </label>
                <a
                  className="text-label-md text-[#2563EB] hover:text-blue-700 transition-colors"
                  href="#"
                  onClick={handleForgotPassword}
                >
                  Forgot Password?
                </a>
              </div>

              <button
                className="w-full py-3.5 px-4 bg-[#0F2B5B] text-white rounded-xl text-label-md shadow-lg shadow-[#0F2B5B]/20 hover:shadow-xl hover:bg-[#0A1F44] active:scale-[0.98] transition-all duration-200 mt-4"
                type="submit"
              >
                Sign In
              </button>
            </form>

            {/* Trust Indicators */}
            <div className="mt-12 grid grid-cols-2 gap-y-3 gap-x-4">
              {[
                "Offline Learning",
                "Multi-Language Learning",
                "Community Support",
                "Adaptive Learning",
              ].map((f) => (
                <div
                  key={f}
                  className="flex items-center gap-2 text-[#43474e]/80 text-label-sm"
                >
                  <Icon
                    name="check_circle"
                    className="text-[16px] text-[#15803D]"
                  />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
