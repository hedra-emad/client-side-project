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
