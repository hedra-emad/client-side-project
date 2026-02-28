import { supabaseClient } from "./supabaseClient.js";

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
  if (!loggedUser || !loggedUser.lists) return;

  // 1. تحديث المصفوفة محلياً (فحص دقيق)
  const listIndex = loggedUser.lists.findIndex((l) => l.id === listId);
  if (listIndex === -1) return;

  // حذف الوجبة من القائمة المحددة
  const updatedItems = loggedUser.lists[listIndex].items.filter(
    (id) => String(id) !== String(mealId),
  );

  // تحديث الكائن الكبير (loggedUser) بالمصفوفة الجديدة
  loggedUser.lists[listIndex].items = updatedItems;

  // 2. تحديث السيرفر (Supabase) - قبل ما نحدث الـ Session عشان نتأكد إنه نجح
  try {
    const { data, error } = await supabaseClient
      .from("users")
      .update({ lists: loggedUser.lists }) // بنبعت الـ lists بعد الحذف
      .eq("id", loggedUser.id)
      .select(); // عشان نتأكد إن الداتا رجعت متعدلة من السيرفر

    if (error) throw error;

    // لو السيرفر تمام، نحدث الـ SessionStorage
    sessionStorage.setItem("loggedUser", JSON.stringify(loggedUser));
    console.log("✅ Deleted from Cloud & Local:", data);

    // 3. تحديث الـ UI
    if (typeof displayMeals === "function") {
      displayMeals(updatedItems);
    }
  } catch (err) {
    console.error("❌ Sync Error:", err.message);
    alert("Faild to sync with server. Please try again.");
  }
};
