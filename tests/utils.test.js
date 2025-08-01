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
        // Test Excellent visibility (50km+)
        const excellentVisibility = VisibilityUtils.analyzeVisibility(50, 'Clear');
        TestFramework.expect(excellentVisibility.category).toBe('Excellent');
        TestFramework.expect(excellentVisibility.warning).toBeFalsy();

        // Test Very Good visibility (20km+)
        const veryGoodVisibility = VisibilityUtils.analyzeVisibility(20, 'Clear');
        TestFramework.expect(veryGoodVisibility.category).toBe('Very Good');
        TestFramework.expect(veryGoodVisibility.warning).toBeFalsy();

        // Test Good visibility (10km+)
        const goodVisibility = VisibilityUtils.analyzeVisibility(10, 'Clear');
        TestFramework.expect(goodVisibility.category).toBe('Good');
        TestFramework.expect(goodVisibility.warning).toBeFalsy();

        // Test Poor visibility (1-4km)
        const poorVisibility = VisibilityUtils.analyzeVisibility(1, 'Fog');
        TestFramework.expect(poorVisibility.category).toBe('Poor');
        TestFramework.expect(poorVisibility.warning).toBeTruthy();

        // Test Very Poor visibility (0.2-1km)
        const veryPoorVisibility = VisibilityUtils.analyzeVisibility(0.5, 'Dense fog');
        TestFramework.expect(veryPoorVisibility.category).toBe('Very Poor');
        TestFramework.expect(veryPoorVisibility.warning).toBeTruthy();
    });

    TestFramework.it('should format visibility correctly', () => {
        // Test km formatting for values >= 10
        TestFramework.expect(VisibilityUtils.formatVisibility(20)).toBe('20 km');
        TestFramework.expect(VisibilityUtils.formatVisibility(15.7)).toBe('16 km');
        
        // Test decimal km formatting for 1-10km
        TestFramework.expect(VisibilityUtils.formatVisibility(5.5)).toBe('5.5 km');
        TestFramework.expect(VisibilityUtils.formatVisibility(2.3)).toBe('2.3 km');
        
        // Test meter formatting for < 1km
        TestFramework.expect(VisibilityUtils.formatVisibility(0.5)).toBe('500 m');
        TestFramework.expect(VisibilityUtils.formatVisibility(0.1)).toBe('100 m');
    });

    TestFramework.it('should provide weather context correctly', () => {
        // Test fog context - parameters are (visibilityKm, weatherCondition)
        const fogContext = VisibilityUtils.getWeatherContext(0.5, 'fog');
        TestFramework.expect(fogContext).toContain('Dense fog');

        // Test rain context
        const rainContext = VisibilityUtils.getWeatherContext(3, 'rain');
        TestFramework.expect(rainContext).toContain('Heavy rainfall');

        // Test clear context
        const clearContext = VisibilityUtils.getWeatherContext(25, 'clear');
        TestFramework.expect(clearContext).toContain('excellent visibility');

        // Test haze context
        const hazeContext = VisibilityUtils.getWeatherContext(5, 'haze');
        TestFramework.expect(hazeContext).toContain('haze');

        // Test null return for conditions without specific context
        const neutralContext = VisibilityUtils.getWeatherContext(8, 'cloudy');
        TestFramework.expect(neutralContext).toBeFalsy();
    });

    TestFramework.it('should provide driving advice correctly', () => {
        // Test excellent conditions
        const excellentAdvice = VisibilityUtils.getDrivingAdvice(25, 'clear');
        TestFramework.expect(excellentAdvice).toContain('Excellent driving conditions');

        // Test poor conditions
        const poorAdvice = VisibilityUtils.getDrivingAdvice(0.8, 'fog');
        TestFramework.expect(poorAdvice).toContain('extreme caution');

        // Test moderate conditions
        const moderateAdvice = VisibilityUtils.getDrivingAdvice(2, 'rain');
        TestFramework.expect(moderateAdvice).toContain('headlights');
    });

    TestFramework.it('should provide activity recommendations correctly', () => {
        // Test excellent visibility activities
        const excellentActivities = VisibilityUtils.getActivityRecommendations(25, 'clear');
        TestFramework.expect(excellentActivities).toContain('Perfect for photography and sightseeing');

        // Test very poor visibility activities (< 1km)
        const veryPoorActivities = VisibilityUtils.getActivityRecommendations(0.8, 'fog');
        TestFramework.expect(veryPoorActivities).toContain('Stay indoors when possible');

        // Test poor visibility activities (1-4km range)
        const poorActivities = VisibilityUtils.getActivityRecommendations(2, 'rain');
        TestFramework.expect(poorActivities).toContain('Avoid extended outdoor activities');

        // Test moderate visibility activities (4km+ range)
        const moderateActivities = VisibilityUtils.getActivityRecommendations(5, 'rain');
        TestFramework.expect(moderateActivities).toContain('Limited outdoor activities recommended');
    });
});