/* Fantasy Claw Arcade — motion layer (Oct 30, 2026): reveals, header state, How it works machine, count-ups. */
(function () {
  var root = document.documentElement;
  root.classList.add("js");
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var io = "IntersectionObserver" in window;

  // Reveal sections as they scroll into view
  var reveals = [].slice.call(document.querySelectorAll("[data-reveal]"));
  if (!io || reduce) { reveals.forEach(function (el) { el.classList.add("in"); }); }
  else {
    var ro = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); ro.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.12 });
    reveals.forEach(function (el, i) { el.style.transitionDelay = (i % 4) * 60 + "ms"; ro.observe(el); });
  }

  // Home: header turns solid once you scroll past the top of the hero
  if (document.body.classList.contains("home-x")) {
    var onScroll = function () { document.body.classList.toggle("scrolled", window.scrollY > 40); };
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
  }

  // How it works: the step in view drives the claw machine
  var machine = document.querySelector(".xm");
  var steps = [].slice.call(document.querySelectorAll(".xstep"));
  if (machine && steps.length) {
    var setStep = function (n) {
      machine.setAttribute("data-state", n);
      steps.forEach(function (s) { s.classList.toggle("on", s.getAttribute("data-step") === String(n)); });
    };
    setStep(1);
    if (io) {
      var so = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) setStep(e.target.getAttribute("data-step")); });
      }, { rootMargin: "-45% 0px -45% 0px" });
      steps.forEach(function (s) { so.observe(s); });
    }
    steps.forEach(function (s) { s.addEventListener("mouseenter", function () { setStep(s.getAttribute("data-step")); }); });
  }

  // Count-up numbers
  var counters = [].slice.call(document.querySelectorAll("[data-count]"));
  var run = function (el) {
    var end = +el.getAttribute("data-count"), pre = el.getAttribute("data-prefix") || "", suf = el.getAttribute("data-suffix") || "";
    if (reduce) { el.textContent = pre + end + suf; return; }
    var t0 = null, dur = 1400;
    var tick = function (ts) {
      if (!t0) t0 = ts; var p = Math.min(1, (ts - t0) / dur); var v = Math.round(end * (1 - Math.pow(1 - p, 3)));
      el.textContent = pre + v + suf; if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if (io) {
    var co = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { run(e.target); co.unobserve(e.target); } });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { co.observe(c); });
  }
})();
