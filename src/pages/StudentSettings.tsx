import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../components/Icon";
import Logo from "../components/Logo";
import { getCurrentUser } from "../lib/database";
import { avatarUrl } from "../lib/images";
import { useLanguage } from "../contexts/LanguageContext";
import { Language, languageNames } from "../utils/translations";

// Full port of student_settings/code.html — navy/blue palette (green reserved for success only).
function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} className={`relative inline-block w-12 h-6 rounded-full transition-colors shrink-0 ${on ? "bg-[#0F2B5B]" : "bg-[#c4c6cf]"}`}>
      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${on ? "left-6" : "left-0.5"}`} />
    </button>
  );
}

function Row({ title, desc, defaultOn = false }: { title: string; desc: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between p-4 bg-[#f7f9fb]/60 rounded-xl border border-[#c4c6cf]/20">
      <div><p className="text-label-md text-[#191c1e]">{title}</p><p className="text-label-sm text-[#43474e]">{desc}</p></div>
      <Toggle on={on} onChange={() => setOn(!on)} />
    </div>
  );
}

function ActionRow({ title, desc, action }: { title: string; desc: string; action: string }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-[#f7f9fb]/60 rounded-xl border border-[#c4c6cf]/20 gap-4">
      <div><p className="text-label-md text-[#191c1e]">{title}</p><p className="text-label-sm text-[#43474e]">{desc}</p></div>
      <button className="bg-[#e0e3e5] text-[#43474e] text-label-md px-4 py-2 rounded-lg hover:bg-[#d8dadc] transition-colors whitespace-nowrap shrink-0">{action}</button>
    </div>
  );
}

function Section({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-6">
      <div className="glass-panel rounded-2xl p-6 md:p-8 shadow-sm">
        <h3 className="text-headline-md text-[#0F2B5B] mb-6 flex items-center gap-2"><Icon name={icon} className="text-[24px]" /> {title}</h3>
        {children}
      </div>
    </section>
  );
}

const input = "w-full bg-[#f7f9fb]/50 border border-[#c4c6cf]/50 rounded-lg px-4 py-2.5 text-body-md text-[#191c1e] focus:ring-2 focus:ring-[#0F2B5B] focus:border-[#0F2B5B] transition-all shadow-sm outline-none";
const inputRO = "w-full bg-[#e0e3e5]/30 border border-[#c4c6cf]/30 rounded-lg px-4 py-2.5 text-body-md text-[#43474e] cursor-not-allowed";

export default function StudentSettings() {
  const user = getCurrentUser();
  const { language, setLanguage } = useLanguage();
  const [saved, setSaved] = useState(false);
  const [theme, setTheme] = useState("light");
  const [contacted, setContacted] = useState(false);

  function save() { setSaved(true); setTimeout(() => setSaved(false), 1800); }

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-[#f7f9fb]/80 backdrop-blur-xl border-b border-[#c4c6cf]/20 px-6 py-4 sticky top-0 z-50 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center"><Logo size={26} /></Link>
        <div className="flex items-center gap-4">
          <button className="text-[#43474e] hover:text-[#0F2B5B] transition-colors"><Icon name="notifications" /></button>
          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-[#0F2B5B]/20"><img alt="" className="w-full h-full object-cover" src={avatarUrl(user?.name || "Student")} /></div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 md:px-10 py-8 md:py-12 pb-32">
        <div className="max-w-4xl mx-auto w-full">
          <div className="mb-10">
            <nav className="flex text-[#43474e] text-label-sm mb-4"><ol className="inline-flex items-center space-x-2"><li className="hover:text-[#0F2B5B] cursor-pointer"><Link to="/dashboard">Dashboard</Link></li><li><Icon name="chevron_right" className="text-[14px] mx-1" /></li><li className="hover:text-[#0F2B5B] cursor-pointer"><Link to="/profile">Profile</Link></li><li><Icon name="chevron_right" className="text-[14px] mx-1" /></li><li className="text-[#0F2B5B] font-medium">Settings</li></ol></nav>
            <h2 className="text-headline-xl text-[#191c1e] mb-2">Student Settings</h2>
            <p className="text-body-lg text-[#43474e] max-w-2xl">Manage your account, learning preferences, accessibility options and platform experience.</p>
          </div>

          <div className="space-y-8">
            {/* Section 1: Profile Information */}
            <Section icon="person" title="Profile Information">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex flex-col items-center gap-4 shrink-0">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[#f7f9fb] shadow-md">
                    <img alt="" className="w-full h-full object-cover" src={avatarUrl(user?.name || "Eleanor")} />
                    <button className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-label-sm py-1.5 flex items-center justify-center gap-1 hover:bg-black/70 transition-colors"><Icon name="photo_camera" className="text-[14px]" /> Edit</button>
                  </div>
                  <button className="text-label-md text-[#0F2B5B] hover:text-[#1a365d] transition-colors">Change Photo</button>
                </div>
                <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1"><label className="text-label-sm text-[#43474e] block">Full Name</label><input className={input} defaultValue={user?.name || "Eleanor Shellstrop"} /></div>
                  <div className="space-y-1"><label className="text-label-sm text-[#43474e] block">Email Address</label><input className={input} type="email" defaultValue={user?.email || "eleanor.s@university.edu"} /></div>
                  <div className="space-y-1"><label className="text-label-sm text-[#43474e] block">Phone Number</label><input className={input} type="tel" defaultValue="+1 (555) 123-4567" /></div>
                  <div className="space-y-1"><label className="text-label-sm text-[#43474e] block">Institution</label><input className={inputRO} readOnly defaultValue={user?.institution || "Good Place University"} /></div>
                  <div className="space-y-1"><label className="text-label-sm text-[#43474e] block">Department</label><input className={inputRO} readOnly defaultValue={user?.department || "Moral Philosophy"} /></div>
                  <div className="space-y-1"><label className="text-label-sm text-[#43474e] block">Academic Year</label><select className={input} defaultValue="Junior"><option>Freshman</option><option>Sophomore</option><option>Junior</option><option>Senior</option><option>Graduate</option></select></div>
                </div>
              </div>
            </Section>

            {/* Section 2: Learning Preferences */}
            <Section icon="school" title="Learning Preferences">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1"><label className="text-label-sm text-[#43474e] block">Primary Language</label><select value={language} onChange={(e) => setLanguage(e.target.value as Language)} className={input}>{(Object.keys(languageNames) as Language[]).map((l) => <option key={l} value={l}>{languageNames[l]}</option>)}</select></div>
                <div className="space-y-1"><label className="text-label-sm text-[#43474e] block">Learning Goal</label><select className={input}><option>Degree Completion</option><option>Skill Acquisition</option><option>Personal Interest</option></select></div>
                <div className="space-y-1"><label className="text-label-sm text-[#43474e] block">Learning Style</label><select className={input}><option>Visual</option><option>Auditory</option><option>Reading/Writing</option><option>Kinesthetic</option></select></div>
                <div className="space-y-1"><label className="text-label-sm text-[#43474e] block">Interests (Comma separated)</label><input className={input} defaultValue="Ethics, Logic, History" /></div>
              </div>
            </Section>

            {/* Section 3: Notifications */}
            <Section icon="notifications" title="Notifications">
              <div className="space-y-4">
                <Row title="Assignment Deadlines" desc="Get notified about upcoming due dates." defaultOn />
                <Row title="Quiz Reminders" desc="Alerts for scheduled quizzes and tests." defaultOn />
                <Row title="Community Activity" desc="Updates on forum replies and group mentions." />
                <Row title="Course Announcements" desc="Important messages from instructors." defaultOn />
                <Row title="Learning Streak" desc="Daily reminders to maintain your learning streak." defaultOn />
              </div>
            </Section>

            {/* Section 4: Accessibility */}
            <Section icon="accessibility" title="Accessibility">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-1"><label className="text-label-sm text-[#43474e] block">Font Size</label><select className={input} defaultValue="Medium (Default)"><option>Small</option><option>Medium (Default)</option><option>Large</option><option>Extra Large</option></select></div>
              </div>
              <div className="space-y-4">
                <Row title="High Contrast" desc="Increase contrast for better visibility." />
                <Row title="Reduce Motion" desc="Minimize UI animations and transitions." />
                <Row title="Always Show Captions" desc="Enable closed captions on all video content by default." defaultOn />
                <Row title="Screen Reader Optimization" desc="Enhance compatibility with screen reading software." />
                <Row title="Dyslexia Friendly Mode" desc="Use specialized fonts and spacing to improve readability." />
              </div>
            </Section>

            {/* Section 5: Offline Learning */}
            <Section icon="download_for_offline" title="Offline Learning">
              <div className="space-y-4 mb-6">
                <Row title="Auto-Download Course Material" desc="Automatically download new materials for enrolled courses." />
                <Row title="Download Over Wi-Fi Only" desc="Prevent data charges by restricting downloads to Wi-Fi networks." defaultOn />
              </div>
              <ActionRow title="Storage Usage" desc="Currently using 1.2 GB of local storage." action="Manage Downloads" />
            </Section>

            {/* Section 6: Appearance */}
            <Section icon="palette" title="Appearance">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Light */}
                <label className="relative cursor-pointer group">
                  <input className="peer sr-only" type="radio" name="theme" value="light" checked={theme === "light"} onChange={() => setTheme("light")} />
                  <div className="h-32 rounded-xl border-2 border-[#c4c6cf]/30 bg-white p-2 peer-checked:border-[#0F2B5B] peer-checked:ring-1 peer-checked:ring-[#0F2B5B] transition-all">
                    <div className="w-full h-full bg-slate-50 rounded-lg border border-slate-100 flex flex-col gap-2 p-2">
                      <div className="w-full h-3 bg-slate-200 rounded-full"></div>
                      <div className="w-2/3 h-3 bg-slate-200 rounded-full"></div>
                      <div className="mt-auto w-full h-8 bg-blue-100 rounded flex items-center justify-center text-blue-800 text-[10px] font-bold">Aa</div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-center gap-2">
                    <div className="w-4 h-4 rounded-full border border-[#74777f] peer-checked:border-[4px] peer-checked:border-[#0F2B5B] transition-all"></div>
                    <span className="text-label-md text-[#191c1e]">Light Mode</span>
                  </div>
                </label>
                {/* Dark */}
                <label className="relative cursor-pointer group">
                  <input className="peer sr-only" type="radio" name="theme" value="dark" checked={theme === "dark"} onChange={() => setTheme("dark")} />
                  <div className="h-32 rounded-xl border-2 border-[#c4c6cf]/30 bg-slate-900 p-2 peer-checked:border-[#0F2B5B] peer-checked:ring-1 peer-checked:ring-[#0F2B5B] transition-all">
                    <div className="w-full h-full bg-slate-800 rounded-lg border border-slate-700 flex flex-col gap-2 p-2">
                      <div className="w-full h-3 bg-slate-700 rounded-full"></div>
                      <div className="w-2/3 h-3 bg-slate-700 rounded-full"></div>
                      <div className="mt-auto w-full h-8 bg-blue-900/50 rounded flex items-center justify-center text-blue-200 text-[10px] font-bold">Aa</div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-center gap-2">
                    <div className="w-4 h-4 rounded-full border border-[#74777f] peer-checked:border-[4px] peer-checked:border-[#0F2B5B] transition-all"></div>
                    <span className="text-label-md text-[#191c1e]">Dark Mode</span>
                  </div>
                </label>
                {/* System */}
                <label className="relative cursor-pointer group">
                  <input className="peer sr-only" type="radio" name="theme" value="system" checked={theme === "system"} onChange={() => setTheme("system")} />
                  <div className="h-32 rounded-xl border-2 border-[#c4c6cf]/30 bg-gradient-to-r from-white to-slate-900 p-2 peer-checked:border-[#0F2B5B] peer-checked:ring-1 peer-checked:ring-[#0F2B5B] transition-all flex">
                    <div className="w-1/2 h-full bg-slate-50 rounded-l-lg border-y border-l border-slate-100 flex flex-col gap-2 p-2"><div className="w-full h-2 bg-slate-200 rounded-full"></div></div>
                    <div className="w-1/2 h-full bg-slate-800 rounded-r-lg border-y border-r border-slate-700 flex flex-col gap-2 p-2"><div className="w-full h-2 bg-slate-700 rounded-full"></div></div>
                  </div>
                  <div className="mt-3 flex items-center justify-center gap-2">
                    <div className="w-4 h-4 rounded-full border border-[#74777f] peer-checked:border-[4px] peer-checked:border-[#0F2B5B] transition-all"></div>
                    <span className="text-label-md text-[#191c1e]">System Default</span>
                  </div>
                </label>
              </div>
            </Section>

            {/* Section 7: Privacy & Security */}
            <Section icon="shield" title="Privacy & Security">
              <div className="space-y-4">
                <ActionRow title="Password" desc="Last changed 3 months ago." action="Change Password" />
                <Row title="Two-Factor Authentication (2FA)" desc="Add an extra layer of security to your account." defaultOn />
                <ActionRow title="Active Sessions" desc="Manage devices currently logged into your account." action="View Sessions" />
                <Row title="Save Search History" desc="Allow EduNext to save your search history for better recommendations." defaultOn />
                <ActionRow title="Device Management" desc="Review authorized devices and applications." action="Manage Devices" />
              </div>
            </Section>

            {/* Section 8: Learning Analytics */}
            <Section icon="analytics" title="Learning Analytics">
              <div className="space-y-4">
                <Row title="Anonymous Analytics" desc="Share anonymous usage data to help us improve the platform." defaultOn />
                <Row title="Research Participation" desc="Allow your data to be used in educational research studies." />
                <Row title="Experience Improvements" desc="Opt-in to personalized recommendations based on your learning patterns." defaultOn />
              </div>
            </Section>

            {/* Section 9: Support & Feedback */}
            <Section icon="help" title="Support & Feedback">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {[["menu_book", "Help Center"], ["support_agent", "Contact Support"], ["bug_report", "Report an Issue"], ["lightbulb", "Suggest a Feature"]].map(([icon, label]) => (
                  <button key={label} className="flex items-center justify-center gap-2 bg-[#f7f9fb]/50 border border-[#c4c6cf]/50 hover:bg-[#e6e8ea] transition-colors py-3 rounded-xl text-label-md text-[#191c1e]"><Icon name={icon} className="text-[20px]" /> {label}</button>
                ))}
              </div>
              <div className="pt-6 border-t border-[#c4c6cf]/20 flex flex-col items-center text-center">
                <p className="text-body-md text-[#43474e] mb-4">Need direct assistance from our administration team?</p>
                <button onClick={() => setContacted(true)} className={`text-label-md px-6 py-3 rounded-xl shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2 ${contacted ? "bg-[#e0e3e5] text-[#191c1e] cursor-text" : "bg-[#0F2B5B] text-white hover:bg-[#1a365d]"}`}><Icon name="mail" className="text-[18px]" /> {contacted ? "support@edunext.com" : "Contact Us"}</button>
              </div>
            </Section>
          </div>
        </div>
      </main>

      {/* Sticky footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 md:p-6 bg-[#ffffff]/90 backdrop-blur-xl border-t border-[#c4c6cf]/20 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-end gap-4">
          <button className="text-label-md text-[#43474e] hover:text-[#191c1e] px-4 py-2.5 transition-colors">Reset Preferences</button>
          <button onClick={save} className="text-label-md px-8 py-2.5 rounded-xl bg-[#0F2B5B] text-white shadow-md hover:bg-[#1a365d] hover:shadow-lg transition-all active:scale-95 flex items-center gap-2"><Icon name="save" className="text-[18px]" /> {saved ? "Saved ✓" : "Save Changes"}</button>
        </div>
      </div>
    </div>
  );
}
