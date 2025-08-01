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
            }
        };
    },

    runTests: async function() {
        const resultsList = document.getElementById('test-results');
        resultsList.innerHTML = '';
        this.results = { passed: 0, failed: 0, total: 0 };
        
        let currentSuiteElement = null;
        let currentSuite = '';

        for (const test of this.tests) {
            if (currentSuite !== test.suite) {
                currentSuite = test.suite;
                currentSuiteElement = document.createElement('div');
                currentSuiteElement.className = 'test-suite';
                currentSuiteElement.innerHTML = `<h3>${test.suite}</h3>`;
                resultsList.appendChild(currentSuiteElement);
            }

            const resultElement = document.createElement('div');
            resultElement.className = 'test-case';
            
            try {
                await test.testFn();
                this.results.passed++;
                resultElement.className += ' passed';
                resultElement.innerHTML = `✓ ${test.description}`;
            } catch (error) {
                this.results.failed++;
                resultElement.className += ' failed';
                resultElement.innerHTML = `✗ ${test.description}<br><span class="error">${error.message}</span>`;
            }
            
            this.results.total++;
            currentSuiteElement.appendChild(resultElement);
        }

        // Update summary
        const summary = document.getElementById('test-summary');
        summary.innerHTML = `
            Total: ${this.results.total} | 
            Passed: <span class="passed">${this.results.passed}</span> | 
            Failed: <span class="failed">${this.results.failed}</span>
        `;
    }
};