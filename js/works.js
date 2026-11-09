/**
 * ==========================================================================
 * SELECTED WORK: DIGITAL DESKTOP CONTROLLER (PURE VANILLA JS)
 * Apple macOS Genie Minimize Transition & 3D Folder Stack Interactions
 * Zero Frameworks · Zero CDNs · 60fps Hardware Accelerated
 * ==========================================================================
 */

(function () {
  "use strict";

  // Comprehensive Project Dossier Catalog
  const PROJECTS = {
    "fintech-dashboard": {
      category: "SaaS Products",
      number: "01",
      title: "FinTech Dashboard",
      chips: ["Next.js", "TypeScript", "Tailwind CSS", "Decimal128", "PostgreSQL"],
      summary: "Clinical retail counter POS kernel and FEFO batch accounting engine with Decimal128 dual-entry financial journals and sub-50ms audit reconciliation.",
      role: "Lead Full-Stack Architect",
      timeline: "4 Months",
      year: "2024",
      team: "3 Engineers, 1 Designer",
      highlights: [
        { label: "LATENCY", value: "< 40ms", desc: "Sub-frame transaction settlement" },
        { label: "PRECISION", value: "Decimal128", desc: "Dual-entry balanced ledgers" },
        { label: "AVAILABILITY", value: "99.99%", desc: "Local-first offline sync buffer" }
      ],
      description: "Architected a high-throughput POS terminal and financial accounting kernel designed for high-volume retail dispensaries. Leveraged Decimal128 fixed-point arithmetic to prevent floating-point rounding errors across multi-currency ledgers, paired with an offline-first IndexedDB buffer that guarantees zero transaction drop during connectivity outages."
    },
    "hr-portal": {
      category: "SaaS Products",
      number: "02",
      title: "HR Portal",
      chips: ["Web Extensions MV3", "AES-GCM", "IndexedDB", "Vanilla JS"],
      summary: "Bilingual DOM heuristics engine and automated application workflow featuring section-scoped traversal and client-side AES-GCM encryption.",
      role: "Senior Interaction Engineer",
      timeline: "6 Months",
      year: "2024",
      team: "Solo Project",
      highlights: [
        { label: "SCAN SPEED", value: "< 35ms", desc: "DOM tree heuristics traversal" },
        { label: "SECURITY", value: "AES-256", desc: "Zero cloud transmission vault" },
        { label: "ACCURACY", value: "98.4%", desc: "Bilingual form field resolution" }
      ],
      description: "Built a zero-cloud candidate credential vault and DOM heuristics engine running natively inside Chrome Manifest V3. Evaluates bilingual application fields in real-time, executing localized autofill operations while storing all sensitive cryptographic tokens inside client-side IndexedDB encrypted with user-derived keys."
    },
    "billing-kernel": {
      category: "SaaS Products",
      number: "03",
      title: "Cloud Billing Kernel",
      chips: ["Go", "Redis", "Kafka", "Stripe API", "Docker"],
      summary: "Event-driven recurring billing terminal processing metered usage metrics with sub-millisecond rate-limit idempotency.",
      role: "Backend Systems Engineer",
      timeline: "3 Months",
      year: "2023",
      team: "2 Engineers",
      highlights: [
        { label: "THROUGHPUT", value: "25k req/s", desc: "Streamed usage telemetry" },
        { label: "IDEMPOTENCY", value: "100%", desc: "Deduplicated charge verification" },
        { label: "SYNC DELAY", value: "< 120ms", desc: "End-to-end ledger propagation" }
      ],
      description: "Designed a distributed recurring billing engine for multi-tenant SaaS platforms. Handles complex seat allocation tiers, tiered usage-based overages, and dynamic invoice generation with cryptographic audit trails and webhook self-healing retries."
    },
    "webgl-data-vis": {
      category: "Interactive Experiments",
      number: "04",
      title: "WebGL Data Vis",
      chips: ["WebGL 2.0", "GLSL Shaders", "Web Audio API", "Mathematical Vectors"],
      summary: "Real-time 100,000-particle topological soundscape simulation powered by custom GLSL fragment shaders and Web Audio frequency analysis.",
      role: "Creative Technologist",
      timeline: "2 Months",
      year: "2024",
      team: "Independent Research",
      highlights: [
        { label: "PARTICLES", value: "100,000", desc: "GPU simulated at 60fps" },
        { label: "AUDIO SYNC", value: "< 8ms", desc: "Real-time FFT buffer analysis" },
        { label: "BUNDLE SIZE", value: "14KB", desc: "Raw vanilla WebGL kernel" }
      ],
      description: "An interactive spatial audio visualizer exploring mathematical topology and particle dynamics. Custom vertex shaders evaluate Fourier transform spectrum bins directly on the GPU, generating undulating fluid ribbons that respond dynamically to ambient acoustics and cursor gravity wells."
    },
    "fluid-shader": {
      category: "Interactive Experiments",
      number: "05",
      title: "Fluid Physics Stage",
      chips: ["Canvas 2D", "GLSL", "Navier-Stokes", "Vanilla JS"],
      summary: "Interactive 60fps Eulerian fluid dynamics grid with cursor force injection and real-time dye advection equations.",
      role: "Interaction Designer",
      timeline: "1 Month",
      year: "2023",
      team: "Solo Experiment",
      highlights: [
        { label: "FRAME RATE", value: "60 FPS", desc: "Zero garbage collection pauses" },
        { label: "GRID DENSITY", value: "128x128", desc: "Bilinear interpolated advection" },
        { label: "MEMORY", value: "< 24MB", desc: "Pre-allocated typed arrays" }
      ],
      description: "A lightweight implementation of stable fluid dynamics in the browser. Employs Jacobi iterations for pressure projection and velocity advection on typed Float32Arrays, producing organic smoke and watercolor dispersion trails under cursor movement."
    },
    "kinetic-typography": {
      category: "Interactive Experiments",
      number: "06",
      title: "Kinetic Typography",
      chips: ["Variable Fonts", "CSS Houdini", "RequestAnimationFrame", "SVG"],
      summary: "Magnetic parametric type deformation system responding to cursor velocity and scroll acceleration vectors.",
      role: "Frontend Engineer",
      timeline: "3 Weeks",
      year: "2023",
      team: "Solo Experiment",
      highlights: [
        { label: "RESPONSIVENESS", value: "Instant", desc: "Direct hardware compositor sync" },
        { label: "AXES", value: "wght / wdth", desc: "Continuous optical axes modulation" },
        { label: "DEPENDENCIES", value: "Zero", desc: "Native browser font variations" }
      ],
      description: "Explores the intersection of typography and physics. Glyphs deform along variable font axes proportionally to cursor proximity and acceleration vectors, simulating elastic tension and liquid ink dispersion without dropping below 60 frames per second."
    },
    "aura-identity": {
      category: "Brand Systems",
      number: "07",
      title: "Aura Identity",
      chips: ["Brand Architecture", "Typographic Scale", "SVG Systems", "Figma Tokens"],
      summary: "Comprehensive monolithic identity system, typographic scale, and spatial design guidelines built for an autonomous AI research lab.",
      role: "Brand Designer & Developer",
      timeline: "3 Months",
      year: "2024",
      team: "Client Engagement",
      highlights: [
        { label: "COMPONENTS", value: "120+", desc: "Documented atomic tokens" },
        { label: "CONTRAST", value: "AAA Spec", desc: "Automated perceptual luminance" },
        { label: "EXPORT", value: "Multi-Platform", desc: "JSON, CSS, Swift, Android" }
      ],
      description: "Created a comprehensive brand architecture and generative design language for an artificial intelligence research group. Combines austere Swiss International typographic principles with glowing chromatic accents, establishing a confident visual voice across digital platforms, printed editorial releases, and physical workspaces."
    },
    "nova-design-system": {
      category: "Brand Systems",
      number: "08",
      title: "Nova Design System",
      chips: ["Design Tokens", "PostCSS", "Web Components", "WCAG 2.1 AAA"],
      summary: "Zero-dependency design token framework with automated WCAG AAA contrast guarantees, responsive fluid modular scales, and cross-platform distribution.",
      role: "Lead Design System Engineer",
      timeline: "5 Months",
      year: "2023",
      team: "4 Designers, 6 Engineers",
      highlights: [
        { label: "ADOPTION", value: "100%", desc: "Deployed across 8 products" },
        { label: "ACCESSIBILITY", value: "100/100", desc: "Automated Lighthouse score" },
        { label: "BUILD TIME", value: "< 2.1s", desc: "Zero runtime overhead" }
      ],
      description: "Engineered an enterprise-wide design token architecture connecting Figma variable libraries to production codebases. Implements mathematical fluid clamp calculations, semantic theme switching, and strict contrast enforcement that eliminates visual regression during multi-brand rollouts."
    },
    "icon-grid-spec": {
      category: "Brand Systems",
      number: "09",
      title: "Icon Grid Spec",
      chips: ["Vector Geometry", "SVG Optimization", "Iconography", "CLI Tooling"],
      summary: "Architectural 24px optical grid system with strict line-weight consistency and automated SVG build optimization pipelines.",
      role: "Visual Systems Designer",
      timeline: "2 Months",
      year: "2023",
      team: "Solo Project",
      highlights: [
        { label: "GLYPHS", value: "240+", desc: "Optical 24x24 pixel grid" },
        { label: "FILE SAVINGS", value: "62%", desc: "Automated curve simplification" },
        { label: "PIXEL ALIGN", value: "100%", desc: "Sub-pixel sharpness verification" }
      ],
      description: "A unified geometric iconography system developed on a rigorous 24px bounding box. Every glyph adheres to strict corner radius rules, optical weight balancing, and automated pipeline scripts that strip metadata, convert strokes to compound paths, and generate tree-shakeable SVG symbols."
    }
  };

  let isInitialized = false;

  function initDigitalDesktop() {
    if (isInitialized) return;
    isInitialized = true;

    const folders = document.querySelectorAll(".js-work-folder");
    const fileButtons = document.querySelectorAll(".js-file-btn");
    const modal = document.getElementById("projectModal");
    if (!modal) return;

    const modalEyebrow = document.getElementById("modalEyebrow");
    const modalTitle = document.getElementById("modalTitle");
    const modalChips = document.getElementById("modalChips");
    const modalSummary = document.getElementById("modalSummary");
    const modalRole = document.getElementById("modalRole");
    const modalTimeline = document.getElementById("modalTimeline");
    const modalYear = document.getElementById("modalYear");
    const modalTeam = document.getElementById("modalTeam");
    const modalHighlights = document.getElementById("modalHighlights");
    const modalDesc = document.getElementById("modalDesc");
    const closeButtons = document.querySelectorAll(".js-modal-close-btn");

    let lastActiveTrigger = null;
    let isClosing = false;

    // 1. Spotlight Tracking on Folder Hover
    folders.forEach((folder) => {
      folder.addEventListener("mousemove", (e) => {
        const rect = folder.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        folder.style.setProperty("--mx", `${mx}px`);
        folder.style.setProperty("--my", `${my}px`);
      });

      // Mobile Touch Tap to expand/collapse folder
      folder.addEventListener("click", (e) => {
        // If clicking directly on a file button, do not toggle folder
        if (e.target.closest(".js-file-btn")) return;

        const wasOpen = folder.classList.contains("is-open");
        folders.forEach((f) => f.classList.remove("is-open"));
        if (!wasOpen) {
          folder.classList.add("is-open");
        }
      });
    });

    // Close open folders when clicking outside
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".js-work-folder")) {
        folders.forEach((f) => f.classList.remove("is-open"));
      }
    });

    // 2. Populate Modal Content
    function populateModal(data) {
      if (!data) return;

      if (modalEyebrow) modalEyebrow.textContent = `(CASE STUDY · ${data.number}) / ${data.category}`;
      if (modalTitle) modalTitle.textContent = data.title;
      if (modalSummary) modalSummary.textContent = data.summary;
      if (modalRole) modalRole.textContent = data.role;
      if (modalTimeline) modalTimeline.textContent = data.timeline;
      if (modalYear) modalYear.textContent = data.year;
      if (modalTeam) modalTeam.textContent = data.team;
      if (modalDesc) modalDesc.textContent = data.description;

      // Populate Chips
      if (modalChips) {
        modalChips.innerHTML = "";
        data.chips.forEach((chip) => {
          const li = document.createElement("li");
          li.className = "modal-chip";
          li.textContent = chip;
          modalChips.appendChild(li);
        });
      }

      // Populate Highlight Metric Cards
      if (modalHighlights) {
        modalHighlights.innerHTML = "";
        data.highlights.forEach((h) => {
          const card = document.createElement("div");
          card.className = "modal-highlight-card";
          card.innerHTML = `
            <p class="modal-highlight-label">${h.label}</p>
            <p class="modal-highlight-value">${h.value}</p>
            <p class="modal-highlight-desc">${h.desc}</p>
          `;
          modalHighlights.appendChild(card);
        });
      }
    }

    // 3. Open Modal with macOS Genie Math
    function openModalWithGenie(button) {
      if (isClosing) return;
      lastActiveTrigger = button;

      const projectId = button.getAttribute("data-project-id");
      const projectData = PROJECTS[projectId] || PROJECTS["fintech-dashboard"];

      // Calculate clicked file center relative to viewport center
      const fileRect = button.getBoundingClientRect();
      const originX = fileRect.left + fileRect.width / 2 - window.innerWidth / 2;
      const originY = fileRect.top + fileRect.height / 2 - window.innerHeight / 2;

      modal.style.setProperty("--origin-x", `${Math.round(originX)}px`);
      modal.style.setProperty("--origin-y", `${Math.round(originY)}px`);

      populateModal(projectData);

      // Open dialog
      if (!modal.open) {
        modal.showModal();
      }

      // Force two RAF cycles for smooth hardware transition from pinched scale(0.1) to scale(1)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          modal.classList.add("is-open");
          modal.focus();
        });
      });
    }

    // 4. Close Modal with Reverse Genie Minimize
    function closeModalWithGenie() {
      if (!modal.open || isClosing) return;
      isClosing = true;

      // If trigger element moved or available, recalculate origin coordinates
      if (lastActiveTrigger) {
        const fileRect = lastActiveTrigger.getBoundingClientRect();
        const originX = fileRect.left + fileRect.width / 2 - window.innerWidth / 2;
        const originY = fileRect.top + fileRect.height / 2 - window.innerHeight / 2;
        modal.style.setProperty("--origin-x", `${Math.round(originX)}px`);
        modal.style.setProperty("--origin-y", `${Math.round(originY)}px`);
      }

      modal.classList.remove("is-open");
      modal.classList.add("is-closing");

      // Wait 400ms for the reverse genie pinch before closing dialog
      setTimeout(() => {
        modal.close();
        modal.classList.remove("is-closing");
        isClosing = false;
        if (lastActiveTrigger) {
          lastActiveTrigger.focus();
        }
      }, 400);
    }

    // Attach File Click Listeners
    fileButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        openModalWithGenie(btn);
      });
    });

    // Attach Close Button Listeners
    closeButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        closeModalWithGenie();
      });
    });

    // Native Esc Key Intercept for Reverse Genie Animation
    modal.addEventListener("cancel", (e) => {
      e.preventDefault();
      closeModalWithGenie();
    });

    // Backdrop Click Handling
    modal.addEventListener("click", (e) => {
      const rect = modal.getBoundingClientRect();
      const clickedInDialog =
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width;

      if (!clickedInDialog) {
        closeModalWithGenie();
      }
    });

    // Focus Trap inside Modal
    modal.addEventListener("keydown", (e) => {
      if (e.key !== "Tab" || !modal.open) return;

      const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    });

    // Connect timeline quick jump links (e.g. .js-dossier-jump) to digital desktop files
    document.querySelectorAll(".js-dossier-jump").forEach((link) => {
      link.addEventListener("click", (e) => {
        const target = link.getAttribute("data-target-folder") || "";
        let targetId = "fintech-dashboard";
        if (target.includes("applykit") || target.includes("saas")) targetId = "fintech-dashboard";
        else if (target.includes("pharmaerp") || target.includes("hr")) targetId = "hr-portal";
        else if (target.includes("eduhub") || target.includes("exp")) targetId = "webgl-data-vis";

        const btn = document.querySelector(`.js-file-btn[data-project-id="${targetId}"]`);
        if (btn) {
          setTimeout(() => {
            btn.scrollIntoView({ behavior: "smooth", block: "center" });
            setTimeout(() => {
              openModalWithGenie(btn);
            }, 500);
          }, 350);
        }
      });
    });
  }

  window.initDigitalDesktop = initDigitalDesktop;
  window.initSelectedWorks = initDigitalDesktop;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initDigitalDesktop);
  } else {
    initDigitalDesktop();
  }
})();
