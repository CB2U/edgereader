# Plan: User Preferences Storage

**Epic:** 2.0 - User Preferences Storage  
**Spec:** [spec.md](file:///mnt/Storage/Documents/Projects/EdgeReader/specs/020-preferences-storage/spec.md)

---

## Architecture Overview

### Key Components

This epic introduces a new storage layer for user preferences:

1. **storageService.js** (New File)
   - Encapsulates all IndexedDB operations
   - Provides clean API for preferences management
   - Handles Set ↔ Array conversions
   - Returns default preferences for new users

2. **UserPreferences Data Model** (New)
   - Defines structure for user preferences
   - Uses Sets for efficient lookups
   - Stored as JSON in IndexedDB

3. **Integration Points** (Future Epics)
   - Epic 2.1 will use `loadPreferences()` for ranking
   - Epic 2.2 will use `savePreferences()` and `updatePreferences()` for onboarding/settings

### Technology Choice: IndexedDB vs LocalStorage

**Option 1: LocalStorage** ❌
- Cons: 5-10MB limit (may be too small for future features)
- Cons: Synchronous API (blocks UI thread)
- Cons: Only stores strings (requires JSON serialization)

**Option 2: IndexedDB with `idb` wrapper** ✅ **CHOSEN**
- Pros: Large storage quota (50MB+ typically)
- Pros: Asynchronous API (non-blocking)
- Pros: Supports complex data types
- Pros: `idb` library simplifies API (Promise-based)
- Pros: Recommended by PRD (Section 10.3)

### Data Model

```javascript
// In-memory representation (JavaScript)
const UserPreferences = {
  selectedTopics: new Set(["Technology", "Science", "General"]),
  enabledSources: new Set(["TechCrunch", "Wired", "BBC News"]),
  disabledSources: new Set([]),
  keywords: new Set(["AI", "climate"])
};

// Stored representation (IndexedDB - JSON)
{
  selectedTopics: ["Technology", "Science", "General"],
  enabledSources: ["TechCrunch", "Wired", "BBC News"],
  disabledSources: [],
  keywords: ["AI", "climate"]
}
```

**Why Sets?**
- Efficient lookups: `O(1)` for `has()` operation
- No duplicates automatically
- Easy to add/remove items
- Used by ranking algorithm (Epic 2.1)

**Conversion Strategy:**
- **Save:** Convert Sets → Arrays before storing
- **Load:** Convert Arrays → Sets after loading

---

## Data Contracts

### UserPreferences Object

```javascript
/**
 * User preferences for news personalization
 * @typedef {Object} UserPreferences
 * @property {Set<string>} selectedTopics - Topics user is interested in
 * @property {Set<string>} enabledSources - Sources user wants to see
 * @property {Set<string>} disabledSources - Sources user wants to hide
 * @property {Set<string>} keywords - Keywords for boosting articles
 */
```

**Field Descriptions:**
- `selectedTopics`: Topic names (e.g., "Technology", "Science", "General", "Sports")
- `enabledSources`: Source names (e.g., "TechCrunch", "Wired")
- `disabledSources`: Source names to filter out
- `keywords`: Keywords for article boosting (e.g., "AI", "climate", "election")

**Default Values:**
```javascript
{
  selectedTopics: new Set(["Technology", "Science", "General"]),
  enabledSources: new Set(), // Empty = all sources enabled
  disabledSources: new Set(),
  keywords: new Set()
}
```

---

## Storage and Persistence

### IndexedDB Schema

**Database Name:** `edgereader`  
**Version:** 1  
**Object Stores:**
- `preferences` - Stores user preferences (key-value store)

**Storage Key:** `userPreferences` (single record)

### Storage Service API

```javascript
// Initialize database
async function initDB(): Promise<IDBDatabase>

// Save preferences (overwrites existing)
async function savePreferences(prefs: UserPreferences): Promise<void>

// Load preferences (returns defaults if none exist)
async function loadPreferences(): Promise<UserPreferences>

// Update preferences (merge with existing)
async function updatePreferences(partial: Partial<UserPreferences>): Promise<UserPreferences>
```

### Implementation Details

**Set Serialization:**
```javascript
// Convert Sets to Arrays for storage
function serializePreferences(prefs) {
  return {
    selectedTopics: Array.from(prefs.selectedTopics),
    enabledSources: Array.from(prefs.enabledSources),
    disabledSources: Array.from(prefs.disabledSources),
    keywords: Array.from(prefs.keywords)
  };
}

// Convert Arrays back to Sets
function deserializePreferences(stored) {
  return {
    selectedTopics: new Set(stored.selectedTopics || []),
    enabledSources: new Set(stored.enabledSources || []),
    disabledSources: new Set(stored.disabledSources || []),
    keywords: new Set(stored.keywords || [])
  };
}
```

---

## Testing Plan

### Manual Testing

**Test 1: Initialize IndexedDB**
- **Steps:**
  1. Open http://localhost:5173
  2. Open DevTools → Application tab → IndexedDB
  3. Verify `edgereader` database exists
  4. Verify `preferences` object store exists
- **Expected:** Database and object store are created

**Test 2: Save and Load Preferences**
- **Steps:**
  1. Open browser console
  2. Import storage service
  3. Call `savePreferences({ selectedTopics: new Set(["Sports"]), ... })`
  4. Reload page
  5. Call `loadPreferences()`
- **Expected:** Loaded preferences match saved preferences, Sets are Sets

**Test 3: Default Preferences**
- **Steps:**
  1. Clear IndexedDB (DevTools → Application → IndexedDB → Delete)
  2. Call `loadPreferences()`
- **Expected:** Returns default preferences (Technology, Science, General)

**Test 4: Update Preferences**
- **Steps:**
  1. Save initial preferences
  2. Call `updatePreferences({ keywords: new Set(["AI"]) })`
  3. Load preferences
- **Expected:** Keywords updated, other fields unchanged

**Test 5: No Network Calls**
- **Steps:**
  1. Open DevTools → Network tab
  2. Clear network log
  3. Call `savePreferences()` and `loadPreferences()`
- **Expected:** No network requests appear

### Unit Tests (Optional for MVP)

**If time permits, add Jest tests:**
```javascript
describe('storageService', () => {
  test('savePreferences stores data in IndexedDB', async () => {
    const prefs = { selectedTopics: new Set(["Tech"]), ... };
    await savePreferences(prefs);
    const loaded = await loadPreferences();
    expect(loaded.selectedTopics).toEqual(new Set(["Tech"]));
  });

  test('loadPreferences returns defaults for new users', async () => {
    // Clear IndexedDB
    const prefs = await loadPreferences();
    expect(prefs.selectedTopics).toContain("Technology");
  });
});
```

**Decision:** Skip unit tests for MVP, rely on manual testing. Can add later if needed.

---

## AC Verification Mapping

| AC | Verification Method | Test Location |
|----|---------------------|---------------|
| **AC-2.0.1** (IndexedDB Initialized) | Manual Test 1 | DevTools Application tab |
| **AC-2.0.2** (Save Preferences) | Manual Test 2 | Browser console + reload |
| **AC-2.0.3** (Load Preferences) | Manual Test 2 | Browser console |
| **AC-2.0.4** (Default Preferences) | Manual Test 3 | Browser console |
| **AC-2.0.5** (Update Preferences) | Manual Test 4 | Browser console |
| **AC-2.0.6** (No Network Calls) | Manual Test 5 | DevTools Network tab |
| **AC-3** (PRD: No Data Transmission) | Manual Test 5 | DevTools Network tab |

---

## Risks and Mitigations

### Risk 1: Set Serialization Bugs

**Likelihood:** Medium  
**Impact:** High (data corruption)  
**Mitigation:**
- Test thoroughly with manual tests
- Add defensive checks (ensure Arrays are converted to Sets)
- Log warnings if unexpected data types found

### Risk 2: IndexedDB Browser Compatibility

**Likelihood:** Very Low  
**Impact:** High  
**Mitigation:**
- IndexedDB is universally supported in modern browsers
- Add feature detection: `if (!window.indexedDB) { /* fallback */ }`
- Fallback to LocalStorage if needed (can add later)

### Risk 3: `idb` Library Issues

**Likelihood:** Low  
**Impact:** Medium  
**Mitigation:**
- `idb` is well-maintained and widely used
- If issues arise, can switch to native IndexedDB API

---

## Rollout and Migration Notes

### No Migration Required

- This is a new feature (no existing data to migrate)
- First-time users get default preferences
- No breaking changes to existing functionality

### Future Migration Considerations

If preferences schema changes in future epics:
1. Add `version` field to preferences object
2. Implement migration logic in `loadPreferences()`
3. Convert old format to new format on load

**Example:**
```javascript
async function loadPreferences() {
  const stored = await db.get('preferences', 'userPreferences');
  if (!stored) return getDefaultPreferences();
  
  // Migration logic
  if (!stored.version || stored.version < 2) {
    return migrateV1ToV2(stored);
  }
  
  return deserializePreferences(stored);
}
```

---

## Observability and Debugging

### What Can Be Logged

- Database initialization success/failure
- Preferences save/load operations (without logging actual data)
- Errors during IndexedDB operations
- Default preferences being used (indicates new user)

### What Must Never Be Logged

- Actual preference values (privacy violation)
- User topics, sources, or keywords
- Any identifiable information

### Debugging Tips

- Use DevTools → Application → IndexedDB to inspect stored data
- Use browser console to call storage service methods directly
- Check for IndexedDB quota warnings in console
- Verify Sets are properly reconstructed (use `instanceof Set`)

---

## Implementation Checklist

See [tasks.md](file:///mnt/Storage/Documents/Projects/EdgeReader/specs/020-preferences-storage/tasks.md) for detailed task breakdown.

**High-Level Steps:**
1. Install `idb` library
2. Create `src/services/storageService.js`
3. Implement `initDB()`, `savePreferences()`, `loadPreferences()`, `updatePreferences()`
4. Add Set serialization/deserialization helpers
5. Define default preferences
6. Manual testing (5 tests)
7. Update tracking documents (SPEC.md, SPECS.md)
8. Document evidence in spec.md

---

**Status:** Draft  
**Last Updated:** December 31, 2025  
**Next Step:** Review plan, then proceed to implementation
