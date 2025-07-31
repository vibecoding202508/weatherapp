// Weather Display Functionality

const WeatherDisplay = {
    // Display weather data
    displayWeatherData: (data) => {
        // Store current data
        StateManager.setWeatherData(data);
        
        // Use window.DOM if available (for testing), otherwise use the global DOM
        const domRef = (typeof window !== 'undefined' && window.DOM) ? window.DOM : DOM;
        
        // Current weather
        const current = data.current;
        const location = data.location;
        
        DOMUtils.setText(domRef.location, `${location.name}, ${location.region}, ${location.country}`);
        DOMUtils.setText(domRef.currentTemp, `${MathUtils.roundTemp(current.temp_c)}°C`);
        
        if (domRef.currentIcon) {
            domRef.currentIcon.src = `https:${current.condition.icon}`;
            domRef.currentIcon.alt = current.condition.text;
        }
        
        DOMUtils.setText(domRef.currentCondition, current.condition.text);
        DOMUtils.setText(domRef.feelsLike, `Feels like ${MathUtils.roundTemp(current.feelslike_c)}°C`);
        
        // Apply weather animation based on condition
        WeatherAnimations.applyWeatherAnimation(current.condition.text, current);
        
        // Apply weather-based background colors
        WeatherDisplay.applyWeatherBackground(current.condition.text, current);
        
        // Enhanced visibility display
        WeatherDisplay.updateVisibilityDisplay(current.vis_km, current.condition.text);
        DOMUtils.setText(domRef.humidity, `${current.humidity}%`);
        DOMUtils.setText(domRef.wind, `${current.wind_kph} km/h ${current.wind_dir}`);
        
        // UV Index display and warning
        if (current.uv !== undefined) {
            DOMUtils.setText(domRef.uvIndex, current.uv);
            
            // Show UV warning if UV index is higher than 3
            if (current.uv > 3) {
                if (domRef.uvWarning && domRef.uvWarning.style) {
                    domRef.uvWarning.style.display = 'flex';
                }
                console.log(`UV Index is ${current.uv} - showing sunscreen warning`);
            } else {
                if (domRef.uvWarning && domRef.uvWarning.style) {
                    domRef.uvWarning.style.display = 'none';
                }
            }
        } else {
            DOMUtils.setText(domRef.uvIndex, 'N/A');
            if (domRef.uvWarning && domRef.uvWarning.style) {
                domRef.uvWarning.style.display = 'none';
            }
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
        // Use window.DOM if available (for testing), otherwise use the global DOM
        const domRef = (typeof window !== 'undefined' && window.DOM) ? window.DOM : DOM;
        
        if (!domRef.forecastContainer) return;

        DOMUtils.setHTML(domRef.forecastContainer, '');
        
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
            
            domRef.forecastContainer.appendChild(forecastItem);
        });
    },

    // Update current temperature display
    updateTemperature: (tempC) => {
        // Use window.DOM if available (for testing), otherwise use the global DOM
        const domRef = (typeof window !== 'undefined' && window.DOM) ? window.DOM : DOM;
        DOMUtils.setText(domRef.currentTemp, `${MathUtils.roundTemp(tempC)}°C`);
    },

    // Update feels like temperature
    updateFeelsLike: (feelsLikeC) => {
        // Use window.DOM if available (for testing), otherwise use the global DOM
        const domRef = (typeof window !== 'undefined' && window.DOM) ? window.DOM : DOM;
        DOMUtils.setText(domRef.feelsLike, `Feels like ${MathUtils.roundTemp(feelsLikeC)}°C`);
    },

    // Update location display
    updateLocation: (locationData) => {
        // Use window.DOM if available (for testing), otherwise use the global DOM
        const domRef = (typeof window !== 'undefined' && window.DOM) ? window.DOM : DOM;
        DOMUtils.setText(domRef.location, `${locationData.name}, ${locationData.region}, ${locationData.country}`);
    },

    // Update weather condition
    updateCondition: (condition) => {
        // Use window.DOM if available (for testing), otherwise use the global DOM
        const domRef = (typeof window !== 'undefined' && window.DOM) ? window.DOM : DOM;
        DOMUtils.setText(domRef.currentCondition, condition.text);
        if (domRef.currentIcon) {
            domRef.currentIcon.src = `https:${condition.icon}`;
            domRef.currentIcon.alt = condition.text;
        }
    },

    // Update weather stats (humidity, wind, visibility)
    updateWeatherStats: (current) => {
        WeatherDisplay.updateVisibilityDisplay(current.vis_km, current.condition.text);
        DOMUtils.setText(DOM.humidity, `${current.humidity}%`);
        DOMUtils.setText(DOM.wind, `${current.wind_kph} km/h ${current.wind_dir}`);
    },

    // Update visibility display with detailed analysis
    updateVisibilityDisplay: (visibilityKm, weatherCondition) => {
        const analysis = VisibilityUtils.analyzeVisibility(visibilityKm, weatherCondition);
        
        // Use window.DOM if available (for testing), otherwise use the global DOM
        const domRef = (typeof window !== 'undefined' && window.DOM) ? window.DOM : DOM;
        
        // Update basic visibility display
        DOMUtils.setText(domRef.visibility, VisibilityUtils.formatVisibility(visibilityKm));
        
        // Update visibility icon
        const visibilityIcon = document.getElementById('visibility-icon');
        if (visibilityIcon) {
            visibilityIcon.className = analysis.icon;
        }
        
        // Update visibility container class
        const visibilityContainer = document.getElementById('visibility-container');
        if (visibilityContainer) {
            // Remove existing visibility classes
            visibilityContainer.classList.remove(
                'visibility-excellent', 'visibility-very-good', 'visibility-good',
                'visibility-moderate', 'visibility-poor', 'visibility-very-poor', 'visibility-extreme'
            );
            visibilityContainer.classList.add(analysis.cssClass);
        }
        
        // Update visibility category and description
        const categoryElement = document.getElementById('visibility-category');
        const descriptionElement = document.getElementById('visibility-description');
        
        if (categoryElement) {
            categoryElement.textContent = analysis.category;
            categoryElement.className = `visibility-category ${analysis.cssClass}`;
        }
        
        if (descriptionElement) {
            descriptionElement.textContent = analysis.description;
        }
        
                 // Setup the toggle functionality
         WeatherDisplay.setupVisibilityToggle();
         
         // Update detailed content
         WeatherDisplay.updateVisibilityDetails(analysis);
         
         // Add warning to description if needed
         if (analysis.warning) {
             const descriptionElement = document.getElementById('visibility-description');
             if (descriptionElement) {
                 descriptionElement.innerHTML = `<strong style="color: #e74c3c;">${analysis.warning}</strong><br>${analysis.description}`;
             }
         }
    },

    // Update detailed visibility information
    updateVisibilityDetails: (analysis) => {
        // Update weather context
        const contextElement = document.getElementById('visibility-weather-context');
        if (contextElement && analysis.weatherContext) {
            contextElement.textContent = analysis.weatherContext;
            contextElement.style.display = 'block';
        } else if (contextElement) {
            contextElement.style.display = 'none';
        }
        
        // Update driving advice
        const drivingAdviceElement = document.getElementById('visibility-driving-advice');
        if (drivingAdviceElement) {
            drivingAdviceElement.textContent = analysis.drivingAdvice;
        }
        
        // Update activities list
        const activitiesListElement = document.getElementById('visibility-activities-list');
        if (activitiesListElement) {
            activitiesListElement.innerHTML = '';
            analysis.activities.forEach(activity => {
                const li = document.createElement('li');
                li.textContent = activity;
                activitiesListElement.appendChild(li);
            });
        }
    },

         // Setup visibility toggle functionality
     setupVisibilityToggle: () => {
         const toggleButton = document.getElementById('visibility-toggle');
         const expandableContent = document.getElementById('visibility-expandable');
         const visibilityHeader = document.getElementById('visibility-header');
         
         if (toggleButton && expandableContent) {
             // Set initial state - collapsed by default
             expandableContent.style.display = 'none';
             toggleButton.classList.remove('expanded');
             
             // Remove existing click handlers to prevent duplicates
             toggleButton.replaceWith(toggleButton.cloneNode(true));
             const newToggleButton = document.getElementById('visibility-toggle');
             
             // Add click handler to both button and header for better UX
             const clickHandler = (e) => {
                 e.preventDefault();
                 e.stopPropagation();
                 WeatherDisplay.toggleVisibilityDetails();
             };
             
             newToggleButton.addEventListener('click', clickHandler);
             
             // Also make the header clickable (excluding the toggle button)
             if (visibilityHeader) {
                 visibilityHeader.addEventListener('click', (e) => {
                     if (e.target !== newToggleButton && !newToggleButton.contains(e.target)) {
                         clickHandler(e);
                     }
                 });
                 visibilityHeader.style.cursor = 'pointer';
             }
         }
     },

         // Toggle visibility details panel
     toggleVisibilityDetails: () => {
         const expandableContent = document.getElementById('visibility-expandable');
         const toggleButton = document.getElementById('visibility-toggle');
         
         if (expandableContent && toggleButton) {
             const isExpanded = toggleButton.classList.contains('expanded');
             
             if (isExpanded) {
                 // Collapse with animation
                 expandableContent.style.display = 'none';
                 expandableContent.classList.remove('expanded');
                 toggleButton.classList.remove('expanded');
                 console.log('Visibility details collapsed');
             } else {
                 // Expand with animation
                 expandableContent.style.display = 'block';
                 expandableContent.classList.add('expanded');
                 toggleButton.classList.add('expanded');
                 console.log('Visibility details expanded');
             }
         }
     },

    // Clear all weather data from display
    clearDisplay: () => {
        // Use window.DOM if available (for testing), otherwise use the global DOM
        const domRef = (typeof window !== 'undefined' && window.DOM) ? window.DOM : DOM;
        
        DOMUtils.setText(domRef.location, '');
        DOMUtils.setText(domRef.currentTemp, '');
        DOMUtils.setText(domRef.currentCondition, '');
        DOMUtils.setText(domRef.feelsLike, '');
        // Clear visibility display
        DOMUtils.setText(domRef.visibility, '');
         const categoryElement = document.getElementById('visibility-category');
         const descriptionElement = document.getElementById('visibility-description');
         const expandableContent = document.getElementById('visibility-expandable');
         const toggleButton = document.getElementById('visibility-toggle');
         const visibilityContainer = document.getElementById('visibility-container');
         
         if (categoryElement) categoryElement.textContent = '';
         if (descriptionElement) descriptionElement.textContent = '';
         if (expandableContent) {
             expandableContent.style.display = 'none';
             expandableContent.classList.remove('expanded');
         }
         if (toggleButton) toggleButton.classList.remove('expanded');
         if (visibilityContainer) {
             // Remove all visibility category classes
             visibilityContainer.classList.remove(
                 'visibility-excellent', 'visibility-very-good', 'visibility-good',
                 'visibility-moderate', 'visibility-poor', 'visibility-very-poor', 'visibility-extreme'
             );
         }
        
        DOMUtils.setText(domRef.humidity, '');
        DOMUtils.setText(domRef.wind, '');
        
        if (domRef.currentIcon) {
            domRef.currentIcon.src = '';
            domRef.currentIcon.alt = '';
        }
        
        if (domRef.forecastContainer) {
            DOMUtils.setHTML(domRef.forecastContainer, '');
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