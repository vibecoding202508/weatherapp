// Search and Dark Mode Tests

describe('Search', () => {
    let mockElements;

    beforeEach(() => {
        mockElements = TestUtils.setupDOMMocks();
        StateManager.reset();
    });

    afterEach(() => {
        TestUtils.resetMocks();
    });

    describe('initialize', () => {
        it('should setup event listeners for search elements', () => {
            Search.initialize();
            
            expect(mockElements.searchBtn.addEventListener).toHaveBeenCalledWith('click', Search.performSearch);
            expect(mockElements.locationSearch.addEventListener).toHaveBeenCalledWith('keypress', expect.any(Function));
            expect(mockElements.currentLocationBtn.addEventListener).toHaveBeenCalledWith('click', Search.useCurrentLocation);
        });

        it('should handle missing search elements gracefully', () => {
            // Mock missing elements
            const originalGetElementById = document.getElementById;
            document.getElementById = TestRunner.fn().mockReturnValue(null);
            
            expect(() => {
                Search.initialize();
            }).not.toThrow();
            
            document.getElementById = originalGetElementById;
        });
    });

    describe('performSearch', () => {
        beforeEach(() => {
            mockElements.locationSearch.value = 'London';
        });

        it('should perform search with valid location', () => {
            const originalGetWeatherDataByLocation = WeatherAPI.getWeatherDataByLocation;
            WeatherAPI.getWeatherDataByLocation = TestRunner.fn();
            
            Search.performSearch();
            
            expect(StateManager.getCurrentLocation()).toBe(false);
            expect(WeatherAPI.getWeatherDataByLocation).toHaveBeenCalledWith('London');
            
            WeatherAPI.getWeatherDataByLocation = originalGetWeatherDataByLocation;
        });

        it('should not perform search with invalid location', () => {
            mockElements.locationSearch.value = '   '; // Empty/whitespace
            
            const originalGetWeatherDataByLocation = WeatherAPI.getWeatherDataByLocation;
            WeatherAPI.getWeatherDataByLocation = TestRunner.fn();
            
            Search.performSearch();
            
            expect(WeatherAPI.getWeatherDataByLocation).not.toHaveBeenCalled();
            
            WeatherAPI.getWeatherDataByLocation = originalGetWeatherDataByLocation;
        });

        it('should update location button states', () => {
            Search.performSearch();
            
            expect(mockElements.currentLocationBtn.classList.contains('active')).toBe(false);
        });
    });

    describe('useCurrentLocation', () => {
        it('should switch to current location mode', () => {
            const originalGetWeatherData = WeatherAPI.getWeatherData;
            WeatherAPI.getWeatherData = TestRunner.fn();
            
            Search.useCurrentLocation();
            
            expect(StateManager.getCurrentLocation()).toBe(true);
            expect(mockElements.locationSearch.value).toBe('');
            expect(WeatherAPI.getWeatherData).toHaveBeenCalled();
            
            WeatherAPI.getWeatherData = originalGetWeatherData;
        });

        it('should update button states', () => {
            Search.useCurrentLocation();
            
            expect(mockElements.currentLocationBtn.classList.contains('active')).toBe(true);
        });
    });

    describe('updateLocationButtons', () => {
        it('should add active class when using current location', () => {
            StateManager.setCurrentLocation(true);
            Search.updateLocationButtons();
            
            expect(mockElements.currentLocationBtn.classList.contains('active')).toBe(true);
        });

        it('should remove active class when not using current location', () => {
            StateManager.setCurrentLocation(false);
            Search.updateLocationButtons();
            
            expect(mockElements.currentLocationBtn.classList.contains('active')).toBe(false);
        });
    });

    describe('utility methods', () => {
        it('should clear search input', () => {
            mockElements.locationSearch.value = 'test';
            Search.clearSearch();
            expect(mockElements.locationSearch.value).toBe('');
        });

        it('should set search value', () => {
            Search.setSearchValue('Paris');
            expect(mockElements.locationSearch.value).toBe('Paris');
        });

        it('should get search value', () => {
            mockElements.locationSearch.value = '  New York  ';
            expect(Search.getSearchValue()).toBe('New York');
        });

        it('should focus search input', () => {
            mockElements.locationSearch.focus = TestRunner.fn();
            Search.focusSearch();
            expect(mockElements.locationSearch.focus).toHaveBeenCalled();
        });
    });

    describe('keyboard interaction', () => {
        it('should trigger search on Enter key', () => {
            Search.initialize();
            
            const originalPerformSearch = Search.performSearch;
            Search.performSearch = TestRunner.fn();
            
            // Get the keypress event listener
            const keypressListener = mockElements.locationSearch.addEventListener.calls
                .find(call => call.args[0] === 'keypress').args[1];
            
            // Simulate Enter key press
            const enterEvent = { key: 'Enter' };
            keypressListener(enterEvent);
            
            expect(Search.performSearch).toHaveBeenCalled();
            
            Search.performSearch = originalPerformSearch;
        });

        it('should not trigger search on other keys', () => {
            Search.initialize();
            
            const originalPerformSearch = Search.performSearch;
            Search.performSearch = TestRunner.fn();
            
            const keypressListener = mockElements.locationSearch.addEventListener.calls
                .find(call => call.args[0] === 'keypress').args[1];
            
            // Simulate non-Enter key press
            const otherEvent = { key: 'a' };
            keypressListener(otherEvent);
            
            expect(Search.performSearch).not.toHaveBeenCalled();
            
            Search.performSearch = originalPerformSearch;
        });
    });
});

