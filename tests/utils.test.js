// Utility Functions Tests

describe('UIUtils', () => {
    let mockElements;

    beforeEach(() => {
        mockElements = TestUtils.setupDOMMocks();
    });

    afterEach(() => {
        TestUtils.resetMocks();
    });

    describe('showLoading', () => {
        it('should display loading element and hide others', () => {
            UIUtils.showLoading();

            expect(mockElements.loading.style.display).toBe('flex');
            expect(mockElements.error.style.display).toBe('none');
            expect(mockElements.weatherContent.style.display).toBe('none');
        });

        it('should set default loading message', () => {
            const mockLoadingText = { textContent: '' };
            mockElements.loading.querySelector = TestRunner.fn().mockReturnValue(mockLoadingText);

            UIUtils.showLoading();

            expect(mockLoadingText.textContent).toBe('Getting your location and weather data...');
        });
    });

    describe('showLoadingWithMessage', () => {
        it('should display loading with custom message', () => {
            const customMessage = 'Searching for weather data...';
            const mockLoadingText = { textContent: '' };
            mockElements.loading.querySelector = TestRunner.fn().mockReturnValue(mockLoadingText);

            UIUtils.showLoadingWithMessage(customMessage);

            expect(mockLoadingText.textContent).toBe(customMessage);
            expect(mockElements.loading.style.display).toBe('flex');
        });

        it('should handle missing loading text element gracefully', () => {
            mockElements.loading.querySelector = TestRunner.fn().mockReturnValue(null);

            expect(() => {
                UIUtils.showLoadingWithMessage('Test message');
            }).not.toThrow();
        });
    });

    describe('showError', () => {
        it('should display error message and hide other elements', () => {
            const errorMessage = 'Test error message';

            UIUtils.showError(errorMessage);

            expect(mockElements.errorMessage.textContent).toBe(errorMessage);
            expect(mockElements.loading.style.display).toBe('none');
            expect(mockElements.error.style.display).toBe('flex');
            expect(mockElements.weatherContent.style.display).toBe('none');
        });
    });

    describe('showWeatherContent', () => {
        it('should display weather content and hide loading/error', () => {
            UIUtils.showWeatherContent();

            expect(mockElements.loading.style.display).toBe('none');
            expect(mockElements.error.style.display).toBe('none');
            expect(mockElements.weatherContent.style.display).toBe('block');
        });
    });
});

describe('DateUtils', () => {
    describe('formatDate', () => {
        it('should format date string correctly', () => {
            const dateString = '2023-12-25';
            const result = DateUtils.formatDate(dateString);
            
            expect(result).toContain('Dec');
            expect(result).toContain('25');
        });

        it('should handle different date formats', () => {
            const dateString = '2023-01-01';
            const result = DateUtils.formatDate(dateString);
            
            expect(result).toContain('Jan');
            expect(result).toContain('1');
        });
    });

    describe('getDayName', () => {
        it('should return "Today" for index 0', () => {
            const result = DateUtils.getDayName('2023-12-25', 0);
            expect(result).toBe('Today');
        });

        it('should return "Tomorrow" for index 1', () => {
            const result = DateUtils.getDayName('2023-12-26', 1);
            expect(result).toBe('Tomorrow');
        });

        it('should return weekday name for other indices', () => {
            const result = DateUtils.getDayName('2023-12-27', 2);
            expect(result).toMatch(/Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday/);
        });
    });

    describe('formatDateTime', () => {
        it('should format valid date string', () => {
            const dateString = '2023-12-25T10:30:00';
            const result = DateUtils.formatDateTime(dateString);
            
            expect(result).toBeTruthy();
            expect(result).toContain('2023');
        });

        it('should return empty string for null/undefined', () => {
            expect(DateUtils.formatDateTime(null)).toBe('');
            expect(DateUtils.formatDateTime(undefined)).toBe('');
            expect(DateUtils.formatDateTime('')).toBe('');
        });
    });
});

