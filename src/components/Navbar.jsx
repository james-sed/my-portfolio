import { useEffect, useRef, useState } from "react";
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
  const navRef = useRef(null);
  const toggleRef = useRef(null);
  const indicatorRef = useRef(null);

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

  // Update sliding active indicator on desktop
  useEffect(() => {
    const nav = navRef.current;
    const indicator = indicatorRef.current;
    if (!nav || !indicator) return undefined;

    const updateIndicator = () => {
      if (window.innerWidth <= 860) {
        indicator.style.opacity = "0";
        return;
      }

      const activeEl = nav.querySelector(`a[href="#${active}"]:not(.btn)`);
      if (!activeEl) {
        indicator.style.opacity = "0";
        return;
      }

      const navRect = nav.getBoundingClientRect();
      const linkRect = activeEl.getBoundingClientRect();
      const x = linkRect.left - navRect.left;
      const y = linkRect.top - navRect.top;

      indicator.style.width = `${linkRect.width}px`;
      indicator.style.height = `${linkRect.height}px`;
      indicator.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      indicator.style.opacity = "1";
    };

    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [active]);

  // Escape closes the mobile menu.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // A click/tap outside the panel (or the toggle) closes the mobile menu.
  useEffect(() => {
    if (!open) return undefined;

    const onPointerDown = (e) => {
      if (
        navRef.current?.contains(e.target) ||
        toggleRef.current?.contains(e.target)
      ) {
        return;
      }
      setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    if (!open) return undefined;

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [open]);

  // Close the menu if the viewport grows past the mobile breakpoint, so the
  // scroll lock is always released when the desktop layout takes over.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 861px)");
    const onChange = (e) => {
      if (e.matches) setOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const close = () => setOpen(false);

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <a
          className="brand nav-enter"
          href="#home"
          onClick={close}
          aria-label="James Sederia — back to top"
          style={{ "--enter-d": "0.05s" }}
        >
          <span className="brand__text">James Sederia</span>
        </a>

        <button
          ref={toggleRef}
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
          ref={navRef}
          id="primary-nav"
          className={`navbar__nav${open ? " is-open" : ""}`}
          aria-label="Primary"
        >
          <span
            ref={indicatorRef}
            className="navbar__indicator"
            aria-hidden="true"
          />

          {LINKS.map(({ id, label }, i) => (
            <a
              key={id}
              href={`#${id}`}
              className={[active === id ? "is-active" : "", "nav-enter"]
                .filter(Boolean)
                .join(" ")}
              aria-current={active === id ? "true" : undefined}
              onClick={close}
              style={{ "--enter-d": `${0.1 + i * 0.05}s` }}
            >
              {label}
            </a>
          ))}

          <a
            className="btn btn--primary navbar__cta nav-enter"
            href="#contact"
            onClick={close}
            style={{ "--enter-d": "0.3s" }}
          >
            Hire me
          </a>

          <button
            className="theme-toggle nav-enter"
            type="button"
            onClick={toggleTheme}
            style={{ "--enter-d": "0.35s" }}
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