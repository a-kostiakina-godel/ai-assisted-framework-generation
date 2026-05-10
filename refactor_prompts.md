Prompt 1

Update repetitive steps with the page object methods

You are a Senior QA Automation Engineer.

Goal:
Update steps in src/pages/globalSetup.ts using methods defined in LoginPage.ts instead of hard-coded locators.

Context:

- Stack: TypeScript + Playwright
- Pattern: Page Object Model
- Steps to refactor:
  await page.locator('[data-test="username"]').fill(user.username);
  await page.locator('[data-test="password"]').fill(user.password);
  await page.locator('[data-test="login-button"]').click();

Task:

1. Replace all steps with the login page methods.
2. Do not use the page.locator() directly in tests.
3. Keep logic, selectors, and test results unchanged.
4. Output modified files only with headers in the format:
   // path: <relative_path>

Prompt 2

Refactor test steps

You are a Senior QA Automation Engineer.

Goal:
Update src/utils/urlBuilder.ts to use named constants for URLs:

Context:

- Stack: TypeScript + Playwright
- Pattern: Page Object Model
- named constants:
  export const LOGIN_URL = '/';
  export const INVENTORY_URL = '/inventory.html';
  export const ITEM_DETAIL_URL = '/inventory-item.html';

Task:

1. Covert urlBuilder.ts to named constants
2. Update page objects to import constants instead of inlining strings:
   LoginPage.tsInventoryPage.ts
   ItemDetailPage.ts
   ItemDetailPage.ts
3. Update e2e tests to use constants instead of string literals:
   login.spec.ts
   itemDetail.spec.ts
   navigation.spec.ts
   globalSetup.ts

 Output updated files only with headers in the format:
// path: <relative_path>

Prompt 3:

Refactor hardcoded assertion values.

You are a Senior QA Automation Engineer.

Goal:
Update e2e tests and move all values to assert in the test data files:

Context:

- Stack: TypeScript + Playwright
- Pattern: Page Object Model
- e2e test files:
  login.spec.ts
  itemDetail.spec.ts
  navigation.spec.ts
  globalSetup.ts

Task:

1. Covert urlBuilder.ts to named constants
2. Update e2e tests to move verified assertion values to src/data folder:
   login.spec.ts
   itemDetail.spec.ts
   navigation.spec.ts
   globalSetup.ts

 Output updated files only with headers in the format:
// path: <relative_path>
