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

  Prompt 2 — Incremental: Item Detail Tests

  Act as Senior SDET. Extend an existing TypeScript + Playwright framework
  for https://www.saucedemo.com/.

  ---
  GOLDEN FILE CONSTRAINT for page object to look for: src/pages/LoginPage.ts
  The following files already exist and must NOT be regenerated or modified
  unless a BaseTest.ts fixture update is required:
    playwright.config.ts, globalSetup.ts, tsconfig.json, package.json,
    .env.example, README.md,
    src/pages/BasePage.ts, src/pages/LoginPage.ts,
    src/components/SiteHeader.ts,
    src/data/users.ts,
    src/fixtures/BaseTest.ts, src/fixtures/index.ts,
    src/utils/urlBuilder.ts, src/utils/waitHelpers.ts,
    tests/e2e/login.spec.ts, tests/e2e/navigation.spec.ts

  Reuse the existing auth strategy (storageState: '.auth/session.json'),
  project names ('authenticated' / 'unauthenticated'), fixture pattern
  (test.extend), data factory pattern, and BasePage inheritance.
  Output only the files listed below.

  ---
  NEW FILES TO GENERATE
  src/pages/    ItemDetailPage
  tests/e2e/    itemDetail.spec.ts

  UPDATED FILE
  src/fixtures/BaseTest.ts  — add itemPage: ItemDetailPage fixture,
                              keep all existing fixtures unchanged

  ---
  SITE CONTEXT FOR THIS SCOPE
  - Route: /inventory-item.html?id=N (requires authentication)
  - Detail page elements: product name, description, price, image,
    Add to Cart button (becomes "Remove" after click)
  - Back to Products button returns to /inventory.html
  - Cart badge in SiteHeader reflects item count

  ---
  CLEAN CODE RULES — same as golden file
  1. All locators in ItemDetailPage only — no raw selectors in tests
  2. Tests call page object methods only; no expect() inside page objects
  3. No waitForTimeout()
  4. No inline strings — import from existing src/data/users.ts if needed
  5. itemDetail.spec.ts tagged with project: 'authenticated'

  ---
  3 TEST SCENARIOS — implement all, one test() per scenario

  itemDetail.spec.ts  (project: authenticated)
    TC-ITEM-01 @smoke
      Given I navigate to /inventory.html and click the first product name
      Then URL contains /inventory-item.html
      And product name, description, price, image, and Add to Cart button
      are all visible and enabled

    TC-ITEM-02 @regression
      Given I am on an item detail page
      When I click Add to Cart
      Then the cart badge in SiteHeader shows 1
      And the button text changes to "Remove"

    TC-ITEM-03 @regression
      Given I am on an item detail page
      When I click Back to Products
      Then URL is /inventory.html

  ---
  KEY LOCATORS — ItemDetailPage
    product name    → [data-test="inventory-item-name"]
    product desc    → [data-test="inventory-item-desc"]
    product price   → [data-test="inventory-item-price"]
    product image   → img.inventory_item_img
    add to cart btn → [data-test^="add-to-cart"]
    back button     → [data-test="back-to-products"]

  ---
  OUTPUT: only the 3 files listed under NEW FILES and UPDATED FILE.
  No placeholders, no TODOs, no inline comments explaining what the code does.
  Each file must compile and run against the live site without modification.

  Prompt 3 — Incremental: Inventory Tests

  Act as Senior SDET. Extend an existing TypeScript + Playwright framework
  for https://www.saucedemo.com/.

  ---
  GOLDEN FILE CONSTRAINT for page object to look for: src/pages/LoginPage.ts
  The following files already exist and must NOT be regenerated or modified
  unless a BaseTest.ts fixture update is required:
    playwright.config.ts, globalSetup.ts, tsconfig.json, package.json,
    .env.example, README.md,
    src/pages/BasePage.ts, src/pages/LoginPage.ts, src/pages/ItemDetailPage.ts,
    src/components/SiteHeader.ts,
    src/data/users.ts,
    src/fixtures/BaseTest.ts, src/fixtures/index.ts,
    src/utils/urlBuilder.ts, src/utils/waitHelpers.ts,
    tests/e2e/login.spec.ts, tests/e2e/navigation.spec.ts,
    tests/e2e/itemDetail.spec.ts

  Reuse the existing auth strategy (storageState: '.auth/session.json'),
  project names ('authenticated' / 'unauthenticated'), fixture pattern
  (test.extend), data factory pattern, and BasePage inheritance.
  Output only the files listed below.

  ---
  NEW FILES TO GENERATE
  src/pages/      InventoryPage
  src/components/ InventoryItem
  src/data/       inventory.ts
  tests/e2e/      inventory.spec.ts

  UPDATED FILE
  src/fixtures/BaseTest.ts  — add inventoryPage: InventoryPage fixture,
                              keep all existing fixtures unchanged

  ---
  SITE CONTEXT FOR THIS SCOPE
  - Route: /inventory.html (requires authentication)
  - 6 products displayed in a grid; each is an .inventory_item element
  - Each card has: name, price (format $X.XX), image, Add to Cart button
  - Sort dropdown filters the grid by name or price
  - Cart badge in SiteHeader reflects item count
  - InventoryItem component is scoped to a single .inventory_item root locator;
    it is reused by both InventoryPage (grid) and any future cart-adjacent views

  ---
  CLEAN CODE RULES — same as golden file
  1. All locators in InventoryPage and InventoryItem only — no raw selectors in tests
  2. InventoryItem takes a root Locator in its constructor (not Page)
  3. isImageLoaded() evaluated via locator.evaluate() inside InventoryItem
  4. Tests call page object methods only; no expect() inside page objects
  5. No waitForTimeout()
  6. inventory.ts exports typed constants and a firstProduct() factory used in TC-INV-03
  7. inventory.spec.ts tagged with project: 'authenticated'

  ---
  3 TEST SCENARIOS — implement all, one test() per scenario

  inventory.spec.ts  (project: authenticated)
    TC-INV-01 @smoke
      Given I navigate to /inventory.html
      Then exactly 6 product cards are visible
      And each card has non-empty name, price matching /^\$\d+\.\d{2}$/,
          loaded image (naturalWidth > 0), and enabled Add to Cart button

    TC-INV-02 @regression
      Given I navigate to /inventory.html
      When I select "Price (low to high)" from the sort dropdown
      Then the first product price is ≤ the last product price

    TC-INV-03 @smoke
      Given I navigate to /inventory.html
      When I click Add to Cart on the first product card
      Then the cart badge in SiteHeader shows 1

  ---
  KEY LOCATORS
  InventoryPage:
    page title      → .title
    sort dropdown   → [data-test="product-sort-container"]
    product cards   → .inventory_item  (returns Locator for all cards)

  InventoryItem (component — root is one .inventory_item Locator):
    product name    → .inventory_item_name
    product price   → .inventory_item_price
    product image   → img.inventory_item_img
    add to cart btn → button[data-test^="add-to-cart"]

  ---
  OUTPUT: only the 5 files listed under NEW FILES and UPDATED FILE.
  No placeholders, no TODOs, no inline comments explaining what the code does.
  Each file must compile and run against the live site without modification.

