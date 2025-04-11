let tasksStorage = JSON.parse(localStorage.getItem("cart")) || [];

let defaultCart = [
  { name: "Cookies 1", price: 10, quantity: 1, image: "item1.jpg" },
  {
    name: "Lorem, ipsumfuga d eaque unde fugi cumque quo!",
    price: 15,
    quantity: 1,
    image: "item2.jpg",
  },
  { name: "Cookies 3", price: 20, quantity: 1, image: "item3.jpg" },
  { name: "Cookies 2", price: 5, quantity: 10, image: "item2.jpg" },
  { name: "Cookies 3", price: 20, quantity: 2, image: "item3.jpg" },
  { name: "Cookies 2", price: 15, quantity: 6, image: "item2.jpg" },
  { name: "Cookies 3", price: 20, quantity: 7, image: "item3.jpg" },
  { name: "Cookies 2", price: 15, quantity: 9, image: "item2.jpg" },
  { name: "Cookies 3", price: 20, quantity: 10, image: "item3.jpg" },
];

//localStorage.setItem("cart", JSON.stringify(defaultCart));
//console.log({ task: "", date: "", completed: false });

let cart = JSON.parse(localStorage.getItem("cart")) || [...tasksStorage];

//For modallll
let modal = $("<div id='modal'></div>");
let modalContent = $("<div id='modal-content'></div>");
let close = $("<span id='close'>&times;</span>");
let modalHeader = $("<h2 id='modal-header'></h2>");
let modalText = $("<p id='modal-text'></p>");
let btn1 = $("<button id='btn1'>Proceed</button>");
let btn2 = $("<button id='btn2'>Cancel</button>");
let body = $("body");
modal.prop("display", "none");

function hideModal() {
  modal.prop("display", "none");
  modal.hide();
  body.prop("overflow", "scroll");
  body.prop("marginRight", "0px");
}

close.on("click", function () {
  console.log("clicked close");
  hideModal();
});
modal.on("click", function (e) {
  if (e.target.id === "modal") {
    console.log("clicked modal");
    hideModal();
  }
});
modalContent.append(close);

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

let totalPriceEl = document.getElementById("total-price");

function displayCart() {
  let cartContainer = document.getElementById("cart");

  cartContainer.innerHTML = "";
  let totalPrice = 0;
  if (cart.length === 0) {
    $(".checkout-btn").hide();
    cartContainer.innerHTML =
      "<h2>Your cart is empty...</h2><h2>Add an item to see it here!</h2><img src='../../images/cart/empty_cart.jpg' alt='empty cart' style='width: 400px; height: 400px;'>";
    cartContainer.style.textAlign = "center";
    return;
  }

  cart.forEach((item, index) => {
    $(".checkout-btn").show();
    $(".checkout-btn").on("click", function () {
      checkout();
    });
    totalPrice += item.price * item.quantity;
    let itemEl = document.createElement("div");
    itemEl.className = "cart-item";
    itemEl.innerHTML = `
        <div class="cart-details" id='item_cart' style="display:flex; align-items:center; gap:15px">
        <img src="../../images/cart/${item.image}" alt="${item.name}">
            <p >
                ${item.name}
            </p>
        </div>
            
        
            <p class="cart-details" id="price_cart">$${item.price}</p>
        
            
                <div class="cart-details" id= "quantity_cart">
                    <button class = "pmbtn" onclick="updateQuantity(${index}, ${
      item.quantity + 1
    })"> + </button>
                    <input type="number" value="${
                      item.quantity
                    }" min="1" onchange="updateQuantity(${index}, this.value)"></input>
                    <button class = "pmbtn" onclick="updateQuantity(${index}, ${
      item.quantity - 1
    })"> - </button>
                </div>
            
        
                <div class="cart-details" id="total_cart" style="display:flex; align-items:center">\
                <p>$${item.price * item.quantity}</p>
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

function checkout() {
  console.log("clicked checkout");
  modalHeader.text("Do you want to proceed to checkout?");
  modalText.text("Total: $" + totalPriceEl.textContent);
  modal.prop("display", "flex");
  modal.show();
  btn1.show();
  btn2.show();
  body.prop("overflow", "hidden");
  body.prop("marginRight", "15px");
  btn1.on("click", function () {
    modalHeader.text("Thanks for your order!");
    modalText.text("Your order has been placed successfully.");
    btn1.hide();
    btn2.hide();
    $(".total").text("Total: $0.00");
    cart = [];
    saveCart();
    displayCart();
    // this is for the 2 secs timerrrr
    setTimeout(function () {
      hideModal();
    }, 2000);
  });
  btn2.on("click", function () {
    console.log("clicked cancel");
    hideModal();
  });

  modalContent.append(modalHeader);
  modalContent.append(modalText);
  modalContent.append(btn1);
  modalContent.append(btn2);
  modal.append(modalContent);
  body.append(modal);
  displayCart();
}

displayCart();
