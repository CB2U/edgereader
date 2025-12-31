# Implementation Plan: Project Setup & Repository

## Architecture Overview

This epic establishes the foundational structure for EdgeReader as a native Android application using modern Android development practices.

### Key Components and Responsibilities

**1. Android Project Structure**
- **Responsibility:** Provide the build system and module organization
- **Technology:** Gradle with Kotlin DSL (build.gradle.kts)
- **Boundaries:** Single-module app for MVP, multi-module architecture deferred to post-MVP

**2. Package Organization**
- **`dev.edgereader.app`** (root): Application class, main activity
- **`dev.edgereader.app.ui`**: Jetpack Compose screens, ViewModels, UI components
- **`dev.edgereader.app.data`**: Repository pattern, data sources (local/remote), data models
- **`dev.edgereader.app.util`**: Extension functions, helper utilities, constants

**3. Build Configuration**
- **Responsibility:** Define SDK versions, dependencies, build variants
- **Key Files:** 
  - `build.gradle.kts` (project-level): Plugin versions, repositories
  - `app/build.gradle.kts` (app-level): Dependencies, SDK versions, build types

**4. Version Control**
- **Responsibility:** Track changes, enable collaboration
- **Technology:** Git + GitHub
- **Configuration:** .gitignore for Android projects

### Alternatives Considered

**Alternative 1: Multi-module architecture from start**
- **Rejected:** Adds complexity for solo developer, premature optimization
- **Chosen approach:** Single module, refactor to multi-module post-MVP if needed

**Alternative 2: Flutter or React Native**
- **Rejected:** Per PRD decision, native Android provides best performance and privacy control
- **Chosen approach:** Kotlin + Jetpack Compose for modern native development

**Alternative 3: MIT or Apache 2.0 license**
- **Rejected:** Allows commercial forks without contribution back
- **Chosen approach:** GPL-3.0 prevents commercial exploitation, aligns with privacy mission

## Data Contracts

N/A for this epic (no runtime data structures yet)

## Storage and Persistence

N/A for this epic (no data storage yet, will be added in Epic 2.0 and 3.0)

## External Integrations

N/A for this epic (no external APIs yet, will be added in Epic 1.1 for RSS feeds)

## UX and Operational States

### Initial State
- Empty project template with "Hello Android" default screen
- Compilable but non-functional (no features implemented)

### Success State
- Project builds successfully
- Package structure visible in Android Studio
- README and LICENSE files present in repository

### Error States
- Build failure: Display Gradle error messages
- Missing dependencies: Gradle sync will prompt for SDK installation

## Testing Plan

### Unit Tests
- **N/A for this epic** (no business logic to test)
- Testing infrastructure will be added in Epic 1.1 when first testable code is written

### Integration Tests
- **N/A for this epic** (no integrations yet)

### Manual Testing
1. **Build Test:** Open project in Android Studio, run Gradle sync, build project
2. **Package Structure Test:** Verify all three packages exist with placeholder files
3. **Git Test:** Verify .gitignore excludes build artifacts
4. **GitHub Test:** Push to GitHub, verify LICENSE and README are visible

## AC Verification Mapping

| AC | Verification Method | Success Criteria |
|----|---------------------|------------------|
| AC-1.0.1 | Manual build in Android Studio | Gradle build succeeds, APK generated |
| AC-1.0.2 | Inspect project structure | All three packages exist with .kt files |
| AC-1.0.3 | View GitHub repository | LICENSE file visible, README mentions GPL-3.0 |
| AC-1.0.4 | README review | Contains all required sections (description, features, setup, license) |
| AC-1.0.5 | Inspect build.gradle.kts | minSdk=26, targetSdk=34, Compose configured |

## Risks and Mitigations

### Risk 1: Gradle version incompatibility
- **Mitigation:** Use Gradle wrapper (gradlew) with pinned version (8.2+)
- **Detection:** Build failure on first sync
- **Recovery:** Update Gradle wrapper version

### Risk 2: Android Studio version too old
- **Mitigation:** Document minimum required version (Hedgehog 2023.1.1+) in README
- **Detection:** Compose preview errors or build failures
- **Recovery:** Upgrade Android Studio

### Risk 3: Missing Android SDK components
- **Mitigation:** Android Studio will prompt for SDK installation on first sync
- **Detection:** SDK Manager warnings
- **Recovery:** Install required SDK platforms and build tools via SDK Manager

## Rollout and Migration Notes

### Initial Setup (New Project)
1. Create new Android Studio project with "Empty Activity" template
2. Configure package name: `dev.edgereader.app`
3. Select Kotlin DSL for Gradle
4. Set minimum SDK to API 26

