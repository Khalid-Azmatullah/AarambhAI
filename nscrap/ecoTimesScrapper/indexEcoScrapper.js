const topStoriesDivClass = '#categorywiseTop';
const ecoTimesLinkReaderProgram = 'ecoTimesScrapper/ecoTimesLinkReader.js'

// test
const companyName = 'Skipper Limited'


import puppeteer  from "puppeteer";
import fs from 'fs';
import { exec } from 'child_process';

const browser = await puppeteer.launch({ headless: false});
const page = await browser.newPage();

await page.goto(`https://economictimes.indiatimes.com/topic/${companyName} company`);

const links = await page.evaluate((topStoriesDivClass) => {
  const topStoriesDiv = document.querySelector(topStoriesDivClass);
  if (!topStoriesDiv) return [];
  const anchors = topStoriesDiv.querySelectorAll('a');
  
  return Array.from(anchors).map(anchor => anchor.href);
}, topStoriesDivClass);

console.log(links)

await browser.close();



exec(`node ${ecoTimesLinkReaderProgram} ${links}`, (error, stdout, stderr) => {
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