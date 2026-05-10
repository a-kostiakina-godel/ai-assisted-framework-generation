Prompt 1 - AI-Self-Review

You are a Senior QA Automation Engineer.

Goal:
Review the following AI-generated code for correctness and consistency before integration.

Inputs:
src/components/SiteHeader.ts
src/utils/waitHelpers.ts

Check:

1) Does it preserve original logic and test flow?
2) Are selectors stable and correctly scoped?
3) Are all imports valid and paths real?
4) Any naming inconsistencies or typos?
5) Suggest fixes if necessary.

Output:
A structured "Self-Review Report" listing issues, risks, and recommendations.

Output:
Self-Review Report

  Files reviewed

  - src/components/SiteHeader.ts
  - src/utils/waitHelpers.ts

  ---
  1. Logic and Test Flow

  SiteHeader.ts — PASS

  All action methods match actual test usage correctly:

  ┌─────────────────────┬───────────────────────────────────────┬───────────────────────────────────────┐
  │       Method        │                Used in                │               Behavior                │
  ├─────────────────────┼───────────────────────────────────────┼───────────────────────────────────────┤
  │ openHamburgerMenu() │ navigation.spec.ts                    │ Click → wait for logoutLink visible ✓ │
  ├─────────────────────┼───────────────────────────────────────┼───────────────────────────────────────┤
  │ clickLogout()       │ navigation.spec.ts                    │ Click → domcontentloaded ✓            │
  ├─────────────────────┼───────────────────────────────────────┼───────────────────────────────────────┤
  │ getCartBadge()      │ inventory.spec.ts, itemDetail.spec.ts │ Returns locator for assertion ✓       │
  ├─────────────────────┼───────────────────────────────────────┼───────────────────────────────────────┤
  │ getCartItemCount()  │ Unused in tests                       │ Defensive parseInt with null guard ✓  │
  └─────────────────────┴───────────────────────────────────────┴───────────────────────────────────────┘

  Step ordering is correct — openHamburgerMenu() must precede clickLogout() and the code enforces this implicitly by waiting for logoutLink
   to appear before it becomes clickable.

  waitHelpers.ts — FAIL

  waitForPageLoad is never imported or called anywhere in the codebase. It is dead code. The codebase has five inline
  page.waitForLoadState('domcontentloaded') calls spread across four files:

  ┌────────────────────────────────────┬─────────────┐
  │                File                │ Occurrences │
  ├────────────────────────────────────┼─────────────┤
  │ src/pages/BasePage.ts:10           │ 1           │
  ├────────────────────────────────────┼─────────────┤
  │ src/pages/LoginPage.ts:30          │ 1           │
  ├────────────────────────────────────┼─────────────┤
  │ src/pages/ItemDetailPage.ts:36,47  │ 2           │
  ├────────────────────────────────────┼─────────────┤
  │ src/components/SiteHeader.ts:33,43 │ 2           │
  └────────────────────────────────────┴─────────────┘

  The utility was planned in the original design (initial_prompts.md) but was never integrated. The intent and the implementation diverged.

  ---
  2. Selectors

  SiteHeader.ts — WARN

  SiteHeader uses CSS classes and IDs, while every other page object and component uses data-test attributes exclusively. This is a
  consistency risk.

  ┌──────────────────────────┬───────────┬─────────────────────────────────────────────────┐
  │         Locator          │   Type    │                      Risk                       │
  ├──────────────────────────┼───────────┼─────────────────────────────────────────────────┤
  │ '.shopping_cart_link'    │ CSS class │ Fragile — class names can change in UI rebuilds │
  ├──────────────────────────┼───────────┼─────────────────────────────────────────────────┤
  │ '.shopping_cart_badge'   │ CSS class │ Fragile — same risk                             │
  ├──────────────────────────┼───────────┼─────────────────────────────────────────────────┤
  │ '#react-burger-menu-btn' │ ID        │ More stable, but tied to framework name         │
  ├──────────────────────────┼───────────┼─────────────────────────────────────────────────┤
  │ '#logout_sidebar_link'   │ ID        │ More stable                                     │
  └──────────────────────────┴───────────┴─────────────────────────────────────────────────┘

  Recommended fix — check SauceDemo's HTML for data-test attributes on these elements and align with the project convention. Example
  pattern used elsewhere:
  // consistent with LoginPage.ts, ItemDetailPage.ts, InventoryItem.ts
  this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
  this.cartLink  = page.locator('[data-test="shopping-cart-link"]');

  openHamburgerMenu() correctly uses logoutLink.waitFor({ state: 'visible' }) rather than a timeout — this is the right web-first approach.

  ---
  3. Imports and Paths

  SiteHeader.ts — PASS
  - Imports Page and Locator from @playwright/test — both real and used.
  - No BasePage extension — correct, SiteHeader is a shared component, not a page.
  - No other dependencies needed.

  waitHelpers.ts — PASS (file itself)
  - Imports Page from @playwright/test — valid.
  - The file is internally correct; the problem is it is not imported by anything else.

  ---
  4. Naming Consistency

  SiteHeader.ts — PASS with one note

  Naming is consistent with the rest of the codebase. One minor observation:

  - getHamburgerButton() and getCartBadge() expose raw locators (used for assertions in tests).
  - clickCartLink() does not expose getCartLink() — intentional since no test asserts on the link itself.
  - getCartItemCount() returns number, getCartBadge() returns Locator — these serve different purposes and the dual approach is justified,
  but is currently only partially used (tests only use the Locator path).

  waitHelpers.ts — PASS

  waitForPageLoad is clearly named. No issues.

  ---
  5. Summary and Recommendations

  #: 1
  File: waitHelpers.ts
  Severity: High
  ---
  4. Naming Consistency

  SiteHeader.ts — PASS with one note

