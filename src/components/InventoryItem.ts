import { Locator } from '@playwright/test';

export class InventoryItem {
  private readonly nameLocator: Locator;
  private readonly priceLocator: Locator;
  private readonly imageLocator: Locator;
  private readonly addToCartButton: Locator;

  constructor(root: Locator) {
    this.nameLocator = root.locator('.inventory_item_name');
    this.priceLocator = root.locator('.inventory_item_price');
    this.imageLocator = root.locator('img.inventory_item_img');
    this.addToCartButton = root.locator('button[data-test^="add-to-cart"]');
  }

  getName(): Locator {
    return this.nameLocator;
  }

  getPrice(): Locator {
    return this.priceLocator;
  }

  getImage(): Locator {
    return this.imageLocator;
  }

  getAddToCartButton(): Locator {
    return this.addToCartButton;
  }

  async isImageLoaded(): Promise<boolean> {
    return this.imageLocator.evaluate((img: HTMLImageElement) => img.naturalWidth > 0);
  }

  async getPriceValue(): Promise<number> {
    const text = (await this.priceLocator.textContent()) ?? '';
    return parseFloat(text.replace('$', ''));
  }

  async clickAddToCart(): Promise<void> {
    await this.addToCartButton.click();
  }
}
