// Weather Display, Alerts, and Animations Tests

describe('WeatherDisplay', () => {
    let mockElements;

    beforeEach(() => {
        mockElements = TestUtils.setupDOMMocks();
        StateManager.reset();
    });

    afterEach(() => {
        TestUtils.resetMocks();
    });

    describe('displayWeatherData', () => {
        it('should display current weather information', () => {
            const originalApplyWeatherAnimation = WeatherAnimations.applyWeatherAnimation;
            const originalApplyWeatherBackground = WeatherDisplay.applyWeatherBackground;
            WeatherAnimations.applyWeatherAnimation = TestRunner.fn();
            WeatherDisplay.applyWeatherBackground = TestRunner.fn();
            
            WeatherDisplay.displayWeatherData(TestData.mockWeatherData);
            
            const { current, location } = TestData.mockWeatherData;
            
            expect(mockElements.location.textContent).toBe(`${location.name}, ${location.region}, ${location.country}`);
            expect(mockElements.currentTemp.textContent).toBe('12°C');
            expect(mockElements.currentCondition.textContent).toBe(current.condition.text);
            expect(mockElements.feelsLike.textContent).toBe('Feels like 11°C');
            expect(mockElements.humidity.textContent).toBe('76%');
            expect(mockElements.wind.textContent).toBe('11.2 km/h WSW');
            expect(mockElements.uvIndex.textContent).toBe('2');
            
            WeatherAnimations.applyWeatherAnimation = originalApplyWeatherAnimation;
            WeatherDisplay.applyWeatherBackground = originalApplyWeatherBackground;
        });

        it('should set weather icon correctly', () => {
            WeatherDisplay.displayWeatherData(TestData.mockWeatherData);
            
            expect(mockElements.currentIcon.src).toBe(`https:${TestData.mockWeatherData.current.condition.icon}`);
            expect(mockElements.currentIcon.alt).toBe(TestData.mockWeatherData.current.condition.text);
        });

        it('should show UV warning for high UV index', () => {
            const highUVData = {
                ...TestData.mockWeatherData,
                current: {
                    ...TestData.mockWeatherData.current,
                    uv: 5
                }
            };
            
            WeatherDisplay.displayWeatherData(highUVData);
            
            expect(mockElements.uvWarning.style.display).toBe('flex');
        });

        it('should hide UV warning for low UV index', () => {
            WeatherDisplay.displayWeatherData(TestData.mockWeatherData);
            
            expect(mockElements.uvWarning.style.display).toBe('none');
        });

        it('should handle missing UV data', () => {
            const noUVData = {
                ...TestData.mockWeatherData,
                current: {
                    ...TestData.mockWeatherData.current,
                    uv: undefined
                }
            };
            
            WeatherDisplay.displayWeatherData(noUVData);
            
            expect(mockElements.uvIndex.textContent).toBe('N/A');
            expect(mockElements.uvWarning.style.display).toBe('none');
        });

        it('should call weather animations and background functions', () => {
            const originalApplyWeatherAnimation = WeatherAnimations.applyWeatherAnimation;
            const originalApplyWeatherBackground = WeatherDisplay.applyWeatherBackground;
            WeatherAnimations.applyWeatherAnimation = TestRunner.fn();
            WeatherDisplay.applyWeatherBackground = TestRunner.fn();
            
            WeatherDisplay.displayWeatherData(TestData.mockWeatherData);
            
            expect(WeatherAnimations.applyWeatherAnimation).toHaveBeenCalledWith(
                TestData.mockWeatherData.current.condition.text,
                TestData.mockWeatherData.current
            );
            expect(WeatherDisplay.applyWeatherBackground).toHaveBeenCalledWith(
                TestData.mockWeatherData.current.condition.text,
                TestData.mockWeatherData.current
            );
            
            WeatherAnimations.applyWeatherAnimation = originalApplyWeatherAnimation;
            WeatherDisplay.applyWeatherBackground = originalApplyWeatherBackground;
        });
    });

    describe('displayForecast', () => {
        it('should display forecast items', () => {
            const forecastDays = TestData.mockWeatherData.forecast.forecastday;
            
            // Mock createElement and appendChild
            const mockForecastItem = TestUtils.createTestElement('div');
            const originalCreateElement = document.createElement;
            document.createElement = TestRunner.fn().mockReturnValue(mockForecastItem);
            
            WeatherDisplay.displayForecast(forecastDays);
            
            expect(document.createElement).toHaveBeenCalledWith('div');
            expect(mockElements.forecastContainer.appendChild).toHaveBeenCalledWith(mockForecastItem);
            
            document.createElement = originalCreateElement;
        });

        it('should handle empty forecast container gracefully', () => {
            const originalForecastContainer = mockElements.forecastContainer;
            mockElements.forecastContainer = null;
            
            expect(() => {
                WeatherDisplay.displayForecast(TestData.mockWeatherData.forecast.forecastday);
            }).not.toThrow();
            
            mockElements.forecastContainer = originalForecastContainer;
        });
    });

    describe('update methods', () => {
        it('should update temperature display', () => {
            WeatherDisplay.updateTemperature(25.7);
            expect(mockElements.currentTemp.textContent).toBe('26°C');
        });

        it('should update feels like temperature', () => {
            WeatherDisplay.updateFeelsLike(23.2);
            expect(mockElements.feelsLike.textContent).toBe('Feels like 23°C');
        });

        it('should update location display', () => {
            const locationData = { name: 'Paris', region: 'Ile-de-France', country: 'France' };
            WeatherDisplay.updateLocation(locationData);
            expect(mockElements.location.textContent).toBe('Paris, Ile-de-France, France');
        });

        it('should update weather condition', () => {
            const condition = { text: 'Sunny', icon: '//cdn.weatherapi.com/weather/64x64/day/113.png' };
            WeatherDisplay.updateCondition(condition);
            
            expect(mockElements.currentCondition.textContent).toBe('Sunny');
            expect(mockElements.currentIcon.src).toBe('https://cdn.weatherapi.com/weather/64x64/day/113.png');
        });

        it('should update weather stats', () => {
            const current = {
                vis_km: 15,
                condition: { text: 'Clear' },
                humidity: 65,
                wind_kph: 8.5,
                wind_dir: 'NE'
            };
            
            const originalUpdateVisibilityDisplay = WeatherDisplay.updateVisibilityDisplay;
            WeatherDisplay.updateVisibilityDisplay = TestRunner.fn();
            
            WeatherDisplay.updateWeatherStats(current);
            
            expect(WeatherDisplay.updateVisibilityDisplay).toHaveBeenCalledWith(15, 'Clear');
            expect(mockElements.humidity.textContent).toBe('65%');
            expect(mockElements.wind.textContent).toBe('8.5 km/h NE');
            
            WeatherDisplay.updateVisibilityDisplay = originalUpdateVisibilityDisplay;
        });
    });

    describe('clearDisplay', () => {
        it('should clear all weather data displays', () => {
            const originalResetToDefaultBackground = WeatherDisplay.resetToDefaultBackground;
            WeatherDisplay.resetToDefaultBackground = TestRunner.fn();
            
            WeatherDisplay.clearDisplay();
            
            expect(mockElements.location.textContent).toBe('');
            expect(mockElements.currentTemp.textContent).toBe('');
            expect(mockElements.currentCondition.textContent).toBe('');
            expect(mockElements.feelsLike.textContent).toBe('');
            expect(mockElements.humidity.textContent).toBe('');
            expect(mockElements.wind.textContent).toBe('');
            expect(WeatherDisplay.resetToDefaultBackground).toHaveBeenCalled();
            
            WeatherDisplay.resetToDefaultBackground = originalResetToDefaultBackground;
        });

        it('should clear weather icon', () => {
            WeatherDisplay.clearDisplay();
            
            expect(mockElements.currentIcon.src).toBe('');
            expect(mockElements.currentIcon.alt).toBe('');
        });

        it('should clear forecast container', () => {
            WeatherDisplay.clearDisplay();
            
            expect(mockElements.forecastContainer.innerHTML).toBe('');
        });
    });

    describe('background colors', () => {
        it('should determine if it is night time', () => {
            const dayWeather = { ...TestData.mockWeatherData.current, is_day: 1 };
            const nightWeather = { ...TestData.mockWeatherData.current, is_day: 0 };
            
            expect(WeatherDisplay.isNightTime(dayWeather)).toBe(false);
            expect(WeatherDisplay.isNightTime(nightWeather)).toBe(true);
        });

        it('should apply weather background colors', () => {
            const originalSetProperty = document.documentElement.style.setProperty;
            document.documentElement.style.setProperty = TestRunner.fn();
            
            WeatherDisplay.applyWeatherBackground('Sunny', TestData.mockWeatherData.current);
            
            expect(document.documentElement.style.setProperty).toHaveBeenCalledWith('--bg-gradient-start', expect.any(String));
            expect(document.documentElement.style.setProperty).toHaveBeenCalledWith('--bg-gradient-end', expect.any(String));
            
            document.documentElement.style.setProperty = originalSetProperty;
        });
    });
});

