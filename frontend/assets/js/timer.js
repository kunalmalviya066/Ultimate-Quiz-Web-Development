let timerInterval;
let timeLeft = 0;
let timerStarted = false; // to prevent resetting on resume

// =======================================================
// START TIMER
// =======================================================
function startTimer(seconds = null) {

    // If seconds is given (first time start) → set timeLeft
    if (seconds !== null && !timerStarted) {
        timeLeft = seconds;
        timerStarted = true;
    }

    // Do not start a new timer if already running
    clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        timeLeft--;

        updateTimerUI();

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            autoSubmit();
        }
    }, 1000);
}


// =======================================================
// UPDATE TIMER DISPLAY
// =======================================================
function updateTimerUI() {
    const timerEl = document.getElementById("timer");

    let mins = Math.floor(timeLeft / 60);
    let secs = timeLeft % 60;

    // Format
    if (mins < 10) mins = "0" + mins;
    if (secs < 10) secs = "0" + secs;

    timerEl.textContent = `${mins}:${secs}`;

    // Color warning
    if (timeLeft <= 60) {
        timerEl.style.color = "#e74c3c";
    } else if (timeLeft <= 180) {
        timerEl.style.color = "#f39c12";
    } else {
        timerEl.style.color = "#2c3e50";
    }
}


// =======================================================
// AUTO SUBMIT WHEN TIME ENDS
// =======================================================
function autoSubmit() {
    alert("Time is up! Submitting your quiz...");
    document.getElementById("submitBtn").click();
}
