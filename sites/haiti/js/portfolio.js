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

  function projectPages(project, copy) {
    var drawing = project.gallery.find(function (item) { return /plan|elevation|coupe|section|fondation/i.test(item.label); }) || project.gallery[0];
    return [
      '<article class="book-page book-project"><div class="book-project-layout"><img class="book-project-image" src="images/' + escapeHtml(project.cover) + '" alt="' + escapeHtml(project.alt) + '"><div class="book-project-copy"><p class="eyebrow">' + escapeHtml([project.city, project.country].filter(Boolean).join(", ")) + '</p><h2>' + escapeHtml(project.title) + '</h2><p>' + escapeHtml(project.description) + '</p><dl><div><dt>' + copy.type + '</dt><dd>' + escapeHtml(project.type) + '</dd></div><div><dt>' + copy.role + '</dt><dd>' + escapeHtml(project.role) + '</dd></div></dl></div></div></article>',
      imagePage(project, drawing, "book-drawing")
    ];
  }

  function buildBook() {
    var locale = root.dataset.locale || "fr";
    var projects = window.MGM_DATA.projects.filter(function (project) {
      return project.published;
    }).map(function (project) { return window.MGM_LOCALIZE_PROJECT ? window.MGM_LOCALIZE_PROJECT(project) : project; });
    var cover = projects[0];
    var copy = locale === "en" ? {
      label: "Global Portfolio",
      title: "Architecture across borders.",
      intro: "Built work, photographs and drawings from Haiti and the United States.",
      count: " projects",
      type: "Type",
      role: "Role",
      contact: "Discuss a project"
    } : locale === "kr" ? {
      label: "Pòtfolyo global",
      title: "Achitekti atravè fwontyè.",
      intro: "Pwojè, foto ak plan ki soti ann Ayiti ak Ozetazini.",
      count: " pwojè",
      type: "Kalite",
      role: "Wòl",
      contact: "Pale sou yon pwojè"
    } : {
      label: "Portfolio global",
      title: "L'architecture au-delà des frontières.",
      intro: "Réalisations, photographies et plans provenant d'Haïti et des États-Unis.",
      count: " projets",
      type: "Type",
      role: "Mission",
      contact: "Parler de votre projet"
    };
    var pages = [
      '<article class="book-page book-cover" data-density="hard"><img src="images/' + escapeHtml(cover.cover) + '" alt=""><div class="book-cover-shade"></div><div class="book-cover-copy"><img class="theme-logo" src="assets/mgm-mark.svg" alt="Marie Gaëlle Mentor"><p>' + copy.label + '</p><h2>Marie Gaëlle Mentor</h2><span>Building Designer · Licensed Architect in Haiti</span></div></article>',
      '<article class="book-page book-opening"><p class="eyebrow">' + copy.label + '</p><h2>' + copy.title + '</h2><p>' + copy.intro + '</p><span class="book-opening-count">' + projects.length + copy.count + '</span></article>'
    ];
    projects.forEach(function (project) { pages = pages.concat(projectPages(project, copy)); });
    var promise = locale === "fr" ? "Des espaces qui inspirent un avenir meilleur" : locale === "kr" ? "Espas ki enspire yon demen miyò" : "Spaces that inspire a better tomorrow";
    pages.push('<article class="book-page book-back" data-density="hard"><img class="theme-logo" src="assets/mgm-mark.svg" alt="Marie Gaëlle Mentor"><p>' + promise + '</p><a href="contact.html">' + copy.contact + '</a></article>');

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

    document.querySelector("[data-book-market-label]").textContent = copy.label;
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
  document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") pageFlip.flipPrev("top");
    if (event.key === "ArrowRight") pageFlip.flipNext("top");
  });
  document.addEventListener("mgm:preferences", buildBook);
  buildBook();
}());
