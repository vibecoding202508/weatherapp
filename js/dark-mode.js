// Dark Mode Functionality

const DarkMode = {
    // Initialize dark mode functionality
    initialize: () => {
        // Use window.DOM for tests, or global DOM for production
        const domRef = (typeof window !== 'undefined' && window.DOM) ? window.DOM : DOM;
        
        if (!domRef.darkModeToggle || !domRef.toggleIcon) {
            console.warn('Dark mode elements not found', { 
                darkModeToggle: !!domRef.darkModeToggle, 
                toggleIcon: !!domRef.toggleIcon 
            });
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
        domRef.darkModeToggle.addEventListener('click', DarkMode.toggle);
    },

    // Enable dark mode
    enable: () => {
        const domRef = (typeof window !== 'undefined' && window.DOM) ? window.DOM : DOM;
        
        DOMUtils.addClass(document.body, 'dark-mode');
        if (domRef.toggleIcon) {
            domRef.toggleIcon.className = 'fas fa-sun';
        }
        localStorage.setItem('darkMode', 'true');
        
        // Reapply weather background colors for dark mode
        DarkMode.reapplyWeatherBackground();
    },

    // Disable dark mode
    disable: () => {
        const domRef = (typeof window !== 'undefined' && window.DOM) ? window.DOM : DOM;
        
        DOMUtils.removeClass(document.body, 'dark-mode');
        if (domRef.toggleIcon) {
            domRef.toggleIcon.className = 'fas fa-moon';
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