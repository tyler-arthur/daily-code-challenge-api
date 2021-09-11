// import * as fs from "fs";
const fs = require("fs")
// import * as rp from "request-promise-native"
const rp = require("request-promise-native")
// import * as puppet from "puppeteer";
const puppet = require("puppeteer")

const getHTML = async () => {
  const browser = await puppet.launch({headless:false});
  const page = await browser.newPage();
  await page.waitForResponse;
  await page.goto("https://edabit.com/shuffle");
  await page.mouse.click(0,0);
  // await page.waitForTimeout(3000);
  await page.waitForSelector(".huge", true);
  await page.click(".huge");
  console.log("clicked")
  await page.waitForNavigation()
  await page.waitForSelector(".instructions", true);
  // const instructions = await page.$$(".instructions")
  const instructions = await page.content();
  console.log(instructions)
  fs.writeFileSync("./output/instructions.html", instructions, (err) => {
    if (err) throw err;
    console.log('Instructions Scraped!')
  })
}

getHTML()

// [0].childNodes[0].data