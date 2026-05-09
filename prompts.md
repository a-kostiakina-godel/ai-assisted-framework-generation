Prompt 1 - Initial Framework: Login + Navigation

  Act as Senior SDET.
Generate a TypeScript + Playwright e2e test framework

  for
https://www.saucedemo.com/ (Swag Labs React SPA demo, no backend to mock).

  SITE CONTEXT

- All routes require
  authentication; successful login redirects to /inventory.html
- Session stored as a cookie
- Users:
  standard_user (valid), locked_out_user (blocked). Password: secret_sauce
- Routes in scope: /
  (login), /inventory.html
- Hamburger menu on
  post-login pages: contains Logout link

  STACK & CONFIG

- TypeScript strict
  mode, Playwright test runner
- Chromium only,
  fullyParallel: true, workers: CI=4 / local=2,

  retries: CI=1 /
  local=0
- baseURL from
  process.env.BASE_URL, default https://www.saucedemo.com
- Reporter: ['html']
  always
- screenshot/video/trace: retain-on-failure only
- globalSetup.ts:
  logs in as standard_user, saves storageState to .auth/session.json

playwright.config.ts defines two projects:

'authenticated'   → use: {
storageState: '.auth/session.json' }

'unauthenticated' → use: {}

- login.spec.ts
  tagged with project: 'unauthenticated'
- navigation.spec.ts
  tagged with project: 'authenticated'
- .auth/ added to
  .gitignore

  FOLDER STRUCTURE -
generate only these files

  src/pages/        BasePage, LoginPage

  src/components/   SiteHeader

  src/data/         users.ts

  src/fixtures/     BaseTest.ts, index.ts

  src/utils/        urlBuilder.ts, waitHelpers.ts

  tests/e2e/        login.spec.ts, navigation.spec.ts

  globalSetup.ts

playwright.config.ts, .env.example, README.md

  CLEAN CODE RULES -
enforce in every file

1. PascalCase
   classes, camelCase methods, no abbreviations
2. All locators
   defined in page objects only - zero raw selectors in tests
3. Tests call page
   object methods only; no expect() inside page objects
4. Use test.extend()
   fixtures - no new PageObject(page) inside tests
5. No
   waitForTimeout() - use expect(locator).toBeVisible() or

waitForLoadState('domcontentloaded')

6. src/data/
   factories provide all test data - no inline strings in tests
7. BasePage stays
   thin: navigate(path), waitForPageLoad(), getPageTitle()
8. SiteHeader
   component justified: reused across all post-login pages
9. globalSetup uses
   Playwright's chromium directly, not test fixtures

  PARALLELISM &
ISOLATION RULES

- Every test is
  self-contained: navigate → act → assert, no shared state
- No beforeAll that
  mutates state; beforeEach for navigation only
- No
  test.describe.serial anywhere

  4 TEST SCENARIOS —
implement all, one test() per scenario

  login.spec.ts  (project: unauthenticated)

    TC-LOGIN-01 @smoke

    Given I open /

    When I fill
standard_user credentials and click Login

    Then URL is
/inventory.html and page title is visible

    TC-LOGIN-02
@regression

    Given I open /

    When I fill
locked_out_user credentials and click Login

    Then error
banner is visible and contains "locked out"

    TC-LOGIN-03
@regression

    Given I open /

    When I click
Login with both fields empty

    Then error
banner is visible and contains "Username is required"

navigation.spec.ts  (project:
authenticated)

    TC-NAV-01 @smoke

    Given I am on
/inventory.html

    When I open the
hamburger menu and click Logout

    Then URL is /
and the login form is visible

---

  KEY LOCATORS

  LoginPage:

    username
field  → [data-test="username"]

    password
field  → [data-test="password"]

    login button    → [data-test="login-button"]

    error banner    → [data-test="error"]

  SiteHeader
(component — present on all post-login pages):

    cart link       → .shopping_cart_link

    cart badge      → .shopping_cart_badge

    hamburger btn   → #react-burger-menu-btn

    logout link     → #logout_sidebar_link

  OUTPUT: no placeholders, no TODOs, no inline comments explaining what the code does. Each file must
compile and run against the live site without modification.
