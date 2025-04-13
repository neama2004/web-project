document.addEventListener("DOMContentLoaded", function() {
  console.log("Profile page initialized");
  
  try {
      initDarkMode();
      initSidebar();
      initProfilePage();
      initModals();
      updateCartCount();
  } catch (error) {
      console.error("Initialization error:", error);
  }
});

/* ========== DARK MODE ========== */
function initDarkMode() {
  const darkModeToggle = document.getElementById("dark-mode-toggle");
  if (!darkModeToggle) {
      console.warn("Dark mode toggle not found");
      return;
  }

  try {
      const savedDarkMode = localStorage.getItem("darkMode") === "true";
      darkModeToggle.checked = savedDarkMode;
      document.body.classList.toggle("dark-mode", savedDarkMode);

      darkModeToggle.addEventListener("change", function() {
          const isDarkMode = this.checked;
          document.body.classList.toggle("dark-mode", isDarkMode);
          localStorage.setItem("darkMode", isDarkMode);
      });
  } catch (error) {
      console.error("Dark mode initialization failed:", error);
  }
}

/* ========== SIDEBAR ========== */
function initSidebar() {
  const sidebar = document.querySelector(".user-profile-sidebar");
  const overlay = document.querySelector(".sidebar-overlay");
  const profileTrigger = document.querySelector(".user-profile-trigger");
  const closeBtn = document.querySelector(".close-sidebar");
  const logoutBtn = document.querySelector(".logout-btn");

  if (!sidebar || !overlay || !profileTrigger || !closeBtn) {
      console.warn("Sidebar elements not found");
      return;
  }

  function toggleSidebar(show) {
      sidebar.classList.toggle("active", show);
      overlay.classList.toggle("active", show);
      document.body.style.overflow = show ? "hidden" : "";
  }

  profileTrigger.addEventListener("click", (e) => {
      e.preventDefault();
      toggleSidebar(true);
  });

  closeBtn.addEventListener("click", () => toggleSidebar(false));
  overlay.addEventListener("click", () => toggleSidebar(false));

  if (logoutBtn) {
      logoutBtn.addEventListener("click", handleLogout);
  }
}

function handleLogout() {
  try {
      sessionStorage.removeItem("currentUser");
      window.location.href = "../login/login.html";
  } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
  }
}

/* ========== USER PROFILE ========== */
function initProfilePage() {
  try {
      const currentUser = loadCurrentUser();
      populateUserData(currentUser);
  } catch (error) {
      console.error("Profile page initialization failed:", error);
  }
}

function loadCurrentUser() {
  try {
      const storedUser = sessionStorage.getItem("currentUser");
      const parsedUser = storedUser ? JSON.parse(storedUser) : {};
      
      return {
          name: parsedUser.name || "Guest User",
          email: parsedUser.email || "",
          phone: parsedUser.phone || "",
          dob: parsedUser.dob || "",
          address: parsedUser.address || "",
          joinDate: parsedUser.joinDate || new Date().toISOString(),
          allergies: Array.isArray(parsedUser.allergies) ? parsedUser.allergies : [],
          loyaltyPoints: Number(parsedUser.loyaltyPoints) || 0,
          paymentMethods: Array.isArray(parsedUser.paymentMethods) ? parsedUser.paymentMethods : []
      };
  } catch (error) {
      console.error("Error loading user data:", error);
      return getDefaultUser();
  }
}

function getDefaultUser() {
  return {
      name: "Guest User",
      email: "",
      phone: "",
      dob: "",
      address: "",
      joinDate: new Date().toISOString(),
      allergies: [],
      loyaltyPoints: 0,
      paymentMethods: []
  };
}

