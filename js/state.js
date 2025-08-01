// Application State Management
const AppState = {
    isUsingCurrentLocation: true,
    currentWeatherData: null,
    isLoading: false,
    hasError: false,
    currentLocation: null
};

// State management functions
const StateManager = {
    setCurrentLocation: (isUsing) => {
        AppState.isUsingCurrentLocation = isUsing;
    },
    
    getCurrentLocation: () => {
        return AppState.isUsingCurrentLocation;
    },
    
    setWeatherData: (data) => {
        AppState.currentWeatherData = data;
    },
    
    getWeatherData: () => {
        return AppState.currentWeatherData;
    },
    
    setLoading: (isLoading) => {
        AppState.isLoading = isLoading;
    },
    
    isLoading: () => {
        return AppState.isLoading;
    },
    
    setError: (hasError) => {
        AppState.hasError = hasError;
    },
    
    hasError: () => {
        return AppState.hasError;
    },
    
    setCurrentLocationData: (location) => {
        AppState.currentLocation = location;
    },
    
    getCurrentLocationData: () => {
        return AppState.currentLocation;
    },
    
    reset: () => {
        AppState.isUsingCurrentLocation = true;
        AppState.currentWeatherData = null;
        AppState.isLoading = false;
        AppState.hasError = false;
        AppState.currentLocation = null;
    }
};

// Make StateManager and AppState globally available for browser scripts
if (typeof window !== 'undefined') {
    window.AppState = AppState;
    window.StateManager = StateManager;
}

// Export for use in other modules (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AppState, StateManager };
} 