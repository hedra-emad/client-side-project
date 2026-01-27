//aliaa : search by name and first letter and home page

// import createMeal from "../utils.js";

const mealsResult = document.getElementById("mealsResult");
let searchByNameInput = document.getElementById("searchByNameInput");

var meals = [];

fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=")
  .then((response) => response.json())
  .then((data) => {
    meals = data.meals;
    display();

    searchByNameInput.addEventListener("input", () => {
      display();
    });
  });

function display() {
  let inp = searchByNameInput.value.toLowerCase();
  let collect = "";
  for (let meal of meals) {
    if (inp) {
      if (meal.strMeal.toLowerCase().includes(inp)) {
        collect += createMeal(meal, true);
      }
    } else collect += createMeal(meal);
  }
  mealsResult.innerHTML = collect;
  MankeFavorite();
}

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
  for (let meal of meals) {
    let FavoriteMeals = document.getElementById("fav-" + meal.idMeal);

    if (FavoriteMeals) {
      FavoriteMeals.onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();

        const isUserLoggedIn = localStorage.getItem("loggedUser");
        if (!isUserLoggedIn) {
          showLoginAlert();
          return;
        }
        const key = "fav" + meal.idMeal;
        if (localStorage.getItem(key)) {
          localStorage.removeItem(key);
          FavoriteMeals.classList.remove("active");
        } else {
          localStorage.setItem(key, meal.idMeal);
          FavoriteMeals.classList.add("active");
        }
      };
    }
  }
}

export function createMeal(meal) {
  var regex = new RegExp(searchByNameInput.value, "i");
  const isUserLoggedIn = localStorage.getItem("loggedUser");
  var activeClass = "";
  if (isUserLoggedIn) {
    const isFav = localStorage.getItem("fav" + meal.idMeal);
    activeClass = isFav ? "active" : "";
  }
  return `<a href="pages/meal.html?id=${meal.idMeal}">
  <div class="col" >
  <div class="meal-card rounded-3" >
    <div class="meal-img-box">
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
     
    </div>

    <div class="meal-info">
     <div>
      <h5>${meal.strMeal}</h5>
      <p>${meal.strArea} • ${meal.strCategory}</p>
     </div>
       <div>
       <span class="fav-icon ${activeClass}" id="fav-${meal.idMeal}">
      <i class="fa-solid fa-heart"></i>
      </span>
       </div>
    </div>
  </div>
</div>
  </a>
  `;
}
