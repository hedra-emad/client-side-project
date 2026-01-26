let results = document.getElementById("results");

let flags = [];
fetch("../data/areas.json")
  .then((res) => res.json())
  .then((data) => {
    flags = data.meals;
    console.log(flags);
  })
  .catch((err) => console.error(err));

async function getArea() {
  let areas = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?a=list`,
  );

  areas = await areas.json();
  console.log(areas);
  displayArea(areas);
}

function displayArea(areas) {
  let str = "";
  for (let i = 0; i < areas.meals.length; i++) {
    str += `<div class="col">
  <div class="area-card" data-name=${areas.meals[i].strArea} >
    <div class="area-img-box">
      <img src="${flags[i].flag}" alt="${areas.meals[i].strArea}">
    </div>

    <div class="area-info">
      <h5>${areas.meals[i].strArea}</h5>
    </div>
  </div>
</div>
  `;
  }

  results.innerHTML = str;
}

getArea();
