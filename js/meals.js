import { displayMeals } from "../utils.js";

const params = new URLSearchParams(window.location.search);
const ingName = params.get("ingName");

async function getMeals(ingName) {
  let res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingName}`,
  );
  let data = await res.json();
  displayMeals(data.meals);
}

getMeals(ingName);
