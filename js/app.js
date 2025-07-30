// Main Application Initialization and Coordination

const App = {
    // Initialize the application
    initialize: () => {
        console.log('Weather App initializing...');
        
        // Initialize all modules when DOM is ready
        document.addEventListener('DOMContentLoaded', () => {
            App.initializeModules();
            App.startApp();
        });
    },

    // Initialize all application modules
    initializeModules: () => {
        try {
            // Initialize dark mode first (affects UI)
            DarkMode.initialize();
            
            // Initialize search functionality
            Search.initialize();
            
            // Set current location as active initially
            DOMUtils.addClass(DOM.currentLocationBtn, 'active');
            
            console.log('All modules initialized successfully');
        } catch (error) {
            console.error('Error initializing modules:', error);
            UIUtils.showError('Failed to initialize the application. Please refresh the page.');
        }
    },

    // Start the main application
    startApp: () => {
        try {
            // Check API key and start weather data fetching
            App.checkAPIKeyAndStart();
            
            // Set up automatic refresh
            App.setupAutoRefresh();
            
            console.log('Weather App started successfully');
        } catch (error) {
            console.error('Error starting app:', error);
            UIUtils.showError('Failed to start the application. Please refresh the page.');
        }
    },

    // Check API key and start weather fetching
    checkAPIKeyAndStart: () => {
        if (!ValidationUtils.isValidAPIKey(API_KEY)) {
            UIUtils.showError('Please replace YOUR_API_KEY_HERE with your actual WeatherAPI.com API key in js/config.js. Get your free key at https://www.weatherapi.com/signup.aspx');
            return;
        }
        
        // Start with current location
        WeatherAPI.getWeatherData();
    },

    // Set up automatic refresh interval
    setupAutoRefresh: () => {
        setInterval(() => {
            if (ValidationUtils.isValidAPIKey(API_KEY)) {
                console.log('Auto-refreshing weather data...');
                WeatherAPI.refreshWeatherData();
            }
        }, CONFIG.REFRESH_INTERVAL);
    },

    // Handle app errors
    handleError: (error, context = 'Unknown') => {
        console.error(`App Error [${context}]:`, error);
        
        // Show user-friendly error message
        const errorMessage = error.message || 'An unexpected error occurred';
        UIUtils.showError(`${errorMessage}. Please try again.`);
    },

    // Restart the application
    restart: () => {
        console.log('Restarting Weather App...');
        
        // Reset application state
        StateManager.reset();
        
        // Clear displays
        WeatherDisplay.clearDisplay();
        
        // Restart the app
        App.startApp();
    },

    // Get application status
    getStatus: () => {
        return {
            isLoading: StateManager.isLoading(),
            hasError: StateManager.hasError(),
            isUsingCurrentLocation: StateManager.getCurrentLocation(),
            hasWeatherData: !!StateManager.getWeatherData(),
            apiKeyValid: ValidationUtils.isValidAPIKey(API_KEY),
            darkModeActive: DarkMode.isActive()
        };
    },

    // Debug information
    getDebugInfo: () => {
        const status = App.getStatus();
        const weatherData = StateManager.getWeatherData();
        
        return {
            status,
            weatherData: weatherData ? {
                location: weatherData.location,
                lastUpdated: weatherData.current?.last_updated
            } : null,
            config: {
                apiKey: API_KEY ? 'Set' : 'Not set',
                refreshInterval: CONFIG.REFRESH_INTERVAL,
                maxAlerts: CONFIG.MAX_ALERTS_DISPLAY
            },
            modules: {
                dom: !!DOM,
                darkMode: !!DarkMode,
                search: !!Search,
                weatherAPI: !!WeatherAPI,
                weatherDisplay: !!WeatherDisplay,
                weatherAnimations: !!WeatherAnimations,
                weatherAlerts: !!WeatherAlerts,
                utils: !!UIUtils
            }
        };
    }
};

// Error handling for uncaught errors
window.addEventListener('error', (event) => {
    App.handleError(event.error, 'Window Error');
});

// Error handling for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    App.handleError(event.reason, 'Unhandled Promise Rejection');
});

// Initialize the app
App.initialize();

// Expose App object globally for debugging
window.WeatherApp = App;

// Export for use in other modules (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { App };
} 