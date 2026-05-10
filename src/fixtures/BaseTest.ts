import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { SiteHeader } from '../components/SiteHeader';
import { ItemDetailPage } from '../pages/ItemDetailPage';
import { InventoryPage } from '../pages/InventoryPage';
import { Logger } from '../utils/Logger';

type PageFixtures = {
  loginPage: LoginPage;
  siteHeader: SiteHeader;
  itemPage: ItemDetailPage;
  inventoryPage: InventoryPage;
  logger: Logger;
};

export const test = base.extend<PageFixtures>({
  loginPage: async ({ page, logger }, use) => use(new LoginPage(page, logger)),
  siteHeader: async ({ page }, use) => use(new SiteHeader(page)),
  itemPage: async ({ page, logger }, use) => use(new ItemDetailPage(page, logger)),
  inventoryPage: async ({ page, logger }, use) => use(new InventoryPage(page, logger)),
  logger: [async ({ page }, use, testInfo): Promise<void> => {
    const logger = new Logger(page, testInfo);
    await logger.setup();
    try {
      await use(logger);
    } finally {
      await logger.teardown();
    }
  }, { auto: true }],
});
