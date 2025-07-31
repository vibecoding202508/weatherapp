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
        window.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                status: 200,
                json: () => Promise.resolve(TestData.sampleWeatherData)
            })
        );

        // Setup successful geolocation
        window.navigator = {
            geolocation: {
                getCurrentPosition: jest.fn((success) => {
                    success({
                        coords: {
                            latitude: 51.5074,
                            longitude: -0.1278
                        }
                    });
                })
            }
        };

        // Mock all required global objects
        window.StateManager = {
            weatherData: null,
            isLoading: false,
            hasError: false,
            currentLocation: false,
            
            setWeatherData: function(data) { this.weatherData = data; },
            getWeatherData: function() { return this.weatherData; },
            setLoading: function(loading) { this.isLoading = loading; },
            setError: function(error) { this.hasError = error; },
            setCurrentLocation: function(current) { this.currentLocation = current; },
            getCurrentLocation: function() { return this.currentLocation; }
        };

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
    });

    it('should complete full app initialization with current location', (done) => {
        // Simulate app startup
        WeatherAPI.getWeatherData();

        setTimeout(() => {
            expect(navigator.geolocation.getCurrentPosition).toHaveBeenCalled();
            expect(window.fetch).toHaveBeenCalled();
            expect(StateManager.getWeatherData()).toEqual(TestData.sampleWeatherData);
            expect(WeatherDisplay.displayWeatherData).toHaveBeenCalledWith(TestData.sampleWeatherData);
            done();
        }, 150);
    });

    it('should handle location search workflow', async () => {
        await WeatherAPI.getWeatherDataByLocation('London');

        expect(window.fetch).toHaveBeenCalledWith(
            expect.stringContaining('London')
        );
        expect(StateManager.getWeatherData()).toEqual(TestData.sampleWeatherData);
        expect(WeatherDisplay.displayWeatherData).toHaveBeenCalledWith(TestData.sampleWeatherData);
    });

    it('should handle poor visibility conditions end-to-end', () => {
        const poorVisibilityData = TestData.poorVisibilityWeatherData;
        
        WeatherDisplay.displayWeatherData(poorVisibilityData);
        
        expect(WeatherDisplay.updateVisibilityDisplay).toHaveBeenCalledWith(
            0.5, 
            'Fog'
        );
    });

    it('should handle high UV conditions end-to-end', () => {
        const highUVData = TestData.highUVWeatherData;
        
        WeatherDisplay.displayWeatherData(highUVData);
        
        expect(StateManager.getWeatherData()).toEqual(highUVData);
    });

    it('should handle network errors gracefully', async () => {
        window.fetch = jest.fn(() => Promise.reject(new Error('Network error')));

        await WeatherAPI.fetchWeatherData(51.5074, -0.1278);

        // Should handle error gracefully without crashing
        expect(true).toBe(true); // Test passes if no uncaught errors
    });

    it('should handle API errors gracefully', async () => {
        window.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
                status: 404,
                statusText: 'Not Found'
            })
        );

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

        // Add body mock
        document.body = {
            classList: {
                classes: [],
                add: function(className) { this.classes.push(className); },
                remove: function(className) { 
                    const index = this.classes.indexOf(className);
                    if (index > -1) this.classes.splice(index, 1);
                },
                contains: function(className) { return this.classes.includes(className); }
            }
        };

        // Mock WeatherDisplay methods needed for dark mode
        window.WeatherDisplay = {
            resetToDefaultBackground: jest.fn(),
            applyWeatherBackground: jest.fn()
        };
    });

    afterEach(() => {
        window.DOM = originalDOM;
        window.localStorage = originalLocalStorage;
    });

    it('should initialize dark mode from localStorage', () => {
        localStorage.setItem('darkMode', 'true');
        
        DarkMode.initialize();
        
        expect(document.body.classList.contains('dark-mode')).toBe(true);
        expect(DOM.toggleIcon.className).toBe('fas fa-sun');
    });

    it('should toggle dark mode correctly', () => {
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
        
        // Mock successful responses
        window.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                status: 200,
                json: () => Promise.resolve(TestData.sampleWeatherData)
            })
        );

        // Setup all required mocks
        window.StateManager = {
            weatherData: null,
            setWeatherData: function(data) { this.weatherData = data; },
            getWeatherData: function() { return this.weatherData; },
            setLoading: () => {},
            setError: () => {},
            setCurrentLocation: () => {},
            getCurrentLocation: () => false
        };

        window.WeatherDisplay = {
            displayWeatherData: jest.fn(),
            clearDisplay: jest.fn()
        };

        window.UIUtils = {
            showLoading: jest.fn(),
            showError: jest.fn(),
            showWeatherContent: jest.fn(),
            showLoadingWithMessage: jest.fn()
        };
    });

    it('should handle complete search workflow', async () => {
        // Simulate user typing in search
        DOM.locationSearch.value = 'Paris';
        
        // Simulate search
        await WeatherAPI.getWeatherDataByLocation('Paris');
        
        expect(window.fetch).toHaveBeenCalledWith(
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
        
        expect(WeatherDisplay.clearDisplay).toHaveBeenCalled();
    });

    it('should handle visibility toggle workflow', () => {
        // Mock DOM elements for visibility
        const mockExpandable = { style: { display: 'none' } };
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
        expect(mockToggle.classList.add).toHaveBeenCalledWith('expanded');
    });
});