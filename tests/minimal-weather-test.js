// Minimal Weather Alerts Test - Just to verify basic functionality

TestFramework.describe('WeatherAlerts Minimal', () => {
    TestFramework.it('should exist as a global object', () => {
        TestFramework.expect(typeof WeatherAlerts).toBe('object');
    });

    TestFramework.it('should have getMeteoAlarmFeed function', () => {
        TestFramework.expect(typeof WeatherAlerts.getMeteoAlarmFeed).toBe('function');
    });

    TestFramework.it('should return a string from getMeteoAlarmFeed', () => {
        const result = WeatherAlerts.getMeteoAlarmFeed('Germany');
        TestFramework.expect(typeof result).toBe('string');
        TestFramework.expect(result.length).toBeGreaterThan(0);
    });
});