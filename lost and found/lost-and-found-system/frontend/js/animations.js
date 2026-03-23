// 🎬 ADVANCED ANIMATION UTILITIES

/**
 * Page Transition Manager
 * Handles smooth transitions between pages
 */
class PageTransition {
    constructor() {
        this.init();
    }

    init() {
        // Add fade-in to current page
        document.body.classList.add('page-fade-in');

        // Handle link clicks for smooth transitions
        this.handleLinks();
    }

    handleLinks() {
        document.querySelectorAll('a:not([target="_blank"])').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                // Skip if it's a hash link or external
                if (!href || href.startsWith('#') || href.startsWith('http')) {
                    return;
                }

                // Prevent default and animate
                e.preventDefault();
                this.transitionToPage(href);
            });
        });
    }

    transitionToPage(url) {
        // Fade out current page
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.3s';

        // Navigate after animation
        setTimeout(() => {
            window.location.href = url;
        }, 300);
    }
}

/**
 * Skeleton Loader
 * Creates skeleton loading placeholders
 */
class SkeletonLoader {
    static createCard() {
        return `
            <div class="bg-white rounded-xl shadow-lg overflow-hidden">
                <div class="skeleton h-48 w-full"></div>
                <div class="p-6 space-y-3">
                    <div class="skeleton h-6 w-3/4"></div>
                    <div class="skeleton h-4 w-full"></div>
                    <div class="skeleton h-4 w-5/6"></div>
                    <div class="skeleton h-10 w-full mt-4"></div>
                </div>
            </div>
        `;
    }

    static show(containerId, count = 3) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const skeletons = Array(count)
            .fill(null)
            .map(() => this.createCard())
            .join('');

        container.innerHTML = skeletons;
    }

    static hide(containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = '';
        }
    }
}

/**
 * Scroll Animation Manager
 * Animates elements when they come into view
 */
class ScrollAnimations {
    constructor() {
        this.observer = null;
        this.init();
    }

    init() {
        // Create intersection observer
        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -100px 0px'
            }
        );

        // Observe elements with slide-up class
        this.observeElements();
    }

    observeElements() {
        document.querySelectorAll('.slide-up-on-scroll').forEach(el => {
            this.observer.observe(el);
        });
    }

    // Call this after dynamically adding new elements
    refresh() {
        this.observeElements();
    }
}

/**
 * Number Counter Animation
 * Animates numbers counting up
 */
class CounterAnimation {
    static animate(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16); // 60fps
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = Math.round(target);
                clearInterval(timer);
            } else {
                element.textContent = Math.round(current);
            }
        }, 16);
    }

    static animateAll(selector = '.counter') {
        document.querySelectorAll(selector).forEach(el => {
            const target = parseInt(el.getAttribute('data-target') || el.textContent);
            this.animate(el, target);
        });
    }
}

/**
 * Progress Bar Animation
 */
class ProgressBar {
    static animate(element, percentage, duration = 1000) {
        element.style.setProperty('--progress-width', '0%');
        element.classList.add('progress-bar', 'animate');

        setTimeout(() => {
            element.style.setProperty('--progress-width', percentage + '%');
        }, 100);
    }
}

/**
 * Toast Notification with Animations
 * Enhanced version with better animations
 */
class Toast {
    static show(message, type = 'info', duration = 5000) {
        const toast = document.createElement('div');
        toast.className = `fixed top-4 right-4 px-6 py-4 rounded-lg shadow-lg z-50 notification-slide-in`;
        
        const colors = {
            success: 'bg-green-500 text-white',
            error: 'bg-red-500 text-white',
            warning: 'bg-yellow-500 text-white',
            info: 'bg-blue-500 text-white'
        };

        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };

        toast.className += ` ${colors[type]}`;
        toast.innerHTML = `
            <div class="flex items-center gap-3">
                <span class="text-2xl">${icons[type]}</span>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(toast);

        // Auto remove
        setTimeout(() => {
            toast.classList.remove('notification-slide-in');
            toast.classList.add('notification-slide-out');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
}

/**
 * Loading Overlay
 * Full-screen loading animation
 */
class LoadingOverlay {
    static show(message = 'Loading...') {
        const overlay = document.createElement('div');
        overlay.id = 'loading-overlay';
        overlay.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50 page-fade-in';
        overlay.innerHTML = `
            <div class="bg-white rounded-lg p-8 text-center">
                <div class="spinner border-4 border-gray-200 border-t-indigo-600 rounded-full w-16 h-16 mx-auto mb-4"></div>
                <p class="text-gray-700 font-semibold">${message}</p>
                <div class="dots-loading mt-4 justify-center">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
    }

    static hide() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 300);
        }
    }
}

/**
 * Form Validation with Animation
 * Adds shake animation to invalid fields
 */
class FormAnimations {
    static shakeField(field) {
        field.classList.add('shake');
        setTimeout(() => field.classList.remove('shake'), 500);
    }

    static highlightError(field, message) {
        // Shake the field
        this.shakeField(field);

        // Add error styling
        field.classList.add('border-red-500');

        // Show error message
        const error = document.createElement('p');
        error.className = 'text-red-500 text-sm mt-1 slide-in-bottom';
        error.textContent = message;
        field.parentNode.appendChild(error);

        // Remove after 3 seconds
        setTimeout(() => {
            field.classList.remove('border-red-500');
            error.remove();
        }, 3000);
    }

    static showSuccess(field) {
        field.classList.add('border-green-500', 'bounce');
        setTimeout(() => {
            field.classList.remove('border-green-500', 'bounce');
        }, 1000);
    }
}

/**
 * Card Stagger Animation
 * Animates cards one by one
 */
class StaggerAnimation {
    static animateCards(selector = '.item-card', delay = 100) {
        const cards = document.querySelectorAll(selector);
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * delay);
        });
    }
}

/**
 * Image Lazy Load with Animation
 */
class LazyLoadImage {
    static init() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('image-blur-in');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
}

/**
 * Ripple Effect on Click
 */
class RippleEffect {
    static init() {
        document.querySelectorAll('.ripple').forEach(button => {
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple-effect');
                
                this.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });
    }
}

// ============================================
// AUTO-INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize page transitions (optional - can cause issues with forms)
    // new PageTransition();

    // Initialize scroll animations
    const scrollAnims = new ScrollAnimations();

    // Initialize ripple effects
    RippleEffect.init();

    // Initialize lazy loading
    LazyLoadImage.init();

    // Animate counters if present
    if (document.querySelector('.counter')) {
        CounterAnimation.animateAll();
    }

    // Add smooth scroll to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Export for use in other files
window.AnimationUtils = {
    PageTransition,
    SkeletonLoader,
    ScrollAnimations,
    CounterAnimation,
    ProgressBar,
    Toast,
    LoadingOverlay,
    FormAnimations,
    StaggerAnimation,
    LazyLoadImage,
    RippleEffect
};
