// Utility functions
function updateCornerClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12;
    
    document.getElementById('corner-time').textContent = 
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    document.getElementById('corner-period').textContent = period;
}

// Navigation between sections
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        document.querySelectorAll('.nav-link').forEach(navLink => {
            navLink.classList.remove('active');
        });
        this.classList.add('active');
        
        const sectionId = this.getAttribute('data-section') + '-section';
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionId).classList.add('active');
    });
});

// Get Started button event
document.getElementById('get-started-btn')?.addEventListener('click', function() {
    document.querySelector('.nav-link[data-section="timer"]').click();
});

// Initialize clock
setInterval(updateCornerClock, 1000);
updateCornerClock();