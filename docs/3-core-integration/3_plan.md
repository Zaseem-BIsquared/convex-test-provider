# Core Integration Plan

> GitHub Issue: [#3](https://github.com/siraj-samsudeen/feather-testing-convex/issues/3)

## Phase 1: Documentation
Create `docs/3-core-integration/{1_research,2_spec,3_plan}.md`

## Phase 2: Add dependency
- Add `feather-testing-core` as runtime dependency
- Add `@playwright/test` and `@testing-library/user-event` as optional peer deps
- Add `./playwright` and `./rtl` subpath exports
- Install dependencies

## Phase 3: Create `src/playwright/index.ts`
```typescript
import { test as featherTest } from "feather-testing-core/playwright";
import { ConvexHttpClient } from "convex/browser";
import type { FunctionReference } from "convex/server";

interface CreateConvexTestOptions {
  convexUrl: string;
  clearAll: FunctionReference<"mutation">;
}

export function createConvexTest(options: CreateConvexTestOptions) {
  const { convexUrl, clearAll } = options;
  const client = new ConvexHttpClient(convexUrl);
  return featherTest.extend<{ _convexCleanup: void }>({
    _convexCleanup: [
      async ({}, use) => { await use(); await client.mutation(clearAll); },
      { auto: true },
    ],
  });
}
```

## Phase 4: Create `src/rtl/index.ts`
```typescript
import { createSession } from "feather-testing-core/rtl";
import { renderWithConvexAuth } from "../helpers.js";
import type { ReactElement } from "react";

export function renderWithSession(ui, client, options?) {
  renderWithConvexAuth(ui, client, options);
  return createSession();
}
```

## Phase 5: Update tsconfig.json
Bump target and lib from ES2020 to ES2022.

## Phase 6: Build and verify
`npm run build` → check dist outputs.

## Phase 7: Update feather-example-app
- Replace `convex-test-provider` + `feather-testing-core` with `feather-testing-convex`
- Update `e2e/fixtures.ts` to use `createConvexTest`
- Update `src/__tests__/App.test.tsx` to use `renderWithSession`
- Update `vitest.config.ts` import path

## Phase 8: Run all tests in feather-example-app

## Phase 9: Commit both repos
