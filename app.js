/* ============================================
   xuan905 Skills — 互動腳本
   ============================================ */
(function () {
  'use strict';

  // ── State ──────────────────────────────────────
  let currentLang = 'zh-TW';
  let currentCat = 'all';

  // ── I18n ──────────────────────────────────────
  const T = {
    'zh-TW': {
      'hero.badge': 'OpenClaw 技能展示',
      'hero.title': '你的 AI 技能中心',
      'hero.desc': '收錄多元 AI 技能，從東方哲學到西方信仰，從圖書管理到創意工具。<br>安裝一個，改變你與 AI 的互動方式。',
      'hero.btnBrowse': '探索全部技能',
      'hero.btnClawhub': 'ClawHub 市場',
      'hero.statSkills': '精選技能',
      'hero.statCats': '分類',
      'hero.statLang': '語言',
      'skills.eyebrow': '✦ OpenClaw Skills',
      'skills.title': '全部技能',
      'skills.desc': '點擊名稱查看詳情，點擊按鈕直接安裝',
      'skills.catAll': '全部',
      'skills.catPhilosophy': '🌿 哲學・信仰',
      'skills.catKnowledge': '📚 知識・學習',
      'skills.catLife': '🎵 生活・創意',
      'skills.catTools': '🛠️ 工具・系統',
      'about.title': '關於這個專案',
      'about.card1Title': 'OpenClaw 技能系統',
      'about.card1Desc': 'Skills 是 OpenClaw 的擴充模組，讓 AI 助手具備專業領域知識、工具與工作流程，觸發簡單，威力強大。',
      'about.card2Title': 'ClawHub 生態',
      'about.card2Desc': '所有技能均收錄於 ClawHub 市場，可一鍵安裝、即時啟用，支援作者訂閱與社群貢獻。',
      'about.card3Title': '持續擴充中',
      'about.card3Desc': 'xuan905 持續開發新技能，涵蓋教育、健康、創作、生產力等多元領域。敬請期待更多作品。',
      'footer.sub': 'OpenClaw Skill Developer',
      'footer.github': 'GitHub',
      'footer.clawhub': 'ClawHub',
      'footer.laozi': '老子AI',
      'footer.quote': '「道可道，非常道」',
      'modal.install': '安裝',
      'modal.github': 'GitHub',
      'modal.site': '官方網站',
      'modal.detail': '詳情',
      'noInstall': '即將上線',
      'noSite': '—',
      'pageTitle': 'xuan905 Skills · OpenClaw 技能中心',
    },
    'zh-CN': {
      'hero.badge': 'OpenClaw 技能展示',
      'hero.title': '你的 AI 技能中心',
      'hero.desc': '收录多元 AI 技能，从东方哲学到西方信仰，从图书管理到创意工具。<br>安装一个，改变你与 AI 的互动方式。',
      'hero.btnBrowse': '探索全部技能',
      'hero.btnClawhub': 'ClawHub 市场',
      'hero.statSkills': '精选技能',
      'hero.statCats': '分类',
      'hero.statLang': '语言',
      'skills.eyebrow': '✦ OpenClaw Skills',
      'skills.title': '全部技能',
      'skills.desc': '点击名称查看详情，点击按钮直接安装',
      'skills.catAll': '全部',
      'skills.catPhilosophy': '🌿 哲学・信仰',
      'skills.catKnowledge': '📚 知识・学习',
      'skills.catLife': '🎵 生活・创意',
      'skills.catTools': '🛠️ 工具・系统',
      'about.title': '关于这个项目',
      'about.card1Title': 'OpenClaw 技能系统',
      'about.card1Desc': 'Skills 是 OpenClaw 的扩充模块，让 AI 助手具备专业领域知识、工具与工作流程，触发简单，威力强大。',
      'about.card2Title': 'ClawHub 生态',
      'about.card2Desc': '所有技能均收录于 ClawHub 市场，可一键安装、即时启用，支持作者订阅与社群贡献。',
      'about.card3Title': '持续扩充中',
      'about.card3Desc': 'xuan905 持续开发新技能，涵盖教育、健康、创作、生产力等多元领域。敬请期待更多作品。',
      'footer.sub': 'OpenClaw Skill Developer',
      'footer.github': 'GitHub',
      'footer.clawhub': 'ClawHub',
      'footer.laozi': '老子AI',
      'footer.quote': '「道可道，非常道」',
      'modal.install': '安装',
      'modal.github': 'GitHub',
      'modal.site': '官方网站',
      'modal.detail': '详情',
      'noInstall': '即将上线',
      'noSite': '—',
      'pageTitle': 'xuan905 Skills · OpenClaw 技能中心',
    },
    'en': {
      'hero.badge': 'OpenClaw Skill Showcase',
      'hero.title': 'Your AI Skills Hub',
      'hero.desc': 'From Eastern philosophy to Western faith, from library management to creative tools —<br>discover skills that transform how you interact with AI.',
      'hero.btnBrowse': 'Browse All Skills',
      'hero.btnClawhub': 'ClawHub Marketplace',
      'hero.statSkills': 'Featured Skills',
      'hero.statCats': 'Categories',
      'hero.statLang': 'Languages',
      'skills.eyebrow': '✦ OpenClaw Skills',
      'skills.title': 'All Skills',
      'skills.desc': 'Click a name to view details, or install directly',
      'skills.catAll': 'All',
      'skills.catPhilosophy': '🌿 Philosophy & Faith',
      'skills.catKnowledge': '📚 Knowledge & Learning',
      'skills.catLife': '🎵 Life & Creative',
      'skills.catTools': '🛠️ Tools & Systems',
      'about.title': 'About This Project',
      'about.card1Title': 'OpenClaw Skills System',
      'about.card1Desc': 'Skills are OpenClaw extensions that give your AI assistant professional knowledge, tools, and workflows. Easy to trigger, powerful in practice.',
      'about.card2Title': 'ClawHub Ecosystem',
      'about.card2Desc': 'All skills are listed on ClawHub marketplace — one-click install, instant activation. Supports author subscriptions and community contributions.',
      'about.card3Title': 'Always Growing',
      'about.card3Desc': 'xuan905 continuously develops new skills covering education, health, creativity, productivity and more. Stay tuned for upcoming releases.',
      'footer.sub': 'OpenClaw Skill Developer',
      'footer.github': 'GitHub',
      'footer.clawhub': 'ClawHub',
      'footer.laozi': 'Laozi AI',
      'footer.quote': '"The Tao that can be told is not the eternal Tao."',
      'modal.install': 'Install',
      'modal.github': 'GitHub',
      'modal.site': 'Website',
      'modal.detail': 'Details',
      'noInstall': 'Coming Soon',
      'noSite': '—',
      'pageTitle': 'xuan905 Skills · OpenClaw Showcase',
    },
  };

  function t(key) {
    return T[currentLang]?.[key] || T['zh-TW'][key] || key;
  }

  function applyI18n() {
    document.title = t('pageTitle');
    document.querySelectorAll('[data-i18n]').forEach(el => {
      el.innerHTML = t(el.dataset.i18n);
    });
    renderSkills();
    renderHeroChips();
    renderModal();
  }

  // ── Theme ──────────────────────────────────────
  const themeBtn = document.getElementById('themeBtn');
  const themeIcon = document.getElementById('themeIcon');
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeIcon.textContent = '🌙';
  }
  themeBtn?.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      themeIcon.textContent = '☀️';
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      themeIcon.textContent = '🌙';
      localStorage.setItem('theme', 'dark');
    }
  });

  // ── Navbar scroll ──────────────────────────────
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });

  // ── Mobile nav ─────────────────────────────────
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  navToggle?.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });

  // ── Language switcher ───────────────────────────
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentLang = btn.dataset.lang;
      document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyI18n();
    });
  });

  // ── Hero floating chips ─────────────────────────
  function renderHeroChips() {
    const container = document.getElementById('heroCards');
    const featured = SKILLS.filter(s => s.featured);
    container.innerHTML = featured.map(s => {
      const name = s.name_en || s.name;
      return `
        <div class="hero-skill-chip">
          <span class="chip-dot" style="background:${s.accentColor}"></span>
          ${name}
        </div>
      `;
    }).join('');
  }

  // ── Skills grid ────────────────────────────────
  const skillsGrid = document.getElementById('skillsGrid');

  function skillCardHTML(skill) {
    const name = currentLang === 'en' ? skill.name_en : skill.name;
    const tagline = skill.tagline[currentLang];
    const catLabel = skill.categoryLabel[currentLang];
    const desc = skill.desc[currentLang];
    const accent = skill.accentColor;
    const bg = skill.accentBg;

    return `
      <div class="skill-card fade-up" style="--card-accent:${accent};--card-accent-bg:${bg};--card-accent-border:${accent}40"
           data-id="${skill.id}">
        <div class="skill-card-header">
          <div class="skill-icon-wrap" style="background:${bg}">
            ${skill.iconEmoji}
          </div>
          <div>
            <div class="skill-card-title">${name}</div>
            <div class="skill-card-sub">${tagline}</div>
          </div>
        </div>
        <p class="skill-card-desc">${desc}</p>
        <div class="skill-card-footer">
          <span class="skill-cat-badge" style="color:${accent};background:${bg};border-color:${accent}40">
            ${catLabel}
          </span>
          <div class="skill-card-actions">
            <button class="skill-install-btn" data-id="${skill.id}">
              ⚡ ${t('modal.install')}
            </button>
            <button class="skill-detail-btn" data-id="${skill.id}">
              ${t('modal.detail')} →
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function getSkillsByCategory(cat) {
    if (cat === 'all') return SKILLS;
    return SKILLS.filter(s => s.category === cat);
  }

  function renderSkills() {
    const filtered = getSkillsByCategory(currentCat);
    skillsGrid.innerHTML = filtered.map(skillCardHTML).join('');

    // Install button → go to ClawHub URL
    skillsGrid.querySelectorAll('.skill-install-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const skill = SKILLS.find(s => s.id === btn.dataset.id);
        if (skill?.clawhubUrl) {
          window.open(skill.clawhubUrl, '_blank');
        }
      });
    });

    // Detail button → open modal
    skillsGrid.querySelectorAll('.skill-detail-btn, .skill-card').forEach(el => {
      el.addEventListener('click', () => {
        const id = el.dataset.id || el.closest('.skill-card')?.dataset.id;
        if (id) openModal(id);
      });
    });
  }

  // ── Category tabs ──────────────────────────────
  document.querySelectorAll('.cat-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      currentCat = tab.dataset.cat;
      document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderSkills();
    });
  });

  // ── Modal ─────────────────────────────────────
  const modal = document.getElementById('skillModal');
  const modalBody = document.getElementById('modalBody');
  const modalClose = document.getElementById('modalClose');
  let currentSkill = null;

  function openModal(id) {
    currentSkill = SKILLS.find(s => s.id === id);
    if (!currentSkill) return;
    renderModal();
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function renderModal() {
    if (!currentSkill) return;
    const s = currentSkill;
    const name = currentLang === 'en' ? s.name_en : s.name;
    const catLabel = s.categoryLabel[currentLang];
    const desc = s.desc[currentLang];
    const accent = s.accentColor;
    const bg = s.accentBg;

    let installBtn = '';
    if (s.installCmd) {
      installBtn = `
        <button class="btn btn-primary" onclick="navigator.clipboard?.writeText('${s.installCmd}').then(()=>{this.textContent='✓ Copied!';setTimeout(()=>this.textContent='⚡ ${t('modal.install')}',1500)})">
          ⚡ ${t('modal.install')}
        </button>
      `;
    } else {
      installBtn = `<span class="btn btn-sm" style="opacity:0.6;cursor:default">${t('noInstall')}</span>`;
    }

    let siteBtn = '';
    if (s.siteUrl) {
      siteBtn = `<a href="${s.siteUrl}" target="_blank" class="modal-link">🌐 ${t('modal.site')}</a>`;
    }

    let siteBtn2 = '';
    if (s.siteUrl) {
      siteBtn2 = `<a href="${s.siteUrl}" target="_blank" class="btn btn-sm">🌐 ${t('modal.site')}</a>`;
    }

    modalBody.innerHTML = `
      <div class="modal-skill-header">
        <div class="modal-skill-icon" style="background:${bg};font-size:2rem;border-radius:14px;width:64px;height:64px;display:flex;align-items:center;justify-content:center">
          ${s.iconEmoji}
        </div>
        <div>
          <div class="modal-skill-name">${name}</div>
          <div class="modal-skill-cat" style="color:${accent}">${catLabel}</div>
        </div>
      </div>
      <div class="modal-desc" style="border-left-color:${accent}">
        ${desc}
      </div>
      <div class="modal-install">
        ${installBtn}
        ${siteBtn2}
        ${s.githubUrl ? `<a href="${s.githubUrl}" target="_blank" class="btn btn-sm">📦 GitHub</a>` : ''}
      </div>
      <div class="modal-links">
        ${s.clawhubUrl ? `<a href="${s.clawhubUrl}" target="_blank" class="modal-link">⚡ ClawHub</a>` : ''}
        ${s.githubUrl ? `<a href="${s.githubUrl}" target="_blank" class="modal-link">📦 GitHub</a>` : ''}
        ${siteBtn}
        <span class="modal-link" style="cursor:default">#${s.tags?.join(' #') || ''}</span>
      </div>
    `;
  }

  modalClose?.addEventListener('click', closeModal);
  modal?.addEventListener('click', e => { if (e.target === modal) closeModal(); });

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  // ── Smooth scroll ───────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

  // ── Init ───────────────────────────────────────
  applyI18n();

  // Update skill count stat
  document.getElementById('skillCount').textContent = SKILLS.length;

})();
