# EdgeReader Test Matrix

**Version:** 1.0  
**Last Updated:** December 30, 2025  
**Purpose:** Minimal manual test cases mapped to acceptance criteria

---

## How to Use This Matrix

1. **During PLAN phase:** Identify which test cases apply to your epic
2. **During IMPLEMENT phase:** Execute relevant test cases
3. **Document results:** Record Pass/Fail and notes in `EVIDENCE.md`
4. **Before release:** Execute all test cases for comprehensive validation

---

## Test Environment Requirements

### Devices
- **Mid-range device:** 2-year-old flagship equivalent (e.g., Pixel 5, Galaxy S20)
  - Android 8.0 (API 26) minimum
  - 2GB RAM minimum
- **Low-end device:** Budget device (e.g., Moto G series)
  - Android 8.0 (API 26)
  - 1-2GB RAM

### Network Conditions
- **4G:** Average mobile network (10-20 Mbps)
- **Offline:** Airplane mode enabled
- **Slow 3G:** Throttled connection (use Chrome DevTools or Network Link Conditioner)

### Tools
- **Network inspector:** Charles Proxy, mitmproxy, or Android Studio Network Profiler
- **Performance profiler:** Android Studio Profiler
- **Logcat:** For crash logs and timing measurements

---

## Test Cases by Acceptance Criteria

### AC-1: Feed Aggregation and Refresh
**Requirement:** Given the app is launched, when the user pulls to refresh, then at least 50 unique articles from 10+ sources are fetched and displayed within 3 seconds.

| Test ID | Test Case | Steps | Expected Result | Pass/Fail | Notes |
|---------|-----------|-------|-----------------|-----------|-------|
| TC-AC1-01 | Pull-to-refresh on launch | 1. Launch app<br>2. Pull down to refresh | 50+ articles displayed within 3s | | |
| TC-AC1-02 | Verify 10+ sources | 1. Pull to refresh<br>2. Scroll through feed<br>3. Check source names | At least 10 unique sources visible | | |
| TC-AC1-03 | Verify article uniqueness | 1. Pull to refresh<br>2. Scroll through feed | No duplicate articles (same URL) | | |
| TC-AC1-04 | Refresh on slow network | 1. Enable slow 3G<br>2. Pull to refresh | Articles load (may take > 3s, show loading indicator) | | |

**Related Epics:** 1.1, 1.2, 3.1

---

### AC-2: Topic-Based Ranking
**Requirement:** Given the user selects "Technology" and "Science" topics in preferences, when the feed is displayed, then articles tagged with these topics appear higher in the list than other topics.

| Test ID | Test Case | Steps | Expected Result | Pass/Fail | Notes |
|---------|-----------|-------|-----------------|-----------|-------|
| TC-AC2-01 | Select topics in onboarding | 1. First launch<br>2. Select "Technology" and "Science"<br>3. Complete onboarding | Feed shows Tech/Science articles at top | | |
| TC-AC2-02 | Change topics in settings | 1. Open settings<br>2. Change topics to "Politics"<br>3. Return to feed | Feed re-ranks, Politics articles at top | | |
| TC-AC2-03 | Verify ranking order | 1. Select "Technology" only<br>2. Scroll feed<br>3. Note article topics | Technology articles appear before General articles | | |

**Related Epics:** 2.0, 2.1, 2.2

---

### AC-3: Privacy - No User Data Transmission
**Requirement:** Given the user has set preferences, when network traffic is inspected, then no user preference data is transmitted to any server.

| Test ID | Test Case | Steps | Expected Result | Pass/Fail | Notes |
|---------|-----------|-------|-----------------|-----------|-------|
| TC-AC3-01 | Inspect network traffic | 1. Set up Charles Proxy<br>2. Configure preferences<br>3. Pull to refresh<br>4. Review captured requests | No user data in request headers/body | | |
| TC-AC3-02 | Verify HTTPS only | 1. Inspect network traffic<br>2. Check all requests | All requests use HTTPS (no HTTP) | | |
| TC-AC3-03 | Check for tracking IDs | 1. Inspect network traffic<br>2. Search for: userId, deviceId, advertisingId | No tracking identifiers found | | |

**Related Epics:** All (privacy is cross-cutting)

---

