const courses = {
    "Science": "1. Biology\n2. Chemistry\n3. Earth and Environmental Science\n4. Physics",
    "Technology": "1. Information and Communication Technology\n2. Computer Science / Computing Studies\n3. Design and Technology\n4. Digital Technologies\n5. Mathematics and Data Analysis",
    "Engineering": "1. Essential Mathematics\n2. General Mathematics\n3. Physics\n4. Chemistry\n5. Information and Communication Technology\n6. Engineering Studies",
    "Mathematics": "1. Essential Mathematics\n2. General Mathematics\n3. Mathematical Methods\n4. Specialist Mathematics"
};

function clearInput() {
    document.querySelector('.search-bar').value = '';
}

document.querySelector('.submit-button').addEventListener('click', function () {
    var statusBar = document.getElementById('suggest-status-bar');
    var searchInput = document.querySelector('.search-bar').value.trim();
    var found = false;
    var matchedCategory = '';

    // Set to loading state
    statusBar.textContent = 'Loading...';
    statusBar.className = 'status-bar loading';

    // Check if input is empty
    if (!searchInput) {
        statusBar.textContent = 'You must enter a profession.';
        statusBar.className = 'status-bar fail';
        alert('You must enter a profession. Please try again.');
        return;
    }

    // Simulate an asynchronous operation
    setTimeout(function () {
        let searchInputLower = searchInput.toLowerCase();
        recommendations1.forEach(category => {
            let lowercaseList = category.Rcommendation_list.map(item => item.toLowerCase());
            if (lowercaseList.includes(searchInputLower)) {
                found = true;
                matchedCategory = category.STEM_CAT;
            }
        });
    
        if (found) {
            statusBar.textContent = 'Searching successful, data below has been updated';
            statusBar.className = 'status-bar success';
    
            // Display the relevant courses
            document.getElementById('subject-guideline').textContent = courses[matchedCategory];
    
            // Update percentages
            updatePercentages(matchedCategory);
        } else {
            statusBar.textContent = 'You entered a profession that is not on the list.';
            statusBar.className = 'status-bar fail';
            alert('The profession you entered is not on the list. Please try again.');
    
            // Reset percentages to X
            updatePercentage('percentage5', 'X');
            updatePercentage('percentage6', 'X');
            updatePercentage('percentage7', 'X');
            updatePercentage('percentage8', 'X');
    
            // Clear the subject guideline
            document.getElementById('subject-guideline').textContent = '';
        }
    }, 2000); // Simulate a 2-second loading time
    
});

function updatePercentages(category) {
    const categories = ["Science", "Technology", "Engineering", "Mathematics"];
    const percentages = {};

    // Set the matched category to have the highest percentage
    percentages[category] = Math.floor(Math.random() * 21) + 80; // Random value between 80 and 100

    // Calculate the remaining percentage
    let remainingPercentage = 100 - percentages[category];

    // Distribute the remaining percentage among the other categories
    const otherCategories = categories.filter(cat => cat !== category);
    const randomize = (total, count) => {
        let result = [];
        for (let i = 0; i < count - 1; i++) {
            let randomVal = Math.floor(Math.random() * (total / (count - i)));
            result.push(randomVal);
            total -= randomVal;
        }
        result.push(total);
        return result;
    };

    const distributedPercentages = randomize(remainingPercentage, otherCategories.length);
    otherCategories.forEach((cat, index) => {
        percentages[cat] = distributedPercentages[index];
    });

    // Update the percentages in the DOM
    updatePercentage('percentage5', percentages["Science"]);
    updatePercentage('percentage6', percentages["Technology"]);
    updatePercentage('percentage7', percentages["Engineering"]);
    updatePercentage('percentage8', percentages["Mathematics"]);
}

function updatePercentage(id, value) {
    document.getElementById(id).textContent = `${value}%`;
}

