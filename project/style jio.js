// JioCinema Clone JavaScript

// DOM Elements
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');
const searchInput = document.querySelector('.search-input');
const movieCards = document.querySelectorAll('.movie-card');
const contentCards = document.querySelectorAll('.content-card');
const watchCards = document.querySelectorAll('.watch-card');
const carousels = document.querySelectorAll('.carousel');

// Mobile Menu Toggle
let isMobileMenuOpen = false;

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        
        isMobileMenuOpen = !isMobileMenuOpen;
        
        if (isMobileMenuOpen) {
            // Create mobile menu
            const mobileMenu = document.createElement('div');
            mobileMenu.className = 'mobile-menu';
            mobileMenu.style.cssText = `
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: var(--background-card);
                border-top: 1px solid var(--border-color);
                padding: 1rem;
                z-index: 99;
            `;
            
            mobileMenu.innerHTML = `
                <div style="margin-bottom: 1rem;">
                    <input type="text" placeholder="Search movies, shows..." style="width: 100%; padding: 0.5rem; background: var(--background-dark); border: 1px solid var(--border-color); border-radius: 6px; color: white;">
                </div>
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                    <a href="#" style="color: var(--text-primary); text-decoration: none; padding: 0.5rem 0;">Home</a>
                    <a href="#" style="color: var(--text-secondary); text-decoration: none; padding: 0.5rem 0;">Movies</a>
                    <a href="#" style="color: var(--text-secondary); text-decoration: none; padding: 0.5rem 0;">TV Shows</a>
                    <a href="#" style="color: var(--text-secondary); text-decoration: none; padding: 0.5rem 0;">Sports</a>
                    <a href="#" style="color: var(--text-secondary); text-decoration: none; padding: 0.5rem 0;">Kids</a>
                    <a href="#" style="color: var(--text-secondary); text-decoration: none; padding: 0.5rem 0;">Premium</a>
                </div>
            `;
            
            document.querySelector('.nav').appendChild(mobileMenu);
            mobileMenuToggle.textContent = '✕';
        } else {
            const mobileMenu = document.querySelector('.mobile-menu');
            if (mobileMenu) {
                mobileMenu.remove();
            }
            mobileMenuToggle.textContent = '☰';
        }
    });
}

// Search Functionality
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        // Filter movie cards
        movieCards.forEach(card => {
            const title = card.querySelector('.movie-title').textContent.toLowerCase();
            const meta = card.querySelector('.movie-meta').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || meta.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = searchTerm === '' ? 'block' : 'none';
            }
        });
        
        // Filter content cards
        contentCards.forEach(card => {
            const title = card.querySelector('.card-title').textContent.toLowerCase();
            const meta = card.querySelector('.card-meta').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || meta.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = searchTerm === '' ? 'block' : 'none';
            }
        });
    });
}

// Carousel Navigation
carousels.forEach(carousel => {
    let isScrolling = false;
    
    carousel.addEventListener('wheel', (e) => {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) return;
        
        e.preventDefault();
        carousel.scrollLeft += e.deltaX || e.deltaY;
    });
    
    // Touch/swipe support for mobile
    let startX = 0;
    let scrollLeft = 0;
    
    carousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
    });
    
    carousel.addEventListener('touchmove', (e) => {
        if (!startX) return;
        
        e.preventDefault();
        const x = e.touches[0].pageX - carousel.offsetLeft;
        const walk = (x - startX) * 2;
        carousel.scrollLeft = scrollLeft - walk;
    });
    
    carousel.addEventListener('touchend', () => {
        startX = 0;
    });
});

// Movie Card Click Handlers
movieCards.forEach(card => {
    card.addEventListener('click', () => {
        const title = card.querySelector('.movie-title').textContent;
        showMovieModal(title);
    });
});

// Content Card Click Handlers
contentCards.forEach(card => {
    card.addEventListener('click', () => {
        const title = card.querySelector('.card-title').textContent;
        showContentModal(title);
    });
});

