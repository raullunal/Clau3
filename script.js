document.addEventListener('DOMContentLoaded', function() {

    // --- Dark Mode Toggle ---
    const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'dark') {
            toggleSwitch.checked = true;
        }
    }

    function switchTheme(e) {
        if (e.target.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    }

    toggleSwitch.addEventListener('change', switchTheme);


    // --- FIX: Robust Smooth Scrolling for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); // Prevent default anchor jump
            
            const targetId = this.getAttribute('href');
            
            // If it's just "#" or empty, stop here
            if (!targetId || targetId === '#') {
                return;
            }
            
            const targetElement = document.querySelector(targetId);
            
            // If the target element exists, scroll to it
            if (targetElement) {
                const headerHeight = document.querySelector('.main-header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- FIX: Final and Robust Counter Animation Logic ---
    const counters = document.querySelectorAll('.counter');

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                if (counter.dataset.animated === 'false') {
                    animateCounter(counter);
                    counter.dataset.animated = 'true';
                    observer.unobserve(counter);
                }
            }
        });
    }, {
        threshold: 0.5
    });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

    function animateCounter(counter) {
        const target = +counter.getAttribute('data-target');
        const isPercentage = counter.innerText.includes('%'); 
        const increment = target / 120;
        let count = 0;

        const updateCount = () => {
            count += increment;
            if (count < target) {
                counter.innerText = Math.ceil(count) + (isPercentage ? '%' : '');
                requestAnimationFrame(updateCount);
            } else {
                counter.innerText = target + (isPercentage ? '%' : '');
            }
        };
        updateCount();
    }

    // --- Fade-in animation for other elements ---
    const fadeElements = document.querySelectorAll('.service-card, .credential-item, .comparison-col');
    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    fadeElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        fadeObserver.observe(el);
    });


    // --- Form Submission Handling ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            if (!name || !email || !message) {
                const formWrapper = document.querySelector('.contact-form-wrapper');
                formWrapper.innerHTML = `
                    <div class="form-error-message" style="text-align: center; padding: 20px;">
                        <i class="fas fa-exclamation-circle" style="color: #e74c3c; font-size: 4rem; margin-bottom: 20px;"></i>
                        <h3 style="color: var(--text-dark); margin-bottom: 15px;">Error</h3>
                        <p style="color: var(--text-muted); margin-bottom: 25px;">Por favor, completa todos los campos obligatorios.</p>
                        <button class="cta-button" onclick="location.reload()">Volver al formulario</button>
                    </div>
                `;
                return;
            }

            const formWrapper = document.querySelector('.contact-form-wrapper');
            formWrapper.innerHTML = `
                <div class="form-success-message" style="text-align: center; padding: 20px;">
                    <i class="fas fa-check-circle" style="color: var(--secondary-color); font-size: 4rem; margin-bottom: 20px;"></i>
                    <h3 style="color: var(--text-dark); margin-bottom: 15px;">¡Mensaje Enviado con Éxito!</h3>
                    <p style="color: var(--text-muted); margin-bottom: 25px;">Gracias por contactarme. Revisaré tu mensaje y te responderé a la brevedad para agendar tu diagnóstico.</p>
                    <button class="cta-button" onclick="location.reload()">Enviar otro mensaje</button>
                </div>
            `;

            console.log('Form Data:', { name, email, message });
        });
    }

    // --- FIX: Mobile Menu Toggle Logic ---
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNavUl = document.querySelector('.main-nav ul');
    
    if (mobileMenuToggle && mainNavUl) {
        mobileMenuToggle.addEventListener('click', () => {
            mainNavUl.classList.toggle('is-open');
            mobileMenuToggle.classList.toggle('is-active');
        });

        // Close menu when a link is clicked
        const menuLinks = document.querySelectorAll('.main-nav ul a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mainNavUl.classList.contains('is-open')) {
                    mainNavUl.classList.remove('is-open');
                    mobileMenuToggle.classList.remove('is-active');
                }
            });
        });
    }

});