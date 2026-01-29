const toggleBtn = document.getElementById("toggleBtn");
const navMenuCenter = document.querySelector(".nav-menu-center");

toggleBtn.onclick = function () {
  navMenuCenter.classList.toggle("active");
  if (navMenuCenter.classList.contains("active")) {
    toggleBtn.classList.replace("fa-bars", "fa-xmark");
  } else {
    toggleBtn.classList.replace("fa-xmark", "fa-bars");
  }
};

async function getCategories() {
  try {
    let response = await fetch(
      "https://www.themealdb.com/api/json/v1/1/categories.php",
    );
    let data = await response.json();

    let box = "";
    for (let i = 0; i < 6; i++) {
      let cat = data.categories[i];
      box += `
                <div class="col-md-4">
                    <div class="card category-card p-3 h-100">
                        <img src="${cat.strCategoryThumb}" class="card-img-top mb-3">
                        <div class="card-body text-center p-0">
                            <h6 class="fw-bold m-0 text-white">${cat.strCategory}</h6>
                        </div>
                    </div>
                </div>`;
    }
    document.getElementById("categories").innerHTML = box;
  } catch (error) {
    console.log("Error fetching categories", error);
  }
}
getCategories();

function getRandomMeal() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "https://www.themealdb.com/api/json/v1/1/random.php", true);

  xhr.onload = function () {
    if (xhr.status === 200) {
      var data = JSON.parse(xhr.responseText);
      var meal = data.meals[0];

      document.getElementById("randomMeal").innerHTML = `
                <div class="col-md-6 col-lg-4">
                    <a href="details.html?id=${meal.idMeal}" class="text-decoration-none">
                        <div class="card bg-dark text-white border-0 shadow-lg overflow-hidden rounded-4">
                            <img src="${meal.strMealThumb}" class="card-img-top">
                            <div class="p-4 text-start">
                                <h5 class="text-warning fw-bold mb-1">${meal.strMeal}</h5>
                                <p class="mb-0 text-secondary small">Click to view recipe →</p>
                            </div>
                        </div>
                    </a>
                </div>`;
    } else {
      console.error("Error fetching meal:", xhr.status);
    }
  };
  xhr.send();
}
