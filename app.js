// app.js - Reactive Controller & UI Logic for The Adult Piano Companion

let currentTab = "philosophy";
let currentMode = "dual"; // "dual", "en", or "zh"
let searchQuery = "";
let currentCategory = "all";
let currentLevel = "all";
let currentCost = "all";


document.addEventListener("DOMContentLoaded", () => {
  // Restore language mode (default is "dual")
  const savedMode = localStorage.getItem("adult_piano_mode");
  if (savedMode && ["dual", "en", "zh"].includes(savedMode)) {
    currentMode = savedMode;
  } else {
    currentMode = "dual";
  }

  updateLanguageConfig();
  setupLanguageSwitcher();
  setupNavTabs();
  setupToolFilters();
  setupModal();

  applyLanguage();
  handleRoute();
  window.addEventListener("hashchange", handleRoute);
});

function updateLanguageConfig() {
  if (currentMode === "dual") {
    I18N.currentLang = "en";
    I18N.secondaryLang = "zh";
    document.body.classList.add("has-secondary-lang");
  } else if (currentMode === "zh") {
    I18N.currentLang = "zh";
    I18N.secondaryLang = null;
    document.body.classList.remove("has-secondary-lang");
  } else {
    I18N.currentLang = "en";
    I18N.secondaryLang = null;
    document.body.classList.remove("has-secondary-lang");
  }
}

// Setup Language Switcher (Dual / English / 中文)
function setupLanguageSwitcher() {
  document.querySelectorAll(".lang-btn[data-mode]").forEach(btn => {
    btn.addEventListener("click", () => {
      const mode = btn.dataset.mode;
      if (mode && ["dual", "en", "zh"].includes(mode)) {
        currentMode = mode;
        localStorage.setItem("adult_piano_mode", mode);
        updateLanguageConfig();
        applyLanguage();
      }
    });
  });
}

