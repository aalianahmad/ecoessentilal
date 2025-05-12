/**
 * EcoEssentials - Main JavaScript File
 * This file contains all the interactive functionality for the EcoEssentials website
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initMobileMenu();
    initSmoothScrolling();
    initProductFilter();
    initFormValidation();
    initAnimations();
    initTestimonialSlider();
    initImageGallery();
    initScrollProgressBar();
    initLazyLoading();
    initCartFunctionality();
});

/**
 * Mobile Menu Functionality
 */
function initMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    
    if (!mobileMenu || !navLinks) return;
    
    // Toggle mobile menu
    mobileMenu.addEventListener('click', () => {
        // Create menu open/close animation
        if (navLinks.style.display === 'flex') {
            // Closing animation
            navLinks.style.opacity = 0;
            setTimeout(() => {
                navLinks.style.display = 'none';
            }, 300);
        } else {
            // Opening animation
            navLinks.style.display = 'flex';
            navLinks.style.opacity = 0;
            setTimeout(() => {
                navLinks.style.opacity = 1;
            }, 10);
        }
    });
    
    // Add mobile menu styles
    if (!navLinks.classList.contains('mobile-styled')) {
        navLinks.classList.add('mobile-styled');
        
        // Add mobile-specific styles
        const style = document.createElement('style');
        style.innerHTML = `
            @media (max-width: 768px) {
                .nav-links {
                    position: absolute;
                    top: 80px;
                    left: 0;
                    right: 0;
                    background-color: white;
                    flex-direction: column;
                    align-items: center;
                    padding: 20px;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    z-index: 1000;
                }
                
                .nav-links li {
                    margin: 15px 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Close menu when clicking on links or outside
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && 
            navLinks.style.display === 'flex' && 
            !navLinks.contains(e.target) && 
            e.target !== mobileMenu) {
            navLinks.style.opacity = 0;
            setTimeout(() => {
                navLinks.style.display = 'none';
            }, 300);
        }
    });
    
    // Close menu when window is resized above mobile breakpoint
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            navLinks.style.display = '';
            navLinks.style.opacity = '';
        }
    });
}

/**
 * Smooth Scrolling for Anchor Links
 */
function initSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Enhanced smooth scroll with easing
                const startPosition = window.pageYOffset;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - 80;
                const distance = targetPosition - startPosition;
                const duration = 1000;
                let start = null;
                
                function step(timestamp) {
                    if (!start) start = timestamp;
                    const progress = timestamp - start;
                    
                    // Easing function - easeInOutCubic
                    const easeInOutCubic = t => t < 0.5 
                        ? 4 * t * t * t 
                        : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
                    
                    window.scrollTo(0, startPosition + distance * easeInOutCubic(Math.min(progress / duration, 1)));
                    
                    if (progress < duration) {
                        window.requestAnimationFrame(step);
                    }
                }
                
                window.requestAnimationFrame(step);
                
                // Close mobile menu if open
                if (window.innerWidth <= 768) {
                    const navLinks = document.querySelector('.nav-links');
                    if (navLinks && navLinks.style.display === 'flex') {
                        navLinks.style.opacity = 0;
                        setTimeout(() => {
                            navLinks.style.display = 'none';
                        }, 300);
                    }
                }
            }
        });
    });
}

/**
 * Product Filtering System
 */
function initProductFilter() {
    const filterButtons = document.querySelectorAll('.product-filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    if (!filterButtons.length || !productCards.length) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            // Filter products
            productCards.forEach(card => {
                if (filterValue === 'all') {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = 1;
                        card.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    if (card.classList.contains(filterValue)) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = 1;
                            card.style.transform = 'scale(1)';
                        }, 10);
                    } else {
                        card.style.opacity = 0;
                        card.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                }
            });
        });
    });
    
    // Add necessary styles
    const style = document.createElement('style');
    style.innerHTML = `
        .product-card {
            transition: opacity 0.3s ease, transform 0.3s ease;
        }
        
        .product-filter-btn {
            cursor: pointer;
            padding: 8px 15px;
            margin: 0 5px 10px;
            background-color: #f8f9fa;
            border: none;
            border-radius: 20px;
            transition: all 0.3s ease;
        }
        
        .product-filter-btn.active {
            background-color: #2c6e49;
            color: white;
        }
    `;
    document.head.appendChild(style);
}

/**
 * Form Validation
 */
function initFormValidation() {
    const contactForm = document.querySelector('.contact-form form');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;
        const formData = {};
        
        // Enhanced validation
        contactForm.querySelectorAll('.form-control').forEach(input => {
            // Remove previous error messages
            const existingError = input.parentElement.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }
            
            // Get field name
            const fieldName = input.getAttribute('placeholder') || 'This field';
            
            // Store value in formData
            formData[input.name || input.id || fieldName] = input.value;
            
            // Check if empty
            if (!input.value.trim()) {
                isValid = false;
                input.style.borderColor = '#dc3545';
                
                // Add error message
                const errorMessage = document.createElement('p');
                errorMessage.classList.add('error-message');
                errorMessage.textContent = `${fieldName} is required.`;
                errorMessage.style.color = '#dc3545';
                errorMessage.style.fontSize = '0.85rem';
                errorMessage.style.marginTop = '5px';
                input.parentElement.appendChild(errorMessage);
            } else {
                input.style.borderColor = '#ced4da';
                
                // Check email format if it's an email field
                if (input.type === 'email' || input.id === 'email' || input.name === 'email' || 
                    input.placeholder.toLowerCase().includes('email')) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(input.value)) {
                        isValid = false;
                        input.style.borderColor = '#dc3545';
                        
                        // Add error message
                        const errorMessage = document.createElement('p');
                        errorMessage.classList.add('error-message');
                        errorMessage.textContent = 'Please enter a valid email address.';
                        errorMessage.style.color = '#dc3545';
                        errorMessage.style.fontSize = '0.85rem';
                        errorMessage.style.marginTop = '5px';
                        input.parentElement.appendChild(errorMessage);
                    }
                }
            }
        });
        
        if (isValid) {
            // Form submission success feedback
            const successMessage = document.createElement('div');
            successMessage.classList.add('success-message');
            successMessage.innerHTML = `
                <div style="text-align: center; padding: 20px; background-color: #e8f5e9; border-radius: 10px; margin-top: 20px;">
                    <h3 style="color: #2c6e49; margin-bottom: 10px;">Thank You!</h3>
                    <p>Your message has been sent successfully. We'll get back to you soon.</p>
                </div>
            `;
            
            // Replace form with success message
            contactForm.style.opacity = 0;
            setTimeout(() => {
                contactForm.parentElement.replaceChild(successMessage, contactForm);
                successMessage.style.opacity = 0;
                setTimeout(() => {
                    successMessage.style.opacity = 1;
                    successMessage.style.transition = 'opacity 0.5s ease';
                }, 10);
            }, 300);
            
            // Log form data (in a real application, this would be sent to a server)
            console.log('Form submitted:', formData);
        } else {
            // Scroll to first error
            const firstError = contactForm.querySelector('.error-message');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
    
    // Real-time validation
    contactForm.querySelectorAll('.form-control').forEach(input => {
        input.addEventListener('input', function() {
            // Remove error message if exists
            const existingError = input.parentElement.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }
            
            // Reset border color
            input.style.borderColor = '#ced4da';
        });
    });
}

/**
 * Animations
 */
function initAnimations() {
    // Fade-in animations for sections
    const animateSections = document.querySelectorAll('.section-title, .feature-card, .product-card, .about-content, .testimonial-card, .principle-card');
    
    if (!animateSections.length) return;
    
    // Add necessary styles
    const style = document.createElement('style');
    style.innerHTML = `
        .fade-in {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .fade-in.visible {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
    
    // Add fade-in class to elements
    animateSections.forEach(section => {
        section.classList.add('fade-in');
    });
    
    // Function to check if element is in viewport
    const isInViewport = element => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
            rect.bottom >= 0 &&
            rect.left >= 0 &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    };
    
    // Check elements on scroll
    const checkElements = () => {
        animateSections.forEach(section => {
            if (isInViewport(section)) {
                section.classList.add('visible');
            }
        });
    };
    
    // Add event listener for scroll
    window.addEventListener('scroll', checkElements);
    
    // Check on initial load
    setTimeout(checkElements, 100);
}

/**
 * Testimonial Slider
 */
function initTestimonialSlider() {
    const testimonialButtons = document.querySelectorAll('.testimonial-btn');
    const testimonialCard = document.querySelector('.testimonial-card');
    
    if (!testimonialButtons.length || !testimonialCard) return;
    
    // Testimonial data (this could come from a CMS or API in a real project)
    const testimonials = [
        {
            image: '👩',
            text: "I've been searching for truly sustainable kitchen products for years, and EcoEssentials exceeded my expectations. The bamboo utensil set is not only beautiful but has held up perfectly for over a year of daily use.",
            author: "Sarah Johnson",
            role: "Environmental Educator"
        },
        {
            image: '👨',
            text: "As someone who tries to minimize my environmental footprint, finding EcoEssentials was a game-changer. Their commitment to zero-waste packaging and sustainable materials is impressive, and the products are genuinely high-quality.",
            author: "Michael Rodriguez",
            role: "Sustainability Consultant"
        },
        {
            image: '👩',
            text: "The recycled glass water bottle is stunning and durable. I've received so many compliments on it, which gives me the opportunity to talk about sustainability with others. Great conversation starter!",
            author: "Emma Chen",
            role: "Fitness Instructor"
        },
        {
            image: '👨',
            text: "I appreciate that EcoEssentials is transparent about their production process. Knowing that the artisans who made my purchases are treated fairly makes me feel good about supporting this business.",
            author: "David Miller",
            role: "Ethics Professor"
        },
        {
            image: '👩',
            text: "The organic cotton sheets are the softest I've ever used, and I love that they're free from harmful chemicals. My sensitive skin has never been happier, and I'm sleeping better knowing I made an eco-friendly choice.",
            author: "Rachel Thompson",
            role: "Holistic Health Coach"
        }
    ];
    
    let currentTestimonialIndex = 0;
    let isAnimating = false;
    
    // Add animation styles
    const style = document.createElement('style');
    style.innerHTML = `
        .testimonial-card {
            transition: opacity 0.3s ease, transform 0.3s ease;
        }
        
        .testimonial-btn {
            cursor: pointer;
        }
        
        .testimonial-indicators {
            display: flex;
            justify-content: center;
            margin-top: 20px;
        }
        
        .testimonial-indicator {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background-color: #e9ecef;
            margin: 0 5px;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }
        
        .testimonial-indicator.active {
            background-color: #2c6e49;
        }
    `;
    document.head.appendChild(style);
    
    // Create indicators
    const indicatorsContainer = document.createElement('div');
    indicatorsContainer.classList.add('testimonial-indicators');
    
    testimonials.forEach((_, index) => {
        const indicator = document.createElement('div');
        indicator.classList.add('testimonial-indicator');
        if (index === 0) indicator.classList.add('active');
        
        indicator.addEventListener('click', () => {
            if (isAnimating || index === currentTestimonialIndex) return;
            
            currentTestimonialIndex = index;
            updateTestimonial(index);
            updateIndicators();
        });
        
        indicatorsContainer.appendChild(indicator);
    });
    
    const testimonialNav = document.querySelector('.testimonial-nav');
    if (testimonialNav) {
        testimonialNav.after(indicatorsContainer);
    }
    
    function updateIndicators() {
        const indicators = document.querySelectorAll('.testimonial-indicator');
        indicators.forEach((indicator, index) => {
            if (index === currentTestimonialIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }
    
    function updateTestimonial(index) {
        if (isAnimating) return;
        
        isAnimating = true;
        testimonialCard.style.opacity = 0;
        testimonialCard.style.transform = 'translateX(20px)';
        
        setTimeout(() => {
            const testimonial = testimonials[index];
            
            testimonialCard.innerHTML = `
                <div class="testimonial-img">${testimonial.image}</div>
                <p class="testimonial-text">"${testimonial.text}"</p>
                <h4 class="testimonial-author">${testimonial.author}</h4>
                <p class="testimonial-role">${testimonial.role}</p>
            `;
            
            testimonialCard.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                testimonialCard.style.opacity = 1;
                testimonialCard.style.transform = 'translateX(0)';
                isAnimating = false;
            }, 50);
        }, 300);
    }
    
    // Previous button
    testimonialButtons[0].addEventListener('click', () => {
        if (isAnimating) return;
        
        currentTestimonialIndex = (currentTestimonialIndex - 1 + testimonials.length) % testimonials.length;
        updateTestimonial(currentTestimonialIndex);
        updateIndicators();
    });
    
    // Next button
    testimonialButtons[1].addEventListener('click', () => {
        if (isAnimating) return;
        
        currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonials.length;
        updateTestimonial(currentTestimonialIndex);
        updateIndicators();
    });
    
    // Auto rotate testimonials
    setInterval(() => {
        if (document.hidden) return; // Don't change if page is not visible
        
        currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonials.length;
        updateTestimonial(currentTestimonialIndex);
        updateIndicators();
    }, 8000);
}

/**
 * Image Gallery Lightbox
 */
function initImageGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item, .feature-detail-img, .about-img');
    
    if (!galleryItems.length) return;
    
    // Create lightbox elements
    const lightbox = document.createElement('div');
    lightbox.classList.add('lightbox');
    lightbox.style.display = 'none';
    
    const lightboxContent = document.createElement('div');
    lightboxContent.classList.add('lightbox-content');
    
    const lightboxClose = document.createElement('span');
    lightboxClose.classList.add('lightbox-close');
    lightboxClose.innerHTML = '&times;';
    
    const lightboxImage = document.createElement('img');
    lightboxImage.classList.add('lightbox-image');
    
    const lightboxCaption = document.createElement('div');
    lightboxCaption.classList.add('lightbox-caption');
    
    // Assemble lightbox
    lightboxContent.appendChild(lightboxClose);
    lightboxContent.appendChild(lightboxImage);
    lightboxContent.appendChild(lightboxCaption);
    lightbox.appendChild(lightboxContent);
    document.body.appendChild(lightbox);
    
    // Add lightbox styles
    const style = document.createElement('style');
    style.innerHTML = `
        .lightbox {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .lightbox.active {
            opacity: 1;
        }
        
        .lightbox-content {
            position: relative;
            max-width: 90%;
            max-height: 90%;
        }
        
        .lightbox-image {
            max-width: 100%;
            max-height: 80vh;
            border-radius: 5px;
            box-shadow: 0 5px 30px rgba(0, 0, 0, 0.3);
        }
        
        .lightbox-close {
            position: absolute;
            top: -40px;
            right: 0;
            font-size: 30px;
            color: white;
            cursor: pointer;
            transition: transform 0.3s ease;
        }
        
        .lightbox-close:hover {
            transform: scale(1.2);
        }
        
        .lightbox-caption {
            color: white;
            text-align: center;
            margin-top: 15px;
            font-size: 16px;
        }
        
        .gallery-item {
            cursor: pointer;
            overflow: hidden;
        }
        
        .gallery-item img {
            transition: transform 0.3s ease;
        }
        
        .gallery-item:hover img {
            transform: scale(1.05);
        }
    `;
    document.head.appendChild(style);
    
    // Add click event to gallery items
    galleryItems.forEach(item => {
        item.style.cursor = 'pointer';
        
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            if (!img) return;
            
            lightboxImage.src = img.src;
            
            // Get caption if available
            let caption = '';
            const captionElement = item.querySelector('.gallery-caption');
            if (captionElement) {
                const captionTitle = captionElement.querySelector('h4');
                const captionText = captionElement.querySelector('p');
                
                if (captionTitle && captionText) {
                    caption = `<h4>${captionTitle.textContent}</h4><p>${captionText.textContent}</p>`;
                }
            }
            
            lightboxCaption.innerHTML = caption;
            
            // Show lightbox
            lightbox.style.display = 'flex';
            setTimeout(() => {
                lightbox.classList.add('active');
            }, 10);
            
            // Prevent body scrolling
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close lightbox
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Close with escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.style.display === 'flex') {
            closeLightbox();
        }
    });
    
    function closeLightbox() {
        lightbox.classList.remove('active');
        setTimeout(() => {
            lightbox.style.display = 'none';
            // Restore body scrolling
            document.body.style.overflow = '';
        }, 300);
    }
}

