# Documentation Improvement Research

> GitHub Issue: Documentation improvement for LLM usability

## Context

LLMs reading the current README don't discover or use important features like `session.within()`, `renderWithSession()`, and the fluent Session DSL. They default to writing isolated unit tests (backend-only + component-only with mocks) instead of the true integration tests this library enables.

## Key Findings

### Problem 1: LLMs follow the popular pattern
The dominant testing pattern in React tutorials is:
- Separate backend unit tests 
- Component tests with mocked hooks (`vi.mock("convex/react")`)

LLMs replicate this pattern even when `feather-testing-convex` is available, because the README doesn't strongly enough articulate **why** integration tests are better and **when** mocks are still appropriate.

### Problem 2: Feature discoverability
Features like `within()`, `renderWithSession()`, and the Session DSL from `feather-testing-core` are not documented in the README at all. LLMs can't use what they don't know exists.

### Problem 3: Before/after examples are most effective for LLMs
Research shows LLMs learn patterns most effectively from concrete before/after code examples. The current README has some, but not for all features.

## Decision

Rewrite README with:
1. Philosophy section leading with integration-first approach
2. Before/after examples for every feature
3. Full Session DSL documentation
4. Complete API reference
