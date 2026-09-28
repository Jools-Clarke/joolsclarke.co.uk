// /ariel/gallery/: clicking a preview opens it bigger in a pop-up, with the
// same caption and download link. Without this script the preview link just
// opens the image on its own.
(function () {
  "use strict";

  const viewer = document.getElementById("viewer");
  if (!viewer || typeof viewer.showModal !== "function") return;

  const image = viewer.querySelector("img");
  const caption = viewer.querySelector(".viewer-caption");

  document.querySelectorAll(".poster").forEach((poster) => {
    poster.querySelector(".poster-preview").addEventListener("click", (event) => {
      event.preventDefault();
      const preview = poster.querySelector("img");
      image.src = preview.currentSrc || preview.src;
      image.alt = preview.alt;
      caption.innerHTML = poster.querySelector("figcaption").innerHTML;
      viewer.showModal();
    });
  });

  // Click outside the picture to close (Esc and ✖ work too).
  viewer.addEventListener("click", (event) => {
    if (event.target === viewer) viewer.close();
  });
})();
