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
    const searchBar = document.getElementById("search-bar");

searchBar.addEventListener("input", function () {
  const query = searchBar.value.toLowerCase().trim();

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(query)
  );

  displayProducts(filteredProducts);
});

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
      // clone product to avoid modifying the original reference
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${product.name} added to cart!`);
  }
});