describe('DarkMode', () => {
    let mockElements, mockLocalStorage;

    beforeEach(() => {
        mockElements = TestUtils.setupDOMMocks();
        mockLocalStorage = TestUtils.setupLocalStorageMocks();
        StateManager.reset();
    });

    afterEach(() => {
        TestUtils.resetMocks();
    });

    describe('initialize', () => {
        it('should setup event listener for dark mode toggle', () => {
            DarkMode.initialize();
            
            expect(mockElements.darkModeToggle.addEventListener).toHaveBeenCalledWith('click', DarkMode.toggle);
        });

        it('should enable dark mode if saved preference is true', () => {
            mockLocalStorage.getItem.mockImplementation((key) => {
                if (key === 'darkMode') return 'true';
                return null;
            });
            
            const originalEnable = DarkMode.enable;
            DarkMode.enable = TestRunner.fn();
            
            DarkMode.initialize();
            
            expect(DarkMode.enable).toHaveBeenCalled();
            
            DarkMode.enable = originalEnable;
        });

        it('should disable dark mode if saved preference is false or missing', () => {
            mockLocalStorage.getItem.mockImplementation(() => null);
            
            const originalDisable = DarkMode.disable;
            DarkMode.disable = TestRunner.fn();
            
            DarkMode.initialize();
            
            expect(DarkMode.disable).toHaveBeenCalled();
            
            DarkMode.disable = originalDisable;
        });

        it('should handle missing dark mode elements gracefully', () => {
            const originalGetElementById = document.getElementById;
            document.getElementById = TestRunner.fn().mockReturnValue(null);
            
            expect(() => {
                DarkMode.initialize();
            }).not.toThrow();
            
            document.getElementById = originalGetElementById;
        });
    });

    describe('enable', () => {
        it('should add dark-mode class to body', () => {
            DarkMode.enable();
            
            expect(document.body.classList.add).toHaveBeenCalledWith('dark-mode');
        });

        it('should change toggle icon to sun', () => {
            DarkMode.enable();
            
            expect(mockElements.toggleIcon.className).toBe('fas fa-sun');
        });

        it('should save preference to localStorage', () => {
            DarkMode.enable();
            
            expect(mockLocalStorage.setItem).toHaveBeenCalledWith('darkMode', 'true');
        });

        it('should reapply weather background', () => {
            const originalReapplyBackground = DarkMode.reapplyWeatherBackground;
            DarkMode.reapplyWeatherBackground = TestRunner.fn();
            
            DarkMode.enable();
            
            expect(DarkMode.reapplyWeatherBackground).toHaveBeenCalled();
            
            DarkMode.reapplyWeatherBackground = originalReapplyBackground;
        });
    });

    describe('disable', () => {
        it('should remove dark-mode class from body', () => {
            DarkMode.disable();
            
            expect(document.body.classList.remove).toHaveBeenCalledWith('dark-mode');
        });

        it('should change toggle icon to moon', () => {
            DarkMode.disable();
            
            expect(mockElements.toggleIcon.className).toBe('fas fa-moon');
        });

        it('should save preference to localStorage', () => {
            DarkMode.disable();
            
            expect(mockLocalStorage.setItem).toHaveBeenCalledWith('darkMode', 'false');
        });
    });

    describe('toggle', () => {
        it('should disable dark mode when currently enabled', () => {
            // Mock body has dark-mode class
            document.body.classList.contains = TestRunner.fn().mockReturnValue(true);
            
            const originalDisable = DarkMode.disable;
            DarkMode.disable = TestRunner.fn();
            
            DarkMode.toggle();
            
            expect(DarkMode.disable).toHaveBeenCalled();
            
            DarkMode.disable = originalDisable;
        });

        it('should enable dark mode when currently disabled', () => {
            // Mock body doesn't have dark-mode class
            document.body.classList.contains = TestRunner.fn().mockReturnValue(false);
            
            const originalEnable = DarkMode.enable;
            DarkMode.enable = TestRunner.fn();
            
            DarkMode.toggle();
            
            expect(DarkMode.enable).toHaveBeenCalled();
            
            DarkMode.enable = originalEnable;
        });
    });

    describe('isActive', () => {
        it('should return true when dark mode is active', () => {
            document.body.classList.contains = TestRunner.fn().mockReturnValue(true);
            
            expect(DarkMode.isActive()).toBe(true);
        });

        it('should return false when dark mode is not active', () => {
            document.body.classList.contains = TestRunner.fn().mockReturnValue(false);
            
            expect(DarkMode.isActive()).toBe(false);
        });
    });

    describe('getPreference', () => {
        it('should return "dark" when localStorage has true', () => {
            mockLocalStorage.getItem.mockImplementation((key) => {
                if (key === 'darkMode') return 'true';
                return null;
            });
            
            expect(DarkMode.getPreference()).toBe('dark');
        });

        it('should return "light" when localStorage has false or missing', () => {
            mockLocalStorage.getItem.mockImplementation(() => null);
            
            expect(DarkMode.getPreference()).toBe('light');
        });
    });

    describe('reapplyWeatherBackground', () => {
        it('should reapply weather background when weather data exists', () => {
            StateManager.setWeatherData(TestData.mockWeatherData);
            
            const originalApplyWeatherBackground = WeatherDisplay.applyWeatherBackground;
            WeatherDisplay.applyWeatherBackground = TestRunner.fn();
            
            DarkMode.reapplyWeatherBackground();
            
            expect(WeatherDisplay.applyWeatherBackground).toHaveBeenCalledWith(
                TestData.mockWeatherData.current.condition.text,
                TestData.mockWeatherData.current
            );
            
            WeatherDisplay.applyWeatherBackground = originalApplyWeatherBackground;
        });

        it('should reset to default background when no weather data', () => {
            StateManager.setWeatherData(null);
            
            const originalResetBackground = WeatherDisplay.resetToDefaultBackground;
            WeatherDisplay.resetToDefaultBackground = TestRunner.fn();
            
            DarkMode.reapplyWeatherBackground();
            
            expect(WeatherDisplay.resetToDefaultBackground).toHaveBeenCalled();
            
            WeatherDisplay.resetToDefaultBackground = originalResetBackground;
        });
    });
});

