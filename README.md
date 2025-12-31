# EdgeReader

> News aggregation at the edge. Your content, your device, zero tracking.

[![License: GPL-3.0](https://img.shields.io/badge/License-GPL%203.0-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-Web%20%7C%20PWA-green.svg)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
[![Status](https://img.shields.io/badge/status-MVP%20in%20progress-orange.svg)](https://github.com/CB2U/edgereader)

**EdgeReader** is a privacy-focused news aggregator Progressive Web App (PWA) that brings edge computing principles to content curation. All personalization happens in your browser—your data never leaves your control.

## ✨ Features

- 📰 **Multi-source aggregation** - Headlines from 10+ quality news sources (RSS + APIs)
- 🔒 **Zero tracking** - No analytics, no user profiling, no data collection
- 🎯 **Client-side personalization** - Smart ranking based on your interests, all processed locally
- ⚡ **Fast & lightweight** - Sub-2-second page load, instant feed updates
- 🌐 **Privacy-respecting** - Opens articles in new tab (respects your ad blockers)
- 📴 **Offline-first** - Cached articles available without internet via Service Worker
- 🛠️ **Customizable** - Select topics, sources, and keywords you care about
- 📱 **Installable** - Works as a PWA on any device (desktop, mobile, tablet)
- 🧪 **Open source** - GPL-3.0 licensed, transparent codebase

## 🚀 Quick Start

### For Users

**Access EdgeReader:**

- 🌐 **Web:** [https://edgereader.app](https://edgereader.app) _(coming soon)_
- 📱 **Install as PWA:** Visit the site and click "Install" in your browser

**Requirements:**

- Modern browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- JavaScript enabled
- ~5MB storage space for offline cache

**Install as PWA:**

1. Visit https://edgereader.app in your browser
2. Click the install icon in the address bar (Chrome/Edge) or "Add to Home Screen" (Safari)
3. EdgeReader will open as a standalone app

### For Developers

**Clone and run locally:**

```bash
git clone https://github.com/CB2U/edgereader.git
cd edgereader
npm install
npm run dev
```

**Build for production:**

```bash
npm run build
npm run preview
```

**Tech stack:**

- Framework: React 18 + Vite
- UI: Material UI (MUI) v5
- State: React Context API
- Storage: IndexedDB + LocalStorage
- Networking: Fetch API + CORS proxies
- PWA: Workbox (Service Worker)
- Error reporting: Sentry (opt-in)

## 🎯 How It Works

EdgeReader uses **edge computing principles** to deliver personalized news without compromising privacy:

1. **Client-side ranking** - Articles are scored based on your explicit preferences (topics, sources, keywords)
2. **Local storage** - All preferences and cached articles stay in your browser (IndexedDB)
3. **No server-side profiling** - We never see what you read or how you configure the app
4. **Optional error reporting** - Anonymous logs (opt-out available), containing only browser info and stack traces

### Ranking Algorithm

EdgeReader scores articles using a transparent algorithm:

- **Recency**: Newer articles score higher (decays over 24 hours)
- **Topic match**: Articles in your selected topics get +50 points
- **Source priority**: Enabled sources get +30, disabled sources are hidden
- **Keyword matching**: Articles containing your keywords get +20 per match

You have full control—no black-box algorithms, no hidden manipulation.

## 🛡️ Privacy Guarantees

| What we **don't** collect    | What we **do** collect (optional)   |
| ---------------------------- | ----------------------------------- |
| ❌ Article reading history    | ✅ Error logs (opt-out available)    |
| ❌ User preferences           | ✅ Browser info (error reports only) |
| ❌ Search queries             | ✅ App version (error reports only)  |
| ❌ Location data              |                                     |
| ❌ Cookies or tracking pixels |                                     |
| ❌ Analytics/tracking data    |                                     |

**Full details:** See [Privacy Policy](docs/PRIVACY.md) for anonymization details and opt-out instructions.

**Why trust us?**

- Open source code—audit it yourself
- No analytics SDKs in the codebase
- GPL-3.0 license prevents proprietary forks
- Network traffic can be inspected (no hidden calls)
- All data stored locally in IndexedDB (inspect with browser DevTools)

## 📱 Screenshots

_Coming soon - screenshots of feed, settings, and onboarding_

## 🗺️ Roadmap

### MVP (Current Focus)

- [x] RSS feed aggregation (10-15 sources)
- [x] Client-side ranking algorithm
- [x] Material Design 3 UI
- [x] New tab browser integration
- [x] Offline caching (Service Worker)
- [ ] PWA deployment
- [ ] Lighthouse score > 90

### Post-MVP (v1.1+)

- [ ] Custom RSS feed URLs
- [ ] Keyword search/filtering
- [ ] Bookmark/save articles locally
- [ ] Dark mode
- [ ] Import/export preferences

### Future (v2.0+)

- [ ] Native mobile apps (Android/iOS)
- [ ] Lightweight client-side ML recommendations
- [ ] Multi-language support

See [PRD.md](PRD_PWA.md) for detailed requirements and technical specifications.

## 🤝 Contributing

Contributions are welcome! EdgeReader is built for the privacy community by the privacy community.

**Ways to contribute:**

- 🐛 Report bugs or suggest features via [Issues](https://github.com/CB2U/edgereader/issues)
- 📰 Suggest new RSS feeds (especially non-tech sources)
- 📝 Improve documentation
- 🌍 Translate the app (coming in v1.1)

**Development workflow:**

1. Read [constitution.md](constitution_PWA.md) for non-negotiables
2. Check [roadmap.md](roadmap_PWA.md) for current epics
3. Follow spec-driven development (see [docs/SOP-speckit-antigravity.md](docs/SOP-speckit-antigravity.md))

**Good first issues:** Check issues tagged with [`good first issue`](https://github.com/CB2U/edgereader/labels/good%20first%20issue)

## 🏗️ Architecture

EdgeReader follows a **spec-driven development** approach using Antigravity:

```
docs/
├── specs/                       # Feature specifications

SPECS.md                        # Spec index (all epics)
constitution_PWA.md             # Non-negotiable principles
roadmap_PWA.md                  # Epic breakdown + timeline
```

**Key principles:**

- ✅ Specification before implementation
- ✅ Privacy before features
- ✅ Simplicity before cleverness

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
- Privacy-focused apps community

**Libraries:**

- [React](https://react.dev/) - UI framework
- [Material UI](https://mui.com/) - Component library
- [Vite](https://vitejs.dev/) - Build tool
- [Workbox](https://developers.google.com/web/tools/workbox) - Service Worker toolkit
- [Sentry](https://sentry.io/) - Error reporting (opt-in)

## 🌐 Browser Support

| Browser | Version | Status            |
| ------- | ------- | ----------------- |
| Chrome  | 90+     | ✅ Fully supported |
| Firefox | 88+     | ✅ Fully supported |
| Safari  | 14+     | ✅ Fully supported |
| Edge    | 90+     | ✅ Fully supported |
| Opera   | 76+     | ✅ Fully supported |

**PWA features:**

- ✅ Service Worker (offline mode)
- ✅ Web App Manifest (installable)
- ✅ IndexedDB (local storage)
- ✅ Push Notifications (future)

## 📞 Contact

- **Issues/Bugs:** [GitHub Issues](https://github.com/CB2U/edgereader/issues)
- **Discussions:** [GitHub Discussions](https://github.com/CB2U/edgereader/discussions)
- **Matrix:** `#edgereader:matrix.org` _(coming soon)_

## 💝 Support

EdgeReader is free and always will be. If you find it useful, consider:

- ⭐ Starring this repo
- 🐦 Sharing on social media
- ☕ [Buy me a coffee](https://ko-fi.com/CB2U) _(optional, coming soon)_
- 🤝 Contributing code or documentation

## 🚀 Deployment

EdgeReader can be deployed to any static hosting service:

**Recommended platforms:**

- [Vercel](https://vercel.com/) - Zero-config deployment
- [Netlify](https://www.netlify.com/) - Automatic HTTPS + CDN
- [Cloudflare Pages](https://pages.cloudflare.com/) - Global edge network
- [GitHub Pages](https://pages.github.com/) - Free for public repos

**Deploy with Antigravity:**

```bash
# Antigravity handles build + deployment automatically
antigravity deploy
```

---

**Built with ❤️ for privacy**

_"Computing at the edge, privacy at the core."_
