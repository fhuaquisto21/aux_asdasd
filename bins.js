const assert = require('node:assert');
const { chromium } = require('playwright');
const fs = require('fs');

(async (aux) => {
    let iter = 1;

    for (let i = 1; i < 216; i++) {
        
        const data = fs.readFileSync(`./data/banks/${i}.json`);
        const banks = JSON.parse(data);
        
        const browser = await chromium.launch({ headless: true });
        const context = await browser.newContext();
        const page = await context.newPage();

        bank_loop:
        for (const bank of banks.data) {
            if (iter <= aux) {
                iter++;
                continue bank_loop;
            }
            await page.goto(bank.bank_url, { timeout: 10000000 });
            const bin_rows = (await page.$$('tr')).slice(1);

            const bin_data = { data: [] };

            for (const bin_row of bin_rows) {
                const bin_aux = await bin_row.$$('td');
                const bin_num = (await (bin_aux[0]).textContent()).split(' ')[0].trim();
                const bin_mark = (await (bin_aux[3]).textContent()).split(' ')[0].trim();
                const bin_type = (await (bin_aux[4]).textContent()).trim();
                const bin_level = (await (bin_aux[5]).textContent()).trim();

                bin_data.data.push({ bin_num, bin_mark, bin_type, bin_level, bank_name: bank.bank_name, country_name: bank.country_name, country_img: bank.country_img, country_url: bank.country_url, bank_url: bank.bank_url })
            }
    
            const bin_json = JSON.stringify(bin_data, 0, 4);
            fs.writeFileSync(`./data/bins/${iter}.json`, bin_json);
            console.log(iter);
            iter++;
        }
    
        await context.close();
        await browser.close();
    }
})(0)