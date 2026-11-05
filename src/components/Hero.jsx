import { useEffect, useState } from "react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { HiArrowRight, HiOutlineDownload, HiOutlineMail } from "react-icons/hi";
import { EMAIL, GITHUB_URL, LINKEDIN_URL, RESUME_URL, ROLES } from "../site.config";

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

        {/* ---- Right: profile photo card ---- */}
        <div className="hero__visual">
          <figure className="hero-photo">
            <img
              className="hero-photo__img"
              src={`${import.meta.env.BASE_URL}hero-photo-james.jpg`}
              alt="James Sederia, front-end developer and Vice Chief of Technology at AWS SBG JRU"
              width="853"
              height="1200"
              loading="eager"
              decoding="async"
            />
            <span className="hero-photo__status">
              <span className="hero-photo__dot" aria-hidden="true" />
              Open to work
            </span>
          </figure>
        </div>
      </div>
    </section>
  );
}
