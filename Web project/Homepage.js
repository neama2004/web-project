// ===================== Sidebar and Cart Toggle =====================
function toggleSidebar() {
    const sidebar = document.querySelector(".sidebar");
    sidebar.classList.toggle("open");
}

function toggleCart() {
    const cartSidebar = document.querySelector(".cart-sidebar");
    cartSidebar.classList.toggle("open");
}

// ===================== Add to Cart Functionality =====================
let cartCount = 0;
let cartTotal = 0;

document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", () => {
        cartCount++;
        document.getElementById("cart-count").innerText = cartCount;

        // Update cart total
        const productPrice = parseFloat(button.previousElementSibling.innerText.replace('$', ''));
        cartTotal += productPrice;
        document.getElementById("cart-total").innerText = cartTotal.toFixed(2);

        // Add item to cart display
        const cartItems = document.getElementById("cart-items");
        const newItem = document.createElement("li");
        newItem.innerText = `${button.previousElementSibling.previousElementSibling.innerText} - $${productPrice.toFixed(2)}`;
        cartItems.appendChild(newItem);
    });
});

// ===================== Dark Mode Toggle =====================
document.getElementById("dark-mode-toggle").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
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

// ===================== Filter Products by Category =====================
function filterProducts(category) {
    const products = document.querySelectorAll(".product");

    products.forEach(product => {
        if (product.classList.contains(category)) {
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

// ===================== Checkout Functionality =====================
function checkout() {
    if (cartCount === 0) {
        alert("Your cart is empty!");
    } else {
        alert(`Thank you for your purchase! Total: $${cartTotal.toFixed(2)}`);
        document.getElementById("cart-items").innerHTML = "";
        cartCount = 0;
        cartTotal = 0;
        document.getElementById("cart-count").innerText = cartCount;
        document.getElementById("cart-total").innerText = cartTotal.toFixed(2);
    }
}

// ===================== Subscribe Functionality =====================
function subscribe() {
    const email = document.getElementById("email").value;
    if (email) {
        alert(`Thank you for subscribing with ${email}!`);
        document.getElementById("email").value = ''; // Clear input
    } else {
        alert("Please enter a valid email address.");
    }
}

// ===================== Sticky Header =====================
window.addEventListener("scroll", () => {
    const header = document.querySelector("header");
    if (window.scrollY > 50) {
        header.classList.add("sticky");
    } else {
        header.classList.remove("sticky");
    }
});

// ===================== Initialize Products =====================
function initializeProducts() {
    const products = [
        { name: "Gluten-Free Bread", price: 5.99, category: "gluten-free", image: "https://via.placeholder.com/250x250" },
        { name: "Dairy-Free Milk", price: 3.99, category: "dairy-free", image: "https://via.placeholder.com/250x250" },
        { name: "Nut-Free Cookies", price: 4.99, category: "nut-free", image: "https://via.placeholder.com/250x250" },
        { name: "Vegan Cheese", price: 6.99, category: "vegan", image: "https://via.placeholder.com/250x250" },
        { name: "Organic Pasta", price: 4.49, category: "organic", image: "https://via.placeholder.com/250x250" }
    ];

    const productGrid = document.querySelector(".product-grid");

    products.forEach(product => {
        const productElement = document.createElement("div");
        productElement.classList.add("product", product.category);
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>$${product.price.toFixed(2)}</p>
            <button class="add-to-cart">Add to Cart</button>
        `;
        productGrid.appendChild(productElement);
    });

    // Reattach event listeners for "Add to Cart" buttons
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", () => {
            cartCount++;
            document.getElementById("cart-count").innerText = cartCount;

            const productPrice = parseFloat(button.previousElementSibling.innerText.replace('$', ''));
            cartTotal += productPrice;
            document.getElementById("cart-total").innerText = cartTotal.toFixed(2);

            const cartItems = document.getElementById("cart-items");
            const newItem = document.createElement("li");
            newItem.innerText = `${button.previousElementSibling.previousElementSibling.innerText} - $${productPrice.toFixed(2)}`;
            cartItems.appendChild(newItem);
        });
    });
}

// Initialize products on page load
window.addEventListener("load", initializeProducts);