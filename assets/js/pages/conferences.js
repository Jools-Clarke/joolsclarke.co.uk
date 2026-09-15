(function () {
  const dataEl = document.getElementById("conferences-data");
  if (!dataEl || typeof L === "undefined") {
    return;
  }

  const places = JSON.parse(dataEl.textContent);
  const map = L.map("map", { preferCanvas: true, zoomControl: true }).setView([50, 10], 4);

  const lightTiles = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  });

  function setMapTheme() {
    if (!map.hasLayer(lightTiles)) {
      map.addLayer(lightTiles);
    }
  }

  setMapTheme();

  const london = [51.5074, -0.1278];
  const listContainer = document.getElementById("confList");
  const markers = {};
  let selectedId = null;

  L.circleMarker(london, {
    radius: 8,
    color: "#aaaaaa",
    fillColor: "#aaaaa",
    fillOpacity: 1
  }).addTo(map).bindPopup("<b>London (Home Base)</b>");

  function createArc(from, to, curvature = 0.5) {
    const latlngs = [];
    const lat1 = from[0];
    const lon1 = from[1];
    const lat2 = to[0];
    const lon2 = to[1];

    const midLat = (lat1 + lat2) / 2;
    const midLon = (lon1 + lon2) / 2;

    const dx = lon2 - lon1;
    const dy = lat2 - lat1;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const radius = dist * curvature;

    const controlLat = midLat + Math.abs(radius);
    const controlLon = midLon;

    const steps = 100;
    for (let t = 0; t <= 1; t += 1 / steps) {
      const x = (1 - t) * (1 - t) * lon1 + 2 * (1 - t) * t * controlLon + t * t * lon2;
      const y = (1 - t) * (1 - t) * lat1 + 2 * (1 - t) * t * controlLat + t * t * lat2;
      latlngs.push([y, x]);
    }

    return L.polyline(latlngs, { color: "#cb4b16", weight: 2, opacity: 0.5 });
  }

  function applyStyles(id, active) {
    Object.values(markers).forEach((o) => {
      o.marker.setStyle({ color: "#cb4b16", fillColor: "#cb4b16" });
      o.line.setStyle({ color: "#cb4b16", weight: 2, opacity: 0.7 });
      o.div.classList.remove("active");
    });

    if (active) {
      const obj = markers[id];
      obj.marker.setStyle({ color: "#859900", fillColor: "#859900" });
      obj.line.setStyle({ color: "#859900", weight: 4, opacity: 0.9 });
      obj.div.classList.add("active");
    }
  }

  function clearSelection() {
    Object.values(markers).forEach((o) => {
      o.isOpen = false;
      o.div.classList.remove("active");
      o.marker.setStyle({ color: "#cb4b16", fillColor: "#cb4b16" });
      o.line.setStyle({ color: "#cb4b16", weight: 2, opacity: 0.7 });
    });

    selectedId = null;
    map.closePopup();
  }

  function restoreSelection() {
    if (selectedId) {
      applyStyles(selectedId, true);
    } else {
      clearSelection();
    }
  }

  function scrollToItem(id) {
    markers[id].div.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function toggleConference(id) {
    const obj = markers[id];
    const wasOpen = obj.isOpen;
    clearSelection();

    if (!wasOpen) {
      obj.isOpen = true;
      selectedId = id;
      applyStyles(id, true);
      obj.div.classList.add("active");
      scrollToItem(id);
      map.setView(obj.marker.getLatLng(), 5, { animate: true });
      map.openPopup(obj.marker.popup, obj.marker.getLatLng());
    } else {
      selectedId = null;
    }
  }

  places.forEach((p) => {
    const div = document.createElement("div");
    div.className = "conf-item";
    div.id = `item-${p.id}`;
    div.innerHTML = `<strong>${p.name}</strong>\n<div class="conf-details"><img src="${p.img}" alt=""><p>${p.desc}</p></div>`;
    listContainer.appendChild(div);

    const marker = L.circleMarker(p.coords, {
      radius: 8,
      color: "#cb4b16",
      fillColor: "#cb4b16",
      fillOpacity: 0.9
    }).addTo(map);

    marker.popup = L.popup({ closeButton: false, autoClose: true }).setContent(`<b>${p.name}</b>`);

    const line = createArc(london, p.coords, 0.2).addTo(map);

    markers[p.id] = { marker, div, line, isOpen: false };

    marker.on("mouseover", () => {
      map.openPopup(marker.popup, p.coords);
      applyStyles(p.id, true);
      scrollToItem(p.id);
    });

    marker.on("mouseout", () => {
      map.closePopup();
      restoreSelection();
    });

    marker.on("click", () => toggleConference(p.id));
    div.addEventListener("click", () => toggleConference(p.id));
  });

  map.on("click", (e) => {
    if (!e.originalEvent.target.closest(".leaflet-interactive")) {
      clearSelection();
    }
  });

  document.addEventListener("theme-changed", () => {
    setMapTheme();
  });

  if (window.matchMedia) {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
      if (!localStorage.getItem("theme")) {
        setMapTheme();
      }
    });
  }
})();
