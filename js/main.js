//aliaa : search by name and first letter and home page

// import createMeal from "../utils.js";

import { displayMeals } from "../utils.js";

let searchByNameInput = document.getElementById("searchByNameInput");

let meals = [];

fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=")
  .then((response) => response.json())
  .then((data) => {
    meals = data.meals || [];
    display();

    searchByNameInput.addEventListener("input", () => {
      display();
    });
  });

function display() {
  const inp = searchByNameInput.value.toLowerCase();

  const filteredMeals = inp
    ? meals.filter((meal) => meal.strMeal.toLowerCase().includes(inp))
    : meals;
  displayMeals(filteredMeals);
}


//login Alert
function showLoginAlert() {
  const alertBox = document.getElementById("login-alert");
  if (alertBox) {
    alertBox.style.display = "block";
    setTimeout(() => {
      alertBox.style.display = "none";
    }, 1000);
  }
}

function MakeFavorite() {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  for (let meal of meals) {
    const favBtn = document.getElementById("fav-" + meal.idMeal);
    if (!favBtn) continue;

    favBtn.classList.toggle("active", favorites.includes(meal.idMeal));

    favBtn.onclick = function (e) {
      e.preventDefault();
      e.stopPropagation();

      const isUserLoggedIn = localStorage.getItem("loggedUser");
      if (!isUserLoggedIn) {
        showLoginAlert();
        return;
      }

      if (favorites.includes(meal.idMeal)) {
        favorites = favorites.filter((id) => id !== meal.idMeal);
        favBtn.classList.remove("active");
      } else {
        favorites.push(meal.idMeal);
        favBtn.classList.add("active");
      }

      localStorage.setItem("favorites", JSON.stringify(favorites));
    };
  }
}

