# PRD.md: EdgeReader

## 1. Summary

**EdgeReader** is a privacy-focused news aggregator for Android (iOS future roadmap) that delivers personalized news feeds without tracking or data collection. All personalization happens on-device using explicit user preferences (topics, sources, keywords). Articles open in the user's default browser to leverage external privacy and ad-blocking features.

**Project name:** EdgeReader  
**Package name:** `dev.edgereader.app`  
**Target platforms:** Android (MVP), iOS (post-MVP)  
**Core differentiation:** Zero tracking, on-device personalization, edge computing principles  
**Primary competitor reference:** Google News (UX/layout inspiration only)  
**Open source:** Yes (GPL-3.0 license)  
**Tagline:** "News aggregation at the edge. Your content, your device, zero tracking."

---

## 2. Problem Statement

Existing news aggregator apps (Google News, Apple News, Flipboard) collect extensive user data for personalization, creating privacy concerns. Users seeking privacy-respecting alternatives must sacrifice personalized content curation or use fragmented solutions (individual RSS readers, browser bookmarks). There is no mainstream mobile news app that combines:
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

**MVP (P0) - Android Only:**
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
10. As a user, I want an iOS version of the app so I can use it on my iPad/iPhone.
11. As a user, I want lightweight on-device ML recommendations so the app learns what I like without sending data off-device.

---

## 5. Requirements

### 5.1 Functional Requirements

**FR-1:** Aggregate headlines and metadata (title, description, image, source, publish date, URL) from at least 10 news sources using free-tier APIs and RSS feeds.

**FR-2:** Support explicit user preference selection:
- Topics/categories (e.g., Technology, Politics, Sports, Science)
- Individual sources (enable/disable per source)
- Keywords or search terms for boosting/filtering

**FR-3:** Store all user preferences locally on-device (no cloud sync, no server-side storage).

**FR-4:** Implement on-device ranking algorithm that scores articles based on user preferences (topic match, source priority, keyword presence, recency).

**FR-5:** Display ranked feed of articles in a scrollable list/card layout, showing:
- Headline
- Source name and publish time
- Thumbnail image (if available)
- Brief description/snippet

**FR-6:** When user taps an article, open the article URL in the device's default external browser (not in-app WebView).

**FR-7:** Provide onboarding flow to configure initial preferences (topics, sources) on first launch.

**FR-8:** Allow users to edit preferences from settings screen at any time.

**FR-9:** Refresh feed on user pull-to-refresh or app launch (fetch latest articles from sources).

**FR-10:** Cache articles locally for offline viewing of previously loaded headlines (text/metadata only, not full article content).

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

**NFR-5 (UX):** UI should follow Material Design 3 guidelines for familiarity and modern Android aesthetics.

