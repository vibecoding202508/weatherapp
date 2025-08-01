// Simple Test Framework for Weather App
class TestFramework {
    constructor() {
        this.tests = [];
        this.results = {
            passed: 0,
            failed: 0,
            total: 0
        };
        this.currentSuite = null;
    }

    // Create a test suite
    describe(suiteName, suiteFunction) {
        this.currentSuite = suiteName;
        console.group(`📋 ${suiteName}`);
        suiteFunction();
        console.groupEnd();
        this.currentSuite = null;
    }

    // Create a test case
    it(testName, testFunction) {
        const fullTestName = this.currentSuite ? `${this.currentSuite} > ${testName}` : testName;
        
        try {
            // Run beforeEach function if it exists
            if (this.beforeEachFn) {
                this.beforeEachFn();
            }
            
            // Handle both sync and async test functions
            const result = testFunction();
            if (result && typeof result.then === 'function') {
                // For async tests, increment total immediately but handle results in promise
                this.results.total++;
                
                result.then(() => {
                    this.results.passed++;
                    console.log(`✅ ${testName}`);
                    // Display message in test results if available
                    if (typeof window.displayMessage === 'function') {
                        window.displayMessage(`✅ ${testName}`, 'success');
                    }
                }).catch((error) => {
                    this.results.failed++;
                    console.error(`❌ ${testName}`, error);
                    // Display message in test results if available
                    if (typeof window.displayMessage === 'function') {
                        window.displayMessage(`❌ ${testName}: ${error.message}`, 'error');
                    }
                });
                
                // Run afterEach function if it exists
                if (this.afterEachFn) {
                    this.afterEachFn();
                }
                
                return; // Exit early for async tests
            }
            
            // For sync tests, handle normally
            this.results.passed++;
            this.results.total++;
            console.log(`✅ ${testName}`);
            
            // Display message in test results if available
            if (typeof window.displayMessage === 'function') {
                window.displayMessage(`✅ ${testName}`, 'success');
            }
            
            // Run afterEach function if it exists
            if (this.afterEachFn) {
                this.afterEachFn();
            }
            
        } catch (error) {
            this.results.failed++;
            this.results.total++;
            console.error(`❌ ${testName}`, error);
            
            // Display message in test results if available
            if (typeof window.displayMessage === 'function') {
                window.displayMessage(`❌ ${testName}: ${error.message}`, 'error');
            }
            
            // Run afterEach function if it exists
            if (this.afterEachFn) {
                this.afterEachFn();
            }
        }
    }

    // Assertion methods
    expect(actual) {
        const assertions = {
            toBe: (expected) => {
                if (actual !== expected) {
                    throw new Error(`Expected ${actual} to be ${expected}`);
                }
            },
            
            toEqual: (expected) => {
                if (JSON.stringify(actual) !== JSON.stringify(expected)) {
                    throw new Error(`Expected ${JSON.stringify(actual)} to equal ${JSON.stringify(expected)}`);
                }
            },
            
            toBeGreaterThan: (expected) => {
                if (actual <= expected) {
                    throw new Error(`Expected ${actual} to be greater than ${expected}`);
                }
            },
            
            toBeLessThan: (expected) => {
                if (actual >= expected) {
                    throw new Error(`Expected ${actual} to be less than ${expected}`);
                }
            },
            
            toContain: (expected) => {
                if (!actual.includes(expected)) {
                    throw new Error(`Expected ${actual} to contain ${expected}`);
                }
            },
            
            toBeTruthy: () => {
                if (!actual) {
                    throw new Error(`Expected ${actual} to be truthy`);
                }
            },
            
            toBeFalsy: () => {
                if (actual) {
                    throw new Error(`Expected ${actual} to be falsy`);
                }
            },
            
            toThrow: () => {
                let threw = false;
                try {
                    actual();
                } catch (error) {
                    threw = true;
                }
                if (!threw) {
                    throw new Error('Expected function to throw an error');
                }
            },
            
            toHaveProperty: (property) => {
                if (!(property in actual)) {
                    throw new Error(`Expected object to have property ${property}`);
                }
            },
            
            toBeInstanceOf: (constructor) => {
                if (!(actual instanceof constructor)) {
                    throw new Error(`Expected ${actual} to be instance of ${constructor.name}`);
                }
            },
            
            toHaveBeenCalled: () => {
                if (!actual._isMockFunction) {
                    throw new Error(`Expected function to be a mock function`);
                }
                if (actual._calls.length === 0) {
                    throw new Error(`Expected mock function to have been called, but it was not called`);
                }
            },
            
            toHaveBeenCalledTimes: (times) => {
                if (!actual._isMockFunction) {
                    throw new Error(`Expected function to be a mock function`);
                }
                if (actual._calls.length !== times) {
                    throw new Error(`Expected mock function to have been called ${times} times, but it was called ${actual._calls.length} times`);
                }
            },
            
            toHaveBeenCalledWith: (...expectedArgs) => {
                if (!actual._isMockFunction) {
                    throw new Error(`Expected function to be a mock function`);
                }
                if (actual._calls.length === 0) {
                    throw new Error(`Expected mock function to have been called with arguments, but it was not called`);
                }
                
                // Check if any call matches the expected arguments
                const callMatches = actual._calls.some(call => {
                    if (call.length !== expectedArgs.length) return false;
                    
                    return call.every((arg, index) => {
                        const expected = expectedArgs[index];
                        // Handle expect.stringContaining
                        if (expected && expected._isStringContaining) {
                            return typeof arg === 'string' && arg.includes(expected._substring);
                        }
                        return JSON.stringify(arg) === JSON.stringify(expected);
                    });
                });
                
                if (!callMatches) {
                    throw new Error(`Expected mock function to have been called with ${JSON.stringify(expectedArgs)}, but it was called with: ${JSON.stringify(actual._calls)}`);
                }
            }
        };

        // Add .not property for negated assertions
        assertions.not = {
            toBe: (expected) => {
                if (actual === expected) {
                    throw new Error(`Expected ${actual} not to be ${expected}`);
                }
            },
            
            toEqual: (expected) => {
                if (JSON.stringify(actual) === JSON.stringify(expected)) {
                    throw new Error(`Expected ${JSON.stringify(actual)} not to equal ${JSON.stringify(expected)}`);
                }
            },
            
            toContain: (expected) => {
                if (actual.includes(expected)) {
                    throw new Error(`Expected ${actual} not to contain ${expected}`);
                }
            },
            
            toBeTruthy: () => {
                if (actual) {
                    throw new Error(`Expected ${actual} not to be truthy`);
                }
            },
            
            toBeFalsy: () => {
                if (!actual) {
                    throw new Error(`Expected ${actual} not to be falsy`);
                }
            },
            
            toThrow: () => {
                let threw = false;
                try {
                    actual();
                } catch (error) {
                    threw = true;
                }
                if (threw) {
                    throw new Error('Expected function not to throw an error');
                }
            },
            
            toHaveProperty: (property) => {
                if (property in actual) {
                    throw new Error(`Expected object not to have property ${property}`);
                }
            },
            
            toHaveBeenCalled: () => {
                if (!actual._isMockFunction) {
                    throw new Error(`Expected function to be a mock function`);
                }
                if (actual._calls.length > 0) {
                    throw new Error(`Expected mock function not to have been called, but it was called ${actual._calls.length} times`);
                }
            }
        };

        return assertions;
    }

