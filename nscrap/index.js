import puppeteer from 'puppeteer';

import { exec } from 'child_process';
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
await page.locator('.textbox').fill('TCS');

await page.locator('.submit').click();
// Wait and click on first result.


// Locate the full title with a unique string.
const textSelector = await page
  .locator('#read-more-div')
  .waitHandle();
const companyData = await textSelector?.evaluate(el => el.textContent);

// Print the full title.
console.log(companyData);


const links = await page.evaluate(() => {
  // Select the specific <div> by its class, ID, or any other selector
  const div = document.querySelector('.tabs_common'); // Replace with your specific <div> selector
  if (!div) return []; // Return an empty array if the div is not found

  // Get all <a> elements within that <div>
  const anchors = div.querySelectorAll('a');
  
  // Map over the NodeList to get the href attributes
  return Array.from(anchors).map(anchor => anchor.href);
});

await browser.close();

console.log(links);

exec(`node readLinks.js ${links}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error executing index.js: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(stdout);
});