### AC-4: External Browser Integration
**Requirement:** Given an article is displayed, when the user taps it, then the article URL opens in the device's default browser (verified by testing with Brave, Chrome, Firefox).

| Test ID | Test Case | Steps | Expected Result | Pass/Fail | Notes |
|---------|-----------|-------|-----------------|-----------|-------|
| TC-AC4-01 | Open article in Chrome | 1. Set Chrome as default browser<br>2. Tap article | Article opens in Chrome (not in-app) | | |
| TC-AC4-02 | Open article in Brave | 1. Set Brave as default browser<br>2. Tap article | Article opens in Brave | | |
| TC-AC4-03 | Open article in Firefox | 1. Set Firefox as default browser<br>2. Tap article | Article opens in Firefox | | |
| TC-AC4-04 | No browser installed | 1. Uninstall all browsers (emulator)<br>2. Tap article | Toast message: "No browser found" | | |

**Related Epics:** 1.3

---

### AC-5: Onboarding Minimum Selection
**Requirement:** Given the app is installed and launched for the first time, when the user completes onboarding, then at least 3 topics or sources must be selected before proceeding to the main feed.

| Test ID | Test Case | Steps | Expected Result | Pass/Fail | Notes |
|---------|-----------|-------|-----------------|-----------|-------|
| TC-AC5-01 | Try to skip with 0 selections | 1. First launch<br>2. Don't select anything<br>3. Tap "Continue" | Button disabled or error message | | |
| TC-AC5-02 | Try to skip with 2 selections | 1. First launch<br>2. Select 2 topics<br>3. Tap "Continue" | Button disabled or error message | | |
| TC-AC5-03 | Complete with 3 selections | 1. First launch<br>2. Select 3 topics<br>3. Tap "Continue" | Proceeds to main feed | | |
| TC-AC5-04 | Onboarding shown once only | 1. Complete onboarding<br>2. Close app<br>3. Relaunch app | Main feed shown (no onboarding) | | |

**Related Epics:** 2.2

---

### AC-6: Settings Update Ranking
**Requirement:** Given the user is on the settings screen, when they add a new keyword preference and return to the feed, then articles matching that keyword are ranked higher within 5 seconds.

| Test ID | Test Case | Steps | Expected Result | Pass/Fail | Notes |
|---------|-----------|-------|-----------------|-----------|-------|
| TC-AC6-01 | Add keyword in settings | 1. Open settings<br>2. Add keyword "AI"<br>3. Return to feed | Articles with "AI" in title/description ranked higher | | |
| TC-AC6-02 | Remove keyword | 1. Open settings<br>2. Remove keyword "AI"<br>3. Return to feed | Ranking updates (AI articles no longer boosted) | | |
| TC-AC6-03 | Verify update speed | 1. Add keyword<br>2. Time how long until feed updates | Feed updates within 5 seconds | | |

**Related Epics:** 2.1, 4.1

---

### AC-7: Offline Mode
**Requirement:** Given the user has previously loaded the feed, when the device is offline, then cached article headlines and metadata are still displayed (at least last 100 articles).

| Test ID | Test Case | Steps | Expected Result | Pass/Fail | Notes |
|---------|-----------|-------|-----------------|-----------|-------|
| TC-AC7-01 | View cached articles offline | 1. Load feed (online)<br>2. Enable airplane mode<br>3. Relaunch app | Cached articles displayed | | |
| TC-AC7-02 | Verify 100 articles cached | 1. Load feed (online)<br>2. Enable airplane mode<br>3. Scroll through feed | At least 100 articles visible | | |
| TC-AC7-03 | Pull-to-refresh offline | 1. Enable airplane mode<br>2. Pull to refresh | Error message: "No internet connection" | | |
| TC-AC7-04 | Tap article offline | 1. Enable airplane mode<br>2. Tap cached article | Article opens in browser (may show browser offline page) | | |

**Related Epics:** 3.0, 3.1

---

### AC-8: Performance Thresholds
**Requirement:** Given the app is tested on a mid-range Android device, when launched, then startup time is under 1 second and feed loads within 2 seconds on 4G.

