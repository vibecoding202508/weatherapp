# 🌤️ Advanced Weather App

A feature-rich, modern weather application with dynamic animations, dark mode, location search, and comprehensive weather alerts. Built with a modular JavaScript architecture for enhanced maintainability and user experience.

## ✨ Features

### 🌍 **Weather Data**
- **Current Weather**: Temperature, feels-like, humidity, wind speed, visibility, and weather conditions
- **3-Day Forecast**: Detailed daily forecasts with weather icons and temperature ranges
- **Location Services**: Automatic geolocation detection with manual search capability
- **Global Coverage**: Search weather for any city worldwide

### 🎨 **User Experience**
- **Dark/Light Mode**: Toggle between themes with persistent preferences
- **Dynamic Animations**: Weather-based animations (rain particles, snow effects, sunny glow, storm flashes)
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Search Functionality**: Real-time city search with autocomplete-style experience
- **Loading States**: Smooth loading animations and informative error messages

### ⚠️ **Weather Alerts**
- **European Alerts**: Integration with MeteoAlarm for severe weather warnings
- **Severity Levels**: Color-coded alerts (Extreme, Severe, Moderate, Minor)
- **Location-Based**: Filtered alerts relevant to your current location
- **Multiple Languages**: UTF-8 support for international alert descriptions

### 🔧 **Technical Features**
- **Modular Architecture**: 11 focused JavaScript modules for maintainability
- **Error Handling**: Robust error handling with user-friendly messages
- **Performance**: Efficient API usage with data caching and refresh intervals
- **Modern Standards**: ES6 modules, proper state management, DOM validation

## 🚀 Quick Start

### 1. Get a Free API Key

