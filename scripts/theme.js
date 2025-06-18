document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    const THEME_KEY = 'focusflow-theme';
    
    // ===== OPTIMIZED COLOR PALETTE =====
    const lightModeColors = {
        // Backgrounds
        '--bg-dark': '#f8fafc',
        '--bg-darker': '#f1f5f9',
        
        // Text
        '--text-primary': '#1e293b',
        '--text-secondary': '#475569',
        
        // Cards & Surfaces
        '--card-bg': '#ffffff',
        '--card-shadow': '0 2px 8px rgba(0,0,0,0.08)',
        '--card-border': '#e2e8f0',
        
        // Inputs
        '--input-bg': '#ffffff',
        '--input-border': '#e2e8f0',
        '--input-text': '#1e293b',
        '--input-placeholder': '#94a3b8',
        
        // Clock
        '--clock-bg': 'rgba(255,255,255,0.9)',
        '--clock-text': '#6d28d9',
        '--clock-period': '#64748b',
        
        // Buttons
        '--btn-preset-bg': '#ffffff',
        '--btn-preset-text': '#475569',
        '--btn-preset-hover': '#f1f5f9',
        '--btn-preset-active': '#e2e8f0',
        '--btn-preset-border': '#cbd5e1',
        
        // Navbar
        '--navbar-bg': '#ffffff',
        '--navbar-border': '#e2e8f0',
        '--navlink-text': '#475569',
        '--navlink-hover': '#f8fafc',
        '--navlink-active': '#f3e8ff',
        '--navlink-active-text': '#6d28d9',
        
        // Accents
        '--accent': '#6d28d9',
        '--accent-light': '#7c3aed',
        '--success': '#15803d',
        '--danger': '#b91c1c',
        '--warning': '#b45309',
        '--task-bg': 'white',
        
        // Special Modes
        '--focus-bg': '#f3e8ff',
        '--focus-accent': '#7c3aed',
        '--break-color': '#15803d',
        '--due-date-bg': 'rgba(0,0,0,0.05)',
        
        // Transitions
        '--transition-speed': '0.3s',
        '--focus-bg': '#ffffff',
        '--focus-accent': '#6d28d9',
        '--focus-border': 'transparent',
        '--focus-pulse-start': '#ffffff',
        '--focus-pulse-end': '#ffffff'
    };

    // ===== PREMIUM ICON ANIMATION SETTINGS =====
    const animationSettings = {
        duration: 600,
        easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        iconScale: 1,
        glowIntensity: 15,
        rotateDegrees: 360
    };

    // ===== ENHANCED THEME MANAGEMENT =====
    function applyLightMode() {
        const root = document.documentElement;
        
        // Apply CSS variables
        Object.entries(lightModeColors).forEach(([key, value]) => {
            root.style.setProperty(key, value);
        });
        
        // Animate icon transition
        themeToggle.classList.add('transitioning');
        
        // Scale and rotate animation
        themeToggle.style.transform = `scale(${animationSettings.iconScale}) rotate(${animationSettings.rotateDegrees}deg)`;
        themeIcon.style.transform = `scale(1.2)`;
        
        // Change icon with delay
        setTimeout(() => {
            themeIcon.classList.replace('fa-moon', 'fa-sun');
            themeIcon.style.color = '#ffd43b'; // Sun color
            themeIcon.style.textShadow = `0 0 ${animationSettings.glowIntensity}px rgba(255, 212, 59, 0.7)`;
        }, animationSettings.duration / 3);
        
        // Reset animation
        setTimeout(() => {
            themeToggle.style.transform = 'scale(1) rotate(0)';
            themeIcon.style.transform = 'scale(1)';
            themeToggle.classList.remove('transitioning');
            themeToggle.setAttribute('aria-label', 'Switch to dark mode');
        }, animationSettings.duration);
        
        // Additional light mode classes
        document.body.classList.add('light-mode', 'light-theme-active');

        // Focus mode overrides
        const style = document.createElement('style');
        style.id = 'focus-mode-overrides';
        style.textContent = `
            body.focus-mode {
                background: var(--focus-bg) !important;
                animation: none !important;
            }
            .exit-focus-mode {
                background: var(--card-bg) !important;
                border: 1px solid var(--input-border) !important;
            }
        `;
        document.head.appendChild(style);
    }

    function applyDarkMode() {
        const root = document.documentElement;
        
        // Reset to default dark variables
        Object.keys(lightModeColors).forEach(key => {
            root.style.removeProperty(key);
        });
        
        // Animate icon transition
        themeToggle.classList.add('transitioning');
        
        // Scale and rotate animation
        themeToggle.style.transform = `scale(${animationSettings.iconScale}) rotate(-${animationSettings.rotateDegrees}deg)`;
        themeIcon.style.transform = `scale(1)`;
        
        // Change icon with delay
        setTimeout(() => {
            themeIcon.classList.replace('fa-sun', 'fa-moon');
            themeIcon.style.color = '#94a3b8'; // Moon color
            themeIcon.style.textShadow = `0 0 ${animationSettings.glowIntensity}px rgba(148, 163, 184, 0.5)`;
        }, animationSettings.duration / 3);
        
        // Reset animation
        setTimeout(() => {
            themeToggle.style.transform = 'scale(1) rotate(0)';
            themeIcon.style.transform = 'scale(1)';
            themeToggle.classList.remove('transitioning');
            themeToggle.setAttribute('aria-label', 'Switch to light mode');
        }, animationSettings.duration);
        
        document.body.classList.remove('light-mode', 'light-theme-active');

        const existingStyle = document.getElementById('focus-mode-overrides');
        if (existingStyle) {
            existingStyle.remove();
        }
    }

    function toggleTheme() {
        const isDark = !document.body.classList.contains('light-mode');
        
        // Prevent rapid clicking during transition
        if (themeToggle.classList.contains('transitioning')) return;
        
        if (isDark) {
            applyLightMode();
            localStorage.setItem(THEME_KEY, 'light');
        } else {
            applyDarkMode();
            localStorage.setItem(THEME_KEY, 'dark');
        }
        
        // Dispatch event for other components
        document.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { isLightMode: !isDark }
        }));
    }

    function initializeTheme() {
        const savedTheme = localStorage.getItem(THEME_KEY);
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'light' || (!savedTheme && !systemPrefersDark)) {
            applyLightMode();
        } else {
            applyDarkMode();
        }
        
        // System theme change listener
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (!localStorage.getItem(THEME_KEY)) {
                e.matches ? applyDarkMode() : applyLightMode();
            }
        });
    }

    // ===== INITIALIZATION =====
    // Add premium styling to toggle button
    themeToggle.style.position = 'relative';
    themeToggle.style.transition = `transform ${animationSettings.duration}ms ${animationSettings.easing}`;
    themeIcon.style.transition = `all ${animationSettings.duration}ms ${animationSettings.easing}`;
    themeIcon.style.display = 'inline-block'; // Required for transform
    
    // Initialize with correct icon
    if (document.body.classList.contains('light-mode')) {
        themeIcon.classList.replace('fa-moon', 'fa-sun');
        themeIcon.style.color = '#ffd43b';
    } else {
        themeIcon.style.color = '#94a3b8';
    }
    
    themeToggle.addEventListener('click', toggleTheme);
    initializeTheme();

    // ===== STYLE INJECTION =====
    const premiumStyles = `
    @keyframes pulse-glow {
        0%, 100% { 
            box-shadow: 0 0 10px rgba(255, 212, 59, 0); 
            opacity: 1;
        }
        50% { 
            box-shadow: 0 0 20px rgba(255, 212, 59, 0.6); 
            opacity: 0.8;
        }
    }

    .light-mode .theme-toggle i {
        animation: pulse-glow 3s infinite;
    }

    .theme-toggle.transitioning {
        z-index: 10;
    }

    .theme-toggle i {
        transform-origin: center;
    }
    `;

    // Inject the styles
    const styleElement = document.createElement('style');
    styleElement.textContent = premiumStyles;
    document.head.appendChild(styleElement);

    // Expose to global scope for debugging (optional)
    window.__focusflowTheme = {
        toggle: toggleTheme,
        get current() {
            return document.body.classList.contains('light-mode') ? 'light' : 'dark';
        }
    };
});