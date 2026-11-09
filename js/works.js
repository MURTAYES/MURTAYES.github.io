/**
 * ==========================================================================
 * SELECTED WORK: EDITORIAL ASYMMETRICAL DESK & MACOS GENIE CONTROLLER
 * Apple macOS Genie Minimize Transition & 3D Interactive Physical Folders
 * Zero Frameworks · Zero CDNs · 60fps Hardware Accelerated
 * ==========================================================================
 */

(function () {
  "use strict";

  // Comprehensive Case Study Catalog for the 3 Asymmetric Folders
  const CASE_STUDIES = {
    "fintech": {
      id: "fintech",
      nextId: "webgl",
      number: "01",
      category: "SaaS Products",
      client: "Acme Corp",
      title: "FinTech Dashboard",
      tags: ["SaaS", "React", "TypeScript", "Decimal128", "PostgreSQL"],
      image: "assets/images/appykit.jpg",
      imageAlt: "FinTech Dashboard High-Throughput POS Terminal Interface",
      role: "Lead Full-Stack Architect",
      timeline: "4 Months",
      year: "2024",
      team: "3 Engineers, 1 Designer",
      challenge: "Legacy point-of-sale systems suffered from 300ms+ round-trip latencies, frequent floating-point calculation drift on multi-currency transactions, and catastrophic transaction loss during retail network drops.",
      solution: "Engineered a client-first POS engine running Decimal128 dual-entry financial journals directly in IndexedDB. Coupled with a background Web Worker synchronization queue, transactions settle locally in under 35ms and stream to PostgreSQL when connectivity resumes.",
      outcome: "Processed 2.4M transactions with 0% data loss, sub-40ms terminal response times, and 99.99% system availability during Black Friday peak retail volumes."
    },
    "webgl": {
      id: "webgl",
      nextId: "brand",
      number: "02",
      category: "Interactive Experiments",
      client: "Nova Labs",
      title: "WebGL Data Vis",
      tags: ["Three.js", "Canvas", "GLSL Shaders", "Web Audio API"],
      image: "assets/images/pharma.jpg",
      imageAlt: "WebGL 100,000 Particle Topological Soundscape Visualization",
      role: "Creative Technologist",
      timeline: "2 Months",
      year: "2024",
      team: "Solo Research",
      challenge: "Visualizing 100,000+ multidimensional data nodes simultaneously in standard desktop browsers caused massive main-thread lockups, dropping frame rates to single digits and freezing UI controls.",
      solution: "Developed a bespoke WebGL 2.0 visualization engine using custom GLSL GPGPU vertex compute shaders and instanced geometry. Dynamic spatial indexing algorithms partition node clusters across GPU texture buffers, enabling 60fps topological exploration and real-time audio FFT sync.",
      outcome: "Maintained sustained 60fps rendering across 100,000 particles on low-power laptop GPUs, with a lightweight zero-dependency footprint of only 14KB gzip."
    },
    "brand": {
      id: "brand",
      nextId: "fintech",
      number: "03",
      category: "Brand Systems",
      client: "Aura Systems",
      title: "Brand Identity System",
      tags: ["Figma", "Brand", "Design Tokens", "Typography"],
      image: "assets/images/edu52-banner.webp",
      imageAlt: "Aura Systems Monolithic Brand Architecture & Design Tokens",
      role: "Brand Designer & Developer",
      timeline: "3 Months",
      year: "2024",
      team: "Client Engagement",
      challenge: "A rapidly scaling autonomous AI laboratory needed a monolithic, unified brand design system that scaled effortlessly across editorial whitepapers, enterprise dashboards, and physical research installations without accumulating design debt.",
      solution: "Designed an austere Swiss International design framework consisting of 120+ atomic design tokens, automated WCAG AAA color luminance verification, responsive typography clamp scales, and strict 24px optical vector grids.",
      outcome: "Adopted across 8 production applications with 100% design system token coverage, reducing frontend handoff cycles by 65% and eliminating visual regression across light and dark modes."
    }
  };

  let isInitialized = false;

  function initEditorialDesk() {
    if (isInitialized) return;
    isInitialized = true;

    const folders = document.querySelectorAll(".js-work-folder");
    const modal = document.getElementById("projectModal");
    if (!modal) return;

    const modalEyebrow = document.getElementById("modalEyebrow");
    const modalTitle = document.getElementById("modalTitle");
    const modalChips = document.getElementById("modalChips");
    const modalHeroImg = document.getElementById("modalHeroImg");
    const modalRole = document.getElementById("modalRole");
    const modalTimeline = document.getElementById("modalTimeline");
    const modalYear = document.getElementById("modalYear");
    const modalClient = document.getElementById("modalClient");
    const modalChallenge = document.getElementById("modalChallenge");
    const modalSolution = document.getElementById("modalSolution");
    const modalOutcome = document.getElementById("modalOutcome");
    const modalNextBtn = document.getElementById("modalNextBtn");
    const closeButtons = document.querySelectorAll(".js-modal-close-btn");

    let lastActiveFolder = null;
    let currentProjectId = "fintech";
    let isClosing = false;

    // 1. Spotlight Tracking on .work-folder
    folders.forEach((folder) => {
      folder.addEventListener("mousemove", (e) => {
        const rect = folder.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        folder.style.setProperty("--mx", `${mx}px`);
        folder.style.setProperty("--my", `${my}px`);
      });

      // Keyboard Accessibility: Enter / Space triggers click
      folder.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          folder.click();
        }
      });

      // Folder Click: Opens Full Case-Study Modal with macOS Genie Animation
      folder.addEventListener("click", () => {
        const projectId = folder.getAttribute("data-project-id") || "fintech";
        openGenieModal(folder, projectId);
      });
    });

    // 2. Populate Modal Content
    function populateModalContent(data) {
      if (!data) return;
      currentProjectId = data.id;

      if (modalEyebrow) modalEyebrow.textContent = `(CASE STUDY · ${data.number}) / ${data.client}`;
      if (modalTitle) modalTitle.textContent = data.title;
      if (modalRole) modalRole.textContent = data.role;
      if (modalTimeline) modalTimeline.textContent = data.timeline;
      if (modalYear) modalYear.textContent = data.year;
      if (modalClient) modalClient.textContent = data.client;
      if (modalChallenge) modalChallenge.textContent = data.challenge;
      if (modalSolution) modalSolution.textContent = data.solution;
      if (modalOutcome) modalOutcome.textContent = data.outcome;

      if (modalHeroImg) {
        modalHeroImg.src = data.image;
        modalHeroImg.alt = data.imageAlt;
      }

      // Populate Tag Chips
      if (modalChips) {
        modalChips.innerHTML = "";
        data.tags.forEach((tag) => {
          const li = document.createElement("li");
          li.className = "modal-chip";
          li.textContent = tag;
          modalChips.appendChild(li);
        });
      }

      // Configure "Next Project" Button
      if (modalNextBtn) {
        const nextProject = CASE_STUDIES[data.nextId];
        modalNextBtn.setAttribute("data-next-id", data.nextId);
        const nextLabel = modalNextBtn.querySelector(".modal-next-label");
        if (nextLabel) {
          nextLabel.textContent = `Next: ${nextProject.title}`;
        }
      }
    }

    // 3. Open Modal with macOS Genie Math
    function openGenieModal(folder, projectId) {
      if (isClosing) return;
      lastActiveFolder = folder;

      const projectData = CASE_STUDIES[projectId] || CASE_STUDIES["fintech"];

      // Calculate folder's exact center on screen using getBoundingClientRect()
      const rect = folder.getBoundingClientRect();
      const originX = rect.left + rect.width / 2 - window.innerWidth / 2;
      const originY = rect.top + rect.height / 2 - window.innerHeight / 2;

      modal.style.setProperty("--origin-x", `${Math.round(originX)}px`);
      modal.style.setProperty("--origin-y", `${Math.round(originY)}px`);

      populateModalContent(projectData);

      // Open Native Dialog
      if (!modal.open) {
        modal.showModal();
      }

      // Double RAF for smooth hardware acceleration from distorted scale(0.05) to full scale(1)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          modal.classList.add("is-open");
          modal.focus();
        });
      });
    }

    // 4. Close Modal with Reverse Genie Minimize
    function closeGenieModal() {
      if (!modal.open || isClosing) return;
      isClosing = true;

      // Recalculate origin coordinates if folder moved during scroll
      if (lastActiveFolder) {
        const rect = lastActiveFolder.getBoundingClientRect();
        const originX = rect.left + rect.width / 2 - window.innerWidth / 2;
        const originY = rect.top + rect.height / 2 - window.innerHeight / 2;
        modal.style.setProperty("--origin-x", `${Math.round(originX)}px`);
        modal.style.setProperty("--origin-y", `${Math.round(originY)}px`);
      }

      modal.classList.remove("is-open");
      modal.classList.add("is-closing");

      // Wait 400ms for reverse genie animation to complete before closing dialog
      setTimeout(() => {
        modal.close();
        modal.classList.remove("is-closing");
        isClosing = false;
        if (lastActiveFolder) {
          lastActiveFolder.focus();
        }
      }, 400);
    }

    // Next Project Button inside Modal
    if (modalNextBtn) {
      modalNextBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const nextId = modalNextBtn.getAttribute("data-next-id") || "fintech";
        const nextData = CASE_STUDIES[nextId];
        const nextFolder = document.querySelector(`.js-work-folder[data-project-id="${nextId}"]`);
        if (nextFolder) {
          lastActiveFolder = nextFolder;
          const rect = nextFolder.getBoundingClientRect();
          const originX = rect.left + rect.width / 2 - window.innerWidth / 2;
          const originY = rect.top + rect.height / 2 - window.innerHeight / 2;
          modal.style.setProperty("--origin-x", `${Math.round(originX)}px`);
          modal.style.setProperty("--origin-y", `${Math.round(originY)}px`);
        }

        // Smoothly scroll modal back to top and swap content
        modal.scrollTo({ top: 0, behavior: "smooth" });
        populateModalContent(nextData);
      });
    }

    // Close Button Handlers
    closeButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        closeGenieModal();
      });
    });

    // Native Esc Key Intercept for Reverse Genie Transition
    modal.addEventListener("cancel", (e) => {
      e.preventDefault();
      closeGenieModal();
    });

    // Backdrop Click Handling
    modal.addEventListener("click", (e) => {
      const rect = modal.getBoundingClientRect();
      const clickedInside =
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width;

      if (!clickedInside) {
        closeGenieModal();
      }
    });

    // Focus Trap inside Modal
    modal.addEventListener("keydown", (e) => {
      if (e.key !== "Tab" || !modal.open) return;

      const focusable = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;

      const firstEl = focusable[0];
      const lastEl = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    });

    // Connect timeline jump links to the 3 asymmetric folders
    document.querySelectorAll(".js-dossier-jump").forEach((link) => {
      link.addEventListener("click", (e) => {
        const target = (link.getAttribute("data-target-folder") || "").toLowerCase();
        let targetId = "fintech";
        if (target.includes("apply") || target.includes("fintech") || target.includes("saas")) targetId = "fintech";
        else if (target.includes("pharma") || target.includes("webgl") || target.includes("exp")) targetId = "webgl";
        else if (target.includes("edu") || target.includes("brand")) targetId = "brand";

        const folderEl = document.querySelector(`.js-work-folder[data-project-id="${targetId}"]`);
        if (folderEl) {
          setTimeout(() => {
            folderEl.scrollIntoView({ behavior: "smooth", block: "center" });
            setTimeout(() => {
              openGenieModal(folderEl, targetId);
            }, 500);
          }, 350);
        }
      });
    });
  }

  window.initEditorialDesk = initEditorialDesk;
  window.initDigitalDesktop = initEditorialDesk;
  window.initSelectedWorks = initEditorialDesk;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initEditorialDesk);
  } else {
    initEditorialDesk();
  }
})();