/**
 * Scroll Progress Bar
 */
function initScrollProgressBar() {
    // Create progress bar
    const progressBar = document.createElement('div');
    progressBar.classList.add('scroll-progress-bar');
    document.body.appendChild(progressBar);
    
    // Add styles
    const style = document.createElement('style');
    style.innerHTML = `
        .scroll-progress-bar {
            position: fixed;
            top: 0;
            left: 0;
            height: 4px;
            background-color: #2c6e49;
            width: 0%;
            z-index: 2000;
            transition: width 0.1s ease;
        }
    `;
    document.head.appendChild(style);
    
    // Update progress on scroll
    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        const scrollPercentage = (scrollTop / documentHeight) * 100;
        progressBar.style.width = `${scrollPercentage}%`;
    });
}

/**
 * Lazy Loading for Images
 */
function initLazyLoading() {
    // If IntersectionObserver is not supported, return early
    if (!('IntersectionObserver' in window)) return;
    
    const lazyImages = document.querySelectorAll('img');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                // Replace src only if we have a data-src attribute
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                
                // Stop observing once loaded
                observer.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => {
        // Add loading="lazy" attribute for native lazy loading
        img.setAttribute('loading', 'lazy');
        
        // Also use IntersectionObserver for broader support
        imageObserver.observe(img);
    });
}

