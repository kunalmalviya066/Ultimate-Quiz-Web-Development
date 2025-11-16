// =======================================================
// INITIAL SETUP
// =======================================================
const BASE_URL = "http://localhost:5000";

let quizSettings = JSON.parse(localStorage.getItem("quizSettings"));
let questions = [];
let currentIndex = 0;
let userAnswers = {};
let reviewMarks = {};


// =======================================================
// WHEN PAGE LOADS → START QUIZ
// =======================================================
document.addEventListener("DOMContentLoaded", () => {
    if (!quizSettings) {
        alert("Quiz settings not found. Returning to home.");
        window.location.href = "index.html";
        return;
    }

    loadQuestions();
});


// =======================================================
// FETCH QUESTIONS FROM BACKEND
// =======================================================
async function loadQuestions() {
    try {
        const url = `${BASE_URL}/api/questions?topics=${quizSettings.topics.join(",")}&limit=${quizSettings.questionCount}`;
        const res = await fetch(url);
        questions = await res.json();

        if (!questions.length) {
            alert("No questions available for selected filters.");
            window.location.href = "index.html";
        }

        buildQuestionPanel();
        showQuestion(0);

        // Start Timer if applicable
        if (quizSettings.timerValue > 0) {
            startTimer(quizSettings.timerValue * 60); // convert minutes to seconds
        }

    } catch (err) {
        console.error(err);
        alert("Error loading questions.");
    }
}


// =======================================================
// DISPLAY A QUESTION
// =======================================================
function showQuestion(index) {
    currentIndex = index;

    const q = questions[index];
    document.getElementById("questionText").innerText = q.question;

    // Update question count
    document.getElementById("questionCounter").innerText =
        `Question ${index + 1} / ${questions.length}`;

    // Highlight current question number in right panel
    highlightCurrentQuestion(index);

    // Render options
    const container = document.getElementById("optionsContainer");
    container.innerHTML = "";

    q.options.forEach((opt, idx) => {
        const isChecked = userAnswers[index] === idx ? "checked" : "";

        const html = `
            <label>
                <input type="radio" name="option" value="${idx}" ${isChecked}>
                ${opt}
            </label>
        `;
        container.insertAdjacentHTML("beforeend", html);
    });

    // Re-apply review status color
    updatePanelColors();
}


// =======================================================
// SAVE SELECTED ANSWER
// =======================================================
document.addEventListener("change", (e) => {
    if (e.target.name === "option") {
        userAnswers[currentIndex] = parseInt(e.target.value);
        updatePanelColors();
    }
});


// =======================================================
// NEXT & PREVIOUS BUTTONS
// =======================================================
document.getElementById("nextBtn").addEventListener("click", () => {
    if (currentIndex < questions.length - 1) {
        showQuestion(currentIndex + 1);
    }
});

document.getElementById("prevBtn").addEventListener("click", () => {
    if (currentIndex > 0) {
        showQuestion(currentIndex - 1);
    }
});


// =======================================================
// MARK FOR REVIEW
// =======================================================
document.getElementById("markReviewBtn").addEventListener("click", () => {
    reviewMarks[currentIndex] = !reviewMarks[currentIndex];
    updatePanelColors();
});


// =======================================================
// BUILD RIGHT SIDE QUESTION PANEL
// =======================================================
function buildQuestionPanel() {
    const container = document.getElementById("questionList");
    container.innerHTML = "";

    questions.forEach((_, i) => {
        const html = `
            <div class="question-num" data-id="${i}">
                ${i + 1}
            </div>
        `;
        container.insertAdjacentHTML("beforeend", html);
    });

    // Click event to navigate
    document.querySelectorAll(".question-num").forEach(btn => {
        btn.addEventListener("click", () => {
            showQuestion(parseInt(btn.dataset.id));
        });
    });
}


// =======================================================
// UPDATE COLORS BASED ON ANSWERED/REVIEW/CURRENT
// =======================================================
function updatePanelColors() {
    const buttons = document.querySelectorAll(".question-num");

    buttons.forEach(btn => {
        const id = parseInt(btn.dataset.id);
        btn.classList.remove("answered", "review", "current");

        if (id === currentIndex) {
            btn.classList.add("current");
        }
        if (userAnswers[id] !== undefined) {
            btn.classList.add("answered");
        }
        if (reviewMarks[id]) {
            btn.classList.add("review");
        }
    });
}


// =======================================================
// HIGHLIGHT CURRENT QUESTION
// =======================================================
function highlightCurrentQuestion(id) {
    document.querySelectorAll(".question-num").forEach(btn => {
        btn.classList.remove("current");
    });
    document.querySelector(`.question-num[data-id="${id}"]`).classList.add("current");
}


// =======================================================
// SUBMIT QUIZ
// =======================================================
document.getElementById("submitBtn").addEventListener("click", async () => {
    if (!confirm("Are you sure you want to submit the quiz?")) return;

    const payload = {
        quizSettings,
        answers: userAnswers,
        reviewMarks,
        totalQuestions: questions.length,
        questionIds: questions.map(q => q.id)
    };

    // Send answers to backend
    try {
        const res = await fetch(`${BASE_URL}/api/submit_quiz`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        // Save result ID
        localStorage.setItem("resultId", data.resultId);

        // Go to result page
        window.location.href = "result.html";

    } catch (err) {
        console.error(err);
        alert("Error submitting quiz.");
    }
});
