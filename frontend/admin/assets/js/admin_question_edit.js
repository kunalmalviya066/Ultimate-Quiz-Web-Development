const BASE_URL = "http://localhost:5000/api";

// Protect page
if (localStorage.getItem("adminLogged") !== "yes") {
    window.location.href = "admin_login.html";
}

const urlParams = new URLSearchParams(window.location.search);
const qid = urlParams.get("id");

// Load question data
document.addEventListener("DOMContentLoaded", loadQuestion);

async function loadQuestion() {
    const res = await fetch(`${BASE_URL}/admin/questions/edit/${qid}`);
    const q = await res.json();

    document.getElementById("qText").value = q.question;
    document.getElementById("optA").value = q.option_a;
    document.getElementById("optB").value = q.option_b;
    document.getElementById("optC").value = q.option_c;
    document.getElementById("optD").value = q.option_d;
    document.getElementById("correctOpt").value = q.answer;
    document.getElementById("explanation").value = q.explanation;
   
}


// Save edits
document.getElementById("saveBtn").addEventListener("click", async () => {
    const payload = {
        question: document.getElementById("qText").value,
        option_a: document.getElementById("optA").value,
        option_b: document.getElementById("optB").value,
        option_c: document.getElementById("optC").value,
        option_d: document.getElementById("optD").value,
        answer: document.getElementById("correctOpt").value,
        explanation: document.getElementById("explanation").value
    };

    await fetch(`${BASE_URL}/admin/questions/edit/${qid}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload)
    });

    alert("Question updated successfully!");
    window.location.href = "questions.html";
});
