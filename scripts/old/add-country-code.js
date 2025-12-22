/**
 * Add country_code field to prefectures.json and cities.json
 */

const fs = require('fs');
const path = require('path');

// Paths
const prefecturesPath = path.join(__dirname, '../src/shared/assets/data/prefectures.json');
const citiesPath = path.join(__dirname, '../src/shared/assets/data/cities.json');

// Update prefectures
console.log('Updating prefectures.json...');
const prefectures = require(prefecturesPath);
const updatedPrefectures = prefectures.map(p => ({
  id: p.id,
  name: p.name,
  name_kana: p.name_kana,
  region_id: p.region_id,
  country_code: 'jp'
}));

fs.writeFileSync(prefecturesPath, JSON.stringify(updatedPrefectures, null, 2) + '\n', 'utf8');
console.log(`✅ Updated ${updatedPrefectures.length} prefectures with country_code`);

// Update cities
console.log('Updating cities.json...');
const cities = require(citiesPath);
const updatedCities = cities.map(c => ({
  id: c.id,
  prefecture_id: c.prefecture_id,
  name: c.name,
  name_kana: c.name_kana,
  type: c.type,
  country_code: 'jp'
}));

fs.writeFileSync(citiesPath, JSON.stringify(updatedCities, null, 2) + '\n', 'utf8');
console.log(`✅ Updated ${updatedCities.length} cities with country_code`);

console.log('\n🎉 All master data updated successfully!');
