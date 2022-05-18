const request = require('request-promise');
const cheerio = require('cheerio');

async function main() {
    const result = await request.get('https://www.codingwithstefan.com/table-example/');
    const $ = await cheerio.load(result);
    // $("body > table > tbody > tr > td").each((i, e) => {
    //     console.log($(e).text())  
    // })

    const scrapedRows = [];

    $("body > table > tbody > tr").each((i, e) => {
        if (i === 0) return true;
        const tds = $(e).find("td");
        const company = $(tds[0]).text();
        const contact = $(tds[1]).text();
        const country = $(tds[2]).text();
        const scrapedRow = { company, contact, country };
        scrapedRows.push(scrapedRow);
    })
    console.log(scrapedRows);
}

main();