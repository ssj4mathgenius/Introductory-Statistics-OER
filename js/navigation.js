//Interacts with the pages.json page to flatten structure tree for directory to create "next page" and "previous page" buttons
function flattenPages(json, parentPath = '') {
    const pages = [];

    for (const folder in json) {
        if (Array.isArray(json[folder])) {
            json[folder].forEach(page => pages.push(`${parentPath}${folder}/${page}`));
        }
    }

    return pages;
}    

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
