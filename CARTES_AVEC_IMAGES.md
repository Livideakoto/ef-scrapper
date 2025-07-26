# 🖼️ Scrapper de Cartes avec Images - Guide d'Utilisation

## Améliorations apportées

Le scrapper a été amélioré pour **télécharger automatiquement les images** de chaque carte en local.

### 🆕 Nouvelles Fonctionnalités

- ✅ **Détection intelligente d'images** avec multiples stratégies
- ✅ **Téléchargement automatique** des images en local
- ✅ **Gestion des images lazy-loaded** et data-src
- ✅ **Support multi-formats** (JPG, PNG, GIF, WebP, SVG)
- ✅ **Noms de fichiers organisés** par carte
- ✅ **Statistiques détaillées** des téléchargements

### 📁 Structure des Données

```typescript
interface ICardHommeAvecImage {
    name: string;           // "carte-homme"
    url: string;            // URL de la carte
    image: string;          // URL de l'image originale
    imageLocal?: string;    // Nom du fichier image local
    imageAlt?: string;      // Texte alternatif de l'image
    title: string;          // Titre de la carte
    subtitle: string;       // Sous-titre
    content: string;        // Contenu HTML
    quote?: string;         // Citation
}
```

## 🚀 Utilisation

### Test de téléchargement d'images
```bash
npm run test-image-download
```

### Extraction complète avec images
```bash
npm run build-cartes-avec-images
```

## 📂 Fichiers Générés

### Images
- `data/images/` - Dossier contenant toutes les images téléchargées
  - `carte-homme.jpg`
  - `carte-femme.png` 
  - `carte-amour.jpg`
  - etc.

### Données
- `data/cartes-homme-avec-images.ts` - Interface TypeScript + données
- `data/cartes-homme-avec-images.json` - Données JSON complètes
- `data/cartes-homme-avec-images-summary.json` - Statistiques détaillées

## 🎯 Stratégies de Détection d'Images

### 1. Sélecteurs CSS Spécialisés
```javascript
const imageSelectors = [
    'img[alt*="CARTE"]',      // Images avec ALT contenant "CARTE"
    'img[alt*="carte"]',      // Images avec ALT contenant "carte"
    'img[src*="/carte"]',     // Images dont l'URL contient "/carte"
    '.card-image img',        // Images dans conteneurs spécialisés
    '.entry-content img:first-of-type'  // Première image du contenu
];
```

### 2. Attributs Lazy-Loading
```javascript
// Recherche dans les attributs de lazy-loading
image = imgEl.attr('src') || 
        imgEl.attr('data-src') || 
        imgEl.attr('data-lazy-src') || 
        imgEl.attr('data-original');
```

### 3. Analyse du HTML Brut
```javascript
const imagePatterns = [
    /data-src="([^"]*carte[^"]*)"/gi,
    /src="([^"]*carte[^"]*)"/gi,
    /href="([^"]*\.(?:jpg|jpeg|png|gif|webp)[^"]*)"/gi
];
```

## 📊 Exemple de Résumé Généré

```json
{
    "totalCards": 33,
    "cardsWithImages": 28,
    "cardsWithoutImages": 5,
    "extractionDate": "2025-07-26T20:30:00.000Z",
    "imageFolder": "./data/images/",
    "cards": [
        {
            "name": "carte-homme",
            "title": "La carte de l'Homme",
            "hasImage": true,
            "hasLocalImage": true,
            "imageLocal": "carte-homme.jpg",
            "imageAlt": "L'HOMME"
        }
    ]
}
```

## 🖼️ Gestion des Images

### Formats Supportés
- **JPG/JPEG** - Format le plus courant
- **PNG** - Images avec transparence
- **GIF** - Images animées
- **WebP** - Format moderne optimisé
- **SVG** - Images vectorielles

### Nommage des Fichiers
- Format: `{nom-de-la-carte}.{extension}`
- Exemples:
  - `carte-homme.jpg`
  - `carte-femme.png`
  - `la-carte-de-la-reussite.webp`

