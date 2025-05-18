/**
 * Main JavaScript file for Taligent website
 * Initializes all modules and components
 * Version: 2.0
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // Initialize components
    initHeader();
    
    // Initialize modules
    initNavigation();
    
    // Initialize page-specific modules
    if (document.querySelector('.portfolio-filter')) {
        initPortfolio();
    }
    
    // Initialize animations
    initAnimations();
    
    // Initialize scroll handlers
    initScrollHandlers();
    
    console.log('Taligent website initialized successfully!');
});

/**
 * Initialize scroll event handlers
 */
function initScrollHandlers() {
    // Back to top button
    const backToTopButton = document.getElementById('backToTop');
    
    if (backToTopButton) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });
        
        // Add enhanced hover effect
        backToTopButton.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.05)';
            this.style.boxShadow = '0 8px 20px rgba(15, 111, 239, 0.4)';
        });
        
        backToTopButton.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    }
    
    // Scroll animations for elements
    const animatedElements = document.querySelectorAll('.fade-in, .fade-in-up, .fade-in-down, .fade-in-left, .fade-in-right, .scale-in');
    
    if (animatedElements.length > 0) {
        // Function to check if element is in viewport
        const isInViewport = (element) => {
            const rect = element.getBoundingClientRect();
            return (
                rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.9 &&
                rect.bottom >= 0
            );
        };
        
        // Function to handle scroll animation
        const handleScrollAnimation = () => {
            animatedElements.forEach(element => {
                if (isInViewport(element) && element.style.opacity === '0') {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }
            });
        };
        
        // Set initial state for all animated elements
        animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });
        
        // Initial check
        handleScrollAnimation();
        
        // Listen for scroll events
        window.addEventListener('scroll', handleScrollAnimation);
    }
}

/**
 * Initialize animations
 */
function initAnimations() {
    // Staggered animations for card elements
    const staggerContainers = [
        { selector: '.services-grid', childSelector: '.service-card' },
        { selector: '.projects-grid', childSelector: '.project-card' },
        { selector: '.methodology-steps', childSelector: '.step' }
    ];
    
    staggerContainers.forEach(container => {
        const parent = document.querySelector(container.selector);
        if (parent) {
            const children = parent.querySelectorAll(container.childSelector);
            children.forEach((child, index) => {
                child.style.opacity = '0';
                child.style.transform = 'translateY(30px)';
                child.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                
                // Set animation delay based on index for staggered effect
                child.style.transitionDelay = `${0.1 + (index * 0.1)}s`;
                
                // Set element visible after a delay
                setTimeout(() => {
                    child.style.opacity = '1';
                    child.style.transform = 'translateY(0)';
                }, 100);
            });
        }
    });
    
    // Parallax effects for header backgrounds
    const parallaxBgs = document.querySelectorAll('.hero, .portfolio-hero, .portfolio-cta');
    
    if (parallaxBgs.length) {
        window.addEventListener('scroll', () => {
            const scrollPosition = window.pageYOffset;
            
            parallaxBgs.forEach(bg => {
                const rect = bg.getBoundingClientRect();
                
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const speed = 0.2;
                    const yPos = -(scrollPosition * speed);
                    bg.style.backgroundPosition = `center ${yPos}px`;
                }
            });
        });
    }
}

/**
 * Utility function to throttle function calls
 * @param {Function} func - The function to throttle
 * @param {number} limit - The time limit in milliseconds
 * @return {Function} - The throttled function
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Utility function to debounce function calls
 * @param {Function} func - The function to debounce
 * @param {number} delay - The delay in milliseconds
 * @return {Function} - The debounced function
 */
function debounce(func, delay) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
    };
}
/**
 * Controla la reproducción del video de héroe en loop con reversa
 */
function initHeroVideo() {
    const video = document.getElementById('heroVideo');
    if (!video) return;
    
    let isForward = true;
    
    // Cuando el video llegue al final
    video.addEventListener('ended', function() {
        if (isForward) {
            // Invertir dirección (hacia atrás)
            this.currentTime = this.duration;
            this.play();
            isForward = false;
        } else {
            // Volver a dirección normal (hacia adelante)
            this.currentTime = 0;
            this.play();
            isForward = true;
        }
    });
    
    // Control para reproducción inversa
    video.addEventListener('timeupdate', function() {
        if (!isForward && this.currentTime <= 0.1) {
            // Si está llegando al inicio en modo inverso, volver a dirección normal
            this.pause();
            this.currentTime = 0;
            this.play();
            isForward = true;
        }
    });
    
    // Manejo manual de reversa (compatible con más navegadores)
    function reversePlayback() {
        if (!isForward) {
            if (video.currentTime <= 0.1) {
                // Llegamos al inicio, cambiar a reproducción normal
                video.currentTime = 0;
                video.play();
                isForward = true;
            } else {
                // Seguir reproduciendo hacia atrás
                video.currentTime -= 0.05; // Ajusta la velocidad cambiando este valor
                requestAnimationFrame(reversePlayback);
            }
        }
    }
    
    // Cuando el video termine, iniciar reproducción inversa
    video.addEventListener('ended', function() {
        if (isForward) {
            isForward = false;
            video.pause();
            requestAnimationFrame(reversePlayback);
        }
    });
}

// Asegúrate de llamar a esta función al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    initHeroVideo();
});