# EdgeReader Development Constitution

**Version:** 1.0  
**Last Updated:** December 30, 2025  
**Status:** ACTIVE

---

## 1. Purpose and Scope

This constitution establishes **non-negotiable principles** and **development workflow** for EdgeReader to:
- Prevent scope drift from the approved PRD
- Enforce privacy-first architecture
- Maintain code quality through spec-driven development
- Ensure every feature meets EdgeReader's core values

**Scope:** All code, features, and changes to EdgeReader codebase MUST comply with this constitution.

---

## 2. Non-Negotiables

These principles are **immutable** and override all other considerations except critical security fixes:

### 2.1 Privacy (Absolute Requirements)

**MUST:**
- ✅ Store ALL user preferences locally on-device (DataStore or Room only)
- ✅ Process ALL personalization on-device (ranking, filtering, ML if added)
- ✅ Open articles in external browser via `Intent.ACTION_VIEW` (no in-app WebView)
- ✅ Disable ALL analytics SDKs (Firebase Analytics, Google Analytics, etc.)
- ✅ Implement crash reporting opt-out toggle (default: enabled, but user-controllable)
- ✅ Scrub ALL PII from crash reports (no user preferences, article URLs, or identifiers)

**MUST NOT:**
- ❌ Transmit user preferences, reading history, or behavior to ANY server
- ❌ Use ANY tracking SDKs, advertising IDs, or fingerprinting techniques
- ❌ Store user data on cloud services (no Firebase Realtime Database, Cloud Firestore, etc.)
- ❌ Implement server-side user profiling or recommendation engines
- ❌ Use Chrome Custom Tabs or in-app WebView (privacy risk)

**Threshold:** Zero exceptions. Any network call transmitting user data is a **critical violation**.

---

### 2.2 Performance (Measurable Requirements)

**MUST meet these thresholds:**
- App startup time: **< 1 second** (cold start on mid-range device)
- Feed load time: **< 2 seconds** (on 4G network, 50+ articles)
- UI responsiveness: **60 FPS minimum** during scrolling
- Offline mode: Display cached articles (last 100 minimum) when offline
- APK size: **< 25 MB** (excludes user data)

**Testing:** Performance MUST be validated on Android 8.0 (API 26) device with 2GB RAM before release.

---

### 2.3 Security

**MUST:**
- ✅ Use HTTPS for all network requests (RSS feeds, APIs)
- ✅ Validate and sanitize all user input (custom RSS URLs, keywords)
- ✅ Implement certificate pinning for critical APIs (if using paid news APIs)
- ✅ Store sensitive data (API keys if any) in BuildConfig or encrypted storage, NEVER in code
- ✅ Follow OWASP Mobile Top 10 guidelines

**MUST NOT:**
- ❌ Hardcode API keys, tokens, or secrets in source code
- ❌ Allow arbitrary code execution from fetched content
- ❌ Store plaintext passwords or tokens (if future auth is added)

---

### 2.4 Data Integrity

**MUST:**
- ✅ Handle ALL network failures gracefully (show cached data + error message)
- ✅ Validate RSS feed structure before parsing (prevent crashes from malformed XML)
- ✅ Implement database migrations for Room schema changes
- ✅ Preserve user preferences across app updates (no data loss)

**Threshold:** Zero data loss during app updates. Test migration paths before release.

---

### 2.5 Portability and Maintainability

**MUST:**
- ✅ Keep codebase simple (MVVM pattern, avoid over-engineering)
- ✅ Use Kotlin standard library and Jetpack libraries (avoid exotic dependencies)
- ✅ Document all complex algorithms (ranking, parsing logic)
- ✅ Write modular code (easy to swap RSS parser, add new sources)

**MUST NOT:**
- ❌ Introduce complex DI frameworks (Hilt/Dagger) for MVP (use simple constructors)
- ❌ Use reflection or code generation beyond KSP for Room/Compose
- ❌ Lock code to specific vendors (keep news sources configurable)

---

## 3. Spec-Driven Development Workflow

**Principle:** No code is written before specifications are approved.

### 3.1 Workflow Gates

All features MUST follow this sequence:

```
1. SPECIFY → 2. PLAN → 3. TASKS → 4. IMPLEMENT
```

**Gate 1: SPECIFY**
- Write feature spec in `docs/specs/FEATURE_NAME.md`
- Include: Problem statement, requirements (FR/NFR), acceptance criteria, privacy impact
- Get approval (PR review or self-review for solo dev)

**Gate 2: PLAN**
- Break spec into technical implementation plan
- Identify affected components (UI, data layer, algorithm)
- List dependencies and risks

**Gate 3: TASKS**
- Create actionable tasks (GitHub issues or checklist)
- Estimate effort (hours/days)
- Prioritize tasks

**Gate 4: IMPLEMENT**
- Write code only after Gates 1-3 are complete
- Reference spec in commit messages
- Write tests alongside implementation