// Apply Language across static UI & dynamic components
function applyLanguage() {
  const l1 = I18N.currentLang;
  const l2 = I18N.secondaryLang;
  const t = I18N.ui[l1];

  // Update button active states
  document.querySelectorAll(".lang-btn[data-mode]").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.mode === currentMode);
  });

  // Update Header & Nav
  document.getElementById("site-badge").textContent = l2 
    ? "🎹 Self-Directed Adult Piano Guide • 成人钢琴自主研习指南" 
    : t.siteBadge;

  document.getElementById("site-title").textContent = l2
    ? "The Adult Piano Companion • 成人钢琴研习指南"
    : t.siteTitle;
  
  const subEl = document.getElementById("site-subtitle");
  if (l2) {
    subEl.innerHTML = `
      <span>A definitive guide and open tool matrix for adult learners — grounded in personal agency, deliberate practice, and self-directed mastery.</span>
      <br>
      <span style="opacity: 0.9; margin-top: 0.25rem; display: inline-block;">专为成年人打造的自主学琴指南与开放工具矩阵——扎根于第一人称心智原点、刻意练习与自我探索。</span>
      <div style="margin-top: 0.4rem;">
        <a href="https://powerpig99.github.io/not-a-toe/" target="_blank" rel="noopener noreferrer" class="blog-subtitle-link">Not a ToE</a> — 
        <a href="https://powerpig99.github.io/not-a-toe/posts/the-unobservable-driver-of-learning/" target="_blank" rel="noopener noreferrer" class="blog-subtitle-link">The Unobservable Driver of Learning / 《学习中不可观测的驱动力》</a>
      </div>
    `;
  } else {
    subEl.innerHTML = `${t.siteSubtitle} <a href="https://powerpig99.github.io/not-a-toe/" target="_blank" rel="noopener noreferrer" class="blog-subtitle-link">${t.blogSubtitleLink}</a> — ${t.blogSubtitleSuffix}`;
  }

  // Nav Tabs
  document.getElementById("tab-btn-philosophy").textContent = l2 ? "🌱 Philosophy • 核心心法" : t.navPhilosophy;
  document.getElementById("tab-btn-matrix").textContent = l2 ? "🧰 Tool Matrix • 工具全景" : t.navMatrix;
  document.getElementById("tab-btn-comparator").textContent = l2 ? "⚖️ Comparator • 路径对照" : t.navComparator;
  document.getElementById("tab-btn-practice").textContent = l2 ? "🧠 Practice • 练习架构" : t.navPractice;
  document.getElementById("tab-btn-repertoire").textContent = l2 ? "🎼 Repertoire • 进阶阶梯" : t.navRepertoire;
  const favBtn = document.getElementById("tab-btn-favorites");
  if (favBtn) {
    favBtn.textContent = l2 ? "❤️ Favorites • 挚爱资源" : t.navFavorites;
  }

  const favTitle = document.getElementById("favorites-section-title");
  if (favTitle) {
    favTitle.textContent = l2 ? "Resources I Enjoy & Aesthetic Inspirations • 挚爱资源与审美灵感" : t.favoritesTitle;
  }
  const favSub = document.getElementById("favorites-section-subtitle");
  if (favSub) {
    favSub.textContent = l2 
      ? "Beyond mechanical drills lies the true wellspring of music: the artists, arrangements, and channels that sustain genuine aesthetic joy and fuel daily deliberate practice. • 在枯燥的技术训练之外，音乐最深处的源头始终是打动心灵的声音。这里记录了我个人深为喜爱、持续带来审美滋养与练琴动力的自学典范、音乐家与频道。" 
      : t.favoritesSubtitle;
  }

  // Search & Filter Labels
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.placeholder = l2 
      ? "Search by tool, book, app, author, technique, or keyword • 搜索工具、图书、导师或技能..."
      : t.searchPlaceholder;
  }

  document.getElementById("filter-cat-all").textContent = l2 ? "All Categories • 全部类别" : t.filterAllCategories;
  document.getElementById("filter-cat-apps").textContent = l2 ? "Apps • 互动软件" : t.catApps;
  document.getElementById("filter-cat-scores").textContent = l2 ? "Scores • 乐谱阅读器" : t.catScores;
  document.getElementById("filter-cat-theory").textContent = l2 ? "Theory & Ear • 乐理与练耳" : t.catEarTheory;
  document.getElementById("filter-cat-youtube").textContent = l2 ? "YouTube • 顶尖导师" : t.catYouTube;
  document.getElementById("filter-cat-books").textContent = l2 ? "Books • 经典教材专著" : t.catBooks;
  document.getElementById("filter-cat-hardware").textContent = l2 ? "Hardware • 硬件工学" : t.catHardware;

  document.getElementById("filter-level-all").textContent = l2 ? "All Stages • 所有阶段" : t.filterLevelAll;
  document.getElementById("filter-level-beginner").textContent = l2 ? "Beginner • 零基础" : t.filterLevelBeginner;
  document.getElementById("filter-level-intermediate").textContent = l2 ? "Intermediate • 中级" : t.filterLevelIntermediate;
  document.getElementById("filter-level-advanced").textContent = l2 ? "Advanced • 高级" : t.filterLevelAdvanced;

  document.getElementById("filter-cost-all").textContent = l2 ? "All Cost • 所有费用" : t.filterCostAll;
  document.getElementById("filter-cost-free").textContent = l2 ? "Free / Open • 免费开源" : t.filterCostFree;
  document.getElementById("filter-cost-paid").textContent = l2 ? "Paid / Sub • 付费订阅" : t.filterCostPaid;

  // Footer
  if (l2) {
    document.getElementById("footer-quote").innerHTML = `
      <div>“Ability is the accumulated loop of chosen relation, not a fixed endowment. Tools remain secondary scaffolding; learning is the non-transferable physical friction (+1) generated from within.”</div>
      <div style="font-size: 0.9em; margin-top: 0.4rem; opacity: 0.85;">“能力是个体所一再选择的关系立场所积累的回路，而非某种先天的恒定禀赋。工具始终只是次生的脚手架；学习是不可外包的肉身体验与物理摩擦（+1）。”</div>
    `;
    document.getElementById("footer-note").textContent = "The Adult Piano Companion • 成人钢琴研习指南 • An open, independent research project on adult self-directed musicianship.";
  } else {
    document.getElementById("footer-quote").textContent = t.footerQuote;
    document.getElementById("footer-note").textContent = t.footerNote;
  }

  // Re-render current active tab content
  renderActiveTab();
}

// Navigation Tabs
function setupNavTabs() {
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const tab = btn.dataset.tab;
      if (tab) {
        window.location.hash = `#${tab}`;
      }
    });
  });
}