const recommendations1 = [
    {
        "STEM_CAT": "Science",
        "Rcommendation_list": [
            "3D Animator", "Horticulturist", "Paleontologist", "Dentist", "Paramedic",
            "Diagnostic Medical Sonographer", "Hydrologist", "Park Naturalist", "Doctor",
            "Pharmacist", "Ecologist", "Lab Research Technician", "Physicist", "Ecologist",
            "Physicist", "Archaeologist", "Astrobiologist", "Psychologist", "Astronaut",
            "Marine Biologist", "Astronomer", "Radiologic Technician", "Radiologist",
            "Environmental Scientist", "Meteorologist", "Science Illustrator", "Epidemiologist",
            "Microbiologist", "Sociologist", "Exercise Physiologist", "Museum Conservator",
            "Botanist", "Forensic Scientist", "Nutritionist", "Chemist", "Forensic Pathologist",
            "Climate Scientist", "Geologist", "Oceanographer", "Genetic Counselor", "Zoologist"
        ]
    },
    {
        "STEM_CAT": "Technology",
        "Rcommendation_list": [
            "Information Security Analyst", "Educational Technologist", "Librarian",
            "Lighting Designer", "Production Engineer", "Market Research Analyst",
            "Audio Engineer", "Computer Graphic Designer", "Computer Hardware Engineer",
            "Computer Software Developer", "Computer Systems Analyst", "Graphics Designer",
            "Video Game Designer", "Special Effects Technician", "Biometrics Technician",
            "Nanosystems Engineer", "CAD Technician", "Solar Technician"
        ]
    },
    {
        "STEM_CAT": "Engineering",
        "Rcommendation_list": [
            "HVACR Technician", "Aerospace Engineer", "Industrial Designer",
            "Agricultural Engineer", "Agriculturalist", "Air Traffic Controller",
            "Architect", "Automotive Designer", "Automotive Service Technician",
            "Avionics", "Biomedical Engineer", "Building Inspector", "Chemical Engineer",
            "Chemical Technician", "Civil Engineer", "Construction Supervisor",
            "Electrical Engineer", "Electrician", "Environmental Engineer", "General Contractor",
            "Mechanical Engineer", "Medical Roboticist", "Naval Architect", "Nuclear Engineer",
            "Robotics Technician", "Safety Engineer", "Structural Engineer", "Surveyor",
            "Urban Planner"
        ]
    },
    {
        "STEM_CAT": "Mathematics",
        "Rcommendation_list": [
            "Actuary", "Accountant", "Economist", "Financial Analyst", "Mathematician",
            "Mathematics Teacher", "Statistician", "Forensic Accountant", "Stockbroker",
            "Quantity Surveyor"
        ]
    }
];







// This function can be used to dynamically update the content of the <p> tag
//quiz
function updateOccupationGuideline(newText) {
    document.getElementById('occupation-guideline').innerText = newText;
}
updateOccupationGuideline("This is the dynamic text for the occupation guideline.");


//suggest
function updateSubjectGuideline(newText) {
    document.getElementById('subject-guideline').innerText = newText;
}
updateSubjectGuideline("This is the dynamic text for the subject guideline.");




// Function to update the percentage value for a specific circle
function updatePercentage(circleId, percentage) {
    // Ensure percentage is a number
    percentage = Number(percentage);
    document.getElementById(circleId).innerText = percentage + '%';
}

// Initialize an object to store answers
const answers = {};

// Function to select an answer for a quiz question
function selectAnswer(quizId, answerCode) {
    const quizBlock = document.getElementById(quizId);
    const buttons = quizBlock.getElementsByClassName('quiz-button');

    // Remove 'selected' class from all buttons
    for (let button of buttons) {
        button.classList.remove('selected');
    }

    // Find and select the button with the specified answer code
    const selectedButton = Array.from(buttons).find(button => {
        return button.getAttribute('data-answer') === answerCode;
    });

    if (selectedButton) {
        selectedButton.classList.add('selected');
    } else {
        console.log('Button not found for answer code:', answerCode);
    }

    // Store the selected answer
    answers[quizId] = answerCode;
}


// Function to submit the quiz
function submitQuiz() {
    const totalQuestions = 10;
    const unansweredQuestions = [];

    // Check for unanswered questions
    for (let i = 1; i <= totalQuestions; i++) {
        if (!answers[`quiz${i}`]) {
            unansweredQuestions.push(i);
        }
    }

    // Alert if there are unanswered questions
    if (unansweredQuestions.length > 0) {
        alert(`You missed the following questions: ${unansweredQuestions.join(', ')}`);
        return;
    }

    // Show loading indicator
    document.getElementById('loading').style.display = 'block';
    document.getElementById('result').innerHTML = '';

    // Simulate a delay for calculation
    setTimeout(() => {
        const counts = { T: 0, E: 0, M: 0, S: 0 };

        // Count the occurrences of each answer type
        for (let key in answers) {
            if (counts[answers[key]] !== undefined) {
                counts[answers[key]]++;
            }
        }

        // Calculate percentages for each category
        const percentages = {
            T: ((counts.T / totalQuestions) * 100).toFixed(2),
            E: ((counts.E / totalQuestions) * 100).toFixed(2),
            M: ((counts.M / totalQuestions) * 100).toFixed(2),
            S: ((counts.S / totalQuestions) * 100).toFixed(2)
        };

        // Hide loading indicator and display results
        document.getElementById('loading').style.display = 'none';
        document.getElementById('result').innerHTML = `
            Data has been updated, please scroll down!
        `;

        // Update quiz part circles
        updatePercentage('percentage1', percentages.S); // Science
        updatePercentage('percentage2', percentages.T); // Tech
        updatePercentage('percentage3', percentages.E); // Engineer
        updatePercentage('percentage4', percentages.M); // Math

        // Display career recommendations
        displayCareerRecommendations(percentages);
    }, 2000);
}


