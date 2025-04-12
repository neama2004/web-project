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

let cartCount = 0;
const cartCountElement = document.getElementById("cart-count");

const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
cartCount = savedCart.reduce((total, item) => total + item.quantity, 0);
updateCartCount();

function updateCartCount() {
  if (cartCountElement) {
    cartCountElement.textContent = cartCount;
  }
}

// ===================== Dark Mode Toggle =====================
// Dark mode toggle functionality
const darkModeToggle = document.getElementById("dark-mode-toggle");

// Load saved dark mode preference
if (darkModeToggle) {
  const savedDarkMode = localStorage.getItem("darkMode") === "true";
  darkModeToggle.checked = savedDarkMode;
  document.body.classList.toggle("dark-mode", savedDarkMode);

  // Toggle dark mode when checkbox changes
  darkModeToggle.addEventListener("change", function () {
    const isDarkMode = this.checked;
    document.body.classList.toggle("dark-mode", isDarkMode);
    localStorage.setItem("darkMode", isDarkMode);

    // Update UI elements that need dark mode changes
    updateDarkModeElements(isDarkMode);
  });
}

function updateDarkModeElements(isDarkMode) {
  // Additional dark mode element updates if needed
  const sidebar = document.querySelector(".user-profile-sidebar");
  if (sidebar) {
    sidebar.classList.toggle("dark-mode", isDarkMode);
  }
}

// ===================== User Profile Sidebar =====================
const profileTrigger = document.querySelector(".user-profile-trigger");
const sidebar = document.querySelector(".user-profile-sidebar");
const overlay = document.createElement("div");
overlay.className = "sidebar-overlay";
document.body.appendChild(overlay);
const closeBtn = document.querySelector(".close-sidebar");
const logoutBtn = document.querySelector(".logout-btn");

// Track sidebar state
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

// Profile trigger click handler
if (profileTrigger) {
  profileTrigger.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    toggleSidebar(true);
  });
}

// Close button
if (closeBtn) {
  closeBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    toggleSidebar(false);
  });
}

// Overlay click
overlay.addEventListener("click", function () {
  toggleSidebar(false);
});

// Escape key
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && isSidebarOpen) {
    toggleSidebar(false);
  }
});

// Logout button
if (logoutBtn) {
  logoutBtn.addEventListener("click", function () {
    // Logout functionality
    alert("You have been logged out");
    toggleSidebar(false);

    window.location.href = "../login/Login.HTML";
  });
}

// Prevent clicks inside sidebar from closing it
if (sidebar) {
  sidebar.addEventListener("click", function (e) {
    e.stopPropagation();
  });
}
