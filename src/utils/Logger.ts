import { Page } from '@playwright/test';
import type { TestInfo } from '@playwright/test';
import * as winston from 'winston';
import * as path from 'path';
import * as fs from 'fs';

const CONSOLE_LEVEL_MAP: Record<string, string> = {
  error: 'error',
  warning: 'warn',
  debug: 'debug',
};

export class Logger {
  private readonly winstonLogger: winston.Logger;
  private readonly logFilePath: string;
  private readonly fileTransport: winston.transports.FileTransportInstance;
  private ended = false;

  constructor(private readonly page: Page, private readonly testInfo: TestInfo) {
    this.logFilePath = path.join(testInfo.outputDir, 'logs.txt');
    fs.mkdirSync(testInfo.outputDir, { recursive: true });

    const format = winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(
        ({ timestamp, level, message }) =>
          `[${timestamp}] [${level.toUpperCase().padEnd(5)}] ${message}`,
      ),
    );

    this.fileTransport = new winston.transports.File({
      filename: this.logFilePath,
      format,
    });

    const transports: winston.transport[] = [this.fileTransport];

    if (!process.env.CI) {
      transports.push(new winston.transports.Console({ format }));
    }

    this.winstonLogger = winston.createLogger({ level: 'debug', transports });
  }

  async setup(): Promise<void> {
    this.page.on('console', (msg) => {
      if (this.ended) return;
      this.winstonLogger.log(CONSOLE_LEVEL_MAP[msg.type()] ?? 'info', msg.text());
    });
    this.page.on('pageerror', (error) => {
      if (this.ended) return;
      this.winstonLogger.error(error.message);
    });
  }

  info(message: string): void {
    this.winstonLogger.info(message);
  }

  warn(message: string): void {
    this.winstonLogger.warn(message);
  }

  error(message: string): void {
    this.winstonLogger.error(message);
  }

  debug(message: string): void {
    this.winstonLogger.debug(message);
  }

  async teardown(): Promise<void> {
    this.ended = true;
    await new Promise<void>((resolve) => {
      this.fileTransport.on('finish', resolve);
      this.winstonLogger.end();
    });
    await this.testInfo.attach('logs', {
      path: this.logFilePath,
      contentType: 'text/plain',
    });
  }
}