**NFR-6 (Legal/Compliance):** Comply with Google Play policies, including:
- Accurate privacy policy and data safety declarations
- Proper attribution of news sources
- No copyright violations (link to sources, don't scrape full text)

**NFR-7 (Maintainability):** Codebase should support solo developer maintenance; prioritize simplicity and readability over advanced architecture.

**NFR-8 (Scalability):** Design should allow adding new news sources via configuration (not hardcoded) for easy expansion.

**NFR-9 (Open Source):** Code must be hosted on GitHub with GPL-3.0 license to prevent commercial exploitation while allowing community contributions.

---

## 6. Acceptance Criteria

**AC-1 (FR-1, FR-9):** Given the app is launched, when the user pulls to refresh, then at least 50 unique articles from 10+ sources are fetched and displayed within 3 seconds.

**AC-2 (FR-2, FR-4):** Given the user selects "Technology" and "Science" topics in preferences, when the feed is displayed, then articles tagged with these topics appear higher in the list than other topics.

**AC-3 (FR-3, NFR-1):** Given the user has set preferences, when network traffic is inspected, then no user preference data is transmitted to any server.

**AC-4 (FR-6):** Given an article is displayed, when the user taps it, then the article URL opens in the device's default browser (verified by testing with Brave, Chrome, Firefox).

**AC-5 (FR-7):** Given the app is installed and launched for the first time, when the user completes onboarding, then at least 3 topics or sources must be selected before proceeding to the main feed.

**AC-6 (FR-8):** Given the user is on the settings screen, when they add a new keyword preference and return to the feed, then articles matching that keyword are ranked higher within 5 seconds.

**AC-7 (FR-10):** Given the user has previously loaded the feed, when the device is offline, then cached article headlines and metadata are still displayed (at least last 100 articles).

**AC-8 (NFR-3, NFR-4):** Given the app is tested on a mid-range Android device, when launched, then startup time is under 1 second and feed loads within 2 seconds on 4G.

**AC-9 (FR-11, FR-12):** Given the user opens settings, when they toggle crash reporting off, then no crash data is sent to any server even if a crash occurs.

**AC-10 (FR-11, FR-12):** Given crash reporting is enabled and a crash occurs, when crash logs are inspected, then they contain no user preferences, article URLs, or any identifiable information beyond device model, OS version, and stack trace.

**AC-11 (NFR-6):** Given the app is submitted to Google Play, when reviewed, then it passes all privacy and content policy checks.

**AC-12 (FR-5, NFR-5):** Given the feed is displayed, when evaluated against Material Design 3 guidelines, then it uses modern components (Material You theming, elevation, typography).

**AC-13 (NFR-9):** Given the code is published on GitHub, when a third party views the repository, then the GPL-3.0 license is clearly stated in LICENSE file and README.

---

## 7. MVP Scope

### In-Scope (MVP - Android Only)
- Native Android app (Kotlin + Jetpack Compose recommended)
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

### Out-of-Scope (MVP)
- iOS version (post-MVP, P2 priority)
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

### 10.1 Tech Stack (Solo Android Development)

**Recommended: Native Android (Kotlin + Jetpack Compose)**

**Rationale:**
- **Solo Android development:** No need for cross-platform overhead since iOS is out of scope
- **Best performance:** Native code, no JavaScript bridge or Flutter rendering layer
- **Modern toolkit:** Jetpack Compose provides declarative UI (similar to Flutter/React) with Material Design 3 built-in
- **Ecosystem maturity:** Direct access to Android APIs, better debugging, extensive documentation
- **Future-proofing:** Easier to maintain long-term as a solo developer; Google's recommended approach for new Android apps
- **Open-source community:** Large Kotlin/Android community on GitHub for reference projects

**Key libraries:**
- **Retrofit** + **OkHttp**: HTTP networking with caching support
- **kotlinx.serialization** or **Moshi**: JSON parsing
- **Room**: Local SQLite database for article caching
- **DataStore**: Modern replacement for SharedPreferences (user preferences)
- **Coil**: Image loading and caching
- **Rome/rssparser**: RSS feed parsing (or custom XML parser)
- **Firebase Crashlytics** (with analytics disabled) or **Sentry Android SDK**: Crash reporting

**Package naming convention:**
```kotlin
// Primary package
dev.edgereader.app

// Sub-packages
dev.edgereader.app.ui
dev.edgereader.app.data
dev.edgereader.app.util
```

**Alternative (if you prefer cross-platform skills):**
- **Flutter**: Still viable if you want to learn Flutter or plan iOS version soon. But for solo Android-first project, native Kotlin is more straightforward.

---

### 10.2 News APIs and Data Sources

**Primary Strategy: RSS Feeds (Free, Unlimited)**

Use RSS as the main data source to avoid API costs and rate limits:

**Curated RSS Feed List (10-15 sources to start):**

```kotlin
// Example feed configuration (store in local JSON or hardcoded)
val DEFAULT_FEEDS = listOf(
    Feed("Reuters World", "https://feeds.reuters.com/reuters/worldNews", "General"),
    Feed("Reuters Tech", "https://feeds.reuters.com/reuters/technologyNews", "Technology"),
    Feed("BBC News", "https://feeds.bbci.co.uk/news/rss.xml", "General"),
    Feed("TechCrunch", "https://techcrunch.com/feed/", "Technology"),
    Feed("Ars Technica", "https://feeds.arstechnica.com/arstechnica/index", "Technology"),
    Feed("The Verge", "https://www.theverge.com/rss/index.xml", "Technology"),
    Feed("Hacker News", "https://news.ycombinator.com/rss", "Technology"),
    Feed("ScienceDaily", "https://www.sciencedaily.com/rss/all.xml", "Science"),
    Feed("Phys.org", "https://phys.org/rss-feed/", "Science"),
    Feed("NPR News", "https://feeds.npr.org/1001/rss.xml", "General"),
    Feed("The Guardian World", "https://www.theguardian.com/world/rss", "General"),
    Feed("Wired", "https://www.wired.com/feed/rss", "Technology"),
    Feed("MIT Technology Review", "https://www.technologyreview.com/feed/", "Technology"),
    Feed("Engadget", "https://www.engadget.com/rss.xml", "Technology"),
    Feed("Nature News", "https://www.nature.com/nature.rss", "Science")
)
```

**Secondary: Free-Tier News APIs (Optional, for diversity)**

1. **NewsAPI.org** (100 requests/day free)
   - Use sparingly for broad topic queries
   - Example: Fetch "top headlines" once per day as supplement
   
2. **GNews API** (100 requests/day free)
   - Backup for when RSS feeds are down
   - Geographic diversity (international news)

**User-Provided Feeds (Post-MVP):**
- Allow users to add custom RSS URLs in settings
- Validate feed format before saving

**Implementation Notes:**
- **Caching:** Store fetched articles in Room database with timestamp; refresh every 30 minutes
- **Parsing:** Use `Rome` library for robust RSS/Atom parsing
- **Error handling:** If a feed fails, log error but don't block other feeds
- **Topic tagging:** Map feed to default topic (e.g., TechCrunch → Technology), allow user override

---

### 10.3 On-Device Personalization (Kotlin Implementation)

**Algorithm Overview:**

```kotlin
data class Article(
    val title: String,
    val description: String,
    val url: String,
    val source: String,
    val publishDate: Long, // Unix timestamp
    val topic: String, // Technology, Science, General, etc.
    val imageUrl: String? = null
)

data class UserPreferences(
    val selectedTopics: Set<String> = setOf(),
    val enabledSources: Set<String> = setOf(),
    val disabledSources: Set<String> = setOf(),
    val keywords: Set<String> = setOf()
)

fun scoreArticle(article: Article, prefs: UserPreferences): Double {
    var score = 0.0
    
    // 1. Recency bonus (decay over 24 hours)
    val hoursAgo = (System.currentTimeMillis() - article.publishDate) / (1000 * 60 * 60)
    score += maxOf(0.0, 100.0 - hoursAgo)
    
    // 2. Topic match (strong signal)
    if (article.topic in prefs.selectedTopics) {
        score += 50.0
    }
    
    // 3. Source filtering and priority
    when {
        article.source in prefs.disabledSources -> score -= 1000.0 // Effectively hide
        article.source in prefs.enabledSources -> score += 30.0
    }
    
    // 4. Keyword matching (title and description)
    val textToSearch = "${article.title} ${article.description}".lowercase()
    prefs.keywords.forEach { keyword ->
        if (keyword.lowercase() in textToSearch) {
            score += 20.0
        }
    }
    
    return score
}

// Usage in ViewModel or Repository
fun getRankedArticles(articles: List<Article>, prefs: UserPreferences): List<Article> {
    return articles
        .filter { scoreArticle(it, prefs) > -500 } // Remove heavily downscored articles
        .sortedByDescending { scoreArticle(it, prefs) }
}
```

**Storage (DataStore Preferences):**

```kotlin
// PreferencesManager.kt
class PreferencesManager(private val context: Context) {
    private val dataStore = context.dataStore
    
    val userPreferences: Flow<UserPreferences> = dataStore.data.map { prefs ->
        UserPreferences(
            selectedTopics = prefs[TOPICS_KEY]?.split(",")?.toSet() ?: setOf(),
            keywords = prefs[KEYWORDS_KEY]?.split(",")?.toSet() ?: setOf(),
            enabledSources = prefs[ENABLED_SOURCES_KEY]?.split(",")?.toSet() ?: setOf(),
            disabledSources = prefs[DISABLED_SOURCES_KEY]?.split(",")?.toSet() ?: setOf()
        )
    }
    
    suspend fun updateTopics(topics: Set<String>) {
        dataStore.edit { prefs ->
            prefs[TOPICS_KEY] = topics.joinToString(",")
        }
    }
    
    // Similar methods for keywords, sources...
    
    companion object {
        private val TOPICS_KEY = stringPreferencesKey("selected_topics")
        private val KEYWORDS_KEY = stringPreferencesKey("keywords")
        private val ENABLED_SOURCES_KEY = stringPreferencesKey("enabled_sources")
        private val DISABLED_SOURCES_KEY = stringPreferencesKey("disabled_sources")
    }
}
```

---

### 10.4 Opening Links in External Browser (Kotlin)

```kotlin
// In your Composable or Activity
fun openArticleInBrowser(context: Context, url: String) {
    try {
        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url)).apply {
            // Force external browser (not Chrome Custom Tabs)
            addCategory(Intent.CATEGORY_BROWSABLE)
            flags = Intent.FLAG_ACTIVITY_NEW_TASK
        }
        context.startActivity(intent)
    } catch (e: ActivityNotFoundException) {
        // Handle error: no browser installed (rare)
        Toast.makeText(context, "No browser found", Toast.LENGTH_SHORT).show()
    }
}

// Usage in Compose UI
@Composable
fun ArticleCard(article: Article, onClick: (String) -> Unit) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick(article.url) }
    ) {
        // Card content: title, source, image, etc.
    }
}

// In parent composable
ArticleCard(article = article) { url ->
    openArticleInBrowser(context, url)
}
```

**Why not Chrome Custom Tabs?**
- Custom Tabs provide in-app browser experience (faster, warmer start)
- **But:** They may track navigation (depending on user's Chrome settings)
- **For privacy app:** Better to use `Intent.ACTION_VIEW` to respect user's default browser choice (Brave, Firefox Focus, etc.)
- **Tradeoff:** Slightly slower load time, but stronger privacy guarantee

---

### 10.5 Crash Reporting Implementation

**Option 1: Firebase Crashlytics (Simplest)**

```kotlin
// build.gradle.kts
dependencies {
    implementation("com.google.firebase:firebase-crashlytics-ktx:18.6.0")
    implementation("com.google.firebase:firebase-analytics-ktx:21.5.0") // Required but disable
}

// In Application class or MainActivity
class EdgeReaderApp : Application() {
    override fun onCreate() {
        super.onCreate()
        
        // Read crash reporting preference
        val prefsManager = PreferencesManager(this)
        runBlocking {
            prefsManager.isCrashReportingEnabled().first().let { enabled ->
                FirebaseCrashlytics.getInstance().setCrashlyticsCollectionEnabled(enabled)
            }
        }
        
        // Disable Firebase Analytics entirely
        Firebase.analytics.setAnalyticsCollectionEnabled(false)
    }
}

// In settings screen, allow user to toggle
@Composable
fun SettingsScreen(prefsManager: PreferencesManager) {
    val crashReportingEnabled by prefsManager.isCrashReportingEnabled()
        .collectAsState(initial = true)
    
    SwitchPreference(
        title = "Anonymous Crash Reporting",
        summary = "Helps improve EdgeReader stability. No personal data collected.",
        checked = crashReportingEnabled,
        onCheckedChange = { enabled ->
            scope.launch {
                prefsManager.setCrashReportingEnabled(enabled)
                FirebaseCrashlytics.getInstance().setCrashlyticsCollectionEnabled(enabled)
            }
        }
    )
}
```

**Option 2: Sentry (More privacy-focused)**

```kotlin
// build.gradle.kts
dependencies {
    implementation("io.sentry:sentry-android:6.34.0")
}

// In Application class
SentryAndroid.init(this) { options ->
    options.dsn = "your-sentry-dsn" // From Sentry dashboard
    
    // Scrub PII
    options.beforeSend = SentryOptions.BeforeSendCallback { event, hint ->
        // Remove user preferences, URLs, etc. from crash logs
        event.contexts.remove("user_preferences")
        event.breadcrumbs.clear() // Remove navigation history
        event
    }
    
    // Respect user preference
    val enabled = prefsManager.isCrashReportingEnabled().first()
    options.isEnabled = enabled
}
```

**Recommendation:**
- **Firebase Crashlytics** for MVP: Free, easy setup, good stack traces
- **Critical:** Disable Firebase Analytics completely, expose opt-out toggle prominently
- **Post-MVP:** Consider self-hosted Sentry if community feedback suggests Firebase is unacceptable

---

### 10.6 Architecture Overview

**Pattern: MVVM with Repository**

```
dev.edgereader.app/
├── ui/ (Composables)
│   ├── feed/
│   │   ├── FeedScreen.kt
│   │   └── FeedViewModel.kt
│   ├── settings/
│   │   ├── SettingsScreen.kt
│   │   └── SettingsViewModel.kt
│   └── onboarding/
│       └── OnboardingScreen.kt
├── data/
│   ├── repository/
│   │   └── NewsRepository.kt (coordinates RSS + API fetching)
│   ├── local/
│   │   ├── AppDatabase.kt (Room)
│   │   └── ArticleDao.kt
│   ├── remote/
│   │   ├── RssFeedParser.kt
│   │   └── NewsApiClient.kt (optional)
│   └── model/
│       ├── Article.kt
│       └── UserPreferences.kt
└── util/
    ├── PreferencesManager.kt (DataStore)
    └── RankingAlgorithm.kt
```

**Key Principles:**
- Keep ViewModels thin (delegate to repository)
- Use Kotlin coroutines and Flow for async operations
- Write unit tests for ranking algorithm
- Skip complex DI frameworks for MVP

---

### 10.7 Open Source License

**Recommended: GPL-3.0**

**Rationale:**
- **Prevents commercial forks:** Derivatives must also be GPL-3.0 (copyleft)
- **Allows personal monetization:** You can dual-license later
- **Community acceptance:** F-Droid and privacy communities prefer GPL

**Implementation:**
1. Add `LICENSE` file with GPL-3.0 text
2. Add license header to source files
3. Mention in README: "Licensed under GPL-3.0"

---

## 11. Privacy Policy Requirements

Host a simple webpage (GitHub Pages, Netlify) with:

**Required sections:**
1. **Data Collection:** "EdgeReader does not collect, store, or transmit any personal information or user behavior data."
2. **Crash Reporting:** "If enabled, anonymous crash reports contain only: device model, OS version, app version, stack trace. Opt-out available in Settings."
3. **Network Usage:** "Fetches news from public RSS feeds. No user identifiers sent."
4. **Third-Party Links:** "Articles open in your browser. We don't track browsing."
5. **Data Retention:** "All data stored locally. Delete by clearing app data."

**Example URL:**
- `https://yourusername.github.io/edgereader/privacy-policy.html`

---

## 12. Google Play Submission Checklist

**Pre-submission:**
- [ ] Test on 2+ devices/emulators
- [ ] Verify crash reporting opt-out works
- [ ] Create privacy policy webpage
- [ ] Prepare screenshots (at least 2, ideally 8)
- [ ] Write store description emphasizing privacy and edge computing
- [ ] Fill Data Safety form (select "No data collected" except crash reports)
- [ ] Test with Google Play pre-launch report

---

## 13. Next Steps (6-Week Roadmap)

### Week 1: Project Setup
1. Create GitHub repo: `github.com/yourusername/edgereader`
2. Initialize Android Studio (Kotlin + Compose, package: `dev.edgereader.app`)
3. Set up RSS parsing (test 3-5 feeds)
4. Build basic feed display

### Week 2-3: Preferences and Ranking
5. Implement DataStore for preferences
6. Build onboarding flow
7. Implement ranking algorithm
8. Build settings screen

### Week 4: Browser and Caching
9. Add external browser integration
10. Set up Room database
11. Add loading states and error handling

### Week 5: Crash Reporting and Polish
12. Integrate Crashlytics
13. UI polish (images, dates, cards)
14. Performance testing

### Week 6: Play Store Prep
15. Create privacy policy
16. Prepare store assets
17. Testing with friends
18. Submit to open testing

---

## 14. Success Metrics (Personal Use)

**MVP success:**
- [ ] App usable for daily news reading
- [ ] Crashes less than once per week
- [ ] Feed loads in under 2 seconds
- [ ] Personalization feels better than individual sites
- [ ] Stable enough to share with 5-10 people

**Post-MVP:**
- [ ] GitHub repo gets 50+ stars
- [ ] 1-2 external contributors
- [ ] Personal usage continues 6+ months
- [ ] Approved on F-Droid

---

## 15. Glossary

- **Edge computing:** Computing performed at or near the source of data (on-device)
- **On-device processing:** Computation occurs locally; no data sent to servers
- **External browser:** Default browser app (Chrome, Brave, Firefox); not in-app WebView
- **RSS feed:** Standardized web feed format for site updates
- **GPL-3.0:** Copyleft license requiring derivatives to be open-source
- **Material Design 3:** Google's latest Android design system
- **DataStore:** Modern Android key-value storage
- **Jetpack Compose:** Android's declarative UI toolkit

---

**Document Version:** 3.0  
**Last Updated:** December 30, 2025  
**Status:** Ready for development  
**Next Review:** After MVP completion (~6 weeks)