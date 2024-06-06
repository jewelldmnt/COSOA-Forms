document.addEventListener("DOMContentLoaded", function() {

    const default_height = document.getElementsByClassName('background-mg')[0].offsetHeight;
    adjustTextareaHeights(default_height);

    // Event listener for CSV upload button
    document.getElementById('upload-button').addEventListener('click', function() {
        document.getElementById('csv-file').click();
    });

    // Event listener to submit the form when a file is selected
    document.getElementById('csv-file').addEventListener('change', function() {
        document.forms[0].submit();
    });

    document.getElementById("gpoa-submit").addEventListener("click", submit_data());
});

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

document.getElementById('upload-button').addEventListener('click', function() {
    document.getElementById('csv-file').click();
});

document.getElementById('csv-file').addEventListener('change', function() {
    document.forms[0].submit();
});

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

function getVerticalGap(element1, element2) {
    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect();
    
    // Calculate the gap between the bottom of the first element and the top of the second element
    const gap = rect2.top - rect1.bottom;

    return gap;
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
    for (var i = 0; i < rows.length; i++) {
        var cells = rows[i].cells;
        var rowData = [];

        // Iterate over each cell in the row
        for (var j = 0; j < cells.length; j++) {
            rowData.push(cells[j].textContent);
        }
        data.push(rowData);
    }

    // Send the data to Flask route
    fetch('/submit', {
        method: 'POST',
        headers: {
            'link': 'gpoa'
        },
        body: JSON.stringify({ data: data })
    })
}