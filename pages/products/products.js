document.addEventListener("DOMContentLoaded", function () {
  const productList = document.querySelector(".productlist");
  const filterItems = document.querySelectorAll("#filterlist li");
  const modal = document.querySelector(".productmodal");
  const modalName = document.getElementById("modalname");
  const modalImage = document.getElementById("modalimage");
  const modalDescription = document.getElementById("modaldescription");
  const modalPrice = document.getElementById("modalprice");
  const addToCartBtn = document.getElementById("add-to-cart");

  let products = [];
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let currentFilter = "all";
  let currentProduct = null;

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

  overlay.addEventListener("click", function () {
    toggleSidebar(false);
  });

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

  // Product functionality
  fetch("products.json")
    .then((response) => response.json())
    .then((data) => {
      products = data.filter((product) => product.name);
      displayProducts(products);
    })
    .catch((error) => console.error("Error loading products:", error));

  function displayProducts(productsToDisplay) {
    productList.innerHTML = "";

    productsToDisplay.forEach((product) => {
      const productCard = document.createElement("div");
      productCard.className = "product-card";

      productCard.innerHTML = `
              <img src="${product.image}" alt="${
        product.name
      }" class="product-image">
              <div class="product-info">
                  <h3 class="product-name">${product.name}</h3>
                  <p class="product-price">$${product.price.toFixed(2)}</p>
                  <div class="product-allergies">
                      ${product.allergyFree
                        .map(
                          (allergy) =>
                            `<span class="allergy-tag">${allergy} Free</span>`
                        )
                        .join("")}
                  </div>
                  <button class="add-cart-btn">Add to Cart</button>
              </div>
          `;

      productList.appendChild(productCard);

      productCard.addEventListener("click", (e) => {
        if (!e.target.classList.contains("add-cart-btn")) {
          openModal(product);
        }
      });

      const cartBtn = productCard.querySelector(".add-cart-btn");
      cartBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        addToCart(product);
      });
    });
  }

  filterItems.forEach((item) => {
    item.addEventListener("click", () => {
      document.querySelector("#filterlist li#active").removeAttribute("id");
      item.id = "active";
      currentFilter = item.dataset.filter;

      if (currentFilter === "all") {
        displayProducts(products);
      } else {
        const filteredProducts = products.filter((product) =>
          product.allergyFree.includes(currentFilter)
        );
        displayProducts(filteredProducts);
      }
    });
  });

  const searchBar = document.getElementById("search-bar");

  searchBar.addEventListener("input", function () {
    const query = searchBar.value.toLowerCase().trim();

    const filteredProducts = products.filter((product) =>
      product.name.toLowerCase().includes(query)
    );

    displayProducts(filteredProducts);
  });

  function openModal(product) {
    currentProduct = product;
    modalName.textContent = product.name;
    modalImage.src = product.image;
    modalImage.alt = product.name;
    modalDescription.textContent =
      product.description || "No description available";
    modalPrice.textContent = `$${product.price.toFixed(2)}`;
    modal.style.display = "flex";
  }

  function closeModal() {
    modal.style.display = "none";
    currentProduct = null;
  }

  window.closeModal = closeModal;

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  addToCartBtn.addEventListener("click", () => {
    if (currentProduct) {
      addToCart(currentProduct);
      closeModal();
    }
  });

  function addToCart(product) {
    let existingProduct = cart.find((item) => item.id === product.id);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    alert(`${product.name} added to cart!`);
  }
});