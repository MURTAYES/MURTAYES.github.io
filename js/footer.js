/**
 * Footer Utilities Module (Pure Vanilla JavaScript)
 * Handles dynamic current year, real-time Dhaka timezone clock, and smooth back-to-top scrolling
 */
(function () {
  "use strict";

  let isInitialized = false;

  function initFooterUtilities() {
    if (isInitialized) return;
    isInitialized = true;

    // Dynamic Copyright Year
    const yearEl = document.getElementById("footer-year");
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }

    // Live Dhaka Time (UTC+6)
    function updateLiveTime() {
      let timeStr = "";
      try {
        const formatter = new Intl.DateTimeFormat("en-GB", {
          timeZone: "Asia/Dhaka",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
        timeStr = formatter.format(new Date());
      } catch (e) {
        const now = new Date();
        const h = String(now.getHours()).padStart(2, "0");
        const m = String(now.getMinutes()).padStart(2, "0");
        timeStr = `${h}:${m}`;
      }
      const footerClock = document.getElementById("footer-live-time");
      if (footerClock) footerClock.textContent = timeStr;
    }
    updateLiveTime();
    setInterval(updateLiveTime, 1000);

    // Smooth Scroll to Top
    const topBtn = document.querySelector("#footer-back-top, .colophon-top-btn, .footer__top");
    if (topBtn) {
      topBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  }

  window.initFooterUtilities = initFooterUtilities;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initFooterUtilities);
  } else {
    initFooterUtilities();
  }
})();
