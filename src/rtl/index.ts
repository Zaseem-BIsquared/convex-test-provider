import { createSession } from "feather-testing-core/rtl";
import { renderWithConvexAuth } from "../helpers.js";
import type { ReactElement } from "react";

export function renderWithSession(
  ui: ReactElement,
  client: unknown,
  options?: { authenticated?: boolean; signInError?: Error }
) {
  renderWithConvexAuth(ui, client, options);
  return createSession();
}
