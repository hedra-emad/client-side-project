const loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));

function getRepoBasePath() {
  const path = window.location.pathname;
  if (path.includes("/pages/")) {
    return path.substring(0, path.indexOf("/pages/") + 1);
  }
  return path.endsWith("/") ? path : path.replace(/\/[^/]*$/, "/");
}
function updateGlobalNavbar() {
  const navbarFavIcon = document.querySelector("#navbarFav i");

  // Desktop
  const desktopUserProfile = document.querySelector(".d-lg-flex.userProfile");
  const desktopAuthButtons = document.querySelector(".d-lg-flex .authButtons");
  const desktopUserName = desktopUserProfile?.querySelector(".userNameDisplay");

  // Mobile
  const mobileUserProfile = document.querySelector(".d-lg-none.userProfile");
  const mobileAuthButtons = document.querySelector(".d-lg-none .authButtons");
  const mobileUserName = mobileUserProfile?.querySelector(".userNameDisplay");

  if (loggedUser) {
    desktopUserProfile?.classList.add("d-lg-flex");
    desktopUserProfile?.classList.remove("d-none");
    desktopAuthButtons?.classList.add("d-none");
    if (desktopUserName) {
      desktopUserName.textContent = loggedUser.username;

      desktopUserName.style.cursor = "pointer";
      desktopUserName.onclick = () => {
        const base = getRepoBasePath();
        window.location.href = `${window.location.origin}${base}pages/profile.html`;
      };
    }

    mobileUserProfile?.classList.add("d-flex");
    mobileUserProfile?.classList.remove("d-none");
    mobileAuthButtons?.classList.add("d-none");
    if (mobileUserName) {
      mobileUserName.textContent = loggedUser.username;

      mobileUserName.style.cursor = "pointer";
      mobileUserName.onclick = () => {
        const base = getRepoBasePath();
        window.location.href = `${window.location.origin}${base}pages/profile.html`;
      };
    }
  } else {
    desktopUserProfile?.classList.remove("d-lg-flex");
    desktopUserProfile?.classList.add("d-none");
    desktopAuthButtons?.classList.remove("d-none");

    mobileUserProfile?.classList.remove("d-flex");
    mobileUserProfile?.classList.add("d-none");
    mobileAuthButtons?.classList.remove("d-none");
  }
  // Logout buttons (desktop & mobile)
  const logoutBtns = document.querySelectorAll(".logoutBtn");
  logoutBtns.forEach((btn) => {
    btn.onclick = (e) => {
      e.preventDefault();
      // console.log(desktopUserProfile)

      sessionStorage.removeItem("loggedUser");

      desktopUserProfile?.classList.remove("d-lg-flex");

      desktopUserProfile?.classList.add("d-none");

      desktopAuthButtons?.classList.remove("d-none");
      // desktopUserName.classList.add('d-none')

      mobileUserProfile?.classList.add("d-none");
      mobileAuthButtons?.classList.remove("d-none");

      setTimeout(() => {
        const base = getRepoBasePath();
        window.location.href = `${window.location.origin}${base}index.html`;
      }, 50);
    };
  });

  if (navbarFavIcon) {
    if (loggedUser && loggedUser.favorites && loggedUser.favorites.length > 0) {
      navbarFavIcon.style.color = "red";
    } else {
      navbarFavIcon.style.color = "gray";
    }
  }
}

document.addEventListener("DOMContentLoaded", updateGlobalNavbar);

// Handle login/register button clicks
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-login")) {
    const currentUrl = encodeURIComponent(window.location.href);
    const base = getRepoBasePath();
    window.location.href = `${window.location.origin}${base}pages/login.html?redirect=${currentUrl}`;
  }
  if (e.target.classList.contains("registerBtn")) {
    const currentUrl = encodeURIComponent(window.location.href);
    const base = getRepoBasePath();
    window.location.href = `${window.location.origin}${base}pages/registration.html?redirect=${currentUrl}`;
  }
});

const navbarFavIcon = document.querySelector("#navbarFav i");

if (
  navbarFavIcon &&
  loggedUser &&
  loggedUser.favorites &&
  loggedUser.favorites.length > 0
) {
  navbarFavIcon.style.color = "red";
} else if (navbarFavIcon) {
  navbarFavIcon.style.color = "gray";
}

export function refreshNavbarFavColor() {
  const loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));
  const favIcons = document.querySelectorAll(".favourite i"); // كل الفاف في الديسكتوب والموبايل

  favIcons.forEach((icon) => {
    if (loggedUser && loggedUser.favorites && loggedUser.favorites.length > 0) {
      icon.style.color = "red";
    } else {
      icon.style.color = "gray";
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateGlobalNavbar();
  refreshNavbarFavColor();
});
