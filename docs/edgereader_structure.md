# EdgeReader - Project Structure & Naming Conventions

## Package Naming Convention

### Primary Package
```
dev.edgereader.app
```

**Rationale:**
- `dev` - Common TLD for developer/open-source projects
- `edgereader` - Project name (lowercase, no spaces)
- `app` - Distinguishes from potential future libraries/SDKs

### Application ID (build.gradle.kts)
```kotlin
android {
    namespace = "dev.edgereader.app"
    defaultConfig {
        applicationId = "dev.edgereader.app"
        // ...
    }
}
```

---

## Project Structure

### Recommended Android Studio Project Layout

```
edgereader/
├── app/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/dev/edgereader/app/
│   │   │   │   ├── EdgeReaderApp.kt                    # Application class
│   │   │   │   ├── MainActivity.kt                     # Main activity
│   │   │   │   │
│   │   │   │   ├── ui/                                 # UI layer (Compose)
│   │   │   │   │   ├── theme/
│   │   │   │   │   │   ├── Color.kt
│   │   │   │   │   │   ├── Theme.kt
│   │   │   │   │   │   └── Type.kt
│   │   │   │   │   │
│   │   │   │   │   ├── navigation/
│   │   │   │   │   │   └── NavGraph.kt
│   │   │   │   │   │
│   │   │   │   │   ├── feed/
│   │   │   │   │   │   ├── FeedScreen.kt              # Main feed UI
│   │   │   │   │   │   ├── FeedViewModel.kt           # Feed business logic
│   │   │   │   │   │   ├── ArticleCard.kt             # Article card component
│   │   │   │   │   │   └── FeedState.kt               # UI state models
│   │   │   │   │   │
│   │   │   │   │   ├── settings/
│   │   │   │   │   │   ├── SettingsScreen.kt
│   │   │   │   │   │   ├── SettingsViewModel.kt
│   │   │   │   │   │   ├── PreferenceItem.kt
│   │   │   │   │   │   └── SettingsState.kt
│   │   │   │   │   │
│   │   │   │   │   ├── onboarding/
│   │   │   │   │   │   ├── OnboardingScreen.kt
│   │   │   │   │   │   ├── OnboardingViewModel.kt
│   │   │   │   │   │   ├── WelcomeStep.kt
│   │   │   │   │   │   ├── TopicSelectionStep.kt
│   │   │   │   │   │   └── SourceSelectionStep.kt
│   │   │   │   │   │
│   │   │   │   │   └── components/                    # Shared UI components
│   │   │   │   │       ├── LoadingIndicator.kt
│   │   │   │   │       ├── ErrorView.kt
│   │   │   │   │       └── EmptyState.kt
│   │   │   │   │
│   │   │   │   ├── data/                               # Data layer
│   │   │   │   │   ├── model/
│   │   │   │   │   │   ├── Article.kt                 # Article data class
│   │   │   │   │   │   ├── Feed.kt                    # Feed source model
│   │   │   │   │   │   ├── UserPreferences.kt         # User prefs model
│   │   │   │   │   │   └── Topic.kt                   # Topic enum/sealed class
│   │   │   │   │   │
│   │   │   │   │   ├── repository/
│   │   │   │   │   │   ├── NewsRepository.kt          # Main repository
│   │   │   │   │   │   ├── PreferencesRepository.kt   # User prefs repo
│   │   │   │   │   │   └── CacheRepository.kt         # Offline cache repo
│   │   │   │   │   │
│   │   │   │   │   ├── local/
│   │   │   │   │   │   ├── AppDatabase.kt             # Room database
│   │   │   │   │   │   ├── dao/
│   │   │   │   │   │   │   ├── ArticleDao.kt
│   │   │   │   │   │   │   └── FeedDao.kt
│   │   │   │   │   │   ├── entity/
│   │   │   │   │   │   │   ├── ArticleEntity.kt
│   │   │   │   │   │   │   └── FeedEntity.kt
│   │   │   │   │   │   └── PreferencesManager.kt      # DataStore manager
│   │   │   │   │   │
│   │   │   │   │   └── remote/
│   │   │   │   │       ├── RssFeedParser.kt           # RSS parsing logic
│   │   │   │   │       ├── NewsApiClient.kt           # Optional API client
│   │   │   │   │       ├── api/
│   │   │   │   │       │   ├── NewsApiService.kt
│   │   │   │   │       │   └── GNewsService.kt
│   │   │   │   │       └── dto/                       # Data transfer objects
│   │   │   │   │           ├── NewsApiResponse.kt
│   │   │   │   │           └── RssFeedItem.kt
│   │   │   │   │
│   │   │   │   └── util/                               # Utilities
│   │   │   │       ├── RankingAlgorithm.kt            # Article scoring
│   │   │   │       ├── DateFormatter.kt               # Time formatting
│   │   │   │       ├── NetworkUtils.kt                # Network helpers
│   │   │   │       ├── Constants.kt                   # App constants
│   │   │   │       └── Extensions.kt                  # Kotlin extensions
│   │   │   │
│   │   │   ├── res/
│   │   │   │   ├── drawable/                          # Icons, images
│   │   │   │   ├── values/
│   │   │   │   │   ├── strings.xml
│   │   │   │   │   ├── themes.xml
│   │   │   │   │   └── colors.xml
│   │   │   │   └── xml/
│   │   │   │       └── default_feeds.xml              # Default RSS feeds config
│   │   │   │
│   │   │   └── AndroidManifest.xml
│   │   │
│   │   ├── test/                                       # Unit tests
│   │   │   └── java/dev/edgereader/app/
│   │   │       ├── util/
│   │   │       │   └── RankingAlgorithmTest.kt
│   │   │       ├── data/
│   │   │       │   └── repository/
│   │   │       │       └── NewsRepositoryTest.kt
│   │   │       └── viewmodel/
│   │   │           └── FeedViewModelTest.kt
│   │   │
│   │   └── androidTest/                                # Instrumented tests
│   │       └── java/dev/edgereader/app/
│   │           └── ui/
│   │               └── FeedScreenTest.kt
│   │
│   ├── build.gradle.kts                                # App-level build config
│   └── proguard-rules.pro                              # ProGuard rules
│
├── gradle/
│   └── libs.versions.toml                              # Version catalog
│
├── build.gradle.kts                                    # Project-level build
├── settings.gradle.kts                                 # Project settings
├── gradle.properties                                   # Gradle properties
├── gradlew                                             # Gradle wrapper (Unix)
├── gradlew.bat                                         # Gradle wrapper (Windows)
│
├── docs/                                               # Documentation
│   ├── ARCHITECTURE.md
│   ├── FEED_SOURCES.md
│   └── DESIGN.md
│
├── .github/
│   ├── workflows/
│   │   ├── android.yml                                 # CI/CD pipeline
│   │   └── release.yml                                 # Release automation
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   └── PULL_REQUEST_TEMPLATE.md
│
├── LICENSE                                             # GPL-3.0 license
├── README.md                                           # Main readme
├── PRD.md                                              # Product requirements
├── CONTRIBUTING.md                                     # Contribution guide
├── PRIVACY.md                                          # Privacy architecture
├── CHANGELOG.md                                        # Version history
└── .gitignore                                          # Git ignore rules
```

