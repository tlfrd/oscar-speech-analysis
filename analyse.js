const data = require('./data/cleanedSpeeches.json')
const { writeFileSync } = require('fs');

async function analyseWordList(words) {
  const totals = [];

  // For each year
  data.forEach(y => {
    // For each speech
    const speechTotals = y.speeches.map(speechData => {
      // For each word
      const matches = words.map(word => {
        // Find all occurrences of each word
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        const matched = speechData.speech.match(regex);
        const matchedCount = matched ? matched.length : 0;

        return {
          word: word,
          count: matchedCount
        }
      });

      let totalCount = 0;
      matches.forEach(m => {
        if (m.count !== 0) {
          totalCount += m.count;
        }
      });

      return {
        totalCount: totalCount,
        wordCounts: matches
      }
    });


    // How many speeches include these words
    let speechIncludesWords = 0;
    let totalOccurencesInYear = 0;
    speechTotals.forEach(t => {
      if (t.totalCount !== 0) {
        speechIncludesWords += 1;
        totalOccurencesInYear += t.totalCount;
      }
    });

    totals.push({
      year: y.year,
      noOfSpeeches: speechTotals.length,
      totalOccurences: totalOccurencesInYear,
      noOfSpeechesIncludingWord: speechIncludesWords
    });
  });

  return totals;
}

analyseWordList(['god']).then(result => console.log(result));
