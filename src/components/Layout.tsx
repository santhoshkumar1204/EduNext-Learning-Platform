import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentSidebar from "./StudentSidebar";
import TeacherSidebar from "./TeacherSidebar";
import TopBar from "./TopBar";
import { getCurrentUser } from "../lib/database";

/**
 * Page shells that guard the route, render the correct sidebar + top bar,
 * and place children in a scrollable content area offset by the 256px sidebar.
 */

export function StudentLayout({
  active,
  title,
  children,
}: {
  active: string;
  title?: string;
  children: ReactNode;
}) {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== "student") {
      navigate("/student-login");
    } else {
      setReady(true);
    }
  }, [navigate]);

  if (!ready) return null;

  return (
    <div className="min-h-screen bg-background">
      <StudentSidebar active={active} />
      <div className="ml-64 flex flex-col min-h-screen">
        <TopBar title={title} />
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

export function TeacherLayout({
  active,
  title,
  children,
}: {
  active: string;
  title?: string;
  children: ReactNode;
}) {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== "teacher") {
      navigate("/teacher-login");
    } else {
      setReady(true);
    }
  }, [navigate]);

  if (!ready) return null;

  return (
    <div className="min-h-screen bg-background">
      <TeacherSidebar active={active} />
      <div className="ml-64 flex flex-col min-h-screen">
        <TopBar title={title} />
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
