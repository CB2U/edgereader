# Tasks: External Browser Integration

**Epic:** 1.3 - External Browser Integration  
**Spec:** [spec.md](file:///mnt/Storage/Documents/Projects/EdgeReader/specs/013-external-browser/spec.md)  
**Plan:** [plan.md](file:///mnt/Storage/Documents/Projects/EdgeReader/specs/013-external-browser/plan.md)

---

## Setup

### T1: Review Current Article List Implementation
**Goal:** Understand how articles are currently rendered in App.jsx

**Steps:**
1. Open `src/App.jsx`
2. Locate the article list rendering code (inside `List` component)
3. Identify current `ListItem` props and structure
4. Note current styling and Material UI components used

**Done when:**
- Current implementation is understood
- Ready to modify ListItem to be clickable

**Verify:**
- Can describe current ListItem structure

**Evidence to record:**
- Current code snippet showing ListItem implementation

**Files touched:**
- None (read-only)

---

## Core Implementation

### T2: Make ListItem Clickable with Security Attributes
**Goal:** Update ListItem to open articles in new tab with proper security/privacy attributes

**Steps:**
1. Open `src/App.jsx`
2. Locate the `ListItem` component in the article map
3. Add props to ListItem:
   - `component="a"`
   - `href={article.url}`
   - `target="_blank"`
   - `rel="noopener noreferrer"`
4. Add defensive check: only make clickable if `article.url` exists
5. Save file

**Done when:**
- ListItem has all required props
- Defensive check prevents errors for missing URLs
- Code compiles without errors

**Verify:**
- Run `npm run dev` and check browser console for errors
- Inspect rendered HTML in DevTools

**Evidence to record:**
- Code snippet showing updated ListItem
- Screenshot of DevTools showing `target` and `rel` attributes

**Files touched:**
- `src/App.jsx`

---

### T3: Add Hover Effects and Cursor Styling
**Goal:** Provide visual feedback for clickable articles

**Steps:**
1. In `src/App.jsx`, add `sx` prop to ListItem
2. Add cursor styling: `cursor: 'pointer'`
3. Add hover effect: `'&:hover': { backgroundColor: 'action.hover' }`
4. Ensure styling only applies to clickable items (items with URLs)
5. Save file

**Done when:**
- Hover effect changes background color
- Cursor changes to pointer on hover
- Non-clickable items (no URL) don't have hover effects

**Verify:**
- Open app in browser
- Hover over articles
- Verify visual feedback

**Evidence to record:**
- Screenshot showing hover effect
- Code snippet showing sx prop

**Files touched:**
- `src/App.jsx`

---

### T4: Add Console Warning for Missing URLs
**Goal:** Help debug feed issues by logging articles without URLs

**Steps:**
1. In `src/App.jsx`, in the article map function, add check:
   ```javascript
   if (!article.url) {
     console.warn('Article missing URL:', article.title);
   }
   ```
2. Place check before rendering ListItem
3. Save file

**Done when:**
- Warning logs to console if article has no URL
- Warning includes article title for debugging

**Verify:**
- Temporarily remove URL from test article
- Check browser console for warning
- Restore URL

**Evidence to record:**
- Code snippet showing warning logic
- Screenshot of console warning (if any articles are missing URLs)

**Files touched:**
- `src/App.jsx`

---

## Verification

### T5: Manual Testing - Click to Open Article
**Goal:** Verify articles open in new tab across multiple browsers

**Steps:**
1. Run `npm run dev` in EdgeReader directory
2. Open http://localhost:5173 in Chrome
3. Wait for articles to load
4. Click any article in the list
5. Verify:
   - New tab opens with article URL
   - EdgeReader tab remains open
   - Article content loads in new tab
6. Repeat in Firefox (if available)
7. Repeat in Safari (if available)
8. Repeat in Brave (if available)

**Done when:**
- Article opens in new tab in all tested browsers
- EdgeReader remains open
- No errors in console

**Verify:**
- Manual observation

**Evidence to record:**
- List of browsers tested
- Screenshot showing EdgeReader + opened article tab
- Note any browser-specific issues

**Files touched:**
- None (testing only)

---

### T6: Manual Testing - Hover Effects
**Goal:** Verify visual feedback for clickable articles

**Steps:**
1. Open http://localhost:5173 in browser
2. Hover mouse over different articles
3. Verify:
   - Background color changes on hover
   - Cursor changes to pointer
   - Hover effect is smooth (no lag)
4. Test on both clickable and non-clickable items (if any)

**Done when:**
- Hover effects work as expected
- Visual feedback is clear

**Verify:**
- Manual observation

**Evidence to record:**
- Screenshot showing hover state
- Note on user experience quality

**Files touched:**
- None (testing only)

---

### T7: Manual Testing - Keyboard Navigation
**Goal:** Verify keyboard accessibility

**Steps:**
1. Open http://localhost:5173 in browser
2. Press Tab key repeatedly to navigate through articles
3. Verify:
   - Articles can be focused via Tab
   - Focus ring is visible
4. When an article is focused, press Enter
5. Verify:
   - Article opens in new tab
   - Same behavior as clicking

**Done when:**
- Keyboard navigation works
- Enter key opens articles

**Verify:**
- Manual observation

**Evidence to record:**
- Confirmation that keyboard navigation works
- Screenshot showing focus ring (optional)

**Files touched:**
- None (testing only)

---

### T8: Manual Testing - Referrer Header Verification
**Goal:** Verify no referrer headers are sent (privacy check)

**Steps:**
1. Open http://localhost:5173 in Chrome
2. Open DevTools (F12)
3. Click any article
4. In the new tab, open DevTools → Network tab
5. Refresh the page if needed to see initial request
6. Find the main document request (first request)
7. Click on the request → Headers tab
8. Inspect Request Headers section
9. Verify: No `Referer` header, or `Referer` is empty

**Done when:**
- Confirmed no referrer leakage
- Privacy requirement met

**Verify:**
- DevTools inspection

**Evidence to record:**
- Screenshot of Network tab showing no Referer header
- Confirmation of privacy compliance

**Files touched:**
- None (testing only)

---

### T9: Manual Testing - DOM Inspection
**Goal:** Verify security attributes are present in rendered HTML

**Steps:**
1. Open http://localhost:5173 in browser
2. Open DevTools → Elements/Inspector tab
3. Locate a ListItem element in the DOM
4. Verify attributes:
   - `target="_blank"`
   - `rel="noopener noreferrer"`
   - `href` contains article URL
5. Verify element is an `<a>` tag (not `<div>` or `<li>`)

**Done when:**
- All security attributes are present
- Element structure is correct

**Verify:**
- DevTools inspection

**Evidence to record:**
- Screenshot of DevTools showing element attributes
- Confirmation of security compliance

**Files touched:**
- None (testing only)

---

## Tracking

### T10: Update SPEC.md and SPECS.md
**Goal:** Update tracking documents to reflect Epic 1.3 status

**Steps:**
1. Open `SPEC.md`
2. Update "Current focus" section:
   - Roadmap anchor: 1.3
   - Spec folder: specs/013-external-browser/
   - Status: In progress
3. Add links to spec.md, plan.md, tasks.md
4. Save file
5. Open `SPECS.md`
6. Update Epic 1.3 row:
   - Status: In progress
   - Spec folder: link to specs/013-external-browser/
7. Save file

**Done when:**
- SPEC.md points to Epic 1.3
- SPECS.md shows Epic 1.3 as "In progress"

**Verify:**
- Open both files and confirm updates

**Evidence to record:**
- Confirmation that tracking files are updated

**Files touched:**
- `SPEC.md`
- `SPECS.md`

---

### T11: Document Evidence in spec.md
**Goal:** Consolidate all verification evidence in spec.md EVIDENCE section

**Steps:**
1. Open `specs/013-external-browser/spec.md`
2. Scroll to EVIDENCE section
3. Add subsections:
   - Implementation Summary
   - Task Completion Evidence (T1-T9)
   - Acceptance Criteria Verification (AC-1.3.1 through AC-4)
   - Browser Testing Results
   - Screenshots
4. Include:
   - Code snippets from implementation
   - Test results from manual testing
   - Screenshots of hover effects, DevTools, etc.
   - List of browsers tested
   - Any issues encountered and resolutions
5. Add final status: Complete or In Progress
6. Save file

**Done when:**
- All evidence is documented
- Each AC has verification result
- Screenshots are embedded (if applicable)

**Verify:**
- Review spec.md EVIDENCE section for completeness

**Evidence to record:**
- N/A (this task creates the evidence record)

**Files touched:**
- `specs/013-external-browser/spec.md`

---

### T12: Mark Epic 1.3 as Done in SPECS.md
**Goal:** Update tracking to show Epic 1.3 is complete

**Steps:**
1. Open `SPECS.md`
2. Find Epic 1.3 row
3. Change status from "In progress" to "Done"
4. Save file
5. Open `SPEC.md`
6. Update status to "Done"
7. Update "Next command" to `/specify 2.0` (next epic)
8. Save file

**Done when:**
- SPECS.md shows Epic 1.3 as "Done"
- SPEC.md reflects completion

**Verify:**
- Open both files and confirm updates

**Evidence to record:**
- Confirmation that Epic 1.3 is marked complete

**Files touched:**
- `SPEC.md`
- `SPECS.md`

---

## Summary

**Total Tasks:** 12  
**Estimated Time:** 2-3 hours  
**Core Implementation:** T2-T4 (~30 minutes)  
**Verification:** T5-T9 (~60-90 minutes)  
**Documentation:** T10-T12 (~30 minutes)

**Critical Path:**
1. T1 (Review) → T2 (Make clickable) → T3 (Hover effects) → T5 (Test click)
2. T8 (Verify referrer) is critical for privacy compliance
3. T11 (Document evidence) must be done last

**Dependencies:**
- All verification tasks (T5-T9) depend on implementation tasks (T2-T4)
- T11 depends on all verification tasks
- T12 depends on T11
