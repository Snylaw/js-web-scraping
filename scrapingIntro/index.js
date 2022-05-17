const request = require('request-promise');
const fs = require('fs');
const cheerio = require('cheerio');

async function main() {
    const html = await request.get('https://reactnativetutorial.net/css-selectors/');
    fs.writeFileSync('./test.html', html);
    const $ = await cheerio.load(html);
    const theText = $("h1").text();
    console.log(theText);
}

main();