import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { InventoryItem } from '../components/InventoryItem';
import type { Logger } from '../utils/Logger';
import { INVENTORY_URL } from '../utils/urlBuilder';

export class InventoryPage extends BasePage {
  private readonly titleLocator: Locator;
  private readonly sortDropdown: Locator;
  private readonly productCards: Locator;

  constructor(page: Page, logger?: Logger) {
    super(page, logger);
    this.titleLocator = page.locator('.title');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.productCards = page.locator('.inventory_item');
  }

  async open(): Promise<void> {
    await this.navigate(INVENTORY_URL);
  }

  async selectSortOption(value: string): Promise<void> {
    this.logger?.info(`Selecting sort option: ${value}`);
    await this.sortDropdown.selectOption(value);
  }

  getTitle(): Locator {
    return this.titleLocator;
  }

  getProductCards(): Locator {
    return this.productCards;
  }

  getItem(index: number): InventoryItem {
    return new InventoryItem(this.productCards.nth(index));
  }

  async getItems(): Promise<InventoryItem[]> {
    const count = await this.productCards.count();
    return Array.from({ length: count }, (_, i) => new InventoryItem(this.productCards.nth(i)));
  }
}
