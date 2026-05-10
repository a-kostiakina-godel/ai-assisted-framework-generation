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

