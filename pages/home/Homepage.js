// ===================== Dark Mode Toggle =====================
document.addEventListener('DOMContentLoaded', function() {
  // Dark mode toggle functionality
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  
  // Load saved dark mode preference
  if (darkModeToggle) {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    darkModeToggle.checked = savedDarkMode;
    document.body.classList.toggle('dark-mode', savedDarkMode);
    
    // Toggle dark mode when checkbox changes
    darkModeToggle.addEventListener('change', function() {
      const isDarkMode = this.checked;
      document.body.classList.toggle('dark-mode', isDarkMode);
      localStorage.setItem('darkMode', isDarkMode);
      
      // Update UI elements that need dark mode changes
      updateDarkModeElements(isDarkMode);
    });
  }

  function updateDarkModeElements(isDarkMode) {
    // Additional dark mode element updates if needed
    const sidebar = document.querySelector('.user-profile-sidebar');
    if (sidebar) {
      sidebar.classList.toggle('dark-mode', isDarkMode);
    }
  }

  // ===================== User Profile Sidebar =====================
  const profileTrigger = document.querySelector('.user-profile-trigger');
  const sidebar = document.querySelector('.user-profile-sidebar');
  const overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  document.body.appendChild(overlay);
  const closeBtn = document.querySelector('.close-sidebar');
  const logoutBtn = document.querySelector('.logout-btn');

  // Track sidebar state
  let isSidebarOpen = false;

  function toggleSidebar(shouldOpen) {
    if (shouldOpen === undefined) {
      shouldOpen = !isSidebarOpen;
    }

    if (shouldOpen) {
      sidebar.classList.add('active');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      isSidebarOpen = true;
    } else {
      sidebar.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
      isSidebarOpen = false;
    }
  }

  // Profile trigger click handler
  if (profileTrigger) {
    profileTrigger.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      toggleSidebar(true);
    });
  }

  // Close button
  if (closeBtn) {
    closeBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      toggleSidebar(false);
    });
  }

  // Overlay click
  overlay.addEventListener('click', function() {
    toggleSidebar(false);
  });

  // Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && isSidebarOpen) {
      toggleSidebar(false);
    }
  });

  // Logout button
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      // Logout functionality
      alert('You have been logged out');
      toggleSidebar(false);
      
      // Additional logout logic can go here
      // sessionStorage.removeItem('currentUser');
      // window.location.href = 'login.html';
    });
  }

  // Prevent clicks inside sidebar from closing it
  if (sidebar) {
    sidebar.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  }

  // ===================== Cart Functionality =====================
  let cartCount = 0;
  const cartCountElement = document.getElementById('cart-count');
  const cartBtn = document.querySelector('.cart-btn');

  // Load cart from localStorage
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
      const productId = productElement.dataset.id || Date.now().toString();
      const productName = productElement.querySelector('h3').textContent;
      const productPrice = parseFloat(productElement.querySelector('p').textContent.replace('$', ''));
      const productImage = productElement.querySelector('img').src;
      const productCategory = productElement.classList[1] || 'uncategorized';
      
      // Add to cart
      addToCart({
        id: productId,
        name: productName,
        price: productPrice,
        image: productImage,
        category: productCategory,
        quantity: 1
      });
      
      // Update UI
      cartCount++;
      updateCartCount();
      
      // Add visual feedback
      const originalText = e.target.textContent;
      e.target.textContent = 'Added!';
      e.target.classList.add('added');
      setTimeout(() => {
        e.target.textContent = originalText;
        e.target.classList.remove('added');
      }, 1000);
    }
  });
  // Cart management functions
  function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
  }

  function addToCart(product) {
    const cart = getCart();
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push(product);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    dispatchCartUpdateEvent();
  }

  function dispatchCartUpdateEvent() {
    window.dispatchEvent(new Event('cart-updated'));
  }

  // Cart button functionality
  if (cartBtn) {
    cartBtn.addEventListener('click', function(e) {
      // Save current cart before navigating
      localStorage.setItem('cart', JSON.stringify(getCart()));
    });
    
    // Hover effects
    cartBtn.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.1)';
    });
    
    cartBtn.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
    });
  }

  // ===================== Product Grid =====================
  const products = [
    { name: " Cookies Bites", price: 5.99, category: "gluten-free", image: "../../images/homeimg/GFCookiesBites.webp" },
    { name: " Donuts", price: 4.99, category: "gluten-free", image: "../../images/homeimg/GFDonuts.webp" },
    { name: " Eclair", price: 6.99, category: "gluten-free", image: "../../images/homeimg/GFEclair.webp" },
    { name: " Frozen Pizza", price: 8.99, category: "gluten-free", image: "../../images/homeimg/GFfrozenPizza.jpg" },
    { name: " Muffins", price: 7.49, category: "gluten-free", image: "../../images/homeimg/GFMuffins.webp" },
    { name: " Pretzels", price: 4.49, category: "gluten-free", image: "../../images/homeimg/GFpretzels.jpg" },
    { name: " Chocolate Cake", price: 12.99, category: "gluten-free", image: "../../images/homeimg/GlutenFreeChocolatecake.webp" },
    { name: " Try Bake Box", price: 15.99, category: "gluten-free", image: "../../images/homeimg/GlutenFreeTryBake box.webp" }
  ];

  function renderProducts() {
    const productGrid = document.querySelector('.product-grid');
    if (!productGrid) return;

    // Clear existing products
    productGrid.innerHTML = '';

    // Add new products
    products.forEach(product => {
      const productElement = document.createElement('div');
      productElement.className = `product ${product.category}`;
      productElement.dataset.id = product.id;
      productElement.innerHTML = `
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <h3>${product.name}</h3>
        <p>$${product.price.toFixed(2)}</p>
        <button class="add-to-cart">Add to Cart</button>
      `;
      productGrid.appendChild(productElement);
    });

    // Initialize auto-scroll after rendering
    initializeAutoScroll();
  }

  // ===================== Auto-Scroll Products =====================
  function initializeAutoScroll() {
    const productGrid = document.querySelector('.product-grid');
    if (!productGrid) return;

    let scrollAmount = 0;
    const scrollStep = 1;
    let scrollInterval;
    let isScrolling = true;
    const scrollSpeed = 30; // milliseconds between scroll steps

    function scrollProducts() {
      if (!isScrolling) return;
      
      scrollAmount += scrollStep;
      productGrid.scrollLeft = scrollAmount;
      
      // Reset to start when reaching end
      if (scrollAmount >= productGrid.scrollWidth - productGrid.clientWidth) {
        scrollAmount = 0;
        productGrid.scrollLeft = 0;
      }
    }

    // Start auto-scroll
    scrollInterval = setInterval(scrollProducts, scrollSpeed);

    // Pause on hover
    productGrid.addEventListener('mouseenter', () => {
      isScrolling = false;
    });

    // Resume when mouse leaves
    productGrid.addEventListener('mouseleave', () => {
      isScrolling = true;
    });

    // Touch support for mobile
    productGrid.addEventListener('touchstart', () => {
      isScrolling = false;
      clearInterval(scrollInterval);
    });

    productGrid.addEventListener('touchend', () => {
      isScrolling = true;
      scrollInterval = setInterval(scrollProducts, scrollSpeed);
    });
  }

  // ===================== Footer Year Update =====================
  function updateFooterYear() {
    const yearElement = document.querySelector('.footer-year');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  }

  // ===================== Initialize Everything =====================
  renderProducts();
  updateFooterYear();
  
  // Check for logged in user
  const currentUser = sessionStorage.getItem('currentUser');
  if (currentUser) {
    // Update UI for logged in user
    const profileIcon = document.querySelector('.profile-icon');
    if (profileIcon) {
      // profileIcon.src = currentUser.avatarUrl;
    }
  }

  // Additional initialization if needed
  window.addEventListener('resize', function() {
    // Handle responsive adjustments
  });
});