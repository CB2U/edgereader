# EdgeReader Architecture Decision Records (ADR)

**Version:** 1.0  
**Last Updated:** December 30, 2025  
**Purpose:** Document key architectural and technical decisions

---

## How to Use This Document

1. **Before making a decision:** Check if similar decision already exists
2. **When making a decision:** Add new entry with date, decision, rationale, alternatives, consequences
3. **Keep entries short:** 1-2 paragraphs max per section
4. **Reference PRD/constitution:** Link to relevant sections

---

## ADR Format

Each entry follows this structure:

```markdown
## ADR-NNN: [Decision Title]
**Date:** YYYY-MM-DD  
**Status:** Accepted / Superseded / Deprecated  
**Deciders:** [Name(s)]  
**Related:** [PRD Section / Epic / Constitution Section]

### Decision
[What was decided?]

### Rationale
[Why was this decision made?]

### Alternatives Considered
1. [Alternative 1] - [Why rejected]
2. [Alternative 2] - [Why rejected]

### Consequences
- **Positive:** [Benefits]
- **Negative:** [Drawbacks or tradeoffs]
- **Neutral:** [Other impacts]
```

---

## Decisions

### ADR-001: Native Android (Kotlin + Jetpack Compose)
**Date:** 2025-12-30  
**Status:** Accepted  
**Deciders:** Project maintainer  
**Related:** PRD Section 10.1, Roadmap Section 1 (MVP Decisions)

#### Decision
Use native Android development with Kotlin and Jetpack Compose for MVP. Defer iOS to post-MVP.

#### Rationale
- **Solo developer:** No need for cross-platform overhead
- **Best performance:** Native code, no JavaScript bridge or Flutter rendering layer
- **Modern toolkit:** Jetpack Compose provides declarative UI with Material Design 3 built-in
- **Ecosystem maturity:** Direct access to Android APIs, better debugging, extensive documentation
- **Maintainability:** Easier to maintain long-term as solo developer

#### Alternatives Considered
1. **Flutter** - Rejected: Cross-platform benefits not needed for Android-first MVP. Would add learning curve and complexity.
2. **React Native** - Rejected: JavaScript bridge adds performance overhead. Privacy concerns with third-party dependencies.
3. **Kotlin Multiplatform** - Rejected: Overkill for MVP. iOS is post-MVP, no need for shared code yet.

#### Consequences
- **Positive:** Best performance, native feel, easier debugging, large community support
- **Negative:** iOS version will require separate codebase (acceptable for post-MVP)
- **Neutral:** Kotlin learning curve (minimal if already familiar with Java)

---

### ADR-002: RSS Feeds as Primary Data Source
**Date:** 2025-12-30  
**Status:** Accepted  
**Deciders:** Project maintainer  
**Related:** PRD Section 10.2, Epic 1.1, Epic 1.2

#### Decision
Use RSS feeds as primary data source for news aggregation. Use free-tier APIs (NewsAPI, GNews) only as optional supplement.

#### Rationale
- **Zero cost:** RSS feeds are free and unlimited
- **Privacy-friendly:** No API keys or user tracking required
- **Reliability:** RSS is standardized (RSS 2.0, Atom) and widely supported
- **Diversity:** 10-15 high-quality sources available via RSS (Reuters, BBC, TechCrunch, etc.)

#### Alternatives Considered
1. **NewsAPI as primary** - Rejected: 100 requests/day limit too restrictive. Costs $449/month for unlimited.
2. **Web scraping** - Rejected: Legal risks, fragile (breaks when sites change), violates Google Play policies.
3. **Paid news APIs** - Rejected: Budget constraint for MVP. Can add later if needed.

#### Consequences
- **Positive:** Zero cost, unlimited requests, privacy-friendly, reliable
- **Negative:** Limited to sources that provide RSS feeds. No advanced filtering (e.g., by location, language).
- **Neutral:** Need to implement RSS parser (use Rome library, ~1 day effort)

---

