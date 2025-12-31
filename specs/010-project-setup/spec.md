# Spec: Project Setup & Repository

**Roadmap anchor:** [roadmap.md 1.0](file:///mnt/Storage/Documents/Projects/EdgeReader/docs/roadmap.md#epic-10-project-setup--repository)  
**Priority:** P0  
**Type:** Feature  
**Target area:** Project foundation, build system, repository structure  
**Target Acceptance Criteria:** AC-13

---

## Problem Statement

EdgeReader needs a solid foundation to support PWA development with Antigravity. Currently, no project structure exists. We need to initialize a React-based PWA with proper tooling (Vite), Material Design 3 components (Material UI), and open-source licensing (GPL-3.0) to enable rapid, maintainable development while ensuring transparency and preventing commercial exploitation.

Without this foundation, subsequent epics cannot proceed. The setup must align with Antigravity's native capabilities (React + Vite) and establish patterns that support the privacy-first, client-side architecture defined in the PRD.

---

## Goals and Non-Goals

### Goals
- Initialize a working React + Vite + Material UI PWA project
- Establish clear folder structure for components, services, and utilities
- Configure PWA manifest for installability
- Add GPL-3.0 license and comprehensive README
- Ensure project builds without errors
- Set up basic development workflow (dev server, build)

### Non-Goals
- CI/CD pipeline setup (manual deployment for MVP)
- Automated testing infrastructure (will be added per-epic as needed)
- Advanced build optimizations (will be addressed in Epic 5.1)
- Custom domain configuration (deployment phase)
- Service Worker implementation (Epic 3.1)

---

## User Stories

1. **As a developer**, I want a properly initialized React project so I can start building features immediately without configuration overhead.

2. **As a developer**, I want a clear folder structure so I know where to place components, services, and utilities consistently.

3. **As a developer**, I want Material UI integrated so I can build a modern, accessible UI without custom styling from scratch.

4. **As an open-source contributor**, I want to see the GPL-3.0 license clearly stated so I understand the terms of use and contribution.

5. **As a user**, I want the app to be installable as a PWA so I can add it to my home screen for quick access.

---

## Scope

### In-Scope
- React 18+ project initialization
- Vite build tool configuration
- Material UI (MUI v5+) integration
- Basic folder structure: `src/components/`, `src/services/`, `src/utils/`
- PWA manifest.json with app metadata and icons
- GPL-3.0 LICENSE file
- README.md with project description, setup instructions, and license notice
- package.json with core dependencies
- Basic App.jsx and main.jsx entry points
- Development server configuration
- Build verification (npm run build succeeds)

### Out-of-Scope
- Service Worker implementation (Epic 3.1)
- IndexedDB setup (Epic 2.0, 3.0)
- RSS parsing libraries (Epic 1.1)
- UI components beyond basic Material UI setup
- Testing framework setup (will be added per-epic)
- Linting and formatting configuration (nice-to-have, not blocking)
- GitHub Actions or CI/CD
- Deployment to hosting (Epic 5.1)
- Custom domain configuration
- Environment variable management (will add as needed)

---

## Requirements

### Functional Requirements

**FR-1.0.1:** Initialize React 18+ project with Vite build tool.

**FR-1.0.2:** Install and configure Material UI (MUI v5+) with basic theming.

**FR-1.0.3:** Create folder structure with at least:
- `src/components/` (for React components)
- `src/services/` (for business logic and API calls)
- `src/utils/` (for helper functions)
- `public/` (for static assets and manifest)

**FR-1.0.4:** Create PWA manifest.json with:
- App name: "EdgeReader"
- Short name: "EdgeReader"
- Description: "Privacy-focused news aggregator"
- Display mode: "standalone"
- Theme color and background color
- Icon placeholders (192x192 and 512x512)

**FR-1.0.5:** Add GPL-3.0 LICENSE file to repository root.

**FR-1.0.6:** Create README.md with:
- Project description and tagline
- Setup instructions (npm install, npm run dev)
- License notice (GPL-3.0)
- Link to PRD or project documentation

**FR-1.0.7:** Project must build successfully with `npm run build` without errors.

**FR-1.0.8:** Development server must start with `npm run dev` and display a basic "Hello EdgeReader" page.

### Non-Functional Requirements

**NFR-1.0.1 (Maintainability):** Folder structure must support solo developer maintenance with clear separation of concerns.

**NFR-1.0.2 (Legal/Compliance):** GPL-3.0 license must be clearly visible in LICENSE file and mentioned in README.md.

**NFR-1.0.3 (Performance):** Initial bundle size should be reasonable (no specific target yet, will be measured in Epic 5.1).

**NFR-1.0.4 (Developer Experience):** Development server hot reload must work for rapid iteration.

**NFR-1.0.5 (Security):** No hardcoded secrets or API keys in repository.

### Constraints Checklist

- ✅ **Security:** No secrets in code, HTTPS-only in production (handled by hosting)
- ✅ **Privacy:** No analytics or tracking SDKs in initial setup
- ⚠️ **Offline behavior:** Not applicable for this epic (Epic 3.1)
- ⚠️ **Performance:** Basic setup only, optimization in Epic 5.1
- ⚠️ **Observability:** Not applicable for this epic (error reporting in Epic 4.0)

---

## Acceptance Criteria

**AC-13 (from PRD):** Given the code is published on GitHub, when a third party views the repository, then the GPL-3.0 license is clearly stated in LICENSE file and README.

**Verification approach:** Manual inspection of LICENSE file and README.md. Verify LICENSE contains full GPL-3.0 text and README mentions the license with a clear statement.

**AC-1.0.1 (Local):** Given the project is initialized, when `npm install` is run, then all dependencies install without errors.

**Verification approach:** Run `npm install` in a fresh clone and verify no error messages appear.

**AC-1.0.2 (Local):** Given the project is set up, when `npm run dev` is executed, then the development server starts and displays a basic page at http://localhost:5173 (or configured port).

**Verification approach:** Run `npm run dev`, open browser to localhost, verify page loads with "EdgeReader" or basic content.

**AC-1.0.3 (Local):** Given the project is configured, when `npm run build` is executed, then the build completes successfully and generates a `dist/` folder.

**Verification approach:** Run `npm run build`, verify no errors in console, check that `dist/` folder exists with HTML, JS, and CSS files.

**AC-1.0.4 (Local):** Given the folder structure is created, when the repository is inspected, then `src/components/`, `src/services/`, and `src/utils/` directories exist.

**Verification approach:** Manual inspection of folder structure using file explorer or `ls -la src/`.

**AC-1.0.5 (Local):** Given Material UI is installed, when App.jsx is inspected, then at least one Material UI component is imported and rendered (e.g., Button, Typography, or Container).

**Verification approach:** Open App.jsx and verify Material UI import statement and component usage.

**AC-1.0.6 (Local):** Given the PWA manifest is configured, when `public/manifest.json` is inspected, then it contains name, short_name, description, display, theme_color, background_color, and icons array.

**Verification approach:** Open `public/manifest.json` and verify all required fields are present.

---

## Dependencies

### Epic Dependencies
- **None** (this is the starting point for the project)

### Technical Dependencies
- **Node.js:** Version 18+ (for Vite and React 18)
- **npm or yarn:** Package manager
- **Antigravity:** Development environment (assumed available)
- **Browser:** Modern browser for testing (Chrome, Firefox, Safari)

### External Libraries
- `react` (^18.0.0)
- `react-dom` (^18.0.0)
- `@mui/material` (^5.0.0)
- `@mui/icons-material` (^5.0.0)
- `@emotion/react` and `@emotion/styled` (peer dependencies for MUI)
- `vite` (^5.0.0)
- `@vitejs/plugin-react` (for Vite + React)

---

## Risks and Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| **Vite configuration issues with Antigravity** | Medium | Low | Use standard Vite + React template (`npm create vite@latest`). Antigravity supports Vite natively. |
| **Material UI version conflicts** | Low | Low | Use latest stable MUI v5. Check peer dependency warnings during install. |
| **PWA manifest not recognized** | Low | Medium | Follow standard manifest.json format. Test with Chrome DevTools Application tab. |
| **GPL-3.0 license misunderstood by contributors** | Low | Medium | Include clear CONTRIBUTING.md in future explaining rationale. For now, README notice is sufficient. |
| **Folder structure becomes inconsistent** | Medium | Medium | Document structure in README or CONTRIBUTING.md. Enforce during code review. |

---

## Open Questions

**No blocking open questions.** All decisions for project setup are defined in PRD and roadmap.

---

## EVIDENCE

### Task Completion Evidence

**T1: Initialize Vite + React Project**
- ✅ Vite project initialized with package name "edge-reader"
- ✅ Project structure created: package.json, vite.config.js, index.html, src/
- Command output: "Scaffolding project in /mnt/Storage/Documents/Projects/EdgeReader... Done."

**T2: Install Dependencies**
- ✅ Base dependencies installed: React 19.2.0, Vite 7.2.4
- ✅ Material UI installed: @mui/material, @emotion/react, @emotion/styled, @mui/icons-material
- ✅ Total packages: 259 packages, 0 vulnerabilities
- Command: `npm install` and `npm install @mui/material @emotion/react @emotion/styled @mui/icons-material`

**T3: Create Folder Structure**
- ✅ Created: src/components/, src/services/, src/utils/, public/icons/
- ✅ Added .gitkeep files to track empty directories
- Verified with: `ls -la src/` and `ls -la public/`

**T4: Configure PWA Manifest**
- ✅ Created public/manifest.json with all required fields
- ✅ Linked manifest in index.html: `<link rel="manifest" href="/manifest.json" />`
- ✅ Added theme-color meta tag: `<meta name="theme-color" content="#1976d2" />`
- File: [public/manifest.json](file:///mnt/Storage/Documents/Projects/EdgeReader/public/manifest.json)

**T5: Create Basic App Component with Material UI**
- ✅ Updated App.jsx with Material UI components (Container, Typography, Button, Box)
- ✅ Displays "EdgeReader" heading and tagline
- ✅ Material UI imports verified
- File: [src/App.jsx](file:///mnt/Storage/Documents/Projects/EdgeReader/src/App.jsx)

**T6: Add GPL-3.0 License**
- ✅ Downloaded GPL-3.0 license text (674 lines, 35KB)
- ✅ LICENSE file created in repository root
- ✅ Verified header: "GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007"
- File: [LICENSE](file:///mnt/Storage/Documents/Projects/EdgeReader/LICENSE)

**T7: Create README.md**
- ✅ Comprehensive README created with all required sections
- ✅ Includes project description, setup instructions, build commands
- ✅ GPL-3.0 license clearly mentioned
- File: [README.md](file:///mnt/Storage/Documents/Projects/EdgeReader/README.md)

**T8: Verify Development Server**
- ✅ Dev server started successfully on http://localhost:5173
- ✅ Page loads with "EdgeReader" heading and Material UI components
- ✅ No console errors (only minor warning about missing icon files - expected)
- ✅ Hot reload verified working
- Screenshot: edgereader_home_verification_1767159135322.png

**T9: Verify Production Build**
- ✅ Build completed successfully in 1.89s
- ✅ Generated files: dist/index.html, dist/assets/index-COcDBgFa.css (1.38 KB), dist/assets/index-Dyt6KQFg.js (300.86 KB gzipped: 97.06 KB)
- ✅ No build errors
- Command: `npm run build`

### Acceptance Criteria Verification

| AC | Status | Evidence |
|----|--------|----------|
| **AC-13** (GPL-3.0 license visible) | ✅ **PASS** | LICENSE file (674 lines) and README.md both clearly state GPL-3.0 |
| **AC-1.0.1** (Dependencies install) | ✅ **PASS** | 259 packages installed, 0 vulnerabilities |
| **AC-1.0.2** (Dev server starts) | ✅ **PASS** | Server running at localhost:5173, page displays correctly |
| **AC-1.0.3** (Build succeeds) | ✅ **PASS** | Build completed in 1.89s, dist/ folder generated |
| **AC-1.0.4** (Folder structure exists) | ✅ **PASS** | components/, services/, utils/, icons/ all created |
| **AC-1.0.5** (Material UI integrated) | ✅ **PASS** | App.jsx imports and uses Container, Typography, Button, Box |
| **AC-1.0.6** (Manifest configured) | ✅ **PASS** | manifest.json contains all required fields, linked in index.html |

**All 7 acceptance criteria verified and passing.**

---

**Status:** ✅ **COMPLETE**  
**Last Updated:** December 30, 2025  
**Implementation Time:** ~1 hour