1. Visit [WeatherAPI.com](https://www.weatherapi.com/signup.aspx)
2. Sign up for a free account (completely free tier available)
3. Copy your API key from the dashboard

### 2. Configure the App

1. Open `js/config.js` in a text editor
2. Replace the placeholder with your actual API key:
   ```javascript
   export const CONFIG = {
       WEATHER_API_KEY: 'your_actual_api_key_here', // Replace this
       // ... other config options
   };
   ```

### 3. Run the App

Since this app uses ES6 modules, geolocation, and API calls, it **must** be served over HTTP(S):

#### Option 1: Python Server (Recommended)
```bash
cd weather-app
python3 -m http.server 8080
```
Then open http://localhost:8080 in your browser

#### Option 2: Node.js Serve
```bash
npx serve -p 8080
# or if you have it installed globally
npm install -g serve
serve -p 8080
```

#### Option 3: Any Static Server
- Live Server (VS Code extension)
- Apache, nginx, or any web server
- GitHub Pages, Netlify, Vercel for deployment

### 4. Enjoy! 🎉

The app will automatically:
- Detect your location (with permission)
- Load current weather and forecast
- Apply appropriate animations based on conditions
- Check for weather alerts in your area

## 🌐 Browser Support

### Recommended Browsers
- **Chrome 80+** (Best experience)
- **Firefox 75+** (Full support)
- **Safari 13+** (Full support)
- **Edge 80+** (Full support)

### Required Features
- **ES6 Modules**: Native module support (all modern browsers)
- **Geolocation API**: For automatic location detection
- **Fetch API**: For weather data and alerts
- **Modern CSS**: Flexbox, CSS Grid, CSS Variables
- **Local Storage**: For dark mode preference persistence

## 🔗 API Integrations

### WeatherAPI.com (Primary Data)
**Free Tier Includes:**
- 1 million calls per month
- Current weather conditions
- 3-day weather forecast
- Location search and geocoding
- High-quality weather icons

### MeteoAlarm (Weather Alerts)
**European Weather Alerts:**
- Severe weather warnings for all EU countries
- Multiple severity levels and event types
- RSS/XML feeds with location filtering
- Free public service by European meteorological institutes

### CORS Proxy Services
**For reliable data fetching:**
- Multiple fallback proxy services
- Handles cross-origin requests
- UTF-8 encoding support for international content

## 🔧 Troubleshooting

### 🌍 Location Issues
- **"Please allow location access"**: Click "Allow" when prompted and ensure location services are enabled
- **Location not detected**: Use the search function to manually enter your city
- **Wrong location**: Clear browser cache and refresh, or use manual search

### 🔑 API Issues
- **"Invalid API key"**: Verify your WeatherAPI.com key is correctly set in `js/config.js`
- **"Failed to fetch weather data"**: Check internet connection and ensure serving over HTTP(S)
- **Rate limit errors**: Free tier allows 1M calls/month - should be sufficient for normal use

### 🚀 Loading Issues
- **App not loading**: Ensure you're serving via HTTP(S), not opening `index.html` directly
- **Module errors**: Check browser console for ES6 module support
- **Blank page**: Verify all files are present and check browser DevTools console

### ⚠️ Weather Alerts
- **No alerts showing**: Alerts are currently available for European locations only
- **Alert encoding issues**: The app handles UTF-8 encoding automatically
- **Alert not relevant**: Alerts are filtered by location keywords

### 💡 General Tips
- **Data refresh**: App automatically refreshes every 5 minutes
- **Manual refresh**: Click "Try Again" or refresh the browser page
- **Browser cache**: Clear cache if experiencing persistent issues
- **Debug mode**: Use `window.app` in browser console for manual controls

## 📁 Project Structure

```
weather-app/
├── index.html                    # Main HTML structure
├── styles.css                    # Complete CSS styling and themes
├── README.md                     # This documentation
├── js/                          # Modular JavaScript architecture
│   ├── README.md                #   Detailed module documentation
│   ├── config.js                #   Configuration and API keys
│   ├── dom.js                   #   DOM element references & validation
│   ├── state.js                 #   Application state management
│   ├── utils.js                 #   Utility functions & dark mode
│   ├── dark-mode.js             #   Theme switching functionality
│   ├── search.js                #   Location search & geolocation
│   ├── weather-api.js           #   WeatherAPI.com integration
│   ├── weather-display.js       #   UI updates & data rendering
│   ├── weather-animations.js    #   Dynamic weather animations
│   ├── weather-alerts.js        #   MeteoAlarm alerts integration
│   └── app.js                   #   Main application coordinator
└── (Additional files as needed)
```

### Module Dependencies
```
app.js (main coordinator)
├── config.js (configuration)
├── dom.js (DOM management)
├── state.js (state management)
├── utils.js (utilities & dark mode)
├── dark-mode.js (theme switching)
├── search.js (location search)
├── weather-api.js (API calls)
├── weather-display.js (UI updates)
├── weather-animations.js (animations)
└── weather-alerts.js (alert system)
```

## 🎨 Customization & Development

### Easy Customizations
- **Colors & Themes**: Modify CSS variables in `styles.css` for custom color schemes
- **Animations**: Add new weather animations in `weather-animations.js`
- **Forecast Duration**: Extend to 10 days (modify `weather-api.js` and `weather-display.js`)
- **Additional Weather Data**: Add UV index, air quality, pressure trends

### Advanced Development
- **New APIs**: Add weather providers by extending `weather-api.js`
- **Alert Sources**: Integrate additional weather alert services
- **Mobile Features**: Add PWA capabilities, offline mode, notifications
- **User Preferences**: Extend settings for units, refresh intervals, alert types

### Development Setup
```bash
# Clone or download the project
git clone <repository-url>
cd weather-app

# Install development tools (optional)
npm install -g live-server  # For live reloading during development

# Start development server
live-server --port=8080
```

## 🚀 Deployment Options

### Static Hosting (Recommended)
- **GitHub Pages**: Free hosting with automatic deployment
- **Netlify**: Drag & drop deployment with form handling
- **Vercel**: Git integration with preview deployments
- **Firebase Hosting**: Google's fast global CDN

### Traditional Hosting
- Any web server (Apache, nginx, IIS)
- Shared hosting providers
- VPS or dedicated servers
- CDN services

### Deployment Checklist
- ✅ Update API key in `js/config.js`
- ✅ Test on multiple devices and browsers
- ✅ Verify HTTPS for geolocation features
- ✅ Optimize images and assets if needed
- ✅ Set appropriate cache headers

## 🤝 Contributing

This modular architecture welcomes contributions:

1. **Find the Right Module**: Each feature has its own module
2. **Follow Conventions**: Use existing code style and patterns
3. **Test Thoroughly**: Verify changes across different browsers and devices
4. **Document Changes**: Update relevant README files
5. **Consider Dependencies**: Be mindful of module interdependencies

### Feature Requests & Bug Reports
- Use GitHub Issues for bug reports and feature requests
- Include browser version, steps to reproduce, and expected behavior
- Screenshots or console logs are helpful for debugging

## 📊 Performance & Analytics

### Performance Features
- **Efficient API Usage**: Automatic refresh intervals and caching
- **Lazy Loading**: Animations and alerts load only when needed
- **Optimized Rendering**: Minimal DOM manipulation and efficient updates
- **Responsive Images**: Weather icons are appropriately sized

### Privacy-First
- **No Tracking**: No analytics or user data collection
- **Local Storage Only**: Preferences stored locally in browser
- **API Privacy**: Weather data requests include no personal information

## 📜 License

This project is open source and available under the **MIT License**.

### What this means:
- ✅ **Free to use** for personal and commercial projects
- ✅ **Modify and distribute** as you see fit
- ✅ **No warranty** - use at your own risk
- ✅ **Attribution appreciated** but not required

---

**🌟 Enjoying the app? Consider giving it a star on GitHub!**

*Built with ❤️ using modern web technologies and best practices.*