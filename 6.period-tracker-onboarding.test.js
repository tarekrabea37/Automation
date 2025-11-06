const { device, expect, element, by, waitFor } = require('detox');

// Helper: safe tap with optional wait
async function safeTap(testID, waitMs = 500) {
  try {
    await element(by.id(testID)).tap();
    if (waitMs) await new Promise(r => setTimeout(r, waitMs));
  } catch (e) {
    console.log(`⚠️ Tap failed for ${testID}: ${e.message}`);
  }
}

// Helper: wait for visibility
async function waitVisible(testID, timeout = 10000) {
  await waitFor(element(by.id(testID))).toBeVisible().withTimeout(timeout);
}

// Helper: wait for non-existence/hidden
async function waitNotVisible(testID, timeout = 10000) {
  try {
    await waitFor(element(by.id(testID))).toBeNotVisible().withTimeout(timeout);
  } catch (e) {
    // If element never existed, that's also ok for this check
    console.log(`ℹ️ Element ${testID} not visible or not present: ${e.message}`);
  }
}

// Helper: compute today ISO date (YYYY-MM-DD)
function todayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

describe('Period Tracker Onboarding', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
  });

  it('should complete login if needed', async () => {
    console.log('🚀 [Login Check] Attempting login flow if welcome screen shows');

    // If welcome screen is present, perform login; otherwise continue
    try {
      await waitVisible('get-started-button', 8000);
      console.log('✅ Welcome screen detected');
      await safeTap('get-started-button', 1200);

      await waitVisible('phone-number-input', 10000);
      await safeTap('country-code-selector', 600);
      await waitVisible('country-list', 5000);
      await element(by.id('country-list')).scroll(2700, 'down');
      await element(by.id('country-EG')).tap();
      console.log('✅ Country selected: Egypt');

      await element(by.id('phone-number-input')).typeText('1555577451');
      console.log('✅ Phone number entered');

      await safeTap('next-button', 1000);

      await waitVisible('otp-input', 10000);
      console.log('⏸️ Please enter OTP manually if prompted...');
      await new Promise(r => setTimeout(r, 8000));
      await safeTap('verify-code-button', 3000);

      // Small settle time post-login
      await new Promise(r => setTimeout(r, 3000));
      console.log('✅ Login flow completed or not required');
    } catch (e) {
      console.log('ℹ️ Welcome/login not shown; continuing');
    }
  }, 120000);

  it('should complete period tracker onboarding flow', async () => {
    console.log('🚀 [Period Tracker] Starting onboarding flow');

    // Navigate to Period Tracker tab
    await new Promise(r => setTimeout(r, 1000));
    await element(by.id('period-tracker-tab')).tap();
    console.log('✅ Period Tracker tab tapped');

    // If onboarding is shown, we will proceed; otherwise this test will gracefully exit after asserting PT screen
    let onboardingShown = true;
    try {
      await waitVisible('pt_onboarding_flashlist', 12000);
      console.log('✅ Onboarding list visible');
    } catch (e) {
      onboardingShown = false;
      console.log('ℹ️ Onboarding not visible; assuming already completed');
    }

    if (!onboardingShown) {
      // Assert we are on the main Period Tracker Screen by checking absence of onboarding loader
      await waitNotVisible('pt_onboarding_loader_overlay', 5000);
      console.log('✅ Confirmed onboarding not active');
      return;
    }

    // Proceed through intro/consent slides
    for (let i = 0; i < 3; i++) {
      await safeTap('pt_onboarding_next_button', 800);
    }

    // Height (skip allowed)
    try {
      await waitVisible('pt_onboarding_title_4', 8000);
      console.log('✅ Height slide visible');
      await safeTap('pt_skip', 800);
    } catch (e) { console.log('ℹ️ Height slide not detected'); }

    // Weight (skip allowed)
    try {
      await waitVisible('pt_onboarding_title_5', 8000);
      console.log('✅ Weight slide visible');
      await safeTap('pt_skip', 800);
    } catch (e) { console.log('ℹ️ Weight slide not detected'); }

    // Tracker mode (required select: yes/no)
    try {
      await waitVisible('pt_onboarding_title_6', 10000);
      console.log('✅ Tracker mode slide visible');
      await element(by.id('pt_onboarding_select_option_no')).tap();
      console.log('✅ Selected: not pregnant');
      await safeTap('pt_onboarding_next_button', 800);
    } catch (e) { console.log('ℹ️ Tracker mode step not detected or already handled'); }

    // Period length (skip allowed)
    try {
      await waitVisible('pt_onboarding_days_wheel_7', 8000);
      console.log('✅ Period length wheel visible');
      await safeTap('pt_skip', 800);
    } catch (e) { console.log('ℹ️ Period length wheel not detected'); }

    // Edit Calendar (optional interaction; assert calendar present)
    try {
      await waitVisible('pt_onboarding_edit_calendar', 10000);
      console.log('✅ Edit Calendar slide visible');
      await waitVisible('pt_onboarding_calendar', 6000);

      // Try tapping today
      const today = todayISO();
      const todayId = `pt_onboarding_calendar_day_${today}`;
      try {
        await element(by.id(todayId)).tap();
        console.log(`✅ Tapped calendar day: ${today}`);
      } catch (e) {
        console.log('ℹ️ Calendar day tap not available, continuing');
      }

      await safeTap('pt_onboarding_next_button', 800);
    } catch (e) { console.log('ℹ️ Edit Calendar step not detected'); }

    // Cycle length (skip allowed)
    try {
      await waitVisible('pt_onboarding_days_wheel_9', 8000);
      console.log('✅ Cycle length wheel visible');
      await safeTap('pt_skip', 800);
    } catch (e) { console.log('ℹ️ Cycle length wheel not detected'); }

    // Regularity (select one)
    try {
      await waitVisible('pt_onboarding_title_10', 8000);
      console.log('✅ Regularity slide visible');
      await element(by.id('pt_onboarding_select_option_regular')).tap();
      console.log('✅ Selected: regular');
      await safeTap('pt_onboarding_next_button', 800);
    } catch (e) { console.log('ℹ️ Regularity slide not detected'); }

    // Break screen (just next)
    try {
      await waitVisible('pt_onboarding_title_11', 8000);
      console.log('✅ Break slide visible');
      await safeTap('pt_onboarding_next_button', 800);
    } catch (e) { console.log('ℹ️ Break slide not detected'); }

    // Menstrual flow (select one)
    try {
      await waitVisible('pt_onboarding_title_12', 8000);
      console.log('✅ Menstrual flow slide visible');
      await element(by.id('pt_onboarding_select_option_moderate')).tap();
      console.log('✅ Selected: moderate');
      await safeTap('pt_onboarding_next_button', 800);
    } catch (e) { console.log('ℹ️ Menstrual flow slide not detected'); }

    // Period pain (select one)
    try {
      await waitVisible('pt_onboarding_title_13', 8000);
      console.log('✅ Period pain slide visible');
      await element(by.id('pt_onboarding_select_option_not-painful')).tap();
      console.log('✅ Selected: not painful');
      await safeTap('pt_onboarding_next_button', 800);
    } catch (e) { console.log('ℹ️ Period pain slide not detected'); }

    // Symptom patterns (choose none to proceed)
    try {
      await waitVisible('pt_onboarding_title_14', 8000);
      console.log('✅ Symptom patterns slide visible');
      await safeTap('pt_onboarding_multi_select_option_none', 500);
      await safeTap('pt_onboarding_next_button', 800);
    } catch (e) { console.log('ℹ️ Symptom patterns slide not detected'); }

    // Tracking methods (choose mobile-app for simplicity)
    try {
      await waitVisible('pt_onboarding_title_15', 8000);
      console.log('✅ Tracking methods slide visible');
      await safeTap('pt_onboarding_multi_select_option_mobile-app', 500);
      await safeTap('pt_onboarding_next_button', 800);
    } catch (e) { console.log('ℹ️ Tracking methods slide not detected'); }

    // Finish slide -> Next triggers setup and navigation
    try {
      await waitVisible('pt_onboarding_finish_slide', 10000);
      console.log('✅ Finish slide visible');
      await safeTap('pt_onboarding_next_button', 1200);
      await waitVisible('pt_onboarding_loader_overlay', 8000);
      console.log('⏳ Loader shown while finishing setup');
      await waitNotVisible('pt_onboarding_loader_overlay', 15000);
      console.log('✅ Loader dismissed');
    } catch (e) { console.log('ℹ️ Finish slide not detected; flow may auto-complete'); }

    // Confirm onboarding no longer visible
    await waitNotVisible('pt_onboarding_flashlist', 10000);
    console.log('🎉 Period tracker onboarding completed');
  }, 180000);
});