### No Migration Required
- This is a greenfield project, no existing codebase to migrate

### Future Migration Considerations
- When moving to multi-module: Use Android Studio refactoring tools
- When adding DI framework: Gradual migration, start with new features

## Observability and Debugging

### What Can Be Logged
- Gradle build output (build times, dependency resolution)
- Android Studio sync messages
- Git commit history

### What Must Never Be Logged
- N/A for this epic (no user data or runtime behavior yet)

### Debugging Approach
- **Build failures:** Check Gradle build output, verify SDK installation
- **Package structure issues:** Use Android Studio "Project" view (not "Android" view)
- **Git issues:** Use `git status` and `git log` for troubleshooting

## Proposed Changes

### Project Configuration

#### [NEW] [build.gradle.kts](file:///mnt/Storage/Documents/Projects/EdgeReader/build.gradle.kts)
- Configure Kotlin plugin version
- Add Google Maven repository
- Set up Gradle wrapper

#### [NEW] [app/build.gradle.kts](file:///mnt/Storage/Documents/Projects/EdgeReader/app/build.gradle.kts)
- Set minSdk=26, targetSdk=34
- Configure Jetpack Compose dependencies
- Add core Android libraries (Room, DataStore, Retrofit for future use)
- Configure build types (debug, release)

#### [NEW] [gradle.properties](file:///mnt/Storage/Documents/Projects/EdgeReader/gradle.properties)
- Enable Kotlin incremental compilation
- Configure JVM memory settings
- Disable unnecessary Gradle features

---

### Package Structure

#### [NEW] [app/src/main/java/dev/edgereader/app/EdgeReaderApp.kt](file:///mnt/Storage/Documents/Projects/EdgeReader/app/src/main/java/dev/edgereader/app/EdgeReaderApp.kt)
- Application class (placeholder for future initialization)

#### [NEW] [app/src/main/java/dev/edgereader/app/MainActivity.kt](file:///mnt/Storage/Documents/Projects/EdgeReader/app/src/main/java/dev/edgereader/app/MainActivity.kt)
- Main activity with Compose setup

#### [NEW] [app/src/main/java/dev/edgereader/app/ui/README.md](file:///mnt/Storage/Documents/Projects/EdgeReader/app/src/main/java/dev/edgereader/app/ui/README.md)
- Package documentation (placeholder)

#### [NEW] [app/src/main/java/dev/edgereader/app/data/README.md](file:///mnt/Storage/Documents/Projects/EdgeReader/app/src/main/java/dev/edgereader/app/data/README.md)
- Package documentation (placeholder)

#### [NEW] [app/src/main/java/dev/edgereader/app/util/README.md](file:///mnt/Storage/Documents/Projects/EdgeReader/app/src/main/java/dev/edgereader/app/util/README.md)
- Package documentation (placeholder)

---

### Documentation and Legal

#### [NEW] [LICENSE](file:///mnt/Storage/Documents/Projects/EdgeReader/LICENSE)
- GPL-3.0 license text

#### [NEW] [README.md](file:///mnt/Storage/Documents/Projects/EdgeReader/README.md)
- Project description and tagline
- Key features (privacy-focused, on-device personalization, zero tracking)
- Setup instructions for developers
- License information
- Contributing guidelines

#### [NEW] [.gitignore](file:///mnt/Storage/Documents/Projects/EdgeReader/.gitignore)
- Android-specific ignore patterns (build/, .gradle/, local.properties)

---

### Version Control

#### [NEW] GitHub Repository
- Create repository: `github.com/[username]/edgereader`
- Initialize with README and LICENSE
- Push initial commit with project structure

## Verification Plan

### Automated Tests
- **None for this epic** (no testable code yet)

### Manual Verification

**Step 1: Build Verification**
1. Open project in Android Studio
2. Wait for Gradle sync to complete
3. Run "Build > Make Project"
4. Verify: Build succeeds with no errors

**Step 2: Package Structure Verification**
1. Switch to "Project" view in Android Studio
2. Navigate to `app/src/main/java/dev/edgereader/app/`
3. Verify: `ui/`, `data/`, `util/` packages exist

**Step 3: License Verification**
1. Open GitHub repository in browser
2. Verify: LICENSE file is visible in root
3. Verify: README.md mentions GPL-3.0 license

**Step 4: Documentation Verification**
1. Read README.md
2. Verify: Contains project description, features, setup instructions, license info

**Step 5: Build Configuration Verification**
1. Open `app/build.gradle.kts`
2. Verify: `minSdk = 26`, `targetSdk = 34`
3. Verify: Jetpack Compose dependencies present
