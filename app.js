const MENU = [
  {
    "id": "ceviche-pescado",
    "name": "Ceviche de Pescado",
    "category": "Fish",
    "price": 2100,
    "image": "ceviche-drink.jpg",
    "desc": "Fish ceviche."
  },
  {
    "id": "lomo-saltado",
    "name": "Lomo Saltado",
    "category": "Meats",
    "price": 2350,
    "image": "lomo-saltado.jpg",
    "desc": "Peruvian beef stir-fry with fries."
  },
  {
    "id": "tacu-tacu-lomo",
    "name": "Tacu Tacu con Lomo al Jugo",
    "category": "Meats",
    "price": 2500,
    "image": "lomo-saltado.jpg",
    "desc": "Tacu tacu served with beef and sauce."
  },
  {
    "id": "bistek-pobre",
    "name": "Bistek a lo Pobre",
    "category": "Meats",
    "price": 2950,
    "image": "lomo-saltado.jpg",
    "desc": "Steak plate from the house menu."
  },
  {
    "id": "aji-gallina",
    "name": "Ají de Gallina",
    "category": "Chicken",
    "price": 1550,
    "image": "menu-texture.jpg",
    "desc": "Peruvian chicken dish."
  },
  {
    "id": "pollo-broster",
    "name": "Pollo Broster",
    "category": "Chicken",
    "price": 1870,
    "image": "appetizer-platter.jpg",
    "desc": "Crispy broaster-style chicken."
  },
  {
    "id": "ensalada-casa",
    "name": "Ensalada de la Casa",
    "category": "Sides",
    "price": 900,
    "image": "appetizer-platter.jpg",
    "desc": "House salad from the Latin Soul menu."
  },
  {
    "id": "salchipapa",
    "name": "Salchipapa",
    "category": "Sides",
    "price": 1050,
    "image": "appetizer-platter.jpg",
    "desc": "Crispy fries and savory bites."
  },
  {
    "id": "papas-fritas",
    "name": "Papas Fritas",
    "category": "Sides",
    "price": 700,
    "image": "empanadas.jpg",
    "desc": "Classic fries."
  },
  {
    "id": "empanadas-carne",
    "name": "Empanadas de Carne al Horno",
    "category": "Empanadas",
    "price": 900,
    "image": "empanadas.jpg",
    "desc": "Baked beef empanadas."
  },
  {
    "id": "coca-cola",
    "name": "Coca-Cola",
    "category": "Drinks",
    "price": 450,
    "image": "ceviche-drink.jpg",
    "desc": "Non-alcoholic beverage."
  },
  {
    "id": "sprite",
    "name": "Sprite",
    "category": "Drinks",
    "price": 450,
    "image": "ceviche-drink.jpg",
    "desc": "Non-alcoholic beverage."
  },
  {
    "id": "jugo-naranja",
    "name": "Jugo de Naranja",
    "category": "Drinks",
    "price": 450,
    "image": "ceviche-drink.jpg",
    "desc": "Orange juice."
  },
  {
    "id": "jugo-mango",
    "name": "Jugo de Mango",
    "category": "Drinks",
    "price": 450,
    "image": "ceviche-drink.jpg",
    "desc": "Mango juice."
  },
  {
    "id": "inca-kola",
    "name": "Inca Kola",
    "category": "Drinks",
    "price": 600,
    "image": "ceviche-drink.jpg",
    "desc": "Peruvian soda."
  },
  {
    "id": "chicha-morada",
    "name": "Chicha Morada",
    "category": "Drinks",
    "price": 600,
    "image": "ceviche-drink.jpg",
    "desc": "Traditional purple corn drink."
  }
];
const GOOGLE_SHEETS_ENDPOINT = "https://script.google.com/macros/s/AKfycbzmePYO1e25PcZx3EF3XxPjx8XHyz6FXm1V-KWw91SvLIKFFMRWnZlHxoD_yuphj4q8/exec";

let cart = {};
let pendingOrder = null;
let currentCategory = "All";

const yen = (n) => "¥" + Number(n).toLocaleString();
const ordersKey = "latinSoulOrders";

const el = (id) => document.getElementById(id);

function getOrders() {
  return JSON.parse(localStorage.getItem(ordersKey) || "[]");
}

function saveOrders(orders) {
  localStorage.setItem(ordersKey, JSON.stringify(orders));
}

function todayStamp() {
  const d = new Date();
  return d.getFullYear() + String(d.getMonth() + 1).padStart(2, "0") + String(d.getDate()).padStart(2, "0");
}

function nextOrderId() {
  const date = todayStamp();
  const count = getOrders().filter((order) => order.id.includes(date)).length + 1;
  return "LS-" + date + "-" + String(count).padStart(3, "0");
}

function toast(message) {
  const box = el("toast");
  box.textContent = message;
  box.style.display = "block";
  setTimeout(() => box.style.display = "none", 2800);
}

