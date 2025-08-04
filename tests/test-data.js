// Mock DOMUtils
window.DOMUtils = {
    hide: (element) => {
        if (element && element.style) {
            element.style.display = 'none';
        }
    },
    show: (element) => {
        if (element && element.style) {
            element.style.display = 'block';
        }
    },
    showFlex: (element) => {
        if (element && element.style) {
            element.style.display = 'flex';
        }
    },
    setText: (element, text) => {
        if (element) {
            element.textContent = text;
        }
    },
    setHTML: (element, html) => {
        if (element) {
            element.innerHTML = html;
        }
    }
};