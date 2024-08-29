const { text } = require("body-parser");

let currentIndex = 0;

function showSlide(index) {
    const slides = document.querySelectorAll('.carousel-item');
    const indicators = document.querySelectorAll('.indicator');
    const totalSlides = slides.length;
    const visibleSlides = 3; // block 

    if (index >= totalSlides - visibleSlides + 1) {
        currentIndex = totalSlides - visibleSlides;
    } else if (index < 0) {
        currentIndex = 0;
    } else {
        currentIndex = index;
    }

    const offset = -currentIndex * (100 / visibleSlides);
    document.querySelector('.carousel-inner').style.transform = `translateX(${offset}%)`;

    indicators.forEach((indicator, i) => {
        if (i >= currentIndex && i < currentIndex + visibleSlides) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
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

        // Remove any existing sub-bubble popups
        document.querySelectorAll('.popup.sub-bubble-popup').forEach(popup => popup.remove());

        // Get the position of the clicked bubble
        const rect = bubble.getBoundingClientRect();
        const containerRect = document.querySelector('.container-mindmap').getBoundingClientRect();

        // Create a new popup
        const popup = document.createElement('div');
        popup.classList.add('popup', 'sub-bubble-popup');

        // Calculate the position of the popup
        let top = rect.top + window.scrollY;
        let left = rect.left + window.scrollX;

        // Adjust position to ensure the popup is within the container
        if (top + 500 > containerRect.bottom + window.scrollY) {
            top = containerRect.bottom + window.scrollY - 600;
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

// function getChartData(bubbleId) {
//     // Define different datasets for different bubbles
//     const datasets = {
//         'subBubble1-1': [12, 19, 3, 5, 2, 3],
//         'subBubble1-2': [5, 10, 15, 20, 25, 30],
//         'subBubble1-3': [7, 14, 21, 28, 35, 42],
//         'subBubble2-1': [10, 20, 30, 40, 50, 60],
//         'subBubble2-2': [8, 16, 24, 32, 40, 48],
//         'subBubble2-3': [6, 12, 18, 24, 30, 36],
//         'subBubble3-1': [2, 4, 6, 8, 10, 12],
//         'subBubble3-2': [1, 2, 3, 4, 5, 6],
//         'subBubble3-3': [9, 18, 27, 36, 45, 54],
//         'subBubble4-1': [13, 26, 39, 52, 65, 78],
//         'subBubble4-2': [14, 28, 42, 56, 70, 84],
//         'subBubble4-3': [15, 30, 45, 60, 75, 90],
//     };

//     return {
//         labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
//         datasets: [{
//             label: '# of Votes',
//             data: datasets[bubbleId] || [],
//             backgroundColor: [
//                 'rgba(255, 99, 132, 0.2)',
//                 'rgba(54, 162, 235, 0.2)',
//                 'rgba(255, 206, 86, 0.2)',
//                 'rgba(75, 192, 192, 0.2)',
//                 'rgba(153, 102, 255, 0.2)',
//                 'rgba(255, 159, 64, 0.2)'
//             ],
//             borderColor: [
//                 'rgba(255, 99, 132, 1)',
//                 'rgba(54, 162, 235, 1)',
//                 'rgba(255, 206, 86, 1)',
//                 'rgba(75, 192, 192, 1)',
//                 'rgba(153, 102, 255, 1)',
//                 'rgba(255, 159, 64, 1)'
//             ],
//             borderWidth: 1
//         }]
//     };
// }
let processed_data_1,processed_data_2,processed_data_3,processed_data_4,processed_data_5,processed_data_6,processed_data_7,processed_data_8;


// Load and process the JSON data
d3.json("Data/1.11engineering_employed.json") // Correct file path here
    .then(data => {
        // Process the data
        processed_data_1 = data.map(d => ({
            Industry: d.Industry,
            Year: d.Year,
            Value: +d.Value
        }));
        
        // Log the processed data inside the .then() to ensure it's loaded
        console.log(processed_data_1);
    })
    .catch(error => {
        // Handle errors gracefully
        console.error("Error loading JSON data:", error);
    });

    d3.json("Data/1.12math_employed.json") // Correct file path here
    .then(data => {
        // Process the data
        processed_data_2 = data.map(d => ({
            Industry: d.Industry,
            Year: d.Year,
            Value: +d.Value
        }));
        
        // Log the processed data inside the .then() to ensure it's loaded
        console.log(processed_data_1);
    })
    .catch(error => {
        // Handle errors gracefully
        console.error("Error loading JSON data:", error);
    });

    d3.json("Data/1.13science_employed.json") // Correct file path here
    .then(data => {
        // Process the data
        processed_data_3 = data.map(d => ({
            Industry: d.Industry,
            Year: d.Year,
            Value: +d.Value
        }));
        
        // Log the processed data inside the .then() to ensure it's loaded
        console.log(processed_data_1);
    })
    .catch(error => {
        // Handle errors gracefully
        console.error("Error loading JSON data:", error);
    });

    d3.json("Data/1.14tech_employed.json") // Correct file path here
    .then(data => {
        // Process the data
        processed_data_4 = data.map(d => ({
            Industry: d.Industry,
            Year: d.Year,
            Value: +d.Value
        }));
        
        // Log the processed data inside the .then() to ensure it's loaded
        console.log(processed_data_1);
    })
    .catch(error => {
        // Handle errors gracefully
        console.error("Error loading JSON data:", error);
    });

    d3.json("Data/2.11engineering_income.json") // Correct file path here
    .then(data => {
        // Process the data
        processed_data_5 = data.map(d => ({
            Industry: d.Industry,
            Year: d.Year,
            Value: +d.Value
        }));
        
        // Log the processed data inside the .then() to ensure it's loaded
        console.log(processed_data_1);
    })
    .catch(error => {
        // Handle errors gracefully
        console.error("Error loading JSON data:", error);
    });

    d3.json("Data/2.12math_income.json") // Correct file path here
    .then(data => {
        // Process the data
        processed_data_6 = data.map(d => ({
            Industry: d.Industry,
            Year: d.Year,
            Value: +d.Value
        }));
        
        // Log the processed data inside the .then() to ensure it's loaded
        console.log(processed_data_1);
    })
    .catch(error => {
        // Handle errors gracefully
        console.error("Error loading JSON data:", error);
    });

    d3.json("Data/2.13Science_income.json") // Correct file path here
    .then(data => {
        // Process the data
        processed_data_7 = data.map(d => ({
            Industry: d.Industry,
            Year: d.Year,
            Value: +d.Value
        }));
        
        // Log the processed data inside the .then() to ensure it's loaded
        console.log(processed_data_1);
    })
    .catch(error => {
        // Handle errors gracefully
        console.error("Error loading JSON data:", error);
    });

    d3.json("Data/2.14tech_income.json") // Correct file path here
    .then(data => {
        // Process the data
        processed_data_8 = data.map(d => ({
            Industry: d.Industry,
            Year: d.Year,
            Value: +d.Value
        }));
        
        // Log the processed data inside the .then() to ensure it's loaded
        console.log(processed_data_1);
    })
    .catch(error => {
        // Handle errors gracefully
        console.error("Error loading JSON data:", error);
    });

const content = document.createElement("div");
content.classList.add('popup-content');
content.innerHTML = '<canvas id="employmentChart" width="400" height="400"></canvas>';

const employementData = {
    Mathematics: processed_data_2,
    Engineering: processed_data_1,
    Technology: processed_data_4,
    Science:processed_data_3
};

const incomedata = {
    Mathematics: processed_data_6,
    Engineering: processed_data_5,
    Technology: processed_data_8,
    Science: processed_data_7
};



// Drawing the linechart
function drawLineChart(type)
{
    const ctx = document.getElementById('chartCanvas').getContext('2d');
    const data = employmentData[type];

    const years = [...new Set(data.map(item => item.Year))];
    const industries = [...new Set(data.map(item => item.Industry))];

    const datasets = industries.map(industry => {
        return {
            label: industry,
            data: data.filter(item => item.Industry === industry).map(item => item.Value),
            borderColor: getRandomColor(),
            fill:false
        };
    });



    new Chart(ctx,{
        type: "line",
        data: {
            label: "years",
            datasets:datasets
        },
        options:
        {
            responsive: true,
            plugins: {
                legend:{
                    position: "top",
                },
            },
            scales: {
                x: {
                    title: {
                        display:true,
                        text:"year"
                    }
                },
                y: {
                    title:{
                        display:true,
                        text:"number of employees (in thousands)"
                    }
                }
            }
        }
    });
}

function drawBarChart(type) {
    const ctx = document.getElementById('chartCanvas').getContext('2d');
    const data = incomeData[type];

    const years = [...new Set(data.map(item => item.Year))];
    const industries = [...new Set(data.map(item => item.Industry))];

    const datasets = industries.map(industry => {
        return {
            label: industry,
            data: data.filter(item => item.Industry === industry).map(item => item.Value),
            backgroundColor: getRandomColor()
        };
    });

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: years,
            datasets: datasets
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Year'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Income (in currency units)'
                    }
                }
            }
        }
    });
}

