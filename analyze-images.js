// analyze-images.js
const fs = require('fs');

const data = JSON.parse(fs.readFileSync('./data/cartes-homme.json', 'utf8'));

console.log('📊 ANALYSE DES IMAGES DANS LES CARTES\n');

let imagesValides = 0;
let imagesManquantes = 0;
let imagesLazyLoaded = 0;

console.log('✅ Images trouvées:');
data.allCards.forEach(card => {
  if (card.image && !card.image.includes('data:image')) {
    console.log(`${card.name}: ${card.image}`);
    imagesValides++;
  }
});

console.log('\n❌ Images lazy-loaded ou manquantes:');
data.allCards.forEach(card => {
  if (!card.image || card.image.includes('data:image')) {
    console.log(`${card.name}: ${card.image || 'AUCUNE'}`);
    if (card.image && card.image.includes('data:image')) {
      imagesLazyLoaded++;
    } else {
      imagesManquantes++;
    }
  }
});

console.log(`\n📈 STATISTIQUES:`);
console.log(`- Images valides: ${imagesValides}`);
console.log(`- Images lazy-loaded: ${imagesLazyLoaded}`);
console.log(`- Images manquantes: ${imagesManquantes}`);
console.log(`- Total cartes: ${data.allCards.length}`);
