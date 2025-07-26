# 🃏 Scrapper de Cartes Tarot avec Images - Esteban Frédéric

## Vue d'ensemble

Scrapper complet et optimisé qui extrait **33 cartes de tarot** depuis le site d'Esteban Frédéric et **télécharge automatiquement leurs images** en local.

## ✨ Fonctionnalités

### 🎯 Extraction de Données
- ✅ **33 cartes complètes** avec contenu HTML, citations, URLs
- ✅ **Détection automatique** des liens vers toutes les cartes
- ✅ **Gestion d'erreurs robuste** avec retry (3 tentatives)
- ✅ **Traitement par batch** optimisé pour la performance

### 🖼️ Téléchargement d'Images (NOUVEAU!)
- ✅ **Détection intelligente** avec multiples stratégies
- ✅ **Support multi-formats** (JPG, PNG, GIF, WebP, SVG)
- ✅ **Gestion lazy-loading** et attributs data-src
- ✅ **Noms organisés** par carte
- ✅ **Évitement re-téléchargement**

### 📊 Formats de Sortie
- ✅ **TypeScript** (.ts) avec interfaces
- ✅ **JSON** brut pour intégration
- ✅ **Résumés détaillés** avec statistiques
- ✅ **Galerie HTML** prête à l'emploi
- ✅ **Composants React** générés
- ✅ **Endpoints API** Express.js

## 🚀 Utilisation Rapide

```bash
# Installation des dépendances
npm install

# Test de téléchargement d'images
npm run test-image-download

# Extraction complète AVEC images
npm run build-cartes-avec-images

# Extraction sans images (plus rapide)
npm run build-cartes-homme-opt
```

## 📁 Structure des Fichiers

```
ef-scrapper/
├── src/
│   ├── extract-cartes-avec-images.ts     # 🆕 Scrapper avec images
│   ├── extract-cartes-homme-optimized.ts # Scrapper optimisé
│   └── test-download-image.ts             # 🆕 Test images
├── data/
│   ├── images/                            # 🆕 Dossier images téléchargées
│   │   ├── carte-homme.jpg
│   │   ├── carte-femme.png
│   │   └── ...
│   ├── cartes-homme-avec-images.ts        # 🆕 Données + images
│   ├── cartes-homme-avec-images.json      # 🆕 JSON + images
│   ├── cartes-homme-avec-images-summary.json # 🆕 Stats images
│   └── galerie-cartes.html                # 🆕 Galerie générée
└── docs/
    ├── CARTES_AVEC_IMAGES.md              # 🆕 Guide images
    └── README-CARTES.md                   # Guide général
```

## 🎯 Interface des Données

```typescript
interface ICardHommeAvecImage {
    name: string;           // "carte-homme"
    url: string;            // URL originale
    image: string;          // URL image originale
    imageLocal?: string;    // 🆕 "carte-homme.jpg"
    imageAlt?: string;      // 🆕 Texte alternatif
    title: string;          // "La carte de l'Homme"
    subtitle: string;       // Sous-titre
    content: string;        // Contenu HTML complet
    quote?: string;         // Citation inspirante
}
```

## 📊 Résultats Attendus

### Extraction Standard
- ⏱️ **Temps** : ~28 secondes
- 🎯 **Succès** : 33/33 cartes (100%)
- 💬 **Citations** : 33/33 cartes

### Extraction avec Images
- ⏱️ **Temps** : ~3-5 minutes
- 🖼️ **Images** : ~25-30 cartes (dépend de la disponibilité)
- 📁 **Formats** : JPG, PNG principalement
- 💾 **Taille** : ~2-5 MB total

## 🎨 Utilisation des Données

### Frontend React
```jsx
import cartes from './data/cartes-homme-avec-images.json';

function CarteComponent({ carte }) {
    return (
        <div className="carte">
            {carte.imageLocal && (
                <img src={`/images/${carte.imageLocal}`} alt={carte.title} />
            )}
            <h3>{carte.title}</h3>
            <p>"{carte.quote}"</p>
        </div>
    );
}
```

