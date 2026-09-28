(function () {
  "use strict";

  var root = document.documentElement;
  var body = document.body;
  var assetRoot = body.dataset.root || ".";
  var page = body.dataset.page || "home";
  var siteVariant = window.MGM_SITE_VARIANT || "global";
  var labels = {
    en: { home: "Home", about: "About", projects: "Projects", portfolio: "Portfolio", contact: "Contact", title: "Global Architectural Practice" },
    fr: { home: "Accueil", about: "À propos", projects: "Réalisations", portfolio: "Portfolio", contact: "Contact", title: "Pratique architecturale globale" },
    kr: { home: "Akèy", about: "Konsènan", projects: "Pwojè", portfolio: "Pòtfolyo", contact: "Kontak", title: "Pratik achitekti global" }
  };
  var pageTitles = {
    en: { home: "Global Portal", about: "About", projects: "Projects", portfolio: "Portfolio", contact: "Contact", privacy: "Privacy", legal: "Legal Notice", cookies: "Cookies", project: "Project", "404": "Page Not Found" },
    fr: { home: "Portail global", about: "À propos", projects: "Réalisations", portfolio: "Portfolio", contact: "Contact", privacy: "Confidentialité", legal: "Mentions légales", cookies: "Cookies", project: "Projet", "404": "Page introuvable" },
    kr: { home: "Pòtal global", about: "Konsènan", projects: "Pwojè", portfolio: "Pòtfolyo", contact: "Kontak", privacy: "Konfidansyalite", legal: "Avi legal", cookies: "Cookies", project: "Pwojè", "404": "Paj pa jwenn" }
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
      fr: { "Built work": "Réalisation", "First floor plan": "Plan du rez-de-chaussée", "Front elevation": "Élévation avant", "Landscape": "Paysage", "Interior": "Intérieur", "Basement plan": "Plan du sous-sol", "Floor plans": "Plans", "Elevations": "Élévations" },
      kr: { "Built work": "Reyalizasyon", "First floor plan": "Plan premye nivo", "Front elevation": "Elevasyon devan", "Landscape": "Peyizaj", "Interior": "Enteryè", "Basement plan": "Plan sousòl", "Floor plans": "Plan yo", "Elevations": "Elevasyon yo", "Étude 3D": "Etid 3D", "Chantier": "Chantye", "Réalisation": "Reyalizasyon", "Vue": "Vi", "Vue intérieure": "Vi enteryè", "Plan": "Plan", "Coupes": "Koup", "Intérieur": "Enteryè", "Fondations": "Fondasyon", "Plan 2 chambres": "Plan 2 chanm", "Plan 3 chambres": "Plan 3 chanm" }
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
    if (siteVariant === "global") {
      var globalLocale = localStorage.getItem("mgm-global-locale") || (browserLanguage.indexOf("ht") === 0 ? "kr" : browserLanguage.indexOf("fr") === 0 ? "fr" : "en");
      root.dataset.market = "global";
      root.dataset.locale = globalLocale;
      root.dataset.siteVariant = "global";
      root.dataset.theme = localStorage.getItem("mgm-theme") || (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
      return;
    }
    if (siteVariant === "usa") {
      root.dataset.market = "us";
      root.dataset.locale = "en";
      root.dataset.siteVariant = "usa";
      root.dataset.theme = localStorage.getItem("mgm-theme") || (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
      return;
    }
    var savedMarket = localStorage.getItem("mgm-market");
    var market = savedMarket || (/^(fr|ht)/.test(browserLanguage) ? "ht" : "us");
    var locale = localStorage.getItem("mgm-locale") || (market === "us" ? "en" : browserLanguage.indexOf("ht") === 0 ? "kr" : "fr");
    var theme = localStorage.getItem("mgm-theme") || (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    root.dataset.market = market;
    root.dataset.locale = market === "us" ? "en" : locale;
    root.dataset.theme = theme;
    root.dataset.siteVariant = "global";
  }

  function renderShell() {
    var header = document.querySelector("[data-site-header]");
    var footer = document.querySelector("[data-site-footer]");
    var shellLocale = siteVariant === "usa" ? "en" : (root.dataset.locale || "fr");
    var shellText = shellLocale === "en" ? {
      home: "home", menu: "Open menu", navigation: "Primary navigation", theme: "Change theme", footer: "Marie Gaëlle Mentor Architectural Designer"
    } : {
      home: "accueil", menu: "Ouvrir le menu", navigation: "Navigation principale", theme: "Changer le thème", footer: "Architecte Marie Gaëlle Mentor"
    };
    var marketTools = siteVariant === "global" ? '<div class="segmented locale-switch" aria-label="Language"><button type="button" data-locale="en">EN</button><button type="button" data-locale="fr">FR</button><button type="button" data-locale="kr">KR</button></div>' : "";
    if (header) {
      header.innerHTML = [
        '<a class="brand" href="' + href("index.html") + '" aria-label="Marie Gaëlle Mentor, ' + shellText.home + '">',
        '<img class="theme-logo" src="' + href("assets/mgm-logo-dark.png") + '" alt="" width="56" height="56">',
        '<span class="brand-copy"><strong>Marie Gaëlle Mentor</strong><small data-market-title></small></span></a>',
        '<button class="icon-button nav-toggle" type="button" aria-label="' + shellText.menu + '" aria-expanded="false" data-nav-toggle><span aria-hidden="true">☰</span></button>',
        '<nav class="main-nav" aria-label="' + shellText.navigation + '" data-nav>',
        navLink("index.html", "home"), navLink("about.html", "about"), navLink("projects.html", "projects"), navLink("portfolio.html", "portfolio"), navLink("contact.html", "contact"),
        '</nav>',
        '<div class="header-tools">' + marketTools,
        '<button class="icon-button" type="button" aria-label="' + shellText.theme + '" data-theme-toggle><span aria-hidden="true">◐</span></button></div>'
      ].join("");
    }
    if (footer) {
      footer.innerHTML = '<div><img class="theme-logo" src="' + href("assets/mgm-logo-dark.png") + '" alt="Logo Marie Gaëlle Mentor" width="80" height="80"><p data-footer-title>' + shellText.footer + '</p></div>' +
        '<div class="footer-links"><a href="' + href("privacy.html") + '" data-i18n data-en="Privacy" data-fr="Confidentialité" data-kr="Konfidansyalite">Confidentialité</a><a href="' + href("cookies.html") + '">Cookies</a><a href="' + href("legal.html") + '" data-i18n data-en="Legal notice" data-fr="Mentions légales" data-kr="Avi legal">Mentions légales</a></div>' +
        '<p class="footer-note">© ' + new Date().getFullYear() + ' Marie Gaëlle Mentor</p>';
    }
    if (!document.querySelector("[data-consent]")) {
      var consent = document.createElement("aside");
      consent.className = "consent";
      consent.hidden = true;
      consent.dataset.consent = "";
      consent.setAttribute("aria-label", "Préférences statistiques");
      consent.innerHTML = '<p data-i18n data-en="This website uses privacy-friendly analytics to improve its content." data-fr="Ce site utilise des statistiques respectueuses de la vie privée afin d’améliorer son contenu." data-kr="Sit sa a itilize estatistik ki respekte vi prive pou amelyore kontni li.">Ce site utilise des statistiques respectueuses de la vie privée afin d’améliorer son contenu.</p><div class="consent-actions"><button class="button button-primary" type="button" data-consent-choice="accepted" data-i18n data-en="Accept" data-fr="Accepter" data-kr="Aksepte">Accepter</button><button class="button" type="button" data-consent-choice="refused" data-i18n data-en="Decline" data-fr="Refuser" data-kr="Refize">Refuser</button></div>';
      body.appendChild(consent);
    }
  }

  function navLink(file, key) {
    var current = page === key ? ' aria-current="page"' : "";
    return '<a href="' + href(file) + '" data-nav-label="' + key + '"' + current + '></a>';
  }

  function syncPreferences() {
    var market = siteVariant === "global" ? "global" : "us";
    var locale = siteVariant === "global" ? (root.dataset.locale || "fr") : "en";
    root.dataset.market = market;
    root.dataset.locale = locale;
    root.lang = locale === "kr" ? "ht" : locale;
    if (page !== "project") document.title = (pageTitles[locale][page] || "Marie Gaëlle Mentor") + " | Marie Gaëlle Mentor";
    document.querySelectorAll("[data-market]").forEach(function (button) {
      if (button.tagName === "BUTTON") button.setAttribute("aria-pressed", String(button.dataset.market === market));
    });
    document.querySelectorAll("[data-locale]").forEach(function (button) {
      button.setAttribute("aria-pressed", String(button.dataset.locale === locale));
    });
    document.querySelectorAll("[data-nav-label]").forEach(function (link) {
      link.textContent = labels[locale][link.dataset.navLabel];
    });
    var title = document.querySelector("[data-market-title]");
    if (title) title.textContent = labels[locale].title;
    var footerTitle = document.querySelector("[data-footer-title]");
    if (footerTitle) footerTitle.textContent = locale === "en" ? "Marie Gaëlle Mentor | Global Architectural Practice" : locale === "kr" ? "Marie Gaëlle Mentor | Pratik achitekti global" : "Marie Gaëlle Mentor | Pratique architecturale globale";
    document.querySelectorAll("[data-i18n]").forEach(function (node) {
      var translated = node.dataset[locale] || node.dataset.fr;
      if (translated) node.textContent = translated;
    });
    document.querySelectorAll("[data-market-image]").forEach(function (image) {
      var source = siteVariant === "global" ? image.getAttribute("src") : image.dataset.usSrc;
      if (source && image.getAttribute("src") !== source) image.setAttribute("src", source);
    });
    document.dispatchEvent(new CustomEvent("mgm:preferences"));
  }

  function bindControls() {
    var navButton = document.querySelector("[data-nav-toggle]");
    var nav = document.querySelector("[data-nav]");

    function closeNavigation() {
      if (!navButton || !nav) return;
      navButton.setAttribute("aria-expanded", "false");
      navButton.setAttribute("aria-label", siteVariant === "usa" ? "Open menu" : "Ouvrir le menu");
      navButton.firstElementChild.textContent = "☰";
      nav.classList.remove("open");
      body.classList.remove("menu-open");
    }

    document.querySelectorAll("button[data-market]").forEach(function (button) {
      button.addEventListener("click", function () {
        root.dataset.market = button.dataset.market;
        root.dataset.locale = button.dataset.market === "us" ? "en" : (localStorage.getItem("mgm-locale-ht") || "fr");
        localStorage.setItem("mgm-market", root.dataset.market);
        syncPreferences();
        closeNavigation();
      });
    });
    document.querySelectorAll("button[data-locale]").forEach(function (button) {
      button.addEventListener("click", function () {
        root.dataset.locale = button.dataset.locale;
        localStorage.setItem("mgm-locale", root.dataset.locale);
        localStorage.setItem("mgm-locale-ht", root.dataset.locale);
        localStorage.setItem("mgm-global-locale", root.dataset.locale);
        syncPreferences();
        closeNavigation();
      });
    });
    var themeButton = document.querySelector("[data-theme-toggle]");
    if (themeButton) themeButton.addEventListener("click", function () {
      root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
      localStorage.setItem("mgm-theme", root.dataset.theme);
    });
    if (navButton && nav) navButton.addEventListener("click", function () {
      var open = navButton.getAttribute("aria-expanded") !== "true";
      navButton.setAttribute("aria-expanded", String(open));
      navButton.setAttribute("aria-label", open ? (siteVariant === "usa" ? "Close menu" : "Fermer le menu") : (siteVariant === "usa" ? "Open menu" : "Ouvrir le menu"));
      navButton.firstElementChild.textContent = open ? "×" : "☰";
      nav.classList.toggle("open", open);
      body.classList.toggle("menu-open", open);
    });
  }

  function initializeConsent() {
    var panel = document.querySelector("[data-consent]");
    if (!panel || localStorage.getItem("mgm-analytics-consent")) return;
    panel.hidden = false;
    panel.querySelectorAll("[data-consent-choice]").forEach(function (button) {
      button.addEventListener("click", function () {
        localStorage.setItem("mgm-analytics-consent", button.dataset.consentChoice);
        panel.hidden = true;
      });
    });
  }

  function renderServices() {
    var grid = document.querySelector("[data-services]");
    if (!grid || !window.MGM_DATA) return;
    grid.innerHTML = window.MGM_DATA.services.map(function (service, index) {
      return '<article class="service"><span>0' + (index + 1) + '</span><h3 data-i18n data-en="' + service.en + '" data-fr="' + service.fr + '" data-kr="' + service.kr + '">' + service.fr + '</h3></article>';
    }).join("");
  }

  function projectCard(project, index) {
    project = localizedProject(project);
    return '<article class="project-card" data-project data-market="' + project.markets.join(",") + '" data-country="' + project.country + '" data-city="' + project.city + '" data-year="' + project.year + '" data-type="' + project.type + '">' +
      '<a href="' + href("project.html?slug=" + encodeURIComponent(project.slug)) + '"><figure><img src="' + href("images/" + project.cover) + '" alt="' + project.alt + '" width="1600" height="1067" loading="' + (index < 2 ? "eager" : "lazy") + '"></figure>' +
      '<div class="project-copy"><p class="eyebrow">' + [project.city, project.country].filter(Boolean).join(", ") + '</p><h2>' + project.title + '</h2><p>' + project.type + '</p></div></a></article>';
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
    var market = root.dataset.market || "global";
    var values = form ? Object.fromEntries(new FormData(form)) : {};
    var visible = 0;
    cards.forEach(function (card) {
      var marketMatch = market === "global" || card.dataset.market.split(",").indexOf(market) >= 0;
      var filterMatch = ["country", "city", "year", "type"].every(function (key) {
        return !values[key] || card.dataset[key] === values[key];
      });
      card.hidden = !(marketMatch && filterMatch);
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
    function buildHero() {
      var projects = sourceProjects.map(localizedProject);
      var discover = currentLocale() === "en" ? "Discover" : currentLocale() === "kr" ? "Dekouvri" : "Découvrir";
      var display = currentLocale() === "en" ? "Show" : currentLocale() === "kr" ? "Montre" : "Afficher";
      slides.innerHTML = projects.map(function (project, index) {
        return '<article class="hero-slide" data-hero-slide data-market="' + project.markets.join(",") + '"><img src="' + href("images/" + project.cover) + '" alt="' + project.alt + '" width="1600" height="1067"><div class="hero-overlay"></div><a class="hero-link" href="' + href("project.html?slug=" + encodeURIComponent(project.slug)) + '" aria-label="' + discover + ' ' + project.title + '"></a><div class="hero-content"><img class="hero-logo theme-logo" src="' + href("assets/mgm-logo-dark.png") + '" alt="Marie Gaëlle Mentor"><div class="hero-meta"><div><p class="eyebrow">' + [project.city, project.country].filter(Boolean).join(", ") + '</p><h1>' + project.title + '</h1><p>' + project.type + '</p></div><span class="hero-count">0' + (index + 1) + '</span></div></div></article>';
      }).join("");
      dots.innerHTML = projects.map(function (project, index) { return '<button type="button" aria-label="' + display + ' ' + project.title + '" data-hero-dot="' + index + '"></button>'; }).join("");
      hero.querySelectorAll("[data-hero-dot]").forEach(function (dot) { dot.addEventListener("click", function () { show(Number(dot.dataset.heroDot)); }); });
    }

    function show(index) {
      var market = root.dataset.market || "global";
      var eligible = sourceProjects.map(function (project, itemIndex) { return market === "global" || project.markets.indexOf(market) >= 0 ? itemIndex : -1; }).filter(function (itemIndex) { return itemIndex >= 0; });
      active = eligible.indexOf(index) >= 0 ? index : (eligible[0] || 0);
      hero.querySelectorAll("[data-hero-slide]").forEach(function (slide, itemIndex) {
        slide.hidden = eligible.indexOf(itemIndex) < 0;
        slide.classList.toggle("active", itemIndex === active);
      });
      hero.querySelectorAll("[data-hero-dot]").forEach(function (dot, itemIndex) {
        dot.hidden = eligible.indexOf(itemIndex) < 0;
        dot.setAttribute("aria-pressed", String(itemIndex === active));
      });
    }
    buildHero();
    document.addEventListener("mgm:preferences", function () { buildHero(); show(active); });
    show(0);
  }

  function renderProjectDetail() {
    var target = document.querySelector("[data-project-detail]");
    if (!target || !window.MGM_DATA) return;
    var slug = new URLSearchParams(location.search).get("slug");
    var project = window.MGM_DATA.projects.find(function (item) { return item.slug === slug && item.published; });
    if (!project) {
      target.innerHTML = siteVariant === "usa" ? '<div class="page-shell container"><p class="eyebrow">Project</p><h1>Project not found</h1><p><a class="text-link" href="projects.html">Back to projects</a></p></div>' : '<div class="page-shell container"><p class="eyebrow">Projet</p><h1>Projet introuvable</h1><p><a class="text-link" href="projects.html">Retour aux réalisations</a></p></div>';
      return;
    }
    var projectMarket = project.markets[0];
    project = localizedProject(project);
    if (siteVariant !== "global" && projectMarket && root.dataset.market !== projectMarket) {
      root.dataset.market = projectMarket;
      root.dataset.locale = projectMarket === "us" ? "en" : (localStorage.getItem("mgm-locale-ht") || "fr");
      localStorage.setItem("mgm-market", projectMarket);
    }
    var detailLabels = currentLocale() === "en" ? {
      project: "Project", location: "Location", year: "Year", type: "Type", role: "Role", unknownYear: "Not specified", gallery: "Project photos and drawings"
    } : currentLocale() === "kr" ? {
      project: "Pwojè", location: "Kote", year: "Ane", type: "Kalite", role: "Wòl", unknownYear: "Pa presize", gallery: "Foto ak plan pwojè a"
    } : {
      project: "Projet", location: "Lieu", year: "Année", type: "Typologie", role: "Mission", unknownYear: "Non précisée", gallery: "Photos et plans du projet"
    };
    document.title = project.title + " | Marie Gaëlle Mentor";
    var gallery = (project.gallery || []).map(function (item, index) {
      return '<figure class="project-media project-media-' + ((index % 5) + 1) + '"><img src="' + href("images/" + item.src) + '" alt="' + item.alt + '" loading="lazy"><figcaption>' + item.label + '</figcaption></figure>';
    }).join("");
    target.innerHTML = '<section class="project-hero"><img src="' + href("images/" + project.cover) + '" alt="' + project.alt + '"><div class="project-hero-copy"><p class="eyebrow">' + project.type + '</p><h1>' + project.title + '</h1></div></section>' +
      '<div class="container"><section class="project-intro band"><div><p class="eyebrow">' + detailLabels.project + '</p><p class="project-lead">' + project.description + '</p></div><dl class="project-meta"><div><dt>' + detailLabels.location + '</dt><dd>' + ([project.city, project.country].filter(Boolean).join(", ") || "—") + '</dd></div><div><dt>' + detailLabels.year + '</dt><dd>' + (project.year || detailLabels.unknownYear) + '</dd></div><div><dt>' + detailLabels.type + '</dt><dd>' + project.type + '</dd></div><div><dt>' + detailLabels.role + '</dt><dd>' + project.role + '</dd></div></dl></section>' +
      '<section class="project-gallery band" aria-label="' + detailLabels.gallery + '">' + gallery + '</section></div>';
  }

  function renderAbout() {
    var target = document.querySelector("[data-about-content]");
    if (!target || !window.MGM_DATA || !window.MGM_DATA.profiles) return;
    var locale = root.dataset.locale || "fr";
    var globalCopy = locale === "en" ? {
      eyebrow: "Global portal",
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
      eyebrow: "Pòtal global",
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
      eyebrow: "Portail global",
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
      return '<section class="global-profile band"><div class="section-heading"><div><p class="eyebrow">' + heading + '</p><h2>' + profile.title + '</h2></div></div>' +
        '<div class="about-facts" aria-label="' + globalCopy.milestones + '">' + facts + '</div>' +
        '<div class="about-grid">' + portraitMarkup + '<div class="about-copy glass-panel"><p class="eyebrow">' + profile.eyebrow + '</p><h2>' + profile.storyTitle + '</h2><div class="about-story">' + story + '</div><p class="practice-statement">' + profile.quote + '</p></div></div>' +
        '<div class="about-history band"><div class="section-heading"><div><p class="eyebrow">' + globalCopy.milestones + '</p></div></div><div class="timeline">' + timeline + '</div></div>' +
        '<div class="about-values band"><div class="section-heading"><div><p class="eyebrow">' + globalCopy.principles + '</p></div></div><div class="about-value-list">' + values + '</div></div></section>';
    }

    var closingStory = globalCopy.closingParagraphs.map(function (paragraph) { return '<p>' + paragraph + '</p>'; }).join("");
    target.innerHTML = '<header class="page-intro"><p class="eyebrow">' + globalCopy.eyebrow + '</p><div><h1>' + globalCopy.title + '</h1><p>' + globalCopy.lead + '</p></div></header>' +
      profileSection(localizedProfile("ht"), globalCopy.haiti) +
      profileSection(localizedProfile("us"), globalCopy.usa) +
      '<section class="about-coda band"><div><p class="eyebrow">' + globalCopy.closingEyebrow + '</p><h2>' + globalCopy.closingTitle + '</h2></div><div class="about-coda-copy">' + closingStory + '</div></section>';
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
      var requests = JSON.parse(localStorage.getItem("mgm-demo-requests") || "[]");
      var request = Object.fromEntries(new FormData(form));
      request.market = root.dataset.market || "global";
      request.locale = root.dataset.locale || "fr";
      request.createdAt = new Date().toISOString();
      requests.push(request);
      localStorage.setItem("mgm-demo-requests", JSON.stringify(requests));
      form.reset();
      if (status) status.textContent = currentLocale() === "en" ? "Request saved in this demonstration. The backend can then send it to Supabase." : currentLocale() === "kr" ? "Demann lan anrejistre nan demonstrasyon sa a. Sèvè a kapab voye li bay Supabase apre sa." : "Demande enregistrée dans cette démonstration. Le backend pourra ensuite l’envoyer à Supabase.";
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
  initializeConsent();
  initializeContact();
  syncPreferences();
  document.addEventListener("mgm:preferences", filterProjects);
  document.addEventListener("mgm:preferences", renderProjects);
  document.addEventListener("mgm:preferences", initializeFilters);
  document.addEventListener("mgm:preferences", renderProjectDetail);
  document.addEventListener("mgm:preferences", renderAbout);
}());
