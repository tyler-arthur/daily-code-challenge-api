// Import required modules
const fs = require("fs");
const puppet = require("puppeteer");
const extractHTML = require("./extractor");

// Opens a browser, navigates to the correct page, and scrapes the HTML content
const getHTML = async () => {
  try {
    const browser = await puppet.launch({headless:false});
    const page = await browser.newPage();
    await page.waitForResponse;
    await page.goto("https://edabit.com/shuffle");
    await page.mouse.click(0,0); // this closes a modal that prevents ".huge" from loading
    await page.waitForSelector(".huge", true); // waits for ".huge" to load into the DOM
    await page.click(".huge");
    console.log("Modal Erradicated!");
    await page.waitForNavigation();
    await page.waitForSelector(".instructions", true); // waits for ".instructions" to load into the DOM
    console.log("Scraping Webpage...");
    const instructions = await page.content(); // copies entire html document
    fs.writeFileSync("./output/scrape.html", instructions, err => { // write scraped html to output folder
      if (err) throw err;
      console.log('HTML file Created!');
    })
    console.log("Ending puppeteer session...");
    await browser.close(); // ends puppeteer session
    await extractHTML(); // Removes unwanted HTML content and formats the rest in markdown
  } catch (err) {
    throw err;
  };
};

getHTML();