// Continue Watching Click Handlers
watchCards.forEach(card => {
    card.addEventListener('click', () => {
        const title = card.querySelector('div[style*="color: white"]').textContent;
        playContent(title);
    });
});

// Modal Functions
function showMovieModal(title) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    `;
    
    modal.innerHTML = `
        <div style="
            background: var(--background-card);
            padding: 2rem;
            border-radius: 12px;
            max-width: 500px;
            width: 90%;
            text-align: center;
        ">
            <h2 style="margin-bottom: 1rem;">${title}</h2>
            <p style="color: var(--text-secondary); margin-bottom: 2rem;">
                Click play to start watching this amazing ${title.includes('Season') ? 'series' : 'movie'}.
            </p>
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button onclick="playContent('${title}')" style="
                    background: var(--primary-color);
                    color: white;
                    border: none;
                    padding: 0.75rem 2rem;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                ">▶ Play Now</button>
                <button onclick="closeModal()" style="
                    background: var(--background-dark);
                    color: var(--text-secondary);
                    border: 1px solid var(--border-color);
                    padding: 0.75rem 2rem;
                    border-radius: 8px;
                    cursor: pointer;
                ">Close</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

function showContentModal(title) {
    showMovieModal(title);
}

function playContent(title) {
    closeModal();
    
    // Show play notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        z-index: 1001;
        animation: slideIn 0.3s ease;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span>▶</span>
            <span>Now playing: ${title}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function closeModal() {
    const modal = document.querySelector('div[style*="position: fixed"][style*="z-index: 1000"]');
    if (modal) {
        modal.remove();
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Smooth Scroll for Carousel Navigation
function scrollCarousel(carousel, direction) {
    const scrollAmount = 300;
    const targetScroll = carousel.scrollLeft + (direction * scrollAmount);
    
    carousel.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
    });
}

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
    
    if (e.key === 'Enter' && document.activeElement.classList.contains('search-input')) {
        e.preventDefault();
        // Trigger search
        const event = new Event('input');
        document.activeElement.dispatchEvent(event);
    }
});

// Lazy Loading for Images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading if supported
if ('IntersectionObserver' in window) {
    lazyLoadImages();
}

// Add to My List functionality
function addToMyList(title) {
    let myList = JSON.parse(localStorage.getItem('myList') || '[]');
    
    if (!myList.includes(title)) {
        myList.push(title);
        localStorage.setItem('myList', JSON.stringify(myList));
        
        // Show success notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--secondary-color);
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            z-index: 1001;
            animation: slideIn 0.3s ease;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span>✓</span>
                <span>Added "${title}" to My List</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 2000);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    console.log('JioCinema Clone Loaded Successfully!');
    
    // Add hover effects to buttons
    const buttons = document.querySelectorAll('button, .btn-primary, .btn-secondary');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
        });
    });
    
    // Add click effects to cards
    const allCards = [...movieCards, ...contentCards, ...watchCards];
    allCards.forEach(card => {
        card.addEventListener('mousedown', () => {
            card.style.transform = 'scale(0.98)';
        });
        
        card.addEventListener('mouseup', () => {
            card.style.transform = 'scale(1.05)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'scale(1)';
        });
    });
});

// Auto-play hero video simulation
setInterval(() => {
    const heroButtons = document.querySelector('.hero-buttons');
    if (heroButtons) {
        const playButton = heroButtons.querySelector('.btn-primary');
        if (playButton) {
            playButton.style.boxShadow = '0 0 20px rgba(99, 102, 241, 0.5)';
            setTimeout(() => {
                playButton.style.boxShadow = 'none';
            }, 1000);
        }
    }
}, 5000);

// Performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Debounced search
if (searchInput) {
    const debouncedSearch = debounce((e) => {
        // Search logic here
        console.log('Searching for:', e.target.value);
    }, 300);
    
    searchInput.addEventListener('input', debouncedSearch);
}