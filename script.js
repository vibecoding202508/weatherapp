// WeatherAPI.com API key - You need to get your own free API key from https://www.weatherapi.com/
const API_KEY = '37335b18022740cfb8170338253007'; // Replace with your actual API key
const BASE_URL = 'https://api.weatherapi.com/v1';

// MeteoAlarm European Weather Alerts (Free!)
const METEOALARM_BASE_URL = 'https://feeds.meteoalarm.org/feeds';
const METEOALARM_EUROPE_FEED = 'meteoalarm-legacy-rss-europe';

// Utility function for proper UTF-8 base64 decoding
function decodeBase64UTF8(base64String) {
    try {
        // Decode base64 to binary string
        const binaryString = atob(base64String);
        
        // Convert binary string to UTF-8
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        
        // Decode UTF-8 bytes to string
        const decoder = new TextDecoder('utf-8');
        return decoder.decode(bytes);
    } catch (error) {
        console.error('UTF-8 base64 decode error:', error);
        // Fallback to regular atob
        return atob(base64String);
    }
}

// DOM elements
const loadingElement = document.getElementById('loading');
const errorElement = document.getElementById('error');
const errorMessageElement = document.getElementById('error-message');
const weatherContentElement = document.getElementById('weather-content');

// Weather data elements
const locationElement = document.getElementById('location');
const currentTempElement = document.getElementById('current-temp');
const currentIconElement = document.getElementById('current-icon');
const currentConditionElement = document.getElementById('current-condition');
const feelsLikeElement = document.getElementById('feels-like');
const visibilityElement = document.getElementById('visibility');
const humidityElement = document.getElementById('humidity');
const windElement = document.getElementById('wind');
const forecastContainerElement = document.getElementById('forecast-container');

// Weather alerts elements
const weatherAlertsElement = document.getElementById('weather-alerts');
const alertsContainerElement = document.getElementById('alerts-container');

// Search elements
const locationSearchInput = document.getElementById('location-search');
const searchBtn = document.getElementById('search-btn');
const currentLocationBtn = document.getElementById('current-location-btn');

// State management
let isUsingCurrentLocation = true;
let currentWeatherData = null;

// Dark mode functionality
function initializeDarkMode() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const toggleIcon = document.getElementById('toggle-icon');
    
    // Check for saved dark mode preference
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        toggleIcon.className = 'fas fa-sun';
    }
    
    // Toggle dark mode
    darkModeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        const isCurrentlyDark = document.body.classList.contains('dark-mode');
        
        // Update icon
        if (isCurrentlyDark) {
            toggleIcon.className = 'fas fa-sun';
        } else {
            toggleIcon.className = 'fas fa-moon';
        }
        
        // Save preference
        localStorage.setItem('darkMode', isCurrentlyDark);
    });
}

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initializeDarkMode();
    initializeSearch();
    checkAPIKey();
});

// Search functionality
function initializeSearch() {
    // Search button click
    searchBtn.addEventListener('click', performSearch);
    
    // Enter key in search input
    locationSearchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // Current location button click
    currentLocationBtn.addEventListener('click', function() {
        isUsingCurrentLocation = true;
        updateLocationButtons();
        locationSearchInput.value = '';
        getWeatherData();
    });
}

function performSearch() {
    const searchTerm = locationSearchInput.value.trim();
    
    if (!searchTerm) {
        return;
    }
    
    isUsingCurrentLocation = false;
    updateLocationButtons();
    getWeatherDataByLocation(searchTerm);
}

function updateLocationButtons() {
    if (isUsingCurrentLocation) {
        currentLocationBtn.classList.add('active');
    } else {
        currentLocationBtn.classList.remove('active');
    }
}

