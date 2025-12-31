# EdgeReader Development Roadmap

**Version:** 2.0 (PWA Edition)  
**Last Updated:** December 30, 2025  
**Status:** ACTIVE  
**Reference:** PRD_PWA.md v4.0, constitution.md v1.0  
**Previous Version:** 1.0 (Android native)

---

## 1. MVP Decisions (Locked)

These decisions are **frozen** for MVP and cannot be changed without constitution amendment:

| Decision | Rationale | Status |
|----------|-----------|--------|
| **Platform:** PWA (all platforms) | Solo dev with Antigravity, cross-platform by default | ✅ LOCKED |
| **Tech Stack:** React + Material UI + Vite | Antigravity-native, Material Design 3, maintainable | ✅ LOCKED |
| **Data Sources:** RSS feeds (primary) + free-tier APIs (optional) | Zero cost, unlimited, privacy-friendly | ✅ LOCKED |
| **Browser:** New tab via target="_blank" | Privacy-first, respects user's default browser | ✅ LOCKED |
| **Personalization:** Client-side scoring algorithm | Zero tracking, browser-based processing only | ✅ LOCKED |
| **Storage:** IndexedDB + LocalStorage | Browser-based, local-only, no cloud sync | ✅ LOCKED |
| **Error Reporting:** Sentry Browser SDK with opt-out (optional) | Default enabled, user-controllable, PII scrubbed | ✅ LOCKED |
| **License:** GPL-3.0 | Prevents commercial exploitation, open-source friendly | ✅ LOCKED |
| **Timeline:** 4 weeks part-time with Antigravity | Personal use priority, no hard deadline | ✅ LOCKED |

**Out of Scope (MVP):**
- Native mobile apps (Android/iOS)
- User accounts / cloud sync
- Social features
- In-app WebView
- Push notifications
- Advanced ML models
- Monetization
- Localization beyond English

---

## 2. Non-Negotiables Summary

Pulled from constitution.md Section 2. **All epics MUST comply:**

### Privacy (Absolute)
- ✅ ALL user data stored locally (IndexedDB/LocalStorage only)
- ✅ ALL personalization client-side (in browser)
- ✅ New tab links only (target="_blank" with noopener/noreferrer)
- ✅ Zero analytics SDKs
- ✅ Error reporting opt-out available
- ❌ NO user data transmitted to servers
- ❌ NO tracking SDKs or advertising IDs
- ❌ NO cloud storage

### Performance (Measurable)
- Page load: **< 1 second** (initial load, mid-range device)
- Feed load: **< 2 seconds** (4G, 50+ articles)
- UI: **60 FPS minimum** during scrolling
- Offline: Display last 100 cached articles (Service Worker)
- Bundle size: **< 500 KB** (gzipped)
- Lighthouse score: **90+** (Performance, Accessibility, Best Practices, SEO)

### Security
- HTTPS only for all network requests
- Validate all user input
- No hardcoded secrets
- Follow OWASP Mobile Top 10

### Workflow
- Spec-driven development (SPECIFY → PLAN → TASKS → IMPLEMENT)
- All PRs link to spec document
- Definition of Done checklist required

---

## 3. Breakpoint Map

Breakpoints (BP) represent **testable milestones** where the app reaches a new level of functionality.

| Breakpoint | Description | Epics | Exit Criteria |
|------------|-------------|-------|---------------|
| **BP0** | Project foundation | 1.0, 1.1 | Repo initialized, basic feed displays 3+ sources |
| **BP1** | Core aggregation | 1.2, 1.3 | 10+ sources, feed loads < 2s, articles open in browser |
| **BP2** | Personalization | 2.0, 2.1, 2.2 | Onboarding complete, preferences stored, ranking works |
| **BP3** | Offline & caching | 3.0, 3.1 | Room database, offline mode, pull-to-refresh |
| **BP4** | Privacy & polish | 4.0, 4.1, 4.2 | Crash reporting with opt-out, settings screen, UI polish |
| **BP5** | Release ready | 5.0, 5.1 | Privacy policy, Play Store assets, testing complete |
| **BP6** | Post-MVP features | 6.0, 6.1, 6.2, 6.3 | Dark mode, bookmarks, search, custom RSS |

