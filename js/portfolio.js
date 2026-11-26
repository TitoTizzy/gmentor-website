(function () {
  "use strict";

  var root = document.documentElement;
  var bookElement = document.querySelector("[data-portfolio-book]");
  var stage = document.querySelector("[data-book-stage]");
  var counter = document.querySelector("[data-book-counter]");
  var pageFlip = null;

  if (!bookElement || !window.MGM_DATA || !window.St) return;

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>"]/g, function (character) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[character];
    });
  }

  function isDrawing(item) {
    return /plan|elevation|élévation|coupe|section|fondation|foundation|floor|roof|cad|-wm\./i.test((item.label || "") + " " + (item.src || ""));
  }

  function needsFullPage(item) {
    return isDrawing(item) || item.layout === "full";
  }

  var ZOOM_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 9V4h5M20 15v5h-5M20 4l-6 6M4 20l6-6"/></svg>';
  var lightboxSets = {};

  function galleryPage(project, item, position, total, copy) {
    var drawing = isDrawing(item);
    return '<article class="book-page book-gallery"><div class="book-gallery-layout"><header><span>' + String(position + 1).padStart(2, "0") + ' / ' + String(total).padStart(2, "0") + '</span><strong>' + escapeHtml(project.title) + '</strong></header>' +
      '<div class="book-gallery-grid"><figure class="book-gallery-item' + (drawing ? ' is-drawing' : '') + '"><img src="images/' + escapeHtml(item.src) + '" alt="' + escapeHtml(item.alt) + '" loading="lazy"><figcaption>' + escapeHtml(item.label) + '</figcaption>' +
      '<button class="zoom-hint" type="button" data-book-zoom="' + escapeHtml(project.slug) + '" data-book-index="' + position + '" aria-label="' + escapeHtml(copy.enlarge) + '">' + ZOOM_ICON + '</button></figure></div></div></article>';
  }

  function projectPages(project, copy) {
    var pages = [
      '<article class="book-page book-project"><div class="book-project-layout"><img class="book-project-image" src="images/' + escapeHtml(project.cover) + '" alt="' + escapeHtml(project.alt) + '"><div class="book-project-copy"><p class="eyebrow">' + escapeHtml([project.city, project.country].filter(Boolean).join(", ")) + '</p><h2>' + escapeHtml(project.title) + '</h2><p>' + escapeHtml(project.description) + '</p><dl><div><dt>' + copy.type + '</dt><dd>' + escapeHtml(project.type) + '</dd></div>' + (project.program ? '<div><dt>' + copy.program + '</dt><dd>' + escapeHtml(project.program) + '</dd></div>' : '') + (project.year ? '<div><dt>' + copy.year + '</dt><dd>' + escapeHtml(project.year) + '</dd></div>' : '') + '</dl></div></div></article>',
    ];
    // One image per page, shown whole; any page can open the full-screen viewer.
    var items = (project.coverFullPage ? [{ src: project.cover, alt: project.alt, label: copy.featuredImage }] : []).concat(project.gallery);
    lightboxSets[project.slug] = { title: project.title, items: items.map(function (item) { return { src: "images/" + item.src, alt: item.alt, label: item.label, drawing: isDrawing(item) }; }) };
    items.forEach(function (item, index) { pages.push(galleryPage(project, item, index, items.length, copy)); });
    return pages;
  }

  function buildBook() {
    var locale = root.dataset.locale || "fr";
    var projects = window.MGM_DATA.projects.filter(function (project) {
      return project.published;
    }).map(function (project) { return window.MGM_LOCALIZE_PROJECT ? window.MGM_LOCALIZE_PROJECT(project) : project; });
    var cover = projects[0];
    var copy = locale === "en" ? {
      label: "Haiti · United States",
      title: "Design across borders.",
      intro: "One image per page, shown whole. Click any image to open it full screen and zoom in.",
      count: " projects",
      type: "Type",
      program: "Program",
      year: "Year",
      selection: "Portfolio selection",
      contact: "Discuss a project",
      featuredImage: "Featured view",
      enlarge: "View full screen",
      credential: "Residential Design & Planning · Licensed Architect in Haiti"
    } : locale === "kr" ? {
      label: "Ayiti · Etazini",
      title: "Konsepsyon atravè fwontyè.",
      intro: "Yon imaj pa paj, ou wè l antye. Klike sou nenpòt imaj pou louvri l sou tout ekran an epi grosi l.",
      count: " pwojè",
      type: "Kalite",
      program: "Pwogram",
      year: "Ane",
      selection: "Seleksyon pwojè",
      contact: "Pale sou yon pwojè",
      featuredImage: "Vi prensipal",
      enlarge: "Gade sou tout ekran an",
      credential: "Konsepsyon ak planifikasyon rezidansyèl · Achitèk lisansye ann Ayiti"
    } : {
      label: "Haïti · États-Unis",
      title: "La conception au-delà des frontières.",
      intro: "Une image par page, à voir en entier. Cliquez sur une image pour l’ouvrir en plein écran et zoomer.",
      count: " projets",
      type: "Type",
      program: "Programme",
      year: "Année",
      selection: "Sélection du projet",
      contact: "Parler de votre projet",
      featuredImage: "Vue principale",
      enlarge: "Voir en plein écran",
      credential: "Design résidentiel et planification · Architecte licenciée en Haïti"
    };
    var pages = [
      '<article class="book-page book-cover" data-density="hard"><img src="images/' + escapeHtml(cover.cover) + '" alt=""><div class="book-cover-shade"></div><div class="book-cover-copy"><img class="logo-on-dark" src="assets/mgm-mark-white.png" alt="Marie Gaëlle Mentor"><p>' + copy.label + '</p><h2>Marie Gaëlle Mentor</h2><span>' + copy.credential + '</span></div></article>',
      '<article class="book-page book-opening"><p class="eyebrow">' + copy.label + '</p><h2>' + copy.title + '</h2><p>' + copy.intro + '</p><span class="book-opening-count">' + projects.length + copy.count + '</span></article>'
    ];
    projects.forEach(function (project) { pages = pages.concat(projectPages(project, copy)); });
    var promise = locale === "fr" ? "Des espaces qui inspirent un avenir meilleur" : locale === "kr" ? "Espas ki enspire yon demen miyò" : "Spaces that inspire a better tomorrow";
    pages.push('<article class="book-page book-back" data-density="hard"><img class="logo-on-dark" src="assets/mgm-mark-white.png" alt="Marie Gaëlle Mentor"><p>' + promise + '</p><a href="contact.html">' + copy.contact + '</a></article>');

    if (pageFlip) {
      pageFlip.destroy();
      bookElement = document.createElement("div");
      bookElement.className = "portfolio-book";
      bookElement.dataset.portfolioBook = "";
      stage.appendChild(bookElement);
    }
    bookElement.innerHTML = pages.join("");
    pageFlip = new window.St.PageFlip(bookElement, {
      width: 550,
      height: 720,
      size: "stretch",
      minWidth: 280,
      maxWidth: 550,
      minHeight: 380,
      maxHeight: 720,
      drawShadow: true,
      flippingTime: 850,
      usePortrait: true,
      startZIndex: 0,
      autoSize: true,
      maxShadowOpacity: 0.42,
      showCover: true,
      mobileScrollSupport: false,
      swipeDistance: 24
    });
    pageFlip.on("flip", updateCounter);
    pageFlip.on("init", updateCounter);
    pageFlip.loadFromHTML(bookElement.querySelectorAll(".book-page"));

    document.querySelector("[data-book-label]").textContent = copy.label;
    document.querySelector("[data-book-title]").textContent = copy.title;
    document.querySelector("[data-book-intro]").textContent = copy.intro;
  }

  function updateCounter(event) {
    var current = event && typeof event.data === "number" ? event.data : pageFlip.getCurrentPageIndex();
    counter.textContent = (current + 1) + " / " + pageFlip.getPageCount();
  }

  document.querySelector("[data-book-prev]").addEventListener("click", function () { pageFlip.flipPrev("top"); });
  document.querySelector("[data-book-next]").addEventListener("click", function () { pageFlip.flipNext("top"); });
  document.querySelector("[data-book-fullscreen]").addEventListener("click", function () {
    if (document.fullscreenElement) document.exitFullscreen();
    else if (stage.requestFullscreen) stage.requestFullscreen();
  });
  stage.addEventListener("click", function (event) {
    var button = event.target.closest("[data-book-zoom]");
    if (!button || !window.MGMLightbox) return;
    event.preventDefault();
    event.stopPropagation();
    var set = lightboxSets[button.dataset.bookZoom];
    if (document.fullscreenElement) document.exitFullscreen();
    if (set) window.MGMLightbox.open(set.items, Number(button.dataset.bookIndex), set.title, button);
  }, true);
  stage.addEventListener("dblclick", function (event) {
    var figure = event.target.closest(".book-gallery-item");
    if (figure) figure.querySelector("[data-book-zoom]").click();
  });
  document.addEventListener("keydown", function (event) {
    if (document.body.classList.contains("lightbox-open")) return;
    if (event.key === "ArrowLeft") pageFlip.flipPrev("top");
    if (event.key === "ArrowRight") pageFlip.flipNext("top");
  });
  document.addEventListener("mgm:preferences", buildBook);
  buildBook();
}());