async function getWeatherDataByLocation(location) {
    showLoadingWithMessage(`Searching for weather in ${location}...`);
    
    try {
        // Fetch current weather and 3-day forecast for searched location
        const response = await fetch(
            `${BASE_URL}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(location)}&days=3&aqi=no&alerts=no`
        );

        if (!response.ok) {
            if (response.status === 400) {
                throw new Error(`Location "${location}" not found. Please try a different city name.`);
            }
            throw new Error(`Weather API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        currentWeatherData = data;
        displayWeatherData(data);
        
    } catch (error) {
        console.error('Error fetching weather data for location:', error);
        showError(error.message || 'Failed to fetch weather data for this location. Please try a different city name.');
    }
}

function checkAPIKey() {
    if (API_KEY === 'YOUR_API_KEY_HERE') {
        showError('Please replace YOUR_API_KEY_HERE with your actual WeatherAPI.com API key in script.js. Get your free key at https://www.weatherapi.com/signup.aspx');
        return;
    }
    
    // Set current location as active initially
    currentLocationBtn.classList.add('active');
    getWeatherData();
}

function getWeatherData() {
    showLoading();
    
    if (!navigator.geolocation) {
        showError('Geolocation is not supported by this browser. Please update your browser or try a different one.');
        return;
    }

    navigator.geolocation.getCurrentPosition(
        position => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            fetchWeatherData(latitude, longitude);
        },
        error => {
            console.error('Geolocation error:', error);
            let errorMessage = 'Unable to get your location. ';
            
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage += 'Please allow location access and try again.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage += 'Location information is unavailable.';
                    break;
                case error.TIMEOUT:
                    errorMessage += 'Location request timed out.';
                    break;
                default:
                    errorMessage += 'An unknown error occurred.';
                    break;
            }
            
            showError(errorMessage);
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000 // 5 minutes
        }
    );
}

async function fetchWeatherData(latitude, longitude) {
    try {
        const coords = `${latitude},${longitude}`;
        
        // Fetch current weather and 3-day forecast
        const response = await fetch(
            `${BASE_URL}/forecast.json?key=${API_KEY}&q=${coords}&days=3&aqi=no&alerts=no`
        );

        if (!response.ok) {
            throw new Error(`Weather API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        displayWeatherData(data);
        
    } catch (error) {
        console.error('Error fetching weather data:', error);
        showError('Failed to fetch weather data. Please check your internet connection and try again.');
    }
}

function displayWeatherData(data) {
    // Store current data
    currentWeatherData = data;
    
    // Current weather
    const current = data.current;
    const location = data.location;
    
    locationElement.textContent = `${location.name}, ${location.region}, ${location.country}`;
    currentTempElement.textContent = `${Math.round(current.temp_c)}°C`;
    currentIconElement.src = `https:${current.condition.icon}`;
    currentIconElement.alt = current.condition.text;
    currentConditionElement.textContent = current.condition.text;
    feelsLikeElement.textContent = `Feels like ${Math.round(current.feelslike_c)}°C`;
    
    // Apply weather animation based on condition
    applyWeatherAnimation(current.condition.text, current);
    
    visibilityElement.textContent = `${current.vis_km} km`;
    humidityElement.textContent = `${current.humidity}%`;
    windElement.textContent = `${current.wind_kph} km/h ${current.wind_dir}`;

    // 3-day forecast
    displayForecast(data.forecast.forecastday);
    
    // Fetch weather alerts from MeteoAlarm (free European alerts)
    console.log('Fetching alerts for location:', `${location.name}, ${location.region}, ${location.country}`);
    fetchMeteoAlarmAlerts(data.location.country, location);
    
    showWeatherContent();
}

function applyWeatherAnimation(conditionText, currentWeather) {
    const weatherIcon = currentIconElement.parentElement;
    const condition = conditionText.toLowerCase();
    
    // Clear existing animation classes
    weatherIcon.classList.remove(
        'weather-sunny', 'weather-rainy', 'weather-snowy', 
        'weather-cloudy', 'weather-windy', 'weather-thunderstorm'
    );
    
    // Clear existing particle effects
    const existingParticles = weatherIcon.querySelector('.weather-particles');
    if (existingParticles) {
        existingParticles.remove();
    }
    
    // Determine animation based on weather condition
    if (condition.includes('sunny') || condition.includes('clear')) {
        weatherIcon.classList.add('weather-sunny');
    } else if (condition.includes('rain') || condition.includes('drizzle') || condition.includes('shower')) {
        weatherIcon.classList.add('weather-rainy');
        addRainParticles(weatherIcon);
    } else if (condition.includes('snow') || condition.includes('blizzard')) {
        weatherIcon.classList.add('weather-snowy');
        addSnowParticles(weatherIcon);
    } else if (condition.includes('cloud') || condition.includes('overcast')) {
        weatherIcon.classList.add('weather-cloudy');
    } else if (condition.includes('wind') || currentWeather.wind_kph > 20) {
        weatherIcon.classList.add('weather-windy');
    } else if (condition.includes('thunder') || condition.includes('storm')) {
        weatherIcon.classList.add('weather-thunderstorm');
    } else {
        // Default to cloudy for unknown conditions
        weatherIcon.classList.add('weather-cloudy');
    }
}

function addRainParticles(container) {
    const particles = document.createElement('div');
    particles.className = 'weather-particles';
    
    // Create raindrops
    for (let i = 0; i < 8; i++) {
        const raindrop = document.createElement('div');
        raindrop.className = 'raindrop';
        raindrop.style.left = `${Math.random() * 100}%`;
        raindrop.style.animationDelay = `${Math.random() * 1}s`;
        raindrop.style.animationDuration = `${0.8 + Math.random() * 0.4}s`;
        particles.appendChild(raindrop);
    }
    
    container.appendChild(particles);
}

function addSnowParticles(container) {
    const particles = document.createElement('div');
    particles.className = 'weather-particles';
    
    // Create snowflakes
    for (let i = 0; i < 6; i++) {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.textContent = '❄';
        snowflake.style.left = `${Math.random() * 100}%`;
        snowflake.style.animationDelay = `${Math.random() * 3}s`;
        snowflake.style.animationDuration = `${2 + Math.random() * 2}s`;
        particles.appendChild(snowflake);
    }
    
    container.appendChild(particles);
}

function displayForecast(forecastDays) {
    forecastContainerElement.innerHTML = '';
    
    forecastDays.forEach((day, index) => {
        const forecastItem = document.createElement('div');
        forecastItem.className = 'forecast-item';
        
        const date = new Date(day.date);
        const dayName = index === 0 ? 'Today' : 
                       index === 1 ? 'Tomorrow' : 
                       date.toLocaleDateString('en-US', { weekday: 'long' });
        
        const dateString = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        const rainChance = day.day.daily_chance_of_rain;
        const rainInfo = rainChance > 0 ? `<div class="forecast-rain"><i class="fas fa-umbrella"></i> ${rainChance}% chance of rain</div>` : '';
        
        forecastItem.innerHTML = `
            <div class="forecast-date">${dayName}</div>
            <div style="font-size: 0.9rem; color: #636e72; margin-bottom: 10px;">${dateString}</div>
            <div class="forecast-icon">
                <img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}">
            </div>
            <div class="forecast-temps">
                <span class="forecast-high">${Math.round(day.day.maxtemp_c)}°</span>
                <span class="forecast-low">${Math.round(day.day.mintemp_c)}°</span>
            </div>
            <div class="forecast-condition">${day.day.condition.text}</div>
            ${rainInfo}
        `;
        
        forecastContainerElement.appendChild(forecastItem);
    });
}

function showLoading() {
    showLoadingWithMessage('Getting your location and weather data...');
}

function showLoadingWithMessage(message) {
    const loadingText = loadingElement.querySelector('p');
    if (loadingText) {
        loadingText.textContent = message;
    }
    loadingElement.style.display = 'flex';
    errorElement.style.display = 'none';
    weatherContentElement.style.display = 'none';
}

function showError(message) {
    errorMessageElement.textContent = message;
    loadingElement.style.display = 'none';
    errorElement.style.display = 'flex';
    weatherContentElement.style.display = 'none';
}

function showWeatherContent() {
    loadingElement.style.display = 'none';
    errorElement.style.display = 'none';
    weatherContentElement.style.display = 'block';
}

// Function to filter alerts for current location
function filterAlertsForLocation(alerts, location) {
    if (!location || alerts.length === 0) {
        console.log('No location provided or no alerts to filter');
        return alerts;
    }
    
    const locationKeywords = [
        location.name.toLowerCase(),
        location.region.toLowerCase()
    ];
    
    // Add common variations and remove duplicates
    const expandedKeywords = new Set(locationKeywords);
    
    // Add variations for common location name patterns
    locationKeywords.forEach(keyword => {
        // Remove common suffixes/prefixes
        const cleaned = keyword
            .replace(/\b(city|county|province|region|state|district|area)\b/g, '')
            .replace(/\s+/g, ' ')
            .trim();
        if (cleaned && cleaned !== keyword) {
            expandedKeywords.add(cleaned);
        }
        
        // Add partial matches for compound names
        if (keyword.includes(' ')) {
            keyword.split(' ').forEach(part => {
                if (part.length > 3) { // Only meaningful parts
                    expandedKeywords.add(part);
                }
            });
        }
    });
    
    const finalKeywords = Array.from(expandedKeywords).filter(k => k.length > 2);
    console.log('Location keywords for filtering:', finalKeywords);
    
    const relevantAlerts = alerts.filter(alert => {
        const alertText = `${alert.title} ${alert.description}`.toLowerCase();
        
        // Check if any location keyword is mentioned in the alert
        const isRelevant = finalKeywords.some(keyword => 
            alertText.includes(keyword)
        );
        
        if (isRelevant) {
            console.log(`Alert relevant to location: "${alert.title}"`);
        }
        
        return isRelevant;
    });
    
    // Return only location-relevant alerts, no fallback to country-wide alerts
    return relevantAlerts;
}

// MeteoAlarm European alerts functionality  
async function fetchMeteoAlarmAlerts(country, location = null) {
    try {
        console.log('Starting MeteoAlarm fetch for country:', country);
        
        // Get the appropriate MeteoAlarm feed for the country
        const feedUrl = getMeteoAlarmFeed(country);
        console.log('Using feed URL:', feedUrl);
        
        // Try multiple CORS proxy services for better reliability
        const proxies = [
            `https://api.allorigins.win/get?url=${encodeURIComponent(feedUrl)}`,
            `https://cors.eu.org/${feedUrl}`,
            `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(feedUrl)}`
        ];
        
        let response = null;
        let proxyError = null;
        
        // Try each proxy until one works
        for (const proxyUrl of proxies) {
            try {
                console.log('Trying proxy:', proxyUrl);
                response = await fetch(proxyUrl);
                if (response.ok) {
                    console.log('Proxy successful:', proxyUrl);
                    break;
                }
            } catch (err) {
                console.log('Proxy failed:', proxyUrl, err.message);
                proxyError = err;
                continue;
            }
        }
        
        if (!response || !response.ok) {
            console.error('All proxies failed, trying direct fetch...');
            // Try direct fetch as last resort
            try {
                response = await fetch(feedUrl);
            } catch (directError) {
                console.error('Direct fetch also failed:', directError);
                console.log('Falling back to demo alerts for testing...');
                displayDemoAlerts(country);
                return;
            }
        }

        let rssText;
        
        // Read response as text first to avoid stream consumption issues
        try {
            const responseText = await response.text();
            console.log('Raw response length:', responseText.length);
            console.log('Raw response preview:', responseText.substring(0, 100));
            
            // Try to parse as JSON first (for proxy responses)
            try {
                const data = JSON.parse(responseText);
                console.log('Successfully parsed as JSON. Structure:', Object.keys(data));
                
                rssText = data.contents || data.data || data.body || data.response || responseText;
                console.log('Extracted content from JSON, type:', typeof rssText);
                
            } catch (jsonError) {
                // If JSON parsing fails, use the raw text
                console.log('Not JSON, using raw response text');
                rssText = responseText;
            }
            
            // Check if the content is base64 encoded (but not XML yet)
            if (rssText && typeof rssText === 'string') {
                if (!rssText.trim().startsWith('<') && !rssText.trim().startsWith('<?xml')) {
                    console.log('Content appears to be encoded, attempting decode...');
                    try {
                        // Try base64 decode with UTF-8
                        const decoded = decodeBase64UTF8(rssText);
                        if (decoded && decoded.trim().length > 0 && decoded.trim().startsWith('<')) {
                            rssText = decoded;
                            console.log('Base64 decoding successful with UTF-8');
                        } else {
                            console.log('Base64 decode did not produce valid XML');
                        }
                    } catch (base64Error) {
                        console.log('Base64 decoding failed:', base64Error.message);
                    }
                }
            } else if (typeof rssText !== 'string') {
                console.error('Content is not a string:', typeof rssText);
                rssText = String(rssText);
            }
            
        } catch (textError) {
            console.error('Failed to read response as text:', textError.message);
            displayTemporaryAlertsNotice();
            return;
        }
        
        console.log('RSS text length:', rssText.length);
        console.log('RSS preview:', rssText.substring(0, 200));
        
        // Validate content before parsing
        if (!rssText || rssText.trim().length === 0) {
            console.error('RSS content is empty');
            console.log('No RSS content available, showing no alerts message');
            displayNoAlerts(location);
            return;
        }
        
        // Check if content looks like XML
        const trimmedContent = rssText.trim();
        if (!trimmedContent.startsWith('<')) {
            console.log('Content does not start with <. First 200 chars:', trimmedContent.substring(0, 200));
            
            // Check if it's a data URL (data:mime/type;base64,encoded_content)
            if (trimmedContent.startsWith('data:')) {
                console.log('Detected data URL format');
                try {
                    // Find the base64 part after "base64,"
                    const base64Index = trimmedContent.indexOf('base64,');
                    if (base64Index !== -1) {
                        const base64Content = trimmedContent.substring(base64Index + 7); // Skip "base64,"
                        console.log('Extracting base64 content from data URL...');
                        const decoded = decodeBase64UTF8(base64Content);
                        if (decoded.trim().startsWith('<')) {
                            console.log('Data URL base64 decode successful with UTF-8');
                            rssText = decoded;
                        } else {
                            console.error('Data URL decode did not produce valid XML');
                            displayTemporaryAlertsNotice();
                            return;
                        }
                    } else {
                        console.error('Data URL does not contain base64 marker');
                        displayTemporaryAlertsNotice();
                        return;
                    }
                } catch (e) {
                    console.error('Data URL decode failed:', e.message);
                    displayTemporaryAlertsNotice();
                    return;
                }
            }
            // If it looks like it might be an error message or HTML
            else if (trimmedContent.toLowerCase().includes('error') || 
                trimmedContent.toLowerCase().includes('<html') ||
                trimmedContent.toLowerCase().includes('<!doctype')) {
                console.error('Content appears to be an error page or HTML, not RSS');
                displayTemporaryAlertsNotice();
                return;
            }
            // Try regular base64 decode
            else {
                try {
                    const decoded = decodeBase64UTF8(trimmedContent);
                    if (decoded.trim().startsWith('<')) {
                        console.log('Regular base64 decode successful with UTF-8');
                        rssText = decoded;
                    } else {
                        console.error('Content is not valid XML after all decoding attempts');
                        displayTemporaryAlertsNotice();
                        return;
                    }
                } catch (e) {
                    console.error('Final decode attempt failed:', e.message);
                    displayTemporaryAlertsNotice();
                    return;
                }
            }
        }
        
        // Parse the RSS XML
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(rssText, 'text/xml');
        
        // Check for XML parsing errors
        const parserError = xmlDoc.getElementsByTagName('parsererror')[0];
        if (parserError) {
            console.error('XML parsing error:', parserError.textContent);
            console.error('Problematic XML content:', rssText.substring(0, 300));
            displayTemporaryAlertsNotice();
            return;
        }
        
        // Extract alerts from RSS
        const allAlerts = parseMeteoAlarmRSS(xmlDoc);
        console.log('Parsed alerts count:', allAlerts.length);
        console.log('All alerts:', allAlerts);
        
        // Filter alerts for current location
        const locationAlerts = filterAlertsForLocation(allAlerts, location);
        console.log('Location-relevant alerts count:', locationAlerts.length);
        console.log('Location alerts:', locationAlerts);
        
        // Display alerts or show no alerts message
        if (locationAlerts.length > 0) {
            displayMeteoAlarmAlerts(locationAlerts);
        } else {
            // Show no alerts message for the current location
            console.log('No location-relevant alerts found, showing no alerts message');
            displayNoAlerts(location);
        }
        
    } catch (error) {
        console.error('Error fetching MeteoAlarm alerts:', error);
        displayTemporaryAlertsNotice();
    }
}



function displayMeteoAlarmAlerts(alerts) {
    alertsContainerElement.innerHTML = '';
    
    if (!alerts || alerts.length === 0) {
        console.log('No alerts to display, showing no alerts message');
        displayNoAlerts();
        return;
    }

    // Show alerts section
    weatherAlertsElement.style.display = 'block';
    
    alerts.forEach(alert => {
        const alertItem = createMeteoAlarmAlertElement(alert);
        alertsContainerElement.appendChild(alertItem);
    });
}

function displayNoAlerts(location = null) {
    const locationText = location ? ` for ${location.name}, ${location.region}` : ' for the area';
    alertsContainerElement.innerHTML = `
        <div class="no-alerts">
            <i class="fas fa-check-circle"></i>
            <p>No weather alerts${locationText}</p>
            <p><small>All clear! No active weather warnings affecting your current location.</small></p>
        </div>
    `;
    weatherAlertsElement.style.display = 'block';
}

function displayTemporaryAlertsNotice() {
    alertsContainerElement.innerHTML = `
        <div class="api-key-notice">
            <h3><i class="fas fa-exclamation-triangle"></i> Weather Alerts Temporarily Unavailable</h3>
            <p>We're having trouble fetching weather alerts at the moment.</p>
            <p><strong>This could be due to:</strong></p>
            <ul style="text-align: left; margin: 15px 0; padding-left: 20px;">
                <li>Temporary network issues</li>
                <li>MeteoAlarm service maintenance</li>
                <li>CORS proxy limitations</li>
            </ul>
            <p>Your main weather forecast is working perfectly! Try refreshing in a few minutes for alerts.</p>
            <p><small>💡 Check the browser console (F12) for technical details.</small></p>
        </div>
    `;
    weatherAlertsElement.style.display = 'block';
}

// Fallback demo alerts for testing when MeteoAlarm is not accessible
function displayDemoAlerts(country) {
    console.log('Displaying demo alerts for testing purposes');
    
    alertsContainerElement.innerHTML = '';
    weatherAlertsElement.style.display = 'block';
    
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert-item severity-moderate';
    alertDiv.innerHTML = `
        <div class="alert-header">
            <h3 class="alert-title">Demo: Weather Alert System Working</h3>
            <span class="alert-priority priority-moderate">Demo</span>
        </div>
        <div class="alert-source"><strong>Source:</strong> Demo Alert (MeteoAlarm connection issue)</div>
        <div class="alert-time"><strong>Generated:</strong> ${new Date().toLocaleString()}</div>
        <div class="alert-description">This demo alert confirms your alert system is properly integrated. When MeteoAlarm is accessible, you'll see real official weather warnings here.</div>
        <div class="alert-areas"><strong>Note:</strong> Check console (F12) for technical details about MeteoAlarm connection.</div>
    `;
    
    alertsContainerElement.appendChild(alertDiv);
}

function getMeteoAlarmFeed(country) {
    // Map countries to MeteoAlarm feeds
    const countryFeeds = {
        'Austria': 'meteoalarm-legacy-rss-austria',
        'Belgium': 'meteoalarm-legacy-rss-belgium',
        'Bulgaria': 'meteoalarm-legacy-rss-bulgaria',
        'Croatia': 'meteoalarm-legacy-rss-croatia',
        'Cyprus': 'meteoalarm-legacy-rss-cyprus',
        'Czech Republic': 'meteoalarm-legacy-rss-czechia',
        'Denmark': 'meteoalarm-legacy-rss-denmark',
        'Estonia': 'meteoalarm-legacy-rss-estonia',
        'Finland': 'meteoalarm-legacy-rss-finland',
        'France': 'meteoalarm-legacy-rss-france',
        'Germany': 'meteoalarm-legacy-rss-germany',
        'Greece': 'meteoalarm-legacy-rss-greece',
        'Hungary': 'meteoalarm-legacy-rss-hungary',
        'Iceland': 'meteoalarm-legacy-rss-iceland',
        'Ireland': 'meteoalarm-legacy-rss-ireland',
        'Italy': 'meteoalarm-legacy-rss-italy',
        'Latvia': 'meteoalarm-legacy-rss-latvia',
        'Lithuania': 'meteoalarm-legacy-rss-lithuania',
        'Luxembourg': 'meteoalarm-legacy-rss-luxembourg',
        'Malta': 'meteoalarm-legacy-rss-malta',
        'Netherlands': 'meteoalarm-legacy-rss-netherlands',
        'Norway': 'meteoalarm-legacy-rss-norway',
        'Poland': 'meteoalarm-legacy-rss-poland',
        'Portugal': 'meteoalarm-legacy-rss-portugal',
        'Romania': 'meteoalarm-legacy-rss-romania',
        'Slovakia': 'meteoalarm-legacy-rss-slovakia',
        'Slovenia': 'meteoalarm-legacy-rss-slovenia',
        'Spain': 'meteoalarm-legacy-rss-spain',
        'Sweden': 'meteoalarm-legacy-rss-sweden',
        'Switzerland': 'meteoalarm-legacy-rss-switzerland',
        'United Kingdom': 'meteoalarm-legacy-rss-united-kingdom'
    };
    
    const feed = countryFeeds[country] || METEOALARM_EUROPE_FEED;
    return `${METEOALARM_BASE_URL}/${feed}`;
}

function parseMeteoAlarmRSS(xmlDoc) {
    const alerts = [];
    const items = xmlDoc.getElementsByTagName('item');
    
    console.log('Found RSS items:', items.length);
    
    if (items.length === 0) {
        // Check if it's a valid RSS document
        const rssElement = xmlDoc.getElementsByTagName('rss')[0] || xmlDoc.getElementsByTagName('feed')[0];
        if (!rssElement) {
            console.error('Not a valid RSS/Atom feed');
            return alerts;
        }
        
        // Check for channel description
        const channel = xmlDoc.getElementsByTagName('channel')[0];
        if (channel) {
            const description = channel.getElementsByTagName('description')[0]?.textContent;
            console.log('RSS channel description:', description);
        }
        
        console.log('RSS feed is valid but contains no alert items (no active alerts)');
        return alerts;
    }
    
    for (let i = 0; i < Math.min(items.length, 10); i++) { // Limit to 10 alerts
        const item = items[i];
        
        const title = item.getElementsByTagName('title')[0]?.textContent || 'Weather Alert';
        const description = item.getElementsByTagName('description')[0]?.textContent || '';
        const pubDate = item.getElementsByTagName('pubDate')[0]?.textContent || '';
        const guid = item.getElementsByTagName('guid')[0]?.textContent || '';
        
        console.log(`Alert ${i + 1}: ${title}`);
        
        // Extract severity and type from title
        const severity = extractSeverityFromTitle(title);
        const eventType = extractEventTypeFromTitle(title);
        
        alerts.push({
            title: title,
            description: description,
            pubDate: pubDate,
            guid: guid,
            severity: severity,
            eventType: eventType
        });
    }
    
    return alerts;
}

function createMeteoAlarmAlertElement(alert) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert-item';
    
    // Add severity class
    if (alert.severity) {
        alertDiv.classList.add(`severity-${alert.severity}`);
    }
    
    const publishedDate = alert.pubDate ? new Date(alert.pubDate).toLocaleString() : '';
    
    alertDiv.innerHTML = `
        <div class="alert-header">
            <h3 class="alert-title">${alert.title}</h3>
            <span class="alert-priority ${alert.severity ? `priority-${alert.severity}` : 'priority-moderate'}">${getSeverityText(alert.severity)}</span>
        </div>
        <div class="alert-source"><strong>Source:</strong> MeteoAlarm (Official European Weather Alerts)${alert.isCountryWide ? ' - Country-wide alert' : ' - Location-relevant'}</div>
        ${publishedDate ? `<div class="alert-time"><strong>Published:</strong> ${publishedDate}</div>` : ''}
        <div class="alert-description">${alert.description}</div>
        ${alert.eventType ? `<div class="alert-areas"><strong>Event Type:</strong> ${alert.eventType}</div>` : ''}
    `;
    
    return alertDiv;
}

function getEventSeverity(eventName) {
    if (!eventName) return 'moderate';
    
    const event = eventName.toLowerCase();
    
    // Extreme severity events
    if (event.includes('tornado') || event.includes('hurricane') || event.includes('blizzard') || 
        event.includes('ice storm') || event.includes('extreme') || event.includes('emergency')) {
        return 'extreme';
    }
    
    // Severe events
    if (event.includes('warning') || event.includes('severe') || event.includes('flood') || 
        event.includes('storm') || event.includes('wind') || event.includes('hail')) {
        return 'severe';
    }
    
    // Minor events
    if (event.includes('advisory') || event.includes('watch') || event.includes('small craft') || 
        event.includes('frost') || event.includes('fog')) {
        return 'minor';
    }
    
    // Default to moderate
    return 'moderate';
}

function getSeverityText(severity) {
    switch (severity) {
        case 'extreme': return 'Extreme';
        case 'severe': return 'Severe';
        case 'moderate': return 'Moderate';
        case 'minor': return 'Minor';
        default: return 'Moderate';
    }
}

function extractSeverityFromTitle(title) {
    const titleLower = title.toLowerCase();
    
    if (titleLower.includes('red') || titleLower.includes('extreme')) {
        return 'extreme';
    } else if (titleLower.includes('orange') || titleLower.includes('severe')) {
        return 'severe';
    } else if (titleLower.includes('yellow') || titleLower.includes('moderate')) {
        return 'moderate';
    } else if (titleLower.includes('green') || titleLower.includes('minor')) {
        return 'minor';
    }
    
    return 'moderate';
}

function extractEventTypeFromTitle(title) {
    const titleLower = title.toLowerCase();
    
    if (titleLower.includes('wind')) return 'Wind';
    if (titleLower.includes('rain') || titleLower.includes('precipitation')) return 'Rain';
    if (titleLower.includes('snow') || titleLower.includes('ice')) return 'Snow/Ice';
    if (titleLower.includes('thunder') || titleLower.includes('storm')) return 'Thunderstorm';
    if (titleLower.includes('fog')) return 'Fog';
    if (titleLower.includes('heat') || titleLower.includes('temperature')) return 'Temperature';
    if (titleLower.includes('flood')) return 'Flood';
    
    return 'General Weather Warning';
}

// Refresh weather data every 10 minutes
setInterval(() => {
    if (API_KEY !== 'YOUR_API_KEY_HERE') {
        if (isUsingCurrentLocation) {
            getWeatherData();
        } else if (currentWeatherData && currentWeatherData.location) {
            // Refresh searched location data
            getWeatherDataByLocation(`${currentWeatherData.location.name}, ${currentWeatherData.location.country}`);
        }
    }
}, 600000);
