import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { UserCredentials } from '../data/users';

export class LoginPage extends BasePage {
  private readonly usernameField: Locator;
  private readonly passwordField: Locator;
  private readonly loginButton: Locator;
  private readonly errorBanner: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameField = page.locator('[data-test="username"]');
    this.passwordField = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorBanner = page.locator('[data-test="error"]');
  }

  async open(): Promise<void> {
    await this.navigate('/');
  }

  async login(credentials: UserCredentials): Promise<void> {
    await this.usernameField.fill(credentials.username);
    await this.passwordField.fill(credentials.password);
    await this.loginButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async submitEmptyForm(): Promise<void> {
    await this.loginButton.click();
  }

  getLoginButton(): Locator {
    return this.loginButton;
  }

  getErrorBanner(): Locator {
    return this.errorBanner;
  }
}
