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






let defaultCart = [
    { name: 'Cookies 1', price: 10, quantity: 1, image: 'item1.jpg' },
    { name: 'Cookies 2', price: 15, quantity: 1, image: 'item2.jpg' },
    { name: 'Cookies 3', price: 20, quantity: 1, image: 'item3.jpg' },
    { name: 'Cookies 2', price: 5, quantity: 10, image: 'item2.jpg' },
    { name: 'Cookies 3', price: 20, quantity: 2, image: 'item3.jpg' },
    { name: 'Cookies 2', price: 15, quantity: 6, image: 'item2.jpg' },
    { name: 'Cookies 3', price: 20, quantity: 7, image: 'item3.jpg' },
    { name: 'Cookies 2', price: 15, quantity: 9, image: 'item2.jpg' },
    { name: 'Cookies 3', price: 20, quantity: 10, image: 'item3.jpg' }
];

let cart = JSON.parse(localStorage.getItem('cart')) || [...defaultCart];

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function displayCart() {
    let cartContainer = document.getElementById('cart');
    let totalPriceEl = document.getElementById('total-price');
    cartContainer.innerHTML = '';
    let totalPrice = 0;
    
    cart.forEach((item, index) => {
        totalPrice += item.price * item.quantity;
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
            <a href="#"><img src="./images/${item.image}" alt="${item.name}"></a>
            <p class="cart-details"><a href="#">${item.name}</a></p>
            <p class="cart-details" id="prc">$${item.price}</p>
            <div class="cart-actions">
                <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity(${index}, this.value)">
                <button class="remove-btn" onclick="removeItem(${index})">🗑️</button>
            </div>
        `;
        cartContainer.appendChild(itemEl);
    });
    totalPriceEl.textContent = totalPrice.toFixed(2);
}

function updateQuantity(index, value) {
    cart[index].quantity = value || 1;
    saveCart();
    displayCart();
}

function removeItem(index) {
    cart.splice(index, 1);
    saveCart();
    displayCart();
}

function restoreCart() {
    cart = [...defaultCart];
    saveCart();
    displayCart();
}

displayCart();



// ===================== Display Cart Items =====================
function displayCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = document.getElementById('cart');
    const totalPriceEl = document.getElementById('total-price');
    cartContainer.innerHTML = '';
    let totalPrice = 0;

    cart.forEach((item, index) => {
        totalPrice += item.price * item.quantity;
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
            <a href="#"><img src="./images/${item.image}" alt="${item.name}"></a>
            <p class="cart-details"><a href="#">${item.name}</a></p>
            <p class="cart-details" id="prc">$${item.price}</p>
            <div class="cart-actions">
                <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity(${index}, this.value)">
                <button class="remove-btn" onclick="removeItem(${index})">🗑️</button>
            </div>
        `;
        cartContainer.appendChild(itemEl);
    });

    totalPriceEl.textContent = totalPrice.toFixed(2);
}

// ===================== Update Quantity =====================
function updateQuantity(index, value) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart[index].quantity = parseInt(value) || 1;
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
}

// ===================== Remove Item =====================
function removeItem(index) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
}

// ===================== Restore Cart =====================
function restoreCart() {
    const defaultCart = [
        { name: 'Cookies 1', price: 10, quantity: 1, image: 'item1.jpg' },
        { name: 'Cookies 2', price: 15, quantity: 1, image: 'item2.jpg' },
        { name: 'Cookies 3', price: 20, quantity: 1, image: 'item3.jpg' }
    ];
    localStorage.setItem('cart', JSON.stringify(defaultCart));
    displayCart();
}

// Initialize cart on page load
window.addEventListener('load', function () {
    displayCart();
});