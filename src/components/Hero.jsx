import { useEffect, useState } from "react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { HiArrowRight, HiOutlineDownload, HiOutlineMail } from "react-icons/hi";
import { SiCss, SiJavascript, SiReact } from "react-icons/si";

// Phrases cycled through the hero's typing effect.
const ROLES = [
  "Front-end Developer",
  "React Developer",
  "UI Engineer",
  "AWS Student Builder",
];

const LINKS = {
  // TODO: replace with your real details
  github: "https://github.com/james-sed",
  linkedin: "https://www.linkedin.com/in/james-sederia-4b87383a8",
  email: "jjsederia08@gmail.com",
  resume: "/resume.pdf", // TODO: drop resume.pdf into /public
};

/** Small typewriter hook honouring prefers-reduced-motion. */
function useTypewriter(phrases) {
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setText(phrases[0]);
      return;
    }

    const current = phrases[index % phrases.length];
    const isDone = !deleting && text === current;
    const isCleared = deleting && text === "";

    let delay = deleting ? 45 : 95;
    if (isDone) delay = 1500;
    if (isCleared) delay = 450;

    const timer = setTimeout(() => {
      if (isDone) {
        setDeleting(true);
      } else if (isCleared) {
        setDeleting(false);
        setIndex((i) => (i + 1) % phrases.length);
      } else {
        setText(current.slice(0, text.length + (deleting ? -1 : 1)));
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [text, deleting, index, phrases]);

  return text;
}

export default function Hero() {
  const typed = useTypewriter(ROLES);

  return (
    <section className="hero" id="home" aria-labelledby="hero-title">
      <div className="hero__bg" aria-hidden="true" />

      <div className="container hero__inner">
        {/* ---- Left: message + calls to action ---- */}
        <div className="hero__content">
          <p className="eyebrow">
            <span className="eyebrow__dot" aria-hidden="true" />
            AWS SBG JRU · Vice Chief of Technology
          </p>

          <h1 className="hero__title" id="hero-title">
            <span>James Sederia</span>
            <span className="hero__role">
              <span className="hero__role-text" aria-hidden="true">
                {typed}
              </span>
              <span className="hero__caret" aria-hidden="true" />
            </span>
            <span className="sr-only">{ROLES[0]}</span>
          </h1>

          <p className="hero__lead">
            I build clean, accessible, and fast interfaces for the web. I work
            with{" "}
            <strong className="highlight">
              HTML, CSS, JavaScript, React, and modern front-end tools
            </strong>{" "}
            to turn designs into polished, user-friendly experiences.
          </p>

          <div className="hero__actions">
            <a className="btn btn--primary" href="#projects">
              View Projects <HiArrowRight aria-hidden="true" />
            </a>
            <a className="btn btn--ghost" href="#contact">
              <HiOutlineMail aria-hidden="true" /> Contact Me
            </a>
            <a className="btn btn--link" href={LINKS.resume} download>
              <HiOutlineDownload aria-hidden="true" /> Download Résumé
            </a>
          </div>

          <div className="hero__socials">
            <a
              href={LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="James Sederia on GitHub"
            >
              <FaGithub size={19} aria-hidden="true" />
            </a>
            <a
              href={LINKS.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="James Sederia on LinkedIn"
            >
              <FaLinkedinIn size={18} aria-hidden="true" />
            </a>
            <a href={`mailto:${LINKS.email}`} aria-label="Email James Sederia">
              <HiOutlineMail size={20} aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* ---- Right: illustration (code window + floating chips) ---- */}
        <div className="hero__visual">
          <div className="codecard" aria-hidden="true">
            <div className="codecard__bar">
              <span className="codecard__dot codecard__dot--r" />
              <span className="codecard__dot codecard__dot--y" />
              <span className="codecard__dot codecard__dot--g" />
              <span className="codecard__file">portfolio.jsx</span>
            </div>
            <pre className="codecard__code">
              <code>
                <span className="tok-com">{"// clean, accessible, fast"}</span>
                {"\n"}
                <span className="tok-key">const</span>
                {" developer = {\n"}
                {"  name: "}
                <span className="tok-str">{"'James Sederia'"}</span>
                {",\n  role: "}
                <span className="tok-str">{"'Front-end Developer'"}</span>
                {",\n  stack: ["}
                <span className="tok-str">{"'React', 'JS', 'CSS'"}</span>
                {"] ,\n  status: "}
                <span className="tok-fn">{"openToWork"}</span>
                {"\n};\n"}
              </code>
            </pre>
          </div>

          <span className="chip chip--1" aria-hidden="true" style={{ "--chip-color": "#61dafb" }}>
            <SiReact /> React
          </span>
          <span className="chip chip--2" aria-hidden="true" style={{ "--chip-color": "#f7df1e" }}>
            <SiJavascript /> JavaScript
          </span>
          <span className="chip chip--3" aria-hidden="true" style={{ "--chip-color": "#1572b6" }}>
            <SiCss /> CSS
          </span>

          <div className="hero__badge">
            <span className="hero__badge-avatar" aria-hidden="true">
              JS
            </span>
            <span>
              <small>Availability</small>
              <strong>
                <span className="status-dot" aria-hidden="true" />
                Open to work
              </strong>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
