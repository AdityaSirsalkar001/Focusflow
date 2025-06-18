let clockInterval;

function toggleClockSection() {
  const clockSection = document.getElementById('clock-section');
  clockSection.classList.toggle('active');
  document.body.style.overflow = clockSection.classList.contains('active') ? 'hidden' : '';
  
  // Add/remove animation class
  if (clockSection.classList.contains('active')) {
    document.querySelector('.clock-container').classList.add('animate-pop');
  }
}

function updateClock() {
  const now = new Date();
  
  // Update main clock
  document.getElementById('full-clock-time').textContent = 
    now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  
  // Update date with ordinal suffix
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  const dateString = now.toLocaleDateString([], options);
  document.getElementById('full-clock-date').textContent = dateString;
  
  // Update additional clock info
  updateClockExtras(now);
}

function updateClockExtras(date) {
  // Add any additional clock information you want to display
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  const weekNumber = getWeekNumber(date);
  
  // You can add these to your HTML if you want to display them
  // document.getElementById('clock-timezone').textContent = timezone;
  // document.getElementById('clock-day-of-year').textContent = `Day ${Math.floor(dayOfYear)}`;
  // document.getElementById('clock-week-number').textContent = `Week ${weekNumber}`;
}

function getWeekNumber(date) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

function initClock() {
  updateClock();
  clockInterval = setInterval(updateClock, 1000);
  
  // Toggle when clicking corner clock
  document.getElementById('corner-time').addEventListener('click', toggleClockSection);
  
  // Close when clicking overlay or close button
  document.getElementById('clock-overlay').addEventListener('click', toggleClockSection);
  document.getElementById('close-clock').addEventListener('click', toggleClockSection);
  
  // Close when pressing Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.getElementById('clock-section').classList.contains('active')) {
      toggleClockSection();
    }
  });
}

document.addEventListener('DOMContentLoaded', initClock);