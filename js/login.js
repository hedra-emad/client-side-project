"use strict";

let isLoggingIn = false;
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const errorMsg = document.getElementById("error");

async function login() {
  if (isLoggingIn) return;
  isLoggingIn = true;

  const usernameOrEmail = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  errorMsg.textContent = "";
  errorMsg.style.color = "red";

  /* ========= Validation ========= */
  if (!usernameOrEmail || !password) {
    errorMsg.textContent = "Please fill in all fields";
    isLoggingIn = false;
    errorMsg.classList.remove("d-none");
    return;
  }

  if (password.length < 4) {
    errorMsg.textContent = "Password must be at least 4 characters";
    isLoggingIn = false;
    errorMsg.classList.remove("d-none");
    return;
  }

  try {
    const response = await fetch("../data/users.json");

    if (!response.ok) throw new Error("Failed to load users");

    const data = await response.json();

    const users = data.users;

    const user = users.find(
      (u) =>
        (u.username === usernameOrEmail || u.email === usernameOrEmail) &&
        u.password === password
    );

    if (user) {
      localStorage.setItem(
        "loggedUser",
        JSON.stringify({
          username: user.username,
          loginAt: new Date().toISOString(),
        })
      );

      window.location.href = "../index.html";
    } else {
      errorMsg.textContent = "Username or password is incorrect";
      errorMsg.classList.remove("d-none");
    }
  } catch (error) {
    errorMsg.textContent = "Something went wrong, try again later";
    errorMsg.classList.remove("d-none");
    console.error(error);
  } finally {
    isLoggingIn = false;
  }
}

document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  login();
});
