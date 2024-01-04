function generateTable() {
    var input = document.getElementById('inputArea').value;
    var rows = input.split('\n');
    var headers = rows[0].split('\t');
    var table = '<table id="customers_table"><thead><tr>';

    for (var h = 0; h < headers.length; h++) {
        // Remove inline onclick, we will add event listeners later
        table += '<th>' + headers[h] + '</th>';
    }

    table += '</tr></thead><tbody>';

    for (var i = 1; i < rows.length; i++) {
        var cells = rows[i].split('\t');
        table += '<tr>';
        for (var j = 0; j < cells.length; j++) {
            table += '<td>' + cells[j] + '</td>';
        }
        table += '</tr>';
    }

    table += '</tbody></table>';
    document.getElementById('tableContainer').innerHTML = table;

    // Call the function to add event listeners to the table headers
    addSortingEventListeners();
}

function addSortingEventListeners() {
    var table = document.getElementById('customers_table');
    var headers = table.querySelectorAll('th');
    headers.forEach(function(header, index) {
        header.addEventListener('click', function() {
            sortTable(index);
        });
    });
}



function sortTable(n) {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("customers_table");
    switching = true;
    while (switching) {
        switching = false;
        rows = table.rows;
        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
            if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    var table = document.getElementById('customers_table');
    var headers = table.querySelectorAll('th');
    headers.forEach(function(header, i) {
        header.addEventListener('click', function() {
            sortTable(i);
        });
    });
});

    
document.addEventListener('DOMContentLoaded', () => {
    const tableHeadings = document.querySelectorAll('#customers_table thead th');
    const tableRows = document.querySelectorAll('#customers_table tbody tr');
    

    // Sort functionality
    tableHeadings.forEach((head, i) => {
        if (i < tableHeadings.length - 1) {
            head.addEventListener('click', () => sortTable(i));
        }
    });

    // Hide rows functionality
    tableRows.forEach(row => {
        const hideButton = document.createElement('button');
        hideButton.textContent = 'x';
        hideButton.classList.add('no-print');
        hideButton.addEventListener('click', () => row.classList.toggle('hidden'));

        // Append the button to the last cell in the row
        const lastCell = row.insertCell(-1); // -1 appends a new cell at the end
        lastCell.appendChild(hideButton);
    });

    // Show all rows button
    const showAllButton = document.createElement('button');
    showAllButton.textContent = 'Show All Rows';
    showAllButton.addEventListener('click', () => {
        tableRows.forEach(row => row.classList.remove('hidden'));
    });
    document.body.insertBefore(showAllButton, document.body.firstChild);

    // Hide columns functionality
    tableHeadings.forEach((th, columnIndex) => {
        const hideColButton = document.createElement('button');
        hideColButton.textContent = 'x';
        hideColButton.classList.add('no-print');
        hideColButton.addEventListener('click', () => toggleColumn(columnIndex));
    
        // Wrap existing text in a span
        const textSpan = document.createElement('span');
        textSpan.innerHTML = th.innerHTML;
        th.innerHTML = ''; // Clear existing content
        th.appendChild(hideColButton);
        th.appendChild(textSpan); // Add text span after the button
    });
});


/* --------- RECOVER ALL COLUMNS----------- */
// Show all columns button
// Show all columns button
const showAllColumnsButton = document.createElement('button');
showAllColumnsButton.textContent = 'Show All Columns';
showAllColumnsButton.addEventListener('click', () => {
    const columnsCount = document.getElementById('customers_table').rows[0].cells.length;
    for (let i = 0; i < columnsCount; i++) {
        document.querySelectorAll(`#customers_table td:nth-child(${i+1}), #customers_table th:nth-child(${i+1})`).forEach(cell => {
            cell.classList.remove('hidden'); // If using a class to hide columns
            cell.style.display = ''; // If using inline styles to hide columns
        });
    }
});
document.body.insertBefore(showAllColumnsButton, document.body.firstChild);



/* --------- TABLE LINES ----------- */

function toggleHorizontalBorders() {
    var tbody = document.getElementById('customers_table').querySelector('tbody');
    if (tbody) {
        tbody.classList.toggle('horizontal-borders');
    }
}

function toggleVerticalBorders() {
    var table = document.getElementById('customers_table');
    var cells = table.getElementsByTagName('td');
    var headers = table.getElementsByTagName('th');
    for (var i = 0; i < cells.length; i++) {
        cells[i].classList.toggle('vertical-borders');
    }
    for (var i = 0; i < headers.length; i++) {
        headers[i].classList.toggle('vertical-borders');
    }
}

