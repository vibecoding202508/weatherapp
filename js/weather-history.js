// Weather History Management

const WeatherHistory = {
    // In-memory database for weather history
    _historyData: [],
    _maxHistoryItems: 10, // Limit to prevent excessive memory usage

    // Helper function to safely encode HTML
    _encodeHTML: (str) => {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },

    // Initialize history functionality
    initialize: () => {
        // Load history from localStorage if available
        WeatherHistory.loadFromStorage();
        
        // Set up UI event listeners
        WeatherHistory.initializeUI();
    },

    // Add weather data to history
    addToHistory: (weatherData) => {
        if (!weatherData || !weatherData.location) {
            console.warn('Invalid weather data provided to history');
            return;
        }

        const historyItem = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            location: {
                name: weatherData.location.name,
                country: weatherData.location.country,
                region: weatherData.location.region,
                lat: weatherData.location.lat,
                lon: weatherData.location.lon
            },
            current: {
                temp_c: weatherData.current.temp_c,
                temp_f: weatherData.current.temp_f,
                condition: {
                    text: weatherData.current.condition.text,
                    icon: weatherData.current.condition.icon
                },
                humidity: weatherData.current.humidity,
                wind_kph: weatherData.current.wind_kph,
                wind_mph: weatherData.current.wind_mph,
                wind_dir: weatherData.current.wind_dir,
                uv: weatherData.current.uv,
                vis_km: weatherData.current.vis_km,
                vis_miles: weatherData.current.vis_miles
            },
            searchTerm: WeatherHistory._generateSearchTerm(weatherData.location)
        };

        // Remove duplicate locations (same coordinates)
        WeatherHistory._historyData = WeatherHistory._historyData.filter(item => 
            !(Math.abs(item.location.lat - historyItem.location.lat) < 0.01 && 
              Math.abs(item.location.lon - historyItem.location.lon) < 0.01)
        );

        // Add new item to beginning of array
        WeatherHistory._historyData.unshift(historyItem);

        // Limit array size
        if (WeatherHistory._historyData.length > WeatherHistory._maxHistoryItems) {
            WeatherHistory._historyData = WeatherHistory._historyData.slice(0, WeatherHistory._maxHistoryItems);
        }

        // Save to localStorage
        WeatherHistory.saveToStorage();

        // Update UI
        WeatherHistory.updateHistoryUI();

        console.log('Added to weather history:', historyItem.location.name);
    },

    // Get all history items
    getHistory: () => {
        return [...WeatherHistory._historyData]; // Return copy to prevent direct modification
    },

    // Get history item by ID
    getHistoryItem: (id) => {
        return WeatherHistory._historyData.find(item => item.id === id);
    },

    // Clear all history
    clearHistory: () => {
        WeatherHistory._historyData = [];
        WeatherHistory.saveToStorage();
        WeatherHistory.updateHistoryUI();
        console.log('Weather history cleared');
    },

    // Remove specific history item
    removeHistoryItem: (id) => {
        const initialLength = WeatherHistory._historyData.length;
        WeatherHistory._historyData = WeatherHistory._historyData.filter(item => item.id !== id);
        
        if (WeatherHistory._historyData.length < initialLength) {
            WeatherHistory.saveToStorage();
            WeatherHistory.updateHistoryUI();
            console.log('Removed history item:', id);
        }
    },

    // Search for location from history
    searchFromHistory: (historyItem) => {
        if (!historyItem || !historyItem.location) {
            console.warn('Invalid history item for search');
            return;
        }

        // Set search value and trigger search
        Search.setSearchValue(historyItem.searchTerm);
        StateManager.setCurrentLocation(false);
        Search.updateLocationButtons();
        WeatherAPI.getWeatherDataByLocation(historyItem.searchTerm);

        // Close history panel after selection
        WeatherHistory.toggleHistoryPanel(false);
    },

    // Generate search term from location data
    _generateSearchTerm: (location) => {
        if (location.region && location.region !== location.name) {
            return `${location.name}, ${location.region}, ${location.country}`;
        }
        return `${location.name}, ${location.country}`;
    },

    // Save history to localStorage
    saveToStorage: () => {
        try {
            localStorage.setItem('weather-history', JSON.stringify(WeatherHistory._historyData));
        } catch (error) {
            console.warn('Failed to save weather history to localStorage:', error);
        }
    },

    // Load history from localStorage
    loadFromStorage: () => {
        try {
            const stored = localStorage.getItem('weather-history');
            if (stored) {
                WeatherHistory._historyData = JSON.parse(stored);
                console.log('Loaded weather history from storage:', WeatherHistory._historyData.length, 'items');
            }
        } catch (error) {
            console.warn('Failed to load weather history from localStorage:', error);
            WeatherHistory._historyData = [];
        }
    },

    // Initialize UI components
    initializeUI: () => {
        const historyBtn = document.getElementById('history-btn');
        const historyPanel = document.getElementById('history-panel');
        const historyClose = document.getElementById('history-close');
        const historyClear = document.getElementById('history-clear');

        if (historyBtn) {
            historyBtn.addEventListener('click', () => WeatherHistory.toggleHistoryPanel());
        }

        if (historyClose) {
            historyClose.addEventListener('click', () => WeatherHistory.toggleHistoryPanel(false));
        }

        if (historyClear) {
            historyClear.addEventListener('click', () => {
                if (confirm('Are you sure you want to clear all weather history?')) {
                    WeatherHistory.clearHistory();
                }
            });
        }

        // Close panel when clicking outside
        if (historyPanel) {
            document.addEventListener('click', (e) => {
                if (!historyPanel.contains(e.target) && 
                    !historyBtn?.contains(e.target) && 
                    historyPanel.style.display === 'block') {
                    WeatherHistory.toggleHistoryPanel(false);
                }
            });
        }

        // Initial UI update
        WeatherHistory.updateHistoryUI();
    },

    // Toggle history panel visibility
    toggleHistoryPanel: (forceState = null) => {
        const historyPanel = document.getElementById('history-panel');
        const historyBtn = document.getElementById('history-btn');
        
        if (!historyPanel) return;

        const isVisible = historyPanel.style.display === 'block';
        const shouldShow = forceState !== null ? forceState : !isVisible;

        historyPanel.style.display = shouldShow ? 'block' : 'none';
        
        if (historyBtn) {
            if (shouldShow) {
                historyBtn.classList.add('active');
            } else {
                historyBtn.classList.remove('active');
            }
        }

        if (shouldShow) {
            WeatherHistory.updateHistoryUI();
        }
    },

    // Update history UI
    updateHistoryUI: () => {
        const historyList = document.getElementById('history-list');
        const historyBtn = document.getElementById('history-btn');
        const historyCount = document.getElementById('history-count');

        // Update history count badge
        if (historyCount) {
            const count = WeatherHistory._historyData.length;
            historyCount.textContent = count;
            historyCount.style.display = count > 0 ? 'inline' : 'none';
        }

        // Update history button state
        if (historyBtn) {
            if (WeatherHistory._historyData.length > 0) {
                historyBtn.classList.remove('disabled');
                historyBtn.title = `View weather history (${WeatherHistory._historyData.length} locations)`;
            } else {
                historyBtn.classList.add('disabled');
                historyBtn.title = 'No weather history available';
            }
        }

        if (!historyList) return;

        // Clear existing content
        historyList.innerHTML = '';

        if (WeatherHistory._historyData.length === 0) {
            historyList.innerHTML = `
                <div class="history-empty">
                    <i class="fas fa-history"></i>
                    <p>No weather history yet</p>
                    <p class="history-empty-hint">Search for locations to build your weather history</p>
                </div>
            `;
            return;
        }

        // Create history items
        WeatherHistory._historyData.forEach(item => {
            const historyElement = WeatherHistory._createHistoryElement(item);
            historyList.appendChild(historyElement);
        });
    },

    // Create history list item element
    _createHistoryElement: (item) => {
        const element = document.createElement('div');
        element.className = 'history-item';
        element.setAttribute('data-id', item.id);

        const timeAgo = WeatherHistory._formatTimeAgo(new Date(item.timestamp));
        const tempUnit = StateManager.getTempUnit ? StateManager.getTempUnit() : 'C';
        const temp = tempUnit === 'C' ? `${Math.round(item.current.temp_c)}°C` : `${Math.round(item.current.temp_f)}°F`;

        element.innerHTML = `
            <div class="history-item-main" onclick="WeatherHistory.searchFromHistory(WeatherHistory.getHistoryItem(${item.id}))">
                <div class="history-location">
                    <i class="fas fa-map-marker-alt"></i>
                    <div class="history-location-info">
                        <div class="history-location-name">${WeatherHistory._encodeHTML(item.location.name)}</div>
                        <div class="history-location-country">${WeatherHistory._encodeHTML(item.location.country)}</div>
                    </div>
                </div>
                <div class="history-weather">
                    <div class="history-temp">${temp}</div>
                    <div class="history-condition">
                        <img src="https:${item.current.condition.icon}" alt="${WeatherHistory._encodeHTML(item.current.condition.text)}" class="history-icon">
                        <span>${WeatherHistory._encodeHTML(item.current.condition.text)}</span>
                    </div>
                </div>
                <div class="history-time">
                    <i class="fas fa-clock"></i>
                    <span>${timeAgo}</span>
                </div>
            </div>
            <button class="history-remove" onclick="event.stopPropagation(); WeatherHistory.removeHistoryItem(${item.id})" title="Remove from history">
                <i class="fas fa-times"></i>
            </button>
        `;

        return element;
    },

    // Format time ago string
    _formatTimeAgo: (date) => {
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (days > 0) {
            return days === 1 ? '1 day ago' : `${days} days ago`;
        } else if (hours > 0) {
            return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
        } else if (minutes > 0) {
            return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
        } else {
            return 'Just now';
        }
    },

    // Get history statistics
    getStatistics: () => {
        const stats = {
            totalLocations: WeatherHistory._historyData.length,
            countries: new Set(WeatherHistory._historyData.map(item => item.location.country)).size,
            averageTemp: 0,
            mostRecentSearch: null,
            oldestSearch: null
        };

        if (WeatherHistory._historyData.length > 0) {
            const totalTemp = WeatherHistory._historyData.reduce((sum, item) => sum + item.current.temp_c, 0);
            stats.averageTemp = Math.round(totalTemp / WeatherHistory._historyData.length);
            
            const sortedByTime = [...WeatherHistory._historyData].sort((a, b) => 
                new Date(b.timestamp) - new Date(a.timestamp)
            );
            stats.mostRecentSearch = sortedByTime[0];
            stats.oldestSearch = sortedByTime[sortedByTime.length - 1];
        }

        return stats;
    }
};

// Make WeatherHistory globally available for browser scripts
if (typeof window !== 'undefined') {
    window.WeatherHistory = WeatherHistory;
}

// Export for use in other modules (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { WeatherHistory };
}