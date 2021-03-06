const $ = el => document.querySelector(el);
const $all = el => document.querySelectorAll(el);

let modalQuantity = 1;
let cart = [];
let modalKey = 0;

// Lista as pizzas

pizzaJson.map((item, index) => {
  let pizzaItem = $(".models .pizza-item").cloneNode(true);

  pizzaItem.setAttribute("data-key", index);
  pizzaItem.querySelector(".pizza-item--img img").src = item.img;
  pizzaItem.querySelector(
    ".pizza-item--price"
  ).innerHTML = `R$ ${item.price.toFixed(2)}`;
  pizzaItem.querySelector(".pizza-item--name").innerHTML = item.name;
  pizzaItem.querySelector(".pizza-item--desc").innerHTML = item.description;

  pizzaItem.querySelector("a").addEventListener("click", event => {
    event.preventDefault();
    let key = event.target.closest(".pizza-item").getAttribute("data-key");
    modalQuantity = 1;
    modalKey = key;

    $(".pizzaBig img").src = pizzaJson[key].img;
    $(".pizzaInfo .title").innerHTML = pizzaJson[key].name;
    $(".pizzaInfo--desc").innerHTML = pizzaJson[key].description;
    $(".pizzaInfo--actualPrice").innerHTML = `R$ ${pizzaJson[key].price.toFixed(
      2
    )}`;

    $(".pizzaInfo--size.selected").classList.remove("selected");

    $all(".pizzaInfo--size").forEach((size, sizeIndex) => {
      if (sizeIndex == 2) {
        size.classList.add("selected");
      }
      size.querySelector("span").innerHTML = pizzaJson[key].sizes[sizeIndex];
    });

    $(".pizzaInfo--qt").innerHTML = modalQuantity;

    $(".pizzaWindowArea").style.opacity = "0";
    $(".pizzaWindowArea").style.display = "flex";
    setTimeout(() => {
      $(".pizzaWindowArea").style.opacity = "1";
    }, 350);
  });

  $(".pizza-area").append(pizzaItem);
});

// Executa o Modal

const closeModal = () => {
  $(".pizzaWindowArea").style.opacity = "0";
  setTimeout(() => {
    $(".pizzaWindowArea").style.display = "none";
  }, 500);
};

$all(".pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton").forEach(
  item => {
    item.addEventListener("click", closeModal);
  }
);

$(".quantity.-less").addEventListener("click", () => {
  if (modalQuantity > 1) {
    modalQuantity--;
    $(".pizzaInfo--qt").innerHTML = modalQuantity;
  }
});

$(".quantity.-more").addEventListener("click", () => {
  modalQuantity++;
  $(".pizzaInfo--qt").innerHTML = modalQuantity;
});

$all(".pizzaInfo--size").forEach((size, sizeIndex) => {
  size.addEventListener("click", () => {
    $(".pizzaInfo--size.selected").classList.remove("selected");
    size.classList.add("selected");
  });
});

$(".pizzaInfo--addButton").addEventListener("click", () => {
  let size = parseInt($(".pizzaInfo--size.selected").getAttribute("data-key"));
  let indentifier = pizzaJson[modalKey].id + "@" + size;

  let key = cart.findIndex(item => item.indentifier == indentifier);

  key > -1
    ? (cart[key].quantity += modalQuantity)
    : cart.push({
        indentifier,
        id: pizzaJson[modalKey].id,
        size,
        quantity: modalQuantity
      });
  updateCart();
  closeModal();
});

$(".menu-openner").addEventListener("click", () => {
  cart.length > 0 ? ($("aside").style.left = "0") : null;
});

$(".menu-closer").addEventListener("click", () => {
  $("aside").style.left = "100vw";
});

const updateCart = () => {
  $(".menu-openner span").innerHTML = cart.length;

  if (cart.length > 0) {
    $("aside").classList.add("show");
    $(".cart").innerHTML = "";

    let discount = 0;
    let subtotal = 0;
    let total = 0;

    for (let i in cart) {
      let pizzaItem = pizzaJson.find(item => item.id == cart[i].id);

      subtotal += pizzaItem.price * cart[i].quantity;

      let cartItem = $(".models .cart--item").cloneNode(true);

      let size = cart[i].size;

      const getPizzaSize = size => {
        const sizes = {
          0: () => (size = "P"),
          1: () => (size = "M"),
          2: () => (size = "G")
        };
        return sizes[size]();
      };

      let pizzaSizeName = getPizzaSize(size);

      let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

      cartItem.querySelector("img").src = pizzaItem.img;
      cartItem.querySelector(".cart--item-nome").innerHTML = pizzaName;
      cartItem.querySelector(".cart--item--qt").innerHTML = cart[i].quantity;
      cartItem
        .querySelector(".cart--item-qtmenos")
        .addEventListener("click", () => {
          cart[i].quantity > 1 ? cart[i].quantity-- : cart.splice(i, 1);
          updateCart();
        });

      cartItem
        .querySelector(".cart--item-qtmais")
        .addEventListener("click", () => {
          cart[i].quantity++;
          updateCart();
        });

      $(".cart").append(cartItem);
    }

    discount = subtotal * 0.1;
    total = subtotal - discount;

    $(".subtotal span:last-child").innerHTML = `R$ ${subtotal.toFixed(2)}`;
    $(".desconto span:last-child").innerHTML = `R$ ${discount.toFixed(2)}`;
    $(".total span:last-child").innerHTML = `R$ ${total.toFixed(2)}`;
  } else {
    $("aside").classList.remove("show");
    $("aside").style.left = "100vw";
  }
};