const recommendations = [
    {
        "STEM_CAT": "Science",
        "Rcommendation_list": `
                    1. 3D Animator
                    2. Horticulturist
                    3. Paleontologist
                    4. Dentist
                    5. Paramedic
                    6. Diagnostic Medical Sonographer
                    7. Hydrologist
                    8. Park Naturalist
                    9. Doctor
                    10. Pharmacist
                    11. Ecologist
                    12. Lab Research Technician
                    13. Physicist
                    14. Ecologist
                    15. Physicist
                    16. Archaeologist
                    17. Astrobiologist
                    18. Psychologist
                    19. Astronaut
                    20. Marine Biologist
                    21. Astronomer
                    22. Radiologic Technician
                    23. Radiologist
                    24. Environmental Scientist
                    25. Meteorologist
                    26. Science Illustrator
                    27. Epidemiologist
                    28. Microbiologist
                    29. Sociologist
                    30. Exercise Physiologist
                    31. Museum Conservator
                    32. Botanist
                    33. Forensic Scientist
                    34. Nutritionist
                    35. Chemist
                    36. Forensic Pathologist
                    37. Climate Scientist
                    38. Geologist
                    39. Oceanographer
                    40. Genetic Counselor
                    41. Zoologist
                `
    },
    {
        "STEM_CAT": "Technology",
        "Rcommendation_list": `
                    1. Information Security Analyst
                    2. Educational Technologist
                    3. Librarian
                    4. Lighting Designer
                    5. Production Engineer
                    6. Market Research Analyst
                    7. Audio Engineer
                    8. Computer Graphic Designer
                    9. Computer Hardware Engineer
                    10. Computer Software Developer
                    11. Computer Systems Analyst
                    12. Graphics Designer
                    13. Video Game Designer
                    14. Special Effects Technician
                    15. Biometrics Technician
                    16. Nanosystems Engineer
                    17. CAD Technician
                    18. Solar Technician
                `
    },
    {
        "STEM_CAT": "Engineering",
        "Rcommendation_list": `
                    1. HVACR Technician
                    2. Aerospace Engineer
                    3. Industrial Designer
                    4. Agricultural Engineer
                    5. Agriculturalist
                    6. Air Traffic Controller
                    7. Architect
                    8. Automotive Designer
                    9. Automotive Service Technician
                    10. Avionics
                    11. Biomedical Engineer
                    12. Building Inspector
                    13. Chemical Engineer
                    14. Chemical Technician
                    15. Civil Engineer
                    16. Construction Supervisor
                    17. Electrical Engineer
                    18. Electrician
                    19. Environmental Engineer
                    20. General Contractor
                    21. Mechanical Engineer
                    22. Medical Roboticist
                    23. Naval Architect
                    24. Nuclear Engineer
                    25. Robotics Technician
                    26. Safety Engineer
                    27. Structural Engineer
                    28. Surveyor
                    29. Urban Planner
                `
    },
    {
        "STEM_CAT": "Mathematics",
        "Rcommendation_list": `
                    1. Actuary
                    2. Accountant
                    3. Economist
                    4. Financial Analyst
                    5. Mathematician
                    6. Mathematics Teacher
                    7. Statistician
                    8. Forensic Accountant
                    9. Stockbroker
                    10. Quantity Surveyor
                `
    }
];

function displayCareerRecommendations(percentages) {


    let highestCategory = '';
    let highestPercentage = 0;

    for (let category in percentages) {
        if (percentages[category] > highestPercentage) {
            highestPercentage = percentages[category];
            highestCategory = category;
        }
    }

    const recommendation = recommendations.find(rec => rec.STEM_CAT.charAt(0) === highestCategory);
    document.getElementById('occupation-guideline').innerText = recommendation ? recommendation.Rcommendation_list : 'No recommendations available';
}

document.addEventListener("DOMContentLoaded", function () {
    //Scroll to quiz button
    const scrollToQuizBtn = document.getElementById("scrollToQuizBtn");
    scrollToQuizBtn.addEventListener("click", function () {
        document.querySelector(".career_quiz_section").scrollIntoView({
            behavior: "smooth",
        });
    });

    // Scroll up bottom
    const scrollToTopBtn = document.getElementById("scrollToTopBtn");

    // When the user scrolls down 20px from the top of the document, show the button
    window.onscroll = function () {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            scrollToTopBtn.classList.add("show");
        } else {
            scrollToTopBtn.classList.remove("show");
        }
    };

    // When the user clicks on the button, scroll to the top of the document
    scrollToTopBtn.onclick = function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

});