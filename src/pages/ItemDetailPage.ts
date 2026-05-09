import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ItemDetailPage extends BasePage {
  private readonly productName: Locator;
  private readonly productDesc: Locator;
  private readonly productPrice: Locator;
  private readonly productImage: Locator;
  private readonly addToCartButton: Locator;
  private readonly removeButton: Locator;
  private readonly backButton: Locator;
  private readonly firstInventoryItemLink: Locator;

  constructor(page: Page) {
    super(page);
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
    await this.navigate(`/inventory-item.html?id=${id}`);
  }

  async openFirstItemFromInventory(): Promise<void> {
    await this.navigate('/inventory.html');
    await this.firstInventoryItemLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickAddToCart(): Promise<void> {
    await this.addToCartButton.click();
  }

  async clickBackToProducts(): Promise<void> {
    await this.backButton.click();
    await this.page.waitForLoadState('domcontentloaded');
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
