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

function copyCodeToClipboard(elementId, message = "Code copied to clipboard ready to be pasted into MyOpenMath!") {
    var copyText = document.getElementById(elementId);
    if (copyText) {
        // Get the text content and split it into lines
        var lines = copyText.value.split("\n");

        // Trim whitespace from each line and remove empty lines
        var trimmedText = lines.map(line => line.trim()).filter(line => line !== "").join("\n");

        // Temporarily set the cleaned text into the textarea for copying
        copyText.value = trimmedText;
        copyText.select();
        document.execCommand("copy");

        // Restore the original value (in case it's needed later)
        copyText.value = copyText.defaultValue;
        
        alert(message);
    } else {
        alert("Error: Element not found!");
    }
};

//Toggles Display of Larger Tables of Data based on id
//<button onclick="toggleTable()">Toggle Table Visibility</button>
function toggleTable() {
    const tableDiv = document.getElementById('wrappedTable');

    if (!tableDiv) {
        // Only log this warning ONCE per page load to avoid spam in console
        if (!window.toggleTableWarningLogged) {
            console.warn("⚠️ Warning: No element with ID 'wrappedTable' found. Skipping toggleTable().");
            window.toggleTableWarningLogged = true; // Prevents repeating this warning
        }
        return;
    }
 
    if (tableDiv.classList.contains('hidden')) {
        tableDiv.classList.remove('hidden'); // Show the table
    } else {
        tableDiv.classList.add('hidden'); // Hide the table
    }
}

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

document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ DOM fully loaded!");

    // Get navigation buttons
    const prevButton = document.getElementById('prevPage');
    const nextButton = document.getElementById('nextPage');

    if (prevButton) {
        prevButton.classList.add('navigation-link', 'previous');
        prevButton.setAttribute("role", "button");
        prevButton.setAttribute("tabindex", "0");
    } else {
        console.warn("⚠️ Warning: prevButton (prevPage) not found!");
    }

    if (nextButton) {
        nextButton.classList.add('navigation-link', 'next');
        nextButton.setAttribute("role", "button");
        nextButton.setAttribute("tabindex", "0");
    } else {
        console.warn("⚠️ Warning: nextButton (nextPage) not found!");
    }

    // Dynamically determine the base URL
    const isGitHubPages = window.location.hostname.includes("github.io");
    const repoName = "Introductory-Statistics-OER"; // Change this if your repo name is different

    const baseURL = isGitHubPages
        ? `${window.location.origin}/${repoName}`
        : window.location.origin;

    console.log("🌎 Base URL Detected:", baseURL);
    console.log("📄 Fetching JSON from:", `${baseURL}/json/pages.json`);

    fetch(`${baseURL}/json/pages.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("✅ Successfully loaded pages.json", data);

            function flattenPages(json) {
                const pages = [];
                for (const folder in json) {
                    if (Array.isArray(json[folder])) {
                        json[folder].forEach(page => {
                            const fullPath = `${page}`; // Ensure correct full path
                            pages.push(fullPath);
                        });
                    }
                }
                return pages;
            }

            const pages = flattenPages(data);
            console.log("📂 Flattened Pages Array:", pages);

            // Get current page path (removing leading slash & ensuring format matches JSON)
            let currentPath = decodeURIComponent(window.location.pathname.replace(/^\//, ''));

            // Handle GitHub Pages special cases
            if (isGitHubPages) {
                // Convert root URL to "index.html"
                if (currentPath === "" || currentPath === repoName || currentPath === `${repoName}/`) {
                    currentPath = "index.html";
                } else {
                    // Remove repository name prefix for subpages
                    currentPath = currentPath.replace(`${repoName}/`, '');
                }
            }

            // Normalize spaces and special characters
            currentPath = currentPath.replace(/%20/g, " "); // Convert "%20" to spaces

            console.log("📄 Current Path (Fixed):", currentPath);

            // Normalize paths (Fixes VS Code "Go Live" Issues)
            currentPath = currentPath.replace(/\/$/, ""); // Remove trailing slash
            pages.forEach((page, i) => pages[i] = page.replace(/\/$/, "")); // Normalize all paths

            // Determine current index
            const currentIndex = pages.indexOf(currentPath);
            console.log("🔢 Current Index:", currentIndex);

            // Ensure buttons exist before modifying
            if (prevButton) {
                if (currentIndex > 0) {
                    prevButton.onclick = () => {
                        let prevPage = pages[currentIndex - 1];

                        // Ensure correct formatting for GitHub Pages
                        if (isGitHubPages) {
                            prevPage = `/${repoName}/${prevPage}`;
                        } else {
                            prevPage = `/${prevPage}`;
                        }

                        console.log("⬅️ Navigating to:", prevPage);
                        window.location.href = prevPage;
                    };
                    prevButton.disabled = false;
                } else {
                    console.log("🚫 prevButton disabled - No previous page.");
                    prevButton.disabled = true;
                }
            }

            if (nextButton) {
                if (currentIndex >= 0 && currentIndex < pages.length - 1) {
                    nextButton.onclick = () => {
                        let nextPage = pages[currentIndex + 1];

                        // Ensure correct formatting for GitHub Pages
                        if (isGitHubPages) {
                            nextPage = `/${repoName}/${nextPage}`;
                        } else {
                            nextPage = `/${nextPage}`;
                        }

                        console.log("➡️ Navigating to:", nextPage);
                        window.location.href = nextPage;
                    };
                    nextButton.disabled = false;
                } else {
                    console.log("🚫 nextButton disabled - No next page.");
                    nextButton.disabled = true;
                }
            }
        })
        .catch(err => console.error('🚨 Error fetching or parsing JSON:', err));


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

    // Find all example numbers that have an ID and sync them
    const examples = document.querySelectorAll(".example-number[id]");

    examples.forEach(example => {
        const exampleId = example.id; // Get the ID assigned to the example
        const referenceLinks = document.querySelectorAll(`a[href="#${exampleId}"]`); // Find all links referencing this example

        referenceLinks.forEach(link => {
            link.textContent = "Example " + example.textContent; // Update link text with the corresponding example number
        });
    });

    document.querySelectorAll("a[target='_blank']").forEach(link => {
        link.setAttribute("rel", "noopener noreferrer");
    });

});

//Make Bootstrap tooltips appear instantly
$(document).ready(function () {
    $('[data-bs-toggle="tooltip"]').tooltip({
        delay: { show: 0, hide: 100 }, /* Instant show */
        html: true /* Enables HTML inside tooltip */
    });
});

console.log("Full JS loaded!");
