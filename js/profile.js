import { supabaseClient } from "./supabaseClient.js";
document.addEventListener("DOMContentLoaded", () => {
  const userNameDisplay = document.getElementById("userNameDisplay");
  const userListsContainer = document.getElementById("userLists");
  const settingsModal = document.getElementById("listSettingsModal");
  const settingsListName = document.getElementById("settingsListName");

  const renameBtn = document.getElementById("renameListBtn");
  const renameInput = document.getElementById("renameListInput");
  const saveRenameBtn = document.getElementById("saveRenameBtn");

  // const togglePrivacyBtn = document.getElementById("togglePrivacyBtn");
  const deleteListBtn = document.getElementById("deleteListBtn");
  const closeSettingsModal = document.getElementById("closeSettingsModal");

  let currentListId = null;

  const loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));

  if (!loggedUser) {
    alert("You must log in first!");
    window.location.href = "login.html";
    return;
  }

  if (userNameDisplay) {
    userNameDisplay.textContent = loggedUser.username || loggedUser.name;
    userNameDisplay.style.cursor = "pointer";
    userNameDisplay.onclick = () => {
      window.location.href = `/pages/profile.html`;
    };
  }

  if (userListsContainer) {
    renderUserLists(loggedUser.lists || [], userListsContainer);
  }

  // Render function
  // بدل onclick في renderUserLists
  function renderUserLists(lists, container) {
    if (!lists.length) {
      container.innerHTML = `<p class="noHave">You haven't created any lists yet.</p>`;
      return;
    }

    let html = "";

    // فلترة القوائم اللي عندها id فقط
    lists
      .filter((list) => list.id) // 👈 إضافة هذه الفلترة
      .forEach((list) => {
        html += `
          <div class="list-card" data-id="${list.id}">
            <h3>${list.name}</h3>
            <div class="items-count">${list.items.length} items</div>
            <i class="fa-solid fa-gear settings-icon"></i>
          </div>
        `;
      });

    container.innerHTML = html;

    container.querySelectorAll(".list-card").forEach((card) => {
      card.addEventListener("click", () => {
        const listId = card.dataset.id;
        window.location.href = `list.html?id=${listId}`;
      });
    });

    container.querySelectorAll(".settings-icon").forEach((icon) => {
      icon.addEventListener("click", (e) => {
        e.stopPropagation();
        const listId = e.target.closest(".list-card").dataset.id;
        openListSettings(e, listId);
      });
    });
  }

  window.openListSettings = function (e, listId) {
    e.stopPropagation();
    console.log("opened");

    const loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));
    const list = loggedUser.lists.find((l) => l.id === listId);
    if (!list) return;

    currentListId = listId;

    settingsListName.textContent = list.name;
    renameInput.value = list.name;

    // togglePrivacyBtn.textContent = list.public ? "Make Private" : "Make Public";

    // عرض المودال
    settingsModal.style.display = "flex";
  };

  renameBtn.onclick = () => {
    renameInput.classList.remove("hidden");
    saveRenameBtn.classList.remove("hidden");
  };

  saveRenameBtn.onclick = async () => {
    const newName = renameInput.value.trim();
    if (!newName) return;

    const loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));
    const list = loggedUser.lists.find((l) => l.id === currentListId);

    list.name = newName;

    sessionStorage.setItem("loggedUser", JSON.stringify(loggedUser));
    await updateUserLists(loggedUser);

    renderUserLists(loggedUser.lists);
    settingsModal.classList.add("hidden");
  };
  // togglePrivacyBtn.onclick = async () => {
  //   const loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));
  //   const list = loggedUser.lists.find((l) => l.id === currentListId);

  //   list.public = !list.public;

  //   sessionStorage.setItem("loggedUser", JSON.stringify(loggedUser));
  //   await updateUserLists(loggedUser);

  //   settingsModal.style.display = "none";
  // };

  async function updateUserLists(user) {
    try {
      // 1. تحديث مباشر لعمود الـ lists لليوزر ده بالظبط
      // مش محتاجين نـ Fetch كل اليوزرز ولا ندور على الـ Index
      const { error } = await supabaseClient
        .from("users")
        .update({ lists: user.lists }) // بنبعت المصفوفة الجديدة اللي جاية في الـ parameter
        .eq("id", user.id); // شرط التعديل

      if (error) throw error;

      console.log("✅ Lists updated successfully on Supabase");

      // 2. تحديث الـ SessionStorage عشان نضمن إن البيانات المحلية مطابقة للسيرفر
      sessionStorage.setItem("loggedUser", JSON.stringify(user));

      // 3. إعادة التحميل (اختياري لو عايز الـ UI يتحدث بالكامل)
      window.location.reload();
    } catch (err) {
      console.error("❌ Error updating user lists on Supabase:", err.message);
      alert("Something went wrong while syncing with the server.");
    }
  }

  deleteListBtn.onclick = async () => {
    if (!confirm("Are you sure you want to delete this list?")) return;

    const loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));

    loggedUser.lists = loggedUser.lists.filter((l) => l.id !== currentListId);

    sessionStorage.setItem("loggedUser", JSON.stringify(loggedUser));
    await updateUserLists(loggedUser);

    renderUserLists(loggedUser.lists);
    settingsModal.style.display = "none";
  };

  document.querySelectorAll(".close-modal").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const modal = e.target.closest(".list-modal");
      if (modal) modal.style.display = "none";
    });
  });

  document.querySelectorAll(".close-modal").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const modal = e.target.closest(".list-modal");
      if (modal) modal.style.display = "none";
    });
  });
});
