import { useEffect, useRef, useState } from "react";
import {
  ThemeContext,
  applyTheme,
  getStoredTheme,
  getSystemTheme,
} from "./theme-context";

function getInitialTheme() {
  return getStoredTheme() ?? getSystemTheme();
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);
  // Once the visitor picks a theme, stop following the OS.
  const chosen = useRef(getStoredTheme() !== null);

  useEffect(() => {
    applyTheme(theme);

    // Only persist an explicit choice. Saving the initial OS-derived theme
    // would pin it forever and stop the page from following the system.
    if (!chosen.current) return;
    try {
      localStorage.setItem("theme", theme);
    } catch {
      // Persisting is optional; the theme still applies for this session.
    }
  }, [theme]);

  // Follow live OS theme changes until the visitor makes a choice.
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (event) => {
      if (!chosen.current) setTheme(event.matches ? "dark" : "light");
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const toggleTheme = () => {
    chosen.current = true;
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
