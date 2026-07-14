import { useEffect, useState } from "react";
import TeacherStudentShell from "../components/TeacherStudentShell";
import { Card, Badge } from "../components/ui";
import { getAllAssignments, gradeSubmission, db } from "../lib/database";
import { Assignment, Submission } from "../lib/mockData";
import { useParams } from "react-router-dom";

export default function TeacherStudentAssignments() {
  const { id } = useParams();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [subs, setSubs] = useState<Submission[]>([]);
  const [grades, setGrades] = useState<Record<number, string>>({});

  async function load() {
    setAssignments(await getAllAssignments());
    if (id) setSubs(await db.submissions.where("studentId").equals(Number(id)).toArray());
  }
  useEffect(() => {
    load();
  }, [id]);

  async function handleGrade(subId: number) {
    const g = Number(grades[subId]);
    if (isNaN(g)) return;
    await gradeSubmission(subId, g);
    load();
  }

  return (
    <TeacherStudentShell activeTab="assignments">
      {() => (
        <Card className="overflow-x-auto">
          <table className="w-full text-sm min-w-[680px]">
            <thead className="bg-gray-50 text-gray-500 text-left text-xs uppercase">
              <tr><th className="px-5 py-3">Assignment</th><th className="px-5 py-3">Subject</th><th className="px-5 py-3">Due</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Grade</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {assignments.map((a) => {
                const sub = subs.find((s) => s.assignmentId === a.id);
                return (
                  <tr key={a.id}>
                    <td className="px-5 py-3 font-semibold text-navy">{a.title}</td>
                    <td className="px-5 py-3 text-gray-500">{a.subject}</td>
                    <td className="px-5 py-3 text-gray-500">{a.dueDate}</td>
                    <td className="px-5 py-3"><Badge tone={sub ? (sub.status === "graded" ? "green" : "blue") : "amber"}>{sub ? (sub.status === "graded" ? "Graded" : "Submitted") : "Not submitted"}</Badge></td>
                    <td className="px-5 py-3">
                      {sub && sub.status !== "graded" ? (
                        <div className="flex gap-1">
                          <input value={grades[sub.id!] || ""} onChange={(e) => setGrades((g) => ({ ...g, [sub.id!]: e.target.value }))} placeholder="0-100" className="w-16 border border-gray-200 rounded px-2 py-1 text-xs" />
                          <button onClick={() => handleGrade(sub.id!)} className="bg-[#0F2B5B] text-white text-xs rounded px-2 py-1 font-semibold">Save</button>
                        </div>
                      ) : sub?.grade != null ? (
                        <span className="font-bold text-[#15803D]">{sub.grade}/100</span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}
    </TeacherStudentShell>
  );
}
