# Tasks: Offline Mode & Service Worker

**Epic:** 3.1 - Offline Mode & Service Worker  
**Spec:** [spec.md](file:///mnt/Storage/Documents/Projects/EdgeReader/specs/031-offline-mode/spec.md)  
**Plan:** [plan.md](file:///mnt/Storage/Documents/Projects/EdgeReader/specs/031-offline-mode/plan.md)  
**Status:** Draft  
**Last Updated:** December 31, 2025

---

## Setup

### T1: Create Service Worker File
**Goal:** Create `public/service-worker.js` with basic structure

**Steps:**
1. Create `public/service-worker.js` file
2. Add install event handler (cache app shell)
3. Add activate event handler (clean old caches)
4. Add fetch event handler (serve from cache)
5. Use versioned cache name: `edgereader-v1`

**Done when:**
- [x] `public/service-worker.js` exists
- [x] All three event handlers implemented
- [x] Cache name is versioned

**Verify:**
- File exists at `public/service-worker.js`
- Code compiles without errors

**Evidence to record:**
- Screenshot of file structure
- Code snippet of Service Worker

**Files touched:**
- `public/service-worker.js` (new)

---

### T2: Register Service Worker
**Goal:** Register Service Worker in `main.jsx` on app startup

**Steps:**
1. Open `src/main.jsx`
2. Add Service Worker registration after app initialization
3. Check for Service Worker support (`'serviceWorker' in navigator`)
4. Register `/service-worker.js`
5. Add success/error logging

**Done when:**
- [x] Service Worker registration code added to `main.jsx`
- [x] Registration happens on app load
- [x] Errors are logged to console

**Verify:**
- Open DevTools → Application → Service Workers
- Verify Service Worker is registered and active
- Check console for registration logs

**Evidence to record:**
- Screenshot of DevTools showing active Service Worker
- Console logs showing registration success

**Files touched:**
- `src/main.jsx` (modify)

---

## Core Implementation

### T3: Implement App Shell Caching
**Goal:** Cache app shell resources in Service Worker install event

**Steps:**
1. Open `public/service-worker.js`
2. In install event, cache these resources:
   - `/` (root)
   - `/index.html`
   - `/manifest.json`
   - `/icon-192.png`
   - `/icon-512.png`
   - Vite-generated CSS/JS files (check `dist/` after build)
3. Use `cache.addAll()` for bulk caching
4. Call `self.skipWaiting()` for immediate activation
5. Add error handling

**Done when:**
- [x] Install event caches all app shell resources
- [x] Service Worker activates immediately
- [x] Errors are logged

**Verify:**
- Build app: `npm run build`
- Check `dist/assets/` for CSS/JS filenames
- Update Service Worker cache list with correct filenames
- Open DevTools → Application → Cache Storage
- Verify `edgereader-v1` cache exists with all resources

**Evidence to record:**
- Screenshot of Cache Storage showing cached resources
- List of cached files

**Files touched:**
- `public/service-worker.js` (modify)

---

### T4: Implement Offline Serving
**Goal:** Serve cached resources when offline

**Steps:**
1. Open `public/service-worker.js`
2. In fetch event, implement cache-first strategy:
   - Check cache for matching request
   - If found, return cached response
   - If not found, fetch from network
   - Optionally cache network response for future use
3. Add error handling for network failures
4. Log cache hits/misses (optional, for debugging)

**Done when:**
- [x] Fetch event serves from cache when available
- [x] Network fallback works when resource not cached
- [x] Offline requests don't fail

**Verify:**
- Load app while online
- Go offline (DevTools → Network → Offline)
- Reload page
- Verify app loads from cache
- Check console for Service Worker logs

**Evidence to record:**
- Screenshot of app loading while offline
- Console logs showing cache hits

**Files touched:**
- `public/service-worker.js` (modify)

---

### T5: Add Offline Detection to App
**Goal:** Detect online/offline status and update UI state

**Steps:**
1. Open `src/App.jsx`
2. Add state: `const [isOnline, setIsOnline] = useState(navigator.onLine)`
3. Add useEffect to listen for online/offline events:
   - `window.addEventListener('online', handleOnline)`
   - `window.addEventListener('offline', handleOffline)`
4. Update state when connectivity changes
5. Clean up event listeners on unmount

**Done when:**
- [x] App tracks online/offline status
- [x] State updates when connectivity changes
- [x] Event listeners are cleaned up

**Verify:**
- Open app
- Go offline (DevTools or airplane mode)
- Check React DevTools: `isOnline` should be `false`
- Go online
- Check React DevTools: `isOnline` should be `true`

**Evidence to record:**
- Screenshot of React DevTools showing state changes
- Console logs showing connectivity changes

**Files touched:**
- `src/App.jsx` (modify)

---

### T6: Create Offline Indicator Component
**Goal:** Display banner when offline

**Steps:**
1. Create `src/components/OfflineIndicator.jsx`
2. Accept `isOnline` prop
3. Render banner when `isOnline === false`:
   - Text: "⚠️ Offline - Showing cached articles"
   - Style: Yellow background, top of page, non-intrusive
4. Hide banner when online
5. Use Material UI components (Alert or custom styled div)

**Done when:**
- Component created and exported
- Banner shows when offline
- Banner hides when online
- Styling is non-intrusive

**Verify:**
- Import component in `App.jsx`
- Pass `isOnline` prop
- Go offline
- Verify banner appears at top of page
- Go online
- Verify banner disappears

**Evidence to record:**
- Screenshot of offline banner
- Screenshot of app without banner (online)

**Files touched:**
- `src/components/OfflineIndicator.jsx` (new)
- `src/App.jsx` (modify - import and use component)

---

### T7: Create Refresh Button Component
**Goal:** Add manual refresh button to app header

**Steps:**
1. Create `src/components/RefreshButton.jsx`
2. Accept props: `onRefresh`, `isLoading`, `isOnline`
3. Render IconButton with refresh icon (Material UI)
4. Show loading spinner when `isLoading === true`
5. Disable button when `isLoading === true`
6. Call `onRefresh()` when clicked
7. Add tooltip: "Refresh feed"

**Done when:**
- Component created and exported
- Button shows refresh icon
- Loading spinner shows during refresh
- Button is disabled during refresh
- Tooltip is visible on hover

**Verify:**
- Import component in `App.jsx`
- Add to app header/toolbar
- Click button
- Verify loading spinner appears
- Verify button is disabled during refresh

**Evidence to record:**
- Screenshot of refresh button
- Screenshot of loading spinner

**Files touched:**
- `src/components/RefreshButton.jsx` (new)
- `src/App.jsx` (modify - import and use component)

---

### T8: Implement Refresh Logic
**Goal:** Fetch new articles when refresh button clicked

**Steps:**
1. Open `src/App.jsx`
2. Add state: `const [isLoading, setIsLoading] = useState(false)`
3. Add state: `const [error, setError] = useState(null)`
4. Create `handleRefresh` function:
   - Check if online (`navigator.onLine`)
   - If offline, set error: "Cannot refresh while offline"
   - If online, set `isLoading = true`
   - Fetch articles from RSS feeds (existing logic)
   - Cache articles to IndexedDB (existing logic)
   - Update articles state
   - Set `isLoading = false`
   - Handle errors gracefully
5. Pass `handleRefresh` to RefreshButton component

**Done when:**
- Refresh logic implemented
- Online check prevents offline refreshes
- Loading state updates correctly
- Errors are handled and displayed
- Articles update after successful refresh

**Verify:**
- Click refresh button while online
- Verify console logs show fetch and cache operations
- Verify articles update in UI
- Go offline
- Click refresh button
- Verify error message: "Cannot refresh while offline"

**Evidence to record:**
- Console logs showing successful refresh
- Screenshot of error message when offline

**Files touched:**
- `src/App.jsx` (modify)

---

## Testing & Verification

### T9: Test Offline Flow End-to-End
**Goal:** Verify complete offline functionality

**Steps:**
1. Load app while online
2. Verify Service Worker registered (DevTools)
3. Verify app shell cached (DevTools → Cache Storage)
4. Verify articles fetched and cached (DevTools → IndexedDB)
5. Go offline (DevTools → Network → Offline or airplane mode)
6. Reload page
7. Verify app loads from cache
8. Verify cached articles display
9. Verify offline indicator shows
10. Try to refresh
11. Verify error message shows

**Done when:**
- All steps pass without errors
- App works fully offline
- Cached articles display correctly
- Offline indicator shows
- Refresh fails gracefully

**Verify:**
- Follow steps above
- Document results in spec.md EVIDENCE section

**Evidence to record:**
- Screenshots of each step
- Console logs
- DevTools screenshots (Service Worker, Cache, IndexedDB)

**Files touched:**
- None (testing only)

---

### T10: Test PWA Installability
**Goal:** Verify app can be installed to home screen

**Steps:**
1. Deploy app to HTTPS server (or use localhost)
2. Open app on mobile device (Android or iOS)
3. Wait for "Add to Home Screen" prompt
4. Install app
5. Open installed app
6. Verify app opens in standalone mode
7. Verify app works offline

**Done when:**
- App can be installed on mobile
- Installed app works correctly
- Offline functionality works in installed app

**Verify:**
- Test on Android (Chrome)
- Test on iOS (Safari)
- Document results

**Evidence to record:**
- Screenshots of install prompt
- Screenshots of installed app
- Screenshots of standalone mode

**Files touched:**
- None (testing only)

---

### T11: Cross-Browser Testing
**Goal:** Verify Service Worker works in all major browsers

**Steps:**
1. Test in Chrome (desktop)
2. Test in Firefox (desktop)
3. Test in Safari (desktop, if available)
4. Test in Edge (desktop)
5. For each browser:
   - Verify Service Worker registers
   - Verify offline functionality works
   - Verify refresh button works
   - Verify offline indicator shows

**Done when:**
- All browsers tested
- Service Worker works in all browsers
- No browser-specific issues found

**Verify:**
- Document results for each browser
- Note any browser-specific issues

**Evidence to record:**
- Browser compatibility table
- Screenshots from each browser

**Files touched:**
- None (testing only)

---

## Documentation & Tracking

### T12: Update Spec with Evidence
**Goal:** Document implementation results in spec.md

**Steps:**
1. Open `specs/031-offline-mode/spec.md`
2. Update EVIDENCE section with:
   - Implementation summary
   - Files created/modified
   - Verification results
   - Screenshots and recordings
   - AC verification table
   - Known issues (if any)
3. Update status to "Complete"
4. Add "Last Updated" timestamp

**Done when:**
- EVIDENCE section is complete
- All ACs verified and documented
- Status updated

**Verify:**
- Review spec.md for completeness
- Ensure all evidence is linked correctly

**Evidence to record:**
- Updated spec.md file

**Files touched:**
- `specs/031-offline-mode/spec.md` (modify)

---

### T13: Update SPEC.md and SPECS.md
**Goal:** Update project tracking files

**Steps:**
1. Open `SPEC.md`
2. Update "Current focus" to Epic 3.1
3. Update status to "Done"
4. Update links to spec/plan/tasks files
5. Open `SPECS.md`
6. Update Epic 3.1 row:
   - Status: "Done"
   - Spec folder: `specs/031-offline-mode/`
7. Update Breakpoint BP3 status to "Done"
8. Add change log entry

**Done when:**
- SPEC.md updated
- SPECS.md updated
- Breakpoint status updated

**Verify:**
- Review both files for accuracy
- Ensure links work

**Evidence to record:**
- Updated SPEC.md and SPECS.md files

**Files touched:**
- `SPEC.md` (modify)
- `SPECS.md` (modify)

---

## Task Summary

**Total Tasks:** 13  
**Estimated Time:** 2-3 hours  
**Dependencies:** Epic 3.0 (Article Caching) - COMPLETE

**Task Breakdown:**
- Setup: T1-T2 (30 min)
- Core Implementation: T3-T8 (90 min)
- Testing: T9-T11 (45 min)
- Documentation: T12-T13 (15 min)

**Critical Path:**
T1 → T2 → T3 → T4 → T5 → T6 → T7 → T8 → T9 → T12 → T13

**Parallel Work:**
- T10 (PWA install) can be done after T9
- T11 (cross-browser) can be done after T9

---

**Status:** Draft  
**Next Steps:** Review tasks, get user approval, begin implementation
