// Schedule Section - With localStorage version
let dailySchedule = JSON.parse(localStorage.getItem('dailySchedule')) || [];
const themeToggle = document.getElementById('theme-toggle');

function saveToLocalStorage() {
    localStorage.setItem('dailySchedule', JSON.stringify(dailySchedule));
}

function renderSchedule() {
    const scheduleList = document.getElementById('schedule-list');
    scheduleList.innerHTML = '';

    if (dailySchedule.length === 0) {
        scheduleList.innerHTML = `
            <div class="schedule-empty">
                <i class="fas fa-calendar-day"></i>
                <p>No tasks scheduled yet</p>
            </div>
        `;
        return;
    }

    // Sort by start time
    dailySchedule.sort((a, b) => a.startTime.localeCompare(b.startTime));

    dailySchedule.forEach((item, index) => {
        const scheduleItem = document.createElement('div');
        scheduleItem.className = `schedule-item priority-${item.priority} ${item.completed ? 'completed' : ''}`;
        
        scheduleItem.innerHTML = `
            <input type="checkbox" class="schedule-checkbox" ${item.completed ? 'checked' : ''}
                   data-index="${index}" aria-label="${item.completed ? 'Mark as incomplete' : 'Mark as complete'}">
            <div class="schedule-time">
                <span class="start-time">${formatTime(item.startTime)}</span>
                <span class="time-separator">→</span>
                <span class="end-time">${formatTime(item.endTime)}</span>
            </div>
            <span class="schedule-task">${item.task}</span>
            <button class="delete-note-btn" data-index="${index}" aria-label="Delete scheduled task">
                <i class="fas fa-trash-alt"></i>
            </button>
        `;
        scheduleList.appendChild(scheduleItem);
    });

    // Rest of the function remains the same...
    document.querySelectorAll('.schedule-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const index = this.getAttribute('data-index');
            dailySchedule[index].completed = this.checked;
            saveToLocalStorage();
            renderSchedule();
        });
    });

    document.querySelectorAll('.delete-note-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            dailySchedule.splice(index, 1);
            saveToLocalStorage();
            renderSchedule();
        });
    });
}
// Format time to 12-hour format with AM/PM
function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const time = new Date(0, 0, 0, hours, minutes);
    return time.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true
    });
}

// Helper function to add minutes to time string
function addMinutes(timeString, minutesToAdd) {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date(0, 0, 0, hours, minutes);
    date.setMinutes(date.getMinutes() + minutesToAdd);
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

// Form submission handler
// Form submission handler
document.getElementById('schedule-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const taskInput = document.getElementById('schedule-task');
    const startTimeInput = document.getElementById('schedule-start-time');
    const endTimeInput = document.getElementById('schedule-end-time');
    const prioritySelect = document.getElementById('schedule-priority');

    const task = taskInput.value.trim();
    const startTime = startTimeInput.value;
    const endTime = endTimeInput.value;
    const priority = prioritySelect.value;

    // Validation
    if (!task || !startTime || !endTime) {
        alert('Please fill all fields');
        return;
    }

    // Add new task
    dailySchedule.push({
        task,
        startTime,
        endTime,
        priority,
        completed: false
    });

    // Save to localStorage
    saveToLocalStorage();
    
     
    // Reset form
   let currentTime = endTime;
   const endedtime = addMinutes(currentTime, 30);
   
   taskInput.value = '';
   startTimeInput.value = currentTime;
   endTimeInput.value = endedtime;
   prioritySelect.value = 'low';

    // Refresh display
    renderSchedule();
   
});
// Initialize time inputs with current time and step of 15 minutes
// Initialize time inputs with current time and step of 1 minute
document.addEventListener('DOMContentLoaded', function() {
    // Set current time as default
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0'); // Changed to use exact minutes
    let currentTime = `${hours}:${minutes}`;
    if(minutes < 30){
        currentTime = addMinutes(currentTime , 30-minutes);
    }
    else {
        currentTime = addMinutes(currentTime , 60-minutes);
    }
    // Initialize inputs
    const startTimeInput = document.getElementById('schedule-start-time');
    const endTimeInput = document.getElementById('schedule-end-time');
    
    startTimeInput.value = currentTime;
    endTimeInput.value = addMinutes(currentTime, 30); // Default to 30 minutes later
    startTimeInput.step = '60'; // Changed to 1 minute steps
    endTimeInput.step = '60'; // Changed to 1 minute steps

    // Add time increment/decrement buttons
    addTimeControls(startTimeInput);
    addTimeControls(endTimeInput);

    renderSchedule();
});

// Add increment/decrement buttons to time inputs
function addTimeControls(timeInput) {
    const container = document.createElement('div');
    container.className = 'time-input-container';
    timeInput.parentNode.insertBefore(container, timeInput);
    container.appendChild(timeInput);
    
    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'time-controls';
    container.appendChild(controlsContainer);
    
    const incrementBtn = document.createElement('button');
    incrementBtn.type = 'button';
    incrementBtn.className = 'time-control increment';
    incrementBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    incrementBtn.addEventListener('click', () => {
        const currentTime = timeInput.value;
        timeInput.value = addMinutes(currentTime, 30); // Changed to 30 minute increments
    });

    const decrementBtn = document.createElement('button');
    decrementBtn.type = 'button';
    decrementBtn.className = 'time-control decrement';
    decrementBtn.innerHTML = '<i class="fas fa-chevron-down"></i>';
    decrementBtn.addEventListener('click', () => {
        const currentTime = timeInput.value;
        timeInput.value = addMinutes(currentTime, -30); // Changed to 30 minute decrements
    });

    controlsContainer.appendChild(incrementBtn);
    controlsContainer.appendChild(decrementBtn);
}