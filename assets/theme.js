(function () {
  const saved = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = saved || (prefersDark ? "dark" : "light");

  document.documentElement.setAttribute("data-theme", theme);

  window.addEventListener("DOMContentLoaded", function () {
    const button = document.getElementById("theme-toggle");
    if (!button) return;

    button.textContent = theme === "dark" ? "☀️" : "🌙";

    button.addEventListener("click", function () {
      const current = document.documentElement.getAttribute("data-theme");
      const next = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
      button.textContent = next === "dark" ? "☀️" : "🌙";
    });
  });
})();
