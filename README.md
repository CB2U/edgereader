# EdgeReader

> News aggregation at the edge. Your content, your device, zero tracking.

[![License: GPL-3.0](https://img.shields.io/badge/License-GPL%203.0-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-Android-green.svg)](https://www.android.com)
[![F-Droid](https://img.shields.io/badge/F--Droid-coming%20soon-orange.svg)](https://f-droid.org)

**EdgeReader** is a privacy-focused news aggregator for Android that brings edge computing principles to content curation. All personalization happens on your device—your data never leaves your control.

## ✨ Features

- 📰 **Multi-source aggregation** - Headlines from 10+ quality news sources (RSS + APIs)
- 🔒 **Zero tracking** - No analytics, no user profiling, no data collection
- 🎯 **On-device personalization** - Smart ranking based on your interests, all processed locally
- ⚡ **Fast & lightweight** - Sub-1-second startup, instant feed updates
- 🌐 **Privacy-respecting** - Opens articles in your default browser (respects your ad blockers)
- 📴 **Offline-first** - Cached articles available without internet
- 🛠️ **Customizable** - Select topics, sources, and keywords you care about
- 🧪 **Open source** - GPL-3.0 licensed, transparent codebase

## 🚀 Quick Start

### For Users

**Download:**
- [Google Play](https://play.google.com/store/apps/details?id=dev.edgereader.app) _(coming soon)_
- [F-Droid](https://f-droid.org/packages/dev.edgereader.app) _(coming soon)_
- [GitHub Releases](https://github.com/yourusername/edgereader/releases) _(APK direct download)_

**Requirements:**
- Android 8.0 (API 26) or higher
- ~20MB storage space

### For Developers

**Clone and build:**

```bash
git clone https://github.com/yourusername/edgereader.git
cd edgereader
./gradlew assembleDebug
```

**Tech stack:**
- Language: Kotlin
- UI: Jetpack Compose (Material Design 3)
- Database: Room (SQLite)
- Networking: Retrofit + OkHttp
- Preferences: DataStore

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.

## 🎯 How It Works

EdgeReader uses **edge computing principles** to deliver personalized news without compromising privacy:

1. **On-device ranking** - Articles are scored based on your explicit preferences (topics, sources, keywords)
2. **Local storage** - All preferences and cached articles stay on your device
3. **No server-side profiling** - We never see what you read or how you configure the app
4. **Optional crash reporting** - Anonymous logs (opt-out available), containing only device model and stack traces

### Ranking Algorithm

EdgeReader scores articles using a transparent algorithm:
- **Recency**: Newer articles score higher (decays over 24 hours)
- **Topic match**: Articles in your selected topics get +50 points
- **Source priority**: Enabled sources get +30, disabled sources are hidden
- **Keyword matching**: Articles containing your keywords get +20 per match

You have full control—no black-box algorithms, no hidden manipulation.

## 🛡️ Privacy Guarantees

| What we **don't** collect | What we **do** collect (optional) |
|----------------------------|-----------------------------------|
| ❌ Article reading history | ✅ Crash logs (opt-out available) |
| ❌ User preferences | ✅ Device model (crash reports only) |
| ❌ Search queries | ✅ App version (crash reports only) |
| ❌ Location data | |
| ❌ Identifiers (advertising ID, etc.) | |
| ❌ Analytics/tracking data | |

**Why trust us?**
- Open source code—audit it yourself
- No analytics SDKs in the codebase
- GPL-3.0 license prevents proprietary forks
- Network traffic can be inspected (no hidden calls)

Read our [Privacy Policy](https://yourusername.github.io/edgereader/privacy-policy.html) for full details.

## 📱 Screenshots

_Coming soon - screenshots of feed, settings, and onboarding_

## 🗺️ Roadmap

### MVP (Current Focus)
- [x] RSS feed aggregation (10-15 sources)
- [x] On-device ranking algorithm
- [x] Material Design 3 UI
- [x] External browser integration
- [x] Offline caching
- [ ] Google Play release
- [ ] F-Droid submission

### Post-MVP (v1.1+)
- [ ] Custom RSS feed URLs
- [ ] Keyword search/filtering
- [ ] Bookmark/save articles locally
- [ ] Dark mode
- [ ] Import/export preferences

### Future (v2.0+)
- [ ] iOS version
- [ ] Lightweight on-device ML recommendations
- [ ] Multi-language support

See [PRD.md](PRD.md) for detailed requirements and technical specifications.

## 🤝 Contributing

Contributions are welcome! EdgeReader is built for the privacy community by the privacy community.

**Ways to contribute:**
- 🐛 Report bugs or suggest features via [Issues](https://github.com/yourusername/edgereader/issues)
- 🔧 Submit pull requests (see [CONTRIBUTING.md](CONTRIBUTING.md))
- 📰 Suggest new RSS feeds (especially non-tech sources)
- 📝 Improve documentation
- 🌍 Translate the app (coming in v1.1)

**Good first issues:** Check issues tagged with [`good first issue`](https://github.com/yourusername/edgereader/labels/good%20first%20issue)

## 📄 License

EdgeReader is licensed under the [GNU General Public License v3.0](LICENSE).

**What this means:**
- ✅ You can use, modify, and distribute this software
- ✅ You can use it for commercial purposes
- ⚠️ Any derivative work must also be GPL-3.0 (no proprietary forks)
- ⚠️ You must disclose the source code of derivative works

This license was chosen to prevent commercial exploitation while keeping the project open for the community.

## 🙏 Acknowledgments

**News sources:**
- Reuters, BBC, NPR, The Guardian, TechCrunch, Ars Technica, The Verge, Wired, ScienceDaily, Nature, and more

**Inspiration:**
- [Feeder](https://f-droid.org/packages/com.nononsenseapps.feeder) - F-Droid RSS reader
- Google News - UX inspiration (but with privacy!)
- Privacy-focused apps community on F-Droid

**Libraries:**
- [Jetpack Compose](https://developer.android.com/jetpack/compose) - UI framework
- [Room](https://developer.android.com/training/data-storage/room) - Local database
- [Retrofit](https://square.github.io/retrofit/) - HTTP client
- [Coil](https://coil-kt.github.io/coil/) - Image loading

## 📞 Contact

- **Issues/Bugs:** [GitHub Issues](https://github.com/yourusername/edgereader/issues)
- **Discussions:** [GitHub Discussions](https://github.com/yourusername/edgereader/discussions)
- **Email:** your.email@example.com
- **Matrix:** `#edgereader:matrix.org` _(coming soon)_

## 💝 Support

EdgeReader is free and always will be. If you find it useful, consider:

- ⭐ Starring this repo
- 🐦 Sharing on social media
- ☕ [Buy me a coffee](https://ko-fi.com/yourusername) _(optional, coming soon)_
- 🤝 Contributing code or documentation

---

**Built with ❤️ for privacy**

_"Computing at the edge, privacy at the core."_