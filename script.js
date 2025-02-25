// Modal Functions
function openModal() {
    document.getElementById("modal").style.display = "flex";
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
}

// Product Carousel
let index = 0;
function showSlide(n) {
    let products = document.querySelectorAll(".product");
    products.forEach((product, i) => {
        product.style.display = i === n ? "inline-block" : "none";
    });
}

function nextSlide() {
    index = (index + 1) % 3;
    showSlide(index);
}

function prevSlide() {
    index = (index - 1 + 3) % 3;
    showSlide(index);
}

// Newsletter Subscription
function subscribe() {
    let email = document.getElementById("email").value;
    document.getElementById("subscription-msg").innerText = "Subscribed successfully!";
}
