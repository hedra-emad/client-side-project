import { getData } from "../utils.js";

const data = window.location.pathname.split("/");
getData(data);

// let results = document.getElementById("results");

// const params = new URLSearchParams(window.location.search);
// console.log(params);
// const area = params.get("area");

// async function getMeals(area) {
//   let res = await fetch(
//     `https://www.themealdb.com/api/json/v1/1/filter.php?i=${area}`,
//   );
//   let data = await res.json();
//   displayMeals(data.meals);
// }

// let flags = [];
// fetch("../data/areas.json")
//   .then((res) => res.json())
//   .then((data) => {
//     flags = data.meals;
//     console.log(flags);
//   })
//   .catch((err) => console.error(err));

// async function getArea() {
//   let areas = await fetch(
//     `https://www.themealdb.com/api/json/v1/1/list.php?a=list`,
//   );

//   areas = await areas.json();
//   console.log(areas);
//   displayArea(areas);
// }

// function displayArea(areas) {
//   let str = "";
//   for (let i = 0; i < areas.meals.length; i++) {
//     str += `<a href="meals.html?area=${areas.meals[i].strArea}">
//     <div class="col">
//   <div class="area-card" data-name=${areas.meals[i].strArea} >
//     <div class="area-img-box">
//       <img src="${flags[i].flag}" alt="${areas.meals[i].strArea}">
//     </div>

//     <div class="area-info">
//       <h5>${areas.meals[i].strArea}</h5>
//     </div>
//   </div>
// </div>
//     </a>
//   `;
//   }

//   results.innerHTML = str;
// }

// getArea();
