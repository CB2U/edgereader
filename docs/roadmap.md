# EdgeReader Development Roadmap

**Version:** 1.0  
**Last Updated:** December 30, 2025  
**Status:** ACTIVE  
**Reference:** PRD.md v3.0, constitution.md v1.0

---

## 1. MVP Decisions (Locked)

These decisions are **frozen** for MVP and cannot be changed without constitution amendment:

| Decision | Rationale | Status |
|----------|-----------|--------|
| **Platform:** Android only | Solo dev, native performance, iOS post-MVP | ✅ LOCKED |
| **Tech Stack:** Kotlin + Jetpack Compose | Modern Android, Material Design 3, maintainable | ✅ LOCKED |
| **Data Sources:** RSS feeds (primary) + free-tier APIs (optional) | Zero cost, unlimited, privacy-friendly | ✅ LOCKED |
| **Browser:** External via Intent.ACTION_VIEW | Privacy-first, respects user's default browser | ✅ LOCKED |
| **Personalization:** On-device scoring algorithm | Zero tracking, local processing only | ✅ LOCKED |
| **Storage:** DataStore (prefs) + Room (articles) | Local-only, no cloud sync | ✅ LOCKED |
| **Crash Reporting:** Firebase Crashlytics with opt-out | Default enabled, user-controllable, PII scrubbed | ✅ LOCKED |
| **License:** GPL-3.0 | Prevents commercial exploitation, F-Droid friendly | ✅ LOCKED |
| **Timeline:** 6 weeks part-time | Personal use priority, no hard deadline | ✅ LOCKED |

**Out of Scope (MVP):**
- iOS version
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
- ✅ ALL user data stored locally (DataStore/Room only)
- ✅ ALL personalization on-device
- ✅ External browser only (no WebView)
- ✅ Zero analytics SDKs
- ✅ Crash reporting opt-out available
- ❌ NO user data transmitted to servers
- ❌ NO tracking SDKs or advertising IDs
- ❌ NO cloud storage

### Performance (Measurable)
- App startup: **< 1 second** (cold start, mid-range device)
- Feed load: **< 2 seconds** (4G, 50+ articles)
- UI: **60 FPS minimum** during scrolling
- Offline: Display last 100 cached articles
- APK size: **< 25 MB**

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

**Goal:** Initialize Android project with proper structure, dependencies, and open-source configuration.

**Scope:**
- ✅ In: GitHub repo, Android Studio project, package structure, GPL-3.0 license, README
- ❌ Out: CI/CD, automated testing setup (manual for MVP)

**Dependencies:** None (starting point)

**Exit Criteria:**
- [ ] GitHub repo created: `github.com/[username]/edgereader`
- [ ] Android Studio project initialized (Kotlin, Jetpack Compose, package: `dev.edgereader.app`)
- [ ] LICENSE file (GPL-3.0) and README.md present
- [ ] Project compiles without errors
- [ ] Basic package structure: `ui/`, `data/`, `util/`

**Targets:** AC-13 (GPL-3.0 license visible)

**Spec-Kit Trigger:**
```
/speckit specify "reference roadmap.md file for 1.0"
```

---

### Epic 1.1: RSS Feed Parsing Foundation

**Goal:** Implement RSS feed parsing for 3-5 test sources and display raw headlines in a list.

**Scope:**
- ✅ In: RSS parser library integration, fetch 3-5 feeds, parse XML, display in LazyColumn
- ❌ Out: Ranking, images, full UI polish, error handling (basic only)

**Dependencies:** 1.0 (project setup)

**Exit Criteria:**
- [ ] RSS parser library added (e.g., `Rome` or custom XML parser)
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
- [ ] 10-15 news sources configured (see PRD Section 10.2 for list)
- [ ] Articles fetched in parallel (coroutines)
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

**Goal:** Open articles in user's default browser when tapped (no in-app WebView).

**Scope:**
- ✅ In: Intent.ACTION_VIEW implementation, handle missing browser edge case
- ❌ Out: Chrome Custom Tabs, in-app WebView, link preview

**Dependencies:** 1.1 (articles displayed)

