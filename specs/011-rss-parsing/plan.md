# Plan: RSS Feed Parsing Foundation

**Epic:** 1.1 - RSS Feed Parsing Foundation  
**Spec:** [spec.md](file:///mnt/Storage/Documents/Projects/EdgeReader/specs/011-rss-parsing/spec.md)

---

## Architecture Overview

### Key Components

1. **RSS Service (`src/services/rssService.js`)**
   - Fetches RSS feeds via CORS proxy
   - Parses RSS/Atom XML using `rss-parser`
   - Returns normalized article objects
   - Handles individual feed failures gracefully

2. **Feed Configuration**
   - Hardcoded array of 3-5 test feeds
   - Each feed has: name, URL, topic
   - Will be moved to user preferences in Epic 2.0

3. **App Component Updates**
   - Fetches feeds on mount using `useEffect`
   - Stores articles in component state
   - Renders simple list of headlines

### Data Flow

```
App.jsx (mount)
  ↓
fetchAllFeeds()
  ↓
[Feed 1, Feed 2, Feed 3] → Promise.all()
  ↓
fetchFeed(url) → CORS Proxy → RSS Feed
  ↓
rss-parser → Parse XML
  ↓
Normalize to { title, url, source }
  ↓
Return articles[]
  ↓
App.jsx setState
  ↓
Render list
```

### CORS Handling Strategy

**Chosen Solution:** `https://api.allorigins.win/raw?url=`

**Why:**
- ✅ Free, no API key required
- ✅ Simple to use (just prepend to feed URL)
- ✅ No rate limits for reasonable use
- ✅ Supports HTTPS

**Usage:**
```javascript
const proxyUrl = 'https://api.allorigins.win/raw?url=';
const feedUrl = 'https://feeds.reuters.com/reuters/worldNews';
const response = await fetch(proxyUrl + encodeURIComponent(feedUrl));
```

**Fallback:** If allorigins.win is unreliable, switch to `rss2json.com` (requires API key but more stable).

### Alternatives Considered

| Approach | Pros | Cons | Decision |
|----------|------|------|----------|
| **Direct fetch (no CORS handling)** | Simplest | Blocked by CORS on most feeds | ❌ Rejected |
| **CORS Anywhere** | Well-known | Rate-limited, often down | ❌ Rejected |
| **allorigins.win** | Free, simple, reliable | Depends on third-party service | ✅ **Chosen** |
| **rss2json.com** | Very reliable, JSON output | Requires API key, 10k/day limit | 🔄 Fallback |
| **Custom backend proxy** | Full control | Requires server, defeats PWA purpose | ❌ Rejected |

---

## Data Contracts

### Article Object

```javascript
{
  title: string,        // Article headline
  url: string,          // Link to full article
  source: string,       // Feed name (e.g., "Reuters World")
  // Future fields (Epic 1.2):
  // description: string,
  // publishDate: Date,
  // imageUrl: string
}
```

### Feed Configuration Object

```javascript
{
  name: string,         // Display name (e.g., "Reuters World")
  url: string,          // RSS feed URL
  topic: string         // Category (e.g., "General", "Technology")
}
```

---

## Implementation Details

### 1. RSS Service (`src/services/rssService.js`)

```javascript
import Parser from 'rss-parser';

const parser = new Parser();
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

const TEST_FEEDS = [
  { name: 'Reuters World', url: 'https://feeds.reuters.com/reuters/worldNews', topic: 'General' },
  { name: 'TechCrunch', url: 'https://techcrunch.com/feed/', topic: 'Technology' },
  { name: 'BBC News', url: 'https://feeds.bbci.co.uk/news/rss.xml', topic: 'General' },
];

export async function fetchFeed(feed) {
  try {
    const proxiedUrl = CORS_PROXY + encodeURIComponent(feed.url);
    const response = await fetch(proxiedUrl);
    const xml = await response.text();
    const parsed = await parser.parseString(xml);
    
    return parsed.items.map(item => ({
      title: item.title,
      url: item.link,
      source: feed.name,
    }));
  } catch (error) {
    console.error(`Failed to fetch ${feed.name}:`, error);
    return []; // Return empty array on failure
  }
}

export async function fetchAllFeeds() {
  const results = await Promise.all(TEST_FEEDS.map(fetchFeed));
  return results.flat(); // Flatten array of arrays
}
```

### 2. App Component Updates

```javascript
import { useState, useEffect } from 'react';
import { Container, Typography, List, ListItem, ListItemText } from '@mui/material';
import { fetchAllFeeds } from './services/rssService';

function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadFeeds() {
      try {
        const fetchedArticles = await fetchAllFeeds();
        if (fetchedArticles.length === 0) {
          setError('Failed to load feeds. Please check your internet connection.');
        } else {
          setArticles(fetchedArticles);
        }
      } catch (err) {
        setError('Failed to load feeds. Please check your internet connection.');
      } finally {
        setLoading(false);
      }
    }
    loadFeeds();
  }, []);

  if (loading) return <Container><Typography>Loading...</Typography></Container>;
  if (error) return <Container><Typography color="error">{error}</Typography></Container>;

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>EdgeReader</Typography>
      <List>
        {articles.map((article, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={article.title}
              secondary={article.source}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}
```

---

## Testing Plan

### Unit Tests (Future - not in this epic)
- Test `fetchFeed()` with mock RSS data
- Test `fetchAllFeeds()` with multiple feeds
- Test error handling for failed feeds

### Manual Verification Tests

**Test 1: RSS Parser Installation**
- **Goal:** Verify rss-parser is installed
- **Steps:**
  1. Run `npm list rss-parser`
  2. Verify package is listed
- **Expected:** Package appears in dependency tree
- **Evidence:** Terminal output

**Test 2: CORS Proxy Works**
- **Goal:** Verify CORS proxy successfully fetches feeds
- **Steps:**
  1. Open browser DevTools → Network tab
  2. Load app
  3. Filter by "Fetch/XHR"
  4. Verify requests to `api.allorigins.win` succeed (status 200)
- **Expected:** All proxy requests return 200 status
- **Evidence:** Screenshot of Network tab

**Test 3: Feed Parsing**
- **Goal:** Verify feeds are parsed into article objects
- **Steps:**
  1. Add `console.log(articles)` in App.jsx after fetching
  2. Load app
  3. Open DevTools Console
  4. Inspect logged articles array
- **Expected:** Array of objects with `title`, `url`, `source` fields
- **Evidence:** Console screenshot

**Test 4: Headlines Display**
- **Goal:** Verify headlines appear in UI (AC-1.1.4)
- **Steps:**
  1. Load app in browser
  2. Wait for feeds to load
  3. Verify list of headlines appears
  4. Verify each headline shows source name
- **Expected:** At least 10 articles visible with source names
- **Evidence:** Browser screenshot

**Test 5: HTTPS Only**
- **Goal:** Verify all requests use HTTPS (AC-1.1.5)
- **Steps:**
  1. Open DevTools → Network tab
  2. Load app
  3. Check all request URLs
- **Expected:** All URLs start with `https://`
- **Evidence:** Network tab screenshot

**Test 6: Error Handling**
- **Goal:** Verify error message when feeds fail (AC-1.1.6)
- **Steps:**
  1. Temporarily change all feed URLs to invalid URLs in `rssService.js`
  2. Reload app
  3. Verify error message appears
  4. Restore correct URLs
- **Expected:** "Failed to load feeds" message displays
- **Evidence:** Screenshot of error state

---

## AC Verification Mapping

| Acceptance Criteria | Verification Method | Test Reference |
|---------------------|---------------------|----------------|
| AC-1.1.1 (Library installed) | Run `npm list rss-parser` | Test 1 |
| AC-1.1.2 (CORS handling) | Check Network tab for successful proxy requests | Test 2 |
| AC-1.1.3 (Feed parsing) | Console.log articles, verify structure | Test 3 |
| AC-1.1.4 (Display headlines) | Visual inspection of app | Test 4 |
| AC-1.1.5 (HTTPS only) | Network tab inspection | Test 5 |
| AC-1.1.6 (Error handling) | Simulate feed failures | Test 6 |
| AC-1 (PRD - partial) | Count articles and sources | Test 4 |

---

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| **allorigins.win is down or rate-limited** | Test thoroughly. Document fallback to rss2json.com. Monitor service status. |
| **RSS feeds have different formats** | Use `rss-parser` which handles RSS 2.0, RSS 1.0, and Atom. Test with diverse feeds. |
| **Feeds are slow to load** | Use `Promise.all()` for parallel fetching. Add timeout in Epic 1.2 if needed. |
| **Some feeds return 0 articles** | Handle gracefully - don't show error, just skip. Log to console for debugging. |

---

## Rollout and Migration Notes

**No migration needed** - this is a new feature.

**Future considerations:**
- Epic 1.2: Expand to 10-15 feeds
- Epic 2.0: Move feed configuration to user preferences
- Epic 3.0: Add caching to reduce network requests

---

## Observability and Debugging

### What Can Be Logged
- Feed fetch attempts and results
- Parse errors with feed URLs
- Article counts per feed
- Network errors

### What Must Never Be Logged
- User preferences (not applicable yet)
- Article content (privacy)
- User identifiers (none exist yet)

### Debugging Tools
- **Browser DevTools Console:** View fetch errors and parsed data
- **Network Tab:** Monitor CORS proxy requests
- **React DevTools:** Inspect component state

---

**Plan Version:** 1.0  
**Last Updated:** December 30, 2025  
**Status:** Ready for implementation
