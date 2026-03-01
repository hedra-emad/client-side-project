// "use strict";

// const form = document.getElementById("signupForm");
// const errorMsg = document.getElementById("error");

// // نفس البيانات اللي استخدمناها في الـ Login
// const BIN_ID = "69a2d1c243b1c97be9a6492a";
// const API_KEY = "$2a$10$aEr.fC3BTS7ZDuBTSASOP.zrzFXN7aAmAy.4gdn5q2chWkiJaFY1a";

// form.addEventListener("submit", async function (e) {
//   e.preventDefault();

//   const username = form.username.value.trim();
//   const email = form.email.value.trim();
//   const phone = form.phone.value.trim();
//   const password = form.password.value.trim();

//   errorMsg.textContent = "";
//   errorMsg.style.color = "red";
//   errorMsg.classList.add("d-none");

//   // --- التقييمات الأساسية (Validation) ---
//   if (!username || !email || !phone || !password) {
//     errorMsg.textContent = "Please fill in all fields";
//     errorMsg.classList.remove("d-none");
//     return;
//   }

//   const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   if (!emailPattern.test(email)) {
//     errorMsg.textContent = "Please enter a valid email address";
//     errorMsg.classList.remove("d-none");
//     return;
//   }

//   // --- بداية عملية الربط مع API ---
//   try {
//     // 1. جلب البيانات الحالية من السيرفر
//     const getResponse = await fetch(
//       `https://api.jsonbin.io/v3/b/${BIN_ID}/latest`,
//       {
//         method: "GET",
//         headers: { "X-Master-Key": API_KEY },
//       },
//     );

//     if (!getResponse.ok) throw new Error("Failed to fetch users");

//     const data = await getResponse.json();
//     let users = data.record.users; // مصفوفة المستخدمين الحالية

//     // 2. التأكد من عدم تكرار الإيميل أو اسم المستخدم
//     const isExist = users.find(
//       (u) => u.email === email || u.username === username,
//     );
//     if (isExist) {
//       errorMsg.textContent = "Email or Username already exists!";
//       errorMsg.classList.remove("d-none");
//       return;
//     }

//     // 3. تجهيز المستخدم الجديد
//     const newUser = {
//       id: crypto.randomUUID().slice(0, 4),
//       username,
//       email,
//       phone,
//       password,
//       favorites: [],
//       lists: [],
//     };

//     // 4. إضافة المستخدم الجديد للقائمة ورفعها كاملة (PUT)
//     users.push(newUser);

//     const updateResponse = await fetch(
//       `https://api.jsonbin.io/v3/b/${BIN_ID}`,
//       {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           "X-Master-Key": API_KEY,
//         },
//         body: JSON.stringify({ users: users }),
//       },
//     );

//     if (!updateResponse.ok) throw new Error("Failed to update database");

//     // 5. حفظ الجلسة والتوجيه
//     form.reset();
//     sessionStorage.setItem(
//       "loggedUser",
//       JSON.stringify({
//         id: newUser.id,
//         username: newUser.username,
//         favorites: [],
//         loginAt: new Date().toISOString(),
//       }),
//     );

//     const redirectUrl =
//       sessionStorage.getItem("redirectAfterLogin") || "/index.html";
//     sessionStorage.removeItem("redirectAfterLogin");
//     window.location.href = redirectUrl;
//   } catch (error) {
//     errorMsg.textContent = "Service unavailable, please try again later";
//     errorMsg.classList.remove("d-none");
//     console.error(error);
//   }
// });

"use strict";

// تأكد أن ملف supabaseClient.js مستدعى قبل هذا الملف في الـ HTML
import { supabaseClient } from "./supabaseClient.js";

const form = document.getElementById("signupForm");
const errorMsg = document.getElementById("error");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const username = form.username.value.trim();
  const email = form.email.value.trim();
  const phone = form.phone.value.trim();
  const password = form.password.value.trim();

  // إعادة ضبط رسالة الخطأ
  errorMsg.textContent = "";
  errorMsg.style.color = "red";
  errorMsg.classList.add("d-none");

  // --- 1. التقييمات الأساسية (Validation) ---
  if (!username || !email || !phone || !password) {
    showError("Please fill in all fields");
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    showError("Please enter a valid email address");
    return;
  }

  // التحقق من رقم الهاتف (مثال: 10 أرقام فقط)
  const phonePattern = /^[0][0-9]{10}$/; // يبدأ بـ 0 ويليه 10 أرقام
  if (!phonePattern.test(phone)) {
    showError("Please enter a valid 11-digit phone number starting with 0");
    return;
  }

  // التحقق من قوة كلمة المرور (مثال: 6 أحرف على الأقل)
  if (password.length < 6) {
    showError("Password must be at least 6 characters long");
    return;
  }

  // --- 2. عملية الربط مع Supabase ---
  try {
    // أ. التأكد من عدم تكرار الإيميل أو اسم المستخدم (Select)
    const { data: existingUser, error: checkError } = await supabaseClient
      .from("users")
      .select("email, username")
      .or(`email.eq.${email},username.eq.${username}`)
      .maybeSingle();

    if (checkError) throw checkError;

    if (existingUser) {
      showError("Email or Username already exists!");
      return;
    }

    const newUser = {
      id: crypto.randomUUID(),
      username,
      email,
      phone,
      password,
      favorites: [],
      lists: [],
    };

    const { error: insertError } = await supabaseClient
      .from("users")
      .insert([newUser]);

    if (insertError) throw insertError;

    // ج. حفظ الجلسة والتوجيه
    sessionStorage.setItem(
      "loggedUser",
      JSON.stringify({
        id: newUser.id,
        username: newUser.username,
        favorites: [],
        lists: [], //
        loginAt: new Date().toISOString(),
      })
    );

    form.reset();

    const urlParams = new URLSearchParams(window.location.search);
    const redirectParam = urlParams.get("redirect");
    if (redirectParam) {
      try {
        const decoded = decodeURIComponent(redirectParam);
        window.location.href = decoded;
      } catch (e) {
        window.location.href = "../index.html";
      }
    } else {
      window.location.href = "../index.html";
    }
  } catch (error) {
    showError("Service unavailable, please try again later");
    console.error("Supabase Error:", error.message);
  }
});

// دالة مساعدة لإظهار الخطأ
function showError(msg) {
  errorMsg.textContent = msg;
  errorMsg.classList.remove("d-none");
}
