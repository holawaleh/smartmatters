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
