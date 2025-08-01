// Visibility Analysis Utilities

const VisibilityUtils = {
    // Analyze visibility and return comprehensive information
    analyzeVisibility: (visibilityKm, weatherCondition) => {
        const analysis = {
            value: visibilityKm,
            weatherCondition: weatherCondition.toLowerCase()
        };

        // Determine visibility category and basic properties
        if (visibilityKm >= 50) {
            analysis.category = 'Excellent';
            analysis.cssClass = 'visibility-excellent';
            analysis.icon = 'fas fa-eye';
            analysis.description = 'Crystal clear visibility with unlimited range.';
        } else if (visibilityKm >= 20) {
            analysis.category = 'Very Good';
            analysis.cssClass = 'visibility-very-good';
            analysis.icon = 'fas fa-eye';
            analysis.description = 'Very clear conditions with excellent long-distance visibility.';
        } else if (visibilityKm >= 10) {
            analysis.category = 'Good';
            analysis.cssClass = 'visibility-good';
            analysis.icon = 'fas fa-eye';
            analysis.description = 'Good visibility for most activities.';
        } else if (visibilityKm >= 4) {
            analysis.category = 'Moderate';
            analysis.cssClass = 'visibility-moderate';
            analysis.icon = 'fas fa-eye-slash';
            analysis.description = 'Reduced visibility affecting long-distance viewing.';
        } else if (visibilityKm >= 1) {
            analysis.category = 'Poor';
            analysis.cssClass = 'visibility-poor';
            analysis.icon = 'fas fa-eye-slash';
            analysis.description = 'Significantly reduced visibility affecting most outdoor activities.';
        } else if (visibilityKm >= 0.2) {
            analysis.category = 'Very Poor';
            analysis.cssClass = 'visibility-very-poor';
            analysis.icon = 'fas fa-exclamation-triangle';
            analysis.description = 'Very limited visibility. Exercise extreme caution.';
        } else {
            analysis.category = 'Extreme';
            analysis.cssClass = 'visibility-extreme';
            analysis.icon = 'fas fa-exclamation-triangle';
            analysis.description = 'Extremely poor visibility. Avoid travel if possible.';
        }

        // Add weather-specific context
        analysis.weatherContext = VisibilityUtils.getWeatherContext(visibilityKm, analysis.weatherCondition);

        // Generate driving advice
        analysis.drivingAdvice = VisibilityUtils.getDrivingAdvice(visibilityKm, analysis.weatherCondition);

        // Generate activity recommendations
        analysis.activities = VisibilityUtils.getActivityRecommendations(visibilityKm, analysis.weatherCondition);

        // Add warning if needed
        if (visibilityKm < 1) {
            analysis.warning = `Very poor visibility (${visibilityKm} km). Use extreme caution when traveling.`;
        } else if (visibilityKm < 4) {
            analysis.warning = `Reduced visibility (${visibilityKm} km). Drive carefully and use headlights.`;
        }

        return analysis;
    },

    // Get weather-specific context for visibility
    getWeatherContext: (visibilityKm, weatherCondition) => {
        if (weatherCondition.includes('fog') || weatherCondition.includes('mist')) {
            if (visibilityKm < 1) {
                return 'Dense fog is severely limiting visibility.';
            } else if (visibilityKm < 4) {
                return 'Fog or mist is reducing visibility.';
            } else {
                return 'Light fog or mist may be present.';
            }
        }

        if (weatherCondition.includes('rain') || weatherCondition.includes('drizzle')) {
            if (visibilityKm < 4) {
                return 'Heavy rainfall is reducing visibility.';
            } else if (visibilityKm < 10) {
                return 'Rain may be affecting visibility.';
            }
        }

        if (weatherCondition.includes('snow') || weatherCondition.includes('blizzard')) {
            if (visibilityKm < 1) {
                return 'Heavy snowfall or blizzard conditions are severely limiting visibility.';
            } else if (visibilityKm < 4) {
                return 'Snowfall is reducing visibility.';
            } else if (visibilityKm < 10) {
                return 'Light snow may be affecting visibility.';
            }
        }

        if (weatherCondition.includes('dust') || weatherCondition.includes('sand')) {
            return 'Dust or sand particles are affecting visibility.';
        }

        if (weatherCondition.includes('haze')) {
            return 'Atmospheric haze is reducing clarity.';
        }

        // Clear conditions context
        if (visibilityKm >= 20) {
            return 'Clear atmospheric conditions provide excellent visibility.';
        }

        return null;
    },

    // Get driving advice based on visibility
    getDrivingAdvice: (visibilityKm, weatherCondition) => {
        if (visibilityKm < 0.2) {
            return 'Avoid driving. If you must travel, use hazard lights, drive very slowly, and consider pulling over safely.';
        } else if (visibilityKm < 1) {
            return 'Drive with extreme caution. Use headlights, fog lights, reduce speed significantly, and increase following distance.';
        } else if (visibilityKm < 4) {
            return 'Use headlights and fog lights. Reduce speed, increase following distance, and avoid overtaking.';
        } else if (visibilityKm < 10) {
            return 'Use headlights during the day. Maintain safe following distance and be prepared for sudden changes.';
        } else if (visibilityKm < 20) {
            return 'Normal driving conditions with good visibility. Stay alert for any changes in conditions.';
        } else {
            return 'Excellent driving conditions with clear visibility in all directions.';
        }
    },

    // Get activity recommendations based on visibility
    getActivityRecommendations: (visibilityKm, weatherCondition) => {
        const activities = [];

        if (visibilityKm >= 20) {
            activities.push('Perfect for photography and sightseeing');
            activities.push('Excellent for hiking and outdoor sports');
            activities.push('Ideal for aviation activities');
            activities.push('Great for long-distance cycling');
        } else if (visibilityKm >= 10) {
            activities.push('Good for most outdoor activities');
            activities.push('Suitable for local hiking and walking');
            activities.push('Fine for outdoor sports with adequate lighting');
        } else if (visibilityKm >= 4) {
            activities.push('Limited outdoor activities recommended');
            activities.push('Stay on familiar paths and routes');
            activities.push('Use reflective gear for safety');
        } else if (visibilityKm >= 1) {
            activities.push('Avoid extended outdoor activities');
            activities.push('Stay close to shelter and landmarks');
            activities.push('Use bright clothing and lights');
        } else {
            activities.push('Stay indoors when possible');
            activities.push('Postpone non-essential outdoor activities');
            activities.push('If outside, stay in well-lit, familiar areas');
        }

        // Add weather-specific recommendations
        if (weatherCondition.includes('fog')) {
            activities.push('Fog may lift as temperature rises');
        }

        if (weatherCondition.includes('rain')) {
            activities.push('Visibility may improve when rain stops');
        }

        return activities;
    },

    // Format visibility value for display
    formatVisibility: (visibilityKm) => {
        if (visibilityKm >= 10) {
            return `${Math.round(visibilityKm)} km`;
        } else if (visibilityKm >= 1) {
            return `${visibilityKm.toFixed(1)} km`;
        } else {
            return `${Math.round(visibilityKm * 1000)} m`;
        }
    },

    // Get visibility icon based on conditions
    getVisibilityIcon: (visibilityKm, weatherCondition) => {
        if (visibilityKm < 1) {
            return 'fas fa-exclamation-triangle';
        } else if (visibilityKm < 4) {
            return 'fas fa-eye-slash';
        } else {
            return 'fas fa-eye';
        }
    },

    // Get visibility color based on category
    getVisibilityColor: (visibilityKm) => {
        if (visibilityKm >= 20) return '#27ae60';      // Green
        if (visibilityKm >= 10) return '#2ecc71';      // Light green
        if (visibilityKm >= 4) return '#f1c40f';       // Yellow
        if (visibilityKm >= 1) return '#e67e22';       // Orange
        if (visibilityKm >= 0.2) return '#e74c3c';     // Red
        return '#8e44ad';                              // Purple for extreme
    }
};

// Make VisibilityUtils globally available for browser scripts
if (typeof window !== 'undefined') {
    window.VisibilityUtils = VisibilityUtils;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { VisibilityUtils };
}