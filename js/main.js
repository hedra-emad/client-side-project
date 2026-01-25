//aliaa : search by name and first letter and home page

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
  return `<div class="col" >
  <div class="meal-card rounded-3" data-id=${meal.idMeal} >
    <div class="meal-img-box">
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
     
    </div>

    <div class="meal-info">
     <div>
      <h5>${
        highlight
          ? meal.strMeal.replace(
              regex,
              (match) => `<span class="yellow text-white">${match}</span>`,
            )
          : meal.strMeal
      }</h5>
      <p>${meal.strArea} • ${meal.strCategory}</p>
     </div>
       <div>
       <span class="fav-icon">
      <i class="fa-solid fa-heart"></i>
      </span>
       </div>
    </div>
  </div>
</div>
  `;
}

//hedra: meal details page

document.addEventListener("click", async (e) => {
  const card = e.target.closest(".meal-card");
  if (!card) return;

  const mealID = card.dataset.id;

  document.getElementById("cardsSection").style.display = "none";

  document.getElementById("mealSection").style.display = "block";

  await getMealDetails(mealID);
});

document.getElementById("backBtn").addEventListener("click", () => {
  document.getElementById("mealSection").style.display = "none";
  document.getElementById("cardsSection").style.display = "block";
});

let mealDetails = document.getElementById("mealDetails");

async function getMealDetails(mealID) {
  let meal = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`,
  );

  meal = await meal.json();

  const mealObj = meal.meals[0];
  displayMeal(mealObj);
}

async function displayMeal(mealObj) {
  let recipes = "";
  for (let i = 1; i <= 20; i++) {
    if (mealObj[`strIngredient${i}`]) {
      recipes += `<li class="my-3 mx-1 p-1  alert-success rounded">${mealObj[`strMeasure${i}`]} ${mealObj[`strIngredient${i}`]}</li>`;
    }
  }

  let html = `
<div class="col-md-4 myM ">
  <img class="w-100" src="${mealObj.strMealThumb}" alt=""><br>
  <h1 class="text-center mt-3">${mealObj.strMeal}</h1>
</div>
<div class="col-md-8 myM  text-left">
  <h2>Instructions</h2>
  <p>${mealObj.strInstructions}</p>
  <p><b class="fw-bolder">Area :</b> ${mealObj.strArea}</p>
  <p><b class="fw-bolder">Category :</b> ${mealObj.strCategory}</p>
  <h3>Recipes :</h3>
  	<ul class="d-flex flex-wrap" id="recipes">
    ${recipes}
	</ul>
					
		<div class="ms-4">
        	<a class="btn btn-success " target="_blank" href="${mealObj.strSource}">Source</a>
					<a class="btn youtube text-white" target="_blank" href="${mealObj.strYoutube}">Youtub</a>
        </div>
</div>
`;

  mealDetails.innerHTML = html;
}
