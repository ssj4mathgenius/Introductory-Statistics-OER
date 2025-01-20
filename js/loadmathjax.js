console.log("entered load mathjax javascript file");

function replaceBlanksForPrint() {
    const blankedElements = document.querySelectorAll('.blanked');

    blankedElements.forEach(element => {
        const originalText = element.textContent.trim();
        const underscores = '_'.repeat(originalText.length); // Generate underscores
        element.setAttribute('data-original', originalText); // Store original text
        element.textContent = underscores; // Replace text with underscores
    });
};

function restoreOriginalText() {
    const blankedElements = document.querySelectorAll('.blanked');

    blankedElements.forEach(element => {
        const originalText = element.getAttribute('data-original'); // Retrieve original text
        if (originalText) {
            element.textContent = originalText; // Restore original text
        }
    });
};

// Attach handlers for print and post-print
window.addEventListener('beforeprint', replaceBlanksForPrint);
window.addEventListener('afterprint', restoreOriginalText);


window.onload = function () {

    // Add MathJax configuration after a delay
    setTimeout(function () {
        var head = document.getElementsByTagName("head")[0],
            script;
        script = document.createElement("script");
        script.type = "text/x-mathjax-config";
        script[(window.opera ? "innerHTML" : "text")] =
            "MathJax.Hub.Config({\n" +
            "  extensions: [\"tex2jax.js\"], jax: [\"input/TeX\", \"output/HTML-CSS\"], tex2jax: { inlineMath: [ ['$','$'] ], displayMath: [ ['$$','$$']], processEscapes: true }, \"HTML-CSS\": { availableFonts: [\"TeX\"] } \n" +
            "});"
        head.appendChild(script);
        script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?...";
        head.appendChild(script);
    }, 2000);
};

window.MathJax = {
    tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [['$$', '$$'], ['\\[', '\\]']],
    },
    options: {
        renderActions: {
            addDarkMode: [200, function (doc) {
                const style = document.createElement('style');
                style.innerHTML = `
                    .mjx-container * {
                        color: var(--mjx-color, inherit) !important;
                    }
                    @media print {
                        .mjx-container * {
                            color: var(--mjx-color, inherit) !important;
                        }
                    }
                `;
                document.head.appendChild(style);
            }, '', false]
        }
    }
};

function setMathJaxColorScheme() {
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.style.setProperty('--mjx-color', isDarkMode ? '#ffffff' : '#000000');
};

// Initial color scheme setup
setMathJaxColorScheme();

// Update color scheme dynamically when the user changes modes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', setMathJaxColorScheme);


function updateExampleNumbers() {
    const examples = document.querySelectorAll('.example');
    examples.forEach((example, index) => {
        const numberSpan = example.querySelector('.example-number');
        numberSpan.textContent = index + 1;
    });
};

// Example of adding a new example dynamically
const newExample = document.createElement('div');
newExample.className = 'example';
newExample.innerHTML = `
    <h2>Example <span class="example-number"></span></h2>
`;

document.body.appendChild(newExample);
updateExampleNumbers();

//Copy to Clipboard 
//<button onclick="copyToClipboard('data id')">Copy Data to Clipboard</button>
function copyToClipboard(preID) {
    const pre = document.getElementById(preID);
    const text = pre.textContent || pre.innerText;
    navigator.clipboard.writeText(text).then(() => {
        alert('Dataset copied to clipboard!');
    }).catch(err => {
        console.error('Error copying text: ', err);
    });
};

//Toggles Display of Larger Tables of Data based on id
//<button onclick="toggleTable()">Toggle Table Visibility</button>
function toggleTable() {
    const tableDiv = document.getElementById('wrappedTable');
    if (tableDiv.classList.contains('hidden')) {
        tableDiv.classList.remove('hidden'); // Show the table
    } else {
        tableDiv.classList.add('hidden'); // Hide the table
    }
};

function generateTableFromPre(preId, captionText) {
    const tableContainer = document.getElementById('tableContainer');
    tableContainer.innerHTML = ''; // Clear previous content

    try {
        const preElement = document.getElementById(preId);
        const csvText = preElement.textContent.trim();

        const rows = csvText.split('\n').filter(row => row.trim() !== '');
        const headers = rows[0].split(',');
        const data = rows.slice(1);

        const table = document.createElement('table');

        // Add caption
        const caption = document.createElement('caption');
        caption.textContent = captionText || 'Generated Table';
        table.appendChild(caption);

        // Add headers
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Add data rows
        const tbody = document.createElement('tbody');
        data.forEach(row => {
            const dataRow = document.createElement('tr');
            row.split(',').forEach(cell => {
                const td = document.createElement('td');
                td.textContent = cell || ''; // Fill empty cells with blank content
                dataRow.appendChild(td);
            });
            tbody.appendChild(dataRow);
        });
        table.appendChild(tbody);

        tableContainer.appendChild(table);
        tableContainer.style.display = 'block'; // Show the container
    } catch (error) {
        tableContainer.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
        tableContainer.style.display = 'block';
    }
};