### ADR-003: External Browser (Intent.ACTION_VIEW)
**Date:** 2025-12-30  
**Status:** Accepted  
**Deciders:** Project maintainer  
**Related:** PRD Section 10.4, Constitution Section 2.1, Epic 1.3

#### Decision
Open articles in user's default external browser using `Intent.ACTION_VIEW`. Do not use in-app WebView or Chrome Custom Tabs.

#### Rationale
- **Privacy-first:** Respects user's default browser choice (Brave, Firefox Focus, DuckDuckGo)
- **No tracking:** In-app WebView or Custom Tabs may track navigation depending on browser settings
- **Simplicity:** No need to implement in-app reader, handle cookies, or manage WebView lifecycle
- **User control:** User can use their existing privacy protections (ad blockers, tracking protection)

#### Alternatives Considered
1. **Chrome Custom Tabs** - Rejected: Faster load time but may track navigation. Privacy risk for privacy-focused app.
2. **In-app WebView** - Rejected: Requires implementing reader UI, cookie management, privacy controls. Adds complexity and APK size.
3. **In-app reader (parse article content)** - Rejected: Legal risks (copyright), fragile (breaks when sites change), violates Google Play policies.

#### Consequences
- **Positive:** Strong privacy guarantee, respects user choice, simple implementation
- **Negative:** Slightly slower load time (cold start of external browser). User leaves app to read article.
- **Neutral:** No in-app reading experience (acceptable tradeoff for privacy)

---

### ADR-004: DataStore for User Preferences
**Date:** 2025-12-30  
**Status:** Accepted  
**Deciders:** Project maintainer  
**Related:** PRD Section 10.3, Constitution Section 2.1, Epic 2.0

#### Decision
Use Jetpack DataStore (Preferences DataStore) for storing user preferences (topics, sources, keywords). Do not use SharedPreferences or cloud storage.

#### Rationale
- **Modern API:** DataStore is Google's recommended replacement for SharedPreferences
- **Type-safe:** Kotlin Flows provide type-safe, reactive access to preferences
- **Local-only:** No cloud sync, aligns with privacy-first principle
- **Coroutine support:** Async read/write operations, no blocking on main thread

#### Alternatives Considered
1. **SharedPreferences** - Rejected: Legacy API, synchronous (blocks main thread), no Flow support.
2. **Room database** - Rejected: Overkill for simple key-value storage. Room is for structured data (articles).
3. **Firebase Remote Config** - Rejected: Requires cloud storage, violates privacy principle.

#### Consequences
- **Positive:** Modern API, type-safe, async, local-only
- **Negative:** No cloud sync (acceptable for MVP, user must reconfigure on new device)
- **Neutral:** Requires migration if user upgrades from SharedPreferences (not applicable for new app)

---

### ADR-005: Room Database for Article Caching
**Date:** 2025-12-30  
**Status:** Accepted  
**Deciders:** Project maintainer  
**Related:** PRD Section 10.6, Epic 3.0

#### Decision
Use Room (SQLite wrapper) for caching articles locally. Cache last 100 articles for offline viewing.

#### Rationale
- **Offline support:** Users can view cached articles when offline
- **Performance:** Faster feed load (display cached articles immediately, fetch new in background)
- **Jetpack integration:** Room is part of Jetpack, well-documented, type-safe
- **Migration support:** Room handles database schema migrations automatically

#### Alternatives Considered
1. **Raw SQLite** - Rejected: More boilerplate, no type safety, manual migration handling.
2. **Realm** - Rejected: Third-party dependency, larger APK size, less community support than Room.
3. **In-memory cache only** - Rejected: No offline support, articles lost on app restart.

#### Consequences
- **Positive:** Offline support, faster load times, type-safe, migration support
- **Negative:** Adds ~500 KB to APK size. Requires database migration strategy.
- **Neutral:** Need to implement cache eviction (keep last 100 articles, delete older)

---

### ADR-006: Firebase Crashlytics with Opt-Out
**Date:** 2025-12-30  
**Status:** Accepted  
**Deciders:** Project maintainer  
**Related:** PRD Section 10.5, Constitution Section 2.1, Epic 4.0