---

## 4. Epics

### Epic 1.0: Project Setup & Repository

**Goal:** Initialize PWA project in Antigravity with proper structure, dependencies, and open-source configuration.

**Scope:**
- ✅ In: Antigravity project, React + Material UI + Vite, folder structure, GPL-3.0 license, README
- ❌ Out: CI/CD, automated testing setup (manual for MVP)

**Dependencies:** None (starting point)

**Exit Criteria:**
- [ ] Antigravity project created: EdgeReader
- [ ] React + Material UI + Vite initialized
- [ ] LICENSE file (GPL-3.0) and README.md present
- [ ] Project builds without errors
- [ ] Basic folder structure: `src/components/`, `src/services/`, `src/utils/`
- [ ] PWA manifest.json configured

**Targets:** AC-13 (GPL-3.0 license visible)

**Spec-Kit Trigger:**
```
/speckit specify "reference roadmap.md file for 1.0"
```

---

### Epic 1.1: RSS Feed Parsing Foundation

**Goal:** Implement RSS feed parsing for 3-5 test sources and display raw headlines in a list.

**Scope:**
- ✅ In: rss-parser library integration, fetch 3-5 feeds, handle CORS, display in scrollable list
- ❌ Out: Ranking, images, full UI polish, error handling (basic only)

**Dependencies:** 1.0 (project setup)

**Exit Criteria:**
- [ ] rss-parser library added (npm install rss-parser)
- [ ] CORS handling implemented (proxy or rss2json service)
- [ ] Fetch and parse 3-5 RSS feeds (Reuters, TechCrunch, BBC)
- [ ] Display headlines in scrollable list (title + source name)
- [ ] Network calls use HTTPS only
- [ ] Basic error handling (show "Failed to load" message)

**Targets:** FR-1 (partial), NFR-1 (HTTPS), AC-1 (partial)

**Spec-Kit Trigger:**
```
/speckit specify "reference roadmap.md file for 1.1"
```

---

### Epic 1.2: Multi-Source Aggregation (10+ Sources)

**Goal:** Expand to 10-15 news sources (RSS + optional free-tier APIs) and aggregate into single feed.

**Scope:**
- ✅ In: 10-15 RSS feeds, optional NewsAPI/GNews integration, source configuration, parallel fetching
- ❌ Out: User-added custom feeds (post-MVP), paid APIs

**Dependencies:** 1.1 (RSS parsing works)

**Exit Criteria:**
- [ ] 10-15 news sources configured (see PRD_PWA Section 10.2 for list)
- [ ] Articles fetched in parallel (Promise.all)
- [ ] Feed displays 50+ unique articles
- [ ] Source name displayed for each article
- [ ] Fetch completes within 3 seconds on 4G

**Targets:** FR-1, AC-1

**Spec-Kit Trigger:**
```
/speckit specify "reference roadmap.md file for 1.2"
```

---

### Epic 1.3: External Browser Integration

**Goal:** Open articles in new browser tab when clicked (no in-app iframe).

**Scope:**
- ✅ In: target="_blank" with noopener/noreferrer, handle click events
- ❌ Out: In-app iframe, link preview

**Dependencies:** 1.1 (articles displayed)

**Exit Criteria:**
- [ ] Clicking article opens URL in new tab
- [ ] Uses target="_blank" rel="noopener noreferrer"
- [ ] Tested with Brave, Chrome, Firefox
- [ ] No in-app iframe or embedded content

**Targets:** FR-6, AC-4, NFR-1 (privacy)

**Spec-Kit Trigger:**
```
/speckit specify "reference roadmap.md file for 1.3"
```

---

### Epic 2.0: User Preferences Storage

**Goal:** Implement local storage for user preferences (topics, sources, keywords) using IndexedDB.

**Scope:**
- ✅ In: IndexedDB setup, preference data model, read/write operations
- ❌ Out: UI for editing preferences (Epic 2.2), cloud sync

