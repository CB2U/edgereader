# Tasks: Epic 4.0 - Error Reporting with Opt-Out

**Spec:** [spec.md](./spec.md)  
**Plan:** [plan.md](./plan.md)  
**Status:** In progress  
**Last Updated:** December 31, 2025

---

## Task Overview

This epic implements optional Sentry-based error reporting with user-controllable opt-out and strict PII scrubbing. Tasks are ordered to build incrementally: setup → core integration → UI → testing → documentation.

**Estimated total time:** 4-6 hours

---

## Setup

### T1: Install Sentry SDK and configure environment [x] (Done)

**Goal:** Add Sentry Browser SDK package and set up environment variable for DSN.

**Steps:**
1. Install `@sentry/react` package: `npm install @sentry/react` [x]
2. Create `.env.local` file (if not exists) [x]
3. Add `VITE_SENTRY_DSN` variable with placeholder value [x]
4. Add `.env.local` to `.gitignore` (if not already) [x]
5. Document DSN setup in README or developer docs [ ]

**Done when:**
- [x] `@sentry/react` appears in `package.json` dependencies
- [x] `.env.local` exists with `VITE_SENTRY_DSN` variable
- [x] `.env.local` is in `.gitignore`

**Verify:**
- Run `npm list @sentry/react` → shows installed version [x]
- Check `.gitignore` contains `.env.local` [x]

**Evidence to record:**
- Package version installed: `@sentry/react@8.47.0` (or similar)
- Screenshot of `.env.local` (with DSN redacted)

**Files touched:**
- `package.json`
- `package-lock.json`
- `.env.local` (NEW)
- `.gitignore` (if modified)

---

## Core Implementation

### T2: Create Sentry configuration with PII scrubbing [x] (Done)

**Goal:** Implement centralized Sentry config with `beforeSend` hook to scrub all PII.

**Steps:**
1. Create `src/config/sentryConfig.js` [x]
2. Implement `beforeSend` hook [x]
3. Export Sentry initialization function [x]
4. Add JSDoc comments [x]

**Done when:**
- [x] `sentryConfig.js` exists with `beforeSend` hook
- [x] Hook removes `user`, `request`, `breadcrumbs`
- [x] Hook preserves essential debugging info

**Verify:**
- Code review: inspect `beforeSend` implementation [x]
- Unit test (T5) will verify behavior

**Evidence to record:**
- Code snippet of `beforeSend` hook logic
- Explanation of what's scrubbed vs. preserved

**Files touched:**
- `src/config/sentryConfig.js` (NEW)

---

### T3: Initialize Sentry in main.jsx [x] (Done)

**Goal:** Initialize Sentry SDK on app startup, respecting user preference.

**Steps:**
1. Import Sentry config from `sentryConfig.js` [x]
2. Import `preferencesService` to check opt-out preference [x]
3. Add async initialization before React render: [x]
   - Load user preference for `errorReportingEnabled` [x]
   - Initialize Sentry with `enabled` based on preference [x]
   - Set DSN from `import.meta.env.VITE_SENTRY_DSN` [x]
4. Handle case where DSN is not set (skip initialization) [x]

**Done when:**
- [x] Sentry initialized in `main.jsx`
- [x] Initialization checks user preference
- [x] DSN loaded from environment variable
- [x] Gracefully handles missing DSN

**Verify:**
- Run app with DevTools console open [ ]
- Check for Sentry initialization log (if enabled) [ ]
- Verify no errors if DSN is missing [ ]

**Evidence to record:**
- Console log showing Sentry initialization status
- Code snippet of initialization logic

**Files touched:**
- `src/main.jsx` (MODIFIED)

---

### T4: Extend preferences service with error reporting flag [x] (Done)

**Goal:** Add `errorReportingEnabled` field to user preferences with default value `true`.

**Steps:**
1. Open `src/services/storageService.js` [x]
2. Add `errorReportingEnabled: true` to default preferences object [x]
3. Add logic to serialization/deserialization [x]
4. Add logic to updatePreferences [x]
5. Ensure persistence to IndexedDB [x]

**Done when:**
- [x] Default preferences include `errorReportingEnabled: true`
- [x] Deserialization handles missing field (defaults to true)
- [x] Changes persist to IndexedDB

**Verify:**
- Open DevTools → Application → IndexedDB → `edgereader` → `preferences` [ ]
- Check for `errorReportingEnabled` field [ ]

**Evidence to record:**
- Screenshot of IndexedDB showing `errorReportingEnabled` field
- Code snippet of serialization/deserialization logic

**Files touched:**
- `src/services/storageService.js` (MODIFIED)

---

### T5: Add error reporting toggle to Settings UI [x] (Done)

**Goal:** Add Material UI switch to Settings screen for error reporting opt-out.

**Steps:**
1. Open `src/components/SettingsPanel.jsx` [x]
2. Add state for error reporting toggle [x]
3. Add Material UI `Switch` component [x]
4. Add description text [x]
5. Implement toggle handler [x]
6. Integrate into App.jsx [x]

**Done when:**
- [x] Toggle appears in Settings screen
- [x] Toggle state reflects current preference
- [x] Toggling saves preference and updates Sentry client
- [x] Settings screen accessible from main feed

**Verify:**
- Open Settings screen [x]
- Toggle error reporting on/off [x]
- Check IndexedDB for updated value [ ]

**Evidence to record:**
- Screenshot of Settings drawer with toggle
- Code snippet of SettingsPanel toggle handler

**Files touched:**
- `src/components/SettingsPanel.jsx` (NEW)
- `src/App.jsx` (MODIFIED)

---

## Tests

### T6: Write unit tests for beforeSend hook [x] (Done)

**Goal:** Verify PII scrubbing logic works correctly.

**Steps:**
1. Create `src/config/sentryConfig.test.js` [x]
2. Write tests for scrubbing and enabled flag [x]
3. Run tests: `npm test -- sentryConfig.test.js` [x]

**Evidence to record:**
- Test output showing all tests passed

---

### T7: Write integration tests for preferences service [x] (Done)

**Goal:** Verify error reporting preference persists correctly.

**Steps:**
1. Create `src/services/storageService.test.js` [x]
2. Add tests for default value and persistence [x]
3. Run tests: `npm test -- storageService.test.js` [x]

**Evidence to record:**
- Test output showing all tests passed

---

## Manual Verification

### T8: Manual verification - AC-9 (Opt-out prevents network calls) [/] (In progress)
### T9: Manual verification - AC-10 (PII scrubbing works) [/] (In progress)
### T10: Manual verification - AC-U1 (Default enabled) [/] (In progress)
### T11: Manual verification - AC-U2 (Preference persists) [/] (In progress)

---

## Finalization

### T12: Update privacy policy section [ ]
### T13: Update SPECS.md [ ]
### T14: Update spec.md with EVIDENCE section [ ]
