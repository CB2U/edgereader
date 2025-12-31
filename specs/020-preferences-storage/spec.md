# Spec: User Preferences Storage

**Roadmap anchor:** [roadmap.md 2.0](file:///mnt/Storage/Documents/Projects/EdgeReader/docs/roadmap.md#epic-20-user-preferences-storage)  
**Priority:** P0  
**Type:** Feature  
**Target area:** Data persistence, user preferences, local storage  
**Target Acceptance Criteria:** FR-2, FR-3, AC-3, NFR-1 (privacy)

---

## Problem Statement

Epic 1.3 completed Breakpoint BP1 (Core Aggregation), providing users with 373 articles from 12 sources that open in external browsers. However, all users see the same feed regardless of their interests.

To enable personalization in Epic 2.1 (Ranking Algorithm) and Epic 2.2 (Onboarding Flow), we need a robust local storage system for user preferences. This system must:
- Store user preferences (topics, sources, keywords) locally in the browser
- Persist across browser sessions
- Never transmit preference data to any server (privacy requirement)
- Provide a clean API for reading and writing preferences

This epic focuses **only on the storage layer** - no UI for editing preferences (that's Epic 2.2) and no ranking logic (that's Epic 2.1).

---

## Goals and Non-Goals

### Goals
- Implement IndexedDB storage using the `idb` library
- Define UserPreferences data model (topics, sources, keywords)
- Create storage service with read/write/update methods
- Ensure preferences persist across browser sessions
- Verify no network calls when saving preferences (privacy compliance)
- Provide default preferences for new users

### Non-Goals
- UI for editing preferences (Epic 2.2 - Onboarding Flow)
- Ranking algorithm that uses preferences (Epic 2.1)
- Cloud sync or backup (explicitly out of scope per constitution)
- Import/export preferences (post-MVP)
- Preferences versioning or migration (can add later if needed)
- Multi-device sync (violates privacy principles)

---

## User Stories

1. **As a developer**, I want a storage service API so I can save and load user preferences without worrying about IndexedDB details.

2. **As a user**, I want my preferences to persist across browser sessions so I don't have to reconfigure the app every time.

3. **As a privacy-conscious user**, I want my preferences stored only on my device so no one else can access my interests.

4. **As a developer**, I want default preferences for new users so the app works immediately without configuration.

---

## Scope

### In-Scope
- Install and configure `idb` library (IndexedDB wrapper)
- Define `UserPreferences` data model:
  - `selectedTopics`: Set of topic strings (e.g., "Technology", "Science")
  - `enabledSources`: Set of source names user wants to see
  - `disabledSources`: Set of source names user wants to hide
  - `keywords`: Set of keyword strings for boosting articles
- Create `storageService.js` with methods:
  - `initDB()` - Initialize IndexedDB
  - `savePreferences(prefs)` - Save preferences
  - `loadPreferences()` - Load preferences (returns defaults if none exist)
  - `updatePreferences(partial)` - Update specific fields
- Add default preferences for new users
- Write unit tests for storage service (optional for MVP)
- Verify no network calls during save/load operations

### Out-of-Scope
- Settings UI (Epic 2.2)
- Onboarding flow (Epic 2.2)
- Ranking algorithm (Epic 2.1)
- Preferences validation (can add later)
- Preferences export/import
- Preferences history or undo
- Cloud sync or backup
- Encryption of preferences (not needed - data is not sensitive)

---

## Requirements

### Functional Requirements

**FR-2.0.1:** Install `idb` library for IndexedDB access.

**FR-2.0.2:** Define `UserPreferences` object schema:
```javascript
{
  selectedTopics: Set<string>,      // e.g., ["Technology", "Science"]
  enabledSources: Set<string>,      // e.g., ["TechCrunch", "Wired"]
  disabledSources: Set<string>,     // e.g., ["Reuters Tech"]
  keywords: Set<string>             // e.g., ["AI", "climate"]
}
```

**FR-2.0.3:** Create `storageService.js` with `initDB()` method that:
- Creates IndexedDB database named `edgereader`
- Creates object store named `preferences`
- Returns database instance

**FR-2.0.4:** Implement `savePreferences(prefs)` method that:
- Accepts UserPreferences object
- Converts Sets to Arrays for storage (IndexedDB doesn't support Sets)
- Saves to IndexedDB under key `userPreferences`
- Returns Promise that resolves when save completes

**FR-2.0.5:** Implement `loadPreferences()` method that:
- Loads preferences from IndexedDB
- Converts Arrays back to Sets
- Returns default preferences if none exist
- Returns Promise that resolves to UserPreferences object

**FR-2.0.6:** Implement `updatePreferences(partial)` method that:
- Loads existing preferences
- Merges partial updates
- Saves updated preferences
- Returns Promise that resolves to updated UserPreferences

**FR-2.0.7:** Define default preferences for new users:
- `selectedTopics`: ["Technology", "Science", "General"]
- `enabledSources`: All sources enabled by default
- `disabledSources`: Empty (no sources disabled)
- `keywords`: Empty

### Non-Functional Requirements

**NFR-2.0.1 (Privacy):** No network calls must be made when saving or loading preferences (verified via browser DevTools Network tab).

**NFR-2.0.2 (Privacy):** Preferences must be stored only in browser's IndexedDB, never transmitted to any server.

**NFR-2.0.3 (Performance):** `loadPreferences()` must complete within 100ms on mid-range devices.

**NFR-2.0.4 (Performance):** `savePreferences()` must complete within 100ms on mid-range devices.

**NFR-2.0.5 (Reliability):** Storage service must handle IndexedDB errors gracefully (log to console, return defaults).

**NFR-2.0.6 (Maintainability):** Storage service API must be simple and well-documented for future epics.

### Constraints Checklist

- ✅ **Security:** IndexedDB is origin-scoped (secure by default)
- ✅ **Privacy:** No network calls, local-only storage
- ⚠️ **Offline behavior:** IndexedDB works offline (no network needed)
- ✅ **Performance:** Read/write operations \u003c 100ms
- ✅ **Observability:** Console logging for errors

---

## Acceptance Criteria

**AC-2.0.1 (IndexedDB Initialized):** Given the app loads, when `initDB()` is called, then an IndexedDB database named `edgereader` is created with a `preferences` object store.

**Verification approach:** Use browser DevTools → Application tab → IndexedDB to verify database exists.

**AC-2.0.2 (Save Preferences):** Given a UserPreferences object, when `savePreferences(prefs)` is called, then the preferences are saved to IndexedDB and persist after page reload.

**Verification approach:** Call `savePreferences()`, reload page, call `loadPreferences()`, verify data matches.

**AC-2.0.3 (Load Preferences):** Given preferences have been saved, when `loadPreferences()` is called, then the saved preferences are returned with Sets properly reconstructed.

**Verification approach:** Save preferences, reload page, load preferences, verify Sets are Sets (not Arrays).

**AC-2.0.4 (Default Preferences):** Given no preferences have been saved, when `loadPreferences()` is called, then default preferences are returned (Technology, Science, General topics).

**Verification approach:** Clear IndexedDB, call `loadPreferences()`, verify defaults.

**AC-2.0.5 (Update Preferences):** Given existing preferences, when `updatePreferences({ selectedTopics: new Set(["Sports"]) })` is called, then only `selectedTopics` is updated, other fields remain unchanged.

**Verification approach:** Save preferences, call `updatePreferences()` with partial data, verify merge worked.

**AC-2.0.6 (No Network Calls):** Given preferences are saved or loaded, when network traffic is monitored, then no HTTP requests are made.

**Verification approach:** Open DevTools Network tab, call `savePreferences()` and `loadPreferences()`, verify no network activity.

**AC-3 (from PRD):** Given the user has set preferences, when network traffic is inspected, then no user preference data is transmitted to any server.

**Verification approach:** Same as AC-2.0.6 - verify no network calls.

---

## Dependencies

### Epic Dependencies
- **Epic 1.0** (Project Setup) - COMPLETE
- No other epic dependencies (this is a foundational epic)

### Technical Dependencies
- `idb` library (npm package) - needs to be installed
- IndexedDB browser API (universally supported in modern browsers)
- React (already installed) - for integration in future epics

### External Services
- None (purely client-side storage)

---

## Risks and Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| **IndexedDB quota exceeded** | Medium | Low | Browser quotas are generous (50MB+). Monitor usage. Add quota check if needed. |
| **IndexedDB not supported** | High | Very Low | All modern browsers support IndexedDB. Add feature detection and fallback to LocalStorage if needed. |
| **Set serialization issues** | Medium | Medium | Manually convert Sets to Arrays before saving, Arrays to Sets after loading. Test thoroughly. |
| **Concurrent write conflicts** | Low | Low | Single-user app, unlikely. IndexedDB handles transactions automatically. |
| **Data corruption** | Medium | Very Low | Use try-catch blocks. Return defaults if load fails. |

---

## Open Questions

**Q1:** Should we version the preferences schema for future migrations?
- **Answer:** Not for MVP. Can add `version` field later if schema changes.

**Q2:** Should we validate preferences before saving (e.g., check topic names are valid)?
- **Answer:** Not for MVP. Validation can be added in Epic 2.2 (Onboarding UI).

**Q3:** Should we encrypt preferences in IndexedDB?
- **Answer:** No. Preferences are not sensitive (just topics/sources). IndexedDB is origin-scoped (secure).

**Q4:** Should we provide a way to reset preferences to defaults?
- **Answer:** Yes, but defer to Epic 2.2 (Settings UI). For now, just provide the defaults in `loadPreferences()`.

---

## EVIDENCE

### Implementation Summary

**Status:** ✅ **COMPLETE**  
**Implementation Time:** ~2 hours  
**Verification Time:** ~30 minutes  
**Final Result:** All 6 acceptance criteria met (100%), Epic 2.0 complete.

### Code Implementation Evidence

**Library:** `idb` (v8.0.0) installed via npm.

**Storage Service:** [src/services/storageService.js](file:///mnt/Storage/Documents/Projects/EdgeReader/src/services/storageService.js)

**Key Symbols:**
- `initDB()`: Initializes `edgereader` IndexedDB with `preferences` store.
- `getDefaultPreferences()`: Returns default topics (Tech, Science, General).
- `savePreferences(prefs)`: Serializes/saves preferences to key `userPreferences`.
- `loadPreferences()`: Loads/deserializes preferences or returns defaults.
- `updatePreferences(partial)`: Merges partial data with existing preferences.

### Verification Results (Browser Subagent)

**Test Date:** December 31, 2025  
**Execution recording:** [preferences_storage_verification.webp](file:///home/chris/.gemini/antigravity/brain/38f6688b-e7f6-41e1-9b67-13e9b325a9d3/preferences_storage_verification_1767162924421.webp)

#### Functional Verification
- ✅ **Init Test:** `initDB()` correctly created database `edgereader` with version `1` and store `preferences`.
- ✅ **Default Test:** `loadPreferences()` on empty DB returned `Set` with `{Technology, Science, General}` topics.
- ✅ **Persistence Test:** Preferences saved (`Health` topic) were correctly restored after page reload.
- ✅ **Serialization Test:** Verification confirmed that stored Arrays are correctly converted back to JavaScript `Set` objects on load.
- ✅ **Update Test:** `updatePreferences({ keywords: new Set(['AI']) })` added the keyword while preserving existing `Health` topic.

#### Privacy Verification
- ✅ **No Network Calls:** `performance.getEntriesByType('resource')` monitored during save/load operations confirmed **0 new network requests**.
- ✅ **Local-Only:** Storage operations were verified to interact exclusively with browser IndexedDB.

### Acceptance Criteria Verification

| AC | Status | Evidence |
|----|--------|----------|
| **AC-2.0.1** (IndexedDB Initialized) | ✅ **PASS** | Verified via `db.objectStoreNames` containing `preferences`. |
| **AC-2.0.2** (Save Preferences) | ✅ **PASS** | Verified via `db.put` success and visual check in Application tab. |
| **AC-2.0.3** (Load Preferences) | ✅ **PASS** | Verified via `db.get` and `deserializePreferences` (Sets checked via `instanceof`). |
| **AC-2.0.4** (Default Preferences) | ✅ **PASS** | Verified by clearing DB and reloading - defaults matched spec. |
| **AC-2.0.5** (Update Preferences) | ✅ **PASS** | Verified by merging `keywords` with existing `selectedTopics`. |
| **AC-2.0.6** (No Network Calls) | ✅ **PASS** | Resource count remained constant during storage calls. |
| **AC-3** (PRD: No Data Transmission) | ✅ **PASS** | Confirmed locally-scoped IndexedDB operations only. |

**Overall: 7/7 ACs passed (100%)**

---

**Status:** ✅ **COMPLETE**  
**Last Updated:** December 31, 2025  
**Total ACs Passed:** 7/7  
**Next Epic:** 2.1 - On-Device Ranking Algorithm (will use the storage service implemented here).
