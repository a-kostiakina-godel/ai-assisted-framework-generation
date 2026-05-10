import { test, expect } from '../../src/fixtures';
import { validUser, lockedUser, LoginErrors } from '../../src/data/users';
import { INVENTORY_URL } from '../../src/utils/urlBuilder';

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  test(
    'TC-LOGIN-01: valid credentials navigate to inventory page @smoke',
    async ({ loginPage, siteHeader, page }) => {
      await loginPage.login(validUser());
      await expect(page).toHaveURL(INVENTORY_URL);
      await expect(siteHeader.getHamburgerButton()).toBeVisible();
    },
  );

  test(
    'TC-LOGIN-02: locked out user sees error banner @regression',
    async ({ loginPage }) => {
      await loginPage.login(lockedUser());
      await expect(loginPage.getErrorBanner()).toBeVisible();
      await expect(loginPage.getErrorBanner()).toContainText(LoginErrors.lockedUser);
    },
  );

  test(
    'TC-LOGIN-03: submitting empty form shows username required error @regression',
    async ({ loginPage }) => {
      await loginPage.submitEmptyForm();
      await expect(loginPage.getErrorBanner()).toBeVisible();
      await expect(loginPage.getErrorBanner()).toContainText(LoginErrors.emptyUsername);
    },
  );
});
