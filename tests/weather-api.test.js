// Weather API Tests

describe('WeatherAPI', () => {
    let mockElements, mockGeolocation, mockFetch;

    beforeEach(() => {
        mockElements = TestUtils.setupDOMMocks();
        mockGeolocation = TestUtils.setupGeolocationMocks();
        StateManager.reset();
        TestUtils.resetMocks();
    });

    afterEach(() => {
        TestUtils.resetMocks();
        // Restore fetch if it was mocked
        if (global.fetch && global.fetch.mockClear) {
            delete global.fetch;
        }
    });

    describe('checkAPIKey', () => {
        it('should return false and show error for invalid API key', () => {
            // Mock invalid API key
            const originalAPIKey = window.API_KEY;
            window.API_KEY = 'YOUR_API_KEY_HERE';
            
            const result = WeatherAPI.checkAPIKey();
            
            expect(result).toBe(false);
            expect(mockElements.error.style.display).toBe('flex');
            
            // Restore original API key
            window.API_KEY = originalAPIKey;
        });

        it('should return true for valid API key', () => {
            // Mock valid API key
            const originalAPIKey = window.API_KEY;
            window.API_KEY = 'valid-api-key-123456';
            
            const result = WeatherAPI.checkAPIKey();
            
            expect(result).toBe(true);
            
            // Restore original API key
            window.API_KEY = originalAPIKey;
        });
    });

    describe('getWeatherData', () => {
        it('should show error if API key is invalid', () => {
            const originalAPIKey = window.API_KEY;
            window.API_KEY = 'invalid';
            
            WeatherAPI.getWeatherData();
            
            expect(mockElements.error.style.display).toBe('flex');
            
            window.API_KEY = originalAPIKey;
        });

        it('should show error if geolocation is not supported', () => {
            const originalAPIKey = window.API_KEY;
            window.API_KEY = 'valid-api-key-123456';
            
            // Mock no geolocation support
            delete navigator.geolocation;
            
            WeatherAPI.getWeatherData();
            
            expect(mockElements.error.style.display).toBe('flex');
            expect(mockElements.errorMessage.textContent).toContain('Geolocation is not supported');
            
            window.API_KEY = originalAPIKey;
            TestUtils.setupGeolocationMocks(); // Restore geolocation
        });

        it('should call getCurrentPosition when geolocation is available', () => {
            const originalAPIKey = window.API_KEY;
            window.API_KEY = 'valid-api-key-123456';
            
            WeatherAPI.getWeatherData();
            
            expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled();
            expect(mockElements.loading.style.display).toBe('flex');
            
            window.API_KEY = originalAPIKey;
        });

        it('should handle geolocation permission denied', () => {
            const originalAPIKey = window.API_KEY;
            window.API_KEY = 'valid-api-key-123456';
            
            // Mock geolocation error
            mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
                error({
                    code: 1, // PERMISSION_DENIED
                    PERMISSION_DENIED: 1,
                    POSITION_UNAVAILABLE: 2,
                    TIMEOUT: 3
                });
            });
            
            WeatherAPI.getWeatherData();
            
            expect(mockElements.error.style.display).toBe('flex');
            expect(mockElements.errorMessage.textContent).toContain('allow location access');
            
            window.API_KEY = originalAPIKey;
        });

        it('should handle geolocation timeout', () => {
            const originalAPIKey = window.API_KEY;
            window.API_KEY = 'valid-api-key-123456';
            
            mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
                error({
                    code: 3, // TIMEOUT
                    PERMISSION_DENIED: 1,
                    POSITION_UNAVAILABLE: 2,
                    TIMEOUT: 3
                });
            });
            
            WeatherAPI.getWeatherData();
            
            expect(mockElements.errorMessage.textContent).toContain('timed out');
            
            window.API_KEY = originalAPIKey;
        });
    });

    describe('getWeatherDataByLocation', () => {
        it('should show error for invalid API key', async () => {
            const originalAPIKey = window.API_KEY;
            window.API_KEY = 'invalid';
            
            await WeatherAPI.getWeatherDataByLocation('London');
            
            expect(mockElements.error.style.display).toBe('flex');
            
            window.API_KEY = originalAPIKey;
        });

        it('should fetch weather data for valid location', async () => {
            const originalAPIKey = window.API_KEY;
            window.API_KEY = 'valid-api-key-123456';
            
            // Mock successful fetch
            mockFetch = MockAPI.mockFetchSuccess(TestData.mockWeatherData);
            
            await WeatherAPI.getWeatherDataByLocation('London');
            
            expect(mockFetch).toHaveBeenCalled();
            expect(mockElements.loading.style.display).toBe('flex');
            
            window.API_KEY = originalAPIKey;
        });

        it('should handle location not found error', async () => {
            const originalAPIKey = window.API_KEY;
            window.API_KEY = 'valid-api-key-123456';
            
            // Mock 400 error response
            mockFetch = MockAPI.mockFetchError(400, 'Bad Request');
            
            await WeatherAPI.getWeatherDataByLocation('InvalidLocation');
            
            expect(mockElements.error.style.display).toBe('flex');
            expect(mockElements.errorMessage.textContent).toContain('not found');
            
            window.API_KEY = originalAPIKey;
        });

        it('should handle API server error', async () => {
            const originalAPIKey = window.API_KEY;
            window.API_KEY = 'valid-api-key-123456';
            
            // Mock 500 error response
            mockFetch = MockAPI.mockFetchError(500, 'Internal Server Error');
            
            await WeatherAPI.getWeatherDataByLocation('London');
            
            expect(mockElements.error.style.display).toBe('flex');
            expect(mockElements.errorMessage.textContent).toContain('Weather API Error');
            
            window.API_KEY = originalAPIKey;
        });

        it('should handle network error', async () => {
            const originalAPIKey = window.API_KEY;
            window.API_KEY = 'valid-api-key-123456';
            
            // Mock network error
            mockFetch = MockAPI.mockFetchNetworkError();
            
            await WeatherAPI.getWeatherDataByLocation('London');
            
            expect(mockElements.error.style.display).toBe('flex');
            
            window.API_KEY = originalAPIKey;
        });
    });

    describe('fetchWeatherData', () => {
        it('should validate coordinates before making request', async () => {
            const originalAPIKey = window.API_KEY;
            window.API_KEY = 'valid-api-key-123456';
            
            // Test invalid coordinates
            await WeatherAPI.fetchWeatherData(91, 181); // Invalid lat/lon
            
            expect(mockElements.error.style.display).toBe('flex');
            expect(mockElements.errorMessage.textContent).toContain('Failed to fetch weather data');
            
            window.API_KEY = originalAPIKey;
        });

        it('should make API request with valid coordinates', async () => {
            const originalAPIKey = window.API_KEY;
            window.API_KEY = 'valid-api-key-123456';
            
            mockFetch = MockAPI.mockFetchSuccess(TestData.mockWeatherData);
            
            await WeatherAPI.fetchWeatherData(51.5074, -0.1278); // London coordinates
            
            expect(mockFetch).toHaveBeenCalled();
            
            // Check that the correct URL was called
            const fetchCall = mockFetch.calls[0];
            const url = fetchCall.args[0];
            expect(url).toContain('51.5074,-0.1278');
            expect(url).toContain('forecast.json');
            expect(url).toContain('days=3');
            
            window.API_KEY = originalAPIKey;
        });

        it('should handle successful weather data response', async () => {
            const originalAPIKey = window.API_KEY;
            window.API_KEY = 'valid-api-key-123456';
            
            mockFetch = MockAPI.mockFetchSuccess(TestData.mockWeatherData);
            
            // Mock WeatherDisplay.displayWeatherData
            const originalDisplayWeatherData = WeatherDisplay.displayWeatherData;
            WeatherDisplay.displayWeatherData = TestRunner.fn();
            
            await WeatherAPI.fetchWeatherData(51.5074, -0.1278);
            
            expect(WeatherDisplay.displayWeatherData).toHaveBeenCalledWith(TestData.mockWeatherData);
            expect(StateManager.getWeatherData()).toEqual(TestData.mockWeatherData);
            
            // Restore original function
            WeatherDisplay.displayWeatherData = originalDisplayWeatherData;
            window.API_KEY = originalAPIKey;
        });
    });

    describe('refreshWeatherData', () => {
        it('should not refresh with invalid API key', () => {
            const originalAPIKey = window.API_KEY;
            window.API_KEY = 'invalid';
            
            // Mock getWeatherData to track calls
            const originalGetWeatherData = WeatherAPI.getWeatherData;
            WeatherAPI.getWeatherData = TestRunner.fn();
            
            WeatherAPI.refreshWeatherData();
            
            expect(WeatherAPI.getWeatherData).not.toHaveBeenCalled();
            
            // Restore
            WeatherAPI.getWeatherData = originalGetWeatherData;
            window.API_KEY = originalAPIKey;
        });

        it('should refresh current location data when using current location', () => {
            const originalAPIKey = window.API_KEY;
            window.API_KEY = 'valid-api-key-123456';
            
            StateManager.setCurrentLocation(true);
            
            const originalGetWeatherData = WeatherAPI.getWeatherData;
            WeatherAPI.getWeatherData = TestRunner.fn();
            
            WeatherAPI.refreshWeatherData();
            
            expect(WeatherAPI.getWeatherData).toHaveBeenCalled();
            
            WeatherAPI.getWeatherData = originalGetWeatherData;
            window.API_KEY = originalAPIKey;
        });

        it('should refresh searched location data when not using current location', () => {
            const originalAPIKey = window.API_KEY;
            window.API_KEY = 'valid-api-key-123456';
            
            StateManager.setCurrentLocation(false);
            StateManager.setWeatherData(TestData.mockWeatherData);
            
            const originalGetWeatherDataByLocation = WeatherAPI.getWeatherDataByLocation;
            WeatherAPI.getWeatherDataByLocation = TestRunner.fn();
            
            WeatherAPI.refreshWeatherData();
            
            expect(WeatherAPI.getWeatherDataByLocation).toHaveBeenCalledWith(
                `${TestData.mockWeatherData.location.name}, ${TestData.mockWeatherData.location.country}`
            );
            
            WeatherAPI.getWeatherDataByLocation = originalGetWeatherDataByLocation;
            window.API_KEY = originalAPIKey;
        });

        it('should handle missing weather data gracefully', () => {
            const originalAPIKey = window.API_KEY;
            window.API_KEY = 'valid-api-key-123456';
            
            StateManager.setCurrentLocation(false);
            StateManager.setWeatherData(null);
            
            expect(() => {
                WeatherAPI.refreshWeatherData();
            }).not.toThrow();
            
            window.API_KEY = originalAPIKey;
        });
    });
});

