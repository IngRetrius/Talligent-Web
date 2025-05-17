/**
 * Main JavaScript file for Taligent website
 * Initializes all modules and components
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
    }
    
    // Scroll animations for elements
    const animatedElements = document.querySelectorAll('.fade-in, .fade-in-up, .fade-in-down, .fade-in-left, .fade-in-right, .scale-in');
    
    if (animatedElements.length > 0) {
        // Set initial state for all animated elements
        animatedElements.forEach(element => {
            element.style.opacity = '0';
        });
        
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
                }
            });
        };
        
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
                child.classList.add('fade-in-up');
                child.style.animationDelay = `${0.1 + (index * 0.1)}s`;
            });
        }
    });
}