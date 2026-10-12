import { useEffect, useState } from "react";
import { HiMenu, HiMoon, HiSun, HiX } from "react-icons/hi";
import { useTheme } from "../contexts/ThemeContext";

const LINKS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");

  // Scrollspy — highlight the section currently in view.
  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(
      Boolean,
    );
    if (!sections.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // Escape closes the mobile menu.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <a className="brand" href="#home" onClick={close} aria-label="James Sederia — back to top">
          <span className="brand__mark" aria-hidden="true">
            JS
          </span>
          <span className="brand__text">James Sederia</span>
        </a>

        <button
          className="navbar__toggle"
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="primary-nav"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        >
          {open ? (
            <HiX size={24} aria-hidden="true" />
          ) : (
            <HiMenu size={24} aria-hidden="true" />
          )}
        </button>

        <nav
          id="primary-nav"
          className={`navbar__nav${open ? " is-open" : ""}`}
          aria-label="Primary"
        >
          {LINKS.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className={active === id ? "is-active" : undefined}
              aria-current={active === id ? "true" : undefined}
              onClick={close}
            >
              {label}
            </a>
          ))}

          <a
            className="btn btn--primary navbar__cta"
            href="#contact"
            onClick={close}
          >
            Hire me
          </a>

          <button
            className="theme-toggle"
            type="button"
            onClick={toggleTheme}
            aria-label={
              theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
            }
          >
            {theme === "dark" ? (
              <HiSun size={20} aria-hidden="true" />
            ) : (
              <HiMoon size={20} aria-hidden="true" />
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}