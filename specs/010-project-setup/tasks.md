# Tasks: Project Setup & Repository

## Setup

### T1: Create Android Studio Project
**Goal:** Initialize a new Android project with Kotlin and Jetpack Compose.

**Steps:**
1. Open Android Studio Hedgehog or later
2. Select "New Project" > "Empty Activity"
3. Configure project:
   - Name: EdgeReader
   - Package name: `dev.edgereader.app`
   - Save location: Choose appropriate directory
   - Language: Kotlin
   - Minimum SDK: API 26 (Android 8.0)
   - Build configuration language: Kotlin DSL
4. Click "Finish" and wait for Gradle sync

**Done when:**
- Project opens in Android Studio
- Gradle sync completes successfully
- Default "Hello Android" screen is visible in preview

**Verify:**
- Run app on emulator or device, verify it launches

**Evidence to record:**
- Screenshot of successful build in Android Studio
- Screenshot of app running on emulator

**Files touched:**
- `build.gradle.kts` (project-level)
- `app/build.gradle.kts`
- `settings.gradle.kts`
- `app/src/main/AndroidManifest.xml`
- `app/src/main/java/dev/edgereader/app/MainActivity.kt`

**Estimated time:** 30 minutes

---

### T2: Configure Build Files
**Goal:** Set up proper SDK versions and core dependencies.

**Steps:**
1. Open `app/build.gradle.kts`
2. Verify/update SDK versions:
   ```kotlin
   android {
       compileSdk = 34
       defaultConfig {
           minSdk = 26
           targetSdk = 34
       }
   }
   ```
3. Add core dependencies (if not already present):
   - Jetpack Compose BOM
   - Material Design 3
   - Room (for future use)
   - DataStore (for future use)
   - Retrofit (for future use)
4. Configure Kotlin compiler options for Compose
5. Sync Gradle

**Done when:**
- Build succeeds with updated configuration
- All dependencies resolve successfully

**Verify:**
- Run `./gradlew build` in terminal, verify success
- Check `build.gradle.kts` matches plan.md specifications

**Evidence to record:**
- Copy of final `app/build.gradle.kts` content
- Gradle build success output

**Files touched:**
- `app/build.gradle.kts`
- `gradle.properties`

**Estimated time:** 45 minutes

---

## Core Implementation

### T3: Create Package Structure
**Goal:** Establish the three core packages with placeholder files.

**Steps:**
1. In Android Studio, navigate to `app/src/main/java/dev/edgereader/app/`
2. Create package: `ui`
3. Create package: `data`
4. Create package: `util`
5. In each package, create a README.md file with package purpose:
   - `ui/README.md`: "UI layer: Composables, ViewModels, UI logic"
   - `data/README.md`: "Data layer: Repository, data sources, models"
   - `util/README.md`: "Utilities: Extension functions, helpers, constants"
6. Create `EdgeReaderApp.kt` in root package (Application class)

**Done when:**
- All three packages exist in project structure
- Each package has a README.md file
- Application class exists

**Verify:**
- Switch to "Project" view in Android Studio
- Confirm all packages are visible
- Open each README.md to verify content

**Evidence to record:**
- Screenshot of package structure in Android Studio
- List of created files

**Files touched:**
- `app/src/main/java/dev/edgereader/app/ui/README.md`
- `app/src/main/java/dev/edgereader/app/data/README.md`
- `app/src/main/java/dev/edgereader/app/util/README.md`
- `app/src/main/java/dev/edgereader/app/EdgeReaderApp.kt`

**Estimated time:** 30 minutes

---

### T4: Create Application Class
**Goal:** Set up the Application class for future initialization.

**Steps:**
1. Create `EdgeReaderApp.kt` in `dev.edgereader.app` package
2. Implement basic Application class:
   ```kotlin
   class EdgeReaderApp : Application() {
       override fun onCreate() {
           super.onCreate()
           // Future: Initialize crash reporting, preferences, etc.
       }
   }
   ```
3. Register in `AndroidManifest.xml`:
   ```xml
   <application
       android:name=".EdgeReaderApp"
       ...>
   ```
4. Build project to verify

**Done when:**
- Application class compiles
- Manifest references the Application class
- App runs without errors

**Verify:**
- Run app, check logcat for Application.onCreate() execution
- Verify no crashes on launch

**Evidence to record:**
- Content of `EdgeReaderApp.kt`
- Logcat output showing Application initialization

**Files touched:**
- `app/src/main/java/dev/edgereader/app/EdgeReaderApp.kt`
- `app/src/main/AndroidManifest.xml`

**Estimated time:** 20 minutes

---

## Docs

### T5: Add GPL-3.0 License
**Goal:** Add GPL-3.0 license file to repository.

**Steps:**
1. Download GPL-3.0 license text from https://www.gnu.org/licenses/gpl-3.0.txt
2. Create `LICENSE` file in repository root
3. Paste GPL-3.0 license text
4. Add copyright header:
   ```
   EdgeReader - Privacy-focused news aggregator for Android
   Copyright (C) 2025 [Your Name]
   
   [GPL-3.0 license text follows...]
   ```
