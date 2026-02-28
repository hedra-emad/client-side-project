const urlParams = new URLSearchParams(window.location.search);
const listId = urlParams.get("id");
const listTitleEl = document.getElementById("listTitle");
const listMealsContainer = document.getElementById("listMeals");

const loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));
if (!loggedUser) {
  alert("You must log in first!");
  window.location.href = "login.html";
}

const list = loggedUser.lists.find((l) => l.id === listId);
if (!list) {
  alert("List not found");
  window.location.href = "profile.html";
}

listTitleEl.textContent = list.name;

async function displayMeals(mealIds) {
  let html = "";
  for (const id of mealIds) {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`,
    );
    const meal = await res.json();
    const mealObj = meal.meals[0];

    html += `
  <div class="col">
    <div class="card-box position-relative rounded-3">
      <div class="card-img">
        <img src="${mealObj.strMealThumb}" alt="${mealObj.strMeal}">
        <div class="overlay">
          <span 
            class="delete-icon"
            onclick="deleteMealFromList('${listId}', '${mealObj.idMeal}', event)">
            <i class="fa-solid fa-trash"></i>
          </span>
        </div>
      </div>

      <div class="card-info">
        <div>
          <a href="meal.html?id=${mealObj.idMeal}">
            <h6 class="meal-title">${mealObj.strMeal}</h6>
          </a>
        </div>

        <div>
          <span 
            class="fav-icon ${
              loggedUser.favorites?.includes(mealObj.idMeal) ? "active" : ""
            }"
            onclick="handleFavoriteClick('${mealObj.idMeal}', event)"
            id="fav-${mealObj.idMeal}">
            <i class="fa-solid fa-heart"></i>
          </span>
        </div>
      </div>
    </div>
  </div>
`;
  }

  listMealsContainer.innerHTML = html;
}

displayMeals(list.items);

// window.toggleFavorite = function (mealId, event) {
//   event.stopPropagation();
// };

window.deleteMealFromList = async function (listId, mealId, event) {
  event?.stopPropagation();

  let loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));
  if (!loggedUser) return;

  // 1. تحديث البيانات في الـ Session (لوكال)
  const list = loggedUser.lists.find((l) => l.id === listId);
  if (!list) return;

  // حذف الوجبة من القائمة
  list.items = list.items.filter((id) => String(id) !== String(mealId));

  // تحديث الـ Session Storage فوراً عشان اليوزر يحس بالسرعة
  sessionStorage.setItem("loggedUser", JSON.stringify(loggedUser));
  const BIN_ID = "69a2d1c243b1c97be9a6492a";
  const API_KEY =
    "$2a$10$aEr.fC3BTS7ZDuBTSASOP.zrzFXN7aAmAy.4gdn5q2chWkiJaFY1a";
  // 2. تحديث السيرفر (JSONbin)
  try {
    // نجيب كل المستخدمين الأول
    const getResponse = await fetch(
      `https://api.jsonbin.io/v3/b/${BIN_ID}/latest`,
      {
        method: "GET",
        headers: { "X-Master-Key": API_KEY },
      },
    );

    if (!getResponse.ok) throw new Error("Failed to fetch data");

    const data = await getResponse.json();
    let allUsers = data.record.users;

    // نحدث بيانات المستخدم الحالي جوه المصفوفة الكبيرة
    const userIndex = allUsers.findIndex((u) => u.id === loggedUser.id);
    if (userIndex !== -1) {
      allUsers[userIndex].lists = loggedUser.lists;

      // نرفع الداتا كلها من تاني بالكامل (PUT)
      await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Master-Key": API_KEY,
        },
        body: JSON.stringify({ users: allUsers }), // نرجعه للهيكل الأصلي اللي فيه users
      });
      console.log("Server updated successfully");
    }
  } catch (err) {
    console.error("Delete meal server error:", err);
    alert("Could not sync with server, but updated locally.");
  }

  // 3. إعادة رسم الوجبات في الصفحة
  if (typeof displayMeals === "function") {
    displayMeals(list.items);
  }
};
