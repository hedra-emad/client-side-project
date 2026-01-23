let results = document.getElementById("results");
let searchByNameInput = document.getElementById("searchByNameInput");
let searchByLetterInput = document.getElementById("searchByLetterInput");
var meals = [];

fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=")
  .then((response) => response.json())
  .then((data) => {
    meals = data.meals;
    display();

    searchByNameInput.addEventListener("input", () => {
      display();
    });

    searchByLetterInput.addEventListener("input", function () {
      searchByLetter();
      console.log(8);
    });
  })
  .catch((error) => console.error("Threre is a mistake", error));

function display() {
  let inp = searchByNameInput.value.toLowerCase();
  let collect = "";
  let lits = [];
  for (let meal of meals) {
    if (inp) {
      if (meal.strMeal.toLowerCase().includes(inp)) {
        collect += createMeal(meal, true);
      }
    } else collect += createMeal(meal);
  }
  results.innerHTML = collect;
}

function searchByLetter() {
  let inp = searchByLetterInput.value.toLowerCase();
  let collect = "";

  for (let meal of meals) {
    if (meal.strMeal.toLowerCase().startsWith(inp)) {
      collect += createMeal(meal, false);
    }
  }

  results.innerHTML = collect;
}

function createMeal(meal, highlight) {
  var regex = new RegExp(searchByNameInput.value, "i");
  return `<div class="col">
  <div class="meal-card">
    <div class="meal-img-box">
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
      <span class="fav-icon">
      <i class="fa-solid fa-heart"></i>
      </span>
    </div>

    <div class="meal-info">
      <h5>${
        highlight
          ? meal.strMeal.replace(
              regex,
              (match) => `<span class="bg-info text-white">${match}</span>`
            )
          : meal.strMeal
      }</h5>
      <p>${meal.strArea} • ${meal.strCategory}</p>
    </div>
  </div>
</div>
  `;
}
