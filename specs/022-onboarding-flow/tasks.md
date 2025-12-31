# Implementation Tasks: Onboarding Flow

**Epic:** 2.2 - Onboarding Flow  
**Spec:** [spec.md](file:///mnt/Storage/Documents/Projects/EdgeReader/specs/022-onboarding-flow/spec.md)  
**Plan:** [plan.md](file:///mnt/Storage/Documents/Projects/EdgeReader/specs/022-onboarding-flow/plan.md)

---

## Setup

### [x] T1: Create onboarding component files
**Goal:** Set up component file structure for onboarding flow

**Steps:**
1. Create `src/components/onboarding/` directory
2. Create `OnboardingFlow.jsx` (main wizard container)
3. Create `WelcomeStep.jsx` (step 0)
4. Create `TopicSelectionStep.jsx` (step 1)
5. Create `SourceSelectionStep.jsx` (step 2)
6. Create `CompletionStep.jsx` (step 3)
7. Create `OnboardingWrapper.jsx` (top-level wrapper)

**Done when:** All 7 component files exist with basic React component boilerplate

**Verify:** Files exist and contain valid React components (no syntax errors)

**Evidence to record:** List of created files

**Files touched:**
- `src/components/onboarding/OnboardingFlow.jsx` (new)
- `src/components/onboarding/WelcomeStep.jsx` (new)
- `src/components/onboarding/TopicSelectionStep.jsx` (new)
- `src/components/onboarding/SourceSelectionStep.jsx` (new)
- `src/components/onboarding/CompletionStep.jsx` (new)
- `src/components/onboarding/OnboardingWrapper.jsx` (new)

---

### [x] T2: Create constants file for topics and sources
**Goal:** Define available topics and sources as constants

**Steps:**
1. Create `src/constants/onboarding.js`
2. Export `AVAILABLE_TOPICS` array (8 topics)
3. Export `AVAILABLE_SOURCES` array (12 sources from Epic 1.2)
4. Add JSDoc comments for documentation

**Done when:** Constants file exists and exports both arrays

**Verify:** Import constants in a component, verify arrays contain correct values

**Evidence to record:** Constants file path

**Files touched:**
- `src/constants/onboarding.js` (new)

---

## Core Implementation

### [x] T3: Implement OnboardingWrapper component
**Goal:** Create wrapper that conditionally shows onboarding or main app

**Steps:**
1. Check `localStorage.hasCompletedOnboarding` on mount
2. Render `<OnboardingFlow />` if flag is false/missing
3. Render `<App />` (main feed) if flag is true
4. Implement `handleComplete` callback that sets flag and re-renders
5. Add state management for completion status

**Done when:** Wrapper correctly routes to onboarding or main app based on flag

**Verify:** 
- Clear localStorage, reload, verify onboarding appears
- Set flag to "true", reload, verify main app appears

**Evidence to record:** Screenshot of onboarding appearing on first visit

**Files touched:**
- `src/components/onboarding/OnboardingWrapper.jsx`
- `src/main.jsx` (integrate wrapper)

---

### [x] T4: Implement OnboardingFlow component with Material UI Stepper
**Goal:** Create main wizard container with step navigation

**Steps:**
1. Import Material UI Stepper, Step, StepLabel components
2. Define 4 steps: Welcome, Topics, Sources, Complete
3. Add state for `activeStep` (0-3)
4. Add state for `selectedTopics` (Set)
5. Add state for `enabledSources` (Set, default all enabled)
6. Implement `handleNext()` function
7. Implement `handleBack()` function
8. Implement `handleFinish()` function (calls storageService, sets localStorage flag)
9. Render current step component based on `activeStep`
10. Pass state and handlers to step components as props

**Done when:** Stepper renders and navigation works (Next/Back buttons)

**Verify:** Click through all steps, verify stepper updates correctly

**Evidence to record:** Screenshot of stepper UI

**Files touched:**
- `src/components/onboarding/OnboardingFlow.jsx`

---

### [x] T5: Implement WelcomeStep component
**Goal:** Create welcome screen with app intro

**Steps:**
1. Import Material UI Card, Typography, Button components
2. Display app name ("EdgeReader")
3. Display brief description (1-2 sentences)
4. Add "Get Started" button that calls `onNext()` prop
5. Style with Material UI theme

**Done when:** Welcome screen renders with working "Get Started" button

**Verify:** Click "Get Started", verify navigation to topic selection step

**Evidence to record:** Screenshot of welcome screen

**Files touched:**
- `src/components/onboarding/WelcomeStep.jsx`

---

### [x] T6: Implement TopicSelectionStep component
**Goal:** Create topic selection UI with validation

**Steps:**
1. Import Material UI Chip, FormGroup, FormHelperText, Button components
2. Display `AVAILABLE_TOPICS` as clickable chips
3. Track selected topics in local state (sync with parent via props)
4. Implement validation: minimum 3 topics required
5. Show error message if validation fails
6. Disable "Next" button if < 3 topics selected
7. Add "Next" button that calls `onNext()` prop
8. Style selected chips with primary color

**Done when:** Topic selection works with validation

**Verify:**
- Select 2 topics, verify "Next" is disabled
- Select 3 topics, verify "Next" is enabled
- Click "Next", verify navigation to source selection

**Evidence to record:** Screenshot of topic selection with validation error

**Files touched:**
- `src/components/onboarding/TopicSelectionStep.jsx`

---

### [x] T7: Implement SourceSelectionStep component
**Goal:** Create source selection UI with toggles

**Steps:**
1. Import Material UI Switch, List, ListItem, ListItemText, Button components
2. Display `AVAILABLE_SOURCES` as list items with toggle switches
3. Track enabled sources in local state (sync with parent via props)
4. Default all sources to enabled
5. Implement validation: minimum 1 source required
6. Show error message if validation fails (all sources disabled)
7. Add "Back" button that calls `onBack()` prop
8. Add "Finish" button that calls `onFinish()` prop
9. Disable "Finish" button if 0 sources enabled

**Done when:** Source selection works with validation

**Verify:**
- Disable all sources, verify "Finish" is disabled
- Enable at least 1 source, verify "Finish" is enabled
- Click "Back", verify navigation to topic selection
- Click "Finish", verify preferences are saved

**Evidence to record:** Screenshot of source selection UI

**Files touched:**
- `src/components/onboarding/SourceSelectionStep.jsx`

---

### [x] T8: Implement CompletionStep component
**Goal:** Create success screen with redirect

**Steps:**
1. Import Material UI Card, Typography, CircularProgress components
2. Display success message ("You're all set!")
3. Show loading spinner
4. Auto-redirect to main feed after 2 seconds (or add "Go to Feed" button)
5. Style with Material UI theme

**Done when:** Completion screen renders and redirects

**Verify:** Complete onboarding, verify success screen appears and redirects

**Evidence to record:** Screenshot of completion screen

**Files touched:**
- `src/components/onboarding/CompletionStep.jsx`

---

### [x] T9: Integrate storageService in OnboardingFlow
**Goal:** Save preferences to IndexedDB on completion

**Steps:**
1. Import `storageService` from `src/services/storageService.js`
2. In `handleFinish()`, construct `UserPreferences` object:
   - `selectedTopics`: Set from state
   - `enabledSources`: Set from state
   - `disabledSources`: Set (all sources not in enabledSources)
   - `keywords`: Empty Set
3. Call `await storageService.savePreferences(prefs)`
4. Set `localStorage.hasCompletedOnboarding = "true"`
5. Call `onComplete()` callback to trigger re-render
6. Add error handling (show error message if save fails)

**Done when:** Preferences are saved to IndexedDB on completion

**Verify:**
- Complete onboarding
- Check IndexedDB in DevTools → Application tab
- Verify preferences object exists with correct data

**Evidence to record:** Screenshot of IndexedDB with saved preferences

**Files touched:**
- `src/components/onboarding/OnboardingFlow.jsx`

---

## Tests

### [x] T10: Write browser subagent test for first-visit flow
**Goal:** Automated test for AC-2.2.1, AC-2.2.4, AC-2.2.5

**Steps:**
1. Create browser subagent task:
   - Clear localStorage and IndexedDB
   - Load app at `http://localhost:5173`
   - Verify onboarding wizard appears
   - Click "Get Started"
   - Select 3 topics (Technology, Science, Health)
   - Click "Next"
   - Verify source selection screen appears
   - Click "Finish" (all sources enabled by default)
   - Verify redirect to main feed
   - Check IndexedDB for preferences
   - Check localStorage for `hasCompletedOnboarding = "true"`
2. Record browser session
3. Document results

**Done when:** Browser test passes and recording exists

**Verify:** Review recording, verify all steps completed successfully

**Evidence to record:** Browser recording path

**Files touched:** None (browser test only)

---

### [x] T11: Write browser subagent test for returning user
**Goal:** Automated test for AC-2.2.2

**Steps:**
1. Create browser subagent task:
   - Set `localStorage.hasCompletedOnboarding = "true"`
   - Load app at `http://localhost:5173`
   - Verify main feed appears immediately (no onboarding)
2. Record browser session
3. Document results

**Done when:** Browser test passes and recording exists

**Verify:** Review recording, verify onboarding is skipped

**Evidence to record:** Browser recording path

**Files touched:** None (browser test only)

---

### [x] T12: Write browser subagent test for topic validation
**Goal:** Automated test for AC-2.2.3

**Steps:**
1. Create browser subagent task:
   - Clear localStorage
   - Load app
   - Click "Get Started"
   - Select only 2 topics
   - Attempt to click "Next"
   - Verify error message appears
   - Verify navigation is blocked (still on topic selection screen)
   - Select 3rd topic
   - Click "Next"
   - Verify navigation succeeds
2. Record browser session
3. Document results

**Done when:** Browser test passes and recording exists

**Verify:** Review recording, verify validation works

**Evidence to record:** Browser recording path

**Files touched:** None (browser test only)

---

### [x] T13: Write browser subagent test for feed personalization
**Goal:** Automated test for AC-2.2.6 and AC-5

**Steps:**
1. Create browser subagent task:
   - Clear localStorage and IndexedDB
   - Load app
   - Complete onboarding with only "Technology" topic selected
   - Verify redirect to main feed
   - Inspect article list
   - Verify tech articles appear at top (ranked higher)
2. Record browser session
3. Document results

**Done when:** Browser test passes and recording exists

**Verify:** Review recording, verify personalization works

**Evidence to record:** Browser recording path

**Files touched:** None (browser test only)

---

## Verification

### [x] T14: Manual responsive design testing
**Goal:** Verify AC-2.2.7 (Material Design) and NFR-2.2.2 (Responsiveness)

**Steps:**
1. Open app in Chrome DevTools
2. Set device to "iPhone SE" (375px width)
3. Complete onboarding flow
4. Verify all components are readable and clickable
5. Take screenshots
6. Set device to "Desktop" (1920px width)
7. Complete onboarding flow again
8. Verify layout looks good
9. Take screenshots
10. Inspect DOM for Material UI class names (e.g., `MuiStepper-root`)

**Done when:** Onboarding works on mobile and desktop

**Verify:** Screenshots show proper responsive layout

**Evidence to record:** Mobile and desktop screenshots

**Files touched:** None (manual testing only)

---

### [x] T15: Verify all acceptance criteria
**Goal:** Confirm all 8 ACs pass

**Steps:**
1. Review browser test results (T10-T13)
2. Review manual test results (T14)
3. Create AC verification table in spec.md
4. Mark each AC as PASS/FAIL with evidence links
5. Calculate overall pass rate

**Done when:** All 8 ACs verified and documented

**Verify:** AC table in spec.md shows 8/8 PASS

**Evidence to record:** AC verification table

**Files touched:**
- `specs/022-onboarding-flow/spec.md` (update EVIDENCE section)

---

## Tracking

### [x] T16: Update SPEC.md and SPECS.md
**Goal:** Update spec index files to reflect Epic 2.2 status

**Steps:**
1. Update `SPEC.md`:
   - Set "Current focus" to Epic 2.2
   - Set "Status" to "Done"
   - Update links to spec files
   - Set "Next command" to `/specify 3.0`
2. Update `SPECS.md`:
   - Update Epic 2.2 row:
     - Spec folder: `specs/022-onboarding-flow/`
     - Status: "Done"
   - Update BP2 status to "Done" (all epics 2.0, 2.1, 2.2 complete)

**Done when:** Both files updated

**Verify:** Files contain correct paths and status

**Evidence to record:** Git diff of SPEC.md and SPECS.md

**Files touched:**
- `SPEC.md`
- `SPECS.md`

---

### [x] T17: Final spec.md evidence update
**Goal:** Consolidate all evidence in spec.md

**Steps:**
1. Update "Implementation Summary" section:
   - Set status to "COMPLETE"
   - Record implementation time
   - Record verification time
2. Update "Code Implementation Evidence" section:
   - List all created components
   - Link to key files
3. Update "Verification Results" section:
   - Link to browser recordings
   - Summarize test results
4. Update "Acceptance Criteria Verification" table:
   - Mark all ACs as PASS
   - Add evidence links
5. Update overall status at bottom

**Done when:** spec.md EVIDENCE section is complete

**Verify:** All sections filled in with links and results

**Evidence to record:** Final spec.md

**Files touched:**
- `specs/022-onboarding-flow/spec.md`

---

**Total Tasks:** 17  
**Estimated Time:** 4-6 hours  
**Dependencies:** Epic 2.0 (storageService), Epic 2.1 (rankingService)
