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

const generateRandomPrice = () => {
  return (Math.random() * 10 + 2).toFixed(2);
};

const menuData = {
  burgers: [
    {
      id: "b1",
      name: "Whopper",
      description:
        "Our signature flame-grilled beef patty with juicy tomatoes, fresh lettuce, mayo, ketchup, pickles, and onions on a sesame seed bun.",
      price: generateRandomPrice(),
      imageQuery: "burger king whopper",
    },
    {
      id: "b2",
      name: "Double Cheeseburger",
      description:
        "Two flame-grilled patties with American cheese, pickles, mustard and ketchup on a toasted sesame seed bun.",
      price: generateRandomPrice(),
      imageQuery: "double cheeseburger",
    },
    {
      id: "b3",
      name: "Bacon King",
      description:
        "Two savory flame-grilled beef patties, topped with thick-cut bacon, American cheese, ketchup and mayo on a sesame seed bun.",
      price: generateRandomPrice(),
      imageQuery: "bacon king burger",
    },
    {
      id: "b4",
      name: "Chicken Royale",
      description:
        "Crispy chicken fillet topped with lettuce and creamy mayo on a toasted sesame seed bun.",
      price: generateRandomPrice(),
      imageQuery: "chicken burger",
    },
  ],
  sides: [
    {
      id: "s1",
      name: "French Fries",
      description:
        "Golden, crispy, and thickly cut French fries with just the right amount of salt.",
      price: generateRandomPrice(),
      imageQuery: "french fries",
    },
    {
      id: "s2",
      name: "Onion Rings",
      description:
        "Golden-fried onion rings that are crispy on the outside and sweet on the inside.",
      price: generateRandomPrice(),
      imageQuery: "onion rings",
    },
    {
      id: "s3",
      name: "Chicken Nuggets",
      description:
        "Made with white meat, our bite-sized chicken nuggets are tender and juicy on the inside and crispy on the outside.",
      price: generateRandomPrice(),
      imageQuery: "chicken nuggets",
    },
  ],
  beverages: [
    {
      id: "d1",
      name: "Coca-Cola",
      description: "The perfect refreshing companion to your meal.",
      price: generateRandomPrice(),
      imageQuery: "coca cola",
    },
    {
      id: "d2",
      name: "Chocolate Shake",
      description: "Cool down with our creamy, chilled chocolate milkshake.",
      price: generateRandomPrice(),
      imageQuery: "chocolate milkshake",
    },
    {
      id: "d3",
      name: "Orange Juice",
      description: "Refreshing 100% pure orange juice to complement your meal.",
      price: generateRandomPrice(),
      imageQuery: "orange juice",
    },
  ],
};

let cart = [];
let orderNumber = null;

const menuPage = document.getElementById("menuPage");
const confirmationPage = document.getElementById("confirmationPage");
const burgerItemsContainer = document.getElementById("burgerItems");
const sidesItemsContainer = document.getElementById("sidesItems");
const beverageItemsContainer = document.getElementById("beverageItems");
const cartItemsContainer = document.getElementById("cartItems");
const cartTotalElement = document.getElementById("cartTotal");
const proceedBtn = document.getElementById("proceedBtn");
const orderIdElement = document.getElementById("orderId");
const preparationAnimation = document.getElementById("preparationAnimation");
const orderReady = document.getElementById("orderReady");
const orderItemsContainer = document.getElementById("orderItems");
const orderTotalElement = document.getElementById("orderTotal");
const orderImagesContainer = document.getElementById("orderImages");
const backToMenuBtn = document.getElementById("backToMenuBtn");

const renderMenuItems = async () => {
  for (const burger of menuData.burgers) {
    burger.image = await fetchProductImage(burger.imageQuery);
    const burgerElement = createFoodItemElement(burger);
    burgerItemsContainer.appendChild(burgerElement);
  }
  for (const side of menuData.sides) {
    side.image = await fetchProductImage(side.imageQuery);
    const sideElement = createFoodItemElement(side);
    sidesItemsContainer.appendChild(sideElement);
  }
  for (const beverage of menuData.beverages) {
    beverage.image = await fetchProductImage(beverage.imageQuery);
    const beverageElement = createFoodItemElement(beverage);
    beverageItemsContainer.appendChild(beverageElement);
  }
};

