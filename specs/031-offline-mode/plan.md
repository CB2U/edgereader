# Plan: Offline Mode & Service Worker

**Epic:** 3.1 - Offline Mode & Service Worker  
**Spec:** [spec.md](file:///mnt/Storage/Documents/Projects/EdgeReader/specs/031-offline-mode/spec.md)  
**Status:** Draft  
**Last Updated:** December 31, 2025

---

## Architecture Overview

### Key Components

**1. Service Worker (`public/service-worker.js`)**
- Handles app shell caching (install event)
- Serves cached resources when offline (fetch event)
- Cleans up old caches (activate event)
- Implements cache-first strategy for static assets
- Implements network-first strategy for API calls

**2. Service Worker Registration (`src/main.jsx`)**
- Registers Service Worker on app load
- Handles registration errors gracefully
- Logs lifecycle events to console

**3. Offline Detection (`src/App.jsx`)**
- Monitors `navigator.onLine` status
- Listens to online/offline events
- Updates UI state based on connectivity

**4. Offline UI Components**
- Offline indicator banner/icon
- Refresh button in app header
- Loading states during refresh
- Error messages for failed operations

**5. Integration with IndexedDB Cache (Epic 3.0)**
- Loads cached articles when offline
- Displays "Offline" message with cached articles
- Refresh button triggers feed fetch + IndexedDB caching

### Component Responsibilities

| Component | Responsibility |
|-----------|----------------|
| `service-worker.js` | Cache management, offline serving |
| `main.jsx` | Service Worker registration |
| `App.jsx` | Offline detection, refresh logic, UI state |
| `OfflineIndicator.jsx` | Display online/offline status |
| `RefreshButton.jsx` | Manual refresh trigger |
| `articleStorage.js` | Article caching (Epic 3.0, unchanged) |

### Message/Call Flow

**App Startup (Online):**
```
1. main.jsx → Register Service Worker
2. Service Worker → Install event → Cache app shell
3. Service Worker → Activate event → Clean old caches
4. App.jsx → Initialize state (isOnline = true)
5. App.jsx → Fetch articles from RSS feeds
6. articleStorage.js → Cache articles to IndexedDB
7. App.jsx → Display articles
```

**App Startup (Offline):**
```
1. main.jsx → Service Worker already registered
2. Service Worker → Serve app shell from cache
3. App.jsx → Initialize state (isOnline = false)
4. App.jsx → Load articles from IndexedDB
5. App.jsx → Display cached articles with offline indicator
```

**Manual Refresh (Online):**
```
1. User clicks refresh button
2. App.jsx → Check navigator.onLine
3. App.jsx → Fetch articles from RSS feeds
4. articleStorage.js → Cache articles to IndexedDB
5. App.jsx → Update UI with new articles
```

**Manual Refresh (Offline):**
```
1. User clicks refresh button
2. App.jsx → Check navigator.onLine (false)
3. App.jsx → Show error: "Cannot refresh while offline"
```

### Alternatives Considered

**1. Workbox vs Vanilla Service Worker**
- **Chosen:** Vanilla Service Worker
- **Rationale:** Simpler for MVP, no additional dependencies, full control over caching logic
- **Tradeoff:** More boilerplate code, but easier to understand and debug

**2. Pull-to-Refresh vs Refresh Button**
- **Chosen:** Refresh Button
- **Rationale:** Simpler implementation, no gesture library needed, works on desktop
- **Tradeoff:** Less mobile-native feel, but sufficient for MVP

**3. Automatic Refresh on Reconnection vs Manual Only**
- **Chosen:** Manual Only
- **Rationale:** Simpler, more predictable, respects user control
- **Tradeoff:** User must manually refresh, but avoids unexpected network usage

**4. Service Worker Update Prompt vs Auto-Update**
- **Chosen:** Auto-Update on Reload
- **Rationale:** Simpler for MVP, no additional UI needed
- **Tradeoff:** User doesn't know about updates, but gets them automatically

---

## Data Contracts

### Service Worker Cache Structure

**Cache Name:** `edgereader-v1` (versioned for updates)

**Cached Resources:**
```javascript
[
  '/',
  '/index.html',
  '/assets/index-[hash].css',  // Vite generates hashed filenames
  '/assets/index-[hash].js',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
]
```

**Note:** Vite generates hashed filenames for CSS/JS. Service Worker must be updated with correct hashes on each build.

### Offline State Interface

```typescript
interface OfflineState {
  isOnline: boolean;        // Current connectivity status
  isLoading: boolean;       // Refresh in progress
  error: string | null;     // Error message (if any)
  lastRefresh: Date | null; // Last successful refresh timestamp
}
```

---

## Storage and Persistence

### Cache Storage (Service Worker)
- **Purpose:** Store app shell for offline access
- **Scope:** Browser cache (managed by Service Worker)
- **Lifetime:** Persists until Service Worker is unregistered or cache is cleared
- **Size:** ~500 KB (app shell only)

### IndexedDB (Epic 3.0)
- **Purpose:** Store article metadata
- **Scope:** Browser IndexedDB (managed by `articleStorage.js`)
- **Lifetime:** Persists until user clears browser data
- **Size:** ~100 articles (~50 KB)

**No changes to IndexedDB schema or operations.**

---

## External Integrations

**None** - This epic is purely client-side. Service Worker integrates with:
- Browser Cache API (native)
- Browser Service Worker API (native)
- Epic 3.0's IndexedDB cache (internal)

---

## UX and Operational States

### Online State
- **Indicator:** No offline banner (or green "Online" icon, optional)
- **Refresh Button:** Enabled, shows loading spinner when clicked
- **Article Display:** Shows fetched articles (fresh or cached)
- **Error Handling:** Network errors show "Failed to refresh" message

### Offline State
- **Indicator:** Banner at top: "⚠️ Offline - Showing cached articles"
- **Refresh Button:** Disabled (or shows error when clicked)
- **Article Display:** Shows cached articles from IndexedDB
- **Error Handling:** Refresh attempts show "Cannot refresh while offline"

### Loading State (During Refresh)
- **Indicator:** Loading spinner on refresh button
- **Refresh Button:** Disabled during refresh
- **Article Display:** Shows previous articles (no skeleton screen)
- **Error Handling:** Timeout after 10 seconds shows error

### Error State
- **Indicator:** Error message below refresh button (red text)
- **Refresh Button:** Enabled (user can retry)
- **Article Display:** Shows previous articles
- **Error Handling:** Error auto-dismisses after 5 seconds

---

## Testing Plan

### Unit Tests

**Service Worker Tests (Manual - Browser DevTools)**
- Service Worker registration succeeds
- Install event caches app shell
- Activate event cleans old caches
- Fetch event serves from cache when offline

**Offline Detection Tests**
- `navigator.onLine` reflects actual connectivity
- Online/offline events trigger state updates
- UI updates when connectivity changes

**Refresh Logic Tests**
- Refresh succeeds when online
- Refresh fails gracefully when offline
- Loading states update correctly
- Error messages display correctly

### Integration Tests

**End-to-End Offline Flow**
1. Load app while online
2. Verify Service Worker registered
3. Verify app shell cached
4. Go offline (DevTools or airplane mode)
5. Reload page
6. Verify app loads from cache
7. Verify cached articles display
8. Verify offline indicator shows

**End-to-End Refresh Flow**
1. Load app while online
2. Click refresh button
3. Verify loading spinner shows
4. Verify new articles fetched
5. Verify articles cached to IndexedDB
6. Verify UI updates with new articles

**Service Worker Update Flow**
1. Deploy new Service Worker version
2. Reload page
3. Verify new Service Worker activates
4. Verify old cache cleared
5. Verify new cache created

### Browser Testing

**Browsers to Test:**
- Chrome (desktop + Android)
- Firefox (desktop)
- Safari (desktop + iOS)
- Edge (desktop)

**Test Cases:**
- Service Worker registration
- Offline app shell loading
- Cached article display
- Refresh button functionality
- Online/offline indicator
- PWA installability (mobile)

---

## AC Verification Mapping

| AC | Verification Method | Test Location |
|----|---------------------|---------------|
| **AC-3.1.1** (Service Worker Registration) | DevTools → Application → Service Workers | Manual browser test |
| **AC-3.1.2** (App Shell Caching) | DevTools → Application → Cache Storage | Manual browser test |
| **AC-3.1.3** (Offline App Shell) | Load app, go offline, reload, verify loads | Manual browser test |
| **AC-3.1.4** (Offline Indicator) | Go offline, verify banner shows | Manual browser test |
| **AC-3.1.5** (Refresh Button) | Click refresh, verify console logs | Manual browser test |
| **AC-3.1.6** (Offline Article Display) | Load articles, go offline, verify display | Manual browser test |
| **AC-3.1.7** (PWA Installability) | Test on Android/iOS, verify install prompt | Manual mobile test |
| **AC-3.1.8** (Service Worker Updates) | Update SW, reload, verify new version | Manual browser test |
| **AC-7** (Offline 100 Articles) | Load feed, go offline, verify 100 articles | Manual browser test |

---

## Risks and Mitigations

### Technical Risks

**1. Service Worker Caching Issues**
- **Risk:** Vite generates hashed filenames, Service Worker cache list may be outdated
- **Mitigation:** Use Vite plugin to auto-generate Service Worker with correct hashes, or use wildcard caching for `/assets/*`

**2. Service Worker Update Failures**
- **Risk:** New Service Worker doesn't activate, users stuck on old version
- **Mitigation:** Use `skipWaiting()` and `clients.claim()` for immediate activation. Test update flow thoroughly.

**3. Offline Detection False Positives**
- **Risk:** `navigator.onLine` may report online when network is slow/broken
- **Mitigation:** Combine with fetch timeout. If fetch fails, treat as offline.

**4. Cache Invalidation**
- **Risk:** Old app shell cached, users don't get updates
- **Mitigation:** Version cache names (`edgereader-v1`, `edgereader-v2`, etc.). Clear old caches on activate.

### UX Risks

**1. Offline Indicator Too Intrusive**
- **Risk:** Banner blocks content, annoys users
- **Mitigation:** Use subtle banner at top, auto-hide when online. Test with users.

**2. Refresh Button Confusion**
- **Risk:** Users don't understand when to refresh
- **Mitigation:** Show last refresh timestamp. Disable button when offline with clear message.

**3. PWA Install Prompt Timing**
- **Risk:** Prompt appears too early, users dismiss
- **Mitigation:** Browser controls install prompt timing. No custom prompt for MVP.

---

## Rollout and Migration Notes

### Deployment Steps

1. **Build app with Vite**
   - Generates hashed CSS/JS filenames
   - Outputs to `dist/` folder

2. **Update Service Worker cache list**
   - Manually update `service-worker.js` with correct hashed filenames
   - Or use Vite plugin to auto-generate

3. **Deploy to hosting**
   - Upload `dist/` folder to server
   - Ensure HTTPS enabled (required for Service Worker)

4. **Verify Service Worker registration**
   - Open app in browser
   - Check DevTools → Application → Service Workers
   - Verify "Activated and running" status

5. **Test offline functionality**
   - Load app, go offline, reload
   - Verify app loads and articles display

### Migration Notes

**No data migration needed** - This epic adds new functionality without changing existing data structures.

**Existing users:**
- Service Worker will register on next visit
- App shell will be cached automatically
- No user action required

**Rollback plan:**
- If Service Worker causes issues, unregister via DevTools
- App will continue to work without offline support
- No data loss

---

## Observability and Debugging

### What Can Be Logged

**Service Worker Lifecycle:**
- ✅ Registration success/failure
- ✅ Install event (cache creation)
- ✅ Activate event (old cache cleanup)
- ✅ Fetch events (cache hits/misses)
- ✅ Update events (new version detected)

**Offline Detection:**
- ✅ Online/offline state changes
- ✅ Refresh attempts (success/failure)
- ✅ Network errors

**Cache Operations:**
- ✅ Cache size (number of cached resources)
- ✅ Cache hits/misses
- ✅ Cache clearing events

### What Must Never Be Logged

**Privacy-Sensitive Data:**
- ❌ User preferences or settings
- ❌ Article URLs or titles (user reading habits)
- ❌ Timestamps of article views
- ❌ User identifiers or session IDs
- ❌ Network request details (beyond success/failure)

### Debugging Tools

**Browser DevTools:**
- Application → Service Workers (lifecycle, status)
- Application → Cache Storage (cached resources)
- Network → Offline mode (simulate offline)
- Console → Service Worker logs

**Recommended Console Logs:**
```javascript
// Service Worker
console.log('✅ Service Worker: Installed');
console.log('✅ Service Worker: Activated');
console.log('📦 Service Worker: Cached 7 resources');
console.log('🔄 Service Worker: Serving from cache');

// App
console.log('🌐 Online status:', navigator.onLine);
console.log('🔄 Refreshing feed...');
console.log('✅ Refresh complete: 50 new articles');
console.log('❌ Refresh failed: Network error');
```

---

## Implementation Phases

### Phase 1: Service Worker Setup (T1-T4)
- Create `public/service-worker.js`
- Implement install, activate, fetch events
- Register Service Worker in `main.jsx`
- Test in browser DevTools

### Phase 2: Offline Detection (T5-T6)
- Add online/offline state to `App.jsx`
- Create `OfflineIndicator.jsx` component
- Test online/offline transitions

### Phase 3: Refresh Button (T7-T8)
- Create `RefreshButton.jsx` component
- Implement refresh logic in `App.jsx`
- Add loading and error states

### Phase 4: Integration & Testing (T9-T11)
- Integrate all components
- Test offline flow end-to-end
- Test on multiple browsers
- Test PWA installability on mobile

### Phase 5: Documentation (T12)
- Update SPEC.md with evidence
- Update SPECS.md with status
- Document known issues

---

**Status:** Draft  
**Next Steps:** Review plan, create tasks.md, get user approval  
**Estimated Implementation Time:** 2-3 hours
