function highlightText(element, regex) {
    if (element.nodeType === 3) { // If it's a text node
        let text = element.nodeValue;
        if (regex.test(text)) {
            let span = document.createElement("span");
            span.innerHTML = text.replace(regex, match => `<mark class="highlight">${match}</mark>`);
            element.replaceWith(span);
        }
    } else if (element.nodeType === 1 && element.tagName !== "SCRIPT" && element.tagName !== "STYLE") {
        Array.from(element.childNodes).forEach(child => highlightText(child, regex));
    }
}

function removeHighlights() {
    document.querySelectorAll("mark.highlight").forEach(mark => {
        mark.replaceWith(document.createTextNode(mark.textContent)); // Restore original text
    });
}

function searchPage(event) {
    event.preventDefault(); // Prevent form submission

    let searchQuery = document.getElementById("searchInput").value.trim();
    if (searchQuery === "") return;

    // Reset previous highlights
    removeHighlights();

    let regex = new RegExp(searchQuery, "gi");
    highlightText(document.body, regex);
}

export function init() {
    const searchForm = document.getElementById("searchForm");
    if (!searchForm) {
        console.warn("⚠️ Warning: search form not found!");
        return;
    }

    searchForm.addEventListener("submit", searchPage);
}
