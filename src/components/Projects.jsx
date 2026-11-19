import { useEffect, useRef, useState } from "react";
import { FaGithub } from "react-icons/fa";
import { HiOutlineExternalLink } from "react-icons/hi";
import Reveal from "./Reveal";
import { GITHUB_URL } from "../site.config";
import { PROJECTS } from "../data/projects";

const VISIBLE = 2;

export default function Projects() {
  const [index, setIndex] = useState(0);
  const pointerStart = useRef(null);
  const swipeEnd = useRef(0);
  const total = PROJECTS.length;

  // Shortest circular distance so navigation wraps around.
  const offsetOf = (i) => {
    let d = i - index;
    if (d > total / 2) d -= total;
    if (d < -total / 2) d += total;
    return d;
  };

  const goTo = (i) => setIndex((i + total) % total);
  const go = (d) => goTo(index + d);

  // Warm the browser cache for the neighbouring slides so a next/prev click
  // paints immediately instead of waiting on a network request and decode.
  // The Image objects are kept so the fetches survive garbage collection.
  const preloaded = useRef(new Map());

  useEffect(() => {
    const preload = (i) => {
      const project = PROJECTS[((i % total) + total) % total];
      if (!project) return;

      const { image } = project;
      if (preloaded.current.has(image)) return;

      const img = new Image();
      img.decoding = "async";
      img.src = image;
      preloaded.current.set(image, img);
    };

    preload(index + 1);
    preload(index - 1);
  }, [index, total]);

  const handlePointerDown = (e) => {
    // Arrows and dots own their clicks; don't read their presses as drags.
    if (e.target.closest?.('button')) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    pointerStart.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e) => {
    const start = pointerStart.current;
    pointerStart.current = null;
    if (!start) return;

    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;

    // Require a mostly-horizontal gesture so vertical scrolling and taps on
    // the card still behave normally.
    if (Math.abs(dx) < 50 || Math.abs(dx) <= Math.abs(dy)) return;

    swipeEnd.current = Date.now();
    go(dx < 0 ? 1 : -1);
  };

  const handlePointerCancel = () => {
    pointerStart.current = null;
  };

  // A swipe still ends with a click on the card (or link) it started on. Swallow
  // that click so it neither snaps the carousel back to the card being dragged
  // nor follows a link under the finger.
  const handleClickCapture = (e) => {
    if (Date.now() - swipeEnd.current > 400) return;
    swipeEnd.current = 0;
    e.preventDefault();
    e.stopPropagation();
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    }
  };

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

        <div
          className="projects-carousel"
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label="Projects"
          onKeyDown={handleKeyDown}
          onClickCapture={handleClickCapture}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
        >
          <button
            type="button"
            className="projects-carousel__nav projects-carousel__nav--prev"
            aria-label="Previous project"
            onClick={() => go(-1)}
          >
            &#8249;
          </button>

          <div className="projects-carousel__stage">
            <div className="projects-carousel__track">
              {PROJECTS.map((project, i) => {
                const offset = offsetOf(i);
                const abs = Math.abs(offset);
                const isActive = offset === 0;

                return (
                  <article
                    key={project.title}
                    className={[
                      "project-card",
                      isActive ? "is-active" : "",
                      abs > VISIBLE ? "is-hidden" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    style={{
                      "--offset": offset,
                      "--abs": Math.min(abs, VISIBLE + 1),
                      zIndex: 100 - abs,
                    }}
                    aria-hidden={isActive ? "false" : "true"}
                    onClick={(e) => {
                      if (!isActive) {
                        e.preventDefault();
                        goTo(i);
                      }
                    }}
                  >
                    <div className="project-card__media">
                      <img
                        src={project.image}
                        alt={`Preview of the ${project.title} project`}
                        width="1200"
                        height="750"
                        loading={i === 0 ? "eager" : "lazy"}
                        fetchPriority={i === 0 ? "high" : "auto"}
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
                        {project.live && project.live !== GITHUB_URL && (
                          <a
                            href={project.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            tabIndex={isActive ? 0 : -1}
                          >
                            <HiOutlineExternalLink aria-hidden="true" /> Live
                            demo
                          </a>
                        )}
                        <a
                          href={project.repo}
                          target="_blank"
                          rel="noopener noreferrer"
                          tabIndex={isActive ? 0 : -1}
                        >
                          <FaGithub aria-hidden="true" /> Code
                        </a>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            className="projects-carousel__nav projects-carousel__nav--next"
            aria-label="Next project"
            onClick={() => go(1)}
          >
            &#8250;
          </button>

          <div
            className="projects-carousel__dots"
            role="group"
            aria-label="Choose project"
          >
            {PROJECTS.map((project, i) => (
              <button
                key={project.title}
                type="button"
                className={i === index ? "is-active" : ""}
                aria-label={`Go to project ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}