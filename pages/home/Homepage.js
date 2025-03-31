// ===================== Dark Mode Toggle =====================
document.getElementById("dark-mode-toggle").addEventListener("change", function () {
    const isDarkMode = this.checked;
    document.body.classList.toggle("dark-mode", isDarkMode);
    localStorage.setItem("darkMode", isDarkMode);
  });
  
  // Load dark mode preference on page load
  window.addEventListener("load", function () {
    const isDarkMode = localStorage.getItem("darkMode") === "true";
    document.getElementById("dark-mode-toggle").checked = isDarkMode;
    document.body.classList.toggle("dark-mode", isDarkMode);
  });
  
  // ===================== Add to Cart Functionality =====================
  let cartCount = 0;
  
  document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", () => {
      cartCount++;
      document.getElementById("cart-count").innerText = cartCount;
    });
  });
  
  // ===================== Search Functionality =====================
  function searchProducts() {
    const searchTerm = document.getElementById("search-bar").value.toLowerCase();
    const products = document.querySelectorAll(".product");
  
    products.forEach(product => {
      const productName = product.querySelector("h3").innerText.toLowerCase();
      if (productName.includes(searchTerm)) {
        product.style.display = "block";
      } else {
        product.style.display = "none";
      }
    });
  }
  
  // ===================== Smooth Scrolling =====================
  function scrollToProducts() {
    document.getElementById("products").scrollIntoView({ behavior: "smooth" });
  }
  
  // ===================== Subscribe Functionality =====================
  function subscribe() {
    const email = document.getElementById("email").value;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (emailPattern.test(email)) {
      alert(`Thank you for subscribing with ${email}!`);
      document.getElementById("email").value = '';
    } else {
      alert("Please enter a valid email address.");
    }
  }
  
  // ===================== Initialize Products =====================
function initializeProducts() {
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
  
    const productGrid = document.querySelector(".product-grid");
  
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
  
  // Initialize products on page load
  window.addEventListener("load", initializeProducts);

  // ===================== Auto-Scroll Functionality =====================
function autoScrollProducts() {
    const productGrid = document.querySelector(".product-grid");
    let scrollAmount = 0;
    const scrollStep = 250; // Adjust this value to control scroll speed
  
    // Auto-scroll every 3 seconds
    setInterval(() => {
      scrollAmount += scrollStep;
  
      // Reset scroll position if at the end
      if (scrollAmount >= productGrid.scrollWidth - productGrid.clientWidth) {
        scrollAmount = 0;
      }
  
      // Smoothly scroll to the new position
      productGrid.scrollTo({
        left: scrollAmount,
        behavior: "smooth",
      });
    }, 3000); // Adjust the interval (in milliseconds) for scroll speed
  }
  
  // Initialize auto-scroll on page load
  window.addEventListener("load", () => {
    autoScrollProducts();
  });