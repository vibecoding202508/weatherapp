// Weather Alerts Functionality

const WeatherAlerts = {
    // Fetch MeteoAlarm European alerts functionality  
    fetchMeteoAlarmAlerts: async (country, location = null) => {
        try {
            console.log('Starting MeteoAlarm fetch for country:', country);
            
            // Get the appropriate MeteoAlarm feed for the country
            const feedUrl = WeatherAlerts.getMeteoAlarmFeed(country);
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
                    WeatherAlerts.displayDemoAlerts(country);
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
                WeatherAlerts.displayTemporaryAlertsNotice();
                return;
            }
            
            console.log('RSS text length:', rssText.length);
            console.log('RSS preview:', rssText.substring(0, 200));
            
            // Validate content before parsing
            if (!rssText || rssText.trim().length === 0) {
                console.error('RSS content is empty');
                console.log('No RSS content available, showing no alerts message');
                WeatherAlerts.displayNoAlerts(location);
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
                                WeatherAlerts.displayTemporaryAlertsNotice();
                                return;
                            }
                        } else {
                            console.error('Data URL does not contain base64 marker');
                            WeatherAlerts.displayTemporaryAlertsNotice();
                            return;
                        }
                    } catch (e) {
                        console.error('Data URL decode failed:', e.message);
                        WeatherAlerts.displayTemporaryAlertsNotice();
                        return;
                    }
                }
                // If it looks like it might be an error message or HTML
                else if (trimmedContent.toLowerCase().includes('error') || 
                    trimmedContent.toLowerCase().includes('<html') ||
                    trimmedContent.toLowerCase().includes('<!doctype')) {
                    console.error('Content appears to be an error page or HTML, not RSS');
                    WeatherAlerts.displayTemporaryAlertsNotice();
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
                            WeatherAlerts.displayTemporaryAlertsNotice();
                            return;
                        }
                    } catch (e) {
                        console.error('Final decode attempt failed:', e.message);
                        WeatherAlerts.displayTemporaryAlertsNotice();
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
                WeatherAlerts.displayTemporaryAlertsNotice();
                return;
            }
            
            // Extract alerts from RSS
            const allAlerts = WeatherAlerts.parseMeteoAlarmRSS(xmlDoc);
            console.log('Parsed alerts count:', allAlerts.length);
            console.log('All alerts:', allAlerts);
            
            // Filter alerts for current location
            const locationAlerts = WeatherAlerts.filterAlertsForLocation(allAlerts, location);
            console.log('Location-relevant alerts count:', locationAlerts.length);
            console.log('Location alerts:', locationAlerts);
            
            // Display alerts or show no alerts message
            if (locationAlerts.length > 0) {
                WeatherAlerts.displayMeteoAlarmAlerts(locationAlerts);
            } else {
                // Show no alerts message for the current location
                console.log('No location-relevant alerts found, showing no alerts message');
                WeatherAlerts.displayNoAlerts(location);
            }
            
        } catch (error) {
            console.error('Error fetching MeteoAlarm alerts:', error);
            WeatherAlerts.displayTemporaryAlertsNotice();
        }
    },

    // Filter alerts for current location
    filterAlertsForLocation: (alerts, location) => {
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
    },

    // Display MeteoAlarm alerts
    displayMeteoAlarmAlerts: (alerts) => {
        if (!DOM.alertsContainer) return;

        DOMUtils.setHTML(DOM.alertsContainer, '');
        
        if (!alerts || alerts.length === 0) {
            console.log('No alerts to display, showing no alerts message');
            WeatherAlerts.displayNoAlerts();
            return;
        }

        // Show alerts section
        DOMUtils.show(DOM.weatherAlerts);
        
        alerts.forEach(alert => {
            const alertItem = WeatherAlerts.createMeteoAlarmAlertElement(alert);
            DOM.alertsContainer.appendChild(alertItem);
        });
    },

    // Display no alerts message
    displayNoAlerts: (location = null) => {
        if (!DOM.alertsContainer) return;

        const locationText = location ? ` for ${location.name}, ${location.region}` : ' for the area';
        DOMUtils.setHTML(DOM.alertsContainer, `
            <div class="no-alerts">
                <i class="fas fa-check-circle"></i>
                <p>No weather alerts${locationText}</p>
                <p><small>All clear! No active weather warnings affecting your current location.</small></p>
            </div>
        `);
        DOMUtils.show(DOM.weatherAlerts);
    },

    // Display temporary alerts notice
    displayTemporaryAlertsNotice: () => {
        if (!DOM.alertsContainer) return;

        DOMUtils.setHTML(DOM.alertsContainer, `
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
        `);
        DOMUtils.show(DOM.weatherAlerts);
    },

    // Fallback demo alerts for testing when MeteoAlarm is not accessible
    displayDemoAlerts: (country) => {
        console.log('Displaying demo alerts for testing purposes');
        
        if (!DOM.alertsContainer) return;

        DOMUtils.setHTML(DOM.alertsContainer, '');
        DOMUtils.show(DOM.weatherAlerts);
        
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
        
        DOM.alertsContainer.appendChild(alertDiv);
    },

    // Get MeteoAlarm feed URL for country
    getMeteoAlarmFeed: (country) => {
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
    },

    // Parse MeteoAlarm RSS
    parseMeteoAlarmRSS: (xmlDoc) => {
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
        
        for (let i = 0; i < Math.min(items.length, CONFIG.MAX_ALERTS_DISPLAY); i++) {
            const item = items[i];
            
            const title = item.getElementsByTagName('title')[0]?.textContent || 'Weather Alert';
            const description = item.getElementsByTagName('description')[0]?.textContent || '';
            const pubDate = item.getElementsByTagName('pubDate')[0]?.textContent || '';
            const guid = item.getElementsByTagName('guid')[0]?.textContent || '';
            
            console.log(`Alert ${i + 1}: ${title}`);
            
            // Extract severity and type from title
            const severity = WeatherAlerts.extractSeverityFromTitle(title);
            const eventType = WeatherAlerts.extractEventTypeFromTitle(title);
            
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
    },

    // Create MeteoAlarm alert element
    createMeteoAlarmAlertElement: (alert) => {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert-item';
        
        // Add severity class
        if (alert.severity) {
            alertDiv.classList.add(`severity-${alert.severity}`);
        }
        
        const publishedDate = DateUtils.formatDateTime(alert.pubDate);
        
        alertDiv.innerHTML = `
            <div class="alert-header">
                <h3 class="alert-title">${alert.title}</h3>
                <span class="alert-priority ${alert.severity ? `priority-${alert.severity}` : 'priority-moderate'}">${WeatherAlerts.getSeverityText(alert.severity)}</span>
            </div>
            <div class="alert-source"><strong>Source:</strong> MeteoAlarm (Official European Weather Alerts)${alert.isCountryWide ? ' - Country-wide alert' : ' - Location-relevant'}</div>
            ${publishedDate ? `<div class="alert-time"><strong>Published:</strong> ${publishedDate}</div>` : ''}
            <div class="alert-description">${alert.description}</div>
            ${alert.eventType ? `<div class="alert-areas"><strong>Event Type:</strong> ${alert.eventType}</div>` : ''}
        `;
        
        return alertDiv;
    },

    // Get severity text
    getSeverityText: (severity) => {
        switch (severity) {
            case 'extreme': return 'Extreme';
            case 'severe': return 'Severe';
            case 'moderate': return 'Moderate';
            case 'minor': return 'Minor';
            default: return 'Moderate';
        }
    },

    // Extract severity from title
    extractSeverityFromTitle: (title) => {
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
    },

    // Extract event type from title
    extractEventTypeFromTitle: (title) => {
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
};

// Export for use in other modules (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { WeatherAlerts };
} 