**Exit Criteria:**
- [ ] Tapping article opens URL in external browser
- [ ] Tested with Brave, Chrome, Firefox (respects default)
- [ ] Graceful error if no browser installed (Toast message)
- [ ] No in-app WebView or Custom Tabs used

**Targets:** FR-6, AC-4, NFR-1 (privacy)

**Spec-Kit Trigger:**
```
/speckit specify "reference roadmap.md file for 1.3"
```

---

### Epic 2.0: User Preferences Storage

**Goal:** Implement local storage for user preferences (topics, sources, keywords) using DataStore.

**Scope:**
- ✅ In: DataStore setup, preference data model, read/write operations
- ❌ Out: UI for editing preferences (Epic 2.2), cloud sync

**Dependencies:** 1.0 (project setup)

**Exit Criteria:**
- [ ] DataStore initialized
- [ ] UserPreferences data class defined (topics, sources, keywords)
- [ ] PreferencesManager class with read/write methods
- [ ] Preferences persist across app restarts
- [ ] No network calls when saving preferences (verified with network inspector)

**Targets:** FR-2, FR-3, AC-3, NFR-1 (privacy)

**Spec-Kit Trigger:**
```
/speckit specify "reference roadmap.md file for 2.0"
```

---

### Epic 2.1: On-Device Ranking Algorithm

**Goal:** Implement scoring algorithm to rank articles based on user preferences (topics, sources, keywords, recency).

**Scope:**
- ✅ In: Scoring function, topic matching, keyword matching, recency decay, unit tests
- ❌ Out: ML models, collaborative filtering, A/B testing

**Dependencies:** 2.0 (preferences storage), 1.2 (multi-source aggregation)

**Exit Criteria:**
- [ ] Scoring algorithm implemented (see PRD Section 10.3)
- [ ] Articles ranked by score (highest first)
- [ ] Unit tests for scoring logic (100% coverage)
- [ ] Ranking updates when preferences change
- [ ] All processing happens on-device (no network calls)

**Targets:** FR-4, AC-2, AC-6

**Spec-Kit Trigger:**
```
/speckit specify "reference roadmap.md file for 2.1"
```

---

### Epic 2.2: Onboarding Flow

**Goal:** Create first-launch onboarding to configure initial preferences (topics, sources).

**Scope:**
- ✅ In: Multi-screen onboarding, topic selection, source selection, save preferences
- ❌ Out: Tutorial overlays, video walkthroughs, skip option (must complete)

**Dependencies:** 2.0 (preferences storage), 2.1 (ranking algorithm)

**Exit Criteria:**
- [ ] Onboarding shown only on first launch
- [ ] User selects at least 3 topics or sources before proceeding
- [ ] Preferences saved to DataStore
- [ ] After onboarding, feed displays ranked articles
- [ ] Material Design 3 UI components used

**Targets:** FR-7, AC-5, NFR-5 (Material Design)

**Spec-Kit Trigger:**
```
/speckit specify "reference roadmap.md file for 2.2"
```

---

### Epic 3.0: Local Database (Room)

**Goal:** Set up Room database to cache articles for offline viewing and faster load times.

**Scope:**
- ✅ In: Room setup, Article entity, DAO, database migrations, cache last 100 articles
- ❌ Out: Full-text search (post-MVP), bookmarks (post-MVP)

**Dependencies:** 1.2 (multi-source aggregation)

**Exit Criteria:**
- [ ] Room database initialized
- [ ] Article entity defined (title, description, URL, source, publishDate, topic, imageUrl)
- [ ] ArticleDao with insert, query, delete operations
- [ ] Articles cached after fetch (last 100 articles)
- [ ] Database migration strategy in place

**Targets:** FR-10, AC-7

**Spec-Kit Trigger:**
```
/speckit specify "reference roadmap.md file for 3.0"
```

---

### Epic 3.1: Offline Mode & Pull-to-Refresh

**Goal:** Display cached articles when offline and implement pull-to-refresh for manual updates.

**Scope:**
- ✅ In: Offline detection, display cached articles, pull-to-refresh gesture, loading states
- ❌ Out: Background sync, push notifications

