let currentIndex = 0;

function showSlide(index) {
    const slides = document.querySelectorAll('.carousel-item');
    const indicators = document.querySelectorAll('.indicator');
    
    if (index >= slides.length) {
        currentIndex = 0;
    } else if (index < 0) {
        currentIndex = slides.length - 1;
    } else {
        currentIndex = index;
    }

    slides.forEach((slide, i) => {
        slide.style.transform = `translateX(-${currentIndex * 100}%)`;
        indicators[i].classList.remove('active');
    });

    indicators[currentIndex].classList.add('active');
}

function nextSlide() {
    showSlide(currentIndex + 1);
}

function prevSlide() {
    showSlide(currentIndex - 1);
}

function currentSlide(index) {
    showSlide(index - 1);
}

document.addEventListener('DOMContentLoaded', () => {
    showSlide(currentIndex);
});




document.getElementById('mainBubble').addEventListener('click', function() {
    const subBubbles = document.querySelectorAll('.sub-bubble');
    subBubbles.forEach(bubble => {
        if (bubble.style.opacity == 0) {
            bubble.style.opacity = 1;
            bubble.style.pointerEvents = 'auto';
        } else {
            bubble.style.opacity = 0;
            bubble.style.pointerEvents = 'none';
        }
    });
});