**Dependencies:** 1.0 (project setup)

**Exit Criteria:**
- [ ] IndexedDB initialized (using idb library)
- [ ] UserPreferences object defined (topics, sources, keywords)
- [ ] Storage service with read/write methods
- [ ] Preferences persist across browser sessions
- [ ] No network calls when saving preferences (verified with DevTools Network tab)

**Targets:** FR-2, FR-3, AC-3, NFR-1 (privacy)

**Spec-Kit Trigger:**
```
/speckit specify "reference roadmap.md file for 2.0"
```

---

### Epic 2.1: Client-Side Ranking Algorithm

**Goal:** Implement scoring algorithm to rank articles based on user preferences (topics, sources, keywords, recency).

**Scope:**
- ✅ In: Scoring function, topic matching, keyword matching, recency decay, unit tests
- ❌ Out: ML models, collaborative filtering, A/B testing

**Dependencies:** 2.0 (preferences storage), 1.2 (multi-source aggregation)

**Exit Criteria:**
- [ ] Scoring algorithm implemented (see PRD_PWA Section 10.3)
- [ ] Articles ranked by score (highest first)
- [ ] Unit tests for scoring logic (100% coverage)
- [ ] Ranking updates when preferences change
- [ ] All processing happens client-side (no network calls)

**Targets:** FR-4, AC-2, AC-6

**Spec-Kit Trigger:**
```
/speckit specify "reference roadmap.md file for 2.1"
```

---

### Epic 2.2: Onboarding Flow

**Goal:** Create first-launch onboarding to configure initial preferences (topics, sources).

**Scope:**
- ✅ In: Multi-step onboarding, topic selection, source selection, save preferences
- ❌ Out: Tutorial overlays, video walkthroughs, skip option (must complete)

**Dependencies:** 2.0 (preferences storage), 2.1 (ranking algorithm)

**Exit Criteria:**
- [ ] Onboarding shown only on first visit (check localStorage flag)
- [ ] User selects at least 3 topics or sources before proceeding
- [ ] Preferences saved to IndexedDB
- [ ] After onboarding, feed displays ranked articles
- [ ] Material UI components used

**Targets:** FR-7, AC-5, NFR-5 (Material Design)

**Spec-Kit Trigger:**
```
/speckit specify "reference roadmap.md file for 2.2"
```

---

### Epic 3.0: Article Caching (IndexedDB)

**Goal:** Set up IndexedDB to cache articles for offline viewing and faster load times.

**Scope:**
- ✅ In: IndexedDB article store, cache last 100 articles, query operations
- ❌ Out: Full-text search (post-MVP), bookmarks (post-MVP)

**Dependencies:** 1.2 (multi-source aggregation)

**Exit Criteria:**
- [ ] IndexedDB article store created
- [ ] Article object defined (title, description, URL, source, publishDate, topic, imageUrl)
- [ ] Storage service with insert, query, delete operations
- [ ] Articles cached after fetch (last 100 articles)
- [ ] Old articles automatically pruned

**Targets:** FR-10, AC-7

**Spec-Kit Trigger:**
```
/speckit specify "reference roadmap.md file for 3.0"
```

---

### Epic 3.1: Offline Mode & Service Worker

**Goal:** Implement Service Worker for offline support and display cached articles when offline.

**Scope:**
- ✅ In: Service Worker setup, offline detection, display cached articles, refresh button
- ❌ Out: Background sync, push notifications

**Dependencies:** 3.0 (IndexedDB caching)

**Exit Criteria:**
- [ ] Service Worker registered and active
- [ ] When offline, PWA displays cached articles (last 100)
- [ ] Refresh button implemented
- [ ] Loading indicator shown during refresh
- [ ] Error message if refresh fails (no internet)
- [ ] Feed refreshes on page load (if online)
- [ ] PWA installable (Add to Home Screen works)

**Targets:** FR-9, FR-10, AC-7

**Spec-Kit Trigger:**
```
/speckit specify "reference roadmap.md file for 3.1"
```

