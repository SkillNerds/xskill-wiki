/* xskill wiki — sidebar active-section highlight + section reveal */
(function () {
  "use strict";
  const links = Array.prototype.slice.call(document.querySelectorAll(".wiki-toc nav a"));
  const map = {};
  links.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });

  const spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      links.forEach(function (a) { a.classList.remove("is-active"); });
      const a = map[e.target.id];
      if (a) a.classList.add("is-active");
    });
  }, { rootMargin: "-20% 0px -70% 0px", threshold: 0 });

  document.querySelectorAll(".doc-sec").forEach(function (s) { spy.observe(s); });

  const rev = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("in"); rev.unobserve(e.target); }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll(".doc-sec").forEach(function (s) { s.classList.add("reveal"); rev.observe(s); });
})();
