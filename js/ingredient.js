import { getData } from "../utils.js";
const data = window.location.pathname.split("/");
getData(data);

// async function getIngredients() {
//   let res = await fetch(
//     "https://www.themealdb.com/api/json/v1/1/list.php?i=list",
//   );
//   let data = await res.json();
//   displayIngredients(data.meals.slice(0, 20));
// }

// function displayIngredients(meals) {
//   let str = "";

//   meals.forEach((meal) => {
//     str += `
//       <a href="meals.html?ingName=${meal.strIngredient}">
//         <div class="col">
//           <div class="ingredient-card rounded-3">
//             <div class="ingredient-img-box">
//               <img
//                 src="https://www.themealdb.com/images/ingredients/${meal.strIngredient}.png"
//                 alt="${meal.strIngredient}"
//               >
//             </div>
//             <div class="ingredient-info">
//               <h5>${meal.strIngredient}</h5>
//             </div>
//           </div>
//         </div>
//       </a>
//     `;
//   });

//   ingredientResult.innerHTML = str;
// }

// getIngredients();
