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
        const loadingText = DOM.loading && DOM.loading.querySelector('p');
        if (loadingText) {
            loadingText.textContent = message;
        }
        DOMUtils.showFlex(DOM.loading);
        DOMUtils.hide(DOM.error);
        DOMUtils.hide(DOM.weatherContent);
        StateManager.setLoading(true);
        StateManager.setError(false);
    },

    showError: (message) => {
        DOMUtils.setText(DOM.errorMessage, message);
        DOMUtils.hide(DOM.loading);
        DOMUtils.showFlex(DOM.error);
        DOMUtils.hide(DOM.weatherContent);
        StateManager.setLoading(false);
        StateManager.setError(true);
    },

    showWeatherContent: () => {
        DOMUtils.hide(DOM.loading);
        DOMUtils.hide(DOM.error);
        DOMUtils.show(DOM.weatherContent);
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
        return apiKey && apiKey !== 'YOUR_API_KEY_HERE' && apiKey.length > 10;
    },

    isValidLocation: (location) => {
        return location && location.trim().length > 0;
    },

    isValidCoordinates: (lat, lon) => {
        return !isNaN(lat) && !isNaN(lon) && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
    }
};

// Export for use in other modules (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        decodeBase64UTF8,
        UIUtils,
        DateUtils,
        MathUtils,
        StringUtils,
        ValidationUtils
    };
} 