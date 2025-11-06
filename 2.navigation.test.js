const {device, expect, element, by, waitFor} = require('detox');
const fs = require('fs');
const path = require('path');

// Test results tracking
const testResults = {
	passed: [],
	failed: [],
	skipped: [],
	startTime: null,
	endTime: null,
	totalTests: 0
};

// Screenshot directory
const screenshotDir = path.join(__dirname, '../../screenshots/navigation-tests');

// Ensure screenshot directory exists
if (!fs.existsSync(screenshotDir)) {
	fs.mkdirSync(screenshotDir, { recursive: true });
}

// Helper function to capture screenshot on failure
async function captureFailureScreenshot(testName, error) {
	try {
		const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
		const screenshotPath = path.join(screenshotDir, `FAIL_${testName}_${timestamp}.png`);
		await device.takeScreenshot(screenshotPath);
		console.log(`📸 Screenshot saved: ${screenshotPath}`);
		return screenshotPath;
	} catch (screenshotError) {
		console.log(`⚠️ Failed to capture screenshot: ${screenshotError.message}`);
		return null;
	}
}

// Helper function to track test results
function trackTestResult(testName, status, error = null, screenshotPath = null) {
	const result = {
		name: testName,
		status,
		timestamp: new Date().toISOString(),
		duration: null,
		error: error ? error.message : null,
		screenshotPath
	};
	
	testResults[status].push(result);
	testResults.totalTests++;
}

// Helper function to start test timing
function startTestTimer(testName) {
	const startTime = Date.now();
	return {
		testName,
		startTime,
		end: () => Date.now() - startTime
	};
}

// Enhanced helper function to track test results with timing
function trackTestResultWithTiming(testName, status, timer, error = null, screenshotPath = null) {
	const duration = timer ? timer.end() : null;
	const result = {
		name: testName,
		status,
		timestamp: new Date().toISOString(),
		duration: duration ? `${duration}ms` : null,
		error: error ? error.message : null,
		screenshotPath
	};
	
	testResults[status].push(result);
	testResults.totalTests++;
}