describe('MathUtils', () => {
    describe('roundTemp', () => {
        it('should round temperature to nearest integer', () => {
            expect(MathUtils.roundTemp(23.7)).toBe(24);
            expect(MathUtils.roundTemp(15.2)).toBe(15);
            expect(MathUtils.roundTemp(-5.8)).toBe(-6);
        });

        it('should handle zero and negative temperatures', () => {
            expect(MathUtils.roundTemp(0)).toBe(0);
            expect(MathUtils.roundTemp(-0.4)).toBe(0);
            expect(MathUtils.roundTemp(-10.5)).toBe(-10);
        });
    });

    describe('getRandomInRange', () => {
        it('should return number within specified range', () => {
            const min = 10;
            const max = 20;
            const result = MathUtils.getRandomInRange(min, max);
            
            expect(result).toBeGreaterThanOrEqual(min);
            expect(result).toBeLessThanOrEqual(max);
        });

        it('should work with negative ranges', () => {
            const min = -10;
            const max = -5;
            const result = MathUtils.getRandomInRange(min, max);
            
            expect(result).toBeGreaterThanOrEqual(min);
            expect(result).toBeLessThanOrEqual(max);
        });
    });

    describe('getRandomPercentage', () => {
        it('should return percentage string', () => {
            const result = MathUtils.getRandomPercentage();
            
            expect(result).toMatch(/^\d+(\.\d+)?%$/);
        });

        it('should return valid percentage value', () => {
            const result = MathUtils.getRandomPercentage();
            const numericValue = parseFloat(result.replace('%', ''));
            
            expect(numericValue).toBeGreaterThanOrEqual(0);
            expect(numericValue).toBeLessThanOrEqual(100);
        });
    });
});

describe('StringUtils', () => {
    describe('capitalizeFirstLetter', () => {
        it('should capitalize first letter of string', () => {
            expect(StringUtils.capitalizeFirstLetter('hello')).toBe('Hello');
            expect(StringUtils.capitalizeFirstLetter('world')).toBe('World');
        });

        it('should handle empty and single character strings', () => {
            expect(StringUtils.capitalizeFirstLetter('')).toBe('');
            expect(StringUtils.capitalizeFirstLetter('a')).toBe('A');
        });

        it('should handle already capitalized strings', () => {
            expect(StringUtils.capitalizeFirstLetter('Hello')).toBe('Hello');
        });

        it('should handle strings with numbers and special characters', () => {
            expect(StringUtils.capitalizeFirstLetter('123abc')).toBe('123abc');
            expect(StringUtils.capitalizeFirstLetter('!hello')).toBe('!hello');
        });
    });

    describe('truncateText', () => {
        it('should truncate text longer than maxLength', () => {
            const text = 'This is a very long text that should be truncated';
            const result = StringUtils.truncateText(text, 20);
            
            expect(result).toBe('This is a very long ...'); 
            expect(result.length).toBe(23); // 20 + '...'
        });

        it('should not truncate text shorter than maxLength', () => {
            const text = 'Short text';
            const result = StringUtils.truncateText(text, 20);
            
            expect(result).toBe('Short text');
        });

        it('should handle text exactly at maxLength', () => {
            const text = 'Exactly twenty chars';
            const result = StringUtils.truncateText(text, 20);
            
            expect(result).toBe('Exactly twenty chars');
        });

        it('should handle empty string', () => {
            const result = StringUtils.truncateText('', 10);
            expect(result).toBe('');
        });
    });
});

