document.addEventListener("DOMContentLoaded", () => {
  const BASE_URL = "https://smartmat-backend.onrender.com/api/auth/";

  const loginForm = document.getElementById("loginForm");
  const superuserForm = document.getElementById("superuserForm");
  const createSuperuserBtn = document.getElementById("createSuperuserBtn");
  const createSuperuserModal = document.getElementById("createSuperuserModal");
  const closeModal = document.getElementById("closeModal");
  const successMessage = document.getElementById("successMessage");
  const errorMessage = document.getElementById("errorMessage");
  const errorText = document.getElementById("errorText");

  function showSuccess(msg) {
    successMessage.querySelector("span").textContent = msg;
    successMessage.style.display = "block";
    setTimeout(() => (successMessage.style.display = "none"), 3000);
  }

  function showError(msg) {
    errorText.textContent = msg;
    errorMessage.style.display = "block";
    setTimeout(() => (errorMessage.style.display = "none"), 3000);
  }

  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch(`${BASE_URL}login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.non_field_errors?.[0] || "Login failed");

      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("username", data.username);
      localStorage.setItem("is_superuser", data.is_superuser);

      if (data.is_superuser) {
        showSuccess(`Welcome, ${data.username}`);
        setTimeout(() => {
          window.location.href = "index.html";
        }, 2000);
      } else {
        showError("Access denied: not a superuser.");
      }
    } catch (err) {
      showError(err.message);
    }
  });

  superuserForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const username = document.getElementById("superUsername").value;
    const email = document.getElementById("superEmail").value;
    const password = document.getElementById("superPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) return showError("Passwords do not match");

    try {
      const response = await fetch(`${BASE_URL}register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Registration failed");

      showSuccess("Superuser created successfully!");
      createSuperuserModal.style.display = "none";
      superuserForm.reset();
    } catch (err) {
      showError(err.message);
    }
  });

  createSuperuserBtn.onclick = () => {
    createSuperuserModal.style.display = "block";
    document.body.style.overflow = "hidden";
  };

  closeModal.onclick = () => {
    createSuperuserModal.style.display = "none";
    document.body.style.overflow = "auto";
  };

  window.onclick = (e) => {
    if (e.target === createSuperuserModal) {
      createSuperuserModal.style.display = "none";
      document.body.style.overflow = "auto";
    }
  };
});
