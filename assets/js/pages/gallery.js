(function () {
  function openPopup(item) {
    const popup = document.getElementById("popup");
    const popupTitle = document.getElementById("popupTitle");
    const popupAuthor = document.getElementById("popupAuthor");
    const popupPreview = document.getElementById("popupPreview");
    const downloadLink = document.getElementById("downloadLink");

    popupTitle.textContent = item.title;
    popupAuthor.textContent = `Created by ${item.author}`;
    popupPreview.innerHTML = "";

    const img = document.createElement("img");
    img.src = item.thumbnail;
    popupPreview.appendChild(img);

    if (item.downloadable === "true") {
      downloadLink.style.display = "inline-block";
      downloadLink.href = item.file;
      const ext = item.file.split(".").pop().toLowerCase();
      const cleanName = item.title.replace(/\s+/g, "_");
      downloadLink.download = `${cleanName}.${ext}`;
    } else {
      downloadLink.style.display = "none";
    }

    popup.classList.add("active");
  }

  function closePopup() {
    document.getElementById("popup").classList.remove("active");
  }

  document.querySelectorAll(".poster").forEach((poster) => {
    poster.addEventListener("click", () => {
      openPopup(poster.dataset);
    });
  });

  document.getElementById("closePopup").addEventListener("click", closePopup);
  document.getElementById("popup").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) {
      closePopup();
    }
  });
})();
