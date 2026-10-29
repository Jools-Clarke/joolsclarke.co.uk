// Section tabs (_includes/blocks/section-tabs.html): marks the tab of the
// section you're in, and shows the tabs until 2 seconds after scrolling stops.
(function () {
  "use strict";

  const nav = document.querySelector(".section-tabs");
  if (!nav) return;

  const tabs = Array.from(nav.querySelectorAll("a"));
  const targets = tabs.map((tab) => document.getElementById(tab.hash.slice(1)));
  let timer;

  function update() {
    if (!nav.getClientRects().length) return;   // hidden on wide screens
    // The current section is the last one whose start is above 25% of the
    // screen (high enough that a short one like the map gets its turn).
    // Tabs are in page order; #top has no element, so it's always passed.
    const line = window.innerHeight * 0.25;
    let current = 0;
    targets.forEach((target, i) => {
      if (!target || target.getBoundingClientRect().top < line) current = i;
    });
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    if (atBottom) current = tabs.length - 1;   // a short last section never reaches the line

    tabs.forEach((tab, i) => {
      if (i === current) tab.setAttribute("aria-current", "location");
      else tab.removeAttribute("aria-current");
    });
    nav.classList.add("scrolling");
    clearTimeout(timer);
    timer = setTimeout(() => nav.classList.remove("scrolling"), 2000);
  }

  window.addEventListener("scroll", update, { passive: true });
})();
