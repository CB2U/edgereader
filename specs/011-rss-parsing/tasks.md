# Tasks: RSS Feed Parsing Foundation

**Epic:** 1.1 - RSS Feed Parsing Foundation  
**Spec:** [spec.md](file:///mnt/Storage/Documents/Projects/EdgeReader/specs/011-rss-parsing/spec.md)  
**Plan:** [plan.md](file:///mnt/Storage/Documents/Projects/EdgeReader/specs/011-rss-parsing/plan.md)

---

## Setup

### T1: Install rss-parser Library
- [ ] **Goal:** Add rss-parser npm package to project dependencies
- **Steps:**
  1. Run `npm install rss-parser`
  2. Verify installation with `npm list rss-parser`
  3. Check that `package.json` includes `rss-parser` in dependencies
- **Done when:** rss-parser is installed and listed in package.json
- **Verify:** Run `npm list rss-parser` - should show version number
- **Evidence to record:** Terminal output showing successful installation
- **Files touched:** `package.json`, `package-lock.json`

---

## Core Implementation

### T2: Create RSS Service Module
- [ ] **Goal:** Create `src/services/rssService.js` with feed fetching logic
- **Steps:**
  1. Create file `src/services/rssService.js`
  2. Import `rss-parser` library
  3. Define CORS proxy constant: `https://api.allorigins.win/raw?url=`
  4. Define TEST_FEEDS array with 3-5 feeds:
     - Reuters World: `https://feeds.reuters.com/reuters/worldNews`
     - TechCrunch: `https://techcrunch.com/feed/`
     - BBC News: `https://feeds.bbci.co.uk/news/rss.xml`
     - (Optional) Ars Technica: `https://feeds.arstechnica.com/arstechnica/index`
     - (Optional) The Verge: `https://www.theverge.com/rss/index.xml`
  5. Implement `fetchFeed(feed)` function:
     - Construct proxied URL
     - Fetch RSS feed via CORS proxy
     - Parse XML using rss-parser
     - Map items to article objects `{ title, url, source }`
     - Return empty array on error (with console.error)
  6. Implement `fetchAllFeeds()` function:
     - Use `Promise.all()` to fetch all feeds in parallel
     - Flatten results array
     - Return combined articles
  7. Export both functions
- **Done when:** rssService.js exists with working fetchFeed and fetchAllFeeds functions
- **Verify:** Import functions in App.jsx and call `fetchAllFeeds()` - should return array of articles
- **Evidence to record:** Code snippet of rssService.js and console.log of fetched articles
- **Files touched:** `src/services/rssService.js` (new file)

---

### T3: Update App Component to Fetch and Display Feeds
- [ ] **Goal:** Modify App.jsx to fetch feeds on mount and display headlines
- **Steps:**
  1. Open `src/App.jsx`
  2. Import `useState` and `useEffect` from React
  3. Import `fetchAllFeeds` from `./services/rssService`
  4. Import Material UI components: `List`, `ListItem`, `ListItemText`
  5. Add state variables:
     - `articles` (array, default: [])
     - `loading` (boolean, default: true)
     - `error` (string or null, default: null)
  6. Add `useEffect` hook to fetch feeds on mount:
     - Call `fetchAllFeeds()`
     - If successful and articles.length > 0, set articles state
     - If articles.length === 0, set error: "Failed to load feeds..."
     - Catch errors and set error state
     - Set loading to false in finally block
  7. Add conditional rendering:
     - If loading: show "Loading..." message
     - If error: show error message in red
     - Else: show list of articles
  8. Render articles in Material UI List:
     - Map over articles array
     - Use ListItem with ListItemText
     - Primary text: article.title
     - Secondary text: article.source
- **Done when:** App.jsx fetches and displays feed headlines
- **Verify:** Run `npm run dev`, open browser, verify headlines appear with source names
- **Evidence to record:** Screenshot of browser showing headlines list
- **Files touched:** `src/App.jsx`

---

## Verification

### T4: Verify CORS Proxy Works
- [ ] **Goal:** Confirm CORS proxy successfully fetches feeds (AC-1.1.2)
- **Steps:**
  1. Run `npm run dev`
  2. Open browser to http://localhost:5173
  3. Open DevTools → Network tab
  4. Filter by "Fetch/XHR"
  5. Reload page
  6. Verify requests to `api.allorigins.win` return status 200
  7. Check that no CORS errors appear in Console
- **Done when:** All proxy requests succeed without CORS errors
- **Verify:** Network tab shows 200 status for all feed requests
- **Evidence to record:** Screenshot of Network tab showing successful requests
- **Files touched:** None (verification only)

---

### T5: Verify Feed Parsing Structure
- [ ] **Goal:** Confirm articles have correct structure (AC-1.1.3)
- **Steps:**
  1. Add `console.log('Fetched articles:', articles)` in App.jsx after setting state
  2. Run `npm run dev`
  3. Open browser DevTools → Console
  4. Inspect logged articles array
  5. Verify each article has:
     - `title` (string)
     - `url` (string)
     - `source` (string)
  6. Verify at least 10 articles are returned
  7. Remove console.log after verification
- **Done when:** Articles array has correct structure with 10+ items
- **Verify:** Console shows array of properly structured articles
- **Evidence to record:** Screenshot of console showing articles array
- **Files touched:** `src/App.jsx` (temporary console.log, then removed)

---

### T6: Verify HTTPS-Only Requests
- [ ] **Goal:** Confirm all network requests use HTTPS (AC-1.1.5)
- **Steps:**
  1. Run `npm run dev`
  2. Open browser DevTools → Network tab
  3. Reload page
  4. Check all request URLs in Network tab
  5. Verify every URL starts with `https://`
  6. Verify no `http://` (insecure) requests
- **Done when:** All requests use HTTPS protocol
- **Verify:** Network tab shows only HTTPS URLs
- **Evidence to record:** Screenshot of Network tab with HTTPS URLs highlighted
- **Files touched:** None (verification only)

---

### T7: Verify Error Handling
- [ ] **Goal:** Confirm error message displays when feeds fail (AC-1.1.6)
- **Steps:**
  1. Open `src/services/rssService.js`
  2. Temporarily change all feed URLs to invalid URLs (e.g., `https://invalid.example.com/feed`)
  3. Save file
  4. Reload browser
  5. Verify error message appears: "Failed to load feeds. Please check your internet connection."
  6. Restore correct feed URLs
  7. Reload browser
  8. Verify headlines appear again
- **Done when:** Error message displays when all feeds fail, headlines display when feeds succeed
- **Verify:** Error state shows correct message, normal state shows headlines
- **Evidence to record:** Screenshot of error message
- **Files touched:** `src/services/rssService.js` (temporary change, then restored)

---

### T8: Verify Minimum Article Count
- [ ] **Goal:** Confirm at least 10 articles from 3+ sources (AC-1 from PRD)
- **Steps:**
  1. Run `npm run dev`
  2. Open browser to http://localhost:5173
  3. Wait for feeds to load
  4. Count total articles in the list
  5. Count unique source names
  6. Verify at least 10 articles total
  7. Verify at least 3 different sources
- **Done when:** List shows 10+ articles from 3+ sources
- **Verify:** Visual count of articles and sources
- **Evidence to record:** Screenshot of headlines list with count annotation
- **Files touched:** None (verification only)

---

## Tracking

### T9: Update SPECS.md
- [ ] **Goal:** Update spec index with Epic 1.1 status
- **Steps:**
  1. Open `SPECS.md`
  2. Find row for Epic 1.1 (Roadmap Anchor 1.1)
  3. Update Status to "In progress" (or "Done" if all tasks complete)
  4. Update Spec Folder to `specs/011-rss-parsing/`
  5. Add evidence link: `specs/011-rss-parsing/spec.md#evidence`
  6. Update "Next task" field with next incomplete task (or "Complete" if done)
- **Done when:** SPECS.md row for Epic 1.1 is updated
- **Verify:** Open SPECS.md, verify Epic 1.1 row shows correct status and links
- **Evidence to record:** Screenshot of updated SPECS.md row
- **Files touched:** `SPECS.md`

---

### T10: Update SPEC.md
- [ ] **Goal:** Update current work entrypoint to point to Epic 1.1
- **Steps:**
  1. Open `SPEC.md`
  2. Update "Current focus" section:
     - Roadmap anchor: 1.1
     - Spec folder: specs/011-rss-parsing/
     - Type: Feature
     - Priority: P0
     - Status: In progress (or Done)
  3. Update Links section:
     - spec.md: specs/011-rss-parsing/spec.md
     - plan.md: specs/011-rss-parsing/plan.md
     - tasks.md: specs/011-rss-parsing/tasks.md
  4. Update "Next command" to `/implement_from_spec specs/011-rss-parsing/`
- **Done when:** SPEC.md points to Epic 1.1 spec package
- **Verify:** Open SPEC.md, verify all links and fields updated
- **Evidence to record:** Screenshot of updated SPEC.md
- **Files touched:** `SPEC.md`

---

### T11: Consolidate Evidence in spec.md
- [ ] **Goal:** Update spec.md with final evidence summary
- **Steps:**
  1. Open `specs/011-rss-parsing/spec.md`
  2. Navigate to ## EVIDENCE section
  3. Add subsections for each task with recorded evidence:
     - T1: rss-parser installation output
     - T2: rssService.js code snippet
     - T3: App.jsx updates and browser screenshot
     - T4: Network tab screenshot (CORS proxy)
     - T5: Console screenshot (article structure)
     - T6: Network tab screenshot (HTTPS only)
     - T7: Error message screenshot
     - T8: Headlines list screenshot with count
  4. Add AC verification summary:
     - AC-1.1.1: ✅ Pass (rss-parser installed)
     - AC-1.1.2: ✅ Pass (CORS proxy works)
     - AC-1.1.3: ✅ Pass (Feed parsing correct)
     - AC-1.1.4: ✅ Pass (Headlines display)
     - AC-1.1.5: ✅ Pass (HTTPS only)
     - AC-1.1.6: ✅ Pass (Error handling)
     - AC-1 (PRD): ✅ Pass (10+ articles, 3+ sources)
- **Done when:** spec.md EVIDENCE section contains all verification results
- **Verify:** Open spec.md, verify EVIDENCE section is complete
- **Evidence to record:** Link to updated spec.md#evidence
- **Files touched:** `specs/011-rss-parsing/spec.md`

---

## Summary

**Total Tasks:** 11  
**Estimated Time:** 2-3 hours

**Task Breakdown:**
- Setup: T1 (15 min)
- Core Implementation: T2-T3 (1.5 hours)
- Verification: T4-T8 (1 hour)
- Tracking: T9-T11 (30 min)

**Dependencies:**
- Epic 1.0 (Project Setup) - COMPLETE
- rss-parser npm package
- CORS proxy service (allorigins.win)

**Exit Criteria:**
- All 11 tasks marked complete
- All 7 acceptance criteria verified and passing
- SPECS.md and SPEC.md updated
- Evidence consolidated in spec.md

---

**Tasks Version:** 1.0  
**Last Updated:** December 30, 2025  
**Status:** Ready for implementation
