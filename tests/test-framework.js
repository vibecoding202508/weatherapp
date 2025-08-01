// Simple Test Framework
const TestFramework = {
    tests: [],
    results: {
        passed: 0,
        failed: 0,
        total: 0
    },

    describe: function(description, testFn) {
        this.currentSuite = description;
        testFn();
    },

    it: function(description, testFn) {
        this.tests.push({
            suite: this.currentSuite,
            description: description,
            testFn: testFn
        });
    },

    expect: function(actual) {
        return {
            toBe: function(expected) {
                if (actual !== expected) {
                    throw new Error(`Expected ${expected} but got ${actual}`);
                }
            },
            toEqual: function(expected) {
                const actualStr = JSON.stringify(actual);
                const expectedStr = JSON.stringify(expected);
                if (actualStr !== expectedStr) {
                    throw new Error(`Expected ${expectedStr} but got ${actualStr}`);
                }
            },
            toBeTruthy: function() {
                if (!actual) {
                    throw new Error(`Expected ${actual} to be truthy`);
                }
            },
            toBeFalsy: function() {
                if (actual) {
                    throw new Error(`Expected ${actual} to be falsy`);
                }
            },
            toContain: function(expected) {
                if (!actual.includes(expected)) {
                    throw new Error(`Expected ${actual} to contain ${expected}`);
                }
            },
            toBeGreaterThan: function(expected) {
                if (!(actual > expected)) {
                    throw new Error(`Expected ${actual} to be greater than ${expected}`);
                }
            },
            toBeLessThan: function(expected) {
                if (!(actual < expected)) {
                    throw new Error(`Expected ${actual} to be less than ${expected}`);
                }
            },
            toBeNull: function() {
                if (actual !== null) {
                    throw new Error(`Expected ${actual} to be null`);
                }
            },
            toBeUndefined: function() {
                if (actual !== undefined) {
                    throw new Error(`Expected ${actual} to be undefined`);
                }
            },
            toHaveBeenCalled: function() {
                if (!actual._isMockFunction) {
                    throw new Error(`Expected function to be a mock function`);
                }
                if (actual._callCount === 0) {
                    throw new Error(`Expected mock function to have been called, but it was not called`);
                }
            },
            toHaveBeenCalledWith: function(...expectedArgs) {
                if (!actual._isMockFunction) {
                    throw new Error(`Expected function to be a mock function`);
                }
                const found = actual._calls.some(call => 
                    call.length === expectedArgs.length && 
                    call.every((arg, index) => {
                        if (expectedArgs[index] && expectedArgs[index]._isAnyMatcher) {
                            return expectedArgs[index].matches(arg);
                        }
                        return arg === expectedArgs[index];
                    })
                );
                if (!found) {
                    throw new Error(`Expected mock function to have been called with ${JSON.stringify(expectedArgs)}, but it was called with ${JSON.stringify(actual._calls)}`);
                }
            },
            not: {
                toThrow: function() {
                    let threw = false;
                    try {
                        actual();
                    } catch (error) {
                        threw = true;
                    }
                    if (threw) {
                        throw new Error('Expected function not to throw an error, but it did');
                    }
                },
                toHaveBeenCalled: function() {
                    if (!actual._isMockFunction) {
                        throw new Error(`Expected function to be a mock function`);
                    }
                    if (actual._callCount > 0) {
                        throw new Error(`Expected mock function not to have been called, but it was called ${actual._callCount} times`);
                    }
                }
            }
        };

        // Add expect.any for type checking
        expectObject.any = function(constructor) {
            return {
                _isAnyMatcher: true,
                constructor: constructor,
                matches: function(value) {
                    if (constructor === Function) {
                        return typeof value === 'function';
                    }
                    if (constructor === String) {
                        return typeof value === 'string';
                    }
                    if (constructor === Number) {
                        return typeof value === 'number';
                    }
                    if (constructor === Object) {
                        return typeof value === 'object' && value !== null;
                    }
                    if (constructor === Array) {
                        return Array.isArray(value);
                    }
                    return value instanceof constructor;
                }
            };
        };

        return expectObject;
    },

    // Add beforeEach and afterEach support
    beforeEach: function(fn) {
        this._beforeEach = fn;
    },

    afterEach: function(fn) {
        this._afterEach = fn;
    },

    runTests: async function() {
        // Store original DOM methods to avoid interference from test mocks
        const originalCreateElement = document.createElement.bind(document);
        const originalGetElementById = document.getElementById.bind(document);
        
        try {
            const resultsList = originalGetElementById('test-results');
            if (!resultsList) {
                console.error('Test results container not found');
                return;
            }
            
            resultsList.innerHTML = '';
            this.results = { passed: 0, failed: 0, total: 0 };
            
            let currentSuiteElement = null;
            let currentSuite = '';

            for (const test of this.tests) {
                if (currentSuite !== test.suite) {
                    currentSuite = test.suite;
                    currentSuiteElement = originalCreateElement('div');
                    currentSuiteElement.className = 'test-suite';
                    currentSuiteElement.innerHTML = `<h3>${test.suite}</h3>`;
                    
                    // Safely append suite element
                    try {
                        resultsList.appendChild(currentSuiteElement);
                    } catch (e) {
                        console.error('Failed to append suite element:', e);
                        continue;
                    }
                }

                const resultElement = originalCreateElement('div');
                resultElement.className = 'test-case';
                
                try {
                    // Run beforeEach if defined
                    if (this._beforeEach) {
                        await this._beforeEach();
                    }
                    
                    await test.testFn();
                    this.results.passed++;
                    resultElement.className += ' passed';
                    resultElement.innerHTML = `✓ ${test.description}`;
                } catch (error) {
                    this.results.failed++;
                    resultElement.className += ' failed';
                    resultElement.innerHTML = `✗ ${test.description}<br><span class="error">${error.message}</span>`;
                } finally {
                    // Run afterEach if defined
                    if (this._afterEach) {
                        try {
                            await this._afterEach();
                        } catch (e) {
                            console.error('AfterEach failed:', e);
                        }
                    }
                }
                
                this.results.total++;
                
                // Safely append result element
                try {
                    if (currentSuiteElement && typeof currentSuiteElement.appendChild === 'function') {
                        currentSuiteElement.appendChild(resultElement);
                    }
                } catch (e) {
                    console.error('Failed to append result element:', e);
                    // Fallback: append directly to results list
                    try {
                        resultsList.appendChild(resultElement);
                    } catch (e2) {
                        console.error('Failed to append to results list:', e2);
                    }
                }
            }

            // Update summary
            try {
                const summary = originalGetElementById('test-summary');
                if (summary) {
                    summary.innerHTML = `
                        Total: ${this.results.total} | 
                        Passed: <span class="passed">${this.results.passed}</span> | 
                        Failed: <span class="failed">${this.results.failed}</span>
                    `;
                }
            } catch (e) {
                console.error('Failed to update summary:', e);
            }
            
        } catch (error) {
            console.error('Test runner error:', error);
        }
    },

    // Create a mock function for testing
    createMockFunction: function(implementation) {
        const mockFn = implementation || function() {};
        const actualMockFn = function(...args) {
            actualMockFn._calls.push(args);
            actualMockFn._callCount++;
            return mockFn.apply(this, args);
        };
        
        actualMockFn._calls = [];
        actualMockFn._callCount = 0;
        actualMockFn._isMockFunction = true;
        
        actualMockFn.mockReturnValue = function(value) {
            mockFn = function() { return value; };
            return actualMockFn;
        };
        
        actualMockFn.mockImplementation = function(impl) {
            mockFn = impl;
            return actualMockFn;
        };
        
        return actualMockFn;
    }
};