function handleRoute() {
  const hash = window.location.hash.replace("#", "") || "philosophy";
  if (hash.startsWith("tool-")) {
    const toolId = hash.replace("tool-", "");
    openToolModal(toolId);
    return;
  }

  const validTabs = ["philosophy", "matrix", "comparator", "practice", "repertoire", "favorites"];
  currentTab = validTabs.includes(hash) ? hash : "philosophy";

  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.tab === currentTab);
  });

  document.querySelectorAll(".tab-pane").forEach(pane => {
    pane.classList.toggle("active", pane.id === `tab-${currentTab}`);
  });

  renderActiveTab();
}

function renderActiveTab() {
  switch (currentTab) {
    case "philosophy":
      renderPhilosophy();
      break;
    case "matrix":
      renderToolMatrix();
      break;
    case "comparator":
      renderComparator();
      break;
    case "practice":
      renderPractice();
      break;
    case "repertoire":
      renderRepertoire();
      break;
    case "favorites":
      renderFavorites();
      break;
  }
}

// Helper: Bilingual rendering without any language tags/badges
function renderBilingualText(obj) {
  if (!obj) return "";
  const l1 = I18N.currentLang;
  const l2 = I18N.secondaryLang;

  const t1 = typeof obj === "string" ? obj : (obj[l1] || obj.en || "");
  if (!l2 || l1 === l2) {
    return t1;
  }
  const t2 = typeof obj === "string" ? obj : (obj[l2] || obj.en || "");

  return `
    <div class="bilingual-grid">
      <div class="bilingual-col-primary">
        <div>${t1}</div>
      </div>
      <div class="bilingual-col-secondary">
        <div>${t2}</div>
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// TAB 1: Philosophy Rendering
// -------------------------------------------------------------
function renderPhilosophy() {
  const container = document.getElementById("philosophy-content");
  if (!container) return;

  const l1 = I18N.currentLang;
  const l2 = I18N.secondaryLang;
  const p = I18N.philosophy;

  let heroHtml = "";
  if (!l2 || l1 === l2) {
    heroHtml = `
      <div class="philosophy-hero-card">
        <h2>${p.hero[l1].headline}</h2>
        <p class="lead">${p.hero[l1].subheadline}</p>
        <div class="philosophy-quote-box">${p.hero[l1].quote}</div>
      </div>
    `;
  } else {
    heroHtml = `
      <div class="philosophy-hero-card">
        <div class="bilingual-grid">
          <div class="bilingual-col-primary">
            <h2>${p.hero[l1].headline}</h2>
            <p class="lead">${p.hero[l1].subheadline}</p>
            <div class="philosophy-quote-box">${p.hero[l1].quote}</div>
          </div>
          <div class="bilingual-col-secondary">
            <h2>${p.hero[l2].headline}</h2>
            <p class="lead">${p.hero[l2].subheadline}</p>
            <div class="philosophy-quote-box">${p.hero[l2].quote}</div>
          </div>
        </div>
      </div>
    `;
  }

  const sectionsHtml = p.sections.map(sec => {
    const titleHtml = renderBilingualText(sec.title);
    let bodyHtml = "";
    if (!l2 || l1 === l2) {
      bodyHtml = sec.content[l1];
    } else {
      bodyHtml = `
        <div class="bilingual-grid">
          <div class="bilingual-col-primary">
            <div>${sec.content[l1]}</div>
          </div>
          <div class="bilingual-col-secondary">
            <div>${sec.content[l2]}</div>
          </div>
        </div>
      `;
    }

    return `
      <article class="philosophy-article">
        <h3>${titleHtml}</h3>
        ${bodyHtml}
      </article>
    `;
  }).join("");

  container.innerHTML = heroHtml + sectionsHtml;
}

// -------------------------------------------------------------
// TAB 2: Tool Matrix Rendering
// -------------------------------------------------------------
function setupToolFilters() {
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      renderToolMatrix();
    });
  }

  document.querySelectorAll("[data-cat]").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-cat]").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentCategory = btn.dataset.cat;
      renderToolMatrix();
    });
  });

  document.querySelectorAll("[data-level]").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-level]").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentLevel = btn.dataset.level;
      renderToolMatrix();
    });
  });

  document.querySelectorAll("[data-cost]").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-cost]").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentCost = btn.dataset.cost;
      renderToolMatrix();
    });
  });
}

function renderToolMatrix() {
  const grid = document.getElementById("tool-grid");
  const countEl = document.getElementById("tool-count");
  if (!grid) return;

  const l1 = I18N.currentLang;
  const l2 = I18N.secondaryLang;
  const t = I18N.ui[l1];

  const filtered = I18N.tools.filter(item => {
    if (currentCategory !== "all" && item.category !== currentCategory) return false;
    if (currentLevel !== "all" && item.level !== currentLevel && item.level !== "all") return false;
    if (currentCost !== "all" && item.cost !== currentCost) return false;
    if (searchQuery) {
      const title1 = (item.title[l1] || "").toLowerCase();
      const title2 = (item.title.en || "").toLowerCase();
      const titleZh = (item.title.zh || "").toLowerCase();
      const name = item.name.toLowerCase();
      const tags = (item.tags || []).join(" ").toLowerCase();
      const summary1 = (item.summary[l1] || "").toLowerCase();
      const summary2 = (item.summary.en || "").toLowerCase();
      const match = title1.includes(searchQuery) || title2.includes(searchQuery) || titleZh.includes(searchQuery) ||
                    name.includes(searchQuery) || tags.includes(searchQuery) || summary1.includes(searchQuery) || summary2.includes(searchQuery);
      if (!match) return false;
    }
    return true;
  });

  if (countEl) {
    countEl.textContent = l2 
      ? `Showing ${filtered.length} curated resources • 展示 ${filtered.length} 项精选研习工具` 
      : t.resultsCount.replace("{count}", filtered.length);
  }

  if (filtered.length === 0) {
    grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--ink-muted); font-size: 1.1rem;">${t.noResults}</div>`;
    return;
  }

  grid.innerHTML = filtered.map(tool => {
    const titleHtml = renderBilingualText(tool.title);
    const summaryHtml = renderBilingualText(tool.summary);
    const strengthsHtml = renderBilingualText(tool.strengths);

    const badgeClass = tool.cost === "free" ? "badge-free" : "badge-paid";
    const badgeLabel = tool.cost === "free" 
      ? (l2 ? "Free • 免费" : (l1 === "zh" ? "免费" : "Free")) 
      : (l2 ? "Paid • 付费" : (l1 === "zh" ? "付费" : "Paid"));

    const tagsHtml = (tool.tags || []).map(tag => `<span class="tool-tag">${tag}</span>`).join("");
    const platformsHtml = (tool.platforms || []).map(p => `<span>${p}</span>`).join(" • ");

    const strengthsLabel = l2 ? "Key Strengths • 核心优势" : t.keyStrengths;
    const cardTitleHint = l1 === "zh" ? "点击查看深度剖析与建议" : "Click to view details & breakdown";

    return `
      <div class="tool-card clickable-card" onclick="openToolModal('${tool.id}')" role="button" tabindex="0" onkeydown="if(event.key==='Enter'||event.key===' ')openToolModal('${tool.id}')" title="${cardTitleHint}">
        <div class="tool-card-header">
          <h4 class="tool-card-title">${tool.name}</h4>
          <span class="tool-badge-pill ${badgeClass}">${badgeLabel}</span>
        </div>
        <div class="tool-tag-row">${tagsHtml}</div>
        <div style="font-size: 0.95rem; font-weight: 600; color: var(--accent-bronze-dark); margin-bottom: 0.5rem;">
          ${titleHtml}
        </div>
        <div class="tool-summary">${summaryHtml}</div>
        <div class="tool-highlights-box">
          <strong>${strengthsLabel}</strong>
          ${strengthsHtml}
        </div>
        <div class="tool-card-footer">
          <div class="platform-icons">${platformsHtml}</div>
          <span class="card-open-hint" aria-hidden="true">↗</span>
        </div>
      </div>
    `;
  }).join("");
}

