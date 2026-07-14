import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import TeacherStudentShell from "../components/TeacherStudentShell";
import { Card, StatCard, Badge } from "../components/ui";

const data = [
  { quiz: "Loops", score: 92 }, { quiz: "Web Fund.", score: 78 }, { quiz: "SQL", score: 85 }, { quiz: "Security", score: 68 },
];
const rows = [
  { name: "Python Loops Quiz", course: "Intro to Python", score: 92, date: "Jun 10", time: "8 min", pass: true },
  { name: "Web Fundamentals", course: "Web Development", score: 78, date: "Jun 7", time: "6 min", pass: true },
  { name: "Security Basics", course: "Cyber Security", score: 68, date: "Jun 3", time: "9 min", pass: true },
];

export default function TeacherStudentQuiz() {
  return (
    <TeacherStudentShell activeTab="quiz">
      {() => (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <StatCard label="Average Score" value="81%" icon="quiz" tone="green" />
            <StatCard label="Pass Rate" value="100%" icon="check_circle" tone="blue" />
            <StatCard label="Best Subject" value="Python" icon="star" tone="amber" />
          </div>
          <Card className="p-6">
            <h3 className="font-bold text-navy mb-4">Quiz Score History</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="quiz" fontSize={12} stroke="#94a3b8" />
                <YAxis fontSize={12} stroke="#94a3b8" domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="score" fill="#2563EB" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
          <Card className="overflow-x-auto">
            <table className="w-full text-sm min-w-[640px]">
              <thead className="bg-gray-50 text-gray-500 text-left text-xs uppercase">
                <tr><th className="px-5 py-3">Quiz</th><th className="px-5 py-3">Course</th><th className="px-5 py-3">Score</th><th className="px-5 py-3">Date</th><th className="px-5 py-3">Time</th><th className="px-5 py-3">Result</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rows.map((r, i) => (
                  <tr key={i}>
                    <td className="px-5 py-3 font-semibold text-navy">{r.name}</td>
                    <td className="px-5 py-3 text-gray-500">{r.course}</td>
                    <td className="px-5 py-3 font-semibold text-[#0F2B5B]">{r.score}%</td>
                    <td className="px-5 py-3 text-gray-500">{r.date}</td>
                    <td className="px-5 py-3 text-gray-500">{r.time}</td>
                    <td className="px-5 py-3"><Badge tone={r.pass ? "green" : "red"}>{r.pass ? "Pass" : "Fail"}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}
    </TeacherStudentShell>
  );
}
