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

document.querySelectorAll('.main-bubble').forEach(mainBubble => {
    mainBubble.addEventListener('click', function() {
      
        const subBubbles = this.parentElement.querySelectorAll('.sub-bubble');
        subBubbles.forEach(subBubble => {
            if (subBubble.style.opacity === '1') {
                subBubble.style.opacity = '0';
                subBubble.style.pointerEvents = 'none';
            } else {
                subBubble.style.opacity = '1';
                subBubble.style.pointerEvents = 'auto';
            }
        });
    });
});


document.querySelectorAll('.sub-bubble').forEach(bubble => {
    bubble.addEventListener('click', function(event) {
        console.log('myFunction has been called');

        // Remove any existing popups
        document.querySelectorAll('.popup').forEach(popup => popup.remove());

        // Get the position of the clicked bubble
        const rect = bubble.getBoundingClientRect();

        // Create a new popup
        const popup = document.createElement('div');
        popup.classList.add('popup');
        popup.style.position = 'absolute'; // Ensure the popup is positioned absolutely
        popup.style.top = `${rect.top + window.scrollY}px`; // Adjust for any scrolling
        popup.style.left = `${rect.left + window.scrollX}px`; // Adjust for any scrolling

        // Add close button
        const closeBtn = document.createElement('div');
        closeBtn.classList.add('close-btn');
        closeBtn.innerHTML = '&times;';
        closeBtn.addEventListener('click', () => popup.remove());

        // Add content to popup
        const content = document.createElement('div');
        content.innerText = 'This is a popup';

        // Append elements
        popup.appendChild(closeBtn);
        popup.appendChild(content);
        document.body.appendChild(popup);
    });
});

