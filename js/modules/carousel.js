/**
 * Carousel module for Taligent website
 * Handles image sliders and carousels
 */

/**
 * Initialize all carousels on the page
 */
function initCarousels() {
    'use strict';
    
    // Find all carousel containers
    const carousels = document.querySelectorAll('.carousel');
    
    if (!carousels.length) return;
    
    // Initialize each carousel
    carousels.forEach((carousel, index) => {
        // Add unique ID if not present
        if (!carousel.id) {
            carousel.id = `carousel-${index}`;
        }
        
        setupCarousel(carousel);
    });
}

/**
 * Setup a specific carousel
 * @param {HTMLElement} carousel - The carousel container element
 */
function setupCarousel(carousel) {
    // Get carousel elements
    const track = carousel.querySelector('.carousel-track');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const nextButton = carousel.querySelector('.carousel-next');
    const prevButton = carousel.querySelector('.carousel-prev');
    const dotsContainer = carousel.querySelector('.carousel-dots');
    
    if (!track || !slides.length) return;
    
    // Options from data attributes
    const autoplay = carousel.dataset.autoplay === 'true';
    const interval = parseInt(carousel.dataset.interval) || 5000;
    const loop = carousel.dataset.loop !== 'false'; // Default to true
    
    // Set up initial state
    let currentIndex = 0;
    let autoplayTimer = null;
    
    // Create dots if container exists
    if (dotsContainer) {
        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            if (i === 0) dot.classList.add('active');
            dot.setAttribute('aria-label', `Slide ${i + 1}`);
            
            dot.addEventListener('click', () => {
                goToSlide(i);
                resetAutoplay();
            });
            
            dotsContainer.appendChild(dot);
        });
    }
    
    // Set up event listeners for controls
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            goToNext();
            resetAutoplay();
        });
    }
    
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            goToPrev();
            resetAutoplay();
        });
    }
    
    // Touch and swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        resetAutoplay();
    });
    
    // Handle keyboard navigation
    carousel.setAttribute('tabindex', '0');
    carousel.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            goToNext();
            resetAutoplay();
        } else if (e.key === 'ArrowLeft') {
            goToPrev();
            resetAutoplay();
        }
    });
    
    // Handle swipe
    function handleSwipe() {
        const diff = touchStartX - touchEndX;
        const threshold = 50; // Minimum swipe distance
        
        if (diff > threshold) {
            goToNext(); // Swipe left
        } else if (diff < -threshold) {
            goToPrev(); // Swipe right
        }
    }
    
    // Go to specific slide
    function goToSlide(index) {
        // Handle index bounds
        if (index < 0) {
            index = loop ? slides.length - 1 : 0;
        } else if (index >= slides.length) {
            index = loop ? 0 : slides.length - 1;
        }
        
        // Update current index
        currentIndex = index;
        
        // Update slide positions
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Update active state
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === currentIndex);
            slide.setAttribute('aria-hidden', i !== currentIndex);
        });
        
        // Update dots
        const dots = dotsContainer?.querySelectorAll('.carousel-dot');
        if (dots) {
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        }
        
        // Trigger custom event
        carousel.dispatchEvent(new CustomEvent('carousel:slide-change', {
            detail: { currentIndex, total: slides.length }
        }));
    }
    
    // Go to next slide
    function goToNext() {
        goToSlide(currentIndex + 1);
    }
    
    // Go to previous slide
    function goToPrev() {
        goToSlide(currentIndex - 1);
    }
    
    // Start autoplay if enabled
    function startAutoplay() {
        if (autoplay && slides.length > 1) {
            autoplayTimer = setInterval(goToNext, interval);
        }
    }
    
    // Reset autoplay timer
    function resetAutoplay() {
        if (autoplayTimer) {
            clearInterval(autoplayTimer);
            startAutoplay();
        }
    }
    
    // Pause autoplay on hover
    carousel.addEventListener('mouseenter', () => {
        if (autoplayTimer) {
            clearInterval(autoplayTimer);
        }
    });
    
    carousel.addEventListener('mouseleave', () => {
        if (autoplay) {
            startAutoplay();
        }
    });
    
    // Initialize first slide
    goToSlide(0);
    
    // Start autoplay if enabled
    startAutoplay();
    
    // Initialize resize handler for responsive carousels
    const resizeHandler = debounce(() => {
        // Update slide positions (in case of responsive changes)
        track.style.transition = 'none';
        goToSlide(currentIndex);
        
        // Re-enable transitions after resize
        setTimeout(() => {
            track.style.transition = '';
        }, 50);
    }, 250);
    
    window.addEventListener('resize', resizeHandler);
    
    // Public API
    carousel.carouselAPI = {
        goToSlide,
        goToNext,
        goToPrev,
        getCurrentIndex: () => currentIndex,
        getTotalSlides: () => slides.length,
        startAutoplay,
        stopAutoplay: () => {
            if (autoplayTimer) {
                clearInterval(autoplayTimer);
                autoplayTimer = null;
            }
        }
    };
}

/**
 * Create a carousel dynamically
 * @param {string} containerId - ID of container element to place carousel in
 * @param {Array} slides - Array of slide objects with image and caption
 * @param {Object} options - Carousel options
 * @return {HTMLElement} - The created carousel element
 */
function createCarousel(containerId, slides, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return null;
    
    // Default options
    const defaultOptions = {
        autoplay: true,
        interval: 5000,
        loop: true,
        showDots: true,
        showArrows: true,
        id: 'carousel-' + Date.now()
    };
    
    // Merge default options with provided options
    const carouselOptions = { ...defaultOptions, ...options };
    
    // Create carousel structure
    const carousel = document.createElement('div');
    carousel.classList.add('carousel');
    carousel.id = carouselOptions.id;
    carousel.dataset.autoplay = carouselOptions.autoplay;
    carousel.dataset.interval = carouselOptions.interval;
    carousel.dataset.loop = carouselOptions.loop;
    
    // Create carousel track
    const track = document.createElement('div');
    track.classList.add('carousel-track');
    
    // Create slides
    slides.forEach((slideData, index) => {
        const slide = document.createElement('div');
        slide.classList.add('carousel-slide');
        if (index === 0) slide.classList.add('active');
        slide.setAttribute('aria-hidden', index !== 0);
        
        // Slide image
        const img = document.createElement('img');
        img.src = slideData.image;
        img.alt = slideData.alt || '';
        
        // Slide caption (optional)
        if (slideData.caption) {
            const caption = document.createElement('div');
            caption.classList.add('carousel-caption');
            caption.innerHTML = slideData.caption;
            slide.appendChild(caption);
        }
        
        slide.appendChild(img);
        track.appendChild(slide);
    });
    
    carousel.appendChild(track);
    
    // Create navigation controls if enabled
    if (carouselOptions.showArrows && slides.length > 1) {
        const prevButton = document.createElement('button');
        prevButton.classList.add('carousel-prev');
        prevButton.setAttribute('aria-label', 'Previous slide');
        prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
        
        const nextButton = document.createElement('button');
        nextButton.classList.add('carousel-next');
        nextButton.setAttribute('aria-label', 'Next slide');
        nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
        
        carousel.appendChild(prevButton);
        carousel.appendChild(nextButton);
    }
    
    // Create dots if enabled
    if (carouselOptions.showDots && slides.length > 1) {
        const dots = document.createElement('div');
        dots.classList.add('carousel-dots');
        carousel.appendChild(dots);
    }
    
    // Add carousel to container
    container.appendChild(carousel);
    
    // Initialize the carousel
    setupCarousel(carousel);
    
    return carousel;
}