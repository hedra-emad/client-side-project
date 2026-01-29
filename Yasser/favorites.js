import { displayMeals } from "../utils.js";

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

favorites.forEach((id) => {
  if (favorites.length === 0) {
    results.innerHTML = `<p class="text-center text-muted">No favorites yet ❤️</p>`;
  }

  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    .then((response) => response.json())
    .then((data) => {
      if (!data.meals) return;
      let meal = data.meals[0];
      console.log(meal);
      let cardColumn = document.createElement("div");
      cardColumn.className = "col";
      cardColumn.id = "card-" + meal.idMeal;

      displayMeals();

      let favBtn = document.getElementById(`fav-btn-${meal.idMeal}`);

      favBtn.onclick = function (e) {
        e.preventDefault();

        favorites = favorites.filter((favId) => favId !== meal.idMeal);

        localStorage.setItem("favorites", JSON.stringify(favorites));

        document.getElementById("card-" + meal.idMeal).remove();
      };
    });
});

function addToFavorites(id) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  if (!favorites.includes(id)) {
    favorites.push(id);
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }
}
