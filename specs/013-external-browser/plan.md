# Plan: External Browser Integration

**Epic:** 1.3 - External Browser Integration  
**Spec:** [spec.md](file:///mnt/Storage/Documents/Projects/EdgeReader/specs/013-external-browser/spec.md)

---

## Architecture Overview

### Key Components

This epic involves minimal architectural changes - primarily UI enhancements to existing components:

1. **App.jsx** (Main Component)
   - Currently renders article list using Material UI `List` and `ListItem`
   - Will be updated to make `ListItem` clickable with proper link attributes
   - Will add hover effects and keyboard navigation

2. **Article Data Flow** (No changes)
   - RSS service already provides article URLs
   - No changes needed to data fetching or normalization

### Approach: Component Enhancement vs. Link Wrapper

**Option 1: Add `<a>` wrapper around ListItem** ❌
- Cons: Creates nested interactive elements (bad for accessibility)
- Cons: Material UI ListItem has built-in button role

**Option 2: Use ListItem `component="a"` prop** ✅ **CHOSEN**
- Pros: Material UI best practice for clickable list items
- Pros: Maintains accessibility (proper ARIA roles)
- Pros: Allows `href`, `target`, `rel` props directly on ListItem
- Pros: Preserves existing styling and layout

**Option 3: Use `onClick` with `window.open()`** ❌
- Cons: Pop-up blockers may interfere
- Cons: Harder to implement keyboard accessibility
- Cons: Not semantic HTML (should use `<a>` tags)

### Implementation Strategy

```javascript
// Current (Epic 1.2):
<ListItem>
  <ListItemText primary={title} secondary={description} />
</ListItem>

// Updated (Epic 1.3):
<ListItem
  component="a"
  href={article.url}
  target="_blank"
  rel="noopener noreferrer"
  sx={{
    cursor: 'pointer',
    '&:hover': { backgroundColor: 'action.hover' }
  }}
>
  <ListItemText primary={title} secondary={description} />
</ListItem>
```

---

## Data Contracts

### Article Object (No Changes)

The article object already contains the required `url` field:

```javascript
{
  title: string,
  url: string,           // ← Already present from Epic 1.2
  source: string,
  description: string (optional),
  publishDate: Date (optional)
}
```

**Defensive Handling:**
- Add check: if `article.url` is missing or empty, render non-clickable ListItem
- Log warning to console if URL is missing (helps debugging feed issues)

---

## UX and Operational States

### User Interaction Flow

1. **Initial State:** User sees list of articles
2. **Hover State:** User hovers over article
   - Background color changes to `theme.palette.action.hover`
   - Cursor changes to pointer
3. **Click State:** User clicks article
   - New tab opens with article URL
   - EdgeReader PWA remains open and focused
4. **Keyboard Navigation:**
   - User presses Tab to focus article
   - Focus ring appears (Material UI default)
   - User presses Enter to open article

### Edge Cases

| Case | Behavior |
|------|----------|
| **Article has no URL** | ListItem is not clickable, no hover effect, no cursor change |
| **URL is malformed** | Browser handles error (404, DNS failure) - not EdgeReader's responsibility |
| **Pop-up blocker active** | Should not trigger (using `<a>` tag, not `window.open()`) |
| **User has JavaScript disabled** | Links still work (semantic HTML) |

---

## Testing Plan

### Manual Testing

**Test 1: Click to Open Article**
- **Steps:**
  1. Run `npm run dev` in EdgeReader directory
  2. Open http://localhost:5173 in browser
  3. Wait for articles to load
  4. Click any article in the list
- **Expected:** New tab opens with article URL, EdgeReader remains open
- **Browsers:** Chrome, Firefox, Safari (if available), Brave (if available)

**Test 2: Hover Effects**
- **Steps:**
  1. Open http://localhost:5173
  2. Hover mouse over different articles
- **Expected:** Background color changes, cursor becomes pointer

**Test 3: Keyboard Navigation**
- **Steps:**
  1. Open http://localhost:5173
  2. Press Tab repeatedly to focus articles
  3. Press Enter when article is focused
- **Expected:** Article opens in new tab

**Test 4: Referrer Header Check**
- **Steps:**
  1. Open http://localhost:5173
  2. Open browser DevTools (F12)
  3. Click an article
  4. In the new tab, open DevTools → Network tab
  5. Inspect the request headers for the article page
- **Expected:** No `Referer` header, or `Referer` is empty/omitted

**Test 5: DOM Inspection**
- **Steps:**
  1. Open http://localhost:5173
  2. Open DevTools → Elements/Inspector
  3. Inspect a ListItem element
- **Expected:** Element has `target="_blank"` and `rel="noopener noreferrer"`

### Automated Testing

**No automated tests planned for MVP** because:
- This is pure UI interaction (hard to test without E2E framework)
- Manual testing is sufficient for this simple feature
- E2E testing framework (Playwright/Cypress) not yet set up (deferred to Epic 5.1)

**Future consideration (Epic 5.1):**
- Add Playwright test to verify link attributes
- Add Playwright test to verify new tab opens

---

## AC Verification Mapping

| AC | Verification Method | Test Location |
|----|---------------------|---------------|
| **AC-1.3.1** (Click to Open) | Manual Test 1 | All browsers |
| **AC-1.3.2** (New Tab Behavior) | Manual Test 1 | All browsers |
| **AC-1.3.3** (Security Attributes) | Manual Test 5 | DevTools inspection |
| **AC-1.3.4** (No Referrer Leakage) | Manual Test 4 | DevTools Network tab |
| **AC-1.3.5** (Visual Feedback) | Manual Test 2 | Browser |
| **AC-1.3.6** (Keyboard Accessibility) | Manual Test 3 | Browser |
| **AC-4** (PRD: Default Browser) | Manual Test 1 | All browsers |

---

## Risks and Mitigations

### Risk 1: Material UI ListItem May Not Support `component="a"`

**Likelihood:** Low  
**Impact:** Medium  
**Mitigation:**
- Material UI documentation confirms `component` prop is supported
- Fallback: Wrap ListItem in `<a>` tag (less ideal but functional)

### Risk 2: Safari May Block New Tabs

**Likelihood:** Very Low  
**Impact:** High  
**Mitigation:**
- Using semantic `<a>` tags (not `window.open()`) avoids pop-up blockers
- Test explicitly on Safari during verification

### Risk 3: Hover Effects May Not Work on Mobile

**Likelihood:** High (expected)  
**Impact:** Low  
**Mitigation:**
- Mobile browsers don't have hover states (expected behavior)
- Touch targets are already large enough (Material UI default)
- Not a blocker for MVP (PWA is desktop-first)

---

## Rollout and Migration Notes

### No Migration Required

- This is a pure UI enhancement
- No data model changes
- No breaking changes to existing functionality
- Can be deployed immediately after testing

### Rollback Plan

If issues arise:
1. Revert commit
2. Redeploy previous version
3. Articles will be non-clickable (same as before Epic 1.3)

---

## Observability and Debugging

### What Can Be Logged

- Warning if article is missing URL: `console.warn('Article missing URL:', article.title)`
- Count of clickable vs non-clickable articles (optional, for debugging)

### What Must Never Be Logged

- Article URLs (may contain tracking parameters)
- User click behavior (privacy violation)
- Referrer headers (privacy violation)

### Debugging Tips

- Use React DevTools to inspect ListItem props
- Use browser DevTools Network tab to verify `noreferrer`
- Use browser DevTools Elements tab to inspect rendered HTML

---

## Implementation Checklist

See [tasks.md](file:///mnt/Storage/Documents/Projects/EdgeReader/specs/013-external-browser/tasks.md) for detailed task breakdown.

**High-Level Steps:**
1. Update App.jsx to make ListItem clickable
2. Add security/privacy attributes (`target`, `rel`)
3. Add hover effects and cursor styling
4. Add defensive check for missing URLs
5. Manual testing across browsers
6. Verify referrer headers
7. Update tracking documents (SPEC.md, SPECS.md)
8. Document evidence in spec.md

---

**Status:** Draft  
**Last Updated:** December 31, 2025  
**Next Step:** Review plan, then proceed to implementation
