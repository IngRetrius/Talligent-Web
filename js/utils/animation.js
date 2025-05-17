/**
 * Animation utility functions for Taligent website
 */

/**
 * Animate number counting
 * @param {HTMLElement} element - The element containing the number
 * @param {number} start - The starting number
 * @param {number} end - The ending number
 * @param {number} duration - The animation duration in milliseconds
 * @param {string} prefix - Text to display before the number
 * @param {string} suffix - Text to display after the number
 */
function animateCounter(element, start, end, duration = 2000, prefix = '', suffix = '') {
    if (!element) return;
    
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const currentValue = Math.floor(progress * (end - start) + start);
        element.textContent = `${prefix}${currentValue}${suffix}`;

        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            element.textContent = `${prefix}${end}${suffix}`;
        }
    };
    
    window.requestAnimationFrame(step);
}

/**
 * Adds a fade-in animation to elements as they enter the viewport
 * @param {string} selector - CSS selector for elements to animate
 * @param {string} animationClass - The CSS animation class to apply
 * @param {number} threshold - Viewport threshold (0-1)
 */
function fadeInOnScroll(selector, animationClass = 'fade-in', threshold = 0.1) {
    const elements = document.querySelectorAll(selector);
    
    if (!elements.length) return;
    
    // Set initial opacity to 0
    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transition = 'opacity 0.5s ease';
    });
    
    // Create observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.classList.add(animationClass);
                // Stop observing element after it's been animated
                observer.unobserve(entry.target);
            }
        });
    }, { threshold });
    
    // Start observing elements
    elements.forEach(el => observer.observe(el));
}

/**
 * Create a typing animation effect
 * @param {HTMLElement} element - The element to apply typing animation to
 * @param {string} text - The text to type
 * @param {number} speed - The typing speed in milliseconds
 * @param {number} delay - Delay before typing starts in milliseconds
 * @param {Function} callback - Function to call when typing is complete
 */
function typeText(element, text, speed = 50, delay = 0, callback) {
    if (!element) return;
    
    element.textContent = '';
    
    setTimeout(() => {
        let i = 0;
        const typeNextChar = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeNextChar, speed);
            } else if (typeof callback === 'function') {
                callback();
            }
        };
        
        typeNextChar();
    }, delay);
}

/**
 * Add parallax effect to an element
 * @param {HTMLElement} element - The element to apply parallax to
 * @param {number} speed - The parallax speed factor
 */
function parallaxEffect(element, speed = 0.5) {
    if (!element) return;
    
    window.addEventListener('scroll', () => {
        const scrollPosition = window.pageYOffset;
        element.style.transform = `translateY(${scrollPosition * speed}px)`;
    });
}