**Enforcement:** All PRs MUST link to a spec document. No spec = no merge.

---

### 3.2 Spec Template

All feature specs MUST include:

```markdown
# Feature: [Name]

## Problem Statement
[What user problem does this solve?]

## Requirements
### Functional Requirements
- FR-X: [Requirement]

### Non-Functional Requirements
- NFR-X: [Requirement]

## Acceptance Criteria
- AC-X: Given [context], when [action], then [outcome]

## Privacy Impact
- Does this transmit data? [Yes/No + details]
- Does this store user data? [Yes/No + what/where]

## Implementation Notes
[Technical approach, libraries, algorithm]

## Test Plan
[How will this be tested?]
```

---

## 4. Quality Bars

### 4.1 Testing Requirements

**Unit Tests (MUST):**
- All ranking algorithm logic MUST have unit tests (100% coverage)
- All repository methods MUST have unit tests
- All ViewModels MUST have unit tests for state transitions

**UI Tests (SHOULD):**
- Critical user flows SHOULD have Compose UI tests (onboarding, settings, feed)

**Manual Testing (MUST):**
- Test on at least 2 physical devices before release (one mid-range, one low-end)
- Test offline mode (airplane mode)
- Test crash reporting opt-out

**Threshold:** Ranking algorithm MUST have 100% test coverage. Other modules SHOULD aim for 80%+.

---

### 4.2 Documentation Requirements

**MUST document:**
- All public APIs and complex algorithms (KDoc comments)
- All new features in CHANGELOG.md
- All breaking changes in migration guide
- All third-party dependencies in README.md

**Code comments MUST:**
- Explain **why** (not what) for non-obvious logic
- Include edge cases and assumptions
- Reference PRD/spec sections where applicable

---

### 4.3 Error Handling Requirements

**MUST handle:**
- Network failures (no internet, timeout, DNS errors)
- Malformed RSS feeds (invalid XML, missing fields)
- Database errors (full storage, corruption)
- Unexpected null values (use Kotlin null safety)

**Error UX MUST:**
- Show user-friendly error messages (not stack traces)
- Provide retry actions where applicable
- Log errors for debugging (if crash reporting enabled)

**Threshold:** Zero unhandled exceptions in production. All `try-catch` blocks MUST have meaningful error recovery.

---

## 5. Security and Privacy Rules

### 5.1 Network Requests

**MUST:**
- Use HTTPS only (HTTP is forbidden except localhost)
- Set connection timeout: 10 seconds
- Set read timeout: 30 seconds
- Include User-Agent: `EdgeReader/X.Y.Z (Android)`
- MUST NOT include any user identifiers in headers or query params

**Example:**
```kotlin
// ✅ ALLOWED
GET https://feeds.reuters.com/reuters/worldNews
User-Agent: EdgeReader/1.0.0 (Android)

// ❌ FORBIDDEN
GET https://api.example.com/news?userId=12345
```

---

### 5.2 Crash Reporting

**MUST:**
- Check user preference before initializing crash reporting SDK
- Strip all PII from crash logs (use `beforeSend` callback)
- Remove breadcrumbs containing article URLs or user actions
- Include only: stack trace, device model, OS version, app version

**Code Review Requirement:** All crash reporting changes MUST be reviewed for PII leaks.

---

### 5.3 Permissions

**MUST only request:**
- `INTERNET` (required for fetching feeds)
- `ACCESS_NETWORK_STATE` (optional, for connectivity checks)

**MUST NOT request:**
- Location, camera, contacts, storage, or any other sensitive permissions

---

## 6. Definition of Done

Every feature MUST meet these criteria before merging:

### Checklist (All MUST be ✅)

**Specification:**
- [ ] Feature spec written and approved
- [ ] Privacy impact assessed (no violations)
- [ ] Requirements map to PRD (no scope drift)

**Implementation:**
- [ ] Code follows Kotlin style guide
- [ ] Code compiles without warnings
- [ ] No hardcoded strings (use strings.xml)
- [ ] No magic numbers (use named constants)

**Testing:**
- [ ] Unit tests written (if applicable)
- [ ] Manual testing completed (positive + negative cases)
- [ ] Offline mode tested (if applicable)
- [ ] Performance thresholds met (< 1s startup, < 2s load)

**Privacy:**
- [ ] No user data transmitted to servers (verified with network inspector)
- [ ] All data stored locally (DataStore or Room)
- [ ] Crash reports scrubbed (if applicable)

**Documentation:**
- [ ] KDoc comments for public APIs
- [ ] CHANGELOG.md updated
- [ ] README.md updated (if user-facing change)

**Quality:**
- [ ] No unhandled exceptions
- [ ] Error messages are user-friendly
- [ ] UI follows Material Design 3
- [ ] Accessibility: content descriptions for images

