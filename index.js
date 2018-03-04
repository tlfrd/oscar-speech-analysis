const puppeteer = require('puppeteer');
const { writeFileSync } = require('fs');

const oscarRange = [12, 89];
const speechStart = 1;

const oscarYearRange = [1939, 2017];

async function newSearch() {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  const url = 'http://aaspeechesdb.oscars.org/results.aspx?QF0=year+term&AC=QBE_QUERY&MR=0&QI0=';

  let totalLinks = 0;
  let currentYear = oscarYearRange[0];

  const yearArray = [];
  let totalCount = 0;

  while (currentYear <= oscarYearRange[1]) {
    await page.goto(`${url}${currentYear}`);

    const data = await page.evaluate(() => {
      const fs = [...document.querySelectorAll('#body_Results1 p font')];
      return fs.map(d => d.innerText);
    });

    const paired = [];

    while (data.length > 0) {
      const key = data.shift();
      const value = data.shift();
      paired.push([key, value]);
    }

    const speeches = [];
    let speechCount = 0;
    while (paired.length > 0) {
      const current = paired.shift();
      if (current[0] === 'year term') {
        speechCount += 1;
      }
      if (!speeches[speechCount - 1]) {
        speeches[speechCount - 1] = {};
      } else {
        speeches[speechCount - 1][current[0]] = current[1];
      }
    }

    console.log(currentYear, speeches.length);

    totalCount += speeches.length;

    yearArray.push({
      year: currentYear,
      speeches: speeches
    })

    currentYear += 1;
  }

  await browser.close();

  writeFileSync(
    'speeches.json',
    JSON.stringify(yearArray)
  );
}

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

newSearch();
