async function getMeal(mealID) {
  let meal = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`,
  );

  meal = await meal.json();
  console.log(meal);
  displayMeal(meal.meals[0]);
}

getMeal(53136);

var row = document.getElementById("rowData");
function displayMeal(meal) {
  let recipes = "";
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      recipes += `<li class="my-3 mx-1 p-1 alert-success rounded">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`;
    }
  }

  let html = ` <div class="col-md-4 myM text-white">
        <img class="w-100" src="${meal.strMealThumb}" alt="" srcset=""><br>
        <h1 class="text-center mt-3">${meal.strMeal}</h1>
    </div>
    <div class="col-md-8 myM text-white text-left">
        <h2>Instructions</h2>
        <p>${meal.strInstructions}</p>
        <p><b class="fw-bolder">Area :</b> ${meal.strArea}</p>
        <p><b class="fw-bolder">Category :</b> ${meal.strCategory}</p>
        <h3>Recipes :</h3>
        <ul class="d-flex " id="recipes">
        </ul>

        <a class="btn btn-success text-white" target="_blank" href="${meal.strSource}">Source</a>
        <a class="btn youtube text-white" target="_blank" href="${meal.strYoutube}">Youtub</a>
    </div>`;

  row.innerHTML = html;
  document.getElementById("recipes").innerHTML = recipes;
}
