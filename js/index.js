const carouselTrack = document.getElementById('carouselTrack');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const cards = document.querySelectorAll('.portfolio-card');

let currentSlide = 0;
let totalSlides = dots.length;
let cardWidth = 33.333;
let isTransitioning = false;

// Check if mobile view
function isMobile() {
    return window.innerWidth <= 768;
}

function updateCarousel(slideIndex, smooth = true) {
    if (isTransitioning) return;
    
    isTransitioning = true;
    
    if (smooth) {
        carouselTrack.classList.add('transitioning');
    }
    
    let translateX;
    if (isMobile()) {
        // On mobile, move one card at a time
        translateX = slideIndex * -100;
    } else {
        // On desktop, move by cardWidth percentage
        translateX = slideIndex * -cardWidth;
    }
    
    carouselTrack.style.transform = `translateX(${translateX}%)`;

    // Update active dot
    document.querySelectorAll('.dot').forEach((dot, index) => {
        dot.classList.toggle('active-port', index === slideIndex);
    });
    
    currentSlide = slideIndex;
    
    setTimeout(() => {
        isTransitioning = false;
        if (smooth) {
            carouselTrack.classList.remove('transitioning');
        }
    }, 600);
}

// Responsive card width calculation
function updateCardWidth() {
    if (isMobile()) {
        // On mobile, each card takes full width, total slides = number of cards
        cardWidth = 100;
        totalSlides = cards.length;
        
        // Show navigation
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
        document.querySelector('.carousel-dots').style.display = 'none';
        
        // Update dots for mobile
        updateDots();
        
        // Restart auto-play
        if (!carouselInterval) {
            carouselInterval = setInterval(nextSlide, 5000);
        }
    } else {
        // Desktop behavior
        cardWidth = 33.333;
        totalSlides = Math.ceil(cards.length / 3);
        
        // Show navigation
        prevBtn.style.display = 'flex';
        nextBtn.style.display = 'flex';
        document.querySelector('.carousel-dots').style.display = 'flex';
        
        // Update dots for desktop
        updateDots();
        
        // Restart auto-play
        if (!carouselInterval) {
            carouselInterval = setInterval(nextSlide, 5000);
        }
    }
}

function updateDots() {
    const dotsContainer = document.querySelector('.carousel-dots');
    dotsContainer.innerHTML = '';
    
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('span');
        dot.className = `dot ${i === currentSlide ? 'active-port' : ''}`;
        dot.setAttribute('data-slide', i);
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }
}

function goToSlide(slideIndex) {
    if (slideIndex >= 0 && slideIndex < totalSlides) {
        updateCarousel(slideIndex);
    }
}

function nextSlide() {
    const nextIndex = (currentSlide + 1) % totalSlides;
    updateCarousel(nextIndex);
}

function prevSlide() {
    const prevIndex = currentSlide > 0 ? currentSlide - 1 : totalSlides - 1;
    updateCarousel(prevIndex);
}

// Event listeners
prevBtn.addEventListener('click', prevSlide);
nextBtn.addEventListener('click', nextSlide);

// Auto-play functionality
let carouselInterval;

function startAutoPlay() {
    carouselInterval = setInterval(nextSlide, 5000);
}

function stopAutoPlay() {
    clearInterval(carouselInterval);
}

// Pause auto-play on hover
const portfolioSection = document.querySelector('.portfolio-carousel');
portfolioSection.addEventListener('mouseenter', () => {
    stopAutoPlay();
});

portfolioSection.addEventListener('mouseleave', () => {
    startAutoPlay();
});

// Touch/swipe support
let startX = 0;
let currentX = 0;
let isDragging = false;

carouselTrack.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
    stopAutoPlay();
});

carouselTrack.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    currentX = e.touches[0].clientX;
    const diffX = startX - currentX;
    
    if (Math.abs(diffX) > 50) {
        if (diffX > 0) {
            nextSlide();
        } else {
            prevSlide();
        }
        isDragging = false;
    }
});

carouselTrack.addEventListener('touchend', () => {
    isDragging = false;
    startAutoPlay();
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        prevSlide();
    } else if (e.key === 'ArrowRight') {
        nextSlide();
    }
});

// Initialize on load and resize
window.addEventListener('load', () => {
    updateCardWidth();
    updateCarousel(0, false);
    startAutoPlay();
});

window.addEventListener('resize', () => {
    // Reset current slide if needed
    if (currentSlide >= totalSlides) {
        currentSlide = 0;
    }
    updateCardWidth();
    updateCarousel(currentSlide, false);
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
        }
    });
}, observerOptions);

cards.forEach(card => {
    observer.observe(card);
});