// -------------------------------------------------------------
// TAB 3: Comparator Rendering
// -------------------------------------------------------------
function renderComparator() {
  const container = document.getElementById("comparator-content");
  if (!container) return;

  const l1 = I18N.currentLang;
  const l2 = I18N.secondaryLang;
  const t = I18N.ui[l1];

  container.innerHTML = I18N.comparators.map(c => {
    const topicText = renderBilingualText(c.topic);
    const overviewText = renderBilingualText(c.overview);

    const leftTitle = l2 ? `${c.left.title.en} • ${c.left.title.zh}` : (c.left.title[l1] || c.left.title.en);
    const rightTitle = l2 ? `${c.right.title.en} • ${c.right.title.zh}` : (c.right.title[l1] || c.right.title.en);

    const leftPros = (c.left.pros[l1] || c.left.pros.en).map((p, idx) => {
      if (l2 && c.left.pros[l2] && c.left.pros[l2][idx]) {
        return `<li><div>${p}</div><div style="color: var(--ink-muted); font-size: 0.9em; margin-top: 2px;">${c.left.pros[l2][idx]}</div></li>`;
      }
      return `<li>${p}</li>`;
    }).join("");

    const leftCons = (c.left.cons[l1] || c.left.cons.en).map((p, idx) => {
      if (l2 && c.left.cons[l2] && c.left.cons[l2][idx]) {
        return `<li><div>${p}</div><div style="color: var(--ink-muted); font-size: 0.9em; margin-top: 2px;">${c.left.cons[l2][idx]}</div></li>`;
      }
      return `<li>${p}</li>`;
    }).join("");

    const rightPros = (c.right.pros[l1] || c.right.pros.en).map((p, idx) => {
      if (l2 && c.right.pros[l2] && c.right.pros[l2][idx]) {
        return `<li><div>${p}</div><div style="color: var(--ink-muted); font-size: 0.9em; margin-top: 2px;">${c.right.pros[l2][idx]}</div></li>`;
      }
      return `<li>${p}</li>`;
    }).join("");

    const rightCons = (c.right.cons[l1] || c.right.cons.en).map((p, idx) => {
      if (l2 && c.right.cons[l2] && c.right.cons[l2][idx]) {
        return `<li><div>${p}</div><div style="color: var(--ink-muted); font-size: 0.9em; margin-top: 2px;">${c.right.cons[l2][idx]}</div></li>`;
      }
      return `<li>${p}</li>`;
    }).join("");

    const verdictText = renderBilingualText(c.verdict);
    const verdictHeading = l2 ? "Pedagogical Verdict • 核心研习裁决" : (l1 === "zh" ? "核心研习裁决" : "Core Pedagogical Verdict");

    return `
      <div class="comparator-card">
        <div class="comparator-header">
          <h3 class="comparator-topic">${topicText}</h3>
          <div class="comparator-overview">${overviewText}</div>
        </div>
        <div class="comparator-duel-grid">
          <div class="duel-column">
            <h4 class="duel-title">⚖️ ${leftTitle}</h4>
            <ul class="duel-list pros">${leftPros}</ul>
            <div style="height: 12px;"></div>
            <ul class="duel-list cons">${leftCons}</ul>
          </div>
          <div class="duel-column">
            <h4 class="duel-title">⚖️ ${rightTitle}</h4>
            <ul class="duel-list pros">${rightPros}</ul>
            <div style="height: 12px;"></div>
            <ul class="duel-list cons">${rightCons}</ul>
          </div>
        </div>
        <div class="comparator-verdict">
          <div class="verdict-heading">🎯 ${verdictHeading}</div>
          <div class="verdict-text">${verdictText}</div>
        </div>
      </div>
    `;
  }).join("");
}

