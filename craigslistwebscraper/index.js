const puppeteer = require('puppeteer')
const cheerio = require('cheerio');
const mongoose = require('mongoose')
const Listing = require('./model/Listing')

async function connectDb() {
    await mongoose.connect('mongodb+srv://raf:test@cluster0.t5mzc.mongodb.net/craigslistDb?retryWrites=true&w=majority', { useNewUrlParser: true })
    console.log("Connected to database")
}

async function scrapeListings(page) {
    await page.goto('https://sfbay.craigslist.org/search/sof');
    const html = await page.content()
    const $ = cheerio.load(html)
    // Get text
    // $(".result-title").each((i, e) => console.log($(e).text()))
    // Get attributes
    // $(".result-title").each((i, e) => console.log($(e).attr("href")))
    const listings = $(".result-info").map((i, e) => {
        const titleElement = $(e).find(".result-title")
        const timeElement = $(e).find(".result-date")
        const hoodElement = $(e).find(".result-hood")

        const title = $(titleElement).text()
        const url = $(titleElement).attr("href")
        const datePosted = new Date($(timeElement).attr("datetime"))
        const neighborhood = $(hoodElement).text().trim().replace(/\(|\)/g, "")

        return { title, url, datePosted, neighborhood }
    }).get()
    
    return listings
}

async function scrapeJobDescription(listings, page) {
    for (const listing of listings) {
        await page.goto(listing.url)
        const html = await page.content()
        const $ = cheerio.load(html)
        const jobDescription = $("#postingbody").text()
        listing.jobDescription = jobDescription
        listing.compensation = $("p.attrgroup > span:nth-child(1) > b").text()
        console.log(listing.compensation)
        const listingModel = new Listing(listing)
        await listingModel.save()
        await sleep(1000)
    }
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    await connectDb()
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    const listings = await scrapeListings(page)
    const listingsWithJobDescription = await scrapeJobDescription(listings, page)
    console.log(listings)
}

main()