// Integration tests for WeatherAPI with other modules
describe('WeatherAPI Integration', () => {
    let mockElements, mockGeolocation;

    beforeEach(() => {
        mockElements = TestUtils.setupDOMMocks();
        mockGeolocation = TestUtils.setupGeolocationMocks();
        StateManager.reset();
        TestUtils.resetMocks();
    });

    afterEach(() => {
        TestUtils.resetMocks();
    });

    it('should complete full weather data flow from geolocation to display', async () => {
        const originalAPIKey = window.API_KEY;
        window.API_KEY = 'valid-api-key-123456';
        
        // Mock successful geolocation
        mockGeolocation.getCurrentPosition.mockImplementation((success) => {
            success(TestData.mockPosition);
        });
        
        // Mock successful API response
        const mockFetch = MockAPI.mockFetchSuccess(TestData.mockWeatherData);
        
        // Mock WeatherDisplay.displayWeatherData
        const originalDisplayWeatherData = WeatherDisplay.displayWeatherData;
        WeatherDisplay.displayWeatherData = TestRunner.fn();
        
        // Start the weather data flow
        WeatherAPI.getWeatherData();
        
        // Allow geolocation callback to execute
        await TestUtils.wait(10);
        
        expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled();
        expect(mockFetch).toHaveBeenCalled();
        expect(StateManager.getWeatherData()).toEqual(TestData.mockWeatherData);
        
        // Restore
        WeatherDisplay.displayWeatherData = originalDisplayWeatherData;
        window.API_KEY = originalAPIKey;
    });

    it('should handle error flow and show appropriate UI', async () => {
        const originalAPIKey = window.API_KEY;
        window.API_KEY = 'valid-api-key-123456';
        
        // Mock geolocation permission denied
        mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
            error({
                code: 1,
                PERMISSION_DENIED: 1,
                POSITION_UNAVAILABLE: 2,
                TIMEOUT: 3
            });
        });
        
        WeatherAPI.getWeatherData();
        
        expect(StateManager.hasError()).toBe(true);
        expect(mockElements.error.style.display).toBe('flex');
        expect(mockElements.loading.style.display).toBe('none');
        
        window.API_KEY = originalAPIKey;
    });

    it('should handle location search to weather display flow', async () => {
        const originalAPIKey = window.API_KEY;
        window.API_KEY = 'valid-api-key-123456';
        
        const mockFetch = MockAPI.mockFetchSuccess(TestData.mockWeatherData);
        
        const originalDisplayWeatherData = WeatherDisplay.displayWeatherData;
        WeatherDisplay.displayWeatherData = TestRunner.fn();
        
        await WeatherAPI.getWeatherDataByLocation('London');
        
        expect(mockFetch).toHaveBeenCalled();
        expect(WeatherDisplay.displayWeatherData).toHaveBeenCalledWith(TestData.mockWeatherData);
        expect(StateManager.getWeatherData()).toEqual(TestData.mockWeatherData);
        
        WeatherDisplay.displayWeatherData = originalDisplayWeatherData;
        window.API_KEY = originalAPIKey;
    });
});