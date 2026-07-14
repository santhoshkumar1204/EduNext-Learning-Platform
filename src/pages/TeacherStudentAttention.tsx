import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import TeacherStudentShell from "../components/TeacherStudentShell";
import { Card, Badge } from "../components/ui";

const data = [
  { session: "S1", score: 72 }, { session: "S2", score: 80 }, { session: "S3", score: 65 },
  { session: "S4", score: 88 }, { session: "S5", score: 91 }, { session: "S6", score: 84 },
];
const sessions = [
  { date: "Jun 10", course: "Intro to Python", score: 91, emotion: "Focused", duration: "42 min" },
  { date: "Jun 8", course: "Web Development", score: 84, emotion: "Engaged", duration: "38 min" },
  { date: "Jun 6", course: "Intro to Python", score: 65, emotion: "Distracted", duration: "29 min" },
];

export default function TeacherStudentAttention() {
  return (
    <TeacherStudentShell activeTab="attention">
      {() => (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-bold text-navy mb-4">Attention Score Over Time</h3>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="session" fontSize={12} stroke="#94a3b8" />
                <YAxis fontSize={12} stroke="#94a3b8" domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#2563EB" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
          <Card className="overflow-hidden">
            <h3 className="font-bold text-navy p-5 pb-0">Session Breakdown</h3>
            <table className="w-full text-sm mt-3">
              <thead className="bg-gray-50 text-gray-500 text-left text-xs uppercase">
                <tr><th className="px-5 py-3">Date</th><th className="px-5 py-3">Course</th><th className="px-5 py-3">Avg Score</th><th className="px-5 py-3">Emotion</th><th className="px-5 py-3">Duration</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {sessions.map((s, i) => (
                  <tr key={i}>
                    <td className="px-5 py-3 text-navy">{s.date}</td>
                    <td className="px-5 py-3 text-gray-500">{s.course}</td>
                    <td className="px-5 py-3 font-semibold text-[#0F2B5B]">{s.score}%</td>
                    <td className="px-5 py-3"><Badge tone={s.emotion === "Distracted" ? "amber" : "green"}>{s.emotion}</Badge></td>
                    <td className="px-5 py-3 text-gray-500">{s.duration}</td>
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
