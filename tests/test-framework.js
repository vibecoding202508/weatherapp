// Simple Test Framework for Browser Environment

class TestFramework {
    constructor() {
        this.tests = [];
        this.results = {
            passed: 0,
            failed: 0,
            total: 0
        };
        this.suites = {};
        this.currentSuite = null;
    }

    // Create a test suite
    describe(name, callback) {
        this.currentSuite = name;
        this.suites[name] = {
            tests: [],
            beforeEach: null,
            afterEach: null
        };
        callback();
        this.currentSuite = null;
    }

    // Add a test case
    it(description, testFunction) {
        const test = {
            suite: this.currentSuite,
            description,
            testFunction,
            passed: null,
            error: null
        };
        
        if (this.currentSuite) {
            this.suites[this.currentSuite].tests.push(test);
        }
        
        this.tests.push(test);
    }

    // Setup function to run before each test
    beforeEach(callback) {
        if (this.currentSuite) {
            this.suites[this.currentSuite].beforeEach = callback;
        }
    }

    // Cleanup function to run after each test
    afterEach(callback) {
        if (this.currentSuite) {
            this.suites[this.currentSuite].afterEach = callback;
        }
    }

    // Assertion methods
    expect(actual) {
        return {
            toBe: (expected) => {
                if (actual !== expected) {
                    throw new Error(`Expected ${expected}, but got ${actual}`);
                }
            },
            toEqual: (expected) => {
                if (JSON.stringify(actual) !== JSON.stringify(expected)) {
                    throw new Error(`Expected ${JSON.stringify(expected)}, but got ${JSON.stringify(actual)}`);
                }
            },
            toBeTruthy: () => {
                if (!actual) {
                    throw new Error(`Expected truthy value, but got ${actual}`);
                }
            },
            toBeFalsy: () => {
                if (actual) {
                    throw new Error(`Expected falsy value, but got ${actual}`);
                }
            },
            toContain: (expected) => {
                if (typeof actual === 'string') {
                    if (!actual.includes(expected)) {
                        throw new Error(`Expected "${actual}" to contain "${expected}"`);
                    }
                } else if (Array.isArray(actual)) {
                    if (!actual.includes(expected)) {
                        throw new Error(`Expected array to contain ${expected}`);
                    }
                } else {
                    throw new Error(`toContain can only be used with strings or arrays`);
                }
            },
            toHaveLength: (expected) => {
                if (!actual || actual.length === undefined) {
                    throw new Error(`Expected object with length property`);
                }
                if (actual.length !== expected) {
                    throw new Error(`Expected length ${expected}, but got ${actual.length}`);
                }
            },
            toBeGreaterThan: (expected) => {
                if (actual <= expected) {
                    throw new Error(`Expected ${actual} to be greater than ${expected}`);
                }
            },
            toBeGreaterThanOrEqual: (expected) => {
                if (actual < expected) {
                    throw new Error(`Expected ${actual} to be greater than or equal to ${expected}`);
                }
            },
            toBeLessThan: (expected) => {
                if (actual >= expected) {
                    throw new Error(`Expected ${actual} to be less than ${expected}`);
                }
            },
            toBeLessThanOrEqual: (expected) => {
                if (actual > expected) {
                    throw new Error(`Expected ${actual} to be less than or equal to ${expected}`);
                }
            },
            toMatch: (expected) => {
                const regex = expected instanceof RegExp ? expected : new RegExp(expected);
                if (!regex.test(actual)) {
                    throw new Error(`Expected "${actual}" to match ${regex}`);
                }
            },
            not: {
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
                toThrow: () => {
                    let threw = false;
                    try {
                        if (typeof actual === 'function') {
                            actual();
                        }
                    } catch (e) {
                        threw = true;
                    }
                    if (threw) {
                        throw new Error(`Expected function not to throw an error`);
                    }
                }
            },
            toThrow: () => {
                let threw = false;
                try {
                    if (typeof actual === 'function') {
                        actual();
                    }
                } catch (e) {
                    threw = true;
                }
                if (!threw) {
                    throw new Error(`Expected function to throw an error`);
                }
            },
            toHaveBeenCalled: () => {
                if (!actual._isMock || actual.calls.length === 0) {
                    throw new Error(`Expected function to have been called`);
                }
            },
            toHaveBeenCalledWith: (...expectedArgs) => {
                if (!actual._isMock) {
                    throw new Error(`Expected function to be a mock`);
                }
                const found = actual.calls.some(call => 
                    JSON.stringify(call.args) === JSON.stringify(expectedArgs)
                );
                if (!found) {
                    throw new Error(`Expected function to have been called with ${JSON.stringify(expectedArgs)}`);
                }
            }
        };
    }

