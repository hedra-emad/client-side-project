export default async function getMealDetails(mealID) {
  let meal = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`
  );

  meal = await meal.json();

  const mealObj = meal.meals[0];
  displayMeal(mealObj);
}

let mealDetails = document.getElementById("mealDetails");

async function displayMeal(mealObj) {
  let recipes = "";
  for (let i = 1; i <= 20; i++) {
    if (mealObj[`strIngredient${i}`]) {
      recipes += `<li class="my-3 mx-1 p-1  alert-success rounded">${
        mealObj[`strMeasure${i}`]
      } ${mealObj[`strIngredient${i}`]}</li>`;
    }
  }

  let html = `
  <div class="col-md-5 myM text-center">
  <img class="img-fluid shadow-lg" src="${mealObj.strMealThumb}" alt="${mealObj.strMeal}">
  <h1 class="text-center mt-3 text-warning">${mealObj.strMeal}</h1>
</div>
<div class="col-md-7 myM text-left">
  <h2>Instructions</h2>
  <p class="instruction-text">${mealObj.strInstructions}</p>
  <p><b class="fw-bolder">Area :</b> ${mealObj.strArea}</p>
  <p><b class="fw-bolder">Category :</b> ${mealObj.strCategory}</p>
  <h3>Ingredients :</h3>
  <ul class="d-flex flex-wrap" id="recipes">
    ${recipes}
  </ul>

  <div class="mt-3">
    <a class="btn btn-success" target="_blank" href="${mealObj.strSource}">Source</a>
    <a class="btn youtube text-white" target="_blank" href="${mealObj.strYoutube}">Youtube</a>
  </div>
</div>

`;

  mealDetails.innerHTML = html;
}
