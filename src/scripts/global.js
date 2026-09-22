import gsap from "gsap";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function initLenis() {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
}

initLenis();

function floatingBox() {
  document.querySelectorAll(".js-floating-inner").forEach((el) => {
    gsap.fromTo(
      el,
      { y: -8 },
      {
        y: 8,
        duration: gsap.utils.random(1.2, 1.8),
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: gsap.utils.random(0, 2),
      },
    );
  });
}

floatingBox();

// function floatingBoxAnimation() {
//   const group = document.querySelector(".p-top-about__floating-wrapper");
//   const cards = document.querySelectorAll(".js-floating");
//   const tl = gsap.timeline({
//     scrollTrigger: {
//       trigger: group,
//       start: "top 40%",
//       end: "+=600",
//       scrub: true,
//       markers: true,
//     },
//   });
//   const cardWidth = cards[0].offsetWidth;
//   const overlap = cardWidth * 0.45; // 55% 重ねる

//   tl.to(
//     cards[0],
//     {
//       x: overlap,
//       rotation: -45,
//       duration: 0.9,
//       scale: 0.8,
//     },
//     0,
//   );

//   tl.to(
//     cards[1],
//     {
//       scale: 0.8,
//       duration: 0.9,
//     },
//     0,
//   );

//   tl.to(
//     cards[2],
//     {
//       x: -overlap,
//       rotation: 45,
//       duration: 0.9,
//       scale: 0.8,
//     },
//     0,
//   );

//   // 0.9〜1.0：束ごと落ちる
//   tl.to(
//     group,
//     {
//       y: 120,
//       opacity: 0,
//       duration: 1,
//     },
//     0,
//   );
// }

// floatingBoxAnimation();

function initMenu() {
  const menuButton = document.querySelector(".js-menu-button");
  const menu = document.querySelector(".js-menu");
  const labels = document.querySelectorAll(".menu-button__label");
  gsap.set(menu, {
    clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
  });

  let isOpen = false;

  menuButton.addEventListener("click", () => {
    if (!isOpen) {
      // Open
      gsap.to(menu, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        duration: 1,
        ease: "power4.out",
      });
    } else {
      // Close
      gsap.to(menu, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        duration: 1,
        ease: "power4.out",
      });
    }

    isOpen = !isOpen;
  });
}

initMenu();

function pixelateImage() {
  const items = document.querySelectorAll(".js-pixel");

  items.forEach((item) => {
    const canvas = item.querySelector(".js-pixel-canvas");
    const img = item.querySelector(".js-source-image");
    const ctx = canvas.getContext("2d");

    const temp = document.createElement("canvas");
    const tctx = temp.getContext("2d");

    const state = { progress: 0 };

    function render() {
      const w = (canvas.width = img.naturalWidth);
      const h = (canvas.height = img.naturalHeight);

      const pixels = 18 + (w - 18) * Math.pow(state.progress, 2.5);

      const pw = Math.max(1, Math.round(pixels));
      const ph = Math.max(1, Math.round((h / w) * pw));

      temp.width = pw;
      temp.height = ph;

      tctx.clearRect(0, 0, pw, ph);
      tctx.drawImage(img, 0, 0, pw, ph);

      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(temp, 0, 0, pw, ph, 0, 0, w, h);
    }

    if (img.complete) render();
    else img.onload = render;

    gsap.set(canvas, {
      scale: 1.1,
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: item,
        start: "top center",
        toggleActions: "play none none none",
      },
    });

    tl.to(state, {
      progress: 1,
      duration: 1.5,
      onUpdate: render,
    }).to(
      canvas,
      {
        scale: 1,
        duration: 1.5,
      },
      0,
    );
  });
}

pixelateImage();

function pixelTransition() {
  const wrapper = document.querySelector(".js-pixel-transition");

  const cols = 25;
  const rows = 6;

  // 上 → 下 の黒になる確率
  const beige = "#FEF0D5";
  const black = "#222222";
  const accent = "#F2C14E"; // 少し明るいベージュ

  const probabilities = [0.1, 0.2, 0.5, 0.7, 1, 1];
  const accentCount = 6;

  const targetCells = [];
  const accentCandidates = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cell = document.createElement("div");
      cell.className = "p-top-members__pixel-cell";
      cell.style.backgroundColor = beige;

      if (Math.random() < probabilities[row]) {
        const data = { el: cell, color: black };
        targetCells.push(data);

        // 上4段だけアクセント候補
        if (row < rows - 2) {
          accentCandidates.push(data);
        }
      }

      wrapper.appendChild(cell);
    }
  }

  // 候補から固定6個だけランダムでアクセント
  gsap.utils.shuffle(accentCandidates);

  accentCandidates.slice(0, accentCount).forEach((cell) => {
    cell.color = accent;
  });

  gsap.to(
    targetCells.map((c) => c.el),
    {
      backgroundColor: (i) => targetCells[i].color,
      duration: 0.05,
      stagger: {
        each: 0.003,
        from: "random",
      },
      ease: "none",
      scrollTrigger: {
        trigger: wrapper,
        start: "top bottom",
        end: "top 30%",
        scrub: true,
      },
    },
  );
}