    // Mock function creator
    fn(implementation) {
        const mockFn = (...args) => {
            mockFn.calls.push({ args, timestamp: Date.now() });
            if (implementation) {
                return implementation(...args);
            }
        };
        
        mockFn._isMock = true;
        mockFn.calls = [];
        mockFn.mockReturnValue = (value) => {
            implementation = () => value;
            return mockFn;
        };
        mockFn.mockImplementation = (fn) => {
            implementation = fn;
            return mockFn;
        };
        mockFn.mockClear = () => {
            mockFn.calls = [];
            return mockFn;
        };
        
        return mockFn;
    }

    // Spy on existing functions
    spyOn(object, methodName) {
        const originalMethod = object[methodName];
        const spy = this.fn(originalMethod);
        spy.restore = () => {
            object[methodName] = originalMethod;
        };
        object[methodName] = spy;
        return spy;
    }

    // Run all tests
    async runAll() {
        console.log('🧪 Running tests...');
        this.results = { passed: 0, failed: 0, total: 0 };
        
        const output = document.getElementById('test-output');
        if (output) {
            output.innerHTML = '<h2>Test Results</h2>';
        }

        for (const test of this.tests) {
            await this.runTest(test);
        }

        this.displayResults();
        return this.results;
    }

    // Run a single test
    async runTest(test) {
        this.results.total++;
        
        try {
            // Run beforeEach if it exists
            if (test.suite && this.suites[test.suite].beforeEach) {
                await this.suites[test.suite].beforeEach();
            }

            // Run the actual test
            await test.testFunction();
            
            // Run afterEach if it exists
            if (test.suite && this.suites[test.suite].afterEach) {
                await this.suites[test.suite].afterEach();
            }

            test.passed = true;
            this.results.passed++;
            this.logTest(test, '✅');
            
        } catch (error) {
            test.passed = false;
            test.error = error;
            this.results.failed++;
            this.logTest(test, '❌', error);
        }
    }

    // Log test result
    logTest(test, icon, error = null) {
        const message = `${icon} ${test.suite ? `[${test.suite}] ` : ''}${test.description}`;
        console.log(message);
        
        if (error) {
            console.error(`   Error: ${error.message}`);
        }

        const output = document.getElementById('test-output');
        if (output) {
            const testDiv = document.createElement('div');
            testDiv.className = `test-result ${test.passed ? 'passed' : 'failed'}`;
            testDiv.innerHTML = `
                <span class="test-icon">${icon}</span>
                <span class="test-description">${message}</span>
                ${error ? `<div class="test-error">Error: ${error.message}</div>` : ''}
            `;
            output.appendChild(testDiv);
        }
    }

    // Display final results
    displayResults() {
        const { passed, failed, total } = this.results;
        const successRate = ((passed / total) * 100).toFixed(1);
        
        console.log('\n📊 Test Summary:');
        console.log(`   Total: ${total}`);
        console.log(`   Passed: ${passed}`);
        console.log(`   Failed: ${failed}`);
        console.log(`   Success Rate: ${successRate}%`);

        const output = document.getElementById('test-output');
        if (output) {
            const summaryDiv = document.createElement('div');
            summaryDiv.className = 'test-summary';
            summaryDiv.innerHTML = `
                <h3>📊 Test Summary</h3>
                <div class="summary-stats">
                    <div class="stat">
                        <span class="stat-label">Total:</span>
                        <span class="stat-value">${total}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Passed:</span>
                        <span class="stat-value passed">${passed}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Failed:</span>
                        <span class="stat-value failed">${failed}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Success Rate:</span>
                        <span class="stat-value">${successRate}%</span>
                    </div>
                </div>
            `;
            output.appendChild(summaryDiv);
        }
    }

    // Helper to create DOM elements for testing
    createTestElement(tag = 'div', attributes = {}) {
        const element = document.createElement(tag);
        Object.keys(attributes).forEach(key => {
            if (key === 'textContent') {
                element.textContent = attributes[key];
            } else if (key === 'innerHTML') {
                element.innerHTML = attributes[key];
            } else {
                element.setAttribute(key, attributes[key]);
            }
        });
        return element;
    }

    // Helper to simulate events
    simulateEvent(element, eventType, eventData = {}) {
        const event = new Event(eventType, { bubbles: true, cancelable: true, ...eventData });
        Object.keys(eventData).forEach(key => {
            event[key] = eventData[key];
        });
        element.dispatchEvent(event);
    }

    // Helper to wait for async operations
    wait(ms = 0) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Global test framework instance
const TestRunner = new TestFramework();

// Export globals for easier testing
window.describe = TestRunner.describe.bind(TestRunner);
window.it = TestRunner.it.bind(TestRunner);
window.beforeEach = TestRunner.beforeEach.bind(TestRunner);
window.afterEach = TestRunner.afterEach.bind(TestRunner);
window.expect = TestRunner.expect.bind(TestRunner);
window.TestRunner = TestRunner;

// Export for modules if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TestFramework, TestRunner };
}