/**
 * Shopping Cart Functionality
 */
function initCartFunctionality() {
    // Create cart elements
    const cartIcon = document.createElement('div');
    cartIcon.classList.add('cart-icon');
    cartIcon.innerHTML = `
        <span class="cart-icon-svg">🛒</span>
        <span class="cart-count">0</span>
    `;
    
    const cartDropdown = document.createElement('div');
    cartDropdown.classList.add('cart-dropdown');
    cartDropdown.innerHTML = `
        <div class="cart-header">
            <h3>Your Cart</h3>
            <span class="cart-close">&times;</span>
        </div>
        <div class="cart-items">
            <p class="empty-cart-message">Your cart is empty.</p>
        </div>
        <div class="cart-footer">
            <div class="cart-total">
                <span>Total:</span>
                <span class="total-amount">$0.00</span>
            </div>
            <button class="checkout-btn">Checkout</button>
        </div>
    `;
    
    // Add to DOM
    cartIcon.appendChild(cartDropdown);
    const header = document.querySelector('header');
    if (header) {
        const logo = header.querySelector('.logo');
        if (logo) {
            logo.parentNode.insertBefore(cartIcon, logo.nextSibling);
        } else {
            header.querySelector('.container').appendChild(cartIcon);
        }
    }
    
    // Add styles
    const style = document.createElement('style');
    style.innerHTML = `
        .cart-icon {
            position: relative;
            cursor: pointer;
            margin-left: auto;
            margin-right: 20px;
            z-index: 1001;
        }
        
        .cart-icon-svg {
            font-size: 1.5rem;
            color: #2c6e49;
        }
        
        .cart-count {
            position: absolute;
            top: -8px;
            right: -8px;
            background-color: #d68c45;
            color: white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.75rem;
            font-weight: bold;
        }
        
        .cart-dropdown {
            position: absolute;
            top: 100%;
            right: 0;
            width: 300px;
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
            padding: 15px;
            display: none;
            opacity: 0;
            transform: translateY(10px);
            transition: opacity 0.3s ease, transform 0.3s ease;
            z-index: 1001;
        }
        
        .cart-dropdown.active {
            display: block;
            opacity: 1;
            transform: translateY(0);
        }
        
        .cart-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid #e9ecef;
        }
        
        .cart-header h3 {
            font-size: 1.2rem;
            color: #2c6e49;
            margin: 0;
        }
        
        .cart-close {
            font-size: 1.5rem;
            cursor: pointer;
            color: #6c757d;
            transition: color 0.3s ease;
        }
        
        .cart-close:hover {
            color: #dc3545;
        }
        
        .cart-items {
            max-height: 300px;
            overflow-y: auto;
            margin-bottom: 15px;
        }
        
        .empty-cart-message {
            text-align: center;
            color: #6c757d;
            padding: 20px 0;
        }
        
        .cart-item {
            display: flex;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid #e9ecef;
        }
        
        .cart-item-image {
            width: 50px;
            height: 50px;
            border-radius: 5px;
            overflow: hidden;
            margin-right: 10px;
        }
        
        .cart-item-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .cart-item-info {
            flex: 1;
        }
        
        .cart-item-title {
            font-size: 0.9rem;
            font-weight: 600;
            margin: 0 0 5px;
            color: #2f3e46;
        }
        
        .cart-item-price {
            font-size: 0.9rem;
            color: #6c757d;
        }
        
        .cart-item-quantity {
            display: flex;
            align-items: center;
            margin-left: 10px;
        }
        
        .quantity-btn {
            width: 20px;
            height: 20px;
            background-color: #f8f9fa;
            border: none;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.9rem;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }
        
        .quantity-btn:hover {
            background-color: #e9ecef;
        }
        
        .item-quantity {
            margin: 0 5px;
            font-size: 0.9rem;
        }
        
        .remove-item {
            color: #dc3545;
            font-size: 0.8rem;
            background: none;
            border: none;
            cursor: pointer;
            padding: 0;
            margin-top: 5px;
            transition: opacity 0.3s ease;
        }
        
        .remove-item:hover {
            opacity: 0.7;
        }
        
        .cart-footer {
            padding-top: 15px;
            border-top: 1px solid #e9ecef;
        }
        
        .cart-total {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
            font-weight: 600;
        }
        
        .checkout-btn {
            width: 100%;
            padding: 10px;
            background-color: #2c6e49;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }
        
        .checkout-btn:hover {
            background-color: #235c3a;
        }
        
        @media (max-width: 768px) {
            .cart-icon {
                margin-right: 50px;
            }
            
            .cart-dropdown {
                width: 280px;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Cart functionality
    const cart = [];
    const cartCountElement = cartIcon.querySelector('.cart-count');
    const cartItemsContainer = cartDropdown.querySelector('.cart-items');
    const emptyCartMessage = cartDropdown.querySelector('.empty-cart-message');
    const totalAmountElement = cartDropdown.querySelector('.total-amount');
    const checkoutButton = cartDropdown.querySelector('.checkout-btn');
    
    // Toggle cart dropdown
    cartIcon.addEventListener('click', (e) => {
        if (e.target.closest('.cart-dropdown') && !e.target.classList.contains('cart-close')) {
            return;
        }
        
        cartDropdown.classList.toggle('active');
    });
    
    // Close cart dropdown
    const cartClose = cartDropdown.querySelector('.cart-close');
    cartClose.addEventListener('click', () => {
        cartDropdown.classList.remove('active');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!cartIcon.contains(e.target)) {
            cartDropdown.classList.remove('active');
        }
    });
    
    // Add to cart functionality
    const addToCartButtons = document.querySelectorAll('.btn');
    
    addToCartButtons.forEach(button => {
        if (button.textContent.trim() === 'Add to Cart') {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Get product details
                const productCard = button.closest('.product-card');
                if (!productCard) return;
                
                const productName = productCard.querySelector('h3').textContent;
                const productPrice = productCard.querySelector('.product-price').textContent;
                const productImage = productCard.querySelector('img').src;
                
                // Convert price string to number
                const price = parseFloat(productPrice.replace('$', ''));
                
                // Check if product already in cart
                const existingItemIndex = cart.findIndex(item => item.name === productName);
                
                if (existingItemIndex !== -1) {
                    // Update quantity
                    cart[existingItemIndex].quantity += 1;
                } else {
                    // Add new item
                    cart.push({
                        name: productName,
                        price: price,
                        image: productImage,
                        quantity: 1
                    });
                }
                
                // Update cart UI
                updateCart();
                
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.classList.add('add-to-cart-success');
                successMessage.innerHTML = `
                    <div>${productName} added to cart!</div>
                `;
                
                // Add styles for success message
                successMessage.style.position = 'fixed';
                successMessage.style.bottom = '20px';
                successMessage.style.right = '20px';
                successMessage.style.backgroundColor = '#2c6e49';
                successMessage.style.color = 'white';
                successMessage.style.padding = '10px 15px';
                successMessage.style.borderRadius = '5px';
                successMessage.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
                successMessage.style.zIndex = '2000';
                successMessage.style.opacity = '0';
                successMessage.style.transform = 'translateY(20px)';
                successMessage.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                
                document.body.appendChild(successMessage);
                
                setTimeout(() => {
                    successMessage.style.opacity = '1';
                    successMessage.style.transform = 'translateY(0)';
                }, 10);
                
                setTimeout(() => {
                    successMessage.style.opacity = '0';
                    successMessage.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        document.body.removeChild(successMessage);
                    }, 300);
                }, 3000);
                
                // Show cart dropdown
                cartDropdown.classList.add('active');
            });
        }
    });
    
    // Update cart UI
    function updateCart() {
        // Update cart count
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountElement.textContent = totalItems;
        
        // Update cart items display
        if (cart.length === 0) {
            emptyCartMessage.style.display = 'block';
            cartItemsContainer.innerHTML = '';
            cartItemsContainer.appendChild(emptyCartMessage);
        } else {
            emptyCartMessage.style.display = 'none';
            
            // Clear current items
            cartItemsContainer.innerHTML = '';
            
            // Add items
            cart.forEach((item, index) => {
                const cartItem = document.createElement('div');
                cartItem.classList.add('cart-item');
                
                cartItem.innerHTML = `
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-info">
                        <h4 class="cart-item-title">${item.name}</h4>
                        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                        <button class="remove-item" data-index="${index}">Remove</button>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease" data-index="${index}">-</button>
                        <span class="item-quantity">${item.quantity}</span>
                        <button class="quantity-btn increase" data-index="${index}">+</button>
                    </div>
                `;
                
                cartItemsContainer.appendChild(cartItem);
            });
            
            // Add event listeners for quantity buttons
            const decreaseButtons = cartItemsContainer.querySelectorAll('.decrease');
            const increaseButtons = cartItemsContainer.querySelectorAll('.increase');
            const removeButtons = cartItemsContainer.querySelectorAll('.remove-item');
            
            decreaseButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const index = parseInt(button.getAttribute('data-index'));
                    if (cart[index].quantity > 1) {
                        cart[index].quantity -= 1;
                    } else {
                        cart.splice(index, 1);
                    }
                    updateCart();
                });
            });
            
            increaseButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const index = parseInt(button.getAttribute('data-index'));
                    cart[index].quantity += 1;
                    updateCart();
                });
            });
            
            removeButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const index = parseInt(button.getAttribute('data-index'));
                    cart.splice(index, 1);
                    updateCart();
                });
            });
        }
        
        // Update total amount
        const totalAmount = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        totalAmountElement.textContent = `$${totalAmount.toFixed(2)}`;
    }
    
    // Checkout button
    checkoutButton.addEventListener('click', () => {
        if (cart.length === 0) return;
        
        alert('This would proceed to checkout in a real e-commerce site. Your cart contains ' + 
              cart.reduce((total, item) => total + item.quantity, 0) + ' items totaling $' + 
              cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2));
    });
}
