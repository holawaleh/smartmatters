// auth.js
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  // ✅ Guard protected pages
  if (!token && window.location.pathname.includes("index.html")) {
    window.location.href = "login.html";
  }

  // ✅ Setup logout button if exists
  const logoutBtn = document.querySelector(".btn.btn-outline");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      window.location.href = "login.html";
    });
  }

  // ✅ Show logged-in user
  const userInfo = document.querySelector(".user-info span");
  if (userInfo) {
    userInfo.textContent = `Welcome, ${localStorage.getItem("username") || "Admin"}`;
  }
});
