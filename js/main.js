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
