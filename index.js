const puppeteer = require('puppeteer');

// const oscarRange = [12, 89];
const oscarRange = [12, 89];
const speechStart = 1;

// const url = 'http://aaspeechesdb.oscars.org/link/012-1/';

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

main().then(data => {
  console.log(data);
})
