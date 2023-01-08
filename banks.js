const assert = require('node:assert');
const { chromium } = require('playwright');
const fs = require('fs');


(async () => {
    const data = fs.readFileSync('./data/countries.json');
    const countries = JSON.parse(data);
    
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    let iter = 1;

    for (const country of countries.data) {
        console.log(country.country_name);
        await page.goto(country.country_url, { timeout: 10000000 });
        const banks = await page.$$('.bank');

        const bank_data = { data: [] };

        for (const bank of banks) {
            const bank_url = await bank.getAttribute('href');
            const bank_name = await (await bank.$('h3')).textContent();
            bank_data.data.push({ bank_url, bank_name, country_name: country.country_name, country_img: country.country_img, country_url: country.country_url });
        }

        const bank_json = JSON.stringify(bank_data, 0, 4);
        fs.writeFileSync(`./data/banks/${iter}.json`, bank_json);
        iter++;
    }

    await context.close();
    await browser.close();
})()