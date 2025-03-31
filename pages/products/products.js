// ===================== Product Data =====================
const products = [
    { name: "Gluten-Free Bread", price: 5.99, category: "gluten-free", image: "https://via.placeholder.com/250x250", description: "Delicious gluten-free bread made with natural ingredients.", rating: 4.5, badge: "New" },
    { name: "Dairy-Free Milk", price: 3.99, category: "dairy-free", image: "https://via.placeholder.com/250x250", description: "Creamy dairy-free milk alternative.", rating: 4.0, badge: "Sale" },
    { name: "Nut-Free Cookies", price: 4.99, category: "nut-free", image: "https://via.placeholder.com/250x250", description: "Crunchy and nut-free cookies for everyone to enjoy.", rating: 4.7, badge: "Popular" },
    { name: "Vegan Cheese", price: 6.99, category: "vegan", image: "https://via.placeholder.com/250x250", description: "Rich and creamy vegan cheese made from plant-based ingredients.", rating: 4.2, badge: "New" },
    { name: "Organic Pasta", price: 4.49, category: "organic", image: "https://via.placeholder.com/250x250", description: "Organic pasta made from whole grains.", rating: 4.8, badge: "Organic" },
    { name: "Sugar-Free Granola", price: 7.99, category: "sugar-free", image: "https://via.placeholder.com/250x250", description: "Healthy sugar-free granola for a guilt-free snack.", rating: 4.6, badge: "Healthy" },
    { name: "Plant-Based Protein Bars", price: 8.99, category: "vegan", image: "https://via.placeholder.com/250x250", description: "High-protein, plant-based bars for on-the-go energy.", rating: 4.9, badge: "Best Seller" },
    { name: "Allergy-Friendly Snack Mix", price: 5.49, category: "nut-free", image: "https://via.placeholder.com/250x250", description: "A delicious mix of allergy-friendly snacks.", rating: 4.3, badge: "New" },
    { name: "Gluten-Free Pancake Mix", price: 6.99, category: "gluten-free", image: "https://via.placeholder.com/250x250", description: "Easy-to-make gluten-free pancake mix.", rating: 4.4, badge: "New" },
    { name: "Dairy-Free Yogurt", price: 4.99, category: "dairy-free", image: "https://via.placeholder.com/250x250", description: "Creamy dairy-free yogurt made from almond milk.", rating: 4.1, badge: "Sale" },
    { name: "Vegan Chocolate", price: 7.49, category: "vegan", image: "https://via.placeholder.com/250x250", description: "Rich and smooth vegan chocolate.", rating: 4.7, badge: "Popular" },
    { name: "Organic Quinoa", price: 5.99, category: "organic", image: "https://via.placeholder.com/250x250", description: "High-quality organic quinoa.", rating: 4.8, badge: "Organic" },
    { name: "Sugar-Free Jam", price: 3.99, category: "sugar-free", image: "https://via.placeholder.com/250x250", description: "Sweet and tangy sugar-free jam.", rating: 4.5, badge: "Healthy" },
    { name: "Nut-Free Granola Bars", price: 4.99, category: "nut-free", image: "https://via.placeholder.com/250x250", description: "Crunchy and nut-free granola bars.", rating: 4.6, badge: "New" },
    { name: "Vegan Ice Cream", price: 8.99, category: "vegan", image: "https://via.placeholder.com/250x250", description: "Creamy and delicious vegan ice cream.", rating: 4.9, badge: "Best Seller" }
  ];
  
  // ===================== Initialize Products =====================
  const productGrid = document.querySelector(".product-grid");
  const pageInfo = document.getElementById("page-info");
  const itemsPerPage = 4; // Number of products per page
  let currentPage = 1;
  
  function displayProducts(productsToDisplay) {
    const productGrid = document.querySelector(".product-grid");
    productGrid.innerHTML = ""; // Clear existing products
    productsToDisplay.forEach(product => {
        const productElement = document.createElement("div");
        productElement.classList.add("product");

        productElement.innerHTML = `
            ${product.badge ? `<span class="badge">${product.badge}</span>` : ""}
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            <h3>${product.name}</h3>
            <div class="rating">
                ${"★".repeat(Math.floor(product.rating))}${"☆".repeat(5 - Math.floor(product.rating))}
            </div>
            <p>$${product.price.toFixed(2)}</p>
        `;

        // Make the entire product clickable to open the modal
        productElement.addEventListener('click', () => openModal(product));
        productGrid.appendChild(productElement);
    });
}
  
  // ===================== Pagination =====================
  function updatePagination() {
    const totalPages = Math.ceil(products.length / itemsPerPage);
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  }
  
  function prevPage() {
    if (currentPage > 1) {
      currentPage--;
      renderProducts();
    }
  }
  
  function nextPage() {
    const totalPages = Math.ceil(products.length / itemsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      renderProducts();
    }
  }
  
  function renderProducts() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const productsToDisplay = products.slice(startIndex, endIndex);
    displayProducts(productsToDisplay);
    updatePagination();
  }
  
  // ===================== Filter Products =====================
  function filterProducts() {
    const category = document.getElementById("category-filter").value;
    const filteredProducts = category === "all"
      ? products
      : products.filter(product => product.category === category);
    currentPage = 1; // Reset to first page after filtering
    renderProducts(filteredProducts);
  }
  
  // ===================== Sort Products =====================
  function sortProducts() {
    const sortBy = document.getElementById("sort-by").value;
    let sortedProducts = [...products];
  
    switch (sortBy) {
      case "price-low-to-high":
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case "price-high-to-low":
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case "name-a-to-z":
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-z-to-a":
        sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }
  
    currentPage = 1; // Reset to first page after sorting
    renderProducts(sortedProducts);
  }
  
  // ===================== Search Products =====================
  function searchProducts() {
    const searchTerm = document.getElementById("search-bar").value.toLowerCase();
    const filteredProducts = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm)
    );
    currentPage = 1; // Reset to first page after searching
    renderProducts(filteredProducts);
  }
  
  // ===================== Product Details Modal =====================
  let selectedProduct = null; // Store the selected product for the modal

  // Open the modal and display product details
  function openModal(product) {
      selectedProduct = product; // Store the selected product
      const modal = document.getElementById('product-modal');
      const modalImage = document.getElementById('modal-image');
      const modalName = document.getElementById('modal-name');
      const modalPrice = document.getElementById('modal-price');
      const modalDescription = document.getElementById('modal-description');
  
      // Populate the modal with product details
      modalImage.src = product.image;
      modalName.textContent = product.name;
      modalPrice.textContent = `$${product.price.toFixed(2)}`;
      modalDescription.textContent = product.description;
  
      // Display the modal
      modal.style.display = 'flex';
  }
  
  // Close the modal
  function closeModal() {
      const modal = document.getElementById('product-modal');
      modal.style.display = 'none';
  }
  
  // Add to Cart from the modal
  function addToCartFromModal() {
      if (selectedProduct) {
          addToCart(JSON.stringify(selectedProduct)); // Add the selected product to the cart
          closeModal(); // Close the modal after adding to cart
      }
  }
  
  // ===================== Dark Mode Toggle =====================
  document.getElementById("dark-mode-toggle").addEventListener("change", function () {
    const isDarkMode = this.checked;
    document.body.classList.toggle("dark-mode", isDarkMode);
    localStorage.setItem("darkMode", isDarkMode);
  });

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
  
  // Load dark mode preference on page load
  window.addEventListener("load", function () {
    const isDarkMode = localStorage.getItem("darkMode") === "true";
    document.getElementById("dark-mode-toggle").checked = isDarkMode;
    document.body.classList.toggle("dark-mode", isDarkMode);
    renderProducts(); // Initialize products on page load
  });


 // ===================== Add to Cart Functionality =====================
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProductIndex = cart.findIndex(item => item.name === product.name);

    if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCounter();
}

