// Tests for Utility Functions

window.runUtilTestSuite = async function() {
    await describe('Visibility Utils', async () => {
    it('should analyze excellent visibility correctly', () => {
        const analysis = VisibilityUtils.analyzeVisibility(25, 'Clear');
        
        expect(analysis.category).toBe('Excellent');
        expect(analysis.cssClass).toBe('visibility-excellent');
        expect(analysis.icon).toBe('fas fa-eye');
        expect(analysis.warning).toBe(null);
        expect(analysis.activities).toContain('Perfect for all outdoor activities');
    });

    it('should analyze poor visibility correctly', () => {
        const analysis = VisibilityUtils.analyzeVisibility(0.5, 'Dense fog');
        
        expect(analysis.category).toBe('Very Poor');
        expect(analysis.cssClass).toBe('visibility-very-poor');
        expect(analysis.icon).toBe('fas fa-exclamation-triangle');
        expect(analysis.warning).toBe('Dangerous visibility conditions');
        expect(analysis.activities).toContain('Stay indoors if possible');
    });

    it('should provide weather-specific context for fog', () => {
        const analysis = VisibilityUtils.analyzeVisibility(1.0, 'Fog');
        
        expect(analysis.weatherContext).toContain('fog');
        expect(analysis.weatherContext).toContain('caution');
    });

    it('should provide weather-specific context for rain', () => {
        const analysis = VisibilityUtils.analyzeVisibility(3.0, 'Heavy rain');
        
        expect(analysis.weatherContext).toContain('rain');
        expect(analysis.weatherContext).toContain('wipers');
    });

    it('should format visibility correctly for different ranges', () => {
        expect(VisibilityUtils.formatVisibility(15.7)).toBe('16 km');
        expect(VisibilityUtils.formatVisibility(2.3)).toBe('2.3 km');
        expect(VisibilityUtils.formatVisibility(0.8)).toBe('800 m');
        expect(VisibilityUtils.formatVisibility(0.1)).toBe('100 m');
    });

    it('should handle edge cases for visibility analysis', () => {
        const analysis1 = VisibilityUtils.analyzeVisibility(10, 'Clear');
        expect(analysis1.category).toBe('Very Good');

        const analysis2 = VisibilityUtils.analyzeVisibility(5, 'Partly cloudy');
        expect(analysis2.category).toBe('Good');

        const analysis3 = VisibilityUtils.analyzeVisibility(2, 'Haze');
        expect(analysis3.category).toBe('Moderate');
    });
});

describe('Math Utils', () => {
    it('should round temperature correctly', () => {
        expect(MathUtils.roundTemp(15.7)).toBe(16);
        expect(MathUtils.roundTemp(15.2)).toBe(15);
        expect(MathUtils.roundTemp(-2.8)).toBe(-3);
        expect(MathUtils.roundTemp(0)).toBe(0);
    });

    it('should generate random numbers in range', () => {
        const random1 = MathUtils.getRandomInRange(1, 10);
        expect(random1).toBeGreaterThan(0.99);
        expect(random1).toBeLessThan(10.01);

        const random2 = MathUtils.getRandomInRange(-5, 5);
        expect(random2).toBeGreaterThan(-5.01);
        expect(random2).toBeLessThan(5.01);
    });

    it('should generate random percentage string', () => {
        const percentage = MathUtils.getRandomPercentage();
        expect(percentage).toContain('%');
        
        const numericPart = parseFloat(percentage.replace('%', ''));
        expect(numericPart).toBeGreaterThan(-0.01);
        expect(numericPart).toBeLessThan(100.01);
    });
});

describe('Date Utils', () => {
    it('should format date correctly', () => {
        const formattedDate = DateUtils.formatDate('2024-01-15');
        expect(formattedDate).toContain('Jan');
        expect(formattedDate).toContain('15');
    });

    it('should return correct day names', () => {
        expect(DateUtils.getDayName('2024-01-15', 0)).toBe('Today');
        expect(DateUtils.getDayName('2024-01-16', 1)).toBe('Tomorrow');
        
        const dayName = DateUtils.getDayName('2024-01-17', 2);
        expect(typeof dayName).toBe('string');
        expect(dayName.length).toBeGreaterThan(0);
    });

    it('should format date and time', () => {
        const formatted = DateUtils.formatDateTime('2024-01-15T12:30:00');
        expect(typeof formatted).toBe('string');
        expect(formatted.length).toBeGreaterThan(0);
    });

    it('should handle empty date string', () => {
        const formatted = DateUtils.formatDateTime('');
        expect(formatted).toBe('');
    });
});

describe('String Utils', () => {
    it('should capitalize first letter', () => {
        expect(StringUtils.capitalizeFirstLetter('hello')).toBe('Hello');
        expect(StringUtils.capitalizeFirstLetter('WORLD')).toBe('WORLD');
        expect(StringUtils.capitalizeFirstLetter('a')).toBe('A');
        expect(StringUtils.capitalizeFirstLetter('')).toBe('');
    });

    it('should truncate text correctly', () => {
        const longText = 'This is a very long text that needs to be truncated';
        
        expect(StringUtils.truncateText(longText, 10)).toBe('This is a ...');
        expect(StringUtils.truncateText('Short', 10)).toBe('Short');
        expect(StringUtils.truncateText('Exactly10!', 10)).toBe('Exactly10!');
    });
});

describe('Validation Utils', () => {
    it('should validate API keys correctly', () => {
        expect(ValidationUtils.isValidAPIKey('YOUR_API_KEY_HERE')).toBe(false);
        expect(ValidationUtils.isValidAPIKey('')).toBe(false);
        expect(ValidationUtils.isValidAPIKey(null)).toBe(false);
        expect(ValidationUtils.isValidAPIKey('short')).toBe(false);
        expect(ValidationUtils.isValidAPIKey('this_is_a_valid_api_key_123')).toBe(true);
    });

    it('should validate locations correctly', () => {
        expect(ValidationUtils.isValidLocation('London')).toBe(true);
        expect(ValidationUtils.isValidLocation('  Paris  ')).toBe(true);
        expect(ValidationUtils.isValidLocation('')).toBe(false);
        expect(ValidationUtils.isValidLocation('   ')).toBe(false);
        expect(ValidationUtils.isValidLocation(null)).toBe(false);
    });

    it('should validate coordinates correctly', () => {
        expect(ValidationUtils.isValidCoordinates(51.5074, -0.1278)).toBe(true);
        expect(ValidationUtils.isValidCoordinates(0, 0)).toBe(true);
        expect(ValidationUtils.isValidCoordinates(90, 180)).toBe(true);
        expect(ValidationUtils.isValidCoordinates(-90, -180)).toBe(true);
        
        expect(ValidationUtils.isValidCoordinates(91, 0)).toBe(false);
        expect(ValidationUtils.isValidCoordinates(0, 181)).toBe(false);
        expect(ValidationUtils.isValidCoordinates(-91, 0)).toBe(false);
        expect(ValidationUtils.isValidCoordinates(0, -181)).toBe(false);
        expect(ValidationUtils.isValidCoordinates('invalid', 0)).toBe(false);
    });
});

describe('DOM Utils', () => {
    let mockElement;

    beforeEach(() => {
        mockElement = {
            style: { display: 'block' },
            textContent: 'initial',
            innerHTML: 'initial',
            classList: {
                classes: [],
                add: function(className) { this.classes.push(className); },
                remove: function(className) { 
                    const index = this.classes.indexOf(className);
                    if (index > -1) this.classes.splice(index, 1);
                },
                contains: function(className) { return this.classes.includes(className); },
                toggle: function(className) {
                    if (this.contains(className)) {
                        this.remove(className);
                    } else {
                        this.add(className);
                    }
                }
            }
        };
    });

    it('should show and hide elements', () => {
        DOMUtils.show(mockElement);
        expect(mockElement.style.display).toBe('block');

        DOMUtils.hide(mockElement);
        expect(mockElement.style.display).toBe('none');

        DOMUtils.showFlex(mockElement);
        expect(mockElement.style.display).toBe('flex');
    });

    it('should set text and HTML content', () => {
        DOMUtils.setText(mockElement, 'new text');
        expect(mockElement.textContent).toBe('new text');

        DOMUtils.setHTML(mockElement, '<span>new html</span>');
        expect(mockElement.innerHTML).toBe('<span>new html</span>');
    });

    it('should handle CSS classes', () => {
        DOMUtils.addClass(mockElement, 'test-class');
        expect(mockElement.classList.contains('test-class')).toBe(true);

        DOMUtils.removeClass(mockElement, 'test-class');
        expect(mockElement.classList.contains('test-class')).toBe(false);

        DOMUtils.toggleClass(mockElement, 'toggle-class');
        expect(mockElement.classList.contains('toggle-class')).toBe(true);

        DOMUtils.toggleClass(mockElement, 'toggle-class');
        expect(mockElement.classList.contains('toggle-class')).toBe(false);
    });

    it('should handle null elements gracefully', () => {
        expect(() => DOMUtils.show(null)).not.toThrow();
        expect(() => DOMUtils.setText(null, 'text')).not.toThrow();
        expect(() => DOMUtils.addClass(null, 'class')).not.toThrow();
        expect(DOMUtils.hasClass(null, 'class')).toBe(false);
    });
});

describe('UI Utils', () => {
    let originalDOM, originalGlobalDOM;

    beforeEach(() => {
        // Save both window.DOM and global DOM
        originalDOM = window.DOM;
        originalGlobalDOM = window.DOM || global.DOM;
        
        // Create mock DOM and set it globally
        const mockDOM = TestData.createMockDOM();
        window.DOM = mockDOM;
        
        // Also set the global DOM variable that utilities use
        if (typeof global !== 'undefined') {
            global.DOM = mockDOM;
        }
        // Override the const DOM for the test environment
        if (typeof window !== 'undefined' && window.DOM) {
            window.DOM = mockDOM;
        }
    });

    afterEach(() => {
        window.DOM = originalDOM;
        if (typeof global !== 'undefined') {
            global.DOM = originalGlobalDOM;
        }
    });

    it('should show loading state', () => {
        UIUtils.showLoading();
        expect(window.DOM.loading.style.display).toBe('flex');
        expect(window.DOM.error.style.display).toBe('none');
        expect(window.DOM.weatherContent.style.display).toBe('none');
    });

    it('should show error state', () => {
        UIUtils.showError('Test error message');
        expect(window.DOM.errorMessage.textContent).toBe('Test error message');
        expect(window.DOM.loading.style.display).toBe('none');
        expect(window.DOM.error.style.display).toBe('flex');
        expect(window.DOM.weatherContent.style.display).toBe('none');
    });

    it('should show weather content', () => {
        UIUtils.showWeatherContent();
        expect(window.DOM.loading.style.display).toBe('none');
        expect(window.DOM.error.style.display).toBe('none');
        expect(window.DOM.weatherContent.style.display).toBe('block');
    });

    it('should show loading with custom message', () => {
        UIUtils.showLoadingWithMessage('Custom loading message');
        expect(window.DOM.loading.style.display).toBe('flex');
    });
    });
};