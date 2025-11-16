// ==============================
// Load Subjects on Page Load
// ==============================
document.addEventListener("DOMContentLoaded", () => {
    loadSubjects();
});

// Backend Base URL (Change according to Flask/FastAPI URL)
const BASE_URL = "http://localhost:5000";


// ==============================
// Fetch Subjects from Backend
// ==============================
async function loadSubjects() {
    const container = document.getElementById("subjectsContainer");
    container.innerHTML = "Loading...";

    try {
        const res = await fetch(`${BASE_URL}/api/subjects`);
        const data = await res.json();

        container.innerHTML = "";

        data.forEach(subject => {
            const html = `
                <label>
                    <input type="checkbox" class="subject-checkbox" value="${subject.id}">
                    ${subject.name}
                </label>
            `;
            container.insertAdjacentHTML("beforeend", html);
        });

        // When subjects change → load topics
        attachSubjectEvents();

    } catch (err) {
        container.innerHTML = "<p>Error loading subjects.</p>";
        console.error(err);
    }
}


// ==============================
// Attach Checkbox Event
// ==============================
function attachSubjectEvents() {
    const checkboxes = document.querySelectorAll(".subject-checkbox");
    checkboxes.forEach(cb =>
        cb.addEventListener("change", loadTopics)
    );
}


// ==============================
// Fetch Topics Based on Subjects
// ==============================
async function loadTopics() {
    const selectedSubjects = [...document.querySelectorAll(".subject-checkbox:checked")]
        .map(cb => cb.value);

    const container = document.getElementById("topicsContainer");

    if (selectedSubjects.length === 0) {
        container.innerHTML = "<p>Select subject(s) first.</p>";
        return;
    }

    container.innerHTML = "Loading topics...";

    try {
        const res = await fetch(`${BASE_URL}/api/topics?subjects=${selectedSubjects.join(",")}`);
        const data = await res.json();

        container.innerHTML = "";

        data.forEach(topic => {
            const html = `
                <label>
                    <input type="checkbox" class="topic-checkbox" value="${topic.id}">
                    ${topic.name}
                </label>
            `;
            container.insertAdjacentHTML("beforeend", html);
        });

    } catch (err) {
        container.innerHTML = "<p>Error loading topics.</p>";
        console.error(err);
    }
}


// ==============================
// Start Quiz Button Handler
// ==============================
document.getElementById("startQuizBtn").addEventListener("click", () => {
    const quizType = document.getElementById("quizType").value;

    const subjects = [...document.querySelectorAll(".subject-checkbox:checked")]
        .map(cb => cb.value);

    const topics = [...document.querySelectorAll(".topic-checkbox:checked")]
        .map(cb => cb.value);

    const questionCount = document.getElementById("questionCount").value;
    const timerValue = document.getElementById("timerValue").value;

    // Basic Validations
    if (quizType === "custom" && subjects.length === 0) {
        alert("Select at least one subject.");
        return;
    }

    if (quizType !== "dailyMock" && questionCount <= 0) {
        alert("Enter a valid number of questions.");
        return;
    }

    // Build Quiz Request Object
    const quizSettings = {
        quizType,
        subjects,
        topics,
        questionCount,
        timerValue
    };

    // Save settings before redirect
    localStorage.setItem("quizSettings", JSON.stringify(quizSettings));

    // Go to quiz page
    window.location.href = "quiz.html";
});
