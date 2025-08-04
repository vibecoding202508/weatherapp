// Simple Weather Alerts Tests - Non-conflicting version

TestFramework.describe('WeatherAlerts Basic Tests', () => {
    
    TestFramework.describe('getMeteoAlarmFeed', () => {
        TestFramework.it('should return correct feed URL for Germany', () => {
            const germanFeed = WeatherAlerts.getMeteoAlarmFeed('Germany');
            TestFramework.expect(germanFeed).toBe('https://feeds.meteoalarm.org/feeds/meteoalarm-legacy-rss-germany');
        });

        TestFramework.it('should return correct feed URL for France', () => {
            const franceFeed = WeatherAlerts.getMeteoAlarmFeed('France');
            TestFramework.expect(franceFeed).toBe('https://feeds.meteoalarm.org/feeds/meteoalarm-legacy-rss-france');
        });

        TestFramework.it('should return default Europe feed for unknown countries', () => {
            const unknownFeed = WeatherAlerts.getMeteoAlarmFeed('UnknownCountry');
            TestFramework.expect(unknownFeed).toBe('https://feeds.meteoalarm.org/feeds/meteoalarm-legacy-rss-europe');
        });
    });

    TestFramework.describe('extractSeverityFromTitle', () => {
        TestFramework.it('should extract extreme severity correctly', () => {
            TestFramework.expect(WeatherAlerts.extractSeverityFromTitle('Red Alert: Extreme Weather Warning')).toBe('extreme');
            TestFramework.expect(WeatherAlerts.extractSeverityFromTitle('EXTREME weather conditions')).toBe('extreme');
        });

        TestFramework.it('should extract severe severity correctly', () => {
            TestFramework.expect(WeatherAlerts.extractSeverityFromTitle('Orange Alert: Severe Storm Warning')).toBe('severe');
            TestFramework.expect(WeatherAlerts.extractSeverityFromTitle('SEVERE thunderstorms expected')).toBe('severe');
        });

        TestFramework.it('should extract moderate severity correctly', () => {
            TestFramework.expect(WeatherAlerts.extractSeverityFromTitle('Yellow Alert: Moderate Rain Warning')).toBe('moderate');
            TestFramework.expect(WeatherAlerts.extractSeverityFromTitle('MODERATE wind conditions')).toBe('moderate');
        });

        TestFramework.it('should default to moderate for unknown severity', () => {
            TestFramework.expect(WeatherAlerts.extractSeverityFromTitle('Weather Warning')).toBe('moderate');
            TestFramework.expect(WeatherAlerts.extractSeverityFromTitle('')).toBe('moderate');
        });
    });

    TestFramework.describe('extractEventTypeFromTitle', () => {
        TestFramework.it('should extract wind events correctly', () => {
            TestFramework.expect(WeatherAlerts.extractEventTypeFromTitle('High Wind Warning')).toBe('Wind');
            TestFramework.expect(WeatherAlerts.extractEventTypeFromTitle('Strong winds expected')).toBe('Wind');
        });

        TestFramework.it('should extract rain events correctly', () => {
            TestFramework.expect(WeatherAlerts.extractEventTypeFromTitle('Heavy Rain Alert')).toBe('Rain');
            TestFramework.expect(WeatherAlerts.extractEventTypeFromTitle('Precipitation warning')).toBe('Rain');
        });

        TestFramework.it('should extract snow/ice events correctly', () => {
            TestFramework.expect(WeatherAlerts.extractEventTypeFromTitle('Snow Storm Warning')).toBe('Snow/Ice');
            TestFramework.expect(WeatherAlerts.extractEventTypeFromTitle('Ice conditions expected')).toBe('Snow/Ice');
        });

        TestFramework.it('should default to general warning for unknown events', () => {
            TestFramework.expect(WeatherAlerts.extractEventTypeFromTitle('Weather Alert')).toBe('General Weather Warning');
            TestFramework.expect(WeatherAlerts.extractEventTypeFromTitle('')).toBe('General Weather Warning');
        });
    });

    TestFramework.describe('getSeverityText', () => {
        TestFramework.it('should return correct text for all severity levels', () => {
            TestFramework.expect(WeatherAlerts.getSeverityText('extreme')).toBe('Extreme');
            TestFramework.expect(WeatherAlerts.getSeverityText('severe')).toBe('Severe');
            TestFramework.expect(WeatherAlerts.getSeverityText('moderate')).toBe('Moderate');
            TestFramework.expect(WeatherAlerts.getSeverityText('minor')).toBe('Minor');
        });

        TestFramework.it('should default to Moderate for unknown severity', () => {
            TestFramework.expect(WeatherAlerts.getSeverityText('unknown')).toBe('Moderate');
            TestFramework.expect(WeatherAlerts.getSeverityText(null)).toBe('Moderate');
            TestFramework.expect(WeatherAlerts.getSeverityText(undefined)).toBe('Moderate');
        });
    });

    TestFramework.describe('filterAlertsForLocation', () => {
        const mockAlerts = [
            {
                title: 'London Weather Alert',
                description: 'Severe weather warning for London area'
            },
            {
                title: 'Paris Storm Warning',
                description: 'Storm affecting Paris region'
            },
            {
                title: 'General UK Weather Alert',
                description: 'Weather warning affecting multiple UK regions'
            }
        ];

        TestFramework.it('should return all alerts when no location provided', () => {
            const result = WeatherAlerts.filterAlertsForLocation(mockAlerts, null);
            TestFramework.expect(result).toBe(mockAlerts);
        });

        TestFramework.it('should return empty array when alerts array is empty', () => {
            const result = WeatherAlerts.filterAlertsForLocation([], { name: 'London', region: 'UK' });
            TestFramework.expect(result).toEqual([]);
        });

        TestFramework.it('should filter alerts for specific location', () => {
            const location = { name: 'London', region: 'UK' };
            const result = WeatherAlerts.filterAlertsForLocation(mockAlerts, location);
            
            // Should include London-specific alerts
            TestFramework.expect(result.length).toBeGreaterThan(0);
            TestFramework.expect(result.some(alert => alert.title.includes('London'))).toBeTruthy();
        });
    });

    TestFramework.describe('parseMeteoAlarmRSS', () => {
        TestFramework.it('should return empty array for RSS with no items', () => {
            const mockXmlDoc = {
                getElementsByTagName: TestFramework.createMockFunction().mockImplementation((tagName) => {
                    if (tagName === 'item') return [];
                    if (tagName === 'rss') return [{}]; // Valid RSS but no items
                    if (tagName === 'channel') return [{ getElementsByTagName: () => [] }];
                    return [];
                })
            };

            const alerts = WeatherAlerts.parseMeteoAlarmRSS(mockXmlDoc);
            TestFramework.expect(alerts).toEqual([]);
        });
    });
});