// example-usage-cartes-avec-images.js
// Exemple d'utilisation des cartes avec images téléchargées

const fs = require('fs');
const path = require('path');

// Simuler les données (remplacer par le vrai fichier une fois généré)
const mockData = {
    allCards: [
        {
            name: "carte-homme",
            title: "La carte de l'Homme",
            url: "https://www.esteban-frederic.fr/carte-homme/",
            image: "https://example.com/homme.jpg",
            imageLocal: "carte-homme.jpg",
            imageAlt: "L'HOMME",
            quote: "C'est à la fin de ma vie que je pourrais dire si j'ai réussi à être un homme.",
            content: "Le principe masculin évoque l'énergie..."
        },
        {
            name: "carte-femme", 
            title: "La carte de la Femme",
            url: "https://www.esteban-frederic.fr/carte-femme/",
            image: "https://example.com/femme.jpg",
            imageLocal: "carte-femme.jpg",
            imageAlt: "LA FEMME",
            quote: "La femme est le trésor du monde.",
            content: "Le principe féminin évoque l'harmonie..."
        }
    ]
};

console.log('🖼️  Analyse des cartes avec images\n');

// 1. Statistiques des images
function analyserImages(cartes) {
    const stats = {
        total: cartes.length,
        avecImages: cartes.filter(c => c.imageLocal).length,
        sansImages: cartes.filter(c => !c.imageLocal).length,
        formatsImages: {}
    };
    
    // Analyser les formats d'images
    cartes.forEach(carte => {
        if (carte.imageLocal) {
            const ext = path.extname(carte.imageLocal).toLowerCase();
            stats.formatsImages[ext] = (stats.formatsImages[ext] || 0) + 1;
        }
    });
    
    return stats;
}

