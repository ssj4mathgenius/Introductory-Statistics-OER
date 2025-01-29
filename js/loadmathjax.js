// Function to set color scheme for MathJax
function setMathJaxColorScheme() {
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.style.setProperty('--mjx-color', isDarkMode ? '#ffffff' : '#000000');
}

// Update color scheme dynamically when user switches modes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', setMathJaxColorScheme);

console.log("entered load mathjax javascript file and ensured color schemes are visible for any browser mode");

//Function to dynamically set the height of inches div container
function setDivHeightFromData() {
    // Select all divs with the class "inches"
    const divs = document.querySelectorAll('.inches');

    // Loop through each div and set its height dynamically
    divs.forEach(div => {
        const height = div.getAttribute('data-height'); // Get the height from the data-height attribute
        if (height) {
            div.style.height = height; // Set the height style
        } else {
            console.warn('No data-height attribute found for:', div);
        }
    });
};

console.log("Heights set for .inches class to provide spacing when printed with 'print' button click.");

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

//Interacts with the pages.json page to flatten structure tree for directory to create "next page" and "previous page" buttons
function flattenPages(json, parentPath = '') {
    const pages = [];

    for (const folder in json) {
        if (Array.isArray(json[folder])) {
            json[folder].forEach(page => pages.push(`${parentPath}${folder}/${page}`));
        }
    }

    return pages;
};

