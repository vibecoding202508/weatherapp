// Test Data and Mock Helpers

const TestData = {
    // Mock weather API response
    mockWeatherData: {
        location: {
            name: "London",
            region: "City of London, Greater London",
            country: "United Kingdom",
            lat: 51.52,
            lon: -0.11,
            tz_id: "Europe/London",
            localtime_epoch: 1703098200,
            localtime: "2023-12-20 15:30"
        },
        current: {
            last_updated_epoch: 1703098200,
            last_updated: "2023-12-20 15:30",
            temp_c: 12.0,
            temp_f: 53.6,
            is_day: 1,
            condition: {
                text: "Partly cloudy",
                icon: "//cdn.weatherapi.com/weather/64x64/day/116.png",
                code: 1003
            },
            wind_mph: 6.9,
            wind_kph: 11.2,
            wind_degree: 240,
            wind_dir: "WSW",
            pressure_mb: 1013.0,
            pressure_in: 29.91,
            precip_mm: 0.0,
            precip_in: 0.0,
            humidity: 76,
            cloud: 75,
            feelslike_c: 11.1,
            feelslike_f: 52.0,
            vis_km: 10.0,
            vis_miles: 6.0,
            uv: 2.0,
            gust_mph: 13.9,
            gust_kph: 22.3
        },
        forecast: {
            forecastday: [
                {
                    date: "2023-12-20",
                    date_epoch: 1703030400,
                    day: {
                        maxtemp_c: 14.0,
                        maxtemp_f: 57.2,
                        mintemp_c: 8.0,
                        mintemp_f: 46.4,
                        avgtemp_c: 11.0,
                        avgtemp_f: 51.8,
                        maxwind_mph: 8.1,
                        maxwind_kph: 13.0,
                        totalprecip_mm: 0.0,
                        totalprecip_in: 0.0,
                        totalsnow_cm: 0.0,
                        avgvis_km: 10.0,
                        avgvis_miles: 6.0,
                        avghumidity: 76.0,
                        daily_will_it_rain: 0,
                        daily_chance_of_rain: 0,
                        daily_will_it_snow: 0,
                        daily_chance_of_snow: 0,
                        condition: {
                            text: "Partly cloudy",
                            icon: "//cdn.weatherapi.com/weather/64x64/day/116.png",
                            code: 1003
                        },
                        uv: 2.0
                    }
                },
                {
                    date: "2023-12-21",
                    date_epoch: 1703116800,
                    day: {
                        maxtemp_c: 13.0,
                        maxtemp_f: 55.4,
                        mintemp_c: 7.0,
                        mintemp_f: 44.6,
                        avgtemp_c: 10.0,
                        avgtemp_f: 50.0,
                        maxwind_mph: 9.2,
                        maxwind_kph: 14.8,
                        totalprecip_mm: 2.5,
                        totalprecip_in: 0.1,
                        totalsnow_cm: 0.0,
                        avgvis_km: 8.0,
                        avgvis_miles: 5.0,
                        avghumidity: 82.0,
                        daily_will_it_rain: 1,
                        daily_chance_of_rain: 80,
                        daily_will_it_snow: 0,
                        daily_chance_of_snow: 0,
                        condition: {
                            text: "Light rain",
                            icon: "//cdn.weatherapi.com/weather/64x64/day/296.png",
                            code: 1183
                        },
                        uv: 1.0
                    }
                },
                {
                    date: "2023-12-22",
                    date_epoch: 1703203200,
                    day: {
                        maxtemp_c: 15.0,
                        maxtemp_f: 59.0,
                        mintemp_c: 9.0,
                        mintemp_f: 48.2,
                        avgtemp_c: 12.0,
                        avgtemp_f: 53.6,
                        maxwind_mph: 6.3,
                        maxwind_kph: 10.1,
                        totalprecip_mm: 0.0,
                        totalprecip_in: 0.0,
                        totalsnow_cm: 0.0,
                        avgvis_km: 12.0,
                        avgvis_miles: 7.0,
                        avghumidity: 70.0,
                        daily_will_it_rain: 0,
                        daily_chance_of_rain: 0,
                        daily_will_it_snow: 0,
                        daily_chance_of_snow: 0,
                        condition: {
                            text: "Sunny",
                            icon: "//cdn.weatherapi.com/weather/64x64/day/113.png",
                            code: 1000
                        },
                        uv: 3.0
                    }
                }
            ]
        }
    },

    // Mock weather data with extreme conditions
    mockExtremeWeatherData: {
        location: {
            name: "Test City",
            region: "Test Region",
            country: "Test Country",
            lat: 45.0,
            lon: 0.0
        },
        current: {
            temp_c: -15.0,
            temp_f: 5.0,
            is_day: 0,
            condition: {
                text: "Heavy snow",
                icon: "//cdn.weatherapi.com/weather/64x64/night/338.png",
                code: 1225
            },
            wind_kph: 45.0,
            wind_dir: "N",
            humidity: 95,
            feelslike_c: -25.0,
            feelslike_f: -13.0,
            vis_km: 0.5,
            uv: 0.0
        }
    },

    // Mock location data
    mockLocation: {
        name: "Paris",
        region: "Ile-de-France",
        country: "France"
    },

    // Mock RSS alert data
    mockAlertRSSData: `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0">
        <channel>
            <title>MeteoAlarm - France</title>
            <description>Weather warnings for France</description>
            <item>
                <title>Orange Wind Warning - Paris</title>
                <description>Strong winds expected with gusts up to 90 km/h. Take extra care outdoors.</description>
                <pubDate>Mon, 20 Dec 2023 08:00:00 GMT</pubDate>
                <guid>alert-001</guid>
            </item>
            <item>
                <title>Yellow Rain Warning - Ile-de-France</title>
                <description>Heavy rain expected. Possible flooding in low-lying areas.</description>
                <pubDate>Mon, 20 Dec 2023 06:00:00 GMT</pubDate>
                <guid>alert-002</guid>
            </item>
        </channel>
    </rss>`,

    // Mock coordinates
    mockCoordinates: {
        latitude: 48.8566,
        longitude: 2.3522
    },

    // Mock geolocation position
    mockPosition: {
        coords: {
            latitude: 48.8566,
            longitude: 2.3522,
            accuracy: 10
        },
        timestamp: Date.now()
    }
};

