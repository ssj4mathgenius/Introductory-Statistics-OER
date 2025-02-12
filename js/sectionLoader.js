async function loadContent(url, sectionContainer) {
    console.log(`Attempting to load section from: ${url}`);

    // Create a temporary loading spinner
    let spinner = document.createElement("div");
    spinner.className = "spinner";
    sectionContainer.appendChild(spinner);

    try {
        let response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
        }

        let text = await response.text();
        let tempDiv = document.createElement("div");
        tempDiv.innerHTML = text;
        let section = tempDiv.querySelector("section");

        if (section) {
            let newSection = document.createElement("section");
            newSection.innerHTML = section.innerHTML;

            // Remove the spinner before adding the new section
            sectionContainer.removeChild(spinner);
            sectionContainer.appendChild(newSection);

            // Add a page break **only if it's not the last section**
            if (url !== sectionPages[sectionPages.length - 1]) {
                let pageBreak = document.createElement("div");
                pageBreak.className = "page-break";
                sectionContainer.appendChild(pageBreak);
            }

            setTimeout(() => {
                newSection.classList.add("loaded");
            }, 50);

            console.log(`✅ Successfully loaded <section> from ${url}`);

            // ✅ Rerun MathJax for new sections
            if (window.MathJax && typeof MathJax.typesetPromise === "function") {
                MathJax.typesetPromise([newSection]).then(() => {
                    console.log(`🔢 MathJax reprocessed for ${url}`);
                }).catch(err => console.error("🚨 MathJax error:", err));
            } else {
                console.warn("⚠️ MathJax is not available.");
            }

            // ✅ Rerun function to set heights for dynamically loaded ".inches" divs
            if (typeof setDivHeightFromData === "function") {
                setDivHeightFromData();
                console.log("🔄 Re-ran setDivHeightFromData() for dynamically loaded sections.");
            } else {
                console.warn("⚠️ setDivHeightFromData() is not available.");
            }

            // ✅ Rerun example numbering
            if (typeof updateExampleNumbers === "function") {
                updateExampleNumbers();
                console.log("🔄 Re-ran updateExampleNumbers() for dynamically loaded sections.");
            }

            // ✅ Ensure print blanking works for newly added content
            if (typeof replaceBlanksForPrint === "function" && typeof restoreOriginalText === "function") {
                replaceBlanksForPrint();
                restoreOriginalText();
                console.log("🔄 Re-ran replaceBlanksForPrint() and restoreOriginalText() for dynamically loaded sections.");
            }

            // ✅ Ensure tables can be toggled in newly loaded content
            if (typeof toggleTable === "function") {
                toggleTable();
                console.log("🔄 Re-ran toggleTable() to ensure dynamic table toggling works.");
            }
            
        } else {
            console.warn(`⚠️ No <section> found in ${url}`);
            sectionContainer.removeChild(spinner); // Remove spinner even if no section
        }
    } catch (error) {
        console.error(`❌ Error loading ${url}:`, error);
        sectionContainer.removeChild(spinner); // Remove spinner if fetch fails
    }
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("📌 DOM fully loaded, starting section loading...");

    // Ensure `sectionPages` exists before running
    if (typeof sectionPages === "undefined" || !Array.isArray(sectionPages)) {
        console.warn("⚠️ No sectionPages array found. Skipping section loading.");
        return;
    }

    const mainContainer = document.getElementById("content"); // A parent div for sections

    sectionPages.forEach((page) => {
        loadContent(page, mainContainer);
    });

    console.log("✅ All section fetch requests have been dispatched.");
});

