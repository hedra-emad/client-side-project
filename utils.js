"use strict";
import { refreshNavbarFavColor } from "./js/nav.js";
let mealDetails = document.getElementById("mealDetails");

const BIN_ID = "69a2d1c243b1c97be9a6492a";
const API_KEY = "$2a$10$aEr.fC3BTS7ZDuBTSASOP.zrzFXN7aAmAy.4gdn5q2chWkiJaFY1a";

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
  // console.log(mealObj.strInstructions);
  const instructionArray = mealObj.strInstructions.split(".");

  for (let i = 1; i <= 20; i++) {
    if (mealObj[`strIngredient${i}`]) {
      recipes += `<li class="my-3 mx-1 p-1  alert-success rounded">${
        mealObj[`strMeasure${i}`]
      } ${mealObj[`strIngredient${i}`]}</li>`;
    }
  }

  let steps = "";
  for (let s of instructionArray) {
    if (s.length > 0) steps += `<li>${s}</li>`;
  }

  let html = `
  <div class="col-md-5 text-center mb-4">
  <img class="img-fluid shadow-lg" src="${mealObj.strMealThumb}" alt="${mealObj.strMeal}">
  <h2 class="text-center mt-3 text-warning">${mealObj.strMeal}</h2>
</div>
<div class="col-md-7 myM text-left">
  <p><b class="fw-bolder">Area :</b> ${mealObj.strArea}</p>
  <p><b class="fw-bolder">Category :</b> ${mealObj.strCategory}</p>
  <h3>Ingredients :</h3>
  <ol class="d-flex flex-wrap" id="recipes">
    ${recipes}
  </ol>
  

  <div class="mt-3">
    <a class="btn btn-success" target="_blank" href="${mealObj.strSource}">Source</a>
    <a class="btn youtube text-white" target="_blank" href="${mealObj.strYoutube}">Youtube</a>
  </div>

  
  </div>
  <h2>Instructions : </h2>
  <ul class="instruction-text w-100">${steps}</ul>
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
  const loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));
  const favorites =
    loggedUser && loggedUser.favorites ? loggedUser.favorites : [];

  meals.forEach((meal) => {
    const activeClass = favorites.includes(meal.idMeal) ? "active" : "";

    str += `
        <div class="col" >
            <div class="card-box position-relative rounded-3" >
            <div class="card-img">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <div class="overlay">
                <span class="plus-icon" onclick="handleOpenLists(event, '${meal.idMeal}')">+</span>

                </div>
              </div>
          
                <div class="card-info">
                    <div>
                        <a href="javascript:void(0)" onclick="handleMealClick(event, '${meal.idMeal}')">
                            <h6 class="meal-title">${meal.strMeal}</h6>
                        </a>
                    </div>
                    <div>
                    <span class="fav-icon ${activeClass}" 
                    onclick="handleFavoriteClick('${meal.idMeal}', event)" 
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

window.handleFavoriteClick = async function (mealId, event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  const loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));

  if (!loggedUser) {
    showLoginAlert();
    return;
  }

  // 1. تحديث الـ Favorites محلياً (Local Logic)
  let favorites = loggedUser.favorites || [];
  const isAdding = !favorites.includes(mealId);

  if (isAdding) {
    favorites.push(mealId);
  } else {
    favorites = favorites.filter((id) => id !== mealId);
  }

  loggedUser.favorites = favorites;

  // تحديث الـ SessionStorage فوراً
  sessionStorage.setItem("loggedUser", JSON.stringify(loggedUser));

  // تحديث الـ UI (الألوان والأيقونات)
  if (typeof refreshNavbarFavColor === "function") refreshNavbarFavColor();
  const favBtn = document.getElementById("fav-" + mealId);
  if (favBtn) favBtn.classList.toggle("active");

  // 2. مزامنة البيانات مع JSONbin (Server Sync)
  try {
    // جلب كل المستخدمين
    const getRes = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
      method: "GET",
      headers: { "X-Master-Key": API_KEY },
    });

    if (!getRes.ok) throw new Error("Failed to fetch server data");

    const data = await getRes.json();
    let allUsers = data.record.users;

    // إيجاد المستخدم الحالي وتحديث مفضّلته
    const userIndex = allUsers.findIndex((u) => u.id === loggedUser.id);
    if (userIndex !== -1) {
      allUsers[userIndex].favorites = favorites;

      // رفع البيانات كاملة بالهيكل { users: [...] }
      const updateRes = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Master-Key": API_KEY,
        },
        body: JSON.stringify({ users: allUsers }),
      });

      if (updateRes.ok) {
        console.log("Favorites synced with cloud!");
      }
    }
  } catch (err) {
    console.error("Cloud Sync Error:", err);
    // ملاحظة: حتى لو فشل السيرفر، التعديل لسه موجود في الـ SessionStorage بتاع اليوزر
  }
};
window.handleMealClick = function (event, mealId) {
  event.preventDefault();
  const isUserLoggedIn = sessionStorage.getItem("loggedUser");
  if (isUserLoggedIn) {
    window.location.href = `meal.html?id=${mealId}`;
  } else {
    showLoginAlert();
  }
};

const dataResult = document.getElementById("dataResult");

function displayData(meals, flags) {
  let str = "";
  meals.forEach((meal, i) => {
    str += `
      <a href="meals.html?type=${
        meal.strIngredient ? "i" : meal.strArea ? "a" : "c"
      }&recipe=${meal.strIngredient || meal.strArea || meal.strCategory}">
        <div class="col">
          <div class="card-box rounded-3 card-box-area">
            <div class="card-img">
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
            <div class="card-info">
              <h6>${meal.strIngredient || meal.strArea || meal.strCategory}</h6>
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