function populateUserData(user) {
  if (!user) {
      console.warn("No user data provided");
      user = getDefaultUser();
  }

  // Basic Info
  setTextContent("profile-name", user.name);
  setTextContent("user-fullname", user.name);
  setTextContent("user-email", user.email || "Not provided");
  setTextContent("user-phone", user.phone || "Not provided");
  setTextContent("user-address", user.address || "Not provided");
  setTextContent("user-dob", user.dob ? formatDate(user.dob) : "Not provided");
  setTextContent("join-date", formatDate(user.joinDate));

  // Statistics
  const orders = getOrderHistory(user.email);
  setTextContent("total-orders", orders.length);
  setTextContent("loyalty-points", user.loyaltyPoints || 0);
  setTextContent("allergies-count", user.allergies?.length || 0);

  // Display Sections
  displayAllergyTags(user.allergies || []);
  displayOrderHistory(orders);
  displayPaymentMethods(user.paymentMethods || []);
}

function setTextContent(elementId, value) {
  const element = document.getElementById(elementId);
  if (element) element.textContent = value;
}

function formatDate(dateString) {
  try {
      return new Date(dateString).toLocaleDateString();
  } catch {
      return "Unknown date";
  }
}

/* ========== MODALS ========== */
function initModals() {
  setupModalDismissals();
  setupModalTriggers();
}

function setupModalDismissals() {
  // Close modals when clicking outside
  document.querySelectorAll(".modal").forEach(modal => {
      modal.addEventListener("click", function(e) {
          if (e.target === this) {
              this.style.display = "none";
          }
      });
  });

  // Close buttons for all modals
  document.querySelectorAll(".close-modal").forEach(btn => {
      btn.addEventListener("click", function() {
          this.closest(".modal").style.display = "none";
      });
  });
}

function setupModalTriggers() {
  // Edit Profile
  document.getElementById("edit-personal-info")?.addEventListener("click", () => {
      showEditProfileModal(loadCurrentUser());
  });

  // Allergy Management
  document.getElementById("edit-allergies")?.addEventListener("click", (e) => {
      e.preventDefault();
      showAllergyManagementModal(loadCurrentUser());
  });

  // View All Orders
  document.getElementById("view-all-orders")?.addEventListener("click", (e) => {
      e.preventDefault();
      showAllOrdersModal(loadCurrentUser());
  });

  // Add Payment Method
  document.getElementById("add-payment-method")?.addEventListener("click", (e) => {
      e.preventDefault();
      showAddPaymentMethodModal(loadCurrentUser());
  });
}

/* ========== ORDER HISTORY ========== */
function getOrderHistory(userEmail) {
  try {
      const orders = JSON.parse(localStorage.getItem("orders")) || [];
      return userEmail ? orders.filter(order => order.userEmail === userEmail) : [];
  } catch {
      return [];
  }
}

function displayOrderHistory(orders = []) {
  const container = document.getElementById("order-history-container");
  if (!container) return;

  if (!orders.length) {
      container.innerHTML = `
          <div class="empty-orders">
              <i class="fas fa-shopping-cart"></i>
              <p>You haven't placed any orders yet</p>
              <a href="../products/products.html" class="btn">Start Shopping</a>
          </div>`;
      return;
  }

  container.innerHTML = orders
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 3)
      .map(createOrderCard)
      .join("");

  setupOrderActionHandlers();
}

function createOrderCard(order) {
  const orderDate = order.date ? new Date(order.date).toLocaleDateString() : "Unknown date";
  
  return `
      <div class="order-card">
          <div class="order-header">
              <div class="order-id">Order #${order.id || "N/A"}</div>
              <div class="order-date">${orderDate}</div>
              <div class="order-status ${order.status || "unknown"}">
                  ${(order.status || "Unknown").charAt(0).toUpperCase() + (order.status || "").slice(1)}
              </div>
              <div class="order-total">$${(order.total || 0).toFixed(2)}</div>
          </div>
          <div class="order-details">
              <div class="order-items">
                  ${(order.items || []).slice(0, 2).map(createOrderItem).join("")}
                  ${order.items?.length > 2 ? `<p>+ ${order.items.length - 2} more items</p>` : ""}
              </div>
              <div class="order-actions">
                  <button class="order-action-btn reorder" data-order-id="${order.id}">Reorder</button>
                  ${["processing", "shipped"].includes(order.status) ? 
                      `<button class="order-action-btn track" data-order-id="${order.id}">Track</button>` : ""}
                  <button class="order-action-btn details" data-order-id="${order.id}">Details</button>
              </div>
          </div>
      </div>`;
}

