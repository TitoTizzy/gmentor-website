(function () {
  "use strict";

  var root = document.documentElement;
  var body = document.body;
  var assetRoot = body.dataset.root || ".";
  var page = body.dataset.page || "home";
  var labels = {
    en: { home: "Home", about: "About", projects: "Projects", portfolio: "Portfolio", contact: "Contact", title: "Residential Design & Planning" },
    fr: { home: "Accueil", about: "À propos", projects: "Réalisations", portfolio: "Portfolio", contact: "Contact", title: "Design résidentiel et planification" },
    kr: { home: "Akèy", about: "Konsènan", projects: "Pwojè", portfolio: "Pòtfolyo", contact: "Kontak", title: "Konsepsyon ak planifikasyon rezidansyèl" }
  };
  var pageTitles = {
    en: { home: "Design across Haiti and the United States", about: "About", projects: "Projects", portfolio: "Portfolio", contact: "Contact", privacy: "Privacy", legal: "Legal Notice", cookies: "Cookies", project: "Project", "404": "Page Not Found" },
    fr: { home: "Conception entre Haïti et les États-Unis", about: "À propos", projects: "Réalisations", portfolio: "Portfolio", contact: "Contact", privacy: "Confidentialité", legal: "Mentions légales", cookies: "Cookies", project: "Projet", "404": "Page introuvable" },
    kr: { home: "Konsepsyon ant Ayiti ak Etazini", about: "Konsènan", projects: "Pwojè", portfolio: "Pòtfolyo", contact: "Kontak", privacy: "Konfidansyalite", legal: "Avi legal", cookies: "Cookies", project: "Pwojè", "404": "Paj pa jwenn" }
  };

  function href(name) {
    return assetRoot + "/" + name;
  }

  function currentLocale() {
    return root.dataset.locale || "fr";
  }

  function localizedProject(project) {
    var translations = window.MGM_DATA && window.MGM_DATA.projectLocales;
    var translated = translations && translations[currentLocale()] && translations[currentLocale()][project.slug];
    var localized = translated ? Object.assign({}, project, translated) : Object.assign({}, project);
    var galleryLabels = {
      en: { "Étude 3D": "3D study", "Chantier": "Construction", "Réalisation": "Built work", "Vue": "View", "Vue intérieure": "Interior view", "Plan": "Plan", "Coupes": "Sections", "Intérieur": "Interior", "Fondations": "Foundations", "Plan 2 chambres": "Two-bedroom plan", "Plan 3 chambres": "Three-bedroom plan" },
      fr: { "Built work": "Réalisation", "Construction": "Chantier", "Completed": "Projet achevé", "AI-assisted 3D": "3D assistée par IA", "CAD development": "Développement CAO", "First floor plan": "Plan du rez-de-chaussée", "Front elevation": "Élévation avant", "Landscape": "Paysage", "Interior": "Intérieur", "Basement plan": "Plan du sous-sol", "Floor plans": "Plans", "Elevations": "Élévations" },
      kr: { "Built work": "Reyalizasyon", "Construction": "Chantye", "Completed": "Pwojè fini", "AI-assisted 3D": "3D ak asistans IA", "CAD development": "Devlopman CAD", "First floor plan": "Plan premye nivo", "Front elevation": "Elevasyon devan", "Landscape": "Peyizaj", "Interior": "Enteryè", "Basement plan": "Plan sousòl", "Floor plans": "Plan yo", "Elevations": "Elevasyon yo", "Étude 3D": "Etid 3D", "Chantier": "Chantye", "Réalisation": "Reyalizasyon", "Vue": "Vi", "Vue intérieure": "Vi enteryè", "Plan": "Plan", "Coupes": "Koup", "Intérieur": "Enteryè", "Fondations": "Fondasyon", "Plan 2 chambres": "Plan 2 chanm", "Plan 3 chambres": "Plan 3 chanm" }
    };
    localized.gallery = (project.gallery || []).map(function (item, index) {
      var itemTranslation = translated && translated.gallery ? translated.gallery[index] : null;
      var localizedItem = Object.assign({}, item, itemTranslation || {});
      localizedItem.label = (galleryLabels[currentLocale()] && galleryLabels[currentLocale()][localizedItem.label]) || localizedItem.label;
      return localizedItem;
    });
    return localized;
  }

  function localizedProfile(market) {
    var base = window.MGM_DATA.profiles[market];
    var locales = window.MGM_DATA.profileLocales;
    var translated = locales && locales[currentLocale()] && locales[currentLocale()][market];
    return translated ? Object.assign({}, base, translated) : base;
  }

  window.MGM_LOCALIZE_PROJECT = localizedProject;

  function initializePreferences() {
    var browserLanguage = (navigator.language || "en").toLowerCase();
    root.dataset.locale = localStorage.getItem("mgm-locale") || (browserLanguage.indexOf("ht") === 0 ? "kr" : browserLanguage.indexOf("fr") === 0 ? "fr" : "en");
    root.dataset.theme = localStorage.getItem("mgm-theme") || (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    root.dataset.site = "unified";
  }

  function renderShell() {
    var header = document.querySelector("[data-site-header]");
    var footer = document.querySelector("[data-site-footer]");
    var shellLocale = root.dataset.locale || "fr";
    var shellText = shellLocale === "en" ? {
      home: "home", menu: "Open menu", navigation: "Primary navigation", theme: "Change theme"
    } : shellLocale === "kr" ? {
      home: "akèy", menu: "Louvri meni", navigation: "Navigasyon prensipal", theme: "Chanje tèm nan"
    } : {
      home: "accueil", menu: "Ouvrir le menu", navigation: "Navigation principale", theme: "Changer le thème"
    };
    var languageTools = '<div class="segmented locale-switch" aria-label="Language"><button type="button" data-locale="en">EN</button><button type="button" data-locale="fr">FR</button><button type="button" data-locale="kr">KR</button></div>';
    var themeButton = '<button class="icon-button" type="button" aria-label="' + shellText.theme + '" title="' + shellText.theme + '" data-theme-toggle><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor"/></svg></button>';
    var cta = '<a class="button button-primary header-cta" href="' + href("contact.html") + '" data-i18n data-en="Start a project" data-fr="Démarrer un projet" data-kr="Kòmanse yon pwojè">Démarrer un projet</a>';
    if (header) {
      header.innerHTML = [
        '<a class="brand" href="' + href("index.html") + '" aria-label="Marie Gaëlle Mentor, ' + shellText.home + '">',
        '<img class="theme-logo" src="' + href("assets/mgm-mark-white.png") + '" alt="" width="50" height="50">',
        '<span class="brand-copy"><strong>Marie Gaëlle Mentor</strong><small data-practice-title></small></span></a>',
        '<nav class="main-nav" aria-label="' + shellText.navigation + '" data-nav>',
        navLink("index.html", "home"), navLink("about.html", "about"), navLink("projects.html", "projects"), navLink("portfolio.html", "portfolio"), navLink("contact.html", "contact"),
        '<div class="mobile-tools">' + cta + languageTools + themeButton.replace("data-theme-toggle", "data-theme-toggle data-mobile") + '</div>',
        '</nav>',
        '<div class="header-tools">' + languageTools + themeButton + cta,
        '<button class="icon-button nav-toggle" type="button" aria-label="' + shellText.menu + '" aria-expanded="false" data-nav-toggle><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 8h16M4 16h16"/></svg></button></div>'
      ].join("");
    }
    if (footer) {
      var year = new Date().getFullYear();
      footer.innerHTML = '<div class="container">' +
        '<div class="footer-cta"><p class="eyebrow" data-i18n data-en="New project" data-fr="Nouveau projet" data-kr="Nouvo pwojè">Nouveau projet</p>' +
        '<h2 data-i18n data-en="Give your ambitions a clear form." data-fr="Donnons une forme claire à vos ambitions." data-kr="Ann bay anbisyon ou yo yon fòm klè.">Donnons une forme claire à vos ambitions.</h2>' +
        '<div class="cta-row"><a class="button button-primary button-arrow" href="' + href("contact.html") + '" data-i18n data-en="Start a project" data-fr="Démarrer un projet" data-kr="Kòmanse yon pwojè">Démarrer un projet</a>' +
        '<a class="button button-light" href="tel:+12038485807">+1 (203) 848-5807</a></div></div>' +
        '<div class="footer-cols"><div><h3 data-i18n data-en="Explore" data-fr="Explorer" data-kr="Eksplore">Explorer</h3><ul>' +
        '<li><a href="' + href("projects.html") + '" data-nav-label="projects"></a></li><li><a href="' + href("portfolio.html") + '" data-nav-label="portfolio"></a></li><li><a href="' + href("about.html") + '" data-nav-label="about"></a></li><li><a href="' + href("contact.html") + '" data-nav-label="contact"></a></li></ul></div>' +
        '<div><h3>Contact</h3><ul><li><a href="mailto:mariegmentor@gmail.com">mariegmentor@gmail.com</a></li><li><a href="tel:+12038485807">+1 (203) 848-5807</a></li>' +
        '<li data-i18n data-en="United States · Haiti" data-fr="États-Unis · Haïti" data-kr="Etazini · Ayiti">États-Unis · Haïti</li></ul></div></div>' +
        '<div class="footer-base"><img class="logo-on-dark" src="' + href("assets/mgm-mark-white.png") + '" alt="Marie Gaëlle Mentor" width="46" height="46">' +
        '<p class="footer-note" data-i18n data-en="© ' + year + ' Marie Mentor Residential Design & Planning LLC — NOT A LICENSED ARCHITECT. Licensed architect in Haiti." data-fr="© ' + year + ' Marie Mentor Residential Design & Planning LLC — NOT A LICENSED ARCHITECT. Architecte licenciée en Haïti." data-kr="© ' + year + ' Marie Mentor Residential Design & Planning LLC — NOT A LICENSED ARCHITECT. Achitèk lisansye ann Ayiti.">© ' + year + ' Marie Mentor Residential Design & Planning LLC — NOT A LICENSED ARCHITECT. Architecte licenciée en Haïti.</p>' +
        '<div class="footer-links"><a href="' + href("privacy.html") + '" data-i18n data-en="Privacy" data-fr="Confidentialité" data-kr="Konfidansyalite">Confidentialité</a><a href="' + href("cookies.html") + '">Cookies</a><a href="' + href("legal.html") + '" data-i18n data-en="Legal notice" data-fr="Mentions légales" data-kr="Avi legal">Mentions légales</a></div></div></div>';
    }
  }

  function navLink(file, key) {
    var current = page === key ? ' aria-current="page"' : "";
    return '<a href="' + href(file) + '" data-nav-label="' + key + '"' + current + '></a>';
  }

  function syncPreferences() {
    var locale = root.dataset.locale || "fr";
    root.dataset.locale = locale;
    root.lang = locale === "kr" ? "ht" : locale;
    if (page !== "project") document.title = (pageTitles[locale][page] || "Marie Gaëlle Mentor") + " | Marie Gaëlle Mentor";
    document.querySelectorAll("[data-locale]").forEach(function (button) {
      button.setAttribute("aria-pressed", String(button.dataset.locale === locale));
    });
    document.querySelectorAll("[data-nav-label]").forEach(function (link) {
      link.textContent = labels[locale][link.dataset.navLabel];
    });
    var title = document.querySelector("[data-practice-title]");
    if (title) title.textContent = labels[locale].title;
    var footerTitle = document.querySelector("[data-footer-title]");
    if (footerTitle) footerTitle.textContent = "Marie Mentor Residential Design & Planning LLC";
    document.querySelectorAll("[data-i18n]").forEach(function (node) {
      var translated = node.dataset[locale] || node.dataset.fr;
      if (translated) node.textContent = translated;
    });
    document.dispatchEvent(new CustomEvent("mgm:preferences"));
  }

  function bindControls() {
    var navButton = document.querySelector("[data-nav-toggle]");
    var nav = document.querySelector("[data-nav]");

    function closeNavigation() {
      if (!navButton || !nav) return;
      navButton.setAttribute("aria-expanded", "false");
      navButton.setAttribute("aria-label", currentLocale() === "en" ? "Open menu" : currentLocale() === "kr" ? "Louvri meni" : "Ouvrir le menu");
      navButton.classList.remove("is-open");
      nav.classList.remove("open");
      body.classList.remove("menu-open");
    }

    document.querySelectorAll("button[data-locale]").forEach(function (button) {
      button.addEventListener("click", function () {
        root.dataset.locale = button.dataset.locale;
        localStorage.setItem("mgm-locale", root.dataset.locale);
        syncPreferences();
        closeNavigation();
      });
    });
    document.querySelectorAll("[data-theme-toggle]").forEach(function (themeButton) {
      themeButton.addEventListener("click", function () {
        root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
        localStorage.setItem("mgm-theme", root.dataset.theme);
      });
    });
    if (navButton && nav) navButton.addEventListener("click", function () {
      var open = navButton.getAttribute("aria-expanded") !== "true";
      navButton.setAttribute("aria-expanded", String(open));
      var locale = currentLocale();
      navButton.setAttribute("aria-label", open ? (locale === "en" ? "Close menu" : locale === "kr" ? "Fèmen meni" : "Fermer le menu") : (locale === "en" ? "Open menu" : locale === "kr" ? "Louvri meni" : "Ouvrir le menu"));
      navButton.classList.toggle("is-open", open);
      nav.classList.toggle("open", open);
      body.classList.toggle("menu-open", open);
    });
  }

  var SERVICE_ICONS = [
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M3 21h18M5 21V9l7-5 7 5v12M9 21v-6h6v6"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M4 18v-5a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v5M4 15h16M6 18v2M18 18v2M8 10V7h8v3"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M14 4l6 6-9 9H5v-6z"/><path d="M12 6l6 6"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M12 12l8-4.5M12 12v9M12 12L4 7.5"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M4 20V4M4 20h16"/><path d="M7 16l4-5 3 3 5-7"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="12" cy="18" r="2.5"/><path d="M8.5 6h7M7.2 8.2l3.6 7.6M16.8 8.2l-3.6 7.6"/></svg>'
  ];

  function renderServices() {
    var grid = document.querySelector("[data-services]");
    if (!grid || !window.MGM_DATA) return;
    grid.innerHTML = window.MGM_DATA.services.map(function (service, index) {
      return '<article class="service"><span aria-hidden="true">' + (SERVICE_ICONS[index] || SERVICE_ICONS[0]) + '</span><h3 data-i18n data-en="' + service.en + '" data-fr="' + service.fr + '" data-kr="' + service.kr + '">' + service.fr + '</h3></article>';
    }).join("");
  }

  function vtName(slug) { return "p-" + String(slug).replace(/[^a-z0-9-]/gi, ""); }

  function projectCard(project, index) {
    project = localizedProject(project);
    var open = currentLocale() === "en" ? "View project" : currentLocale() === "kr" ? "Wè pwojè a" : "Voir le projet";
    return '<article class="project-card" data-project data-country="' + project.country + '" data-city="' + project.city + '" data-year="' + project.year + '" data-type="' + project.type + '">' +
      '<a href="' + href("project.html?slug=" + encodeURIComponent(project.slug)) + '" data-vt="' + vtName(project.slug) + '"><figure data-open="' + open + '"><img src="' + href("images/" + project.cover) + '" alt="' + project.alt + '" width="1600" height="1067" loading="' + (index < 3 ? "eager" : "lazy") + '" decoding="async"></figure>' +
      '<div class="project-copy"><p class="eyebrow">' + [project.city, project.country].filter(Boolean).join(", ") + '</p><h2>' + project.title + '</h2>' + (project.year ? '<span class="project-year">' + project.year + '</span>' : '<span></span>') + '<p>' + project.type + '</p></div></a></article>';
  }

  function renderProjects() {
    var grid = document.querySelector("[data-projects]");
    if (!grid || !window.MGM_DATA) return;
    var limit = Number(grid.dataset.limit || 0);
    var items = window.MGM_DATA.projects.filter(function (project) { return project.published; });
    if (limit) {
      var marketCounts = {};
      items = items.filter(function (project) {
        var market = project.markets[0];
        marketCounts[market] = marketCounts[market] || 0;
        if (marketCounts[market] >= limit) return false;
        marketCounts[market] += 1;
        return true;
      });
    }
    grid.innerHTML = items.map(projectCard).join("");
    filterProjects();
  }

  function filterProjects() {
    var cards = document.querySelectorAll("[data-project]");
    if (!cards.length) return;
    var form = document.querySelector("[data-filters]");
    var values = form ? Object.fromEntries(new FormData(form)) : {};
    var visible = 0;
    cards.forEach(function (card) {
      var filterMatch = ["country", "city", "year", "type"].every(function (key) {
        return !values[key] || card.dataset[key] === values[key];
      });
      card.hidden = !filterMatch;
      if (!card.hidden) visible += 1;
    });
    var count = document.querySelector("[data-results-count]");
    if (count) {
      var locale = currentLocale();
      var noun = locale === "en" ? "project" : locale === "kr" ? "pwojè" : "projet";
      count.textContent = visible + " " + noun + (locale !== "kr" && visible !== 1 ? "s" : "");
    }
  }

  function initializeFilters() {
    var form = document.querySelector("[data-filters]");
    if (!form || !window.MGM_DATA) return;
    var published = window.MGM_DATA.projects.filter(function (project) { return project.published; }).map(localizedProject);
    Array.from(form.querySelectorAll("select")).forEach(function (select) {
      while (select.options.length > 1) select.remove(1);
    });
    populateSelect(form.elements.country, published.map(function (project) { return project.country; }));
    populateSelect(form.elements.city, published.map(function (project) { return project.city; }));
    populateSelect(form.elements.year, published.map(function (project) { return project.year; }));
    populateSelect(form.elements.type, published.map(function (project) { return project.type; }));
    if (!form.dataset.filtersBound) {
      form.addEventListener("input", filterProjects);
      form.addEventListener("reset", function () { window.setTimeout(filterProjects, 0); });
      form.dataset.filtersBound = "true";
    }
  }

  function populateSelect(select, values) {
    if (!select) return;
    Array.from(new Set(values.filter(Boolean))).sort().forEach(function (value) {
      var option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    });
  }

  function initializeHero() {
    var hero = document.querySelector("[data-hero]");
    if (!hero || !window.MGM_DATA) return;
    var sourceProjects = window.MGM_DATA.projects.filter(function (project) { return project.published && project.featured; }).sort(function (a, b) {
      return Number(b.markets.indexOf("ht") >= 0) - Number(a.markets.indexOf("ht") >= 0);
    });
    var slides = hero.querySelector("[data-hero-slides]");
    var dots = hero.querySelector("[data-hero-dots]");
    var active = 0;
    var duration = 7000;
    var timer = null;
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    hero.style.setProperty("--hero-duration", duration + "ms");
    function buildHero() {
      var projects = sourceProjects.map(localizedProject);
      var locale = currentLocale();
      var discover = locale === "en" ? "View the project" : locale === "kr" ? "Wè pwojè a" : "Voir le projet";
      var start = locale === "en" ? "Start a project" : locale === "kr" ? "Kòmanse yon pwojè" : "Démarrer un projet";
      var display = locale === "en" ? "Show" : locale === "kr" ? "Montre" : "Afficher";
      slides.innerHTML = projects.map(function (project, index) {
        var link = href("project.html?slug=" + encodeURIComponent(project.slug));
        return '<article class="hero-slide" data-hero-slide aria-roledescription="slide"><img src="' + href("images/" + project.cover) + '" alt="' + project.alt + '" width="1600" height="1067"' + (index ? ' loading="lazy"' : ' fetchpriority="high"') + '><div class="hero-overlay"></div><a class="hero-link" href="' + link + '" tabindex="-1" aria-hidden="true"></a><div class="hero-content"><div class="hero-meta"><div><p class="eyebrow">' + [project.city, project.country].filter(Boolean).join(", ") + '</p>' + (index === 0 ? '<h1>' : '<h2 class="h1-like">') + project.title + (index === 0 ? '</h1>' : '</h2>') + '<p>' + project.type + (project.year ? ' — ' + project.year : '') + '</p><div class="cta-row hero-ctas"><a class="button button-light button-arrow" href="' + link + '">' + discover + '</a><a class="button button-primary" href="' + href("contact.html") + '">' + start + '</a></div></div><span class="hero-count">' + String(index + 1).padStart(2, "0") + ' / ' + String(projects.length).padStart(2, "0") + '</span></div></div></article>';
      }).join("");
      dots.innerHTML = projects.map(function (project, index) { return '<button type="button" aria-label="' + display + ' ' + project.title + '" data-hero-dot="' + index + '"></button>'; }).join("");
      hero.querySelectorAll("[data-hero-dot]").forEach(function (dot) { dot.addEventListener("click", function () { show(Number(dot.dataset.heroDot)); }); });
    }

    function schedule() {
      window.clearTimeout(timer);
      if (reduce || hero.classList.contains("is-paused")) return;
      timer = window.setTimeout(function () { show(active + 1); }, duration);
    }

    function show(index) {
      active = index >= 0 && index < sourceProjects.length ? index : 0;
      hero.querySelectorAll("[data-hero-slide]").forEach(function (slide, itemIndex) {
        slide.classList.toggle("active", itemIndex === active);
        slide.setAttribute("aria-hidden", String(itemIndex !== active));
        slide.querySelectorAll("a.button").forEach(function (a) { a.tabIndex = itemIndex === active ? 0 : -1; });
      });
      hero.querySelectorAll("[data-hero-dot]").forEach(function (dot, itemIndex) {
        dot.setAttribute("aria-pressed", String(itemIndex === active));
        dot.classList.toggle("done", itemIndex < active);
        if (itemIndex === active) { dot.style.animation = "none"; void dot.offsetWidth; dot.style.animation = ""; }
      });
      schedule();
    }
    hero.addEventListener("mouseenter", function () { hero.classList.add("is-paused"); window.clearTimeout(timer); });
    hero.addEventListener("mouseleave", function () { hero.classList.remove("is-paused"); schedule(); });
    hero.addEventListener("focusin", function () { hero.classList.add("is-paused"); window.clearTimeout(timer); });
    hero.addEventListener("focusout", function () { hero.classList.remove("is-paused"); schedule(); });
    document.addEventListener("visibilitychange", function () { if (document.hidden) window.clearTimeout(timer); else schedule(); });
    var touchX = null;
    hero.addEventListener("touchstart", function (event) { touchX = event.touches[0].clientX; }, { passive: true });
    hero.addEventListener("touchend", function (event) {
      if (touchX === null) return;
      var dx = event.changedTouches[0].clientX - touchX;
      touchX = null;
      if (Math.abs(dx) > 50) show(dx < 0 ? active + 1 : (active - 1 + sourceProjects.length) % sourceProjects.length);
    });
    buildHero();
    document.addEventListener("mgm:preferences", function () { buildHero(); show(active); });
    show(0);
  }

  function renderProjectDetail() {
    var target = document.querySelector("[data-project-detail]");
    if (!target || !window.MGM_DATA) return;
    var slug = new URLSearchParams(location.search).get("slug");
    var published = window.MGM_DATA.projects.filter(function (item) { return item.published; });
    var project = published.find(function (item) { return item.slug === slug; });
    var locale = currentLocale();
    if (!project) {
      var notFound = locale === "en" ? { label: "Project", title: "Project not found", back: "Back to projects" } : locale === "kr" ? { label: "Pwojè", title: "Pwojè a pa jwenn", back: "Retounen nan pwojè yo" } : { label: "Projet", title: "Projet introuvable", back: "Retour aux réalisations" };
      target.innerHTML = '<div class="page-shell container"><p class="eyebrow">' + notFound.label + '</p><h1>' + notFound.title + '</h1><p><a class="text-link" href="projects.html">' + notFound.back + '</a></p></div>';
      return;
    }
    var nextProject = localizedProject(published[(published.indexOf(project) + 1) % published.length]);
    project = localizedProject(project);
    var L = locale === "en" ? {
      project: "Project", location: "Location", year: "Year", type: "Type", program: "Program", gallery: "Photos and drawings", items: "images", back: "All projects", zoom: "Enlarge", next: "Next project", mark: "Marie Mentor Residential Design & Planning", similar: "Planning a similar project?", similarText: "Describe your site, your program and your timeline. Marie Gaëlle Mentor replies personally.", start: "Start a project", portfolio: "Browse the portfolio"
    } : locale === "kr" ? {
      project: "Pwojè", location: "Kote", year: "Ane", type: "Kalite", program: "Pwogram", gallery: "Foto ak plan", items: "imaj", back: "Tout pwojè yo", zoom: "Grosi", next: "Pwojè apre a", mark: "Marie Mentor Residential Design & Planning", similar: "Ou gen yon pwojè ki sanble?", similarText: "Dekri teren an, pwogram nan ak kalandriye ou. Marie Gaëlle Mentor reponn ou pèsonèlman.", start: "Kòmanse yon pwojè", portfolio: "Gade pòtfolyo a"
    } : {
      project: "Projet", location: "Lieu", year: "Année", type: "Typologie", program: "Programme", gallery: "Photos et plans", items: "images", back: "Toutes les réalisations", zoom: "Agrandir", next: "Projet suivant", mark: "Marie Mentor Residential Design & Planning", similar: "Un projet similaire en tête ?", similarText: "Décrivez votre terrain, votre programme et votre calendrier. Marie Gaëlle Mentor vous répond personnellement.", start: "Démarrer un projet", portfolio: "Feuilleter le portfolio"
    };
    document.title = project.title + " | Marie Gaëlle Mentor";
    var zoomIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 9V4h5M20 15v5h-5M20 4l-6 6M4 20l6-6"/></svg>';
    var items = project.gallery || [];
    var total = String(items.length).padStart(2, "0");
    var gallery = items.map(function (item, index) {
      var drawing = isDrawingItem(item);
      return '<figure class="project-media' + (drawing ? ' is-drawing' : '') + '"><button type="button" data-gallery-index="' + index + '" aria-label="' + L.zoom + ' : ' + item.alt + '"><img src="' + href("images/" + item.src) + '" alt="' + item.alt + '" loading="eager" decoding="async"><span class="zoom-hint">' + zoomIcon + '<span>' + L.zoom + '</span></span></button><figcaption><span>' + item.label + '</span><b>' + String(index + 1).padStart(2, "0") + ' / ' + total + '</b></figcaption></figure>';
    }).join("");
    var meta = '<div><dt>' + L.location + '</dt><dd>' + ([project.city, project.country].filter(Boolean).join(", ") || "—") + '</dd></div>' +
      (project.year ? '<div><dt>' + L.year + '</dt><dd>' + project.year + '</dd></div>' : '') +
      '<div><dt>' + L.type + '</dt><dd>' + project.type + '</dd></div>' +
      (project.program ? '<div><dt>' + L.program + '</dt><dd>' + project.program + '</dd></div>' : '');
    target.innerHTML = '<section class="project-hero"><img src="' + href("images/" + project.cover) + '" alt="' + project.alt + '" fetchpriority="high" style="view-transition-name:' + vtName(project.slug) + ';view-transition-class:project-image"><div class="project-back"><a href="' + href("projects.html") + '">' + L.back + '</a></div><div class="project-hero-copy"><p class="eyebrow">' + project.type + '</p><h1>' + project.title + '</h1></div></section>' +
      '<div class="container"><section class="project-intro band"><div><p class="eyebrow">' + L.project + '</p><p class="project-lead">' + project.description + '</p></div>' +
      '<dl class="project-meta">' + meta + '<div class="project-meta-mark"><img class="theme-logo" src="' + href("assets/mgm-mark-white.png") + '" alt=""><span>' + L.mark + '</span></div></dl></section>' +
      '<section class="project-gallery" aria-label="' + L.gallery + '"><div class="gallery-head"><h2>' + L.gallery + '</h2><span>' + items.length + ' ' + L.items + '</span></div>' + gallery + '</section></div>' +
      '<section class="cta-band band"><div class="container"><p class="eyebrow">' + project.title + '</p><h2>' + L.similar + '</h2><div class="cta-side"><p>' + L.similarText + '</p><div class="cta-row"><a class="button button-primary button-arrow" href="' + href("contact.html") + '">' + L.start + '</a><a class="button" href="' + href("portfolio.html") + '">' + L.portfolio + '</a></div></div></div></section>' +
      '<a class="project-next" href="' + href("project.html?slug=" + encodeURIComponent(nextProject.slug)) + '" data-vt="' + vtName(nextProject.slug) + '"><img src="' + href("images/" + nextProject.cover) + '" alt="" loading="lazy"><div class="container"><p class="eyebrow">' + L.next + '</p><h2>' + nextProject.title + '</h2></div></a>';
    var lightboxItems = items.map(function (item) { return { src: href("images/" + item.src), alt: item.alt, label: item.label, drawing: isDrawingItem(item) }; });
    target.querySelectorAll("[data-gallery-index]").forEach(function (button) {
      button.addEventListener("click", function () {
        if (window.MGMLightbox) window.MGMLightbox.open(lightboxItems, Number(button.dataset.galleryIndex), project.title, button);
      });
    });
  }

  function isDrawingItem(item) {
    return /plan|elevation|élévation|coupe|section|fondation|foundation|floor|roof|cad|-wm\./i.test((item.label || "") + " " + (item.src || ""));
  }

  function renderAbout() {
    var target = document.querySelector("[data-about-content]");
    if (!target || !window.MGM_DATA || !window.MGM_DATA.profiles) return;
    var locale = root.dataset.locale || "fr";
    var practiceCopy = locale === "en" ? {
      eyebrow: "Haiti · United States",
      title: "A professional life built between Haiti and the United States.",
      lead: "Marie Gaëlle Mentor’s career is defined by continuity, adaptability and responsibility, from her architectural education in Port-au-Prince and her first construction sites in Haiti to residential design, inspection and independent practice in New York and Connecticut.",
      haiti: "Chapter I · Haiti",
      usa: "Chapter II · United States",
      milestones: "Career milestones",
      principles: "Principles of practice",
      closingEyebrow: "A unified vision",
      closingTitle: "Architecture connects every chapter of her professional journey.",
      closingParagraphs: [
        "Working between two countries has shaped a practice that observes closely, adapts without sacrificing rigor and recognizes the particular intelligence of every place. Haiti provided direct construction-site experience, resilience and a strong sense of social responsibility. The United States strengthened her technical discipline, knowledge of residential standards and experience of collaborative practice.",
        "These lessons now inform every commission. Her process begins with careful listening, makes complex decisions understandable and maintains attention from the first conversation through implementation. The objective remains consistent: architecture that serves people well, ages with dignity and holds a meaningful place in their lives."
      ]
    } : locale === "kr" ? {
      eyebrow: "Ayiti · Etazini",
      title: "Yon lavi pwofesyonèl bati ant Ayiti ak Etazini.",
      lead: "Karyè Marie Gaëlle Mentor chita sou kontinite, adaptasyon ak responsabilite, depi fòmasyon li nan achitekti Pòtoprens ak premye chantye li ann Ayiti rive nan konsepsyon rezidansyèl, enspeksyon ak pratik endepandan nan New York ak Connecticut.",
      haiti: "Chapit I · Ayiti",
      usa: "Chapit II · Etazini",
      milestones: "Etap nan karyè a",
      principles: "Prensip travay",
      closingEyebrow: "Yon vizyon ki ini tout eksperyans yo",
      closingTitle: "Achitekti mare tout chapit nan pakou pwofesyonèl li.",
      closingParagraphs: [
        "Travay ant de peyi fòme yon pratik ki obsève ak anpil atansyon, ki adapte san li pa pèdi disiplin epi ki rekonèt entèlijans chak kote. Ayiti pote eksperyans dirèk chantye, rezilyans ak responsabilite sosyal. Etazini ranfòse presizyon teknik li ak eksperyans li nan lojman.",
        "Tout leson sa yo reyini nan chak pwojè. Metòd li kòmanse ak bonjan ekout, rann desizyon konplèks yo klè epi kenbe menm nivo atansyon depi premye konvèsasyon an rive nan realizasyon an."
      ]
    } : {
      eyebrow: "Haïti · États-Unis",
      title: "Une vie professionnelle construite entre Haïti et les États-Unis.",
      lead: "Le parcours de Marie Gaëlle Mentor se distingue par sa continuité, sa capacité d’adaptation et son sens des responsabilités, de sa formation à Port-au-Prince et de ses premiers chantiers en Haïti jusqu’à la conception résidentielle, l’inspection et la pratique indépendante à New York et au Connecticut.",
      haiti: "Chapitre I · Haïti",
      usa: "Chapitre II · États-Unis",
      milestones: "Repères du parcours",
      principles: "Principes de pratique",
      closingEyebrow: "Une vision unifiée",
      closingTitle: "L’architecture relie tous les chapitres de son parcours professionnel.",
      closingParagraphs: [
        "Le travail entre deux pays a façonné une pratique attentive, adaptable et rigoureuse, capable de reconnaître l’intelligence propre à chaque lieu. Haïti lui a apporté l’expérience immédiate du chantier, la résilience et un profond sens de la responsabilité sociale. Les États-Unis ont renforcé sa discipline technique, sa connaissance des standards résidentiels et son expérience du travail collaboratif.",
        "Ces apprentissages sont aujourd’hui réunis dans chaque mission. Sa méthode privilégie l’écoute avant le dessin, rend les décisions complexes compréhensibles et maintient une attention constante de la première conversation jusqu’à la réalisation. L’objectif reste de créer une architecture qui serve véritablement les personnes, vieillisse avec dignité et occupe une place significative dans leur vie."
      ]
    };

    function profileSection(profile, heading) {
      var story = (profile.story || [profile.body]).map(function (paragraph) { return '<p>' + paragraph + '</p>'; }).join("");
      var facts = (profile.facts || []).map(function (fact) { return '<div class="about-fact"><strong>' + fact.value + '</strong><span>' + fact.label + '</span></div>'; }).join("");
      var values = (profile.values || []).map(function (item, index) { return '<article><span>0' + (index + 1) + '</span><div><h3>' + item.title + '</h3><p>' + item.text + '</p></div></article>'; }).join("");
      var timeline = profile.timeline.map(function (item) { return '<article><h3>' + item.title + '</h3><p>' + item.text + '</p></article>'; }).join("");
      var portrait = profile.chapterPortrait || profile.portrait;
      var portraitAlt = profile.chapterPortraitAlt || profile.portraitAlt;
      var portraitCaption = profile.chapterPortraitCaption || profile.portraitCaption;
      var isPortrait = portrait === profile.portrait;
      var portraitMarkup = isPortrait ? '<figure class="about-portrait"><div class="portrait-stage"><span class="portrait-geometry portrait-geometry-square" aria-hidden="true"></span><span class="portrait-geometry portrait-geometry-circle" aria-hidden="true"></span><span class="portrait-geometry portrait-geometry-line" aria-hidden="true"></span><img src="' + href("images/" + portrait) + '" alt="' + portraitAlt + '"></div><figcaption>' + portraitCaption + '</figcaption></figure>' : '<figure><img src="' + href("images/" + portrait) + '" alt="' + portraitAlt + '"><figcaption>' + portraitCaption + '</figcaption></figure>';
      return '<section class="practice-profile band"><div class="section-heading"><div><p class="eyebrow">' + heading + '</p><h2>' + profile.title + '</h2></div></div>' +
        '<div class="about-facts" aria-label="' + practiceCopy.milestones + '">' + facts + '</div>' +
        '<div class="about-grid">' + portraitMarkup + '<div class="about-copy glass-panel"><p class="eyebrow">' + profile.eyebrow + '</p><h2>' + profile.storyTitle + '</h2><div class="about-story">' + story + '</div><p class="practice-statement">' + profile.quote + '</p></div></div>' +
        '<div class="about-history band"><div class="section-heading"><div><p class="eyebrow">' + practiceCopy.milestones + '</p></div></div><div class="timeline">' + timeline + '</div></div>' +
        '<div class="about-values band"><div class="section-heading"><div><p class="eyebrow">' + practiceCopy.principles + '</p></div></div><div class="about-value-list">' + values + '</div></div></section>';
    }

    var closingStory = practiceCopy.closingParagraphs.map(function (paragraph) { return '<p>' + paragraph + '</p>'; }).join("");
    target.innerHTML = '<header class="page-intro"><p class="eyebrow">' + practiceCopy.eyebrow + '</p><div><h1>' + practiceCopy.title + '</h1><p>' + practiceCopy.lead + '</p></div></header>' +
      profileSection(localizedProfile("ht"), practiceCopy.haiti) +
      profileSection(localizedProfile("us"), practiceCopy.usa) +
      '<section class="about-coda band"><div><p class="eyebrow">' + practiceCopy.closingEyebrow + '</p><h2>' + practiceCopy.closingTitle + '</h2></div><div class="about-coda-copy">' + closingStory + '</div></section>';
  }

  function initializeContact() {
    var form = document.querySelector("[data-contact-form]");
    if (!form) return;
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var status = form.querySelector("[data-form-status]");
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      // Static hosting has no server: open a pre-filled email to Mme Mentor so no request is lost.
      var data = Object.fromEntries(new FormData(form));
      var locale = currentLocale();
      var t = locale === "en" ? { subject: "Project request", name: "Name", email: "Email", phone: "Phone", whatsapp: "WhatsApp", place: "Location", type: "Project type", message: "Message", yes: "Yes", no: "No", status: "Your email app is opening with the request ready to send. If nothing opens, write to mariegmentor@gmail.com or call +1 203-848-5807." }
        : locale === "kr" ? { subject: "Demann pwojè", name: "Non", email: "Imèl", phone: "Telefòn", whatsapp: "WhatsApp", place: "Kote", type: "Kalite pwojè", message: "Mesaj", yes: "Wi", no: "Non", status: "Aplikasyon imèl ou ap louvri ak demann lan pare pou voye. Si anyen pa louvri, ekri mariegmentor@gmail.com oswa rele +1 203-848-5807." }
        : { subject: "Demande de projet", name: "Nom", email: "Courriel", phone: "Téléphone", whatsapp: "WhatsApp", place: "Lieu", type: "Type de projet", message: "Message", yes: "Oui", no: "Non", status: "Votre messagerie s’ouvre avec la demande prête à envoyer. Si rien ne s’ouvre, écrivez à mariegmentor@gmail.com ou appelez le +1 203-848-5807." };
      var lines = [
        t.name + ": " + (data.fullName || ""),
        t.email + ": " + (data.email || ""),
        t.phone + ": " + (data.phone || ""),
        t.whatsapp + ": " + (data.usesWhatsapp ? t.yes : t.no),
        t.place + ": " + [data.city, data.country].filter(Boolean).join(", "),
        t.type + ": " + (data.projectType || ""),
        "",
        t.message + ":",
        data.description || ""
      ];
      var subject = t.subject + " – " + (data.fullName || "");
      window.location.href = "mailto:mariegmentor@gmail.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(lines.join("\n"));
      if (status) status.textContent = t.status;
    });
  }

  function initializeMotion() {
    var header = document.querySelector("[data-site-header]");
    var lastY = window.scrollY;
    var parallax = document.querySelector(".portfolio-callout > img");
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var ticking = false;
    function frame() {
      ticking = false;
      var y = window.scrollY;
      if (header && !body.classList.contains("menu-open")) header.classList.toggle("is-hidden", y > lastY && y > 240);
      lastY = y;
      if (parallax && !reduce) {
        var r = parallax.parentElement.getBoundingClientRect();
        if (r.bottom > 0 && r.top < window.innerHeight) parallax.style.transform = "translate3d(0," + ((r.top + r.height / 2 - window.innerHeight / 2) * -0.08).toFixed(1) + "px,0)";
      }
    }
    window.addEventListener("scroll", function () { if (!ticking) { ticking = true; window.requestAnimationFrame(frame); } }, { passive: true });
  }

  function initializeTransitions() {
    // Name the clicked project image so it morphs into the next page's hero (cross-document View Transitions).
    document.addEventListener("click", function (event) {
      var link = event.target.closest("a[data-vt]");
      if (!link) return;
      document.querySelectorAll("[style*='view-transition-name']").forEach(function (node) { if (!node.closest(".project-hero")) node.style.viewTransitionName = ""; });
      var image = link.querySelector("img");
      if (image) { image.style.viewTransitionName = link.dataset.vt; image.style.viewTransitionClass = "project-image"; }
    });
    window.addEventListener("pageshow", function () {
      document.querySelectorAll("a[data-vt] img").forEach(function (image) { image.style.viewTransitionName = ""; });
    });
  }

  initializePreferences();
  renderShell();
  renderServices();
  renderProjects();
  initializeHero();
  initializeFilters();
  renderProjectDetail();
  renderAbout();
  bindControls();
  initializeMotion();
  initializeTransitions();
  initializeContact();
  syncPreferences();
  document.addEventListener("mgm:preferences", filterProjects);
  document.addEventListener("mgm:preferences", renderProjects);
  document.addEventListener("mgm:preferences", initializeFilters);
  document.addEventListener("mgm:preferences", renderProjectDetail);
  document.addEventListener("mgm:preferences", renderAbout);
}());
