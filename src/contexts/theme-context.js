import { createContext, useContext } from "react";

// Kept in a separate module from <ThemeProvider> so that file only exports a
// component (React Fast Refresh requirement, enforced by oxlint).

export const ThemeContext = createContext(undefined);

// Browser UI colours, mirrored in index.html's pre-paint script.
const THEME_COLORS = { light: "#f5faf7", dark: "#070d0b" };

/** The visitor's saved choice, or null when they have never chosen one. */
export function getStoredTheme() {
  try {
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // Storage can be blocked (privacy mode, embedded contexts).
  }
  return null;
}

export function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function applyTheme(theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute("content", THEME_COLORS[theme]);
  }
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (ctx === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}