#### Decision
Use Firebase Crashlytics for crash reporting with user-controllable opt-out. Default state: enabled. Explicitly disable Firebase Analytics.

#### Rationale
- **Free and reliable:** Firebase Crashlytics is free, well-maintained, good stack traces
- **User control:** Opt-out toggle in settings respects user privacy
- **PII scrubbing:** Can configure to strip user preferences, URLs, identifiers
- **Easy setup:** Single dependency, minimal configuration

#### Alternatives Considered
1. **Sentry** - Considered: More privacy-focused, self-hosted option available. Rejected for MVP due to setup complexity.
2. **No crash reporting** - Rejected: Need crash data to fix bugs, especially for solo developer.
3. **Custom crash reporting** - Rejected: Too much effort to build and maintain.

#### Consequences
- **Positive:** Free, reliable, easy setup, user-controllable
- **Negative:** Requires Firebase dependency (~1 MB APK size). Some users may distrust Firebase/Google.
- **Neutral:** Must explicitly disable Firebase Analytics to avoid privacy violations. Document in privacy policy.

**Note:** Post-MVP, consider migrating to self-hosted Sentry if community feedback suggests Firebase is unacceptable.

---

### ADR-007: GPL-3.0 License
**Date:** 2025-12-30  
**Status:** Accepted  
**Deciders:** Project maintainer  
**Related:** PRD Section 10.7, Constitution Section 2.5, Epic 1.0

#### Decision
License EdgeReader under GPL-3.0 (copyleft). Publish on GitHub and F-Droid.

#### Rationale
- **Prevents commercial exploitation:** Derivatives must also be GPL-3.0 (copyleft)
- **Community acceptance:** F-Droid and privacy communities prefer copyleft licenses
- **Allows personal monetization:** Can dual-license later if needed
- **Transparency:** Source code must be available, aligns with privacy-first principle

#### Alternatives Considered
1. **MIT License** - Rejected: Permissive license allows commercial forks without giving back to community.
2. **Apache 2.0** - Rejected: Similar to MIT, allows commercial use without copyleft.
3. **AGPL-3.0** - Rejected: Too restrictive (requires source disclosure for network use). GPL-3.0 is sufficient.

#### Consequences
- **Positive:** Prevents commercial exploitation, encourages community contributions, F-Droid friendly
- **Negative:** May scare away some contributors who prefer permissive licenses
- **Neutral:** Can dual-license later if needed (e.g., paid enterprise version)

---

### ADR-008: MVVM Architecture Pattern
**Date:** 2025-12-30  
**Status:** Accepted  
**Deciders:** Project maintainer  
**Related:** PRD Section 10.6, Constitution Section 2.5

#### Decision
Use MVVM (Model-View-ViewModel) architecture pattern with Repository layer. Avoid complex DI frameworks (Hilt/Dagger) for MVP.

#### Rationale
- **Jetpack recommended:** MVVM is Google's recommended pattern for Android apps
- **Separation of concerns:** UI (Composables), business logic (ViewModel), data (Repository)
- **Testability:** ViewModels and Repositories are easy to unit test
- **Simplicity:** No complex DI framework needed for solo developer

#### Alternatives Considered
1. **MVI (Model-View-Intent)** - Rejected: More complex, steeper learning curve, overkill for MVP.
2. **Clean Architecture (Uncle Bob)** - Rejected: Too many layers (domain, data, presentation), overkill for solo developer.
3. **No architecture (spaghetti code)** - Rejected: Unmaintainable, hard to test, violates constitution.

#### Consequences
- **Positive:** Simple, testable, maintainable, Jetpack-aligned
- **Negative:** Some boilerplate (ViewModels, Repositories). May need refactoring if app grows significantly.
- **Neutral:** Can add DI framework (Hilt) post-MVP if needed

---

### ADR-009: No Complex DI Framework for MVP
**Date:** 2025-12-30  
**Status:** Accepted  
**Deciders:** Project maintainer  
**Related:** Constitution Section 2.5

