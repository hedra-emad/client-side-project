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

// function display() {
//   let inp = searchByNameInput.value.toLowerCase();
//   let collect = "";
//   for (let meal of meals) {
//     if (inp) {
//       if (meal.strMeal.toLowerCase().includes(inp)) {
//         collect += displayMeals(meal, true);
//       }
//     } else collect += displayMeals(meal);
//   }
//   mealsResult.innerHTML = collect;
//   MankeFavorite();
// }

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

function MankeFavorite() {
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

// displayMeals(meal)

// function createMeal(meal) {
//   const isUserLoggedIn = localStorage.getItem("loggedUser");
//   var activeClass = "";
//   if (isUserLoggedIn) {
//     const isFav = localStorage.getItem("fav" + meal.idMeal);
//     activeClass = isFav ? "active" : "";
//   }
//   return `<a href="meal.html?id=${meal.idMeal}">
//   <div class="col" >
//   <div class="meal-card" >
//     <div class="meal-img-box">
//       <img src="${meal.strMealThumb}" alt="${meal.strMeal}">

//     </div>

//     <div class="meal-info">
//      <div>
//       <h5>${meal.strMeal}</h5>
//       <p>${meal.strArea} • ${meal.strCategory}</p>
//      </div>
//        <div>
//        <span class="fav-icon ${activeClass}" id="fav-${meal.idMeal}">
//       <i class="fa-solid fa-heart"></i>
//       </span>
//        </div>
//     </div>
//   </div>
// </div>
//   </a>
//   `;
// }
