

/* X in searching bar */
function clearInput() {
    document.querySelector('.search-bar').value = '';
}


/* type in submit button */
 // add envent here
 document.querySelector('.submit-button').addEventListener('click', function() {
    var statusBar = document.getElementById('suggest-status-bar');
    
    // Set to loading state
    statusBar.textContent = 'Loading...';
    statusBar.className = 'status-bar loading';
    
    // Simulate an asynchronous operation
    setTimeout(function() {
        // Assume the search is successful
        var isSuccess = true; // You can set this value based on actual conditions
        
        if (isSuccess) {
            statusBar.textContent = 'Searching successful, data below has been updated';
            statusBar.className = 'status-bar success';
        } else {
            statusBar.textContent = 'Searching fail...try again please!';
            statusBar.className = 'status-bar fail';
        }
    }, 2000); // Simulate a 2-second loading time
});


function clearInput() {
    document.querySelector('.search-bar').value = '';
}



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

//quiz list
function selectAnswer(quizId, answer) {
    const quizBlock = document.getElementById(quizId);
    const buttons = quizBlock.getElementsByClassName('quiz-button');
    
    for (let button of buttons) {
        button.classList.remove('selected');
    }
    
    const selectedButton = Array.from(buttons).find(button => button.textContent.includes(answer));
    selectedButton.classList.add('selected');
}

//quiz submit logic
const answers = {};

        function selectAnswer(quizId, answer) {
            answers[quizId] = answer;
        }

        function submitQuiz() {
            const totalQuestions = 20;
            const unansweredQuestions = [];

            for (let i = 1; i <= totalQuestions; i++) {
                if (!answers[`quiz${i}`]) {
                    unansweredQuestions.push(i);
                }
            }

            if (unansweredQuestions.length > 0) {
                alert(`You missed the following questions: ${unansweredQuestions.join(', ')}`);
                return;
            }

            document.getElementById('loading').style.display = 'block';
            document.getElementById('result').innerHTML = '';

            setTimeout(() => {
                const counts = { T: 0, E: 0, M: 0, S: 0 };

                for (let key in answers) {
                    counts[answers[key]]++;
                }

                const percentages = {
                    T: (counts.T / totalQuestions * 100).toFixed(2),
                    E: (counts.E / totalQuestions * 100).toFixed(2),
                    M: (counts.M / totalQuestions * 100).toFixed(2),
                    S: (counts.S / totalQuestions * 100).toFixed(2)
                };

                document.getElementById('loading').style.display = 'none';
                document.getElementById('result').innerHTML = `
                    T: ${percentages.T}%<br>
                    E: ${percentages.E}%<br>
                    M: ${percentages.M}%<br>
                    S: ${percentages.S}%<br>
                    Data updated!
                `;

                //quiz part circles update
                updatePercentage('percentage1', percentages.S); // Science
                updatePercentage('percentage2', percentages.T); // Tech
                updatePercentage('percentage3', percentages.E); // Engineer
                updatePercentage('percentage4', percentages.M); // Math

                // Display the career recommendations
                displayCareerRecommendations(percentages);
            }, 2000); // Simulate a delay for calculation

            
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

// Update the percentage for each circle
updatePercentage('percentage5', 95); // Science
updatePercentage('percentage6', 40); // Tech
updatePercentage('percentage7', 35); // Engineer
updatePercentage('percentage8', 40); // Math

    
// scroll up bottom
// Get the button
const scrollToTopBtn = document.getElementById("scrollToTopBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        scrollToTopBtn.classList.add("show");
    } else {
        scrollToTopBtn.classList.remove("show");
    }
};

// When the user clicks on the button, scroll to the top of the document
scrollToTopBtn.onclick = function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};