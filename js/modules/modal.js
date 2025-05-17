/**
 * Modal module for Taligent website
 * Handles creation, opening and closing of modal windows
 */

/**
 * Initialize modal functionality
 */
function initModals() {
    'use strict';
    
    // Get all elements that should open a modal
    const modalTriggers = document.querySelectorAll('[data-modal]');
    
    // Get all close buttons inside modals
    const closeButtons = document.querySelectorAll('.modal-close');
    
    // Add click event to all modal triggers
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the modal ID from data attribute
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            
            if (!modal) return;
            
            openModal(modal);
        });
    });
    
    // Add click event to all close buttons
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });
    
    // Close modal when clicking on backdrop
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-backdrop')) {
            const modal = e.target.querySelector('.modal-content').closest('.modal');
            closeModal(modal);
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal.active');
            if (openModal) {
                closeModal(openModal);
            }
        }
    });
}

/**
 * Create and open a modal dynamically
 * @param {string} title - Modal title
 * @param {string} content - Modal content (can be HTML)
 * @param {Object} options - Modal options (size, closeButton, etc.)
 */
function createModal(title, content, options = {}) {
    // Default options
    const defaultOptions = {
        size: 'medium', // small, medium, large
        closeButton: true,
        id: 'dynamic-modal-' + Date.now(),
        onClose: null
    };
    
    // Merge default options with provided options
    const modalOptions = { ...defaultOptions, ...options };
    
    // Create modal elements
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.id = modalOptions.id;
    
    const modalBackdrop = document.createElement('div');
    modalBackdrop.classList.add('modal-backdrop');
    
    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content', `modal-${modalOptions.size}`);
    
    const modalHeader = document.createElement('div');
    modalHeader.classList.add('modal-header');
    
    const modalTitle = document.createElement('h3');
    modalTitle.classList.add('modal-title');
    modalTitle.textContent = title;
    
    const modalBody = document.createElement('div');
    modalBody.classList.add('modal-body');
    modalBody.innerHTML = content;
    
    const modalFooter = document.createElement('div');
    modalFooter.classList.add('modal-footer');
    
    // Add close button if needed
    if (modalOptions.closeButton) {
        const closeButton = document.createElement('button');
        closeButton.classList.add('modal-close');
        closeButton.innerHTML = '&times;';
        closeButton.setAttribute('aria-label', 'Close');
        
        closeButton.addEventListener('click', function() {
            closeModal(modal);
        });
        
        modalHeader.appendChild(closeButton);
    }
    
    // Assemble modal elements
    modalHeader.prepend(modalTitle);
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modalContent.appendChild(modalFooter);
    modalBackdrop.appendChild(modalContent);
    modal.appendChild(modalBackdrop);
    
    // Add modal to body
    document.body.appendChild(modal);
    
    // Open the modal
    setTimeout(() => openModal(modal), 10);
    
    // Store onClose callback if provided
    if (typeof modalOptions.onClose === 'function') {
        modal.onCloseCallback = modalOptions.onClose;
    }
    
    return modal;
}

/**
 * Open a modal
 * @param {HTMLElement} modal - The modal element to open
 */
function openModal(modal) {
    if (!modal) return;
    
    // Prevent body scrolling
    document.body.classList.add('modal-open');
    
    // Add active class to modal
    modal.classList.add('active');
    
    // Focus first focusable element in modal
    setTimeout(() => {
        const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusableElements.length) {
            focusableElements[0].focus();
        }
    }, 300);
    
    // Trigger custom event
    modal.dispatchEvent(new CustomEvent('modal:open'));
}

/**
 * Close a modal
 * @param {HTMLElement} modal - The modal element to close
 */
function closeModal(modal) {
    if (!modal) return;
    
    // Remove active class
    modal.classList.remove('active');
    
    // Allow body scrolling again
    const activeModals = document.querySelectorAll('.modal.active');
    if (activeModals.length === 0) {
        document.body.classList.remove('modal-open');
    }
    
    // Call onClose callback if exists
    if (typeof modal.onCloseCallback === 'function') {
        modal.onCloseCallback();
    }
    
    // Trigger custom event
    modal.dispatchEvent(new CustomEvent('modal:close'));
    
    // If it's a dynamic modal, remove it from DOM after animation
    if (modal.id.startsWith('dynamic-modal-')) {
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}