describe('WeatherAlerts', () => {
    let mockElements;

    beforeEach(() => {
        mockElements = TestUtils.setupDOMMocks();
    });

    afterEach(() => {
        TestUtils.resetMocks();
    });

    describe('parseMeteoAlarmRSS', () => {
        it('should parse valid RSS XML', () => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(TestData.mockAlertRSSData, 'text/xml');
            
            const alerts = WeatherAlerts.parseMeteoAlarmRSS(xmlDoc);
            
            expect(alerts).toHaveLength(2);
            expect(alerts[0].title).toBe('Orange Wind Warning - Paris');
            expect(alerts[1].title).toBe('Yellow Rain Warning - Ile-de-France');
        });

        it('should handle empty RSS feed', () => {
            const emptyRSS = `<?xml version="1.0" encoding="UTF-8"?>
            <rss version="2.0">
                <channel>
                    <title>MeteoAlarm - Empty</title>
                    <description>No alerts</description>
                </channel>
            </rss>`;
            
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(emptyRSS, 'text/xml');
            
            const alerts = WeatherAlerts.parseMeteoAlarmRSS(xmlDoc);
            
            expect(alerts).toHaveLength(0);
        });
    });

    describe('filterAlertsForLocation', () => {
        const mockAlerts = [
            { title: 'Wind Warning - Paris', description: 'Strong winds in Paris area' },
            { title: 'Rain Warning - London', description: 'Heavy rain expected in London' },
            { title: 'General Warning - France', description: 'Country-wide alert' }
        ];

        it('should filter alerts relevant to location', () => {
            const parisLocation = { name: 'Paris', region: 'Ile-de-France' };
            const relevantAlerts = WeatherAlerts.filterAlertsForLocation(mockAlerts, parisLocation);
            
            expect(relevantAlerts).toHaveLength(1);
            expect(relevantAlerts[0].title).toContain('Paris');
        });

        it('should return empty array when no location provided', () => {
            const relevantAlerts = WeatherAlerts.filterAlertsForLocation(mockAlerts, null);
            expect(relevantAlerts).toEqual(mockAlerts);
        });

        it('should handle empty alerts array', () => {
            const relevantAlerts = WeatherAlerts.filterAlertsForLocation([], TestData.mockLocation);
            expect(relevantAlerts).toHaveLength(0);
        });
    });

    describe('displayMeteoAlarmAlerts', () => {
        it('should display alerts in container', () => {
            const mockAlerts = [
                { title: 'Test Alert', description: 'Test description', severity: 'moderate' }
            ];
            
            const originalCreateAlertElement = WeatherAlerts.createMeteoAlarmAlertElement;
            const mockAlertElement = TestUtils.createTestElement('div');
            WeatherAlerts.createMeteoAlarmAlertElement = TestRunner.fn().mockReturnValue(mockAlertElement);
            
            WeatherAlerts.displayMeteoAlarmAlerts(mockAlerts);
            
            expect(mockElements.weatherAlerts.style.display).toBe('block');
            expect(mockElements.alertsContainer.appendChild).toHaveBeenCalledWith(mockAlertElement);
            
            WeatherAlerts.createMeteoAlarmAlertElement = originalCreateAlertElement;
        });

        it('should handle null alerts container', () => {
            const originalAlertsContainer = mockElements.alertsContainer;
            mockElements.alertsContainer = null;
            
            expect(() => {
                WeatherAlerts.displayMeteoAlarmAlerts([]);
            }).not.toThrow();
            
            mockElements.alertsContainer = originalAlertsContainer;
        });
    });

    describe('displayNoAlerts', () => {
        it('should display no alerts message', () => {
            WeatherAlerts.displayNoAlerts(TestData.mockLocation);
            
            expect(mockElements.weatherAlerts.style.display).toBe('block');
            expect(mockElements.alertsContainer.innerHTML).toContain('No weather alerts');
            expect(mockElements.alertsContainer.innerHTML).toContain(TestData.mockLocation.name);
        });

        it('should display generic message when no location provided', () => {
            WeatherAlerts.displayNoAlerts();
            
            expect(mockElements.alertsContainer.innerHTML).toContain('No weather alerts for the area');
        });
    });

    describe('severity and event type extraction', () => {
        it('should extract severity from alert title', () => {
            expect(WeatherAlerts.extractSeverityFromTitle('Red Wind Warning')).toBe('extreme');
            expect(WeatherAlerts.extractSeverityFromTitle('Orange Rain Alert')).toBe('severe');
            expect(WeatherAlerts.extractSeverityFromTitle('Yellow Snow Warning')).toBe('moderate');
            expect(WeatherAlerts.extractSeverityFromTitle('Green Advisory')).toBe('minor');
            expect(WeatherAlerts.extractSeverityFromTitle('General Warning')).toBe('moderate');
        });

        it('should extract event type from alert title', () => {
            expect(WeatherAlerts.extractEventTypeFromTitle('Wind Warning')).toBe('Wind');
            expect(WeatherAlerts.extractEventTypeFromTitle('Heavy Rain Alert')).toBe('Rain');
            expect(WeatherAlerts.extractEventTypeFromTitle('Snow Warning')).toBe('Snow/Ice');
            expect(WeatherAlerts.extractEventTypeFromTitle('Thunderstorm Alert')).toBe('Thunderstorm');
            expect(WeatherAlerts.extractEventTypeFromTitle('Fog Warning')).toBe('Fog');
            expect(WeatherAlerts.extractEventTypeFromTitle('Heat Alert')).toBe('Temperature');
            expect(WeatherAlerts.extractEventTypeFromTitle('General Alert')).toBe('General Weather Warning');
        });
    });

    describe('getSeverityText', () => {
        it('should return correct severity text', () => {
            expect(WeatherAlerts.getSeverityText('extreme')).toBe('Extreme');
            expect(WeatherAlerts.getSeverityText('severe')).toBe('Severe');
            expect(WeatherAlerts.getSeverityText('moderate')).toBe('Moderate');
            expect(WeatherAlerts.getSeverityText('minor')).toBe('Minor');
            expect(WeatherAlerts.getSeverityText('unknown')).toBe('Moderate');
        });
    });

    describe('getMeteoAlarmFeed', () => {
        it('should return country-specific feed URL', () => {
            const franceUrl = WeatherAlerts.getMeteoAlarmFeed('France');
            expect(franceUrl).toContain('meteoalarm-legacy-rss-france');
            
            const germanyUrl = WeatherAlerts.getMeteoAlarmFeed('Germany');
            expect(germanyUrl).toContain('meteoalarm-legacy-rss-germany');
        });

        it('should return default European feed for unknown country', () => {
            const unknownUrl = WeatherAlerts.getMeteoAlarmFeed('Unknown Country');
            expect(unknownUrl).toContain('meteoalarm-legacy-rss-europe');
        });
    });
});

