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
    getWeatherData: () => {
        if (!WeatherAPI.checkAPIKey()) return;

        UIUtils.showLoading();
        
        if (!navigator.geolocation) {
            UIUtils.showError('Geolocation is not supported by this browser. Please update your browser or try a different one.');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                WeatherAPI.fetchWeatherData(latitude, longitude);
            },
            (error) => {
                console.error('Geolocation error:', error);
                let errorMessage = 'Unable to get your location. ';
                
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage += 'Please allow location access and try again.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage += 'Location information is unavailable.';
                        break;
                    case error.TIMEOUT:
                        errorMessage += 'Location request timed out.';
                        break;
                    default:
                        errorMessage += 'An unknown error occurred.';
                        break;
                }
                
                UIUtils.showError(errorMessage);
            },
            {
                enableHighAccuracy: true,
                timeout: CONFIG.GEOLOCATION_TIMEOUT,
                maximumAge: CONFIG.GEOLOCATION_MAX_AGE
            }
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