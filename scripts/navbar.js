document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            const icon = this.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Close mobile menu when clicking a nav link
    const navLinksItems = document.querySelectorAll('.nav-link');
    navLinksItems.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navLinks.classList.remove('active');
                const icon = mobileMenuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });

    // Scroll effect
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (window.scrollY > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Ripple effect
    // function createRipple(event) {
    //     const button = event.currentTarget;
    //     const circle = document.createElement("span");
    //     const diameter = 10;
    //     const radius = diameter / 2;

    //     circle.style.width = circle.style.height = `${diameter}px`;
    //     circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
    //     circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
    //     circle.classList.add("ripple");

    //     const ripple = button.getElementsByClassName("ripple")[0];
    //     if (ripple) ripple.remove();

    //     button.appendChild(circle);
    // }

    document.querySelectorAll('.nav-link, .profile-toggle, .theme-toggle').forEach(button => {
        button.addEventListener('click', createRipple);
    });
});