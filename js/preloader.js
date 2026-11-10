/**
 * Preloader & Hero Kinetic Entrance Module
 * Pure Vanilla JavaScript · 60fps GPU Hardware Accelerated
 * Handles letters reveal, logo cycling, FLIP brand flight to navbar, and fullscreen blossom.
 */
(function () {
  "use strict";

  let scrollLocked = false;

  function lockScroll() {
    scrollLocked = true;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
  }

  function unlockScroll() {
    scrollLocked = false;
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
  }

  try {
    history.scrollRestoration = "manual";
  } catch (e) {}

  window.scrollTo(0, 0);

  // Safety fallback: Guarantee scrolling unlocks even if an asset fails to load
  setTimeout(unlockScroll, 3800);

  function initHeroPreloader() {
    const container = document.querySelector(".willem-header");
    if (!container) {
      revealHeroDirectly();
      return;
    }

    const loader = container.querySelector(".willem-loader");
    const box = container.querySelector(".willem-loader__box");
    const growingImage = container.querySelector(".willem__growing-image");
    const headingStart = container.querySelectorAll(".willem__h1-start .willem__letter");
    const headingEnd = container.querySelectorAll(".willem__h1-end .willem__letter");
    const img1 = container.querySelector(".willem__cover-image-extra.is--1");
    const img2 = container.querySelector(".willem__cover-image-extra.is--2");
    const img3 = container.querySelector(".willem__cover-image-extra.is--3");
    const heroCard = container.querySelector(".willem__card-hero.is--4");
    const loaderLogo = heroCard ? heroCard.querySelector("#loader-brand-logo") : null;
    const heroSection = container.querySelector(".hero--silhouette") || container.querySelector(".hero");
    const desktopNav = document.querySelector(".willen-nav") || document.querySelector(".site-header");
    const navLogo = desktopNav ? desktopNav.querySelector(".header__brand-logo") : null;

    lockScroll();
    container.classList.remove("is--hidden");

    if (navLogo) navLogo.style.opacity = "0";

    // Step 1: Slide letters of 'creat' and 'ivity' up
    const allLetters = [...headingStart, ...headingEnd];
    allLetters.forEach((letter, i) => {
      letter.style.display = "inline-block";
      letter.style.transform = "translateY(110%)";
      letter.style.transition = "transform 0.85s cubic-bezier(0.16, 1, 0.3, 1)";
      setTimeout(() => {
        letter.style.transform = "translateY(0%)";
      }, 50 + i * 25);
    });

    // Step 2: Expand center cutout box to 16:9 ratio
    if (box) {
      box.style.width = "0px";
      box.style.transition = "width 0.9s cubic-bezier(0.65, 0, 0.35, 1)";
      if (growingImage) {
        growingImage.style.width = "0%";
        growingImage.style.transition = "width 0.9s cubic-bezier(0.65, 0, 0.35, 1)";
      }

      setTimeout(() => {
        const h = box.offsetHeight || 80;
        const maxAllowed = Math.round(window.innerWidth * 0.8);
        const targetW = Math.min(Math.round((h * 16) / 9), maxAllowed);
        box.style.width = `${targetW}px`;
        if (growingImage) growingImage.style.width = "100%";
      }, 180);
    }

    // Step 3: Cycle Logos (Gemini -> Claude -> GitHub -> Brand Logo)
    if (img1) {
      img1.style.opacity = "1";
      img1.style.transform = "scale(1)";
      img1.style.transition = "opacity 0.28s ease, transform 0.32s cubic-bezier(0.16, 1, 0.3, 1)";
    }
    if (img2) {
      img2.style.opacity = "0";
      img2.style.transform = "scale(0.85)";
      img2.style.transition = "opacity 0.28s ease, transform 0.32s cubic-bezier(0.16, 1, 0.3, 1)";
    }
    if (img3) {
      img3.style.opacity = "0";
      img3.style.transform = "scale(0.85)";
      img3.style.transition = "opacity 0.28s ease, transform 0.32s cubic-bezier(0.16, 1, 0.3, 1)";
    }
    if (heroCard) {
      heroCard.style.opacity = "0";
      heroCard.style.transform = "scale(0.85)";
      heroCard.style.transition = "opacity 0.32s ease, transform 0.36s cubic-bezier(0.16, 1, 0.3, 1)";
    }

    // Transition 1: Gemini -> Claude
    setTimeout(() => {
      if (img1) {
        img1.style.opacity = "0";
        img1.style.transform = "scale(0.85)";
      }
      if (img2) {
        img2.style.opacity = "1";
        img2.style.transform = "scale(1)";
      }
    }, 950);

    // Transition 2: Claude -> GitHub
    setTimeout(() => {
      if (img2) {
        img2.style.opacity = "0";
        img2.style.transform = "scale(0.85)";
      }
      if (img3) {
        img3.style.opacity = "1";
        img3.style.transform = "scale(1)";
      }
    }, 1550);

    // Transition 3: GitHub -> Brand Logo
    setTimeout(() => {
      if (img3) {
        img3.style.opacity = "0";
        img3.style.transform = "scale(0.85)";
      }
      if (heroCard) {
        heroCard.style.opacity = "1";
        heroCard.style.transform = "scale(1)";
      }
    }, 2150);

    // Step 4: Fullscreen Blossom & Brand Logo Flight to Navbar
    setTimeout(() => {
      triggerBlossomAndFlight();
    }, 2750);

    function triggerBlossomAndFlight() {
      if (!heroSection) {
        unlockScroll();
        return;
      }

      const boxRect = box ? box.getBoundingClientRect() : { top: window.innerHeight * 0.45, left: window.innerWidth * 0.45, right: window.innerWidth * 0.55, bottom: window.innerHeight * 0.55 };
      const top = Math.max(0, Math.round(boxRect.top));
      const left = Math.max(0, Math.round(boxRect.left));
      const right = Math.max(0, Math.round(window.innerWidth - boxRect.right));
      const bottom = Math.max(0, Math.round(window.innerHeight - boxRect.bottom));

      // 4A. Reveal header in place
      if (desktopNav) {
        desktopNav.classList.add("is-visible");
        desktopNav.style.transform = "none";
        desktopNav.style.opacity = "1";
        desktopNav.style.transition = "opacity 0.65s ease";

        const navAnim = desktopNav.querySelectorAll(".nav-anim");
        navAnim.forEach((item) => {
          item.style.opacity = "1";
          item.style.transform = "none";
        });
      }

      // 4B. GPU FLIP flight: Logo glides from cutout box directly into header logo
      if (loaderLogo && navLogo) {
        navLogo.style.opacity = "0";

        const startRect = loaderLogo.getBoundingClientRect();
        const targetRect = navLogo.getBoundingClientRect();

        const targetW = targetRect.width || 42;
        const targetH = targetRect.height || 42;
        const targetX = targetRect.width ? targetRect.left : (window.innerWidth <= 768 ? 24 : 48);
        const targetY = targetRect.height ? targetRect.top : (window.innerWidth <= 768 ? 16 : 24);

        const startW = startRect.width || targetW;
        const startH = startRect.height || targetH;
        const startX = startRect.left;
        const startY = startRect.top;

        const flyingLogo = document.createElement("img");
        flyingLogo.src = "assets/images/logo.svg";
        flyingLogo.alt = "Samnun Murtayes Logo";
        flyingLogo.className = "willem__flying-logo";
        flyingLogo.style.cssText = `
          position: fixed;
          left: ${targetX}px;
          top: ${targetY}px;
          width: ${targetW}px;
          height: ${targetH}px;
          z-index: 100002;
          pointer-events: none;
          object-fit: contain;
          transform-origin: top left;
          will-change: transform;
        `;

        const dx = startX - targetX;
        const dy = startY - targetY;
        const scaleX = startW / targetW;
        const scaleY = startH / targetH;

        flyingLogo.style.transform = `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0px) scale(${scaleX.toFixed(3)}, ${scaleY.toFixed(3)})`;
        flyingLogo.style.transition = "none";

        document.body.appendChild(flyingLogo);
        loaderLogo.style.opacity = "0";

        flyingLogo.offsetHeight; // force reflow

        requestAnimationFrame(() => {
          flyingLogo.style.transition = "transform 1.15s cubic-bezier(0.16, 1, 0.3, 1)";
          flyingLogo.style.transform = "translate3d(0px, 0px, 0px) scale(1, 1)";
        });

        setTimeout(() => {
          navLogo.style.opacity = "1";
          flyingLogo.remove();
        }, 1180);
      } else if (navLogo) {
        navLogo.style.opacity = "1";
      }

      // 4C. Expand hero clip-path full screen
      heroSection.classList.add("is-active");
      heroSection.style.clipPath = `inset(${top}px ${right}px ${bottom}px ${left}px)`;
      heroSection.style.opacity = "1";
      heroSection.style.transition = "clip-path 1.25s cubic-bezier(0.16, 1, 0.3, 1)";

      requestAnimationFrame(() => {
        heroSection.style.clipPath = "inset(0px 0px 0px 0px)";
      });

      // 4D. Slide up & fade out 'creat' and 'ivity'
      allLetters.forEach((letter) => {
        letter.style.transition = "all 0.55s ease";
        letter.style.transform = "translateY(-30px)";
        letter.style.opacity = "0";
      });

      // 4E. Stagger in Samnun Murtayes typography & silhouette hero content
      const silhouetteLines = heroSection.querySelectorAll(".hero-silhouette__title-line");
      silhouetteLines.forEach((line, idx) => {
        setTimeout(() => {
          line.style.opacity = "1";
          line.style.transform = "translateY(0)";
        }, 220 + idx * 120);
      });

      const silhouetteSubtitle = heroSection.querySelector(".hero-silhouette__subtitle");
      if (silhouetteSubtitle) {
        setTimeout(() => {
          silhouetteSubtitle.style.opacity = "1";
          silhouetteSubtitle.style.transform = "translateY(0)";
        }, 460);
      }

      const interactiveDock = heroSection.querySelector(".hero-silhouette__interactive-dock") || heroSection.querySelector(".hero-silhouette__tags");
      if (interactiveDock) {
        setTimeout(() => {
          interactiveDock.style.opacity = "1";
          interactiveDock.style.transform = "translateY(0)";
        }, 580);
      }

      // 4F. Reveal statement and metadata
      const heroReveals = heroSection.querySelectorAll("[data-reveal]");
      heroReveals.forEach((el, idx) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(24px)";
        el.style.transition = "opacity 0.85s ease, transform 0.85s cubic-bezier(0.16, 1, 0.3, 1)";
        setTimeout(() => {
          el.style.opacity = "1";
          el.style.transform = "translateY(0px)";
        }, 350 + idx * 100);
      });

      // Cleanup preloader container and unlock scroll
      setTimeout(() => {
        heroSection.style.clipPath = "";
        if (loader) loader.style.display = "none";
        unlockScroll();
        if (window.updateNavTheme) window.updateNavTheme();
      }, 1300);
    }
  }

  function revealHeroDirectly() {
    unlockScroll();
    const heroSection = document.querySelector(".hero--silhouette") || document.querySelector(".hero");
    if (heroSection) {
      heroSection.classList.add("is-active");
      heroSection.style.opacity = "1";
      heroSection.style.clipPath = "";
      const silhouetteLines = heroSection.querySelectorAll(".hero-silhouette__title-line");
      silhouetteLines.forEach((l) => {
        l.style.opacity = "1";
        l.style.transform = "none";
      });
      const silhouetteSubtitle = heroSection.querySelector(".hero-silhouette__subtitle");
      if (silhouetteSubtitle) {
        silhouetteSubtitle.style.opacity = "1";
        silhouetteSubtitle.style.transform = "none";
      }
      const interactiveDock = heroSection.querySelector(".hero-silhouette__interactive-dock") || heroSection.querySelector(".hero-silhouette__tags");
      if (interactiveDock) {
        interactiveDock.style.opacity = "1";
        interactiveDock.style.transform = "none";
      }
      const heroReveals = heroSection.querySelectorAll("[data-reveal]");
      heroReveals.forEach((r) => {
        r.style.opacity = "1";
        r.style.transform = "none";
      });
    }
    const desktopNav = document.querySelector(".site-header") || document.querySelector(".willen-nav");
    if (desktopNav) {
      desktopNav.classList.add("is-visible");
      desktopNav.style.opacity = "1";
      desktopNav.style.transform = "none";
    }
  }

  window.initHeroPreloader = initHeroPreloader;
  window.lockScroll = lockScroll;
  window.unlockScroll = unlockScroll;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHeroPreloader);
  } else {
    initHeroPreloader();
  }
})();
