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
      async ({}, use) => {
        await use();
        await client.mutation(clearAll);
      },
      { auto: true },
    ],
  });
}
