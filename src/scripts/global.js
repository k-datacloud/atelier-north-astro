import gsap from "gsap";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(ScrollToPlugin);

let lenis;
function initLenis() {
  lenis = new Lenis({
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

function displayHeader() {
  const header = document.querySelector(".js-header");
  const items = header.querySelectorAll(".header__item");

  let isHidden = false;

  const getHideY = () => {
    const top = parseFloat(getComputedStyle(header).top);
    return -(header.offsetHeight + top + 8); // 少し余裕を持たせる
  };

  ScrollTrigger.create({
    start: 0,
    end: "max",
    onUpdate: (self) => {
      if (self.direction === 1 && !isHidden) {
        isHidden = true;

        gsap.to(header, {
          y: getHideY(),
          duration: 0.45,
          ease: "power3.inOut",
        });
      }

      if (self.direction === -1 && isHidden) {
        isHidden = false;

        gsap.set(items, {
          y: -50,
        });

        const tl = gsap.timeline();

        tl.to(header, {
          y: 0,
          duration: 0.45,
          ease: "power3.out",
        }).to(
          items,
          {
            y: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "power3.out",
          },
          "<",
        );
      }
    },
  });
}

displayHeader();

function headerHover() {
  const target = document.querySelectorAll(".header__item-link");
  const headerItemDefault = document.querySelectorAll(
    ".header__item-label--default",
  );
  const headerItemClone = document.querySelectorAll(
    ".header__item-label--clone",
  );

  gsap.set(headerItemClone, {
    rotate: 28,
    y: "100%",
    transformOrigin: "left center",
  });

  target.forEach((el, i) => {
    el.addEventListener("mouseenter", () => {
      gsap.to(headerItemClone[i], {
        rotate: 0,
        y: "0%",
        duration: 0.6,
        ease: "power4.out",
      });
      gsap.to(headerItemDefault[i], {
        scale: 0,
        duration: 0.6,
        ease: "power4.out",
      });
    });
    el.addEventListener("mouseleave", () => {
      gsap.to(headerItemClone[i], {
        rotate: 28,
        y: "100%",
        duration: 0.6,
        ease: "power4.out",
      });
      gsap.to(headerItemDefault[i], {
        scale: 1,
        duration: 0.6,
        ease: "power4.out",
      });
    });
  });
}

headerHover();

function fvTitle() {
  const target = document.querySelector(".fv__title .text-wrapper");
  const nodes = [...target.childNodes];
  target.textContent = "";
  nodes.forEach((node) => {
    if (node.nodeName === "BR") return target.appendChild(node);
    [...node.textContent.replace(/\s/g, "")].forEach((char) => {
      const span = document.createElement("span");
      span.textContent = char;
      target.appendChild(span);
    });
  });
  const span = document.querySelectorAll(".fv__title .text-wrapper span");
  gsap.set(span, {
    scaleY: 0,
    display: "inline-block",
    transformOrigin: "bottom center",
  });

  gsap.to(span, {
    scaleY: 1,
    duration: 1.2,
    ease: "power4.out",
    stagger: {
      each: 0.05,
      from: "random",
    },
  });
}

fvTitle();

function aboutTitle() {
  const target = document.querySelectorAll(".p-top-about__title .text-wrapper");

  gsap.set(target[1], {
    clipPath: "polygon(0% 0%, 0% 0%, 0 100%, 0 100%)",
  });

  gsap.to(target[1], {
    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0 100%)",
    ease: "none",
    scrollTrigger: {
      trigger: ".p-top-about__title",
      start: "top 80%",
      end: "top 20%",
      scrub: 1.5,
    },
  });
}

aboutTitle();

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

let isMenuOpen = false;
let openTl;
let closeTl;

function initMenu() {
  const menuButton = document.querySelector(".js-menu-button");
  const menuButtonWrapper = document.querySelectorAll(".menu-button__button");
  const menuoverlay = document.querySelector(".js-menu");
  const menu = document.querySelector(".js-menu div");
  const open = document.querySelectorAll(".menu-button__label--open");
  const close = document.querySelectorAll(".menu-button__label--close");
  const menuItems = menu.querySelectorAll(".text-wrapper span");

  gsap.set(menuoverlay, {
    opacity: 0,
    pointerEvents: "none",
  });
  gsap.set(menu, {
    opacity: 0,
    rotate: -28,
    transformOrigin: "left top",
  });
  gsap.set(open, {
    yPercent: 0,
  });
  gsap.set(close, {
    yPercent: 100,
  });
  gsap.set(menuButtonWrapper, {
    backgroundColor: "transparent",
  });
  gsap.set(menuItems, {
    display: "inline-block",
    yPercent: 100,
  });

  openTl = gsap.timeline({ paused: true });
  closeTl = gsap.timeline({ paused: true });

  openTl
    .to(menuoverlay, {
      opacity: 1,
      pointerEvents: "all",
      duration: 1,
      ease: "power4.out",
    })
    .to(
      menu,
      {
        opacity: 1,
        rotate: 0,
        duration: 1,
        ease: "power4.out",
      },
      0,
    )
    .to(
      open,
      {
        yPercent: -100,
        duration: 1,
        ease: "power4.out",
      },
      0,
    )
    .to(
      close,
      {
        yPercent: 0,
        duration: 1,
        ease: "power4.out",
      },
      0,
    )
    .to(
      menuButtonWrapper,
      {
        backgroundColor: "#0048AE",
        color: "#FEF0D5",
        duration: 1,
        ease: "power4.out",
      },
      0,
    )
    .to(
      menuItems,
      {
        yPercent: 0,
        duration: 1,
        ease: "power4.out",
        stagger: 0.1,
      },
      0,
    );

  closeTl
    .to(
      open,
      {
        yPercent: 0,
        duration: 1,
        ease: "power4.out",
      },
      0,
    )
    .to(
      menuButtonWrapper,
      {
        backgroundColor: "transparent",
        color: "#0048AE",
        duration: 1,
        ease: "power4.out",
      },
      0,
    )
    .to(
      close,
      {
        yPercent: 100,
        duration: 1,
        ease: "power4.out",
      },
      0,
    )
    .to(
      menu,
      {
        opacity: 0,
        rotate: -28,
        duration: 1,
        ease: "power4.out",
      },
      0,
    )
    .to(
      menuoverlay,
      {
        opacity: 0,
        pointerEvents: "none",
        duration: 1,
        ease: "power4.out",
      },
      0,
    );

  menuButton.addEventListener("click", () => {
    isMenuOpen = !isMenuOpen;
    if (isMenuOpen) {
      lenis.stop();
      openTl.restart();
    } else {
      closeTl.restart();
      closeTl.eventCallback("onComplete", () => {
        lenis.start();
        closeTl.eventCallback("onComplete", null);
      });
    }
  });
}

initMenu();

function projectTitle() {
  const items = document.querySelectorAll(
    ".p-top-projects__title .text-wrapper span",
  );
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".p-top-projects__title",
      start: "top 65%",
    },
  });

  gsap.set([items[1], items[3]], {
    y: "100%",
  });

  tl.to([items[1], items[3]], {
    y: "0%",
    duration: 1.5,
    ease: "power3.out",
    stagger: 0.3,
  }).to(
    [items[0], items[2]],
    {
      y: "-100%",
      duration: 1.5,
      stagger: 0.3,
      ease: "power3.out",
    },
    "<",
  );
}

