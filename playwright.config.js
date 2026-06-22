// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30000,
  reporter: [['list'], ['html', { open: 'never' }]],
  outputDir: 'test-results/',
  projects: [
    {
      name: 'chromium',
      testIgnore: '**/black-bird-public-smoke.spec.js',
      use: {
        ...devices['Desktop Chrome'],
        executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
      },
    },
    {
      name: 'chromium-public',
      testMatch: '**/black-bird-public-smoke.spec.js',
      use: {
        ...devices['Desktop Chrome'],
        executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
        launchOptions: {
          args: ['--ignore-certificate-errors'],
        },
      },
    },
  ],
});
