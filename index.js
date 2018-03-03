const puppeteer = require('puppeteer');

const oscarRange = [12, 89];
const speechStart = 1;

const oscarYearRange = [1939, 2017];

// WIP
async function mainSearch() {
  const browser = await puppeteer.launch({
  	args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  await page.goto('http://aaspeechesdb.oscars.org/');

  let totalLinks = 0;
  let currentYear = oscarYearRange[0];

  while (currentYear <= oscarYearRange[1]) {
    await page.click('#QI0');

    await backspace4Times(page);

    await page.keyboard.type(currentYear.toString());
    await page.click('#body_SearchButton');
    const result = await page.waitForSelector('#main div p a', {timeout: 10000}).catch((err) => {
      console.log(`No data for ${currentYear}`);
      return 'N/A'
    });

    let data;
    if (result !== 'N/A') {
      data = await page.evaluate(() => {
        const ps = [...document.querySelectorAll('#main div p')];
        return ps.map(d => {
          return d.innerText;
        });
      });
      totalLinks += data.length;
      console.log(currentYear, data.length);
    }

    currentYear += 1;
    await page.goBack();
  }

  console.log(totalLinks);

  await browser.close();
}

async function backspace4Times(page) {
  await page.keyboard.press('Backspace');
  await page.keyboard.press('Backspace');
  await page.keyboard.press('Backspace');
  await page.keyboard.press('Backspace');
}

async function main() {
  const browser = await puppeteer.launch({
  	args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  let currentOscarYear = oscarRange[0];
  let currentSpeech = speechStart;

  let oscarsIndex = 0;
  const oscarsData = [];
  oscarsData.push({
    year: currentOscarYear,
    speeches: []
  });

  while (currentOscarYear <= oscarRange[1]) {
    const url = `http://aaspeechesdb.oscars.org/link/0${currentOscarYear}-${currentSpeech}/`;
    await page.goto(url);

    const data = await page.evaluate(() => {
      const ps = [...document.querySelectorAll('#main p')];
      return ps.map(d => {
        return d.innerText;
      });
    });

    if (data.length === 0) {
      const yearMeta = oscarsData[oscarsIndex];
      console.log(`Scraped ${yearMeta.speeches.length} speeches for Oscar ${yearMeta.year}`);
      currentOscarYear += 1;
      oscarsIndex += 1;
      currentSpeech = 1;
      oscarsData.push({
        year: currentOscarYear,
        speeches: []
      });
    } else {
      oscarsData[oscarsIndex].speeches.push({
        year: currentOscarYear,
        speechId: currentSpeech,
        data: data
      });
      currentSpeech += 1;
    }
  }

  await browser.close();

  return oscarsData;
}

mainSearch();