// Mock DOM helpers
const MockDOM = {
    // Create a mock DOM element
    createElement: (tagName, attributes = {}) => {
        const element = {
            tagName: tagName.toUpperCase(),
            id: attributes.id || '',
            className: '',
            classList: {
                add: function(className) { this.className += ` ${className}`.trim(); },
                remove: function(className) { 
                    this.className = this.className.replace(new RegExp(`\\b${className}\\b`, 'g'), '').trim();
                },
                contains: function(className) { return this.className.includes(className); },
                toggle: function(className) {
                    if (this.contains(className)) {
                        this.remove(className);
                    } else {
                        this.add(className);
                    }
                }
            },
            style: {},
            textContent: '',
            innerHTML: '',
            addEventListener: TestRunner.fn(),
            removeEventListener: TestRunner.fn(),
            appendChild: TestRunner.fn(),
            removeChild: TestRunner.fn(),
            querySelector: TestRunner.fn(),
            querySelectorAll: TestRunner.fn(),
            getAttribute: TestRunner.fn(),
            setAttribute: TestRunner.fn(),
            removeAttribute: TestRunner.fn(),
            dispatchEvent: TestRunner.fn()
        };

        // Apply initial attributes
        Object.keys(attributes).forEach(key => {
            if (key === 'textContent' || key === 'innerHTML') {
                element[key] = attributes[key];
            } else {
                element.setAttribute(key, attributes[key]);
            }
        });

        return element;
    },

    // Mock document object
    mockDocument: {
        getElementById: TestRunner.fn(),
        createElement: TestRunner.fn(),
        addEventListener: TestRunner.fn(),
        querySelector: TestRunner.fn(),
        querySelectorAll: TestRunner.fn(),
        body: {
            classList: {
                add: TestRunner.fn(),
                remove: TestRunner.fn(),
                contains: TestRunner.fn(),
                toggle: TestRunner.fn()
            }
        }
    },

    // Mock window object
    mockWindow: {
        localStorage: {
            getItem: TestRunner.fn(),
            setItem: TestRunner.fn(),
            removeItem: TestRunner.fn(),
            clear: TestRunner.fn()
        },
        addEventListener: TestRunner.fn(),
        removeEventListener: TestRunner.fn(),
        navigator: {
            geolocation: {
                getCurrentPosition: TestRunner.fn(),
                watchPosition: TestRunner.fn(),
                clearWatch: TestRunner.fn()
            }
        },
        fetch: TestRunner.fn()
    }
};

