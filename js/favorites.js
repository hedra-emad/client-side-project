import { displayMeals } from "../utils.js";

async function loadFavorites() {
  const loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));

  if (!loggedUser || !loggedUser.favorites) {
    displayMeals([]);
    return;
  }

  const favorites = loggedUser.favorites;
  let favoriteMealsData = [];

  for (let mealId of favorites) {
    try {
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`,
      );

      if (!res.ok) continue;

      const data = await res.json();

      if (data.meals) {
        favoriteMealsData.push(data.meals[0]);
      }
    } catch (err) {
      console.log("Fetch Error:", err);
    }
  }

  displayMeals(favoriteMealsData);
}

loadFavorites();
