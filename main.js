const assert = require('node:assert');
const { chromium } = require('playwright');
const fs = require('fs');


(async () => {
    const url = 'https://bincheck.io'
  // Setup
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // The actual interesting bit
  await page.goto(url + '/es/bin-list');

  const countries = await page.$$('.country');
  const countries_data = { data: [] };

  console.log(countries.length);

  for (const country of countries) {
    const country_url = url + '/es' + (await country.getAttribute('href'));
    const country_name = await (await country.$('h3')).textContent();
    const country_img = url + (await (await country.$('img')).getAttribute('src'));
    countries_data.data.push({ country_url, country_name, country_img });
    console.log(country_name)
  }

  const countries_json = JSON.stringify(countries_data, 0, 4);
  fs.writeFileSync('./data/countries.json', countries_json);

  await context.close();
  await browser.close();
})()