---

### Epic 4.0: Error Reporting with Opt-Out (Optional)

**Goal:** Optionally integrate Sentry Browser SDK with user-controllable opt-out and PII scrubbing.

**Scope:**
- ✅ In: Sentry setup (optional), opt-out toggle, PII scrubbing
- ❌ Out: Custom error reporting backend, advanced error tracking

**Dependencies:** 2.0 (preferences storage for opt-out state)

**Exit Criteria:**
- [ ] Sentry Browser SDK integrated (or skip for MVP)
- [ ] Error reporting respects user opt-out preference
- [ ] PII scrubbed from error logs (no preferences, URLs, identifiers)
- [ ] Error reports contain only: stack trace, browser, OS, app version
- [ ] Tested: Opt-out prevents error data transmission
- [ ] Note: Can skip entirely for MVP and use browser console

**Targets:** FR-11, FR-12, AC-9, AC-10, NFR-2 (privacy)

**Spec-Kit Trigger:**
```
/speckit specify "reference roadmap.md file for 4.0"
```

---

### Epic 4.1: Settings Screen

**Goal:** Build settings screen for editing preferences and toggling error reporting.

**Scope:**
- ✅ In: Settings UI, edit topics/sources/keywords, error reporting toggle (if implemented), Material UI
- ❌ Out: Advanced settings (theme, language), export/import preferences

**Dependencies:** 2.0 (preferences storage), 4.0 (error reporting - optional)

**Exit Criteria:**
- [ ] Settings screen accessible from main feed (toolbar icon)
- [ ] User can add/remove topics, sources, keywords
- [ ] Error reporting toggle present with explanation (if Sentry used)
- [ ] Changes saved to IndexedDB
- [ ] Feed updates when returning from settings

**Targets:** FR-8, AC-6, AC-9

**Spec-Kit Trigger:**
```
/speckit specify "reference roadmap.md file for 4.1"
```

---

### Epic 4.2: UI Polish & Material Design 3

**Goal:** Polish feed UI with images, timestamps, cards, and Material Design 3 components.

**Scope:**
- ✅ In: Article cards, thumbnail images (lazy loading), publish timestamps, Material UI theming
- ❌ Out: Complex animations, custom fonts, advanced theming

**Dependencies:** 1.2 (multi-source aggregation), 3.0 (IndexedDB for image URLs)

**Exit Criteria:**
- [ ] Articles displayed in Material UI cards
- [ ] Thumbnail images loaded with lazy loading
- [ ] Publish time shown (relative: "2 hours ago" using date-fns)
- [ ] Material UI theming applied
- [ ] 60 FPS scrolling maintained
- [ ] Accessibility: alt text for images, ARIA labels

**Targets:** FR-5, AC-12, NFR-5 (Material Design)

**Spec-Kit Trigger:**
```
/speckit specify "reference roadmap.md file for 4.2"
```

---

### Epic 5.0: Privacy Policy & Legal Compliance

**Goal:** Create privacy policy webpage and ensure web hosting compliance.

