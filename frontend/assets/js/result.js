const BASE_URL = "https://exams-mock-backend.onrender.com";

let resultId = localStorage.getItem("resultId");

if (!resultId) {
    alert("No result found. Redirecting to home.");
    window.location.href = "index.html";
}


// =======================================================
// FETCH RESULT DATA
// =======================================================
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const res = await fetch(`${BASE_URL}/api/get_result/${resultId}`);
        const data = await res.json();

        populateSummary(data);
        generateTopicChart(data.topicAnalysis);
        loadReview(data.review);

    } catch (err) {
        console.error(err);
        alert("Error loading results.");
    }
});


// =======================================================
// POPULATE SUMMARY SECTION
// =======================================================
function populateSummary(data) {
    document.getElementById("scoreDisplay").innerText =
        `${data.correct} / ${data.total}`;

    document.getElementById("totalQ").innerText = data.total;
    document.getElementById("correctQ").innerText = data.correct;
    document.getElementById("incorrectQ").innerText = data.incorrect;

    let accuracy = ((data.correct / data.total) * 100).toFixed(1);
    document.getElementById("accuracy").innerText = accuracy + "%";

    document.getElementById("timeTaken").innerText = data.timeTaken || "--";
}


// =======================================================
// TOPIC PERFORMANCE CHART (Chart.js)
// =======================================================
function generateTopicChart(topicData) {
    if (!topicData || topicData.length === 0) return;

    const ctx = document.getElementById("topicChart").getContext("2d");

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: topicData.map(t => t.topic),
            datasets: [{
                label: "Correct Answers",
                data: topicData.map(t => t.correct),
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}


// =======================================================
// LOAD DETAILED ANSWER REVIEW
// =======================================================
function loadReview(reviewList) {
    const container = document.getElementById("reviewContainer");
    container.innerHTML = "";

    reviewList.forEach((item, index) => {
        const userCorrect = item.userAnswer === item.correctAnswer;

        let optionsHTML = "";
        item.options.forEach((opt, i) => {
            let cls = "";
            if (i === item.correctAnswer) cls = "correct";
            if (i === item.userAnswer && !userCorrect) cls = "wrong";

            optionsHTML += `
                <p class="option ${cls}">
                    ${String.fromCharCode(65 + i)}. ${opt}
                </p>
            `;
        });

        const html = `
            <div class="review-card">
                <h3>Q${index + 1}. ${item.question}</h3>

                ${optionsHTML}

                <div class="explanation">
                    <strong>Explanation:</strong><br>
                    ${item.explanation}
                </div>
            </div>
        `;

        container.insertAdjacentHTML("beforeend", html);
    });
}
