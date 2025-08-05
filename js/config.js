// WeatherAPI.com API key - You need to get your own free API key from https://www.weatherapi.com/
const API_KEY = '37335b18022740cfb8170338253007'; // Replace with your actual API key
const BASE_URL = 'https://api.weatherapi.com/v1';

// MeteoAlarm European Weather Alerts (Free!)
const METEOALARM_BASE_URL = 'https://feeds.meteoalarm.org/feeds';
const METEOALARM_EUROPE_FEED = 'meteoalarm-legacy-rss-europe';

// App configuration
const CONFIG = {
    REFRESH_INTERVAL: 600000, // 10 minutes
    GEOLOCATION_TIMEOUT: 30000, // Increased to 30 seconds
    GEOLOCATION_MAX_AGE: 300000, // 5 minutes
    MAX_ALERTS_DISPLAY: 10,
    MAX_RAIN_PARTICLES: 8,
    MAX_SNOW_PARTICLES: 6
};

// Export for use in other modules (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        API_KEY,
        BASE_URL,
        METEOALARM_BASE_URL,
        METEOALARM_EUROPE_FEED,
        CONFIG
    };
} 