projectTitle();

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
        end: "top 20%",
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
      markers: false,
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
        end: "top 20%",
        scrub: true,
      },
    },
  );
}

pixelLeaveTransition();

function footerTitle() {
  const title = document.querySelector(".footer__title .text-wrapper");
  const nodes = [...title.childNodes];
  title.textContent = "";
  nodes.forEach((node) => {
    if (node.nodeName === "BR") return title.appendChild(node);
    [...node.textContent.replace(/\s+/g, " ").trim()].forEach((char) => {
      const span = document.createElement("span");
      span.textContent = char === " " ? "\u00A0" : char;
      title.appendChild(span);
    });
  });
  const span = title.querySelectorAll("span");
  gsap.set(span, {
    scaleY: 0,
    transformOrigin: "top center",
  });

  gsap.to(span, {
    scaleY: 1,
    duration: 1.5,
    ease: "power3.out",
    stagger: {
      each: 0.05,
      from: "random",
    },
    scrollTrigger: {
      trigger: title,
      start: "top 80%",
    },
  });
}

footerTitle();

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

function smoothScroll() {
  const target = document.querySelectorAll(".js-smooth-scroll");

  target.forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();

      const href = el.getAttribute("href");

      if (isMenuOpen) {
        isMenuOpen = false;

        lenis.start();
        closeTl.restart();

        gsap.to(window, {
          scrollTo: href,
          duration: 1,
          ease: "power2.out",
        });
      } else {
        gsap.to(window, {
          scrollTo: href,
          duration: 1,
          ease: "power2.out",
        });
      }
    });
  });
}

smoothScroll();

function backTop() {
  const backTop = document.querySelector(".js-back-to-top");
  backTop.addEventListener("click", (e) => {
    e.preventDefault();
    gsap.to(window, {
      scrollTo: 0,
      duration: 2,
      ease: "power2.inOut",
    });
  });
}

backTop();
