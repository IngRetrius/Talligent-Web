/**
 * Footer component for Taligent website
 * Handles footer functionality
 */

function initFooter() {
    'use strict';
    
    // Current year for copyright
    updateCopyrightYear();
    
    // Newsletter subscription form
    initNewsletterForm();
    
    // Back to top link functionality
    initBackToTop();
    
    // Footer accordion for mobile
    initFooterAccordion();
}

/**
 * Update copyright year to current year
 */
function updateCopyrightYear() {
    const copyrightYear = document.querySelector('.copyright-year');
    
    if (copyrightYear) {
        const currentYear = new Date().getFullYear();
        copyrightYear.textContent = currentYear;
    }
}

/**
 * Initialize newsletter subscription form
 */
function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletterForm');
    
    if (!newsletterForm) return;
    
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const emailInput = this.querySelector('input[type="email"]');
        const submitButton = this.querySelector('button[type="submit"]');
        const statusMessage = this.querySelector('.form-status') || document.createElement('div');
        
        if (!statusMessage.classList.contains('form-status')) {
            statusMessage.classList.add('form-status');
            this.appendChild(statusMessage);
        }
        
        // Validate email
        if (!emailInput || !isValidEmail(emailInput.value)) {
            statusMessage.textContent = 'Por favor, ingrese un correo electrónico válido.';
            statusMessage.classList.add('error');
            statusMessage.classList.remove('success');
            return;
        }
        
        // Disable form elements during submission
        emailInput.disabled = true;
        submitButton.disabled = true;
        
        // Show loading indicator
        const originalButtonText = submitButton.textContent;
        submitButton.innerHTML = '<span class="spinner"></span> Enviando...';
        
        // Simulate API request (replace with actual API call in production)
        setTimeout(() => {
            // Enable form elements
            emailInput.disabled = false;
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
            
            // Show success message
            statusMessage.textContent = '¡Gracias por suscribirse a nuestro boletín!';
            statusMessage.classList.add('success');
            statusMessage.classList.remove('error');
            
            // Reset form
            emailInput.value = '';
            
            // Hide message after some time
            setTimeout(() => {
                statusMessage.textContent = '';
            }, 5000);
        }, 1500);
    });
}

/**
 * Initialize back to top button functionality
 */
function initBackToTop() {
    const backToTopButton = document.getElementById('backToTop');
    
    if (!backToTopButton) return;
    
    backToTopButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Initialize footer accordion for mobile view
 */
function initFooterAccordion() {
    const footerTitles = document.querySelectorAll('.footer-title');
    
    if (!footerTitles.length) return;
    
    // Only apply accordion on mobile
    const checkScreenSize = () => {
        const isMobile = window.innerWidth < 768;
        
        footerTitles.forEach(title => {
            // Find associated menu
            const menu = title.nextElementSibling;
            if (!menu) return;
            
            if (isMobile) {
                // Add toggle functionality for mobile
                title.classList.add('accordion-toggle');
                menu.classList.add('accordion-content');
                
                // Add click event if not already added
                if (!title.hasListenerAdded) {
                    title.addEventListener('click', function() {
                        this.classList.toggle('active');
                        menu.classList.toggle('active');
                        
                        // Toggle aria-expanded attribute
                        const isExpanded = this.classList.contains('active');
                        this.setAttribute('aria-expanded', isExpanded);
                    });
                    
                    // Set initial state
                    title.setAttribute('aria-expanded', 'false');
                    
                    // Mark as listener added
                    title.hasListenerAdded = true;
                }
            } else {
                // Remove accordion classes for desktop
                title.classList.remove('accordion-toggle', 'active');
                menu.classList.remove('accordion-content', 'active');
                title.removeAttribute('aria-expanded');
            }
        });
    };
    
    // Check on load
    checkScreenSize();
    
    // Check on resize
    window.addEventListener('resize', debounce(checkScreenSize, 250));
}

/**
 * Set up social media sharing links
 */
function initSocialSharing() {
    const shareLinks = document.querySelectorAll('.social-share-link');
    
    if (!shareLinks.length) return;
    
    shareLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const type = this.dataset.share;
            const url = encodeURIComponent(window.location.href);
            const title = encodeURIComponent(document.title);
            
            let shareUrl = '';
            
            switch (type) {
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                    break;
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
                    break;
                case 'linkedin':
                    shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                    break;
                case 'whatsapp':
                    shareUrl = `https://wa.me/?text=${title}%20${url}`;
                    break;
                case 'email':
                    shareUrl = `mailto:?subject=${title}&body=${url}`;
                    break;
            }
            
            if (shareUrl) {
                if (type === 'email') {
                    window.location.href = shareUrl;
                } else {
                    window.open(shareUrl, '_blank', 'width=600,height=400');
                }
            }
        });
    });
}