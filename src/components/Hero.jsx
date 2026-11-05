import { useEffect, useState } from "react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { HiArrowRight, HiOutlineDownload, HiOutlineMail } from "react-icons/hi";
import { EMAIL, GITHUB_URL, LINKEDIN_URL, RESUME_URL, ROLES } from "../site.config";
import { PROJECTS } from "../data/projects";

// Change this index to feature a different project in the hero.
const FEATURED_PROJECT_INDEX = 0;
const FEATURED_TAG_PRIORITY = ["Vanilla HTML", "JavaScript", "Supabase"];

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
  const featured = PROJECTS[FEATURED_PROJECT_INDEX];
  const featuredTags = [
    ...FEATURED_TAG_PRIORITY.filter((tag) => featured.tags.includes(tag)),
    ...featured.tags.filter((tag) => !FEATURED_TAG_PRIORITY.includes(tag)),
  ].slice(0, 3);
  const featuredSlug = featured.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return (
    <section className="hero" id="home" aria-labelledby="hero-title">
      <div className="hero__bg" aria-hidden="true" />

      <div className="container hero__inner">
        {/* ---- Left: message + calls to action ---- */}
        <div className="hero__content">

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
            <a className="btn btn--link" href={RESUME_URL} download>
              <HiOutlineDownload aria-hidden="true" /> Download Résumé
            </a>
          </div>

          <div className="hero__socials">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="James Sederia on GitHub"
            >
              <FaGithub size={19} aria-hidden="true" />
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="James Sederia on LinkedIn"
            >
              <FaLinkedinIn size={18} aria-hidden="true" />
            </a>
            <a href={`mailto:${EMAIL}`} aria-label="Email James Sederia">
              <HiOutlineMail size={20} aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* ---- Right: featured project preview ---- */}
        <div className="hero__visual">
          <aside className="hero-feature" aria-label="Featured project">
            <span className="hero-feature__badge">
              <span className="hero-feature__badge-dot" aria-hidden="true" />
              Featured
            </span>

            <div className="hero-feature__browser">
              <div className="hero-feature__bar" aria-hidden="true">
                <span className="hero-feature__window-dot" />
                <span className="hero-feature__window-dot" />
                <span className="hero-feature__window-dot" />
                <span className="hero-feature__url">{featuredSlug}</span>
              </div>
              <div className="hero-feature__media">
                <img
                  src={featured.image}
                  alt={`Preview of the ${featured.title} project`}
                  loading="eager"
                  decoding="async"
                />
              </div>
            </div>

            <div className="hero-feature__body">
              <h2 className="hero-feature__title">{featured.title}</h2>
              <p className="hero-feature__desc">{featured.description}</p>
              <a className="hero-feature__link" href="#projects">
                View project <HiArrowRight aria-hidden="true" />
              </a>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