// ===================== Update Cart Counter =====================
function updateCartCounter() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').textContent = totalQuantity;
}
// ===================== Initialize Cart Counter on Page Load =====================
window.addEventListener('load', function () {
    updateCartCounter();
    displayProducts(products); // Display products on page load
});

// ===================== Display Products =====================
function displayProducts(productsToDisplay) {
    const productGrid = document.querySelector(".product-grid");
    productGrid.innerHTML = ""; // Clear existing products
    productsToDisplay.forEach(product => {
        const productElement = document.createElement("div");
        productElement.classList.add("product");

        // Escape the product object for use in HTML
        const productString = JSON.stringify(product).replace(/"/g, '&quot;');

        productElement.innerHTML = `
            ${product.badge ? `<span class="badge">${product.badge}</span>` : ""}
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            <h3>${product.name}</h3>
            <div class="rating">
                ${"★".repeat(Math.floor(product.rating))}${"☆".repeat(5 - Math.floor(product.rating))}
            </div>
            <p>$${product.price.toFixed(2)}</p>
            <button class="add-to-cart" onclick="addToCart('${productString}')">Add to Cart</button>
        `;

        // Make the entire product clickable to open the modal
        productElement.addEventListener('click', () => openModal(product));
        productGrid.appendChild(productElement);
    });
}

function addToCart(productString) {
    // Parse the product string back into an object
    const product = JSON.parse(productString);

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProductIndex = cart.findIndex(item => item.name === product.name);

    if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    // Save the updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Update the cart counter
    updateCartCounter();
}
window.addEventListener('click', function (event) {
    const modal = document.getElementById('product-modal');
    if (event.target === modal) {
        closeModal();
    }
});
window.addEventListener('keydown', function (event) {
    const modal = document.getElementById('product-modal');
    if (event.key === 'Escape' && modal.style.display === 'flex') {
        closeModal();
    }
});