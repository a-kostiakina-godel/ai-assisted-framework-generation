import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { SiteHeader } from '../components/SiteHeader';
import { ItemDetailPage } from '../pages/ItemDetailPage';
import { InventoryPage } from '../pages/InventoryPage';

type PageFixtures = {
  loginPage: LoginPage;
  siteHeader: SiteHeader;
  itemPage: ItemDetailPage;
  inventoryPage: InventoryPage;
};

export const test = base.extend<PageFixtures>({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  siteHeader: async ({ page }, use) => use(new SiteHeader(page)),
  itemPage: async ({ page }, use) => use(new ItemDetailPage(page)),
  inventoryPage: async ({ page }, use) => use(new InventoryPage(page)),
});
