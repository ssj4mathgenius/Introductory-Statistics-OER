// Function to replace blanked text with underscores
function replaceBlanksForPrint() {
    const blankedElements = document.querySelectorAll('.blanked');

    blankedElements.forEach(element => {
        const originalText = element.textContent.trim();
        const maxUnderscoreLength = Math.min(originalText.length, 10); // Limit underscores to 10 characters
        const underscores = '__'.repeat(maxUnderscoreLength); // Generate limited underscores

        element.setAttribute('data-original', originalText); // Store original text
        element.textContent = underscores; // Replace text with underscores
        element.classList.add("print-underscore"); // Apply special formatting

        // Ensure the blank does not wrap within its container
        element.style.whiteSpace = "nowrap";

        // Move to a new line if it's too long (based on container width)
        const parentWidth = element.parentElement.clientWidth;
        if (element.clientWidth > parentWidth * 0.4) {
            element.style.display = "block"; // Move to a new line
        }
    });
}

// Function to restore original text after printing
function restoreOriginalText() {
    const blankedElements = document.querySelectorAll('.blanked');

    blankedElements.forEach(element => {
        const originalText = element.getAttribute('data-original'); // Retrieve original text
        if (originalText) {
            element.textContent = originalText; // Restore original text
            element.classList.remove("print-underscore"); // Remove special formatting
            element.style.whiteSpace = ""; // Reset white-space
            element.style.display = ""; // Reset display style
        }
    });
}

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
}

export function init() {
    setDivHeightFromData();

    const printButton = document.getElementById("printNotes");
    if (!printButton) {
        console.warn("⚠️ Warning: printNotes button not found!");
        return;
    }

    printButton.addEventListener("click", function (event) {
        event.preventDefault();
        console.log("🖨 Print button clicked!");

        // Replace blanked text with underscores
        replaceBlanksForPrint();

        // Add 'notes-visible' class to <body> to enable .notes-page-break
        document.body.classList.add("notes-visible");

        console.log("✅ .notes-page-break are now visible for printing notes.");

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

            // Hide .notes-page-break again after printing
            document.body.classList.remove("notes-visible");

            // Restore .blanked text and hide .inches again
            restoreOriginalText();
            inchesDivs.forEach(div => {
                div.classList.remove("print-visible");
            });

            console.log("❌ .notes-page-break elements hidden again.");
            console.log("❌ .blanked elements restored to original text.");
            console.log("❌ .inches elements are now hidden again.");
        }, 1000);
    });

    console.log("✅ Print button event listener attached!");
}