    // Mock functions
    mock(object, method, implementation) {
        const original = object[method];
        object[method] = implementation || (() => {});
        
        return {
            restore: () => {
                object[method] = original;
            },
            calls: []
        };
    }

    // Setup and teardown
    beforeEach(fn) {
        this.beforeEachFn = fn;
    }

    afterEach(fn) {
        this.afterEachFn = fn;
    }

    // Run all tests and display results
    displayResults() {
        console.log('\n' + '='.repeat(50));
        console.log('🧪 TEST RESULTS');
        console.log('='.repeat(50));
        console.log(`✅ Passed: ${this.results.passed}`);
        console.log(`❌ Failed: ${this.results.failed}`);
        console.log(`📊 Total: ${this.results.total}`);
        console.log(`📈 Success Rate: ${((this.results.passed / this.results.total) * 100).toFixed(1)}%`);
        
        // Use the enhanced displayTestResults function from test-runner.html if available
        if (typeof window.displayTestResults === 'function') {
            window.displayTestResults(this.results);
        } else {
            // Fallback to legacy method
            this.createResultsDOM();
        }
    }

    createResultsDOM() {
        const resultsContainer = document.getElementById('test-results');
        if (!resultsContainer) return;

        const successRate = (this.results.passed / this.results.total) * 100;
        const statusColor = successRate === 100 ? '#27ae60' : successRate >= 80 ? '#f39c12' : '#e74c3c';

        resultsContainer.innerHTML = `
            <div class="test-summary">
                <h2>🧪 Test Results</h2>
                <div class="test-stats">
                    <div class="stat passed">
                        <span class="number">${this.results.passed}</span>
                        <span class="label">Passed</span>
                    </div>
                    <div class="stat failed">
                        <span class="number">${this.results.failed}</span>
                        <span class="label">Failed</span>
                    </div>
                    <div class="stat total">
                        <span class="number">${this.results.total}</span>
                        <span class="label">Total</span>
                    </div>
                </div>
                <div class="success-rate" style="color: ${statusColor}">
                    Success Rate: ${successRate.toFixed(1)}%
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${successRate}%; background-color: ${statusColor}"></div>
                </div>
            </div>
        `;
    }
}

// Create global test framework instance
const testFramework = new TestFramework();

// Export global functions for easier testing
window.describe = testFramework.describe.bind(testFramework);
window.it = testFramework.it.bind(testFramework);
window.expect = testFramework.expect.bind(testFramework);
window.beforeEach = testFramework.beforeEach.bind(testFramework);
window.afterEach = testFramework.afterEach.bind(testFramework);

// Add expect matchers
window.expect.stringContaining = (substring) => {
    return {
        _isStringContaining: true,
        _substring: substring,
        toString: () => `StringContaining(${substring})`
    };
};

// Simple mock function implementation
window.jest = {
    fn: (implementation) => {
        const mockFn = implementation || (() => {});
        const actualMockFn = (...args) => {
            actualMockFn._calls.push(args);
            return mockFn.apply(this, args);
        };
        actualMockFn._isMockFunction = true;
        actualMockFn._calls = [];
        actualMockFn.mockReturnValue = (value) => {
            mockFn = () => value;
            return actualMockFn;
        };
        actualMockFn.mockImplementation = (impl) => {
            mockFn = impl;
            return actualMockFn;
        };
        return actualMockFn;
    }
};

// Export framework for advanced usage
window.TestFramework = testFramework;

// Ensure TestFramework is available globally
if (typeof window.TestFramework === 'undefined') {
    window.TestFramework = testFramework;
}

console.log('🔧 TestFramework initialized and available globally');
console.log('🔧 TestFramework type:', typeof window.TestFramework);
console.log('🔧 TestFramework has displayResults:', !!(window.TestFramework && window.TestFramework.displayResults));