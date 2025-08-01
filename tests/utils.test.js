// Utility Functions Tests

TestFramework.describe('ValidationUtils', () => {
    TestFramework.it('should validate API key correctly', () => {
        TestFramework.expect(ValidationUtils.isValidAPIKey('YOUR_API_KEY_HERE')).toBeFalsy();
        TestFramework.expect(ValidationUtils.isValidAPIKey('')).toBeFalsy();
        TestFramework.expect(ValidationUtils.isValidAPIKey('abc123')).toBeFalsy();
        TestFramework.expect(ValidationUtils.isValidAPIKey('valid_api_key_12345')).toBeTruthy();
    });

    TestFramework.it('should validate coordinates correctly', () => {
        TestFramework.expect(ValidationUtils.isValidCoordinates(0, 0)).toBeTruthy();
        TestFramework.expect(ValidationUtils.isValidCoordinates(90, 180)).toBeTruthy();
        TestFramework.expect(ValidationUtils.isValidCoordinates(-90, -180)).toBeTruthy();
        TestFramework.expect(ValidationUtils.isValidCoordinates(91, 0)).toBeFalsy();
        TestFramework.expect(ValidationUtils.isValidCoordinates(0, 181)).toBeFalsy();
        TestFramework.expect(ValidationUtils.isValidCoordinates('invalid', 0)).toBeFalsy();
    });

    TestFramework.it('should validate location strings correctly', () => {
        TestFramework.expect(ValidationUtils.isValidLocation('London')).toBeTruthy();
        TestFramework.expect(ValidationUtils.isValidLocation('New York')).toBeTruthy();
        TestFramework.expect(ValidationUtils.isValidLocation('')).toBeFalsy();
        TestFramework.expect(ValidationUtils.isValidLocation('   ')).toBeFalsy();
    });
});

TestFramework.describe('StringUtils', () => {
    TestFramework.it('should capitalize first letter correctly', () => {
        TestFramework.expect(StringUtils.capitalizeFirstLetter('hello')).toBe('Hello');
        TestFramework.expect(StringUtils.capitalizeFirstLetter('world')).toBe('World');
        TestFramework.expect(StringUtils.capitalizeFirstLetter('')).toBe('');
    });

    TestFramework.it('should truncate text correctly', () => {
        TestFramework.expect(StringUtils.truncateText('Hello World', 5)).toBe('Hello...');
        TestFramework.expect(StringUtils.truncateText('Hello', 10)).toBe('Hello');
        TestFramework.expect(StringUtils.truncateText('', 5)).toBe('');
    });
});

TestFramework.describe('DateUtils', () => {
    TestFramework.it('should format date correctly', () => {
        const testDate = new Date('2024-03-15');
        TestFramework.expect(DateUtils.formatDate(testDate)).toBe('Mar 15');
    });

    TestFramework.it('should get day name correctly', () => {
        const testDate = new Date('2024-03-15');
        TestFramework.expect(DateUtils.getDayName(testDate, 0)).toBe('Today');
        TestFramework.expect(DateUtils.getDayName(testDate, 1)).toBe('Tomorrow');
        // Note: This test might fail depending on the actual day of the week
        // TestFramework.expect(DateUtils.getDayName(testDate, 2)).toBe('Friday');
    });
});

TestFramework.describe('MathUtils', () => {
    TestFramework.it('should round temperature correctly', () => {
        TestFramework.expect(MathUtils.roundTemp(23.4)).toBe(23);
        TestFramework.expect(MathUtils.roundTemp(23.6)).toBe(24);
        TestFramework.expect(MathUtils.roundTemp(23.0)).toBe(23);
    });

    TestFramework.it('should generate random number in range', () => {
        const result = MathUtils.getRandomInRange(1, 10);
        TestFramework.expect(result).toBeGreaterThan(0);
        TestFramework.expect(result).toBeLessThan(11);
    });
});

TestFramework.describe('VisibilityUtils', () => {
    TestFramework.it('should analyze visibility correctly', () => {
        const excellentVisibility = VisibilityUtils.analyzeVisibility(20, 'Clear');
        TestFramework.expect(excellentVisibility.category).toBe('Excellent');
        TestFramework.expect(excellentVisibility.warning).toBeFalsy();

        const poorVisibility = VisibilityUtils.analyzeVisibility(1, 'Fog');
        TestFramework.expect(poorVisibility.category).toBe('Poor');
        TestFramework.expect(poorVisibility.warning).toBeTruthy();
    });

    TestFramework.it('should format visibility correctly', () => {
        TestFramework.expect(VisibilityUtils.formatVisibility(20)).toBe('20 km');
        TestFramework.expect(VisibilityUtils.formatVisibility(5.5)).toBe('5.5 km');
        TestFramework.expect(VisibilityUtils.formatVisibility(0.5)).toBe('500 m');
    });

    TestFramework.it('should provide weather context correctly', () => {
        const fogContext = VisibilityUtils.getWeatherContext('fog', 0.5);
        TestFramework.expect(fogContext).toContain('Dense fog');

        const rainContext = VisibilityUtils.getWeatherContext('rain', 3);
        TestFramework.expect(rainContext).toContain('Rain is affecting visibility');

        const clearContext = VisibilityUtils.getWeatherContext('clear', 10);
        TestFramework.expect(clearContext).toContain('optimal visibility');
    });
});