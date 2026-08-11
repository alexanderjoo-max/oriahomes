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
})();
