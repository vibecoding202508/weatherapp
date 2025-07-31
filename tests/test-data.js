// Test Data and Mocks for Weather App Tests

const TestData = {
    // Sample weather API response
    sampleWeatherData: {
        location: {
            name: "London",
            region: "City of London, Greater London",
            country: "United Kingdom",
            lat: 51.52,
            lon: -0.11,
            tz_id: "Europe/London",
            localtime_epoch: 1704067200,
            localtime: "2024-01-01 12:00"
        },
        current: {
            last_updated_epoch: 1704067200,
            last_updated: "2024-01-01 12:00",
            temp_c: 15.0,
            temp_f: 59.0,
            is_day: 1,
            condition: {
                text: "Partly cloudy",
                icon: "//cdn.weatherapi.com/weather/64x64/day/116.png",
                code: 1003
            },
            wind_mph: 6.9,
            wind_kph: 11.2,
            wind_degree: 230,
            wind_dir: "SW",
            pressure_mb: 1025.0,
            pressure_in: 30.27,
            precip_mm: 0.0,
            precip_in: 0.0,
            humidity: 65,
            cloud: 50,
            feelslike_c: 14.2,
            feelslike_f: 57.6,
            vis_km: 10.0,
            vis_miles: 6.0,
            uv: 4.0,
            gust_mph: 12.5,
            gust_kph: 20.2
        },
        forecast: {
            forecastday: [
                {
                    date: "2024-01-01",
                    date_epoch: 1704067200,
                    day: {
                        maxtemp_c: 18.0,
                        maxtemp_f: 64.4,
                        mintemp_c: 8.0,
                        mintemp_f: 46.4,
                        avgtemp_c: 13.0,
                        avgtemp_f: 55.4,
                        maxwind_mph: 10.5,
                        maxwind_kph: 16.9,
                        totalprecip_mm: 0.0,
                        totalprecip_in: 0.0,
                        avgvis_km: 10.0,
                        avgvis_miles: 6.0,
                        avghumidity: 65.0,
                        daily_will_it_rain: 0,
                        daily_chance_of_rain: 0,
                        daily_will_it_snow: 0,
                        daily_chance_of_snow: 0,
                        condition: {
                            text: "Partly cloudy",
                            icon: "//cdn.weatherapi.com/weather/64x64/day/116.png",
                            code: 1003
                        },
                        uv: 4.0
                    }
                }
            ]
        }
    },

    // Poor visibility weather data
    poorVisibilityWeatherData: {
        location: {
            name: "London",
            region: "City of London, Greater London",
            country: "United Kingdom"
        },
        current: {
            temp_c: 8.0,
            condition: {
                text: "Fog",
                icon: "//cdn.weatherapi.com/weather/64x64/day/248.png"
            },
            humidity: 95,
            wind_kph: 5.0,
            wind_dir: "N",
            vis_km: 0.5,
            uv: 1.0,
            feelslike_c: 6.0,
            is_day: 1
        },
        forecast: {
            forecastday: [
                {
                    date: "2024-01-01",
                    day: {
                        maxtemp_c: 10.0,
                        mintemp_c: 5.0,
                        condition: {
                            text: "Fog",
                            icon: "//cdn.weatherapi.com/weather/64x64/day/248.png"
                        },
                        daily_chance_of_rain: 20
                    }
                }
            ]
        }
    },

    // High UV weather data
    highUVWeatherData: {
        location: {
            name: "Miami",
            region: "Florida",
            country: "United States"
        },
        current: {
            temp_c: 28.0,
            condition: {
                text: "Sunny",
                icon: "//cdn.weatherapi.com/weather/64x64/day/113.png"
            },
            humidity: 70,
            wind_kph: 15.0,
            wind_dir: "E",
            vis_km: 20.0,
            uv: 8.0,
            feelslike_c: 32.0,
            is_day: 1
        },
        forecast: {
            forecastday: [
                {
                    date: "2024-01-01",
                    day: {
                        maxtemp_c: 30.0,
                        mintemp_c: 22.0,
                        condition: {
                            text: "Sunny",
                            icon: "//cdn.weatherapi.com/weather/64x64/day/113.png"
                        },
                        daily_chance_of_rain: 0
                    }
                }
            ]
        }
    },

    // Error response
    errorResponse: {
        error: {
            code: 1006,
            message: "No matching location found."
        }
    },

    // Visibility test cases
    visibilityTestCases: [
        { visibility: 0.1, condition: "Dense fog", expectedCategory: "Extremely Poor" },
        { visibility: 0.5, condition: "Fog", expectedCategory: "Very Poor" },
        { visibility: 1.5, condition: "Mist", expectedCategory: "Poor" },
        { visibility: 3.0, condition: "Haze", expectedCategory: "Moderate" },
        { visibility: 7.0, condition: "Light rain", expectedCategory: "Good" },
        { visibility: 15.0, condition: "Partly cloudy", expectedCategory: "Very Good" },
        { visibility: 25.0, condition: "Clear", expectedCategory: "Excellent" }
    ],

    // Mock DOM elements
    createMockDOM: () => {
        // Create mock DOM elements for testing
        const mockElements = {
            loading: { style: { display: 'none' }, querySelector: () => ({ textContent: '' }) },
            error: { style: { display: 'none' } },
            errorMessage: { textContent: '' },
            weatherContent: { style: { display: 'none' } },
            location: { textContent: '' },
            currentTemp: { textContent: '' },
            currentIcon: { src: '', alt: '' },
            currentCondition: { textContent: '' },
            feelsLike: { textContent: '' },
            visibility: { textContent: '' },
            humidity: { textContent: '' },
            wind: { textContent: '' },
            uvIndex: { textContent: '' },
            uvWarning: { style: { display: 'none' } },
            forecastContainer: { innerHTML: '', appendChild: () => {} },
            locationSearch: { value: '' },
            searchBtn: {},
            currentLocationBtn: {},
            darkModeToggle: {},
            toggleIcon: { className: '' }
        };

        // Mock document.getElementById
        document.getElementById = (id) => {
            return mockElements[id.replace('-', '')] || { 
                style: { display: 'none' }, 
                textContent: '', 
                innerHTML: '',
                classList: {
                    add: () => {},
                    remove: () => {},
                    contains: () => false,
                    toggle: () => {}
                }
            };
        };

        return mockElements;
    },

    // Mock localStorage
    createMockLocalStorage: () => {
        const storage = {};
        return {
            getItem: (key) => storage[key] || null,
            setItem: (key, value) => storage[key] = value,
            removeItem: (key) => delete storage[key],
            clear: () => Object.keys(storage).forEach(key => delete storage[key])
        };
    },

    // Mock fetch API
    createMockFetch: (responseData, shouldFail = false) => {
        return jest.fn(() => {
            if (shouldFail) {
                return Promise.reject(new Error('Network error'));
            }
            return Promise.resolve({
                ok: true,
                status: 200,
                json: () => Promise.resolve(responseData)
            });
        });
    },

    // Mock geolocation
    createMockGeolocation: (coords = { latitude: 51.5074, longitude: -0.1278 }, shouldFail = false) => {
        return {
            getCurrentPosition: (success, error) => {
                if (shouldFail) {
                    error({ code: 1, message: 'Permission denied' });
                } else {
                    success({ coords });
                }
            }
        };
    }
};

// Export for use in tests
window.TestData = TestData;