**Scope:**
- ✅ In: Privacy policy webpage (same domain or GitHub Pages), source attribution
- ❌ Out: Terms of Service, GDPR compliance tooling (app doesn't collect data)

**Dependencies:** 4.0 (error reporting finalized)

**Exit Criteria:**
- [ ] Privacy policy webpage published (same domain or GitHub Pages)
- [ ] Policy covers: data collection, error reporting, network usage, third-party links
- [ ] Source attribution visible in app (source name per article)
- [ ] Privacy policy link added to app footer/settings

**Targets:** NFR-6 (legal compliance), AC-11

**Spec-Kit Trigger:**
```
/speckit specify "reference roadmap.md file for 5.0"
```

---

### Epic 5.1: Testing & Deployment

**Goal:** Comprehensive testing, performance validation, and deployment to Antigravity hosting.

**Scope:**
- ✅ In: Manual testing (2+ browsers/devices), performance testing, Lighthouse audit, deployment
- ❌ Out: Automated UI tests (nice-to-have), beta testing program

**Dependencies:** All previous epics (1.0-4.2)

**Exit Criteria:**
- [ ] Tested on Chrome, Firefox, Safari
- [ ] Tested on Android and iOS mobile browsers
- [ ] Performance thresholds met: < 1s page load, < 2s feed load, 60 FPS
- [ ] Offline mode tested (airplane mode)
- [ ] Error reporting opt-out tested (if implemented)
- [ ] Bundle size < 500 KB (gzipped)
- [ ] Lighthouse audit: 90+ scores (Performance, Accessibility, Best Practices, SEO)
- [ ] PWA installable (Add to Home Screen works)
- [ ] Deployed to Antigravity hosting
- [ ] Custom domain configured (optional)

**Targets:** AC-8 (performance), AC-11 (Play Store approval), NFR-3, NFR-4

**Spec-Kit Trigger:**
```
/speckit specify "reference roadmap.md file for 5.1"
```

---

## 5. Post-MVP Epics

These epics are **deferred** until after MVP release. Prioritize based on user feedback.

### Epic 6.0: Dark Mode

**Goal:** Implement system-responsive dark mode.

**Scope:**
- ✅ In: Material UI dark theme, system setting detection (prefers-color-scheme)
- ❌ Out: Custom theme editor, AMOLED black theme

**Dependencies:** MVP complete

**Exit Criteria:**
- [ ] Dark mode follows system setting (CSS media query)
- [ ] All screens support dark theme
- [ ] Material UI dark palette applied

**Targets:** User Story #9 (P1)

**Spec-Kit Trigger:**
```
/speckit specify "reference roadmap.md file for 6.0"
```

---

### Epic 6.1: Bookmarks / Save for Later

**Goal:** Allow users to bookmark articles for later reading (stored locally).

**Scope:**
- ✅ In: Bookmark button, local storage (IndexedDB), bookmarks screen
- ❌ Out: Cloud sync, tags, folders

**Dependencies:** MVP complete, 3.0 (IndexedDB caching)

**Exit Criteria:**
- [ ] Bookmark icon on article cards
- [ ] Bookmarked articles stored in IndexedDB
- [ ] Bookmarks screen accessible from main feed
- [ ] Remove bookmark option

**Targets:** User Story #8 (P1)

**Spec-Kit Trigger:**
```
/speckit specify "reference roadmap.md file for 6.1"
```

---

### Epic 6.2: Search & Keyword Filtering

**Goal:** Add search functionality to filter articles by keywords.

**Scope:**
- ✅ In: Search bar, filter cached articles, highlight matches
- ❌ Out: Full-text search, search history, advanced filters

**Dependencies:** MVP complete, 3.0 (IndexedDB caching)

**Exit Criteria:**
- [ ] Search bar in toolbar
- [ ] Filter articles by title/description match
- [ ] Results update as user types (debounced)
- [ ] Clear search button

**Targets:** User Story #7 (P1)

**Spec-Kit Trigger:**
```
/speckit specify "reference roadmap.md file for 6.2"
```

---

### Epic 6.3: Custom RSS Feeds

**Goal:** Allow users to add custom RSS feed URLs.

**Scope:**
- ✅ In: Add feed UI, URL validation, custom feed storage, topic assignment
- ❌ Out: Feed discovery, OPML import, feed health monitoring

**Dependencies:** MVP complete, 1.1 (RSS parsing)

**Exit Criteria:**
- [ ] "Add custom feed" button in settings
- [ ] URL validation (HTTPS, valid RSS/Atom)
- [ ] Custom feeds stored in DataStore
- [ ] Custom feeds appear in main feed
- [ ] User can assign topic to custom feed

**Targets:** User Story #6 (P1)

**Spec-Kit Trigger:**
```
/speckit specify "reference roadmap.md file for 6.3"
```

---

## 6. Epic Dependency Graph

```
1.0 (Project Setup)
 ├─> 1.1 (RSS Parsing)
 │    ├─> 1.2 (Multi-Source)
 │    │    ├─> 1.3 (External Browser)
 │    │    └─> 3.0 (Room Database)
 │    │         └─> 3.1 (Offline Mode)
 │    └─> 6.3 (Custom RSS) [Post-MVP]
 │
 └─> 2.0 (Preferences Storage)
      ├─> 2.1 (Ranking Algorithm)
      │    └─> 2.2 (Onboarding)
      │
      └─> 4.0 (Crash Reporting)
           └─> 4.1 (Settings Screen)

4.2 (UI Polish) [depends on 1.2, 3.0]
5.0 (Privacy Policy) [depends on 4.0]
5.1 (Testing) [depends on all 1.0-4.2]

Post-MVP:
6.0 (Dark Mode) [depends on MVP]
6.1 (Bookmarks) [depends on MVP, 3.0]
6.2 (Search) [depends on MVP, 3.0]
6.3 (Custom RSS) [depends on MVP, 1.1]
```

---

## 7. Breakpoint Checklist

Use this to track progress toward each milestone.

### BP0: Project Foundation
- [ ] Epic 1.0: Project Setup
- [ ] Epic 1.1: RSS Parsing (3-5 sources)
- **Exit:** Repo initialized, basic feed displays

### BP1: Core Aggregation
- [ ] Epic 1.2: Multi-Source (10+ sources)
- [ ] Epic 1.3: External Browser
- **Exit:** 50+ articles, opens in browser, < 2s load

### BP2: Personalization
- [ ] Epic 2.0: Preferences Storage
- [ ] Epic 2.1: Ranking Algorithm
- [ ] Epic 2.2: Onboarding
- **Exit:** Onboarding complete, ranking works

### BP3: Offline & Caching
- [ ] Epic 3.0: Room Database
- [ ] Epic 3.1: Offline Mode
- **Exit:** Offline mode works, pull-to-refresh

### BP4: Privacy & Polish
- [ ] Epic 4.0: Crash Reporting
- [ ] Epic 4.1: Settings Screen
- [ ] Epic 4.2: UI Polish
- **Exit:** Settings work, UI polished, crash reporting opt-out

### BP5: Release Ready
- [ ] Epic 5.0: Privacy Policy
- [ ] Epic 5.1: Testing & Release Prep
- **Exit:** Play Store ready, all tests pass

### BP6: Post-MVP Features
- [ ] Epic 6.0: Dark Mode
- [ ] Epic 6.1: Bookmarks
- [ ] Epic 6.2: Search
- [ ] Epic 6.3: Custom RSS
- **Exit:** P1 features complete

---

## 8. Spec-Kit Integration Guide

### How to Use This Roadmap with Spec-Kit

**Step 1: Choose an Epic**
- Review Breakpoint Map (Section 3) to see current milestone
- Select next epic from Section 4

**Step 2: Trigger Spec Generation**
```
/speckit specify "reference roadmap.md file for X.Y"
```
Replace `X.Y` with epic number (e.g., `1.0`, `2.1`, `4.2`)

**Step 3: Review Generated Spec**
- Ensure spec includes: Problem Statement, Requirements (FR/NFR), Acceptance Criteria, Privacy Impact
- Verify alignment with PRD and constitution
- Approve spec (PR review or self-review)

**Step 4: Implement**
- Follow spec-driven workflow (SPECIFY → PLAN → TASKS → IMPLEMENT)
- Reference spec in commit messages
- Complete Definition of Done checklist (constitution.md Section 6)

**Step 5: Mark Epic Complete**
- Check off all Exit Criteria
- Update Breakpoint Checklist (Section 7)
- Move to next epic

---

## 9. Timeline Estimate (4 Weeks Part-Time with Antigravity)

**Week 1: BP0 + BP1**
- Epic 1.0: Project Setup (0.5 days - Antigravity accelerated)
- Epic 1.1: RSS Parsing (1.5 days)
- Epic 1.2: Multi-Source (1.5 days)
- Epic 1.3: External Browser (0.5 days)

**Week 2: BP2**
- Epic 2.0: Preferences Storage (1 day)
- Epic 2.1: Ranking Algorithm (1.5 days)
- Epic 2.2: Onboarding (1.5 days)

**Week 3: BP3**
- Epic 3.0: IndexedDB Caching (1 day)
- Epic 3.1: Service Worker & Offline Mode (2 days)

**Week 4: BP4 + BP5**
- Epic 4.0: Error Reporting (0.5 days - optional, can skip)
- Epic 4.1: Settings Screen (1 day)
- Epic 4.2: UI Polish (1.5 days)
- Epic 5.0: Privacy Policy (0.5 days)
- Epic 5.1: Testing & Deployment (1.5 days)

**Post-MVP: BP6**
- Epic 6.0-6.3: Based on user feedback (1-2 weeks)

**Note:** Timeline is flexible. Antigravity accelerates development. Personal use priority, no hard deadline.

---

## 10. Success Criteria (MVP)

MVP is **complete** when all of these are true:

- [ ] All BP0-BP5 epics complete (1.0-5.1)
- [ ] PWA usable for daily news reading
- [ ] All non-negotiables met (privacy, performance, security)
- [ ] No critical errors in browser console
- [ ] Feed loads in < 2 seconds
- [ ] Personalization feels better than visiting individual sites
- [ ] PWA installable on mobile home screen
- [ ] Works offline (Service Worker active)
- [ ] Lighthouse score 90+ on all metrics
- [ ] Stable enough to share with 5-10 people
- [ ] Deployed to Antigravity hosting

**Post-MVP Success:**
- [ ] GitHub repo gets 50+ stars
- [ ] 1-2 external contributors
- [ ] Personal usage continues 6+ months
- [ ] Listed on privacy-focused directories

---

## 11. Risk Mitigation

| Risk | Epic(s) Affected | Mitigation |
|------|------------------|------------|
| RSS parsing time-consuming | 1.1, 1.2 | Use established library (Rome), budget 2-3 days |
| API rate limits | 1.2 | Primary reliance on RSS (unlimited), APIs optional |
| On-device ranking too simple | 2.1 | Start with rules-based, iterate based on usage |
| Crash reporting undermines privacy | 4.0 | Prominent opt-out, strict PII scrubbing, document in policy |
| Google Play rejection | 5.0, 5.1 | Clear attribution, no full-text scraping, review policies |
| Burnout | All | Realistic scope, 6-week timeline, open-source early |

---

## 12. Change Log

| Date | Version | Changes |
|------|---------|---------|
| 2025-12-30 | 1.0 | Initial roadmap created from PRD v3.0 and constitution v1.0 |

---

## 13. Quick Reference

**Current Breakpoint:** BP0 (starting)  
**Next Epic:** 1.0 (Project Setup)  
**Spec-Kit Command:**
```
/speckit specify "reference roadmap_PWA.md file for 1.0"
```

**Key Documents:**
- PRD: `PRD_PWA.md` (v4.0 - PWA Edition)
- Constitution: `constitution.md` (v1.0)
- Roadmap: `roadmap_PWA.md` (v2.0 - PWA Edition, this file)

**Development Tool:** Google Antigravity (DeepAgent)

**Non-Negotiables Reminder:**
- Privacy: All data local, no tracking
- Performance: < 1s startup, < 2s feed load
- Workflow: Spec before code
- Quality: Definition of Done checklist

---

**Last Words:**

> "Small epics, clear exit criteria, spec-driven execution."

This roadmap is designed to make EdgeReader development **predictable, traceable, and privacy-first**.

When starting work on an epic, always:
1. Read the epic details (Section 4)
2. Trigger spec generation with `/speckit specify`
3. Follow constitution workflow (SPECIFY → PLAN → TASKS → IMPLEMENT)
4. Check off Exit Criteria when done

**Ready to start?**
```
/speckit specify "reference roadmap.md file for 1.0"
```

---

**Document Version:** 2.0 (PWA Edition)  
**Maintained By:** Project maintainer (solo dev with Antigravity)  
**Next Review:** After BP2 completion  
**Previous Version:** 1.0 (Android native)
