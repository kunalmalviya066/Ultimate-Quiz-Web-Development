const BASE_URL = "https://exams-mock-backend.onrender.com/api";

document.getElementById("loginBtn").addEventListener("click", async () => {
    const username = document.getElementById("adminUser").value;
    const password = document.getElementById("adminPass").value;

    const res = await fetch(`${BASE_URL}/admin/login`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({username, password})
    });

    const data = await res.json();

    if (data.success) {
        localStorage.setItem("adminLogged", "yes");
        window.location.href = "admin_dashboard.html";
    } else {
        document.getElementById("errorMsg").innerText = data.message;
    }
});
