// Global Application State
const appState = {
    isAuthenticated: false,
    currentUser: null,
    focusTimeToday: 0,
    completedTasks: 0,
    currentStreak: 0,
    todos: []
};

// DOM Elements Cache
const dom = {
    // Sections
    sections: {
        login: document.getElementById('login-section'),
        home: document.getElementById('home-section'),
        timer: document.getElementById('timer-section'),
        todo: document.getElementById('todo-section'),
        notes: document.getElementById('notes-section')
    },
    
    // Login Form
    loginForm: document.getElementById('login-form'),
    loginEmail: document.getElementById('login-email'),
    loginName: document.getElementById('login-name'),
    loginPassword: document.getElementById('login-password'),
    togglePassword: document.getElementById('toggle-password'),
    
    // Navigation
    navLinks: document.querySelectorAll('.nav-link'),
    logoutBtn: document.getElementById('logout-btn'),
    
    // Home Page
    username: document.getElementById('username'),
    username1: document.getElementById('username1'),
    todayMinutes: document.getElementById('today-minutes'),
    completedTasks: document.getElementById('completed-tasks'),
    currentStreak: document.getElementById('current-streak'),
    
    // Quick Actions
    quickTimer: document.getElementById('quick-timer'),
    quickTask: document.getElementById('quick-task'),
    quickNote: document.getElementById('quick-note'),
    trap: document.getElementById('trap'),
    trap1: document.getElementById('trap1'),
    trap2: document.getElementById('trap2'),
    trap3: document.getElementById('trap3'),

    
    // Clock
    clockTime: document.getElementById('corner-time'),
    clockPeriod: document.getElementById('corner-period')
};

/* ==================== CLOCK FUNCTIONS ==================== */
function initClock() {
    updateClock();
    const now = new Date();
    const delay = 1000 - now.getMilliseconds();
    
    setTimeout(function timer() {
        updateClock();
        setTimeout(timer, 1000);
    }, delay);
}

function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const mins = now.getMinutes().toString().padStart(2, '0');
    const period = hours >= 12 ? 'PM' : 'AM';
    
    // Convert to 12-hour format with leading zero
    hours = hours % 12 || 12;
    hours = hours.toString().padStart(2, '0');
    
    const currentTime = `${hours}:${mins}`;
    
    if (dom.clockTime && dom.clockTime.textContent !== currentTime) {
        dom.clockTime.textContent = currentTime;
    }
    if (dom.clockPeriod && dom.clockPeriod.textContent !== period) {
        dom.clockPeriod.textContent = period;
    }
}

/* ==================== AUTHENTICATION ==================== */
function loadSession() {
    const session = localStorage.getItem('userSession');
    if (session) {
        try {
            const { email, name, lastLogin } = JSON.parse(session);
            appState.isAuthenticated = true;
            appState.currentUser = {
                email,
                name: name || email.split('@')[0] || 'User',
                lastLogin
            };
        } catch (e) {
            console.error('Session load error:', e);
        }
    }
}

function handleLogin(e) {
    e.preventDefault();
    const email = dom.loginEmail.value.trim();
    const name = dom.loginName.value.trim();
    const password = dom.loginPassword.value;
    
    if (!email || !password) {
        alert('Please enter both email and password');
        return;
    }
    
    appState.isAuthenticated = true;
    appState.currentUser = {
        email,
        name: name || email.split('@')[0] || 'User',
        lastLogin: new Date().toISOString()
    };
    
    localStorage.setItem('userSession', JSON.stringify({
        email,
        name: appState.currentUser.name,
        lastLogin: appState.currentUser.lastLogin
    }));
    
    dom.loginForm.reset();
    showSection('home');
    document.querySelector('header').style.display = 'block';
    updateUI();
}

function handleLogout() {
    appState.isAuthenticated = false;
    appState.currentUser = null;
    localStorage.removeItem('userSession');
    
    showSection('login');
    document.querySelector('header').style.display = 'none';
    
    if (typeof resetTimer === 'function') {
        resetTimer();
    }
}

