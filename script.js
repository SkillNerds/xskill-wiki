/* xskill.wiki/v2 — count-up stats, scroll reveal, gentle hero parallax.
   (Content is static + grounded; i18n.js handles all copy.) */
(function () {
  "use strict";

  function countUp(el) {
    const to = +el.dataset.to;
    const suf = el.dataset.suffix || "";
    const dur = 1200, t0 = performance.now();
    function tick(now) {
      const p = Math.min((now - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(to * eased).toLocaleString() + suf;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const counted = new WeakSet();
  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      const cs = e.target.querySelectorAll ? e.target.querySelectorAll(".count") : [];
      cs.forEach(function (c) { if (!counted.has(c)) { counted.add(c); countUp(c); } });
      io.unobserve(e.target);
    });
  }, { threshold: 0.18 });

  document.querySelectorAll(".section, .stats, .hero__copy, .postcard, .cta__card")
    .forEach(function (el) { el.classList.add("reveal"); io.observe(el); });

  // Public hub must never stay invisible: force visible even if reveal observer misses.
  var hub = document.getElementById("public-hub");
  if (hub) hub.classList.add("in");

  const card = document.querySelector(".postcard");
  if (card && !matchMedia("(prefers-reduced-motion: reduce)").matches && matchMedia("(pointer:fine)").matches) {
    const scene = card.querySelector(".scene");
    card.addEventListener("pointermove", function (e) {
      const r = card.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width / 2) / r.width;
      const dy = (e.clientY - r.top - r.height / 2) / r.height;
      scene.style.transform = "translate(" + dx * 8 + "px," + dy * 8 + "px) scale(1.04)";
    });
    card.addEventListener("pointerleave", function () { scene.style.transform = ""; });
  }

  const copyBtn = document.getElementById("hub-copy-btn");
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      const cmd = [
        "pip install -U xskill",
        "xskill connect https://hub.xskill.wiki --token dd7f641c16ced6d1db43e754055fd2c8 --name YOUR_NAME",
      ].join("\n");
      const label = function (copied) {
        const zh = (window.__xskillLang || "") === "zh";
        if (copied) return zh ? "已复制" : "Copied";
        return zh ? "复制" : "Copy";
      };
      const done = function () {
        copyBtn.classList.add("is-done");
        copyBtn.textContent = label(true);
        setTimeout(function () {
          copyBtn.classList.remove("is-done");
          copyBtn.textContent = label(false);
        }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(cmd).then(done).catch(function () {
          window.prompt("Copy connect command:", cmd);
        });
      } else {
        window.prompt("Copy connect command:", cmd);
      }
    });
  }
})();
