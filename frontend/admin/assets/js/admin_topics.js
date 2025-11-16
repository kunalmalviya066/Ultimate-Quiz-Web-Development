const BASE_URL = "https://exams-mock-backend.onrender.com/api";

// Protect page — require admin login
if (localStorage.getItem("adminLogged") !== "yes") {
    window.location.href = "admin_login.html";
}

document.addEventListener("DOMContentLoaded", () => {
    loadSubjects();
    document.getElementById("addTopicBtn").addEventListener("click", addTopic);
});


// ==========================
// Load Subjects Into Dropdown
// ==========================
async function loadSubjects() {
    const res = await fetch(`${BASE_URL}/admin/subjects`);
    const subjects = await res.json();

    const select = document.getElementById("subjectSelect");
    select.innerHTML = "";

    subjects.forEach(sub => {
        select.innerHTML += `<option value="${sub.id}">${sub.name}</option>`;
    });

    loadTopics();
    select.addEventListener("change", loadTopics);
}


// ==========================
// Load Topics of Selected Subject
// ==========================
async function loadTopics() {
    const subjectId = document.getElementById("subjectSelect").value;
    const table = document.getElementById("topicsTable");

    table.innerHTML = "<tr><td colspan='3'>Loading...</td></tr>";

    const res = await fetch(`${BASE_URL}/admin/topics/${subjectId}`);
    const data = await res.json();

    table.innerHTML = "";

    data.forEach(topic => {
        table.innerHTML += `
            <tr>
                <td>${topic.id}</td>
                <td>
                    <input type="text" value="${topic.name}" id="topic-${topic.id}" class="edit-input">
                </td>
                <td>
                    <button class="action-btn edit-btn" onclick="updateTopic(${topic.id})">Update</button>
                    <button class="action-btn delete-btn" onclick="deleteTopic(${topic.id})">Delete</button>
                </td>
            </tr>
        `;
    });
}


// ==========================
// Add New Topic
// ==========================
async function addTopic() {
    const name = document.getElementById("topicName").value;
    const subjectId = document.getElementById("subjectSelect").value;

    if (!name.trim()) {
        alert("Enter topic name");
        return;
    }

    await fetch(`${BASE_URL}/admin/topics`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ name, subject_id: subjectId })
    });

    document.getElementById("topicName").value = "";
    loadTopics();
}


// ==========================
// Update Topic
// ==========================
async function updateTopic(id) {
    const newName = document.getElementById(`topic-${id}`).value;

    await fetch(`${BASE_URL}/admin/topics/${id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ name: newName })
    });

    loadTopics();
}


// ==========================
// Delete Topic
// ==========================
async function deleteTopic(id) {
    if (!confirm("Delete this topic?")) return;

    await fetch(`${BASE_URL}/admin/topics/${id}`, {
        method: "DELETE"
    });

    loadTopics();
}
