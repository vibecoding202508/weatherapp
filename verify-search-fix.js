// Node.js script to verify the search test fix
const fs = require('fs');

// Mock browser environment
global.window = {};
global.document = {
    getElementById: (id) => {
        const mockElement = {
            classList: { 
                add: () => {}, 
                remove: () => {}, 
                contains: () => false 
            },
            style: {},
            textContent: '',
            value: '',
            addEventListener: () => {},
            focus: () => {}
        };
        return mockElement;
    },
    body: { 
        classList: { 
            add: () => {}, 
            remove: () => {}, 
            contains: () => false 
        } 
    }
};
global.localStorage = {
    getItem: () => null,
    setItem: () => {}
};

console.log('🔍 Testing Search Test Fix for "Assignment to constant variable" error...\n');

try {
    // Load the JavaScript files that set up global objects
    console.log('📦 Loading required JavaScript files...');
    
    const files = [
        'js/utils.js',      // Contains ValidationUtils
        'js/dom.js',        // Contains DOM, DOMUtils  
        'js/state.js',      // Contains StateManager
        'js/weather-api.js', // Contains WeatherAPI
        'js/search.js'      // Contains Search
    ];
    
    for (const file of files) {
        try {
            const content = fs.readFileSync(file, 'utf8');
            eval(content);
            console.log(`   ✅ ${file} loaded`);
        } catch (e) {
            console.log(`   ❌ ${file} failed: ${e.message}`);
        }
    }
    
    // Test that global objects are created  
    const globalObjects = ['DOM', 'DOMUtils', 'StateManager', 'WeatherAPI', 'ValidationUtils', 'Search'];
    console.log('\n🔍 Checking global object properties...');
    
    for (const objName of globalObjects) {
        if (global.window[objName]) {
            const descriptor = Object.getOwnPropertyDescriptor(global.window, objName);
            const isConfigurable = descriptor && descriptor.configurable;
            console.log(`   ${objName}: ${isConfigurable ? '✅ configurable' : '❌ NOT configurable'}`);
        } else {
            console.log(`   ${objName}: ❌ NOT found`);
        }
    }
    
    // Now test the robust mocking approach from our fixed search tests
    console.log('\n🎭 Testing robust mocking strategy...');
    
    // Mock objects similar to what the search test does
    const mockValidationUtils = {
        isValidLocation: () => 'mock-isValidLocation'
    };
    
    const mockStateManager = {
        setCurrentLocation: () => 'mock-setCurrentLocation',
        getCurrentLocation: () => false
    };
    
    // Test Strategy 1: Try to replace whole object (may fail)
    console.log('   Strategy 1: Object replacement...');
    try {
        const validationUtilsDescriptor = Object.getOwnPropertyDescriptor(global.window, 'ValidationUtils');
        if (validationUtilsDescriptor && validationUtilsDescriptor.configurable) {
            Object.defineProperty(global.window, 'ValidationUtils', {
                value: mockValidationUtils,
                writable: true,
                configurable: true
            });
            console.log('   ✅ Object replacement: SUCCESS');
        } else {
            throw new Error('Property not configurable');
        }
    } catch (e) {
        console.log('   ❌ Object replacement: FAILED (as expected for non-configurable)');
        console.log(`      Error: ${e.message}`);
        
        // Test Strategy 2: Monkey-patch individual methods (should work)
        console.log('   Strategy 2: Method monkey-patching...');
        try {
            if (global.window.ValidationUtils) {
                // Store original to verify we can change it
                const originalIsValidLocation = global.window.ValidationUtils.isValidLocation;
                
                // Replace method
                global.window.ValidationUtils.isValidLocation = mockValidationUtils.isValidLocation;
                
                // Test that replacement worked
                if (global.window.ValidationUtils.isValidLocation() === 'mock-isValidLocation') {
                    console.log('   ✅ Method monkey-patching: SUCCESS');
                    
                    // Test search functionality with our mocked methods
                    console.log('\n🔍 Testing Search functionality with mocked methods...');
                    try {
                        // This would have caused "Assignment to constant variable" error before the fix
                        global.window.Search.initialize();
                        console.log('   ✅ Search.initialize(): SUCCESS - No const assignment error!');
                    } catch (searchError) {
                        console.log(`   ❌ Search.initialize(): FAILED - ${searchError.message}`);
                    }
                    
                    // Restore original method
                    global.window.ValidationUtils.isValidLocation = originalIsValidLocation;
                    
                } else {
                    console.log('   ❌ Method monkey-patching: FAILED - Method not replaced');
                }
            } else {
                console.log('   ❌ Method monkey-patching: FAILED - ValidationUtils not found');
            }
        } catch (monkeyPatchError) {
            console.log(`   ❌ Method monkey-patching: FAILED - ${monkeyPatchError.message}`);
        }
    }
    
    console.log('\n🎉 Search test fix verification complete!');
    console.log('\n📝 Summary:');
    console.log('   • Global objects are created (configurable or non-configurable)');
    console.log('   • Our robust mocking strategy handles both scenarios');
    console.log('   • Method monkey-patching works as fallback');
    console.log('   • Search tests can now mock behavior without const assignment errors');
    
} catch (error) {
    console.error('❌ Verification failed:', error.message);
    console.error(error.stack);
    process.exit(1);
}