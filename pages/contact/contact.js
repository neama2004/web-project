$(document).ready(function () {
  $("form").on("submit", function (e) {
    if (this.checkValidity()) {
      e.preventDefault();

      $("#name").val("");
      $("#email").val("");
      $("#message").val("");
      $("#phone").val("");

      alert("Thanks for your valued message!");
    }
  });
  $("form").on("submit", function (e) {
    if ($("#newsInput")[0].checkValidity()) {
      e.preventDefault();
      alert("Thanks for subscribing to our newsletter!");
      $("#newsInput").val("");
    }
  });
});
