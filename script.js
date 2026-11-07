const defaultProducts = [
  {
    id: 1,
    name: "Classic Burger",
    price: 250,
    category: "burger",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700"
  },
  {
    id: 2,
    name: "Cheese Burger",
    price: 300,
    category: "burger",
    image: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=700"
  },
  {
    id: 3,
    name: "Pepperoni Pizza",
    price: 550,
    category: "pizza",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=700"
  },
  {
    id: 4,
    name: "French Fries",
    price: 150,
    category: "snack",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=700"
  },
  {
    id: 5,
    name: "Chicken Burger",
    price: 280,
    category: "burger",
    image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=700"
  },
  {
    id: 6,
    name: "Fresh Drink",
    price: 100,
    category: "drink",
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=700"
  }
];

let products = JSON.parse(localStorage.getItem("bilalProducts")) || defaultProducts;
let cart = [];

function saveProducts() {
  localStorage.setItem("bilalProducts", JSON.stringify(products));
}

function safeText(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function renderProducts(list = products) {
  const container = document.getElementById("products");

  container.innerHTML = list.map(product => `
    <div class="product">
      <img src="${safeText(product.image)}" alt="${safeText(product.name)}">
      <div class="product-info">
        <h3>${safeText(product.name)}</h3>
        <p>${Number(product.price)} сом</p>
        <button onclick="addToCart(${Number(product.id)})">
          Добавить в корзину +
        </button>
      </div>
    </div>
  `).join("");
}

function filterMenu(category, button) {
  document.querySelectorAll(".categories button")
    .forEach(btn => btn.classList.remove("active"));

  button.classList.add("active");

  if (category === "all") {
    renderProducts();
  } else {
    renderProducts(products.filter(p => p.category === category));
  }
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  cart.push(product);
  document.getElementById("cart-count").textContent = cart.length;
}

function showCart() {
  const modal = document.getElementById("cart-modal");
  const items = document.getElementById("cart-items");

  items.innerHTML = cart.length
    ? cart.map((item, index) => `
      <div class="cart-row">
        <span>${safeText(item.name)} — ${item.price} сом</span>
        <button onclick="removeFromCart(${index})">Удалить</button>
      </div>
    `).join("")
    : "<p>Корзина пока пустая.</p>";

  const total = cart.reduce((sum, item) => sum + Number(item.price), 0);
  document.getElementById("total").textContent = `Итого: ${total} сом`;

  modal.style.display = "flex";
}

function removeFromCart(index) {
  cart.splice(index, 1);
  showCart();
  document.getElementById("cart-count").textContent = cart.length;
}

function closeCart() {
  document.getElementById("cart-modal").style.display = "none";
}

function checkout() {
  if (!cart.length) {
    alert("Сначала добавь блюда в корзину!");
    return;
  }

  alert("Это демонстрационная корзина. Для настоящих заказов нужно подключить сервер или WhatsApp.");
}

function adminLogin() {
  const password = prompt("Введите пароль владельца:");

  // Только демонстрационный пароль!
  if (password === "1234") {
    document.getElementById("admin-modal").style.display = "flex";
    renderAdmin();
  } else if (password !== null) {
    alert("Неверный пароль!");
  }
}

function closeAdmin() {
  document.getElementById("admin-modal").style.display = "none";
}

function addProduct() {
  const name = document.getElementById("admin-name").value.trim();
  const price = Number(document.getElementById("admin-price").value);
  const image = document.getElementById("admin-image").value.trim();
  const category = document.getElementById("admin-category").value;

  if (!name || !Number.isFinite(price) || price <= 0 || !image) {
    alert("Заполни все поля правильно!");
    return;
  }

  if (!/^https:\/\//i.test(image)) {
    alert("Используй ссылку на изображение, начинающуюся с https://");
    return;
  }

  products.push({
    id: Date.now(),
    name,
    price,
    image,
    category
  });

  saveProducts();
  renderProducts();
  renderAdmin();

  document.getElementById("admin-name").value = "";
  document.getElementById("admin-price").value = "";
  document.getElementById("admin-image").value = "";

  alert("Блюдо добавлено!");
}

function deleteProduct(id) {
  products = products.filter(p => p.id !== id);
  saveProducts();
  renderProducts();
  renderAdmin();
}

function renderAdmin() {
  const container = document.getElementById("admin-products");

  container.innerHTML = products.map(product => `
    <div class="admin-row">
      <span>${safeText(product.name)} — ${product.price} сом</span>
      <button onclick="deleteProduct(${Number(product.id)})">Удалить</button>
    </div>
  `).join("");
}

renderProducts();