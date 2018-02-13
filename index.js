const puppeteer = require('puppeteer');

const url = 'http://aaspeechesdb.oscars.org/link/012-1/';

async function main() {
  const browser = await puppeteer.launch({
  	args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  await page.goto(url);

  await page.screenshot({path: 'example.png'});

  return false;
}

main();