| Test ID | Test Case | Steps | Expected Result | Pass/Fail | Notes |
|---------|-----------|-------|-----------------|-----------|-------|
| TC-AC8-01 | Measure cold start time | 1. Force stop app<br>2. Launch app<br>3. Measure time to first frame (logcat) | < 1 second | | |
| TC-AC8-02 | Measure feed load time | 1. Launch app<br>2. Measure time to articles displayed | < 2 seconds on 4G | | |
| TC-AC8-03 | Verify 60 FPS scrolling | 1. Enable GPU rendering profile<br>2. Scroll through feed | Green bars (60 FPS) | | |
| TC-AC8-04 | Check APK size | 1. Build release APK<br>2. Check file size | < 25 MB | | |

**Related Epics:** All (performance is cross-cutting), 5.1

---

### AC-9: Crash Reporting Opt-Out
**Requirement:** Given the user opens settings, when they toggle crash reporting off, then no crash data is sent to any server even if a crash occurs.

| Test ID | Test Case | Steps | Expected Result | Pass/Fail | Notes |
|---------|-----------|-------|-----------------|-----------|-------|
| TC-AC9-01 | Disable crash reporting | 1. Open settings<br>2. Toggle crash reporting OFF<br>3. Trigger crash (test button)<br>4. Check Firebase/Sentry dashboard | No crash report received | | |
| TC-AC9-02 | Enable crash reporting | 1. Open settings<br>2. Toggle crash reporting ON<br>3. Trigger crash<br>4. Check dashboard | Crash report received | | |
| TC-AC9-03 | Default state is enabled | 1. First launch<br>2. Check settings | Crash reporting toggle is ON | | |

**Related Epics:** 4.0, 4.1

---

### AC-10: Crash Report PII Scrubbing
**Requirement:** Given crash reporting is enabled and a crash occurs, when crash logs are inspected, then they contain no user preferences, article URLs, or any identifiable information beyond device model, OS version, and stack trace.

| Test ID | Test Case | Steps | Expected Result | Pass/Fail | Notes |
|---------|-----------|-------|-----------------|-----------|-------|
| TC-AC10-01 | Inspect crash report | 1. Enable crash reporting<br>2. Trigger crash<br>3. View crash report in dashboard | Only: stack trace, device model, OS version, app version | | |
| TC-AC10-02 | Verify no user preferences | 1. Set preferences (topics, keywords)<br>2. Trigger crash<br>3. Inspect crash report | No topics, keywords, or sources in report | | |
| TC-AC10-03 | Verify no article URLs | 1. Load feed<br>2. Tap article<br>3. Trigger crash<br>4. Inspect crash report | No article URLs in breadcrumbs or logs | | |

**Related Epics:** 4.0

---

### AC-11: Google Play Compliance
**Requirement:** Given the app is submitted to Google Play, when reviewed, then it passes all privacy and content policy checks.

| Test ID | Test Case | Steps | Expected Result | Pass/Fail | Notes |
|---------|-----------|-------|-----------------|-----------|-------|
| TC-AC11-01 | Data Safety form accuracy | 1. Fill Data Safety form<br>2. Select "No data collected" (except crash reports)<br>3. Submit | Form accepted | | |
| TC-AC11-02 | Privacy policy published | 1. Check privacy policy URL<br>2. Verify all sections present | Policy accessible and complete | | |
| TC-AC11-03 | Source attribution visible | 1. Launch app<br>2. Check feed | Source name visible for each article | | |
| TC-AC11-04 | Pre-launch report | 1. Submit to internal testing<br>2. Review pre-launch report | No critical issues | | |

**Related Epics:** 5.0, 5.1

---

### AC-12: Material Design 3 Compliance
**Requirement:** Given the feed is displayed, when evaluated against Material Design 3 guidelines, then it uses modern components (Material You theming, elevation, typography).

| Test ID | Test Case | Steps | Expected Result | Pass/Fail | Notes |
|---------|-----------|-------|-----------------|-----------|-------|
| TC-AC12-01 | Verify Material You theming | 1. Launch app<br>2. Check colors | Dynamic colors from wallpaper (Android 12+) | | |
| TC-AC12-02 | Verify card elevation | 1. View feed<br>2. Check article cards | Cards have subtle elevation/shadow | | |
| TC-AC12-03 | Verify typography | 1. View feed<br>2. Check text styles | Uses Material Design 3 type scale | | |
| TC-AC12-04 | Accessibility | 1. Enable TalkBack<br>2. Navigate feed | Content descriptions present for images | | |

