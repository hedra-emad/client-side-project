let isLoggingIn = false;

async function login() {
  if (isLoggingIn) return;
  isLoggingIn = true;

  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const errorMsg = document.getElementById("error");

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  errorMsg.textContent = "";
  errorMsg.style.color = "red";

  /* ========= Validation ========= */
  if (!username || !password) {
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
    const response = await fetch("js/users.json");

    if (!response.ok) {
      throw new Error("Failed to load users");
    }

    const users = await response.json();

    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      /* ========= Save login state ========= */
      localStorage.setItem(
        "loggedUser",
        JSON.stringify({
          username: user.username,
          loginAt: new Date().toISOString(),
        })
      );

      window.location.href = "index.html";
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
