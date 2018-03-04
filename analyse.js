const data = require('./data/cleanedSpeeches.json')
const { writeFileSync } = require('fs');
const natural = require('natural');

async function analyseWordListForYears(words) {
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
      };
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

async function analyseWordListForSpeeches(words) {
  let speeches = [];
  data.forEach(y => {
    const speechesToAdd = y.speeches.map(s => {
      return {
        year: y.year,
        speech: s.speech,
        name: s.name,
        film: s.film,
        category: s.categoryIndex
      };
    });
    speeches = speeches.concat(speechesToAdd);
  });

  const results = speeches.map(s => {
    // Refactor this out
    const matches = words.map(word => {
      // Find all occurrences of each word
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matched = s.speech.match(regex);
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
      year: s.year,
      name: s.name,
      film: s.film,
      category: s.category,
      totalCount: totalCount,
      wordCounts: matches
    };
  });

  return results;
}

async function getWordCount() {
  const tokenizer = new natural.WordTokenizer();

  let speeches = [];
  data.forEach(y => {
    const speechesToAdd = y.speeches.map(s => {
      return {
        year: y.year,
        speech: s.speech,
        name: s.name,
        film: s.film,
        category: s.categoryIndex
      };
    });
    speeches = speeches.concat(speechesToAdd);
  });

  const results = speeches.map(s => {
    const tokens = tokenizer.tokenize(s.speech);
    return {
      year: s.year,
      name: s.name,
      film: s.film,
      category: s.category,
      speechLength: tokens.length
    };
  });

  return results;
}

 /* Example run

analyseWordListForYears(['thank', 'thanks']).then(result => {
  writeFileSync(
    'results/allYears_thankThanks.json',
    JSON.stringify(result)
  );
});

analyseWordListForSpeeches(['thank', 'thanks']).then(result => {
  writeFileSync(
    'results/allSpeeches_thankThanks.json',
    JSON.stringify(result)
  );
});

getWordCount().then(result => {
  writeFileSync(
    'results/allSpeeches_wordCount.json',
    JSON.stringify(result)
  );
});

*/
