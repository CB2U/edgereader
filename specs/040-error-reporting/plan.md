# Implementation Plan: Epic 4.0 - Error Reporting with Opt-Out

**Spec:** [spec.md](./spec.md)  
**Epic:** 4.0 - Error Reporting with Opt-Out  
**Last Updated:** December 31, 2025

---

## Architecture Overview

### Key Components

1. **Sentry SDK Integration (`main.jsx`)**
   - Initialize Sentry Browser SDK with DSN from environment variable
   - Implement `beforeSend` hook for PII scrubbing
   - Check user preference to enable/disable client

2. **Preference Storage (`preferencesService.js`)**
   - Extend existing preferences service to store `errorReportingEnabled` flag
   - Default value: `true` (opt-out model)
   - Persist to IndexedDB

3. **Settings UI Component (`SettingsPanel.jsx` or new component)**
   - Add toggle switch for error reporting
   - Display clear explanation of what data is collected
   - Save preference changes immediately

4. **PII Scrubbing (`sentryConfig.js`)**
   - Centralized Sentry configuration
   - `beforeSend` hook to remove sensitive data
   - Whitelist only: stack trace, browser, OS, app version

### Module Boundaries

```
src/
├── main.jsx                    # Sentry initialization
├── config/
│   └── sentryConfig.js         # Sentry config + PII scrubbing (NEW)
├── services/
│   └── preferencesService.js   # Extended with errorReportingEnabled
└── components/
    └── SettingsPanel.jsx       # Error reporting toggle (MODIFIED)
```

### Message/Call Flow

1. **App Initialization:**
   ```
   main.jsx
   └─> preferencesService.getErrorReportingEnabled()
       └─> IndexedDB.get('preferences', 'errorReportingEnabled')
           └─> Sentry.init({ enabled: <result> })
   ```

2. **User Toggles Setting:**
   ```
   SettingsPanel.jsx
   └─> handleToggle(enabled)
       ├─> preferencesService.setErrorReportingEnabled(enabled)
       │   └─> IndexedDB.put('preferences', { errorReportingEnabled: enabled })
       └─> Sentry.getCurrentHub().getClient().getOptions().enabled = enabled
   ```

3. **Error Occurs:**
   ```
   Error thrown
   └─> Sentry SDK captures
       └─> beforeSend hook
           ├─> Scrub PII (remove user, request, breadcrumbs)
           └─> Send to Sentry.io (if enabled)
   ```

### Alternatives Considered

| Alternative | Pros | Cons | Decision |
|-------------|------|------|----------|
| **Self-hosted Sentry** | Full data control, no third-party | Requires server infrastructure, maintenance burden | ❌ Rejected: Too complex for MVP, Sentry.io free tier sufficient |
| **Custom error reporting** | No external dependencies | Requires building entire backend, UI, alerting | ❌ Rejected: Not feasible for solo dev |
| **No error reporting** | Simplest, no privacy concerns | No visibility into production errors | ❌ Rejected: Debugging production issues too difficult |
| **Sentry.io hosted (chosen)** | Easy setup, free tier, privacy-respecting with PII scrubbing | Relies on third-party service | ✅ **Chosen**: Best balance of simplicity and functionality |

---

## Data Contracts

### Sentry Event (After PII Scrubbing)

```javascript
{
  "event_id": "uuid",
  "timestamp": 1234567890,
  "platform": "javascript",
  "level": "error",
  "exception": {
    "values": [{
      "type": "TypeError",
      "value": "Cannot read property 'foo' of undefined",
      "stacktrace": {
        "frames": [...]
      }
    }]
  },
  "contexts": {
    "browser": {
      "name": "Chrome",
      "version": "120.0.0"
    },
    "os": {
      "name": "Linux",
      "version": "6.5.0"
    }
  },
  "release": "edgereader@1.0.0",
  // REMOVED: user, request, breadcrumbs, custom tags/context
}
```

### User Preference Schema (Extended)

