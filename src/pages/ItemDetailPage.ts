import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import type { Logger } from '../utils/Logger';
import { INVENTORY_URL, ITEM_DETAIL_URL } from '../utils/urlBuilder';
import { waitForPageLoad } from '../utils/waitHelpers';

export class ItemDetailPage extends BasePage {
  private readonly productName: Locator;
  private readonly productDesc: Locator;
  private readonly productPrice: Locator;
  private readonly productImage: Locator;
  private readonly addToCartButton: Locator;
  private readonly removeButton: Locator;
  private readonly backButton: Locator;
  private readonly firstInventoryItemLink: Locator;

  constructor(page: Page, logger?: Logger) {
    super(page, logger);
    this.productName = page.locator('[data-test="inventory-item-name"]');
    this.productDesc = page.locator('[data-test="inventory-item-desc"]');
    this.productPrice = page.locator('[data-test="inventory-item-price"]');
    this.productImage = page.locator('img.inventory_details_img');
    this.addToCartButton = page.locator('[data-test^="add-to-cart"]');
    this.removeButton = page.locator('[data-test^="remove"]');
    this.backButton = page.locator('[data-test="back-to-products"]');
    this.firstInventoryItemLink = page.locator('[data-test="inventory-item-name"]').first();
  }

  async open(id: number): Promise<void> {
    await this.navigate(`${ITEM_DETAIL_URL}?id=${id}`);
  }

  async openFirstItemFromInventory(): Promise<void> {
    await this.navigate(INVENTORY_URL);
    this.logger?.info('Clicking first inventory item');
    await this.firstInventoryItemLink.click();
    await waitForPageLoad(this.page);
  }

  async clickAddToCart(): Promise<void> {
    this.logger?.info('Clicking Add to Cart');
    await this.addToCartButton.click();
  }

  async clickBackToProducts(): Promise<void> {
    this.logger?.info('Clicking Back to Products');
    await this.backButton.click();
    await waitForPageLoad(this.page);
  }

  getProductName(): Locator {
    return this.productName;
  }

  getProductDesc(): Locator {
    return this.productDesc;
  }

  getProductPrice(): Locator {
    return this.productPrice;
  }

  getProductImage(): Locator {
    return this.productImage;
  }

  getAddToCartButton(): Locator {
    return this.addToCartButton;
  }

  getRemoveButton(): Locator {
    return this.removeButton;
  }

  getBackButton(): Locator {
    return this.backButton;
  }
}
