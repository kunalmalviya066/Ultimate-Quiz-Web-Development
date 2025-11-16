const BASE_URL = "http://localhost:5000/api";

if (localStorage.getItem("adminLogged") !== "yes") {
    window.location.href = "admin_login.html";
}

document.addEventListener("DOMContentLoaded", () => {
    loadSubjects();
    document.getElementById("addQBtn").addEventListener("click", addQuestion);
});


// =======================================
// Load Subjects
// =======================================
async function loadSubjects() {
    const res = await fetch(`${BASE_URL}/admin/subjects`);
    const subjects = await res.json();

    const subSelect = document.getElementById("subjectSelect");
    subSelect.innerHTML = "";

    subjects.forEach(sub => {
        subSelect.innerHTML += `<option value="${sub.id}">${sub.name}</option>`;
    });

    subSelect.addEventListener("change", loadTopics);
    loadTopics();
}


// =======================================
// Load Topics based on Subject
// =======================================
async function loadTopics() {
    const subjectId = document.getElementById("subjectSelect").value;

    const res = await fetch(`${BASE_URL}/admin/topics/${subjectId}`);
    const topics = await res.json();

    const topicSelect = document.getElementById("topicSelect");
    topicSelect.innerHTML = "";

    topics.forEach(t => {
        topicSelect.innerHTML += `<option value="${t.id}">${t.name}</option>`;
    });

    topicSelect.addEventListener("change", loadQuestions);
    loadQuestions();
}


// =======================================
// Load Questions under topic
// =======================================
async function loadQuestions() {
    const topicId = document.getElementById("topicSelect").value;
    const table = document.getElementById("questionsTable");

    table.innerHTML = "<tr><td colspan='3'>Loading...</td></tr>";

    const res = await fetch(`${BASE_URL}/admin/questions/${topicId}`);
    const data = await res.json();

    table.innerHTML = "";

    data.forEach(q => {
        table.innerHTML += `
            <tr>
                <td>${q.id}</td>
                <td>${q.question.substring(0, 70)}...</td>
                <td>
                    <button class="action-btn edit-btn" onclick="editQuestion(${q.id})">Edit</button>
                    <button class="action-btn delete-btn" onclick="deleteQuestion(${q.id})">Delete</button>
                </td>
            </tr>
        `;
    });
}


// =======================================
// ADD Question
// =======================================
async function addQuestion() {
    const topic = document.getElementById("topicSelect").value;

    let image_url = null;
    const imageFile = document.getElementById("qImage").files[0];

    // Upload Image first if exists
    if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);

        const imgRes = await fetch(`${BASE_URL}/admin/upload_image`, {
            method: "POST",
            body: formData
        });

        const imgData = await imgRes.json();
        if (imgData.success) {
            image_url = imgData.url;
        }
    }

    // Save Question
    const payload = {
        topic_id: topic,
        question: document.getElementById("qText").value,
        option_a: document.getElementById("optA").value,
        option_b: document.getElementById("optB").value,
        option_c: document.getElementById("optC").value,
        option_d: document.getElementById("optD").value,
        answer: document.getElementById("correctOpt").value,
        explanation: document.getElementById("explanation").value,
        image_url
    };

    await fetch(`${BASE_URL}/admin/questions`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload)
    });

    alert("Question added with image!");
    loadQuestions();
}



// =======================================
// DELETE Question
// =======================================
async function deleteQuestion(id) {
    if (!confirm("Delete this question?")) return;

    await fetch(`${BASE_URL}/admin/questions/${id}`, {
        method: "DELETE"
    });

    loadQuestions();
}


// =======================================
// EDIT Question (redirect to edit page)
// =======================================
function editQuestion(id) {
    window.location.href = `question_edit.html?id=${id}`;
}

