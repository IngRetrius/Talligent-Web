/**
 * Header component for Taligent website
 * Handles header styling on scroll
 */

function initHeader() {
    'use strict';
    
    const header = document.getElementById('header');
    
    if (!header) return;
    
    // Change header style on scroll
    const updateHeaderStyle = throttle(() => {
        if (window.pageYOffset > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, 100);
    
    // Initial check
    updateHeaderStyle();
    
    // Listen for scroll events
    window.addEventListener('scroll', updateHeaderStyle);
    
    // Add header height as padding-top to body if it's fixed
    if (getComputedStyle(header).position === 'fixed') {
        const headerHeight = header.offsetHeight;
        document.body.style.paddingTop = headerHeight + 'px';
        
        // Update on resize
        window.addEventListener('resize', debounce(() => {
            const updatedHeaderHeight = header.offsetHeight;
            document.body.style.paddingTop = updatedHeaderHeight + 'px';
        }, 200));
    }
}