// Mock API responses
const MockAPI = {
    // Successful weather API response
    successResponse: (data = TestData.mockWeatherData) => ({
        ok: true,
        status: 200,
        json: () => Promise.resolve(data),
        text: () => Promise.resolve(JSON.stringify(data))
    }),

    // Error API response
    errorResponse: (status = 400, message = 'Bad Request') => ({
        ok: false,
        status: status,
        statusText: message,
        json: () => Promise.reject(new Error('Failed to parse JSON')),
        text: () => Promise.resolve('')
    }),

    // Network error
    networkError: () => Promise.reject(new Error('Network error')),

    // Mock fetch for successful response
    mockFetchSuccess: (data) => {
        const mockFetch = TestRunner.fn().mockReturnValue(
            Promise.resolve(MockAPI.successResponse(data))
        );
        global.fetch = mockFetch;
        window.fetch = mockFetch;
        return mockFetch;
    },

    // Mock fetch for error response
    mockFetchError: (status, message) => {
        const mockFetch = TestRunner.fn().mockReturnValue(
            Promise.resolve(MockAPI.errorResponse(status, message))
        );
        global.fetch = mockFetch;
        window.fetch = mockFetch;
        return mockFetch;
    },

    // Mock fetch for network error
    mockFetchNetworkError: () => {
        const mockFetch = TestRunner.fn().mockReturnValue(MockAPI.networkError());
        global.fetch = mockFetch;
        window.fetch = mockFetch;
        return mockFetch;
    }
};

