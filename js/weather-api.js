// Weather API Functionality

const WeatherAPI = {
    // Check if API key is valid
    checkAPIKey: () => {
        if (!ValidationUtils.isValidAPIKey(API_KEY)) {
            UIUtils.showError('Please replace YOUR_API_KEY_HERE with your actual WeatherAPI.com API key in js/config.js. Get your free key at https://www.weatherapi.com/signup.aspx');
            return false;
        }
        return true;
    },

    // Get weather data using current location
    getWeatherData: (retryWithLowerAccuracy = false) => {
        if (!WeatherAPI.checkAPIKey()) return;

        UIUtils.showLoading();
        
        if (!navigator.geolocation) {
            UIUtils.showError('Geolocation is not supported by this browser. Please update your browser or try a different one.');
            return;
        }

        // Use different settings for retry
        const geoOptions = retryWithLowerAccuracy ? {
            enableHighAccuracy: false,
            timeout: CONFIG.GEOLOCATION_TIMEOUT * 2,
            maximumAge: CONFIG.GEOLOCATION_MAX_AGE
        } : {
            enableHighAccuracy: true,
            timeout: CONFIG.GEOLOCATION_TIMEOUT,
            maximumAge: CONFIG.GEOLOCATION_MAX_AGE
        };

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                WeatherAPI.fetchWeatherData(latitude, longitude);
            },
            (error) => {
                console.error('Geolocation error:', error);
                let errorMessage = 'Unable to get your location. ';
                let showSearchFallback = true;
                
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage += 'Please allow location access and try again, or search for your city manually.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage += 'Location information is unavailable. Please search for your city manually.';
                        break;
                    case error.TIMEOUT:
                        errorMessage += 'Location request timed out. This can happen on slower connections or if GPS is having trouble. Please try again or search for your city manually.';
                        break;
                    default:
                        errorMessage += 'An unknown error occurred. Please search for your city manually.';
                        break;
                }
                
                UIUtils.showError(errorMessage);
                
                // Show search input as fallback and offer retry option
                if (showSearchFallback) {
                    const searchInput = document.getElementById('locationSearch');
                    if (searchInput) {
                        searchInput.focus();
                        searchInput.placeholder = 'Enter your city name (e.g., London, UK)';
                    }
                    
                    // Offer retry with lower accuracy if this was the first attempt
                    if (!retryWithLowerAccuracy && error.code === error.TIMEOUT) {
                        console.log('Retrying geolocation with lower accuracy settings...');
                        setTimeout(() => {
                            WeatherAPI.getWeatherData(true);
                        }, 2000);
                    }
                }
            },
            geoOptions
        );
    },

    // Get weather data by location name
    getWeatherDataByLocation: async (location) => {
        if (!WeatherAPI.checkAPIKey()) return;

        UIUtils.showLoadingWithMessage(`Searching for weather in ${location}...`);
        
        try {
            // Fetch current weather and 3-day forecast for searched location
            const response = await fetch(
                `${BASE_URL}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(location)}&days=3&aqi=no&alerts=no`
            );

            if (!response.ok) {
                if (response.status === 400) {
                    throw new Error(`Location "${location}" not found. Please try a different city name.`);
                }
                throw new Error(`Weather API Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            StateManager.setWeatherData(data);
            WeatherDisplay.displayWeatherData(data);
            
            // Add to weather history
            if (typeof WeatherHistory !== 'undefined') {
                WeatherHistory.addToHistory(data);
            }
            
        } catch (error) {
            console.error('Error fetching weather data for location:', error);
            UIUtils.showError(error.message || 'Failed to fetch weather data for this location. Please try a different city name.');
        }
    },

    // Fetch weather data using coordinates
    fetchWeatherData: async (latitude, longitude) => {
        try {
            if (!ValidationUtils.isValidCoordinates(latitude, longitude)) {
                throw new Error('Invalid coordinates provided');
            }

            const coords = `${latitude},${longitude}`;
            
            // Fetch current weather and 3-day forecast
            const response = await fetch(
                `${BASE_URL}/forecast.json?key=${API_KEY}&q=${coords}&days=3&aqi=no&alerts=no`
            );

            if (!response.ok) {
                throw new Error(`Weather API Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            StateManager.setWeatherData(data);
            WeatherDisplay.displayWeatherData(data);
            
            // Add to weather history
            if (typeof WeatherHistory !== 'undefined') {
                WeatherHistory.addToHistory(data);
            }
            
        } catch (error) {
            console.error('Error fetching weather data:', error);
            UIUtils.showError('Failed to fetch weather data. Please check your internet connection and try again.');
        }
    },

    // Refresh current weather data
    refreshWeatherData: () => {
        if (!ValidationUtils.isValidAPIKey(API_KEY)) return;

        const currentData = StateManager.getWeatherData();
        
        if (StateManager.getCurrentLocation()) {
            WeatherAPI.getWeatherData();
        } else if (currentData && currentData.location) {
            // Refresh searched location data
            WeatherAPI.getWeatherDataByLocation(`${currentData.location.name}, ${currentData.location.country}`);
        }
    }
};

// Make WeatherAPI globally available for browser scripts
if (typeof window !== 'undefined') {
    window.WeatherAPI = WeatherAPI;
}

// Export for use in other modules (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { WeatherAPI };
} 