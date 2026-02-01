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

function updateGlobalNavbar() {
  const userProfile = document.getElementById("userProfile");
  const authButtons = document.getElementById("authButtons");
  const userNameDisplay = document.getElementById("userNameDisplay");
  const logoutBtn = document.getElementById("logoutBtn");

  const loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));

  if (loggedUser) {
    if (authButtons)
      authButtons.style.setProperty("display", "none", "important");
    if (userProfile) {
      userProfile.style.setProperty("display", "flex", "important");
      userNameDisplay.textContent = loggedUser.username;
    }
  } else {
    if (authButtons)
      authButtons.style.setProperty("display", "flex", "important");
    if (userProfile)
      userProfile.style.setProperty("display", "none", "important");
  }

  if (logoutBtn) {
    logoutBtn.onclick = () => {
      sessionStorage.clear();

      window.location.href = "/index.html";
    };
  }
}
document.addEventListener("DOMContentLoaded", updateGlobalNavbar);
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-login")) {
    window.location.href = "/pages/login.html";
  }
  if (e.target.id === "registerBtn") {
    window.location.href = "/pages/registration.html";
  }
});
