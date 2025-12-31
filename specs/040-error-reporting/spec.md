# Epic 4.0: Error Reporting with Opt-Out

**Roadmap anchor:** roadmap.md 4.0  
**Priority:** P0 (MVP)  
**Type:** Feature  
**Target area:** Error monitoring, privacy controls  
**Breakpoint:** BP4 (Privacy & Polish)  
**Target Acceptance Criteria:** AC-9, AC-10, FR-11, FR-12, NFR-2  

---

## Problem Statement

EdgeReader is a privacy-first PWA that processes all user data client-side. However, without any error reporting mechanism, debugging production issues and improving app stability becomes extremely difficult. Traditional error reporting solutions often collect excessive user data, which conflicts with EdgeReader's privacy guarantees.

The challenge is to implement optional error reporting that:
1. Provides actionable crash/error data for debugging
2. Respects user privacy by collecting only essential technical information
3. Gives users full control via an opt-out mechanism
4. Maintains trust by being transparent about what data is collected

**Current state:** No error reporting exists. Debugging relies entirely on local browser console logs.

**Desired state:** Optional Sentry Browser SDK integration with strict PII scrubbing, user-controllable opt-out toggle, and transparent documentation of collected data.

---

## Goals and Non-Goals

### Goals
- Implement Sentry Browser SDK for error and crash reporting
- Provide user-facing toggle in settings to enable/disable error reporting
- Default error reporting to **enabled** (user can opt-out)
- Scrub all PII (personally identifiable information) from error reports
- Collect only: stack traces, browser type, OS version, app version
- Document exactly what data is collected in privacy policy
- Ensure opt-out is respected immediately (no data sent after toggle off)

