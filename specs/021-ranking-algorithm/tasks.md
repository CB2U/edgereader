# Tasks: On-Device Ranking Algorithm

**Epic:** 2.1 - Client-Side Ranking Algorithm  
**Spec:** [spec.md](file:///mnt/Storage/Documents/Projects/EdgeReader/specs/021-ranking-algorithm/spec.md)  
**Plan:** [plan.md](file:///mnt/Storage/Documents/Projects/EdgeReader/specs/021-ranking-algorithm/plan.md)

---

## Implementation Loop

### T1: Create rankingService.js
- [x] Create `src/services/rankingService.js`
- [x] Implement `scoreArticle(article, prefs)` with recency, topic, source, and keyword logic.
- [x] Implement `rankArticles(articles, prefs)` that maps, sorts, and filters.

### T2: Integrate into App.jsx
- [x] Import `loadPreferences` from `storageService.js`.
- [x] Import `rankArticles` from `rankingService.js`.
- [x] In `useEffect`, load preferences and store in state.
- [x] Apply `rankArticles` to the fetched articles before setting the `articles` state.

### T3: Verify Ranking (Recency & Topic)
- [x] Use browser console to verify chronological order within default topics.
- [x] Verify Technology/Science articles are prioritized correctly.

### T4: Verify Dynamic Ranking (Keywords)
- [x] Use browser console to call `updatePreferences` with a new keyword.
- [x] Verify the UI updates (or requires refresh) and ranks keyword matches higher.

### T5: Verify Source Filtering
- [x] Use browser console to disable a source.
- [x] Verify articles from that source disappear from the UI.

### T6: Performance Check
- [x] Log time taken to rank articles to the console.
- [x] Confirm it meets < 100ms threshold.

## Cleanup & Documentation
- [x] Update `spec.md` EVIDENCE section.
- [x] Update index files.
