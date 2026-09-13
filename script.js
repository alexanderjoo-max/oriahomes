/* =========================================================
   ORIA HOMES — interactions
   ========================================================= */
(function () {
  "use strict";

  var WAITLIST_EMAIL = "waitlist@oriahomes.com";

  /* ---------- Nav state, logo swap ---------- */
  var nav = document.getElementById("nav");
  var navLogo = document.getElementById("navLogo");
  var LOGO_TOP = "assets/logo-light.svg";
  var LOGO_SCROLLED = "assets/logo-full.svg";

  function setLogo() {
    // Full stacked mark whenever the bar is solid or the mobile menu is open
    var useScrolled =
      nav.classList.contains("nav--solid") || nav.classList.contains("nav--open");
    var want = useScrolled ? LOGO_SCROLLED : LOGO_TOP;
    if (navLogo.getAttribute("src") !== want) navLogo.setAttribute("src", want);
  }

  function onScroll() {
    var y = window.scrollY;
    if (y > 40) nav.classList.add("nav--solid");
    else nav.classList.remove("nav--solid");
    setLogo();
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu toggle ---------- */
  var toggle = document.getElementById("navToggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("nav--open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      setLogo();
    });
    // Close menu when a link is tapped
    nav.querySelectorAll(".nav__links a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("nav--open");
        toggle.setAttribute("aria-expanded", "false");
        setLogo();
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Waitlist forms ---------- *
   * Signups POST directly to the Kit (ConvertKit) form endpoint below, so
   * subscribers land in the Oria Homes Kit account. We use our own styled
   * fields (not Kit's embed) and submit via fetch, which keeps the design and
   * avoids Kit's modal / slide-in / sticky-bar popups.
   *
   * Kit form: 9789346  ·  field name: email_address  ·  double opt-in
   * To point at a different Kit form, change the id in KIT_ENDPOINT.
   *
   * If KIT_ENDPOINT is left empty, the form falls back to opening a
   * pre-addressed email to waitlist@oriahomes.com (no backend needed).
   */
  var KIT_ENDPOINT = "https://app.kit.com/forms/9789346/subscriptions";

  function isValidEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  function handleForm(form) {
    var input = form.querySelector(".waitform__input");
    var msg = form.querySelector(".waitform__msg");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = (input.value || "").trim();

      if (!isValidEmail(email)) {
        msg.textContent = "Please enter a valid email address.";
        msg.classList.add("is-error");
        input.focus();
        return;
      }
      msg.classList.remove("is-error");
      var btn = form.querySelector(".waitform__btn");

      if (KIT_ENDPOINT) {
        // POST to Kit (ConvertKit)
        if (btn) btn.disabled = true;
        msg.textContent = "Adding you to the list…";
        var data = new FormData();
        data.append("email_address", email);
        fetch(KIT_ENDPOINT, {
          method: "POST",
          body: data,
          headers: { Accept: "application/json" },
        })
          .then(function (r) {
            if (!r.ok) throw new Error("bad response");
            return r.json().catch(function () { return {}; });
          })
          .then(function () {
            showSuccess(form, msg, email);
          })
          .catch(function () {
            if (btn) btn.disabled = false;
            msg.textContent =
              "Something went wrong. Please email " + WAITLIST_EMAIL + ".";
            msg.classList.add("is-error");
          });
      } else {
        // No backend: confirm in-page and open a pre-addressed email
        showSuccess(form, msg, email);
        var subject = encodeURIComponent("Add me to the Oria Homes waiting list");
        var body = encodeURIComponent(
          "Hi Oria Homes team,\n\nI'd like to join the waiting list.\n\nEmail: " +
            email +
            "\n\nThanks!"
        );
        window.location.href =
          "mailto:" + WAITLIST_EMAIL + "?subject=" + subject + "&body=" + body;
      }
    });
  }

  function showSuccess(form, msg, email) {
    form.classList.add("is-done");
    msg.classList.remove("is-error");
    msg.textContent =
      "Almost there — check your inbox to confirm, and you're on the list.";
  }

  document.querySelectorAll(".waitform").forEach(handleForm);

  /* ---------- Destination photo galleries ---------- *
   * Photos live in assets/homes/<home>/ as home-NN.jpg and city-NN.jpg, with
   * 480px copies in thumb/. Each entry below is one caption per photo, in the
   * order they're numbered. To add a home: drop its files in, add an entry,
   * and give its card data-home="<key>".
   */
  var HOMES = {
    vancouver: {
      title: "Vancouver, Canada",
      price: "$225,000 USD for a 1/8 share",
      home: [
        "Exterior", "Kitchen and living room", "Living room", "Living room",
        "Dining room", "Dining room", "Dining room", "Kitchen", "Kitchen",
        "Primary bedroom", "Bedroom", "Bathroom", "Bathroom", "Bathroom",
        "Powder room", "Study", "Upstairs hallway", "Laundry room",
        "Covered deck", "Upper deck", "Garden view", "Backyard", "Garden",
        "Backyard"
      ],
      city: [
        "Downtown Vancouver", "Stanley Park and False Creek", "Joffre Lakes",
        "Whistler Village", "Whistler Village at night", "Whistler in winter"
      ]
    },
    kyoto: {
      title: "Kyoto, Japan",
      price: "$125,000 USD for a 1/8 share",
      home: [
        "Entrance", "Tatami room", "Kitchen", "Bathroom", "Toilet", "Storage",
        "Utility area"
      ],
      city: [
        "Yasaka Pagoda", "Higashiyama lanes", "Tō-ji pagoda",
        "Fushimi Inari torii gates", "Temple garden", "Temple guardians",
        "Kyoto Tower", "Sushi counter"
      ]
    },
    cabo: {
      title: "Cabo San Lucas, Mexico",
      price: "$140,000 USD for a 1/8 share",
      home: [
        "Pool", "Terrace lounge", "Terrace", "Great room", "Living room",
        "Living room", "Living room", "Dining room", "Dining room", "Kitchen",
        "Kitchen", "Kitchen", "Primary bedroom", "Twin bedroom", "Bathroom",
        "Fitness room", "Fitness room"
      ],
      city: ["El Arco at Land's End", "Land's End from above", "Cabo San Lucas marina"]
    }
  };

  var gallery = document.getElementById("gallery");
  if (gallery && typeof gallery.showModal === "function") {
    var gTitle = document.getElementById("galleryTitle");
    var gPrice = document.getElementById("galleryPrice");
    var gImg = document.getElementById("galleryImg");
    var gStrip = document.getElementById("galleryStrip");
    var gCaption = gallery.querySelector(".gallery__caption");
    var gTabs = gallery.querySelectorAll(".gallery__tabs [data-set]");
    var current = { key: null, set: "home", index: 0 };

    function pad(n) { return n < 10 ? "0" + n : "" + n; }
    function photoSrc(key, set, i, thumb) {
      return "assets/homes/" + key + "/" + (thumb ? "thumb/" : "") + set + "-" + pad(i + 1) + ".jpg";
    }

    function renderStrip() {
      var home = HOMES[current.key];
      gStrip.innerHTML = "";
      home[current.set].forEach(function (caption, i) {
        var b = document.createElement("button");
        b.type = "button";
        b.setAttribute("aria-label", caption + " (" + (i + 1) + " of " + home[current.set].length + ")");
        var im = document.createElement("img");
        im.src = photoSrc(current.key, current.set, i, true);
        im.alt = "";
        im.loading = "lazy";
        b.appendChild(im);
        b.addEventListener("click", function () { show(i); });
        gStrip.appendChild(b);
      });
      gTabs.forEach(function (t) {
        var on = t.getAttribute("data-set") === current.set;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.querySelector("span").textContent = home[t.getAttribute("data-set")].length;
      });
    }

    function show(i) {
      var list = HOMES[current.key][current.set];
      current.index = (i + list.length) % list.length;
      var src = photoSrc(current.key, current.set, current.index, false);
      if (gImg.getAttribute("src") !== src) {
        gImg.classList.add("is-loading");
        gImg.src = src;
      }
      gImg.alt = HOMES[current.key].title + " — " + list[current.index];
      gCaption.textContent = list[current.index] + " · " + (current.index + 1) + " / " + list.length;
      gStrip.querySelectorAll("button").forEach(function (b, n) {
        if (n === current.index) {
          b.setAttribute("aria-current", "true");
          b.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
        } else {
          b.removeAttribute("aria-current");
        }
      });
      // warm the neighbours so next/prev feel instant
      [current.index + 1, current.index - 1].forEach(function (n) {
        new Image().src = photoSrc(current.key, current.set, (n + list.length) % list.length, false);
      });
    }

    function openGallery(key, index) {
      current.key = key;
      current.set = "home";
      gTitle.textContent = HOMES[key].title;
      gPrice.textContent = HOMES[key].price;
      renderStrip();
      gallery.showModal();
      document.documentElement.style.overflow = "hidden";
      show(index);
    }

    gImg.addEventListener("load", function () { gImg.classList.remove("is-loading"); });

    document.querySelectorAll(".home[data-home]").forEach(function (card) {
      var key = card.getAttribute("data-home");
      if (!HOMES[key]) return;
      card.querySelectorAll("[data-open]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          openGallery(key, parseInt(btn.getAttribute("data-open"), 10) || 0);
        });
      });
    });

    gTabs.forEach(function (t) {
      t.addEventListener("click", function () {
        if (t.getAttribute("data-set") === current.set) return;
        current.set = t.getAttribute("data-set");
        renderStrip();
        show(0);
      });
    });

    gallery.querySelector(".gallery__nav--prev").addEventListener("click", function () { show(current.index - 1); });
    gallery.querySelector(".gallery__nav--next").addEventListener("click", function () { show(current.index + 1); });
    gallery.querySelector(".gallery__close").addEventListener("click", function () { gallery.close(); });

    gallery.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { e.preventDefault(); show(current.index - 1); }
      if (e.key === "ArrowRight") { e.preventDefault(); show(current.index + 1); }
      if (e.key === "Escape") { e.preventDefault(); gallery.close(); }
    });

    // Swipe between photos on touch screens
    var touchX = null;
    gImg.addEventListener("touchstart", function (e) { touchX = e.touches[0].clientX; }, { passive: true });
    gImg.addEventListener("touchend", function (e) {
      if (touchX === null) return;
      var dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 40) show(current.index + (dx < 0 ? 1 : -1));
      touchX = null;
    });

    gallery.addEventListener("close", function () {
      document.documentElement.style.overflow = "";
    });
  }
})();
