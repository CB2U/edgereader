---
trigger: always_on
glob:
description:
# Automation Permissions

- Antigravity is authorized to set `SafeToAutoRun: true` for the following tools when the action is non-destructive and relevant to testing or verification:
  - `execute_browser_javascript` (e.g., for state checks, event dispatching)
  - `run_command` (for `npm test`, `npm run lint`, etc.)
  - `browser_subagent`
- The agent should still exercise judgment and request approval for any action that deletes files, modifies git history, or makes external network requests not already defined in the PRD.
---


