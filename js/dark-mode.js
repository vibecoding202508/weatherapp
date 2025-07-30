// Dark Mode Functionality

const DarkMode = {
    // Initialize dark mode functionality
    initialize: () => {
        if (!DOM.darkModeToggle || !DOM.toggleIcon) {
            console.warn('Dark mode elements not found');
            return;
        }

        // Check for saved dark mode preference
        const isDarkMode = localStorage.getItem('darkMode') === 'true';
        
        if (isDarkMode) {
            DarkMode.enable();
        } else {
            DarkMode.disable();
        }
        
        // Add event listener for toggle
        DOM.darkModeToggle.addEventListener('click', DarkMode.toggle);
    },

    // Enable dark mode
    enable: () => {
        DOMUtils.addClass(document.body, 'dark-mode');
        if (DOM.toggleIcon) {
            DOM.toggleIcon.className = 'fas fa-sun';
        }
        localStorage.setItem('darkMode', 'true');
        
        // Reapply weather background colors for dark mode
        DarkMode.reapplyWeatherBackground();
    },

    // Disable dark mode
    disable: () => {
        DOMUtils.removeClass(document.body, 'dark-mode');
        if (DOM.toggleIcon) {
            DOM.toggleIcon.className = 'fas fa-moon';
        }
        localStorage.setItem('darkMode', 'false');
        
        // Reapply weather background colors for light mode
        DarkMode.reapplyWeatherBackground();
    },

    // Toggle dark mode
    toggle: () => {
        const isCurrentlyDark = DOMUtils.hasClass(document.body, 'dark-mode');
        
        if (isCurrentlyDark) {
            DarkMode.disable();
        } else {
            DarkMode.enable();
        }
    },

    // Check if dark mode is currently active
    isActive: () => {
        return DOMUtils.hasClass(document.body, 'dark-mode');
    },

    // Get current theme preference
    getPreference: () => {
        return localStorage.getItem('darkMode') === 'true' ? 'dark' : 'light';
    },

    // Reapply weather background colors when dark mode changes
    reapplyWeatherBackground: () => {
        // Get current weather data from state
        const weatherData = StateManager.getWeatherData();
        
        if (weatherData && weatherData.current) {
            // Reapply weather background with current condition
            WeatherDisplay.applyWeatherBackground(weatherData.current.condition.text, weatherData.current);
        } else {
            // No weather data available, reset to default background for current mode
            WeatherDisplay.resetToDefaultBackground();
        }
    }
};

// Export for use in other modules (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DarkMode };
} 