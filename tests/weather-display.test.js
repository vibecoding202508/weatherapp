// Tests for Weather Display Functionality

window.runWeatherDisplayTestSuite = async function() {
    await describe('Weather Display', async () => {
    let originalDOM;
    let mockDOM;

    beforeEach(() => {
        originalDOM = window.DOM;
        mockDOM = TestData.createMockDOM();
        window.DOM = mockDOM;
        
        // The createMockDOM function now handles document.getElementById mocking automatically
    });

    afterEach(() => {
        window.DOM = originalDOM;
    });

    it('should display weather data correctly', () => {
        const weatherData = TestData.sampleWeatherData;
        
        WeatherDisplay.displayWeatherData(weatherData);
        
        expect(window.DOM.location.textContent).toContain('London');
        expect(window.DOM.currentTemp.textContent).toContain('15°C');
        expect(window.DOM.currentCondition.textContent).toBe('Partly cloudy');
        expect(window.DOM.feelsLike.textContent).toContain('14°C');
        expect(window.DOM.humidity.textContent).toBe('65%');
        expect(window.DOM.wind.textContent).toContain('11.2 km/h SW');
        expect(window.DOM.uvIndex.textContent).toBe('4');
    });

    it('should show UV warning for high UV index', () => {
        const highUVData = TestData.highUVWeatherData;
        
        WeatherDisplay.displayWeatherData(highUVData);
        
        expect(window.DOM.uvWarning.style.display).toBe('flex');
    });

    it('should hide UV warning for low UV index', () => {
        const lowUVData = { ...TestData.sampleWeatherData };
        lowUVData.current.uv = 2;
        
        WeatherDisplay.displayWeatherData(lowUVData);
        
        expect(window.DOM.uvWarning.style.display).toBe('none');
    });

    it('should update temperature correctly', () => {
        WeatherDisplay.updateTemperature(22.5);
        expect(window.DOM.currentTemp.textContent).toBe('23°C');
    });

    it('should update feels like temperature correctly', () => {
        WeatherDisplay.updateFeelsLike(18.7);
        expect(window.DOM.feelsLike.textContent).toBe('Feels like 19°C');
    });

    it('should update location correctly', () => {
        const locationData = {
            name: 'Paris',
            region: 'Ile-de-France',
            country: 'France'
        };
        
        WeatherDisplay.updateLocation(locationData);
        expect(window.DOM.location.textContent).toBe('Paris, Ile-de-France, France');
    });

    it('should update weather condition correctly', () => {
        const condition = {
            text: 'Sunny',
            icon: '//cdn.weatherapi.com/weather/64x64/day/113.png'
        };
        
        WeatherDisplay.updateCondition(condition);
        expect(window.DOM.currentCondition.textContent).toBe('Sunny');
        expect(window.DOM.currentIcon.src).toContain('113.png');
        expect(window.DOM.currentIcon.alt).toBe('Sunny');
    });

    it('should clear all display data', () => {
        // First populate with data
        WeatherDisplay.displayWeatherData(TestData.sampleWeatherData);
        
        // Then clear
        WeatherDisplay.clearDisplay();
        
        expect(window.DOM.location.textContent).toBe('');
        expect(window.DOM.currentTemp.textContent).toBe('');
        expect(window.DOM.currentCondition.textContent).toBe('');
        expect(window.DOM.feelsLike.textContent).toBe('');
        expect(window.DOM.visibility.textContent).toBe('');
        expect(window.DOM.humidity.textContent).toBe('');
        expect(window.DOM.wind.textContent).toBe('');
    });

    it('should handle missing icon element gracefully', () => {
        const originalIcon = window.DOM.currentIcon;
        window.DOM.currentIcon = null;
        
        expect(() => {
            WeatherDisplay.displayWeatherData(TestData.sampleWeatherData);
        }).not.toThrow();
        
        window.DOM.currentIcon = originalIcon;
    });

    it('should handle missing forecast container gracefully', () => {
        const originalContainer = window.DOM.forecastContainer;
        window.DOM.forecastContainer = null;
        
        expect(() => {
            WeatherDisplay.displayWeatherData(TestData.sampleWeatherData);
        }).not.toThrow();
        
        window.DOM.forecastContainer = originalContainer;
    });
});

describe('Weather Display - Visibility', () => {
    let originalDOM;
    let mockDOM;

    beforeEach(() => {
        originalDOM = window.DOM;
        mockDOM = TestData.createMockDOM();
        window.DOM = mockDOM;
        
        // The createMockDOM function now handles document.getElementById mocking automatically
    });

    afterEach(() => {
        window.DOM = originalDOM;
    });

    it('should update visibility display with analysis', () => {
        WeatherDisplay.updateVisibilityDisplay(5.0, 'Partly cloudy');
        
        const visibilityElement = document.getElementById('visibility');
        const categoryElement = document.getElementById('visibility-category');
        const descriptionElement = document.getElementById('visibility-description');
        
        // Check that visibility shows 5 km (accepting both "5 km" and "5.0 km")
        const visibilityText = visibilityElement.textContent;
        expect(visibilityText === '5 km' || visibilityText === '5.0 km').toBe(true);
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
};