You are a Senior QA Automation Engineer.

Goal:
Verify that the following refactor didn’t break or reduce test coverage.

Inputs:
- Refactored Page/Object:
   globalSetup.ts
   src/utils/urlBuilder.ts
   src/utils/waitHelpers.ts
   src/pages/BasePage.ts
   src/pages/LoginPage.ts
   src/pages/InventoryPage.ts
   src/pages/ItemDetailPage.ts
   src/components/SiteHeader.ts
   src/fixtures/BaseTest.ts
   src/data/users.ts
   src/data/inventory.ts
   eslint.config.mjs (new)
   package.json
- Related tests:
   tests/e2e/login.spec.ts
   tests/e2e/itemDetail.spec.ts
   tests/e2e/navigation.spec.ts

Tasks:
1) Check that all old methods still have corresponding tests.
2) Identify missing test coverage or renamed methods not updated.
3) Suggest where to update or add missing tests.
Output a "Test Coverage Report" with list of affected files and recommended updates.

  Test Coverage Report 

  Methodology

  Each public method and exported symbol in the refactored files was mapped against its actual usage across all four test files.

  ---
  src/pages/LoginPage.ts — PASS

  ┌───────────────────┬──────────────────────────┬────────┐
  │      Method       │        Tested in         │ Status │
  ├───────────────────┼──────────────────────────┼────────┤
  │ open()            │ login.spec.ts beforeEach │ ✓      │
  ├───────────────────┼──────────────────────────┼────────┤
  │ login()           │ TC-LOGIN-01, TC-LOGIN-02 │ ✓      │
  ├───────────────────┼──────────────────────────┼────────┤
  │ submitEmptyForm() │ TC-LOGIN-03              │ ✓      │
  ├───────────────────┼──────────────────────────┼────────┤
  │ getLoginButton()  │ TC-NAV-01                │ ✓      │
  ├───────────────────┼──────────────────────────┼────────┤
  │ getErrorBanner()  │ TC-LOGIN-02, TC-LOGIN-03 │ ✓      │
  └───────────────────┴──────────────────────────┴────────┘

  ---
  src/pages/InventoryPage.ts — PARTIAL

  ┌────────────────────┬──────────────────────────────┬────────────┐
  │       Method       │          Tested in           │   Status   │
  ├────────────────────┼──────────────────────────────┼────────────┤
  │ open()             │ inventory.spec.ts beforeEach │ ✓          │
  ├────────────────────┼──────────────────────────────┼────────────┤
  │ selectSortOption() │ TC-INV-02                    │ ✓          │
  ├────────────────────┼──────────────────────────────┼────────────┤
  │ getProductCards()  │ TC-INV-01                    │ ✓          │
  ├────────────────────┼──────────────────────────────┼────────────┤
  │ getItem()          │ TC-INV-03                    │ ✓          │
  ├────────────────────┼──────────────────────────────┼────────────┤
  │ getItems()         │ TC-INV-01, TC-INV-02         │ ✓          │
  ├────────────────────┼──────────────────────────────┼────────────┤
  │ getTitle()         │ —                            │ ✗ UNTESTED │
  └────────────────────┴──────────────────────────────┴────────────┘

  Recommendation: Add assertion await expect(inventoryPage.getTitle()).toHaveText('Products') to TC-INV-01.

  ---
  src/pages/ItemDetailPage.ts — PARTIAL

  ┌──────────────────────────────┬───────────────────────────────┬────────────┐
  │            Method            │           Tested in           │   Status   │
  ├──────────────────────────────┼───────────────────────────────┼────────────┤
  │ open()                       │ itemDetail.spec.ts beforeEach │ ✓          │
  ├──────────────────────────────┼───────────────────────────────┼────────────┤
  │ openFirstItemFromInventory() │ TC-ITEM-01                    │ ✓          │
  ├──────────────────────────────┼───────────────────────────────┼────────────┤
  │ clickAddToCart()             │ TC-ITEM-02                    │ ✓          │
  ├──────────────────────────────┼───────────────────────────────┼────────────┤
  │ clickBackToProducts()        │ TC-ITEM-03                    │ ✓          │
  ├──────────────────────────────┼───────────────────────────────┼────────────┤
  │ getProductName()             │ TC-ITEM-01                    │ ✓          │
  ├──────────────────────────────┼───────────────────────────────┼────────────┤
  │ getProductDesc()             │ TC-ITEM-01                    │ ✓          │
  ├──────────────────────────────┼───────────────────────────────┼────────────┤
  │ getProductPrice()            │ TC-ITEM-01                    │ ✓          │
  ├──────────────────────────────┼───────────────────────────────┼────────────┤
  │ getProductImage()            │ TC-ITEM-01                    │ ✓          │
  ├──────────────────────────────┼───────────────────────────────┼────────────┤
  │ getAddToCartButton()         │ TC-ITEM-01                    │ ✓          │
  ├──────────────────────────────┼───────────────────────────────┼────────────┤
  │ getRemoveButton()            │ TC-ITEM-02                    │ ✓          │
  ├──────────────────────────────┼───────────────────────────────┼────────────┤
  │ getBackButton()              │ —                             │ ✗ UNTESTED │
  └──────────────────────────────┴───────────────────────────────┴────────────┘

  Recommendation: Either add await expect(itemPage.getBackButton()).toBeVisible() to TC-ITEM-01, or remove the getter if no test needs to
  assert on it directly (the button behaviour is already covered via clickBackToProducts() in TC-ITEM-03).

  ---
  src/components/SiteHeader.ts — PARTIAL

  ┌──────────────────────┬───────────────────────┬────────────┐
  │        Method        │       Tested in       │   Status   │
  ├──────────────────────┼───────────────────────┼────────────┤
  │ getHamburgerButton() │ TC-LOGIN-01           │ ✓          │
  ├──────────────────────┼───────────────────────┼────────────┤
  │ getCartBadge()       │ TC-INV-03, TC-ITEM-02 │ ✓          │
  ├──────────────────────┼───────────────────────┼────────────┤
  │ openHamburgerMenu()  │ TC-NAV-01             │ ✓          │
  ├──────────────────────┼───────────────────────┼────────────┤
  │ clickLogout()        │ TC-NAV-01             │ ✓          │
  ├──────────────────────┼───────────────────────┼────────────┤
  │ clickCartLink()      │ —                     │ ✗ UNTESTED │
  └──────────────────────┴───────────────────────┴────────────┘

  Recommendation: Add a test to navigation.spec.ts that clicks the cart link and asserts the cart page URL, e.g.:
  test('TC-NAV-02: cart link navigates to cart page @smoke', ...)

  ---
  src/pages/BasePage.ts — PARTIAL

  ┌────────────────┬──────────────────────────────────┬──────────────┐
  │     Method     │          Exercised via           │    Status    │
  ├────────────────┼──────────────────────────────────┼──────────────┤
  │ navigate()     │ All open() calls in page objects │ ✓ (indirect) │
  ├────────────────┼──────────────────────────────────┼──────────────┤
  │ getPageTitle() │ —                                │ ✗ UNTESTED   │
  └────────────────┴──────────────────────────────────┴──────────────┘

  Recommendation: getPageTitle() is never called in any test or page object. Either add a title assertion to an existing test (e.g.
  TC-LOGIN-01), or remove the method if it serves no active purpose.

  ---
  src/data/users.ts — PASS

  ┌───────────────────────────┬─────────────┬────────┐
  │          Export           │   Used in   │ Status │
  ├───────────────────────────┼─────────────┼────────┤
  │ validUser()               │ TC-LOGIN-01 │ ✓      │
  ├───────────────────────────┼─────────────┼────────┤
  │ lockedUser()              │ TC-LOGIN-02 │ ✓      │
  ├───────────────────────────┼─────────────┼────────┤
  │ LoginErrors.lockedUser    │ TC-LOGIN-02 │ ✓      │
  ├───────────────────────────┼─────────────┼────────┤
  │ LoginErrors.emptyUsername │ TC-LOGIN-03 │ ✓      │
  └───────────────────────────┴─────────────┴────────┘

  ---
  src/data/inventory.ts — PARTIAL

  ┌───────────────────────────────────┬───────────────────────────────┬────────────┐
  │              Export               │            Used in            │   Status   │
  ├───────────────────────────────────┼───────────────────────────────┼────────────┤
  │ SortOptions.priceLowHigh          │ TC-INV-02                     │ ✓          │
  ├───────────────────────────────────┼───────────────────────────────┼────────────┤
  │ SortOptions.nameAZ                │ —                             │ ✗ UNTESTED │
  ├───────────────────────────────────┼───────────────────────────────┼────────────┤
  │ SortOptions.nameZA                │ —                             │ ✗ UNTESTED │
  ├───────────────────────────────────┼───────────────────────────────┼────────────┤
  │ SortOptions.priceHighLow          │ —                             │ ✗ UNTESTED │
  ├───────────────────────────────────┼───────────────────────────────┼────────────┤
  │ firstProduct()                    │ TC-INV-03                     │ ✓          │
  ├───────────────────────────────────┼───────────────────────────────┼────────────┤
  │ ITEM_DETAIL_ID                    │ itemDetail.spec.ts beforeEach │ ✓          │
  ├───────────────────────────────────┼───────────────────────────────┼────────────┤
  │ CartExpectations.badgeAfterAdd    │ TC-ITEM-02                    │ ✓          │
  ├───────────────────────────────────┼───────────────────────────────┼────────────┤
  │ CartExpectations.removeButtonText │ TC-ITEM-02                    │ ✓          │
  └───────────────────────────────────┴───────────────────────────────┴────────────┘

  Recommendation: Add sort tests for nameAZ, nameZA, and priceHighLow to inventory.spec.ts, following the existing pattern of TC-INV-02.

  ---
  Consistency Issue — inventory.spec.ts TC-INV-03

  CartExpectations.badgeAfterAdd was introduced to centralise the cart badge value, and itemDetail.spec.ts already uses it. However
  inventory.spec.ts:39 still uses the hardcoded string '1':

  // inventory.spec.ts:39 — inconsistent with itemDetail.spec.ts
  await expect(siteHeader.getCartBadge()).toHaveText('1');

  Recommendation: Import and use CartExpectations.badgeAfterAdd in inventory.spec.ts to match the convention established in
  itemDetail.spec.ts.

  ---
  Summary

  ┌───────────────────┬──────────────────────────┬───────────────────────────────────────────────────────────────────┐
  │       File        │          Status          │                          Action required                          │
  ├───────────────────┼──────────────────────────┼───────────────────────────────────────────────────────────────────┤
  │ LoginPage.ts      │ Full coverage            │ None                                                              │
  ├───────────────────┼──────────────────────────┼───────────────────────────────────────────────────────────────────┤
  │ InventoryPage.ts  │ Partial                  │ Test getTitle()                                                   │
  ├───────────────────┼──────────────────────────┼───────────────────────────────────────────────────────────────────┤
  │ ItemDetailPage.ts │ Partial                  │ Test or remove getBackButton()                                    │
  ├───────────────────┼──────────────────────────┼───────────────────────────────────────────────────────────────────┤
  │ SiteHeader.ts     │ Partial                  │ Test clickCartLink()                                              │
  ├───────────────────┼──────────────────────────┼───────────────────────────────────────────────────────────────────┤
  │ BasePage.ts       │ Partial                  │ Test or remove getPageTitle()                                     │
  ├───────────────────┼──────────────────────────┼───────────────────────────────────────────────────────────────────┤
  │ users.ts          │ Full coverage            │ None                                                              │
  ├───────────────────┼──────────────────────────┼───────────────────────────────────────────────────────────────────┤
  │ inventory.ts      │ Partial                  │ Test 3 unused SortOptions; fix hardcoded '1' in inventory.spec.ts │
  ├───────────────────┼──────────────────────────┼───────────────────────────────────────────────────────────────────┤
  │ CartExpectations.removeButtonText │ TC-ITEM-02                    │ ✓          │
  └───────────────────────────────────┴───────────────────────────────┴────────────┘

  Recommendation: Add sort tests for nameAZ, nameZA, and priceHighLow to inventory.spec.ts, following the existing pattern of TC-INV-02.

  ---
  Consistency Issue — inventory.spec.ts TC-INV-03

  CartExpectations.badgeAfterAdd was introduced to centralise the cart badge value, and itemDetail.spec.ts already uses it. However
  inventory.spec.ts:39 still uses the hardcoded string '1':

  // inventory.spec.ts:39 — inconsistent with itemDetail.spec.ts
  await expect(siteHeader.getCartBadge()).toHaveText('1');

  Recommendation: Import and use CartExpectations.badgeAfterAdd in inventory.spec.ts to match the convention established in
  itemDetail.spec.ts.

  ---
  Summary

  ┌───────────────────┬──────────────────────────┬───────────────────────────────────────────────────────────────────┐
  │       File        │          Status          │                          Action required                          │
  ├───────────────────┼──────────────────────────┼───────────────────────────────────────────────────────────────────┤
  │ LoginPage.ts      │ Full coverage            │ None                                                              │
  ├───────────────────┼──────────────────────────┼───────────────────────────────────────────────────────────────────┤
  │ InventoryPage.ts  │ Partial                  │ Test getTitle()                                                   │
  ├───────────────────┼──────────────────────────┼───────────────────────────────────────────────────────────────────┤
  │ ItemDetailPage.ts │ Partial                  │ Test or remove getBackButton()                                    │
  ├───────────────────┼──────────────────────────┼───────────────────────────────────────────────────────────────────┤
  │ SiteHeader.ts     │ Partial                  │ Test clickCartLink()                                              │
  ├───────────────────┼──────────────────────────┼───────────────────────────────────────────────────────────────────┤
  │ BasePage.ts       │ Partial                  │ Test or remove getPageTitle()                                     │
  ├───────────────────┼──────────────────────────┼───────────────────────────────────────────────────────────────────┤
  │ users.ts          │ Full coverage            │ None                                                              │
  ├───────────────────┼──────────────────────────┼───────────────────────────────────────────────────────────────────┤
  │ inventory.ts      │ Partial                  │ Test 3 unused SortOptions; fix hardcoded '1' in inventory.spec.ts │
  ├───────────────────┼──────────────────────────┼───────────────────────────────────────────────────────────────────┤
  │ urlBuilder.ts     │ Full coverage            │ None                                                              │
  ├───────────────────┼──────────────────────────┼───────────────────────────────────────────────────────────────────┤
  │ waitHelpers.ts    │ Full coverage (indirect) │ None          