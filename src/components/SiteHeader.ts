import { Page, Locator } from '@playwright/test';

export class SiteHeader {
  private readonly cartLink: Locator;
  private readonly cartBadge: Locator;
  private readonly hamburgerButton: Locator;
  private readonly logoutLink: Locator;

  constructor(private readonly page: Page) {
    this.cartLink = page.locator('.shopping_cart_link');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.hamburgerButton = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('#logout_sidebar_link');
  }

  getHamburgerButton(): Locator {
    return this.hamburgerButton;
  }

  getCartBadge(): Locator {
    return this.cartBadge;
  }

  async getCartItemCount(): Promise<number> {
    const isVisible = await this.cartBadge.isVisible();
    if (!isVisible) return 0;
    const text = await this.cartBadge.textContent();
    return parseInt(text?.trim() ?? '0', 10);
  }

  async clickCartLink(): Promise<void> {
    await this.cartLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async openHamburgerMenu(): Promise<void> {
    await this.hamburgerButton.click();
    await this.logoutLink.waitFor({ state: 'visible' });
  }

  async clickLogout(): Promise<void> {
    await this.logoutLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}
