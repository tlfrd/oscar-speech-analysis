const data = require('./data/cleanedSpeeches.json')
const { writeFileSync } = require('fs');

async function analyseSingleWord(word) {
  const regex = new RegExp(`\\b${word}\\b`, 'gi');

  const totals = [];

  data.forEach(year => {
    const speechTotals = year.speeches.map(speechData => {
      const match = speechData.speech.match(regex);
      return match ? match.length : 0;
    });

    let count = 0;
    speechTotals.forEach(t => {
      if (t !== 0) {
        count += 1;
      }
    });

    const total = speechTotals.reduce((a, b) => a + b, 0);
    totals.push({
      year: year.year,
      total: total,
      count: count,
      numOfspeechesInYear: speechTotals.length,
      percentageOfSpeeches: count ? count / speechTotals.length * 100 : 0,
      averagePerSpeech: speechTotals.length ? total / speechTotals.length: 0
    });
  });

  return totals;
}

analyseSingleWord('god').then(result => console.log(result))