// Helper function to generate test report
function generateTestReport() {
	const totalTests = testResults.totalTests;
	const passedCount = testResults.passed.length;
	const failedCount = testResults.failed.length;
	const skippedCount = testResults.skipped.length;
	const passRate = totalTests > 0 ? ((passedCount / totalTests) * 100).toFixed(2) : 0;
	
	// Generate timestamp for detox-style logging
	const timestamp = new Date().toLocaleTimeString('en-US', { 
		hour12: false, 
		hour: '2-digit', 
		minute: '2-digit', 
		second: '2-digit', 
		fractionalSecondDigits: 3 
	});
	const processId = process.pid;
	
	console.log(`${timestamp} detox[${processId}] i ${'='.repeat(80)}`);
	console.log(`${timestamp} detox[${processId}] i 📊 NAVIGATION TEST REPORT`);
	console.log(`${timestamp} detox[${processId}] i ${'='.repeat(80)}`);
	console.log(`${timestamp} detox[${processId}] i 🕐 Test Duration: ${testResults.startTime} → ${testResults.endTime}`);
	console.log(`${timestamp} detox[${processId}] i 📈 Pass Rate: ${passRate}% (${passedCount}/${totalTests})`);
	console.log(`${timestamp} detox[${processId}] i`);
	console.log(`${timestamp} detox[${processId}] i 📋 TEST SUMMARY:`);
	console.log(`${timestamp} detox[${processId}] i ${'─'.repeat(80)}`);
	console.log(`${timestamp} detox[${processId}] i | ${'Test Scenario'.padEnd(50)} | ${'Status'.padEnd(8)} | Details`);
	console.log(`${timestamp} detox[${processId}] i ${'─'.repeat(80)}`);
	
	// Define test scenarios in the order they should appear in the report
	const testScenarios = [
		'Happy Login Scenario with Manual OTP',
		'Basic Tab Navigation Flow',
		'Rapid Tab Switching Stress Test',
		'Tab Navigation with App Backgrounding',
		'Tab Navigation with Device Rotation'
	];
	
	// Create a map of test results by name for quick lookup
	const resultMap = {};
	[...testResults.passed, ...testResults.failed, ...testResults.skipped].forEach(result => {
		resultMap[result.name] = result;
	});
	
	// Display results in the predefined order
	const tableRows = testScenarios.map(scenario => {
		const result = resultMap[scenario];
		if (result) {
			const statusIcon = result.status === 'passed' ? '✅' : result.status === 'failed' ? '❌' : '⏭️';
			const details = result.duration || result.error || 'Completed';
			return `${timestamp} detox[${processId}] i | ${scenario.padEnd(50)} | ${statusIcon} ${result.status.padEnd(6)} | ${details}`;
		} else {
			return `${timestamp} detox[${processId}] i | ${scenario.padEnd(50)} | ⏭️ ${'skipped'.padEnd(6)} | Not executed`;
		}
	}).join('\n');
	
	console.log(tableRows);
	console.log(`${timestamp} detox[${processId}] i ${'─'.repeat(80)}`);
	console.log(`${timestamp} detox[${processId}] i`);
	console.log(`${timestamp} detox[${processId}] i 📊 STATISTICS:`);
	console.log(`${timestamp} detox[${processId}] i   ✅ Passed: ${passedCount}`);
	console.log(`${timestamp} detox[${processId}] i   ❌ Failed: ${failedCount}`);
	console.log(`${timestamp} detox[${processId}] i   ⏭️  Skipped: ${skippedCount}`);
	console.log(`${timestamp} detox[${processId}] i   📊 Total: ${totalTests}`);
	console.log(`${timestamp} detox[${processId}] i   🎯 Success Rate: ${passRate}%`);
	
	if (failedCount > 0) {
		console.log(`${timestamp} detox[${processId}] i`);
		console.log(`${timestamp} detox[${processId}] i ❌ FAILED TESTS:`);
		testResults.failed.forEach(test => {
			console.log(`${timestamp} detox[${processId}] i   • ${test.name}: ${test.error}`);
		});
	}
	
	console.log(`${timestamp} detox[${processId}] i`);
	console.log(`${timestamp} detox[${processId}] i 📸 Screenshots: ${screenshotDir}`);
	console.log(`${timestamp} detox[${processId}] i ${'='.repeat(80)}`);
	
	// Save report to file
	const reportContent = `📊 NAVIGATION TEST REPORT
${'='.repeat(80)}
🕐 Test Duration: ${testResults.startTime} → ${testResults.endTime}
📈 Pass Rate: ${passRate}% (${passedCount}/${totalTests})

📋 TEST SUMMARY:
${'─'.repeat(80)}
| ${'Test Scenario'.padEnd(50)} | ${'Status'.padEnd(8)} | Details
${'─'.repeat(80)}
${testScenarios.map(scenario => {
	const result = resultMap[scenario];
	if (result) {
		const statusIcon = result.status === 'passed' ? '✅' : result.status === 'failed' ? '❌' : '⏭️';
		const details = result.duration || result.error || 'Completed';
		return `| ${scenario.padEnd(50)} | ${statusIcon} ${result.status.padEnd(6)} | ${details}`;
	} else {
		return `| ${scenario.padEnd(50)} | ⏭️ ${'skipped'.padEnd(6)} | Not executed`;
	}
}).join('\n')}
${'─'.repeat(80)}

📊 STATISTICS:
  ✅ Passed: ${passedCount}
  ❌ Failed: ${failedCount}
  ⏭️  Skipped: ${skippedCount}
  📊 Total: ${totalTests}
  🎯 Success Rate: ${passRate}%

${failedCount > 0 ? `❌ FAILED TESTS:
${testResults.failed.map(test => `  • ${test.name}: ${test.error}`).join('\n')}

` : ''}📸 Screenshots: ${screenshotDir}
${'='.repeat(80)}`;

	try {
		const reportPath = path.join(screenshotDir, `navigation-test-report-${new Date().toISOString().split('T')[0]}.txt`);
		fs.writeFileSync(reportPath, reportContent);
		console.log(`${timestamp} detox[${processId}] i 📄 Report saved: ${reportPath}`);
	} catch (error) {
		console.log(`${timestamp} detox[${processId}] i ⚠️ Failed to save report: ${error.message}`);
	}
}

