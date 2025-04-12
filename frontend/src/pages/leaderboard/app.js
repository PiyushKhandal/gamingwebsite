const search = document.querySelector('.input-group input'),
    table_rows = document.querySelectorAll('tbody tr'),
    table_headings = document.querySelectorAll('thead th');

    const noMatchMessage = document.getElementById('no-match-message');


// 1. Searching for specific data of HTML table
search.addEventListener('input', searchTable);

function searchTable() {

    let noMatch = true; // Flag to check if no match is found

    table_rows.forEach((row, i) => {
        let table_data = row.textContent.toLowerCase(),
            search_data = search.value.toLowerCase();

        const found = table_data.indexOf(search_data) >= 0;

        row.classList.toggle('hide', table_data.indexOf(search_data) < 0);
        row.style.setProperty('--delay', i / 25 + 's');

        if (found) {
            noMatch = false; // Update flag if a match is found
        }
    })

    // Show or hide the no match message based on the flag
    noMatchMessage.style.display = noMatch ? 'block' : 'none';


    document.querySelectorAll('tbody tr:not(.hide)').forEach((visible_row, i) => {
        visible_row.style.backgroundColor = (i % 2 == 0) ? 'transparent' : 'transparent';
    });
}








// 2. Sorting | Ordering data of HTML table

// Sorting data of HTML table

table_headings.forEach((head, i) => {
    let sort_asc = true;
    head.addEventListener('click', () => {
        table_headings.forEach(h => h.classList.remove('active', 'asc', 'desc'));
        head.classList.add('active', sort_asc ? 'asc' : 'desc');

        const columnIndex = i;
        sortTable(columnIndex, sort_asc);
        sort_asc = !sort_asc;
    });
});



function sortTable(column, ascending) {
    const tbody = document.querySelector('tbody');
    const rowsArray = Array.from(tbody.querySelectorAll('tr'));

    const sortedRows = rowsArray.sort((rowA, rowB) => {
        const cellA = rowA.querySelectorAll('td')[column].textContent.trim();
        const cellB = rowB.querySelectorAll('td')[column].textContent.trim();

        if (column === 0) { // Assuming column 0 is the Id column
            // Convert Id strings to numbers for proper comparison
            return ascending ? parseInt(cellA, 10) - parseInt(cellB, 10) : parseInt(cellB, 10) - parseInt(cellA, 10);
        } else if (column === 3) { // Assuming column 3 is the Order Date column
            // Convert date strings to Date objects for proper comparison
            return ascending ? new Date(cellA) - new Date(cellB) : new Date(cellB) - new Date(cellA);
        } else if (column === 5) { // Assuming column 5 is the Amount column
            // Convert amount strings to numbers for proper comparison
            return ascending ? parseFloat(cellA.substring(1)) - parseFloat(cellB.substring(1)) : parseFloat(cellB.substring(1)) - parseFloat(cellA.substring(1));
        } else {
            // For other columns, perform simple string comparison
            return ascending ? cellA.localeCompare(cellB) : cellB.localeCompare(cellA);
        }
    });

    // Reappend sorted rows to tbody
    sortedRows.forEach(row => tbody.appendChild(row));
}













// 3. Converting HTML table to PDF

const pdf_btn = document.querySelector('#toPDF');
const customers_table = document.querySelector('#mainTable');


const toPDF = function (customers_table) {
    const html_code = `
    <!DOCTYPE html>
    <link rel="stylesheet" type="text/css" href="style.css">
    <main class="table" id="customers_table">${customers_table.innerHTML}</main>`;

    const new_window = window.open();
     new_window.document.write(html_code);

    setTimeout(() => {
        new_window.print();
        new_window.close();
    }, 400);
}

pdf_btn.onclick = () => {
    toPDF(customers_table);
}

// function convertToPDF() {
//     const doc = new jsPDF();
//     const table = document.getElementById('mainTable');
    
//     // Convert the table to a canvas element
//     html2canvas(table).then(canvas => {
//         // Get the data URL of the canvas
//         const imgData = canvas.toDataURL('image/png');
        
//         // Add the image to the PDF
//         doc.addImage(imgData, 'PNG', 10, 10);
        
//         // Save the PDF
//         doc.save('table.pdf');
//     });
// }



