import { test, expect } from '../../src/fixtures';

test.describe('Item Detail', () => {
  test(
    'TC-ITEM-01: product detail page loads with all elements visible @smoke',
    async ({ itemPage, page }) => {
      await itemPage.openFirstItemFromInventory();
      await expect(page).toHaveURL(/inventory-item\.html/);
      await expect(itemPage.getProductName()).toBeVisible();
      await expect(itemPage.getProductDesc()).toBeVisible();
      await expect(itemPage.getProductPrice()).toBeVisible();
      await expect(itemPage.getProductImage()).toBeVisible();
      await expect(itemPage.getAddToCartButton()).toBeVisible();
      await expect(itemPage.getAddToCartButton()).toBeEnabled();
    },
  );

  test.describe('on item detail page', () => {
    test.beforeEach(async ({ itemPage }) => {
      await itemPage.open(4);
    });

    test(
      'TC-ITEM-02: Add to Cart updates cart badge and changes button to Remove @regression',
      async ({ itemPage, siteHeader }) => {
        await itemPage.clickAddToCart();
        await expect(siteHeader.getCartBadge()).toHaveText('1');
        await expect(itemPage.getRemoveButton()).toHaveText('Remove');
      },
    );

    test(
      'TC-ITEM-03: Back to Products navigates to inventory page @regression',
      async ({ itemPage, page }) => {
        await itemPage.clickBackToProducts();
        await expect(page).toHaveURL('/inventory.html');
      },
    );
  });
});
