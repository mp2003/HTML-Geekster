const ACCESS_KEY = "o8DHRoh8grX4dxx5Q-U5pERFaMsqugx-URmAZIY5yLQ";

async function fetchProductImage(query) {
  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${query}&client_id=${ACCESS_KEY}&per_page=1`
    );
    const data = await response.json();
    return data.results.length > 0
      ? data.results[0].urls.small
      : "https://via.placeholder.com/200";
  } catch (error) {
    console.error("Error fetching image:", error);
    return "https://via.placeholder.com/200";
  }
}

async function initializeProducts() {
  for (let product of Products) {
    product.image = await fetchProductImage(product.name);
  }
  renderProducts();
}

const Products = [
  {
    id: 1,
    name: "Smartphone",
    price: 699,
    description: "A high-performance smartphone with the latest features.",
  },
  {
    id: 2,
    name: "Laptop",
    price: 1200,
    description: "A powerful laptop for work, gaming, and entertainment.",
  },
  {
    id: 3,
    name: "Headphones",
    price: 199,
    description: "Noise-canceling headphones with high-quality sound.",
  },
  {
    id: 4,
    name: "Camera",
    price: 899,
    description: "A professional camera for stunning photography.",
  },
  {
    id: 5,
    name: "Smartwatch",
    price: 299,
    description: "A stylish smartwatch with health-tracking features.",
  },
  {
    id: 6,
    name: "Tablet",
    price: 499,
    description:
      "A lightweight tablet with a sharp display and long battery life.",
  },
  {
    id: 7,
    name: "Monitor",
    price: 299,
    description: "A 4K monitor with vibrant colors and smooth performance.",
  },
  {
    id: 8,
    name: "Keyboard",
    price: 99,
    description: "A mechanical keyboard with customizable RGB lighting.",
  },
  {
    id: 9,
    name: "Mouse",
    price: 49,
    description: "A precision gaming mouse with customizable buttons.",
  },
  {
    id: 10,
    name: "Printer",
    price: 199,
    description: "A fast and efficient printer for home and office use.",
  },
  {
    id: 11,
    name: "Speaker",
    price: 149,
    description: "A portable Bluetooth speaker with deep bass.",
  },
  {
    id: 12,
    name: "Drone",
    price: 799,
    description: "A high-tech drone with a 4K camera and long flight time.",
  },
  {
    id: 13,
    name: "Gaming Console",
    price: 499,
    description: "A next-gen gaming console for immersive experiences.",
  },
  {
    id: 14,
    name: "VR Headset",
    price: 399,
    description: "A virtual reality headset for gaming and entertainment.",
  },
  {
    id: 15,
    name: "Projector",
    price: 299,
    description: "A compact projector with full HD resolution.",
  },
  {
    id: 16,
    name: "External Hard Drive",
    price: 129,
    description: "A 2TB external hard drive for secure data storage.",
  },
  {
    id: 17,
    name: "USB Flash Drive",
    price: 19,
    description: "A 64GB USB flash drive for easy file transfers.",
  },
  {
    id: 18,
    name: "Router",
    price: 89,
    description: "A high-speed router for seamless internet connectivity.",
  },
  {
    id: 19,
    name: "Ethernet Cable",
    price: 9,
    description: "A durable ethernet cable for stable wired connections.",
  },
  {
    id: 20,
    name: "Webcam",
    price: 79,
    description: "A high-definition webcam for video calls and streaming.",
  },
];

initializeProducts();
let cart = {};

function renderProducts() {
  const productsContainer = document.getElementById("products-container");

  productsContainer.innerHTML = Products.map(
    (product) => `
                   <div class="product-card">
                     <img src="${product.image}" alt="${product.name}" class="product-image">
                     <div class="product-info">
                       <h3 class="product-title">${product.name}</h3>
                       <p>${product.description}</p>
                     </div>
                     <div class="product-footer">
                       <span>$${product.price}</span>
                       <button class="add-to-cart" onclick="addToCart(${product.id})">Add to cart</button>
                     </div>
                   </div>
                 `
  ).join("");
}

function renderCart() {
  const cartContainer = document.getElementById("cart-container");
  const itemsCount = document.getElementById("items-count");
  const totalPrice = document.getElementById("total-price");

  const cartItems = Object.values(cart);

  itemsCount.textContent = cartItems.length;

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  totalPrice.textContent = total;

  cartContainer.innerHTML = cartItems
    .map(
      (item) => `
                   <div class="cart-item">
                     <div class="item-info">
                       <img src="${item.image}" alt="${item.name}" class="item-image">
                       <div class="item-details">
                         <h3>${item.name}</h3>
                         <p>${item.description}</p>
                       </div>
                     </div>
                     <div style="display: flex; align-items: center;">
                       <div class="quantity-control">
                         <button class="quantity-btn" onclick="decreaseQuantity(${item.id})">▼</button>
                         <div class="quantity-number">${item.quantity}</div>
                         <button class="quantity-btn" onclick="increaseQuantity(${item.id})">▲</button>
                       </div>
                       <div class="price">$${item.price}</div>
                       <button class="remove-btn" onclick="removeFromCart(${item.id})">
                         <i class="fas fa-trash"></i>
                       </button>
                     </div>
                   </div>
                 `
    )
    .join("");
}

function addToCart(productId) {
  const product = Products.find((p) => p.id === productId);

  if (cart[productId]) {
    cart[productId].quantity += 1;
  } else {
    cart[productId] = { ...product, quantity: 1 };
  }

  renderCart();
}

function removeFromCart(productId) {
  delete cart[productId];
  renderCart();
}

function increaseQuantity(productId) {
  if (cart[productId]) {
    cart[productId].quantity += 1;
    renderCart();
  }
}

function decreaseQuantity(productId) {
  if (cart[productId]) {
    cart[productId].quantity -= 1;

    if (cart[productId].quantity === 0) {
      delete cart[productId];
    }

    renderCart();
  }
}

renderProducts();
renderCart();
