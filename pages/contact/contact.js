$(document).ready(function () {
  // Initialize dark mode
  let darkModeToggle = document.getElementById("dark-mode-toggle");
  let savedDarkMode = localStorage.getItem("darkMode") === "true";
  
  if (darkModeToggle) {
    darkModeToggle.checked = savedDarkMode;
    document.body.classList.toggle("dark-mode", savedDarkMode);
    updateDarkModeElements(savedDarkMode);
    
    darkModeToggle.addEventListener("change", function () {
      let isDarkMode = this.checked;
      document.body.classList.toggle("dark-mode", isDarkMode);
      localStorage.setItem("darkMode", isDarkMode);
      updateDarkModeElements(isDarkMode);
    });
  }

  function updateDarkModeElements(isDarkMode) {
    let sidebar = document.querySelector(".user-profile-sidebar");
    if (sidebar) {
      sidebar.classList.toggle("dark-mode", isDarkMode);
    }
  }

  // Form submission handlers
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

  // Cart count functionality
  let cartCount = 0;
  let cartCountElement = document.getElementById("cart-count");
  
  function updateCartCount() {
    let savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    cartCount = savedCart.reduce((total, item) => total + item.quantity, 0);
    
    if (cartCountElement) {
      cartCountElement.textContent = cartCount;
    }
  }
  
  updateCartCount();

  // User Profile Sidebar functionality
  let profileTrigger = document.querySelector(".user-profile-trigger");
  let sidebar = document.querySelector(".user-profile-sidebar");
  let overlay = document.querySelector(".sidebar-overlay");
  let closeBtn = document.querySelector(".close-sidebar");
  let logoutBtn = document.querySelector(".logout-btn");
  
  let isSidebarOpen = false;

  function toggleSidebar(shouldOpen) {
    if (shouldOpen === undefined) {
      shouldOpen = !isSidebarOpen;
    }

    if (shouldOpen) {
      sidebar.classList.add("active");
      overlay.classList.add("active");
      document.body.style.overflow = "hidden";
      isSidebarOpen = true;
    } else {
      sidebar.classList.remove("active");
      overlay.classList.remove("active");
      document.body.style.overflow = "";
      isSidebarOpen = false;
    }
  }

  if (profileTrigger) {
    profileTrigger.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      toggleSidebar(true);
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      toggleSidebar(false);
    });
  }

  if (overlay) {
    overlay.addEventListener("click", function () {
      toggleSidebar(false);
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && isSidebarOpen) {
      toggleSidebar(false);
    }
  });

  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      alert("You have been logged out");
      toggleSidebar(false);
      window.location.href = "../login/Login.HTML";
    });
  }

  if (sidebar) {
    sidebar.addEventListener("click", function (e) {
      e.stopPropagation();
    });
  }
});