#### Decision
Use simple constructor injection for MVP. Do not use Hilt or Dagger for dependency injection.

#### Rationale
- **Simplicity:** Constructor injection is easy to understand and maintain for solo developer
- **No boilerplate:** Hilt/Dagger require annotations, modules, components (adds complexity)
- **Fast iteration:** No need to rebuild when changing dependencies
- **Sufficient for MVP:** Small codebase, few dependencies

#### Alternatives Considered
1. **Hilt** - Rejected: Adds build time, complexity, learning curve. Overkill for MVP.
2. **Dagger** - Rejected: Even more complex than Hilt. Not worth the effort for solo developer.
3. **Koin** - Rejected: Simpler than Hilt/Dagger but still adds dependency and learning curve.

#### Consequences
- **Positive:** Simple, fast iteration, no build time overhead, easy to understand
- **Negative:** Manual dependency wiring (pass dependencies through constructors). May need refactoring if app grows.
- **Neutral:** Can add Hilt post-MVP if codebase becomes too complex

---

### ADR-010: Material Design 3 (Material You)
**Date:** 2025-12-30  
**Status:** Accepted  
**Deciders:** Project maintainer  
**Related:** PRD Section 5.2 (NFR-5), Epic 4.2

#### Decision
Use Material Design 3 (Material You) for UI design. Leverage dynamic colors from user's wallpaper (Android 12+).

#### Rationale
- **Modern aesthetics:** Material Design 3 is Google's latest design system
- **Jetpack Compose support:** Built-in Material 3 components in Compose
- **Dynamic colors:** Material You adapts to user's wallpaper (personalization without tracking)
- **Accessibility:** Material Design 3 has strong accessibility guidelines

#### Alternatives Considered
1. **Material Design 2** - Rejected: Older design system, less modern aesthetics.
2. **Custom design system** - Rejected: Too much effort to design and implement. Not worth it for MVP.
3. **No design system (ad-hoc UI)** - Rejected: Inconsistent, unprofessional, hard to maintain.

#### Consequences
- **Positive:** Modern aesthetics, built-in Compose support, dynamic colors, accessibility
- **Negative:** Dynamic colors only work on Android 12+. Fallback to static colors on older devices.
- **Neutral:** Need to follow Material Design 3 guidelines (elevation, typography, spacing)

---

### ADR-011: On-Device Ranking Algorithm (Rules-Based)
**Date:** 2025-12-30  
**Status:** Accepted  
**Deciders:** Project maintainer  
**Related:** PRD Section 10.3, Epic 2.1

#### Decision
Use simple rules-based scoring algorithm for article ranking. Do not use ML models for MVP.

#### Rationale
- **Privacy-first:** All processing happens on-device, no data sent to servers
- **Simplicity:** Rules-based algorithm is easy to understand, test, and debug
- **Sufficient for MVP:** Topic match, keyword match, recency decay provide good personalization
- **No training data needed:** ML models require training data (user interactions), which we don't collect

#### Alternatives Considered
1. **On-device ML (TensorFlow Lite)** - Rejected: Overkill for MVP. Adds complexity, APK size, battery drain. Can add post-MVP.
2. **Server-side ML** - Rejected: Violates privacy principle (requires sending user data to server).
3. **Collaborative filtering** - Rejected: Requires user interaction data from multiple users (privacy violation).

#### Consequences
- **Positive:** Privacy-first, simple, testable, no training data needed
- **Negative:** Less sophisticated than ML models. May not learn user preferences over time.
- **Neutral:** Can add on-device ML post-MVP if needed (TensorFlow Lite, federated learning)

**Algorithm:**
```kotlin
score = recency_bonus + topic_match + source_priority + keyword_match
- recency_bonus: 100 - hours_ago (decay over 24 hours)
- topic_match: +50 if article topic in user's selected topics
- source_priority: +30 if source enabled, -1000 if disabled
- keyword_match: +20 per keyword match in title/description
```

---

