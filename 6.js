document.addEventListener('DOMContentLoaded', (event) => {
    const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;
  
    const comparer = (idx, asc) => (a, b) => ((v1, v2) => 
        v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)
        )(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));
  
    // do the work...
    document.querySelectorAll('th').forEach(th => th.addEventListener('click', (() => {
        const table = th.closest('table');
        Array.from(table.querySelectorAll('tr:nth-child(n+2)'))
            .sort(comparer(Array.from(th.parentNode.children).indexOf(th), this.asc = !this.asc))
            .forEach(tr => table.appendChild(tr) );
    })));
  });


/* OLD PART */

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

function sortTable(columnIndex) {
    const table = document.getElementById('customers_table');
    const rows = Array.from(table.tBodies[0].rows);

    // Skip sorting if column is hidden
    if(table.tHead.rows[0].cells[columnIndex].style.display === 'none') return;

    const ascending = columnIndex !== sortedColumnIndex;
    rows.sort((row1, row2) => {
        if(row1.style.display === 'none' || row2.style.display === 'none') return 0;
        const cell1 = row1.cells[columnIndex].textContent;
        const cell2 = row2.cells[columnIndex].textContent;
        return ascending ? cell1.localeCompare(cell2) : cell2.localeCompare(cell1);
    });

    rows.forEach(row => table.tBodies[0].appendChild(row));
    sortedColumnIndex = ascending ? columnIndex : null;
}

document.getElementById('showAllColumns').addEventListener('click', () => {
    document.querySelectorAll('#customers_table tr').forEach(row => {
        row.querySelectorAll('td, th').forEach(cell => cell.classList.remove('hidden'));
    });
});

// Move the last column (service column) to the first position
document.querySelectorAll('#customers_table tr').forEach(row => {
    const cells = Array.from(row.cells);
    row.insertBefore(cells.pop(), row.firstChild);
});

// Update the toggleColumn function to account for the moved column
function toggleColumn(columnIndex) {
    document.querySelectorAll('#customers_table tr').forEach(row => {
        const cell = row.cells[columnIndex + 1]; // +1 due to moved column
        if (cell) {
            cell.classList.toggle('hidden');
        }
    });
}

/* --------- RECOVER ALL COLUMNS----------- */
function showAllColumns() {
    const columnsCount = document.getElementById('customers_table').tHead.rows[0].cells.length;
    for(let i = 0; i < columnsCount; i++) {
        document.querySelectorAll('#customers_table tr').forEach(row => {
            if(row.cells[i]) row.cells[i].style.display = '';
        });
    }
}

const showAllColumnsButton = document.createElement('button');
document.body.insertBefore(showAllColumnsButton, document.body.firstChild);



/* --------- TABLE LINES ----------- */
function toggleHorizontalBorders() {
    document.querySelectorAll('#customers_table tr').forEach(row => {
        row.classList.toggle('horizontal-borders');
    });
}

function toggleVerticalBorders() {
    document.querySelectorAll('#customers_table td, #customers_table th').forEach(cell => {
        cell.classList.toggle('vertical-borders');
    });
}

function changeBorderColor() {
    const color = document.getElementById('borderColorPicker').value;
    document.documentElement.style.setProperty('--border-color', color);
}

document.addEventListener('DOMContentLoaded', () => {
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



GPT
