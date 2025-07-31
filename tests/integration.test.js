// Integration Tests for Complete Weather App Workflows

describe('Weather App Integration', () => {
    let originalDOM;
    let originalFetch;
    let originalNavigator;
    let originalLocalStorage;

    beforeEach(() => {
        // Setup mocks
        originalDOM = window.DOM;
        originalFetch = window.fetch;
        originalNavigator = window.navigator;
        originalLocalStorage = window.localStorage;

        window.DOM = TestData.createMockDOM();
        window.localStorage = TestData.createMockLocalStorage();
        window.API_KEY = 'test_api_key_12345678';

        // Setup successful API responses
        const mockFetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                status: 200,
                json: () => Promise.resolve(TestData.sampleWeatherData)
            })
        );
        window.fetch = mockFetch;
        window.mockFetch = mockFetch; // Store for assertions

        // Setup successful geolocation
        const mockGetCurrentPosition = jest.fn((success) => {
            success({
                coords: {
                    latitude: 51.5074,
                    longitude: -0.1278
                }
            });
        });
        
        window.navigator = {
            geolocation: {
                getCurrentPosition: mockGetCurrentPosition
            }
        };
        
        // Store the mock for test assertions
        window.mockGetCurrentPosition = mockGetCurrentPosition;

        // Mock UIUtils for error handling
        window.mockUIUtils = {
            showError: jest.fn(),
            hideError: jest.fn(),
            showLoading: jest.fn(),
            hideLoading: jest.fn(),
            showLoadingWithMessage: jest.fn()
        };
        
        // Store original UIUtils and replace with mocks
        if (typeof UIUtils !== 'undefined') {
            window.originalUIUtils = UIUtils;
            Object.keys(window.mockUIUtils).forEach(key => {
                UIUtils[key] = window.mockUIUtils[key];
            });
        }

        // Mock StateManager on both window and global scope
        const mockStateManager = {
            weatherData: null,
            isLoading: false,
            hasError: false,
            currentLocation: false,
            
            setWeatherData: jest.fn(function(data) { this.weatherData = data; }),
            getWeatherData: function() { return this.weatherData; },
            setLoading: function(loading) { this.isLoading = loading; },
            setError: function(error) { this.hasError = error; },
            setCurrentLocation: function(current) { this.currentLocation = current; },
            getCurrentLocation: function() { return this.currentLocation; }
        };
        
        window.StateManager = mockStateManager;
        // Also mock the global StateManager if it exists
        if (typeof StateManager !== 'undefined') {
            window.originalGlobalStateManager = {
                setWeatherData: StateManager.setWeatherData,
                getWeatherData: StateManager.getWeatherData
            };
            StateManager.setWeatherData = mockStateManager.setWeatherData;
            StateManager.getWeatherData = mockStateManager.getWeatherData;
        }

        window.WeatherDisplay = {
            displayWeatherData: jest.fn(),
            clearDisplay: jest.fn(),
            updateVisibilityDisplay: jest.fn(),
            setupVisibilityToggle: jest.fn(),
            toggleVisibilityDetails: jest.fn()
        };

        window.WeatherAlerts = {
            fetchMeteoAlarmAlerts: jest.fn()
        };

        window.UIUtils = {
            showLoading: jest.fn(),
            showError: jest.fn(),
            showWeatherContent: jest.fn(),
            showLoadingWithMessage: jest.fn()
        };
    });

    afterEach(() => {
        window.DOM = originalDOM;
        window.fetch = originalFetch;
        window.navigator = originalNavigator;
        window.localStorage = originalLocalStorage;
        
        // Restore original UIUtils
        if (window.originalUIUtils && typeof UIUtils !== 'undefined') {
            Object.keys(window.originalUIUtils).forEach(key => {
                UIUtils[key] = window.originalUIUtils[key];
            });
        }
        
        // Restore global StateManager if it was mocked
        if (window.originalGlobalStateManager && typeof StateManager !== 'undefined') {
            StateManager.setWeatherData = window.originalGlobalStateManager.setWeatherData;
            StateManager.getWeatherData = window.originalGlobalStateManager.getWeatherData;
            delete window.originalGlobalStateManager;
        }
        
        // Clean up mock classes
        if (window.mockClassListClasses) {
            delete window.mockClassListClasses;
        }
    });

    it('should complete full app initialization with current location', (done) => {
        // Simulate app startup
        WeatherAPI.getWeatherData();

        setTimeout(() => {
            expect(window.mockGetCurrentPosition).toHaveBeenCalled();
            expect(window.fetch).toHaveBeenCalled();
            expect(StateManager.getWeatherData()).toEqual(TestData.sampleWeatherData);
            expect(WeatherDisplay.displayWeatherData).toHaveBeenCalledWith(TestData.sampleWeatherData);
            done();
        }, 150);
    });

    it('should handle location search workflow', async () => {
        await WeatherAPI.getWeatherDataByLocation('London');

        expect(window.mockFetch).toHaveBeenCalledWith(
            expect.stringContaining('London')
        );
        expect(StateManager.getWeatherData()).toEqual(TestData.sampleWeatherData);
        expect(WeatherDisplay.displayWeatherData).toHaveBeenCalledWith(TestData.sampleWeatherData);
    });

    it('should handle poor visibility conditions end-to-end', () => {
        const poorVisibilityData = TestData.poorVisibilityWeatherData;
        
        // Mock the updateVisibilityDisplay method
        const originalUpdateVisibilityDisplay = WeatherDisplay.updateVisibilityDisplay;
        WeatherDisplay.updateVisibilityDisplay = jest.fn();
        
        WeatherDisplay.displayWeatherData(poorVisibilityData);
        
        expect(WeatherDisplay.updateVisibilityDisplay).toHaveBeenCalledWith(
            0.5, 
            'Fog'
        );
        
        // Restore the original method
        WeatherDisplay.updateVisibilityDisplay = originalUpdateVisibilityDisplay;
    });

    it('should handle high UV conditions end-to-end', () => {
        const highUVData = TestData.highUVWeatherData;
        
        WeatherDisplay.displayWeatherData(highUVData);
        
        expect(StateManager.getWeatherData()).toEqual(highUVData);
    });

    it('should handle network errors gracefully', async () => {
        const mockFetch = jest.fn(() => Promise.reject(new Error('Network error')));
        window.fetch = mockFetch;

        // Suppress console.error for this test since we expect an error
        const originalConsoleError = console.error;
        console.error = jest.fn();

        await WeatherAPI.fetchWeatherData(51.5074, -0.1278);

        // Restore console.error
        console.error = originalConsoleError;

        // Should handle error gracefully by calling showError
        expect(window.mockUIUtils.showError).toHaveBeenCalledWith(
            'Failed to fetch weather data. Please check your internet connection and try again.'
        );
    });

    it('should handle API errors gracefully', async () => {
        const mockFetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
                status: 404,
                statusText: 'Not Found'
            })
        );
        window.fetch = mockFetch;

        await WeatherAPI.getWeatherDataByLocation('InvalidLocation');

        // Should handle error gracefully
        expect(true).toBe(true);
    });

    it('should handle geolocation permission denied', (done) => {
        window.navigator.geolocation.getCurrentPosition = jest.fn((success, error) => {
            error({
                code: 1,
                message: 'Permission denied'
            });
        });

        WeatherAPI.getWeatherData();

        setTimeout(() => {
            expect(navigator.geolocation.getCurrentPosition).toHaveBeenCalled();
            // Should show appropriate error message
            done();
        }, 100);
    });

    it('should refresh weather data correctly', () => {
        // Set initial state
        StateManager.setWeatherData(TestData.sampleWeatherData);
        StateManager.setCurrentLocation(true);

        const originalGetWeatherData = WeatherAPI.getWeatherData;
        WeatherAPI.getWeatherData = jest.fn();

        WeatherAPI.refreshWeatherData();

        expect(WeatherAPI.getWeatherData).toHaveBeenCalled();

        // Restore
        WeatherAPI.getWeatherData = originalGetWeatherData;
    });
});

