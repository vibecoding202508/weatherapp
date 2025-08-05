// Weather History Tests

TestFramework.describe('WeatherHistory', () => {
    // Reset history and localStorage before each test
    TestFramework.beforeEach(() => {
        if (typeof WeatherHistory !== 'undefined') {
            // Ensure completely clean state for testing
            WeatherHistory._historyData = [];
            try {
                localStorage.removeItem('weather-history');
                localStorage.clear(); // Clear all localStorage to be safe
            } catch (e) {
                // Ignore localStorage errors in test environment
            }
        }
    });

    TestFramework.describe('Module Availability', () => {
        TestFramework.it('should exist as a global object', () => {
            TestFramework.expect(typeof WeatherHistory).toBe('object');
        });

        TestFramework.it('should have required functions', () => {
            TestFramework.expect(typeof WeatherHistory.initialize).toBe('function');
            TestFramework.expect(typeof WeatherHistory.addToHistory).toBe('function');
            TestFramework.expect(typeof WeatherHistory.getHistory).toBe('function');
            TestFramework.expect(typeof WeatherHistory.clearHistory).toBe('function');
            TestFramework.expect(typeof WeatherHistory.removeHistoryItem).toBe('function');
            TestFramework.expect(typeof WeatherHistory.searchFromHistory).toBe('function');
            TestFramework.expect(typeof WeatherHistory.updateHistoryUI).toBe('function');
        });
    });

    TestFramework.describe('History Data Management', () => {
        TestFramework.it('should start with empty history', () => {
            // Explicitly clear history at the start of this test
            WeatherHistory._historyData = [];
            
            // Test that getHistory returns empty array when no data is stored
            const history = WeatherHistory.getHistory();
            TestFramework.expect(history.length).toBe(0);
        });

        TestFramework.it('should add weather data to history', () => {
            // Explicitly clear history at the start of this test
            WeatherHistory._historyData = [];
            
            const mockWeatherData = {
                location: {
                    name: 'London',
                    country: 'United Kingdom',
                    region: 'England',
                    lat: 51.52,
                    lon: -0.11
                },
                current: {
                    temp_c: 20,
                    temp_f: 68,
                    condition: {
                        text: 'Sunny',
                        icon: '//cdn.weatherapi.com/weather/64x64/day/113.png'
                    },
                    humidity: 65,
                    wind_kph: 10,
                    wind_mph: 6,
                    wind_dir: 'SW',
                    uv: 5,
                    vis_km: 10,
                    vis_miles: 6
                }
            };

            WeatherHistory.addToHistory(mockWeatherData);
            const history = WeatherHistory.getHistory();
            
            TestFramework.expect(history.length).toBe(1);
            TestFramework.expect(history[0].location.name).toBe('London');
            TestFramework.expect(history[0].current.temp_c).toBe(20);
        });

        TestFramework.it('should handle invalid weather data gracefully', () => {
            // Explicitly clear history at the start of this test
            WeatherHistory._historyData = [];
            
            WeatherHistory.addToHistory(null);
            WeatherHistory.addToHistory(undefined);
            WeatherHistory.addToHistory({});
            WeatherHistory.addToHistory({ location: null });

            const history = WeatherHistory.getHistory();
            TestFramework.expect(history.length).toBe(0);
        });

        TestFramework.it('should prevent duplicate locations', () => {
            // Explicitly clear history at the start of this test
            WeatherHistory._historyData = [];
            
            const mockWeatherData = {
                location: {
                    name: 'Paris',
                    country: 'France',
                    lat: 48.85,
                    lon: 2.35
                },
                current: {
                    temp_c: 18,
                    temp_f: 64,
                    condition: { text: 'Cloudy', icon: '' },
                    humidity: 70, wind_kph: 8, wind_mph: 5, wind_dir: 'N',
                    uv: 3, vis_km: 8, vis_miles: 5
                }
            };

            // Add same location twice
            WeatherHistory.addToHistory(mockWeatherData);
            WeatherHistory.addToHistory(mockWeatherData);

            const history = WeatherHistory.getHistory();
            TestFramework.expect(history.length).toBe(1);
        });

        TestFramework.it('should limit history to maximum items', () => {
            // Explicitly clear history at the start of this test
            WeatherHistory._historyData = [];
            
            const originalMaxItems = WeatherHistory._maxHistoryItems;
            WeatherHistory._maxHistoryItems = 3; // Temporarily set to 3 for testing

            // Add 5 different locations
            for (let i = 0; i < 5; i++) {
                WeatherHistory.addToHistory({
                    location: {
                        name: `City${i}`,
                        country: 'Test Country',
                        lat: i,
                        lon: i
                    },
                    current: {
                        temp_c: 20 + i,
                        temp_f: 68 + i,
                        condition: { text: 'Sunny', icon: '' },
                        humidity: 60, wind_kph: 10, wind_mph: 6, wind_dir: 'N',
                        uv: 5, vis_km: 10, vis_miles: 6
                    }
                });
            }

            const history = WeatherHistory.getHistory();
            TestFramework.expect(history.length).toBe(3);
            TestFramework.expect(history[0].location.name).toBe('City4'); // Most recent should be first

            // Restore original max items
            WeatherHistory._maxHistoryItems = originalMaxItems;
        });
    });

    TestFramework.describe('History Item Management', () => {
        TestFramework.it('should get history item by ID', () => {
            // Explicitly clear history at the start of this test
            WeatherHistory._historyData = [];
            
            const mockWeatherData = {
                location: { name: 'Berlin', country: 'Germany', lat: 52.52, lon: 13.40 },
                current: {
                    temp_c: 15, temp_f: 59,
                    condition: { text: 'Rainy', icon: '' },
                    humidity: 80, wind_kph: 12, wind_mph: 7, wind_dir: 'W',
                    uv: 2, vis_km: 5, vis_miles: 3
                }
            };

            WeatherHistory.addToHistory(mockWeatherData);
            const history = WeatherHistory.getHistory();
            const itemId = history[0].id;

            const item = WeatherHistory.getHistoryItem(itemId);
            TestFramework.expect(item).not.toBeNull();
            TestFramework.expect(item.location.name).toBe('Berlin');
        });

        TestFramework.it('should remove specific history item', () => {
            // Explicitly clear history at the start of this test
            WeatherHistory._historyData = [];
            
            const mockWeatherData1 = {
                location: { name: 'Madrid', country: 'Spain', lat: 40.42, lon: -3.70 },
                current: {
                    temp_c: 22, temp_f: 72,
                    condition: { text: 'Sunny', icon: '' },
                    humidity: 45, wind_kph: 5, wind_mph: 3, wind_dir: 'E',
                    uv: 7, vis_km: 15, vis_miles: 9
                }
            };

            const mockWeatherData2 = {
                location: { name: 'Rome', country: 'Italy', lat: 41.90, lon: 12.50 },
                current: {
                    temp_c: 24, temp_f: 75,
                    condition: { text: 'Clear', icon: '' },
                    humidity: 50, wind_kph: 7, wind_mph: 4, wind_dir: 'S',
                    uv: 8, vis_km: 12, vis_miles: 7
                }
            };

            // Store original Date.now to restore later
            const originalDateNow = Date.now;
            let counter = 1000000; // Start with a large number to ensure uniqueness
            
            // Mock Date.now to return unique timestamps
            Date.now = () => counter++;
            
            WeatherHistory.addToHistory(mockWeatherData1);
            WeatherHistory.addToHistory(mockWeatherData2);
            
            // Restore original Date.now
            Date.now = originalDateNow;

            let history = WeatherHistory.getHistory();
            TestFramework.expect(history.length).toBe(2);

            // Rome should be at index 0 (most recent), Madrid at index 1
            TestFramework.expect(history[0].location.name).toBe('Rome');
            TestFramework.expect(history[1].location.name).toBe('Madrid');

            const itemToRemove = history[0].id; // Remove Rome
            WeatherHistory.removeHistoryItem(itemToRemove);

            history = WeatherHistory.getHistory();
            TestFramework.expect(history.length).toBe(1);
            TestFramework.expect(history[0].location.name).toBe('Madrid');
        });

        TestFramework.it('should clear all history', () => {
            // Explicitly clear history at the start of this test
            WeatherHistory._historyData = [];
            
            // Add multiple items
            for (let i = 0; i < 3; i++) {
                WeatherHistory.addToHistory({
                    location: { name: `City${i}`, country: 'Test', lat: i, lon: i },
                    current: {
                        temp_c: 20, temp_f: 68,
                        condition: { text: 'Sunny', icon: '' },
                        humidity: 60, wind_kph: 10, wind_mph: 6, wind_dir: 'N',
                        uv: 5, vis_km: 10, vis_miles: 6
                    }
                });
            }

            TestFramework.expect(WeatherHistory.getHistory().length).toBe(3);

            WeatherHistory.clearHistory();
            TestFramework.expect(WeatherHistory.getHistory().length).toBe(0);
        });
    });

    TestFramework.describe('Search Term Generation', () => {
        TestFramework.it('should generate search terms correctly', () => {
            const locationWithRegion = {
                name: 'New York',
                region: 'New York State', 
                country: 'USA'
            };

            const locationWithoutRegion = {
                name: 'Tokyo',
                region: 'Tokyo',
                country: 'Japan'
            };

            const mockWeatherData1 = {
                location: locationWithRegion,
                current: {
                    temp_c: 25, temp_f: 77,
                    condition: { text: 'Sunny', icon: '' },
                    humidity: 55, wind_kph: 8, wind_mph: 5, wind_dir: 'N',
                    uv: 6, vis_km: 12, vis_miles: 7
                }
            };

            const mockWeatherData2 = {
                location: locationWithoutRegion,
                current: {
                    temp_c: 28, temp_f: 82,
                    condition: { text: 'Clear', icon: '' },
                    humidity: 65, wind_kph: 3, wind_mph: 2, wind_dir: 'E',
                    uv: 9, vis_km: 20, vis_miles: 12
                }
            };

            WeatherHistory.addToHistory(mockWeatherData1);
            WeatherHistory.addToHistory(mockWeatherData2);

            const history = WeatherHistory.getHistory();
            
            // Should include region if different from name
            TestFramework.expect(history[1].searchTerm).toBe('New York, New York State, USA');
            
            // Should not duplicate region if same as name
            TestFramework.expect(history[0].searchTerm).toBe('Tokyo, Japan');
        });
    });

    TestFramework.describe('Statistics and Analysis', () => {
        TestFramework.it('should provide correct statistics', () => {
            // Explicitly clear history at the start of this test
            WeatherHistory._historyData = [];
            
            // Add weather data from different countries
            const locations = [
                { name: 'London', country: 'UK', temp: 20 },
                { name: 'Paris', country: 'France', temp: 22 },
                { name: 'Berlin', country: 'Germany', temp: 18 },
                { name: 'Madrid', country: 'Spain', temp: 25 }
            ];

            locations.forEach((loc, i) => {
                WeatherHistory.addToHistory({
                    location: { name: loc.name, country: loc.country, lat: i, lon: i },
                    current: {
                        temp_c: loc.temp, temp_f: loc.temp * 1.8 + 32,
                        condition: { text: 'Sunny', icon: '' },
                        humidity: 60, wind_kph: 10, wind_mph: 6, wind_dir: 'N',
                        uv: 5, vis_km: 10, vis_miles: 6
                    }
                });
            });

            const stats = WeatherHistory.getStatistics();
            
            TestFramework.expect(stats.totalLocations).toBe(4);
            TestFramework.expect(stats.countries).toBe(4); // 4 different countries
            TestFramework.expect(stats.averageTemp).toBe(21); // (20+22+18+25)/4 = 21.25, rounded to 21
            TestFramework.expect(stats.mostRecentSearch).not.toBeNull();
            TestFramework.expect(stats.oldestSearch).not.toBeNull();
        });

        TestFramework.it('should handle empty history statistics', () => {
            // Explicitly clear history at the start of this test
            WeatherHistory._historyData = [];
            
            const stats = WeatherHistory.getStatistics();
            
            TestFramework.expect(stats.totalLocations).toBe(0);
            TestFramework.expect(stats.countries).toBe(0);
            TestFramework.expect(stats.averageTemp).toBe(0);
            TestFramework.expect(stats.mostRecentSearch).toBeNull();
            TestFramework.expect(stats.oldestSearch).toBeNull();
        });
    });

    TestFramework.describe('LocalStorage Integration', () => {
        TestFramework.it('should save and load history from localStorage', () => {
            // Explicitly clear both memory and localStorage at the start of this test
            WeatherHistory._historyData = [];
            try {
                localStorage.removeItem('weather-history');
            } catch (e) {
                // Ignore localStorage errors in test environment
            }
            
            const mockWeatherData = {
                location: { name: 'Stockholm', country: 'Sweden', lat: 59.33, lon: 18.07 },
                current: {
                    temp_c: 12, temp_f: 54,
                    condition: { text: 'Cloudy', icon: '' },
                    humidity: 75, wind_kph: 15, wind_mph: 9, wind_dir: 'N',
                    uv: 2, vis_km: 8, vis_miles: 5
                }
            };

            WeatherHistory.addToHistory(mockWeatherData);
            
            // Manually trigger save
            WeatherHistory.saveToStorage();
            
            // Clear in-memory data
            WeatherHistory._historyData = [];
            
            // Load from storage
            WeatherHistory.loadFromStorage();
            
            const history = WeatherHistory.getHistory();
            TestFramework.expect(history.length).toBe(1);
            TestFramework.expect(history[0].location.name).toBe('Stockholm');
        });

        TestFramework.it('should handle localStorage errors gracefully', () => {
            // Store original methods
            const originalSetItem = localStorage.setItem;
            const originalGetItem = localStorage.getItem;
            const originalConsoleWarn = console.warn;
            
            // Track warnings
            let warningCalled = false;
            console.warn = (message) => {
                if (message.includes('Failed to save weather history') || message.includes('Failed to load weather history')) {
                    warningCalled = true;
                }
            };
            
            // Mock localStorage to throw errors
            localStorage.setItem = () => { throw new Error('Storage full'); };
            localStorage.getItem = () => { throw new Error('Storage error'); };
            
            // These should not throw but should log warnings
            TestFramework.expect(() => WeatherHistory.saveToStorage()).not.toThrow();
            TestFramework.expect(() => WeatherHistory.loadFromStorage()).not.toThrow();
            
            // Verify that warnings were logged (proving error handling worked)
            TestFramework.expect(warningCalled).toBe(true);
            
            // Restore all original methods
            localStorage.setItem = originalSetItem;
            localStorage.getItem = originalGetItem;
            console.warn = originalConsoleWarn;
        });
    });

    TestFramework.describe('Time Formatting', () => {
        TestFramework.it('should format time ago correctly', () => {
            const now = new Date();
            
            // Test various time differences
            const oneMinuteAgo = new Date(now - 60000);
            const oneHourAgo = new Date(now - 3600000);
            const oneDayAgo = new Date(now - 86400000);
            const fiveSecondsAgo = new Date(now - 5000);
            
            TestFramework.expect(WeatherHistory._formatTimeAgo(oneMinuteAgo)).toBe('1 minute ago');
            TestFramework.expect(WeatherHistory._formatTimeAgo(oneHourAgo)).toBe('1 hour ago');
            TestFramework.expect(WeatherHistory._formatTimeAgo(oneDayAgo)).toBe('1 day ago');
            TestFramework.expect(WeatherHistory._formatTimeAgo(fiveSecondsAgo)).toBe('Just now');
        });
    });

    TestFramework.describe('UI Integration Tests', () => {
        TestFramework.it('should handle missing DOM elements gracefully', () => {
            // These should not throw even if DOM elements don't exist
            TestFramework.expect(() => WeatherHistory.updateHistoryUI()).not.toThrow();
            TestFramework.expect(() => WeatherHistory.toggleHistoryPanel()).not.toThrow();
            TestFramework.expect(() => WeatherHistory.initializeUI()).not.toThrow();
        });

        TestFramework.it('should handle search from history safely', () => {
            const mockHistoryItem = {
                id: 123,
                location: { name: 'Oslo', country: 'Norway' },
                searchTerm: 'Oslo, Norway'
            };

            // Should not throw even if Search module methods don't exist
            TestFramework.expect(() => WeatherHistory.searchFromHistory(mockHistoryItem)).not.toThrow();
            TestFramework.expect(() => WeatherHistory.searchFromHistory(null)).not.toThrow();
            TestFramework.expect(() => WeatherHistory.searchFromHistory({})).not.toThrow();
        });
    });
});