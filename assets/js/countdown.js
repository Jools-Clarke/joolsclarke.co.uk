// Countdown boxes: <div class="countdown" data-target="2026-01-30T10:00:00Z">
// containing elements with data-unit="days|hours|minutes|seconds".
(function () {
  "use strict";

  const box = document.querySelector(".countdown");
  if (!box) return;

  const target = Date.parse(box.dataset.target);
  const unit = (name) => box.querySelector(`[data-unit="${name}"]`);
  const parts = { days: unit("days"), hours: unit("hours"), minutes: unit("minutes"), seconds: unit("seconds") };

  function tick() {
    const left = Math.max(0, Math.floor((target - Date.now()) / 1000));
    parts.days.textContent = Math.floor(left / 86400);
    parts.hours.textContent = Math.floor(left / 3600) % 24;
    parts.minutes.textContent = Math.floor(left / 60) % 60;
    parts.seconds.textContent = left % 60;
  }

  tick();
  setInterval(tick, 1000);
})();
