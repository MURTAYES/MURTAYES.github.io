/**
 * Footer Utilities Module
 * Handles real-time Dhaka timezone clock and smooth back-to-top scrolling
 */
(function () {
  "use strict";

  function initFooterUtilities() {
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

    const topBtn = document.querySelector(".footer__top, #footer-back-top");
    if (topBtn) {
      topBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  }

  window.initFooterUtilities = initFooterUtilities;
})();
