"use strict";

let mealDetails = document.getElementById("mealDetails");

export default async function getMealDetails(mealID) {
  let meal = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`,
  );
  meal = await meal.json();
  const mealObj = meal.meals[0];
  displayMealDetails(mealObj);
}

export function displayMealDetails(mealObj) {
  let recipes = "";
  for (let i = 1; i <= 20; i++) {
    if (mealObj[`strIngredient${i}`]) {
      recipes += `<li class="my-3 mx-1 p-1  alert-success rounded">${
        mealObj[`strMeasure${i}`]
      } ${mealObj[`strIngredient${i}`]}</li>`;
    }
  }

  let html = `
  <div class="col-md-5 myM text-center">
  <img class="img-fluid shadow-lg" src="${mealObj.strMealThumb}" alt="${mealObj.strMeal}">
  <h1 class="text-center mt-3 text-warning">${mealObj.strMeal}</h1>
</div>
<div class="col-md-7 myM text-left">
  <h2>Instructions</h2>
  <p class="instruction-text">${mealObj.strInstructions}</p>
  <p><b class="fw-bolder">Area :</b> ${mealObj.strArea}</p>
  <p><b class="fw-bolder">Category :</b> ${mealObj.strCategory}</p>
  <h3>Ingredients :</h3>
  <ul class="d-flex flex-wrap" id="recipes">
    ${recipes}
  </ul>

  <div class="mt-3">
    <a class="btn btn-success" target="_blank" href="${mealObj.strSource}">Source</a>
    <a class="btn youtube text-white" target="_blank" href="${mealObj.strYoutube}">Youtube</a>
  </div>
</div>
`;
  mealDetails.innerHTML = html;
}

export function showLoginAlert() {
    let alertBox = document.getElementById("login-alert");

    if (!alertBox) {
        alertBox = document.createElement("div");
        alertBox.id = "login-alert";
        document.body.appendChild(alertBox);
    }

    alertBox.innerHTML = `
        <span>You must log in first!</span>
        <a href="login.html" class="login-alert-botton">Login</a>
    `;

    alertBox.style.display = "block";
    setTimeout(() => {
        alertBox.style.display = "none";
    }, 3000); 
}

export function displayMeals(meals) {
    let str = "";
    const isUserLoggedIn = localStorage.getItem("loggedUser");
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    meals.forEach((meal) => {
        const isFav = isUserLoggedIn && favorites.includes(meal.idMeal);
        const activeClass = isFav ? "active" : "";

        str += `
        <div class="col" >
            <div class="meal-card rounded-3" >
                <div class="meal-img-box">
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                </div>
                <div class="meal-info">
                    <div>
                        <a href="javascript:void(0)" onclick="handleMealClick(event, '${meal.idMeal}')">
                            <h5>${meal.strMeal}</h5>
                        </a>
                    </div>
                    <div>
                        <span class="fav-icon ${activeClass}" 
                              onclick="handleFavoriteClick(event, '${meal.idMeal}')" 
                              id="fav-${meal.idMeal}">
                            <i class="fa-solid fa-heart"></i>
                        </span>
                    </div>
                </div>
            </div>
        </div>
        `;
    });

  mealsResult.innerHTML = str;
}

window.handleFavoriteClick = function(event, mealId) {
    event.preventDefault();
    event.stopPropagation();
    const isUserLoggedIn = localStorage.getItem("loggedUser");
    if (!isUserLoggedIn) {
        showLoginAlert(); 
        return;
    }
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const favBtn = document.getElementById("fav-" + mealId);
    if (favorites.includes(mealId)) {
        favorites = favorites.filter((id) => id !== mealId);
        if (favBtn) favBtn.classList.remove("active");

    } else {
        favorites.push(mealId);
        if (favBtn) favBtn.classList.add("active");
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));
};

window.handleMealClick = function(event, mealId) {
    event.preventDefault();
    const isUserLoggedIn = localStorage.getItem("loggedUser");
    if (isUserLoggedIn) {
        window.location.href = `meal.html?id=${mealId}`;
    } else {
        showLoginAlert();
    }
};

//--------------------------------------------------------------------------
const dataResult = document.getElementById("dataResult");

function displayData(meals, flags) {
  let str = "";
  meals.forEach((meal, i) => {
    str += `
      <a href="meals.html?type=${
        meal.strIngredient ? "i" : meal.strArea ? "a" : "c"
      }&recipe=${meal.strIngredient || meal.strArea || meal.strCategory}">
        <div class="col">
          <div class="ingredient-card rounded-3">
            <div class="ingredient-img-box">
              <img 
                src="${
                  (meal.strIngredient &&
                    `https://www.themealdb.com/images/ingredients/${meal.strIngredient}.png`) ||
                  flags?.meals[i]?.flag ||
                  meal.strCategoryThumb
                }"
                alt="${meal.strIngredient || meal.strArea || ""}"
              >
            </div>
            <div class="ingredient-info">
              <h5>${meal.strIngredient || meal.strArea || meal.strCategory}</h5>
              <p>${
                meal.strDescription
                  ? meal.strDescription.slice(0, 100)
                  : meal.strCategoryDescription
                    ? meal.strCategoryDescription.slice(0, 100)
                    : ""
              }</p> 
            </div>
          </div>
        </div>
      </a>
    `;
  });

  dataResult.innerHTML = str;
}

export async function getData(data, flags = []) {
  if (data[2] === "ingredient.html") {
    const res = await fetch(
      "https://www.themealdb.com/api/json/v1/1/list.php?i=list",
    );
    const resData = await res.json();
    displayData(resData.meals.slice(0, 20));
  } else if (data[2] === "area.html") {
    const res = await fetch(
      "https://www.themealdb.com/api/json/v1/1/list.php?a=list",
    );
    const resData = await res.json();
    displayData(resData.meals, flags);
  } else if (data[2] === "categories.html") {
    const res = await fetch(
      "https://www.themealdb.com/api/json/v1/1/categories.php",
    );
    const resData = await res.json();
    displayData(resData.categories);
  }
}
