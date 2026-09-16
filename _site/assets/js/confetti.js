(function () {
  const confettiTargets = document.querySelectorAll(".has-confetti");
  if (!confettiTargets.length) {
    return;
  }

  const confettiColors = [
    "var(--accent-1)",
    "var(--accent-2)",
    "var(--accent-3)",
    "var(--accent-4)",
    "var(--accent-5)",
    "var(--accent-6)"
  ];

  function launchConfetti(container) {
    const count = 25;

    for (let i = 0; i < count; i += 1) {
      const piece = document.createElement("div");
      piece.className = "confetti-piece";
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.top = `${Math.random() * 20}%`;
      piece.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      piece.style.animationDelay = `${Math.random() * 0.2}s`;
      container.appendChild(piece);
      piece.addEventListener("animationend", () => piece.remove());
    }
  }

  confettiTargets.forEach((el) => {
    let confetti = el.querySelector(".confetti");
    if (!confetti) {
      confetti = document.createElement("div");
      confetti.className = "confetti";
      el.appendChild(confetti);
    }

    if (!el.style.position) {
      el.style.position = "relative";
    }

    el.addEventListener("mouseenter", () => launchConfetti(confetti));
  });

  window.addEventListener("load", () => {
    confettiTargets.forEach((el) => {
      const confetti = el.querySelector(".confetti");
      if (confetti) {
        launchConfetti(confetti);
      }
    });
  });
})();