// -------------------------------------------------------------
// TAB 4: Practice Architecture Rendering
// -------------------------------------------------------------
function renderPractice() {
  const container = document.getElementById("practice-content");
  if (!container) return;

  const l1 = I18N.currentLang;
  const l2 = I18N.secondaryLang;
  const p = I18N.practiceArchitecture;

  let goldenPrincipleHtml = "";
  if (p.goldenPrinciple) {
    const gp = p.goldenPrinciple;
    const tagText = renderBilingualText(gp.tag);
    const titleText = renderBilingualText(gp.title);
    const subText = renderBilingualText(gp.subtitle);
    const quoteText = renderBilingualText(gp.litmusQuote);

    const pillarsHtml = gp.pillars.map(pillar => {
      const pName = renderBilingualText(pillar.name);
      const pDesc = renderBilingualText(pillar.desc);
      return `
        <div class="principle-pillar-card">
          <div class="pillar-badge">${pillar.badge}</div>
          <h4 class="pillar-title">${pName}</h4>
          <div class="pillar-desc">${pDesc}</div>
        </div>
      `;
    }).join("");

    goldenPrincipleHtml = `
      <div class="practice-golden-banner">
        <div class="principle-header">
          <span class="principle-tag">${tagText}</span>
          <h3 class="principle-title">${titleText}</h3>
          <p class="principle-subtitle">${subText}</p>
        </div>
        <div class="principle-pillars-grid">
          ${pillarsHtml}
        </div>
        <div class="principle-litmus-box">
          <div class="litmus-icon">⚖️</div>
          <div class="litmus-content">
            <div class="litmus-quote">${quoteText}</div>
          </div>
        </div>
      </div>
    `;
  }

  const cycleCards = p.cycleStages.map(stage => {
    const nameText = renderBilingualText(stage.name);
    const descText = renderBilingualText(stage.desc);

    return `
      <div class="cycle-step-card">
        <div class="cycle-step-number">${stage.step}</div>
        <h4 class="cycle-step-title">${nameText}</h4>
        <div class="cycle-step-desc">${descText}</div>
      </div>
    `;
  }).join("");

  const blueprintCards = p.blueprints.map(bp => {
    const titleText = renderBilingualText(bp.title);
    const itemsHtml = bp.schedule.map(item => {
      const actText = renderBilingualText(item.activity);
      return `
        <div class="timeline-item">
          <div class="timeline-time">${item.duration}</div>
          <div class="timeline-activity" style="flex-grow: 1;">${actText}</div>
        </div>
      `;
    }).join("");

    return `
      <div class="blueprint-card">
        <div class="blueprint-header">
          <div class="blueprint-badge">${bp.time}</div>
          <h4 class="blueprint-title" style="margin: 0;">${titleText}</h4>
        </div>
        <div class="blueprint-timeline">${itemsHtml}</div>
      </div>
    `;
  }).join("");

  const cycleHeading = l2
    ? "🔄 The 4-Stage Deliberate Practice Cycle • 四阶刻意练习闭环"
    : (l1 === "zh" ? "🔄 四阶刻意练习闭环" : "🔄 The 4-Stage Deliberate Practice Cycle");

  const blueprintsHeading = l2 
    ? "⏱️ Time-Boxed Daily Practice Blueprints • 时间盒练习蓝图（每日节奏）" 
    : (l1 === "zh" ? "⏱️ 时间盒练习蓝图（每日节奏）" : "⏱️ Time-Boxed Daily Practice Blueprints");

  container.innerHTML = `
    ${goldenPrincipleHtml}
    <div class="practice-cycle-section" style="margin-top: 2.5rem;">
      <h3 style="font-family: 'Playfair Display', Georgia, serif; font-size: 1.65rem; margin-bottom: 1.25rem; color: var(--ink-primary);">
        ${cycleHeading}
      </h3>
      <div class="practice-cycle-grid">${cycleCards}</div>
    </div>
    <div class="blueprint-container">
      <h3 style="font-family: 'Playfair Display', Georgia, serif; font-size: 1.65rem; margin-bottom: 1.25rem; color: var(--ink-primary);">
        ${blueprintsHeading}
      </h3>
      ${blueprintCards}
    </div>
  `;
}

