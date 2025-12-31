# PRD.md: EdgeReader

## 1. Summary

**EdgeReader** is a privacy-focused news aggregator Progressive Web App (PWA) that delivers personalized news feeds without tracking or data collection. All personalization happens client-side using explicit user preferences (topics, sources, keywords). Articles open in the user's default browser to leverage external privacy and ad-blocking features.

**Project name:** EdgeReader  
**App URL:** `https://edgereader.app` (or Antigravity-hosted URL)  
**Target platforms:** PWA (works on Android, iOS, desktop via browser)  
**Core differentiation:** Zero tracking, on-device personalization, edge computing principles  
**Primary competitor reference:** Google News (UX/layout inspiration only)  
**Open source:** Yes (GPL-3.0 license)  
**Tagline:** "News aggregation at the edge. Your content, your device, zero tracking."  
**Development Tool:** Google Antigravity (DeepAgent)

---

## 2. Problem Statement

Existing news aggregator apps (Google News, Apple News, Flipboard) collect extensive user data for personalization, creating privacy concerns. Users seeking privacy-respecting alternatives must sacrifice personalized content curation or use fragmented solutions (individual RSS readers, browser bookmarks). There is no mainstream news aggregator (web or mobile) that combines:
- Multi-source aggregation
- Personalized recommendations
- Strong privacy guarantees (on-device processing, no tracking)

EdgeReader solves this by bringing edge computing principles to news aggregation: all processing happens on your device, your data never leaves your control.

---

## 3. Target Users

**Primary persona:** You (solo developer, privacy-conscious news reader)
- Uses privacy-focused browsers (Brave, Firefox Focus, DuckDuckGo)
- Values open-source and transparent tools
- Willing to manually configure preferences for better privacy
- Wants clean, fast news experience without ads or tracking

**Secondary persona (future):** Privacy-conscious community
- F-Droid users, privacy advocates, tech enthusiasts
- May discover app via GitHub, Product Hunt, or privacy forums
- Willing to provide feedback and contribute to open-source project

---

## 4. User Stories (Prioritized)

**MVP (P0) - PWA (All Platforms):**
1. As a user, I want to browse aggregated news headlines from multiple sources so I can stay informed without visiting individual sites.
2. As a user, I want to select topics/categories I care about so the app prioritizes relevant articles.
3. As a user, I want to tap an article and have it open in my default browser so I can read with my existing privacy protections.
4. As a user, I want the app to feel fast and responsive so it doesn't waste my time.
5. As a user, I want to opt in/out of anonymous crash reporting so I control what data (if any) leaves my device.

**Post-MVP (P1):**
6. As a user, I want to add custom RSS feeds so I can include niche sources not built into the app.
7. As a user, I want to search or filter by keywords so I can find specific stories.
8. As a user, I want to bookmark/save articles for later (stored locally) so I can revisit them.
9. As a user, I want dark mode so the app is comfortable to use at night.

**Future (P2):**
10. As a user, I want native mobile apps (Android/iOS) for deeper OS integration (optional, PWA works cross-platform).
11. As a user, I want lightweight client-side ML recommendations so the app learns what I like without sending data off-device.

---

## 5. Requirements

### 5.1 Functional Requirements

**FR-1:** Aggregate headlines and metadata (title, description, image, source, publish date, URL) from at least 10 news sources using free-tier APIs and RSS feeds.

**FR-2:** Support explicit user preference selection:
- Topics/categories (e.g., Technology, Politics, Sports, Science)
- Individual sources (enable/disable per source)
- Keywords or search terms for boosting/filtering

**FR-3:** Store all user preferences locally in browser storage (IndexedDB/LocalStorage, no cloud sync, no server-side storage).

**FR-4:** Implement client-side ranking algorithm that scores articles based on user preferences (topic match, source priority, keyword presence, recency).

**FR-5:** Display ranked feed of articles in a scrollable list/card layout, showing:
- Headline
- Source name and publish time
- Thumbnail image (if available)
- Brief description/snippet

**FR-6:** When user taps an article, open the article URL in the device's default external browser (not in-app WebView).

**FR-7:** Provide onboarding flow to configure initial preferences (topics, sources) on first launch.

**FR-8:** Allow users to edit preferences from settings screen at any time.

**FR-9:** Refresh feed on user pull-to-refresh or app launch (fetch latest articles from sources).