5. Commit file

**Done when:**
- LICENSE file exists in repository root
- File contains complete GPL-3.0 text
- Copyright notice is present

**Verify:**
- Open LICENSE file, verify it's GPL-3.0
- Check file is tracked by Git

**Evidence to record:**
- Confirmation that LICENSE file exists
- First few lines of LICENSE file

**Files touched:**
- `LICENSE`

**Estimated time:** 15 minutes

---

### T6: Create Professional README
**Goal:** Write comprehensive README.md for the project.

**Steps:**
1. Create/update `README.md` in repository root
2. Include sections:
   - **Project Title and Tagline:** "EdgeReader - News aggregation at the edge. Your content, your device, zero tracking."
   - **Description:** Brief overview of privacy-focused news aggregation
   - **Key Features:** 
     - Zero tracking, on-device personalization
     - Multi-source aggregation (RSS + APIs)
     - External browser integration
     - GPL-3.0 open source
   - **Privacy Guarantees:** All data local, no cloud sync, no analytics
   - **Setup Instructions:** 
     - Prerequisites (Android Studio, JDK 17+)
     - Clone and build steps
     - Running the app
   - **Tech Stack:** Kotlin, Jetpack Compose, Room, DataStore
   - **License:** GPL-3.0 with link to LICENSE file
   - **Contributing:** Link to future CONTRIBUTING.md (placeholder)
   - **Roadmap:** Link to roadmap.md
3. Format with proper markdown (headers, lists, code blocks)
4. Add badges (optional): License badge, Android badge

**Done when:**
- README.md contains all required sections
- Markdown formatting is correct
- Links to LICENSE and roadmap.md work

**Verify:**
- Read README top to bottom, check for clarity
- Preview README on GitHub (after push)

**Evidence to record:**
- Confirmation that README exists
- List of sections included

**Files touched:**
- `README.md`

**Estimated time:** 60 minutes

---

### T7: Configure .gitignore
**Goal:** Set up proper Git ignore patterns for Android projects.

**Steps:**
1. Create/update `.gitignore` in repository root
2. Add Android-specific patterns:
   - `*.iml`
   - `.gradle/`
   - `local.properties`
   - `.idea/` (except `.idea/runConfigurations/`)
   - `build/`
   - `captures/`
   - `.externalNativeBuild/`
   - `.cxx/`
   - `*.apk`
   - `*.aab`
3. Add OS-specific patterns:
   - `.DS_Store` (macOS)
   - `Thumbs.db` (Windows)
4. Commit file

**Done when:**
- .gitignore file exists
- Build artifacts are ignored
- IDE files are ignored (except necessary ones)

**Verify:**
- Run `git status`, verify build/ and .gradle/ are not listed
- Build project, verify generated files don't appear in Git

**Evidence to record:**
- Confirmation that .gitignore exists
- `git status` output showing clean working tree (except tracked files)

**Files touched:**
- `.gitignore`

**Estimated time:** 15 minutes

---

## Verification

### T8: Manual Verification of All ACs
**Goal:** Verify all acceptance criteria are met.

**Steps:**
1. **AC-1.0.1 (Project Compilation):**
   - Clean build: `./gradlew clean build`
   - Verify: Build succeeds, APK generated in `app/build/outputs/apk/`
2. **AC-1.0.2 (Package Structure):**
   - Open Android Studio, switch to "Project" view
   - Verify: `ui/`, `data/`, `util/` packages exist with README.md files
3. **AC-1.0.3 (GPL-3.0 License Visibility):**
   - View repository on GitHub (or locally)
   - Verify: LICENSE file visible in root
   - Verify: README.md mentions GPL-3.0
4. **AC-1.0.4 (Professional Documentation):**
   - Read README.md completely
   - Verify: Contains description, features, setup instructions, license
   - Verify: Clear and professional tone
5. **AC-1.0.5 (Build Configuration):**
   - Open `app/build.gradle.kts`
   - Verify: `minSdk = 26`
   - Verify: `targetSdk = 34`
   - Verify: Jetpack Compose dependencies present

**Done when:**
- All 5 ACs verified and documented
- Evidence collected for each AC

**Verify:**
- Review evidence, ensure it's sufficient for audit

**Evidence to record:**
- For each AC: Screenshot or text output proving compliance
- Summary table mapping AC to evidence

**Files touched:**
- None (verification only)

**Estimated time:** 30 minutes

---

### T9: Create Initial Git Commit and Push to GitHub
**Goal:** Initialize Git repository and push to GitHub.

**Steps:**
1. Initialize Git (if not already done by Android Studio):
   ```bash
   git init
   ```
2. Add all files:
   ```bash
   git add .
   ```
3. Create initial commit:
   ```bash
   git commit -m "Initial commit: Project setup and repository structure

   - Android Studio project with Kotlin and Jetpack Compose
   - Package structure: ui, data, util
   - GPL-3.0 license
   - Professional README with setup instructions
   - Build configuration: minSdk 26, targetSdk 34
   
   Implements Epic 1.0 (Project Setup & Repository)
   Closes: AC-1.0.1, AC-1.0.2, AC-1.0.3, AC-1.0.4, AC-1.0.5"
   ```
