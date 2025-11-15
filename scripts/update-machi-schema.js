/**
 * Update machi.json with new schema fields
 * - Add name_kana (placeholder for now - needs manual entry or API conversion)
 * - Convert line_name to lines array format
 * - Add country_code
 * - Add prefecture_name and city_name by looking up from master data
 * - Remove old prefecture field
 */

const fs = require('fs');
const path = require('path');

// Load master data
const prefectures = require('../src/shared/assets/data/prefectures.json');
const cities = require('../src/shared/assets/data/cities.json');
const machi = require('../src/shared/assets/data/machi.json');

// Create lookup maps
const prefectureMap = {};
prefectures.forEach(p => {
  prefectureMap[p.id] = p.name;
});

const cityMap = {};
cities.forEach(c => {
  cityMap[c.id] = c.name;
});

// Simple kana placeholder - in production, this would need proper conversion
// For now, using empty string as placeholder
function getNameKanaPlaceholder(name) {
  // TODO: Use proper kana conversion API or manual data entry
  // For now, return empty string as placeholder
  return '';
}

// Convert line_name to lines array format
// For now, just wrapping in array with Japanese key
// Future: add English translations
function convertLineNameToLines(lineName) {
  if (!lineName) return null;

  // Return array of line objects with ja (Japanese) key
  // In the future, add "en" key for English translations
  return [{ ja: lineName }];
}

// Update machi data
console.log('Updating machi.json with new schema...');
const updatedMachi = machi.map(m => {
  const prefecture_name = prefectureMap[m.prefecture_id];
  const city_name = m.city_id ? cityMap[m.city_id] : null;

  if (!prefecture_name) {
    console.warn(`⚠️  Warning: Prefecture not found for ${m.prefecture_id}`);
  }

  if (m.city_id && !city_name) {
    console.warn(`⚠️  Warning: City not found for ${m.city_id}`);
  }

  return {
    id: m.id,
    name: m.name,
    name_kana: getNameKanaPlaceholder(m.name), // TODO: Add proper kana
    latitude: m.latitude,
    longitude: m.longitude,
    lines: convertLineNameToLines(m.line_name),
    prefecture_id: m.prefecture_id,
    city_id: m.city_id,
    country_code: 'jp',
    prefecture_name: prefecture_name,
    city_name: city_name
  };
});

// Write updated data
const outputPath = path.join(__dirname, '../src/shared/assets/data/machi.json');
fs.writeFileSync(outputPath, JSON.stringify(updatedMachi, null, 2) + '\n', 'utf8');

console.log(`✅ Updated ${updatedMachi.length} machi entries`);
console.log('\n📝 Note: name_kana fields are currently empty placeholders.');
console.log('   You may want to add proper kana data manually or use a conversion API.\n');
console.log('🎉 machi.json schema update complete!');
