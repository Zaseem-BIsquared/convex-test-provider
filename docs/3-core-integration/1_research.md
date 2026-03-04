# Core Integration Research

> GitHub Issue: [#3](https://github.com/siraj-samsudeen/feather-testing-convex/issues/3)

## Context

Phase 3 of feather-testing-convex: integrate `feather-testing-core`'s fluent Session DSL so consumers get a single-package experience for Convex-aware testing with both Playwright and React Testing Library.

### The Problem

Currently, `feather-example-app` imports from two packages:

```typescript
// RTL tests — two imports, two calls
import { renderWithConvexAuth } from "convex-test-provider";
import { createSession } from "feather-testing-core/rtl";
renderWithConvexAuth(<App />, client, options);
const session = createSession();

// E2E tests — manual cleanup boilerplate
import { test as featherTest } from "feather-testing-core/playwright";
import { ConvexHttpClient } from "convex/browser";
const client = new ConvexHttpClient(convexUrl);
export const test = featherTest.extend<{ _cleanup: void }>({
  _cleanup: [async ({}, use) => { await use(); await client.mutation(api.testing.clearAll); }, { auto: true }],
});
```

Consumers must wire up Convex cleanup manually and compose two separate APIs.

## Ecosystems Consulted

### Phoenix LiveView Testing
- Test setup is always a single `use` macro that composes all layers
- No manual wiring between database cleanup and test DSL

### Playwright Fixtures
- `test.extend()` composes fixtures from multiple sources
- Automatic fixtures (`{ auto: true }`) handle teardown invisibly

## Options Considered

### How to pass Convex config to Playwright fixture

| Option | Pros | Cons | Decision |
|--------|------|------|----------|
| Environment variables | Zero args | Magic, hard to debug | Rejected |
| Function arguments | Explicit, type-safe | Slightly more verbose | **Chosen** |

### Re-export strategy

| Option | Pros | Cons | Decision |
|--------|------|------|----------|
| Re-export Session, StepError, etc. | One import source | Coupling, version conflicts | Rejected |
| No re-exports; types flow via inference | Clean separation, less coupling | Consumer may need feather-testing-core for advanced use | **Chosen** |

## Key Q&A

**Q: Should feather-testing-core be a peer dependency or runtime dependency?**
A: Runtime dependency. It's an implementation detail of our wrappers, not something the consumer needs to install separately.

**Q: What about @playwright/test — runtime or peer?**
A: Optional peer dependency. Not every consumer runs E2E tests, and Playwright is heavy.

## Final Design

Two new subpath exports:
- `feather-testing-convex/playwright` — `createConvexTest({ convexUrl, clearAll })` returns extended Playwright test with session + auto-cleanup
- `feather-testing-convex/rtl` — `renderWithSession(ui, client, options?)` combines render + session creation
