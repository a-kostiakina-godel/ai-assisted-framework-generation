import { test, expect } from '../../src/fixtures';
import { SortOptions, firstProduct, CartExpectations, InventoryPageData } from '../../src/data/inventory';

test.describe('Inventory', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.open();
  });

  test(
    'TC-INV-01: inventory page shows 6 product cards with complete data @smoke',
    async ({ inventoryPage }) => {
      await expect(inventoryPage.getTitle()).toHaveText(InventoryPageData.title);
      await expect(inventoryPage.getProductCards()).toHaveCount(6);
      const items = await inventoryPage.getItems();
      for (const item of items) {
        await expect(item.getName()).not.toBeEmpty();
        await expect(item.getPrice()).toHaveText(/^\$\d+\.\d{2}$/);
        expect(await item.isImageLoaded()).toBe(true);
        await expect(item.getAddToCartButton()).toBeEnabled();
      }
    },
  );

  test(
    'TC-INV-02: sorting by Price low to high orders products by ascending price @regression',
    async ({ inventoryPage }) => {
      await inventoryPage.selectSortOption(SortOptions.priceLowHigh);
      const items = await inventoryPage.getItems();
      const firstPrice = await items[0].getPriceValue();
      const lastPrice = await items[items.length - 1].getPriceValue();
      expect(firstPrice).toBeLessThanOrEqual(lastPrice);
    },
  );

  test(
    'TC-INV-03: clicking Add to Cart on first product increments cart badge to 1 @smoke',
    async ({ inventoryPage, siteHeader }) => {
      const { index } = firstProduct();
      await inventoryPage.getItem(index).clickAddToCart();
      await expect(siteHeader.getCartBadge()).toHaveText(CartExpectations.badgeAfterAdd);
    },
  );
});
