import Icon from "../components/Icon";
import TeacherStudentShell from "../components/TeacherStudentShell";
import { Card, ProgressBar, Badge } from "../components/ui";

export default function TeacherStudentProfile() {
  return (
    <TeacherStudentShell activeTab="overview">
      {({ student, enrollments }) => (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h3 className="font-bold text-navy mb-4">Current Enrollments</h3>
              <div className="space-y-4">
                {enrollments.length === 0 && <p className="text-sm text-gray-400">No active enrollments.</p>}
                {enrollments.map((c) => (
                  <div key={c.id} className="flex items-center gap-4">
                    <img src={c.thumbnail} alt="" className="w-16 h-12 rounded-lg object-cover" />
                    <div className="flex-1">
                      <p className="font-semibold text-navy text-sm">{c.title}</p>
                      <ProgressBar value={c.progress} className="mt-1" />
                    </div>
                    <span className="text-sm font-semibold text-[#2563EB]">{c.progress}%</span>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="p-6">
              <h3 className="font-bold text-navy mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {["Completed Python Module 3", "Submitted Web Portfolio assignment", "Scored 92% on Loops Quiz"].map((a, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Icon name="check_circle" className="text-[#15803D] text-[20px]" />
                    <p className="text-sm text-gray-600">{a}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-br from-[#2563EB] to-navy text-white">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="local_fire_department" />
                <p className="font-bold">Learning Streak</p>
              </div>
              <p className="text-3xl font-extrabold">{student?.streak ?? 5} days</p>
              <p className="text-white/70 text-sm mt-1">Keeping a strong, consistent pace.</p>
            </Card>
            <Card className="p-6">
              <h3 className="font-bold text-navy mb-3">Program Progress</h3>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-500">Completed</span>
                <Badge tone="green">{enrollments.filter((e: any) => e.enrollmentStatus === "completed").length}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">In Progress</span>
                <Badge tone="amber">{enrollments.filter((e: any) => e.enrollmentStatus !== "completed").length}</Badge>
              </div>
            </Card>
            <Card className="p-6">
              <h3 className="font-bold text-navy mb-1">Last Active</h3>
              <p className="text-sm text-gray-500">Today, 2 hours ago</p>
            </Card>
          </div>
        </div>
      )}
    </TeacherStudentShell>
  );
}
