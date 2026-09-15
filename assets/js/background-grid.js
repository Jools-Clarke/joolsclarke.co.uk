(function () {
  const svgSources = [
    { src: "https://raw.githubusercontent.com/Jools-Clarke/joolsclarke.co.uk/refs/heads/main/ligo.svg", size: 90 },
    { src: "https://raw.githubusercontent.com/Jools-Clarke/joolsclarke.co.uk/refs/heads/main/desi.svg", size: 40 },
    { src: "https://raw.githubusercontent.com/Jools-Clarke/joolsclarke.co.uk/refs/heads/main/juice.svg", size: 70 },
    { src: "https://raw.githubusercontent.com/Jools-Clarke/joolsclarke.co.uk/refs/heads/main/ariel.svg", size: 50 }
  ];

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  document.querySelectorAll(".background-grid").forEach((grid) => {
    const total = Number(grid.dataset.bgTotal || 800);
    const sources = svgSources.slice();

    for (let i = 0; i < total; i += 1) {
      if (i % sources.length === 0) {
        shuffle(sources);
      }

      const { src, size } = sources[i % sources.length];
      const img = document.createElement("img");
      img.src = src;
      img.className = "bg-svg";
      img.style.width = `${size}px`;
      img.alt = "";
      grid.appendChild(img);
    }
  });
})();
