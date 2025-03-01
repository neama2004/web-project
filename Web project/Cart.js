let defaultCart = [
    { name: 'Cookies 1', price: 10, quantity: 1, image: 'item1.jpg' },
    { name: 'Cookies 2', price: 15, quantity: 1, image: 'item2.jpg' },
    { name: 'Cookies 3', price: 20, quantity: 1, image: 'item3.jpg' }
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
                <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
            </div>
        `;
        cartContainer.appendChild(itemEl);
    });
    totalPriceEl.textContent = totalPrice.toFixed(2);
}

function updateQuantity(index, value) {
    cart[index].quantity = parseInt(value) || 1;
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