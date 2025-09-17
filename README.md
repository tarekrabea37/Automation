# E2E Testing - Motherbeing App

## 🧪 Overview

This directory contains comprehensive End-to-End (E2E) tests for the Motherbeing React Native application using Detox testing framework. The tests cover the complete user authentication flow, chat functionality, navigation, and various edge cases.

## 🚀 Test Coverage

### Core Authentication Flow
- **Welcome Screen**: Initial app loading and welcome screen interaction
- **Phone Input**: Phone number validation with country code selection
- **OTP Verification**: SMS verification code handling
- **User Registration**: Complete user onboarding process

### Advanced Features
- **Country Selection**: Multi-country support with smart search and swipe navigation
- **Chat System**: AI-powered messaging with response validation
- **Profile Management**: Name editing with comprehensive validation
- **Settings Navigation**: Complete settings flow testing
- **Phone Number Updates**: Country selection and phone number modification

### Negative Scenario Testing
- **Invalid Phone Numbers**: Format validation and error handling
- **Invalid OTP Codes**: Code validation and rejection scenarios
- **Empty Field Validation**: Required field validation
- **Rapid Input Testing**: Performance under rapid user interactions
- **Navigation Edge Cases**: Tab switching and deep navigation scenarios

```

#### Welcome Screen Testing
- App launch and loading verification
- Welcome screen element visibility
- "Get Started" button interaction

#### Phone Input Validation
- **Valid Formats**: International phone number formats
- **Invalid Formats**: Malformed numbers, letters, special characters
- **Empty Input**: Required field validation
- **Country Selection**: Multi-country support with search

#### OTP Verification
- **Valid OTP**: Successful verification flow
- **Invalid OTP**: Wrong codes, expired codes
- **Empty OTP**: Required field validation
- **Manual Entry**: Real OTP input testing

#### Country Selection Advanced Testing
- **Search Functionality**: Country search with scroll
- **Swipe Navigation**: Smart swipe gestures for list navigation
- **Multiple Countries**: Brunei Darussalam and Egypt selection
- **Fallback Mechanisms**: Coordinate-based tapping when elements not visible

### 2. Chat System Testing

#### Basic Chat Functionality
- Chat modal opening and closing
- Message input and sending
- AI response validation
- Typing indicators

#### Advanced Chat Features
- **Multiple Messages**: Conversation flow testing
- **Long Messages**: Message length handling
- **Rapid Messaging**: Performance under quick inputs
- **Empty Messages**: Validation and error handling

#### Background Testing
- App backgrounding during chat
- Notification handling
- Return to chat functionality

### 3. Navigation Testing

#### Tab Navigation
- Home tab interaction
- Diagnoses tab switching
- Programs tab navigation
- Period tracker tab access

#### Deep Navigation
- Settings screen access
- Profile editing navigation
- Back button functionality
- Navigation state management

### 4. Profile Management

#### Name Editing
- **Valid Names**: Successful name updates
- **Invalid Names**: Empty names, special characters
- **Long Names**: Length validation
- **Rapid Editing**: Performance testing

#### Settings Navigation
- Settings screen access
- Profile update navigation
- Back navigation with multiple methods

```

## 📊 Test Results & Reporting

### Success Indicators
- ✅ Authentication flow completion
- ✅ Country selection functionality
- ✅ Chat system responsiveness
- ✅ Navigation stability
- ✅ Form validation accuracy

### Common Issues & Solutions

#### Element Not Found
```bash
# Solution: Use coordinate tapping or wait strategies
HINT: To print view hierarchy on failed actions/matches, use log-level verbose
```

#### Timeout Issues
```javascript
// Increase timeout for slow operations
await waitFor(element(by.id('slow-element')))
    .toBeVisible()
    .withTimeout(10000); // 10 seconds
```

#### Scroll/Swipe Issues
```javascript
// Use swipe instead of scroll for better reliability
await element(by.id('scrollable-list')).swipe('up', 'slow', 0.7);
```

## 🐛 Debugging

### Verbose Logging

```bash
# Run with detailed logs
detox test --configuration ios.sim.debug --loglevel verbose
```

### Element Inspection

```bash
# Print view hierarchy for debugging
detox test --configuration ios.sim.debug --loglevel trace
```

### Screenshot Capture

```javascript
// Capture screenshots during test failures
await device.takeScreenshot('failure-screenshot');
```

## 📈 Performance Considerations

### Test Optimization
- **Parallel Execution**: Run tests in parallel when possible
- **Smart Waits**: Use appropriate timeouts for different operations
- **Resource Cleanup**: Proper test cleanup and resource management

### CI/CD Integration

```yaml
# Example GitHub Actions workflow
- name: Run E2E Tests
  run: |
    detox build --configuration ios.sim.debug
    detox test --configuration ios.sim.debug --cleanup
```

## 🔄 Continuous Integration

### Automated Testing
- Pre-commit hooks for test validation
- Pull request testing automation
- Nightly comprehensive test runs

### Test Maintenance
- Regular test updates for new features
- Element selector maintenance
- Performance optimization

## 📚 Best Practices

### Test Writing
1. **Descriptive Test Names**: Clear, specific test descriptions
2. **Robust Selectors**: Use stable element identifiers
3. **Error Handling**: Comprehensive fallback strategies
4. **Logging**: Detailed console output for debugging
5. **Cleanup**: Proper test state management

### Element Interaction
1. **Wait Strategies**: Always wait for elements before interaction
2. **Fallback Methods**: Multiple interaction strategies
3. **Coordinate Backup**: Use coordinates when selectors fail
4. **Timeout Management**: Appropriate timeouts for different operations

### Maintenance
1. **Regular Updates**: Keep tests updated with app changes
2. **Selector Validation**: Verify element selectors regularly
3. **Performance Monitoring**: Track test execution times
4. **Documentation**: Keep test documentation current

## 🆘 Troubleshooting

### Common Issues

1. **App Not Building**
   - Check React Native environment setup
   - Verify iOS/Android development tools
   - Clean build directories

2. **Tests Timing Out**
   - Increase test timeouts
   - Check app performance
   - Verify simulator/emulator performance

3. **Elements Not Found**
   - Use verbose logging to inspect view hierarchy
   - Verify element testIDs in app code
   - Use coordinate fallbacks

4. **Flaky Tests**
   - Add appropriate wait strategies
   - Implement retry mechanisms
   - Check for race conditions

## 📞 Support

For E2E testing support:
- Check Detox documentation: https://wix.github.io/Detox/
- Review test logs for specific error messages
- Use verbose logging for detailed debugging information

---

**Comprehensive E2E testing ensures robust app functionality and user experience! 🧪✅**
