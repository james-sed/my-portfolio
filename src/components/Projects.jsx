import { FaGithub } from "react-icons/fa";
import { HiOutlineExternalLink } from "react-icons/hi";
import Reveal from "./Reveal";

// TODO: replace the placeholder `live` / `repo` URLs and the cover images
// with your real project links and screenshots.
const PROJECTS = [
  {
    title: "AWS SBG JRU Website",
    description:
      "The official site for our AWS Student Builders group — event listings, team profiles, and quick registration for upcoming workshops.",
    image: "/aws home.jpg",
    tags: ["Vanilla HTML", "CSS", "JavaScript", "Python", "FastAPI", "Supabase", "Groq API"],
    live: "https://www.awssbgjru.me/",
    repo: "https://github.com/james-sed",
  },
  {
    title: "Event Registration System",
    description:
      "A fast, mobile-friendly sign-up flow with validation, confirmation states, and a clean admin-style dashboard for organizers.",
    image: "/projects/events.svg",
    tags: ["Vanilla HTML", "CSS", "JavaScript", "Python", "FastAPI", "Supabase", "Groq API"],
    live: "#", // TODO: live URL
    repo: "https://github.com/james-sed",
  },
];

export default function Projects() {
  return (
    <section
      className="section"
      id="projects"
      aria-labelledby="projects-title"
    >
      <div className="container">
        <Reveal className="section__head section__head--center">
          <p className="eyebrow">Selected work</p>
          <h2 className="section__title" id="projects-title">
            Featured projects
          </h2>
          <p className="section__lead">
            A few things I've built and helped ship — each with production
            code and, where possible, a live demo.
          </p>
        </Reveal>

        <ul className="projects-grid">
          {PROJECTS.map((project, i) => (
            <Reveal as="li" key={project.title} className="project-card" delay={i * 90}>
              <div className="project-card__media">
                <img
                  src={project.image}
                  alt={`Preview of the ${project.title} project`}
                  width="1200"
                  height="750"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="project-card__body">
                <h3 className="project-card__title">{project.title}</h3>
                <p className="project-card__desc">{project.description}</p>
                <ul className="project-card__tags">
                  {project.tags.map((tag) => (
                    <li className="tag" key={tag}>
                      {tag}
                    </li>
                  ))}
                </ul>
                <div className="project-card__links">
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <HiOutlineExternalLink aria-hidden="true" /> Live demo
                  </a>
                  <a
                    href={project.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaGithub aria-hidden="true" /> Code
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}