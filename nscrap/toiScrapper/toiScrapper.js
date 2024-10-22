const searchButtonClass = '.OG1TB'
const searchInputAreaClass = '.textbox';
const searchSubmitBtnClass = '.submit';

const shortDescriptionId = '#read-more-div';

const articleColoumnClass = '.tabs_common';

const toiLinkReaderProgram = 'toiScrapper/toiLinkReader.js';

// test Only
const companyName = 'TCS';


// import dependencies
import puppeteer from 'puppeteer';
import { exec } from 'child_process';

// launch puppeteer
const browser = await puppeteer.launch();
const page = await browser.newPage();

// go to timesOfIndia
await page.goto('https://timesofindia.indiatimes.com/');

// navigate to company page
await page.$eval(searchButtonClass, searchButton => {
  searchButton.click()
});

await page.waitForSelector(searchInputAreaClass);
await page.locator(searchInputAreaClass).fill(companyName);


await page.$eval(searchSubmitBtnClass, btn => {
  btn.click()
});

// get description if any
await page.waitForSelector(shortDescriptionId);
const companyData = await page.$(shortDescriptionId, (text) => {
  return text.textContent
});

// get article links if any
const links = await page.evaluate((articleLinkClass) => {
  const div = document.querySelector(articleLinkClass);
  if (!div) return [];
  const anchors = div.querySelectorAll('a');
  
  return Array.from(anchors).map(anchor => anchor.href);
}, articleColoumnClass);


// close the browser
await browser.close();


// send links to reader
exec(`node ${toiLinkReaderProgram} ${links}`, (error, stdout, stderr) => {
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