async function generateTable(csvUrl, captionText) {
    const tableContainer = document.getElementById('tableContainer');
    tableContainer.innerHTML = ''; // Clear any previous content

    try {
        // Fetch the CSV file
        const response = await fetch(csvUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch CSV: ${response.statusText}`);
        }
        const csvText = await response.text();

        // Parse CSV data
        const rows = csvText.split('\n').filter(row => row.trim() !== '');
        if (rows.length === 0) {
            throw new Error('CSV file is empty');
        }
        const headers = rows[0].split(',');
        const data = rows.slice(1);

        // Check the number of columns and determine layout
        const isWrapped = headers.length <= 2;

        // Add the "Copy Data to Clipboard" button
        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copy Data to Clipboard';
        copyButton.onclick = () => navigator.clipboard.writeText(csvText).then(() => {
            alert('CSV data copied to clipboard!');
        });
        tableContainer.appendChild(copyButton);

        // Create the table
        const table = document.createElement('table');

        // Add caption
        const caption = document.createElement('caption');
        caption.textContent = captionText || 'Generated Table';
        table.appendChild(caption);

        // Add headers
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Add data rows
        const tbody = document.createElement('tbody');
        if (isWrapped) {
            // For 1 or 2 columns, wrap the table data into two visually separate sections
            const half = Math.ceil(data.length / 2);
            const leftData = data.slice(0, half);
            const rightData = data.slice(half);

            // Create rows for left and right data
            for (let i = 0; i < Math.max(leftData.length, rightData.length); i++) {
                const row = document.createElement('tr');

                // Add left-side data
                if (leftData[i]) {
                    leftData[i].split(',').forEach(cell => {
                        const td = document.createElement('td');
                        td.textContent = cell;
                        row.appendChild(td);
                    });
                } else {
                    headers.forEach(() => {
                        const td = document.createElement('td');
                        row.appendChild(td); // Empty cells for alignment
                    });
                }

                // Add a visual gap before right-side data
                const gapTd = document.createElement('td');
                gapTd.setAttribute('colspan', headers.length); // Make the gap span full width
                gapTd.classList.add('visual-gap');
                row.appendChild(gapTd);

                // Add right-side data with repeated headers
                if (rightData[i]) {
                    rightData[i].split(',').forEach(cell => {
                        const td = document.createElement('td');
                        td.textContent = cell;
                        row.appendChild(td);
                    });
                } else {
                    headers.forEach(() => {
                        const td = document.createElement('td');
                        row.appendChild(td); // Empty cells for alignment
                    });
                }

                tbody.appendChild(row);
            }
        } else {
            // For 3 or more columns, display as a single full-width table
            data.forEach(row => {
                const dataRow = document.createElement('tr');
                row.split(',').forEach(cell => {
                    const td = document.createElement('td');
                    td.textContent = cell;
                    dataRow.appendChild(td);
                });
                tbody.appendChild(dataRow);
            });
        }
        table.appendChild(tbody);

        // Append the table to the container and make it visible
        tableContainer.appendChild(table);

        // Make the table container visible
        tableContainer.style.display = 'block';

        // Move focus to the container for accessibility
        tableContainer.setAttribute('tabindex', '-1'); // Make container focusable if it's not
        tableContainer.focus(); // Move focus to the table container
    } catch (error) {
        tableContainer.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
        tableContainer.style.display = 'block';
    }
};

document.addEventListener("DOMContentLoaded", () => {
    // Dynamic numbering for tables
    const tables = document.querySelectorAll('table'); // Select all table elements
    tables.forEach((table, index) => {
        const caption = table.querySelector('caption'); // Find the caption within the table
        if (caption) {
            caption.textContent = `Table ${index + 1}: ${caption.textContent}`; // Add dynamic numbering to the caption
        } else {
            // If no caption exists, create one
            const newCaption = document.createElement('caption');
            newCaption.textContent = `Table ${index + 1}`;
            table.insertBefore(newCaption, table.firstChild);
        }
    });

    // Dynamic numbering for examples
    const examples = document.querySelectorAll('.example'); // Select all elements with the "example" class
    examples.forEach((example, index) => {
        const numberSpan = example.querySelector('.example-number'); // Find the span with class "example-number"
        if (numberSpan) {
            numberSpan.textContent = index + 1; // Index starts at 0, so add 1
        }
    });

    // Adjust MathJax for dark mode
    const setMathJaxColorScheme = () => {
        const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.style.setProperty('--mjx-color', isDarkMode ? '#ffffff' : '#000000');
    };
    setMathJaxColorScheme();
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', setMathJaxColorScheme);

    // Trigger MathJax typesetting
    MathJax.typesetPromise();
});

previousLink.classList.add('navigation-link', 'previous');
nextLink.classList.add('navigation-link', 'next');

