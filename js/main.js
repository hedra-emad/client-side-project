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
}

export function createMeal(meal, highlight) {
  var regex = new RegExp(searchByNameInput.value, "i");
  return `<a href="pages/meal.html?id=${meal.idMeal}">
  <div class="col" >
  <div class="meal-card" >
    <div class="meal-img-box">
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
     
    </div>

    <div class="meal-info">
     <div>
      <h5>${
        highlight
          ? meal.strMeal.replace(
              regex,
              (match) => `<span class="yellow text-white">${match}</span>`
            )
          : meal.strMeal
      }</h5>
      <p>${meal.strArea} • ${meal.strCategory}</p>
     </div>
       <div>
       <span class="fav-icon">
      <i class="fa-solid fa-heart"></i>
      </span>
       </div>
    </div>
  </div>
</div>
  </a>
  `;
}