pixelTransition();

function memberTitle() {
  const title = document.querySelector(".p-top-members__title .text-wrapper");
  const target = document.querySelector(".p-top-members__wrapper");
  const text = title.textContent;
  title.textContent = "";
  text
    .replace(/\s/g, "")
    .split("")
    .forEach((char, i) => {
      const span = document.createElement("span");
      span.textContent = char;
      title.appendChild(span);
    });

  gsap.set(title.querySelectorAll("span"), {
    yPercent: 100,
  });

  gsap.to(title.querySelectorAll("span"), {
    yPercent: 0,
    duration: 1.2,
    stagger: 0.05,
    ease: "power4.out",
    scrollTrigger: {
      trigger: target,
      start: "top top",
      markers: true,
    },
  });
}

ScrollTrigger.refresh();

memberTitle();
function pixelLeaveTransition() {
  const wrapper = document.querySelector(".js-pixel-leave");

  const cols = 25;
  const rows = 6;

  const beige = "#FEF0D5";
  const black = "#222222";
  const accent = "#F2C14E";

  const probabilities = [0.1, 0.2, 0.5, 0.7, 1, 1];
  const accentCount = 6;

  const targetCells = [];
  const accentCandidates = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cell = document.createElement("div");
      cell.className = "p-top-members__pixel-cell";
      cell.style.backgroundColor = black;

      if (Math.random() < probabilities[row]) {
        const data = { el: cell, color: beige };
        targetCells.push(data);

        // 上4段だけアクセント候補
        if (row < rows - 2) {
          accentCandidates.push(data);
        }
      }

      wrapper.appendChild(cell);
    }
  }

  // 候補から固定6個だけランダムでアクセント
  gsap.utils.shuffle(accentCandidates);

  accentCandidates.slice(0, accentCount).forEach((cell) => {
    cell.color = accent;
  });

  gsap.to(
    targetCells.map((c) => c.el),
    {
      backgroundColor: (i) => targetCells[i].color,
      duration: 0.05,
      stagger: {
        each: 0.003,
        from: "random",
      },
      ease: "none",
      scrollTrigger: {
        trigger: wrapper,
        start: "top bottom",
        end: "top 30%",
        scrub: true,
      },
    },
  );
}

pixelLeaveTransition();

function footerPixelTransition() {
  const wrapper = document.querySelector(".js-footer-pixel");

  const cols = 25;
  const rows = 6;

  const blue = "#0048AE";
  const beige = "#FEF0D5";
  const accent = "#6FE3FF"; // 明るめのアクセント

  const probabilities = [0, 0.1, 0.2, 0.3, 0.5, 0.9];
  const accentCount = 6;

  const targetCells = [];
  const accentCandidates = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cell = document.createElement("div");
      cell.className = "p-top-members__pixel-cell";
      cell.style.backgroundColor = blue;

      if (Math.random() < probabilities[row]) {
        const data = { el: cell, color: beige };
        targetCells.push(data);

        // 上4段だけアクセント候補
        if (row < rows - 2) {
          accentCandidates.push(data);
        }
      }

      wrapper.appendChild(cell);
    }
  }

  // 候補から固定6個だけランダムでアクセント
  gsap.utils.shuffle(accentCandidates);

  accentCandidates.slice(0, accentCount).forEach((cell) => {
    cell.color = accent;
  });

  gsap.to(
    targetCells.map((c) => c.el),
    {
      backgroundColor: (i) => targetCells[i].color,
      duration: 0.05,
      stagger: {
        each: 0.003,
        from: "random",
      },
      ease: "none",
      scrollTrigger: {
        trigger: wrapper,
        start: "top bottom",
        end: "bottom bottom",
        scrub: true,
      },
    },
  );
}

footerPixelTransition();
