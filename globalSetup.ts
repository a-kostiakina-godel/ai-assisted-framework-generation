import { chromium, FullConfig } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { validUser } from './src/data/users';
import { LoginPage } from './src/pages/LoginPage';
import { INVENTORY_URL } from './src/utils/urlBuilder';

async function globalSetup(config: FullConfig): Promise<void> {
  const baseURL = config.projects[0].use.baseURL;
  if (!baseURL) {
    throw new Error('baseURL is not set. Define BASE_URL in your .env file or environment.');
  }
  const browser = await chromium.launch();
  const context = await browser.newContext({ baseURL });
  const page = await context.newPage();
  const user = validUser();

  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.login(user);
  await page.waitForURL(`**${INVENTORY_URL}`);

  fs.mkdirSync(path.join(process.cwd(), '.auth'), { recursive: true });
  await context.storageState({ path: path.join(process.cwd(), '.auth', 'session.json') });
  await browser.close();
}

export default globalSetup;