function changeBorderColor() {
    const color = document.getElementById('borderColorPicker').value;
    document.documentElement.style.setProperty('--border-color', color);
}

document.addEventListener('DOMContentLoaded', () => {
    // Make sure this is after the table has been generated
    generateTable();
    
    // Then add the event listeners
    document.getElementById('horizontalBorderBtn').addEventListener('click', toggleHorizontalBorders);
    document.getElementById('verticalBorderBtn').addEventListener('click', toggleVerticalBorders);
    document.getElementById('borderColorPicker').addEventListener('input', changeBorderColor);
});


/* --------- SORTING ----------- */
function sortTable(columnIndex) {
    const table = document.getElementById('customers_table');
    const rows = Array.from(table.tBodies[0].rows);
    const ascending = columnIndex !== sortedColumnIndex;

    rows.sort((row1, row2) => {
        const cell1 = row1.cells[columnIndex].textContent;
        const cell2 = row2.cells[columnIndex].textContent;
        return ascending ? cell1.localeCompare(cell2) : cell2.localeCompare(cell1);
    });

    rows.forEach(row => table.tBodies[0].appendChild(row));
    sortedColumnIndex = ascending ? columnIndex : null;
}

let sortedColumnIndex = null;

function toggleColumn(columnIndex) {
    document.querySelectorAll('#customers_table tr').forEach(row => {
        const cell = row.cells[columnIndex];
        if (cell) {
            cell.classList.toggle('hidden');
        }
    });
}



/*----------- SERVICE COLUMN ----------------- */

/*----------- REMOVE TEH SERVICE COLUMN FROM TEH ----------------- */
function adjustColumnsForExport() {
    const headers = document.querySelectorAll('#customers_table thead th');
    headers.forEach((header, index) => {
        const shouldHide = header.textContent.trim() === '';
        document.querySelectorAll('#customers_table tr').forEach(row => {
            if (row.cells[index]) {
                row.cells[index].style.display = shouldHide ? 'none' : '';
            }
        });
    });
}

/*----------- EXTERNAL BUTTON FUNTIONS ----------------- */


function saveSelectedAsImage() {
    toggleServiceColumn(false);
    html2canvas(document.getElementById('customers_table')).then(canvas => {
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        toggleServiceColumn(true);
    
        link.href = image;
        link.download = 'table.png';
        link.click();
    });
}

function saveSelectedAsImage() {
    if (document.getElementById('selectTableCheckbox').checked) {
        const hideButtons = document.querySelectorAll('.no-print');
        hideButtons.forEach(button => button.style.display = 'none');

        html2canvas(document.getElementById('customers_table')).then(canvas => {
            hideButtons.forEach(button => button.style.display = '');

            const image = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = image;
            link.download = 'table.png';
            link.click();
        });
    } else {
        alert("No elements selected for export.");
    }
}

function saveSelectedAsPDF() {
    if (document.getElementById('selectTableCheckbox').checked) {
        const hideButtons = document.querySelectorAll('.no-print');
        hideButtons.forEach(button => button.style.display = 'none');

        html2canvas(document.getElementById('customers_table')).then(canvas => {
            hideButtons.forEach(button => button.style.display = '');

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jspdf.jsPDF({
                orientation: 'landscape',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save('table.pdf');
        });
    } else {
        alert("No elements selected for export.");
    }
}



function saveSelectedAsImage() {
    if (document.getElementById('selectTableCheckbox').checked) {
    const hideButtons = document.querySelectorAll('.no-print');
    hideButtons.forEach(button => button.style.display = 'none');

    html2canvas(document.getElementById('customers_table')).then(canvas => {
        // After image is captured, show the hide buttons again
        hideButtons.forEach(button => button.style.display = '');

        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = 'table.png';
        link.click();
    });
    } else {
        alert("No elements selected for export.");
    }
}

function saveSelectedAsPDF() {
    if (document.getElementById('selectTableCheckbox').checked) {
        const hideButtons = document.querySelectorAll('.no-print');
        hideButtons.forEach(button => button.style.display = 'none');

        html2canvas(document.getElementById('customers_table')).then(canvas => {
            // After PDF capture, show the hide buttons again
            hideButtons.forEach(button => button.style.display = '');

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jspdf.jsPDF({
                orientation: 'landscape',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save('table.pdf');
        });
    } else {
        alert("No elements selected for export.");
    }
}