### API Express
```javascript
app.use('/images', express.static('./data/images'));

app.get('/api/cartes', (req, res) => {
    const cartes = require('./data/cartes-homme-avec-images.json');
    res.json(cartes.allCards);
});
```

### Galerie HTML Statique
```bash
# Ouvrir directement dans le navigateur
open data/galerie-cartes.html
```

## 🔧 Scripts Disponibles

| Script | Description | Temps | Images |
|--------|-------------|-------|--------|
| `npm run build-cartes-avec-images` | **Extraction complète + images** | ~5 min | ✅ |
| `npm run build-cartes-homme-opt` | Extraction optimisée sans images | ~30 sec | ❌ |
| `npm run test-image-download` | Test téléchargement 1 image | ~10 sec | ✅ |

## 🖼️ Stratégies de Détection d'Images

### 1. Sélecteurs CSS Spécialisés
```javascript
'img[alt*="CARTE"]'          // Alt contenant "CARTE"
'img[src*="/carte"]'         // URL contenant "/carte"  
'.entry-content img:first'   // Première image du contenu
```

### 2. Attributs Lazy-Loading
```javascript
data-src, data-lazy-src, data-original
```

### 3. Patterns HTML Brut
```regex
/data-src="([^"]*carte[^"]*)"/gi
/src="([^"]*\.(?:jpg|png|gif)[^"]*)"/gi
```

## 📱 Exemples d'Intégration

### Tirage Aléatoire avec Images
```javascript
const tiroirAvecImages = (nb = 3) => {
    return cartes
        .filter(c => c.imageLocal)
        .sort(() => Math.random() - 0.5)
        .slice(0, nb);
};
```

### Recherche par Thème
```javascript
const themes = {
    amour: ['amour', 'union', 'famille'],
    defi: ['danger', 'difficulte', 'echec'],
    evolution: ['changement', 'elevation', 'force']
};
```

### PWA/Application Mobile
```javascript
// Service Worker pour cache images
const cacheImages = cartes
    .filter(c => c.imageLocal)
    .map(c => `/images/${c.imageLocal}`);
```

## 🎯 Cas d'Usage Avancés

### 1. **Site de Voyance**
- Galerie interactive des cartes
- Système de tirage en ligne
- Interprétations détaillées

### 2. **Application Mobile**
- Cartes offline avec images
- Notifications quotidiennes
- Historique des tirages

### 3. **Chatbot/IA**
- Base de données des cartes
- Réponses contextuelles
- Images automatiques

### 4. **Formation/Éducation**
- Quiz sur les cartes
- Mémorisation visuelle
- Études comparatives

## ⚡ Performance & Optimisation

### Serveur Web
```nginx
# Nginx - Cache des images
location /images/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### Frontend
```javascript
// Préchargement images critiques
const preloadKey = cartes.slice(0, 5);
preloadKey.forEach(c => {
    if (c.imageLocal) new Image().src = `/images/${c.imageLocal}`;
});
```

## 🚨 Troubleshooting

### Images Manquantes
- Certains sites utilisent des protections anti-scrapping
- Images peuvent être générées dynamiquement
- Vérifier les logs pour les erreurs HTTP

### Espace Disque
- Images peuvent être volumineuses (2-5 MB total)
- Nettoyer périodiquement le dossier `data/images/`

### Performance Réseau
- Augmenter les timeouts si connexion lente
- Réduire la taille des batchs si erreurs

## 📈 Statistiques Types

```json
{
    "totalCards": 33,
    "cardsWithImages": 28,
    "cardsWithoutImages": 5,
    "successRate": "85%",
    "formats": {
        ".jpg": 20,
        ".png": 6,
        ".gif": 2
    }
}
```

## 🎉 Nouveautés v2.0

- 🆕 **Téléchargement d'images automatique**
- 🆕 **Interface enrichie avec métadonnées images**  
- 🆕 **Galerie HTML générée automatiquement**
- 🆕 **Composants React prêts à l'emploi**
- 🆕 **Endpoints API Express**
- 🆕 **Statistiques détaillées des images**

---

**🃏 Extrayez 33 cartes de tarot avec leurs images en une seule commande !**

```bash
npm run build-cartes-avec-images
```
