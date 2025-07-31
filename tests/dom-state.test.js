// DOM and State Management Tests

describe('DOMUtils', () => {
    let testElement;

    beforeEach(() => {
        testElement = TestUtils.createTestElement('div', {
            id: 'test-element',
            className: 'initial-class'
        });
    });

    describe('show', () => {
        it('should set element display to block', () => {
            DOMUtils.show(testElement);
            expect(testElement.style.display).toBe('block');
        });

        it('should handle null element gracefully', () => {
            expect(() => {
                DOMUtils.show(null);
            }).not.toThrow();
        });
    });

    describe('hide', () => {
        it('should set element display to none', () => {
            DOMUtils.hide(testElement);
            expect(testElement.style.display).toBe('none');
        });

        it('should handle null element gracefully', () => {
            expect(() => {
                DOMUtils.hide(null);
            }).not.toThrow();
        });
    });

    describe('showFlex', () => {
        it('should set element display to flex', () => {
            DOMUtils.showFlex(testElement);
            expect(testElement.style.display).toBe('flex');
        });
    });

    describe('setText', () => {
        it('should set element text content', () => {
            const text = 'Test text content';
            DOMUtils.setText(testElement, text);
            expect(testElement.textContent).toBe(text);
        });

        it('should handle null element gracefully', () => {
            expect(() => {
                DOMUtils.setText(null, 'test');
            }).not.toThrow();
        });
    });

    describe('setHTML', () => {
        it('should set element innerHTML', () => {
            const html = '<span>Test HTML</span>';
            DOMUtils.setHTML(testElement, html);
            expect(testElement.innerHTML).toBe(html);
        });
    });

    describe('addClass', () => {
        it('should add class to element', () => {
            DOMUtils.addClass(testElement, 'new-class');
            expect(testElement.className).toContain('new-class');
        });

        it('should not duplicate existing classes', () => {
            DOMUtils.addClass(testElement, 'initial-class');
            const classCount = testElement.className.split(' ').filter(c => c === 'initial-class').length;
            expect(classCount).toBe(1);
        });
    });

    describe('removeClass', () => {
        it('should remove class from element', () => {
            DOMUtils.removeClass(testElement, 'initial-class');
            expect(testElement.className).not.toContain('initial-class');
        });

        it('should handle removing non-existent class', () => {
            expect(() => {
                DOMUtils.removeClass(testElement, 'non-existent');
            }).not.toThrow();
        });
    });

    describe('toggleClass', () => {
        it('should add class if not present', () => {
            DOMUtils.toggleClass(testElement, 'toggle-class');
            expect(testElement.className).toContain('toggle-class');
        });

        it('should remove class if present', () => {
            DOMUtils.addClass(testElement, 'toggle-class');
            DOMUtils.toggleClass(testElement, 'toggle-class');
            expect(testElement.className).not.toContain('toggle-class');
        });
    });

    describe('hasClass', () => {
        it('should return true if element has class', () => {
            expect(DOMUtils.hasClass(testElement, 'initial-class')).toBe(true);
        });

        it('should return false if element does not have class', () => {
            expect(DOMUtils.hasClass(testElement, 'non-existent')).toBe(false);
        });

        it('should return false for null element', () => {
            expect(DOMUtils.hasClass(null, 'any-class')).toBe(false);
        });
    });
});

describe('DOM Element References', () => {
    let mockElements;

    beforeEach(() => {
        mockElements = TestUtils.setupDOMMocks();
    });

    it('should have all required DOM element references', () => {
        const requiredElements = [
            'loading', 'error', 'errorMessage', 'weatherContent',
            'location', 'currentTemp', 'currentIcon', 'currentCondition',
            'feelsLike', 'visibility', 'humidity', 'wind', 'uvIndex',
            'forecastContainer', 'weatherAlerts', 'alertsContainer',
            'locationSearch', 'searchBtn', 'currentLocationBtn',
            'darkModeToggle', 'toggleIcon'
        ];

        requiredElements.forEach(elementId => {
            const element = document.getElementById(elementId);
            expect(element).toBeTruthy();
        });
    });

    it('should handle missing DOM elements gracefully', () => {
        // Mock getElementById to return null for a specific element
        const originalGetElementById = document.getElementById;
        document.getElementById = TestRunner.fn((id) => {
            if (id === 'missing-element') return null;
            return originalGetElementById.call(document, id);
        });

        const missingElement = document.getElementById('missing-element');
        expect(missingElement).toBe(null);

        // DOM utilities should handle null gracefully
        expect(() => {
            DOMUtils.setText(missingElement, 'test');
            DOMUtils.hide(missingElement);
            DOMUtils.addClass(missingElement, 'test-class');
        }).not.toThrow();

        // Restore original method
        document.getElementById = originalGetElementById;
    });
});