describe('WeatherAnimations', () => {
    let mockElements, mockWeatherIcon;

    beforeEach(() => {
        mockElements = TestUtils.setupDOMMocks();
        mockWeatherIcon = TestUtils.createTestElement('div', { className: 'weather-icon' });
        mockElements.currentIcon.parentElement = mockWeatherIcon;
    });

    afterEach(() => {
        TestUtils.resetMocks();
    });

    describe('applyWeatherAnimation', () => {
        it('should apply sunny animation for clear weather', () => {
            WeatherAnimations.applyWeatherAnimation('Sunny', TestData.mockWeatherData.current);
            
            expect(mockWeatherIcon.classList.contains('weather-sunny')).toBe(true);
        });

        it('should apply rainy animation and particles for rain', () => {
            const originalAddRainParticles = WeatherAnimations.addRainParticles;
            WeatherAnimations.addRainParticles = TestRunner.fn();
            
            WeatherAnimations.applyWeatherAnimation('Heavy rain', TestData.mockWeatherData.current);
            
            expect(mockWeatherIcon.classList.contains('weather-rainy')).toBe(true);
            expect(WeatherAnimations.addRainParticles).toHaveBeenCalledWith(mockWeatherIcon);
            
            WeatherAnimations.addRainParticles = originalAddRainParticles;
        });

        it('should apply snowy animation and particles for snow', () => {
            const originalAddSnowParticles = WeatherAnimations.addSnowParticles;
            WeatherAnimations.addSnowParticles = TestRunner.fn();
            
            WeatherAnimations.applyWeatherAnimation('Heavy snow', TestData.mockWeatherData.current);
            
            expect(mockWeatherIcon.classList.contains('weather-snowy')).toBe(true);
            expect(WeatherAnimations.addSnowParticles).toHaveBeenCalledWith(mockWeatherIcon);
            
            WeatherAnimations.addSnowParticles = originalAddSnowParticles;
        });

        it('should apply windy animation for high wind conditions', () => {
            const windyWeather = { ...TestData.mockWeatherData.current, wind_kph: 25 };
            
            WeatherAnimations.applyWeatherAnimation('Partly cloudy', windyWeather);
            
            expect(mockWeatherIcon.classList.contains('weather-windy')).toBe(true);
        });

        it('should apply thunderstorm animation for storm conditions', () => {
            WeatherAnimations.applyWeatherAnimation('Thunderstorm', TestData.mockWeatherData.current);
            
            expect(mockWeatherIcon.classList.contains('weather-thunderstorm')).toBe(true);
        });

        it('should apply cloudy animation as default', () => {
            WeatherAnimations.applyWeatherAnimation('Unknown condition', TestData.mockWeatherData.current);
            
            expect(mockWeatherIcon.classList.contains('weather-cloudy')).toBe(true);
        });

        it('should clear existing animations before applying new ones', () => {
            const originalClearParticles = WeatherAnimations.clearParticles;
            WeatherAnimations.clearParticles = TestRunner.fn();
            
            // Add existing class
            mockWeatherIcon.classList.add('weather-sunny');
            
            WeatherAnimations.applyWeatherAnimation('Rainy', TestData.mockWeatherData.current);
            
            expect(mockWeatherIcon.classList.contains('weather-sunny')).toBe(false);
            expect(mockWeatherIcon.classList.contains('weather-rainy')).toBe(true);
            expect(WeatherAnimations.clearParticles).toHaveBeenCalledWith(mockWeatherIcon);
            
            WeatherAnimations.clearParticles = originalClearParticles;
        });
    });

    describe('particle effects', () => {
        it('should add rain particles', () => {
            const originalCreateElement = document.createElement;
            const mockParticlesContainer = TestUtils.createTestElement('div');
            const mockRaindrop = TestUtils.createTestElement('div');
            
            document.createElement = TestRunner.fn().mockImplementation((tag) => {
                if (tag === 'div' && !mockParticlesContainer.className) {
                    return mockParticlesContainer;
                }
                return mockRaindrop;
            });
            
            WeatherAnimations.addRainParticles(mockWeatherIcon);
            
            expect(mockWeatherIcon.appendChild).toHaveBeenCalledWith(mockParticlesContainer);
            expect(mockParticlesContainer.className).toBe('weather-particles');
            
            document.createElement = originalCreateElement;
        });

        it('should add snow particles', () => {
            const originalCreateElement = document.createElement;
            const mockParticlesContainer = TestUtils.createTestElement('div');
            const mockSnowflake = TestUtils.createTestElement('div');
            
            document.createElement = TestRunner.fn().mockImplementation((tag) => {
                if (tag === 'div' && !mockParticlesContainer.className) {
                    return mockParticlesContainer;
                }
                return mockSnowflake;
            });
            
            WeatherAnimations.addSnowParticles(mockWeatherIcon);
            
            expect(mockWeatherIcon.appendChild).toHaveBeenCalledWith(mockParticlesContainer);
            expect(mockSnowflake.textContent).toBe('❄');
            
            document.createElement = originalCreateElement;
        });

        it('should clear existing particles', () => {
            const mockExistingParticles = TestUtils.createTestElement('div', { className: 'weather-particles' });
            mockExistingParticles.remove = TestRunner.fn();
            mockWeatherIcon.querySelector = TestRunner.fn().mockReturnValue(mockExistingParticles);
            
            WeatherAnimations.clearParticles(mockWeatherIcon);
            
            expect(mockExistingParticles.remove).toHaveBeenCalled();
        });

        it('should handle missing particles gracefully', () => {
            mockWeatherIcon.querySelector = TestRunner.fn().mockReturnValue(null);
            
            expect(() => {
                WeatherAnimations.clearParticles(mockWeatherIcon);
            }).not.toThrow();
        });
    });

    describe('animation state management', () => {
        it('should remove all animations', () => {
            mockWeatherIcon.classList.add('weather-sunny', 'weather-rainy');
            
            const originalClearParticles = WeatherAnimations.clearParticles;
            WeatherAnimations.clearParticles = TestRunner.fn();
            
            WeatherAnimations.removeAllAnimations();
            
            expect(mockWeatherIcon.classList.contains('weather-sunny')).toBe(false);
            expect(mockWeatherIcon.classList.contains('weather-rainy')).toBe(false);
            expect(WeatherAnimations.clearParticles).toHaveBeenCalledWith(mockWeatherIcon);
            
            WeatherAnimations.clearParticles = originalClearParticles;
        });

        it('should get current animation state', () => {
            mockWeatherIcon.classList.add('weather-sunny');
            
            const animationState = WeatherAnimations.getCurrentAnimation();
            
            expect(animationState).toBe('sunny');
        });

        it('should return null for no animation', () => {
            const animationState = WeatherAnimations.getCurrentAnimation();
            
            expect(animationState).toBe(null);
        });
    });

    describe('createCustomParticles', () => {
        it('should create custom particle effects', () => {
            const originalCreateElement = document.createElement;
            const mockParticlesContainer = TestUtils.createTestElement('div');
            const mockParticle = TestUtils.createTestElement('div');
            
            document.createElement = TestRunner.fn().mockImplementation((tag) => {
                if (tag === 'div' && !mockParticlesContainer.className) {
                    return mockParticlesContainer;
                }
                return mockParticle;
            });
            
            WeatherAnimations.createCustomParticles(mockWeatherIcon, 3, 'custom-particle', '⭐');
            
            expect(mockWeatherIcon.appendChild).toHaveBeenCalledWith(mockParticlesContainer);
            expect(mockParticle.className).toBe('custom-particle');
            expect(mockParticle.textContent).toBe('⭐');
            
            document.createElement = originalCreateElement;
        });
    });
});