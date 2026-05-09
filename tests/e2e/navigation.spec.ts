import { test, expect } from '../../src/fixtures';
import { buildInventoryUrl } from '../../src/utils/urlBuilder';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(buildInventoryUrl());
  });

  test(
    'TC-NAV-01: hamburger menu logout navigates to login page @smoke',
    async ({ siteHeader, loginPage, page }) => {
      await siteHeader.openHamburgerMenu();
      await siteHeader.clickLogout();
      await expect(page).toHaveURL('/');
      await expect(loginPage.getLoginButton()).toBeVisible();
    },
  );
});
