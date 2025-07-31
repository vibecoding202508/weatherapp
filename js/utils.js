// Utility Functions

// Utility function for proper UTF-8 base64 decoding
function decodeBase64UTF8(base64String) {
    try {
        // Decode base64 to binary string
        const binaryString = atob(base64String);
        
        // Convert binary string to UTF-8
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        
        // Decode UTF-8 bytes to string
        const decoder = new TextDecoder('utf-8');
        return decoder.decode(bytes);
    } catch (error) {
        console.error('UTF-8 base64 decode error:', error);
        // Fallback to regular atob
        return atob(base64String);
    }
}

// UI utility functions
const UIUtils = {
    showLoading: () => {
        UIUtils.showLoadingWithMessage('Getting your location and weather data...');
    },

    showLoadingWithMessage: (message) => {
        // Use window.DOM if available (for testing), otherwise use the global DOM
        const domRef = (typeof window !== 'undefined' && window.DOM) ? window.DOM : DOM;
        
        if (domRef.loading && domRef.loading.querySelector) {
            const loadingText = domRef.loading.querySelector('p');
            if (loadingText) {
                loadingText.textContent = message;
            }
        }
        DOMUtils.showFlex(domRef.loading);
        DOMUtils.hide(domRef.error);
        DOMUtils.hide(domRef.weatherContent);
        StateManager.setLoading(true);
        StateManager.setError(false);
    },

    showError: (message) => {
        // Use window.DOM if available (for testing), otherwise use the global DOM
        const domRef = (typeof window !== 'undefined' && window.DOM) ? window.DOM : DOM;
        
        DOMUtils.setText(domRef.errorMessage, message);
        DOMUtils.hide(domRef.loading);
        DOMUtils.showFlex(domRef.error);
        DOMUtils.hide(domRef.weatherContent);
        StateManager.setLoading(false);
        StateManager.setError(true);
    },

    showWeatherContent: () => {
        // Use window.DOM if available (for testing), otherwise use the global DOM
        const domRef = (typeof window !== 'undefined' && window.DOM) ? window.DOM : DOM;
        
        DOMUtils.hide(domRef.loading);
        DOMUtils.hide(domRef.error);
        DOMUtils.show(domRef.weatherContent);
        StateManager.setLoading(false);
        StateManager.setError(false);
    }
};

// Date and time utility functions
const DateUtils = {
    formatDate: (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    },

    getDayName: (dateString, index) => {
        if (index === 0) return 'Today';
        if (index === 1) return 'Tomorrow';
        
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { weekday: 'long' });
    },

    formatDateTime: (dateString) => {
        return dateString ? new Date(dateString).toLocaleString() : '';
    }
};

// Math utility functions
const MathUtils = {
    roundTemp: (temp) => Math.round(temp),
    
    getRandomInRange: (min, max) => Math.random() * (max - min) + min,
    
    getRandomPercentage: () => `${Math.random() * 100}%`
};

// String utility functions
const StringUtils = {
    capitalizeFirstLetter: (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },

    truncateText: (text, maxLength) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }
};

// Validation utility functions
const ValidationUtils = {
    isValidAPIKey: (apiKey) => {
        // More explicit validation to ensure proper boolean return
        if (!apiKey || typeof apiKey !== 'string') {
            return false;
        }
        if (apiKey === 'YOUR_API_KEY_HERE') {
            return false;
        }
        if (apiKey.length <= 10) {
            return false;
        }
        return true;
    },

    isValidLocation: (location) => {
        return !!(location && location.trim().length > 0);
    },

    isValidCoordinates: (latitude, longitude) => {
        // Validate latitude: -90 to 90
        if (typeof latitude !== 'number' || latitude < -90 || latitude > 90) {
            return false;
        }
        // Validate longitude: -180 to 180
        if (typeof longitude !== 'number' || longitude < -180 || longitude > 180) {
            return false;
        }
        return true;
    }
};

