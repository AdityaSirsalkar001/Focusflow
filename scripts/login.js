document.addEventListener('DOMContentLoaded', function() {
    // Check for remembered login
    const rememberMe = localStorage.getItem('rememberMe') === 'true';
    if (rememberMe) {
        document.getElementById('remember-me').checked = true;
        const savedEmail = localStorage.getItem('savedEmail');
        if (savedEmail) {
            document.getElementById('login-email').value = savedEmail;
        }
    }

    // Login form submission
    document.getElementById('login-form')?.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const remember = document.getElementById('remember-me').checked;
        
        // Store remember preference
        localStorage.setItem('rememberMe', remember);
        if (remember) {
            localStorage.setItem('savedEmail', email);
        } else {
            localStorage.removeItem('savedEmail');
        }
        
        // Rest of your login logic...
        document.getElementById('login-section').classList.remove('active');
        document.getElementById('home-section').classList.add('active');
        document.querySelector('header').style.display = 'block';
    });
});