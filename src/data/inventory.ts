export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

export const SortOptions: Record<string, SortOption> = {
  nameAZ: 'az',
  nameZA: 'za',
  priceLowHigh: 'lohi',
  priceHighLow: 'hilo',
};

export type ProductRef = { index: number };

export function firstProduct(): ProductRef {
  return { index: 0 };
}

export const InventoryPageData = {
  title: 'Products',
};

export const ITEM_DETAIL_ID = 4;

export const CartExpectations = {
  badgeAfterAdd: '1',
  removeButtonText: 'Remove',
};
