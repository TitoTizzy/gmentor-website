/* Full-screen image viewer with zoom (wheel, pinch, double-tap, buttons), pan,
   keyboard and swipe navigation. Usage:
   MGMLightbox.open([{ src, alt, label, drawing }], startIndex, title, triggerElement) */
(function () {
  "use strict";

  var ICONS = {
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 5l14 14M19 5L5 19"/></svg>',
    prev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M15 5l-7 7 7 7"/></svg>',
    next: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 5l7 7-7 7"/></svg>',
    zoomIn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21M10.5 7.5v6M7.5 10.5h6"/></svg>',
    zoomOut: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21M7.5 10.5h6"/></svg>',
    reset: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 9V4h5M20 15v5h-5M4 4l6 6M20 20l-6-6"/></svg>'
  };
  var MIN = 1, MAX = 6;

  function t(key) {
    var locale = document.documentElement.dataset.locale || "fr";
    var copy = {
      en: { close: "Close", prev: "Previous image", next: "Next image", zin: "Zoom in", zout: "Zoom out", reset: "Fit to screen", hint: "Scroll, pinch or double-click to zoom · drag to move", viewer: "Image viewer" },
      kr: { close: "Fèmen", prev: "Imaj anvan", next: "Imaj apre", zin: "Grosi", zout: "Diminye", reset: "Ajiste sou ekran an", hint: "Woule, pense oswa klike de fwa pou grosi · glise pou deplase", viewer: "Vizyonè imaj" },
      fr: { close: "Fermer", prev: "Image précédente", next: "Image suivante", zin: "Zoomer", zout: "Dézoomer", reset: "Ajuster à l’écran", hint: "Molette, pincement ou double-clic pour zoomer · glisser pour déplacer", viewer: "Visionneuse d’images" }
    };
    return (copy[locale] || copy.fr)[key];
  }

  var box, stage, img, titleEl, countEl, zoomEl, thumbs, prevBtn, nextBtn, hintEl;
  var items = [], index = 0, title = "", trigger = null;
  var scale = 1, tx = 0, ty = 0;
  var pointers = new Map(), pinchStart = null, dragStart = null, swipeStart = null, lastTap = 0;

  function build() {
    box = document.createElement("div");
    box.className = "lightbox";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.innerHTML =
      '<div class="lightbox-bar"><div class="lightbox-title"><strong data-lb-title></strong><span data-lb-count></span></div>' +
      '<div class="lightbox-tools">' +
      '<button class="icon-button" type="button" data-lb-out>' + ICONS.zoomOut + '</button>' +
      '<button class="icon-button" type="button" data-lb-in>' + ICONS.zoomIn + '</button>' +
      '<button class="icon-button" type="button" data-lb-reset>' + ICONS.reset + '</button>' +
      '<button class="icon-button" type="button" data-lb-close>' + ICONS.close + '</button></div></div>' +
      '<div class="lightbox-stage" data-lb-stage><img alt="" draggable="false">' +
      '<button class="icon-button lightbox-nav lightbox-prev" type="button" data-lb-prev>' + ICONS.prev + '</button>' +
      '<button class="icon-button lightbox-nav lightbox-next" type="button" data-lb-next>' + ICONS.next + '</button></div>' +
      '<div class="lightbox-foot"><span data-lb-hint></span><span class="lightbox-zoom-level" data-lb-zoom>100%</span><div class="lightbox-thumbs" data-lb-thumbs></div></div>';
    document.body.appendChild(box);
    stage = box.querySelector("[data-lb-stage]");
    img = stage.querySelector("img");
    titleEl = box.querySelector("[data-lb-title]");
    countEl = box.querySelector("[data-lb-count]");
    zoomEl = box.querySelector("[data-lb-zoom]");
    thumbs = box.querySelector("[data-lb-thumbs]");
    prevBtn = box.querySelector("[data-lb-prev]");
    nextBtn = box.querySelector("[data-lb-next]");
    hintEl = box.querySelector("[data-lb-hint]");

    box.querySelector("[data-lb-close]").addEventListener("click", close);
    box.querySelector("[data-lb-in]").addEventListener("click", function () { zoomAt(scale * 1.6); });
    box.querySelector("[data-lb-out]").addEventListener("click", function () { zoomAt(scale / 1.6); });
    box.querySelector("[data-lb-reset]").addEventListener("click", function () { setTransform(1, 0, 0, true); });
    prevBtn.addEventListener("click", function () { go(index - 1); });
    nextBtn.addEventListener("click", function () { go(index + 1); });

    stage.addEventListener("wheel", onWheel, { passive: false });
    stage.addEventListener("pointerdown", onDown);
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerup", onUp);
    stage.addEventListener("pointercancel", onUp);
    stage.addEventListener("dblclick", function (event) {
      if (event.target.closest("button")) return;
      toggleZoom(event.clientX, event.clientY);
    });
    img.addEventListener("load", function () { img.classList.remove("loading"); });
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", function () { if (box.classList.contains("open")) setTransform(scale, tx, ty, false); });
  }

  function labels() {
    box.setAttribute("aria-label", t("viewer"));
    [["[data-lb-close]", "close"], ["[data-lb-prev]", "prev"], ["[data-lb-next]", "next"], ["[data-lb-in]", "zin"], ["[data-lb-out]", "zout"], ["[data-lb-reset]", "reset"]].forEach(function (pair) {
      var button = box.querySelector(pair[0]);
      button.setAttribute("aria-label", t(pair[1]));
      button.title = t(pair[1]);
    });
    hintEl.textContent = t("hint");
  }

  function rect() { return stage.getBoundingClientRect(); }

  function clampPan(s, x, y) {
    var r = rect();
    var minX = r.width - r.width * s, minY = r.height - r.height * s;
    return [Math.min(0, Math.max(minX, x)), Math.min(0, Math.max(minY, y))];
  }

  function setTransform(s, x, y, animate) {
    s = Math.min(MAX, Math.max(MIN, s));
    var c = clampPan(s, x, y);
    scale = s; tx = c[0]; ty = c[1];
    img.style.transition = animate ? "transform .45s cubic-bezier(.22,1,.36,1)" : "none";
    img.style.transform = "translate(" + tx + "px," + ty + "px) scale(" + scale + ")";
    stage.classList.toggle("zoomed", scale > 1.01);
    zoomEl.textContent = Math.round(scale * 100) + "%";
  }

  function zoomAt(next, clientX, clientY, animate) {
    var r = rect();
    var px = (clientX === undefined ? r.left + r.width / 2 : clientX) - r.left;
    var py = (clientY === undefined ? r.top + r.height / 2 : clientY) - r.top;
    next = Math.min(MAX, Math.max(MIN, next));
    var ratio = next / scale;
    setTransform(next, px - (px - tx) * ratio, py - (py - ty) * ratio, animate !== false);
  }

  function toggleZoom(x, y) { if (scale > 1.01) setTransform(1, 0, 0, true); else zoomAt(2.6, x, y, true); }

  function onWheel(event) {
    event.preventDefault();
    var factor = Math.exp(-event.deltaY * (event.ctrlKey ? 0.01 : 0.0022));
    zoomAt(scale * factor, event.clientX, event.clientY, false);
  }

  function onDown(event) {
    if (event.target.closest("button")) return;
    stage.setPointerCapture(event.pointerId);
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.size === 2) {
      var p = Array.from(pointers.values());
      pinchStart = { dist: Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y), scale: scale, cx: (p[0].x + p[1].x) / 2, cy: (p[0].y + p[1].y) / 2 };
      dragStart = null; swipeStart = null;
    } else {
      if (scale > 1.01) { dragStart = { x: event.clientX, y: event.clientY, tx: tx, ty: ty }; stage.classList.add("dragging"); }
      else swipeStart = { x: event.clientX, y: event.clientY, time: Date.now() };
      var now = Date.now();
      if (event.pointerType === "touch" && now - lastTap < 300) { toggleZoom(event.clientX, event.clientY); lastTap = 0; swipeStart = null; }
      else lastTap = now;
    }
  }

  function onMove(event) {
    if (!pointers.has(event.pointerId)) return;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pinchStart && pointers.size === 2) {
      var p = Array.from(pointers.values());
      var dist = Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y);
      zoomAt(pinchStart.scale * dist / pinchStart.dist, pinchStart.cx, pinchStart.cy, false);
    } else if (dragStart) {
      setTransform(scale, dragStart.tx + event.clientX - dragStart.x, dragStart.ty + event.clientY - dragStart.y, false);
    } else if (swipeStart) {
      var dx = event.clientX - swipeStart.x;
      img.style.transition = "none";
      img.style.transform = "translateX(" + dx * 0.6 + "px)";
    }
  }

  function onUp(event) {
    pointers.delete(event.pointerId);
    if (pointers.size < 2) pinchStart = null;
    if (swipeStart && pointers.size === 0) {
      var dx = event.clientX - swipeStart.x;
      var fast = Date.now() - swipeStart.time < 600;
      swipeStart = null;
      if (Math.abs(dx) > 70 || (fast && Math.abs(dx) > 35)) { go(index + (dx < 0 ? 1 : -1)); return; }
      setTransform(1, 0, 0, true);
    }
    if (pointers.size === 0) { dragStart = null; stage.classList.remove("dragging"); }
  }

  function onKey(event) {
    if (!box || !box.classList.contains("open")) return;
    if (event.key === "Escape") close();
    else if (event.key === "ArrowRight") go(index + 1);
    else if (event.key === "ArrowLeft") go(index - 1);
    else if (event.key === "+" || event.key === "=") zoomAt(scale * 1.6);
    else if (event.key === "-") zoomAt(scale / 1.6);
    else if (event.key === "0") setTransform(1, 0, 0, true);
    else if (event.key === "Tab") {
      var focusables = Array.from(box.querySelectorAll("button:not([disabled])")).filter(function (b) { return b.offsetParent !== null; });
      var first = focusables[0], last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  }

  function go(next) {
    if (next < 0 || next >= items.length) { setTransform(1, 0, 0, true); return; }
    index = next;
    render();
  }

  function render() {
    var item = items[index];
    img.classList.add("loading");
    img.classList.toggle("is-drawing", !!item.drawing);
    img.alt = item.alt || "";
    img.src = item.src;
    if (img.complete) img.classList.remove("loading");
    setTransform(1, 0, 0, false);
    titleEl.textContent = title + (item.label ? " — " + item.label : "");
    countEl.textContent = (index + 1) + " / " + items.length;
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === items.length - 1;
    prevBtn.hidden = nextBtn.hidden = items.length < 2;
    Array.from(thumbs.children).forEach(function (button, i) {
      button.setAttribute("aria-current", String(i === index));
      if (i === index) button.scrollIntoView({ block: "nearest", inline: "center" });
    });
    [index - 1, index + 1].forEach(function (i) { if (items[i]) { var pre = new Image(); pre.src = items[i].src; } });
  }

  function open(list, start, heading, from) {
    if (!box) build();
    labels();
    items = list; index = start || 0; title = heading || ""; trigger = from || document.activeElement;
    thumbs.innerHTML = items.map(function (item, i) {
      return '<button type="button" aria-label="' + (i + 1) + '"><img src="' + item.src + '" alt="" loading="lazy"></button>';
    }).join("");
    Array.from(thumbs.children).forEach(function (button, i) { button.addEventListener("click", function () { go(i); }); });
    document.body.classList.add("lightbox-open");
    box.classList.add("open");
    render();
    box.querySelector("[data-lb-close]").focus({ preventScroll: true });
  }

  function close() {
    if (!box) return;
    box.classList.remove("open");
    document.body.classList.remove("lightbox-open");
    if (trigger && trigger.focus) trigger.focus({ preventScroll: true });
  }

  window.MGMLightbox = { open: open, close: close };
})();