// Test utilities
const TestUtils = {
    // Setup DOM mocks
    setupDOMMocks: () => {
        // Mock document methods
        global.document = MockDOM.mockDocument;
        window.document = MockDOM.mockDocument;
        
        // Setup common DOM elements
        const mockElements = {
            'loading': MockDOM.createElement('div', { id: 'loading' }),
            'error': MockDOM.createElement('div', { id: 'error' }),
            'error-message': MockDOM.createElement('p', { id: 'error-message' }),
            'weather-content': MockDOM.createElement('div', { id: 'weather-content' }),
            'location': MockDOM.createElement('span', { id: 'location' }),
            'current-temp': MockDOM.createElement('span', { id: 'current-temp' }),
            'current-icon': MockDOM.createElement('img', { id: 'current-icon' }),
            'current-condition': MockDOM.createElement('h3', { id: 'current-condition' }),
            'feels-like': MockDOM.createElement('p', { id: 'feels-like' }),
            'humidity': MockDOM.createElement('span', { id: 'humidity' }),
            'wind': MockDOM.createElement('span', { id: 'wind' }),
            'uv-index': MockDOM.createElement('span', { id: 'uv-index' }),
            'uv-warning': MockDOM.createElement('div', { id: 'uv-warning' }),
            'visibility': MockDOM.createElement('span', { id: 'visibility' }),
            'forecast-container': MockDOM.createElement('div', { id: 'forecast-container' }),
            'weather-alerts': MockDOM.createElement('div', { id: 'weather-alerts' }),
            'alerts-container': MockDOM.createElement('div', { id: 'alerts-container' }),
            'location-search': MockDOM.createElement('input', { id: 'location-search', type: 'text' }),
            'search-btn': MockDOM.createElement('button', { id: 'search-btn' }),
            'current-location-btn': MockDOM.createElement('button', { id: 'current-location-btn' }),
            'dark-mode-toggle': MockDOM.createElement('div', { id: 'dark-mode-toggle' }),
            'toggle-icon': MockDOM.createElement('i', { id: 'toggle-icon' })
        };

        // Mock getElementById to return our mock elements
        MockDOM.mockDocument.getElementById.mockImplementation((id) => mockElements[id] || null);
        
        // Setup specific element behaviors for common use cases
        // Loading element should return a mock paragraph when querySelector('p') is called
        const mockLoadingText = MockDOM.createElement('p', { textContent: '' });
        mockElements['loading'].querySelector.mockImplementation((selector) => {
            if (selector === 'p') return mockLoadingText;
            return null;
        });
        
        // Recreate the global DOM object with mock elements
        // This fixes the "Cannot read properties of undefined (reading 'loading')" error
        if (typeof window !== 'undefined' && typeof DOM !== 'undefined') {
            // Override the existing DOM object with mock elements
            window.DOM = {
                // Main app elements
                loading: mockElements['loading'],
                error: mockElements['error'],
                errorMessage: mockElements['error-message'],
                weatherContent: mockElements['weather-content'],

                // Weather data elements
                location: mockElements['location'],
                currentTemp: mockElements['current-temp'],
                currentIcon: mockElements['current-icon'],
                currentCondition: mockElements['current-condition'],
                feelsLike: mockElements['feels-like'],
                visibility: mockElements['visibility'],
                humidity: mockElements['humidity'],
                wind: mockElements['wind'],
                uvIndex: mockElements['uv-index'],
                uvWarning: mockElements['uv-warning'],
                forecastContainer: mockElements['forecast-container'],

                // Weather alerts elements
                weatherAlerts: mockElements['weather-alerts'],
                alertsContainer: mockElements['alerts-container'],

                // Search elements
                locationSearch: mockElements['location-search'],
                searchBtn: mockElements['search-btn'],
                currentLocationBtn: mockElements['current-location-btn'],

                // Dark mode elements
                darkModeToggle: mockElements['dark-mode-toggle'],
                toggleIcon: mockElements['toggle-icon']
            };
            
            // Also set it globally for scripts that might access it differently
            global.DOM = window.DOM;
        }
        
        return mockElements;
    },

    // Setup geolocation mocks
    setupGeolocationMocks: () => {
        const mockGeolocation = {
            getCurrentPosition: TestRunner.fn(),
            watchPosition: TestRunner.fn(),
            clearWatch: TestRunner.fn()
        };

        global.navigator = { geolocation: mockGeolocation };
        window.navigator = { geolocation: mockGeolocation };

        return mockGeolocation;
    },

    // Setup localStorage mocks
    setupLocalStorageMocks: () => {
        const storage = {};
        const mockLocalStorage = {
            getItem: TestRunner.fn((key) => storage[key] || null),
            setItem: TestRunner.fn((key, value) => { storage[key] = value; }),
            removeItem: TestRunner.fn((key) => { delete storage[key]; }),
            clear: TestRunner.fn(() => { Object.keys(storage).forEach(key => delete storage[key]); })
        };

        global.localStorage = mockLocalStorage;
        window.localStorage = mockLocalStorage;

        return mockLocalStorage;
    },

    // Store original App functions for restoration
    _originalAppFunctions: {},
    
    // Store original App function references
    storeOriginalAppFunctions: () => {
        if (typeof App !== 'undefined') {
            TestUtils._originalAppFunctions.handleError = App.handleError;
            TestUtils._originalAppFunctions.initialize = App.initialize;
            TestUtils._originalAppFunctions.startApp = App.startApp;
        }
        if (typeof DarkMode !== 'undefined') {
            TestUtils._originalAppFunctions.darkModeInit = DarkMode.initialize;
        }
        if (typeof Search !== 'undefined') {
            TestUtils._originalAppFunctions.searchInit = Search.initialize;
        }
    },
    
    // Reset all mocks
    resetMocks: () => {
        // Clear all mock calls
        Object.values(MockDOM.mockDocument).forEach(mock => {
            if (mock && mock.mockClear) mock.mockClear();
        });

        if (global.fetch && global.fetch.mockClear) {
            global.fetch.mockClear();
        }

        if (global.navigator && global.navigator.geolocation) {
            Object.values(global.navigator.geolocation).forEach(mock => {
                if (mock && mock.mockClear) mock.mockClear();
            });
        }

        if (global.localStorage) {
            Object.values(global.localStorage).forEach(mock => {
                if (mock && mock.mockClear) mock.mockClear();
            });
        }
        
        // Restore original App functions if they were stored
        if (typeof App !== 'undefined' && TestUtils._originalAppFunctions) {
            if (TestUtils._originalAppFunctions.handleError) {
                App.handleError = TestUtils._originalAppFunctions.handleError;
            }
            if (TestUtils._originalAppFunctions.initialize) {
                App.initialize = TestUtils._originalAppFunctions.initialize;
            }
            if (TestUtils._originalAppFunctions.startApp) {
                App.startApp = TestUtils._originalAppFunctions.startApp;
            }
        }
        // Restore DarkMode and Search functions
        if (typeof DarkMode !== 'undefined' && TestUtils._originalAppFunctions?.darkModeInit) {
            DarkMode.initialize = TestUtils._originalAppFunctions.darkModeInit;
        }
        if (typeof Search !== 'undefined' && TestUtils._originalAppFunctions?.searchInit) {
            Search.initialize = TestUtils._originalAppFunctions.searchInit;
        }
    },

    // Create test DOM element
    createTestElement: (tag = 'div', attributes = {}) => {
        return TestRunner.createTestElement(tag, attributes);
    },

    // Simulate user interaction
    simulateEvent: (element, eventType, eventData = {}) => {
        return TestRunner.simulateEvent(element, eventType, eventData);
    },

    // Wait for async operations
    wait: (ms = 0) => {
        return TestRunner.wait(ms);
    }
};

// Export for use in tests
if (typeof window !== 'undefined') {
    window.TestData = TestData;
    window.MockDOM = MockDOM;
    window.MockAPI = MockAPI;
    window.TestUtils = TestUtils;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TestData, MockDOM, MockAPI, TestUtils };
}