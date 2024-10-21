import fs from 'fs';
import puppeteer from 'puppeteer';
import { exec } from 'child_process';


function checkForUpdate() {
  const startDate = new Date('2024-10-20');
  // Set the starting date
  const currentDate = new Date();

  // Calculate the difference in time
  const diffTime = Math.abs(currentDate - startDate);

  // Convert milliseconds to days
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // Check if the difference is a multiple of 15
  if (diffDays % 15 === 0 && diffDays !== 0) {
    return true;
  } else {
    return false;
  }
}


const update = checkForUpdate() 

if (update === true) {

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto('https://en.wikipedia.org/wiki/List_of_companies_listed_on_the_National_Stock_Exchange_of_India');
  
  let data = await page.evaluate(() => {
    const tds = Array.from(document.querySelectorAll('table tr td'))
    return tds.map(td => td.innerText)
  });
  
  await browser.close();
  data.length = data.length - 4;
  
  const companyJson = [];
  
  // Loop through the array in steps of 2 to create objects
  for (let i = 0; i < data.length; i += 2) {
    const abbreviation = data[i].trim();
    console.log(abbreviation.split(" "))
    const name = data[i + 1].trim();
    
    companyJson.push({ abbreviation, name });
  }
  
  // Convert the array of objects to a JSON string
  const jsonString = JSON.stringify(companyJson, null, 2); // Pretty print with 2 spaces
  
  fs.writeFile('companies.json', jsonString, (err) => {
    if (err) {
      console.error('Error writing to file', err);
      return;
    }
    console.log('Company data successfully written to companies.json');
  });
  console.log("TRUE")
};


exec('node index.js', (error, stdout, stderr) => {
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