**Dependencies:** 3.0 (Room database)

**Exit Criteria:**
- [ ] When offline, app displays cached articles (last 100)
- [ ] Pull-to-refresh gesture implemented
- [ ] Loading indicator shown during refresh
- [ ] Error message if refresh fails (no internet)
- [ ] Feed refreshes on app launch (if online)

**Targets:** FR-9, FR-10, AC-7

**Spec-Kit Trigger:**
```
/speckit specify "reference roadmap.md file for 3.1"
```

---

### Epic 4.0: Crash Reporting with Opt-Out

**Goal:** Integrate Firebase Crashlytics with user-controllable opt-out and PII scrubbing.

**Scope:**
- ✅ In: Crashlytics setup, opt-out toggle, PII scrubbing, disable Firebase Analytics
- ❌ Out: Custom crash reporting backend, advanced error tracking

**Dependencies:** 2.0 (preferences storage for opt-out state)

**Exit Criteria:**
- [ ] Firebase Crashlytics integrated
- [ ] Firebase Analytics explicitly disabled
- [ ] Crash reporting respects user opt-out preference
- [ ] PII scrubbed from crash logs (no preferences, URLs, identifiers)
- [ ] Crash reports contain only: stack trace, device model, OS version, app version
- [ ] Tested: Opt-out prevents crash data transmission

**Targets:** FR-11, FR-12, AC-9, AC-10, NFR-2 (privacy)

**Spec-Kit Trigger:**
```
/speckit specify "reference roadmap.md file for 4.0"
```

---

### Epic 4.1: Settings Screen

**Goal:** Build settings screen for editing preferences and toggling crash reporting.

**Scope:**
- ✅ In: Settings UI, edit topics/sources/keywords, crash reporting toggle, Material Design 3
- ❌ Out: Advanced settings (theme, language), export/import preferences

**Dependencies:** 2.0 (preferences storage), 4.0 (crash reporting)

**Exit Criteria:**
- [ ] Settings screen accessible from main feed (toolbar icon)
- [ ] User can add/remove topics, sources, keywords
- [ ] Crash reporting toggle present with explanation
- [ ] Changes saved to DataStore
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
- ✅ In: Article cards, thumbnail images (Coil), publish timestamps, Material You theming
- ❌ Out: Animations, custom fonts, advanced theming

**Dependencies:** 1.2 (multi-source aggregation), 3.0 (Room for image URLs)

**Exit Criteria:**
- [ ] Articles displayed in Material Design 3 cards
- [ ] Thumbnail images loaded asynchronously (Coil library)
- [ ] Publish time shown (relative: "2 hours ago")
- [ ] Material You theming applied (dynamic colors)
- [ ] 60 FPS scrolling maintained
- [ ] Accessibility: content descriptions for images

**Targets:** FR-5, AC-12, NFR-5 (Material Design)

**Spec-Kit Trigger:**
```
/speckit specify "reference roadmap.md file for 4.2"
```

---

### Epic 5.0: Privacy Policy & Legal Compliance

**Goal:** Create privacy policy webpage and ensure Google Play compliance.

