document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const superuserForm = document.getElementById("superuserForm");
  const createBtn = document.getElementById("createSuperuserBtn");
  const closeBtn = document.getElementById("closeModal");
  const modal = document.getElementById("createSuperuserModal");
  const successMessage = document.getElementById("successMessage");
  const errorMessage = document.getElementById("errorMessage");
  const errorText = document.getElementById("errorText");

  // Login
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("/api/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) throw new Error("Invalid credentials");

      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);

      successMessage.style.display = "flex";
      setTimeout(() => {
        window.location.href = "/dashboard.html"; // Change as needed
      }, 1500);
    } catch (err) {
      errorText.innerText = err.message;
      errorMessage.style.display = "flex";
      setTimeout(() => (errorMessage.style.display = "none"), 2000);
    }
  });

  // Show modal
  createBtn.addEventListener("click", () => {
    modal.style.display = "block";
  });

  // Hide modal
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Superuser creation
  superuserForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("superUsername").value.trim();
    const email = document.getElementById("superEmail").value.trim();
    const password = document.getElementById("superPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("/api/auth/create-superuser/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) throw new Error("Superuser creation failed");

      alert("Superuser created successfully!");
      modal.style.display = "none";
    } catch (err) {
      alert(err.message);
    }
  });
});
