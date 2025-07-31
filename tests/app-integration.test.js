// App Integration Tests

describe('App Integration', () => {
    let mockElements, mockGeolocation, mockLocalStorage;

    beforeEach(() => {
        mockElements = TestUtils.setupDOMMocks();
        mockGeolocation = TestUtils.setupGeolocationMocks();
        mockLocalStorage = TestUtils.setupLocalStorageMocks();
        StateManager.reset();
        TestUtils.resetMocks();
    });

    afterEach(() => {
        TestUtils.resetMocks();
    });

    describe('App initialization', () => {
        it('should initialize all modules in correct order', () => {
            const originalDarkModeInit = DarkMode.initialize;
            const originalSearchInit = Search.initialize;
            DarkMode.initialize = TestRunner.fn();
            Search.initialize = TestRunner.fn();
            
            App.initializeModules();
            
            expect(DarkMode.initialize).toHaveBeenCalled();
            expect(Search.initialize).toHaveBeenCalled();
            expect(mockElements.currentLocationBtn.classList.contains('active')).toBe(true);
            
            DarkMode.initialize = originalDarkModeInit;
            Search.initialize = originalSearchInit;
        });

        it('should handle module initialization errors gracefully', () => {
            const originalDarkModeInit = DarkMode.initialize;
            const originalSearchInit = Search.initialize;
            
            try {
                // Mock DarkMode to throw error
                DarkMode.initialize = TestRunner.fn().mockImplementation(() => {
                    throw new Error('Initialization failed');
                });
                
                // Mock Search to prevent side effects
                Search.initialize = TestRunner.fn();
                
                // Test that initializeModules handles the error gracefully
                expect(() => {
                    App.initializeModules();
                }).not.toThrow();
                
                // Verify error UI is shown
                expect(mockElements.error.style.display).toBe('flex');
            } finally {
                // Ensure cleanup happens even if test fails
                DarkMode.initialize = originalDarkModeInit;
                Search.initialize = originalSearchInit;
            }
        });

        it('should start app with API key validation', () => {
            const originalAPIKey = window.API_KEY;
            window.API_KEY = 'valid-api-key-123456';
            
            const originalGetWeatherData = WeatherAPI.getWeatherData;
            const originalSetupAutoRefresh = App.setupAutoRefresh;
            WeatherAPI.getWeatherData = TestRunner.fn();
            App.setupAutoRefresh = TestRunner.fn();
            
            App.startApp();
            
            expect(WeatherAPI.getWeatherData).toHaveBeenCalled();
            expect(App.setupAutoRefresh).toHaveBeenCalled();
            
            WeatherAPI.getWeatherData = originalGetWeatherData;
            App.setupAutoRefresh = originalSetupAutoRefresh;
            window.API_KEY = originalAPIKey;
        });

        it('should show error for invalid API key', () => {
            const originalAPIKey = window.API_KEY;
            window.API_KEY = 'YOUR_API_KEY_HERE';
            
            App.checkAPIKeyAndStart();
            
            expect(mockElements.error.style.display).toBe('flex');
            expect(mockElements.errorMessage.textContent).toContain('replace YOUR_API_KEY_HERE');
            
            window.API_KEY = originalAPIKey;
        });
    });

    describe('Auto refresh functionality', () => {
        it('should setup auto refresh interval', () => {
            const originalSetInterval = global.setInterval;
            global.setInterval = TestRunner.fn();
            
            App.setupAutoRefresh();
            
            expect(global.setInterval).toHaveBeenCalledWith(expect.any(Function), CONFIG.REFRESH_INTERVAL);
            
            global.setInterval = originalSetInterval;
        });

        it('should refresh weather data in interval', () => {
            const originalAPIKey = window.API_KEY;
            window.API_KEY = 'valid-api-key-123456';
            
            const originalRefreshWeatherData = WeatherAPI.refreshWeatherData;
            WeatherAPI.refreshWeatherData = TestRunner.fn();
            
            let intervalCallback;
            const originalSetInterval = global.setInterval;
            global.setInterval = TestRunner.fn().mockImplementation((callback) => {
                intervalCallback = callback;
            });
            
            App.setupAutoRefresh();
            
            // Execute the interval callback
            intervalCallback();
            
            expect(WeatherAPI.refreshWeatherData).toHaveBeenCalled();
            
            WeatherAPI.refreshWeatherData = originalRefreshWeatherData;
            global.setInterval = originalSetInterval;
            window.API_KEY = originalAPIKey;
        });

        it('should not refresh with invalid API key', () => {
            const originalAPIKey = window.API_KEY;
            window.API_KEY = 'invalid';
            
            const originalRefreshWeatherData = WeatherAPI.refreshWeatherData;
            WeatherAPI.refreshWeatherData = TestRunner.fn();
            
            let intervalCallback;
            const originalSetInterval = global.setInterval;
            global.setInterval = TestRunner.fn().mockImplementation((callback) => {
                intervalCallback = callback;
            });
            
            App.setupAutoRefresh();
            intervalCallback();
            
            expect(WeatherAPI.refreshWeatherData).not.toHaveBeenCalled();
            
            WeatherAPI.refreshWeatherData = originalRefreshWeatherData;
            global.setInterval = originalSetInterval;
            window.API_KEY = originalAPIKey;
        });
    });

    describe('Error handling', () => {
        it('should handle app errors gracefully', () => {
            const error = new Error('Test error');
            
            App.handleError(error, 'Test Context');
            
            expect(mockElements.error.style.display).toBe('flex');
            expect(mockElements.errorMessage.textContent).toContain('Test error');
        });

        it('should handle errors without message', () => {
            const error = {}; // Error without message
            
            App.handleError(error, 'Test Context');
            
            expect(mockElements.errorMessage.textContent).toContain('An unexpected error occurred');
        });

        it('should handle global window errors', async () => {
            const originalHandleError = App.handleError;
            App.handleError = TestRunner.fn();
            
            try {
                const errorEvent = { error: new Error('Global error') };
                window.dispatchEvent(new CustomEvent('error', errorEvent));
                
                // Allow event handler to execute
                await new Promise(resolve => setTimeout(resolve, 10));
                
                expect(App.handleError).toHaveBeenCalledWith(errorEvent.error, 'Window Error');
            } finally {
                // Ensure cleanup happens even if test fails
                App.handleError = originalHandleError;
            }
        });
    });

    describe('App restart functionality', () => {
        it('should restart app correctly', () => {
            const originalClearDisplay = WeatherDisplay.clearDisplay;
            const originalStartApp = App.startApp;
            WeatherDisplay.clearDisplay = TestRunner.fn();
            App.startApp = TestRunner.fn();
            
            // Set some initial state
            StateManager.setWeatherData(TestData.mockWeatherData);
            StateManager.setError(true);
            
            App.restart();
            
            expect(WeatherDisplay.clearDisplay).toHaveBeenCalled();
            expect(App.startApp).toHaveBeenCalled();
            expect(StateManager.getWeatherData()).toBe(null);
            expect(StateManager.hasError()).toBe(false);
            
            WeatherDisplay.clearDisplay = originalClearDisplay;
            App.startApp = originalStartApp;
        });
    });

    describe('App status and debug info', () => {
        it('should return current app status', () => {
            const originalAPIKey = window.API_KEY;
            window.API_KEY = 'valid-api-key-123456';
            
            StateManager.setLoading(true);
            StateManager.setWeatherData(TestData.mockWeatherData);
            
            const status = App.getStatus();
            
            expect(status.isLoading).toBe(true);
            expect(status.hasError).toBe(false);
            expect(status.isUsingCurrentLocation).toBe(true);
            expect(status.hasWeatherData).toBe(true);
            expect(status.apiKeyValid).toBe(true);
            
            window.API_KEY = originalAPIKey;
        });

        it('should return debug information', () => {
            const originalAPIKey = window.API_KEY;
            window.API_KEY = 'valid-api-key-123456';
            
            StateManager.setWeatherData(TestData.mockWeatherData);
            
            const debugInfo = App.getDebugInfo();
            
            expect(debugInfo.status).toBeTruthy();
            expect(debugInfo.weatherData).toBeTruthy();
            expect(debugInfo.weatherData.location).toEqual(TestData.mockWeatherData.location);
            expect(debugInfo.config.apiKey).toBe('Set');
            expect(debugInfo.modules.dom).toBe(true);
            expect(debugInfo.modules.darkMode).toBe(true);
            
            window.API_KEY = originalAPIKey;
        });

        it('should handle missing API key in debug info', () => {
            const originalAPIKey = window.API_KEY;
            window.API_KEY = null;
            
            const debugInfo = App.getDebugInfo();
            
            expect(debugInfo.config.apiKey).toBe('Not set');
            
            window.API_KEY = originalAPIKey;
        });
    });
});

