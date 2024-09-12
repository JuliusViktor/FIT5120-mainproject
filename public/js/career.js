
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
    alert('Button clicked!');
});


// Function to update the percentage value for a specific circle
function updatePercentage(circleId, percentage) {
    document.getElementById(circleId).innerText = percentage + '%';
}

// Update the percentage for each circle
//quiz part
updatePercentage('percentage1', 75); // Science
updatePercentage('percentage2', 50); // Tech
updatePercentage('percentage3', 85); // Engineer
updatePercentage('percentage4', 90); // Math

//suggest part
updatePercentage('percentage5', 95); // Science
updatePercentage('percentage6', 40); // Tech
updatePercentage('percentage7', 35); // Engineer
updatePercentage('percentage8', 40); // Math