// -------------------------------------------------------------
// TAB 5: Repertoire Ladder Rendering
// -------------------------------------------------------------
function renderRepertoire() {
  const container = document.getElementById("repertoire-content");
  if (!container) return;

  const l1 = I18N.currentLang;
  const l2 = I18N.secondaryLang;

  container.innerHTML = I18N.repertoire.map(level => {
    const titleText = renderBilingualText(level.title);
    const subText = renderBilingualText(level.subtitle);

    const piecesHtml = level.pieces.map(piece => {
      const focusText = renderBilingualText(piece.focus);
      const tipsText = renderBilingualText(piece.tips);

      const focusLabel = l2 ? "Technical Focus • 技术着力点" : (l1 === "zh" ? "技术着力点" : "Technical Focus");
      const tipLabel = l2 ? "Mastery Tip • 演奏心法" : (l1 === "zh" ? "演奏心法" : "Mastery Tip");

      return `
        <div class="piece-card">
          <div class="piece-title">${piece.name}</div>
          <div class="piece-composer">🎼 ${piece.composer}</div>
          <div class="piece-detail-row">
            <strong>${focusLabel}: </strong>
            <div style="margin-top: 4px;">${focusText}</div>
          </div>
          <div class="piece-tip-box">
            💡 <strong>${tipLabel}:</strong>
            <div style="margin-top: 4px;">${tipsText}</div>
          </div>
        </div>
      `;
    }).join("");

    return `
      <div class="ladder-level-card">
        <div class="ladder-header">
          <div class="level-indicator">${level.level}</div>
          <div class="level-titles" style="flex-grow: 1;">
            <h3>${titleText}</h3>
            <div style="margin-top: 4px;">${subText}</div>
          </div>
        </div>
        <div class="repertoire-pieces-grid">${piecesHtml}</div>
      </div>
    `;
  }).join("");
}

