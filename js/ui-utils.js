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