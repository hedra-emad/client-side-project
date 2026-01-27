let results = document.getElementById("results");
for (let i = 0; i < localStorage.length; i++) {
  let key = localStorage.key(i);

  if (key.startsWith("fav")) {
    let id = localStorage.getItem(key);

    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
      .then((response) => response.json())
      .then((data) => {
        let meal = data.meals[0];
        let cardColumn = document.createElement("div");
        cardColumn.className = "col";
        cardColumn.id = "card-" + meal.idMeal;

        cardColumn.innerHTML = `
                <div class="meal-card">
                    <div class="meal-img-box">
                        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                        <span class="fav-icon active" id="fav-btn-${meal.idMeal}">
                        <i class="fa-solid fa-heart"></i>
                        </span>
                    </div>
                    <div class="meal-info">
                        <h5>${meal.strMeal}</h5>
                        <p>${meal.strArea} • ${meal.strCategory}</p>
                    </div>
                </div>
                `;

        results.appendChild(cardColumn);
        let favBtn = document.getElementById(`fav-btn-${meal.idMeal}`);

        favBtn.onclick = function (e) {
          e.preventDefault();
          localStorage.removeItem("fav" + meal.idMeal);
          let cardToRemove = document.getElementById("card-" + meal.idMeal);
          cardToRemove.remove();
        };
      });
  }
}
