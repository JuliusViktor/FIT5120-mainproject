
/* learn how button action */

document.getElementById('learnHowBtn').addEventListener('click', function() {
    window.scrollBy({
        top: window.innerHeight,
        left: 0,
        behavior: 'smooth'
    });
});
/* X in searching bar */
function clearInput() {
    document.querySelector('.search-bar').value = '';
}


/* submit button */
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

document.querySelector('.submit-button').addEventListener('click', function() {
    var statusBar = document.getElementById('quiz-status-bar');
    
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

// Update the percentage for each circle
updatePercentage('percentage5', 95); // Science
updatePercentage('percentage6', 40); // Tech
updatePercentage('percentage7', 35); // Engineer
updatePercentage('percentage8', 40); // Math


//skip quiz button
function scrollToBottom(button) {
    button.classList.add('active');
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
    });
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
            }, 2000); // Simulate a delay for calculation

            
        }
        