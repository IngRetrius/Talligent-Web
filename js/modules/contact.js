/**
 * Contact form validation and submission handling
 * Version: 1.0
 */

document.addEventListener('DOMContentLoaded', function() {
    initContactForm();
});

/**
 * Initialize contact form functionality
 */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    // Form validation and submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm(contactForm)) {
            // Simulate form submission (replace with actual submission in production)
            submitForm(contactForm);
        }
    });
    
    // Real-time validation on input fields
    const formInputs = contactForm.querySelectorAll('.form-control');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('is-invalid')) {
                validateField(this);
            }
        });
    });
}

/**
 * Validate an individual form field
 * @param {HTMLElement} field - The field to validate
 * @return {boolean} - Whether the field is valid
 */
function validateField(field) {
    let isValid = true;
    
    // Clear previous validation state
    field.classList.remove('is-valid', 'is-invalid');
    
    // Skip validation for non-required fields if empty
    if (!field.required && field.value.trim() === '') {
        return true;
    }
    
    // Validate based on type
    switch (field.type) {
        case 'email':
            isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value);
            break;
            
        case 'tel':
            // Simple phone validation - adjust as needed
            if (field.required || field.value.trim() !== '') {
                isValid = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(field.value);
            }
            break;
            
        default:
            isValid = field.value.trim() !== '';
    }
    
    // Set appropriate class
    if (isValid) {
        field.classList.add('is-valid');
    } else {
        field.classList.add('is-invalid');
    }
    
    return isValid;
}

/**
 * Validate the entire form
 * @param {HTMLFormElement} form - The form to validate
 * @return {boolean} - Whether the form is valid
 */
function validateForm(form) {
    const formInputs = form.querySelectorAll('.form-control');
    let isFormValid = true;
    
    formInputs.forEach(input => {
        if (!validateField(input)) {
            isFormValid = false;
        }
    });
    
    return isFormValid;
}

/**
 * Submit the form with animation
 * @param {HTMLFormElement} form - The form to submit
 */
function submitForm(form) {
    const submitButton = form.querySelector('.btn-submit');
    const originalText = submitButton.textContent;
    const formFields = form.querySelectorAll('.form-control');
    const successMessage = document.getElementById('formSuccessMessage');
    
    // Disable form and show loading state
    formFields.forEach(field => field.disabled = true);
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    
    // Simulate API request (replace with actual API call)
    setTimeout(() => {
        // Hide form controls
        form.querySelectorAll('.form-group').forEach(group => {
            group.style.opacity = '0';
            group.style.transform = 'translateY(20px)';
            group.style.transition = 'all 0.3s ease';
        });
        
        // Show success message
        if (successMessage) {
            setTimeout(() => {
                successMessage.style.display = 'block';
            }, 300);
        }
        
        // Reset form after delay
        setTimeout(() => {
            form.reset();
            formFields.forEach(field => {
                field.disabled = false;
                field.classList.remove('is-valid');
            });
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
            
            // Restore form visibility
            form.querySelectorAll('.form-group').forEach(group => {
                group.style.opacity = '1';
                group.style.transform = 'translateY(0)';
            });
            
            // Hide success message
            if (successMessage) {
                successMessage.style.display = 'none';
            }
        }, 5000);
    }, 1500);
}