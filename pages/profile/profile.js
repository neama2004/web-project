document.addEventListener("DOMContentLoaded", function () {
  // Load user data from sessionStorage
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser")) || {
    name: "Guest User",
    email: "",
    phone: "",
    dob: "",
    address: "",
    joinDate: new Date().toISOString(),
    allergies: [],
    loyaltyPoints: 0,
  };

  // Initialize modals
  const editModal = document.getElementById("edit-profile-modal");
  const orderDetailsModal = document.getElementById("order-details-modal");
  const closeModalButtons = document.querySelectorAll(".close-modal");
  const cancelBtn = document.querySelector(".cancel-btn");
  const profileForm = document.getElementById("profile-edit-form");

  // Get orders from localStorage
  function getOrderHistory() {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    return orders.filter((order) => order.userEmail === currentUser.email);
  }

  // Get cart count from localStorage
  function update() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById("cart-count").textContent = count;
  }

  // Populate user data
  function populateUserData() {
    document.getElementById("profile-name").textContent =
      currentUser.name || "Guest User";
    document.getElementById("user-fullname").textContent =
      currentUser.name || "Guest User";
    document.getElementById("user-email").textContent =
      currentUser.email || "Not provided";
    document.getElementById("user-phone").textContent =
      currentUser.phone || "Not provided";
    document.getElementById("user-address").textContent =
      currentUser.address || "Not provided";

    // Format and display date of birth
    if (currentUser.dob) {
      const dobDate = new Date(currentUser.dob);
      const formattedDob = dobDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      document.getElementById("user-dob").textContent = formattedDob;
    } else {
      document.getElementById("user-dob").textContent = "Not provided";
    }

    // Format and display join date
    const joinDate = new Date(currentUser.joinDate);
    const formattedJoinDate = joinDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
    document.getElementById("join-date").textContent = formattedJoinDate;

    // Update stats
    const userOrders = getOrderHistory();
    document.getElementById("total-orders").textContent = userOrders.length;
    document.getElementById("loyalty-points").textContent =
      currentUser.loyaltyPoints || 0;
    document.getElementById("allergies-count").textContent =
      currentUser.allergies.length;

    // Display allergy tags
    displayAllergyTags(currentUser.allergies);

    // Display order history
    displayOrderHistory(userOrders);

    // Display payment methods
    displayPaymentMethods(currentUser.paymentMethods || []);

    // Update cart count
    updateCartCount();
  }

  // Display allergy tags
  function displayAllergyTags(allergies) {
    const container = document.getElementById("allergy-tags-container");
    container.innerHTML = "";

    if (allergies.length === 0) {
      container.innerHTML = "<p>No allergies specified</p>";
      return;
    }

    allergies.forEach((allergy) => {
      const tag = document.createElement("span");
      tag.className = `allergy-tag ${allergy.toLowerCase().replace(" ", "-")}`;
      tag.textContent = allergy;
      container.appendChild(tag);
    });
  }

  // Display order history in the UI
  function displayOrderHistory(orders) {
    const container = document.getElementById("order-history-container");
    container.innerHTML = "";

    if (orders.length === 0) {
      container.innerHTML = `
          <div class="empty-orders">
            <i class="fas fa-shopping-cart"></i>
            <p>You haven't placed any orders yet</p>
            <a href="../products/products.html" class="btn">Start Shopping</a>
          </div>
        `;
      return;
    }

    // Sort orders by date (newest first)
    orders.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Display only the 3 most recent orders in the profile
    const recentOrders = orders.slice(0, 3);

    recentOrders.forEach((order) => {
      const orderDate = new Date(order.date);
      const formattedDate = orderDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      const orderCard = document.createElement("div");
      orderCard.className = "order-card";
      orderCard.innerHTML = `
          <div class="order-header">
            <div class="order-id">Order #${order.id}</div>
            <div class="order-date">${formattedDate}</div>
            <div class="order-status ${order.status}">${
        order.status.charAt(0).toUpperCase() + order.status.slice(1)
      }</div>
            <div class="order-total">$${order.total.toFixed(2)}</div>
          </div>
          <div class="order-details">
            <div class="order-items">
              ${order.items
                .slice(0, 2)
                .map(
                  (item) => `
                <div class="order-item">
                  <img src="../../images/products/${item.image}" alt="${
                    item.name
                  }" onerror="this.src='../../images/products/default-product.jpg'">
                  <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>Qty: ${item.quantity} × $${item.price.toFixed(2)}</p>
                  </div>
                </div>
              `
                )
                .join("")}
              ${
                order.items.length > 2
                  ? `<p>+ ${order.items.length - 2} more items</p>`
                  : ""
              }
            </div>
            <div class="order-actions">
              <button class="order-action-btn reorder" data-order-id="${
                order.id
              }">Reorder</button>
              ${
                order.status === "processing" || order.status === "shipped"
                  ? `<button class="order-action-btn track" data-order-id="${order.id}">Track</button>`
                  : ""
              }
              <button class="order-action-btn details" data-order-id="${
                order.id
              }">Details</button>
            </div>
          </div>
        `;
      container.appendChild(orderCard);
    });
  }

  // Display payment methods
  function displayPaymentMethods(paymentMethods) {
    const container = document.getElementById("payment-methods-container");
    container.innerHTML = "";

    if (paymentMethods.length === 0) {
      container.innerHTML = "<p>No saved payment methods</p>";
      return;
    }

    paymentMethods.forEach((method) => {
      const card = document.createElement("div");
      card.className = "payment-card";
      card.innerHTML = `
          <div class="payment-card-icon">
            <i class="fab ${getPaymentIconClass(method.type)}"></i>
          </div>
          <div class="payment-card-details">
            <div class="card-type">${method.type.toUpperCase()}</div>
            <div class="card-number">•••• •••• •••• ${
              method.last4 || "****"
            }</div>
            <div class="card-expiry">Expires ${method.expiry || "••/••"}</div>
          </div>
          <div class="payment-card-actions">
            <button class="payment-action-btn edit"><i class="fas fa-pencil-alt"></i></button>
            <button class="payment-action-btn remove"><i class="fas fa-trash"></i></button>
          </div>
        `;
      container.appendChild(card);
    });
  }

  // Helper function to get payment icon class
  function getPaymentIconClass(paymentType) {
    const type = paymentType.toLowerCase();
    if (type.includes("visa")) return "fa-cc-visa";
    if (type.includes("mastercard")) return "fa-cc-mastercard";
    if (type.includes("amex")) return "fa-cc-amex";
    if (type.includes("discover")) return "fa-cc-discover";
    if (type.includes("paypal")) return "fa-cc-paypal";
    return "fa-credit-card";
  }

  // Handle edit profile button
  document
    .getElementById("edit-personal-info")
    .addEventListener("click", function () {
      // Populate form with current data
      document.getElementById("edit-name").value = currentUser.name || "";
      document.getElementById("edit-email").value = currentUser.email || "";
      document.getElementById("edit-phone").value = currentUser.phone || "";
      document.getElementById("edit-dob").value = currentUser.dob || "";
      document.getElementById("edit-address").value = currentUser.address || "";

      editModal.style.display = "flex";
    });

  // Handle close modal buttons
  closeModalButtons.forEach((button) => {
    button.addEventListener("click", function () {
      editModal.style.display = "none";
      orderDetailsModal.style.display = "none";
    });
  });

  // Handle cancel button
  cancelBtn.addEventListener("click", function () {
    editModal.style.display = "none";
  });

  // Close modal when clicking outside
  window.addEventListener("click", function (event) {
    if (event.target === editModal) {
      editModal.style.display = "none";
    }
    if (event.target === orderDetailsModal) {
      orderDetailsModal.style.display = "none";
    }
  });

  // Handle form submission
  profileForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Update user data
    currentUser.name = document.getElementById("edit-name").value;
    currentUser.email = document.getElementById("edit-email").value;
    currentUser.phone = document.getElementById("edit-phone").value;
    currentUser.dob = document.getElementById("edit-dob").value;
    currentUser.address = document.getElementById("edit-address").value;

    // Update session storage
    sessionStorage.setItem("currentUser", JSON.stringify(currentUser));

    // Update displayed data
    populateUserData();

    // Close modal
    editModal.style.display = "none";

    // Show success message
    showNotification("Profile updated successfully!");
  });

  // Handle order action buttons
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("order-action-btn")) {
      const button = e.target.closest(".order-action-btn");
      const orderId = button.dataset.orderId;
      const action = button.classList.contains("reorder")
        ? "reorder"
        : button.classList.contains("track")
        ? "track"
        : "details";

      handleOrderAction(orderId, action);
    }
  });

  // Handle payment method actions
  document.addEventListener("click", function (e) {
    if (e.target.closest(".payment-action-btn")) {
      const button = e.target.closest(".payment-action-btn");
      const action = button.classList.contains("edit") ? "edit" : "remove";
      const cardElement = button.closest(".payment-card");

      if (action === "remove") {
        if (confirm("Are you sure you want to remove this payment method?")) {
          cardElement.remove();
          showNotification("Payment method removed");
        }
      } else {
        showNotification("Edit payment method functionality coming soon");
      }
    }
  });

  // Handle view all orders button
  document
    .getElementById("view-all-orders")
    .addEventListener("click", function (e) {
      e.preventDefault();
      // In a real app, this would redirect to a full orders page
      showNotification("View all orders functionality coming soon");
    });

  // Handle add payment method button
  document
    .getElementById("add-payment-method")
    .addEventListener("click", function (e) {
      e.preventDefault();
      showNotification("Add payment method functionality coming soon");
    });

  // Handle edit allergies button
  document
    .getElementById("edit-allergies")
    .addEventListener("click", function (e) {
      e.preventDefault();
      showNotification("Allergy profile editor coming soon");
    });

  // Handle logout button
  document.querySelector(".logout-btn").addEventListener("click", function () {
    sessionStorage.removeItem("currentUser");
    window.location.href = "../login/login.html";
  });

  // Handle order actions
  function handleOrderAction(orderId, action) {
    const orders = getOrderHistory();
    const order = orders.find((o) => o.id === orderId);

    if (!order) {
      showNotification("Order not found", "error");
      return;
    }

    switch (action) {
      case "reorder":
        reorderItems(order);
        break;

      case "track":
        trackOrder(order);
        break;

      case "details":
        showOrderDetails(order);
        break;
    }
  }

  // Reorder items from a previous order
  function reorderItems(order) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    let addedCount = 0;

    order.items.forEach((item) => {
      const existingItem = cart.find((ci) => ci.id === item.id);
      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        cart.push({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        });
      }
      addedCount++;
    });

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    showNotification(`${addedCount} items added to your cart!`);
  }

  // Track order status
  function trackOrder(order) {
    // In a real app, this would show detailed tracking info
    const statusMessages = {
      processing: "Your order is being prepared",
      shipped: `Shipped on ${new Date(
        order.shippingDate
      ).toLocaleDateString()}`,
      delivered: `Delivered on ${new Date(
        order.deliveryDate
      ).toLocaleDateString()}`,
      cancelled: "This order has been cancelled",
    };

    showNotification(
      `Order #${order.id}: ${statusMessages[order.status] || "Status unknown"}`
    );
  }

  // Show detailed order information
  function showOrderDetails(order) {
    const orderDate = new Date(order.date);
    const formattedDate = orderDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const itemsList = order.items
      .map(
        (item) => `
        <div class="order-detail-item">
          <img src="../../images/products/${item.image}" alt="${
          item.name
        }" onerror="this.src='../../images/products/default-product.jpg'">
          <div>
            <h4>${item.name}</h4>
            <p>Quantity: ${item.quantity}</p>
            <p>Price: $${item.price.toFixed(2)} each</p>
            <p>Subtotal: $${(item.price * item.quantity).toFixed(2)}</p>
          </div>
        </div>
      `
      )
      .join("");

    const detailsHtml = `
        <h3>Order #${order.id}</h3>
        <div class="order-detail-info">
          <p><strong>Date:</strong> ${formattedDate}</p>
          <p><strong>Status:</strong> <span class="order-status ${
            order.status
          }">${
      order.status.charAt(0).toUpperCase() + order.status.slice(1)
    }</span></p>
          <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
          ${
            order.shippingAddress
              ? `<p><strong>Shipping Address:</strong> ${order.shippingAddress}</p>`
              : ""
          }
          ${
            order.paymentMethod
              ? `<p><strong>Payment Method:</strong> ${order.paymentMethod.type} ending in ${order.paymentMethod.last4}</p>`
              : ""
          }
        </div>
        <div class="order-detail-items">
          <h4>Items (${order.items.length})</h4>
          ${itemsList}
        </div>
        <div class="order-detail-actions">
          <button class="order-action-btn reorder" data-order-id="${
            order.id
          }">Reorder All Items</button>
        </div>
      `;

    document.getElementById("order-details-content").innerHTML = detailsHtml;
    orderDetailsModal.style.display = "flex";
  }

  // Show notification to user
  function showNotification(message, type = "success") {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <p>${message}</p>
      `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add("fade-out");
      setTimeout(() => notification.remove(), 500);
    }, 3000);
  }

  // Initialize dark mode toggle
  const darkModeToggle = document.getElementById("dark-mode-toggle");
  if (darkModeToggle) {
    const darkModeEnabled = localStorage.getItem("darkMode") === "true";
    if (darkModeEnabled) {
      document.body.classList.add("dark-mode");
      darkModeToggle.checked = true;
    }

    darkModeToggle.addEventListener("change", function () {
      document.body.classList.toggle("dark-mode", this.checked);
      localStorage.setItem("darkMode", this.checked);
    });
  }

  // Initialize the page
  populateUserData();
});

// Add these new functions to your existing profile.js

// Handle Edit Allergies (Manage) button
document
  .getElementById("edit-allergies")
  .addEventListener("click", function (e) {
    e.preventDefault();
    showAllergyManagementModal();
  });

function showAllergyManagementModal() {
  const modalContent = `
        <h2>Manage Allergy Profile</h2>
        <p>Select all that apply to you:</p>
        <form id="allergy-form">
            <div class="checkbox-group">
                <label>
                    <input type="checkbox" name="gluten" ${
                      currentUser.allergies.includes("gluten") ? "checked" : ""
                    }>
                    Gluten
                </label>
                <label>
                    <input type="checkbox" name="dairy" ${
                      currentUser.allergies.includes("dairy") ? "checked" : ""
                    }>
                    Dairy
                </label>
                <label>
                    <input type="checkbox" name="nuts" ${
                      currentUser.allergies.includes("nuts") ? "checked" : ""
                    }>
                    Tree Nuts
                </label>
                <label>
                    <input type="checkbox" name="peanuts" ${
                      currentUser.allergies.includes("peanuts") ? "checked" : ""
                    }>
                    Peanuts
                </label>
                <label>
                    <input type="checkbox" name="soy" ${
                      currentUser.allergies.includes("soy") ? "checked" : ""
                    }>
                    Soy
                </label>
                <label>
                    <input type="checkbox" name="eggs" ${
                      currentUser.allergies.includes("eggs") ? "checked" : ""
                    }>
                    Eggs
                </label>
                <label>
                    <input type="checkbox" name="fish" ${
                      currentUser.allergies.includes("fish") ? "checked" : ""
                    }>
                    Fish
                </label>
                <label>
                    <input type="checkbox" name="shellfish" ${
                      currentUser.allergies.includes("shellfish")
                        ? "checked"
                        : ""
                    }>
                    Shellfish
                </label>
            </div>
            <div class="form-actions">
                <button type="button" class="cancel-btn">Cancel</button>
                <button type="submit" class="save-btn">Save Changes</button>
            </div>
        </form>
    `;

  document.getElementById("order-details-content").innerHTML = modalContent;
  const modal = document.getElementById("order-details-modal");
  modal.style.display = "flex";

  // Handle form submission
  document
    .getElementById("allergy-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      const formData = new FormData(this);
      const selectedAllergies = [];

      for (const [name, value] of formData.entries()) {
        if (value === "on") {
          selectedAllergies.push(name);
        }
      }

      currentUser.allergies = selectedAllergies;
      sessionStorage.setItem("currentUser", JSON.stringify(currentUser));
      displayAllergyTags(selectedAllergies);
      document.getElementById("allergies-count").textContent =
        selectedAllergies.length;
      showNotification("Allergy profile updated successfully!");
      modal.style.display = "none";
    });

  // Handle cancel button
  modal.querySelector(".cancel-btn").addEventListener("click", function () {
    modal.style.display = "none";
  });
}

// Handle View All Orders button
document
  .getElementById("view-all-orders")
  .addEventListener("click", function (e) {
    e.preventDefault();
    showAllOrdersModal();
  });

function showAllOrdersModal() {
  const orders = getOrderHistory();

  if (orders.length === 0) {
    showNotification("You have no orders yet", "info");
    return;
  }

  const ordersList = orders
    .map((order) => {
      const orderDate = new Date(order.date);
      const formattedDate = orderDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      return `
            <div class="order-card">
                <div class="order-header">
                    <div class="order-id">Order #${order.id}</div>
                    <div class="order-date">${formattedDate}</div>
                    <div class="order-status ${order.status}">${
        order.status.charAt(0).toUpperCase() + order.status.slice(1)
      }</div>
                    <div class="order-total">$${order.total.toFixed(2)}</div>
                </div>
                <div class="order-actions">
                    <button class="order-action-btn details" data-order-id="${
                      order.id
                    }">Details</button>
                </div>
            </div>
        `;
    })
    .join("");

  const modalContent = `
        <h2>All Orders (${orders.length})</h2>
        <div class="all-orders-list">
            ${ordersList}
        </div>
    `;

  document.getElementById("order-details-content").innerHTML = modalContent;
  const modal = document.getElementById("order-details-modal");
  modal.style.display = "flex";
}

// Handle Add Payment Method button
document
  .getElementById("add-payment-method")
  .addEventListener("click", function (e) {
    e.preventDefault();
    showAddPaymentMethodModal();
  });

function showAddPaymentMethodModal() {
  const modalContent = `
        <h2>Add Payment Method</h2>
        <form id="payment-method-form">
            <div class="form-group">
                <label for="card-type">Card Type</label>
                <select id="card-type" required>
                    <option value="">Select card type</option>
                    <option value="visa">Visa</option>
                    <option value="mastercard">Mastercard</option>
                    <option value="amex">American Express</option>
                    <option value="discover">Discover</option>
                </select>
            </div>
            <div class="form-group">
                <label for="card-number">Card Number</label>
                <input type="text" id="card-number" placeholder="1234 5678 9012 3456" required>
            </div>
            <div class="form-group">
                <label for="card-expiry">Expiration Date</label>
                <input type="text" id="card-expiry" placeholder="MM/YY" required>
            </div>
            <div class="form-group">
                <label for="card-cvv">CVV</label>
                <input type="text" id="card-cvv" placeholder="123" required>
            </div>
            <div class="form-group">
                <label for="card-name">Name on Card</label>
                <input type="text" id="card-name" placeholder="Your Name" required>
            </div>
            <div class="form-actions">
                <button type="button" class="cancel-btn">Cancel</button>
                <button type="submit" class="save-btn">Add Payment Method</button>
            </div>
        </form>
    `;

  document.getElementById("order-details-content").innerHTML = modalContent;
  const modal = document.getElementById("order-details-modal");
  modal.style.display = "flex";

  // Handle form submission
  document
    .getElementById("payment-method-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const cardType = document.getElementById("card-type").value;
      const cardNumber = document.getElementById("card-number").value;
      const cardExpiry = document.getElementById("card-expiry").value;
      const cardName = document.getElementById("card-name").value;

      // Basic validation
      if (!cardType || !cardNumber || !cardExpiry || !cardName) {
        showNotification("Please fill all fields", "error");
        return;
      }

      // Extract last 4 digits
      const last4 = cardNumber.slice(-4).replace(/\D/g, "");

      // Add to user's payment methods
      if (!currentUser.paymentMethods) {
        currentUser.paymentMethods = [];
      }

      currentUser.paymentMethods.push({
        type: cardType,
        last4: last4,
        expiry: cardExpiry,
        name: cardName,
      });

      sessionStorage.setItem("currentUser", JSON.stringify(currentUser));
      displayPaymentMethods(currentUser.paymentMethods);
      showNotification("Payment method added successfully!");
      modal.style.display = "none";
    });

  // Handle cancel button
  modal.querySelector(".cancel-btn").addEventListener("click", function () {
    modal.style.display = "none";
  });
}

let cartCount = 0;
const cartCountElement = document.getElementById("cart-count");

const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
cartCount = savedCart.reduce((total, item) => total + item.quantity, 0);
updateCartCount();

function updateCartCount() {
  if (cartCountElement) {
    cartCountElement.textContent = cartCount;
  }
}

// ===================== Dark Mode Toggle =====================
// Dark mode toggle functionality
const darkModeToggle = document.getElementById("dark-mode-toggle");

// Load saved dark mode preference
if (darkModeToggle) {
  const savedDarkMode = localStorage.getItem("darkMode") === "true";
  darkModeToggle.checked = savedDarkMode;
  document.body.classList.toggle("dark-mode", savedDarkMode);

  // Toggle dark mode when checkbox changes
  darkModeToggle.addEventListener("change", function () {
    const isDarkMode = this.checked;
    document.body.classList.toggle("dark-mode", isDarkMode);
    localStorage.setItem("darkMode", isDarkMode);

    // Update UI elements that need dark mode changes
    updateDarkModeElements(isDarkMode);
  });
}

function updateDarkModeElements(isDarkMode) {
  // Additional dark mode element updates if needed
  const sidebar = document.querySelector(".user-profile-sidebar");
  if (sidebar) {
    sidebar.classList.toggle("dark-mode", isDarkMode);
  }
}

// ===================== User Profile Sidebar =====================
const profileTrigger = document.querySelector(".user-profile-trigger");
const sidebar = document.querySelector(".user-profile-sidebar");
const overlay = document.createElement("div");
overlay.className = "sidebar-overlay";
document.body.appendChild(overlay);
const closeBtn = document.querySelector(".close-sidebar");
const logoutBtn = document.querySelector(".logout-btn");

// Track sidebar state
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

// Profile trigger click handler
if (profileTrigger) {
  profileTrigger.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    toggleSidebar(true);
  });
}

// Close button
if (closeBtn) {
  closeBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    toggleSidebar(false);
  });
}

// Overlay click
overlay.addEventListener("click", function () {
  toggleSidebar(false);
});

// Escape key
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && isSidebarOpen) {
    toggleSidebar(false);
  }
});

// Logout button
if (logoutBtn) {
  logoutBtn.addEventListener("click", function () {
    // Logout functionality
    alert("You have been logged out");
    toggleSidebar(false);

    window.location.href = "../login/Login.HTML";
  });
}

// Prevent clicks inside sidebar from closing it
if (sidebar) {
  sidebar.addEventListener("click", function (e) {
    e.stopPropagation();
  });
}
