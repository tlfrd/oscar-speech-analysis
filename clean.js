const data = require('./data/speeches.json')
const { writeFileSync } = require('fs');

async function cleanData(dataSource) {
  dataSource.forEach(year => {
    year.speeches = year.speeches.map(speech => ({
      name: cleanNames(speech.name),
      presenter: cleanNames(speech.presenter),
      film: speech['film title'],
      categoryIndex: speech['category index'],
      categoryExact: speech['category exact'],
      speech: cleanSpeech(speech.transcript)
    }));
  });

  writeFileSync(
    'data/cleanedSpeeches.json',
    JSON.stringify(dataSource)
  );
}

function cleanNames(names) {
  let newNames = names ? names : 'N/A';
  if (newNames !== 'N/A') {
    newNames = names.split('\n');
  }
  return newNames;
}

function cleanSpeech(speech) {
  let speechText = speech.replace(/\n/g, ' ');
  speechText = speechText.replace(/\"/g, "'");
  return speechText;
}

cleanData(data);
