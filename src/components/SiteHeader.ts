import { Page, Locator } from '@playwright/test';
import { waitForPageLoad } from '../utils/waitHelpers';

export class SiteHeader {
  private readonly cartLink: Locator;
  private readonly cartBadge: Locator;
  private readonly hamburgerButton: Locator;
  private readonly logoutLink: Locator;

  constructor(private readonly page: Page) {
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.hamburgerButton = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('#logout_sidebar_link');
  }

  getHamburgerButton(): Locator {
    return this.hamburgerButton;
  }

  getCartBadge(): Locator {
    return this.cartBadge;
  }

  async clickCartLink(): Promise<void> {
    await this.cartLink.click();
    await waitForPageLoad(this.page);
  }

  async openHamburgerMenu(): Promise<void> {
    await this.hamburgerButton.click();
    await this.logoutLink.waitFor({ state: 'visible' });
  }

  async clickLogout(): Promise<void> {
    await this.logoutLink.click();
    await waitForPageLoad(this.page);
  }
}