// End-to-end integration tests
describe('Full App Flow Integration', () => {
    let mockElements, mockGeolocation, mockLocalStorage;

    beforeEach(() => {
        mockElements = TestUtils.setupDOMMocks();
        mockGeolocation = TestUtils.setupGeolocationMocks();
        mockLocalStorage = TestUtils.setupLocalStorageMocks();
        StateManager.reset();
        TestUtils.resetMocks();
    });

    afterEach(() => {
        TestUtils.resetMocks();
    });

    it('should complete successful weather app flow', async () => {
        const originalAPIKey = window.API_KEY;
        window.API_KEY = 'valid-api-key-123456';
        
        // Mock successful geolocation
        mockGeolocation.getCurrentPosition.mockImplementation((success) => {
            success(TestData.mockPosition);
        });
        
        // Mock successful API response
        const mockFetch = MockAPI.mockFetchSuccess(TestData.mockWeatherData);
        
        // Mock all display functions
        const originalDisplayWeatherData = WeatherDisplay.displayWeatherData;
        const originalApplyWeatherAnimation = WeatherAnimations.applyWeatherAnimation;
        const originalFetchMeteoAlarmAlerts = WeatherAlerts.fetchMeteoAlarmAlerts;
        WeatherDisplay.displayWeatherData = TestRunner.fn();
        WeatherAnimations.applyWeatherAnimation = TestRunner.fn();
        WeatherAlerts.fetchMeteoAlarmAlerts = TestRunner.fn();
        
        // Initialize and start app
        App.initializeModules();
        App.startApp();
        
        // Allow async operations to complete
        await TestUtils.wait(50);
        
        expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled();
        expect(mockFetch).toHaveBeenCalled();
        expect(StateManager.getWeatherData()).toEqual(TestData.mockWeatherData);
        
        // Restore
        WeatherDisplay.displayWeatherData = originalDisplayWeatherData;
        WeatherAnimations.applyWeatherAnimation = originalApplyWeatherAnimation;
        WeatherAlerts.fetchMeteoAlarmAlerts = originalFetchMeteoAlarmAlerts;
        window.API_KEY = originalAPIKey;
    });

    it('should handle user search flow', async () => {
        const originalAPIKey = window.API_KEY;
        window.API_KEY = 'valid-api-key-123456';
        
        // Mock successful API response for search
        const mockFetch = MockAPI.mockFetchSuccess(TestData.mockWeatherData);
        
        const originalDisplayWeatherData = WeatherDisplay.displayWeatherData;
        WeatherDisplay.displayWeatherData = TestRunner.fn();
        
        // Initialize modules
        Search.initialize();
        
        // Simulate user search
        mockElements.locationSearch.value = 'London';
        Search.performSearch();
        
        // Allow async operations to complete
        await TestUtils.wait(50);
        
        expect(StateManager.getCurrentLocation()).toBe(false);
        expect(mockFetch).toHaveBeenCalled();
        
        WeatherDisplay.displayWeatherData = originalDisplayWeatherData;
        window.API_KEY = originalAPIKey;
    });

    it('should handle dark mode toggle with weather display', () => {
        const originalAPIKey = window.API_KEY;
        window.API_KEY = 'valid-api-key-123456';
        
        // Set initial weather data
        StateManager.setWeatherData(TestData.mockWeatherData);
        
        const originalApplyWeatherBackground = WeatherDisplay.applyWeatherBackground;
        WeatherDisplay.applyWeatherBackground = TestRunner.fn();
        
        // Initialize dark mode
        DarkMode.initialize();
        
        // Toggle dark mode
        document.body.classList.contains = TestRunner.fn().mockReturnValue(false);
        DarkMode.toggle();
        
        expect(document.body.classList.add).toHaveBeenCalledWith('dark-mode');
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith('darkMode', 'true');
        
        WeatherDisplay.applyWeatherBackground = originalApplyWeatherBackground;
        window.API_KEY = originalAPIKey;
    });

    it('should handle error recovery flow', () => {
        const originalAPIKey = window.API_KEY;
        window.API_KEY = 'invalid';
        
        // Try to start app with invalid API key
        App.checkAPIKeyAndStart();
        
        expect(StateManager.hasError()).toBe(true);
        expect(mockElements.error.style.display).toBe('flex');
        
        // Fix API key and restart
        window.API_KEY = 'valid-api-key-123456';
        
        const originalGetWeatherData = WeatherAPI.getWeatherData;
        WeatherAPI.getWeatherData = TestRunner.fn();
        
        App.restart();
        
        expect(StateManager.hasError()).toBe(false);
        expect(WeatherAPI.getWeatherData).toHaveBeenCalled();
        
        WeatherAPI.getWeatherData = originalGetWeatherData;
        window.API_KEY = originalAPIKey;
    });

    it('should handle complete user interaction sequence', async () => {
        const originalAPIKey = window.API_KEY;
        window.API_KEY = 'valid-api-key-123456';
        
        // Store original functions for cleanup
        const originalDisplayWeatherData = WeatherDisplay.displayWeatherData;
        const originalApplyWeatherAnimation = WeatherAnimations.applyWeatherAnimation;
        const originalDarkModeInit = DarkMode.initialize;
        const originalSearchInit = Search.initialize;
        
        try {
            // Mock all necessary functions
            const mockFetch = MockAPI.mockFetchSuccess(TestData.mockWeatherData);
            WeatherDisplay.displayWeatherData = TestRunner.fn();
            WeatherAnimations.applyWeatherAnimation = TestRunner.fn();
            
            // Ensure DarkMode and Search initialize properly for this test
            DarkMode.initialize = TestRunner.fn();
            Search.initialize = TestRunner.fn();
            
            // Initialize entire app
            App.initializeModules();
        
        // User toggles dark mode
        document.body.classList.contains = TestRunner.fn().mockReturnValue(false);
        DarkMode.toggle();
        
        // User searches for a location
        mockElements.locationSearch.value = 'Paris';
        Search.performSearch();
        
        // Allow operations to complete
        await TestUtils.wait(50);
        
        // User switches back to current location
        mockGeolocation.getCurrentPosition.mockImplementation((success) => {
            success(TestData.mockPosition);
        });
        Search.useCurrentLocation();
        
        await TestUtils.wait(50);
        
        // Verify final state
        expect(StateManager.getCurrentLocation()).toBe(true);
        expect(mockElements.currentLocationBtn.classList.contains('active')).toBe(true);
        expect(mockElements.locationSearch.value).toBe('');
        expect(DarkMode.getPreference()).toBe('dark');
        
        } finally {
            // Restore all mocked functions
            WeatherDisplay.displayWeatherData = originalDisplayWeatherData;
            WeatherAnimations.applyWeatherAnimation = originalApplyWeatherAnimation;
            DarkMode.initialize = originalDarkModeInit;
            Search.initialize = originalSearchInit;
            window.API_KEY = originalAPIKey;
        }
    });
});