**Scope:**
- ✅ In: Privacy policy webpage (GitHub Pages), Google Play Data Safety form, source attribution
- ❌ Out: Terms of Service, GDPR compliance tooling (app doesn't collect data)

**Dependencies:** 4.0 (crash reporting finalized)

**Exit Criteria:**
- [ ] Privacy policy webpage published (e.g., GitHub Pages)
- [ ] Policy covers: data collection, crash reporting, network usage, third-party links
- [ ] Google Play Data Safety form filled (no data collected except crash reports)
- [ ] Source attribution visible in app (source name per article)
- [ ] Privacy policy URL added to app settings

**Targets:** NFR-6 (legal compliance), AC-11

**Spec-Kit Trigger:**
```
/speckit specify "reference roadmap.md file for 5.0"
```

---

### Epic 5.1: Testing & Release Preparation

**Goal:** Comprehensive testing, performance validation, and Play Store asset creation.

**Scope:**
- ✅ In: Manual testing (2+ devices), performance testing, screenshots, store description, ProGuard
- ❌ Out: Automated UI tests (nice-to-have), beta testing program (open testing only)

**Dependencies:** All previous epics (1.0-4.2)

**Exit Criteria:**
- [ ] Tested on Android 8.0 (API 26) and Android 14+
- [ ] Tested on mid-range and low-end devices
- [ ] Performance thresholds met: < 1s startup, < 2s feed load, 60 FPS
- [ ] Offline mode tested (airplane mode)
- [ ] Crash reporting opt-out tested
- [ ] APK size < 25 MB
- [ ] ProGuard rules verified (no crashes in release build)
- [ ] Screenshots created (at least 2, ideally 8)
- [ ] Store description written (emphasizes privacy)
- [ ] Google Play pre-launch report reviewed

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
- ✅ In: Material Design 3 dark theme, system setting detection
- ❌ Out: Custom theme editor, AMOLED black theme

**Dependencies:** MVP complete

**Exit Criteria:**
- [ ] Dark mode follows system setting
- [ ] All screens support dark theme
- [ ] Material You dynamic colors work in dark mode

**Targets:** User Story #9 (P1)

**Spec-Kit Trigger:**
```
/speckit specify "reference roadmap.md file for 6.0"
```

---

### Epic 6.1: Bookmarks / Save for Later

**Goal:** Allow users to bookmark articles for later reading (stored locally).

**Scope:**
- ✅ In: Bookmark button, local storage (Room), bookmarks screen
- ❌ Out: Cloud sync, tags, folders

**Dependencies:** MVP complete, 3.0 (Room database)

**Exit Criteria:**
- [ ] Bookmark icon on article cards
- [ ] Bookmarked articles stored in Room
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

**Dependencies:** MVP complete, 3.0 (Room database)

**Exit Criteria:**
- [ ] Search bar in toolbar
- [ ] Filter articles by title/description match
- [ ] Results update as user types
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

## 9. Timeline Estimate (6 Weeks Part-Time)

**Week 1: BP0 + BP1**
- Epic 1.0: Project Setup (1 day)
- Epic 1.1: RSS Parsing (2 days)
- Epic 1.2: Multi-Source (2 days)
- Epic 1.3: External Browser (0.5 days)

**Week 2-3: BP2**
- Epic 2.0: Preferences Storage (1 day)
- Epic 2.1: Ranking Algorithm (2 days)
- Epic 2.2: Onboarding (2 days)

**Week 3-4: BP3**
- Epic 3.0: Room Database (2 days)
- Epic 3.1: Offline Mode (1 day)

**Week 4-5: BP4**
- Epic 4.0: Crash Reporting (1 day)
- Epic 4.1: Settings Screen (2 days)
- Epic 4.2: UI Polish (2 days)

**Week 5-6: BP5**
- Epic 5.0: Privacy Policy (1 day)
- Epic 5.1: Testing & Release Prep (3 days)

**Post-MVP: BP6**
- Epic 6.0-6.3: Based on user feedback (2-4 weeks)

**Note:** Timeline is flexible. Personal use priority, no hard deadline.

---

## 10. Success Criteria (MVP)

MVP is **complete** when all of these are true:

- [ ] All BP0-BP5 epics complete (1.0-5.1)
- [ ] App usable for daily news reading
- [ ] All non-negotiables met (privacy, performance, security)
- [ ] Crashes less than once per week
- [ ] Feed loads in < 2 seconds
- [ ] Personalization feels better than visiting individual sites
- [ ] Stable enough to share with 5-10 people
- [ ] Submitted to Google Play open testing

**Post-MVP Success:**
- [ ] GitHub repo gets 50+ stars
- [ ] 1-2 external contributors
- [ ] Personal usage continues 6+ months
- [ ] Approved on F-Droid

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
/speckit specify "reference roadmap.md file for 1.0"
```

**Key Documents:**
- PRD: `PRD.md` (v3.0)
- Constitution: `constitution.md` (v1.0)
- Roadmap: `roadmap.md` (v1.0, this file)

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

**Document Version:** 1.0  
**Maintained By:** Project maintainer (solo dev)  
**Next Review:** After BP2 completion