// Visibility analysis utility functions
const VisibilityUtils = {
    // Analyze visibility conditions and return detailed information
    analyzeVisibility: (visibilityKm, weatherCondition) => {
        const visibility = parseFloat(visibilityKm);
        const condition = weatherCondition.toLowerCase();
        
        let category, description, warning, activities, drivingAdvice, icon, cssClass;
        
        // Categorize visibility based on distance
        if (visibility >= 20) {
            category = 'Excellent';
            description = 'Crystal clear visibility with no restrictions';
            warning = null;
            activities = ['Perfect for all outdoor activities', 'Ideal for photography and sightseeing', 'Excellent flying weather'];
            drivingAdvice = 'Perfect driving conditions with unlimited visibility';
            icon = 'fas fa-eye';
            cssClass = 'visibility-excellent';
        } else if (visibility >= 10) {
            category = 'Very Good';
            description = 'Very clear visibility with minimal restrictions';
            warning = null;
            activities = ['Great for all outdoor activities', 'Good for photography', 'Suitable for flying'];
            drivingAdvice = 'Excellent driving conditions';
            icon = 'fas fa-eye';
            cssClass = 'visibility-very-good';
        } else if (visibility >= 5) {
            category = 'Good';
            description = 'Good visibility with slight haze possible';
            warning = null;
            activities = ['Suitable for most outdoor activities', 'Good for hiking and sports'];
            drivingAdvice = 'Good driving conditions, no restrictions';
            icon = 'fas fa-eye';
            cssClass = 'visibility-good';
        } else if (visibility >= 2) {
            category = 'Moderate';
            description = 'Moderate visibility with some atmospheric haze';
            warning = 'Slightly reduced visibility';
            activities = ['Most outdoor activities still possible', 'Use caution for precise activities'];
            drivingAdvice = 'Drive normally but be aware of reduced distance visibility';
            icon = 'fas fa-eye-slash';
            cssClass = 'visibility-moderate';
        } else if (visibility >= 1) {
            category = 'Poor';
            description = 'Poor visibility due to weather conditions';
            warning = 'Significantly reduced visibility affects safety';
            activities = ['Limit outdoor activities', 'Avoid precision sports', 'Stay close to known areas'];
            drivingAdvice = 'Drive with caution, use headlights, reduce speed';
            icon = 'fas fa-exclamation-triangle';
            cssClass = 'visibility-poor';
        } else if (visibility >= 0.2) {
            category = 'Very Poor';
            description = 'Very poor visibility creating hazardous conditions';
            warning = 'Dangerous visibility conditions';
            activities = ['Avoid all non-essential outdoor activities', 'Stay indoors if possible'];
            drivingAdvice = 'Extreme caution required, use fog lights, consider avoiding travel';
            icon = 'fas fa-exclamation-triangle';
            cssClass = 'visibility-very-poor';
        } else {
            category = 'Extremely Poor';
            description = 'Extremely poor visibility creating very dangerous conditions';
            warning = 'Extremely dangerous visibility conditions';
            activities = ['Avoid all outdoor activities', 'Stay indoors'];
            drivingAdvice = 'Avoid driving if possible, use extreme caution if travel is necessary';
            icon = 'fas fa-ban';
            cssClass = 'visibility-extreme';
        }
        
        // Add weather-specific context
        const weatherContext = VisibilityUtils.getWeatherContext(condition, visibility);
        
        return {
            value: visibility,
            unit: 'km',
            category,
            description,
            warning,
            activities,
            drivingAdvice,
            weatherContext,
            icon,
            cssClass
        };
    },
    
    // Get weather-specific visibility context
    getWeatherContext: (condition, visibility) => {
        if (condition.includes('fog') || condition.includes('mist')) {
            if (visibility < 1) {
                return 'Dense fog is significantly reducing visibility. Fog lights recommended.';
            } else if (visibility < 2) {
                return 'Moderate fog is affecting visibility. Drive with caution.';
            } else {
                return 'Light fog or mist may be present. Minor visibility reduction.';
            }
        } else if (condition.includes('rain') || condition.includes('drizzle')) {
            if (visibility < 2) {
                return 'Heavy rain is reducing visibility. Use windshield wipers and drive slowly.';
            } else if (visibility < 5) {
                return 'rain is affecting visibility. Use wipers and maintain safe distance.';
            } else {
                return 'Light rain with minimal impact on visibility.';
            }
        } else if (condition.includes('snow') || condition.includes('blizzard')) {
            if (visibility < 1) {
                return 'Heavy snow or blizzard conditions creating dangerous visibility.';
            } else if (visibility < 3) {
                return 'Moderate to heavy snow reducing visibility significantly.';
            } else {
                return 'Light snow with some visibility reduction.';
            }
        } else if (condition.includes('dust') || condition.includes('sand')) {
            return 'Dust or sand particles in the air are reducing visibility.';
        } else if (condition.includes('haze')) {
            return 'Atmospheric haze is creating slightly reduced visibility conditions.';
        } else if (condition.includes('clear') || condition.includes('sunny')) {
            return 'Clear weather conditions providing optimal visibility.';
        } else if (condition.includes('cloud')) {
            return 'Cloudy conditions with good visibility maintained.';
        }
        
        return null;
    },
    
    // Format visibility for display
    formatVisibility: (visibilityKm) => {
        const visibility = parseFloat(visibilityKm);
        if (visibility >= 10) {
            return `${Math.round(visibility)} km`;
        } else if (visibility >= 1) {
            return `${visibility.toFixed(1)} km`;
        } else {
            return `${Math.round(visibility * 1000)} m`;
        }
    }
};

// Make utility functions globally available for browser scripts
if (typeof window !== 'undefined') {
    window.UIUtils = UIUtils;
    window.DateUtils = DateUtils;
    window.MathUtils = MathUtils;
    window.StringUtils = StringUtils;
    window.ValidationUtils = ValidationUtils;
    window.VisibilityUtils = VisibilityUtils;
    window.decodeBase64UTF8 = decodeBase64UTF8;
}

// Export for use in other modules (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        decodeBase64UTF8,
        UIUtils,
        DateUtils,
        MathUtils,
        StringUtils,
        ValidationUtils,
        VisibilityUtils
    };
} 