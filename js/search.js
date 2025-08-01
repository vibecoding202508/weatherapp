// Search Functionality

const Search = {
    // Initialize search functionality
    initialize: () => {
        if (!DOM.searchBtn || !DOM.locationSearch || !DOM.currentLocationBtn) {
            console.warn('Search elements not found');
            return;
        }

        // Search button click
        DOM.searchBtn.addEventListener('click', Search.performSearch);
        
        // Enter key in search input
        DOM.locationSearch.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                Search.performSearch();
            }
        });
        
        // Current location button click
        DOM.currentLocationBtn.addEventListener('click', Search.useCurrentLocation);
    },

    // Perform location search
    performSearch: () => {
        const searchTerm = DOM.locationSearch.value.trim();
        
        if (!ValidationUtils.isValidLocation(searchTerm)) {
            return;
        }
        
        StateManager.setCurrentLocation(false);
        Search.updateLocationButtons();
        WeatherAPI.getWeatherDataByLocation(searchTerm);
    },

    // Use current location
    useCurrentLocation: () => {
        StateManager.setCurrentLocation(true);
        Search.updateLocationButtons();
        DOM.locationSearch.value = '';
        WeatherAPI.getWeatherData();
    },

    // Update location button states
    updateLocationButtons: () => {
        if (StateManager.getCurrentLocation()) {
            DOMUtils.addClass(DOM.currentLocationBtn, 'active');
        } else {
            DOMUtils.removeClass(DOM.currentLocationBtn, 'active');
        }
    },

    // Clear search input
    clearSearch: () => {
        DOM.locationSearch.value = '';
    },

    // Set search value
    setSearchValue: (value) => {
        DOM.locationSearch.value = value;
    },

    // Get current search value
    getSearchValue: () => {
        return DOM.locationSearch.value.trim();
    },

    // Focus on search input
    focusSearch: () => {
        DOM.locationSearch.focus();
    }
};

// Make Search globally available for browser scripts
if (typeof window !== 'undefined') {
    window.Search = Search;
}

// Export for use in other modules (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Search };
} 