describe('StateManager', () => {
    beforeEach(() => {
        // Reset state before each test
        StateManager.reset();
    });

    describe('current location state', () => {
        it('should set and get current location state', () => {
            StateManager.setCurrentLocation(false);
            expect(StateManager.getCurrentLocation()).toBe(false);

            StateManager.setCurrentLocation(true);
            expect(StateManager.getCurrentLocation()).toBe(true);
        });

        it('should default to using current location', () => {
            expect(StateManager.getCurrentLocation()).toBe(true);
        });
    });

    describe('weather data state', () => {
        it('should set and get weather data', () => {
            const mockData = TestData.mockWeatherData;
            
            StateManager.setWeatherData(mockData);
            const retrievedData = StateManager.getWeatherData();
            
            expect(retrievedData).toEqual(mockData);
        });

        it('should handle null weather data', () => {
            StateManager.setWeatherData(null);
            expect(StateManager.getWeatherData()).toBe(null);
        });
    });

    describe('loading state', () => {
        it('should set and get loading state', () => {
            StateManager.setLoading(true);
            expect(StateManager.isLoading()).toBe(true);

            StateManager.setLoading(false);
            expect(StateManager.isLoading()).toBe(false);
        });

        it('should default to not loading', () => {
            expect(StateManager.isLoading()).toBe(false);
        });
    });

    describe('error state', () => {
        it('should set and get error state', () => {
            StateManager.setError(true);
            expect(StateManager.hasError()).toBe(true);

            StateManager.setError(false);
            expect(StateManager.hasError()).toBe(false);
        });

        it('should default to no error', () => {
            expect(StateManager.hasError()).toBe(false);
        });
    });

    describe('current location data', () => {
        it('should set and get current location data', () => {
            const locationData = {
                latitude: 51.5074,
                longitude: -0.1278
            };
            
            StateManager.setCurrentLocationData(locationData);
            expect(StateManager.getCurrentLocationData()).toEqual(locationData);
        });
    });

    describe('reset', () => {
        it('should reset all state to defaults', () => {
            // Set some non-default values
            StateManager.setCurrentLocation(false);
            StateManager.setWeatherData(TestData.mockWeatherData);
            StateManager.setLoading(true);
            StateManager.setError(true);
            StateManager.setCurrentLocationData({ lat: 0, lon: 0 });

            // Reset state
            StateManager.reset();

            // Check all values are back to defaults
            expect(StateManager.getCurrentLocation()).toBe(true);
            expect(StateManager.getWeatherData()).toBe(null);
            expect(StateManager.isLoading()).toBe(false);
            expect(StateManager.hasError()).toBe(false);
            expect(StateManager.getCurrentLocationData()).toBe(null);
        });
    });
});

// Integration tests for DOM and State working together
describe('DOM and State Integration', () => {
    let mockElements;

    beforeEach(() => {
        mockElements = TestUtils.setupDOMMocks();
        StateManager.reset();
    });

    afterEach(() => {
        TestUtils.resetMocks();
    });

    it('should sync UI state with loading state', () => {
        // Set loading state
        StateManager.setLoading(true);
        UIUtils.showLoading();
        
        expect(StateManager.isLoading()).toBe(true);
        expect(mockElements.loading.style.display).toBe('flex');
        expect(mockElements.weatherContent.style.display).toBe('none');
    });

    it('should sync UI state with error state', () => {
        // Set error state
        StateManager.setError(true);
        UIUtils.showError('Test error message');
        
        expect(StateManager.hasError()).toBe(true);
        expect(mockElements.error.style.display).toBe('flex');
        expect(mockElements.errorMessage.textContent).toBe('Test error message');
    });

    it('should sync UI state with weather content display', () => {
        // Set weather data and show content
        StateManager.setWeatherData(TestData.mockWeatherData);
        UIUtils.showWeatherContent();
        
        expect(StateManager.getWeatherData()).toBeTruthy();
        expect(StateManager.isLoading()).toBe(false);
        expect(StateManager.hasError()).toBe(false);
        expect(mockElements.weatherContent.style.display).toBe('block');
    });

    it('should handle state transitions correctly', () => {
        // Start with loading
        StateManager.setLoading(true);
        UIUtils.showLoading();
        expect(mockElements.loading.style.display).toBe('flex');
        
        // Transition to error
        StateManager.setLoading(false);
        StateManager.setError(true);
        UIUtils.showError('Network error');
        expect(mockElements.error.style.display).toBe('flex');
        expect(mockElements.loading.style.display).toBe('none');
        
        // Transition to success
        StateManager.setError(false);
        StateManager.setWeatherData(TestData.mockWeatherData);
        UIUtils.showWeatherContent();
        expect(mockElements.weatherContent.style.display).toBe('block');
        expect(mockElements.error.style.display).toBe('none');
    });
});