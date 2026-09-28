// /conferences/: draws the Leaflet map and links each pin to its entry in the
// list (the <details> items built from _data/conferences.yml). Hovering a pin
// highlights its entry; clicking either one opens it and flies the map there.
(function () {
  "use strict";

  const list = document.querySelector(".conf-list");
  if (!list || typeof L === "undefined") return;

  const colour = { idle: "#cb4b16", active: "#859900", home: "#aaaaaa" };
  const home = JSON.parse(list.dataset.home);
  const map = L.map("map", { preferCanvas: true }).setView([50, 10], 4);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  L.circleMarker(home, { radius: 8, color: colour.home, fillColor: colour.home, fillOpacity: 1 })
    .addTo(map)
    .bindPopup(`<b>${list.dataset.homeName} (home base)</b>`);

  // Curved line from home to a conference (a quadratic Bézier bowed upwards).
  function arc(from, to) {
    const bow = Math.hypot(to[0] - from[0], to[1] - from[1]) * 0.2;
    const control = [(from[0] + to[0]) / 2 + bow, (from[1] + to[1]) / 2];
    const points = [];
    for (let i = 0; i <= 100; i += 1) {
      const t = i / 100;
      const a = (1 - t) * (1 - t);
      const b = 2 * (1 - t) * t;
      const c = t * t;
      points.push([
        a * from[0] + b * control[0] + c * to[0],
        a * from[1] + b * control[1] + c * to[1]
      ]);
    }
    return L.polyline(points, { color: colour.idle, weight: 2, opacity: 0.6 });
  }

  const items = Array.from(list.querySelectorAll(".conf-item"));
  const pins = items.map((item) => {
    const coords = JSON.parse(item.dataset.coords);
    const name = item.querySelector("summary").textContent;
    const marker = L.circleMarker(coords, {
      radius: 8, color: colour.idle, fillColor: colour.idle, fillOpacity: 0.9,
      bubblingMouseEvents: false   // so clicking a pin isn't also a click on the empty map
    }).addTo(map).bindTooltip(name);
    const line = arc(home, coords).addTo(map);
    return { item, coords, marker, line };
  });

  function paint(pin, active) {
    const c = active ? colour.active : colour.idle;
    pin.marker.setStyle({ color: c, fillColor: c });
    pin.line.setStyle({ color: c, weight: active ? 4 : 2, opacity: active ? 0.9 : 0.6 });
  }

  function refresh() {
    pins.forEach((pin) => paint(pin, pin.item.open || pin.item.classList.contains("highlight")));
  }

  pins.forEach((pin) => {
    // Opening an entry (by clicking it or its pin) closes the others and flies there.
    pin.item.addEventListener("toggle", () => {
      if (pin.item.open) {
        pins.forEach((other) => { if (other !== pin) other.item.open = false; });
        map.flyTo(pin.coords, 5, { duration: 0.8 });
        pin.item.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
      refresh();
    });

    pin.marker.on("click", () => { pin.item.open = !pin.item.open; });
    pin.marker.on("mouseover", () => {
      pin.item.classList.add("highlight");
      pin.item.scrollIntoView({ behavior: "smooth", block: "nearest" });
      refresh();
    });
    pin.marker.on("mouseout", () => {
      pin.item.classList.remove("highlight");
      refresh();
    });
  });

  // Clicking empty map closes whatever is open.
  map.on("click", () => pins.forEach((pin) => { pin.item.open = false; }));
})();