```javascript
{
  selectedTopics: Set<string>,           // Existing
  enabledSources: Set<string>,           // Existing
  disabledSources: Set<string>,          // Existing
  keywords: Set<string>,                 // Existing
  errorReportingEnabled: boolean         // NEW (default: true)
}
```

---

## Storage and Persistence

### IndexedDB Schema Extension

**Object Store:** `preferences`  
**Key:** `userPreferences`  
**Value:** (extended with new field)

```javascript
{
  // ... existing fields ...
  errorReportingEnabled: true  // NEW field
}
```

**Migration:** No migration needed. If field is missing, default to `true`.

---

## External Integrations

### Sentry.io

**Service:** Sentry Browser SDK  
**Package:** `@sentry/react`  
**Endpoint:** `https://o<org-id>.ingest.sentry.io/api/<project-id>/envelope/`  
**Authentication:** DSN (Data Source Name) from environment variable

**Environment Variable:**
```bash
VITE_SENTRY_DSN=https://<key>@<org-id>.ingest.sentry.io/<project-id>
```

**Configuration:**
- **enabled:** Controlled by user preference
- **beforeSend:** PII scrubbing hook
- **tracesSampleRate:** 0 (no performance monitoring)
- **replaysSessionSampleRate:** 0 (no session replay)
- **integrations:** Default integrations only (no breadcrumbs)

---

## UX and Operational States

### Settings Screen - Error Reporting Toggle

**UI Component:** Material UI `Switch` component

**States:**
1. **Enabled (default):**
   - Toggle: ON
   - Label: "Anonymous Error Reporting"
   - Description: "Help improve EdgeReader by sending anonymous crash reports. Only technical data is collected (browser, OS, error details). No personal information or browsing history is sent."
   - Action: Errors sent to Sentry

2. **Disabled (user opted out):**
   - Toggle: OFF
   - Label: "Anonymous Error Reporting"
   - Description: "Error reporting is disabled. No data is sent."
   - Action: Errors logged to console only, not sent to Sentry

**Interaction:**
- User clicks toggle → Preference saved immediately → Sentry client enabled/disabled
- Change persists across sessions
- No page reload required

---

## Testing Plan

### Unit Tests

**File:** `src/config/sentryConfig.test.js` (NEW)

**Tests:**
1. `beforeSend` hook removes `event.user`
2. `beforeSend` hook removes `event.request`
3. `beforeSend` hook clears `event.breadcrumbs`
4. `beforeSend` hook preserves stack trace
5. `beforeSend` hook preserves browser/OS context

**Run command:**
```bash
npm test -- sentryConfig.test.js
```

### Integration Tests

**File:** `src/services/preferencesService.test.js` (EXTENDED)

**Tests:**
1. `getErrorReportingEnabled()` returns `true` by default
2. `setErrorReportingEnabled(false)` persists to IndexedDB
3. Preference persists across service reloads

**Run command:**
```bash
npm test -- preferencesService.test.js
```

### Manual Verification Tests

**Test 1: Opt-out prevents network calls (AC-9)**
1. Open DevTools → Network tab
2. Filter by domain: `sentry.io`
3. Navigate to Settings
4. Toggle error reporting OFF
5. Trigger test error: Open console, run `throw new Error('Test error')`
6. **Expected:** No network requests to `sentry.io`

**Test 2: PII scrubbing works (AC-10)**
1. Enable error reporting in Settings
2. Trigger test error
3. Go to Sentry dashboard: `https://sentry.io/organizations/<org>/issues/`
4. Find the test error event
5. **Expected:** Event contains ONLY:
   - Stack trace
   - Browser name/version
   - OS name/version
   - App version
6. **Expected:** Event does NOT contain:
   - `user` object
   - `request` object (URLs)
   - `breadcrumbs` array
   - Custom tags/context with user data

**Test 3: Default enabled (AC-U1)**
1. Clear browser storage: DevTools → Application → Clear storage
2. Refresh page
3. Open console, check Sentry client status
4. Trigger test error
5. **Expected:** Error sent to Sentry (check dashboard)

