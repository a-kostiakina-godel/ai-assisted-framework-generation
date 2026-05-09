import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { InventoryItem } from '../components/InventoryItem';

export class InventoryPage extends BasePage {
  private readonly titleLocator: Locator;
  private readonly sortDropdown: Locator;
  private readonly productCards: Locator;

  constructor(page: Page) {
    super(page);
    this.titleLocator = page.locator('.title');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.productCards = page.locator('.inventory_item');
  }

  async open(): Promise<void> {
    await this.navigate('/inventory.html');
  }

  async selectSortOption(value: string): Promise<void> {
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
