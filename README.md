# Swag Labs E2E Framework

TypeScript + Playwright end-to-end test suite for [saucedemo.com](https://www.saucedemo.com).

## Setup

```bash
npm install
npx playwright install chromium
```

Copy `.env.example` to `.env` and adjust `BASE_URL` if needed.

## Running Tests

```bash
npm test                  # all tests
npm run test:smoke        # @smoke tag
npm run test:regression   # @regression tag
npm run report            # open last HTML report
```

## Projects

| Project | Specs | Auth |
|---|---|---|
| `unauthenticated` | `login.spec.ts` | fresh context |
| `authenticated` | all other specs | storageState from `.auth/session.json` |

`globalSetup.ts` runs once before all tests: logs in as `standard_user`
and saves the session to `.auth/session.json`.

## Structure

```
src/
  pages/        Page objects (one per route)
  components/   SiteHeader — reused across all post-login pages
  data/         Typed credential factories
  fixtures/     test.extend() fixture wiring
  utils/        URL builders and wait helpers
tests/e2e/      Spec files — one per feature area
globalSetup.ts  One-time auth setup
```

## Key Rules

- All locators live in page objects; tests contain no raw selectors.
- `expect()` called only in tests, never inside page objects.
- Page objects injected via `test.extend()`; no `new PageObject(page)` in tests.
- No `waitForTimeout()` anywhere.
- Every test is fully isolated — fresh browser context, storageState provides auth only.
