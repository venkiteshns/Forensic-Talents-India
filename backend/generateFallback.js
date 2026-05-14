import rawData from './rawData.js';

function createFallback(data) {
  const result = {
    easy: [],
    medium: [],
    hard: [],
    pro: []
  };

  const sortByLength = arr =>
    arr.sort((a, b) => a.word.length - b.word.length);

  ["easy","medium","hard","pro"].forEach(level => {
    // Filter rawData to get this level's items
    // (In rawData, the data is already grouped by level, so we can just use rawData[level])
    const levelData = sortByLength([...rawData[level]]);
    // Ensure we only use the ones with <= 12 characters as per validation
    const validLevelData = levelData.filter(d => d.word.length <= 12);
    result[level] = validLevelData.slice(0, 10);
  });

  return result;
}

console.log(JSON.stringify(createFallback(rawData), null, 2));
