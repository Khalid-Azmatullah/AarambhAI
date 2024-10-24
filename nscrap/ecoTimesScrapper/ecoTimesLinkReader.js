const articleTitleType1 = '.artTitle font_faus';
const articleReleaseDateClass = '.CYwM8';
const articleTitleType2 = '.title';

import puppeteer from 'puppeteer';
import fs from 'fs';


// start browser
const browser = await puppeteer.launch({ headless: false});

const articleJSON = [];
const linksList = process.argv[2];
const unfilteredLinks = linksList.split(',');
const links = unfilteredLinks.filter(url => url.startsWith("https://economictimes.indiatimes.com/"));

for (const link of links) {
  const page = await browser.newPage();
  await page.goto(link);

  const articleType1 = page.$(articleTitleType1, (text) => {
    return text.textContent;
  })
  const articleType2 = page.$(articleTitleType2, (text) => {
    return text.textContent;
  })

  if (articleType1 === null && articleType2 !== null) {
    console.log("type 2")
  } if (articleTitleType1 !== null && articleTitleType2 === null) {
    console.log("type 1")
  } else {
    console.log(`new type = ${link}`)
  }
  
}

await browser.close()