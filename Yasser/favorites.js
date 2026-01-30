import { displayMeals } from "../utils.js";

function loadFavorites() {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    let favoriteMealsData = [];

    favorites.forEach((mealId) => {
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
            .then((response) => response.json())
            .then((data) => {
                favoriteMealsData.push(data.meals[0]);
                displayMeals(favoriteMealsData);
            });
    });
}

loadFavorites();