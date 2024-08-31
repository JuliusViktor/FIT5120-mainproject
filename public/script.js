// const { text } = require("body-parser");

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

// math main bubble
document.querySelectorAll('.math').forEach(mainBubble => {
    mainBubble.addEventListener('click', function() {
        console.log("123")
        math_emp();
        math_income();
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

// engineering main bubble
document.querySelectorAll('.eng').forEach(mainBubble => {
    mainBubble.addEventListener('click', function() {
        math_emp();
        eng_emp();
        eng_income();
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


// technology main bubble
document.querySelectorAll('.tech').forEach(mainBubble => {
    mainBubble.addEventListener('click', function() {
        math_emp();
        tech_employed();
        tech_income();
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
sci_employed

// science main bubble
document.querySelectorAll('.sci').forEach(mainBubble => {
    mainBubble.addEventListener('click', function() {
        math_emp();
        sci_employed();
        sci_income();
        const subBubbles = this.parentElement.querySelectorAll('.sub-bubble');
        console.log('Found sub-bubbles:', subBubbles.length);

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
        content.innerHTML = '<canvas id="chartCanvas" width="400" height="400"></canvas>';

        // Append elements
        popup.appendChild(closeBtn);
        popup.appendChild(content);
        document.body.appendChild(popup);

        if (bubble.innerText == 'Job') {
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

        if (bubble.innerText == 'Income') {
            // Create chart
            const ctx = document.getElementById('chartCanvas').getContext('2d');
            const chartData = getChartData(bubble.id);
            new Chart(ctx, {
                type: 'line',
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

// math_employed#########################################
// Define global variables
var math_emp_years = [];
var math_emp_values = []
var math_emp_ind =[]

// Use fetch to get data
function math_emp(){
  fetch('data/math_employed.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    // Process the data and store it into global variables
    math_emp_ind = data.map(item => item.Industry);
    math_emp_years = data.map(item => item.Year);
    math_emp_values = data.map(item => item.Value);
    console.log("11111111",math_emp_values)

  })
  .catch(error => {
    console.error('There was a problem(math_employed) with the fetch operation:', error);
  });
}

// math_employed#########################################





// math_income#########################################
// Define global variables
let math_income_years = [];
let math_income_values = []
let math_income_ind =[]
// Use fetch to get data
function math_income(){
    fetch('data/math_income.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    // Process the data and store it into global variables
    math_income_ind = data.map(item => item.Industry);
    math_income_years = data.map(item => item.Year);
    math_income_values = data.map(item => item.Value);
    console.log("2222222222",math_income_values)
  })
  .catch(error => {
    console.error('There was a problem(math_income) with the fetch operation:', error);
  });
}

// math_income#########################################





// engineering_employed#########################################
// Define global variables
let eng_emp_years = [];
let eng_emp_values = []
let eng_emp_ind =[]

// Use fetch to get data
function eng_emp(){
   fetch('data/engineering_employed.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    // Process the data and store it into global variables
    eng_emp_ind = data.map(item => item.Industry);
    eng_emp_years = data.map(item => item.Year);
    eng_emp_values = data.map(item => item.Value);
    console.log("333333333",eng_emp_values)

  })
  .catch(error => {
    console.error('There was a problem(engineering_employed) with the fetch operation:', error);
  });

}

// engineering_employed#########################################





// engineering_income#########################################
// Define global variables
let eng_income_years = [];
let eng_income_values = []
let eng_income_ind =[]

// Use fetch to get data
function eng_income(){
   fetch('data/engineering_income.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    // Process the data and store it into global variables
    eng_income_ind = data.map(item => item.Industry);
    eng_income_years = data.map(item => item.Year);
    eng_income_values = data.map(item => item.Value);
    console.log("444444",eng_emp_values)

  })
  .catch(error => {
    console.error('There was a problem(engineering_income) with the fetch operation:', error);
  });

}

// engineering_income#########################################





// tech_employed#########################################
// Define global variables
let tech_employed_years = [];
let tech_employed_values = []
let tech_employed_ind =[]

// Use fetch to get data
function tech_employed(){
   fetch('data/tech_employed.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    // Process the data and store it into global variables
    tech_employed_ind = data.map(item => item.Industry);
    tech_employed_years = data.map(item => item.Year);
    tech_employed_values = data.map(item => item.Value);
    console.log("55555555",tech_employed_values)

  })
  .catch(error => {
    console.error('There was a problem(tech_employed) with the fetch operation:', error);
  });

}

// tech_employed#########################################




// tech_income#########################################
// Define global variables
let tech_income_years = [];
let tech_income_values = []
let tech_income_ind =[]

// Use fetch to get data
function tech_income(){
   fetch('data/tech_income.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    // Process the data and store it into global variables
    tech_income_ind = data.map(item => item.Industry);
    tech_income_years = data.map(item => item.Year);
    tech_income_values = data.map(item => item.Value);
    console.log("66666666",tech_income_values)

  })
  .catch(error => {
    console.error('There was a problem(tech_income) with the fetch operation:', error);
  });

}

// tech_income#########################################



// sci_employed#########################################
// Define global variables
let sci_employed_years = [];
let sci_employed_values = []
let sci_employed_ind =[]

// Use fetch to get data
function sci_employed(){
   fetch('data/science_employed.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    // Process the data and store it into global variables
    sci_employed_ind = data.map(item => item.Industry);
    sci_employed_years = data.map(item => item.Year);
    sci_employed_values = data.map(item => item.Value);
    console.log("7777777777777",sci_employed_values)

  })
  .catch(error => {
    console.error('There was a problem(sci_employed) with the fetch operation:', error);
  });

}

// sci_employed#########################################


// sci_income#########################################
// Define global variables
let sci_income_years = [];
let sci_income_values = []
let sci_income_ind =[]

// Use fetch to get data
function sci_income(){
   fetch('data/science_income.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    // Process the data and store it into global variables
    sci_income_ind = data.map(item => item.Industry);
    sci_income_years = data.map(item => item.Year);
    sci_income_values = data.map(item => item.Value);
    console.log("88888888",sci_income_values)

  })
  .catch(error => {
    console.error('There was a problem(sci_income) with the fetch operation:', error);
  });

}

// sci_employed#########################################





function getChartData(bubbleId) {
    console.log("bubbleid:",bubbleId)
    // Define different datasets for different bubbles
    const datasets = {
        // 'subBubble1-1': [12, 19, 3, 5, 2, 3],
        'subBubble1-2': math_emp_values,
        'subBubble1-3': math_income_values,
        // 'subBubble2-1': [10, 20, 30, 40, 50, 60],
        'subBubble2-2': eng_emp_values,
        'subBubble2-3': eng_income_values,
        // 'subBubble3-1': [2, 4, 6, 8, 10, 12],
        'subBubble3-2': tech_employed_values,
        'subBubble3-3': tech_income_values,
        // 'subBubble4-1': [13, 26, 39, 52, 65, 78],
        'subBubble4-2': sci_employed_values,
        'subBubble4-3': sci_income_values,
    };

    return {
        labels: math_emp_years,
        datasets: [{
            label: 'Unit: 000',
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
            borderWidth: 5
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



