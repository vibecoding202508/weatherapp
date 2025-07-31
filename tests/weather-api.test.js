// Tests for Weather API Functionality

describe('Weather API', () => {
    let originalFetch;
    let originalNavigator;
    let originalDOM;
    let mockDOM;

    beforeEach(() => {
        // Mock fetch
        originalFetch = window.fetch;
        
        // Mock navigator.geolocation
        originalNavigator = window.navigator;
        
        // Mock DOM
        originalDOM = window.DOM;
        mockDOM = TestData.createMockDOM();
        window.DOM = mockDOM;

        // Mock API_KEY
        window.API_KEY = 'test_api_key_12345678';
    });

    afterEach(() => {
        window.fetch = originalFetch;
        window.navigator = originalNavigator;
        window.DOM = originalDOM;
    });

    it('should validate API key correctly', () => {
        window.API_KEY = 'valid_api_key_123';
        expect(WeatherAPI.checkAPIKey()).toBe(true);

        window.API_KEY = 'YOUR_API_KEY_HERE';
        expect(WeatherAPI.checkAPIKey()).toBe(false);

        window.API_KEY = 'short';
        expect(WeatherAPI.checkAPIKey()).toBe(false);

        window.API_KEY = '';
        expect(WeatherAPI.checkAPIKey()).toBe(false);
    });

    it('should handle successful weather data fetch', async () => {
        window.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                status: 200,
                json: () => Promise.resolve(TestData.sampleWeatherData)
            })
        );

        await WeatherAPI.fetchWeatherData(51.5074, -0.1278);

        expect(window.fetch).toHaveBeenCalledWith(
            expect.stringContaining('51.5074,-0.1278')
        );
    });

    it('should handle API error responses', async () => {
        window.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
                status: 400,
                statusText: 'Bad Request'
            })
        );

        await WeatherAPI.fetchWeatherData(51.5074, -0.1278);

        expect(window.fetch).toHaveBeenCalled();
        // Error should be displayed
    });

    it('should handle network errors', async () => {
        window.fetch = jest.fn(() =>
            Promise.reject(new Error('Network error'))
        );

        await WeatherAPI.fetchWeatherData(51.5074, -0.1278);

        expect(window.fetch).toHaveBeenCalled();
        // Error should be displayed
    });

    it('should validate coordinates before API call', async () => {
        window.fetch = jest.fn();

        await WeatherAPI.fetchWeatherData(91, 0); // Invalid latitude
        expect(window.fetch).not.toHaveBeenCalled();

        await WeatherAPI.fetchWeatherData(0, 181); // Invalid longitude
        expect(window.fetch).not.toHaveBeenCalled();
    });

    it('should handle location search successfully', async () => {
        window.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                status: 200,
                json: () => Promise.resolve(TestData.sampleWeatherData)
            })
        );

        await WeatherAPI.getWeatherDataByLocation('London');

        expect(window.fetch).toHaveBeenCalledWith(
            expect.stringContaining('London')
        );
    });

    it('should handle location not found error', async () => {
        window.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
                status: 400,
                statusText: 'Bad Request'
            })
        );

        await WeatherAPI.getWeatherDataByLocation('InvalidLocation123');

        expect(window.fetch).toHaveBeenCalled();
    });

    it('should handle geolocation success', (done) => {
        const mockGeolocation = {
            getCurrentPosition: jest.fn((success) => {
                success({
                    coords: {
                        latitude: 51.5074,
                        longitude: -0.1278
                    }
                });
            })
        };

        window.navigator = { geolocation: mockGeolocation };
        window.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                status: 200,
                json: () => Promise.resolve(TestData.sampleWeatherData)
            })
        );

        WeatherAPI.getWeatherData();

        setTimeout(() => {
            expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled();
            done();
        }, 100);
    });

    it('should handle geolocation errors', (done) => {
        const mockGeolocation = {
            getCurrentPosition: jest.fn((success, error) => {
                error({
                    code: 1,
                    message: 'Permission denied'
                });
            })
        };

        window.navigator = { geolocation: mockGeolocation };

        WeatherAPI.getWeatherData();

        setTimeout(() => {
            expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled();
            done();
        }, 100);
    });

    it('should handle missing geolocation support', () => {
        window.navigator = {};

        WeatherAPI.getWeatherData();

        // Should show error about geolocation not being supported
    });

    it('should refresh weather data correctly', () => {
        const originalGetWeatherData = WeatherAPI.getWeatherData;
        const originalGetWeatherDataByLocation = WeatherAPI.getWeatherDataByLocation;
        
        WeatherAPI.getWeatherData = jest.fn();
        WeatherAPI.getWeatherDataByLocation = jest.fn();

        // Mock StateManager
        window.StateManager = {
            getCurrentLocation: () => true,
            getWeatherData: () => null
        };

        WeatherAPI.refreshWeatherData();
        expect(WeatherAPI.getWeatherData).toHaveBeenCalled();

        // Test refresh with cached location data
        window.StateManager.getCurrentLocation = () => false;
        window.StateManager.getWeatherData = () => ({
            location: { name: 'London', country: 'UK' }
        });

        WeatherAPI.refreshWeatherData();
        expect(WeatherAPI.getWeatherDataByLocation).toHaveBeenCalledWith('London, UK');

        // Restore original functions
        WeatherAPI.getWeatherData = originalGetWeatherData;
        WeatherAPI.getWeatherDataByLocation = originalGetWeatherDataByLocation;
    });
});

describe('Weather API Integration', () => {
    let originalFetch;
    let originalDOM;

    beforeEach(() => {
        originalFetch = window.fetch;
        originalDOM = window.DOM;
        window.DOM = TestData.createMockDOM();
        window.API_KEY = 'test_api_key_12345678';
        
        // Mock WeatherDisplay and StateManager
        window.WeatherDisplay = {
            displayWeatherData: jest.fn()
        };
        window.StateManager = {
            setWeatherData: jest.fn(),
            getCurrentLocation: () => false,
            getWeatherData: () => null
        };
    });

    afterEach(() => {
        window.fetch = originalFetch;
        window.DOM = originalDOM;
    });

    it('should complete full weather data flow', async () => {
        window.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                status: 200,
                json: () => Promise.resolve(TestData.sampleWeatherData)
            })
        );

        await WeatherAPI.fetchWeatherData(51.5074, -0.1278);

        expect(window.fetch).toHaveBeenCalled();
        expect(StateManager.setWeatherData).toHaveBeenCalledWith(TestData.sampleWeatherData);
        expect(WeatherDisplay.displayWeatherData).toHaveBeenCalledWith(TestData.sampleWeatherData);
    });

    it('should handle complete location search flow', async () => {
        window.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                status: 200,
                json: () => Promise.resolve(TestData.sampleWeatherData)
            })
        );

        await WeatherAPI.getWeatherDataByLocation('London');

        expect(window.fetch).toHaveBeenCalledWith(
            expect.stringContaining('London')
        );
        expect(StateManager.setWeatherData).toHaveBeenCalled();
        expect(WeatherDisplay.displayWeatherData).toHaveBeenCalled();
    });

    it('should show loading state during API calls', async () => {
        window.fetch = jest.fn(() =>
            new Promise(resolve => {
                setTimeout(() => {
                    resolve({
                        ok: true,
                        status: 200,
                        json: () => Promise.resolve(TestData.sampleWeatherData)
                    });
                }, 100);
            })
        );

        const promise = WeatherAPI.getWeatherDataByLocation('London');
        
        // Should show loading state immediately
        expect(DOM.loading.style.display).toBe('flex');
        
        await promise;
    });
});