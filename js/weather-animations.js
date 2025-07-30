// Weather Animations Functionality

const WeatherAnimations = {
    // Apply weather animation based on condition
    applyWeatherAnimation: (conditionText, currentWeather) => {
        if (!DOM.currentIcon) return;

        const weatherIcon = DOM.currentIcon.parentElement;
        const condition = conditionText.toLowerCase();
        
        // Clear existing animation classes
        weatherIcon.classList.remove(
            'weather-sunny', 'weather-rainy', 'weather-snowy', 
            'weather-cloudy', 'weather-windy', 'weather-thunderstorm'
        );
        
        // Clear existing particle effects
        WeatherAnimations.clearParticles(weatherIcon);
        
        // Determine animation based on weather condition
        if (condition.includes('sunny') || condition.includes('clear')) {
            DOMUtils.addClass(weatherIcon, 'weather-sunny');
        } else if (condition.includes('rain') || condition.includes('drizzle') || condition.includes('shower')) {
            DOMUtils.addClass(weatherIcon, 'weather-rainy');
            WeatherAnimations.addRainParticles(weatherIcon);
        } else if (condition.includes('snow') || condition.includes('blizzard')) {
            DOMUtils.addClass(weatherIcon, 'weather-snowy');
            WeatherAnimations.addSnowParticles(weatherIcon);
        } else if (condition.includes('cloud') || condition.includes('overcast')) {
            DOMUtils.addClass(weatherIcon, 'weather-cloudy');
        } else if (condition.includes('wind') || currentWeather.wind_kph > 20) {
            DOMUtils.addClass(weatherIcon, 'weather-windy');
        } else if (condition.includes('thunder') || condition.includes('storm')) {
            DOMUtils.addClass(weatherIcon, 'weather-thunderstorm');
        } else {
            // Default to cloudy for unknown conditions
            DOMUtils.addClass(weatherIcon, 'weather-cloudy');
        }
    },

    // Add rain particles
    addRainParticles: (container) => {
        const particles = document.createElement('div');
        particles.className = 'weather-particles';
        
        // Create raindrops
        for (let i = 0; i < CONFIG.MAX_RAIN_PARTICLES; i++) {
            const raindrop = document.createElement('div');
            raindrop.className = 'raindrop';
            raindrop.style.left = MathUtils.getRandomPercentage();
            raindrop.style.animationDelay = `${MathUtils.getRandomInRange(0, 1)}s`;
            raindrop.style.animationDuration = `${MathUtils.getRandomInRange(0.8, 1.2)}s`;
            particles.appendChild(raindrop);
        }
        
        container.appendChild(particles);
    },

    // Add snow particles
    addSnowParticles: (container) => {
        const particles = document.createElement('div');
        particles.className = 'weather-particles';
        
        // Create snowflakes
        for (let i = 0; i < CONFIG.MAX_SNOW_PARTICLES; i++) {
            const snowflake = document.createElement('div');
            snowflake.className = 'snowflake';
            snowflake.textContent = '❄';
            snowflake.style.left = MathUtils.getRandomPercentage();
            snowflake.style.animationDelay = `${MathUtils.getRandomInRange(0, 3)}s`;
            snowflake.style.animationDuration = `${MathUtils.getRandomInRange(2, 4)}s`;
            particles.appendChild(snowflake);
        }
        
        container.appendChild(particles);
    },

    // Clear existing particle effects
    clearParticles: (container) => {
        const existingParticles = container.querySelector('.weather-particles');
        if (existingParticles) {
            existingParticles.remove();
        }
    },

    // Remove all animations from weather icon
    removeAllAnimations: () => {
        if (!DOM.currentIcon) return;

        const weatherIcon = DOM.currentIcon.parentElement;
        
        // Remove all weather animation classes
        weatherIcon.classList.remove(
            'weather-sunny', 'weather-rainy', 'weather-snowy', 
            'weather-cloudy', 'weather-windy', 'weather-thunderstorm'
        );
        
        // Clear particles
        WeatherAnimations.clearParticles(weatherIcon);
    },

    // Get current animation state
    getCurrentAnimation: () => {
        if (!DOM.currentIcon) return null;

        const weatherIcon = DOM.currentIcon.parentElement;
        
        if (DOMUtils.hasClass(weatherIcon, 'weather-sunny')) return 'sunny';
        if (DOMUtils.hasClass(weatherIcon, 'weather-rainy')) return 'rainy';
        if (DOMUtils.hasClass(weatherIcon, 'weather-snowy')) return 'snowy';
        if (DOMUtils.hasClass(weatherIcon, 'weather-cloudy')) return 'cloudy';
        if (DOMUtils.hasClass(weatherIcon, 'weather-windy')) return 'windy';
        if (DOMUtils.hasClass(weatherIcon, 'weather-thunderstorm')) return 'thunderstorm';
        
        return null;
    },

    // Create custom particle effect
    createCustomParticles: (container, particleCount, particleClass, particleContent = '') => {
        const particles = document.createElement('div');
        particles.className = 'weather-particles';
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = particleClass;
            if (particleContent) {
                particle.textContent = particleContent;
            }
            particle.style.left = MathUtils.getRandomPercentage();
            particle.style.animationDelay = `${MathUtils.getRandomInRange(0, 2)}s`;
            particle.style.animationDuration = `${MathUtils.getRandomInRange(1, 3)}s`;
            particles.appendChild(particle);
        }
        
        container.appendChild(particles);
    }
};

// Export for use in other modules (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { WeatherAnimations };
} 