// -------------------------------------------------------------
// TAB 6: Resources I Enjoy & Aesthetic Inspirations
// -------------------------------------------------------------
function renderFavorites() {
  const container = document.getElementById("favorites-content");
  if (!container) return;

  const l1 = I18N.currentLang;
  const l2 = I18N.secondaryLang;
  const t = I18N.ui[l1];

  const items = I18N.enjoyedResources || [];

  container.innerHTML = `
    <div class="favorites-grid">
      ${items.map(res => {
        const roleHtml = renderBilingualText(res.role);
        const descHtml = renderBilingualText(res.description);
        const whyHtml = renderBilingualText(res.whyIEnjoy);
        const highlightsHtml = renderBilingualText(res.highlights);
        const takeawayHtml = renderBilingualText(res.takeaway);

        const whyLabel = l2 ? "Why I Deeply Enjoy This • 为何深爱此资源" : (t.favoritesWhyEnjoy || "Why I Enjoy This");
        const highLabel = l2 ? "Signature Highlights & Works • 亮点特色与代表作" : (t.favoritesHighlights || "Signature Highlights");
        const takeLabel = l2 ? "Insight for Adult Learners • 予成年研习者的启示" : (t.favoritesTakeaway || "Insight for Adult Learners");
        const favCardHint = l1 === "zh" ? "点击访问官方频道与精选作品 ↗" : "Click to visit channel & works ↗";

        return `
          <div class="favorite-card clickable-card" onclick="window.open('${res.link}', '_blank')" role="button" tabindex="0" onkeydown="if(event.key==='Enter'||event.key===' ')window.open('${res.link}', '_blank')" title="${favCardHint}">
            <div class="favorite-header">
              <div>
                <h3 class="favorite-author-name">${res.name}</h3>
                <div class="favorite-channel-handle">${res.channel}</div>
              </div>
              <span class="card-open-hint" aria-hidden="true">↗</span>
            </div>

            <div class="favorite-role-box">
              ${roleHtml}
            </div>

            <div class="favorite-tags-bar">
              ${res.tags.map(tag => `<span class="favorite-tag">${tag}</span>`).join("")}
            </div>

            <div class="favorite-description-box">
              ${descHtml}
            </div>

            <div class="favorite-why-box">
              <div class="favorite-subheading">
                <span>❤️</span> <strong>${whyLabel}</strong>
              </div>
              <div class="favorite-subcontent">
                ${whyHtml}
              </div>
            </div>

            <div class="favorite-meta-grid">
              <div class="favorite-meta-col">
                <div class="favorite-subheading">
                  <span>✨</span> <strong>${highLabel}</strong>
                </div>
                <div class="favorite-subcontent">
                  ${highlightsHtml}
                </div>
              </div>

              <div class="favorite-meta-col">
                <div class="favorite-subheading">
                  <span>💡</span> <strong>${takeLabel}</strong>
                </div>
                <div class="favorite-subcontent">
                  ${takeawayHtml}
                </div>
              </div>
            </div>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

// -------------------------------------------------------------
// Modal Tool Detail Drawer
// -------------------------------------------------------------
function setupModal() {
  const overlay = document.getElementById("tool-modal-overlay");
  const closeBtn = document.getElementById("tool-modal-close");

  if (overlay) {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeToolModal();
    });
  }
  if (closeBtn) {
    closeBtn.addEventListener("click", closeToolModal);
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeToolModal();
  });
}