### Dédoublonnage
- Les images existantes ne sont pas re-téléchargées
- Vérification de l'existence avant téléchargement
- Gestion des erreurs de téléchargement

## 🔧 Configuration Avancée

### Timeouts et Retry
```typescript
const config = {
    timeout: 15000,           // 15 secondes par requête
    maxRetries: 3,            // 3 tentatives par carte
    batchSize: 2,             // 2 cartes simultanées
    pauseBetweenBatches: 3000 // 3 secondes entre batches
};
```

### Headers HTTP
```typescript
const headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) WebKit/537.36 Chrome/91.0.4472.124 Safari/537.36'
};
```

## 💡 Utilisation des Images

### Dans une Application Web
```javascript
// Servir les images statiquement
app.use('/images', express.static('./data/images'));

// Utiliser dans le frontend
const imageUrl = `/images/${carte.imageLocal}`;
```

### Dans React/Vue
```jsx
// Importer les données
import cartesAvecImages from './data/cartes-homme-avec-images.json';

// Afficher une carte avec son image
function CarteComponent({ carte }) {
    const imagePath = carte.imageLocal 
        ? `/images/${carte.imageLocal}` 
        : '/default-card.jpg';
    
    return (
        <div className="carte">
            <img src={imagePath} alt={carte.imageAlt || carte.title} />
            <h3>{carte.title}</h3>
            <p>{carte.quote}</p>
        </div>
    );
}
```

### Optimisation Frontend
```javascript
// Précharger les images critiques
const preloadImages = (cartes) => {
    cartes.slice(0, 5).forEach(carte => {
        if (carte.imageLocal) {
            const img = new Image();
            img.src = `/images/${carte.imageLocal}`;
        }
    });
};
```

## 🎨 Cas d'Usage Avancés

### Galerie de Cartes
```javascript
// Créer une galerie interactive
const createGallery = (cartes) => {
    return cartes
        .filter(carte => carte.imageLocal)
        .map(carte => ({
            id: carte.name,
            title: carte.title,
            image: `/images/${carte.imageLocal}`,
            description: carte.quote,
            url: carte.url
        }));
};
```

### Système de Tirage avec Images
```javascript
// Tirage aléatoire avec images
const tiroirAvecImages = (nombreCartes = 3) => {
    const cartesAvecImages = cartes.filter(c => c.imageLocal);
    return cartesAvecImages
        .sort(() => Math.random() - 0.5)
        .slice(0, nombreCartes);
};
```

### Export pour Mobile/Desktop
```javascript
// Optimiser pour différentes plateformes
const exportPourMobile = (cartes) => {
    return {
        cartes: cartes.map(carte => ({
            id: carte.name,
            nom: carte.title,
            image: carte.imageLocal,
            citation: carte.quote?.replace(/[«»]/g, '"'),
            contenu: carte.content.replace(/<[^>]*>/g, '').substring(0, 200)
        })),
        dossierImages: './images/',
        totalAvecImages: cartes.filter(c => c.imageLocal).length
    };
};
```

## ⚡ Performance

### Optimisations Appliquées
- **Traitement séquentiel** pour éviter la surcharge serveur
- **Pauses intelligentes** entre les téléchargements
- **Gestion d'erreurs robuste** avec retry automatique
- **Détection de format** automatique des images
- **Évitement des re-téléchargements**

### Temps Estimés
- **Test d'une carte** : ~5 secondes
- **33 cartes complètes** : ~3-5 minutes
- **Dépend de** : taille des images, vitesse réseau, charge serveur

## 🚨 Points d'Attention

### Images Lazy-Loaded
- Certaines images peuvent ne pas être détectées
- Le scrapper essaie plusieurs stratégies
- Vérification manuelle parfois nécessaire

### Respect du Serveur
- Pauses entre requêtes respectées
- Headers appropriés utilisés
- Gestion des codes d'erreur HTTP

### Stockage Local
- Vérifiez l'espace disque disponible
- Images peuvent être volumineuses
- Nettoyage périodique recommandé

---

**🎯 Scrapper maintenant prêt pour télécharger automatiquement toutes les images des cartes !**
