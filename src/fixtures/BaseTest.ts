import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { SiteHeader } from '../components/SiteHeader';

type PageFixtures = {
  loginPage: LoginPage;
  siteHeader: SiteHeader;
};

export const test = base.extend<PageFixtures>({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  siteHeader: async ({ page }, use) => use(new SiteHeader(page)),
});
