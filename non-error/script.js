// Redirect to login.html if no token
const token = localStorage.getItem("auth_token");
if (!token) {
  window.location.href = "login.html";
}

// Logout functionality
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("username");
  localStorage.removeItem("is_superuser");
  window.location.href = "login.html";
});

// Optional: Auto logout after 1 hour of inactivity
let logoutTimer = setTimeout(autoLogout, 60 * 60 * 1000); // 1 hour

function autoLogout() {
  alert("Session expired. Logging out.");
  localStorage.clear();
  window.location.href = "login.html";
}

function resetTimer() {
  clearTimeout(logoutTimer);
  logoutTimer = setTimeout(autoLogout, 60 * 60 * 1000);
}

window.addEventListener("mousemove", resetTimer);
window.addEventListener("keydown", resetTimer);
