# Weather App

A simple, clean weather application that displays current weather conditions and a 3-day forecast with automatic location detection.

## Features

- **Current Weather Display**: Shows temperature, weather conditions, humidity, wind speed, and visibility
- **3-Day Forecast**: Displays upcoming weather with high/low temperatures and rain probability
- **Automatic Location Detection**: Uses browser geolocation to get your current position
- **Responsive Design**: Works great on desktop and mobile devices
- **Clean UI**: Modern, user-friendly interface with smooth animations

## Setup Instructions

### 1. Get a Free API Key

1. Visit [WeatherAPI.com](https://www.weatherapi.com/signup.aspx)
2. Sign up for a free account
3. Copy your API key from the dashboard

### 2. Configure the App

1. Open `script.js` in a text editor
2. Replace `YOUR_API_KEY_HERE` with your actual API key:
   ```javascript
   const API_KEY = 'your_actual_api_key_here';
   ```

### 3. Run the App

Since this app uses browser geolocation and makes API calls, it needs to be served over HTTP(S):

#### Option 1: Simple Python Server
```bash
cd weather-app
python3 -m http.server 8000
```
Then open http://localhost:8000 in your browser

#### Option 2: Node.js Live Server
```bash
npm install -g live-server
cd weather-app
live-server
```

#### Option 3: Use any local web server of your choice

## Browser Compatibility

- Chrome 50+
- Firefox 55+
- Safari 11+
- Edge 79+

The app requires:
- Geolocation API support
- Fetch API support
- Modern CSS features (flexbox, grid)

## API Usage

This app uses the free tier of WeatherAPI.com which includes:
- 1 million calls per month
- Current weather data
- 3-day forecast
- Weather alerts (not used in this app)

## Troubleshooting

### "Please allow location access" error
- Make sure you click "Allow" when prompted for location access
- Check that location services are enabled in your browser settings

### "Failed to fetch weather data" error
- Verify your API key is correct
- Check your internet connection
- Ensure you're serving the app over HTTP(S), not opening the file directly

### Weather data not updating
- The app automatically refreshes data every 10 minutes
- You can manually refresh by clicking "Try Again" if there's an error

## File Structure

```
weather-app/
├── index.html      # Main HTML structure
├── styles.css      # CSS styling and responsive design
├── script.js       # JavaScript functionality
└── README.md       # This file
```

## Customization

Feel free to customize the app:
- Modify colors in `styles.css`
- Add more weather details in `script.js`
- Change the forecast duration (API supports up to 10 days)
- Add weather alerts or air quality information

## License

This project is open source and available under the MIT License.