function renderTabs() {
  const categories = ["All", "Fish", "Meats", "Chicken", "Sides", "Empanadas", "Drinks"];
  el("tabs").innerHTML = categories.map((cat) => (
    `<button type="button" class="tab ${cat === currentCategory ? "active" : ""}" data-category="${cat}">${cat}</button>`
  )).join("");
}

function renderMenu() {
  const items = currentCategory === "All"
    ? MENU
    : MENU.filter((item) => item.category === currentCategory);

  el("menuGrid").innerHTML = items.map((item) => `
    <article class="menu-card">
      <img class="food-img" src="${item.image}" alt="${item.name}">
      <div class="card-body">
        <h3>${item.name}</h3>
        <p>${item.desc}</p>
        <div class="price-row">
          <span class="price">${yen(item.price)}</span>
          <button type="button" class="add-btn" data-id="${item.id}">Add</button>
        </div>
      </div>
    </article>
  `).join("");
}

function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  renderCart();
  openCart();
  toast("Added to order");
}

function updateQty(id, change) {
  cart[id] = (cart[id] || 0) + change;
  if (cart[id] <= 0) {
    delete cart[id];
  }
  renderCart();
}

function cartTotal() {
  return Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = MENU.find((menuItem) => menuItem.id === id);
    return sum + item.price * qty;
  }, 0);
}

function renderCart() {
  const entries = Object.entries(cart);
  const cartItems = el("cartItems");

  if (!entries.length) {
    cartItems.innerHTML = "<p>Your cart is empty.</p>";
  } else {
    cartItems.innerHTML = entries.map(([id, qty]) => {
      const item = MENU.find((menuItem) => menuItem.id === id);
      return `
        <div class="cart-line">
          <div>
            <strong>${item.name}</strong><br>
            <span>${yen(item.price)} each</span>
          </div>
          <div class="qty">
            <button type="button" class="qty-btn" data-id="${id}" data-change="-1">−</button>
            <strong>${qty}</strong>
            <button type="button" class="qty-btn" data-id="${id}" data-change="1">+</button>
          </div>
        </div>
      `;
    }).join("");
  }

  const total = cartTotal();
  const count = entries.reduce((sum, [, qty]) => sum + qty, 0);
  el("cartTotal").textContent = yen(total);
  el("floatingTotal").textContent = yen(total);
  el("cartCount").textContent = count;
}

function openCart() {
  el("cartPanel").classList.add("open");
  el("cartPanel").setAttribute("aria-hidden", "false");
}

function closeCart() {
  el("cartPanel").classList.remove("open");
  el("cartPanel").setAttribute("aria-hidden", "true");
}

function updateContactHelp() {
  const method = el("contactMethod").value;
  const input = el("contactInfo");
  const help = el("contactHelp");

  if (method === "LINE") {
    input.placeholder = "LINE ID";
    help.textContent = "Enter your LINE ID so the restaurant can message you.";
  } else if (method === "WhatsApp") {
    input.placeholder = "+81 90-1234-5678";
    help.textContent = "Enter your WhatsApp number with country code if possible.";
  } else if (method === "Email") {
    input.placeholder = "name@example.com";
    help.textContent = "Enter your email address for order updates.";
  } else {
    input.placeholder = "Phone number";
    help.textContent = "Enter the best phone number for order updates.";
  }
}

function buildOrderFromForm(form) {
  const data = Object.fromEntries(new FormData(form).entries());
  const items = Object.entries(cart).map(([id, qty]) => {
    const item = MENU.find((menuItem) => menuItem.id === id);
    return {
      name: item.name,
      qty: Number(qty),
      price: item.price
    };
  });

  return {
    id: nextOrderId(),
    createdAt: new Date().toISOString(),
    status: "New",
    total: cartTotal(),
    customer: data,
    items
  };
}

function showReview(order) {
  const itemLines = order.items.map((item) => `
    <div class="review-line">
      <span>${item.qty} × ${item.name}</span>
      <strong>${yen(item.price * item.qty)}</strong>
    </div>
  `).join("");

  el("reviewContent").innerHTML = `
    <div class="review-section">
      <h3>Items</h3>
      ${itemLines}
      <div class="review-total"><span>Total</span><strong>${yen(order.total)}</strong></div>
    </div>

    <div class="review-section">
      <h3>Customer</h3>
      <p><strong>Name:</strong> ${order.customer.name}</p>
      <p><strong>Phone:</strong> ${order.customer.phone}</p>
      <p><strong>Preferred Contact:</strong> ${order.customer.contactMethod}</p>
      <p><strong>Contact Info:</strong> ${order.customer.contactInfo}</p>
      <p><strong>Pickup:</strong> ${order.customer.pickup}</p>
      <p><strong>Payment:</strong> ${order.customer.payment}</p>
    </div>
  `;

  el("reviewModal").classList.add("open");
  el("reviewModal").setAttribute("aria-hidden", "false");
}

