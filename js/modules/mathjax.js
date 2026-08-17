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

// Function to set color scheme for MathJax
function setMathJaxColorScheme() {
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.style.setProperty('--mjx-color', isDarkMode ? '#ffffff' : '#000000');
}

// Update color scheme dynamically when user switches modes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', setMathJaxColorScheme);

console.log("entered load mathjax javascript file and ensured color schemes are visible for any browser mode");

export function init() {
    // Dynamically add MathJax script
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js";
    script.async = true;

    script.onload = function () {
        console.log("✅ MathJax script loaded!");
        console.log("🔢 Running MathJax Typesetting...");

        // Check if MathJax is available before running typesetting
        if (window.MathJax && typeof MathJax.startup !== "undefined" && typeof MathJax.typesetPromise === "function") {
            MathJax.typesetPromise().then(() => {
                console.log("✅ MathJax rendering complete.");
            }).catch((err) => {
                console.error("🚨 MathJax error during typesetting:", err);
            });
        } else {
            console.error("🚨 MathJax is not defined or typesetPromise is unavailable.");
        }
    };

    console.log("📌 Ensuring MathJax is processed...");

    if (window.MathJax && typeof MathJax.typesetPromise === "function") {
        setTimeout(() => {
            MathJax.typesetPromise().then(() => {
                console.log("✅ MathJax successfully reprocessed after refresh.");
            }).catch(err => console.error("🚨 MathJax error after refresh:", err));
        }, 300); // Delay to ensure all content is loaded
    } else {
        console.warn("⚠️ MathJax is not available. Retrying in 500ms...");
        setTimeout(() => {
            if (window.MathJax && typeof MathJax.typesetPromise === "function") {
                MathJax.typesetPromise().then(() => {
                    console.log("✅ MathJax reprocessed successfully after retry.");
                }).catch(err => console.error("🚨 MathJax retry error:", err));
            } else {
                console.error("🚨 MathJax is still not available after retry.");
            }
        }, 500);
    }

    document.head.appendChild(script);
}
