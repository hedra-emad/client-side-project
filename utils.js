export default async function getMealDetails(mealID) {
  let meal = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`
  );

  meal = await meal.json();

  const mealObj = meal.meals[0];
  displayMealDetails(mealObj);
}

let mealDetails = document.getElementById("mealDetails");

export function displayMealDetails(mealObj) {
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

export function displayMeals(meals) {
  let str = "";

  meals.forEach((meal) => {
    console.log(meal.strMeal);
    str += `
     <a href="meal.html?id=${meal.idMeal}">
  <div class="col" >
  <div class="meal-card rounded-3" >
    <div class="meal-img-box">
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
    </div>
    <div class="meal-info">
     <div>
      <h5>${meal.strMeal}</h5>
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
  });

  mealsResult.innerHTML = str;
}

//--------------------------------------------------------------------------
const dataResult = document.getElementById("dataResult");

function displayData(meals) {
  let str = "";

  meals.forEach((meal) => {
    str += `
      <a href="meals.html?ingName=${
        meal.strIngredient || meal.strArea || meal.strCategory
      }">
        <div class="col">
          <div class="ingredient-card rounded-3">
            <div class="ingredient-img-box">
              <img 
                src="https://www.themealdb.com/images/ingredients/${
                  meal.strIngredient
                }.png"
                alt="${meal.strIngredient || meal.strArea || meal.strCategory}"
              >
            </div>
            <div class="ingredient-info">
              <h5>${meal.strIngredient || meal.strArea || meal.strCategory}</h5>
              ${
                meal.strDescription
                  ? `<p>${meal.strDescription.slice(0, 100)}</p> `
                  : ""
              }
            </div>
          </div>
        </div>
      </a>
    `;
  });

  dataResult.innerHTML = str;
}

export async function getData(data) {
  if (data[2] === "ingredient.html") {
    const res = await fetch(
      "https://www.themealdb.com/api/json/v1/1/list.php?i=list"
    );
    const resData = await res.json();
    displayData(resData.meals.slice(0, 20));
  } else if (data[2] === "area.html") {
    const res = await fetch(
      "https://www.themealdb.com/api/json/v1/1/list.php?a=list"
    );
    const resData = await res.json();
    console.log(resData);
    displayData(resData.meals);
  } else if (data[2] === "categories.html") {
    const res = await fetch(
      "https://www.themealdb.com/api/json/v1/1/list.php?c=list"
    );
    const resData = await res.json();
    console.log(resData);
    displayData(resData.meals);
  }
}
