document.addEventListener("DOMContentLoaded", function() {
    const default_height = document.getElementsByClassName('background-mg')[0].offsetHeight;
    adjustTextareaHeights(default_height);

    const monthInput = document.getElementById('month-input');

    const budgetInput = document.getElementById('budget-input');

    // Event listener for CSV upload button
    document.getElementById('upload-button').addEventListener('click', function() {
        document.getElementById('csv-file').click();
    });

    // Event listener to submit the form when a file is selected
    document.getElementById('csv-file').addEventListener('change', function() {
        document.forms[1].submit(); // Change index to match the correct form
    });

    // Event listener for form submission
    document.getElementById("gpoa-form").addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent default form submission

        if (check_all()) {
            submit_data(); // Call function to submit data
        }
    });

    monthInput.addEventListener("input", function() {
        const value = monthInput.value.trim();
        const validMonths = /^(January|February|March|April|May|June|July|August|September|October|November|December|january|february|march|april|may|june|july|august|september|october|november|december)$/;

        if (validMonths.test(value)) {
            monthInput.setCustomValidity("");
            monthInput.classList.remove("error");
        } else {
            monthInput.setCustomValidity("Please enter a valid month name (e.g., January)");
            monthInput.classList.add("error");
        }
    });

    budgetInput.addEventListener("input", function() {
        const value = budgetInput.value.trim();
        const validBudget = /^\d+(\.\d+)?$/;

        if (validBudget.test(value)) {
            budgetInput.setCustomValidity("");
            budgetInput.classList.remove("error");
        } else {
            budgetInput.setCustomValidity("Please enter a valid number for the proposed budget");
            budgetInput.classList.add("error");
        }
    });
});

function adjustTextareaHeights(default_height) {
    // Function implementation remains the same
    // Ensure it adjusts textarea heights properly
}

function check_all() {
    let table = document.getElementById("gpoa-table");
    let rows = table.rows.length;

    // Start the loop from the second row, skipping the header row
    for (let i = 1; i < rows; i++) {
        let current_row = table.rows[i];
        for (let j = 0; j < 6; j++) {
            let inputOrTextarea = current_row.cells[j].querySelector('input, textarea');
            if (!inputOrTextarea.value.trim()) {
                alert("Fill up all fields.");
                return false;
            }
        }
    }
    return true;
}

function submit_data() {
    var table = document.getElementById("gpoa-table");
    var data = [];
    var rows = table.rows;

    // Iterate over each row in the table
    for (var i = 1; i < rows.length; i++) { // Start from index 1 to skip the header row
        var cells = rows[i].cells;
        var rowData = [];

        // Iterate over each cell in the row
        for (var j = 0; j < cells.length; j++) {
            // Depending on the type of element (input, textarea), get the value appropriately
            var cellContent = cells[j].querySelector('input, textarea').value;
            rowData.push(cellContent);
        }
        data.push(rowData);
    }

    // Construct JSON object with data
    const list_data = {
        data: data
    };

    // Send the data to Flask route without expecting a response
    fetch('/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'link': 'gpoa'
        },
        body: JSON.stringify(list_data)
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        // Redirect to /officers after successful submission
        window.location.href = '/home'; // Adjust URL as per your Flask route
    }).catch(error => {
        console.error('Error:', error);
    });
}
