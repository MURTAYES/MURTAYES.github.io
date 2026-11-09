/**
 * Specification Docket Modals & Contact Drawer Module
 * Handles case study modal popups (ApplyKit, PharmaERP, Edu52) and contact form drawer
 */
(function () {
  "use strict";

  function setupModal(modalId, openSelector, closeSelector) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    const openTriggers = document.querySelectorAll(openSelector);
    const closeTriggers = modal.querySelectorAll(closeSelector);

    function openModal(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      modal.classList.add("is-active");
      modal.setAttribute("aria-hidden", "false");
      document.documentElement.classList.add("is--modal-open");
      document.body.classList.add("is--modal-open");
      document.body.style.overflow = "hidden";
    }

    function closeModal() {
      modal.classList.remove("is-active");
      modal.setAttribute("aria-hidden", "true");
      document.documentElement.classList.remove("is--modal-open");
      document.body.classList.remove("is--modal-open");
      document.body.style.overflow = "";
    }

    openTriggers.forEach((btn) => btn.addEventListener("click", openModal));
    closeTriggers.forEach((btn) => btn.addEventListener("click", closeModal));

    modal.addEventListener("click", (e) => {
      if (
        e.target === modal ||
        e.target.classList.contains("modal-backdrop") ||
        e.target.classList.contains("applykit-modal__backdrop") ||
        e.target.classList.contains("pharmaerp-modal__backdrop") ||
        e.target.classList.contains("edu52-modal__backdrop")
      ) {
        closeModal();
      }
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("is-active")) {
        closeModal();
      }
    });
  }

  function initSpecificationModals() {
    setupModal("applykit-modal", "[data-applykit-modal-open]", "[data-applykit-modal-close]");
    setupModal("pharmaerp-modal", "[data-pharmaerp-modal-open]", "[data-pharmaerp-modal-close]");
    setupModal("edu52-modal", "[data-edu52-modal-open]", "[data-edu52-modal-close]");
  }

  function initContactModal() {
    const modal = document.getElementById("contact-modal");
    if (!modal) return;

    const openTriggers = document.querySelectorAll(
      '.footer__big, [href="/contact"], .nav-button-wrap .btn, [data-open-contact]'
    );
    const closeTriggers = modal.querySelectorAll("[data-close-contact]");
    const form = document.getElementById("drawer-contact-form");
    const successBox = modal.querySelector(".contact-form__success");
    const resetBtn = modal.querySelector("[data-reset-contact]");

    function openModal(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.documentElement.classList.add("is--modal-open");
      document.body.classList.add("is--modal-open");
      document.body.style.overflow = "hidden";

      setTimeout(() => {
        const firstInput = modal.querySelector('input[name="name"]');
        if (firstInput) firstInput.focus();
      }, 100);
    }

    function closeModal() {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.documentElement.classList.remove("is--modal-open");
      document.body.classList.remove("is--modal-open");
      document.body.style.overflow = "";
    }

    openTriggers.forEach((el) => el.addEventListener("click", openModal));
    closeTriggers.forEach((el) => el.addEventListener("click", closeModal));

    modal.addEventListener("click", (e) => {
      if (e.target.classList.contains("contact-modal__backdrop")) {
        closeModal();
      }
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("is-open")) {
        closeModal();
      }
    });

    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const nameInput = form.querySelector('[name="name"]');
        const emailInput = form.querySelector('[name="email"]');
        const messageInput = form.querySelector('[name="message"]');
        let isValid = true;

        if (!nameInput.value.trim()) {
          nameInput.classList.add("has-error");
          isValid = false;
        } else {
          nameInput.classList.remove("has-error");
        }

        if (!emailInput.value.trim() || !emailInput.value.includes("@")) {
          emailInput.classList.add("has-error");
          isValid = false;
        } else {
          emailInput.classList.remove("has-error");
        }

        if (messageInput && !messageInput.value.trim()) {
          messageInput.classList.add("has-error");
          isValid = false;
        } else if (messageInput) {
          messageInput.classList.remove("has-error");
        }

        if (!isValid) return;

        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        const submitText = submitBtn.querySelector(".contact-form__submit-text") || submitBtn;
        submitText.textContent = "Sending message...";

        setTimeout(() => {
          form.style.display = "none";
          if (successBox) successBox.style.display = "flex";
        }, 500);
      });

      form.querySelectorAll("input, textarea").forEach((field) => {
        field.addEventListener("input", () => field.classList.remove("has-error"));
      });
    }

    if (resetBtn && form && successBox) {
      resetBtn.addEventListener("click", () => {
        form.reset();
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.disabled = false;
          const submitText = submitBtn.querySelector(".contact-form__submit-text") || submitBtn;
          submitText.textContent = "Send message";
        }
        successBox.style.display = "none";
        form.style.display = "flex";
      });
    }
  }

  window.setupModal = setupModal;
  window.initSpecificationModals = initSpecificationModals;
  window.initContactModal = initContactModal;
})();
