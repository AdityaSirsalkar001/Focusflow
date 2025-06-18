document.getElementById('signup-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const name = document.getElementById('signup-name').value;
  
    // Simple validation
    if (!email || !password || !name) {
      alert('Please fill all fields');
      return;
    }
  
    // Store user data (in real app, you'd use backend)
    const users = JSON.parse(localStorage.getItem('focusflow-users') || '[]');
    users.push({ email, password, name });
    localStorage.setItem('focusflow-users', JSON.stringify(users));
  
    alert('Account created! Redirecting to login...');
    document.getElementById('login-section').classList.add('active');
    document.getElementById('signup-section').classList.remove('active');
  });
  
  // Toggle between login/signup
  document.querySelectorAll('.auth-toggle').forEach(btn => {
    btn.addEventListener('click', function() {
      document.getElementById('login-section').classList.toggle('active');
      document.getElementById('signup-section').classList.toggle('active');
    });
  });