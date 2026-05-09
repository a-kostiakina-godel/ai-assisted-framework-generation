import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { SiteHeader } from '../components/SiteHeader';
import { ItemDetailPage } from '../pages/ItemDetailPage';

type PageFixtures = {
  loginPage: LoginPage;
  siteHeader: SiteHeader;
  itemPage: ItemDetailPage;
};

export const test = base.extend<PageFixtures>({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  siteHeader: async ({ page }, use) => use(new SiteHeader(page)),
  itemPage: async ({ page }, use) => use(new ItemDetailPage(page)),
});
