// Initialize UI utilities after DOM and StateManager are loaded
UIUtils = {
    showLoading: () => {
        UIUtils.showLoadingWithMessage('Getting your location and weather data...');
    },

    showLoadingWithMessage: (message) => {
        const loadingText = DOM.loading.querySelector('p');
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

// Make UIUtils globally available for browser scripts
if (typeof window !== 'undefined') {
    window.UIUtils = UIUtils;
}

// Export for use in other modules (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { UIUtils };
}