import { FaJava } from "react-icons/fa";
import {
  SiCss,
  SiFigma,
  SiGit,
  SiGithub,
  SiHtml5,
  SiJavascript,
  SiMysql,
  SiNodedotjs,
  SiPhp,
  SiPython,
  SiReact,
  SiTailwindcss,
  SiVite,
} from "react-icons/si";
import Reveal from "./Reveal";

// Each skill carries an optional brand colour for its icon badge.
const SKILLS = [
  { label: "HTML5", Icon: SiHtml5, color: "#e34f26" },
  { label: "CSS3", Icon: SiCss, color: "#1572b6" },
  { label: "JavaScript", Icon: SiJavascript, color: "#e0c000" },
  { label: "React", Icon: SiReact, color: "#61dafb" },
  { label: "Node.js", Icon: SiNodedotjs, color: "#5fa04e" },
  { label: "Tailwind CSS", Icon: SiTailwindcss, color: "#38bdf8" },
  { label: "Vite", Icon: SiVite, color: "#a78bfa" },
  { label: "Git", Icon: SiGit, color: "#f05032" },
  { label: "GitHub", Icon: SiGithub, color: undefined },
  { label: "Figma", Icon: SiFigma, color: "#a259ff" },
  { label: "MySQL", Icon: SiMysql, color: "#4479a1" },
  { label: "PHP", Icon: SiPhp, color: "#777bb4" },
  { label: "Python", Icon: SiPython, color: "#3776ab" },
  { label: "Java", Icon: FaJava, color: "#f89820" },
];

export default function Skills() {
  return (
    <section
      className="section skills-section"
      id="skills"
      aria-labelledby="skills-title"
    >
      <div className="container">
        <Reveal className="section__head section__head--center">
          <p className="eyebrow">Toolbox</p>
          <h2 className="section__title" id="skills-title">
            Skills &amp; technologies
          </h2>
          <p className="section__lead">
            The tools I reach for when turning ideas and designs into
            production-ready interfaces.
          </p>
        </Reveal>

        <ul className="skills-grid">
          {SKILLS.map(({ label, Icon, color }, i) => (
            <Reveal as="li" key={label} className="skill-card" delay={(i % 4) * 70}>
              <span
                className="skill-card__icon"
                aria-hidden="true"
                style={color ? { "--skill-color": color } : undefined}
              >
                <Icon />
              </span>
              <span className="skill-card__label">{label}</span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
