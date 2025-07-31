// Tests for Weather Display Functionality

describe('Weather Display', () => {
    let originalDOM;
    let mockDOM;

    beforeEach(() => {
        originalDOM = window.DOM;
        mockDOM = TestData.createMockDOM();
        window.DOM = mockDOM;
        
        // Mock additional elements needed for weather display
        document.getElementById = (id) => {
            const elementMocks = {
                'visibility-icon': { className: '' },
                'visibility-container': { 
                    classList: {
                        remove: () => {},
                        add: () => {}
                    }
                },
                'visibility-category': { textContent: '', className: '' },
                'visibility-description': { textContent: '' },
                'visibility-expandable': { style: { display: 'none' } },
                'visibility-toggle': { 
                    classList: { 
                        remove: () => {}, 
                        add: () => {},
                        contains: () => false 
                    },
                    replaceWith: () => {},
                    addEventListener: () => {}
                },
                'visibility-weather-context': { textContent: '', style: { display: 'none' } },
                'visibility-driving-advice': { textContent: '' },
                'visibility-activities-list': { 
                    innerHTML: '', 
                    appendChild: () => {} 
                }
            };
            
            return elementMocks[id] || mockDOM[id.replace('-', '')] || { 
                style: { display: 'none' }, 
                textContent: '', 
                innerHTML: '',
                classList: {
                    add: () => {},
                    remove: () => {},
                    contains: () => false
                }
            };
        };
    });

    afterEach(() => {
        window.DOM = originalDOM;
    });

    it('should display weather data correctly', () => {
        const weatherData = TestData.sampleWeatherData;
        
        WeatherDisplay.displayWeatherData(weatherData);
        
        expect(DOM.location.textContent).toContain('London');
        expect(DOM.currentTemp.textContent).toContain('15°C');
        expect(DOM.currentCondition.textContent).toBe('Partly cloudy');
        expect(DOM.feelsLike.textContent).toContain('14°C');
        expect(DOM.humidity.textContent).toBe('65%');
        expect(DOM.wind.textContent).toContain('11.2 km/h SW');
        expect(DOM.uvIndex.textContent).toBe('4');
    });

    it('should show UV warning for high UV index', () => {
        const highUVData = TestData.highUVWeatherData;
        
        WeatherDisplay.displayWeatherData(highUVData);
        
        expect(DOM.uvWarning.style.display).toBe('flex');
    });

    it('should hide UV warning for low UV index', () => {
        const lowUVData = { ...TestData.sampleWeatherData };
        lowUVData.current.uv = 2;
        
        WeatherDisplay.displayWeatherData(lowUVData);
        
        expect(DOM.uvWarning.style.display).toBe('none');
    });

    it('should update temperature correctly', () => {
        WeatherDisplay.updateTemperature(22.5);
        expect(DOM.currentTemp.textContent).toBe('23°C');
    });

    it('should update feels like temperature correctly', () => {
        WeatherDisplay.updateFeelsLike(18.7);
        expect(DOM.feelsLike.textContent).toBe('Feels like 19°C');
    });

    it('should update location correctly', () => {
        const locationData = {
            name: 'Paris',
            region: 'Ile-de-France',
            country: 'France'
        };
        
        WeatherDisplay.updateLocation(locationData);
        expect(DOM.location.textContent).toBe('Paris, Ile-de-France, France');
    });

    it('should update weather condition correctly', () => {
        const condition = {
            text: 'Sunny',
            icon: '//cdn.weatherapi.com/weather/64x64/day/113.png'
        };
        
        WeatherDisplay.updateCondition(condition);
        expect(DOM.currentCondition.textContent).toBe('Sunny');
        expect(DOM.currentIcon.src).toContain('113.png');
        expect(DOM.currentIcon.alt).toBe('Sunny');
    });

    it('should clear all display data', () => {
        // First populate with data
        WeatherDisplay.displayWeatherData(TestData.sampleWeatherData);
        
        // Then clear
        WeatherDisplay.clearDisplay();
        
        expect(DOM.location.textContent).toBe('');
        expect(DOM.currentTemp.textContent).toBe('');
        expect(DOM.currentCondition.textContent).toBe('');
        expect(DOM.feelsLike.textContent).toBe('');
        expect(DOM.visibility.textContent).toBe('');
        expect(DOM.humidity.textContent).toBe('');
        expect(DOM.wind.textContent).toBe('');
    });

    it('should handle missing icon element gracefully', () => {
        const originalIcon = DOM.currentIcon;
        DOM.currentIcon = null;
        
        expect(() => {
            WeatherDisplay.displayWeatherData(TestData.sampleWeatherData);
        }).not.toThrow();
        
        DOM.currentIcon = originalIcon;
    });

    it('should handle missing forecast container gracefully', () => {
        const originalContainer = DOM.forecastContainer;
        DOM.forecastContainer = null;
        
        expect(() => {
            WeatherDisplay.displayWeatherData(TestData.sampleWeatherData);
        }).not.toThrow();
        
        DOM.forecastContainer = originalContainer;
    });
});

