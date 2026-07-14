// Real Unsplash imagery used across the app (stable photo IDs).
export const IMG = {
  heroClassroom: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80",
  studentsStudying: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
  teacher: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80",
  course1: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=80",
  course2: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80",
  studentLogin: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80",
  teacherLogin: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=800&q=80",
};

// Course thumbnails by category (so cards always show a relevant, working image).
export const COURSE_IMG: Record<string, string> = {
  Programming: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&q=80",
  "Web Development": "https://images.unsplash.com/photo-1547658719-da2b51169166?w=400&q=80",
  "Data Analytics": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80",
  "Cyber Security": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&q=80",
  Mathematics: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&q=80",
};

export function courseImage(category?: string, fallback?: string) {
  return (category && COURSE_IMG[category]) || fallback || IMG.course1;
}

// Avatar by name initials — reliable, no external face-photo dependency.
export function avatarUrl(name: string) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=12A150&color=fff&bold=true&size=128`;
}
