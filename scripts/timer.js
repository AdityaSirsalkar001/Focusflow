// Timer Variables
let timerInterval;
let timeLeft = 25 * 60;
let isFocusMode = false;
let isBreakTime = false;
let totalFocusedTime = parseInt(localStorage.getItem('totalFocusedTime')) || 0;
let sessionsToday = parseInt(localStorage.getItem('sessionsToday')) || 0;
let currentSessionMinutes = 25;
const breakTime = 5 * 60;
const alarmSound = new Audio('notification.mp3');
alarmSound.volume = 0.3;
let isTimerRunning = false;
let isStopwatchMode = false;
let stopwatchTime = 0;
let stopwatchInterval;

// DOM Elements
const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('start-timer');
const resetButton = document.getElementById('reset-timer');
const endButton = document.getElementById('end-timer');
const modeButton = document.getElementById('timer-mode-btn');
const customMinutesInput = document.getElementById('custom-minutes');
const customMinutesInput1 = document.getElementById('custom-minutes1');
const setCustomButton = document.getElementById('set-custom-timer');
const setCustomButton1 = document.getElementById('set-custom-timer1');
const presetButtons = document.querySelectorAll('.btn-preset');
const totalFocusedDisplay = document.getElementById('total-focused');
const sessionsDisplay = document.getElementById('sessions-today');
const customTimerSection1 = document.querySelector('.custom-timer1');
const customTimerSection = document.querySelector('.custom-timer');
const presetSection = document.querySelector('.preset-buttons');

// Sound files
const startSound = new Audio('start.mp3');
const endSound = new Audio('timer_over.mp3');
const breakSound = new Audio('pause.mp3');
const clickSound = new Audio('tick_tock.mp3');
const resetSound = new Audio('reset_timer.mp3');

// Set volumes (adjust as needed)
startSound.volume = 0.6;
endSound.volume = 0.6;
breakSound.volume = 0.6;
clickSound.volume = 0;
resetSound.volume = 0.6;

// Sound control variables
let tickTockInterval;
let isTickTockPlaying = false;

function playSound(type) {
    try {
        switch(type) {
            case 'start':
                startSound.currentTime = 0;
                startSound.play();
                break;
            case 'end':
                endSound.currentTime = 0;
                endSound.play();
                break;
            case 'break':
                breakSound.currentTime = 0;
                breakSound.play();
                break;
            case 'click':
                clickSound.currentTime = 0;
                clickSound.play();
                break;
            case 'reset':
                resetSound.currentTime = 0;
                resetSound.play();
                break;
        }
    } catch(e) {
        console.log("Audio error:", e);
    }
}

function startTickTock() {
    if (!isTickTockPlaying) {
        isTickTockPlaying = true;
        clickSound.loop = true;
        clickSound.currentTime = 1;
        clickSound.play().catch(e => console.log("Tick-tock play failed:", e));
    }
}

function stopTickTock() {
    if (isTickTockPlaying) {
        isTickTockPlaying = false;
        clickSound.loop = false;
        clickSound.pause();
    }
}

// Initialize
updateDisplay();
updateStats();
updateEndButtonText();

// Update end button text based on focus mode
function updateEndButtonText() {
    endButton.textContent = isFocusMode ? 'End Focus' : 'Start Focus';
}

// Toggle between timer and stopwatch modes
function toggleTimerMode() {
    isStopwatchMode = !isStopwatchMode;
    
    // Clear any running intervals
    clearInterval(timerInterval);
    clearInterval(stopwatchInterval);
    isTimerRunning = false;
    stopTickTock();
    
    // Update UI
    if (isStopwatchMode) {
        modeButton.textContent = 'Switch to Timer';
        startButton.textContent = 'Start';
        stopwatchTime = 0;
        customTimerSection.style.display = 'none';
        presetSection.style.display = 'none';
    } else {
        modeButton.textContent = 'Switch to Stopwatch';
        startButton.textContent = 'Start';
        timeLeft = currentSessionMinutes * 60;
        customTimerSection.style.display = 'flex';
        presetSection.style.display = 'flex';
    }
    
    updateDisplay();
}

// Update the timer/stopwatch display
function updateDisplay() {
    if (isStopwatchMode) {
        const hours = Math.floor(stopwatchTime / 3600);
        const minutes = Math.floor((stopwatchTime % 3600) / 60);
        const seconds = stopwatchTime % 60;
        timerDisplay.textContent = 
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
        const hours = Math.floor(Math.floor(timeLeft / 60)/60);
        const minutes = Math.floor(timeLeft / 60)%60;
        const seconds = timeLeft % 60;
        if(!hours){
            timerDisplay.textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        } else {
            timerDisplay.textContent = 
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }
    updateStats();
}

// Update stats display
function updateStats() {
    const hours = Math.floor(totalFocusedTime / 60);
    const minutes = totalFocusedTime % 60;
    
    if (hours > 0) {
        totalFocusedDisplay.textContent = `${hours}h ${minutes}m`;
    } else {
        totalFocusedDisplay.textContent = `${minutes}m`;
    }
    
    sessionsDisplay.textContent = `${sessionsToday} ${sessionsToday === 1 ? 'session' : 'sessions'}`;
    
    // Update localStorage
    localStorage.setItem('totalFocusedTime', totalFocusedTime);
    localStorage.setItem('sessionsToday', sessionsToday);
    
    // Update home page display
    document.getElementById('today-minutes').textContent = totalFocusedTime;
}

// Start/pause timer or stopwatch
function startPause() {
    if (isTimerRunning && !isStopwatchMode) {
        stopTickTock();
        playSound('break');
       
    } else {
        playSound('start');
    
            startTickTock();
        
    }
    
    if (isStopwatchMode) {
        if (!isTimerRunning) {
            // Start stopwatch
            isTimerRunning = true;
            startButton.textContent = 'Stop';
            stopwatchInterval = setInterval(() => {
                stopwatchTime++;
                updateDisplay();
            }, 1000);
        } else {
            // Stop stopwatch
            isTimerRunning = false;
            stopTickTock();
            startButton.textContent = 'Start';
            clearInterval(stopwatchInterval);
        }
    } else {
        if (!isTimerRunning) {
            // Start timer
            isTimerRunning = true;
            startButton.textContent = isBreakTime ? 'Pause Break' : 'Pause';
            
            timerInterval = setInterval(() => {
                timeLeft--;
                updateDisplay();
                
                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    stopTickTock();
                    playAlarm();
                    if (!isBreakTime) {
                        startBreak();
                    } else {
                        endSession();
                    }
                }
            }, 1000);
        } else {
            // Pause timer
            isTimerRunning = false;
            startButton.textContent = isBreakTime ? 'Start Break' : 'Start';
            clearInterval(timerInterval);
            stopTickTock();
        }
    }
}

