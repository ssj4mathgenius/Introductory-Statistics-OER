export function init() {
    const themeToggle = document.getElementById("theme-toggle");
    if (!themeToggle) {
        console.warn("⚠️ Warning: theme-toggle button not found!");
        return;
    }

    themeToggle.addEventListener("click", function () {
        const nav = document.querySelector("nav");
        const currentTheme = nav.getAttribute("data-bs-theme");

        // Cycle through themes: light -> dark
        const nextTheme = currentTheme === "light" ? "dark" : "light";
        nav.setAttribute("data-bs-theme", nextTheme);

        // Update button appearance based on theme
        const themeIcon = this.querySelector("svg");
        if (nextTheme === "light") {
            themeIcon.innerHTML = '<path d="M8 15A7 7 0 1 0 8 1v14z"/>'; // Half-circle icon for light theme
        } else {
            themeIcon.innerHTML = '<path d="M4.5 0a.5.5 0 0 1 .5.5v15a.5.5 0 0 1-.5.5H4a4 4 0 1 1 0-16h.5z"/>'; // Icon for dark theme
        }
    });
}
