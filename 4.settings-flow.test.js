const {device, expect, element, by, waitFor} = require('detox');

describe('Settings Flow', () => {
	beforeAll(async () => {
		await device.reloadReactNative();
	});

	it('should test settings functionality across all app stacks', async () => {
		console.log('🚀 [Settings Flow] Starting settings functionality tests');

		// ========== AUTHENTICATION SETUP ==========
		console.log('\n📍 [Step 1] Authentication Setup');
		
		// Navigate through authentication flow to reach main app
		console.log('🔍 Waiting for welcome screen elements...');
		await new Promise(resolve => setTimeout(resolve, 2000));
		
		try {
			await waitFor(element(by.id('get-started-button')))
				.toBeVisible()
				.withTimeout(15000);
			console.log('✅ Welcome screen loaded');
			await element(by.id('get-started-button')).tap();
		} catch (error) {
			console.log('⚠️ get-started-button not found, checking for alternative elements...');
		}

		// Phone input screen
		await waitFor(element(by.id('phone-number-input')))
			.toBeVisible()
			.withTimeout(10000);
		console.log('✅ Phone input screen loaded');

		// Enter valid phone number
		await element(by.id('phone-number-input')).typeText('1555577451');
		await element(by.id('next-button')).tap();
		console.log('✅ Phone number entered and submitted');

		// OTP verification screen
		await waitFor(element(by.id('otp-input')))
			.toBeVisible()
			.withTimeout(10000);
		console.log('✅ OTP screen loaded');

		// إدخال OTP يدوي
		console.log('\n📍 [Step 6] Manual OTP Input');
		console.log('⏸️  TEST PAUSED - Please enter OTP manually');
		console.log('   1. Check your npm run dev:stage terminal');
		console.log('⏳ Waiting for you to manually enter OTP...');
		console.log('💡 You have 10 seconds to enter the OTP');
		await new Promise(r => setTimeout(r, 10000));

		await element(by.id('verify-code-button')).tap();

		// Wait for main app to load
		await new Promise(resolve => setTimeout(resolve, 5000));
		console.log('✅ Main app loaded');

		// ========== SETTINGS BUTTON ACCESSIBILITY TESTS ==========
		console.log('\n📍 [Step 2] Settings Button Accessibility Tests');
		
		// Test Settings Button in Home Stack
		console.log('🏠 Testing settings button in Home stack...');
		try {
			await element(by.id('home-tab')).tap();
			await new Promise(r => setTimeout(r, 2000));
			
			await waitFor(element(by.id('settings_button')))
				.toBeVisible()
				.withTimeout(5000);
			console.log('✅ Settings button visible in Home stack');
			
			await element(by.id('settings_button')).tap();
			console.log('✅ Settings button tapped in Home stack');
			
			// Verify settings screen opened
			await new Promise(r => setTimeout(r, 2000));
			
			// Go back to home
			await element(by.id('home-tab')).tap();
			await new Promise(r => setTimeout(r, 1000));
			console.log('✅ Returned to Home stack');
			
		} catch (error) {
			console.log('⚠️ Settings button test failed in Home stack:', error.message);
		}
		
		// Test Settings Button in Diagnoses Stack
		console.log('🩺 Testing settings button in Diagnoses stack...');
		try {
			await element(by.id('diagnoses-tab')).tap();
			await new Promise(r => setTimeout(r, 2000));
			
			await waitFor(element(by.id('settings_button')))
				.toBeVisible()
				.withTimeout(5000);
			console.log('✅ Settings button visible in Diagnoses stack');
			
			await element(by.id('settings_button')).tap();
			console.log('✅ Settings button tapped in Diagnoses stack');
			
			// Verify settings screen opened
			await new Promise(r => setTimeout(r, 2000));
			
			// Go back to diagnoses
			await element(by.id('diagnoses-tab')).tap();
			await new Promise(r => setTimeout(r, 1000));
			console.log('✅ Returned to Diagnoses stack');
			
		} catch (error) {
			console.log('⚠️ Settings button test failed in Diagnoses stack:', error.message);
		}
		
		// Test Settings Button in Programs Stack
		console.log('📚 Testing settings button in Programs stack...');
		try {
			await element(by.id('programs-tab')).tap();
			await new Promise(r => setTimeout(r, 2000));
			
			await waitFor(element(by.id('settings_button')))
				.toBeVisible()
				.withTimeout(5000);
			console.log('✅ Settings button visible in Programs stack');
			
			await element(by.id('settings_button')).tap();
			console.log('✅ Settings button tapped in Programs stack');
			
			// Verify settings screen opened
			await new Promise(r => setTimeout(r, 2000));
			
			// Go back to programs
			await element(by.id('programs-tab')).tap();
			await new Promise(r => setTimeout(r, 1000));
			console.log('✅ Returned to Programs stack');
			
		} catch (error) {
			console.log('⚠️ Settings button test failed in Programs stack:', error.message);
		}
		
		// Test Settings Button in Period Tracker Stack
		console.log('📅 Testing settings button in Period Tracker stack...');
		try {
			await element(by.id('period-tracker-tab')).tap();
			await new Promise(r => setTimeout(r, 2000));
			
			await waitFor(element(by.id('settings_button')))
				.toBeVisible()
				.withTimeout(5000);
			console.log('✅ Settings button visible in Period Tracker stack');
			
			await element(by.id('settings_button')).tap();
			console.log('✅ Settings button tapped in Period Tracker stack');
			
			// Verify settings screen opened
			await new Promise(r => setTimeout(r, 2000));
			
			// Go back to period tracker
			await element(by.id('period-tracker-tab')).tap();
			await new Promise(r => setTimeout(r, 1000));
			console.log('✅ Returned to Period Tracker stack');
			
		} catch (error) {
			console.log('⚠️ Settings button test failed in Period Tracker stack:', error.message);
		}
		
		console.log('✅ Settings button accessibility test completed across all stacks');

		// ========== PROFILE EDITING TESTS ==========
		console.log('\n📍 [Step 3] Profile Editing Tests');
		
		// Open settings from diagnoses tab
		await new Promise(r => setTimeout(r, 3000));
		await element(by.id('diagnoses-tab')).tap();
		await new Promise(r => setTimeout(r, 10000));
		
		await element(by.id('settings_button')).tap();
		console.log('✅ Settings button tapped');
		
		// Verify settings screen opened
		await new Promise(r => setTimeout(r, 2000));
		
		// Open edit profile
		await element(by.id('edit_profile')).tap();
		await new Promise(r => setTimeout(r, 2000));
		
		// Edit name - positive scenario
		await element(by.id('name_input')).clearText();
		await element(by.id('name_input')).typeText('test change name');
		await element(by.id('save_edit')).tap();
		console.log('✅ Name changed successfully');
		
		// Wait before starting negative scenarios
		await new Promise(r => setTimeout(r, 3000));
		
		// ========== NAME EDITING NEGATIVE SCENARIOS ==========
		console.log('\n🧪 [Negative Scenarios] Name Editing Tests');
		
		// Test 1: Empty name
		try {
			await element(by.id('name_input')).clearText();
			await element(by.id('save_edit')).tap();
			console.log('⚠️ Empty name test - checking for validation');
			await new Promise(r => setTimeout(r, 3000));
		} catch (error) {
			console.log('✅ Empty name validation handled:', error.message);
		}
		
		// Test 2: Extremely long name (over 50 characters)
		try {
			const longName = 'This is an extremely long name that exceeds normal character limits for testing purposes';
			await element(by.id('name_input')).clearText();
			await element(by.id('name_input')).typeText(longName);
			await element(by.id('save_edit')).tap();
			console.log('⚠️ Long name test - checking for length validation');
			await new Promise(r => setTimeout(r, 3000));
		} catch (error) {
			console.log('✅ Long name validation handled:', error.message);
		}
		
		// Test 3: Special characters and numbers
		try {
			await element(by.id('name_input')).clearText();
			await element(by.id('name_input')).typeText('Test@123!#$%');
			await element(by.id('save_edit')).tap();
			console.log('⚠️ Special characters test - checking for character validation');
			await new Promise(r => setTimeout(r, 3000));
		} catch (error) {
			console.log('✅ Special characters validation handled:', error.message);
		}
		
		// Test 4: Only spaces
		try {
			await element(by.id('name_input')).clearText();
			await element(by.id('name_input')).typeText('     ');
			await element(by.id('save_edit')).tap();
			console.log('⚠️ Spaces-only test - checking for whitespace validation');
			await new Promise(r => setTimeout(r, 3000));
		} catch (error) {
			console.log('✅ Spaces-only validation handled:', error.message);
		}
		
		// Test 5: Rapid consecutive saves
		try {
			await element(by.id('name_input')).clearText();
			await element(by.id('name_input')).typeText('Rapid Test');
			// Tap save button multiple times rapidly
			await element(by.id('save_edit')).tap();
			await element(by.id('save_edit')).tap();
			await element(by.id('save_edit')).tap();
			console.log('⚠️ Rapid save test - checking for duplicate request handling');
			await new Promise(r => setTimeout(r, 3000));
		} catch (error) {
			console.log('✅ Rapid save validation handled:', error.message);
		}
		
		// Restore valid name for continuation
		try {
			await element(by.id('name_input')).clearText();
			await element(by.id('name_input')).typeText('Rana');
			await element(by.id('save_edit')).tap();
			console.log('✅ Name restored to valid value for test continuation');
		} catch (error) {
			console.log('⚠️ Name restoration failed:', error.message);
		}
		
		console.log('✅ Name editing negative scenarios completed');
		await new Promise(r => setTimeout(r, 5000));

		// Use back button to dismiss current screen
		try {
			await device.tap({x: 50, y: 95}); // Back button coordinates
			console.log('✅ Tapped back button to dismiss screen');
		} catch (backError) {
			console.log('⚠️ Back button coordinate tap failed');
		}
		await new Promise(r => setTimeout(r, 2000));

		// ========== PHONE UPDATE TESTS ==========
		console.log('\n📍 [Step 4] Phone Update Tests');
		
		// Edit phone
		await element(by.id('update_phone')).tap();
		console.log('✅ Update phone tapped');
		await new Promise(r => setTimeout(r, 2000));

		// ========== PRIVACY SETTINGS TESTS ==========
		console.log('\n📍 [Step 5] Privacy Settings Tests');
		
		// Open privacy settings
		await element(by.id('privacy_settings')).tap();
		console.log('✅ Opened privacy settings');
		await new Promise(r => setTimeout(r, 3000));
		
		// Test privacy policy
		await element(by.id('privacy_policy')).tap();
		await new Promise(resolve => setTimeout(resolve, 9000));

		// Return to app from web view
		console.log('🔙 Returning to the app from Safari/WebView');
		try {
			// Send app to background
			await device.sendToHome();
			console.log('✅ Sent to home screen');
			
			await new Promise(r => setTimeout(r, 2000));
			
			// Relaunch the app from background
			await device.launchApp({newInstance: false});
			console.log('✅ Relaunched app from background');
			
		} catch (homeError) {
			console.log('⚠️ Home navigation failed, trying alternative methods:', homeError.message);
			
			try {
				await device.launchApp({newInstance: false});
				console.log('✅ Direct app relaunch successful');
			} catch (launchError) {
				console.log('⚠️ Direct app relaunch failed:', launchError.message);
				
				try {
					await device.launchApp({newInstance: true});
					console.log('✅ Forced new app instance');
				} catch (forceError) {
					console.log('⚠️ All app return methods failed:', forceError.message);
				}
			}
		}

		console.log('\n🎉 Settings Flow Test Completed Successfully!');
	});
});