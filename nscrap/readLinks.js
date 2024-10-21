import puppeteer from 'puppeteer';
const browser = await puppeteer.launch();
const page = await browser.newPage();

// Navigate the page to a URL.
await page.goto('https://timesofindia.indiatimes.com/technology/tech-news/tcs-ceo-and-md-k-krithivasan-mourns-ratan-tatas-demise-all-my-colleagues-at-tcs-and-i-will-remain-forever-/articleshow/114120504.cms');



await page.setViewport({width: 1080, height: 1024});
const articleData = await page.$eval('.vSlIC  ', (text) => {
  return text.textContent.trim();
});


const pollPartText = await page.$eval('#poll-widget', (text) => {
  return text.textContent.trim();
});

const articlePollFreeData = articleData.trim(pollPartText)


const trueArticleBreaker = await page.$eval('.cdatainfo', (text) => {
  return text.textContent.trim();
});

const articleDataSplit = articlePollFreeData.split(trueArticleBreaker);
const trueArticleData = articleDataSplit[0]


// Print the full title.
const articleReleaseDateSplit = await page.$eval('.xf8Pm', (text) => {
  return text.textContent.split('/');
});

const articleReleaseDate = articleReleaseDateSplit[2];
const articleTitle = await page.$eval('.HNMDR', (text) => {
  return text.textContent.trim();
})


console.log(trueArticleData);
console.log(articleReleaseDate);
console.log(articleTitle);
await browser.close();