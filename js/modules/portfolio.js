/**
 * Portfolio module for Taligent website
 * Handles portfolio filtering, project modals and animations
 * Version: 2.0
 */

function initPortfolio() {
    'use strict';
    
    // Portfolio category filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');
    
    if (filterButtons.length && projectItems.length) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const category = this.dataset.category;
                
                // Update active filter button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Filter projects with smooth transitions
                let visibleCount = 0;
                projectItems.forEach((item, index) => {
                    const itemCategories = item.dataset.category.split(' ');
                    
                    if (category === 'all' || itemCategories.includes(category)) {
                        // Reset animation
                        item.style.animation = 'none';
                        item.offsetHeight; // Trigger reflow
                        
                        // Apply staggered animation delay
                        const delay = 0.1 * visibleCount;
                        item.style.animation = `projectAppear 0.5s ease ${delay}s forwards`;
                        
                        item.classList.remove('hidden');
                        visibleCount++;
                    } else {
                        // Fade out and hide
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            item.classList.add('hidden');
                        }, 300);
                    }
                });
                
                // Close any open modal
                closeProjectModals();
            });
        });
    }
    
    // Project details modal functionality
    initProjectModals();
    
    // Add hover effects to project cards
    enhanceProjectCards();
    
    // Initialize scroll reveal effects
    initScrollReveal();
    
    // Check URL hash for direct project access
    checkUrlHash();
    
    // Check for URL parameters for filtering
    const urlParams = getUrlParams();
    if (urlParams.category) {
        const categoryButton = document.querySelector(`.filter-btn[data-category="${urlParams.category}"]`);
        if (categoryButton) {
            categoryButton.click();
        }
    }
}

/**
 * Initialize project modals functionality
 */
function initProjectModals() {
    const viewDetailsButtons = document.querySelectorAll('.btn-view-details');
    
    if (!viewDetailsButtons.length) return;
    
    // Create modal container if it doesn't exist
    let modalBackdrop = document.getElementById('projectModalBackdrop');
    if (!modalBackdrop) {
        modalBackdrop = document.createElement('div');
        modalBackdrop.id = 'projectModalBackdrop';
        modalBackdrop.className = 'modal-backdrop';
        document.body.appendChild(modalBackdrop);
        
        // Close modal when clicking on backdrop
        modalBackdrop.addEventListener('click', function(e) {
            if (e.target === modalBackdrop) {
                closeProjectModals();
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
                closeProjectModals();
            }
        });
    }
    
    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const projectCard = this.closest('.project-card');
            const projectItem = this.closest('.project-item');
            const projectId = projectItem.id;
            
            // Get project details
            const title = projectCard.querySelector('.project-title').textContent;
            const category = projectCard.querySelector('.project-category').textContent;
            const imageElement = projectItem.querySelector('.project-image img');
            const imageSrc = imageElement ? imageElement.src : '';
            const imageAlt = imageElement ? imageElement.alt : title;
            
            // Get project info details
            const infoItems = projectItem.querySelectorAll('.info-item');
            let infoHTML = '';
            
            infoItems.forEach(item => {
                infoHTML += item.outerHTML;
            });
            
            // Get project description
            const description = projectItem.querySelector('.project-description');
            let descriptionHTML = '';
            
            if (description) {
                descriptionHTML = description.innerHTML;
            }
            
            // Create modal content
            createProjectModal(title, category, imageSrc, imageAlt, infoHTML, descriptionHTML, projectId);
            
            // Open modal
            modalBackdrop.classList.add('active');
            document.body.classList.add('modal-open');
            
            // Update URL hash for direct access
            window.history.replaceState(null, null, `#${projectId}`);
        });
    });
}

/**
 * Create project modal with content
 */
function createProjectModal(title, category, imageSrc, imageAlt, infoHTML, descriptionHTML, projectId) {
    const modalBackdrop = document.getElementById('projectModalBackdrop');
    
    // Create modal content
    const modalHTML = `
        <div class="modal-container" data-project="${projectId}">
            <div class="modal-header">
                <div>
                    <h2 class="modal-title">${title}</h2>
                    <p class="modal-subtitle">${category}</p>
                </div>
                <button class="modal-close" aria-label="Cerrar">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-content">
                ${imageSrc ? `
                <div class="modal-image">
                    <img src="${imageSrc}" alt="${imageAlt}">
                </div>
                ` : ''}
                <div class="modal-details">
                    <div class="modal-info">
                        ${infoHTML}
                    </div>
                    <div class="modal-description">
                        ${descriptionHTML}
                    </div>
                </div>
                <div class="modal-actions">
                    <a href="mailto:info@taligent.com.co?subject=Interés en proyecto ${title}" class="btn btn-primary">
                        <i class="fas fa-envelope"></i> Consultar sobre este proyecto
                    </a>
                </div>
            </div>
        </div>
    `;
    
    // Set modal content
    modalBackdrop.innerHTML = modalHTML;
    
    // Add close button event
    const closeButton = modalBackdrop.querySelector('.modal-close');
    if (closeButton) {
        closeButton.addEventListener('click', closeProjectModals);
    }
    
    // Add animations to modal elements
    const modalContainer = modalBackdrop.querySelector('.modal-container');
    if (modalContainer) {
        // Animate tech badges
        const techBadges = modalContainer.querySelectorAll('.tech-badge');
        techBadges.forEach((badge, index) => {
            badge.style.opacity = '0';
            badge.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                badge.style.transition = 'all 0.3s ease';
                badge.style.opacity = '1';
                badge.style.transform = 'translateY(0)';
            }, 500 + (index * 50));
        });
        
        // Animate feature list items
        const featureItems = modalContainer.querySelectorAll('.features-list li');
        featureItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(10px)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.3s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, 300 + (index * 50));
        });
    }
}

