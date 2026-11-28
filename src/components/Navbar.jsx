import { useEffect, useRef, useState } from "react";
import { HiMenu, HiMoon, HiSun, HiX } from "react-icons/hi";
import { useTheme } from "../contexts/theme-context";

const LINKS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "certifications", label: "Credentials" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

// Sections watched by the scrollspy. Skills has no nav link of its own, so it
// keeps the About link highlighted while it is on screen.
const SECTION_LINKS = {
  home: "home",
  about: "about",
  skills: "about",
  certifications: "certifications",
  projects: "projects",
  contact: "contact",
};

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  const navRef = useRef(null);
  const toggleRef = useRef(null);
  const indicatorRef = useRef(null);

  // Scrollspy — highlight the section currently in view.
  useEffect(() => {
    const sections = Object.keys(SECTION_LINKS)
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (!sections.length) return undefined;

    // Remember the latest entry for every section so one callback can pick a
    // single winner instead of letting the last intersecting entry win.
    const entriesById = new Map();

    const updateActive = () => {
      // Page is at the bottom: the footer can cover the middle band, so pin
      // the last section instead of leaving a stale highlight.
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (atBottom) {
        const lastSection = sections[sections.length - 1].id;
        setActive(SECTION_LINKS[lastSection] ?? lastSection);
        return;
      }

      let bestId = null;
      let bestDistance = Infinity;

      entriesById.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const rect = entry.boundingClientRect;
        const distance = Math.abs(
          rect.top + rect.height / 2 - window.innerHeight * 0.475,
        );
        if (distance < bestDistance) {
          bestDistance = distance;
          bestId = entry.target.id;
        }
      });

      // setActive replaces the previous id, so only one link is ever lit.
      if (bestId) setActive(SECTION_LINKS[bestId] ?? bestId);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => entriesById.set(entry.target.id, entry));
        updateActive();
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
        // The indicator is desktop-only. Clear the inline geometry from any
        // previous desktop layout so it cannot take up space in the mobile
        // menu column.
        indicator.style.opacity = "0";
        indicator.style.display = "none";
        indicator.style.width = "";
        indicator.style.height = "";
        indicator.style.transform = "";
        return;
      }

      indicator.style.display = "";

      const activeEl = nav.querySelector(`a[href="#${active}"]:not(.btn)`);
      if (!activeEl) {
        indicator.style.opacity = "0";
        return;
      }

      // Use layout offsets rather than getBoundingClientRect(): the links are
      // mid entrance animation (fade-down starts at translateY(-12px)) when
      // this effect first runs, and rects include that transform. Offsets
      // ignore transforms and are already relative to the nav, the indicator's
      // offsetParent.
      const {
        offsetLeft: x,
        offsetTop: y,
        offsetWidth,
        offsetHeight,
      } = activeEl;

      indicator.style.width = `${offsetWidth}px`;
      indicator.style.height = `${offsetHeight}px`;
      indicator.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      indicator.style.opacity = "1";
    };

    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    // Measure again once webfonts have swapped in, or the pill keeps the
    // fallback font's metrics.
    document.fonts?.ready.then(updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [active]);

  // Escape closes the mobile menu and returns focus to the toggle.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // While the menu is open: move focus into the panel, keep Tab inside it, and
  // make the rest of the page inert so keyboard and screen-reader users cannot
  // reach content hidden behind the menu.
  useEffect(() => {
    if (!open) return undefined;
    const panel = navRef.current;
    if (!panel) return undefined;
    // Captured for the cleanup below; the ref itself may have changed by then.
    const toggle = toggleRef.current;

    const focusables = () =>
      [...panel.querySelectorAll("a, button")].filter(
        (el) => !el.hasAttribute("disabled") && el.offsetParent !== null,
      );

    const initialFocus =
      panel.querySelector(".navbar__close") || panel.querySelector("a");
    initialFocus?.focus();

    const onKey = (e) => {
      if (e.key !== "Tab") return;
      const items = focusables();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    const main = document.getElementById("main");
    const footer = document.querySelector("footer");
    main?.setAttribute("inert", "");
    footer?.setAttribute("inert", "");

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      main?.removeAttribute("inert");
      footer?.removeAttribute("inert");
      // The panel is hidden again, so put focus back on the control that
      // opened it. preventScroll keeps a section link's jump intact.
      toggle?.focus({ preventScroll: true });
    };
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

        {/* Dimmed backdrop behind floating card */}
        <div
          className={`navbar__backdrop${open ? " is-open" : ""}`}
          onClick={close}
          aria-hidden="true"
        />

        <nav
          ref={navRef}
          id="primary-nav"
          className={`navbar__nav${open ? " is-open" : ""}`}
          aria-label="Primary"
        >
          {/* Header with close (X) button — mobile only */}
          <div className="navbar__menu-header">
            <button
              type="button"
              className="navbar__close"
              onClick={close}
              aria-label="Close menu"
            >
              <HiX size={20} aria-hidden="true" />
            </button>
          </div>

          <span
            ref={indicatorRef}
            className="navbar__indicator"
            aria-hidden="true"
          />

          <div className="navbar__links">
            {LINKS.map(({ id, label }, i) => (
              <a
                key={id}
                href={`#${id}`}
                className={[active === id ? "is-active" : "", "nav-enter"]
                  .filter(Boolean)
                  .join(" ")}
                aria-current={active === id ? "location" : undefined}
                onClick={close}
                style={{ "--enter-d": `${0.1 + i * 0.05}s` }}
              >
                {label}
              </a>
            ))}
          </div>

          <div className="navbar__divider" role="separator" aria-hidden="true" />

          <div className="navbar__actions">
            <span className="navbar__actions-label">Theme</span>
            <button
              className="theme-toggle nav-enter"
              type="button"
              onClick={toggleTheme}
              style={{ "--enter-d": "0.3s" }}
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
          </div>
        </nav>
      </div>
    </header>
  );
}