function openToolModal(toolId) {
  const tool = I18N.tools.find(t => t.id === toolId);
  if (!tool) return;

  const l1 = I18N.currentLang;
  const l2 = I18N.secondaryLang;
  const t = I18N.ui[l1];

  const modalBody = document.getElementById("tool-modal-body");
  const overlay = document.getElementById("tool-modal-overlay");

  const titleText = renderBilingualText(tool.title);
  const summaryText = renderBilingualText(tool.summary);
  const strengthsText = renderBilingualText(tool.strengths);
  const caveatsText = renderBilingualText(tool.caveats);
  const synergyText = renderBilingualText(tool.synergy);

  const tagsHtml = (tool.tags || []).map(tag => `<span class="tool-tag">${tag}</span>`).join("");
  const platformsText = (tool.platforms || []).join(", ");

  const badgeClass = tool.cost === "free" ? "badge-free" : "badge-paid";
  const badgeLabel = tool.cost === "free" 
    ? (l2 ? "Free • 免费" : (l1 === "zh" ? "免费" : "Free")) 
    : (l2 ? "Paid • 付费" : (l1 === "zh" ? "付费" : "Paid"));

  const keyStrengthsLabel = l2 ? "Key Strengths • 核心优势" : t.keyStrengths;
  const caveatsLabel = l2 ? "Critical Caveats • 警惕误区" : t.criticalCaveats;
  const synergyLabel = l2 ? "Recommended Practice Synergy • 推荐练习搭配" : t.bestSynergy;
  const platformLabel = l2 ? "Platforms • 支持平台：" : (l1 === "zh" ? "支持平台：" : "Platforms: ");
  const officialLinkLabel = l2 ? "Visit Resource • 访问官网 ↗" : `${t.officialLink} ↗`;

  modalBody.innerHTML = `
    <div style="margin-bottom: 1.25rem;">
      <span class="tool-badge-pill ${badgeClass}">${badgeLabel}</span>
      <h3 style="font-family: 'Playfair Display', Georgia, serif; font-size: 1.65rem; color: var(--ink-primary); margin: 0.5rem 0 0.25rem;">
        ${tool.name}
      </h3>
      <div style="font-size: 0.95rem; color: var(--accent-bronze-dark); font-weight: 600; margin-bottom: 0.75rem;">
        ${titleText}
      </div>
      <div class="tool-tag-row">${tagsHtml}</div>
    </div>

    <div style="margin-bottom: 1.5rem; font-size: 1rem; color: var(--ink-secondary); line-height: 1.6;">
      ${summaryText}
    </div>

    <div style="margin-bottom: 1.25rem; background: var(--bg); padding: 1.1rem; border-radius: var(--radius-md); border: 1px solid var(--border);">
      <h4 style="font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--badge-green); margin-bottom: 0.4rem;">
        ✅ ${keyStrengthsLabel}
      </h4>
      <div style="font-size: 0.95rem; color: var(--ink-primary);">${strengthsText}</div>
    </div>

    <div style="margin-bottom: 1.25rem; background: var(--bg); padding: 1.1rem; border-radius: var(--radius-md); border: 1px solid var(--border);">
      <h4 style="font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; color: #dc2626; margin-bottom: 0.4rem;">
        ⚠️ ${caveatsLabel}
      </h4>
      <div style="font-size: 0.95rem; color: var(--ink-primary);">${caveatsText}</div>
    </div>

    <div style="margin-bottom: 1.5rem; background: var(--accent-bronze-light); padding: 1.1rem; border-radius: var(--radius-md); border-left: 4px solid var(--accent-bronze);">
      <h4 style="font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--accent-bronze-dark); margin-bottom: 0.4rem;">
        💡 ${synergyLabel}
      </h4>
      <div style="font-size: 0.95rem; color: var(--ink-primary);">${synergyText}</div>
    </div>

    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border); padding-top: 1rem; flex-wrap: wrap; gap: 0.75rem;">
      <div style="font-size: 0.85rem; color: var(--ink-muted);">
        <strong>${platformLabel}</strong>${platformsText}
      </div>
      <a href="${tool.link}" target="_blank" rel="noopener noreferrer" class="pill-btn active" style="text-decoration: none; display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.5rem 1.1rem;">
        ${officialLinkLabel}
      </a>
    </div>
  `;

  overlay.style.display = "flex";
  document.body.style.overflow = "hidden";
}

function closeToolModal() {
  const overlay = document.getElementById("tool-modal-overlay");
  if (overlay) overlay.style.display = "none";
  document.body.style.overflow = "auto";
  if (window.location.hash.startsWith("#tool-")) {
    window.location.hash = `#${currentTab}`;
  }
}
