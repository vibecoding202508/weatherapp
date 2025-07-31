// DOM Element References
const DOM = {
    // Main app elements
    loading: document.getElementById('loading'),
    error: document.getElementById('error'),
    errorMessage: document.getElementById('error-message'),
    weatherContent: document.getElementById('weather-content'),

    // Weather data elements
    location: document.getElementById('location'),
    currentTemp: document.getElementById('current-temp'),
    currentIcon: document.getElementById('current-icon'),
    currentCondition: document.getElementById('current-condition'),
    feelsLike: document.getElementById('feels-like'),
    visibility: document.getElementById('visibility'),
    humidity: document.getElementById('humidity'),
    wind: document.getElementById('wind'),
    uvIndex: document.getElementById('uv-index'),
    uvWarning: document.getElementById('uv-warning'),
    forecastContainer: document.getElementById('forecast-container'),

    // Weather alerts elements
    weatherAlerts: document.getElementById('weather-alerts'),
    alertsContainer: document.getElementById('alerts-container'),

    // Search elements
    locationSearch: document.getElementById('location-search'),
    searchBtn: document.getElementById('search-btn'),
    currentLocationBtn: document.getElementById('current-location-btn'),

    // Dark mode elements
    darkModeToggle: document.getElementById('dark-mode-toggle'),
    toggleIcon: document.getElementById('toggle-icon')
};

// DOM utility functions
const DOMUtils = {
    show: (element) => {
        if (element) element.style.display = 'block';
    },
    
    hide: (element) => {
        if (element) element.style.display = 'none';
    },
    
    showFlex: (element) => {
        if (element) element.style.display = 'flex';
    },
    
    setText: (element, text) => {
        if (element) element.textContent = text;
    },
    
    setHTML: (element, html) => {
        if (element) element.innerHTML = html;
    },
    
    addClass: (element, className) => {
        if (element) element.classList.add(className);
    },
    
    removeClass: (element, className) => {
        if (element) element.classList.remove(className);
    },
    
    toggleClass: (element, className) => {
        if (element) element.classList.toggle(className);
    },
    
    hasClass: (element, className) => {
        return element ? element.classList.contains(className) : false;
    }
};

// Make DOMUtils globally available for browser scripts
if (typeof window !== 'undefined') {
    window.DOMUtils = DOMUtils;
    // Only set window.DOM if it doesn't already exist (for testing)
    if (!window.DOM) {
        window.DOM = DOM;
    }
}

// Export for use in other modules (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DOM, DOMUtils };
} 