---

## Key File Examples

### 1. EdgeReaderApp.kt (Application Class)
```kotlin
package dev.edgereader.app

import android.app.Application
import com.google.firebase.crashlytics.FirebaseCrashlytics
import dev.edgereader.app.data.local.PreferencesManager
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.runBlocking

class EdgeReaderApp : Application() {
    override fun onCreate() {
        super.onCreate()
        
        // Initialize crash reporting based on user preference
        val prefsManager = PreferencesManager(this)
        runBlocking {
            val crashReportingEnabled = prefsManager.isCrashReportingEnabled().first()
            FirebaseCrashlytics.getInstance()
                .setCrashlyticsCollectionEnabled(crashReportingEnabled)
        }
    }
}
```

### 2. build.gradle.kts (App Module)
```kotlin
plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
    alias(libs.plugins.ksp)
}

android {
    namespace = "dev.edgereader.app"
    compileSdk = 35

    defaultConfig {
        applicationId = "dev.edgereader.app"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    
    kotlinOptions {
        jvmTarget = "17"
    }
    
    buildFeatures {
        compose = true
    }
}

dependencies {
    // Jetpack Compose
    implementation(libs.androidx.compose.ui)
    implementation(libs.androidx.compose.material3)
    implementation(libs.androidx.compose.ui.tooling.preview)
    implementation(libs.androidx.activity.compose)
    debugImplementation(libs.androidx.compose.ui.tooling)

    // ViewModel
    implementation(libs.androidx.lifecycle.viewmodel.compose)
    implementation(libs.androidx.lifecycle.runtime.compose)

    // Navigation
    implementation(libs.androidx.navigation.compose)

    // Room
    implementation(libs.androidx.room.runtime)
    implementation(libs.androidx.room.ktx)
    ksp(libs.androidx.room.compiler)

    // DataStore
    implementation(libs.androidx.datastore.preferences)

    // Networking
    implementation(libs.retrofit)
    implementation(libs.retrofit.converter.moshi)
    implementation(libs.okhttp)
    implementation(libs.okhttp.logging.interceptor)

    // RSS Parsing
    implementation(libs.rome)
    implementation(libs.rome.modules)

    // Image Loading
    implementation(libs.coil.compose)

    // Kotlinx
    implementation(libs.kotlinx.coroutines.android)
    implementation(libs.kotlinx.serialization.json)

    // Crash Reporting (optional)
    implementation(libs.firebase.crashlytics)
    implementation(platform(libs.firebase.bom))

    // Testing
    testImplementation(libs.junit)
    testImplementation(libs.kotlinx.coroutines.test)
    androidTestImplementation(libs.androidx.test.ext.junit)
    androidTestImplementation(libs.androidx.test.espresso.core)
    androidTestImplementation(libs.androidx.compose.ui.test.junit4)
}
```

