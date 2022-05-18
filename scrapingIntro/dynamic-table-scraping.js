const request = require('request-promise');
const cheerio = require('cheerio');

async function main() {
    const result = await request.get('https://www.codingwithstefan.com/table-example/');
    const $ = await cheerio.load(result);

    const scrapedRows = [];
    const tableHeaders = [];

    $("body > table > tbody > tr").each((i, e) => {
        if (i === 0) {
            const ths = $(e).find("th");
            ths.each((i, e) => {
                tableHeaders.push($(e).text().toLowerCase());
            })
            return true;
        }
        const tds = $(e).find("td");
        const tableRow = {};
        tds.each((i, e) => {
            tableRow[tableHeaders[i]] = $(e).text();    
        })
        scrapedRows.push(tableRow);
    })
    console.log(scrapedRows);
}

main();