### Non-Goals
- Custom error reporting backend (use Sentry's hosted service)
- Advanced error analytics or user session replay
- Automatic error recovery or retry mechanisms
- Error reporting for non-critical warnings (only errors/crashes)
- Integration with other monitoring tools (APM, performance monitoring)

---

## User Stories

1. **As a user**, I want to opt in or out of error reporting so I have full control over what data leaves my device.

2. **As a user**, I want to know exactly what data is collected when error reporting is enabled so I can make an informed decision.

3. **As a developer**, I want to receive actionable error reports (stack traces, browser info) so I can fix bugs and improve app stability.

4. **As a privacy-conscious user**, I want assurance that error reports contain no personal information (preferences, article URLs, browsing history) so my privacy is protected even if I enable reporting.

---

## Scope

### In-Scope
- Sentry Browser SDK integration (`@sentry/react`)
- Error reporting toggle in settings screen (default: enabled)
- PII scrubbing via Sentry `beforeSend` hook
- Preference storage for opt-out state (IndexedDB)
- Documentation of collected data in privacy policy section
- Verification that opt-out prevents all network calls to Sentry

### Out-of-Scope
- Self-hosted Sentry instance (use Sentry.io hosted service for MVP)
- Performance monitoring or transaction tracing
- User session replay or breadcrumbs (explicitly disabled)
- Error grouping or custom fingerprinting (use Sentry defaults)
- Notification system for new errors (developer checks Sentry dashboard manually)
- Integration with CI/CD for release tracking

---

## Requirements

### Functional Requirements

**FR-11 (from PRD):** Provide opt-out toggle for anonymous crash reporting in settings screen. Default state: **enabled** (user can disable).

**FR-12 (from PRD):** When user opts in to crash reporting, collect only: crash logs, device model, OS version, app version. No user identifiers, preferences, or article interaction data.

**FR-4.0.1:** Initialize Sentry Browser SDK in `main.jsx` with DSN from environment variable.

**FR-4.0.2:** Implement `beforeSend` hook to scrub all PII:
- Remove `event.user` object
- Remove `event.request` object (contains URLs)
- Clear `event.breadcrumbs` array (navigation history)
- Remove any custom context that might contain user data

**FR-4.0.3:** Check user preference on app initialization to enable/disable Sentry client.

**FR-4.0.4:** Provide toggle in settings screen to enable/disable error reporting with clear explanation.

**FR-4.0.5:** When user toggles error reporting off, immediately disable Sentry client and persist preference.

### Non-Functional Requirements

**NFR-2 (from PRD):** No use of third-party analytics or ad SDKs. Crash reporting must use privacy-respecting tool (e.g., Sentry with PII scrubbing).

**NFR-4.0.1 (Privacy):** Error reports must contain ONLY:
- Stack trace (error message, file, line number)
- Browser type and version
- Operating system and version
- App version
- Timestamp of error

**NFR-4.0.2 (Privacy):** Error reports must NOT contain:
- User preferences (topics, sources, keywords)
- Article URLs or titles
- Navigation history or breadcrumbs
- User identifiers (IP address, device ID, session ID)
- Any data stored in IndexedDB or LocalStorage

**NFR-4.0.3 (Performance):** Sentry SDK should not impact page load time by more than 50ms.

**NFR-4.0.4 (Reliability):** Opt-out preference must persist across browser sessions and app updates.

### Constraints Checklist

- [x] **Security:** Sentry DSN stored as environment variable (not hardcoded)
- [x] **Privacy:** PII scrubbing enforced via `beforeSend` hook
- [x] **Privacy:** Opt-out toggle prominently displayed in settings
- [x] **Privacy:** Default state is enabled (user can opt-out)
- [x] **Offline behavior:** Sentry SDK handles offline gracefully (queues errors, sends when online)
- [x] **Performance:** Sentry SDK loaded asynchronously to avoid blocking page load
- [x] **Observability:** Sentry dashboard accessible to developer for error monitoring

---

## Acceptance Criteria

### AC-9 (from PRD)
**Given** the user opens settings,  
**When** they toggle crash reporting off,  
**Then** no crash data is sent to any server even if a crash occurs.

**Verification approach:** 
1. Enable network monitoring in DevTools
2. Toggle error reporting off in settings
3. Trigger a test error (e.g., click a broken button)
4. Verify no network requests to `sentry.io` domain

---

### AC-10 (from PRD)
**Given** crash reporting is enabled and a crash occurs,  
**When** crash logs are inspected in Sentry dashboard,  
**Then** they contain no user preferences, article URLs, or any identifiable information beyond device model, OS version, and stack trace.

**Verification approach:**
1. Enable error reporting in settings
2. Trigger a test error
3. Check Sentry dashboard for the error event
4. Verify event contains ONLY: stack trace, browser, OS, app version
5. Verify event does NOT contain: user object, request object, breadcrumbs, custom context

---

### AC-U1 (Local)
**Given** the app is launched for the first time,  
**When** the user has not changed error reporting settings,  
**Then** error reporting is enabled by default.

**Verification approach:**
1. Clear browser storage (simulate first launch)
2. Launch app
3. Check Sentry client status (should be enabled)
4. Trigger test error and verify it's sent to Sentry

---

### AC-U2 (Local)
**Given** error reporting is enabled,  
**When** the user toggles it off in settings,  
**Then** the preference is saved and persists across browser sessions.

**Verification approach:**
1. Enable error reporting
2. Toggle it off in settings
3. Refresh the page
4. Verify toggle is still off
5. Trigger test error and verify no network call to Sentry

---

### AC-U3 (Local)
**Given** the Sentry SDK is initialized,  
**When** an error occurs,  
**Then** the `beforeSend` hook successfully scrubs all PII before sending.

**Verification approach:**
1. Review Sentry event in dashboard
2. Verify `event.user` is null or undefined
3. Verify `event.request` is null or undefined
4. Verify `event.breadcrumbs` is empty array
5. Verify no custom tags/context contain user data

---

## Dependencies

### Epic Dependencies
- **2.0 (Preferences Storage):** Required for storing opt-out preference in IndexedDB
- **4.1 (Settings Screen):** Settings screen must exist to display error reporting toggle (can be implemented in parallel)

### Technical Dependencies
- **Sentry Browser SDK:** `@sentry/react` npm package
- **Sentry.io account:** Free tier supports up to 5,000 events/month (sufficient for MVP)
- **Environment variable:** `VITE_SENTRY_DSN` for Sentry project DSN
- **IndexedDB:** For storing user preference (already implemented in Epic 2.0)

---

## Risks and Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| **Sentry SDK increases bundle size significantly** | Medium | Low | Lazy-load Sentry SDK only when error reporting is enabled. Monitor bundle size with `vite build --analyze`. |
| **PII scrubbing is incomplete, leaks user data** | High | Medium | Implement comprehensive `beforeSend` hook with unit tests. Manually inspect Sentry events in dashboard during testing. |
| **Users don't understand what data is collected** | Medium | Medium | Provide clear, plain-language explanation next to toggle in settings. Link to privacy policy section. |
| **Opt-out doesn't work, data still sent** | High | Low | Add integration test to verify no network calls when opted out. Test with DevTools network monitoring. |
| **Sentry free tier limit exceeded** | Low | Low | Monitor usage in Sentry dashboard. Free tier (5,000 events/month) is sufficient for solo dev MVP. |
| **Error reporting undermines privacy messaging** | High | Medium | Make opt-out prominent in onboarding and settings. Document exactly what's collected in privacy policy. Default to enabled but allow easy opt-out. |

---

## Open Questions

**All critical questions have been answered.**

**Resolved:**
1. ✅ Should error reporting be opt-in or opt-out? → **Opt-out (default enabled)** per PRD FR-11
2. ✅ Which error reporting service to use? → **Sentry Browser SDK** per PRD NFR-2
3. ✅ Should we self-host Sentry? → **No, use Sentry.io hosted service** for MVP simplicity
4. ✅ What data should be collected? → **Only stack trace, browser, OS, app version** per FR-12
5. ✅ Should we show error reporting toggle in onboarding? → **No, only in settings screen** per FR-11

---

## EVIDENCE

> This section will be populated during implementation with verification evidence for each AC and task.

## EVIDENCE

### Automated Tests
- **PII Scrubbing Unit Tests:** [sentryConfig.test.js](file:///mnt/Storage/Documents/Projects/EdgeReader/src/config/sentryConfig.test.js) passed.
- **Preference Persistence Integration Tests:** [storageService.test.js](file:///mnt/Storage/Documents/Projects/EdgeReader/src/services/storageService.test.js) passed.

```bash
# Unit tests
npm test -- sentryConfig.test.js
# Result: 2 passed

# Integration tests
npm test -- storageService.test.js
# Result: 4 passed
```

### Manual Verification
Manual verification was performed via browser subagent:
- **Default State:** Verified `errorReportingEnabled` is `true` by default.
- **UI Toggle:** Settings drawer switch correctly updates preferences and Sentry client.
- **Persistence:** Choosing "OFF" persists after page reload (verified via IndexedDB).
- **Sentry Status:** Active and integrated with application services.

**Screenshots:**
- ![Settings Drawer Initial](/home/chris/.gemini/antigravity/brain/bf45ce3d-a139-4170-a3ab-40806f0053bc/settings_drawer_initial_1767199629529.png)
- ![Settings Persistence Check](/home/chris/.gemini/antigravity/brain/bf45ce3d-a139-4170-a3ab-40806f0053bc/settings_persistence_check_1767199485818.png)

### Documentation
- Created [Privacy Policy](file:///mnt/Storage/Documents/Projects/EdgeReader/docs/PRIVACY.md).
- Updated [README.md](file:///mnt/Storage/Documents/Projects/EdgeReader/README.md), [SPECS.md](file:///mnt/Storage/Documents/Projects/EdgeReader/SPECS.md), and [SPEC.md](file:///mnt/Storage/Documents/Projects/EdgeReader/SPEC.md).