function togglePasswordVisibility() {
    if (dom.loginPassword.type === 'password') {
        dom.loginPassword.type = 'text';
        dom.togglePassword.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        dom.loginPassword.type = 'password';
        dom.togglePassword.classList.replace('fa-eye-slash', 'fa-eye');
    }
}

/* ==================== UI FUNCTIONS ==================== */
function showSection(sectionId) {
    Object.values(dom.sections).forEach(section => {
        section?.classList.remove('active');
    });
    
    if (dom.sections[sectionId]) {
        dom.sections[sectionId].classList.add('active');
    }
    
    dom.navLinks.forEach(link => {
        link.classList.toggle(
            'active',
            link.getAttribute('data-section') === sectionId
        );
    });
    scrollToTop();
}

function updateUI() {
    if (dom.username) {
        dom.username.textContent = appState.currentUser?.name || 'Guest';
        dom.username1.textContent = appState.currentUser?.name || 'Guest';
    }
    if (dom.todayMinutes) {
        dom.todayMinutes.textContent = appState.focusTimeToday;
    }
    if (dom.completedTasks) {
        dom.completedTasks.textContent = appState.completedTasks;
    }
    if (dom.currentStreak) {
        dom.currentStreak.textContent = appState.currentStreak;
    }
}

/* ==================== HOME SECTION INTERACTIONS ==================== */
function initHomeInteractions() {
    // Add hover effects to stats cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const icon = card.querySelector('.stat-icon');
            icon.classList.add('pulse-animation');
        });
        
        card.addEventListener('mouseleave', () => {
            const icon = card.querySelector('.stat-icon');
            icon.classList.remove('pulse-animation');
        });
        
        // Click handler to navigate to relevant section
        card.addEventListener('click', function() {
            const statId = this.querySelector('.stat-icon').id;
            let section = 'timer'; // default
            
            if (statId === 'tick') section = 'todo';
            if (statId === 'streak') section = 'timer'; // or whatever section makes sense
            
            showSection(section);
        });
    });

    // Add hover effects to action cards
    const actionCards = document.querySelectorAll('.action-card');
    actionCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const icon = card.querySelector('.action-icon');
            icon.classList.add('pulse-animation');
        });
        
        card.addEventListener('mouseleave', () => {
            const icon = card.querySelector('.action-icon');
            icon.classList.remove('pulse-animation');
        });
    });

    // Welcome header interaction
    const welcomeHeader = document.querySelector('.welcome-header');
    if (welcomeHeader) {
        welcomeHeader.addEventListener('click', () => {
            // Example: You could add some interaction here
            console.log('Welcome header clicked');
        });
    }
}

/* ==================== EVENT HANDLERS ==================== */
function setupNavigation() {
    dom.navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            showSection(this.getAttribute('data-section'));
        });
    });
}

function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Optional: Adds smooth scrolling
    });
  }

function setupQuickActions() {
    if (dom.quickTimer) {
        dom.quickTimer.addEventListener('click', () => {
            showSection('timer');
            const startBtn = document.getElementById('start-timer');
            if (startBtn) startBtn.click();
        });
    }
    
    if(dom.trap){
        dom.trap.addEventListener('click', () => {
            showSection('timer');
        });
    }

    if(dom.trap1){
        dom.trap1.addEventListener('click', () => {
            showSection('timer');
        });
    }

    if(dom.trap2){
        dom.trap2.addEventListener('click', () => {
            showSection('timer');
        });
    }

    if(dom.trap3){
        dom.trap3.addEventListener('click', () => {
            showSection('timer');
        });
    }
    if (dom.quickTask) {
        dom.quickTask.addEventListener('click', () => {
            showSection('todo');
            const todoInput = document.getElementById('todo-input');
            if (todoInput) todoInput.focus();
        });
    }
    
    if (dom.quickNote) {
        dom.quickNote.addEventListener('click', () => {
            showSection('notes');
            const newNoteBtn = document.getElementById('new-note');
            if (newNoteBtn) newNoteBtn.click();
        });
    }
}