function closeReview() {
  el("reviewModal").classList.remove("open");
  el("reviewModal").setAttribute("aria-hidden", "true");
}

async function submitOrderToGoogleSheets(order) {
  const payload = {
    orderId: order.id,
    customerName: order.customer.name,
    phone: order.customer.phone,
    contactMethod: order.customer.contactMethod,
    contactInfo: order.customer.contactInfo,
    line: order.customer.contactMethod === "LINE" ? order.customer.contactInfo : "",
    whatsapp: order.customer.contactMethod === "WhatsApp" ? order.customer.contactInfo : "",
    pickupTime: order.customer.pickup,
    payment: order.customer.payment,
    items: order.items.map((item) => item.qty + " x " + item.name).join("; "),
    total: order.total,
    status: order.status,
    notes: "Preferred Contact: " + order.customer.contactMethod
  };

  await fetch(GOOGLE_SHEETS_ENDPOINT, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload)
  });
}

async function finalizeOrder() {
  if (!pendingOrder) {
    toast("No order ready to submit");
    return;
  }

  const button = el("finalSubmitBtn");
  button.disabled = true;
  button.textContent = "Submitting...";

  const orders = getOrders();
  orders.push(pendingOrder);
  saveOrders(orders);

  try {
    await submitOrderToGoogleSheets(pendingOrder);
    toast("Order submitted. Check Google Sheet and email.");
  } catch (error) {
    console.error(error);
    toast("Order saved locally. Sheet may not have received it.");
  }

  cart = {};
  renderCart();
  el("checkoutForm").reset();
  updateContactHelp();
  closeCart();
  closeReview();

  el("lookupInput").value = pendingOrder.id;
  lookupOrder();
  location.hash = "track";

  pendingOrder = null;
  button.disabled = false;
  button.textContent = "Submit Final Order";
}

function lookupOrder() {
  const id = el("lookupInput").value.trim().toUpperCase();
  const result = el("lookupResult");
  const order = getOrders().find((savedOrder) => savedOrder.id === id);

  if (!order) {
    result.innerHTML = "<p>No order found on this test device.</p>";
    return;
  }

  const listItems = order.items.map((item) => `<li>${item.qty} × ${item.name}</li>`).join("");
  const cancelButton = order.status === "New"
    ? `<button type="button" class="secondary-btn" id="cancelLookupOrder" data-id="${order.id}">Cancel Order</button>`
    : "<p>Changes are disabled once preparing.</p>";

  result.innerHTML = `
    <div class="order-result">
      <h3>${order.id}</h3>
      <p><span class="status-pill">${order.status}</span></p>
      <p><strong>Pickup:</strong> ${order.customer.pickup}</p>
      <p><strong>Total:</strong> ${yen(order.total)}</p>
      <ul>${listItems}</ul>
      ${cancelButton}
    </div>
  `;
}

function cancelOrder(id) {
  const orders = getOrders();
  const order = orders.find((savedOrder) => savedOrder.id === id);

  if (order && order.status === "New") {
    order.status = "Cancelled";
    saveOrders(orders);
    lookupOrder();
    toast("Order cancelled locally");
  }
}

function setupEvents() {
  document.body.addEventListener("click", (event) => {
    const tab = event.target.closest(".tab");
    if (tab) {
      currentCategory = tab.dataset.category;
      renderTabs();
      renderMenu();
      return;
    }

    const addButton = event.target.closest(".add-btn");
    if (addButton) {
      addToCart(addButton.dataset.id);
      return;
    }

    const qtyButton = event.target.closest(".qty-btn");
    if (qtyButton) {
      updateQty(qtyButton.dataset.id, Number(qtyButton.dataset.change));
      return;
    }

    const cancelButton = event.target.closest("#cancelLookupOrder");
    if (cancelButton) {
      cancelOrder(cancelButton.dataset.id);
      return;
    }
  });

  el("openCart").addEventListener("click", openCart);
  el("closeCart").addEventListener("click", closeCart);
  el("contactMethod").addEventListener("change", updateContactHelp);
  el("lookupBtn").addEventListener("click", lookupOrder);
  el("closeReview").addEventListener("click", closeReview);
  el("editOrderBtn").addEventListener("click", () => {
    closeReview();
    openCart();
  });
  el("finalSubmitBtn").addEventListener("click", finalizeOrder);

  el("checkoutForm").addEventListener("submit", (event) => {
    event.preventDefault();

    if (!Object.keys(cart).length) {
      toast("Add items first");
      return;
    }

    pendingOrder = buildOrderFromForm(event.target);
    showReview(pendingOrder);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderTabs();
  renderMenu();
  renderCart();
  updateContactHelp();
  setupEvents();
});