describe('ValidationUtils', () => {
    describe('isValidAPIKey', () => {
        it('should return false for invalid API keys', () => {
            expect(ValidationUtils.isValidAPIKey(null)).toBe(false);
            expect(ValidationUtils.isValidAPIKey(undefined)).toBe(false);
            expect(ValidationUtils.isValidAPIKey('')).toBe(false);
            expect(ValidationUtils.isValidAPIKey('YOUR_API_KEY_HERE')).toBe(false);
            expect(ValidationUtils.isValidAPIKey('short')).toBe(false);
        });

        it('should return true for valid API keys', () => {
            expect(ValidationUtils.isValidAPIKey('abcd1234567890')).toBe(true);
            expect(ValidationUtils.isValidAPIKey('valid-api-key-123')).toBe(true);
        });
    });

    describe('isValidLocation', () => {
        it('should return false for invalid locations', () => {
            expect(ValidationUtils.isValidLocation(null)).toBe(false);
            expect(ValidationUtils.isValidLocation(undefined)).toBe(false);
            expect(ValidationUtils.isValidLocation('')).toBe(false);
            expect(ValidationUtils.isValidLocation('   ')).toBe(false);
        });

        it('should return true for valid locations', () => {
            expect(ValidationUtils.isValidLocation('London')).toBe(true);
            expect(ValidationUtils.isValidLocation('New York')).toBe(true);
            expect(ValidationUtils.isValidLocation('  Paris  ')).toBe(true);
        });
    });

    describe('isValidCoordinates', () => {
        it('should return false for invalid coordinates', () => {
            expect(ValidationUtils.isValidCoordinates(null, null)).toBe(false);
            expect(ValidationUtils.isValidCoordinates('invalid', 'invalid')).toBe(false);
            expect(ValidationUtils.isValidCoordinates(91, 0)).toBe(false); // lat > 90
            expect(ValidationUtils.isValidCoordinates(-91, 0)).toBe(false); // lat < -90
            expect(ValidationUtils.isValidCoordinates(0, 181)).toBe(false); // lon > 180
            expect(ValidationUtils.isValidCoordinates(0, -181)).toBe(false); // lon < -180
        });

        it('should return true for valid coordinates', () => {
            expect(ValidationUtils.isValidCoordinates(0, 0)).toBe(true);
            expect(ValidationUtils.isValidCoordinates(90, 180)).toBe(true);
            expect(ValidationUtils.isValidCoordinates(-90, -180)).toBe(true);
            expect(ValidationUtils.isValidCoordinates(51.5074, -0.1278)).toBe(true); // London
        });
    });
});

describe('VisibilityUtils', () => {
    describe('analyzeVisibility', () => {
        it('should categorize excellent visibility correctly', () => {
            const result = VisibilityUtils.analyzeVisibility(25, 'Clear');
            
            expect(result.category).toBe('Excellent');
            expect(result.cssClass).toBe('visibility-excellent');
            expect(result.warning).toBe(null);
            expect(result.activities).toContain('Perfect for all outdoor activities');
        });

        it('should categorize poor visibility correctly', () => {
            const result = VisibilityUtils.analyzeVisibility(0.8, 'Heavy fog');
            
            expect(result.category).toBe('Poor');
            expect(result.cssClass).toBe('visibility-poor');
            expect(result.warning).toBeTruthy();
            expect(result.drivingAdvice).toContain('caution');
        });

        it('should categorize very poor visibility correctly', () => {
            const result = VisibilityUtils.analyzeVisibility(0.5, 'Dense fog');
            
            expect(result.category).toBe('Very Poor');
            expect(result.cssClass).toBe('visibility-very-poor');
            expect(result.warning).toBeTruthy();
            expect(result.activities).toContain('Avoid all non-essential outdoor activities');
        });

        it('should categorize extremely poor visibility correctly', () => {
            const result = VisibilityUtils.analyzeVisibility(0.1, 'Blizzard');
            
            expect(result.category).toBe('Extremely Poor');
            expect(result.cssClass).toBe('visibility-extreme');
            expect(result.warning).toBeTruthy();
            expect(result.drivingAdvice).toContain('Avoid driving');
        });
    });

    describe('getWeatherContext', () => {
        it('should provide fog-specific context', () => {
            const context = VisibilityUtils.getWeatherContext('fog', 0.5);
            expect(context).toContain('fog');
            expect(context.toLowerCase()).toContain('fog');
        });

        it('should provide rain-specific context', () => {
            const context = VisibilityUtils.getWeatherContext('heavy rain', 2);
            expect(context).toBeTruthy();
            expect(context.toLowerCase()).toContain('rain');
        });

        it('should provide snow-specific context', () => {
            const context = VisibilityUtils.getWeatherContext('heavy snow', 1);
            expect(context).toBeTruthy();
            expect(context.toLowerCase()).toContain('snow');
        });

        it('should provide clear weather context', () => {
            const context = VisibilityUtils.getWeatherContext('clear', 25);
            expect(context).toBeTruthy();
            expect(context.toLowerCase()).toContain('clear');
        });

        it('should return null for unrecognized conditions', () => {
            const context = VisibilityUtils.getWeatherContext('unknown condition', 10);
            expect(context).toBe(null);
        });
    });

    describe('formatVisibility', () => {
        it('should format high visibility in kilometers', () => {
            expect(VisibilityUtils.formatVisibility(15)).toBe('15 km');
            expect(VisibilityUtils.formatVisibility(10.7)).toBe('11 km');
        });

        it('should format medium visibility with decimal', () => {
            expect(VisibilityUtils.formatVisibility(5.5)).toBe('5.5 km');
            expect(VisibilityUtils.formatVisibility(2.3)).toBe('2.3 km');
        });

        it('should format low visibility in meters', () => {
            expect(VisibilityUtils.formatVisibility(0.5)).toBe('500 m');
            expect(VisibilityUtils.formatVisibility(0.2)).toBe('200 m');
        });

        it('should handle edge cases', () => {
            expect(VisibilityUtils.formatVisibility(1.0)).toBe('1.0 km');
            expect(VisibilityUtils.formatVisibility(10.0)).toBe('10 km');
        });
    });
});

