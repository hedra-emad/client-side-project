"use strict";

const form = document.getElementById("signupForm");
const errorMsg = document.getElementById("error");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const username = form.username.value.trim();
  const email = form.email.value.trim();
  const phone = form.phone.value.trim();
  const password = form.password.value.trim();

  errorMsg.textContent = "";
  errorMsg.style.color = "red";
  errorMsg.classList.add("d-none");

  if (!username || !email || !phone || !password) {
    errorMsg.textContent = "Please fill in all fields";
    errorMsg.classList.remove("d-none");
    return;
  }

  if (password.length < 4) {
    errorMsg.textContent = "Password must be at least 4 characters";
    errorMsg.classList.remove("d-none");
    return;
  }

  const newUser = {
    id: crypto.randomUUID().slice(0, 4),
    username,
    email,
    phone,
    password,
    favorites: [],
  };

  try {
    const checkResponse = await fetch(
      `http://localhost:3000/users?email=${email}`,
    );
    const existingUsers = await checkResponse.json();

    if (existingUsers.length > 0) {
      errorMsg.textContent = "This email is already registered!";
      errorMsg.classList.remove("d-none");
      return;
    }

    const response = await fetch("http://localhost:5501/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });

    if (!response.ok) throw new Error("Failed to register");

    form.reset();
    sessionStorage.setItem(
      "loggedUser",
      JSON.stringify({
        username: newUser.username,
        fav: newUser.favorites,
        loginAt: new Date().toISOString(),
      }),
    );
    console.log("Redirecting to index...");
    window.location.href = "/index.html";
  } catch (error) {
    errorMsg.textContent = "Something went wrong, try again later";
    errorMsg.classList.remove("d-none");
  }
});