describe('Weather Display - Visibility', () => {
    beforeEach(() => {
        // Setup mock DOM for visibility tests
        document.getElementById = (id) => {
            const mocks = {
                'visibility-icon': { className: '' },
                'visibility-container': { 
                    classList: {
                        remove: () => {},
                        add: () => {}
                    }
                },
                'visibility-category': { textContent: '', className: '' },
                'visibility-description': { textContent: '' },
                'visibility-expandable': { style: { display: 'none' } },
                'visibility-toggle': { 
                    classList: { 
                        remove: () => {}, 
                        add: () => {},
                        contains: () => false 
                    },
                    replaceWith: () => {},
                    addEventListener: () => {}
                },
                'visibility-weather-context': { textContent: '', style: { display: 'none' } },
                'visibility-driving-advice': { textContent: '' },
                'visibility-activities-list': { 
                    innerHTML: '', 
                    appendChild: (element) => {}
                }
            };
            
            return mocks[id] || { 
                style: { display: 'none' }, 
                textContent: '', 
                classList: { add: () => {}, remove: () => {} }
            };
        };
    });

    it('should update visibility display with analysis', () => {
        WeatherDisplay.updateVisibilityDisplay(5.0, 'Partly cloudy');
        
        const visibilityElement = document.getElementById('visibility');
        const categoryElement = document.getElementById('visibility-category');
        const descriptionElement = document.getElementById('visibility-description');
        
        expect(visibilityElement.textContent).toBe('5 km');
        expect(categoryElement.textContent).toBe('Good');
        expect(descriptionElement.textContent).toContain('Good visibility');
    });

    it('should handle poor visibility with warnings', () => {
        WeatherDisplay.updateVisibilityDisplay(0.5, 'Dense fog');
        
        const categoryElement = document.getElementById('visibility-category');
        expect(categoryElement.textContent).toBe('Very Poor');
    });

    it('should update detailed visibility information', () => {
        const analysis = VisibilityUtils.analyzeVisibility(3.0, 'Light rain');
        WeatherDisplay.updateVisibilityDetails(analysis);
        
        const contextElement = document.getElementById('visibility-weather-context');
        const drivingElement = document.getElementById('visibility-driving-advice');
        const activitiesElement = document.getElementById('visibility-activities-list');
        
        expect(contextElement.textContent).toContain('rain');
        expect(drivingElement.textContent).toBeTruthy();
        expect(activitiesElement.innerHTML).toBe('');
    });

    it('should toggle visibility details', () => {
        const mockExpandable = document.getElementById('visibility-expandable');
        const mockToggle = document.getElementById('visibility-toggle');
        
        let isExpanded = false;
        mockToggle.classList.contains = () => isExpanded;
        mockToggle.classList.add = () => { isExpanded = true; };
        mockToggle.classList.remove = () => { isExpanded = false; };
        
        // Test expand
        WeatherDisplay.toggleVisibilityDetails();
        expect(mockExpandable.style.display).toBe('block');
        
        // Test collapse
        WeatherDisplay.toggleVisibilityDetails();
        expect(mockExpandable.style.display).toBe('none');
    });
});