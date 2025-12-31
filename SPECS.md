# EdgeReader Spec Index

**Version:** 1.0  
**Last Updated:** December 30, 2025  
**Purpose:** Track all feature specifications and their implementation status

---

## How to Use This Index

1. **Before starting work:** Check status to avoid duplicate effort
2. **When creating a spec:** Add a new row with status "In progress"
3. **When completing an epic:** Update status to "Done"
4. **Reference:** Link to spec folder for full details

---

## Spec Status Legend

| Status | Meaning |
|--------|---------|
| **Not started** | Epic defined in roadmap but no spec created yet |
| **In progress** | Spec created, implementation underway |
| **Done** | All exit criteria met, epic complete |
| **Blocked** | Waiting on dependency (another epic or external factor) |
| **Deferred** | Postponed to later breakpoint or post-MVP |

---

## MVP Specs (BP0-BP5)

| Roadmap Anchor | Epic Name | Spec Folder | Breakpoint | Status | Target ACs |
|----------------|-----------|-------------|------------|--------|------------|
| 1.0 | Project Setup & Repository | [specs/010-project-setup/](file:///mnt/Storage/Documents/Projects/EdgeReader/specs/010-project-setup/) | BP0 | Done | AC-13 |
| 1.1 | RSS Feed Parsing Foundation | [specs/011-rss-parsing/](file:///mnt/Storage/Documents/Projects/EdgeReader/specs/011-rss-parsing/) | BP0 | Done | FR-1 (partial), NFR-1, AC-1 (partial) |
| 1.2 | Multi-Source Aggregation (10+ Sources) | [specs/012-multi-source/](file:///mnt/Storage/Documents/Projects/EdgeReader/specs/012-multi-source/) | BP1 | Done | FR-1, AC-1 |
| 1.3 | External Browser Integration | [specs/013-external-browser/](file:///mnt/Storage/Documents/Projects/EdgeReader/specs/013-external-browser/) | BP1 | Done | FR-6, AC-4, NFR-1 |
| 2.0 | User Preferences Storage | `specs/005-preferences-storage/` | BP2 | Not started | FR-2, FR-3, AC-3, NFR-1 |
| 2.1 | On-Device Ranking Algorithm | `specs/006-ranking-algorithm/` | BP2 | Not started | FR-4, AC-2, AC-6 |
| 2.2 | Onboarding Flow | `specs/007-onboarding/` | BP2 | Not started | FR-7, AC-5, NFR-5 |
| 3.0 | Local Database (Room) | `specs/008-room-database/` | BP3 | Not started | FR-10, AC-7 |
| 3.1 | Offline Mode & Pull-to-Refresh | `specs/009-offline-mode/` | BP3 | Not started | FR-9, FR-10, AC-7 |
| 4.0 | Crash Reporting with Opt-Out | `specs/010-crash-reporting/` | BP4 | Not started | FR-11, FR-12, AC-9, AC-10, NFR-2 |
| 4.1 | Settings Screen | `specs/011-settings-screen/` | BP4 | Not started | FR-8, AC-6, AC-9 |
| 4.2 | UI Polish & Material Design 3 | `specs/012-ui-polish/` | BP4 | Not started | FR-5, AC-12, NFR-5 |
| 5.0 | Privacy Policy & Legal Compliance | `specs/013-privacy-policy/` | BP5 | Not started | NFR-6, AC-11 |
| 5.1 | Testing & Release Preparation | `specs/014-release-prep/` | BP5 | Not started | AC-8, AC-11, NFR-3, NFR-4 |

---

## Post-MVP Specs (BP6)

| Roadmap Anchor | Epic Name | Spec Folder | Breakpoint | Status | Target ACs |
|----------------|-----------|-------------|------------|--------|------------|
| 6.0 | Dark Mode | `specs/015-dark-mode/` | BP6 | Not started | User Story #9 (P1) |
| 6.1 | Bookmarks / Save for Later | `specs/016-bookmarks/` | BP6 | Not started | User Story #8 (P1) |
| 6.2 | Search & Keyword Filtering | `specs/017-search/` | BP6 | Not started | User Story #7 (P1) |
| 6.3 | Custom RSS Feeds | `specs/018-custom-rss/` | BP6 | Not started | User Story #6 (P1) |

---

## Breakpoint Summary

| Breakpoint | Description | Epics | Status |
|------------|-------------|-------|--------|
| **BP0** | Project foundation | 1.0, 1.1 | Not started |
| **BP1** | Core aggregation | 1.2, 1.3 | Not started |
| **BP2** | Personalization | 2.0, 2.1, 2.2 | Not started |
| **BP3** | Offline & caching | 3.0, 3.1 | Not started |
| **BP4** | Privacy & polish | 4.0, 4.1, 4.2 | Not started |
| **BP5** | Release ready | 5.0, 5.1 | Not started |
| **BP6** | Post-MVP features | 6.0, 6.1, 6.2, 6.3 | Not started |

---

## Quick Links

- **PRD:** [PRD.md](PRD.md)
- **Constitution:** [constitution.md](constitution.md)
- **Roadmap:** [roadmap.md](roadmap.md)
- **SOP:** [docs/SOP-speckit-antigravity.md](docs/SOP-speckit-antigravity.md)
- **Test Matrix:** [docs/TEST-MATRIX.md](docs/TEST-MATRIX.md)
- **Decisions:** [docs/DECISIONS.md](docs/DECISIONS.md)

---

## Maintenance Notes

### Adding a New Spec
1. Determine next sequential number (NNN)
2. Create folder: `specs/NNN-epic-slug/`
3. Add row to appropriate table (MVP or Post-MVP)
4. Set status to "In progress"
5. Commit with message: `Add spec index entry for Epic X.Y`

### Updating Status
1. When epic is complete, change status to "Done"
2. Update breakpoint summary if all epics in BP are done
3. Commit with message: `Mark Epic X.Y as done`

### Blocking an Epic
1. Change status to "Blocked"
2. Add note in spec folder's README explaining blocker
3. Update when blocker is resolved

---

**Document Version:** 1.0  
**Maintained By:** Project maintainer (solo dev)  
**Next Review:** After each breakpoint completion

**Change Log:**
- 2025-12-30: Initial spec index created with all MVP and post-MVP epics