// Performance and reliability tests
describe('App Performance and Reliability', () => {
    let mockElements;

    beforeEach(() => {
        mockElements = TestUtils.setupDOMMocks();
        StateManager.reset();
        TestUtils.resetMocks();
    });

    afterEach(() => {
        TestUtils.resetMocks();
    });

    it('should handle multiple rapid API calls gracefully', async () => {
        const originalAPIKey = window.API_KEY;
        window.API_KEY = 'valid-api-key-123456';
        
        const mockFetch = MockAPI.mockFetchSuccess(TestData.mockWeatherData);
        
        // Make multiple rapid calls
        const promises = [
            WeatherAPI.getWeatherDataByLocation('London'),
            WeatherAPI.getWeatherDataByLocation('Paris'),
            WeatherAPI.getWeatherDataByLocation('Berlin')
        ];
        
        await Promise.all(promises);
        
        expect(mockFetch.calls.length).toBe(3);
        
        window.API_KEY = originalAPIKey;
    });

    it('should handle state consistency across modules', () => {
        // Set initial state
        StateManager.setCurrentLocation(false);
        StateManager.setWeatherData(TestData.mockWeatherData);
        StateManager.setLoading(false);
        
        // Multiple modules accessing state
        const searchState = StateManager.getCurrentLocation();
        const weatherData = StateManager.getWeatherData();
        const loadingState = StateManager.isLoading();
        
        expect(searchState).toBe(false);
        expect(weatherData).toEqual(TestData.mockWeatherData);
        expect(loadingState).toBe(false);
        
        // Verify state consistency after operations
        Search.useCurrentLocation();
        expect(StateManager.getCurrentLocation()).toBe(true);
    });

    it('should handle memory cleanup on app restart', () => {
        // Set complex state
        StateManager.setWeatherData(TestData.mockWeatherData);
        StateManager.setCurrentLocationData(TestData.mockPosition.coords);
        StateManager.setLoading(true);
        StateManager.setError(true);
        
        const originalClearDisplay = WeatherDisplay.clearDisplay;
        const originalStartApp = App.startApp;
        WeatherDisplay.clearDisplay = TestRunner.fn();
        App.startApp = TestRunner.fn();
        
        App.restart();
        
        // Verify clean state
        expect(StateManager.getWeatherData()).toBe(null);
        expect(StateManager.getCurrentLocationData()).toBe(null);
        expect(StateManager.isLoading()).toBe(false);
        expect(StateManager.hasError()).toBe(false);
        expect(StateManager.getCurrentLocation()).toBe(true); // Default state
        
        WeatherDisplay.clearDisplay = originalClearDisplay;
        App.startApp = originalStartApp;
    });

    it('should handle edge cases in user input', () => {
        Search.initialize();
        
        const originalGetWeatherDataByLocation = WeatherAPI.getWeatherDataByLocation;
        WeatherAPI.getWeatherDataByLocation = TestRunner.fn();
        
        // Test various edge cases
        const edgeCases = [
            '',           // Empty string
            '   ',        // Whitespace only
            '\n\t',       // Special characters
            'a',          // Single character
            'A'.repeat(100), // Very long string
        ];
        
        edgeCases.forEach(testCase => {
            mockElements.locationSearch.value = testCase;
            Search.performSearch();
        });
        
        // Only valid inputs should trigger API calls
        expect(WeatherAPI.getWeatherDataByLocation.calls.length).toBe(1); // Only the long string is valid
        
        WeatherAPI.getWeatherDataByLocation = originalGetWeatherDataByLocation;
    });
});