function setupEventListeners() {
    setupNavigation();
    setupQuickActions();
    
    if (dom.logoutBtn) {
        dom.logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleLogout();
        });
    }
    
    if (dom.loginForm) {
        dom.loginForm.addEventListener('submit', handleLogin);
    }
    
    if (dom.togglePassword) {
        dom.togglePassword.addEventListener('click', togglePasswordVisibility);
    }
}

/* ==================== SERVICE WORKER ==================== */
function initServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('scripts/service-worker.js')
            .then(reg => console.log('Service Worker registered'))
            .catch(err => console.log('Service Worker registration failed:', err));
    }
}

/* ==================== INITIALIZATION ==================== */
function initApp() {
    // Initialize all components
    loadSession();
    saveTodos();
    setupEventListeners();
    updateUI();
    initClock();
    initServiceWorker();
    initHomeInteractions();
    initHomeComponents();
    
    // Show appropriate view based on auth state
    if (appState.isAuthenticated) {
        showSection('home');
        document.querySelector('header').style.display = 'block';
    } else {
        showSection('login');
        document.querySelector('header').style.display = 'none';
    }
}

// Start the application when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initApp);

// For debugging purposes
window.app = {
    state: appState,
    dom: dom,
    utils: {
        showSection,
        updateUI,
        updateClock
    }
};

// Enhanced Dropdown JavaScript
const profileToggle = document.getElementById('profile-toggle');
const profileMenu = document.getElementById('profile-menu');

// Toggle dropdown
if (profileToggle) {
    profileToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isExpanded = profileToggle.getAttribute('aria-expanded') === 'true';
        profileToggle.setAttribute('aria-expanded', !isExpanded);
        profileMenu.setAttribute('aria-hidden', isExpanded);
    });
}

// Close when clicking outside
document.addEventListener('click', () => {
    if (profileToggle) {
        profileToggle.setAttribute('aria-expanded', 'false');
        profileMenu.setAttribute('aria-hidden', 'true');
    }
});

// Keyboard navigation
if (profileMenu) {
    profileMenu.addEventListener('keydown', (e) => {
        const menuItems = profileMenu.querySelectorAll('[role="menuitem"]');
        const currentIndex = Array.from(menuItems).indexOf(document.activeElement);
        
        if (e.key === 'Escape') {
            profileToggle.focus();
            profileToggle.setAttribute('aria-expanded', 'false');
            profileMenu.setAttribute('aria-hidden', 'true');
        } else if (e.key === 'ArrowDown') {
            const nextIndex = (currentIndex + 1) % menuItems.length;
            menuItems[nextIndex].focus();
            e.preventDefault();
        } else if (e.key === 'ArrowUp') {
            const prevIndex = (currentIndex - 1 + menuItems.length) % menuItems.length;
            menuItems[prevIndex].focus();
            e.preventDefault();
        } else if (e.key === 'Home') {
            menuItems[0].focus();
            e.preventDefault();
        } else if (e.key === 'End') {
            menuItems[menuItems.length - 1].focus();
            e.preventDefault();
        }
    });
}

// Close when an item is selected
if (profileMenu) {
    profileMenu.querySelectorAll('[role="menuitem"]').forEach(item => {
        item.addEventListener('click', () => {
            profileToggle.setAttribute('aria-expanded', 'false');
            profileMenu.setAttribute('aria-hidden', 'true');
        });
    });
}


