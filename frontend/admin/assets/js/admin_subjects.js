const BASE_URL = "http://localhost:5000/api";

if (localStorage.getItem("adminLogged") !== "yes") {
    window.location.href = "admin_login.html";
}

document.addEventListener("DOMContentLoaded", () => {
    loadSubjects();
});

document.getElementById("addBtn").addEventListener("click", addSubject);

// ==============================
// Load Subjects
// ==============================
async function loadSubjects() {
    const table = document.getElementById("subjectsTable");
    table.innerHTML = "<tr><td colspan='3'>Loading...</td></tr>";

    const res = await fetch(`${BASE_URL}/admin/subjects`);
    const data = await res.json();

    table.innerHTML = "";

    data.forEach(sub => {
        table.innerHTML += `
            <tr>
                <td>${sub.id}</td>
                <td>
                    <input type="text" value="${sub.name}" id="name-${sub.id}" class="edit-input">
                </td>
                <td>
                    <button class="action-btn edit-btn" onclick="updateSubject(${sub.id})">Update</button>
                    <button class="action-btn delete-btn" onclick="deleteSubject(${sub.id})">Delete</button>
                </td>
            </tr>
        `;
    });
}

// ==============================
// Add Subject
// ==============================
async function addSubject() {
    const name = document.getElementById("subjectName").value;

    if (!name.trim()) {
        alert("Enter subject name");
        return;
    }

    await fetch(`${BASE_URL}/admin/subjects`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({name})
    });

    document.getElementById("subjectName").value = "";
    loadSubjects();
}

// ==============================
// Update Subject
// ==============================
async function updateSubject(id) {
    const name = document.getElementById(`name-${id}`).value;

    await fetch(`${BASE_URL}/admin/subjects/${id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({name})
    });

    loadSubjects();
}

// ==============================
// Delete Subject
// ==============================
async function deleteSubject(id) {
    if (!confirm("Delete this subject?")) return;

    await fetch(`${BASE_URL}/admin/subjects/${id}`, {
        method: "DELETE"
    });

    loadSubjects();
}
