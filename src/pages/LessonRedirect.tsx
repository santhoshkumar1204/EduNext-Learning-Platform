import { Navigate, useParams } from "react-router-dom";

// /lesson/:id -> /course-video/:id (the lesson player IS the course video page)
export default function LessonRedirect() {
  const { id } = useParams();
  return <Navigate to={`/course-video/${id || 1}`} replace />;
}