**FR-10:** Cache articles locally using Service Workers for offline viewing of previously loaded headlines (text/metadata only, not full article content).

**FR-11:** Provide opt-out toggle for anonymous crash reporting in settings screen. Default state: **enabled** (user can disable).

**FR-12:** When user opts in to crash reporting, collect only: crash logs, device model, OS version, app version. No user identifiers, preferences, or article interaction data.

---

### 5.2 Non-Functional Requirements

**NFR-1 (Privacy):** App must not transmit any user behavior, preferences, or identifiable data to any server except:
- News API calls (anonymized, no user linkage)
- Anonymous crash reports (only if user has not opted out)

**NFR-2 (Privacy):** No use of third-party analytics or ad SDKs. Crash reporting must use privacy-respecting tool (e.g., Sentry with PII scrubbing, or Firebase Crashlytics with all analytics disabled).

**NFR-3 (Performance):** Feed must load and display within 2 seconds on average mobile network (4G).

**NFR-4 (Performance):** App startup time under 1 second on mid-range Android devices (2-year-old flagship equivalent).

**NFR-5 (UX):** UI should follow Material Design 3 guidelines for familiarity and modern web aesthetics.

**NFR-6 (Legal/Compliance):** Comply with web standards and hosting policies, including:
- Accurate privacy policy and data safety declarations
- Proper attribution of news sources
- No copyright violations (link to sources, don't scrape full text)

**NFR-7 (Maintainability):** Codebase should support solo developer maintenance using Antigravity; prioritize simplicity and readability over advanced architecture.

**NFR-8 (Scalability):** Design should allow adding new news sources via configuration (not hardcoded) for easy expansion.

**NFR-9 (Open Source):** Code must be hosted on GitHub with GPL-3.0 license to prevent commercial exploitation while allowing community contributions.

---

## 6. Acceptance Criteria

**AC-1 (FR-1, FR-9):** Given the app is launched, when the user pulls to refresh, then at least 50 unique articles from 10+ sources are fetched and displayed within 3 seconds.

**AC-2 (FR-2, FR-4):** Given the user selects "Technology" and "Science" topics in preferences, when the feed is displayed, then articles tagged with these topics appear higher in the list than other topics.

**AC-3 (FR-3, NFR-1):** Given the user has set preferences, when network traffic is inspected, then no user preference data is transmitted to any server.

**AC-4 (FR-6):** Given an article is displayed, when the user clicks it, then the article URL opens in a new browser tab (target=_blank).

**AC-5 (FR-7):** Given the app is installed and launched for the first time, when the user completes onboarding, then at least 3 topics or sources must be selected before proceeding to the main feed.

**AC-6 (FR-8):** Given the user is on the settings screen, when they add a new keyword preference and return to the feed, then articles matching that keyword are ranked higher within 5 seconds.

**AC-7 (FR-10):** Given the user has previously loaded the feed, when the device is offline, then cached article headlines and metadata are still displayed (at least last 100 articles).

**AC-8 (NFR-3, NFR-4):** Given the app is tested on a mid-range device browser, when launched, then page load time is under 1 second and feed loads within 2 seconds on 4G.

**AC-9 (FR-11, FR-12):** Given the user opens settings, when they toggle crash reporting off, then no crash data is sent to any server even if a crash occurs.

**AC-10 (FR-11, FR-12):** Given crash reporting is enabled and a crash occurs, when crash logs are inspected, then they contain no user preferences, article URLs, or any identifiable information beyond device model, OS version, and stack trace.

**AC-11 (NFR-6):** Given the app is deployed to web hosting, when accessed, then it loads correctly and passes privacy audits.

**AC-12 (FR-5, NFR-5):** Given the feed is displayed, when evaluated against Material Design 3 guidelines, then it uses modern web components (Material Web Components or Material UI, elevation, typography).

**AC-13 (NFR-9):** Given the code is published on GitHub, when a third party views the repository, then the GPL-3.0 license is clearly stated in LICENSE file and README.

---

## 7. MVP Scope

### In-Scope (MVP - PWA)
- Progressive Web App (React/Vue + Material UI recommended)
- Aggregation from 10-15 free news sources (RSS feeds + free-tier NewsAPI/GNews for diversity)
- On-device preference selection (topics, sources, keywords)
- Simple on-device ranking algorithm (weighted scoring based on preferences)
- Pull-to-refresh and automatic feed refresh on launch
- Open articles in external browser
- Onboarding flow for initial setup
- Settings screen for editing preferences and crash reporting toggle
- Local caching of headlines/metadata for offline viewing
- Anonymous crash reporting with opt-out (default: enabled)
- Open-source GitHub repository with GPL-3.0 license
- Basic Material Design 3 UI
- PWA manifest and Service Worker for offline support
- Installable to home screen (Add to Home Screen)

### Out-of-Scope (MVP)
- Native mobile apps (post-MVP, P2 priority - PWA works cross-platform)
- User accounts, login, or cloud sync
- Social features (sharing, comments, likes)
- In-app article reader or WebView
- Push notifications for breaking news
- Advanced on-device ML models for recommendations
- Bookmarking/saving articles (P1 post-MVP)
- Search functionality within the app (P1 post-MVP)
- Dark mode (P1 post-MVP)
- Custom RSS feed addition (P1 post-MVP)
- Localization beyond English
- Monetization (ads, subscriptions, paid tiers) — strictly free for MVP

---

## 8. Risks and Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| **News API rate limits exceed free tier** | Medium | Medium | Primary reliance on RSS feeds (unlimited). Use NewsAPI/GNews only for supplemental diversity. Monitor usage daily. |
| **RSS feed parsing is time-consuming** | Medium | High | Use established parsing libraries (`Rome` for Android). Build feed adapter layer once, reuse across sources. Budget 2-3 days for initial implementation. |
| **On-device ranking is too simplistic** | Low | Medium | Start with transparent rules-based scoring. Iterate based on personal usage. No external users to disappoint initially. |
| **GPL-3.0 scares away contributors** | Low | Low | Acceptable tradeoff to prevent commercial forks. Privacy community often prefers copyleft licenses. Include clear CONTRIBUTING.md explaining rationale. |
| **Crash reporting undermines privacy messaging** | Medium | Medium | Make opt-out prominent in onboarding and settings. Document exactly what's collected in privacy policy. Use Sentry with strict PII scrubbing or self-hosted solution. |
| **Google Play rejection for content policy** | Medium | Low | Include clear source attribution. Link to originals, never scrape full text. Review Google Play News policy before submission. |
| **Burnout on solo project** | High | Medium | Set realistic scope. MVP should be usable in 4-6 weeks of part-time work. Open-source early to attract contributors for post-MVP features. |
| **No user adoption (even for personal use)** | Low | Low | Built for personal use first; any external adoption is bonus. Open-sourcing ensures value persists even if development pauses. |

---

## 9. Open Questions

**All critical questions have been answered.** No blocking open questions remain for MVP development.

**Resolved:**
1. ✅ Budget: Start with free tiers, allow paid if preferred
2. ✅ License: Open-source with GPL-3.0 (prevents commercial exploitation)
3. ✅ Team size: Solo developer
4. ✅ Timeline: No deadline, personal use priority
5. ✅ Platform: Android first, iOS later
6. ✅ Crash reporting: Anonymous, opt-out available, default enabled
7. ✅ Project name: EdgeReader

---

## 10. Technical Recommendations

### 10.1 Tech Stack (PWA Development with Antigravity)

**Recommended: React + Material UI + Vite**

**Rationale:**
- **Antigravity native:** DeepAgent excels at building React-based web apps
- **Cross-platform by default:** Works on Android, iOS, desktop browsers
- **No build tools needed:** Antigravity handles deployment and hosting
- **Modern toolkit:** React provides declarative UI similar to Jetpack Compose
- **Material Design 3:** Material UI (MUI) provides ready-made components
- **PWA support:** Service Workers for offline mode, manifest for installability
- **Future-proofing:** Easy to maintain as solo developer with Antigravity assistance

**Key libraries:**
- **React 18+**: UI framework
- **Material UI (MUI v5+)**: Material Design 3 components
- **Vite**: Fast build tool (handled by Antigravity)
- **rss-parser**: RSS feed parsing
- **axios**: HTTP client for fetching feeds
- **idb (IndexedDB wrapper)**: Local storage for articles and preferences
- **Workbox**: Service Worker management for offline support
- **Sentry Browser SDK**: Crash/error reporting (optional)

**Project structure:**
```
edgereader/
├── src/
│   ├── components/
│   │   ├── FeedList.jsx
│   │   ├── ArticleCard.jsx
│   │   ├── SettingsPanel.jsx
│   │   └── OnboardingFlow.jsx
│   ├── services/
│   │   ├── rssService.js
│   │   ├── storageService.js
│   │   └── rankingService.js
│   ├── utils/
│   │   └── preferences.js
│   ├── App.jsx
│   └── main.jsx
├── public/
│   ├── manifest.json (PWA manifest)
│   └── service-worker.js
└── package.json
```

**Alternative (if you prefer Vue):**
- **Vue 3 + Vuetify**: Similar benefits, Antigravity supports both

---

### 10.2 News APIs and Data Sources

**Primary Strategy: RSS Feeds (Free, Unlimited)**

Same RSS feed list as Android version, but with CORS considerations:

**CORS Handling:**
- Some RSS feeds may block browser requests (CORS policy)
- **Solution 1:** Use CORS proxy (e.g., `https://api.allorigins.win/raw?url=`)
- **Solution 2:** Antigravity can create a simple backend proxy endpoint
- **Solution 3:** Use RSS-to-JSON services (e.g., `rss2json.com` free tier)

**Curated RSS Feed List (10-15 sources):**

```javascript
// Example feed configuration
const DEFAULT_FEEDS = [
    { name: "Reuters World", url: "https://feeds.reuters.com/reuters/worldNews", topic: "General" },
    { name: "Reuters Tech", url: "https://feeds.reuters.com/reuters/technologyNews", topic: "Technology" },
    { name: "BBC News", url: "https://feeds.bbci.co.uk/news/rss.xml", topic: "General" },
    { name: "TechCrunch", url: "https://techcrunch.com/feed/", topic: "Technology" },
    { name: "Ars Technica", url: "https://feeds.arstechnica.com/arstechnica/index", topic: "Technology" },
    { name: "The Verge", url: "https://www.theverge.com/rss/index.xml", topic: "Technology" },
    { name: "Hacker News", url: "https://news.ycombinator.com/rss", topic: "Technology" },
    { name: "ScienceDaily", url: "https://www.sciencedaily.com/rss/all.xml", topic: "Science" },
    { name: "Phys.org", url: "https://phys.org/rss-feed/", topic: "Science" },
    { name: "NPR News", url: "https://feeds.npr.org/1001/rss.xml", topic: "General" },
    { name: "The Guardian World", url: "https://www.theguardian.com/world/rss", topic: "General" },
    { name: "Wired", url: "https://www.wired.com/feed/rss", topic: "Technology" },
    { name: "MIT Technology Review", url: "https://www.technologyreview.com/feed/", topic: "Technology" },
    { name: "Engadget", url: "https://www.engadget.com/rss.xml", topic: "Technology" },
    { name: "Nature News", url: "https://www.nature.com/nature.rss", topic: "Science" }
];
```

**Implementation Notes:**
- **Caching:** Store fetched articles in IndexedDB with timestamp; refresh every 30 minutes
- **Parsing:** Use `rss-parser` library for robust RSS/Atom parsing
- **Error handling:** If a feed fails, log error but don't block other feeds
- **Topic tagging:** Map feed to default topic, allow user override

---

### 10.3 Client-Side Personalization (JavaScript Implementation)

**Algorithm Overview:**

```javascript
// Data models
const Article = {
    title: String,
    description: String,
    url: String,
    source: String,
    publishDate: Number, // Unix timestamp
    topic: String,
    imageUrl: String
};

const UserPreferences = {
    selectedTopics: Set,
    enabledSources: Set,
    disabledSources: Set,
    keywords: Set
};

// Scoring function
function scoreArticle(article, prefs) {
    let score = 0;

    // 1. Recency bonus (decay over 24 hours)
    const hoursAgo = (Date.now() - article.publishDate) / (1000 * 60 * 60);
    score += Math.max(0, 100 - hoursAgo);

    // 2. Topic match (strong signal)
    if (prefs.selectedTopics.has(article.topic)) {
        score += 50;
    }

    // 3. Source filtering and priority
    if (prefs.disabledSources.has(article.source)) {
        score -= 1000; // Effectively hide
    } else if (prefs.enabledSources.has(article.source)) {
        score += 30;
    }

    // 4. Keyword matching (title and description)
    const textToSearch = `${article.title} ${article.description}`.toLowerCase();
    prefs.keywords.forEach(keyword => {
        if (textToSearch.includes(keyword.toLowerCase())) {
            score += 20;
        }
    });

    return score;
}

// Usage
function getRankedArticles(articles, prefs) {
    return articles
        .filter(article => scoreArticle(article, prefs) > -500)
        .sort((a, b) => scoreArticle(b, prefs) - scoreArticle(a, prefs));
}
```

**Storage (IndexedDB + LocalStorage):**

```javascript
// Using idb library for IndexedDB
import { openDB } from 'idb';

const DB_NAME = 'edgereader';
const PREFS_KEY = 'userPreferences';

// Initialize database
async function initDB() {
    return openDB(DB_NAME, 1, {
        upgrade(db) {
            db.createObjectStore('articles', { keyPath: 'url' });
            db.createObjectStore('preferences');
        }
    });
}

// Save preferences
async function savePreferences(prefs) {
    const db = await initDB();
    await db.put('preferences', prefs, PREFS_KEY);
}

// Load preferences
async function loadPreferences() {
    const db = await initDB();
    return await db.get('preferences', PREFS_KEY) || {
        selectedTopics: new Set(),
        enabledSources: new Set(),
        disabledSources: new Set(),
        keywords: new Set()
    };
}
```

---

### 10.4 Opening Links in External Browser (JavaScript)

```javascript
// In React component
function ArticleCard({ article }) {
    const handleClick = () => {
        // Opens in new tab, respects user's default browser
        window.open(article.url, '_blank', 'noopener,noreferrer');
    };

    return (
        <Card onClick={handleClick} style={{ cursor: 'pointer' }}>
            <CardContent>
                <Typography variant="h6">{article.title}</Typography>
                <Typography variant="body2">{article.source}</Typography>
            </CardContent>
        </Card>
    );
}

// Or use anchor tag
function ArticleCard({ article }) {
    return (
        <a href={article.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <Card>
                <CardContent>
                    <Typography variant="h6">{article.title}</Typography>
                    <Typography variant="body2">{article.source}</Typography>
                </CardContent>
            </Card>
        </a>
    );
}
```

**Why `target="_blank"`?**
- Opens in new tab (user stays on EdgeReader)
- `noopener` and `noreferrer` prevent tracking via `window.opener`
- Respects user's browser choice (Brave, Firefox, etc.)

---

### 10.5 Crash/Error Reporting Implementation

**Option 1: Sentry Browser SDK (Recommended for PWA)**

```javascript
// Install: npm install @sentry/react
import * as Sentry from "@sentry/react";

// Initialize in main.jsx
Sentry.init({
    dsn: "your-sentry-dsn",
    enabled: getUserPreference('crashReportingEnabled'), // Check user preference
    beforeSend(event) {
        // Scrub PII
        delete event.user;
        delete event.request;
        event.breadcrumbs = []; // Remove navigation history
        return event;
    }
});

// In settings component
function SettingsPanel() {
    const [crashReporting, setCrashReporting] = useState(true);

    const handleToggle = (enabled) => {
        setCrashReporting(enabled);
        saveUserPreference('crashReportingEnabled', enabled);
        Sentry.getCurrentHub().getClient().getOptions().enabled = enabled;
    };

    return (
        <FormControlLabel
            control={<Switch checked={crashReporting} onChange={(e) => handleToggle(e.target.checked)} />}
            label="Anonymous Error Reporting"
        />
    );
}
```

**Option 2: No crash reporting (simplest)**
- For MVP, you can skip crash reporting entirely
- Use browser DevTools console for debugging
- Add later if needed

---

### 10.6 PWA Configuration

**manifest.json (in public/ folder):**

```json
{
    "name": "EdgeReader",
    "short_name": "EdgeReader",
    "description": "Privacy-focused news aggregator",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#ffffff",
    "theme_color": "#1976d2",
    "icons": [
        {
            "src": "/icon-192.png",
            "sizes": "192x192",
            "type": "image/png"
        },
        {
            "src": "/icon-512.png",
            "sizes": "512x512",
            "type": "image/png"
        }
    ]
}
```

**Service Worker (for offline support):**

```javascript
// Using Workbox (Antigravity can generate this)
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst } from 'workbox-strategies';

// Precache app shell
precacheAndRoute(self.__WB_MANIFEST);

// Cache RSS feed responses
registerRoute(
    ({ url }) => url.pathname.includes('/rss') || url.pathname.includes('/feed'),
    new NetworkFirst({
        cacheName: 'rss-feeds',
        networkTimeoutSeconds: 5
    })
);

// Cache images
registerRoute(
    ({ request }) => request.destination === 'image',
    new CacheFirst({
        cacheName: 'images'
    })
);
```

---

### 10.7 Deployment with Antigravity

**Antigravity handles:**
- ✅ Build process (Vite bundling)
- ✅ Hosting (automatic HTTPS)
- ✅ Domain configuration (custom domain or Antigravity subdomain)
- ✅ Continuous deployment (push to update)

**Steps:**
1. Build app in Antigravity
2. Deploy to Antigravity hosting
3. Get URL: `https://your-app.antigravity.dev` or custom domain
4. Share URL or add to home screen on mobile

**No manual deployment needed!**

---

### 10.8 Open Source License

**Recommended: GPL-3.0** (same as Android version)

**Implementation:**
1. Add `LICENSE` file with GPL-3.0 text
2. Add license header to source files
3. Mention in README: "Licensed under GPL-3.0"
4. Host on GitHub for transparency

---

## 11. Privacy Policy Requirements

Host a simple webpage (same domain as PWA or GitHub Pages) with:

**Required sections:**
1. **Data Collection:** "EdgeReader does not collect, store, or transmit any personal information or user behavior data."
2. **Crash Reporting:** "If enabled, anonymous crash reports contain only: device model, OS version, app version, stack trace. Opt-out available in Settings."
3. **Network Usage:** "Fetches news from public RSS feeds. No user identifiers sent."
4. **Third-Party Links:** "Articles open in your browser. We don't track browsing."
5. **Data Retention:** "All data stored locally. Delete by clearing app data."

**Example URL:**
- `https://yourusername.github.io/edgereader/privacy-policy.html`

---

## 12. Deployment Checklist

**Pre-deployment:**
- [ ] Test on 2+ browsers (Chrome, Firefox, Safari)
- [ ] Test on mobile devices (Android, iOS)
- [ ] Verify crash reporting opt-out works
- [ ] Create privacy policy webpage
- [ ] Test PWA installation (Add to Home Screen)
- [ ] Verify offline mode works
- [ ] Test on slow network (throttle to 3G)
- [ ] Run Lighthouse audit (aim for 90+ scores)

---

## 13. Next Steps (4-Week Roadmap with Antigravity)

### Week 1: Project Setup
1. Create project in Antigravity
2. Initialize React + Material UI + Vite
3. Set up RSS parsing (test 3-5 feeds with CORS handling)
4. Build basic feed display

### Week 2: Preferences and Ranking
5. Implement IndexedDB for preferences
6. Build onboarding flow
7. Implement ranking algorithm
8. Build settings screen

### Week 3: Offline and Caching
9. Set up Service Worker for offline mode
10. Implement IndexedDB article caching
11. Add loading states and error handling
12. Test PWA installation

### Week 4: Polish and Deployment
13. Optional: Integrate Sentry for error tracking
14. UI polish (images, dates, cards)
15. Performance testing (Lighthouse audit)
16. Deploy to Antigravity hosting



---

## 14. Success Metrics (Personal Use)

**MVP success:**
- [ ] PWA usable for daily news reading
- [ ] No critical errors in browser console
- [ ] Feed loads in under 2 seconds
- [ ] Personalization feels better than individual sites
- [ ] Installable on mobile home screen
- [ ] Works offline
- [ ] Stable enough to share with 5-10 people

**Post-MVP:**
- [ ] GitHub repo gets 50+ stars
- [ ] 1-2 external contributors
- [ ] Personal usage continues 6+ months
- [ ] Listed on privacy-focused directories

---

## 15. Glossary

- **Edge computing:** Computing performed at or near the source of data (client-side)
- **Client-side processing:** Computation occurs in browser; no data sent to servers
- **PWA (Progressive Web App):** Web app that works offline and can be installed like native app
- **Service Worker:** Background script that enables offline functionality
- **IndexedDB:** Browser database for storing large amounts of structured data
- **RSS feed:** Standardized web feed format for site updates
- **GPL-3.0:** Copyleft license requiring derivatives to be open-source
- **Material Design 3:** Google's latest design system
- **Antigravity:** Google's DeepAgent tool for building web applications

---

**Document Version:** 4.0 (PWA Edition)  
**Last Updated:** December 30, 2025  
**Status:** Ready for development with Antigravity  
**Next Review:** After MVP completion (~4 weeks)  
**Previous Version:** 3.0 (Android native)