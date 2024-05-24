document.addEventListener("DOMContentLoaded", adjustTextareaHeights);

function adjustTextareaHeights() {
    // Get all isntances of 'textarea' tag
    const textareas = document.querySelectorAll(".gpoa-inputs-objectives");

    // For each textarea add an eventlistener that adds height
    textareas.forEach(textarea => {
        textarea.addEventListener("input", () => {
            textarea.style.height = "auto";
            let input_height = textarea.scrollHeight;
            textarea.style.height = `${input_height}px`;
        });
    });
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

function add_row() {
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
        adjustTextareaHeights();
    }
    else {
        alert("Fill up all fields.");
    }
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