### ADR-012: No User Accounts or Cloud Sync (MVP)
**Date:** 2025-12-30  
**Status:** Accepted  
**Deciders:** Project maintainer  
**Related:** PRD Section 7 (Out of Scope), Constitution Section 2.1

#### Decision
Do not implement user accounts, login, or cloud sync for MVP. All data stored locally on-device.

#### Rationale
- **Privacy-first:** No user accounts means no user tracking, no server-side storage
- **Simplicity:** No need to build authentication, backend, database, API
- **Scope control:** User accounts add significant complexity (password reset, email verification, etc.)
- **MVP focus:** Personal use first, cloud sync can be added post-MVP if needed

#### Alternatives Considered
1. **Firebase Authentication + Firestore** - Rejected: Violates privacy principle (user data on Google servers).
2. **Self-hosted backend** - Rejected: Too much effort to build and maintain for solo developer.
3. **Peer-to-peer sync** - Rejected: Complex, unreliable, overkill for MVP.

#### Consequences
- **Positive:** Strong privacy guarantee, simple implementation, no backend needed
- **Negative:** User must reconfigure preferences on new device. No cross-device sync.
- **Neutral:** Can add optional cloud sync post-MVP (encrypted, user-controlled)

---

### ADR-013: Breakpoint-Based Branching Strategy
**Date:** 2025-12-30  
**Status:** Accepted  
**Deciders:** Project maintainer  
**Related:** SOP Section 7, Roadmap Section 3

#### Decision
Use one branch per breakpoint (BP). Allow bundling multiple epics in same breakpoint into one branch.

#### Rationale
- **Testable milestones:** Each breakpoint represents a testable milestone (e.g., BP0: basic feed displays)
- **Easier rollback:** If breakpoint fails, rollback entire branch (not individual epics)
- **Simpler workflow:** Fewer branches to manage (6 branches for MVP vs. 14 if one per epic)
- **Logical grouping:** Epics in same breakpoint are often tightly coupled

#### Alternatives Considered
1. **One branch per epic** - Rejected: Too many branches (14 for MVP). Harder to manage for solo developer.
2. **Feature flags** - Rejected: Overkill for solo developer. Adds complexity.
3. **Trunk-based development** - Rejected: Risky for solo developer (no code review, easy to break main).

#### Consequences
- **Positive:** Simpler workflow, testable milestones, easier rollback
- **Negative:** If one epic in breakpoint fails, entire branch is blocked. Need to fix before merging.
- **Neutral:** Branch naming: `bp<N>-epic-<X.Y>-<slug>` (e.g., `bp0-epic-1.0-1.1-foundation`)

---

## Future Decisions (To Be Made)

### FD-001: Dark Mode Implementation
**Status:** Pending (Post-MVP)  
**Related:** Epic 6.0

**Question:** Should dark mode follow system setting only, or allow manual toggle?

**Options:**
1. System setting only (simpler, Material Design 3 default)
2. Manual toggle in settings (more user control)
3. Both (system default + manual override)

**Decision:** TBD after MVP completion

---

### FD-002: Bookmarks Storage Strategy
**Status:** Pending (Post-MVP)  
**Related:** Epic 6.1

**Question:** How to store bookmarks? Room database or separate file?

**Options:**
1. Room database (same as article cache, easier to query)
2. Separate JSON file (simpler, easier to export/import)
3. DataStore (key-value, limited to small datasets)

**Decision:** TBD after MVP completion

---

### FD-003: Search Implementation
**Status:** Pending (Post-MVP)  
**Related:** Epic 6.2

**Question:** Should search be full-text (FTS) or simple keyword match?

**Options:**
1. Room FTS (full-text search, more powerful, larger APK size)
2. Simple keyword match (filter by title/description, simpler)
3. Hybrid (keyword match + optional FTS for power users)

**Decision:** TBD after MVP completion

---

## Superseded Decisions

None yet.

---

## Deprecated Decisions

None yet.

---

**Document Version:** 1.0  
**Maintained By:** Project maintainer (solo dev)  
**Next Review:** After BP2 completion

**Change Log:**
- 2025-12-30: Initial ADR document created with 13 decisions
