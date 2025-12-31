# Implementation Plan: Article Caching (IndexedDB)

**Epic:** 3.0 - Article Caching (IndexedDB)  
**Spec:** [spec.md](file:///mnt/Storage/Documents/Projects/EdgeReader/specs/030-article-caching/spec.md)  
**Status:** 🔄 PLANNING

---

## Goal Description

Implement a robust client-side caching layer using IndexedDB to store fetched articles, enabling faster load times and offline support. This epic creates the storage foundation required for Epic 3.1 (Offline Mode & Service Worker).

**Background:** Currently, articles are fetched fresh on every page load, which is slow and network-dependent. By caching articles in IndexedDB, we can:
- Display articles instantly on subsequent visits
- Support offline mode (Epic 3.1)
- Reduce bandwidth usage
- Improve user experience

**What this change accomplishes:**
- Creates IndexedDB schema for article storage
- Implements storage service with CRUD operations
- Integrates caching with existing feed fetching logic
- Automatically prunes cache to last 100 articles
- Maintains privacy (all data stays local)

---

## User Review Required

> [!IMPORTANT]
> **IndexedDB Library Choice:** This plan uses the `idb` library (Jake Archibald's IndexedDB wrapper) for cleaner async/await syntax. This adds ~2KB to bundle size but significantly improves code readability and error handling. Alternative: use native IndexedDB API (more verbose, no dependency).

> [!IMPORTANT]
> **Cache Size Limit:** Cache is limited to 100 articles (pruned by `fetchedAt` timestamp). This should be ~500KB-1MB of storage. If users want more, we can make this configurable in Epic 4.1 (Settings Screen).

---

## Proposed Changes

### Core Storage Layer

#### [NEW] [articleStorage.js](file:///mnt/Storage/Documents/Projects/EdgeReader/src/services/articleStorage.js)

Create IndexedDB storage service with the following methods:
- `initDatabase()`: Initialize `EdgeReaderDB` database with `articles` object store
- `insertArticles(articles)`: Bulk insert with URL-based deduplication
- `getArticles(limit, offset)`: Query articles ordered by `publishDate` (newest first)
- `getArticlesByTopic(topic, limit)`: Filter articles by topic
- `deleteOldArticles(keepCount)`: Prune cache to N most recent articles (by `fetchedAt`)
- `clearAllArticles()`: Clear entire cache (for testing/debugging)
- `getArticleCount()`: Return total cached article count

**Schema:**
- Database: `EdgeReaderDB` (version 1)
- Object store: `articles` (keyPath: `id`, autoIncrement: true)
- Indexes: `url` (unique), `publishDate`, `topic`, `fetchedAt`

**Article object:**
```javascript
{
  id: 1, // auto-increment
  title: "Article Title",
  description: "Article description...",
  url: "https://example.com/article",
  source: "Reuters",
  publishDate: "2025-12-31T10:30:00Z",
  topic: "Technology",
  imageUrl: "https://example.com/image.jpg",
  fetchedAt: 1735642200000 // Unix timestamp
}
```

---

### Feed Integration

#### [MODIFY] [feedService.js](file:///mnt/Storage/Documents/Projects/EdgeReader/src/services/feedService.js)

Update feed fetching logic to cache articles after fetch:
1. Import `articleStorage` service
2. After fetching articles from RSS feeds, call `articleStorage.insertArticles(articles)`
3. After insertion, call `articleStorage.deleteOldArticles(100)` to prune cache
4. Add console logging for cache statistics (inserted count, deleted count)
5. Add error handling for storage failures (log error, continue with in-memory articles)

**Integration points:**
- `fetchArticles()` or equivalent main fetch function
- Ensure `fetchedAt` timestamp is added to each article before caching

---

### Dependencies

#### [MODIFY] [package.json](file:///mnt/Storage/Documents/Projects/EdgeReader/package.json)

Add `idb` library for cleaner IndexedDB async/await syntax:
```bash
npm install idb
```

**Alternative:** If bundle size is a concern, we can use native IndexedDB API (no dependency, but more verbose code).

---

### Initialization

#### [MODIFY] [main.jsx](file:///mnt/Storage/Documents/Projects/EdgeReader/src/main.jsx)

Initialize IndexedDB on app startup:
1. Import `articleStorage` service
2. Call `articleStorage.initDatabase()` before rendering React app
3. Add error handling for initialization failures (log error, continue without caching)

---

## Verification Plan

### Automated Tests

**Unit Tests for Storage Service:**
- Create `src/services/articleStorage.test.js` with tests for:
  - Database initialization
  - Article insertion (single and bulk)
  - Deduplication (insert same URL twice, verify only one entry)
  - Query operations (`getArticles`, `getArticlesByTopic`)
  - Cache pruning (`deleteOldArticles`)
  - Clear cache (`clearAllArticles`)
  - Article count (`getArticleCount`)

**Run command:**
```bash
npm test -- articleStorage.test.js
```

**Note:** IndexedDB tests require a browser environment. Use `@testing-library/react` with `jsdom` or run tests in actual browser with `vitest --browser`.

---

### Manual Verification

**MV-1: Database Initialization**
1. Clear IndexedDB: DevTools → Application → IndexedDB → Delete `EdgeReaderDB`
2. Reload app
3. Open DevTools → Application → IndexedDB
4. Verify `EdgeReaderDB` database exists with `articles` object store
5. Verify indexes: `url`, `publishDate`, `topic`, `fetchedAt`

**MV-2: Article Caching**
1. Open app, wait for feed to load
2. Open DevTools → Application → IndexedDB → `EdgeReaderDB` → `articles`
3. Verify articles are stored (should see 50+ entries)
4. Verify article structure matches schema (title, url, source, publishDate, topic, etc.)
5. Check console for cache statistics log (e.g., "Cached 52 new articles, pruned 0 old articles")

**MV-3: Deduplication**
1. Refresh feed multiple times (3-5 times)
2. Check IndexedDB article count
3. Verify count doesn't grow unbounded (should stay around 100 due to pruning)
4. Verify no duplicate URLs (check `url` index)

**MV-4: Cache Pruning**
1. Manually insert 150 test articles (use browser console):
   ```javascript
   const storage = await import('./src/services/articleStorage.js');
   const testArticles = Array.from({length: 150}, (_, i) => ({
     title: `Test Article ${i}`,
     url: `https://test.com/article-${i}`,
     source: 'Test',
     publishDate: new Date().toISOString(),
     topic: 'Technology',
     fetchedAt: Date.now()
   }));
   await storage.insertArticles(testArticles);
   await storage.deleteOldArticles(100);
   ```
2. Check IndexedDB article count
3. Verify exactly 100 articles remain
4. Verify oldest articles (by `fetchedAt`) were deleted

**MV-5: Query Operations**
1. Open browser console
2. Test `getArticles()`:
   ```javascript
   const storage = await import('./src/services/articleStorage.js');
   const articles = await storage.getArticles(10, 0);
   console.log(articles); // Should return 10 most recent articles
   ```
3. Test `getArticlesByTopic()`:
   ```javascript
   const techArticles = await storage.getArticlesByTopic('Technology', 5);
   console.log(techArticles); // Should return 5 Technology articles
   ```
4. Verify results match expectations

**MV-6: Integration with Feed**
1. Clear IndexedDB
2. Reload app
3. Verify feed loads and displays articles
4. Check IndexedDB - verify articles are cached
5. Reload app again
6. Verify feed still loads (should use cached articles if fetch fails)

**MV-7: Performance**
1. Open DevTools → Performance tab
2. Start recording
3. Reload app
4. Stop recording
5. Verify IndexedDB operations complete within:
   - Insertion: \u003c 500ms for 100 articles
   - Query: \u003c 100ms for 100 articles

---

### Acceptance Criteria Verification

| AC | Verification Method | Pass Criteria |
|----|---------------------|---------------|
| AC-3.0.1 (Database Init) | MV-1 | `EdgeReaderDB` exists with `articles` store |
| AC-3.0.2 (Article Insertion) | MV-2 | Articles stored in IndexedDB after fetch |
| AC-3.0.3 (Deduplication) | MV-3 | No duplicate URLs in IndexedDB |
| AC-3.0.4 (Query Articles) | MV-5 | `getArticles(10, 0)` returns 10 articles |
| AC-3.0.5 (Topic Filtering) | MV-5 | `getArticlesByTopic()` filters correctly |
| AC-3.0.6 (Cache Pruning) | MV-4 | Cache stays at 100 articles after pruning |
| AC-3.0.7 (Integration) | MV-6 | Feed caches and prunes automatically |
| AC-7 (Offline Support) | Epic 3.1 | Full offline mode tested in next epic |

---

**Status:** 🔄 PLANNING  
**Last Updated:** December 31, 2025  
**Next Steps:** Review plan, create tasks.md, implement storage service
