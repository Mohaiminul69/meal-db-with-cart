const input = document.getElementById("searchInput");
const button = document.getElementById("searchButton");
const cartItems = [];
const categories = {};

input.addEventListener("keypress", (e) => e.key === "Enter" && searchFood());
button.addEventListener("click", () => searchFood());

const searchFood = () => {
  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${input.value}`)
    .then((res) => res.json())
    .then((data) => displayMeals(data.meals))
    .catch((err) => console.log(err));
};

searchFood();

const getDetails = (mealId) => {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
    .then((res) => res.json())
    .then((data) => displayMealDetails(data.meals[0]))
    .catch((err) => console.log(err));
};

const getInstruction = (text) => `${text.split(" ").slice(0, 10).join(" ")}...`;
const isAlreadyAdded = (mealId) =>
  cartItems.some((item) => item.mealId === mealId);

const displayMealDetails = (meal) => {
  const mealDetails = document.getElementById("modal-body");
  mealDetails.innerHTML = "";
  const div = document.createElement("div");

  div.innerHTML = `
      <div class="card">
          <div class="row g-0">
              <div class="col-md-4">
                  <img src="${meal.strMealThumb}" class="img-fluid rounded-start h-100 w-100" alt="${meal.strMeal}" >
              </div>
              <div class="col-md-8">
                  <div class="card-body">
                      <div class="d-flex justify-content-between align-items-center mb-2">
                          <h4 class="card-title fw-bolder">${meal.strMeal}</h4>
                          <div class="badge bg-dark py-2"><strong>Category:</strong> ${meal.strCategory}</div>
                      </div>
                      <div class="d-flex justify-content-between align-items-center mb-2">
                          <p class="card-text my-auto"><strong>Origin:</strong> ${meal.strArea}</p>
                      </div>
                      <p class="card-text"><strong>Instruction:</strong> ${meal.strInstructions}</p>
                      <div class="d-flex">
                      <a href="${meal.strSource}" class="text-decoration-none"><button class="btn btn-success d-flex align-items-center me-2">Read Blog <i class="ms-2 fas fa-link text-white fs-5"></i></button></a>                       
                      <a href="${meal.strYoutube}" class="text-decoration-none"><button class="btn btn-success d-flex align-items-center">Watch Video Tutorial <i class="ms-2 fab fa-youtube text-white fs-5"></i
                      ></button></a>                       
                      </div>
                  </div>
              </div>
          </div>
      </div>
  `;

  mealDetails.appendChild(div);
};

const displayMeals = (meals) => {
  const mealContainer = document.getElementById("container");
  mealContainer.innerHTML = "";

  if (meals === null) {
    mealContainer.innerHTML = `
    <div class="row justify-content-center mt-3">
    <div class="col-12">
      <h5 class="text-warning">No results found</h5>
      <p class="text-warning">Try adjusting your search to find what you're looking for.</p>
    </div>
  </div>
    `;

    return;
  }

  meals.forEach((meal) => {
    const div = document.createElement("div");
    div.className = "col";

    div.innerHTML = `
            <div
            class="card h-100 rounded-4" 
            onclick="getDetails(${meal.idMeal})">
                <img src="${meal.strMealThumb}" class="card-img-top" alt="${
      meal.strMeal
    }">
                <div class="card-body d-flex flex-column align-items-start justify-content-between">
                    <h4 class="card-title fs-3">${
                      meal.strMeal
                    }</h4>                                
                    <p class="card-text"><strong>Instruction:</strong> ${getInstruction(
                      meal.strInstructions
                    )}</p>
                    <span class="badge bg-dark">${meal.strCategory}</span>
                    <div class="mt-2 w-100 d-flex justify-content-between align-items-center">
                    <button id="${meal.idMeal}" class="btn btn-${
      isAlreadyAdded(meal.idMeal) ? "danger" : "success"
    } btn-sm" onclick="addToCart('${meal.strMeal}', '${meal.strMealThumb}','${
      meal.strCategory
    }','${meal.idMeal}')">
                      ${
                        isAlreadyAdded(meal.idMeal)
                          ? "Already Added"
                          : "Add to Cart"
                      }
                    </button>
                    <button data-bs-toggle="modal"
            data-bs-target="#exampleModal" class="btn btn-success btn-sm" onclick="getDetails(${
              meal.idMeal
            })">View Details</button>
                    </div>
                </div>
            </div>
        `;

    mealContainer.appendChild(div);
  });
};

const createElement = (tag, className = "", innerHTML = "") => {
  const element = document.createElement(tag);
  element.className = className;
  element.innerHTML = innerHTML;
  return element;
};

const addToCart = (name, image, category, mealId) => {
  if (cartItems.length === 11) {
    alert("You have reached the max limit of your cart");
    return;
  }

  if (isAlreadyAdded(mealId)) {
    alert("This item has already been selected");
    return;
  }

  cartItems.push({ mealId, name, image });
  categories[`${category}`]
    ? (categories[`${category}`] += 1)
    : (categories[`${category}`] = 1);

  if (cartItems.length === 0) return;

  const cartContainer = document.getElementById("cart");
  cartContainer.innerHTML = "";

  const cartHeader = createElement("div", "card");
  const cartBody = createElement(
    "div",
    "card-body",
    `
      <h2>Your Cart</h2>
      <hr />
      <h5>Meals Added: ${cartItems.length}</h5>
      <hr />
      <h5>Categories:</h5>
      ${Object.entries(categories)
        .map(([key, value]) => `<p class="mb-0">${key}: ${value}</p>`)
        .join("")}
      <hr />
      <h5>Meals List:</h5>
    `
  );

  cartItems.forEach((item, idx) => {
    div = document.createElement("div");
    div.innerHTML = `
    <h6>${idx + 1}) <img class="cart-img" src="${item.image}"/> ${
      item.name
    }</h6>
    `;
    cartBody.appendChild(div);
  });

  cartHeader.appendChild(cartBody);
  cartContainer.appendChild(cartHeader);
  document.getElementById(`${mealId}`).innerText = "Already Added";
  document.getElementById(`${mealId}`).classList.remove("btn-success");
  document.getElementById(`${mealId}`).classList.add("btn-danger");
};
