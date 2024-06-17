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
        document.forms[0].submit();
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

function add_row(default_height) {
    // Get the table
    let table = document.getElementById("gpoa-table");
    let lastRowIndex = table.rows.length - 1;
    let lastRow = table.rows[lastRowIndex];

    // Loop through each column index
    if (validate_row(lastRow.cells)) {

        // If content found in all column proceed to add row else warn
        let row = table.insertRow(-1);

        for (let i = 0; i < 6; i++) {
            let cell = row.insertCell(i); // Create a new cell for each column

            // Check if it's the first column or columns 4, 5 (0-based index)
            if (i == 0 || i >= 4) {
                let input = document.createElement('input'); // Create a new input element
                input.setAttribute('class', 'gpoa-inputs');
                input.setAttribute('maxlength', '16');
                input.setAttribute('required', 'required');
                cell.appendChild(input); // Append the input to the cell
            } else {
                let textarea = document.createElement('textarea'); // Create a new textarea element
                textarea.setAttribute('class', 'gpoa-inputs-objectives');
                textarea.setAttribute('rows', '1');
                cell.appendChild(textarea); // Append the textarea to the cell
            }
        }
        // Call function that makes the 'textarea' tag dynamic
        adjustTextareaHeights(default_height);

        // Get elements needed for adjusting the bg
        const ft = document.getElementsByClassName('footer')[0];
        const tb = document.getElementsByClassName('table-gpoa')[0];
        const bt = document.getElementsByClassName('add-1')[0];
        const bg = document.getElementsByClassName('background-mg')[0];
        const gap = getVerticalGap(bt, ft)

        let tb_height = tb.offsetHeight;
        console.log(gap);

        // Adjust bg
        if (gap < 0) {
            console.log("tae");
            bg.style.height = `${tb_height + 150}px`;
        }
    }
    else {
        alert("Fill up all fields.");
    }
}

function adjustTextareaHeights(default_height) {
    // Get all isntances of 'textarea' tag
    const textareas = document.querySelectorAll(".gpoa-inputs-objectives");
    const maxIncreases = 3;
    let increaseCount = 0;


    // For each textarea add an eventlistener that adds height
    textareas.forEach(textarea => {
        textarea.addEventListener("input", () => {
            const bg = document.getElementsByClassName('background-mg')[0];
            const tb = document.getElementsByClassName('table-gpoa')[0];
            // Adjust the input height
            textarea.style.height = "auto";
            let input_height = textarea.scrollHeight;
            textarea.style.height = `${input_height}px`;

            // Adjust the Padding

            // If height of table is greater than background height, adjust
            let tb_height = tb.offsetHeight;
            let bg_height = bg.offsetHeight;
            let gap = bg_height - tb_height;

            // Revert to default if bg height is smaller
            if ((tb_height/bg_height) < .2066){
                bg.style.height = `${default_height}px`;
            }
            if (gap <= 150){
                bg.style.height = `${tb_height + 150}px`;
            } else if ((tb_height / bg_height) > .21){
                bg.style.height = `${default_height}px`
            }
        });
    });
}

function getVerticalGap(element1, element2) {
    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect();
    
    // Calculate the gap between the bottom of the first element and the top of the second element
    const gap = rect2.top - rect1.bottom;

    return gap;
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

function validate_row(columns) {
    // Iterate over each columns in the last row
    for (let i = 0; i < columns.length; i++) {
        // Check if the input or textarea in the cell has value
        let inputOrTextarea = columns[i].querySelector('input, textarea');
        // If a null value is found return false
        if (!inputOrTextarea.value.trim()) {
            return false;
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
        window.location.href = '/'; // Adjust URL as per your Flask route
    }).catch(error => {
        console.error('Error:', "Something went wrong with the server");
    });
}
