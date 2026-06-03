/* ===========================================================
   Shared app logic: nav, theme, search, progress, scrollspy
   =========================================================== */
(function () {
  "use strict";

  /* ---- Single source of truth for all topics ---- */
  const TOPICS = [
    { g: "Foundations", items: [
      { id: "returns",       file: "returns.html",        n: 1,  ic: "%",  t: "Returns & Time Value of Money", d: "Simple vs log returns, compounding, present/future value, FX hedging." },
      { id: "timeseries",    file: "timeseries.html",     n: 2,  ic: "∿",  t: "Time Series & AR Models",        d: "Stationarity, autocorrelation, AR(1)/MA/ARMA, model selection." },
    ]},
    { g: "Markets & Microstructure", items: [
      { id: "markets",       file: "markets.html",        n: 3,  ic: "⇅",  t: "Markets & Behaviours",           d: "Efficient Market Hypothesis, instruments, stylised facts." },
      { id: "data",          file: "data-averages.html",  n: 4,  ic: "⌁",  t: "Data, Moving Averages, Time",     d: "SMA / WMA / EMA smoothing and intrinsic (event) time." },
      { id: "lob",           file: "lob.html",            n: 5,  ic: "▤",  t: "Limit Order Book",               d: "Bid/ask/spread/depth, order types, priority, Maslov model." },
      { id: "execution",     file: "execution.html",      n: 6,  ic: "▶",  t: "Algorithmic Execution",          d: "Market impact, TWAP/VWAP/POV/IS, efficient frontier." },
      { id: "abm",           file: "abm.html",            n: 8,  ic: "◴",  t: "Agent-Based Models",             d: "Cont-Bouchaud, Lux-Marchesi, the Minority Game." },
    ]},
    { g: "Portfolio", items: [
      { id: "portfolio",     file: "portfolio.html",      n: 7,  ic: "◷",  t: "Portfolio Construction (MPT)",   d: "Markowitz, covariance, efficient frontier, CML." },
    ]},
    { g: "Derivatives", items: [
      { id: "options",       file: "options-basics.html", n: 9,  ic: "⌥",  t: "Options — Basics",               d: "Payoffs, bounds, put-call parity, binomial tree, Black-Scholes." },
      { id: "greeks",        file: "greeks.html",         n: 10, ic: "Δ",  t: "Options — The Greeks",           d: "Delta, Gamma, Theta, Vega, Rho and delta/gamma hedging." },
      { id: "futures",       file: "futures.html",        n: 13, ic: "⇄",  t: "Futures & Forwards",             d: "Margins, cost-of-carry pricing, contango/backwardation." },
    ]},
    { g: "Fixed Income", items: [
      { id: "bonds",         file: "bonds-basics.html",   n: 11, ic: "₿",  t: "Bonds — Basics",                 d: "Valuation, yield, bootstrap zero curve, credit risk." },
      { id: "duration",      file: "bonds-duration.html", n: 12, ic: "↗",  t: "Bonds — Duration & Convexity",   d: "Forward rates, Macaulay/modified duration, convexity." },
    ]},
    { g: "Modern Topics", items: [
      { id: "esg",           file: "esg.html",            n: 14, ic: "♺",  t: "ESG / Sustainable Investing",    d: "Scoring, SDGs, carbon footprint, ESG strategies." },
      { id: "altdata",       file: "altdata.html",        n: 15, ic: "◇",  t: "Alternative Data",               d: "Satellite, social, transactions; the data process." },
    ]},
  ];

  const FLAT = TOPICS.flatMap(g => g.items);
  const KEY = "cf-revised-v1";
  const here = location.pathname.split("/").pop() || "index.html";

  /* ---- progress storage ---- */
  function getDone() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } }
  function setDone(o) { localStorage.setItem(KEY, JSON.stringify(o)); }
  function isDone(id) { return !!getDone()[id]; }
  function toggleDone(id) { const o = getDone(); o[id] = !o[id]; if (!o[id]) delete o[id]; setDone(o); reflect(); }

  /* ---- theme ---- */
  const TKEY = "cf-theme";
  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    document.querySelectorAll(".theme-label").forEach(e => e.textContent = t === "dark" ? "Light mode" : "Dark mode");
    document.querySelectorAll(".theme-ic-sun").forEach(e => e.style.display = t === "dark" ? "block" : "none");
    document.querySelectorAll(".theme-ic-moon").forEach(e => e.style.display = t === "dark" ? "none" : "block");
    window.dispatchEvent(new CustomEvent("themechange", { detail: t }));
  }
  (function initTheme() {
    let t = localStorage.getItem(TKEY);
    if (!t) t = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    applyTheme(t);
  })();
  function toggleTheme() {
    const t = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    localStorage.setItem(TKEY, t); applyTheme(t);
  }

  /* ---- icons ---- */
  const svg = (p, w) => `<svg width="${w||18}" height="${w||18}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
  const I = {
    search: svg('<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>', 16),
    check: svg('<polyline points="20 6 9 17 4 12"/>', 16),
    menu: svg('<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>'),
    moon: svg('<path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/>'),
    sun: svg('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
    up: svg('<line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>'),
    home: svg('<path d="M3 9.5 12 3l9 6.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>', 16),
  };

  /* ---- build sidebar ---- */
  function buildSidebar() {
    const nav = document.getElementById("nav");
    if (!nav) return;
    let html = "";
    TOPICS.forEach(group => {
      html += `<div class="nav-group-title">${group.g}</div>`;
      group.items.forEach(it => {
        const active = it.file === here ? " active" : "";
        html += `<a class="nav-link${active}" data-id="${it.id}" data-search="${(it.t + " " + it.d).toLowerCase()}" href="${it.file}">
          <span class="num">${String(it.n).padStart(2,'0')}</span>
          <span class="lbl">${it.t}</span>
          <span class="check">${I.check}</span></a>`;
      });
    });
    nav.innerHTML = html;
    document.querySelectorAll(".search-wrap svg").forEach(e => e.outerHTML = I.search);
  }

  /* ---- reflect progress into UI ---- */
  function reflect() {
    const done = getDone();
    document.querySelectorAll(".nav-link[data-id]").forEach(a => {
      a.classList.toggle("done", !!done[a.dataset.id]);
    });
    // home cards
    document.querySelectorAll(".tcard[data-id]").forEach(c => c.classList.toggle("done", !!done[c.dataset.id]));
    // dashboard
    const total = FLAT.length, n = FLAT.filter(t => done[t.id]).length;
    const pct = Math.round(100 * n / total);
    const pe = document.getElementById("dash-pct"); if (pe) pe.innerHTML = pct + '<span>%</span>';
    const ce = document.getElementById("dash-count"); if (ce) ce.textContent = `${n} of ${total} topics revised`;
    const be = document.getElementById("dash-bar"); if (be) be.style.width = pct + "%";
    // revise button on topic page
    const rb = document.getElementById("revise-btn");
    if (rb) {
      const d = !!done[rb.dataset.id];
      rb.classList.toggle("done-state", d);
      rb.querySelector(".lbl").textContent = d ? "Revised ✓ — click to unmark" : "Mark this topic as revised";
    }
  }

  /* ---- home page render ---- */
  function buildHome() {
    const grid = document.getElementById("home-cards");
    if (!grid) return;
    let html = "";
    TOPICS.forEach(group => {
      html += `<div class="group-head" style="grid-column:1/-1">${group.g}</div>`;
      group.items.forEach(it => {
        html += `<a class="tcard" data-id="${it.id}" data-search="${(it.t+' '+it.d).toLowerCase()}" href="${it.file}">
          <span class="tnum">${String(it.n).padStart(2,'0')}</span>
          <div class="ic">${it.ic}</div>
          <h4>${it.t}</h4><p>${it.d}</p>
          <span class="done-badge">${I.check} Revised</span></a>`;
      });
    });
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "repeat(auto-fill, minmax(244px, 1fr))";
    grid.style.gap = "16px";
    grid.innerHTML = html;
  }

  /* ---- prev / next ---- */
  function buildPageNav() {
    const el = document.getElementById("page-nav");
    if (!el) return;
    const i = FLAT.findIndex(t => t.file === here);
    if (i < 0) return;
    const prev = FLAT[i - 1], next = FLAT[i + 1];
    el.innerHTML =
      (prev ? `<a href="${prev.file}"><div class="dir">← Previous</div><div class="ttl">${prev.t}</div></a>` : `<a class="disabled"></a>`) +
      (next ? `<a class="next" href="${next.file}"><div class="dir">Next →</div><div class="ttl">${next.t}</div></a>` : `<a class="disabled"></a>`);
  }

  /* ---- search filter ---- */
  function wireSearch() {
    const inp = document.getElementById("nav-search");
    if (!inp) return;
    const run = () => {
      const q = inp.value.trim().toLowerCase();
      document.querySelectorAll(".nav-link[data-search]").forEach(a => {
        a.style.display = !q || a.dataset.search.includes(q) ? "" : "none";
      });
      document.querySelectorAll(".nav-group-title").forEach(t => {
        let sib = t.nextElementSibling, any = false;
        while (sib && sib.classList.contains("nav-link")) { if (sib.style.display !== "none") any = true; sib = sib.nextElementSibling; }
        t.style.display = any ? "" : "none";
      });
      // home cards
      document.querySelectorAll(".tcard[data-search]").forEach(c => {
        c.style.display = !q || c.dataset.search.includes(q) ? "" : "none";
      });
    };
    inp.addEventListener("input", run);
  }

  /* ---- scrollspy for on-page sections ---- */
  function wireScrollspy() {
    const links = document.querySelectorAll(".minitoc a[href^='#']");
    if (!links.length) return;
    const map = {};
    links.forEach(l => { const s = document.getElementById(l.getAttribute("href").slice(1)); if (s) map[l.getAttribute("href").slice(1)] = l; });
    const obs = new IntersectionObserver((es) => {
      es.forEach(e => { if (e.isIntersecting) {
        links.forEach(l => l.style.fontWeight = "");
        const l = map[e.target.id]; if (l) l.style.fontWeight = "750";
      }});
    }, { rootMargin: "-10% 0px -75% 0px" });
    Object.keys(map).forEach(id => { const s = document.getElementById(id); if (s) obs.observe(s); });
  }

  /* ---- back to top ---- */
  function wireToTop() {
    const b = document.getElementById("to-top");
    if (!b) return;
    addEventListener("scroll", () => b.classList.toggle("show", scrollY > 500), { passive: true });
    b.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));
  }

  /* ---- mobile nav ---- */
  function wireMobile() {
    const t = document.getElementById("menu-btn"), s = document.getElementById("scrim");
    if (t) t.addEventListener("click", () => document.body.classList.toggle("nav-open"));
    if (s) s.addEventListener("click", () => document.body.classList.remove("nav-open"));
    document.addEventListener("click", e => {
      if (e.target.closest(".nav-link")) document.body.classList.remove("nav-open");
    });
  }

  /* ---- init ---- */
  document.addEventListener("DOMContentLoaded", () => {
    buildSidebar(); buildHome(); buildPageNav();
    wireSearch(); wireScrollspy(); wireToTop(); wireMobile();
    document.querySelectorAll("[data-theme-toggle]").forEach(b => b.addEventListener("click", toggleTheme));
    const rb = document.getElementById("revise-btn");
    if (rb) rb.addEventListener("click", () => toggleDone(rb.dataset.id));
    const reset = document.getElementById("reset-progress");
    if (reset) reset.addEventListener("click", () => { if (confirm("Reset all revision progress?")) { setDone({}); reflect(); } });
    // inject accordion chevrons
    document.querySelectorAll("details.acc > summary").forEach(s => {
      if (!s.querySelector(".chev")) s.insertAdjacentHTML("beforeend",
        svg('<polyline points="6 9 12 15 18 9"/>', 17).replace("<svg", '<svg class="chev"'));
    });
    // inject theme icons
    document.querySelectorAll(".theme-ic-moon").forEach(e => e.innerHTML = I.moon);
    document.querySelectorAll(".theme-ic-sun").forEach(e => { e.innerHTML = I.sun; e.style.display = "none"; });
    document.querySelectorAll(".menu-ic").forEach(e => e.innerHTML = I.menu);
    document.querySelectorAll(".totop-ic").forEach(e => e.innerHTML = I.up);
    const t = document.documentElement.getAttribute("data-theme");
    applyTheme(t);
    reflect();
  });

  /* expose palette helper for charts */
  window.CF = {
    colors() {
      const s = getComputedStyle(document.documentElement);
      const g = n => s.getPropertyValue(n).trim();
      return {
        accent: g("--accent"), accent2: g("--accent-2"), good: g("--good"),
        warn: g("--warn"), bad: g("--bad"), how: g("--c-how"), ask: g("--c-ask"),
        text: g("--text"), textSoft: g("--text-soft"), grid: g("--border"),
        paper: "rgba(0,0,0,0)", mute: g("--text-mute")
      };
    },
    layout(extra) {
      const c = this.colors();
      return Object.assign({
        paper_bgcolor: c.paper, plot_bgcolor: c.paper,
        font: { family: "Inter, sans-serif", color: c.textSoft, size: 13 },
        margin: { l: 56, r: 22, t: 18, b: 48 },
        xaxis: { gridcolor: c.grid, zerolinecolor: c.grid, linecolor: c.grid },
        yaxis: { gridcolor: c.grid, zerolinecolor: c.grid, linecolor: c.grid },
        legend: { orientation: "h", y: 1.12, x: 0, font: { size: 12 } },
        hovermode: "x unified",
        colorway: [c.accent, c.bad, c.good, c.warn, c.how, c.accent2]
      }, extra || {});
    },
    config: { displayModeBar: false, responsive: true }
  };
})();