// 2. Générateur de galerie HTML
function genererGalerieHTML(cartes) {
    const cartesAvecImages = cartes.filter(c => c.imageLocal);
    
    let html = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Galerie des Cartes Tarot - Esteban Frédéric</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { text-align: center; margin-bottom: 40px; }
        .gallery { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .card { background: white; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden; transition: transform 0.3s; }
        .card:hover { transform: translateY(-5px); }
        .card img { width: 100%; height: 200px; object-fit: cover; }
        .card-content { padding: 20px; }
        .card-title { font-size: 1.2em; font-weight: bold; margin-bottom: 10px; color: #333; }
        .card-quote { font-style: italic; color: #666; margin-bottom: 15px; }
        .card-link { display: inline-block; padding: 8px 16px; background: #4CAF50; color: white; text-decoration: none; border-radius: 5px; }
        .stats { background: white; padding: 20px; border-radius: 10px; margin-bottom: 30px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🃏 Galerie des Cartes Tarot</h1>
            <p>Collection complète des cartes d'Esteban Frédéric</p>
        </div>
        
        <div class="stats">
            <h2>📊 Statistiques</h2>
            <p><strong>Total des cartes :</strong> ${cartes.length}</p>
            <p><strong>Cartes avec images :</strong> ${cartesAvecImages.length}</p>
            <p><strong>Taux de succès :</strong> ${Math.round((cartesAvecImages.length / cartes.length) * 100)}%</p>
        </div>
        
        <div class="gallery">
`;
    
    cartesAvecImages.forEach(carte => {
        const citation = carte.quote ? carte.quote.replace(/[«»]/g, '"').replace(/Esteban Frederic$/, '').trim() : '';
        html += `
            <div class="card">
                <img src="./images/${carte.imageLocal}" alt="${carte.imageAlt || carte.title}" loading="lazy">
                <div class="card-content">
                    <div class="card-title">${carte.title}</div>
                    ${citation ? `<div class="card-quote">"${citation}"</div>` : ''}
                    <a href="${carte.url}" target="_blank" class="card-link">Voir la carte</a>
                </div>
            </div>
        `;
    });
    
    html += `
        </div>
    </div>
</body>
</html>
`;
    
    return html;
}

// 3. Générateur de composant React
function genererComposantReact(cartes) {
    const cartesAvecImages = cartes.filter(c => c.imageLocal);
    
    return `
import React from 'react';
import './CartesGallery.css';

const cartesData = ${JSON.stringify(cartesAvecImages, null, 2)};

export const CartesGallery = () => {
    return (
        <div className="cartes-gallery">
            <div className="gallery-header">
                <h1>🃏 Cartes Tarot</h1>
                <p>{cartesData.length} cartes avec images</p>
            </div>
            
            <div className="cards-grid">
                {cartesData.map(carte => (
                    <div key={carte.name} className="carte-card">
                        <div className="carte-image">
                            <img 
                                src={\`/images/\${carte.imageLocal}\`}
                                alt={carte.imageAlt || carte.title}
                                loading="lazy"
                            />
                        </div>
                        <div className="carte-content">
                            <h3 className="carte-title">{carte.title}</h3>
                            {carte.quote && (
                                <p className="carte-quote">
                                    "{carte.quote.replace(/[«»]/g, '"').replace(/Esteban Frederic$/, '').trim()}"
                                </p>
                            )}
                            <a 
                                href={carte.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="carte-link"
                            >
                                Découvrir
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CartesGallery;
`;
}

// 4. Générateur d'API REST
function genererAPIEndpoints(cartes) {
    return `
// routes/cartes.js - Express.js endpoints

const express = require('express');
const router = express.Router();
const cartes = require('../data/cartes-homme-avec-images.json');

// GET /api/cartes - Toutes les cartes
router.get('/', (req, res) => {
    const cartesAvecImages = cartes.allCards.filter(c => c.imageLocal);
    res.json({
        total: cartesAvecImages.length,
        cartes: cartesAvecImages.map(carte => ({
            id: carte.name,
            nom: carte.title,
            image: \`/images/\${carte.imageLocal}\`,
            citation: carte.quote?.replace(/[«»]/g, '"').replace(/Esteban Frederic$/, '').trim(),
            url: carte.url
        }))
    });
});

// GET /api/cartes/:id - Carte spécifique
router.get('/:id', (req, res) => {
    const carte = cartes.allCards.find(c => c.name === req.params.id);
    if (!carte) {
        return res.status(404).json({ error: 'Carte non trouvée' });
    }
    
    res.json({
        ...carte,
        imageUrl: carte.imageLocal ? \`/images/\${carte.imageLocal}\` : null
    });
});

// GET /api/cartes/random/:count - Tirage aléatoire
router.get('/random/:count', (req, res) => {
    const count = parseInt(req.params.count) || 3;
    const cartesAvecImages = cartes.allCards.filter(c => c.imageLocal);
    
    const tirage = cartesAvecImages
        .sort(() => Math.random() - 0.5)
        .slice(0, count)
        .map(carte => ({
            id: carte.name,
            nom: carte.title,
            image: \`/images/\${carte.imageLocal}\`,
            citation: carte.quote?.replace(/[«»]/g, '"').replace(/Esteban Frederic$/, '').trim()
        }));
    
    res.json({ tirage });
});

module.exports = router;
`;
}

// Exécution des exemples
console.log('📊 STATISTIQUES');
const stats = analyserImages(mockData.allCards);
console.log(`- Total: ${stats.total} cartes`);
console.log(`- Avec images: ${stats.avecImages} cartes`);
console.log(`- Sans images: ${stats.sansImages} cartes`);
console.log(`- Formats: ${JSON.stringify(stats.formatsImages)}`);

console.log('\n🖼️  GÉNÉRATION DES FICHIERS...');

// Générer la galerie HTML
const htmlGallery = genererGalerieHTML(mockData.allCards);
const galleryPath = path.join(__dirname, 'data/galerie-cartes.html');
fs.writeFileSync(galleryPath, htmlGallery, 'utf8');
console.log(`✅ Galerie HTML générée: ${galleryPath}`);

// Générer le composant React
const reactComponent = genererComposantReact(mockData.allCards);
const reactPath = path.join(__dirname, 'data/CartesGallery.jsx');
fs.writeFileSync(reactPath, reactComponent, 'utf8');
console.log(`✅ Composant React généré: ${reactPath}`);

// Générer les endpoints API
const apiEndpoints = genererAPIEndpoints(mockData.allCards);
const apiPath = path.join(__dirname, 'data/api-cartes.js');
fs.writeFileSync(apiPath, apiEndpoints, 'utf8');
console.log(`✅ Endpoints API générés: ${apiPath}`);

console.log('\n🎯 UTILISATION:');
console.log('1. Lancez le scrapper avec images: npm run build-cartes-avec-images');
console.log('2. Ouvrez data/galerie-cartes.html dans un navigateur');
console.log('3. Utilisez CartesGallery.jsx dans votre app React');
console.log('4. Intégrez api-cartes.js dans votre serveur Express');

console.log('\n✨ Cartes prêtes pour votre application!');
