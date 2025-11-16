const BASE_URL = "http://localhost:5000/api";

if (localStorage.getItem("adminLogged") !== "yes") {
    window.location.href = "admin_login.html";
}

document.getElementById("uploadBtn").addEventListener("click", async () => {
    const fileInput = document.getElementById("csvFile");
    const message = document.getElementById("importMessage");

    if (!fileInput.files.length) {
        message.textContent = "Please select a CSV file.";
        message.style.color = "red";
        return;
    }

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    const res = await fetch(`${BASE_URL}/admin/import_questions`, {
        method: "POST",
        body: formData
    });

    const data = await res.json();

    if (data.success) {
        message.textContent = `Imported Successfully: ${data.imported} questions`;
        message.style.color = "green";
    } else {
        message.textContent = data.error || "Import failed.";
        message.style.color = "red";
    }
});
