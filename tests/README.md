# Weather App Test Suite

This comprehensive test suite provides unit and integration tests for the Weather App, covering all modules and functionality.

## 🧪 Test Structure

### Test Framework
- **Custom Test Framework**: `test-framework.js` - A browser-based testing framework with Jest-like syntax
- **Test Runner**: `test-runner.html` - Web interface for running and viewing test results
- **Mock Data**: `test-data.js` - Mock weather data, DOM elements, and API responses
- **Test Utilities**: Helper functions for setting up mocks and test environments

### Test Files

#### 1. **Utility Functions Tests** (`utils.test.js`)
- **UIUtils**: Loading states, error display, content visibility
- **DateUtils**: Date formatting, day names, date/time parsing
- **MathUtils**: Temperature rounding, random number generation
- **StringUtils**: Text capitalization, truncation
- **ValidationUtils**: API key validation, location validation, coordinate validation
- **VisibilityUtils**: Visibility analysis, weather context, formatting

#### 2. **DOM and State Tests** (`dom-state.test.js`)
- **DOMUtils**: Element manipulation, class management, text/HTML setting
- **DOM References**: Element availability, graceful handling of missing elements
- **StateManager**: Current location state, weather data state, loading/error states

#### 3. **Weather API Tests** (`weather-api.test.js`)
- **API Key Validation**: Valid/invalid API key handling
- **Geolocation**: Permission handling, error scenarios, coordinate validation
- **Weather Data Fetching**: Successful responses, error handling, network failures
- **Location Search**: Valid/invalid locations, API error responses
- **Auto Refresh**: Interval setup, conditional refreshing

#### 4. **Search and Dark Mode Tests** (`search-darkmode.test.js`)
- **Search Functionality**: Location search, current location toggle, input validation
- **Keyboard Interaction**: Enter key handling, event listeners
- **Dark Mode**: Theme toggling, preference persistence, background reapplication
- **Integration**: Dark mode with weather backgrounds, search state management

#### 5. **Weather Features Tests** (`weather-features.test.js`)
- **Weather Display**: Data rendering, forecast display, UI updates, background colors
- **Weather Alerts**: RSS parsing, alert filtering, severity extraction, display management
- **Weather Animations**: Animation application, particle effects, state management
- **Visibility Display**: Analysis integration, toggle functionality

#### 6. **App Integration Tests** (`app-integration.test.js`)
- **App Initialization**: Module coordination, error handling, API key validation
- **Auto Refresh**: Interval management, conditional refreshing
- **Error Recovery**: Global error handling, app restart functionality
- **End-to-End Flows**: Complete user interactions, state consistency
- **Performance**: Rapid API calls, memory cleanup, edge case handling

## 🚀 Running Tests

### Option 1: Web Interface (Recommended)
1. Open `tests/test-runner.html` in your web browser
2. Click "Run All Tests" to execute the complete test suite
3. Use individual suite buttons to run specific test categories
4. View results in real-time with detailed error information

### Option 2: Individual Test Suites
- **Utils Tests**: Click "Run Utils Tests"
- **DOM Tests**: Click "Run DOM Tests"
- **API Tests**: Click "Run API Tests"
- **Integration Tests**: Click "Run Integration Tests"

### Test Controls
- **Run All Tests**: Execute the complete test suite
- **Unit Tests Only**: Run only unit tests (excludes integration tests)
- **Integration Tests Only**: Run only integration tests
- **Clear Results**: Reset test output
- **Show/Hide Console**: Toggle console output visibility

## 📊 Test Coverage

### Unit Tests (200+ tests)
- ✅ All utility functions
- ✅ DOM manipulation
- ✅ State management
- ✅ API functionality
- ✅ Search features
- ✅ Dark mode
- ✅ Weather display
- ✅ Alert system
- ✅ Animations
- ✅ Visibility analysis

### Integration Tests (50+ tests)
- ✅ Module initialization
- ✅ Complete user flows
- ✅ Error recovery
- ✅ State consistency
- ✅ Performance scenarios
- ✅ Edge case handling

### Mock Coverage
- ✅ DOM elements and interactions
- ✅ API responses (success/error)
- ✅ Geolocation API
- ✅ LocalStorage
- ✅ Network requests
- ✅ Weather data

## 🔧 Test Features

### Assertion Methods
```javascript
expect(value).toBe(expected)
expect(value).toEqual(expected)
expect(value).toBeTruthy()
expect(value).toBeFalsy()
expect(value).toContain(substring)
expect(array).toHaveLength(number)
expect(number).toBeGreaterThan(value)
expect(string).toMatch(regex)
expect(fn).toThrow()
expect(mockFn).toHaveBeenCalled()
```

### Mock Functions
```javascript
const mockFn = TestRunner.fn()
const spy = TestRunner.spyOn(object, 'method')
mockFn.mockReturnValue(value)
mockFn.mockImplementation(fn)
```

### Test Structure
```javascript
describe('Module Name', () => {
    beforeEach(() => {
        // Setup before each test
    });
    
    afterEach(() => {
        // Cleanup after each test
    });
    
    it('should do something specific', () => {
        // Test implementation
        expect(result).toBe(expected);
    });
});
```

## 🎯 Test Scenarios

### Success Scenarios
- Valid API responses
- Successful geolocation
- Correct data parsing
- Proper UI updates
- State synchronization

### Error Scenarios
- Invalid API keys
- Network failures
- Geolocation denial
- Malformed data
- Missing DOM elements

### Edge Cases
- Empty inputs
- Special characters
- Rapid user actions
- Memory constraints
- Browser compatibility

## 📈 Test Metrics

The test suite provides detailed metrics:
- **Total Tests**: Number of tests executed
- **Passed Tests**: Successfully completed tests
- **Failed Tests**: Tests with errors
- **Success Rate**: Percentage of passing tests
- **Execution Time**: Per test and total duration

## 🔍 Debugging Tests

### Console Output
- Enable console output to see detailed execution logs
- Error messages include stack traces and context
- Mock function call tracking

### Test Isolation
- Each test runs in isolation with fresh mocks
- State is reset between tests
- No test interdependencies

### Error Reporting
- Detailed error messages with expected vs actual values
- Context information for failed assertions
- Stack traces for debugging

## 🛠️ Extending Tests

### Adding New Tests
1. Create test file in `tests/` directory
2. Include file in `test-runner.html`
3. Use existing mock utilities from `test-data.js`
4. Follow naming convention: `module-name.test.js`

### Mock Helpers
```javascript
// Setup DOM mocks
const mockElements = TestUtils.setupDOMMocks();

// Setup API mocks
const mockFetch = MockAPI.mockFetchSuccess(data);

// Setup geolocation mocks
const mockGeolocation = TestUtils.setupGeolocationMocks();

// Reset all mocks
TestUtils.resetMocks();
```

## 📋 Test Checklist

Before deploying:
- ✅ All tests pass
- ✅ Coverage includes new features
- ✅ Integration tests verify workflows
- ✅ Error scenarios are tested
- ✅ Performance is acceptable
- ✅ No memory leaks detected

## 🤝 Contributing

When adding new features:
1. Write tests first (TDD approach)
2. Ensure all existing tests pass
3. Add integration tests for new workflows
4. Update mock data if needed
5. Document test scenarios

## 📝 Notes

- Tests run in browser environment (no Node.js required)
- Mock framework provides Jest-like experience
- All async operations are properly tested
- State management ensures test isolation
- Performance tests validate app responsiveness

---

The test suite ensures the Weather App is robust, reliable, and maintainable. Run tests frequently during development and before any deployment.