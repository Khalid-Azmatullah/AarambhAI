const articleDivClass = '.heightCalc';
const pollWidgetClass = '#poll-widget';
const articleBreakerClass = '.cdatainfo';

const articleReleaseDateClass = '.xf8Pm';
const articleTitleClass = '.HNMDR';

import puppeteer from 'puppeteer';
import fs from 'fs';

// start browser
const browser = await puppeteer.launch();





const articleJSON = [];
const linksList = process.argv[2];
const links = linksList.split(',');

for (const link of links) {
  const page = await browser.newPage();
  await page.goto(link);
  
  const articleTitle = await page.$eval(articleTitleClass, (text) => {
    return text.textContent.trim();
  });

  const articleReleaseDateSplit = await page.$eval(articleReleaseDateClass, (text) => {
    return text.textContent.split('/');
  });
  
  const articleReleaseDate = articleReleaseDateSplit[2];


  const articleFull = await page.$eval(articleDivClass, (div) => {
    return div.textContent;
  });

  const articlePoll = await page.$eval(pollWidgetClass, (text) => {
    return text.textContent;
  });

  const pollFreeArticle = articleFull.trim(articlePoll);
  const articleBreaker = await page.$(articleBreakerClass, (text) => {
    return text.textContent;
  });

  const articleSplit = pollFreeArticle.split(articleBreaker);
  const article = articleSplit[0];

  articleJSON.push({ articleTitle, articleReleaseDate, article})
  console.log(articleJSON)
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