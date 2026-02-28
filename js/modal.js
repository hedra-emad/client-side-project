import { showLoginAlert } from "../utils.js";
document.addEventListener("DOMContentLoaded", () => {
  const listModal = document.getElementById("listModal");
  const listsContainer = document.getElementById("listsContainer");
  const closeModalBtn = document.querySelector(".close-modal");
  const createListBtn = document.querySelector(".create-list-btn");
  const listsView = document.getElementById("listsView");
  const createListView = document.getElementById("createListView");
  const closeFormBtn = document.querySelector(".close-form-btn");
  const createListForm = document.getElementById("createListForm");
  const modalFooter = document.getElementById("modalFooter");
  const BIN_ID = "69a2d1c243b1c97be9a6492a";
  const API_KEY =
    "$2a$10$aEr.fC3BTS7ZDuBTSASOP.zrzFXN7aAmAy.4gdn5q2chWkiJaFY1a";
  if (listModal) {
    listModal.classList.add("hidden");
  }

  if (createListBtn) {
    createListBtn.addEventListener("click", () => {
      listModal.style.display = "flex";

      if (createListView) createListView.classList.remove("hidden");
      if (listsView) listsView.classList.add("hidden");
      if (modalFooter) modalFooter.classList.add("hidden");
    });
  }

  function renderLists(lists, mealId) {
    const listsContainer = document.getElementById("listsContainer");
    if (!listsContainer) return;

    if (!lists.length) {
      listsContainer.innerHTML = `
        <div class="empty-lists">You haven't made any lists yet</div>
      `;
      return;
    }

    let html = "";
    lists.forEach((list) => {
      html += `
        <div class="user-list" onclick="addMealToList('${list.id}', '${mealId}')">
          ${list.name}
        </div>
      `;
    });

    listsContainer.innerHTML = html;
  }

  window.handleOpenLists = function (event, mealId) {
    event.stopPropagation();

    const loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));
    if (!loggedUser) {
      showLoginAlert();
      return;
    }

    renderLists(loggedUser.lists || [], mealId);

    listModal.style.display = "flex";
  };

  if (createListForm) {
    createListForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));
      if (!loggedUser) return;

      const nameInput = document.getElementById("listNameInput");
      const name = nameInput.value.trim();

      if (!name) return;

      // 1. إنشاء الكائن الجديد للقائمة
      const newList = {
        id: crypto.randomUUID(),
        name,
        ownerID: loggedUser.id,
        likes: 0,
        items: [],
      };

      // 2. تحديث البيانات محلياً (Local/Session)
      loggedUser.lists = loggedUser.lists || [];
      loggedUser.lists.push(newList);
      sessionStorage.setItem("loggedUser", JSON.stringify(loggedUser));

      // 3. تحديث السيرفر (JSONbin)
      try {
        // جلب الداتا الحالية
        const getRes = await fetch(
          `https://api.jsonbin.io/v3/b/${BIN_ID}/latest`,
          {
            headers: { "X-Master-Key": API_KEY },
          },
        );

        if (!getRes.ok) throw new Error("Failed to fetch users");

        const data = await getRes.json();
        let allUsers = data.record.users;

        // تحديث المستخدم المحدد
        const userIndex = allUsers.findIndex((u) => u.id === loggedUser.id);
        if (userIndex !== -1) {
          allUsers[userIndex].lists = loggedUser.lists;

          // رفع الداتا كاملة بالهيكل الصحيح
          await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "X-Master-Key": API_KEY,
            },
            body: JSON.stringify({ users: allUsers }),
          });

          console.log("New list synced to server");
        }
      } catch (err) {
        console.error("Create list sync error:", err);
      }

      // 4. تحديث الـ UI وإخفاء الفورم
      renderLists(loggedUser.lists, null);

      if (createListView) createListView.classList.add("hidden");
      if (listsView) listsView.classList.remove("hidden");
      if (modalFooter) modalFooter.classList.remove("hidden");

      createListForm.reset();
    });
  }

  if (closeFormBtn) {
    closeFormBtn.onclick = () => {
      if (createListView) createListView.classList.add("hidden");
      if (listsView) listsView.classList.remove("hidden");
      if (modalFooter) modalFooter.classList.remove("hidden");
    };
  }

  if (closeModalBtn) {
    closeModalBtn.onclick = () => {
      resetModalState();
      listModal.style.display = "none";
    };
  }

  if (listModal) {
    listModal.onclick = (e) => {
      if (e.target === listModal) {
        resetModalState();
        listModal.style.display = "none";
      }
    };
  }

  function resetModalState() {
    if (createListForm) createListForm.reset();
    if (createListView) createListView.classList.add("hidden");
    if (listsView) listsView.classList.remove("hidden");
    if (modalFooter) modalFooter.classList.remove("hidden");
  }

  window.addMealToList = async function (listId, mealId) {
    const loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));
    if (!loggedUser) {
      showLoginAlert();
      return;
    }

    // 1. تحديث البيانات محلياً في الـ SessionStorage (لسرعة الاستجابة)
    const list = loggedUser.lists.find((l) => l.id === listId);
    if (!list) return;

    if (!list.items.includes(mealId)) {
      list.items.push(mealId);
      sessionStorage.setItem("loggedUser", JSON.stringify(loggedUser));
    } else {
      alert("This meal is already in the list!");
      return;
    }

    // 2. تحديث السيرفر (JSONbin Sync)
    try {
      // جلب النسخة الكاملة من السيرفر
      const getResponse = await fetch(
        `https://api.jsonbin.io/v3/b/${BIN_ID}/latest`,
        {
          method: "GET",
          headers: { "X-Master-Key": API_KEY },
        },
      );

      if (!getResponse.ok) throw new Error("Failed to fetch users");

      const data = await getResponse.json();
      let allUsers = data.record.users;

      // البحث عن المستخدم وتحديث قوائمه
      const userIndex = allUsers.findIndex((u) => u.id === loggedUser.id);
      if (userIndex !== -1) {
        allUsers[userIndex].lists = loggedUser.lists;

        // رفع المصفوفة كاملة للهيكل { users: [...] }
        await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-Master-Key": API_KEY,
          },
          body: JSON.stringify({ users: allUsers }),
        });

        console.log("Meal added and synced with server");
      }
    } catch (err) {
      console.error("Add meal sync error:", err);
      // ملاحظة: البيانات ستظل محفوظة في الـ SessionStorage حتى لو فشل السيرفر مؤقتاً
    }

    alert(`Meal added to ${list.name}`);

    // إغلاق المودال وإعادة حالته
    if (typeof resetModalState === "function") resetModalState();
    const listModal = document.getElementById("listModal");
    if (listModal) listModal.style.display = "none";
  };

  ///
});
