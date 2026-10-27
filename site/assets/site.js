/* Fantasy Claw Arcade site scripts: today's hours, monthly promotions, franchise quick button, video player, preview forms. */
(function () {
  // Today's hours in each store's own time zone
  var HOURS = {"fashionshow": {"tz": "America/Los_Angeles", "h": {"Sun": ["10am", "7pm"], "Mon": ["10am", "8pm"], "Tue": ["10am", "8pm"], "Wed": ["10am", "8pm"], "Thu": ["10am", "8pm"], "Fri": ["10am", "9pm"], "Sat": ["10am", "9pm"]}}, "area15": {"tz": "America/Los_Angeles", "h": {"Sun": ["11:30am", "10pm"], "Mon": ["11:30am", "10pm"], "Tue": ["11:30am", "10pm"], "Wed": ["11:30am", "10pm"], "Thu": ["11:30am", "10pm"], "Fri": ["11:30am", "10pm"], "Sat": ["11:30am", "10pm"]}}, "miraclemile": {"tz": "America/Los_Angeles", "h": {"Sun": ["10am", "9pm"], "Mon": ["10am", "9pm"], "Tue": ["10am", "9pm"], "Wed": ["10am", "9pm"], "Thu": ["10am", "9pm"], "Fri": ["10am", "10pm"], "Sat": ["10am", "10pm"]}}, "imp": {"tz": "Pacific/Honolulu", "h": {"Sun": ["10am", "9pm"], "Mon": ["10am", "9pm"], "Tue": ["10am", "9pm"], "Wed": ["10am", "9pm"], "Thu": ["10am", "9pm"], "Fri": ["10am", "9pm"], "Sat": ["10am", "9pm"]}}, "easton": {"tz": "America/New_York", "h": {"Sun": ["12pm", "6pm"], "Mon": ["10am", "9pm"], "Tue": ["10am", "9pm"], "Wed": ["10am", "9pm"], "Thu": ["10am", "9pm"], "Fri": ["10am", "9pm"], "Sat": ["10am", "9pm"]}}};
  document.querySelectorAll("[data-today]").forEach(function (el) {
    try {
      var st = HOURS[el.getAttribute("data-today")]; if (!st) return;
      var day = new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: st.tz }).format(new Date());
      var h = st.h[day]; if (h) el.querySelector("span").textContent = "Today " + h[0] + " \u2013 " + h[1];
    } catch (e) {}
  });

  // Monthly promotions: current one first, next one as "Coming …", expired ones hidden (Las Vegas date)
  try {
    var today = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Los_Angeles" }).format(new Date());
    var promos = [].slice.call(document.querySelectorAll("[data-promo]"));
    if (promos.length) {
      var shownCurrent = false, shownNext = false;
      promos.sort(function (x, y) { return x.dataset.start < y.dataset.start ? -1 : 1; }).forEach(function (el) {
        var st = el.dataset.start, en = el.dataset.end, lab = el.querySelector("[data-promo-label]");
        if (en < today) { el.hidden = true; return; }
        if (st <= today && !shownCurrent) { shownCurrent = true; return; }
        if (st > today && !shownNext) {
          shownNext = true; el.classList.add("upcoming");
          var d = new Date(st + "T12:00:00");
          if (lab) lab.textContent = "Coming " + d.toLocaleDateString("en-US", { month: "long", day: "numeric" });
          return;
        }
        el.hidden = true;
      });
      if (!shownCurrent && !shownNext) { var n = document.querySelector(".promo-none"); if (n) n.hidden = false; }
    }
  } catch (e) {}

  // Franchising: show the "Request info" button only while the form is off screen
  try {
    var form = document.getElementById("anchor1");
    if (form && "IntersectionObserver" in window) {
      new IntersectionObserver(function (es) { document.body.classList.toggle("form-away", !es[0].isIntersecting); }).observe(form);
    }
  } catch (e) {}

  // Franchise video: load YouTube's privacy-enhanced player only when tapped
  document.querySelectorAll("[data-yt]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var f = document.createElement("iframe");
      f.className = "video-frame";
      f.src = "https://www.youtube-nocookie.com/embed/" + btn.getAttribute("data-yt") + "?autoplay=1&rel=0";
      f.title = "Own a Claw Arcade Franchise";
      f.allow = "autoplay; encrypted-media; picture-in-picture";
      f.allowFullscreen = true;
      btn.replaceWith(f);
    });
  });

  // Forms that aren't connected to HubSpot yet
  document.querySelectorAll(".preview-form").forEach(function (fm) {
    fm.addEventListener("submit", function (e) {
      e.preventDefault();
      var n = fm.querySelector(".embed-note"); if (n) n.textContent = "This form isn't connected yet, so nothing was sent. Please call your arcade for now.";
    });
  });
  // Silent background loops: respect "reduce motion" settings
  try {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll("video[autoplay]").forEach(function (v) { v.removeAttribute("autoplay"); v.pause(); });
    }
  } catch (e) {}

  // Franchise form drawer: side tab and Request info buttons open the form from anywhere on the page
  try {
    var drawer = document.getElementById("fr-drawer");
    var overlay = document.querySelector(".drawer-overlay");
    if (drawer) {
      var lastFocus = null;
      var openForm = function (e) {
        if (e) e.preventDefault();
        lastFocus = document.activeElement;
        drawer.setAttribute("aria-hidden", "false"); overlay.hidden = false;
        requestAnimationFrame(function () { document.body.classList.add("drawer-open"); });
        setTimeout(function () { drawer.querySelector(".drawer-close").focus(); }, 60);
      };
      var closeForm = function () {
        document.body.classList.remove("drawer-open");
        drawer.setAttribute("aria-hidden", "true"); setTimeout(function () { overlay.hidden = true; }, 250);
        if (lastFocus) lastFocus.focus();
      };
      document.querySelectorAll("[data-open-form]").forEach(function (b) { b.addEventListener("click", openForm); });
      document.querySelectorAll("[data-close-form]").forEach(function (b) { b.addEventListener("click", closeForm); });
      document.addEventListener("keydown", function (e) { if (e.key === "Escape" && document.body.classList.contains("drawer-open")) closeForm(); });
    }
  } catch (e) {}

  // Self-hosted franchise video: swap the cover for the player when tapped
  document.querySelectorAll("[data-video]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var v = document.createElement("video");
      v.className = "video-frame";
      v.src = btn.getAttribute("data-video");
      v.poster = btn.getAttribute("data-poster") || "";
      v.controls = true; v.playsInline = true; v.autoplay = true;
      v.setAttribute("aria-label", btn.getAttribute("aria-label").replace(/^Play: /, ""));
      btn.replaceWith(v);
      var p = v.play(); if (p && p.catch) p.catch(function () {});
    });
  });

  // Social clips: load the official TikTok embed only when tapped
  document.querySelectorAll("[data-tiktok]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var f = document.createElement("iframe");
      f.className = "social-frame";
      f.src = "https://www.tiktok.com/player/v1/" + btn.getAttribute("data-tiktok") + "?autoplay=1&music_info=0&description=0&rel=0&native_context_menu=0&closed_caption=0";
      f.scrolling = "no";
      f.title = btn.getAttribute("aria-label").replace(/^Play /, "");
      f.allow = "autoplay; encrypted-media; fullscreen; picture-in-picture";
      f.allowFullscreen = true;
      btn.replaceWith(f);
    });
  });

  // Social clips: YouTube Shorts load the privacy-enhanced player only when tapped
  document.querySelectorAll("[data-yt-short]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var f = document.createElement("iframe");
      f.className = "social-frame";
      f.src = "https://www.youtube-nocookie.com/embed/" + btn.getAttribute("data-yt-short") + "?autoplay=1&rel=0&playsinline=1";
      f.title = btn.getAttribute("aria-label").replace(/^Play /, "");
      f.allow = "autoplay; encrypted-media; fullscreen; picture-in-picture";
      f.allowFullscreen = true;
      btn.replaceWith(f);
    });
  });

  // Wide (landscape) creator videos: play in a centered pop-up player
  try {
    var vm = document.getElementById("videoModal");
    if (vm) {
      var frameBox = vm.querySelector(".video-modal-frame"), opener = null;
      var closeVm = function () { frameBox.innerHTML = ""; vm.hidden = true; document.body.classList.remove("modal-open"); if (opener) opener.focus(); };
      document.querySelectorAll("[data-yt-wide]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          opener = btn;
          var f = document.createElement("iframe");
          f.src = "https://www.youtube-nocookie.com/embed/" + btn.getAttribute("data-yt-wide") + "?autoplay=1&rel=0&playsinline=1";
          f.title = btn.getAttribute("aria-label").replace(/^Play /, "");
          f.allow = "autoplay; encrypted-media; fullscreen; picture-in-picture";
          f.allowFullscreen = true;
          frameBox.appendChild(f); vm.hidden = false; document.body.classList.add("modal-open");
          vm.querySelector(".video-modal-close").focus();
        });
      });
      vm.querySelector(".video-modal-close").addEventListener("click", closeVm);
      vm.addEventListener("click", function (e) { if (e.target === vm) closeVm(); });
      document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !vm.hidden) closeVm(); });
    }
  } catch (e) {}

  // Phone menu: the Menu button opens and closes the main navigation
  try {
    var navBtn = document.querySelector(".nav-toggle");
    var head = document.querySelector(".site-head");
    if (navBtn && head) {
      navBtn.addEventListener("click", function () {
        var open = head.classList.toggle("nav-open");
        navBtn.setAttribute("aria-expanded", open ? "true" : "false");
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && head.classList.contains("nav-open")) { head.classList.remove("nav-open"); navBtn.setAttribute("aria-expanded", "false"); navBtn.focus(); }
      });
    }
  } catch (e) {}

  // Site search (Pagefind): loads only when the search button is used
  try {
    var sm = document.getElementById("searchModal");
    if (sm) {
      var loaded = false, opener2 = null;
      var openS = function () {
        opener2 = document.activeElement; sm.hidden = false; document.body.classList.add("modal-open");
        if (!loaded) {
          loaded = true;
          var css = document.createElement("link"); css.rel = "stylesheet"; css.href = "/pagefind/pagefind-ui.css"; document.head.appendChild(css);
          var sc = document.createElement("script"); sc.src = "/pagefind/pagefind-ui.js";
          sc.onload = function () {
            new PagefindUI({ element: "#siteSearch", showSubResults: true, showImages: false, resetStyles: false, translations: { placeholder: "Search locations, parties, franchising…" } });
            setTimeout(function () { var i = sm.querySelector("input"); if (i) i.focus(); }, 50);
          };
          sc.onerror = function () { document.getElementById("siteSearch").innerHTML = "<p>Search isn't available right now.</p>"; };
          document.head.appendChild(sc);
        } else { var i = sm.querySelector("input"); if (i) i.focus(); }
      };
      var closeS = function () { sm.hidden = true; document.body.classList.remove("modal-open"); if (opener2) opener2.focus(); };
      document.querySelectorAll("[data-open-search]").forEach(function (b) { b.addEventListener("click", openS); });
      sm.querySelectorAll("[data-close-search]").forEach(function (b) { b.addEventListener("click", closeS); });
      sm.addEventListener("click", function (e) { if (e.target === sm) closeS(); });
      document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !sm.hidden) closeS(); });
    }
  } catch (e) {}
})();
