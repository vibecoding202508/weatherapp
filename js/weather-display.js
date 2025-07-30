// Weather Display Functionality

const WeatherDisplay = {
    // Display weather data
    displayWeatherData: (data) => {
        // Store current data
        StateManager.setWeatherData(data);
        
        // Current weather
        const current = data.current;
        const location = data.location;
        
        DOMUtils.setText(DOM.location, `${location.name}, ${location.region}, ${location.country}`);
        DOMUtils.setText(DOM.currentTemp, `${MathUtils.roundTemp(current.temp_c)}°C`);
        
        if (DOM.currentIcon) {
            DOM.currentIcon.src = `https:${current.condition.icon}`;
            DOM.currentIcon.alt = current.condition.text;
        }
        
        DOMUtils.setText(DOM.currentCondition, current.condition.text);
        DOMUtils.setText(DOM.feelsLike, `Feels like ${MathUtils.roundTemp(current.feelslike_c)}°C`);
        
        // Apply weather animation based on condition
        WeatherAnimations.applyWeatherAnimation(current.condition.text, current);
        
        // Apply weather-based background colors
        WeatherDisplay.applyWeatherBackground(current.condition.text, current);
        
        DOMUtils.setText(DOM.visibility, `${current.vis_km} km`);
        DOMUtils.setText(DOM.humidity, `${current.humidity}%`);
        DOMUtils.setText(DOM.wind, `${current.wind_kph} km/h ${current.wind_dir}`);
        
        // UV Index display and warning
        if (current.uv !== undefined) {
            DOMUtils.setText(DOM.uvIndex, current.uv);
            
            // Show UV warning if UV index is higher than 3
            if (current.uv > 3) {
                DOM.uvWarning.style.display = 'flex';
                console.log(`UV Index is ${current.uv} - showing sunscreen warning`);
            } else {
                DOM.uvWarning.style.display = 'none';
            }
        } else {
            DOMUtils.setText(DOM.uvIndex, 'N/A');
            DOM.uvWarning.style.display = 'none';
        }

        // 3-day forecast
        WeatherDisplay.displayForecast(data.forecast.forecastday);
        
        // Fetch weather alerts from MeteoAlarm (free European alerts)
        console.log('Fetching alerts for location:', `${location.name}, ${location.region}, ${location.country}`);
        WeatherAlerts.fetchMeteoAlarmAlerts(data.location.country, location);
        
        UIUtils.showWeatherContent();
    },

    // Display forecast data
    displayForecast: (forecastDays) => {
        if (!DOM.forecastContainer) return;

        DOMUtils.setHTML(DOM.forecastContainer, '');
        
        forecastDays.forEach((day, index) => {
            const forecastItem = document.createElement('div');
            forecastItem.className = 'forecast-item';
            
            const dayName = DateUtils.getDayName(day.date, index);
            const dateString = DateUtils.formatDate(day.date);
            
            const rainChance = day.day.daily_chance_of_rain;
            const rainInfo = rainChance > 0 ? 
                `<div class="forecast-rain"><i class="fas fa-umbrella"></i> ${rainChance}% chance of rain</div>` : '';
            
            forecastItem.innerHTML = `
                <div class="forecast-date">${dayName}</div>
                <div style="font-size: 0.9rem; color: #636e72; margin-bottom: 10px;">${dateString}</div>
                <div class="forecast-icon">
                    <img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}">
                </div>
                <div class="forecast-temps">
                    <span class="forecast-high">${MathUtils.roundTemp(day.day.maxtemp_c)}°</span>
                    <span class="forecast-low">${MathUtils.roundTemp(day.day.mintemp_c)}°</span>
                </div>
                <div class="forecast-condition">${day.day.condition.text}</div>
                ${rainInfo}
            `;
            
            DOM.forecastContainer.appendChild(forecastItem);
        });
    },

    // Update current temperature display
    updateTemperature: (tempC) => {
        DOMUtils.setText(DOM.currentTemp, `${MathUtils.roundTemp(tempC)}°C`);
    },

    // Update feels like temperature
    updateFeelsLike: (feelsLikeC) => {
        DOMUtils.setText(DOM.feelsLike, `Feels like ${MathUtils.roundTemp(feelsLikeC)}°C`);
    },

    // Update location display
    updateLocation: (locationData) => {
        DOMUtils.setText(DOM.location, `${locationData.name}, ${locationData.region}, ${locationData.country}`);
    },

    // Update weather condition
    updateCondition: (condition) => {
        DOMUtils.setText(DOM.currentCondition, condition.text);
        if (DOM.currentIcon) {
            DOM.currentIcon.src = `https:${condition.icon}`;
            DOM.currentIcon.alt = condition.text;
        }
    },

    // Update weather stats (humidity, wind, visibility)
    updateWeatherStats: (current) => {
        DOMUtils.setText(DOM.visibility, `${current.vis_km} km`);
        DOMUtils.setText(DOM.humidity, `${current.humidity}%`);
        DOMUtils.setText(DOM.wind, `${current.wind_kph} km/h ${current.wind_dir}`);
    },

    // Clear all weather data from display
    clearDisplay: () => {
        DOMUtils.setText(DOM.location, '');
        DOMUtils.setText(DOM.currentTemp, '');
        DOMUtils.setText(DOM.currentCondition, '');
        DOMUtils.setText(DOM.feelsLike, '');
        DOMUtils.setText(DOM.visibility, '');
        DOMUtils.setText(DOM.humidity, '');
        DOMUtils.setText(DOM.wind, '');
        
        if (DOM.currentIcon) {
            DOM.currentIcon.src = '';
            DOM.currentIcon.alt = '';
        }
        
        if (DOM.forecastContainer) {
            DOMUtils.setHTML(DOM.forecastContainer, '');
        }
        
        // Reset to default gradient when clearing weather data
        WeatherDisplay.resetToDefaultBackground();
    },

    // Reset background to default gradient
    resetToDefaultBackground: () => {
        const isDarkMode = document.body.classList.contains('dark-mode');
        
        if (isDarkMode) {
            document.documentElement.style.setProperty('--bg-gradient-start', '#2d3436');
            document.documentElement.style.setProperty('--bg-gradient-end', '#636e72');
        } else {
            document.documentElement.style.setProperty('--bg-gradient-start', '#74b9ff');
            document.documentElement.style.setProperty('--bg-gradient-end', '#0984e3');
        }
        
        console.log('Reset to default background colors');
    },

    // Apply weather-based background colors
    applyWeatherBackground: (conditionText, currentWeather) => {
        const condition = conditionText.toLowerCase();
        const isDarkMode = document.body.classList.contains('dark-mode');
        const isNight = WeatherDisplay.isNightTime(currentWeather);
        
        // Define color schemes for different weather conditions
        const weatherColors = {
            sunny: {
                light: ['#FFD93D', '#FF9A00'],      // Yellow to orange
                dark: ['#4A3C1D', '#8B6914'],      // Warm dark golden
                night: ['#1A1A2E', '#16213E']      // Dark blue night
            },
            clear: {
                light: ['#87CEEB', '#4169E1'],      // Sky blue to royal blue
                dark: ['#3A4F66', '#2C3E50'],      // Dark steel blue
                night: ['#0F0F23', '#191970']      // Deep night blue
            },
            rainy: {
                light: ['#6C7B95', '#3E5266'],      // Blue-grey tones
                dark: ['#2E4057', '#1B2631'],      // Dark stormy blue-grey
                night: ['#2F3542', '#3C4560']      // Dark rainy night
            },
            snowy: {
                light: ['#E6F3FF', '#B8D4F0'],      // Light icy blue
                dark: ['#4A6B8A', '#34495E'],      // Dark winter blue
                night: ['#2C3E50', '#34495E']      // Cold night tones
            },
            cloudy: {
                light: ['#BDC3C7', '#7F8C8D'],      // Light to medium grey
                dark: ['#4F5B66', '#2F3640'],      // Dark slate grey
                night: ['#2C3E50', '#34495E']      // Dark cloudy night
            },
            stormy: {
                light: ['#5D6D7E', '#2E4057'],      // Dark blue-grey
                dark: ['#1A252F', '#0D1B2A'],      // Very dark stormy
                night: ['#0B1426', '#1B2631']      // Stormy night
            },
            windy: {
                light: ['#AED6F1', '#5DADE2'],      // Light windy blue
                dark: ['#2980B9', '#1F4E79'],      // Dark windy blue
                night: ['#1B4F72', '#154360']      // Windy night
            },
            foggy: {
                light: ['#D5DBDB', '#AEB6BF'],      // Light misty grey
                dark: ['#566573', '#2F3542'],      // Dark foggy grey
                night: ['#2F3542', '#212F3C']      // Foggy night
            },
            partly_cloudy: {
                light: ['#F8C471', '#E67E22'],      // Warm partly sunny
                dark: ['#5D4E37', '#704214'],      // Dark golden brown
                night: ['#34495E', '#2C3E50']      // Partly cloudy night
            }
        };
        
        // Determine weather condition category
        let weatherType = 'cloudy'; // default
        
        if (condition.includes('sunny') || (condition.includes('clear') && !isNight)) {
            weatherType = 'sunny';
        } else if (condition.includes('clear') && isNight) {
            weatherType = 'clear';
        } else if (condition.includes('thunder') || condition.includes('storm') || condition.includes('lightning')) {
            weatherType = 'stormy';
        } else if (condition.includes('rain') || condition.includes('drizzle') || condition.includes('shower') || condition.includes('downpour')) {
            weatherType = 'rainy';
        } else if (condition.includes('snow') || condition.includes('blizzard') || condition.includes('sleet') || condition.includes('ice')) {
            weatherType = 'snowy';
        } else if (condition.includes('fog') || condition.includes('mist') || condition.includes('haze')) {
            weatherType = 'foggy';
        } else if (condition.includes('partly') && (condition.includes('cloud') || condition.includes('sun'))) {
            weatherType = 'partly_cloudy';
        } else if (condition.includes('wind') || currentWeather.wind_kph > 25) {
            weatherType = 'windy';
        } else if (condition.includes('cloud') || condition.includes('overcast')) {
            weatherType = 'cloudy';
        }
        
        // Select appropriate colors
        let colors;
        let mode;
        if (isNight && weatherColors[weatherType].night) {
            colors = weatherColors[weatherType].night;
            mode = 'night';
        } else if (isDarkMode) {
            colors = weatherColors[weatherType].dark;
            mode = 'dark';
        } else {
            colors = weatherColors[weatherType].light;
            mode = 'light';
        }
        
        // Apply the colors to CSS variables
        document.documentElement.style.setProperty('--bg-gradient-start', colors[0]);
        document.documentElement.style.setProperty('--bg-gradient-end', colors[1]);
        
        console.log(`Applied ${weatherType} (${mode} mode) background colors:`, colors);
    },

    // Helper function to determine if it's night time
    isNightTime: (currentWeather) => {
        // Check if the current weather data includes day/night information
        if (currentWeather.is_day !== undefined) {
            return currentWeather.is_day === 0;
        }
        
        // Fallback: check local time (basic approach)
        const now = new Date();
        const hour = now.getHours();
        return hour < 6 || hour > 20; // Consider 6 AM to 8 PM as day
    }
};

// Export for use in other modules (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { WeatherDisplay };
} 