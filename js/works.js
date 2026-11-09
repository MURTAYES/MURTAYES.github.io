/**
 * ==========================================================================
 * SELECTED WORK: EDITORIAL ASYMMETRICAL DESK & NIVARA CASE-STUDY PAGE
 * 5-Panel Curtain Slide Transition · 3D Folder Desks · Smooth Accordion & Wordmark
 * Zero Frameworks · Zero CDNs · 60fps Hardware Accelerated
 * ==========================================================================
 */

(function () {
  "use strict";

  // Case Study Catalog tailored for each of the 3 Asymmetric Folders
  const PROJECT_PAGES = {
    "fintech": {
      id: "fintech",
      brand: "Acme Corp",
      headerCenter: "Acme Corp / Retail POS Architecture",
      categorySub: "Case Study · 01 / SaaS Architecture",
      title: "FinTech Dashboard",
      heroImage: "assets/images/appykit.jpg",
      heroActionText: "Inspect Architecture Spec ↓",
      meta: [
        { label: "Studio / Client", val: "Acme Corp Retail Dispensaries<br>New York, USA" },
        { label: "Architecture", val: "Decimal128 Dual-Entry Journal<br>IndexedDB Local-First Kernel" },
        { label: "Performance", val: "< 35ms Settlement Latency<br>99.99% Hardware Availability" }
      ],
      formTitle: "Deploy this architecture",
      formDesc: [
        "Tell us about your transactional volume, POS terminals,",
        "and distributed ledger brief. An architect reads every",
        "message and replies within two working days."
      ],
      contactEmail: "samnunmurtayes01@gmail.com",
      statusPhone: "Active Sprint · Available for Consultation",
      selectOptions: [
        { val: "pos", text: "High-Throughput POS Terminal" },
        { val: "ledger", text: "Distributed Decimal128 Ledger" },
        { val: "offline", text: "Offline-First Sync Engine" },
        { val: "audit", text: "Cryptographic Audit Reconciliation" }
      ],
      messagePlaceholder: "Tell us about your transaction throughput, existing databases, and target launch window.",
      faqSub: "Technical specifications regarding the Decimal128 financial ledger and offline-first POS engine.",
      faqs: [
        {
          q: "How does Decimal128 prevent calculation drift?",
          a: "Standard IEEE-754 floating-point numbers introduce binary fraction rounding errors in currency additions. Decimal128 enforces exact decimal base-10 arithmetic across all cart totals, tax schedules, and ledger entries down to 34 decimal digits."
        },
        {
          q: "What happens if retail connectivity drops during checkout?",
          a: "The client-side engine executes local-first write operations directly into IndexedDB with append-only transaction receipts. Transactions settle locally in under 35ms and auto-stream to PostgreSQL when network connectivity is restored."
        },
        {
          q: "What throughput SLA does the terminal guarantee?",
          a: "The UI thread achieves 0ms input blocking and sub-40ms end-to-end receipt generation, tested up to 2.4 million daily transactions with 99.99% uptime."
        }
      ],
      statement: "Precision financial engines & high-throughput retail architecture.",
      wordmarkChars: ["F", "I", "N", "T", "E", "C", "H"],
      copyright: "© 2026 Acme Corp · Samnun Murtayes",
      accreditation: "Engineered in the Swiss International Typographic Style"
    },
    "webgl": {
      id: "webgl",
      brand: "Nova Labs",
      headerCenter: "Nova Labs / Interactive Graphics",
      categorySub: "Case Study · 02 / Interactive Experiments",
      title: "WebGL Data Vis",
      heroImage: "assets/images/pharma.jpg",
      heroActionText: "Inspect Shader Pipeline ↓",
      meta: [
        { label: "Studio / Client", val: "Nova Labs Creative Research<br>Copenhagen & London" },
        { label: "Architecture", val: "GPGPU GLSL Compute Shaders<br>Instanced Vertex Ribbons" },
        { label: "Performance", val: "100,000 Particles at 60 FPS<br>< 14KB Zero-CDN Footprint" }
      ],
      formTitle: "Commission an experiment",
      formDesc: [
        "Looking for high-framerate 3D visualizers, shader stages,",
        "or mathematical simulation environments? We translate",
        "complex data into sensory digital experiences."
      ],
      contactEmail: "samnunmurtayes01@gmail.com",
      statusPhone: "Creative Lab · Open for Q1 Collaborations",
      selectOptions: [
        { val: "shader", text: "3D WebGL / GLSL Shader Stage" },
        { val: "audio", text: "Real-Time Audio Reactive Canvas" },
        { val: "particles", text: "GPGPU Particle Simulation" },
        { val: "brand", text: "Generative Mathematical Branding" }
      ],
      messagePlaceholder: "Describe your creative brief, particle count requirements, and interactive goals.",
      faqSub: "Technical questions regarding GPU memory, shaders, and browser performance.",
      faqs: [
        {
          q: "How do 100,000 particles render without freezing the browser?",
          a: "Particle positions and velocity vectors are computed entirely on the GPU via custom GLSL vertex shaders and Float32Array texture buffers, bypassing JavaScript main-thread evaluation completely."
        },
        {
          q: "How is audio frequency data synchronized in real-time?",
          a: "The Web Audio API AnalyserNode samples incoming frequencies into a Uint8Array FFT buffer every frame, passing frequency bins directly into uniform floats with under 8ms latency."
        },
        {
          q: "Does this require third-party libraries or CDNs?",
          a: "The core particle kernel is engineered in pure vanilla WebGL 2.0 with zero external dependencies, weighing just 14KB gzip."
        }
      ],
      statement: "Mathematical beauty & hardware-accelerated kinetic motion.",
      wordmarkChars: ["W", "E", "B", "G", "L"],
      copyright: "© 2026 Nova Labs · Samnun Murtayes",
      accreditation: "Hardware-Accelerated 60fps WebGL Simulation"
    },
    "brand": {
      id: "brand",
      brand: "Aura Systems",
      headerCenter: "Aura Systems / Autonomous Design System",
      categorySub: "Case Study · 03 / Brand Architecture",
      title: "Brand Identity System",
      heroImage: "assets/images/edu52-banner.webp",
      heroActionText: "Inspect Token Framework ↓",
      meta: [
        { label: "Studio / Client", val: "Aura Systems Autonomous AI<br>San Francisco & Berlin" },
        { label: "Architecture", val: "120+ Cross-Platform Design Tokens<br>Automated Perceptual Luminance" },
        { label: "Compliance", val: "WCAG 2.1 AAA Accessibility<br>Continuous Modular Clamp Scales" }
      ],
      formTitle: "Build your design system",
      formDesc: [
        "Unify your product organization with architectural tokens,",
        "automated accessibility guarantees, and cross-platform",
        "multi-brand synchronizations."
      ],
      contactEmail: "samnunmurtayes01@gmail.com",
      statusPhone: "Design Systems · Production Handoff Ready",
      selectOptions: [
        { val: "tokens", text: "Multi-Brand Design Token System" },
        { val: "clamp", text: "Typographic Clamp & Spacing Scale" },
        { val: "wcag", text: "WCAG AAA Accessibility Verification" },
        { val: "components", text: "Component Library Architecture" }
      ],
      messagePlaceholder: "Tell us about your team size, tech stack, and design system roadmap.",
      faqSub: "Answers on token synchronization, Figma handoff, and multi-platform compilation.",
      faqs: [
        {
          q: "How do tokens sync between Figma and production code?",
          a: "Tokens are maintained as JSON single sources of truth, auto-compiled via CI pipelines into CSS Custom Properties, TypeScript type definitions, and native iOS/Android style packages."
        },
        {
          q: "How is WCAG AAA accessibility guaranteed?",
          a: "Color token pairings undergo automated perceptual luminance ratio checks during the build step, enforcing minimum 7:1 contrast ratios before commits are approved."
        },
        {
          q: "How does fluid typography scale across viewports?",
          a: "We generate continuous CSS clamp() formulas based on modular scales, eliminating discrete breakpoint jumps and maintaining optical rhythm from 360px mobile to 4K ultra-wide screens."
        }
      ],
      statement: "Monolithic design systems built for long-term endurance.",
      wordmarkChars: ["A", "U", "R", "A"],
      copyright: "© 2026 Aura Systems · Samnun Murtayes",
      accreditation: "Engineered in the Swiss International Typographic Style"
    }
  };

  let isInitialized = false;

  function initEditorialDesk() {
    if (isInitialized) return;
    isInitialized = true;

    const folders = document.querySelectorAll(".js-work-folder");
    const projectModal = document.getElementById("project-page-modal");
    if (!projectModal) return;

    const curtain = document.getElementById("project-page-curtain");
    const scrollContainer = document.getElementById("project-page-scroll");
    const closeButtons = projectModal.querySelectorAll("[data-close-project]");

    let lastActiveFolder = null;
    let isTransitioning = false;
    let projectObserver = null;

    // 1. Mouse Spotlight Tracking on Folders
    folders.forEach((folder) => {
      folder.addEventListener("mousemove", (e) => {
        const rect = folder.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        folder.style.setProperty("--mx", `${mx}px`);
        folder.style.setProperty("--my", `${my}px`);
      });

      // Keyboard Accessibility (Enter / Space opens modal)
      folder.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          folder.click();
        }
      });

      // Click: Open Full-Page Case Study with 5-Panel Curtain Transition
      folder.addEventListener("click", () => {
        const projectId = folder.getAttribute("data-project-id") || "fintech";
        openProjectPage(folder, projectId);
      });
    });

    // 2. Populate Case-Study Page Content
    function populateProjectPage(data) {
      if (!data) return;

      const headerCenter = document.getElementById("project-header-center");
      const heroImg = document.getElementById("project-hero-img");
      const heroSub = document.getElementById("project-hero-sub");
      const heroTitle = document.getElementById("project-hero-title");
      const heroAction = document.getElementById("project-hero-action");

      if (headerCenter) headerCenter.textContent = data.headerCenter;
      if (heroSub) heroSub.textContent = data.categorySub;
      if (heroTitle) heroTitle.textContent = data.title;
      if (heroAction) heroAction.textContent = data.heroActionText;
      if (heroImg) {
        heroImg.src = data.heroImage;
        heroImg.alt = `${data.title} Hero Banner`;
      }

      // Populate Hero Details List
      const meta1Label = document.getElementById("project-meta-1-label");
      const meta1Val = document.getElementById("project-meta-1-val");
      const meta2Label = document.getElementById("project-meta-2-label");
      const meta2Val = document.getElementById("project-meta-2-val");
      const meta3Label = document.getElementById("project-meta-3-label");
      const meta3Val = document.getElementById("project-meta-3-val");

      if (data.meta && data.meta[0]) {
        if (meta1Label) meta1Label.textContent = data.meta[0].label;
        if (meta1Val) meta1Val.innerHTML = data.meta[0].val;
      }
      if (data.meta && data.meta[1]) {
        if (meta2Label) meta2Label.textContent = data.meta[1].label;
        if (meta2Val) meta2Val.innerHTML = data.meta[1].val;
      }
      if (data.meta && data.meta[2]) {
        if (meta3Label) meta3Label.textContent = data.meta[2].label;
        if (meta3Val) meta3Val.innerHTML = data.meta[2].val;
      }

      // Populate Form Section
      const formTitle = document.getElementById("project-form-title");
      const formDesc1 = document.getElementById("project-form-desc-1");
      const formDesc2 = document.getElementById("project-form-desc-2");
      const formDesc3 = document.getElementById("project-form-desc-3");
      const contactEmail = document.getElementById("project-contact-email");
      const contactPhone = document.getElementById("project-contact-phone");
      const formSelect = document.getElementById("project-form-select");
      const formMessage = document.getElementById("project-form-message");

      if (formTitle) formTitle.textContent = data.formTitle;
      if (formDesc1) formDesc1.textContent = data.formDesc[0] || "";
      if (formDesc2) formDesc2.textContent = data.formDesc[1] || "";
      if (formDesc3) formDesc3.textContent = data.formDesc[2] || "";
      if (contactEmail) {
        contactEmail.textContent = data.contactEmail;
        contactEmail.href = `mailto:${data.contactEmail}`;
      }
      if (contactPhone) contactPhone.textContent = data.statusPhone;
      if (formMessage) formMessage.placeholder = data.messagePlaceholder;

      if (formSelect && data.selectOptions) {
        formSelect.innerHTML = `<option value="" disabled selected>Choose architecture tier</option>`;
        data.selectOptions.forEach((opt) => {
          const optionEl = document.createElement("option");
          optionEl.value = opt.val;
          optionEl.textContent = opt.text;
          formSelect.appendChild(optionEl);
        });
      }

      // Populate FAQ Section
      const faqSub = document.getElementById("project-faq-sub");
      if (faqSub) faqSub.textContent = data.faqSub;

      const faqAccordion = document.getElementById("project-faq-accordion");
      if (faqAccordion && data.faqs) {
        faqAccordion.innerHTML = "";
        data.faqs.forEach((faq, index) => {
          const isFirst = index === 0;
          const itemEl = document.createElement("div");
          itemEl.className = "faq-item";
          itemEl.innerHTML = `
            <button type="button" class="faq-trigger" aria-expanded="${isFirst ? 'true' : 'false'}">
              <span class="faq-q">${faq.q}</span>
              <span class="faq-icon" aria-hidden="true">
                <span class="icon-h"></span>
                <span class="icon-v"></span>
              </span>
            </button>
            <div class="faq-content ${isFirst ? 'is-open' : ''}">
              <div class="faq-inner">
                <p class="faq-a">${faq.a}</p>
              </div>
            </div>
          `;
          faqAccordion.appendChild(itemEl);
        });
        const ruleEl = document.createElement("div");
        ruleEl.className = "rule";
        faqAccordion.appendChild(ruleEl);

        // Bind Accordion clicks
        bindAccordionTriggers(faqAccordion);
      }

      // Populate Footer Section
      const footerStatement = document.getElementById("project-footer-statement");
      const footerEmail = document.getElementById("project-footer-email");
      const footerWordmark = document.getElementById("project-footer-wordmark");
      const footerCopy = document.getElementById("project-footer-copy");
      const footerSub = document.getElementById("project-footer-sub");

      if (footerStatement) footerStatement.textContent = data.statement;
      if (footerEmail) {
        footerEmail.textContent = data.contactEmail;
        footerEmail.href = `mailto:${data.contactEmail}`;
      }
      if (footerCopy) footerCopy.textContent = data.copyright;
      if (footerSub) footerSub.textContent = data.accreditation;

      if (footerWordmark && data.wordmarkChars) {
        footerWordmark.innerHTML = "";
        data.wordmarkChars.forEach((ch, idx) => {
          const span = document.createElement("span");
          span.className = "char";
          span.textContent = ch;
          span.style.transitionDelay = `${idx * 0.05}s`;
          footerWordmark.appendChild(span);
        });
      }
    }

    // 3. Bind Accordion Toggles
    function bindAccordionTriggers(container) {
      const items = container.querySelectorAll(".faq-item");
      items.forEach((item) => {
        const trigger = item.querySelector(".faq-trigger");
        const content = item.querySelector(".faq-content");
        if (!trigger || !content) return;

        trigger.addEventListener("click", () => {
          const isOpen = trigger.getAttribute("aria-expanded") === "true";

          // Close sibling items
          items.forEach((other) => {
            const otherTrig = other.querySelector(".faq-trigger");
            const otherCont = other.querySelector(".faq-content");
            if (otherTrig && otherCont) {
              otherTrig.setAttribute("aria-expanded", "false");
              otherCont.classList.remove("is-open");
            }
          });

          // Toggle clicked item
          if (!isOpen) {
            trigger.setAttribute("aria-expanded", "true");
            content.classList.add("is-open");
          }
        });
      });
    }

    // 4. Setup Scroll Intersection Observer inside modal
    function setupScrollObserver() {
      if (projectObserver) {
        projectObserver.disconnect();
      }

      const options = {
        root: scrollContainer,
        rootMargin: "0px",
        threshold: 0.15
      };

      projectObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      }, options);

      const animElements = projectModal.querySelectorAll(".reveal-text, .animate-line, .footer-wordmark");
      animElements.forEach((el) => {
        el.classList.remove("is-visible");
        projectObserver.observe(el);
      });
    }

    // 5. Open Project Page with 5-Panel Curtain Slide
    function openProjectPage(folder, projectId) {
      if (isTransitioning) return;
      isTransitioning = true;
      lastActiveFolder = folder;

      const projectData = PROJECT_PAGES[projectId] || PROJECT_PAGES["fintech"];
      populateProjectPage(projectData);

      // Reset scroll position to top
      if (scrollContainer) {
        scrollContainer.scrollTop = 0;
      }

      // Display container
      projectModal.hidden = false;
      projectModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";

      // Ensure curtain panels are covering initially
      if (curtain) {
        curtain.classList.remove("is-hidden");
      }

      requestAnimationFrame(() => {
        projectModal.classList.add("is-open");

        // Staggered panel retraction after small layout settle
        setTimeout(() => {
          if (curtain) {
            curtain.classList.add("is-hidden");
          }
          setupScrollObserver();
          isTransitioning = false;
        }, 120);
      });
    }

    // 6. Close Project Page with Curtain Slide
    function closeProjectPage() {
      if (!projectModal.classList.contains("is-open") || isTransitioning) return;
      isTransitioning = true;

      // Bring curtain panels down over screen
      if (curtain) {
        curtain.classList.remove("is-hidden");
      }

      // Wait 750ms for curtain panels to slide down
      setTimeout(() => {
        projectModal.classList.remove("is-open");
        projectModal.hidden = true;
        projectModal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";

        if (projectObserver) {
          projectObserver.disconnect();
        }

        isTransitioning = false;

        // Return focus to triggered folder
        if (lastActiveFolder) {
          lastActiveFolder.focus();
        }
      }, 750);
    }

    // Bind Close Buttons
    closeButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        closeProjectPage();
      });
    });

    // Native Escape Key Handling
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && projectModal.classList.contains("is-open")) {
        e.preventDefault();
        closeProjectPage();
      }
    });

    // Timeline quick jump connection
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
              openProjectPage(folderEl, targetId);
            }, 450);
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