// Integration tests for Search and Dark Mode
describe('Search and Dark Mode Integration', () => {
    let mockElements, mockLocalStorage;

    beforeEach(() => {
        mockElements = TestUtils.setupDOMMocks();
        mockLocalStorage = TestUtils.setupLocalStorageMocks();
        StateManager.reset();
    });

    afterEach(() => {
        TestUtils.resetMocks();
    });

    it('should maintain dark mode preference across searches', () => {
        // Enable dark mode
        DarkMode.enable();
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith('darkMode', 'true');
        
        // Perform search
        const originalGetWeatherDataByLocation = WeatherAPI.getWeatherDataByLocation;
        WeatherAPI.getWeatherDataByLocation = TestRunner.fn();
        
        mockElements.locationSearch.value = 'Paris';
        Search.performSearch();
        
        // Dark mode should still be enabled
        expect(DarkMode.getPreference()).toBe('dark');
        
        WeatherAPI.getWeatherDataByLocation = originalGetWeatherDataByLocation;
    });

    it('should apply correct background colors based on dark mode and weather', () => {
        StateManager.setWeatherData(TestData.mockWeatherData);
        
        const originalApplyWeatherBackground = WeatherDisplay.applyWeatherBackground;
        WeatherDisplay.applyWeatherBackground = TestRunner.fn();
        
        // Test with dark mode enabled
        document.body.classList.contains = TestRunner.fn().mockReturnValue(true);
        DarkMode.reapplyWeatherBackground();
        
        expect(WeatherDisplay.applyWeatherBackground).toHaveBeenCalled();
        
        // Test with dark mode disabled
        document.body.classList.contains = TestRunner.fn().mockReturnValue(false);
        DarkMode.reapplyWeatherBackground();
        
        expect(WeatherDisplay.applyWeatherBackground).toHaveBeenCalledTimes(2);
        
        WeatherDisplay.applyWeatherBackground = originalApplyWeatherBackground;
    });

    it('should handle complete user interaction flow', () => {
        // Initialize modules
        Search.initialize();
        DarkMode.initialize();
        
        // User toggles dark mode
        const originalToggle = DarkMode.toggle;
        DarkMode.toggle = TestRunner.fn();
        
        // Simulate click on dark mode toggle
        const clickListener = mockElements.darkModeToggle.addEventListener.calls
            .find(call => call.args[0] === 'click').args[1];
        clickListener();
        
        expect(DarkMode.toggle).toHaveBeenCalled();
        
        // User performs search
        const originalPerformSearch = Search.performSearch;
        Search.performSearch = TestRunner.fn();
        
        // Simulate click on search button
        const searchClickListener = mockElements.searchBtn.addEventListener.calls
            .find(call => call.args[0] === 'click').args[1];
        searchClickListener();
        
        expect(Search.performSearch).toHaveBeenCalled();
        
        // Restore
        DarkMode.toggle = originalToggle;
        Search.performSearch = originalPerformSearch;
    });
});