fetch('/json/pages.json')
    .then(response => response.json())
    .then(data => {
        // Flatten JSON structure
        const flattenPages = (json) => {
            const pages = [];
            for (const folder in json) {
                if (Array.isArray(json[folder])) {
                    json[folder].forEach(page => pages.push(page));
                }
            }
            return pages;
        };

        const pages = flattenPages(data);

        // Current path (including folders)
        const currentPath = decodeURIComponent(window.location.pathname.replace(/^\//, ''));

        // Determine indices
        const currentIndex = pages.indexOf(currentPath);

        // Navigation buttons
        const prevButton = document.getElementById('prevPage');
        const nextButton = document.getElementById('nextPage');

        if (currentIndex > 0) {
            prevButton.onclick = () => (window.location.href = `/${pages[currentIndex - 1]}`);
            prevButton.disabled = false;
        } else {
            prevButton.disabled = true;
        }

        if (currentIndex >= 0 && currentIndex < pages.length - 1) {
            nextButton.onclick = () => (window.location.href = `/${pages[currentIndex + 1]}`);
            nextButton.disabled = false;
        } else {
            nextButton.disabled = true;
        }
    })
    .catch(err => console.error('Error fetching or parsing JSON:', err));

// Script to handle theme toggling
document.getElementById("theme-toggle").addEventListener("click", function () {
    const nav = document.querySelector("nav");
    const currentTheme = nav.getAttribute("data-bs-theme");

    // Cycle through themes: light -> dark -> auto
    const nextTheme = currentTheme === "light" ? "dark" : currentTheme === "dark" ? "auto" : "light";
    nav.setAttribute("data-bs-theme", nextTheme);

    // Update button appearance based on theme
    const themeIcon = this.querySelector("svg");
    if (nextTheme === "light") {
        themeIcon.innerHTML = '<path d="M8 15A7 7 0 1 0 8 1v14z"/>'; // Half-circle icon for light theme
    } else if (nextTheme === "dark") {
        themeIcon.innerHTML = '<path d="M4.5 0a.5.5 0 0 1 .5.5v15a.5.5 0 0 1-.5.5H4a4 4 0 1 1 0-16h.5z"/>'; // Icon for dark theme
    } else {
        themeIcon.innerHTML = '<path d="M8 4a4 4 0 1 1 0 8A4 4 0 0 1 8 4z"/>'; // Icon for auto theme
    }
});


//Javascript function to operate navbar "search" feature. 
function searchPage(event) {
    event.preventDefault(); // Prevent form submission

    let searchQuery = document.getElementById("searchInput").value.trim();
    if (searchQuery === "") return;

    // Reset previous highlights
    removeHighlights();

    let regex = new RegExp(searchQuery, "gi");
    highlightText(document.body, regex);
}

function highlightText(element, regex) {
    if (element.nodeType === 3) { // If it's a text node
        let text = element.nodeValue;
        if (regex.test(text)) {
            let span = document.createElement("span");
            span.innerHTML = text.replace(regex, match => `<mark class="highlight">${match}</mark>`);
            element.replaceWith(span);
        }
    } else if (element.nodeType === 1 && element.tagName !== "SCRIPT" && element.tagName !== "STYLE") {
        // Process <a> tags differently to avoid breaking them
        if (element.tagName === "A") {
            Array.from(element.childNodes).forEach(child => highlightText(child, regex));
        } else {
            Array.from(element.childNodes).forEach(child => highlightText(child, regex));
        }
    }
}

function removeHighlights() {
    document.querySelectorAll("mark.highlight").forEach(mark => {
        mark.replaceWith(document.createTextNode(mark.textContent)); // Restore original text
    });
}

document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ DOM fully loaded!");

    // Dynamically number examples
    function updateExampleNumbers() {
        const examples = document.querySelectorAll('.example');
        examples.forEach((example, index) => {
            const numberSpan = example.querySelector('.example-number');
            if (numberSpan) {
                numberSpan.textContent = index + 1;
            }
        });
    }
    updateExampleNumbers();

    // Handle Theme Toggle Dropdown
    const themeToggle = document.getElementById("theme-toggle");
    const dropdownItems = document.querySelectorAll(".dropdown-menu .dropdown-item");
    if (themeToggle) {
        const icon = themeToggle.querySelector("svg");

        dropdownItems.forEach(item => {
            item.addEventListener("click", function () {
                let selectedTheme = this.getAttribute("data-theme");
                document.documentElement.setAttribute("data-bs-theme", selectedTheme);
                updateIcon(selectedTheme);
            });
        });

        function updateIcon(theme) {
            if (theme === "light") {
                icon.innerHTML = '<path d="M3.646 6.354a.5.5 0 0 1 0-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L6.5 5.207V9.5a.5.5 0 0 1-1 0V5.207L4.354 6.354a.5.5 0 0 1-.708 0z"/>';
            } else if (theme === "dark") {
                icon.innerHTML = '<path d="M6 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3z"/>';
            } else {
                icon.innerHTML = '<path d="M8 15A7 7 0 1 0 8 1v14z"/>';
            }
        }
    } else {
        console.warn("⚠️ Warning: theme-toggle button not found!");
    }

    //Javascript code to operate the "print notes" button at bottom of page to print notes with blanks/spacing for in-class notes
    const printButton = document.getElementById("printNotes");
    if (printButton) {
        printButton.addEventListener("click", function (event) {
            event.preventDefault();
            console.log("🖨 Print button clicked!");

            // Replace blanked text with underscores
            replaceBlanksForPrint();

            // Show all .inches divs before printing
            const inchesDivs = document.querySelectorAll(".inches");
            inchesDivs.forEach(div => {
                div.classList.add("print-visible");
            });


            console.log("✅ .blanked elements replaced with underscores.");
            console.log("✅ .inches elements are now visible for printing.");

            // Create a new <style> element for print overrides
            let printStyle = document.createElement("style");
            printStyle.id = "printOverrides";
            printStyle.innerHTML = `
            @media print {
                .dontprint {
                    display: none !important;
                }
                .page-break {
                    page-break-before: always !important;
                }
                .blanked {
                    font-family: monospace;
                    letter-spacing: 0.05em;
                    color: black;
                }
            }
        `;

            // Append to the document head
            document.head.appendChild(printStyle);
            console.log("✅ Print media query overrides added.");

            // Trigger print dialog
            setTimeout(() => {
                window.print();
                console.log("🖨 Print dialog triggered.");
            }, 500);

            // Wait for print dialog to close, then restore original text
            setTimeout(() => {
                let existingPrintStyle = document.getElementById("printOverrides");
                if (existingPrintStyle) {
                    existingPrintStyle.remove();
                    console.log("✅ Print media query overrides removed.");
                }

                // Restore .blanked text and hide .inches again
                restoreOriginalText();
                inchesDivs.forEach(div => {
                    div.classList.remove("print-visible");
                });

                console.log("❌ .blanked elements restored to original text.");
                console.log("❌ .inches elements are now hidden again.");
            }, 1000);
        });

        console.log("✅ Print button event listener attached!");
    } else {
        console.warn("⚠️ Warning: printNotes button not found!");
    }

    // Function to replace blanked text with underscores
    function replaceBlanksForPrint() {
        const blankedElements = document.querySelectorAll('.blanked');

        blankedElements.forEach(element => {
            const originalText = element.textContent.trim();
            const underscores = '_'.repeat(originalText.length); // Generate underscores
            element.setAttribute('data-original', originalText); // Store original text
            element.textContent = underscores; // Replace text with underscores
            element.classList.add("print-underscore"); // Apply special formatting
        });
    };

    // Function to restore original text after printing
    function restoreOriginalText() {
        const blankedElements = document.querySelectorAll('.blanked');

        blankedElements.forEach(element => {
            const originalText = element.getAttribute('data-original'); // Retrieve original text
            if (originalText) {
                element.textContent = originalText; // Restore original text
                element.classList.remove("print-underscore"); // Remove special formatting
            }
        });
    };

    // Previous & Next Page Buttons
    const previousLink = document.getElementById('prevPage');
    const nextLink = document.getElementById('nextPage');

    if (previousLink) {
        previousLink.classList.add('navigation-link', 'previous');
    } else {
        console.warn("⚠️ Warning: previousLink (prevPage) not found!");
    }

    if (nextLink) {
        nextLink.classList.add('navigation-link', 'next');
    } else {
        console.warn("⚠️ Warning: nextLink (nextPage) not found!");
    }

    // Set height for spacing divs
    setDivHeightFromData();

    // Dynamically add MathJax script
    var head = document.getElementsByTagName("head")[0];
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js";
    script.async = true;

    script.onload = function () {
        console.log("✅ MathJax script loaded!");

        if (window.MathJax) {
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

            // Apply color scheme for dark mode
            setMathJaxColorScheme();

            setTimeout(() => {
                if (MathJax.startup && MathJax.startup.promise) {
                    MathJax.startup.promise.then(() => {
                        return MathJax.typesetPromise();
                    }).then(() => {
                        console.log("✅ MathJax rendering complete");
                    }).catch((err) => {
                        console.error("🚨 MathJax error during typesetting:", err);
                    });
                } else {
                    console.warn("⚠️ Warning: MathJax.startup.promise is not available. Falling back to direct typesetting.");

                    MathJax.typesetPromise().then(() => {
                        console.log("✅ MathJax fallback rendering complete.");
                    }).catch((err) => {
                        console.error("🚨 MathJax error during fallback typesetting:", err);
                    });
                }
            }, 500);
        } else {
            console.error("🚨 MathJax is not defined!");
        }
    };

    head.appendChild(script);
});

previousLink.classList.add('navigation-link', 'previous');
nextLink.classList.add('navigation-link', 'next');

console.log("JS loaded!");
