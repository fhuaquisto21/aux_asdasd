const assert = require('node:assert');
const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
    const asdsss = fs.readFileSync('./incomplete.json');
    const zxcz = JSON.parse(asdsss);
    let aux_iter_asd = 0;
    let iter = 1;

    for (let i = 1; i < 216; i++) {
        
        const data = fs.readFileSync(`./data/banks/${i}.json`);
        const banks = JSON.parse(data);
        
        const browser = await chromium.launch({ headless: true });
        const context = await browser.newContext();
        const page = await context.newPage();

        bank_loop:
        for (const bank of banks.data) {
            if (iter <= zxcz.data[aux_iter_asd]) {
                iter++;
                continue bank_loop;
            }
            console.log(zxcz.data[aux_iter_asd])
            await page.goto(bank.bank_url, { timeout: 10000000 });
            let bin_rows = (await page.$$('tr')).slice(1);

            const bin_data = { data: [] };

            for (const bin_row of bin_rows) {
                const bin_aux = await bin_row.$$('td');
                let bin_num = (await (bin_aux[0]).textContent()).split(' ')[0].trim();
                while(bin_num === '') {
                    console.log((await (bin_aux[0]).textContent()).split(' ')[0]);
                    bin_num = (await (bin_aux[0]).textContent()).split(' ')[0].trim();
                }
                const bin_mark = (await (bin_aux[3]).textContent()).split(' ')[0].trim();
                const bin_type = (await (bin_aux[4]).textContent()).trim();
                const bin_level = (await (bin_aux[5]).textContent()).trim();

                bin_data.data.push({ bin_num, bin_mark, bin_type, bin_level, bank_name: bank.bank_name, country_name: bank.country_name, country_img: bank.country_img })
            }
    
            const bin_json = JSON.stringify(bin_data, 0, 4);
            for (const asdas of bin_data.data) {
                if (asdas.bin_num === '') {
                    console.log(asdas);
                    return;
                }
            }
            fs.writeFileSync(`./data/bins2/${iter}.json`, bin_json);
            console.log(iter);
            iter++;
            aux_iter_asd = aux_iter_asd < zxcz.data.length ? aux_iter_asd + 1 : 0;
            if (aux_iter_asd === 0) {
                console.log('finish')
                return;
            }
        }
    
        await context.close();
        await browser.close();
    }
})()