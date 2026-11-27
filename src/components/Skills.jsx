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

// Split tools into two rows for the marquee animation.
// Row A scrolls left, Row B scrolls right.
const ROW_A = [
  { label: "HTML5", Icon: SiHtml5, color: "#e34f26" },
  { label: "CSS3", Icon: SiCss, color: "#1572b6" },
  { label: "JavaScript", Icon: SiJavascript, color: "#e0c000" },
  { label: "React", Icon: SiReact, color: "#61dafb" },
  { label: "Tailwind CSS", Icon: SiTailwindcss, color: "#38bdf8" },
  { label: "Vite", Icon: SiVite, color: "#a78bfa" },
  { label: "Python", Icon: SiPython, color: "#3776ab" },
];

const ROW_B = [
  { label: "Node.js", Icon: SiNodedotjs, color: "#5fa04e" },
  { label: "PHP", Icon: SiPhp, color: "#777bb4" },
  { label: "MySQL", Icon: SiMysql, color: "#4479a1" },
  { label: "Git", Icon: SiGit, color: "#f05032" },
  { label: "GitHub", Icon: SiGithub, color: "#e5e7eb" },
  { label: "Figma", Icon: SiFigma, color: "#a259ff" },
  { label: "Java", Icon: FaJava, color: "#f89820" },
];

function ToolPill({ label, Icon, color }) {
  return (
    <div className="tool-pill" aria-label={label}>
      <span
        className="tool-pill__icon"
        aria-hidden="true"
        style={{ "--pill-color": color }}
      >
        <Icon />
      </span>
      <span className="tool-pill__label">{label}</span>
    </div>
  );
}

function MarqueeTrack({ items, className }) {
  // Triple the items so the loop is seamless before the CSS resets.
  const tripled = [...items, ...items, ...items];

  return (
    <div className="tools-viewport" aria-hidden="true">
      <div className={`tools-track ${className}`}>
        {tripled.map(({ label, Icon, color }, i) => (
          <ToolPill key={`${label}-${i}`} label={label} Icon={Icon} color={color} />
        ))}
      </div>
    </div>
  );
}

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
            What I build with
          </h2>
          <p className="section__lead">
            The languages, frameworks and tools I use day to day.
          </p>
        </Reveal>
      </div>

      {/* Marquee rows break out of the container for a full-bleed scroll effect */}
      <div className="tools-marquee">
        <MarqueeTrack items={ROW_A} className="tools-track--left" />
        <MarqueeTrack items={ROW_B} className="tools-track--right" />
      </div>

      {/* Accessible fallback: a hidden list for screen readers */}
      <ul className="sr-only">
        {[...ROW_A, ...ROW_B].map(({ label }) => (
          <li key={label}>{label}</li>
        ))}
      </ul>
    </section>
  );
}
