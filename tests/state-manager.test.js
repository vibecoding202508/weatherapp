// State Manager Tests

TestFramework.describe('StateManager', () => {
    // Reset state before each test
    TestFramework.beforeEach(() => {
        StateManager.reset();
    });

    TestFramework.describe('Current Location Management', () => {
        TestFramework.it('should set and get current location usage', () => {
            TestFramework.expect(StateManager.getCurrentLocation()).toBeTruthy(); // Default is true

            StateManager.setCurrentLocation(false);
            TestFramework.expect(StateManager.getCurrentLocation()).toBeFalsy();

            StateManager.setCurrentLocation(true);
            TestFramework.expect(StateManager.getCurrentLocation()).toBeTruthy();
        });
    });

    TestFramework.describe('Weather Data Management', () => {
        TestFramework.it('should set and get weather data', () => {
            const mockWeatherData = {
                location: { name: 'London', country: 'UK' },
                current: { temp_c: 20, condition: { text: 'Sunny' } },
                forecast: { forecastday: [] }
            };

            TestFramework.expect(StateManager.getWeatherData()).toBeNull(); // Default is null

            StateManager.setWeatherData(mockWeatherData);
            TestFramework.expect(StateManager.getWeatherData()).toBe(mockWeatherData);
        });

        TestFramework.it('should handle null weather data', () => {
            StateManager.setWeatherData(null);
            TestFramework.expect(StateManager.getWeatherData()).toBeNull();
        });

        TestFramework.it('should handle undefined weather data', () => {
            StateManager.setWeatherData(undefined);
            TestFramework.expect(StateManager.getWeatherData()).toBeUndefined();
        });
    });

    TestFramework.describe('Loading State Management', () => {
        TestFramework.it('should set and get loading state', () => {
            TestFramework.expect(StateManager.isLoading()).toBeFalsy(); // Default is false

            StateManager.setLoading(true);
            TestFramework.expect(StateManager.isLoading()).toBeTruthy();

            StateManager.setLoading(false);
            TestFramework.expect(StateManager.isLoading()).toBeFalsy();
        });
    });

    TestFramework.describe('Error State Management', () => {
        TestFramework.it('should set and get error state', () => {
            TestFramework.expect(StateManager.hasError()).toBeFalsy(); // Default is false

            StateManager.setError(true);
            TestFramework.expect(StateManager.hasError()).toBeTruthy();

            StateManager.setError(false);
            TestFramework.expect(StateManager.hasError()).toBeFalsy();
        });
    });

    TestFramework.describe('Current Location Data Management', () => {
        TestFramework.it('should set and get current location data', () => {
            const mockLocationData = {
                latitude: 51.5074,
                longitude: -0.1278,
                city: 'London'
            };

            TestFramework.expect(StateManager.getCurrentLocationData()).toBeNull(); // Default is null

            StateManager.setCurrentLocationData(mockLocationData);
            TestFramework.expect(StateManager.getCurrentLocationData()).toBe(mockLocationData);
        });

        TestFramework.it('should handle null location data', () => {
            StateManager.setCurrentLocationData(null);
            TestFramework.expect(StateManager.getCurrentLocationData()).toBeNull();
        });
    });

    TestFramework.describe('State Reset Functionality', () => {
        TestFramework.it('should reset all state to default values', () => {
            // Set some non-default values
            StateManager.setCurrentLocation(false);
            StateManager.setWeatherData({ test: 'data' });
            StateManager.setLoading(true);
            StateManager.setError(true);
            StateManager.setCurrentLocationData({ test: 'location' });

            // Verify non-default values are set
            TestFramework.expect(StateManager.getCurrentLocation()).toBeFalsy();
            TestFramework.expect(StateManager.getWeatherData()).toEqual({ test: 'data' });
            TestFramework.expect(StateManager.isLoading()).toBeTruthy();
            TestFramework.expect(StateManager.hasError()).toBeTruthy();
            TestFramework.expect(StateManager.getCurrentLocationData()).toEqual({ test: 'location' });

            // Reset state
            StateManager.reset();

            // Verify all values are back to defaults
            TestFramework.expect(StateManager.getCurrentLocation()).toBeTruthy();
            TestFramework.expect(StateManager.getWeatherData()).toBeNull();
            TestFramework.expect(StateManager.isLoading()).toBeFalsy();
            TestFramework.expect(StateManager.hasError()).toBeFalsy();
            TestFramework.expect(StateManager.getCurrentLocationData()).toBeNull();
        });
    });

    TestFramework.describe('Complex State Scenarios', () => {
        TestFramework.it('should maintain state independence', () => {
            // Set weather data
            const weatherData = { location: 'Paris' };
            StateManager.setWeatherData(weatherData);

            // Set loading to true
            StateManager.setLoading(true);

            // Weather data should remain unchanged when loading state changes
            TestFramework.expect(StateManager.getWeatherData()).toBe(weatherData);
            TestFramework.expect(StateManager.isLoading()).toBeTruthy();

            // Set error state
            StateManager.setError(true);

            // Previous states should remain unchanged
            TestFramework.expect(StateManager.getWeatherData()).toBe(weatherData);
            TestFramework.expect(StateManager.isLoading()).toBeTruthy();
            TestFramework.expect(StateManager.hasError()).toBeTruthy();
        });

        TestFramework.it('should handle rapid state changes', () => {
            // Rapid weather data changes
            const weatherData1 = { location: 'London' };
            const weatherData2 = { location: 'Paris' };
            const weatherData3 = { location: 'Tokyo' };

            StateManager.setWeatherData(weatherData1);
            StateManager.setWeatherData(weatherData2);
            StateManager.setWeatherData(weatherData3);

            TestFramework.expect(StateManager.getWeatherData()).toBe(weatherData3);

            // Rapid loading state changes
            StateManager.setLoading(true);
            StateManager.setLoading(false);
            StateManager.setLoading(true);

            TestFramework.expect(StateManager.isLoading()).toBeTruthy();
        });

        TestFramework.it('should handle mixed data types', () => {
            // Test with various data types
            StateManager.setWeatherData(42);
            TestFramework.expect(StateManager.getWeatherData()).toBe(42);

            StateManager.setWeatherData('string data');
            TestFramework.expect(StateManager.getWeatherData()).toBe('string data');

            StateManager.setWeatherData([1, 2, 3]);
            TestFramework.expect(StateManager.getWeatherData()).toEqual([1, 2, 3]);

            StateManager.setCurrentLocationData({ complex: { nested: 'object' } });
            TestFramework.expect(StateManager.getCurrentLocationData()).toEqual({ complex: { nested: 'object' } });
        });
    });
});

TestFramework.describe('AppState Direct Access', () => {
    TestFramework.it('should have correct default values', () => {
        StateManager.reset();
        
        TestFramework.expect(AppState.isUsingCurrentLocation).toBeTruthy();
        TestFramework.expect(AppState.currentWeatherData).toBeNull();
        TestFramework.expect(AppState.isLoading).toBeFalsy();
        TestFramework.expect(AppState.hasError).toBeFalsy();
        TestFramework.expect(AppState.currentLocation).toBeNull();
    });

    TestFramework.it('should allow direct state modification through StateManager', () => {
        StateManager.reset();
        
        // Direct modification should work through StateManager methods
        StateManager.setCurrentLocation(false);
        TestFramework.expect(AppState.isUsingCurrentLocation).toBeFalsy();

        StateManager.setLoading(true);
        TestFramework.expect(AppState.isLoading).toBeTruthy();

        const testData = { test: true };
        StateManager.setWeatherData(testData);
        TestFramework.expect(AppState.currentWeatherData).toBe(testData);
    });
});