**Before Release:**
- [ ] Tested on Android 8.0 (API 26) and Android 14+
- [ ] APK size < 25 MB
- [ ] ProGuard rules verified (no crashes in release build)

---

## 7. Change Control

### 7.1 Constitution Amendments

This constitution is **stable** and may only be modified under these conditions:

**MUST:**
- Explicit instruction from project maintainer (solo dev: you)
- Written rationale explaining why change is necessary
- Review period of 24 hours (for solo dev: sleep on it)
- Update version number and changelog

**Amendment Process:**
1. Propose change in GitHub issue with `constitution-amendment` label
2. Document rationale (why is current rule insufficient?)
3. Update CONSTITUTION.md with version bump
4. Commit with message: `Constitution v1.X: [Brief description]`

**Forbidden Changes:**
- ❌ Weakening privacy guarantees (Section 2.1)
- ❌ Removing spec-driven workflow (Section 3)
- ❌ Lowering performance thresholds without justification

---

### 7.2 PRD Changes

**MUST:**
- All PRD changes MUST be reflected in this constitution
- If PRD and constitution conflict, **constitution takes precedence** until amended
- Update both documents simultaneously

---

### 7.3 Emergency Exceptions

**Only for critical security vulnerabilities:**
- Skip spec process IF AND ONLY IF exploit is actively being used
- Document exception in commit message
- Write retroactive spec within 48 hours
- Review for unintended privacy/security impacts

**All other scenarios:** Follow normal workflow. "Urgent" ≠ emergency.

---

## 8. Scope Drift Prevention

### 8.1 Forbidden Features (MVP)

These features are **explicitly out of scope** for MVP and MUST NOT be implemented:

- ❌ User accounts or login
- ❌ Cloud sync
- ❌ Social features (sharing, comments, likes)
- ❌ In-app article reader/WebView
- ❌ Push notifications
- ❌ Advanced ML models (beyond simple scoring)
- ❌ Monetization (ads, subscriptions, in-app purchases)
- ❌ iOS version

**Rationale:** These require significant complexity and risk scope creep. Focus on Android MVP first.

---

### 8.2 Feature Creep Test

Before adding ANY new feature, answer these questions:

1. Is it in the PRD? (If no → STOP)
2. Does it align with "privacy-first" principle? (If no → STOP)
3. Can it be implemented without server-side components? (If no → STOP)
4. Is it required for MVP or post-MVP? (If post-MVP → defer)
5. Does it add < 1 MB to APK size? (If no → justify or stop)

**If 3+ answers are "no" → Feature is REJECTED.**

---

## 9. Code Review Checklist

All PRs (or self-reviews) MUST verify:

**Privacy:**
- [ ] No network calls with user data
- [ ] All data stored locally (no cloud)
- [ ] Crash reports scrubbed

**Performance:**
- [ ] No blocking operations on main thread
- [ ] Images loaded asynchronously
- [ ] Database queries optimized

**Security:**
- [ ] HTTPS only
- [ ] Input validation present
- [ ] No hardcoded secrets

**Quality:**
- [ ] Tests written
- [ ] Documentation updated
- [ ] Error handling complete

**Constitution Compliance:**
- [ ] Spec document linked
- [ ] Definition of Done met
- [ ] No forbidden features

---

## 10. Enforcement

**Solo Developer:**
- Self-review all commits against this constitution
- Use GitHub issue checklist for Definition of Done
- When in doubt, re-read Section 2 (Non-Negotiables)

**Future Contributors:**
- PR approvals REQUIRE constitution compliance check
- Maintainer has final say on interpretation
- Appeals process: Open GitHub discussion

**Violations:**
- Non-negotiable violations (Section 2) → PR rejected immediately
- Process violations (Section 3) → Request spec before re-review
- Quality violations (Section 4) → Request fixes before merge

---

## Appendix: Quick Reference

### Privacy Checklist (Before Every Commit)
- ✅ Is all data local?
- ✅ Are all network calls anonymized?
- ✅ Is crash reporting opt-outable?

### Performance Checklist
- ✅ Startup < 1s?
- ✅ Feed load < 2s?
- ✅ 60 FPS scrolling?

### Spec-Driven Checklist
- ✅ Spec written?
- ✅ Plan complete?
- ✅ Tasks defined?
- ✅ Tests written?

---

**Last Words:**

> "Specification before implementation. Privacy before features. Simplicity before cleverness."

This constitution exists to keep EdgeReader true to its mission: **privacy-focused news aggregation at the edge.**

When in doubt, ask: *"Does this align with EdgeReader's core promise of zero tracking?"*

If the answer is unclear, **stop and clarify** before proceeding.

---

**Document Version:** 1.0  
**Next Review:** After MVP completion  
**Maintained By:** Project maintainer (solo dev)  

**Change Log:**
- 2025-12-30: Initial constitution v1.0