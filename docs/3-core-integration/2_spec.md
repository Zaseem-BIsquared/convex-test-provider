# Core Integration Specification

> GitHub Issue: [#3](https://github.com/siraj-samsudeen/feather-testing-convex/issues/3)

## Overview

Add `feather-testing-core` as a runtime dependency and expose two new subpath exports (`./playwright` and `./rtl`) that provide Convex-aware wrappers around the core Session DSL.

## Requirements

### R1: Playwright subpath (`feather-testing-convex/playwright`)

Export `createConvexTest(options)` that:
- Accepts `{ convexUrl: string, clearAll: FunctionReference<"mutation"> }`
- Returns a Playwright `test` object extended with:
  - `session` fixture (from feather-testing-core)
  - `_convexCleanup` auto-fixture that calls `clearAll` mutation after each test

### R2: RTL subpath (`feather-testing-convex/rtl`)

Export `renderWithSession(ui, client, options?)` that:
- Calls `renderWithConvexAuth(ui, client, options)` internally
- Creates and returns a `Session` from feather-testing-core/rtl
- Single call replaces the current two-call pattern

### R3: No re-exports

The new modules only export Convex-specific wrappers. Types like `Session` flow through via TypeScript inference.

## Constraints

### C1: Optional peer dependencies

`@playwright/test` and `@testing-library/user-event` must be optional peer dependencies — not all consumers use both.

### C2: ES2022 target

Bump TypeScript target to ES2022 for `Error.cause` support (required by feather-testing-core).

### C3: Backward compatibility

Existing exports (`.` and `./vitest-plugin`) must remain unchanged.

## Acceptance Criteria

- [ ] `npm run build` produces `dist/playwright/index.js` and `dist/rtl/index.js`
- [ ] Existing `dist/index.js` and `dist/vitest-plugin.js` still exist
- [ ] feather-example-app's 7 vitest tests pass with updated imports
- [ ] feather-example-app's 1 Playwright E2E test passes with updated fixtures
- [ ] feather-example-app no longer directly depends on `feather-testing-core`
