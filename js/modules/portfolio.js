/**
 * Portfolio module for Taligent website
 * Handles portfolio filtering and project expansion functionality
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
                
                // Filter projects
                projectItems.forEach(item => {
                    const itemCategories = item.dataset.category.split(' ');
                    
                    if (category === 'all' || itemCategories.includes(category)) {
                        item.classList.remove('hidden');
                        setTimeout(() => {
                            item.style.opacity = '1';
                        }, 10);
                    } else {
                        item.style.opacity = '0';
                        setTimeout(() => {
                            item.classList.add('hidden');
                        }, 300);
                    }
                });
                
                // Close any expanded projects
                closeAllProjects();
            });
        });
    }
    
    // Project details expansion
    initProjectExpansion();
    
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
 * Initialize project expansion functionality
 */
function initProjectExpansion() {
    const viewDetailsButtons = document.querySelectorAll('.btn-view-details');
    
    if (!viewDetailsButtons.length) return;
    
    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', function() {
            const projectCard = this.closest('.project-card');
            const detailsContainer = projectCard.querySelector('.project-details-container');
            
            // Toggle button active state
            this.classList.toggle('active');
            
            // Toggle expanded state
            if (projectCard.classList.contains('expanded')) {
                // Close this project
                projectCard.classList.remove('expanded');
                this.innerHTML = 'Ver Detalles <i class="fas fa-chevron-down"></i>';
                
                // Animate the closing with height transition
                const startHeight = detailsContainer.scrollHeight;
                detailsContainer.style.height = startHeight + 'px';
                setTimeout(() => {
                    detailsContainer.style.height = '0px';
                }, 10);
            } else {
                // Close any other expanded projects first
                closeAllProjects();
                
                // Open this project
                projectCard.classList.add('expanded');
                this.innerHTML = 'Cerrar <i class="fas fa-chevron-up"></i>';
                
                // Measure and set the height for animation
                const contentHeight = detailsContainer.scrollHeight;
                detailsContainer.style.height = contentHeight + 'px';
                
                // Scroll to this project
                setTimeout(() => {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const filterHeight = document.querySelector('.portfolio-filter')?.offsetHeight || 0;
                    const offset = headerHeight + filterHeight + 20;
                    
                    window.scrollTo({
                        top: projectCard.getBoundingClientRect().top + window.pageYOffset - offset,
                        behavior: 'smooth'
                    });
                }, 300);
            }
        });
    });
    
    // Recalculate heights on window resize
    window.addEventListener('resize', debounce(() => {
        const expandedCards = document.querySelectorAll('.project-card.expanded');
        expandedCards.forEach(card => {
            const detailsContainer = card.querySelector('.project-details-container');
            if (detailsContainer) {
                detailsContainer.style.height = 'auto';
                const contentHeight = detailsContainer.scrollHeight;
                detailsContainer.style.height = contentHeight + 'px';
            }
        });
    }, 250));
}

/**
 * Close all expanded projects
 */
function closeAllProjects() {
    const expandedCards = document.querySelectorAll('.project-card.expanded');
    const activeButtons = document.querySelectorAll('.btn-view-details.active');
    
    expandedCards.forEach(card => {
        card.classList.remove('expanded');
        const detailsContainer = card.querySelector('.project-details-container');
        if (detailsContainer) {
            detailsContainer.style.height = '0';
        }
    });
    
    activeButtons.forEach(button => {
        button.classList.remove('active');
        button.innerHTML = 'Ver Detalles <i class="fas fa-chevron-down"></i>';
    });
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
                // Get header and filter height for offset
                const headerHeight = document.querySelector('.header').offsetHeight;
                const filterHeight = document.querySelector('.portfolio-filter')?.offsetHeight || 0;
                
                // Scroll to project
                window.scrollTo({
                    top: projectElement.offsetTop - (headerHeight + filterHeight + 20),
                    behavior: 'smooth'
                });
                
                // Expand the project
                const viewDetailsButton = projectElement.querySelector('.btn-view-details');
                if (viewDetailsButton) {
                    viewDetailsButton.click();
                }
            }, 500);
        }
    }
}