function createOrderItem(item) {
  return `
      <div class="order-item">
          <img src="../../images/products/${item.image || "default-product.jpg"}" 
               alt="${item.name || "Product"}" 
               onerror="this.src='../../images/products/default-product.jpg'">
          <div class="item-details">
              <h4>${item.name || "Unknown Product"}</h4>
              <p>Qty: ${item.quantity || 1} × $${(item.price || 0).toFixed(2)}</p>
          </div>
      </div>`;
}

function setupOrderActionHandlers() {
  document.querySelectorAll(".order-action-btn").forEach(button => {
      button.addEventListener("click", function() {
          const orderId = this.dataset.orderId;
          const action = this.classList.contains("reorder") ? "reorder" : 
                        this.classList.contains("track") ? "track" : "details";
          handleOrderAction(orderId, action);
      });
  });
}

function handleOrderAction(orderId, action) {
  const orders = getOrderHistory();
  const order = orders.find(o => o.id === orderId);

  if (!order) {
      showNotification("Order not found", "error");
      return;
  }

  switch(action) {
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

function reorderItems(order) {
  try {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      let addedCount = 0;

      (order.items || []).forEach(item => {
          const existingItem = cart.find(ci => ci.id === item.id);
          if (existingItem) {
              existingItem.quantity += item.quantity || 1;
          } else {
              cart.push({
                  id: item.id,
                  name: item.name,
                  price: item.price,
                  quantity: item.quantity || 1,
                  image: item.image
              });
          }
          addedCount++;
      });

      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCount();
      showNotification(`${addedCount} items added to your cart!`);
  } catch (error) {
      console.error("Reorder failed:", error);
      showNotification("Failed to add items to cart", "error");
  }
}

function trackOrder(order) {
  const statusMessages = {
      processing: "Your order is being prepared",
      shipped: `Shipped on ${order.shippingDate ? new Date(order.shippingDate).toLocaleDateString() : "unknown date"}`,
      delivered: `Delivered on ${order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : "unknown date"}`,
      cancelled: "This order has been cancelled"
  };

  showNotification(`Order #${order.id || "N/A"}: ${statusMessages[order.status] || "Status unknown"}`);
}

function showOrderDetails(order) {
  const modalContent = document.getElementById("order-details-content");
  if (!modalContent) return;

  const orderDate = order.date ? new Date(order.date).toLocaleDateString() : "Unknown date";
  
  modalContent.innerHTML = `
      <h3>Order #${order.id || "N/A"}</h3>
      <div class="order-detail-info">
          <p><strong>Date:</strong> ${orderDate}</p>
          <p><strong>Status:</strong> <span class="order-status ${order.status || "unknown"}">
              ${(order.status || "Unknown").charAt(0).toUpperCase() + (order.status || "").slice(1)}
          </span></p>
          <p><strong>Total:</strong> $${(order.total || 0).toFixed(2)}</p>
          ${order.shippingAddress ? `<p><strong>Shipping Address:</strong> ${order.shippingAddress}</p>` : ""}
      </div>
      <div class="order-detail-items">
          <h4>Items (${order.items?.length || 0})</h4>
          ${(order.items || []).map(item => `
              <div class="order-detail-item">
                  <img src="../../images/products/${item.image || "default-product.jpg"}" 
                       alt="${item.name || "Product"}" 
                       onerror="this.src='../../images/products/default-product.jpg'">
                  <div>
                      <h4>${item.name || "Unknown Product"}</h4>
                      <p>Quantity: ${item.quantity || 1}</p>
                      <p>Price: $${(item.price || 0).toFixed(2)} each</p>
                      <p>Subtotal: $${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</p>
                  </div>
              </div>
          `).join("")}
      </div>`;

  document.getElementById("order-details-modal").style.display = "flex";
}

/* ========== ALLERGY MANAGEMENT ========== */
function displayAllergyTags(allergies = []) {
  const container = document.getElementById("allergy-tags-container");
  if (!container) return;

  if (!allergies.length) {
      container.innerHTML = "<p>No allergies specified</p>";
      return;
  }

  container.innerHTML = allergies.map(allergy => `
      <span class="allergy-tag ${(allergy || "").toLowerCase().replace(" ", "-")}">
          ${allergy || "Unknown"}
      </span>
  `).join("");
}

function showAllergyManagementModal(user) {
  const modal = document.getElementById("allergy-modal");
  const content = document.getElementById("allergy-modal-content");
  if (!modal || !content) return;
  
  content.innerHTML = `
      <h2>Manage Allergy Profile</h2>
      <form id="allergy-form">
          <div class="checkbox-group">
              ${['Gluten', 'Dairy', 'Nuts', 'Peanuts', 'Soy', 'Eggs', 'Fish', 'Shellfish'].map(allergy => `
                  <label>
                      <input type="checkbox" name="${allergy.toLowerCase()}" 
                            ${(user.allergies || []).includes(allergy) ? "checked" : ""}>
                      ${allergy}
                  </label>
              `).join("")}
          </div>
          <div class="form-actions">
              <button type="button" class="cancel-btn">Cancel</button>
              <button type="submit" class="save-btn">Save Changes</button>
          </div>
      </form>`;

  modal.style.display = "flex";

  document.getElementById("allergy-form").addEventListener("submit", function(e) {
      e.preventDefault();
      const checkboxes = this.querySelectorAll("input[type='checkbox']:checked");
      const selectedAllergies = Array.from(checkboxes).map(cb => 
          cb.name.charAt(0).toUpperCase() + cb.name.slice(1));
      
      // Update user data
      const updatedUser = {
          ...user,
          allergies: selectedAllergies
      };
      sessionStorage.setItem("currentUser", JSON.stringify(updatedUser));
      
      // Update UI
      document.getElementById("allergies-count").textContent = selectedAllergies.length;
      displayAllergyTags(selectedAllergies);
      showNotification("Allergy profile updated successfully!");
      modal.style.display = "none";
  });

  modal.querySelector(".cancel-btn").addEventListener("click", function() {
      modal.style.display = "none";
  });
}

/* ========== PAYMENT METHODS ========== */
function displayPaymentMethods(paymentMethods = []) {
  const container = document.getElementById("payment-methods-container");
  if (!container) return;

  if (!paymentMethods.length) {
      container.innerHTML = "<p>No saved payment methods</p>";
      return;
  }

  container.innerHTML = paymentMethods.map(method => `
      <div class="payment-card">
          <div class="payment-card-icon">
              <i class="fab ${getPaymentIconClass(method.type)}"></i>
          </div>
          <div class="payment-card-details">
              <div class="card-type">${(method.type || "").toUpperCase()}</div>
              <div class="card-number">•••• •••• •••• ${method.last4 || "****"}</div>
              <div class="card-expiry">Expires ${method.expiry || "••/••"}</div>
          </div>
          <div class="payment-card-actions">
              <button class="payment-action-btn edit"><i class="fas fa-pencil-alt"></i></button>
              <button class="payment-action-btn remove"><i class="fas fa-trash"></i></button>
          </div>
      </div>
  `).join("");

  // Add event listeners to payment action buttons
  document.querySelectorAll(".payment-action-btn.remove").forEach(button => {
      button.addEventListener("click", function() {
          if (confirm("Are you sure you want to remove this payment method?")) {
              this.closest(".payment-card").remove();
              showNotification("Payment method removed");
          }
      });
  });

  document.querySelectorAll(".payment-action-btn.edit").forEach(button => {
      button.addEventListener("click", function() {
          showNotification("Edit payment method functionality coming soon");
      });
  });
}

function showAddPaymentMethodModal(user) {
  const modal = document.getElementById("payment-modal");
  const content = document.getElementById("payment-modal-content");
  if (!modal || !content) return;
  
  content.innerHTML = `
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
              <label for="card-name">Name on Card</label>
              <input type="text" id="card-name" placeholder="Your Name" required>
          </div>
          <div class="form-actions">
              <button type="button" class="cancel-btn">Cancel</button>
              <button type="submit" class="save-btn">Add Payment Method</button>
          </div>
      </form>`;

  modal.style.display = "flex";

  document.getElementById("payment-method-form").addEventListener("submit", function(e) {
      e.preventDefault();
      
      const cardType = document.getElementById("card-type").value;
      const cardNumber = document.getElementById("card-number").value;
      const cardExpiry = document.getElementById("card-expiry").value;
      const cardName = document.getElementById("card-name").value;

      if (!cardType || !cardNumber || !cardExpiry || !cardName) {
          showNotification("Please fill all fields", "error");
          return;
      }

      // Add to user's payment methods
      const updatedUser = {
          ...user,
          paymentMethods: [
              ...(user.paymentMethods || []),
              {
                  type: cardType,
                  last4: cardNumber.slice(-4).replace(/\D/g, ""),
                  expiry: cardExpiry,
                  name: cardName
              }
          ]
      };

      sessionStorage.setItem("currentUser", JSON.stringify(updatedUser));
      displayPaymentMethods(updatedUser.paymentMethods);
      showNotification("Payment method added successfully!");
      modal.style.display = "none";
  });

  modal.querySelector(".cancel-btn").addEventListener("click", function() {
      modal.style.display = "none";
  });
}

function getPaymentIconClass(paymentType) {
  if (!paymentType) return "fa-credit-card";
  
  const type = paymentType.toLowerCase();
  if (type.includes("visa")) return "fa-cc-visa";
  if (type.includes("mastercard")) return "fa-cc-mastercard";
  if (type.includes("amex")) return "fa-cc-amex";
  if (type.includes("discover")) return "fa-cc-discover";
  return "fa-credit-card";
}

/* ========== EDIT PROFILE ========== */
function showEditProfileModal(user) {
  const modal = document.getElementById("edit-profile-modal");
  if (!modal) return;

  // Populate form with current data
  document.getElementById("edit-name").value = user.name || "";
  document.getElementById("edit-email").value = user.email || "";
  document.getElementById("edit-phone").value = user.phone || "";
  document.getElementById("edit-dob").value = user.dob || "";
  document.getElementById("edit-address").value = user.address || "";

  modal.style.display = "flex";

  // Handle form submission
  document.getElementById("profile-edit-form").addEventListener("submit", function(e) {
      e.preventDefault();

      // Update user data
      const updatedUser = {
          ...user,
          name: document.getElementById("edit-name").value,
          email: document.getElementById("edit-email").value,
          phone: document.getElementById("edit-phone").value,
          dob: document.getElementById("edit-dob").value,
          address: document.getElementById("edit-address").value
      };

      // Save and update UI
      sessionStorage.setItem("currentUser", JSON.stringify(updatedUser));
      populateUserData(updatedUser);
      showNotification("Profile updated successfully!");
      modal.style.display = "none";
  });
}

/* ========== UTILITIES ========== */
function showNotification(message, type = "success") {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.innerHTML = `<p>${message}</p>`;
  document.body.appendChild(notification);

  setTimeout(() => {
      notification.classList.add("fade-out");
      setTimeout(() => notification.remove(), 500);
  }, 3000);
}

function updateCartCount() {
  try {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const count = cart.reduce((total, item) => total + (item.quantity || 0), 0);
      const cartCountElement = document.getElementById("cart-count");
      if (cartCountElement) {
          cartCountElement.textContent = count;
      }
  } catch (error) {
      console.error("Error updating cart count:", error);
  }
}