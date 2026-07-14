import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../components/Icon";
import Logo from "../components/Logo";
import { getCurrentUser } from "../lib/database";
import { avatarUrl } from "../lib/images";

// Exact port of the Teacher Settings design (found in student_mycourses/code.html)
function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={`w-11 h-6 rounded-full relative transition-colors shrink-0 ${on ? "bg-[#0F2B5B]" : "bg-[#cdd5cd]"}`}>
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${on ? "translate-x-5" : ""}`} />
    </button>
  );
}

export default function TeacherSettings() {
  const user = getCurrentUser();
  const name = user?.name || "Dr. Sarah Jenkins";
  const [expertise, setExpertise] = useState(["Machine Learning", "Data Science", "Python", "AI Ethics"]);
  const [newTag, setNewTag] = useState("");
  const [certs, setCerts] = useState(true);
  const [autoGrades, setAutoGrades] = useState(false);
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(false);
  const [publicProfile, setPublicProfile] = useState(true);

  function addTag(e: React.FormEvent) { e.preventDefault(); const t = newTag.trim(); if (t && !expertise.includes(t)) setExpertise((p) => [...p, t]); setNewTag(""); }

  const inputCl = "w-full border border-[#bdcabb] rounded-lg px-3 py-2.5 text-sm bg-[#f8f9fb] focus:bg-white focus:border-[#2563EB] focus:outline-none transition-colors";
  const labelCl = "block text-label-bold text-[#3e4a3e] mb-1.5";

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] min-h-screen flex flex-col pt-16 pb-28">
      {/* Top nav */}
      <nav className="fixed top-0 w-full z-50 bg-[#f7f9fb]/80 backdrop-blur-xl border-b border-[#bdcabb]/20 shadow-sm">
        <div className="flex justify-between items-center h-16 px-6 md:px-10 max-w-[1100px] mx-auto">
          <Link to="/teacher-dashboard"><Logo size={26} /></Link>
          <div className="hidden md:flex gap-6 items-center text-[#3e4a3e]">
            <Link to="/teacher-dashboard" className="hover:text-[#2563eb] transition-colors">Dashboard</Link>
            <Link to="/teacher-courses" className="hover:text-[#2563eb] transition-colors">Courses</Link>
            <Link to="/teacher-students" className="hover:text-[#2563eb] transition-colors">Students</Link>
          </div>
          <img alt="" className="w-8 h-8 rounded-full object-cover border border-[#bdcabb]" src={avatarUrl(name)} />
        </div>
      </nav>

      <main className="max-w-[1100px] mx-auto w-full px-4 md:px-10 flex flex-col gap-8 mt-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#0F2B5B]/10 text-[#0F2B5B] flex items-center justify-center"><Icon name="settings" /></div>
          <div><h1 className="text-headline-lg text-[#191c1e]">Teacher Settings</h1><p className="text-body-md text-[#3e4a3e]">Manage your profile, preferences, and account configuration.</p></div>
        </div>

        {/* Profile Information */}
        <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-[#bdcabb]/30">
          <h2 className="text-xl text-[#191c1e] mb-6 flex items-center gap-2"><Icon name="person" className="text-[#0F2B5B]" /> Profile Information</h2>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex flex-col items-center gap-3 shrink-0">
              <img alt="" className="w-28 h-28 rounded-full object-cover border-2 border-[#bdcabb]" src={avatarUrl(name)} />
              <button className="text-label-bold text-[#2563EB] flex items-center gap-1"><Icon name="photo_camera" className="text-[16px]" /> Change Photo</button>
            </div>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <div><label className={labelCl}>Full Name</label><input defaultValue={name} className={inputCl} /></div>
              <div><label className={labelCl}>Email Address</label><input defaultValue={user?.email || "sarah.jenkins@edunext.edu"} className={inputCl} /></div>
              <div><label className={labelCl}>Phone Number</label><input defaultValue="+1 (555) 234-7890" className={inputCl} /></div>
              <div><label className={labelCl}>Institution</label><input defaultValue={user?.institution || "Global Tech University"} className={inputCl} /></div>
              <div><label className={labelCl}>Department</label><input defaultValue="Computer Science" className={inputCl} /></div>
              <div><label className={labelCl}>Designation</label><input defaultValue="Senior Lecturer" className={inputCl} /></div>
              <div><label className={labelCl}>Years of Experience</label><input defaultValue="15" className={inputCl} /></div>
              <div className="md:col-span-2"><label className={labelCl}>Biography</label><textarea rows={3} defaultValue={user?.bio || "Passionate educator with 15 years of experience in machine learning and data science."} className={inputCl} /></div>
              <div className="md:col-span-2">
                <label className={labelCl}>Areas of Expertise</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {expertise.map((t) => (<span key={t} className="flex items-center gap-1 px-3 py-1 bg-[#0F2B5B]/10 text-[#0F2B5B] text-label-sm rounded-full">{t}<button onClick={() => setExpertise((p) => p.filter((x) => x !== t))}><Icon name="close" className="text-[14px]" /></button></span>))}
                </div>
                <form onSubmit={addTag} className="flex gap-2"><input value={newTag} onChange={(e) => setNewTag(e.target.value)} placeholder="Add expertise…" className={inputCl} /><button type="submit" className="bg-[#0F2B5B] text-white px-4 rounded-lg text-label-bold shrink-0">Add</button></form>
              </div>
            </div>
          </div>
        </section>

        {/* Teaching Preferences */}
        <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-[#bdcabb]/30">
          <h2 className="text-xl text-[#191c1e] mb-6 flex items-center gap-2"><Icon name="school" className="text-[#0F2B5B]" /> Teaching Preferences</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div><label className={labelCl}>Default Course Language</label><select defaultValue="English" className={inputCl}><option>English</option><option>Spanish</option><option>French</option><option>German</option></select></div>
            <div><label className={labelCl}>Default Course Visibility</label><select defaultValue="Public" className={inputCl}><option>Public</option><option>Private</option><option>Invite Only</option></select></div>
            <div><label className={labelCl}>Assignment Reminders</label><select defaultValue="24 hours before" className={inputCl}><option>24 hours before</option><option>48 hours before</option><option>1 week before</option></select></div>
          </div>
          <div className="divide-y divide-[#bdcabb]/40 border-t border-[#bdcabb]/40">
            {([["Enable Certificate Generation", "Auto-generate completion certificates for students.", certs, () => setCerts((v) => !v)], ["Auto-Publish Grades", "Automatically publish grades once assignments are graded.", autoGrades, () => setAutoGrades((v) => !v)]] as [string, string, boolean, () => void][]).map(([t, d, on, fn]) => (
              <div key={t} className="flex items-center justify-between py-4"><div><p className="font-semibold text-[#191c1e]">{t}</p><p className="text-sm text-[#3e4a3e]">{d}</p></div><Toggle on={on} onClick={fn} /></div>
            ))}
          </div>
        </section>

        {/* Notifications */}
        <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-[#bdcabb]/30">
          <h2 className="text-xl text-[#191c1e] mb-6 flex items-center gap-2"><Icon name="notifications" className="text-[#0F2B5B]" /> Notifications</h2>
          <div className="divide-y divide-[#bdcabb]/40">
            {([["Email Notifications", "Receive updates and alerts via email.", emailNotif, () => setEmailNotif((v) => !v)], ["Push Notifications", "Get real-time alerts in your browser.", pushNotif, () => setPushNotif((v) => !v)]] as [string, string, boolean, () => void][]).map(([t, d, on, fn]) => (
              <div key={t} className="flex items-center justify-between py-4 first:pt-0"><div><p className="font-semibold text-[#191c1e]">{t}</p><p className="text-sm text-[#3e4a3e]">{d}</p></div><Toggle on={on} onClick={fn} /></div>
            ))}
          </div>
        </section>

        {/* Privacy & Security */}
        <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-[#bdcabb]/30">
          <h2 className="text-xl text-[#191c1e] mb-6 flex items-center gap-2"><Icon name="shield" className="text-[#0F2B5B]" /> Privacy &amp; Security</h2>
          <div className="flex items-center justify-between py-4 border-b border-[#bdcabb]/40"><div><p className="font-semibold text-[#191c1e]">Public Profile</p><p className="text-sm text-[#3e4a3e]">Allow students to view your profile and credentials.</p></div><Toggle on={publicProfile} onClick={() => setPublicProfile((v) => !v)} /></div>
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#bdcabb] rounded-lg text-label-bold hover:bg-[#f3f4f6] transition-colors"><Icon name="lock" /> Change Password</button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-[#ffdad6]/40 text-[#EF4444] border border-[#EF4444]/30 rounded-lg text-label-bold hover:bg-[#ffdad6]/60 transition-colors"><Icon name="delete" /> Deactivate Account</button>
          </div>
        </section>
      </main>

      {/* Sticky footer */}
      <div className="fixed bottom-0 w-full bg-white/90 backdrop-blur-xl border-t border-[#bdcabb]/30 z-40">
        <div className="max-w-[1100px] mx-auto px-4 md:px-10 py-4 flex items-center justify-between gap-3">
          <button className="text-label-bold text-[#3e4a3e] flex items-center gap-1.5 hover:text-[#191c1e] transition-colors"><Icon name="autorenew" className="text-[18px]" /> Reset Changes</button>
          <div className="flex gap-3">
            <Link to="/teacher-dashboard" className="px-6 py-2.5 bg-white border border-[#bdcabb] rounded-full text-label-bold hover:bg-[#f3f4f6] transition-colors">Cancel</Link>
            <button className="px-6 py-2.5 bg-[#0F2B5B] text-white rounded-full text-label-bold hover:bg-[#0A1F44] transition-colors shadow-sm flex items-center gap-2"><Icon name="check" /> Save All Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
}