// generating random color

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
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



/* role model */
document.querySelectorAll('.role-model').forEach(roleModel => {
    roleModel.addEventListener('click', function() {
        const roleId = this.getAttribute('data-id');
        showRoleModelPopup(roleId);
    });
});

function showRoleModelPopup(roleId) {
    // Remove any existing role model popups
    document.querySelectorAll('.role-model-popup').forEach(popup => popup.remove());

    // Get the role model data
    const roleModelData = getRoleModelData(roleId);

    // Create a new popup
    const popup = document.createElement('div');
    popup.classList.add('role-model-popup');

    // Add close button
    const closeBtn = document.createElement('div');
    closeBtn.classList.add('close-btn');
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', () => popup.remove());

    // Add content to popup
    const content = document.createElement('div');
    content.classList.add('popup-content');
    content.innerHTML = `
        <img src="${roleModelData.image}" alt="${roleModelData.name}">
        <h2>${roleModelData.name}</h2>
        <ul>${roleModelData.details.map(detail => `<li>${detail}</li>`).join('')}</ul>
    `;

    // Append elements
    popup.appendChild(closeBtn);
    popup.appendChild(content);
    document.body.appendChild(popup);
}

function getRoleModelData(roleId) {
    const data = {
        '1': {
            image: './images/role_model_1.jpg',
            name: 'Role Model 1',
            details: [
                'Expert in Artificial Intelligence and Machine Learning.',
                'Pioneered research in neural networks.',
                'Published over 50 papers in top-tier journals.',
                'Recipient of the Turing Award.',
                'Developed algorithms that revolutionized data processing.',
                'Mentored over 30 PhD students.',
                'Advocate for diversity in tech.',
                'Grew up in a small town with limited access to technology, but persevered through self-study and online courses to become a leading figure in AI.'
            ]
        },
        '2': {
            image: './images/role_model_2.jpg',
            name: 'Role Model 2',
            details: [
                'Renowned Astrophysicist and Cosmologist.',
                'Discovered new exoplanets and contributed to the understanding of dark matter.',
                'Author of several bestselling science books.',
                'Keynote speaker at international science conferences.',
                'Developed innovative methods for space observation.',
                'Collaborated with NASA on multiple missions.',
                'Promoter of science education and outreach programs.',
                'Overcame early academic struggles and a lack of resources, eventually earning a PhD from a prestigious university and becoming a leading voice in astrophysics.'
            ]
        },
        '3': {
            image: './images/role_model_3.jpg',
            name: 'Role Model 3',
            details: [
                'Innovative Biomedical Engineer.',
                'Developed cutting-edge medical devices that save lives.',
                'Holds multiple patents in medical technology.',
                'Founder of a successful biotech startup.',
                'Recipient of numerous innovation awards.',
                'Published influential research in biomedical engineering.',
                'Active in promoting women in STEM fields.',
                'Faced significant challenges as a woman in a male-dominated field, but her determination and passion for improving healthcare led her to break barriers and inspire others.'
            ]
        }
    };

    return data[roleId] || {};
}