4. Create GitHub repository (via web interface or GitHub CLI)
5. Add remote:
   ```bash
   git remote add origin https://github.com/[username]/edgereader.git
   ```
6. Push to GitHub:
   ```bash
   git push -u origin main
   ```

**Done when:**
- Repository exists on GitHub
- All files are pushed
- LICENSE and README are visible on GitHub homepage

**Verify:**
- Visit GitHub repository URL
- Verify: LICENSE file visible
- Verify: README.md renders correctly
- Verify: All source files present

**Evidence to record:**
- GitHub repository URL
- Screenshot of GitHub repository homepage
- Git log showing initial commit

**Files touched:**
- `.git/` (Git metadata)

**Estimated time:** 20 minutes

---

## Tracking

### T10: Update SPECS.md
**Goal:** Update the spec index to reflect Epic 1.0 status.

**Steps:**
1. Open `SPECS.md`
2. Find row for Epic 1.0 (roadmap anchor 1.0)
3. Update status from "Not started" to "In progress"
4. Add next task: "T1: Create Android Studio Project"
5. Add evidence link: `specs/010-project-setup/spec.md#evidence`
6. Commit change:
   ```bash
   git commit -m "Update SPECS.md: Epic 1.0 in progress"
   ```

**Done when:**
- SPECS.md row for Epic 1.0 shows "In progress"
- Next task is listed
- Evidence link is present

**Verify:**
- Open SPECS.md, verify changes are correct
- Click evidence link, verify it points to spec.md

**Evidence to record:**
- Updated SPECS.md content (Epic 1.0 row)

**Files touched:**
- `SPECS.md`

**Estimated time:** 10 minutes

---

### T11: Update SPEC.md
**Goal:** Update the spec entrypoint to point to Epic 1.0.

**Steps:**
1. Open `SPEC.md`
2. Update "Current focus" section:
   - Roadmap anchor: `1.0`
   - Spec folder: `specs/010-project-setup/`
   - Type: `Feature`
   - Priority: `P0`
   - Status: `In progress`
   - Next command: `/implement_from_spec specs/010-project-setup/`
3. Update "Links" section:
   - spec.md: `specs/010-project-setup/spec.md`
   - plan.md: `specs/010-project-setup/plan.md`
   - tasks.md: `specs/010-project-setup/tasks.md`
4. Commit change

**Done when:**
- SPEC.md points to Epic 1.0 spec folder
- All links are correct

**Verify:**
- Open SPEC.md, verify links work
- Click each link to verify files exist

**Evidence to record:**
- Updated SPEC.md content

**Files touched:**
- `SPEC.md`

**Estimated time:** 10 minutes

---

### T12: Final Evidence Consolidation
**Goal:** Update spec.md with comprehensive evidence section and mark epic complete.

**Steps:**
1. Open `specs/010-project-setup/spec.md`
2. Navigate to "## EVIDENCE" section
3. Add subsections for each AC with verification evidence:
   - **AC-1.0.1:** Build output, APK location
   - **AC-1.0.2:** Package structure screenshot
   - **AC-1.0.3:** GitHub repository link, LICENSE file confirmation
   - **AC-1.0.4:** README.md sections checklist
   - **AC-1.0.5:** Build configuration values
4. Add task completion summary:
   - List all tasks (T1-T12) with completion status
   - Note any deviations from plan
5. Add final verification statement:
   - "All acceptance criteria verified on [date]"
   - "Epic 1.0 complete and ready for Epic 1.1"
6. Update SPECS.md status to "Done"
7. Commit changes:
   ```bash
   git commit -m "Complete Epic 1.0: Project Setup & Repository
   
   All ACs verified, evidence documented in spec.md"
   ```

**Done when:**
- spec.md EVIDENCE section is complete
- SPECS.md shows Epic 1.0 as "Done"
- All evidence is verifiable

**Verify:**
- Review EVIDENCE section for completeness
- Verify all ACs have corresponding evidence

**Evidence to record:**
- Final spec.md with complete EVIDENCE section
- SPECS.md showing "Done" status

**Files touched:**
- `specs/010-project-setup/spec.md`
- `SPECS.md`

**Estimated time:** 30 minutes

---

## Summary

**Total estimated time:** ~5 hours

**Task breakdown:**
- Setup: 2 tasks (1h 15m)
- Core implementation: 2 tasks (50m)
- Docs: 3 tasks (1h 30m)
- Verification: 2 tasks (50m)
- Tracking: 3 tasks (50m)

**Critical path:**
1. T1 (Create project) → T2 (Configure build) → T3 (Package structure) → T8 (Verify ACs) → T9 (Push to GitHub) → T12 (Final evidence)

**Dependencies:**
- T4 depends on T3 (package structure must exist)
- T8 depends on T1-T7 (all implementation complete)
- T9 depends on T8 (verification complete)
- T10-T12 depend on T9 (code pushed to GitHub)