// const table = document.getElementById('mainTable');
// html2pdf(table, {
//     margin: 10, 
//     filename: 'myfile.pdf', 
//     image: {type: 'jpeg', quality: 0.98}, 
//     html2canvas: {scale: 2, logging: 'true', dpi: 192, letterRendering: true},
//     jsPDF: {unit: 'mm', format: 'a4', orientation: 'portrait'}
// })








// 4. Converting HTML table to JSON

const json_btn = document.querySelector('#toJSON');

const toJSON = function (table) {
    let table_data = [],
        t_head = [],

        t_headings = table.querySelectorAll('th'),
        t_rows = table.querySelectorAll('tbody tr');

    for (let t_heading of t_headings) {
        let actual_head = t_heading.textContent.trim().split(' ');

        t_head.push(actual_head.splice(0, actual_head.length - 1).join(' ').toLowerCase());
    }

    t_rows.forEach(row => {
        const row_object = {},
            t_cells = row.querySelectorAll('td');

        t_cells.forEach((t_cell, cell_index) => {
            const img = t_cell.querySelector('img');
            if (img) {
                row_object['customer image'] = decodeURIComponent(img.src);
            }
            row_object[t_head[cell_index]] = t_cell.textContent.trim();
        })
        table_data.push(row_object);
    })

    return JSON.stringify(table_data, null, 4);
}

json_btn.onclick = () => {
    const json = toJSON(customers_table);
    downloadFile(json, 'json')
}

// 5. Converting HTML table to CSV File

const csv_btn = document.querySelector('#toCSV');

const toCSV = function (table) {
    // Code For SIMPLE TABLE
    // const t_rows = table.querySelectorAll('tr');
    // return [...t_rows].map(row => {
    //     const cells = row.querySelectorAll('th, td');
    //     return [...cells].map(cell => cell.textContent.trim()).join(',');
    // }).join('\n');

    const t_heads = table.querySelectorAll('th'),
        tbody_rows = table.querySelectorAll('tbody tr');

    const headings = [...t_heads].map(head => {
        let actual_head = head.textContent.trim().split(' ');
        return actual_head.splice(0, actual_head.length - 1).join(' ').toLowerCase();
    }).join(',') + ',' + 'image name';

    const table_data = [...tbody_rows].map(row => {
        const cells = row.querySelectorAll('td'),
            img = decodeURIComponent(row.querySelector('img').src),
            data_without_img = [...cells].map(cell => cell.textContent.replace(/,/g, ".").trim()).join(',');

        return data_without_img + ',' + img;
    }).join('\n');

    return headings + '\n' + table_data;
}

csv_btn.onclick = () => {
    const csv = toCSV(customers_table);
    downloadFile(csv, 'csv', 'customer orders');
}

// 6. Converting HTML table to EXCEL File

const excel_btn = document.querySelector('#toEXCEL');

const toExcel = function (table) {
    // Code For SIMPLE TABLE
    // const t_rows = table.querySelectorAll('tr');
    // return [...t_rows].map(row => {
    //     const cells = row.querySelectorAll('th, td');
    //     return [...cells].map(cell => cell.textContent.trim()).join('\t');
    // }).join('\n');

    const t_heads = table.querySelectorAll('th'),
        tbody_rows = table.querySelectorAll('tbody tr');

    const headings = [...t_heads].map(head => {
        let actual_head = head.textContent.trim().split(' ');
        return actual_head.splice(0, actual_head.length - 1).join(' ').toLowerCase();
    }).join('\t') + '\t' + 'image name';

    const table_data = [...tbody_rows].map(row => {
        const cells = row.querySelectorAll('td'),
            img = decodeURIComponent(row.querySelector('img').src),
            data_without_img = [...cells].map(cell => cell.textContent.trim()).join('\t');

        return data_without_img + '\t' + img;
    }).join('\n');

    return headings + '\n' + table_data;
}

excel_btn.onclick = () => {
    const excel = toExcel(customers_table);
    downloadFile(excel, 'excel');
}

const downloadFile = function (data, fileType, fileName = '') {
    const a = document.createElement('a');
    a.download = fileName;
    const mime_types = {
        'json': 'application/json',
        'csv': 'text/csv',
        'excel': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    }
    a.href = `
        data:${mime_types[fileType]};charset=utf-8,${encodeURIComponent(data)}
    `;
    document.body.appendChild(a);
    a.click();
    a.remove();
}
