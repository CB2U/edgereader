# Privacy Policy

**Effective Date:** December 31, 2025

EdgeReader is built with a "Privacy First" architecture. Our goal is to provide a rich news experience without ever collecting your personal data or tracking your reading habits.

## 1. Data Storage
All your preferences, selected topics, keywords, and cached articles are stored **locally on your device** using IndexedDB and LocalStorage. 
- This data never leaves your device.
- We do not have servers that store your profiles or reading history.

## 2. Anonymous Error Reporting
To help us maintain app stability, EdgeReader includes optional error reporting via Sentry.

### What is collected?
When an error occurrs (and if reporting is enabled), we receive:
- **Stack Trace:** The technical details of where the code failed.
- **App Version:** To know which version needs fixing.
- **Environment:** Basic info about your Browser (e.g., Chrome/Firefox) and Operating System (e.g., Linux/Windows).

### What is NOT collected? (PII Scrubbing)
We use strict PII (Personally Identifiable Information) scrubbing before any report is sent.
- **NO User IDs:** We do not collect your IP address or assign any unique IDs.
- **NO URLs:** We do not collect the URLs of articles you are reading.
- **NO Breadcrumbs:** We do not track the steps you took before the error occurred.
- **NO Input Data:** We never collect keywords or search terms.

### Opt-Out
Error reporting is enabled by default to help us improve the app, but you have full control. You can disable it at any time:
1. Open the **Settings** (cogwheel icon in the top right).
2. Toggle off **Anonymous Error Reporting**.
3. All future reporting will be immediately disabled for that device.

## 3. Third-Party Requests
EdgeReader fetches news directly from RSS feeds and APIs. When your browser makes these requests, the source website may see your IP address as part of a standard web request, just like visiting any website directly. We recommend using a VPN or Tor if you wish to mask your IP from these third-party sources.

---
**EdgeReader: Your content, your device, zero tracking.**
