# Tasks: Article Caching (IndexedDB)

**Epic:** 3.0 - Article Caching (IndexedDB)  
**Spec:** [spec.md](file:///mnt/Storage/Documents/Projects/EdgeReader/specs/030-article-caching/spec.md)  
**Plan:** [plan.md](file:///mnt/Storage/Documents/Projects/EdgeReader/specs/030-article-caching/plan.md)

---

## Task Breakdown

### Phase 1: Setup & Dependencies
- [x] **T1:** Install `idb` library (`npm install idb`)
- [x] **T2:** Create `src/services/articleStorage.js` file structure

### Phase 2: Storage Service Implementation
- [x] **T3:** Implement `initDatabase()` method
  - Create `EdgeReaderDB` database (version 1)
  - Create `articles` object store with indexes
  - Handle initialization errors
- [x] **T4:** Implement `insertArticles(articles)` method
  - Bulk insert with transaction
  - URL-based deduplication
  - Add `fetchedAt` timestamp
  - Return inserted count
- [x] **T5:** Implement query methods
  - `getArticles(limit, offset)` - ordered by `publishDate`
  - `getArticlesByTopic(topic, limit)` - filtered by topic
  - `getArticleCount()` - return total count
- [x] **T6:** Implement cache management methods
  - `deleteOldArticles(keepCount)` - prune by `fetchedAt`
  - `clearAllArticles()` - clear entire cache

### Phase 3: Integration
- [x] **T7:** Update `main.jsx` to initialize database on startup
- [x] **T8:** Update `feedService.js` to cache articles after fetch
  - Import `articleStorage`
  - Call `insertArticles()` after fetch
  - Call `deleteOldArticles(100)` after insertion
  - Add console logging for cache statistics
  - Add error handling

### Phase 4: Testing & Verification
- [ ] **T9:** Create unit tests (`src/services/articleStorage.test.js`)
  - Test database initialization
  - Test article insertion and deduplication
  - Test query operations
  - Test cache pruning
- [x] **T10:** Manual verification (see plan.md MV-1 through MV-7)
  - MV-1: Database initialization
  - MV-2: Article caching
  - MV-3: Deduplication
  - MV-4: Cache pruning
  - MV-5: Query operations
  - MV-6: Integration with feed
  - MV-7: Performance
- [x] **T11:** Verify all acceptance criteria (AC-3.0.1 through AC-3.0.7)

### Phase 5: Documentation
- [x] **T12:** Update `spec.md` with EVIDENCE section
- [x] **T13:** Update `SPEC.md` to mark Epic 3.0 as complete
- [x] **T14:** Update `SPECS.md` with Epic 3.0 entry

---

## Task Dependencies

```
T1 (Install idb)
 └─> T2 (Create file)
      └─> T3 (initDatabase)
           ├─> T4 (insertArticles)
           ├─> T5 (query methods)
           └─> T6 (cache management)
                └─> T7 (main.jsx integration)
                     └─> T8 (feedService integration)
                          └─> T9 (unit tests)
                               └─> T10 (manual verification)
                                    └─> T11 (AC verification)
                                         └─> T12-T14 (documentation)
```

---

## Estimated Effort

- **Phase 1:** 15 minutes (setup)
- **Phase 2:** 1.5 hours (storage service implementation)
- **Phase 3:** 30 minutes (integration)
- **Phase 4:** 1 hour (testing)
- **Phase 5:** 15 minutes (documentation)

**Total:** ~3.5 hours

---

## Definition of Done

- [ ] All tasks (T1-T14) completed
- [ ] All acceptance criteria (AC-3.0.1 through AC-3.0.7) verified
- [ ] Unit tests passing
- [ ] Manual verification completed
- [ ] IndexedDB stores 100 articles after multiple feed refreshes
- [ ] No console errors related to storage
- [ ] Performance targets met (insertion \u003c 500ms, query \u003c 100ms)
- [ ] Documentation updated (spec.md, SPEC.md, SPECS.md)

---

**Status:** 🔄 READY FOR IMPLEMENTATION  
**Last Updated:** December 31, 2025