const createFoodItemElement = (item) => {
  const itemElement = document.createElement("div");
  itemElement.className = "food-item";
  itemElement.dataset.id = item.id;
  itemElement.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="food-image">
        <div class="food-info">
          <div class="food-name">${item.name}</div>
          <div class="food-description">${item.description}</div>
          <div class="food-price">$${item.price}</div>
          <button class="add-to-cart">Add to Cart</button>
        </div>
      `;
  const addButton = itemElement.querySelector(".add-to-cart");
  addButton.addEventListener("click", () => {
    addToCart(item);
    itemElement.classList.add("item-added");
    setTimeout(() => {
      itemElement.classList.remove("item-added");
    }, 1000);
  });
  return itemElement;
};

const addToCart = (item) => {
  const existingItem = cart.find((cartItem) => cartItem.id === item.id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      ...item,
      quantity: 1,
    });
  }
  updateCart();
};

const updateCart = () => {
  cartItemsContainer.innerHTML = "";
  if (cart.length === 0) {
    cartItemsContainer.innerHTML =
      '<p class="empty-cart-msg">Your cart is empty</p>';
    proceedBtn.disabled = true;
    return;
  }
  let total = 0;
  cart.forEach((item) => {
    const itemTotal = item.quantity * parseFloat(item.price);
    total += itemTotal;
    const cartItemElement = document.createElement("div");
    cartItemElement.className = "cart-item";
    cartItemElement.innerHTML = `
          <div>
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">$${item.price} x ${item.quantity}</div>
          </div>
          <div class="cart-item-actions">
            <input type="number" min="1" value="${item.quantity}" class="cart-quantity">
            <button class="cart-remove">X</button>
          </div>
        `;
    const quantityInput = cartItemElement.querySelector(".cart-quantity");
    quantityInput.addEventListener("change", (e) => {
      const newQuantity = parseInt(e.target.value);
      if (newQuantity > 0) {
        item.quantity = newQuantity;
        updateCart();
      }
    });
    const removeButton = cartItemElement.querySelector(".cart-remove");
    removeButton.addEventListener("click", () => {
      cart = cart.filter((cartItem) => cartItem.id !== item.id);
      updateCart();
    });
    cartItemsContainer.appendChild(cartItemElement);
  });
  cartTotalElement.textContent = `$${total.toFixed(2)}`;
  proceedBtn.disabled = false;
};

const generateOrderNumber = () => {
  return Math.floor(Math.random() * 900) + 100;
};

proceedBtn.addEventListener("click", () => {
  menuPage.style.display = "none";
  confirmationPage.style.display = "block";
  document.querySelector(".confirmation-page").style.display = "flex";
  orderNumber = generateOrderNumber();
  orderIdElement.textContent = `Order #${orderNumber}`;
  const preparationTime = Math.floor(Math.random() * 5000) + 3000;
  setTimeout(() => {
    preparationAnimation.style.display = "none";
    orderReady.style.display = "block";
    renderOrderDetails();
  }, preparationTime);
});

const renderOrderDetails = () => {
  orderItemsContainer.innerHTML = "";
  orderImagesContainer.innerHTML = "";
  let total = 0;
  cart.forEach((item) => {
    const itemTotal = item.quantity * parseFloat(item.price);
    total += itemTotal;
    const orderItemElement = document.createElement("div");
    orderItemElement.className = "order-item";
    orderItemElement.innerHTML = `
          <div class="order-item-details">
            <span class="order-item-quantity">${item.quantity}x</span>
            <span>${item.name}</span>
          </div>
          <div>$${itemTotal.toFixed(2)}</div>
        `;
    orderItemsContainer.appendChild(orderItemElement);
    const imageElement = document.createElement("img");
    imageElement.src = item.image;
    imageElement.alt = item.name;
    imageElement.className = "order-image";
    orderImagesContainer.appendChild(imageElement);
  });
  orderTotalElement.textContent = `$${total.toFixed(2)}`;
};

backToMenuBtn.addEventListener("click", () => {
  cart = [];
  updateCart();
  confirmationPage.style.display = "none";
  menuPage.style.display = "flex";
  preparationAnimation.style.display = "flex";
  orderReady.style.display = "none";
});

renderMenuItems();
updateCart();