const quotes = [
    {
        text: "Productivity is never an accident. It is always the result of a commitment to excellence, intelligent planning, and focused effort.",
        author: "Paul J. Meyer"
    },
    {
        text: "Concentrate all your thoughts upon the work at hand. The sun's rays do not burn until brought to a focus.",
        author: "Alexander Graham Bell"
    },
    {
        text: "The key is not to prioritize what's on your schedule, but to schedule your priorities.",
        author: "Stephen Covey"
    },
    {
        text: "You don't need more time in your day, you need to decide.",
        author: "Seth Godin"
    },
    {
        text: "Focus on being productive instead of busy.",
        author: "Tim Ferriss"
    },
    {
        text: "Efficiency is doing things right. Effectiveness is doing the right things.",
        author: "Peter Drucker"
    },
    {
        text: "The shorter way to do many things is to do only one thing at a time.",
        author: "Mozart"
    },
    {
        text: "Your mind is for having ideas, not holding them.",
        author: "David Allen (Getting Things Done)"
    },
    {
        text: "Do the hard jobs first. The easy jobs will take care of themselves.",
        author: "Dale Carnegie"
    },
    {
        text: "It's not always that we need to do more but rather that we need to focus on less.",
        author: "Nathan W. Morris"
    },
    {
        text: "The most effective way to do it, is to do it.",
        author: "Amelia Earhart"
    },
    {
        text: "Productivity is less about what you do with your time and more about how you run your mind.",
        author: "Robin Sharma"
    },
    {
        text: "Small daily improvements over time lead to stunning results.",
        author: "Robin Sharma"
    },
    {
        text: "You will never change your life until you change something you do daily.",
        author: "John C. Maxwell"
    },
    {
        text: "The secret of getting ahead is getting started.",
        author: "Mark Twain"
    },
    {
        text: "Discipline is choosing between what you want now and what you want most.",
        author: "Abraham Lincoln"
    },
    {
        text: "The best way to predict the future is to create it.",
        author: "Peter Drucker"
    },
    {
        text: "Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work.",
        author: "Steve Jobs"
    },
    {
        text: "The difference between successful people and really successful people is that really successful people say no to almost everything.",
        author: "Warren Buffett"
    },
    {
        text: "The shorter the deadline, the more likely you'll get it done.",
        author: "Parkinson's Law"
    }
];
let randomInteger = 0;
function showRandomQuote() {
   
    const randomQuote = quotes[randomInteger];
    document.getElementById('current-quote').textContent = `"${randomQuote.text}"`;
    document.getElementById('quote-author').textContent = `- ${randomQuote.author}`;
    randomInteger++;
    randomInteger = randomInteger % 20;
}


const getRandomInteger = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }


// Initialize all home components
function initHomeComponents() {
  
  
    showRandomQuote();
    setupQuickFocus();

    
}

// Add this CSS to the page dynamically
const quoteAnimationStyles = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .quote-transition {
        animation: fadeIn 0.5s ease-out forwards;
    }
    
    .quotes {
        position: relative;
        min-height: 120px;
    }
`;

// Inject the styles
const styleElement = document.createElement('style');
styleElement.textContent = quoteAnimationStyles;
document.head.appendChild(styleElement);

// Modified showRandomQuote function with animation
function showRandomQuote() {
    const quotesContainer = document.querySelector('.quotes');
    const quoteText = document.getElementById('current-quote');
    const quoteAuthor = document.getElementById('quote-author');
    
    // Fade out current quote
    quotesContainer.style.opacity = '0';
    quotesContainer.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
        // Get new quote
        const randomQuote = quotes[randomInteger];
        quoteText.textContent = `"${randomQuote.text}"`;
        quoteAuthor.textContent = `- ${randomQuote.author}`;
        randomInteger++;
        randomInteger = randomInteger % quotes.length;
        
        // Add animation class
        quotesContainer.classList.add('quote-transition');
        quotesContainer.style.opacity = '1';
        
        // Remove animation class after it completes
        setTimeout(() => {
            quotesContainer.classList.remove('quote-transition');
        }, 500);
    }, 300);
}