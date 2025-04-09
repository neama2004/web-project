// ===================== Dark Mode Toggle =====================
document.getElementById("dark-mode-toggle")?.addEventListener("change", function() {
  const isDarkMode = this.checked;
  document.body.classList.toggle("dark-mode", isDarkMode);
  localStorage.setItem("darkMode", isDarkMode);
});

// Load dark mode preference on page load
window.addEventListener("load", function() {
  const isDarkMode = localStorage.getItem("darkMode") === "true";
  const toggle = document.getElementById("dark-mode-toggle");
  if (toggle) {
    toggle.checked = isDarkMode;
  }
  document.body.classList.toggle("dark-mode", isDarkMode);
});

// ===================== Cart Functionality =====================
document.addEventListener('DOMContentLoaded', function() {
  let cartCount = 0;
  const cartCountElement = document.getElementById('cart-count');
  const cartBtn = document.querySelector('.cart-btn');

  // Load cart count from localStorage if available
  const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
  cartCount = savedCart.reduce((total, item) => total + item.quantity, 0);
  updateCartCount();

  function updateCartCount() {
    if (cartCountElement) {
      cartCountElement.textContent = cartCount;
    }
  }

  // Event delegation for add-to-cart buttons
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('add-to-cart')) {
      e.preventDefault();
      const productElement = e.target.closest('.product');
      const productName = productElement.querySelector('h3').textContent;
      const productPrice = parseFloat(productElement.querySelector('p').textContent.replace('$', ''));
      const productImage = productElement.querySelector('img').src;
      
      // Add to cart
      addToCart({
        name: productName,
        price: productPrice,
        image: productImage,
        quantity: 1
      });
      
      // Update UI
      cartCount++;
      updateCartCount();
      
      // Add visual feedback
      e.target.textContent = 'Added!';
      setTimeout(() => {
        e.target.textContent = 'Add to Cart';
      }, 1000);
    }
  });

  // Cart button functionality
  if (cartBtn) {
    cartBtn.addEventListener('click', function(e) {
      // Save current cart before navigating
      localStorage.setItem('cart', JSON.stringify(getCart()));
      // Navigation is handled by HTML onclick
    });
    
    cartBtn.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.1)';
    });
    
    cartBtn.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
    });
  }

  // Cart management functions
  function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
  }

  function addToCart(product) {
    const cart = getCart();
    const existingItem = cart.find(item => item.name === product.name);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push(product);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
  }
});

// ===================== User Profile Sidebar =====================
document.addEventListener("DOMContentLoaded", function() {
  const profileTrigger = document.querySelector(".user-profile-trigger");
  const sidebar = document.querySelector(".user-profile-sidebar");
  const closeSidebarBtn = document.querySelector(".close-sidebar");
  const logoutBtn = document.querySelector(".logout-btn");

  // Create overlay element if it doesn't exist
  let sidebarOverlay = document.querySelector(".sidebar-overlay");
  if (!sidebarOverlay) {
    sidebarOverlay = document.createElement("div");
    sidebarOverlay.className = "sidebar-overlay";
    document.body.appendChild(sidebarOverlay);
  }

  function openSidebar() {
    sidebar.classList.add("active");
    sidebarOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeSidebar() {
    sidebar.classList.remove("active");
    sidebarOverlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  // Open sidebar when profile icon is clicked
  if (profileTrigger) {
    profileTrigger.addEventListener("click", function(e) {
      e.stopPropagation();
      openSidebar();
    });
  }

  // Close sidebar when close button is clicked
  if (closeSidebarBtn) {
    closeSidebarBtn.addEventListener("click", closeSidebar);
  }

  // Close sidebar when overlay is clicked
  sidebarOverlay.addEventListener("click", closeSidebar);

  // Prevent clicks inside sidebar from closing it
  if (sidebar) {
    sidebar.addEventListener("click", function(e) {
      e.stopPropagation();
    });
  }

  // Logout button functionality
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function() {
      // Here you would typically handle logout logic
      alert("You have been logged out");
      closeSidebar();
      
      // Example: Clear session and redirect
      // sessionStorage.removeItem("currentUser");
      // window.location.href = "login.html";
    });
  }

  // Close sidebar when clicking outside
  document.addEventListener("click", function(e) {
    if (sidebar.classList.contains("active") && 
        !sidebar.contains(e.target) && 
        e.target !== profileTrigger) {
      closeSidebar();
    }
  });

  // Close sidebar with Escape key
  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape" && sidebar.classList.contains("active")) {
      closeSidebar();
    }
  });
});

// ===================== Product Grid Functionality =====================
function initializeProducts() {
  const productGrid = document.querySelector(".product-grid");
  if (!productGrid) return;

  const products = [
    { name: "Gluten-Free Bread", price: 5.99, category: "gluten-free", image: "https://via.placeholder.com/250x250" },
    { name: "Dairy-Free Milk", price: 3.99, category: "dairy-free", image: "https://via.placeholder.com/250x250" },
    { name: "Nut-Free Cookies", price: 4.99, category: "nut-free", image: "https://via.placeholder.com/250x250" },
    { name: "Vegan Cheese", price: 6.99, category: "vegan", image: "https://via.placeholder.com/250x250" },
    { name: "Organic Pasta", price: 4.49, category: "organic", image: "https://via.placeholder.com/250x250" },
    { name: "Sugar-Free Granola", price: 7.99, category: "sugar-free", image: "https://via.placeholder.com/250x250" },
    { name: "Plant-Based Protein Bars", price: 8.99, category: "vegan", image: "https://via.placeholder.com/250x250" },
    { name: "Allergy-Friendly Snack Mix", price: 5.49, category: "nut-free", image: "https://via.placeholder.com/250x250" }
  ];

  products.forEach(product => {
    const productElement = document.createElement("div");
    productElement.classList.add("product", product.category);
    productElement.innerHTML = `
      <img src="${product.image}" alt="${product.name}" loading="lazy">
      <h3>${product.name}</h3>
      <p>$${product.price.toFixed(2)}</p>
      <button class="add-to-cart">Add to Cart</button>
    `;
    productGrid.appendChild(productElement);
  });
}

// ===================== Auto-Scroll Products =====================
function autoScrollProducts() {
  const productGrid = document.querySelector(".product-grid");
  if (!productGrid) return;

  let scrollAmount = 0;
  const scrollStep = 250;
  let scrollInterval;

  function scrollProducts() {
    scrollAmount += scrollStep;
    if (scrollAmount >= productGrid.scrollWidth - productGrid.clientWidth) {
      scrollAmount = 0;
    }
    productGrid.scrollTo({
      left: scrollAmount,
      behavior: "smooth"
    });
  }

  // Start auto-scroll
  scrollInterval = setInterval(scrollProducts, 3000);

  // Pause on hover
  productGrid.addEventListener("mouseenter", () => {
    clearInterval(scrollInterval);
  });

  // Resume when mouse leaves
  productGrid.addEventListener("mouseleave", () => {
    scrollInterval = setInterval(scrollProducts, 3000);
  });
}

// ===================== Footer Year Update =====================
function updateFooterYear() {
  const yearElement = document.querySelector(".footer-year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

// ===================== Initialize Everything =====================
window.addEventListener("load", function() {
  initializeProducts();
  autoScrollProducts();
  updateFooterYear();
  
  // Check for logged in user
  const currentUser = sessionStorage.getItem("currentUser");
  if (currentUser) {
    // Example: Update UI for logged in user
    // document.querySelector(".profile-icon").src = "path/to/user-avatar.png";
  }
});