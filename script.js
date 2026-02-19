// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Waitlist Form Submission
const waitlistForm = document.getElementById('waitlist-form');
const successMessage = document.getElementById('success-message');

waitlistForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const condition = document.getElementById('condition').value;
    
    // Validación básica
    if (!name || !email || !condition) {
        alert('Por favor completa todos los campos');
        return;
    }
    
    // Aquí integrarías con tu backend o servicio de emails
    // Por ahora simulamos el envío
    
    // Opción 1: Usar Formspree (GRATIS - Recomendado)
    // Reemplaza 'YOUR_FORM_ID' con tu ID de Formspree
    try {
        const response = await fetch('https://formspree.io/f/xbdaagpl', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                email: email,
                condition: condition,
                timestamp: new Date().toISOString()
            })
        });
        
        if (response.ok) {
            // Mostrar mensaje de éxito
            waitlistForm.style.display = 'none';
            successMessage.style.display = 'block';
            
            // Analytics tracking (Google Analytics)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'signup', {
                    'event_category': 'waitlist',
                    'event_label': condition
                });
            }
            
            // Guardar en localStorage para tracking
            localStorage.setItem('metabofit_signup', JSON.stringify({
                email: email,
                date: new Date().toISOString()
            }));
        } else {
            alert('Hubo un error. Por favor intenta de nuevo.');
        }
    } catch (error) {
        console.error('Error:', error);
        // Fallback: guardar en localStorage si falla el envío
        const signups = JSON.parse(localStorage.getItem('metabofit_signups') || '[]');
        signups.push({
            name: name,
            email: email,
            condition: condition,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('metabofit_signups', JSON.stringify(signups));
        
        waitlistForm.style.display = 'none';
        successMessage.style.display = 'block';
    }
});

// Navbar Scroll Effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
    } else {
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// Intersection Observer para animaciones al hacer scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Animar elementos al hacer scroll
document.querySelectorAll('.feature-card, .problem-card, .pricing-card, .faq-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Contador animado para las estadísticas
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        
        if (element.textContent.includes('M')) {
            element.textContent = Math.floor(progress * (end - start) + start) + 'M+';
        } else if (element.textContent.includes('%')) {
            element.textContent = Math.floor(progress * (end - start) + start) + '%';
        } else {
            element.textContent = '1 de ' + Math.floor(progress * (end - start) + start);
        }
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Activar contador cuando sea visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            animateValue(statNumbers[0], 0, 589, 2000);
            animateValue(statNumbers[1], 1, 8, 2000);
            animateValue(statNumbers[2], 0, 92, 2000);
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

// Easter Egg: Konami Code
let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.keyCode);
    konamiCode.splice(-konamiSequence.length - 1, konamiCode.length - konamiSequence.length);
    
    if (konamiCode.join(',').includes(konamiSequence.join(','))) {
        document.body.style.animation = 'rainbow 2s infinite';
        setTimeout(() => {
            document.body.style.animation = '';
            alert('🎉 ¡Has desbloqueado 12 meses GRATIS de Premium! Contacta a soporte con el código: FOUNDER2026');
        }, 100);
    }
});

// CSS para el easter egg
const style = document.createElement('style');
style.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(style);

// Analytics: Track tiempo en página
let startTime = Date.now();
window.addEventListener('beforeunload', () => {
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    if (typeof gtag !== 'undefined') {
        gtag('event', 'time_on_site', {
            'value': timeSpent,
            'event_category': 'engagement'
        });
    }
});

// Track clicks en CTA buttons
document.querySelectorAll('.btn-primary, .btn-secondary, .btn-plan').forEach(button => {
    button.addEventListener('click', (e) => {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'cta_click', {
                'event_category': 'conversion',
                'event_label': e.target.textContent
            });
        }
    });
});
