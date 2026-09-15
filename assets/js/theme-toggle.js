(function () {
  const root = document.documentElement;

  function getInitialTheme() {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return savedTheme || (prefersDark ? "dark" : "light");
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    document.querySelectorAll(".toggle-theme").forEach((toggleIcon) => {
      toggleIcon.textContent = theme === "dark" ? "☼" : "☾";
    });
  }

  function notifyThemeChange(theme) {
    document.dispatchEvent(new CustomEvent("theme-changed", { detail: { theme } }));
  }

  function setTheme(theme) {
    applyTheme(theme);
    localStorage.setItem("theme", theme);
    notifyThemeChange(theme);
  }

  window.toggleTheme = function toggleTheme() {
    const current = root.getAttribute("data-theme") || "light";
    const next = current === "dark" ? "light" : "dark";
    setTheme(next);
  };

  const initialTheme = getInitialTheme();
  applyTheme(initialTheme);
  notifyThemeChange(initialTheme);
})();