**Related Epics:** 4.2

---

### AC-13: GPL-3.0 License Visibility
**Requirement:** Given the code is published on GitHub, when a third party views the repository, then the GPL-3.0 license is clearly stated in LICENSE file and README.

| Test ID | Test Case | Steps | Expected Result | Pass/Fail | Notes |
|---------|-----------|-------|-----------------|-----------|-------|
| TC-AC13-01 | LICENSE file present | 1. View GitHub repo<br>2. Check root directory | LICENSE file exists with GPL-3.0 text | | |
| TC-AC13-02 | README mentions license | 1. View README.md<br>2. Search for "license" | GPL-3.0 mentioned with link to LICENSE | | |
| TC-AC13-03 | GitHub badge | 1. View GitHub repo | License badge visible (optional but nice) | | |

**Related Epics:** 1.0

---

## Cross-Cutting Test Cases

### Privacy (All Epics)
| Test ID | Test Case | Steps | Expected Result | Pass/Fail | Notes |
|---------|-----------|-------|-----------------|-----------|-------|
| TC-PRIV-01 | No analytics SDKs | 1. Inspect build.gradle<br>2. Search for: firebase-analytics, google-analytics | No analytics dependencies | | |
| TC-PRIV-02 | No advertising IDs | 1. Inspect code<br>2. Search for: AdvertisingIdClient, GAID | No advertising ID usage | | |
| TC-PRIV-03 | Local storage only | 1. Inspect code<br>2. Check data layer | Only DataStore and Room used (no cloud) | | |

### Performance (All Epics)
| Test ID | Test Case | Steps | Expected Result | Pass/Fail | Notes |
|---------|-----------|-------|-----------------|-----------|-------|
| TC-PERF-01 | No blocking on main thread | 1. Enable StrictMode<br>2. Use app | No StrictMode violations | | |
| TC-PERF-02 | Image loading async | 1. Load feed<br>2. Profile with Android Studio | Images loaded on background thread | | |
| TC-PERF-03 | Database queries optimized | 1. Profile database queries<br>2. Check query time | Queries < 100ms | | |

### Security (All Epics)
| Test ID | Test Case | Steps | Expected Result | Pass/Fail | Notes |
|---------|-----------|-------|-----------------|-----------|-------|
| TC-SEC-01 | HTTPS only | 1. Inspect network traffic<br>2. Check all requests | All requests use HTTPS | | |
| TC-SEC-02 | No hardcoded secrets | 1. Search codebase for: "api_key", "token", "password" | No hardcoded secrets | | |
| TC-SEC-03 | Input validation | 1. Add custom RSS URL with invalid format<br>2. Try to save | Error message, invalid URL rejected | | |

---

## Test Execution Log Template

Copy this template into `EVIDENCE.md` for each epic:

```markdown
## Manual Test Results

### Test Execution Date: [YYYY-MM-DD]
### Tester: [Name]
### Device: [Model, Android version]
### Network: [4G / WiFi / Offline]

| Test ID | Result | Notes |
|---------|--------|-------|
| TC-AC1-01 | PASS | 62 articles loaded in 2.1s |
| TC-AC1-02 | PASS | 12 unique sources verified |
| TC-AC1-03 | PASS | No duplicates found |
| ... | ... | ... |

### Issues Found
1. [Issue description] → [Resolution or tracking issue #]
2. [Issue description] → [Resolution or tracking issue #]

### Screenshots
- [Attach or link to screenshots]
```

---

## Regression Testing (Before Release)

Execute all test cases in this matrix before submitting to Google Play. Document results in `specs/014-release-prep/EVIDENCE.md`.

**Minimum devices:**
- Mid-range device (Android 8.0)
- Low-end device (Android 8.0)
- Latest Android version (Android 14+)

**Minimum network conditions:**
- 4G
- Offline
- Slow 3G (optional but recommended)

---

**Document Version:** 1.0  
**Maintained By:** Project maintainer (solo dev)  
**Next Review:** After BP2 completion

**Change Log:**
- 2025-12-30: Initial test matrix created with all AC test cases
