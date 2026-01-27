const toggleBtn = document.getElementById("toggleBtn");
const sideNav = document.getElementById("sideNav");

toggleBtn.addEventListener("click", () => {
  sideNav.classList.toggle("open");

  if (sideNav.classList.contains("open")) {
    toggleBtn.classList.remove("fa-bars");
    toggleBtn.classList.add("fa-xmark");
  } else {
    toggleBtn.classList.remove("fa-xmark");
    toggleBtn.classList.add("fa-bars");
  }
});
