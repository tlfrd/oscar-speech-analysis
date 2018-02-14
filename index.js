const puppeteer = require('puppeteer');

const oscarRange = [12, 89];
const speechStart = 1;

const url = 'http://aaspeechesdb.oscars.org/link/012-1/';

async function main() {
  const browser = await puppeteer.launch({
  	args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  await page.goto(url);

  const data = await page.evaluate(() => {
    const ps = [...document.querySelectorAll('#main p')];
    return ps.map(d => {
      return d.innerText;
    });
  });

  await browser.close();

  return data;
}

main().then(data => {
  console.log(data);
})
