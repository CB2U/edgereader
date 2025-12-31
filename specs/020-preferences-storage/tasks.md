# Tasks: User Preferences Storage

**Epic:** 2.0 - User Preferences Storage  
**Spec:** [spec.md](file:///mnt/Storage/Documents/Projects/EdgeReader/specs/020-preferences-storage/spec.md)  
**Plan:** [plan.md](file:///mnt/Storage/Documents/Projects/EdgeReader/specs/020-preferences-storage/plan.md)

---

## Setup

### T1: Install idb Library
**Goal:** Add IndexedDB wrapper library to project dependencies

**Steps:**
1. Open terminal in EdgeReader directory
2. Run `npm install idb`
3. Verify installation in `package.json`

**Done when:**
- `idb` appears in `package.json` dependencies
- `npm install` completes without errors

**Verify:**
- Check `package.json` for `idb` entry
- Run `npm list idb` to confirm installation

**Evidence to record:**
- `package.json` snippet showing `idb` dependency

**Files touched:**
- `package.json`
- `package-lock.json`

---

## Core Implementation

### T2: Create storageService.js File
**Goal:** Create new service file for preferences storage

**Steps:**
1. Create `src/services/storageService.js`
2. Add file header comment explaining purpose
3. Import `idb` library: `import { openDB } from 'idb';`
4. Define constants:
   ```javascript
   const DB_NAME = 'edgereader';
   const DB_VERSION = 1;
   const STORE_NAME = 'preferences';
   const PREFS_KEY = 'userPreferences';
   ```
5. Save file

**Done when:**
- File exists with imports and constants
- No syntax errors

**Verify:**
- File compiles without errors
- Import statement is correct

**Evidence to record:**
- File creation confirmation
- Code snippet showing constants

**Files touched:**
- `src/services/storageService.js` (new)

---

### T3: Implement initDB() Function
**Goal:** Create function to initialize IndexedDB database

**Steps:**
1. In `storageService.js`, add `initDB()` function:
   ```javascript
   async function initDB() {
     return openDB(DB_NAME, DB_VERSION, {
       upgrade(db) {
         if (!db.objectStoreNames.contains(STORE_NAME)) {
           db.createObjectStore(STORE_NAME);
         }
       }
     });
   }
   ```
2. Export function: `export { initDB };`
3. Save file

**Done when:**
- Function creates database and object store
- Function is exported

**Verify:**
- Code compiles without errors
- Function signature is correct

**Evidence to record:**
- Code snippet showing `initDB()` implementation

**Files touched:**
- `src/services/storageService.js`

---

### T4: Implement Default Preferences Function
**Goal:** Define default preferences for new users

**Steps:**
1. In `storageService.js`, add `getDefaultPreferences()` function:
   ```javascript
   function getDefaultPreferences() {
     return {
       selectedTopics: new Set(["Technology", "Science", "General"]),
       enabledSources: new Set(), // Empty = all enabled
       disabledSources: new Set(),
       keywords: new Set()
     };
   }
   ```
2. Export function
3. Save file

**Done when:**
- Function returns default preferences with Sets
- Function is exported

**Verify:**
- Returned object has all required fields
- All fields are Sets

**Evidence to record:**
- Code snippet showing default preferences

**Files touched:**
- `src/services/storageService.js`

---

### T5: Implement Set Serialization Helpers
**Goal:** Create functions to convert Sets ↔ Arrays for storage

**Steps:**
1. In `storageService.js`, add `serializePreferences()`:
   ```javascript
   function serializePreferences(prefs) {
     return {
       selectedTopics: Array.from(prefs.selectedTopics),
       enabledSources: Array.from(prefs.enabledSources),
       disabledSources: Array.from(prefs.disabledSources),
       keywords: Array.from(prefs.keywords)
     };
   }
   ```
2. Add `deserializePreferences()`:
   ```javascript
   function deserializePreferences(stored) {
     return {
       selectedTopics: new Set(stored.selectedTopics || []),
       enabledSources: new Set(stored.enabledSources || []),
       disabledSources: new Set(stored.disabledSources || []),
       keywords: new Set(stored.keywords || [])
     };
   }
   ```
3. Save file

**Done when:**
- Both functions implemented
- Conversion logic is correct

**Verify:**
- Test conversion: Set → Array → Set
- Verify Sets are reconstructed properly

**Evidence to record:**
- Code snippets showing both functions

**Files touched:**
- `src/services/storageService.js`

---

### T6: Implement savePreferences() Function
**Goal:** Create function to save preferences to IndexedDB

**Steps:**
1. In `storageService.js`, add `savePreferences()`:
   ```javascript
   export async function savePreferences(prefs) {
     try {
       const db = await initDB();
       const serialized = serializePreferences(prefs);
       await db.put(STORE_NAME, serialized, PREFS_KEY);
       console.log('Preferences saved successfully');
     } catch (error) {
       console.error('Error saving preferences:', error);
       throw error;
     }
   }
   ```
2. Export function
3. Save file

**Done when:**
- Function saves preferences to IndexedDB
- Error handling is in place
- Function is exported

**Verify:**
- Call function with test preferences
- Check IndexedDB in DevTools

**Evidence to record:**
- Code snippet showing `savePreferences()`
- Screenshot of IndexedDB with saved data

**Files touched:**
- `src/services/storageService.js`

---

### T7: Implement loadPreferences() Function
**Goal:** Create function to load preferences from IndexedDB

**Steps:**
1. In `storageService.js`, add `loadPreferences()`:
   ```javascript
   export async function loadPreferences() {
     try {
       const db = await initDB();
       const stored = await db.get(STORE_NAME, PREFS_KEY);
       
       if (!stored) {
         console.log('No preferences found, using defaults');
         return getDefaultPreferences();
       }
       
       return deserializePreferences(stored);
     } catch (error) {
       console.error('Error loading preferences:', error);
       return getDefaultPreferences();
     }
   }
   ```
2. Export function
3. Save file

**Done when:**
- Function loads preferences from IndexedDB
- Returns defaults if none exist
- Error handling returns defaults

**Verify:**
- Call function with empty IndexedDB (should return defaults)
- Call function with saved preferences (should return saved data)

**Evidence to record:**
- Code snippet showing `loadPreferences()`
- Test results showing default vs saved preferences

**Files touched:**
- `src/services/storageService.js`

---

### T8: Implement updatePreferences() Function
**Goal:** Create function to update partial preferences

**Steps:**
1. In `storageService.js`, add `updatePreferences()`:
   ```javascript
   export async function updatePreferences(partial) {
     try {
       const existing = await loadPreferences();
       
       // Merge partial updates
       const updated = {
         selectedTopics: partial.selectedTopics || existing.selectedTopics,
         enabledSources: partial.enabledSources || existing.enabledSources,
         disabledSources: partial.disabledSources || existing.disabledSources,
         keywords: partial.keywords || existing.keywords
       };
       
       await savePreferences(updated);
       return updated;
     } catch (error) {
       console.error('Error updating preferences:', error);
       throw error;
     }
   }
   ```
2. Export function
3. Save file

**Done when:**
- Function merges partial updates with existing preferences
- Function is exported

**Verify:**
- Save initial preferences
- Update one field
- Verify other fields unchanged

**Evidence to record:**
- Code snippet showing `updatePreferences()`
- Test results showing merge behavior

**Files touched:**
- `src/services/storageService.js`

---

## Verification

### T9: Manual Test - IndexedDB Initialization
**Goal:** Verify IndexedDB database is created correctly

**Steps:**
1. Open http://localhost:5173 in browser
2. Open DevTools (F12)
3. Go to Application tab → IndexedDB
4. Import storage service in console:
   ```javascript
   import { initDB } from './services/storageService.js';
   await initDB();
   ```
5. Refresh IndexedDB view
6. Verify `edgereader` database exists
7. Verify `preferences` object store exists

**Done when:**
- Database and object store are visible in DevTools
- No errors in console

**Verify:**
- Visual inspection in DevTools

**Evidence to record:**
- Screenshot of DevTools showing IndexedDB structure

**Files touched:**
- None (testing only)

---

### T10: Manual Test - Save and Load Preferences
**Goal:** Verify preferences persist across page reloads

**Steps:**
1. Open browser console
2. Import storage service functions
3. Create test preferences:
   ```javascript
   const testPrefs = {
     selectedTopics: new Set(["Sports", "Politics"]),
     enabledSources: new Set(["BBC News"]),
     disabledSources: new Set(["Reuters Tech"]),
     keywords: new Set(["election", "climate"])
   };
   ```
4. Save preferences: `await savePreferences(testPrefs);`
5. Reload page (F5)
6. Load preferences: `const loaded = await loadPreferences();`
7. Verify loaded preferences match test preferences
8. Verify Sets are Sets (not Arrays): `loaded.selectedTopics instanceof Set`

**Done when:**
- Preferences persist across reload
- Sets are properly reconstructed

**Verify:**
- Console output shows matching data
- `instanceof Set` returns true

**Evidence to record:**
- Console screenshots showing save and load
- Confirmation that Sets are Sets

**Files touched:**
- None (testing only)

---

### T11: Manual Test - Default Preferences
**Goal:** Verify default preferences are returned for new users

**Steps:**
1. Open DevTools → Application → IndexedDB
2. Delete `edgereader` database (right-click → Delete)
3. Open browser console
4. Import storage service
5. Call `const prefs = await loadPreferences();`
6. Verify returned preferences:
   - `selectedTopics` contains "Technology", "Science", "General"
   - `enabledSources` is empty Set
   - `disabledSources` is empty Set
   - `keywords` is empty Set

**Done when:**
- Default preferences are returned
- All fields are Sets

**Verify:**
- Console output shows default values

**Evidence to record:**
- Console screenshot showing default preferences

**Files touched:**
- None (testing only)

---

### T12: Manual Test - Update Preferences
**Goal:** Verify partial updates work correctly

**Steps:**
1. Save initial preferences with multiple fields set
2. Call `updatePreferences({ keywords: new Set(["AI", "blockchain"]) })`
3. Load preferences
4. Verify:
   - `keywords` updated to ["AI", "blockchain"]
   - `selectedTopics` unchanged
   - `enabledSources` unchanged
   - `disabledSources` unchanged

**Done when:**
- Only specified field is updated
- Other fields remain unchanged

**Verify:**
- Console output shows selective update

**Evidence to record:**
- Console screenshot showing before/after update

**Files touched:**
- None (testing only)

---

### T13: Manual Test - No Network Calls
**Goal:** Verify privacy compliance (no network calls during save/load)

**Steps:**
1. Open DevTools → Network tab
2. Clear network log
3. Import storage service
4. Call `await savePreferences(testPrefs);`
5. Call `await loadPreferences();`
6. Check Network tab for any HTTP requests

**Done when:**
- No network requests appear in Network tab
- Only IndexedDB operations occur

**Verify:**
- Visual inspection of Network tab

**Evidence to record:**
- Screenshot of empty Network tab
- Confirmation of privacy compliance

**Files touched:**
- None (testing only)

---

## Documentation

### T14: Update SPEC.md and SPECS.md
**Goal:** Update tracking documents to reflect Epic 2.0 status

**Steps:**
1. Open `SPEC.md`
2. Update "Current focus" section:
   - Roadmap anchor: 2.0
   - Spec folder: specs/020-preferences-storage/
   - Status: In progress
3. Add links to spec.md, plan.md, tasks.md
4. Save file
5. Open `SPECS.md`
6. Update Epic 2.0 row:
   - Status: In progress
   - Spec folder: link to specs/020-preferences-storage/
7. Save file

**Done when:**
- SPEC.md points to Epic 2.0
- SPECS.md shows Epic 2.0 as "In progress"

**Verify:**
- Open both files and confirm updates

**Evidence to record:**
- Confirmation that tracking files are updated

**Files touched:**
- `SPEC.md`
- `SPECS.md`

---

### T15: Document Evidence in spec.md
**Goal:** Consolidate all verification evidence in spec.md EVIDENCE section

**Steps:**
1. Open `specs/020-preferences-storage/spec.md`
2. Scroll to EVIDENCE section
3. Add subsections:
   - Implementation Summary
   - Code Implementation Evidence
   - Manual Testing Results (T9-T13)
   - Acceptance Criteria Verification
   - Privacy Compliance
4. Include:
   - Code snippets from implementation
   - Test results from manual testing
   - Screenshots of IndexedDB and console
   - Confirmation of all ACs passed
5. Add final status: Complete or In Progress
6. Save file

**Done when:**
- All evidence is documented
- Each AC has verification result
- Screenshots are embedded

**Verify:**
- Review spec.md EVIDENCE section for completeness

**Evidence to record:**
- N/A (this task creates the evidence record)

**Files touched:**
- `specs/020-preferences-storage/spec.md`

---

## Summary

**Total Tasks:** 15  
**Estimated Time:** 3-4 hours  
**Core Implementation:** T1-T8 (~2 hours)  
**Verification:** T9-T13 (~1 hour)  
**Documentation:** T14-T15 (~30 minutes)

**Critical Path:**
1. T1 (Install idb) → T2 (Create file) → T3-T8 (Implement functions)
2. T9-T13 (Manual testing) depend on T3-T8
3. T15 (Document evidence) depends on T9-T13
4. T14 can be done anytime after spec package is created

**Dependencies:**
- All verification tasks (T9-T13) depend on implementation tasks (T3-T8)
- T15 depends on all verification tasks
