// Applies the saved theme before first paint. Kept as its own file so the
// Content-Security-Policy can require `script-src 'self'` with no inline code.
(function () {
  try {
    var stored = localStorage.getItem("theme");
    var theme =
      stored === "light" || stored === "dark"
        ? stored
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    }
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute("content", theme === "dark" ? "#070d0b" : "#f5faf7");
    }
  } catch {
    // Storage can be blocked; the default light theme still applies.
  }
})();
