# Tasks: Multi-Source Aggregation (10+ Sources)

**Epic:** 1.2 - Multi-Source Aggregation  
**Spec:** [spec.md](file:///mnt/Storage/Documents/Projects/EdgeReader/specs/012-multi-source/spec.md)  
**Plan:** [plan.md](file:///mnt/Storage/Documents/Projects/EdgeReader/specs/012-multi-source/plan.md)

---

## Core Implementation

### T1: Expand TEST_FEEDS to 14 Sources
- [ ] **Goal:** Add 10 new feeds and remove failed Reuters World feed
- **Steps:**
  1. Open `src/services/rssService.js`
  2. Remove Reuters World feed (failed in Epic 1.1)
  3. Add 10 new feeds from PRD list:
     - Reuters Tech
     - NPR News
     - The Guardian World
     - Hacker News
     - Wired
     - MIT Technology Review
     - Engadget
     - ScienceDaily
     - Phys.org
     - Nature News
  4. Verify total count is 14 feeds
  5. Organize by topic (General, Technology, Science)
- **Done when:** TEST_FEEDS array has 14 entries
- **Verify:** Count entries in TEST_FEEDS array
- **Evidence to record:** Code snippet of TEST_FEEDS array
- **Files touched:** `src/services/rssService.js`

---

### T2: Update normalizeItems to Extract Descriptions
- [ ] **Goal:** Add description field to article objects
- **Steps:**
  1. Open `src/services/rssService.js`
  2. In `normalizeItems()` RSS 2.0 section:
     - Add `description: extractText(item.description, null)`
  3. In `normalizeItems()` Atom section:
     - Add `description: extractText(item.summary || item.content, null)`
  4. Test with console.log to verify descriptions are extracted
- **Done when:** Article objects include description field
- **Verify:** Console.log articles array, check description field exists
- **Evidence to record:** Console screenshot showing articles with descriptions
- **Files touched:** `src/services/rssService.js`

---

### T3: Update normalizeItems to Extract Publish Dates
- [ ] **Goal:** Add publishDate field to article objects
- **Steps:**
  1. Open `src/services/rssService.js`
  2. In `normalizeItems()` RSS 2.0 section:
     - Add `publishDate: item.pubDate ? new Date(item.pubDate) : null`
  3. In `normalizeItems()` Atom section:
     - Add `publishDate: item.updated ? new Date(item.updated) : item.published ? new Date(item.published) : null`
  4. Wrap date parsing in try-catch to handle invalid dates
  5. Test with console.log to verify dates are parsed
- **Done when:** Article objects include publishDate field
- **Verify:** Console.log articles array, check publishDate field exists
- **Evidence to record:** Console screenshot showing articles with dates
- **Files touched:** `src/services/rssService.js`

---

### T4: Add Relative Date Formatting Function
- [ ] **Goal:** Create helper function to format dates as "2h ago", "3d ago", etc.
- **Steps:**
  1. Open `src/App.jsx`
  2. Add `formatRelativeDate(date)` function above App component:
     ```javascript
     function formatRelativeDate(date) {
       if (!date) return '';
       
       const now = new Date();
       const diffMs = now - date;
       const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
       const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
       
       if (diffHours < 1) return 'Just now';
       if (diffHours < 24) return `${diffHours}h ago`;
       if (diffDays < 7) return `${diffDays}d ago`;
       
       return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
     }
     ```
  3. Test function with sample dates in console
- **Done when:** formatRelativeDate function is defined
- **Verify:** Call function with test dates, verify output
- **Evidence to record:** Code snippet of function
- **Files touched:** `src/App.jsx`

---

### T5: Update App.jsx to Display Descriptions and Dates
- [ ] **Goal:** Show article descriptions and publish dates in the UI
- **Steps:**
  1. Open `src/App.jsx`
  2. Update ListItemText secondary prop to show:
     - Article description (truncated to 150 chars if needed)
     - Source name and publish date separated by bullet
  3. Use Typography components for proper styling
  4. Handle missing descriptions gracefully
  5. Format dates using formatRelativeDate()
- **Done when:** UI shows descriptions and dates
- **Verify:** Open app, verify descriptions and dates appear
- **Evidence to record:** Screenshot of updated UI
- **Files touched:** `src/App.jsx`

---

## Verification

### T6: Verify Feed Count and Article Count
- [ ] **Goal:** Confirm 14 feeds configured and 50+ articles displayed (AC-1.2.1, AC-1.2.2)
- **Steps:**
  1. Count TEST_FEEDS entries in rssService.js
  2. Run `npm run dev`
  3. Open browser to http://localhost:5173
  4. Wait for feeds to load
  5. Check article count at top of page
  6. Verify count >= 50
- **Done when:** 14 feeds configured, 50+ articles displayed
- **Verify:** Visual inspection of code and browser
- **Evidence to record:** Screenshot showing article count
- **Files touched:** None (verification only)

---

### T7: Verify Descriptions Display
- [ ] **Goal:** Confirm article descriptions are visible (AC-1.2.3)
- **Steps:**
  1. Open app in browser
  2. Scroll through article list
  3. Count how many articles show descriptions
  4. Verify at least 50% have descriptions
  5. Check that long descriptions are truncated with "..."
- **Done when:** Descriptions are displayed for most articles
- **Verify:** Visual inspection of article list
- **Evidence to record:** Screenshot showing articles with descriptions
- **Files touched:** None (verification only)

---

### T8: Verify Publish Dates Display
- [ ] **Goal:** Confirm publish dates are shown in relative format (AC-1.2.4)
- **Steps:**
  1. Open app in browser
  2. Check articles for date display
  3. Verify format is relative (e.g., "2h ago", "1d ago", "Dec 30")
  4. Verify dates make sense (not in future, not too old)
- **Done when:** Dates are displayed in relative format
- **Verify:** Visual inspection of article list
- **Evidence to record:** Screenshot showing relative dates
- **Files touched:** None (verification only)

---

### T9: Verify Load Performance
- [ ] **Goal:** Confirm feeds load within 3 seconds (AC-1.2.5)
- **Steps:**
  1. Open browser DevTools → Network tab
  2. Reload page (Cmd/Ctrl + Shift + R for hard reload)
  3. Check time until all feed requests complete
  4. Verify total time < 3 seconds
  5. If > 3 seconds, identify slow feeds in Network tab
- **Done when:** Load time < 3 seconds
- **Verify:** Network tab timing
- **Evidence to record:** Screenshot of Network tab showing load time
- **Files touched:** None (verification only)

---

### T10: Verify Source Diversity
- [ ] **Goal:** Confirm 10+ unique sources are displayed (AC-1 from PRD)
- **Steps:**
  1. Open app in browser
  2. Open DevTools Console
  3. Run: `[...new Set(articles.map(a => a.source))].length` (or count manually)
  4. Verify count >= 10
  5. Verify sources span General, Technology, and Science topics
- **Done when:** 10+ unique sources displayed
- **Verify:** Console or manual count
- **Evidence to record:** Screenshot or console output
- **Files touched:** None (verification only)

---

## Tracking

### T11: Update SPECS.md
- [ ] **Goal:** Update spec index with Epic 1.2 status
- **Steps:**
  1. Open `SPECS.md`
  2. Find row for Epic 1.2
  3. Update Status to "Done"
  4. Update Spec Folder to `specs/012-multi-source/`
  5. Add evidence link
- **Done when:** SPECS.md row for Epic 1.2 is updated
- **Verify:** Open SPECS.md, verify Epic 1.2 row
- **Evidence to record:** Screenshot of updated SPECS.md row
- **Files touched:** `SPECS.md`

---

### T12: Update SPEC.md
- [ ] **Goal:** Update current work entrypoint to point to Epic 1.2
- **Steps:**
  1. Open `SPEC.md`
  2. Update "Current focus" section:
     - Roadmap anchor: 1.2
     - Spec folder: specs/012-multi-source/
     - Status: Done
  3. Update Links section with spec.md, plan.md, tasks.md paths
  4. Update "Next command" to suggest Epic 1.3 or 2.0
- **Done when:** SPEC.md points to Epic 1.2
- **Verify:** Open SPEC.md, verify all links
- **Evidence to record:** Screenshot of updated SPEC.md
- **Files touched:** `SPEC.md`

---

### T13: Consolidate Evidence in spec.md
- [ ] **Goal:** Update spec.md with final evidence summary
- **Steps:**
  1. Open `specs/012-multi-source/spec.md`
  2. Navigate to ## EVIDENCE section
  3. Add subsections for each task with recorded evidence
  4. Add AC verification summary table
  5. Include screenshots and performance metrics
  6. Document any feed failures or issues
- **Done when:** spec.md EVIDENCE section is complete
- **Verify:** Open spec.md, verify EVIDENCE section
- **Evidence to record:** Link to updated spec.md#evidence
- **Files touched:** `specs/012-multi-source/spec.md`

---

## Summary

**Total Tasks:** 13  
**Estimated Time:** 1.5-2 hours

**Task Breakdown:**
- Core Implementation: T1-T5 (1 hour)
- Verification: T6-T10 (30 min)
- Tracking: T11-T13 (15 min)

**Dependencies:**
- Epic 1.1 (RSS Feed Parsing Foundation) - COMPLETE
- fast-xml-parser (already installed)
- Material UI (already installed)

**Exit Criteria:**
- All 13 tasks marked complete
- All 6 acceptance criteria verified and passing
- SPECS.md and SPEC.md updated
- Evidence consolidated in spec.md

---

**Tasks Version:** 1.0  
**Last Updated:** December 31, 2025  
**Status:** Ready for implementation
