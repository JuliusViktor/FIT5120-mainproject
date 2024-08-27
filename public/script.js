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

/* bubble map */

document.querySelectorAll('.sub-bubble').forEach(bubble => {
    bubble.addEventListener('click', function(event) {
        console.log('myFunction has been called');

        // Remove any existing popups
        document.querySelectorAll('.popup').forEach(popup => popup.remove());

        // Get the position of the clicked bubble
        const rect = bubble.getBoundingClientRect();
        const containerRect = document.querySelector('.container-mindmap').getBoundingClientRect();

        // Create a new popup
        const popup = document.createElement('div');
        popup.classList.add('popup');

        // Calculate the position of the popup
        let top = rect.top + window.scrollY;
        let left = rect.left + window.scrollX;

        // Adjust position to ensure the popup is within the container
        if (top + 500 > containerRect.bottom + window.scrollY) {
            top = containerRect.bottom + window.scrollY - 700;
        }
        if (left + 500 > containerRect.right + window.scrollX) {
            left = containerRect.right + window.scrollX - 700;
        }
        if (top < containerRect.top + window.scrollY) {
            top = containerRect.top + window.scrollY;
        }
        if (left < containerRect.left + window.scrollX) {
            left = containerRect.left + window.scrollX;
        }

        popup.style.top = `${top}px`;
        popup.style.left = `${left}px`;

        // Add close button
        const closeBtn = document.createElement('div');
        closeBtn.classList.add('close-btn');
        closeBtn.innerHTML = '&times;';
        closeBtn.addEventListener('click', () => popup.remove());

        // Add content to popup
        const content = document.createElement('div');
        content.classList.add('popup-content');

        if (bubble.innerText === 'Info') {
            const infoContent = getInfoContent(bubble.id);
            content.innerHTML = `<ul>${infoContent}</ul>`;
        } else {
            content.innerHTML = '<canvas id="chartCanvas" width="400" height="400"></canvas>';
        }

        // Append elements
        popup.appendChild(closeBtn);
        popup.appendChild(content);
        document.body.appendChild(popup);

        if (bubble.innerText !== 'Info') {
            // Create chart
            const ctx = document.getElementById('chartCanvas').getContext('2d');
            const chartData = getChartData(bubble.id);
            new Chart(ctx, {
                type: 'bar',
                data: chartData,
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    });
});

function getChartData(bubbleId) {
    // Define different datasets for different bubbles
    const datasets = {
        'subBubble1-1': [12, 19, 3, 5, 2, 3],
        'subBubble1-2': [5, 10, 15, 20, 25, 30],
        'subBubble1-3': [7, 14, 21, 28, 35, 42],
        'subBubble2-1': [10, 20, 30, 40, 50, 60],
        'subBubble2-2': [8, 16, 24, 32, 40, 48],
        'subBubble2-3': [6, 12, 18, 24, 30, 36],
        'subBubble3-1': [2, 4, 6, 8, 10, 12],
        'subBubble3-2': [1, 2, 3, 4, 5, 6],
        'subBubble3-3': [9, 18, 27, 36, 45, 54],
        'subBubble4-1': [13, 26, 39, 52, 65, 78],
        'subBubble4-2': [14, 28, 42, 56, 70, 84],
        'subBubble4-3': [15, 30, 45, 60, 75, 90],
    };

    return {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: '# of Votes',
            data: datasets[bubbleId] || [],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    };
}

function getInfoContent(bubbleId) {
    const info = {
        'subBubble1-1': `
            <li>Mathematics is the study of numbers, shapes, and patterns.</li>
            <li>It is essential for various fields including science, engineering, and finance.</li>
            <li>Mathematicians use mathematical theories and techniques to solve practical problems.</li>
        `,
        'subBubble2-1': `
            <li>Engineering involves the application of science and math to solve problems.</li>
            <li>Engineers design, build, and maintain structures, machines, and systems.</li>
            <li>There are various branches of engineering including civil, mechanical, and electrical.</li>
        `,
        'subBubble3-1': `
            <li>Technology refers to the use of scientific knowledge for practical purposes.</li>
            <li>It includes the development and use of tools, machines, and systems.</li>
            <li>Technology plays a crucial role in modern society, impacting various industries.</li>
        `,
        'subBubble4-1': `
            <li>Science is the systematic study of the natural world through observation and experimentation.</li>
            <li>It aims to understand how the universe works and to develop new knowledge.</li>
            <li>Scientific research is essential for technological advancements and societal progress.</li>
        `
    };

    return info[bubbleId] || '<li>No information available.</li>';
}