### 3. AndroidManifest.xml
```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:name=".EdgeReaderApp"
        android:allowBackup="false"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.EdgeReader"
        tools:targetApi="31">
        
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.EdgeReader">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
```

---

## Naming Conventions

### Kotlin Files
- **Classes/Objects:** PascalCase - `FeedViewModel`, `ArticleCard`
- **Functions:** camelCase - `scoreArticle()`, `getRankedArticles()`
- **Properties:** camelCase - `selectedTopics`, `isLoading`
- **Constants:** SCREAMING_SNAKE_CASE - `DEFAULT_CACHE_SIZE`, `API_BASE_URL`

### Compose Composables
```kotlin
@Composable
fun FeedScreen() { }              // Screen-level composable

@Composable
fun ArticleCard() { }             // Reusable component

@Composable
private fun FeedContent() { }     // Internal composable
```

### ViewModels
```kotlin
class FeedViewModel : ViewModel() {
    private val _uiState = MutableStateFlow<FeedUiState>(FeedUiState.Loading)
    val uiState: StateFlow<FeedUiState> = _uiState.asStateFlow()
}
```

### Repository Pattern
```kotlin
interface NewsRepository {
    suspend fun getArticles(): Result<List<Article>>
}

class NewsRepositoryImpl(
    private val rssFeedParser: RssFeedParser,
    private val articleDao: ArticleDao
) : NewsRepository {
    // Implementation
}
```

---

## Git Configuration

### .gitignore (Highlights)
```
# Android Studio
*.iml
.gradle/
/local.properties
/.idea/
.DS_Store
/build
/captures

# Signing files
*.jks
*.keystore
keystore.properties

# API keys (never commit!)
google-services.json
secrets.properties
```

### Branch Naming
- `main` - Production-ready code
- `develop` - Development branch
- `feature/article-caching` - Feature branches
- `bugfix/crash-on-refresh` - Bug fixes
- `release/v1.0.0` - Release branches

---

## Resource Naming

### Strings (strings.xml)
```xml
<resources>
    <!-- Screen titles -->
    <string name="screen_feed_title">Feed</string>
    <string name="screen_settings_title">Settings</string>
    
    <!-- Actions -->
    <string name="action_refresh">Refresh</string>
    <string name="action_save">Save</string>
    
    <!-- Messages -->
    <string name="msg_loading">Loading articles…</string>
    <string name="msg_error_network">Network error</string>
    
    <!-- Preferences -->
    <string name="pref_crash_reporting_title">Crash Reporting</string>
    <string name="pref_crash_reporting_summary">Help improve EdgeReader</string>
</resources>
```

### Drawables
- `ic_launcher.xml` - App icon
- `ic_refresh_24.xml` - Refresh icon (24dp)
- `ic_settings_24.xml` - Settings icon (24dp)
- `bg_card_elevated.xml` - Card background

### Colors (Material Design 3)
```xml
<resources>
    <!-- Material You dynamic colors -->
    <color name="seed">#1B5E20</color> <!-- Green for "edge" theme -->
</resources>
```

---

## Version Catalog (libs.versions.toml)

```toml
[versions]
agp = "8.7.3"
kotlin = "2.1.0"
compose = "1.7.6"
room = "2.6.1"
retrofit = "2.11.0"

[libraries]
androidx-compose-ui = { group = "androidx.compose.ui", name = "ui", version.ref = "compose" }
androidx-compose-material3 = { group = "androidx.compose.material3", name = "material3" }
androidx-room-runtime = { group = "androidx.room", name = "room-runtime", version.ref = "room" }
retrofit = { group = "com.squareup.retrofit2", name = "retrofit", version.ref = "retrofit" }
# ... more libraries

[plugins]
android-application = { id = "com.android.application", version.ref = "agp" }
kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
```

---

## Quick Start Commands

```bash
# Clone repository
git clone https://github.com/yourusername/edgereader.git
cd edgereader

# Build debug APK
./gradlew assembleDebug

# Install on connected device
./gradlew installDebug

# Run unit tests
./gradlew test

# Run instrumented tests
./gradlew connectedAndroidTest

# Create release build (requires signing key)
./gradlew assembleRelease

# Check code style
./gradlew ktlintCheck

# Format code
./gradlew ktlintFormat
```

---

## CI/CD (GitHub Actions)

See `.github/workflows/android.yml` for automated:
- Build verification
- Unit tests
- Code style checks
- APK generation on releases

---

**This structure follows Android best practices and scales well for solo development.**