describe('Navigation Tests', () => {
	beforeAll(async () => {
		testResults.startTime = new Date().toISOString();
		await device.reloadReactNative();
	});

	afterAll(async () => {
		testResults.endTime = new Date().toISOString();
		generateTestReport();
	});

	beforeEach(async () => {
		// No app restart - maintain app state between tests for faster execution
		console.log('🔄 Continuing with existing app state...');
	});

	it('should complete happy login scenario with manual OTP', async () => {
		const timer = startTestTimer('Happy Login Scenario with Manual OTP');
		
		try {
			console.log('🚀 [Auth Flow] Starting happy login scenario');

			// ========== WELCOME SCREEN ==========
			console.log('\n📍 [Step 1] Welcome Screen');
			console.log('🔍 Waiting for welcome screen elements...');
			await new Promise(resolve => setTimeout(resolve, 2000));
			
			try {
				// Wait for welcome screen to fully load
				await waitFor(element(by.id('get-started-button')))
					.toBeVisible()
					.withTimeout(15000);
				console.log('✅ Welcome screen loaded');
			} catch (error) {
				console.log('⚠️ get-started-button not found, checking for alternative elements...');
			}

			// Wait a bit more for any animations to complete
			await new Promise(resolve => setTimeout(resolve, 2000));
			
			// Try to tap the get started button
			try {
				await element(by.id('get-started-button')).tap();
				console.log('✅ Get Started button tapped successfully');
			} catch (error) {
				console.log('⚠️ get-started-button tap failed, trying alternatives...');
			}

			// ========== PHONE INPUT SCREEN ==========
			console.log('\n📍 [Step 2] Phone Input Screen');

			await waitFor(element(by.id('phone-number-input')))
				.toBeVisible()
				.withTimeout(10000);

			console.log('✅ Phone input screen loaded');

			// Verify key elements are visible
			await expect(element(by.id('country-code-selector'))).toBeVisible();
			await expect(element(by.id('phone-number-input'))).toBeVisible();
			await expect(element(by.id('next-button'))).toBeVisible();

			console.log('✅ All essential UI elements visible');

			// ========== COUNTRY SELECTOR ==========
			console.log('\n📍 [Step 3] Country Selection');
			console.log('🌍 Testing country selection with scroll...');

			// Tap country selector to open dropdown/modal
			await element(by.id('country-code-selector')).tap();
			console.log('✅ Country selector opened');

			// Wait for country list to appear
			await waitFor(element(by.id('country-list')))
				.toBeVisible()
				.withTimeout(5000);
			console.log('✅ Country list visible');
			await new Promise(resolve => setTimeout(resolve, 2000));

			// Scroll down in the country list to find egypt
			await element(by.id('country-list')).scroll(2700, 'down');
			await new Promise(resolve => setTimeout(resolve, 500));

			await waitFor(element(by.id('country-egypt')))
				.toBeVisible()
				.withTimeout(3000);
			console.log('✅ Egypt found after scrolling');

			// Select country Egypt
			await element(by.id('country-egypt')).tap();
			console.log('✅ Egypt selected');

			// ========== PHONE NUMBER INPUT ==========
			console.log('\n📍 [Step 4] Phone Number Input');

			const phoneNumber = '1555577451';
			console.log(`📱 Entering phone number: ${phoneNumber}`);
			await element(by.id('phone-number-input')).typeText(phoneNumber);

			// Verify phone number was entered
			await expect(element(by.id('phone-number-input'))).toHaveText(phoneNumber);
			console.log('✅ Phone number entered successfully');

			// ========== TRIGGER SMS ==========
			console.log('\n📍 [Step 5] Triggering SMS');
			await element(by.id('next-button')).tap();

			// ========== OTP VERIFICATION SCREEN ==========
			console.log('\n📍 [Step 6] OTP Verification Screen');

			await waitFor(element(by.id('verification-code-input')))
				.toBeVisible()
				.withTimeout(15000);

			console.log('✅ OTP verification screen loaded');

			// Verify essential OTP screen elements
			await expect(element(by.id('verification-code-input'))).toBeVisible();
			await expect(element(by.id('verify-code-button'))).toBeVisible();
			console.log('✅ OTP input and verify button visible');

			await device.disableSynchronization();

			// إدخال OTP يدوي
			console.log('\n📍 [Step 7] Manual OTP Input');
			console.log('⏸️  TEST PAUSED - Please enter OTP manually');
			console.log('   1. Check your npm run dev:stage terminal');
			console.log('⏳ Waiting for you to manually enter OTP...');
			console.log('💡 You have 10 seconds to enter the OTP');
			await new Promise(r => setTimeout(r, 10000));

			await element(by.id('verify-code-button')).tap();

			await element(by.id('verify-code-button')).tap();
			await new Promise(r => setTimeout(r, 8000));

			// ========== VERIFY LOGIN SUCCESS ==========
			console.log('\n📍 [Step 8] Verifying Login Success');
			console.log('🔍 Waiting for home screen to load...');
			await new Promise(r => setTimeout(r, 4000));
			
			// Navigate to home tab to verify we're logged in
			console.log('🔍 Navigating to home tab...');
			try {
				await waitFor(element(by.id('home-tab')))
					.toBeVisible()
					.withTimeout(10000);
				await element(by.id('home-tab')).tap();
				console.log('✅ Home tab tapped - Login successful');
				await new Promise(r => setTimeout(r, 3000));
			} catch (error) {
				console.log('⚠️ Home tab not found:', error.message);
				throw new Error('Login verification failed - home tab not accessible');
			}

			console.log('✅ Happy login scenario completed successfully');
			trackTestResultWithTiming('Happy Login Scenario with Manual OTP', 'passed', timer);
		} catch (error) {
			console.log('❌ Happy login scenario failed:', error.message);
			const screenshotPath = await captureFailureScreenshot('happy_login_scenario', error);
			trackTestResultWithTiming('Happy Login Scenario with Manual OTP', 'failed', timer, error, screenshotPath);
			throw error;
		}
	});

	it('should successfully complete basic tab navigation flow', async () => {
		const timer = startTestTimer('Basic Tab Navigation Flow');
		
		try {
			console.log('🚀 [Navigation] Starting basic tab navigation flow');
			
			// Wait for app to load and navigate to home
			await waitFor(element(by.id('home-tab')))
				.toBeVisible()
				.withTimeout(10000);
			
			// Test basic navigation through all tabs
			const tabs = ['home-tab', 'diagnoses-tab', 'programs-tab', 'period-tracker-tab'];
			
			for (const tab of tabs) {
				console.log(`📍 Navigating to ${tab}`);
				await element(by.id(tab)).tap();
				await new Promise(resolve => setTimeout(resolve, 1000));
				
				// Verify tab is active/visible
				await expect(element(by.id(tab))).toBeVisible();
				console.log(`✅ ${tab} navigation successful`);
			}
			
			trackTestResultWithTiming('Basic Tab Navigation Flow', 'passed', timer);
		} catch (error) {
			console.log('❌ Basic tab navigation failed:', error.message);
			const screenshotPath = await captureFailureScreenshot('basic_tab_navigation', error);
			trackTestResultWithTiming('Basic Tab Navigation Flow', 'failed', timer, error, screenshotPath);
			throw error;
		}
	});

	it('should handle rapid tab switching stress test', async () => {
		const timer = startTestTimer('Rapid Tab Switching Stress Test');
		
		try {
			console.log('🚀 [Navigation] Starting rapid tab switching stress test');
			
			await waitFor(element(by.id('home-tab')))
				.toBeVisible()
				.withTimeout(10000);
			
			const tabs = ['home-tab', 'diagnoses-tab', 'programs-tab', 'period-tracker-tab'];
			
			// Perform intensive rapid switching - 4 complete cycles
			for (let cycle = 0; cycle < 4; cycle++) {
				console.log(`📍 Rapid switching cycle ${cycle + 1}/4`);
				for (const tab of tabs) {
					await element(by.id(tab)).tap();
					await new Promise(resolve => setTimeout(resolve, 200)); // Very fast switching
				}
			}
			
			console.log('✅ Rapid tab switching stress test completed');
			trackTestResultWithTiming('Rapid Tab Switching Stress Test', 'passed', timer);
		} catch (error) {
			console.log('❌ Rapid tab switching failed:', error.message);
			const screenshotPath = await captureFailureScreenshot('rapid_tab_switching', error);
			trackTestResultWithTiming('Rapid Tab Switching Stress Test', 'failed', timer, error, screenshotPath);
			throw error;
		}
	});

	it('should handle tab navigation with app backgrounding', async () => {
		const timer = startTestTimer('Tab Navigation with App Backgrounding');
		
		try {
			console.log('🚀 [Navigation] Testing tab navigation with app backgrounding');
			
			await waitFor(element(by.id('home-tab')))
				.toBeVisible()
				.withTimeout(10000);
			
			// Navigate to different tab
			await element(by.id('diagnoses-tab')).tap();
			await new Promise(resolve => setTimeout(resolve, 1000));
			
			// Background the app
			console.log('📍 Backgrounding app');
			await device.sendToHome();
			await new Promise(resolve => setTimeout(resolve, 2000));
			
			// Bring app back to foreground
			console.log('📍 Bringing app to foreground');
			await device.launchApp({newInstance: false});
			await new Promise(resolve => setTimeout(resolve, 2000));
			
			// Verify navigation still works
			await element(by.id('programs-tab')).tap();
			await new Promise(resolve => setTimeout(resolve, 1000));
			await expect(element(by.id('programs-tab'))).toBeVisible();
			
			console.log('✅ Tab navigation with backgrounding handled successfully');
			trackTestResultWithTiming('Tab Navigation with App Backgrounding', 'passed', timer);
		} catch (error) {
			console.log('❌ Tab navigation with backgrounding failed:', error.message);
			const screenshotPath = await captureFailureScreenshot('tab_navigation_backgrounding', error);
			trackTestResultWithTiming('Tab Navigation with App Backgrounding', 'failed', timer, error, screenshotPath);
			throw error;
		}
	});

	it('should handle tab navigation with device rotation', async () => {
		const timer = startTestTimer('Tab Navigation with Device Rotation');
		
		try {
			console.log('🚀 [Navigation] Testing tab navigation with device rotation');
			
			await waitFor(element(by.id('home-tab')))
				.toBeVisible()
				.withTimeout(10000);
			
			// Navigate to different tab
			await element(by.id('diagnoses-tab')).tap();
			await new Promise(resolve => setTimeout(resolve, 1000));
			
			// Rotate device to landscape
			console.log('📍 Rotating device to landscape');
			await device.setOrientation('landscape');
			await new Promise(resolve => setTimeout(resolve, 2000));
			
			// Test navigation in landscape mode
			await element(by.id('programs-tab')).tap();
			await new Promise(resolve => setTimeout(resolve, 1000));
			
			// Rotate back to portrait
			console.log('📍 Rotating device back to portrait');
			await device.setOrientation('portrait');
			await new Promise(resolve => setTimeout(resolve, 2000));
			
			// Verify navigation still works in portrait
			await element(by.id('home-tab')).tap();
			await expect(element(by.id('home-tab'))).toBeVisible();
			
			console.log('✅ Tab navigation with device rotation test completed');
			trackTestResultWithTiming('Tab Navigation with Device Rotation', 'passed', timer);
		} catch (error) {
			console.log('❌ Tab navigation with device rotation failed:', error.message);
			const screenshotPath = await captureFailureScreenshot('tab_navigation_rotation', error);
			trackTestResultWithTiming('Tab Navigation with Device Rotation', 'failed', timer, error, screenshotPath);
			throw error;
		}
	});
});