**Test 4: Preference persists (AC-U2)**
1. Enable error reporting
2. Toggle OFF in Settings
3. Refresh page
4. **Expected:** Toggle still OFF
5. Trigger test error
6. **Expected:** No network call to Sentry

---

## AC Verification Mapping

| AC | Verification Method | Test Location |
|----|---------------------|---------------|
| **AC-9** | Manual test: DevTools network monitoring | Manual Test 1 |
| **AC-10** | Manual test: Sentry dashboard inspection | Manual Test 2 |
| **AC-U1** | Manual test: Fresh install behavior | Manual Test 3 |
| **AC-U2** | Manual test: Preference persistence | Manual Test 4 |
| **AC-U3** | Unit test: `beforeSend` hook | `sentryConfig.test.js` |

---

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| **Bundle size increase** | Lazy-load Sentry SDK. Monitor with `vite build --analyze`. Target: < 50 KB gzipped. |
| **PII leakage** | Comprehensive unit tests for `beforeSend` hook. Manual inspection of Sentry events during testing. |
| **Opt-out doesn't work** | Integration test + manual verification with DevTools network monitoring. |
| **Sentry free tier exceeded** | Monitor usage in Sentry dashboard. Free tier: 5,000 events/month (sufficient for MVP). |
| **User confusion about data collection** | Clear, plain-language description next to toggle. Link to privacy policy. |

---

## Rollout and Migration Notes

### Rollout Plan
1. **Phase 1:** Implement Sentry integration with opt-out toggle
2. **Phase 2:** Test with developer account (trigger test errors)
3. **Phase 3:** Deploy to production with default enabled
4. **Phase 4:** Monitor Sentry dashboard for first week
5. **Phase 5:** Update privacy policy with error reporting details

### Migration Notes
- **No data migration needed:** New preference field defaults to `true` if missing
- **Existing users:** Will have error reporting enabled by default (can opt-out in settings)
- **New users:** Error reporting enabled by default (can opt-out in settings or onboarding)

### Rollback Plan
If error reporting causes issues:
1. Set `VITE_SENTRY_DSN` to empty string in environment
2. Redeploy → Sentry SDK won't initialize
3. Remove Sentry code in future release

---

## Observability and Debugging

### What Can Be Logged

**Sentry Dashboard:**
- Error count by browser/OS
- Stack traces for debugging
- Error frequency over time
- Release version correlation

**Browser Console (always logged):**
- All errors (whether Sentry is enabled or not)
- Sentry initialization status
- Preference changes

### What Must Never Be Logged

**Sentry Events:**
- ❌ User preferences (topics, sources, keywords)
- ❌ Article URLs or titles
- ❌ Navigation history (breadcrumbs)
- ❌ User identifiers (IP, device ID, session ID)
- ❌ IndexedDB/LocalStorage contents

**Browser Console:**
- ❌ User preferences (except for debugging with explicit user action)
- ❌ Article content or URLs
- ❌ Sentry DSN (use environment variable, don't log)

### Debugging Tools

1. **Sentry Dashboard:** `https://sentry.io/organizations/<org>/issues/`
2. **Browser DevTools:** Network tab to verify opt-out
3. **React DevTools:** Check component state for toggle
4. **IndexedDB Inspector:** Verify preference persistence

---

## Implementation Checklist

- [ ] Install `@sentry/react` package
- [ ] Create `sentryConfig.js` with PII scrubbing
- [ ] Add `VITE_SENTRY_DSN` to `.env` file
- [ ] Initialize Sentry in `main.jsx`
- [ ] Extend `preferencesService.js` with error reporting preference
- [ ] Add error reporting toggle to Settings UI
- [ ] Write unit tests for `beforeSend` hook
- [ ] Write integration tests for preference storage
- [ ] Manual verification: opt-out prevents network calls
- [ ] Manual verification: PII scrubbing works
- [ ] Update privacy policy with error reporting details
- [ ] Update SPECS.md with status
- [ ] Update spec.md with EVIDENCE section

---

**Plan Version:** 1.0  
**Status:** Ready for implementation  
**Estimated Effort:** 4-6 hours (solo dev with Antigravity)
