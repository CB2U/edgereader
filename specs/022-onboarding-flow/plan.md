# Implementation Plan: Onboarding Flow

**Epic:** 2.2 - Onboarding Flow  
**Spec:** [spec.md](file:///mnt/Storage/Documents/Projects/EdgeReader/specs/022-onboarding-flow/spec.md)  
**Status:** Planning

---

## Architecture Overview

### Component Structure

The onboarding flow will be implemented as a standalone React component that wraps the main app and conditionally renders based on onboarding completion status.

**Key Components:**

1. **OnboardingWrapper** (`src/components/OnboardingWrapper.jsx`)
   - Checks `hasCompletedOnboarding` flag in localStorage
   - Conditionally renders `<OnboardingFlow />` or `<App />` (main feed)
   - Handles completion callback and flag setting

2. **OnboardingFlow** (`src/components/onboarding/OnboardingFlow.jsx`)
   - Main onboarding wizard container
   - Manages step state (current step: 0-3)
   - Integrates Material UI Stepper
   - Handles navigation (Next, Back, Finish)
   - Calls `storageService.savePreferences()` on completion

3. **WelcomeStep** (`src/components/onboarding/WelcomeStep.jsx`)
   - Displays app name, logo, description
   - "Get Started" button

4. **TopicSelectionStep** (`src/components/onboarding/TopicSelectionStep.jsx`)
   - Displays available topics as Material UI Chips or Checkboxes
   - Manages selected topics state
   - Validates minimum 3 topics
   - Shows error message if validation fails

5. **SourceSelectionStep** (`src/components/onboarding/SourceSelectionStep.jsx`)
   - Displays all 12 news sources with toggle switches
   - Manages enabled/disabled sources state
   - Defaults to all sources enabled
   - Validates at least 1 source enabled

6. **CompletionStep** (`src/components/onboarding/CompletionStep.jsx`)
   - Success message
   - Auto-redirect to main feed after 2 seconds (or "Go to Feed" button)

### Data Flow

```
User launches app
  ↓
OnboardingWrapper checks localStorage.hasCompletedOnboarding
  ↓
If false → Render OnboardingFlow
  ↓
User progresses through steps (Welcome → Topics → Sources → Complete)
  ↓
OnboardingFlow.handleFinish():
  - Construct UserPreferences object
  - Call storageService.savePreferences(prefs)
  - Set localStorage.hasCompletedOnboarding = true
  - Call onComplete callback
  ↓
OnboardingWrapper re-renders → Shows main feed
  ↓
Main feed uses rankingService to personalize articles
```

### Alternatives Considered

**Alternative 1: Modal-based onboarding**
- ❌ Rejected: Less immersive, users might dismiss accidentally

**Alternative 2: Single-page onboarding (no stepper)**
- ❌ Rejected: Overwhelming for users, harder to validate step-by-step

**Alternative 3: Progressive disclosure (show onboarding prompts in main feed)**
- ❌ Rejected: Violates "must complete onboarding" requirement

**Chosen Approach: Multi-step wizard with Material UI Stepper**
- ✅ Clear progress indication
- ✅ Step-by-step validation
- ✅ Familiar UX pattern
- ✅ Material Design compliant

---

## Data Contracts

### UserPreferences Object (from Epic 2.0)

```javascript
{
  selectedTopics: Set<string>,      // e.g., Set(["Technology", "Science", "Health"])
  enabledSources: Set<string>,      // e.g., Set(["TechCrunch", "Wired", ...])
  disabledSources: Set<string>,     // e.g., Set([])
  keywords: Set<string>             // Empty for onboarding (set in Settings later)
}
```

### Available Topics (Hardcoded)

```javascript
const AVAILABLE_TOPICS = [
  "Technology",
  "Science",
  "Health",
  "Business",
  "Sports",
  "General",
  "Politics",
  "Entertainment"
];
```

### Available Sources (from Epic 1.2)

```javascript
const AVAILABLE_SOURCES = [
  "TechCrunch",
  "Wired",
  "The Verge",
  "Reuters Technology",
  "BBC News",
  "CNN",
  "The Guardian",
  "NPR",
  "Associated Press",
  "Hacker News",
  "Ars Technica",
  "MIT Technology Review"
];
```

### localStorage Flag

```javascript
localStorage.hasCompletedOnboarding: "true" | undefined
```

---

## Storage and Persistence

### IndexedDB Integration

- Use `storageService.savePreferences(prefs)` from Epic 2.0
- No direct IndexedDB calls in onboarding components
- Storage service handles serialization (Set → Array)

### localStorage Integration

- Store `hasCompletedOnboarding` flag in localStorage
- Check on app load in `OnboardingWrapper`
- Set to `"true"` after successful onboarding completion

---

## UX and Operational States

### Onboarding Flow States

1. **Step 0: Welcome**
   - Show app intro
   - "Get Started" button enabled

2. **Step 1: Topic Selection**
   - Show 8 topics as chips/checkboxes
   - "Next" button disabled until 3+ topics selected
   - Error message if user tries to proceed with < 3 topics

3. **Step 2: Source Selection**
   - Show 12 sources with toggle switches
   - All sources enabled by default
   - "Back" button enabled
   - "Finish" button disabled if 0 sources enabled

4. **Step 3: Completion**
   - Show success message
   - Auto-redirect after 2 seconds (or manual "Go to Feed" button)

### Error States

- **Topic validation error:** "Please select at least 3 topics to continue"
- **Source validation error:** "Please enable at least 1 news source"
- **Storage error:** "Failed to save preferences. Please try again." (with retry button)

### Loading States

- Show loading spinner during `savePreferences()` call
- Disable "Finish" button during save operation

---

## Testing Plan

### Unit Tests (Optional for MVP)

**File:** `src/components/onboarding/OnboardingFlow.test.jsx`

Tests:
- Topic selection validation (< 3 topics blocks navigation)
- Source selection validation (0 sources blocks navigation)
- Preferences object construction (correct format)
- localStorage flag setting

**Run command:** `npm test -- OnboardingFlow.test.jsx`

### Integration Tests (Browser Subagent)

**Test 1: First-visit onboarding flow**
1. Clear localStorage and IndexedDB
2. Load app
3. Verify onboarding wizard appears
4. Complete all steps (select 3 topics, keep all sources enabled)
5. Verify redirect to main feed
6. Verify IndexedDB contains preferences
7. Verify localStorage.hasCompletedOnboarding = "true"

**Test 2: Returning user (skip onboarding)**
1. Set localStorage.hasCompletedOnboarding = "true"
2. Load app
3. Verify main feed appears immediately (no onboarding)

**Test 3: Topic validation**
1. Clear localStorage
2. Load app
3. On topic selection step, select only 2 topics
4. Click "Next"
5. Verify error message appears
6. Verify navigation is blocked

**Test 4: Feed personalization**
1. Clear localStorage and IndexedDB
2. Complete onboarding with only "Technology" topic
3. Verify main feed shows tech articles ranked higher

### Manual Testing

**Test 5: Responsive design**
1. Open app in Chrome DevTools mobile view (375px width)
2. Complete onboarding flow
3. Verify all components are readable and clickable
4. Repeat on desktop (1920px width)

**Test 6: Material Design compliance**
1. Inspect onboarding components in browser
2. Verify Material UI class names (e.g., `MuiStepper-root`, `MuiChip-root`)
3. Verify Material Design 3 styling

---

## AC Verification Mapping

| AC | Verification Method | Test ID |
|----|---------------------|---------|
| **AC-2.2.1** (First Visit Detection) | Browser subagent | Test 1 |
| **AC-2.2.2** (Returning User) | Browser subagent | Test 2 |
| **AC-2.2.3** (Topic Validation) | Browser subagent | Test 3 |
| **AC-2.2.4** (Topic Selection Success) | Browser subagent | Test 1 |
| **AC-2.2.5** (Preferences Saved) | Browser subagent | Test 1 |
| **AC-2.2.6** (Feed Personalization) | Browser subagent | Test 4 |
| **AC-2.2.7** (Material Design) | Manual | Test 6 |
| **AC-5** (PRD: Personalized Feed) | Browser subagent | Test 4 |

---

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| **Material UI Stepper too complex on mobile** | Test early on 375px width. Use vertical stepper on mobile if needed. |
| **User closes browser mid-onboarding** | Acceptable for MVP - user restarts onboarding. No progress persistence. |
| **localStorage flag cleared** | Acceptable - user sees onboarding again. Not a critical issue. |
| **Storage service fails** | Show error message with retry button. Log error to console. |
| **Topics/sources list becomes outdated** | Hardcoded for MVP. Post-MVP can make configurable via admin panel. |

---

## Rollout and Migration Notes

### First-Time Users
- Will see onboarding on first app launch
- No migration needed

### Existing Users (if any)
- If app has existing users before Epic 2.2, they will see onboarding on next visit
- Acceptable - onboarding is quick (< 2 minutes)
- Alternative: Set `hasCompletedOnboarding = true` for existing users (requires user detection logic - defer to post-MVP)

### Feature Flag
- No feature flag needed for MVP
- Onboarding is mandatory for all new users

---

## Observability and Debugging

### What Can Be Logged

- Onboarding step transitions (e.g., "User moved to step 2")
- Preferences saved successfully
- Validation errors (e.g., "User tried to proceed with 2 topics")
- Storage errors (e.g., "Failed to save preferences: [error message]")

### What Must Never Be Logged

- User's selected topics (privacy violation)
- User's selected sources (privacy violation)
- Any preference data (privacy violation)

### Debug Mode

For development, add `?debug=true` query parameter to enable verbose console logging:
- Step state changes
- Validation results
- Preferences object (before saving)

**Important:** Remove debug logging in production build.

---

## Implementation Checklist

See [tasks.md](file:///mnt/Storage/Documents/Projects/EdgeReader/specs/022-onboarding-flow/tasks.md) for detailed task breakdown.

High-level phases:
1. **Setup:** Create component files, add routing
2. **Core Implementation:** Build onboarding steps, integrate storage service
3. **Validation:** Add topic/source validation logic
4. **Testing:** Browser subagent tests, manual responsive testing
5. **Verification:** Verify all 8 ACs pass
6. **Documentation:** Update SPEC.md, SPECS.md, add evidence to spec.md

---

**Status:** Planning complete  
**Next Step:** Create tasks.md with detailed implementation tasks  
**Estimated Implementation Time:** 4-6 hours
