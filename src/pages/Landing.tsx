import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import Icon from "../components/Icon";
import { IMG, avatarUrl } from "../lib/images";

// Exact port of edunext_landing_page_redesign/code.html (primary #2563EB blue).
const GLOBE = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900&q=80";
const HERO_SLIDES = [
  IMG.heroClassroom,
  IMG.studentsStudying,
  "https://images.unsplash.com/photo-1513258496099-48168024aec0?w=800&q=80",
  "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80",
];

export default function Landing() {
  const navigate = useNavigate();
  const rootRef = useRef<HTMLDivElement>(null);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  // Scroll-reveal: replicate the IntersectionObserver from the design.
  useEffect(() => {
    const els = rootRef.current?.querySelectorAll(".animate-on-scroll") ?? [];
    const obs = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={rootRef}
      className="text-slate-600 antialiased min-h-screen flex flex-col bg-[#F8FAFC] selection:bg-[#2563EB]/20 selection:text-[#2563EB]"
    >
      <style>{`
        .section-padding { padding-top: 6rem; padding-bottom: 6rem; }
        @media (min-width: 768px) { .section-padding { padding-top: 8rem; padding-bottom: 8rem; } }
        .premium-hover { transition: all 0.4s cubic-bezier(0.4,0,0.2,1); }
        .premium-hover:hover { transform: scale(1.02) translateY(-4px); box-shadow: 0 20px 40px -8px rgba(0,0,0,0.1); border-color: rgba(203,213,225,0.8); }
        .glass-card { background: rgba(255,255,255,0.85); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.5); }
        .animate-on-scroll { opacity: 0; transform: translateY(20px); transition: opacity 0.8s cubic-bezier(0.4,0,0.2,1), transform 0.8s cubic-bezier(0.4,0,0.2,1); }
        .animate-on-scroll.visible { opacity: 1; transform: translateY(0); }
        .btn-interactive:active { transform: scale(0.95); }
        .shimmer-effect { background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%); background-size: 200% 100%; animation: shimmer 2.5s infinite; }
        @keyframes shimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }
        details > summary { list-style: none; }
        details > summary::-webkit-details-marker { display: none; }
        details[open] > summary .faq-chevron { transform: rotate(180deg); }
      `}</style>

      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 transition-all duration-300">
        <div className="flex justify-between items-center px-4 md:px-8 py-4 max-w-7xl mx-auto">
          {/* Brand & Location */}
          <div className="flex items-center gap-4">
            <a className="flex items-center gap-3 transition-transform hover:opacity-90" href="#">
              <Logo size={36} />
            </a>
            <div className="hidden md:flex items-center gap-2 ml-4 bg-slate-50 px-4 py-2 rounded-full border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer">
              <Icon name="language" className="text-[18px] text-slate-500" />
              <span className="text-sm font-medium text-slate-600">US English</span>
              <Icon name="expand_more" className="text-[16px] text-slate-500" />
            </div>
          </div>
          {/* Navigation Links (Desktop) */}
          <div className="hidden lg:flex items-center gap-8">
            <a className="text-base font-semibold text-[#2563EB] border-b-2 border-[#2563EB] pb-1" href="#">Courses</a>
            <a className="text-base font-medium text-slate-500 hover:text-slate-900 transition-colors" href="#">Assignments</a>
            <a className="text-base font-medium text-slate-500 hover:text-slate-900 transition-colors" href="#">Community</a>
            <a className="text-base font-medium text-slate-500 hover:text-slate-900 transition-colors" href="#">Analytics</a>
          </div>
          {/* Trailing Actions */}
          <div className="flex items-center gap-6">
            <div className="hidden xl:flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-blue-50 text-[#2563EB] px-3 py-1.5 rounded-full border border-blue-100">
                <Icon name="wifi" className="text-[14px]" />
                <span className="text-xs font-bold tracking-wide uppercase">Online</span>
              </div>
              <div className="flex items-center gap-1.5 bg-blue-50 text-[#2563EB] px-3 py-1.5 rounded-full border border-blue-100">
                <Icon name="cloud_done" className="text-[14px]" />
                <span className="text-xs font-bold tracking-wide uppercase">All Synced</span>
              </div>
            </div>
            {/* Profile */}
            <button className="flex items-center gap-3 hover:bg-slate-50 p-1.5 rounded-full transition-all duration-300 border border-transparent hover:border-slate-200">
              <img alt="Dr. Amarjeet Kaur" className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover" src={avatarUrl("Amarjeet Kaur")} />
              <span className="hidden sm:block text-sm font-semibold text-slate-700 pr-2">Dr. Amarjeet Kaur</span>
            </button>
            {/* Mobile Menu Toggle */}
            <button className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
              <Icon name="menu" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Canvas */}
      <main className="flex-grow pt-24 md:pt-32">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 pb-20 pt-10 lg:pt-20">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-16 items-center">
            {/* Hero Content */}
            <div className="flex flex-col gap-8 xl:col-span-5 order-2 xl:order-1 relative z-10 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 bg-blue-50 text-[#2563EB] px-4 py-2 rounded-full w-fit border border-blue-100">
                <Icon name="bolt" className="text-[18px]" />
                <span className="text-sm font-bold tracking-wide uppercase">Learning Made Fun, Learning Made Yours</span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
                Transform Your Educational Journey
              </h1>
              <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl">
                Learn offline, study in your language, and achieve your dreams with our gamified learning platform designed for lifelong learners.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button onClick={() => navigate("/student-login")} className="flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-base font-semibold shadow-lg shadow-blue-500/30 transition-all duration-300 hover:-translate-y-0.5 relative overflow-hidden btn-interactive">
                  <div className="absolute inset-0 shimmer-effect pointer-events-none"></div>
                  <Icon name="play_arrow" fill className="relative z-10" />
                  <span className="relative z-10">Start Learning</span>
                </button>
                <button onClick={() => navigate("/teacher-login")} className="flex items-center justify-center gap-2 bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 px-8 py-4 rounded-xl text-base font-semibold shadow-sm transition-all duration-300 btn-interactive">
                  <Icon name="person" className="text-slate-500" />
                  Teacher Login
                </button>
              </div>
              {/* App Install Banner (Floating) */}
              <div className="mt-4 bg-white rounded-2xl p-5 flex items-center justify-between shadow-soft border border-slate-100 max-w-md hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-[#2563EB]">
                    <Icon name="download" className="text-2xl" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">Install eduNext App</h4>
                    <p className="text-sm text-slate-500 mt-0.5">Access lessons offline anytime</p>
                  </div>
                </div>
                <button className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-colors btn-interactive">
                  Install
                </button>
              </div>
            </div>
            {/* Hero Image */}
            <div className="xl:col-span-7 order-1 xl:order-2 relative animate-fade-in">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/50 aspect-[4/3] xl:aspect-[16/10]">
                {HERO_SLIDES.map((src, i) => (
                  <img key={i} alt="Students collaborating in a bright modern learning space" className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000" style={{ opacity: i === slide ? 1 : 0 }} src={src} />
                ))}
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/20 to-transparent"></div>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {HERO_SLIDES.map((_, i) => (
                    <button key={i} onClick={() => setSlide(i)} aria-label={`Show slide ${i + 1}`} className={`h-1.5 rounded-full transition-all ${i === slide ? "w-8 bg-white" : "w-2 bg-white/50 hover:bg-white/70"}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 border-y border-slate-200/60 bg-white/50 animate-on-scroll" id="stats">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-200/60">
            {[["500+", "Active Students"], ["50+", "Interactive Lessons"], ["100+", "Skill Quizzes"], ["3", "Supported Languages"]].map(([v, l]) => (
              <div key={l} className="flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-extrabold text-slate-900 mb-1">{v}</span>
                <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">{l}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Core Features */}
        <section className="section-padding bg-slate-50 relative overflow-hidden" id="features">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100/40 blur-3xl mix-blend-multiply"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-50/40 blur-3xl mix-blend-multiply"></div>
          </div>
          <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
            <div className="text-center mb-16 max-w-3xl mx-auto animate-on-scroll">
              <h2 className="text-sm font-bold tracking-widest text-[#2563EB] uppercase mb-3">Core Platform</h2>
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">A Complete Learning Ecosystem</h3>
              <p className="text-lg text-slate-600 leading-relaxed">Everything you need to master new skills, stay engaged, and track your progress in one unified platform.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Feature 1 */}
              <div className="glass-card rounded-2xl p-8 flex flex-col h-full premium-hover shadow-soft animate-on-scroll">
                <div className="w-10 h-10 rounded-xl bg-[#1E293B] flex items-center justify-center mb-6 shadow-sm">
                  <Icon name="menu_book" className="text-white text-xl" />
                </div>
                <h4 className="text-xl font-bold text-slate-800 mb-2">Curated Course Catalog</h4>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">Access hundreds of premium courses structured for optimal knowledge retention and practical application.</p>
                <div className="mt-auto flex gap-4">
                  <div className="w-[45%] aspect-[4/3] rounded-xl overflow-hidden shadow-sm border border-slate-100">
                    <img alt="Course preview" className="w-full h-full object-cover" src={IMG.course1} />
                  </div>
                  <div className="w-[45%] aspect-[4/3] rounded-xl overflow-hidden shadow-sm border border-slate-100">
                    <img alt="Course preview" className="w-full h-full object-cover" src={IMG.course2} />
                  </div>
                </div>
              </div>
              {/* Feature 2 */}
              <div className="glass-card rounded-2xl p-8 flex flex-col h-full premium-hover shadow-soft animate-on-scroll" style={{ transitionDelay: "100ms" }}>
                <div className="w-10 h-10 rounded-xl bg-[#2563EB] flex items-center justify-center mb-6 shadow-sm">
                  <Icon name="check_circle" className="text-slate-800 text-xl font-bold" />
                </div>
                <h4 className="text-xl font-bold text-slate-800 mb-2">Progress Tracking</h4>
                <p className="text-slate-500 text-sm leading-relaxed mb-8">Stay on top of assignments with visual completion metrics.</p>
                <div className="mt-auto">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-semibold text-slate-600">Weekly Goal</span>
                    <span className="text-xs font-bold text-[#2563EB]">80%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 shadow-inner">
                    <div className="bg-[#2563EB] h-2 rounded-full shadow-sm" style={{ width: "80%" }}></div>
                  </div>
                </div>
              </div>
              {/* Feature 3 */}
              <div className="glass-card rounded-2xl p-8 flex flex-col h-full premium-hover shadow-soft animate-on-scroll" style={{ transitionDelay: "200ms" }}>
                <div className="w-10 h-10 rounded-xl bg-[#1E3A8A] flex items-center justify-center mb-6 shadow-sm">
                  <Icon name="forum" className="text-white text-xl" />
                </div>
                <h4 className="text-xl font-bold text-slate-800 mb-2">Community Doubts</h4>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">Resolve queries fast with peer-to-peer discussions.</p>
                <div className="mt-auto flex items-center">
                  <div className="flex -space-x-3">
                    <img alt="User" className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm relative z-30" src={avatarUrl("Riya K")} />
                    <img alt="User" className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm relative z-20" src={avatarUrl("Sahil M")} />
                    <img alt="User" className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm relative z-10" src={avatarUrl("Neha P")} />
                    <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[11px] font-bold text-slate-600 shadow-sm relative z-0">+2k</div>
                  </div>
                </div>
              </div>
              {/* Feature 4 */}
              <div className="glass-card rounded-2xl p-8 flex flex-col h-full premium-hover shadow-soft animate-on-scroll" style={{ transitionDelay: "300ms" }}>
                <div className="w-10 h-10 rounded-xl bg-[#475569] flex items-center justify-center mb-6 shadow-sm">
                  <Icon name="offline_pin" className="text-white text-xl" />
                </div>
                <h4 className="text-xl font-bold text-slate-800 mb-2">Offline Support</h4>
                <p className="text-slate-500 text-sm leading-relaxed">Download modules and study anywhere, anytime.</p>
              </div>
              {/* Feature 5: Multi-Language */}
              <div className="col-span-1 md:col-span-2 lg:col-span-2 rounded-2xl p-8 shadow-xl flex flex-col h-full relative overflow-hidden premium-hover animate-on-scroll bg-gradient-to-br from-[#0F172A] via-[#1E3A8A] to-[#2563EB]" style={{ transitionDelay: "400ms" }}>
                <div className="absolute inset-0 opacity-40 mix-blend-overlay">
                  <img alt="Globe" className="w-full h-full object-cover" src={GLOBE} />
                </div>
                <div className="relative z-10 h-full flex flex-col justify-center">
                  <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-6 shadow-sm">
                    <Icon name="translate" className="text-white text-xl" />
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-2">Multi-Language</h4>
                  <p className="text-blue-100/90 text-base leading-relaxed max-w-md">Break barriers. Learn in your native language with precise translations.</p>
                </div>
              </div>
            </div>
            {/* Wide Feature: Teacher Analytics */}
            <div className="mt-8 glass-card rounded-3xl p-8 lg:p-12 shadow-soft flex flex-col lg:flex-row items-center gap-12 premium-hover animate-on-scroll">
              <div className="flex-1 max-w-2xl">
                <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mb-6">
                  <Icon name="monitoring" className="text-3xl" />
                </div>
                <h4 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Teacher Analytics &amp; Engagement</h4>
                <p className="text-lg text-slate-600 leading-relaxed">Empower educators with clear visibility into student participation and module completion rates.</p>
              </div>
              <div className="flex-1 w-full bg-slate-50/80 rounded-2xl p-8 border border-slate-100/50 shadow-inner">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-[#2563EB] shadow-sm">
                      <Icon name="group" className="text-xl" />
                    </div>
                    <div className="flex-grow">
                      <div className="h-3 bg-slate-200 rounded-full w-full overflow-hidden shadow-inner">
                        <div className="h-full bg-[#2563EB] rounded-full shadow-sm" style={{ width: "90%" }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-[#2563EB] shadow-sm">
                      <Icon name="check_circle" className="text-xl" />
                    </div>
                    <div className="flex-grow">
                      <div className="h-3 bg-slate-200 rounded-full w-3/4 overflow-hidden shadow-inner">
                        <div className="h-full bg-[#2563EB] rounded-full shadow-sm" style={{ width: "75%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="section-padding bg-white border-t border-slate-100 animate-on-scroll">
          <div className="max-w-4xl mx-auto px-4 md:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">Frequently Asked Questions</h2>
              <p className="text-lg text-slate-600">Everything you need to know about EduNext</p>
            </div>
            <div className="space-y-4">
              {[
                ["How does EduNext work for rural students?", "EduNext is designed to support learning in areas with limited internet access. Students can download course materials for offline study, access content in multiple languages, and continue learning at their own pace. The platform aims to make quality education more accessible regardless of location."],
                ["What subjects and languages are available?", "EduNext supports a variety of academic and skill-based courses, including technology, science, mathematics, and language learning. Content can be delivered in multiple languages to help learners study in the language they are most comfortable with."],
                ["How do teachers track student progress?", "Teachers can monitor course completion, assignment submissions, quiz performance, participation levels, and learning activity through dedicated dashboards. This helps educators identify students who may need additional support and guidance."],
                ["What is the Streak Pot and how does it work?", "The Streak Pot is a gamified motivation feature that encourages consistent learning. Students earn progress through daily participation and course completion, while schools and communities can track collective learning milestones and achievements."],
                ["Can students use this without smartphones?", "Yes. EduNext is accessible through laptops, desktops, and shared digital learning environments. Downloadable resources and offline support help learners continue studying even when personal devices or internet connectivity are limited."],
                ["How do mentors and apprenticeships work?", "EduNext connects learners with mentors, practical learning opportunities, and apprenticeship programs. These experiences help students apply classroom knowledge to real-world projects, develop professional skills, and explore career pathways."],
                ["Is EduNext free to use?", "The core learning features of EduNext are designed to remain accessible to learners. Access policies may vary depending on the institution, organization, or educational program using the platform."],
              ].map(([q, a]) => (
                <details key={q} className="group bg-slate-50 border border-slate-200/60 rounded-2xl p-6 hover:bg-white hover:border-slate-300 hover:shadow-soft transition-all duration-300">
                  <summary className="flex justify-between items-center cursor-pointer list-none focus:outline-none">
                    <h3 className="text-lg font-bold text-slate-800 group-hover:text-[#2563EB] transition-colors">{q}</h3>
                    <Icon name="expand_more" className="faq-chevron text-slate-400 group-hover:text-[#2563EB] transition-transform duration-300" />
                  </summary>
                  <div className="mt-4 text-slate-600 text-base leading-relaxed animate-fade-in">{a}</div>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-16 px-4 md:px-8 bg-slate-50 border-t border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-7xl mx-auto">
          <div className="flex flex-col gap-6 md:col-span-1">
            <a className="flex items-center gap-3 hover:opacity-90 transition-opacity" href="#">
              <Logo size={30} />
            </a>
            <p className="text-sm text-slate-500 leading-relaxed">
              © 2027 EduNext Premium.<br />Empowering lifelong learners globally.
            </p>
          </div>
          <div className="md:col-span-3 flex flex-wrap gap-x-12 gap-y-6 md:justify-end items-center">
            <a className="text-sm font-semibold text-slate-600 hover:text-[#2563EB] transition-colors" href="#">About Us</a>
            <a className="text-sm font-semibold text-slate-600 hover:text-[#2563EB] transition-colors" href="#">Contact Us</a>
            <a className="text-sm font-semibold text-slate-600 hover:text-[#2563EB] transition-colors" href="#">Privacy Policy</a>
            <a className="text-sm font-semibold text-slate-600 hover:text-[#2563EB] transition-colors" href="#">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
