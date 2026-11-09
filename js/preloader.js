/**
 * Preloader & Hero Kinetic Entrance Module
 * Handles scroll lock, letters reveal, logo cycling, and fullscreen blossom
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
    const heroCard = container.querySelector(".willem__card-hero.is--4");
    const loaderLogo = heroCard ? heroCard.querySelector("#loader-brand-logo") : null;
    const heroSection = container.querySelector(".hero--silhouette") || container.querySelector(".hero--wilcock") || container.querySelector(".hero");
    const desktopNav = document.querySelector(".willen-nav");
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

    // Step 2: Expand center cutout box to 16:9 ratio with brand logo ready
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

    if (heroCard) {
      heroCard.style.opacity = "1";
      heroCard.style.transform = "scale(1)";
    }

    // Step 3: Fullscreen Blossom & Brand Logo Flight directly to Navbar
    setTimeout(() => {
      triggerBlossomAndFlight();
    }, 1150);

    function triggerBlossomAndFlight() {
      if (!heroSection) return;

      const boxRect = box ? box.getBoundingClientRect() : { top: window.innerHeight * 0.45, left: window.innerWidth * 0.45, right: window.innerWidth * 0.55, bottom: window.innerHeight * 0.55 };
      const top = Math.max(0, Math.round(boxRect.top));
      const left = Math.max(0, Math.round(boxRect.left));
      const right = Math.max(0, Math.round(window.innerWidth - boxRect.right));
      const bottom = Math.max(0, Math.round(window.innerHeight - boxRect.bottom));

      // 4A. Reveal header in place so destination coordinates are rock-solid
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

      // 4B. Butter-smooth GPU FLIP flight: Logo glides from cutout box directly into header logo
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

        // Create flying logo pinned to target coordinates, transformed from start
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

        // Invert to start position
        flyingLogo.style.transform = `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0px) scale(${scaleX.toFixed(3)}, ${scaleY.toFixed(3)})`;
        flyingLogo.style.transition = "none";

        document.body.appendChild(flyingLogo);
        loaderLogo.style.opacity = "0";

        // Force synchronous reflow so starting state is guaranteed committed
        flyingLogo.offsetHeight;

        // Play: Hardware-accelerated GPU curve
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

      // 4D. Slide up & fade out "creat" and "ivity"
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

      // Legacy fallback for pixel glyphs
      const pixelGlyphs = heroSection.querySelectorAll(".pixel-glyph");
      pixelGlyphs.forEach((glyph, idx) => {
        glyph.style.display = "inline-block";
        glyph.style.transform = "translateY(115%)";
        glyph.style.opacity = "0";
        glyph.style.transition = "transform 0.85s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.85s ease";

        setTimeout(() => {
          glyph.style.transform = "translateY(0%)";
          glyph.style.opacity = "1";
        }, 220 + idx * 30);
      });

      // 4F. Reveal statement, metadata, LinkedIn badge, and scroll gauge
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

      const inBadge = heroSection.querySelector(".hero-editorial__linkedin-badge");
      if (inBadge) {
        inBadge.style.opacity = "0";
        inBadge.style.transform = "scale(0.75)";
        inBadge.style.transition = "all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
        setTimeout(() => {
          inBadge.style.opacity = "1";
          inBadge.style.transform = "scale(1)";
        }, 700);
      }

      const scrollGauge = heroSection.querySelector(".hero-scroll-gauge");
      if (scrollGauge) {
        scrollGauge.style.opacity = "0";
        scrollGauge.style.transform = "translateX(20px)";
        scrollGauge.style.transition = "opacity 0.8s ease, transform 0.8s ease";
        setTimeout(() => {
          scrollGauge.style.opacity = "1";
          scrollGauge.style.transform = "translateX(0px)";
        }, 500);
      }

      const boldNav = document.querySelector(".bold-nav-full");
      if (boldNav) boldNav.classList.add("is-visible");

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
    const heroSection = document.querySelector(".hero--silhouette") || document.querySelector(".hero--wilcock") || document.querySelector(".hero");
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
      const pixelGlyphs = heroSection.querySelectorAll(".pixel-glyph");
      pixelGlyphs.forEach((g) => {
        g.style.opacity = "1";
        g.style.transform = "none";
      });
      const heroReveals = heroSection.querySelectorAll("[data-reveal]");
      heroReveals.forEach((r) => {
        r.style.opacity = "1";
        r.style.transform = "none";
      });
    }
    const desktopNav = document.querySelector(".willen-nav");
    if (desktopNav) {
      desktopNav.classList.add("is-visible");
      desktopNav.style.opacity = "1";
      desktopNav.style.transform = "none";
    }
    const boldNav = document.querySelector(".bold-nav-full");
    if (boldNav) boldNav.classList.add("is-visible");
  }

  window.initHeroPreloader = initHeroPreloader;
  window.lockScroll = lockScroll;
  window.unlockScroll = unlockScroll;
})();
