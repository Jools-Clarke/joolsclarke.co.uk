// Behaviour shared by every page: light/dark button, background logos, confetti.
// Page-specific scripts (conferences.js, gallery.js, countdown.js) are loaded
// by the pages that need them.
(function () {
  "use strict";

  const root = document.documentElement;
  const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ── Light/dark ─────────────────────────────────────────────────────────
  // The starting theme is set in _includes/head.html before the page draws.
  const toggles = document.querySelectorAll(".toggle-theme");

  function showTheme() {
    const dark = root.dataset.theme === "dark";
    toggles.forEach((button) => { button.textContent = dark ? "☼" : "☾"; });
  }

  toggles.forEach((button) => {
    button.addEventListener("click", () => {
      root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
      try { localStorage.setItem("theme", root.dataset.theme); } catch (e) { /* private mode */ }
      showTheme();
    });
  });
  showTheme();

  // ── Background logos ───────────────────────────────────────────────────
  // _includes/background.html lists one <img> per logo; fill the screen with
  // shuffled copies. Only enough to cover this screen, not a fixed 800.
  const background = document.querySelector(".background");
  if (background) {
    const logos = Array.from(background.children);
    const needed = Math.ceil(window.screen.width / 100) * Math.ceil(window.screen.height / 80);
    const pile = [];

    while (pile.length < needed) {
      const round = logos.slice();
      for (let i = round.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [round[i], round[j]] = [round[j], round[i]];
      }
      round.forEach((logo) => pile.push(logo.cloneNode()));
    }
    background.replaceChildren(...pile);
  }

  // ── Click to copy ──────────────────────────────────────────────────────
  // Anything with data-copy="text" (cards with `copy:`), or any link to
  // "#copy" (copies the link's own text, e.g. [me@x.com](#copy) in Markdown),
  // copies to the clipboard and pops up a note saying so.
  let toast;
  let toastTimer;

  function say(message) {
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "toast";
      toast.setAttribute("role", "status");
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2500);
  }

  // The old way, for browsers without the clipboard API (or that refuse it).
  function copyViaTextBox(text) {
    const box = document.createElement("textarea");
    box.value = text;
    box.style.position = "fixed";
    box.style.opacity = "0";
    document.body.appendChild(box);
    box.select();
    let ok = false;
    try { ok = document.execCommand("copy"); } catch (e) { /* not supported */ }
    box.remove();
    return ok;
  }

  function copy(text) {
    const done = () => say(text.includes("@") ? "Email address copied" : "Copied");
    const fallback = () => (copyViaTextBox(text) ? done() : say(`Couldn't copy it, sorry: ${text}`));
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, fallback);
    } else {
      fallback();
    }
  }

  document.querySelectorAll('[data-copy], a[href="#copy"]').forEach((element) => {
    const text = () => element.dataset.copy || element.textContent.trim();
    element.setAttribute("role", "button");
    element.title = "Click to copy";
    element.addEventListener("click", (event) => {
      event.preventDefault();
      copy(text());
    });
    element.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        copy(text());
      }
    });
  });

  // ── Confetti ───────────────────────────────────────────────────────────
  // Any element with class="has-confetti" sprinkles on page load and on hover.
  if (calm) return;
  const colours = [1, 2, 3, 4, 5, 6].map((n) => `var(--accent-${n})`);

  function sprinkle(container) {
    for (let i = 0; i < 25; i += 1) {
      const piece = document.createElement("div");
      piece.className = "confetti-piece";
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.top = `${Math.random() * 20}%`;
      piece.style.backgroundColor = colours[Math.floor(Math.random() * colours.length)];
      piece.style.animationDelay = `${Math.random() * 0.2}s`;
      piece.addEventListener("animationend", () => piece.remove());
      container.appendChild(piece);
    }
  }

  document.querySelectorAll(".has-confetti").forEach((element) => {
    const container = document.createElement("div");
    container.className = "confetti";
    element.appendChild(container);
    element.addEventListener("mouseenter", () => sprinkle(container));
    window.addEventListener("load", () => sprinkle(container));
  });
})();
