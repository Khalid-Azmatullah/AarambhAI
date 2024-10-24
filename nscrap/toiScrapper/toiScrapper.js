const shortDescriptionId = '.dOabc';

const articleColoumnClass = '.tabs_common';

const toiLinkReaderProgram = 'toiScrapper/toiLinkReader.js';

// test Only
const companyName = 'Shyam Telecom Limited';


// import dependencies
import puppeteer from 'puppeteer';
import fs from 'fs';
import { exec } from 'child_process';

// launch puppeteer
const browser = await puppeteer.launch();
const page = await browser.newPage();
page.setDefaultTimeout(60000);
// go to timesOfIndia
await page.goto(`https://timesofindia.indiatimes.com/topic/${companyName} company`);

await page.setViewport({width: 1080, height: 1024});

// get description if any
const companyData = await page.$(shortDescriptionId, (text) => {
  return text.textContent
});

// get article links if any
const unfilteredLinks = await page.evaluate((articleLinkClass) => {
  const div = document.querySelector(articleLinkClass);
  if (!div) return [];
  const anchors = div.querySelectorAll('a');
  
  return Array.from(anchors).map(anchor => anchor.href);
}, articleColoumnClass);


// close the browser
await browser.close();


/*fs.mkdir(`../${companyName}`, { recursive: true }, (err) => {
  if (err) {
      console.error('Error creating directory:', err);
  } else {
      console.log('Directory created successfully!');
  }
});

fs.mkdir(`../${companyName}/toiData`, { recursive: true }, (err) => {
  if (err) {
      console.error('Error creating directory:', err);
  } else {
      console.log('Directory created successfully!');
  }
});
*/



const links = unfilteredLinks.filter(url => url.startsWith("https://timesofindia"));


const linksJSON = links;


const jsonString = JSON.stringify(linksJSON, null, 2);

fs.writeFile(`../links.json`, jsonString, (err) => {
  if (err) {
    console.error('Error writing to file', err);
    return;
  }
  console.log('Company data successfully written to companies.json');
});




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
