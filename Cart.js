






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
        let itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `

            <a href="#"><img src="./images/${item.image}" alt="${item.name}"></a>
            <p class="cart-details" id='item_cart'>
                <a href="#">${item.name}</a>
            </p>

            <div class="cart-details"><p class="cart-details" id="price_cart">$${item.price}</p></div>

            
                <div class="cart-details" id= "quantity_cart">
                    <button class = "pmbtn" onclick="updateQuantity(${index}, ${item.quantity + 1})"> + </button>
                    <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity(${index}, this.value)"></input>
                    <button class = "pmbtn" onclick="updateQuantity(${index}, ${item.quantity - 1})"> - </button>
                </div>
            

            <p class="cart-details" id="total_cart">$${item.price*item.quantity}
                <button class="remove-btn" onclick="removeItem(${index})">🗑️</button>
            </p>
            
            
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