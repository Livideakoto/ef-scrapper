// example-usage-cartes.js
// Exemple d'utilisation des données extraites des cartes

const fs = require('fs');
const path = require('path');

// Charger les données des cartes
const cartesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/cartes-homme.json'), 'utf8'));
const cartes = cartesData.allCards;

console.log('🃏 Analyse des cartes de tarot Esteban Frédéric\n');

// 1. Statistiques générales
console.log('📊 STATISTIQUES GÉNÉRALES');
console.log(`- Total des cartes: ${cartes.length}`);
console.log(`- Cartes avec citations: ${cartes.filter(c => c.quote).length}`);
console.log(`- Cartes avec images: ${cartes.filter(c => c.image && !c.image.includes('data:image')).length}`);
console.log(`- Longueur moyenne du contenu: ${Math.round(cartes.reduce((sum, c) => sum + c.content.length, 0) / cartes.length)} caractères\n`);

// 2. Cartes par thématique
console.log('🎭 CARTES PAR THÉMATIQUE');
const thematiques = {
    'Émotions positives': ['bonheur', 'amour', 'amitie', 'union', 'reussite'],
    'Défis et obstacles': ['difficulte', 'danger', 'echec', 'retard', 'instabilite'],
    'Relations humaines': ['famille', 'trahison', 'jalousie', 'conflit', 'separation'],
    'Évolution personnelle': ['changement', 'elevation', 'force', 'choix', 'jeunesse'],
    'Aspects matériels': ['argent', 'travail', 'maison', 'vacances']
};

Object.entries(thematiques).forEach(([theme, keywords]) => {
    console.log(`\n${theme}:`);
    keywords.forEach(keyword => {
        const carte = cartes.find(c => c.name.includes(keyword));
        if (carte) {
            console.log(`  • ${carte.title}`);
        }
    });
});

// 3. Citations inspirantes
console.log('\n💫 CITATIONS INSPIRANTES');
cartes.slice(0, 5).forEach((carte, index) => {
    if (carte.quote) {
        console.log(`${index + 1}. ${carte.quote.replace(/«|»/g, '"').replace(/Esteban Frederic$/, '').trim()}`);
        console.log(`   — ${carte.title}\n`);
    }
});

// 4. Recherche par mot-clé
function rechercherCarte(motCle) {
    const resultats = cartes.filter(carte => 
        carte.title.toLowerCase().includes(motCle.toLowerCase()) ||
        carte.content.toLowerCase().includes(motCle.toLowerCase()) ||
        carte.name.toLowerCase().includes(motCle.toLowerCase())
    );
    
    return resultats;
}

// Exemples de recherche
console.log('🔍 EXEMPLES DE RECHERCHE');
console.log('\nRecherche "amour":');
rechercherCarte('amour').forEach(carte => {
    console.log(`  • ${carte.title} (${carte.url})`);
});

console.log('\nRecherche "force":');
rechercherCarte('force').forEach(carte => {
    console.log(`  • ${carte.title} (${carte.url})`);
});

// 5. Générateur de tirage aléatoire
function tiroirAleatoire(nombreCartes = 3) {
    const cartesmelangees = [...cartes].sort(() => Math.random() - 0.5);
    return cartesmelangees.slice(0, nombreCartes);
}

console.log('\n🎲 TIRAGE ALÉATOIRE (3 cartes)');
const tirage = tiroirAleatoire(3);
tirage.forEach((carte, index) => {
    console.log(`\n${index + 1}. ${carte.title}`);
    console.log(`   URL: ${carte.url}`);
    if (carte.quote) {
        console.log(`   Citation: ${carte.quote.replace(/«|»/g, '"').replace(/Esteban Frederic$/, '').trim()}`);
    }
});

// 6. Export pour utilisation frontend
const exportData = {
    totalCartes: cartes.length,
    cartes: cartes.map(carte => ({
        id: carte.name,
        nom: carte.title,
        url: carte.url,
        citation: carte.quote?.replace(/«|»|Esteban Frederic/g, '').trim(),
        resume: carte.content.replace(/<[^>]*>/g, '').substring(0, 200) + '...'
    })),
    thematiques: thematiques
};

// Sauvegarder l'export
fs.writeFileSync(
    path.join(__dirname, 'data/cartes-export-frontend.json'), 
    JSON.stringify(exportData, null, 2), 
    'utf8'
);

console.log('\n✅ Export frontend sauvegardé dans: data/cartes-export-frontend.json');
console.log('\n🎯 Données prêtes à être intégrées dans votre application!');
