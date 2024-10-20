import puppeteer from 'puppeteer';
// Or import puppeteer from 'puppeteer-core';

// Launch the browser and open a new blank page
const browser = await puppeteer.launch();
const page = await browser.newPage();

// Navigate the page to a URL.
await page.goto('https://timesofindia.indiatimes.com/');

// Set screen size.
await page.setViewport({width: 1080, height: 1024});

// Type into search box.
await page.locator('.OG1TB').click();

const searchQuery = '.textbox';
await page.waitForSelector(searchQuery);
await page.locator('.textbox').fill('ADANIPOWER');

await page.locator('.submit').click();
// Wait and click on first result.


await page
// Locate the full title with a unique string.
const textSelector = await page
  .locator('#read-more-div')
  .waitHandle();
const fullTitle = await textSelector?.evaluate(el => el.textContent);

// Print the full title.
console.log('Text: "%s".', fullTitle);

await browser.close();