/**
 * Close all project modals
 */
function closeProjectModals() {
    const modalBackdrop = document.getElementById('projectModalBackdrop');
    if (modalBackdrop) {
        modalBackdrop.classList.remove('active');
        
        // Allow body scrolling again
        document.body.classList.remove('modal-open');
        
        // Remove hash from URL
        if (window.location.hash) {
            history.pushState('', document.title, window.location.pathname + window.location.search);
        }
    }
}

/**
 * Enhance project cards with interactive effects
 */
function enhanceProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        // Add parallax effect to image
        const image = card.querySelector('.project-image img');
        if (image) {
            card.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;
                
                // Calculate percentage
                const percentX = mouseX / rect.width;
                const percentY = mouseY / rect.height;
                
                // Apply subtle movement (max 5px in any direction)
                image.style.transform = `translate(${(percentX - 0.5) * 10}px, ${(percentY - 0.5) * 10}px) scale(1.05)`;
            });
            
            card.addEventListener('mouseleave', function() {
                image.style.transform = '';
            });
        }
        
        // Enhanced hover effect for button
        const button = card.querySelector('.btn-view-details');
        if (button) {
            const icon = button.querySelector('i');
            
            button.addEventListener('mouseover', function() {
                icon.style.transform = 'rotate(45deg)';
                icon.style.backgroundColor = 'var(--color-primary)';
                icon.style.color = 'white';
                icon.style.boxShadow = '0 3px 8px rgba(15, 111, 239, 0.3)';
            });
            
            button.addEventListener('mouseout', function() {
                icon.style.transform = '';
                icon.style.backgroundColor = '';
                icon.style.color = '';
                icon.style.boxShadow = '';
            });
        }
    });
}

/**
 * Initialize scroll reveal animations
 */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.project-card, .service-card, .section-header, .cta-content');
    
    if (!revealElements.length) return;
    
    const revealOnScroll = () => {
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight * 0.85) {
                element.classList.add('visible');
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Set initial state
    revealElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Initial check
    revealOnScroll();
    
    // Listen for scroll events (using throttle if available)
    if (typeof throttle === 'function') {
        window.addEventListener('scroll', throttle(revealOnScroll, 200));
    } else {
        window.addEventListener('scroll', revealOnScroll);
    }
}

/**
 * Check URL hash to open specific project
 */
function checkUrlHash() {
    const hash = window.location.hash;
    if (hash && hash.length > 1) {
        const projectId = hash.substring(1);
        const projectElement = document.getElementById(projectId);
        
        if (projectElement) {
            // Wait for page to fully load
            setTimeout(() => {
                // Scroll to project
                const headerHeight = document.querySelector('.header').offsetHeight;
                const filterHeight = document.querySelector('.portfolio-filter')?.offsetHeight || 0;
                
                window.scrollTo({
                    top: projectElement.offsetTop - (headerHeight + filterHeight + 20),
                    behavior: 'smooth'
                });
                
                // Highlight the project
                const projectCard = projectElement.querySelector('.project-card');
                if (projectCard) {
                    projectCard.style.transform = 'translateY(-15px)';
                    projectCard.style.boxShadow = '0 20px 40px rgba(15, 111, 239, 0.2)';
                    
                    // Reset after a few seconds
                    setTimeout(() => {
                        projectCard.style.transform = '';
                        projectCard.style.boxShadow = '';
                    }, 3000);
                }
                
                // Open project modal if it exists
                const viewDetailsButton = projectElement.querySelector('.btn-view-details');
                if (viewDetailsButton) {
                    viewDetailsButton.click();
                }
            }, 500);
        }
    }
}

/**
 * Get URL parameters as an object
 * @return {Object} - The URL parameters
 */
function getUrlParams() {
    const params = {};
    const searchParams = new URLSearchParams(window.location.search);
    for (const [key, value] of searchParams.entries()) {
        params[key] = value;
    }
    return params;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initPortfolio();
});