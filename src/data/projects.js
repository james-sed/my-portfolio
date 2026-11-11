import { GITHUB_URL } from "../site.config";

// TODO: replace the placeholder `live` / `repo` URLs and the cover images
// with your real project links and screenshots.
export const PROJECTS = [
  {
    title: "AWS SBG JRU Website",
    description:
      "The official site for our AWS Student Builders group — event listings, team profiles, and quick registration for upcoming workshops.",
    image: `${import.meta.env.BASE_URL}aws-home.jpg`,
    tags: ["Vanilla HTML", "CSS", "JavaScript", "Python", "FastAPI", "Supabase", "Groq API"],
    live: "https://www.awssbgjru.me/",
    repo: "https://github.com/migsrvr/awssbgjru",
  },
  {
    title: "Event Registration System",
    description:
      "A fast, mobile-friendly sign-up flow with validation, confirmation states, and a clean admin-style dashboard for organizers.",
    image: `${import.meta.env.BASE_URL}projects/events.svg`,
    tags: ["Vanilla HTML", "CSS", "JavaScript", "Python", "FastAPI", "Supabase", "Groq API"],
    live: GITHUB_URL,
    repo: "https://github.com/AWS-Student-Builder-Group-JRU/AWS---Event-Website",
  },
  {
    title: "Philippine Wage Dashboard",
    description:
      "A simple, mobile-responsive dashboard to quickly check the minimum wage of a specific city or province in the Philippines.",
    image: `${import.meta.env.BASE_URL}ph-wage-dashboard.jpg`,
    tags: ["Vanilla HTML", "CSS", "JavaScript"],
    live: GITHUB_URL,
    repo: "https://github.com/james-sed/PH-Wage-Dashboard",
  },
  {
    title: "SignWise - Sign Language Learning Website",
    description:
      "Co-developed a beginner-friendly web application designed to teach basic American Sign Language (ASL) using MediaPipe and quizzes.",
    image: `${import.meta.env.BASE_URL}signwise.jpg`,
    tags: ["Laravel", "PHP", "Bootstrap", "JavaScript", "CSS", "HTML", "Tailwind CSS", "MediaPipe"],
    live: "https://signwiseasl.vercel.app/",
    repo: "https://github.com/zxyrone-zxcy/signwiseasl",
  },
  {
    title: "EduPath: IT Recommender System Using ML",
    description:
      "Co-developed a machine learning-based recommender system for IT and CSE courses and programs offered in JRU.",
    image: `${import.meta.env.BASE_URL}edupath.jpg`,
    tags: ["HTML", "CSS", "JavaScript", "Python", "PostgreSQL", "ML"],
    live: GITHUB_URL,
    repo: "https://github.com/james-sed/EduPath",
  },
];
