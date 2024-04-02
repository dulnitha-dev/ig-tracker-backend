(function ($) {
  "use strict";

  /* ====  Sticky Navbar ==== */
  $(window).scroll((e) => {
    $("header").toggleClass("is-sticky", window.pageYOffset > 200);
  });

  /* ====  Responsive Navbar ==== */
  $("#navbar-toggler").click((e) => {
    $("#navbar-collapse").toggleClass("show");
  });

  /* ====  Nav Links ==== */
  $(".nav-link").click(function (e) {
    if (this.hash) {
      e.preventDefault();
      $("html, body")
        .stop()
        .animate({ scrollTop: $(this.hash).offset().top - 100 }, 500);
    }
  });

  /* ====  Wow js ==== */
  new WOW().init();
})(jQuery);
