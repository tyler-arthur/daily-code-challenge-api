// Import required modules
const fs = require('fs')
const cheerio = require('cheerio');

// Removes unwanted HTML content and formats the rest in markdown
const extractHTML = async () => {
  console.log("Beginning trimming and formatting...")

  // reading our file and setting it as a cheerio object
  const html = await fs.promises.readFile("./output/scrape.html")
  const $ = cheerio.load(html) 

  const code = $.html('.instructions') // cuts out majority of unwanted content

  // rewriting file with trimmed version of scraped content
  fs.writeFileSync("./output/scrape.html", code, err => {
    if (err) throw err;
    console.log("Almost done...")
  })

  await generateMD() // Final markdown formatting
}

const generateMD = async () => {
  // reading trimmed HTML file and setting it as a cheerio object
  const html = await fs.promises.readFile("./output/scrape.html");
  const $ = cheerio.load(html);

  console.log("Finishing final formatting...")

  const title = $('.content').text(); // Gets the title of the content

  // Gets the wanted section of content from the scraped HTML and formats it into markdown using regexp
  const instructions = $('.instructions-header').next().html()
  .replace(/\v/g, "")
  .replace(/<p>/g, "")
  .replace(/<\/p>/g, "")
  .replace(/<span>/g, "")
  .replace(/<\/span>/g, "")
  .replace(/<ul>/g, "")
  .replace(/<\/ul>/g, "")
  .replace(/<h3>/g, "\n__**")
  .replace(/<\/h3>/g, "**__\n")
  .replace(/<li>/g, "\n* ")
  .replace(/<\/li>/g, "\n")
  .replace(/<em>/g, "*")
  .replace(/<\/em>/g, "*")
  .replace(/<strong>/g, "**")
  .replace(/<\/strong>/g, "**")
  .replace(/<pre>/g, "\n\n``")
  .replace(/<\/pre>/g, "``")
  .replace(/<code>/g, "`")
  .replace(/<\/code>/g, "`")

  // Combining title and content into one string
  const mkdn = `__**${title}**__\n
  ${instructions}
  `
  return console.log("All Done!\n\n", mkdn)
}

module.exports = extractHTML;