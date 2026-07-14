import Icon from "../components/Icon";
import { useState } from "react";
import { StudentLayout } from "../components/Layout";
import { Card, PageHeader } from "../components/ui";

interface Job {
  role: string;
  company: string;
  location: string;
  type: "Internship" | "Full-time" | "Part-time";
  match: number;
  skills: string[];
  logo: string;
}

const jobs: Job[] = [
  { role: "Junior Python Developer", company: "Nimbus Labs", location: "Remote", type: "Full-time", match: 94, skills: ["Python", "APIs", "SQL"], logo: "https://ui-avatars.com/api/?name=NL&background=002045&color=fff&bold=true" },
  { role: "Data Analyst Intern", company: "BrightData", location: "Bengaluru", type: "Internship", match: 88, skills: ["pandas", "Excel", "Viz"], logo: "https://ui-avatars.com/api/?name=BD&background=002045&color=fff&bold=true" },
  { role: "Frontend Engineer", company: "Pixelworks", location: "Pune", type: "Full-time", match: 81, skills: ["React", "CSS", "TS"], logo: "https://ui-avatars.com/api/?name=PW&background=002045&color=fff&bold=true" },
  { role: "Security Analyst Trainee", company: "ShieldNet", location: "Hyderabad", type: "Internship", match: 76, skills: ["Networks", "Linux"], logo: "https://ui-avatars.com/api/?name=SN&background=002045&color=fff&bold=true" },
  { role: "ML Research Assistant", company: "Lumina AI", location: "Remote", type: "Part-time", match: 72, skills: ["Math", "NumPy", "Python"], logo: "https://ui-avatars.com/api/?name=LA&background=002045&color=fff&bold=true" },
  { role: "Backend Developer", company: "Cloudbyte", location: "Chennai", type: "Full-time", match: 68, skills: ["Node", "DB", "REST"], logo: "https://ui-avatars.com/api/?name=CB&background=002045&color=fff&bold=true" },
];

const filters = ["All", "Internship", "Full-time", "Part-time"];

export default function CareerFind() {
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");

  const visible = jobs.filter(
    (j) =>
      (filter === "All" || j.type === filter) &&
      (j.role.toLowerCase().includes(query.toLowerCase()) || j.company.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <StudentLayout active="Career Find" title="Career Find">
      <PageHeader
        title="Career Find"
        subtitle="Opportunities matched to your courses and skills."
        action={
          <div className="relative">
            <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search roles or companies…"
              className="bg-white border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 text-sm w-72 outline-none focus:border-[#2563EB]"
            />
          </div>
        }
      />

      <div className="flex gap-2 mb-6">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold ${filter === f ? "bg-[#0F2B5B] text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {visible.map((j) => (
          <Card key={j.role} className="p-5 premium-hover">
            <div className="flex items-start justify-between mb-3">
              <img src={j.logo} className="w-12 h-12 rounded-xl" alt="" />
              <span className="text-xs font-bold text-[#2563EB] bg-[#2563EB]/10 px-2.5 py-1 rounded-full">{j.match}% match</span>
            </div>
            <h3 className="font-bold text-navy">{j.role}</h3>
            <p className="text-sm text-gray-500 mb-1">{j.company}</p>
            <p className="text-xs text-gray-400 flex items-center gap-1 mb-3">
              <Icon name="location_on" className="text-[16px]" />
              {j.location} · {j.type}
            </p>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {j.skills.map((s) => (
                <span key={s} className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{s}</span>
              ))}
            </div>
            <button className="w-full bg-[#0F2B5B] hover:bg-[#0A1F44] text-white text-sm font-semibold rounded-lg py-2">View Details</button>
          </Card>
        ))}
      </div>
      {visible.length === 0 && <p className="text-center text-gray-400 py-16">No matching opportunities.</p>}
    </StudentLayout>
  );
}
