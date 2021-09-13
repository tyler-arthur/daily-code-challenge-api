// Import required modules
const fs = require("fs");
const cheerio = require("cheerio");
const puppet = require("puppeteer");
const inquirer = require("inquirer")
const extractHTML = require("./extractor");

// Opens a browser, navigates to the correct page, and scrapes the HTML content
const getHTML = async (difficulty) => {
  try {
    const browser = await puppet.launch({ headless: false });
    const page = await browser.newPage();
    await page.waitForResponse;
    console.log("Waiting for Page load...")
    await page.goto("https://edabit.com/shuffle");
    await page.mouse.click(0, 0); // this closes a modal that prevents ".huge" from loading
    await page.waitForSelector(".huge", true); // waits for ".huge" to load into the DOM

    // uses prompt response to select a difficulty for the coding challenge
    switch (difficulty) {
      case "Very easy":
        await page.click("div.fields > div:nth-child(2) > div > div")
        await page.click("div.fields > div:nth-child(2) > div > div > div.visible.menu.transition > div.selected.item")
        break;
      case "Easy":
        await page.click("div.fields > div:nth-child(2) > div > div")
        await page.click("div.fields > div:nth-child(2) > div > div > div.visible.menu.transition > div:nth-child(2)")
        break;
      case "Medium":
        await page.click("div.fields > div:nth-child(2) > div > div")
        await page.click("div.fields > div:nth-child(2) > div > div > div.visible.menu.transition > div:nth-child(2)")
        break;
      case "Hard":
        await page.click("div.fields > div:nth-child(2) > div > div")
        await page.click("div.fields > div:nth-child(2) > div > div > div.visible.menu.transition > div:nth-child(2)")
        break;
      case "Very hard":
        await page.click("div.fields > div:nth-child(2) > div > div")
        await page.click("div.fields > div:nth-child(2) > div > div > div.visible.menu.transition > div:nth-child(2)")
        break;
      default:
        break;
    }

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

const start = () => {
  inquirer.prompt([
    {
      type: "list",
      name: "choice",
      message: "Select a difficulty:",
      choices: [
        "Random Difficulty",
        "Very easy",
        "Easy",
        "Medium",
        "Hard",
        "Very Hard"
      ]
    }
  ])
  .then(res => {
    getHTML(res.choice)
  })
}

start();