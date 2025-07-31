# Weather App Test Suite

This directory contains a comprehensive test suite for the Weather App with custom test framework and extensive coverage.

## 🧪 Test Structure

### Test Framework (`test-framework.js`)
- Custom lightweight testing framework built for browser testing
- Provides `describe`, `it`, `expect` functions similar to Jest/Mocha
- Includes assertion methods: `toBe`, `toEqual`, `toContain`, `toBeTruthy`, etc.
- Visual test results with progress bars and statistics
- Mock functions and setup/teardown support

### Test Data (`test-data.js`)
- Mock weather API responses for testing
- Sample data for different weather conditions (clear, foggy, high UV)
- Mock DOM elements and browser APIs
- Utility functions for creating test environments

### Test Suites

#### 1. Utils Tests (`utils.test.js`)
- **Visibility Analysis**: Tests for all visibility categories and weather contexts
- **Math Utils**: Temperature rounding, random number generation
- **Date Utils**: Date formatting, day name generation
- **String Utils**: Text manipulation and truncation
- **Validation Utils**: API key, location, and coordinate validation
- **DOM Utils**: Element manipulation and CSS class handling
- **UI Utils**: Loading states, error displays, content visibility

#### 2. Weather Display Tests (`weather-display.test.js`)
- **Data Display**: Correct rendering of weather information
- **UV Warnings**: High/low UV index handling
- **Temperature Updates**: Dynamic temperature changes
- **Location Updates**: Location information display
- **Visibility Display**: Enhanced visibility analysis integration
- **Clear Functionality**: Proper cleanup of displayed data
- **Error Handling**: Graceful handling of missing elements

#### 3. Weather API Tests (`weather-api.test.js`)
- **API Key Validation**: Valid/invalid key handling
- **Successful Requests**: Proper data fetching and processing
- **Error Handling**: Network errors, API errors, invalid responses
- **Location Search**: City/country search functionality
- **Geolocation**: GPS coordinate handling and permissions
- **Data Refresh**: Cache management and data updates
- **Integration Flow**: Complete API → State → Display workflow

#### 4. Integration Tests (`integration.test.js`)
- **Complete Workflows**: End-to-end user interactions
- **App Initialization**: Startup sequence with geolocation
- **Search Workflows**: User input → API → display cycle
- **Error Recovery**: App restart after errors
- **Dark Mode**: Theme switching and persistence
- **Visibility Features**: Toggle functionality and interactions
- **State Management**: Data persistence across operations

## 🚀 Running Tests

### Option 1: Test Runner (Recommended)
1. Open `test-runner.html` in your browser
2. Click "Run All Tests" for complete suite
3. Use individual buttons for specific test categories
4. View results in real-time with visual feedback

### Option 2: Browser Console
1. Open browser developer tools
2. Load test files in order:
   ```html
   <script src="test-framework.js"></script>
   <script src="test-data.js"></script>
   <script src="utils.test.js"></script>
   <!-- etc. -->
   ```
3. Call `TestFramework.displayResults()` to see summary

## 📊 Test Coverage

### Core Functionality
- ✅ Weather data fetching and parsing
- ✅ Temperature and weather condition display
- ✅ Location services and search
- ✅ UV index warnings
- ✅ Enhanced visibility analysis
- ✅ 3-day forecast display
- ✅ Error handling and user feedback

### Advanced Features
- ✅ Dark mode functionality
- ✅ Responsive design elements
- ✅ Local storage management
- ✅ Weather-based background colors
- ✅ Interactive visibility details
- ✅ Weather alerts integration

### Edge Cases
- ✅ Network failures
- ✅ Invalid API responses
- ✅ Geolocation permission denial
- ✅ Missing DOM elements
- ✅ Invalid user inputs
- ✅ API key validation

## 🔧 Test Framework Features

### Assertions
```javascript
expect(actual).toBe(expected)
expect(actual).toEqual(expected)
expect(actual).toContain(substring)
expect(actual).toBeTruthy()
expect(actual).toBeFalsy()
expect(fn).toThrow()
expect(obj).toHaveProperty('prop')
expect(obj).toBeInstanceOf(Constructor)
```

### Mocking
```javascript
const mockFn = jest.fn();
const mockFetch = jest.fn(() => Promise.resolve({...}));
```

### Setup/Teardown
```javascript
beforeEach(() => {
    // Setup before each test
});

afterEach(() => {
    // Cleanup after each test
});
```

## 📈 Expected Results

A well-functioning weather app should achieve:
- **90%+ Pass Rate**: Most tests should pass consistently
- **Fast Execution**: Complete suite under 5 seconds
- **No Console Errors**: Clean execution without uncaught exceptions
- **Consistent Results**: Same results across different browsers

## 🐛 Debugging Failed Tests

1. **Check Console Output**: Detailed error messages and stack traces
2. **Verify Mock Data**: Ensure test data matches expected format
3. **DOM Element Availability**: Confirm required elements exist
4. **API Dependencies**: Check if external services are mocked properly
5. **Timing Issues**: Add delays for asynchronous operations

## 🔄 Extending Tests

To add new tests:

1. **Create Test File**: Follow naming pattern `*.test.js`
2. **Use Framework**: Leverage existing `describe` and `it` structure
3. **Add Mock Data**: Extend `TestData` object as needed
4. **Update Runner**: Add new test file to `test-runner.html`
5. **Document Coverage**: Update this README with new test areas

## 🌟 Benefits

- **Catch Regressions**: Detect broken functionality early
- **Document Behavior**: Tests serve as living documentation
- **Improve Quality**: Encourage better code design
- **Enable Refactoring**: Safely modify code with confidence
- **Onboard Developers**: Understand expected behavior quickly

This comprehensive test suite ensures the Weather App maintains high quality and reliability across all features and user interactions.