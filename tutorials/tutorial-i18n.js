/* Tutorial section i18n — extends the main site's bilingual system */
(function () {
  "use strict";

  const TUT_I18N = {
    en: {
      "nav.home": "Home",
      "nav.wiki": "Wiki",
      "nav.tutorials": "Tutorials",
      "lang.en": "EN",
      "lang.zh": "中",
      "tut.sidebar_title": "Tutorials",
      "tut.back_wiki": "← Back to Wiki",
      "tut.back_home": "← Home",
      "tut.ch_a": "A: Agent Basics",
      "tut.a1": "Make Your First API Call",
      "tut.a2": "What is KV Cache",
      "tut.a3": "Cache Hit Rate",
      "tut.a4": "How Cache Influences Budget",
      "tut.ch_b": "B: Skill",
      "tut.b1": "What is a Skill",
      "tut.b2": "Skill Use Cases",
      "tut.ch_c": "C: xskill",
      "tut.c1": "What xskill Does",
      "tut.c2": "xskill for Developers",
      "tut.c3": "xskill for Production",
      "tut.index_title": "Tutorials",
      "tut.index_sub": "Progressive, hands-on guides to understand AI agents, caching, skills, and xskill.",
      "tut.prev": "← Previous",
      "tut.next": "Next →"
    },
    zh: {
      "nav.home": "首页",
      "nav.wiki": "文档",
      "nav.tutorials": "教程",
      "lang.en": "EN",
      "lang.zh": "中",
      "tut.sidebar_title": "教程目录",
      "tut.back_wiki": "← 回到文档",
      "tut.back_home": "← 首页",
      "tut.ch_a": "A: Agent 基础",
      "tut.a1": "发出你的第一个 API 请求",
      "tut.a2": "什么是 KV Cache",
      "tut.a3": "缓存命中率",
      "tut.a4": "缓存如何影响预算",
      "tut.ch_b": "B: Skill（技能）",
      "tut.b1": "什么是 Skill",
      "tut.b2": "Skill 使用场景",
      "tut.ch_c": "C: xskill",
      "tut.c1": "xskill 做什么",
      "tut.c2": "xskill 开发者指南",
      "tut.c3": "xskill 生产部署",
      "tut.index_title": "教程",
      "tut.index_sub": "循序渐进的实操指南：理解 AI Agent、缓存机制、技能概念与 xskill 系统。",
      "tut.prev": "← 上一篇",
      "tut.next": "下一篇 →"
    }
  };

  function detect() {
    const saved = localStorage.getItem("xskill_lang");
    if (saved === "en" || saved === "zh") return saved;
    return (navigator.language || "").toLowerCase().indexOf("zh") === 0 ? "zh" : "en";
  }

  function apply(lang) {
    const dict = TUT_I18N[lang] || TUT_I18N.en;
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      const v = dict[el.getAttribute("data-i18n")];
      if (v != null) el.textContent = v;
    });
    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      const v = dict[el.getAttribute("data-i18n-html")];
      if (v != null) el.innerHTML = v;
    });

    // bilingual content blocks
    document.querySelectorAll("[data-lang-content]").forEach(function (el) {
      el.classList.toggle("is-visible", el.getAttribute("data-lang-content") === lang);
    });

    // language buttons
    document.querySelectorAll("[data-set-lang]").forEach(function (b) {
      b.classList.toggle("is-on", b.getAttribute("data-set-lang") === lang);
    });

    // page title
    var titleKey = document.body.getAttribute("data-title-key");
    if (titleKey && dict[titleKey]) document.title = dict[titleKey];

    localStorage.setItem("xskill_lang", lang);
    window.__xskillLang = lang;
  }

  // sidebar collapse logic
  document.addEventListener("click", function (e) {
    var head = e.target.closest && e.target.closest(".tut-sidebar__chapter-head");
    if (head) {
      e.preventDefault();
      head.parentElement.classList.toggle("is-open");
      return;
    }
    var langBtn = e.target.closest && e.target.closest("[data-set-lang]");
    if (langBtn) {
      e.preventDefault();
      apply(langBtn.getAttribute("data-set-lang"));
    }
  });

  // open chapter containing active link
  document.querySelectorAll(".tut-sidebar__links a.is-active").forEach(function (a) {
    var ch = a.closest(".tut-sidebar__chapter");
    if (ch) ch.classList.add("is-open");
  });

  window.tutApplyLang = apply;
  window.tutDetectLang = detect;
  apply(detect());
})();
