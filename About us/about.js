document.addEventListener("scroll", function () {
  const backToTopButton = document.getElementById("backtotop");
  if (window.scrollY > 300) {
    backToTopButton.style.display = "block";
  } else {
    backToTopButton.style.display = "none";
  }
});

document.getElementById("backtotop").addEventListener("click", function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
});