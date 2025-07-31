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
            testFunction();
            this.results.passed++;
            console.log(`✅ ${testName}`);
        } catch (error) {
            this.results.failed++;
            console.error(`❌ ${testName}`, error);
        }
        
        this.results.total++;
    }

    // Assertion methods
    expect(actual) {
        return {
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
            }
        };
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
        
        // Create visual results in DOM
        this.createResultsDOM();
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

// Export framework for advanced usage
window.TestFramework = testFramework;