describe('decodeBase64UTF8', () => {
    it('should decode valid base64 string', () => {
        const encoded = btoa('Hello World');
        const decoded = decodeBase64UTF8(encoded);
        expect(decoded).toBe('Hello World');
    });

    it('should handle UTF-8 characters', () => {
        const text = 'Café ñoño';
        const encoded = btoa(unescape(encodeURIComponent(text)));
        const decoded = decodeBase64UTF8(encoded);
        expect(decoded).toBe(text);
    });

    it('should fallback to atob on error', () => {
        const invalidBase64 = 'invalid-base64!@#';
        
        // Mock atob to return a test value
        const originalAtob = window.atob;
        window.atob = TestRunner.fn().mockReturnValue('fallback result');
        
        const result = decodeBase64UTF8(invalidBase64);
        expect(result).toBe('fallback result');
        
        // Restore original atob
        window.atob = originalAtob;
    });

    it('should handle empty string', () => {
        const result = decodeBase64UTF8('');
        expect(result).toBe('');
    });
});

// Integration tests for utility functions working together
describe('Utility Integration', () => {
    let mockElements;

    beforeEach(() => {
        mockElements = TestUtils.setupDOMMocks();
    });

    afterEach(() => {
        TestUtils.resetMocks();
    });

    it('should validate API key and show appropriate UI state', () => {
        const validKey = 'valid-api-key-123456';
        const invalidKey = 'YOUR_API_KEY_HERE';
        
        // Test valid key doesn't trigger error
        const isValid = ValidationUtils.isValidAPIKey(validKey);
        expect(isValid).toBe(true);
        
        // Test invalid key triggers error
        const isInvalid = ValidationUtils.isValidAPIKey(invalidKey);
        expect(isInvalid).toBe(false);
        
        if (!isInvalid) {
            UIUtils.showError('Invalid API key');
            expect(mockElements.error.style.display).toBe('flex');
        }
    });

    it('should format and display weather data correctly', () => {
        const temperature = 23.7;
        const dateString = '2023-12-25';
        
        const roundedTemp = MathUtils.roundTemp(temperature);
        const formattedDate = DateUtils.formatDate(dateString);
        
        expect(roundedTemp).toBe(24);
        expect(formattedDate).toContain('Dec');
        
        // Simulate displaying the data
        UIUtils.showWeatherContent();
        expect(mockElements.weatherContent.style.display).toBe('block');
    });

    it('should handle location validation and search', () => {
        const validLocation = 'London, UK';
        const invalidLocation = '   ';
        
        expect(ValidationUtils.isValidLocation(validLocation)).toBe(true);
        expect(ValidationUtils.isValidLocation(invalidLocation)).toBe(false);
        
        // If location is invalid, show error
        if (!ValidationUtils.isValidLocation(invalidLocation)) {
            UIUtils.showError('Please enter a valid location');
            expect(mockElements.errorMessage.textContent).toBe('Please enter a valid location');
        }
    });

    it('should analyze visibility and provide appropriate warnings', () => {
        const poorVisibility = 0.5;
        const goodVisibility = 15;
        
        const poorAnalysis = VisibilityUtils.analyzeVisibility(poorVisibility, 'Dense fog');
        const goodAnalysis = VisibilityUtils.analyzeVisibility(goodVisibility, 'Clear');
        
        expect(poorAnalysis.warning).toBeTruthy();
        expect(goodAnalysis.warning).toBe(null);
        
        expect(poorAnalysis.category).toBe('Very Poor');
        expect(goodAnalysis.category).toBe('Very Good');
    });
});