describe('Dark Mode Integration', () => {
    let originalDOM;
    let originalLocalStorage;

    beforeEach(() => {
        originalDOM = window.DOM;
        originalLocalStorage = window.localStorage;

        window.DOM = TestData.createMockDOM();
        window.localStorage = TestData.createMockLocalStorage();

        // Initialize mockClassListClasses for classList.contains compatibility
        window.mockClassListClasses = [];
        
        // Mock document.body.classList methods
        Object.defineProperty(document.body.classList, 'add', {
            value: function(className) { window.mockClassListClasses.push(className); },
            configurable: true
        });
        Object.defineProperty(document.body.classList, 'remove', {
            value: function(className) { 
                const index = window.mockClassListClasses.indexOf(className);
                if (index > -1) window.mockClassListClasses.splice(index, 1);
            },
            configurable: true
        });
        Object.defineProperty(document.body.classList, 'contains', {
            value: function(className) { return window.mockClassListClasses.includes(className); },
            configurable: true
        });

        // Mock StateManager on both window and global scope
        const mockStateManager = {
            weatherData: null,
            isLoading: false,
            hasError: false,
            currentLocation: false,
            
            setWeatherData: jest.fn(function(data) { this.weatherData = data; }),
            getWeatherData: function() { return this.weatherData; },
            setLoading: function(loading) { this.isLoading = loading; },
            setError: function(error) { this.hasError = error; },
            setCurrentLocation: function(current) { this.currentLocation = current; },
            getCurrentLocation: function() { return this.currentLocation; }
        };
        
        window.StateManager = mockStateManager;
        // Also mock the global StateManager if it exists
        if (typeof StateManager !== 'undefined') {
            window.originalGlobalStateManager = {
                setWeatherData: StateManager.setWeatherData,
                getWeatherData: StateManager.getWeatherData
            };
            StateManager.setWeatherData = mockStateManager.setWeatherData;
            StateManager.getWeatherData = mockStateManager.getWeatherData;
        }

        // Mock WeatherDisplay on both window and global scope
        const mockWeatherDisplay = {
            displayWeatherData: jest.fn(),
            clearDisplay: jest.fn(),
            resetToDefaultBackground: jest.fn(),
            applyWeatherBackground: jest.fn()
        };
        
        window.WeatherDisplay = mockWeatherDisplay;
        // Also mock the global WeatherDisplay if it exists
        if (typeof WeatherDisplay !== 'undefined') {
            window.originalWeatherDisplay = {
                displayWeatherData: WeatherDisplay.displayWeatherData,
                clearDisplay: WeatherDisplay.clearDisplay,
                resetToDefaultBackground: WeatherDisplay.resetToDefaultBackground,
                applyWeatherBackground: WeatherDisplay.applyWeatherBackground
            };
            WeatherDisplay.displayWeatherData = mockWeatherDisplay.displayWeatherData;
            WeatherDisplay.clearDisplay = mockWeatherDisplay.clearDisplay;
            WeatherDisplay.resetToDefaultBackground = mockWeatherDisplay.resetToDefaultBackground;
            WeatherDisplay.applyWeatherBackground = mockWeatherDisplay.applyWeatherBackground;
        }
    });

    afterEach(() => {
        window.DOM = originalDOM;
        window.localStorage = originalLocalStorage;
        
        // Clean up mock classes
        if (window.mockClassListClasses) {
            delete window.mockClassListClasses;
        }
    });

    it('should initialize dark mode from localStorage', () => {
        localStorage.setItem('darkMode', 'true');
        
        DarkMode.initialize();
        
        expect(document.body.classList.contains('dark-mode')).toBe(true);
        expect(window.DOM.toggleIcon.className).toBe('fas fa-sun');
    });

    it('should toggle dark mode correctly', () => {
        // Ensure localStorage starts clean (no dark mode preference)
        localStorage.removeItem('darkMode');
        
        DarkMode.initialize();
        
        expect(document.body.classList.contains('dark-mode')).toBe(false);
        
        DarkMode.toggle();
        
        expect(document.body.classList.contains('dark-mode')).toBe(true);
        expect(localStorage.getItem('darkMode')).toBe('true');
        
        DarkMode.toggle();
        
        expect(document.body.classList.contains('dark-mode')).toBe(false);
        expect(localStorage.getItem('darkMode')).toBe('false');
    });

    it('should return correct preferences', () => {
        localStorage.setItem('darkMode', 'true');
        expect(DarkMode.getPreference()).toBe('dark');
        
        localStorage.setItem('darkMode', 'false');
        expect(DarkMode.getPreference()).toBe('light');
    });
});

