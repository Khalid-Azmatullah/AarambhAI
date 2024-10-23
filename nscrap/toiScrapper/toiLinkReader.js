const articleDivClass = '.heightCalc';
const payWallDiv = '#story-blocker-new';

const articleReleaseDateClass = '.xf8Pm';
const articleTitleClass = '.HNMDR';

import puppeteer from 'puppeteer';
import fs from 'fs';
import { text } from 'stream/consumers';

// start browser
const browser = await puppeteer.launch();





const articleJSON = [];
const linksList = process.argv[2];
const unfilteredLinks = linksList.split(',');
const links = unfilteredLinks.filter(url => url.startsWith("https://timesofindia"));


for (const link of links) {
  const page = await browser.newPage();
  await page.goto(link);
  

  const divExists = await page.$(payWallDiv);
  console.log(divExists)
  if (divExists) {
    console.log('Detected paywall skipping to next page...');
  } else {
    console.log(link)
    const articleTitle = await page.$eval(articleTitleClass, (text) => {
      return text.textContent.trim();
    });

    const articleReleaseDateSplit = await page.$eval(articleReleaseDateClass, (text) => {
      return text.textContent.split('/');
    });
    

    let articleReleaseDate;

    if (articleReleaseDateSplit.length === 3) {
      articleReleaseDate = articleReleaseDateSplit[2];
    } if (articleReleaseDateSplit.length === 2) {
      articleReleaseDate = articleReleaseDateSplit[1];
    }


    const articleData = await page.$eval(articleDivClass, (text) => {
      return text.textContent
    });

    const articleTrashBloated = await page.evaluate((articleDivClass) => {
      const articleDiv = document.querySelector(articleDivClass);

      const childDivs = articleDiv ? articleDiv.querySelectorAll('div') : [];

      // Return an array of the inner texts of all child divs
      return Array.from(childDivs).map(el => el.innerText);
    }, articleDivClass);
    
    const articleTrashPartialFree1 = articleTrashBloated.map(e => e.replace(/\n/g, '').trim());
    const articleTrashPartialFree2 = articleTrashPartialFree1.map(e => e.replace('Undo', ' ').trim());

    const articleTrash = articleTrashPartialFree2.filter(e => e.trim() !== '');
    
    // Create a regular expression pattern to match the words
    const regex = new RegExp(`(${articleTrash.join('|')})`, 'gi');

    // Remove the words from the paragraph
    const articleAlmostFree = articleData.replace(regex, '').replace(/\s+/g, ' ').trim();
    const articleBroken = articleAlmostFree.split('Recommended For You');
    const article = articleBroken[0];

    articleJSON.push({ articleTitle, articleReleaseDate, article})
  }
}


const jsonString = JSON.stringify(articleJSON, null, 2);
fs.writeFile('../companyArticlesData.json', jsonString, (err) => {
  if (err) {
    console.error('Error writing to file', err);
    return;
  }    
  console.log('logged company info');
});



await browser.close();