const fs = require('fs');

let sumaTotal = 0;

for (let i = 1; i < 19809; i++) {
    const data = fs.readFileSync(`./data/bins/${i}.json`);
    const pret = JSON.parse(data);

    sumaTotal += pret.data.length;
}

console.log(sumaTotal);
