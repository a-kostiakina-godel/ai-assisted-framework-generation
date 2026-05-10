import { Page } from '@playwright/test';
import type { Logger } from '../utils/Logger';
import { waitForPageLoad } from '../utils/waitHelpers';

export abstract class BasePage {
  constructor(protected readonly page: Page, protected readonly logger?: Logger) {}

  async navigate(path: string): Promise<void> {
    this.logger?.info(`Navigating to ${path}`);
    await this.page.goto(path);
    await waitForPageLoad(this.page);
  }

}