// Start break period
function startBreak() {
    isBreakTime = true;
    timeLeft = breakTime;
    document.getElementById('timer').classList.add('break-mode');
    startButton.textContent = 'Start Break';
    document.getElementById('break-modal').classList.add('active');
}

// End current session
function endSession() {
    totalFocusedTime += currentSessionMinutes;
    sessionsToday++;
    updateStats();
    startButton.textContent = 'Start';
    timeLeft = currentSessionMinutes * 60;
    isBreakTime = false;
    document.getElementById('timer').classList.remove('break-mode');
    showSessionComplete();
}

// Reset timer/stopwatch
function reset() {
    if(!isStopwatchMode){
    playSound('reset');
    }
    clearInterval(timerInterval);
    clearInterval(stopwatchInterval);
    stopTickTock();
    isTimerRunning = false;
    
    if (isStopwatchMode) {
        stopwatchTime = 0;
        startButton.textContent = 'Start';
    } else {
        timeLeft = currentSessionMinutes * 60;
        startButton.textContent = 'Start';
        isBreakTime = false;
        document.getElementById('timer').classList.remove('break-mode');
    }
    
    updateDisplay();
}

function toggleFocusMode() {
    isFocusMode = !isFocusMode;
    document.body.classList.toggle('focus-mode', isFocusMode);
    updateEndButtonText();
    
    if (isFocusMode) {
        // Store the current active section before entering focus mode
        const activeSection = document.querySelector('.section.active');
        if (activeSection && activeSection.id !== 'timer-section') {
            startPause();
            activeSection.dataset.previousActive = 'true';
        }
        
        // Show only the timer section
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        
        document.getElementById('timer-section').classList.add('active');
    } else {
        // Restore the previous active section when exiting focus mode
        const previousActive = document.querySelector('.section[data-previous-active="true"]');
        if (previousActive) {
            document.getElementById('timer-section').classList.remove('active');
            delete previousActive.dataset.previousActive;
        }
    }
}

function endFocus() {
    if (isFocusMode) {
        if (isTimerRunning && !isStopwatchMode && !isBreakTime) {
            const minutesCompleted = currentSessionMinutes - Math.floor(timeLeft / 60);
            if (minutesCompleted > 0) {
                totalFocusedTime += minutesCompleted;
                sessionsToday++;
                updateStats();
            }
        }
        reset();
        toggleFocusMode();
    } else {
        toggleFocusMode();
    }
}

// Show session complete modal
function showSessionComplete() {
    document.getElementById('completed-minutes').textContent = currentSessionMinutes;
    document.getElementById('session-modal').classList.add('active');
}

// Play alarm sound
function playAlarm() {
    endSound.currentTime = 0;
    endSound.play().catch(e => console.log("Audio playback failed:", e));
}

// Event Listeners
startButton.addEventListener('click', startPause);
resetButton.addEventListener('click', reset);
endButton.addEventListener('click', function() {
    if (isFocusMode) {
        endFocus();
    } else {
        toggleFocusMode();
    }
});
modeButton.addEventListener('click', toggleTimerMode);

// Preset buttons
presetButtons.forEach(button => {
    button.addEventListener('click', function() {
        const minutes = parseInt(this.getAttribute('data-minutes'));
        timeLeft = minutes * 60;
        currentSessionMinutes = minutes;
        updateDisplay();
        
        if (isTimerRunning) {
            clearInterval(timerInterval);
            startButton.textContent = 'Start';
            isTimerRunning = false;
            stopTickTock();
        }
    });
});

// Custom timer
setCustomButton.addEventListener('click', function() {
    const minutes = parseInt(customMinutesInput.value);
    if (minutes && minutes > 0) {
        timeLeft = minutes * 60;
        currentSessionMinutes = minutes;
        updateDisplay();
        customMinutesInput.value = '';
        
        if (isTimerRunning) {
            clearInterval(timerInterval);
            startButton.textContent = 'Start';
            isTimerRunning = false;
            stopTickTock();
        }
    }
});

setCustomButton1.addEventListener('click', function() {
    const minutes = parseInt(customMinutesInput1.value);
    if (minutes && minutes > 0) {
        timeLeft = minutes * 60;
        currentSessionMinutes = minutes;
        updateDisplay();
        customMinutesInput1.value = '';
        
        if (isTimerRunning) {
            clearInterval(timerInterval);
            startButton.textContent = 'Start';
            isTimerRunning = false;
            stopTickTock();
        }
    }
});

// Modal controls
document.getElementById('modal-close-btn').addEventListener('click', function() {
    document.getElementById('session-modal').classList.remove('active');
});

document.getElementById('start-break-btn').addEventListener('click', function() {
    document.getElementById('break-modal').classList.remove('active');
    startPause();
});