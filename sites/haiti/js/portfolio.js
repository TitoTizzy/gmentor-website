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

  function imagePage(project, item, pageClass) {
    return '<article class="book-page ' + pageClass + '"><div class="book-page-media"><img src="images/' + escapeHtml(item.src) + '" alt="' + escapeHtml(item.alt) + '"></div><div class="book-page-caption"><span>' + escapeHtml(item.label) + '</span><strong>' + escapeHtml(project.title) + '</strong></div></article>';
  }

  function projectPages(project) {
    var drawing = project.gallery.find(function (item) { return /plan|elevation|coupe|section|fondation/i.test(item.label); }) || project.gallery[0];
    return [
      '<article class="book-page book-project"><div class="book-project-layout"><img class="book-project-image" src="images/' + escapeHtml(project.cover) + '" alt="' + escapeHtml(project.alt) + '"><div class="book-project-copy"><p class="eyebrow">' + escapeHtml([project.city, project.country].filter(Boolean).join(", ")) + '</p><h2>' + escapeHtml(project.title) + '</h2><p>' + escapeHtml(project.description) + '</p><dl><div><dt>Type</dt><dd>' + escapeHtml(project.type) + '</dd></div><div><dt>' + (project.markets[0] === "us" ? "Role" : "Mission") + '</dt><dd>' + escapeHtml(project.role) + '</dd></div></dl></div></div></article>',
      imagePage(project, drawing, "book-drawing")
    ];
  }

  function buildBook() {
    var market = root.dataset.market || "ht";
    var isUs = market === "us";
    var projects = window.MGM_DATA.projects.filter(function (project) {
      return project.published && project.markets.indexOf(market) >= 0;
    });
    var cover = projects[0];
    var pages = [
      '<article class="book-page book-cover" data-density="hard"><img src="images/' + escapeHtml(cover.cover) + '" alt=""><div class="book-cover-shade"></div><div class="book-cover-copy"><img src="assets/mgm-logo.png" alt="Marie Gaëlle Mentor"><p>' + (isUs ? "United States Portfolio" : "Portfolio Haïti") + '</p><h2>Marie Gaëlle Mentor</h2><span>' + (isUs ? "Architectural Designer" : "Architecte licenciée") + '</span></div></article>',
      '<article class="book-page book-opening"><p class="eyebrow">' + (isUs ? "Selected work" : "Projets sélectionnés") + '</p><h2>' + (isUs ? "Architecture grounded in use, place and detail." : "Une architecture pensée pour les usages, le lieu et la durée.") + '</h2><p>' + (isUs ? "A selection of residential work in Connecticut, presented through built photographs and architectural drawings." : "Une sélection de réalisations en Haïti, présentée à travers les photographies de chantier, les espaces livrés, les rendus et les plans.") + '</p><span class="book-opening-count">' + projects.length + (isUs ? " projects" : " projets") + '</span></article>'
    ];
    projects.forEach(function (project) { pages = pages.concat(projectPages(project)); });
    pages.push('<article class="book-page book-back" data-density="hard"><img src="assets/mgm-logo.png" alt="Marie Gaëlle Mentor"><p>Spaces that inspire a better tomorrow</p><a href="contact.html">' + (isUs ? "Discuss a project" : "Parler de votre projet") + '</a></article>');

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

    document.querySelector("[data-book-market-label]").textContent = isUs ? "United States Portfolio" : "Portfolio Haïti";
    document.querySelector("[data-book-title]").textContent = isUs ? "Turn the pages." : "Feuilletez les projets.";
    document.querySelector("[data-book-intro]").textContent = isUs ? "Built work and drawings in an interactive architectural book." : "Photos, rendus et plans réunis dans un livre architectural interactif.";
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
  document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") pageFlip.flipPrev("top");
    if (event.key === "ArrowRight") pageFlip.flipNext("top");
  });
  document.addEventListener("mgm:preferences", buildBook);
  buildBook();
}());
