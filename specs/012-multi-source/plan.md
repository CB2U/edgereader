# Plan: Multi-Source Aggregation (10+ Sources)

**Epic:** 1.2 - Multi-Source Aggregation  
**Spec:** [spec.md](file:///mnt/Storage/Documents/Projects/EdgeReader/specs/012-multi-source/spec.md)

---

## Implementation Approach

This epic is a straightforward expansion of Epic 1.1. We'll add more feeds to the TEST_FEEDS array and enhance the article object to include descriptions and publish dates.

### Changes Required

1. **rssService.js:**
   - Expand TEST_FEEDS from 5 to 10-15 sources
   - Update `normalizeItems()` to extract `description` field
   - Update `normalizeItems()` to extract and parse `publishDate` field
   - Replace failed Reuters World with Reuters Tech

2. **App.jsx:**
   - Update ListItemText to show description as secondary text
   - Add publish date display (relative format)
   - Update article count display logic

3. **No new dependencies needed** - reuse existing fast-xml-parser and Material UI

---

## Feed Selection

### Feeds to Add (10 new feeds)

Based on PRD Section 10.2, adding these feeds:

**General News (3):**
- Reuters Tech: `https://feeds.reuters.com/reuters/technologyNews`
- NPR News: `https://feeds.npr.org/1001/rss.xml`
- The Guardian World: `https://www.theguardian.com/world/rss`

**Technology (4):**
- Hacker News: `https://news.ycombinator.com/rss`
- Wired: `https://www.wired.com/feed/rss`
- MIT Technology Review: `https://www.technologyreview.com/feed/`
- Engadget: `https://www.engadget.com/rss.xml`

**Science (3):**
- ScienceDaily: `https://www.sciencedaily.com/rss/all.xml`
- Phys.org: `https://phys.org/rss-feed/`
- Nature News: `https://www.nature.com/nature.rss`

### Feeds to Keep from Epic 1.1 (4):**
- TechCrunch ✅
- BBC News ✅
- Ars Technica ✅
- The Verge ✅

### Feeds to Remove (1):**
- Reuters World ❌ (failed with 400 error)

**Total: 14 feeds**

---

## Data Schema Updates

### Current Article Object (Epic 1.1)
```javascript
{
  title: string,
  url: string,
  source: string
}
```

### New Article Object (Epic 1.2)
```javascript
{
  title: string,
  url: string,
  source: string,
  description: string | null,  // NEW
  publishDate: Date | null      // NEW
}
```

---

## Implementation Details

### 1. Update normalizeItems() for RSS 2.0

```javascript
// RSS 2.0 format
return items.map(item => ({
  title: extractText(item.title, 'Untitled'),
  url: extractText(item.link || item.guid, '#'),
  source: sourceName,
  description: extractText(item.description, null),
  publishDate: item.pubDate ? new Date(item.pubDate) : null,
}));
```

### 2. Update normalizeItems() for Atom

```javascript
// Atom format
return items.map(item => ({
  title: extractText(item.title, 'Untitled'),
  url: item.link?.['@_href'] || extractText(item.id, '#'),
  source: sourceName,
  description: extractText(item.summary || item.content, null),
  publishDate: item.updated ? new Date(item.updated) : item.published ? new Date(item.published) : null,
}));
```

### 3. Add Relative Date Formatting

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

### 4. Update App.jsx ListItem

```javascript
<ListItemText
  primary={article.title}
  secondary={
    <>
      {article.description && (
        <Typography component="span" variant="body2" color="text.secondary" display="block">
          {article.description.length > 150 
            ? article.description.substring(0, 150) + '...' 
            : article.description}
        </Typography>
      )}
      <Typography component="span" variant="caption" color="text.secondary">
        {article.source} • {formatRelativeDate(article.publishDate)}
      </Typography>
    </>
  }
/>
```

---

## Testing Plan

### Manual Verification Tests

**Test 1: Feed Count**
- **Goal:** Verify 10-15 feeds are configured (AC-1.2.1)
- **Steps:**
  1. Open `src/services/rssService.js`
  2. Count entries in TEST_FEEDS array
- **Expected:** 14 feeds configured
- **Evidence:** Code snippet showing TEST_FEEDS array

**Test 2: Article Count**
- **Goal:** Verify 50+ articles are displayed (AC-1.2.2)
- **Steps:**
  1. Open app in browser (http://localhost:5173)
  2. Wait for feeds to load
  3. Check article count at top of page
- **Expected:** "X articles from Y sources" where X >= 50
- **Evidence:** Screenshot showing article count

**Test 3: Descriptions Display**
- **Goal:** Verify article descriptions are shown (AC-1.2.3)
- **Steps:**
  1. Open app in browser
  2. Scroll through article list
  3. Verify descriptions appear below titles
- **Expected:** At least 50% of articles show descriptions
- **Evidence:** Screenshot showing articles with descriptions

**Test 4: Publish Dates Display**
- **Goal:** Verify publish dates are shown (AC-1.2.4)
- **Steps:**
  1. Open app in browser
  2. Check articles for date display
  3. Verify format is relative (e.g., "2h ago", "1d ago")
- **Expected:** Dates shown in relative format
- **Evidence:** Screenshot showing dates

**Test 5: Load Performance**
- **Goal:** Verify load time < 3 seconds (AC-1.2.5)
- **Steps:**
  1. Open browser DevTools → Network tab
  2. Reload page
  3. Check time until "Load" event or last feed request completes
- **Expected:** All feeds load within 3 seconds
- **Evidence:** Screenshot of Network tab showing timing

**Test 6: Source Diversity**
- **Goal:** Verify 10+ sources are displayed (AC-1 from PRD)
- **Steps:**
  1. Open app in browser
  2. Count unique source names in article list
  3. Verify at least 10 different sources
- **Expected:** 10+ unique sources
- **Evidence:** Screenshot or console.log of unique sources

---

## AC Verification Mapping

| Acceptance Criteria | Verification Method | Test Reference |
|---------------------|---------------------|----------------|
| AC-1.2.1 (Feed count) | Code inspection | Test 1 |
| AC-1.2.2 (Article count) | Visual count in browser | Test 2 |
| AC-1.2.3 (Descriptions) | Visual inspection | Test 3 |
| AC-1.2.4 (Publish dates) | Visual inspection | Test 4 |
| AC-1.2.5 (Performance) | Network tab timing | Test 5 |
| AC-1 (PRD - 10+ sources) | Count unique sources | Test 6 |

---

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| **Some new feeds may fail** | Existing error handling will log failures and continue with successful feeds |
| **Performance may degrade** | Measure load time. If > 3s, consider reducing feeds or adding timeout |
| **Not all feeds have descriptions** | Make description optional, display title-only if missing |
| **Date parsing may fail for some feeds** | Use try-catch around new Date(), fallback to null |

---

## Rollout Notes

**No migration needed** - this is an enhancement to existing functionality.

**Future considerations:**
- Epic 2.0: Allow users to select/deselect feeds
- Epic 3.0: Cache articles to reduce network requests
- Epic 4.2: Add loading progress bar for feed fetching

---

**Plan Version:** 1.0  
**Last Updated:** December 31, 2025  
**Status:** Ready for implementation
