// Archivo: js/main.js (MODIFICADO)
/**
 * Main JavaScript file for Taligent website
 * Initializes all modules and components
 * Version: 2.1
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
    
    // Inicializar módulo de licitación si estamos en esa página
    if (document.querySelector('.licitacion-hero')) {
        initLicitacion();
    }
    
    // Initialize animations
    initAnimations();
    
    // Initialize hero video
    initHeroVideo();
    
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
        { selector: '.methodology-steps', childSelector: '.step' },
        { selector: '.destacados-grid', childSelector: '.destacado-card' }, // Añadido para destacados
        { selector: '.equipo-grid', childSelector: '.equipo-card' } // Añadido para equipo
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
    const parallaxBgs = document.querySelectorAll('.hero, .portfolio-hero, .portfolio-cta, .licitacion-hero, .licitacion-cta');
    
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
 * Inicializa y controla el video de la sección Hero
 */
function initHeroVideo() {
    const video = document.getElementById('heroVideo');
    if (!video) {
        return;
    }
    
    // Asegurar que el video se reproduce correctamente
    video.addEventListener('loadeddata', function() {
        // Intentar reproducir el video (algunos navegadores pueden bloquear el autoplay)
        video.play().catch(err => {
            console.warn('Reproducción automática bloqueada:', err);
            
            // Alternativa: mostrar un botón para reproducir manualmente
            if (err.name === 'NotAllowedError') {
                createPlayButton(video);
            }
        });
    });
    
    // Manejar errores de carga del video
    video.addEventListener('error', function(e) {
        console.error('Error en la reproducción del video:', e);
        // Fallback a una imagen estática si el video falla
        handleVideoError();
    });
    
    // Optimizar rendimiento en dispositivos móviles
    if (window.matchMedia('(max-width: 768px)').matches) {
        // En móviles, usar una resolución más baja o una tasa de fotogramas menor
        video.setAttribute('playbackRate', '0.8');
    }
}

/**
 * Crea un botón para iniciar manualmente el video
 * (solución para navegadores que bloquean autoplay)
 */
function createPlayButton(video) {
    const heroSection = document.getElementById('hero');
    if (!heroSection) return;
    
    const playButton = document.createElement('button');
    playButton.className = 'hero-play-button';
    playButton.innerHTML = '<i class="fas fa-play"></i>';
    playButton.setAttribute('aria-label', 'Reproducir video de fondo');
    
    playButton.addEventListener('click', function() {
        video.play();
        this.remove();
    });
    
    // Estilos inline para el botón
    playButton.style.cssText = `
        position: absolute;
        bottom: 20px;
        right: 20px;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: rgba(15, 111, 239, 0.8);
        color: white;
        border: none;
        cursor: pointer;
        z-index: 10;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        transition: all 0.3s ease;
    `;
    
    heroSection.appendChild(playButton);
}

/**
 * Maneja errores en la reproducción del video
 * Cambia a una imagen estática como fallback
 */
function handleVideoError() {
    const videoContainer = document.querySelector('.hero-video-container');
    if (!videoContainer) return;
    
    // Quitar el video
    videoContainer.innerHTML = '';
    
    // Aplicar una imagen de fondo como fallback
    videoContainer.style.cssText = `
        background-image: url('assets/images/hero-bg-static.jpg');
        background-size: cover;
        background-position: center;
        background-color: rgba(8, 66, 141, 0.6);
        background-blend-mode: overlay;
    `;
}