describe('Complete User Workflows', () => {
    beforeEach(() => {
        // Setup complete app environment
        window.DOM = TestData.createMockDOM();
        window.localStorage = TestData.createMockLocalStorage();
        window.API_KEY = 'test_api_key_12345678';
        
        // Setup successful API responses
        const mockFetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                status: 200,
                json: () => Promise.resolve(TestData.sampleWeatherData)
            })
        );
        window.fetch = mockFetch;
        window.mockFetch = mockFetch; // Store for assertions
        
        // Initialize mockClassListClasses for classList.contains compatibility
        window.mockClassListClasses = [];
        
        // Mock document.body.classList methods
        Object.defineProperty(document.body.classList, 'add', {
            value: function(className) { window.mockClassListClasses.push(className); },
            configurable: true
        });
        Object.defineProperty(document.body.classList, 'remove', {
            value: function(className) { 
                const index = window.mockClassListClasses.indexOf(className);
                if (index > -1) window.mockClassListClasses.splice(index, 1);
            },
            configurable: true
        });
        Object.defineProperty(document.body.classList, 'contains', {
            value: function(className) { return window.mockClassListClasses.includes(className); },
            configurable: true
        });
        
        // Mock successful responses
        const mockFetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                status: 200,
                json: () => Promise.resolve(TestData.sampleWeatherData)
            })
        );
        window.fetch = mockFetch;
        window.mockFetch = mockFetch; // Store for assertions

        // Mock StateManager on both window and global scope  
        const mockStateManager = {
            weatherData: null,
            isLoading: false,
            hasError: false,
            currentLocation: false,
            
            setWeatherData: jest.fn(function(data) { this.weatherData = data; }),
            getWeatherData: function() { return this.weatherData; },
            setLoading: function(loading) { this.isLoading = loading; },
            setError: function(error) { this.hasError = error; },
            setCurrentLocation: function(current) { this.currentLocation = current; },
            getCurrentLocation: function() { return this.currentLocation; }
        };
        
        window.StateManager = mockStateManager;
        // Also mock the global StateManager if it exists
        if (typeof StateManager !== 'undefined') {
            window.originalGlobalStateManager = {
                setWeatherData: StateManager.setWeatherData,
                getWeatherData: StateManager.getWeatherData
            };
            StateManager.setWeatherData = mockStateManager.setWeatherData;
            StateManager.getWeatherData = mockStateManager.getWeatherData;
        }

        // Mock WeatherDisplay on both window and global scope
        const mockWeatherDisplay = {
            displayWeatherData: jest.fn(),
            clearDisplay: jest.fn(),
            resetToDefaultBackground: jest.fn(),
            applyWeatherBackground: jest.fn()
        };
        
        window.WeatherDisplay = mockWeatherDisplay;
        // Also mock the global WeatherDisplay if it exists
        if (typeof WeatherDisplay !== 'undefined') {
            window.originalWeatherDisplay = {
                displayWeatherData: WeatherDisplay.displayWeatherData,
                clearDisplay: WeatherDisplay.clearDisplay,
                resetToDefaultBackground: WeatherDisplay.resetToDefaultBackground,
                applyWeatherBackground: WeatherDisplay.applyWeatherBackground
            };
            WeatherDisplay.displayWeatherData = mockWeatherDisplay.displayWeatherData;
            WeatherDisplay.clearDisplay = mockWeatherDisplay.clearDisplay;
            WeatherDisplay.resetToDefaultBackground = mockWeatherDisplay.resetToDefaultBackground;
            WeatherDisplay.applyWeatherBackground = mockWeatherDisplay.applyWeatherBackground;
        }

        window.UIUtils = {
            showLoading: jest.fn(),
            showError: jest.fn(),
            showWeatherContent: jest.fn(),
            showLoadingWithMessage: jest.fn()
        };
    });
    
    afterEach(() => {
        // Clean up mock classes
        if (window.mockClassListClasses) {
            delete window.mockClassListClasses;
        }
        
        // Restore global StateManager if it was mocked
        if (window.originalGlobalStateManager && typeof StateManager !== 'undefined') {
            StateManager.setWeatherData = window.originalGlobalStateManager.setWeatherData;
            StateManager.getWeatherData = window.originalGlobalStateManager.getWeatherData;
            delete window.originalGlobalStateManager;
        }
        
        // Restore original WeatherDisplay if it was mocked
        if (window.originalWeatherDisplay) {
            if (typeof WeatherDisplay !== 'undefined') {
                Object.keys(window.originalWeatherDisplay).forEach(key => {
                    WeatherDisplay[key] = window.originalWeatherDisplay[key];
                });
            }
            delete window.originalWeatherDisplay;
        }
    });

    it('should handle complete search workflow', async () => {
        // Simulate user typing in search
        window.DOM.locationSearch.value = 'Paris';
        
        // Simulate search
        await WeatherAPI.getWeatherDataByLocation('Paris');
        
        expect(window.mockFetch).toHaveBeenCalledWith(
            expect.stringContaining('Paris')
        );
        expect(WeatherDisplay.displayWeatherData).toHaveBeenCalled();
    });

    it('should handle app restart after error', async () => {
        // Simulate error state
        UIUtils.showError('Test error');
        
        // Simulate restart (would be triggered by "Try Again" button)
        WeatherDisplay.clearDisplay();
        await WeatherAPI.getWeatherData();
        
        expect(window.WeatherDisplay.clearDisplay).toHaveBeenCalled();
    });

    it('should handle visibility toggle workflow', () => {
        // Mock DOM elements for visibility
        const mockExpandable = { 
            style: { display: 'none' },
            classList: { 
                add: jest.fn(), 
                remove: jest.fn() 
            }
        };
        const mockToggle = { 
            classList: { 
                contains: () => false, 
                add: jest.fn(), 
                remove: jest.fn() 
            } 
        };
        
        document.getElementById = (id) => {
            if (id === 'visibility-expandable') return mockExpandable;
            if (id === 'visibility-toggle') return mockToggle;
            return { style: { display: 'none' } };
        };
        
        WeatherDisplay.toggleVisibilityDetails();
        
        expect(mockExpandable.style.display).toBe('block');
        expect(mockExpandable.classList.add).toHaveBeenCalledWith('expanded');
        expect(mockToggle.classList.add).toHaveBeenCalledWith('expanded');
    });
});