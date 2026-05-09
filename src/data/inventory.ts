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
