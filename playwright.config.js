const { defineConfig } = require('@playwright/test');
const fs = require('fs');

const CHROMIUM_PATH = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const useCustomChromium = fs.existsSync(CHROMIUM_PATH);

const launchOptions = useCustomChromium
  ? { executablePath: CHROMIUM_PATH, args: ['--ignore-certificate-errors'] }
  : { args: ['--ignore-certificate-errors'] };

module.exports = defineConfig({
  testDir: './tests',
  outputDir: './test-results',
  timeout: 90000,
  retries: 0,
  workers: 1,
  reporter: [['html', { outputFolder: 'playwright-report' }], ['list']],
  use: {
    headless: true,
    screenshot: 'only-on-failure',
    video: 'off',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        launchOptions,
      },
    },
  ],
});
