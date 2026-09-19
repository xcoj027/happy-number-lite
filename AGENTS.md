# AGENTS.md

Short guide for AI agents working on **Happy Number** — the open-source project of **math-hero**.

---

## Project Overview

Happy Number is a client-side-only math learning game for elementary-school children. A child picks a grade, plays through math questions, and sees a score. No server, multiplayer, accounts, or analytics.

---

## Restrictions

1. **Dependencies:** Don't add/remove packages without user approval.
2. **Secrets:** Never commit credentials, API keys, or personal data.
3. **No emojis** in UI, code, comments, or assets.
4. **i18n:** English-only UI. Write all user-facing text directly in components (no i18n layer).
5. **No new frameworks** — reuse existing design system and store.
6. **Clean code:** Keep comments brief, no dead/commented-out code, no components > 800 lines.

---

## AI Agent Workflow: Before Making Changes

Before implementing any new feature or change, ask the user (one at a time, in order) and wait for each answer:

1. **Change type:** Is this a bug fix, new feature, or improvement?
2. **Screen(s) affected:** Which screen(s) will be touched? (`home`, `play`, game screens, `result`, shared components, etc.)
3. **Description:** What should change and why?
4. **Example:** If any — current vs expected behavior or sample input/output.
5. **Expectation / verification:** What is the expected outcome, and how will success be verified?

Then follow the rules:

- Respect **Restrictions**, **Code Conventions**, and the **design system** (global SCSS variables in `src/styles/global.scss`, reuse existing components, no new frameworks).
- Keep changes clean and minimal — brief comments, no dead or commented-out code, no components > 800 lines.
- Ensure **no regression bugs**: search for shared state/slices, routes, and reusable components that the change touches, and re-check the whole flow `/` → `/play` → `/result`.

---

## Verify After Changes

Run before reporting done:

- `npm run typecheck`
- `npm run lint`
- `npm run build`

---

## Code Conventions

- **State:** Redux Toolkit slices for global state; local state for per-screen logic.
- **Routing:** `WorkflowGuard` enforces flow: `/` → `/play` → `/result`.
- **Styling:** Global SCSS variables in `src/styles/global.scss`. Mobile-first, no overflow. Do NOT use SCSS Modules.
- **Game content:** Questions from `src/quiz` generators.
