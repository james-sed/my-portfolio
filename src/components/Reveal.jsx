import { useEffect, useRef, useState } from "react";

/**
 * Reveal
 * Fades + slides its children into view the first time they enter the
 * viewport using an IntersectionObserver. Falls back to "always visible"
 * when the user prefers reduced motion.
 *
 * @param {string} as      - element tag to render (default: "div")
 * @param {number} delay   - stagger delay in ms
 */
export default function Reveal({
  as: Tag = "div",
  className = "",
  delay = 0,
  children,
  ...rest
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer = null;
    let revealed = false;

    const reveal = () => {
      revealed = true;
      setVisible(true);
      observer?.disconnect();
      observer = null;
    };

    const observe = () => {
      if (revealed || media.matches) return;
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) reveal();
        },
        { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
      );
      observer.observe(el);
    };

    // Honour the preference at mount and keep following it: switching reduced
    // motion on with the page open reveals anything still waiting.
    const onChange = () => {
      if (media.matches) reveal();
      else observe();
    };

    if (media.matches) reveal();
    else observe();

    media.addEventListener("change", onChange);
    return () => {
      media.removeEventListener("change", onChange);
      observer?.disconnect();
    };
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal${visible ? " is-visible" : ""}${className ? ` ${className}` : ""}`}
      style={{ "--reveal-delay": `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
