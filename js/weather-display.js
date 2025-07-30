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
        
        DOMUtils.setText(DOM.visibility, `${current.vis_km} km`);
        DOMUtils.setText(DOM.humidity, `${current.humidity}%`);
        DOMUtils.setText(DOM.wind, `${current.wind_kph} km/h ${current.wind_dir}`);

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
    }
};

// Export for use in other modules (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { WeatherDisplay };
} 