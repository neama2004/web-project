document.addEventListener("DOMContentLoaded", function () {
  const cards = document.querySelectorAll(".card");

  // Initialize dark mode
  const darkModeToggle = document.getElementById("dark-mode-toggle");
  const savedDarkMode = localStorage.getItem("darkMode") === "true";
  
  if (darkModeToggle) {
    darkModeToggle.checked = savedDarkMode;
    document.body.classList.toggle("dark-mode", savedDarkMode);
    updateDarkModeElements(savedDarkMode);
    
    darkModeToggle.addEventListener("change", function () {
      const isDarkMode = this.checked;
      document.body.classList.toggle("dark-mode", isDarkMode);
      localStorage.setItem("darkMode", isDarkMode);
      updateDarkModeElements(isDarkMode);
    });
  }

  function updateDarkModeElements(isDarkMode) {
    const sidebar = document.querySelector(".user-profile-sidebar");
    if (sidebar) {
      sidebar.classList.toggle("dark-mode", isDarkMode);
    }
  }

  // Cart count functionality
  let cartCount = 0;
  const cartCountElement = document.getElementById("cart-count");
  
  function updateCartCount() {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    cartCount = savedCart.reduce((total, item) => total + item.quantity, 0);
    
    if (cartCountElement) {
      cartCountElement.textContent = cartCount;
    }
  }
  
  updateCartCount();

  // User Profile Sidebar functionality
  const profileTrigger = document.querySelector(".user-profile-trigger");
  const sidebar = document.querySelector(".user-profile-sidebar");
  const overlay = document.querySelector(".sidebar-overlay");
  const closeBtn = document.querySelector(".close-sidebar");
  const logoutBtn = document.querySelector(".logout-btn");
  
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

  // Card functionality
  cards.forEach((card) => {
    card.addEventListener("click", function () {
      cards.forEach((otherCard) => {
        if (otherCard !== card) {
          otherCard.classList.remove("active");
        }
      });

      card.classList.toggle("active");
    });
  });
});