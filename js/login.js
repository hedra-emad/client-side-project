// "use strict";

// let isLoggingIn = false;
// const usernameInput = document.getElementById("username");
// const passwordInput = document.getElementById("password");
// const errorMsg = document.getElementById("error");

// // 1. تأكد من مسح أي مسافات زيادة في الـ BIN_ID
// const BIN_ID = "69a2d1c243b1c97be9a6492a";
// const API_KEY = "$2a$10$aEr.fC3BTS7ZDuBTSASOP.zrzFXN7aAmAy.4gdn5q2chWkiJaFY1a";

// async function login() {
//   if (isLoggingIn) return;
//   isLoggingIn = true;

//   const usernameOrEmail = usernameInput.value.trim();
//   const password = passwordInput.value.trim();

//   errorMsg.textContent = "";
//   errorMsg.style.color = "red";

//   if (!usernameOrEmail || !password) {
//     errorMsg.textContent = "Please fill in all fields";
//     isLoggingIn = false;
//     errorMsg.classList.remove("d-none");
//     return;
//   }

//   try {
//     // 2. إضافة الـ Headers عشان الـ API يقبل الطلب
//     const response = await fetch(
//       `https://api.jsonbin.io/v3/b/${BIN_ID}/latest`,
//       {
//         method: "GET",
//         headers: {
//           "X-Master-Key": API_KEY, // ضروري جداً للدخول على البيانات الخاصة
//         },
//       },
//     );

//     if (!response.ok) throw new Error("Failed to load users");

//     const data = await response.json();

//     // 3. في JSONbin البيانات الفعلية بتكون جوه خاصية اسمها record
//     let users = data.record.users;

//     const user = users.find(
//       (u) =>
//         (u.username === usernameOrEmail || u.email === usernameOrEmail) &&
//         u.password === password,
//     );

//     if (user) {
//       console.log("USER FOUND:", user);

//       sessionStorage.setItem(
//         "loggedUser",
//         JSON.stringify({
//           id: user.id || user._id,
//           username: user.username,
//           favorites: user.favorites || [],
//           loginAt: new Date().toISOString(),
//           lists: user.lists || [],
//         }),
//       );

//       const urlParams = new URLSearchParams(window.location.search);
//       const redirectUrl = urlParams.get("redirect") || "../index.html";
//       window.location.href = redirectUrl;
//     } else {
//       errorMsg.textContent = "Username or password is incorrect";
//       errorMsg.classList.remove("d-none");
//     }
//   } catch (error) {
//     errorMsg.textContent = "Something went wrong, try again later";
//     errorMsg.classList.remove("d-none");
//     console.error("Login Error:", error);
//   } finally {
//     isLoggingIn = false;
//   }
// }

// document.getElementById("loginForm").addEventListener("submit", (e) => {
//   e.preventDefault();
//   login();
// });

"use strict";
import { supabaseClient } from "./supabaseClient.js";
let isLoggingIn = false;
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const errorMsg = document.getElementById("error");

// لاحظ إننا بنستخدم supabaseClient اللي عرفناه في الملف التاني
async function login() {
  if (isLoggingIn) return;
  isLoggingIn = true;

  const usernameOrEmail = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  errorMsg.textContent = "";
  errorMsg.style.color = "red";
  errorMsg.classList.add("d-none");

  if (!usernameOrEmail || !password) {
    showError("Please fill in all fields");
    isLoggingIn = false;
    return;
  }

  try {
    // البحث عن المستخدم
    const { data: user, error } = await supabaseClient
      .from("users")
      .select("*")
      .or(`email.eq."${usernameOrEmail}",username.eq."${usernameOrEmail}"`)
      .maybeSingle();

    if (error) throw error;

    if (user && user.password === password) {
      console.log("Success! Welcome", user.username);
      sessionStorage.setItem(
        "loggedUser",
        JSON.stringify({
          id: user.id,
          username: user.username,
          favorites: user.favorites || [],
          lists: user.lists || [],
          loginAt: new Date().toISOString(),
        }),
      );
      window.location.href = "../index.html";
    } else {
      showError("Username or password incorrect");
    }
  } catch (err) {
    console.error("Detailed Error:", err);
    showError("Login failed, please check your credentials.");
  } finally {
    isLoggingIn = false;
  }
}

// دالة مساعدة لإظهار الخطأ
function showError(msg) {
  errorMsg.textContent = msg;
  errorMsg.classList.remove("d-none");
}

document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  login();
});
