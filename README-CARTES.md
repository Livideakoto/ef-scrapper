# 🃏 Scrapper de Cartes Tarot - Esteban Frédéric

## Description

Ce scrapper extrait automatiquement **33 cartes de tarot** depuis le site d'Esteban Frédéric en commençant par la page https://www.esteban-frederic.fr/carte-homme/. Il découvre automatiquement tous les liens vers les autres cartes et extrait leur contenu complet.

## ✨ Résultats

**33 cartes extraites avec succès** en ~28 secondes :

- 🏠 **Carte principale** : La carte de l'Homme
- 📊 **Toutes les cartes** contiennent des citations inspirantes
- 📝 **Contenu riche** : titres, contenus HTML, citations
- 🔗 **URLs complètes** pour chaque carte

## 🚀 Utilisation Rapide

```bash
# Installation des dépendances (si pas déjà fait)
npm install

# Extraction optimisée (recommandée)
npm run build-cartes-homme-opt

# Ou extraction basique
npm run build-cartes-homme
```

## 📁 Fichiers Générés

| Fichier | Description |
|---------|-------------|
| `data/cartes-homme.ts` | Interface TypeScript + données complètes |
| `data/cartes-homme.json` | Données JSON brutes |
| `data/cartes-homme-summary.json` | Résumé et statistiques |
| `data/cartes-export-frontend.json` | Version optimisée pour frontend |

## 🎯 Données Extraites

```typescript
interface ICardHomme {
    name: string;      // "carte-homme"
    url: string;       // "https://www.esteban-frederic.fr/carte-homme/"
    image: string;     // URL de l'image (si disponible)
    title: string;     // "La carte de l'Homme"
    subtitle: string;  // Sous-titre
    content: string;   // Contenu HTML complet
    quote?: string;    // "C'est à la fin de ma vie que je pourrais..."
}
```

## 🃏 Liste des Cartes

<details>
<summary>Voir les 33 cartes extraites</summary>

### Personnages
- 👨 **La carte de l'Homme** - Puissance, autorité, courage
- 👩 **La carte de la Femme** - Harmonie, intelligence, intuition

### Émotions & Relations
- ❤️ **La carte de l'Amour** - Sentiments et passion
- 🤝 **La carte de l'Amitié** - Relations et solidarité
- 👨‍👩‍👧‍👦 **La carte de la Famille** - Liens familiaux
- 💑 **La carte de l'Union** - Associations et mariages
- 💔 **La carte de la Séparation** - Ruptures et éloignement
- 😠 **La carte du Conflit** - Tensions et disputes
- 😈 **La carte de la Jalousie** - Émotions destructrices

### Évolution & Force
- 🎯 **La carte de la Réussite** - Succès et accomplissement
- ⬆️ **La carte de l'Élévation** - Progression spirituelle
- 💪 **La carte de la Force** - Volonté et détermination
- 🔄 **La carte du Changement** - Transformations majeures
- 🎭 **La carte du Choix** - Décisions cruciales
- 🌅 **La carte de la Jeunesse** - Vitalité et nouveaux départs
- 🧓 **La carte de la Vieillesse** - Sagesse et expérience

### Défis & Obstacles
- ⚠️ **La carte du Danger** - Vigilance requise
- 😰 **La carte de la Difficulté** - Obstacles à surmonter
- ❌ **La carte de l'Échec** - Revers et leçons
- ⏰ **La carte du Retard** - Patience et attente
- 🌪️ **La carte de l'Instabilité** - Changements nécessaires
- 🐍 **La carte de la Trahison** - Méfiance et révélations
- 🤥 **La carte du Mensonge** - Tromperies et illusions

### Aspects Matériels
- 💰 **La carte de l'Argent** - Aspects financiers
- 💼 **La carte du Travail** - Activité professionnelle
- 🏠 **La carte de la Maison** - Foyer et sécurité
- 🏖️ **La carte des Vacances** - Repos et détente

### Temps & Communication
- 📰 **La carte de la Nouvelle** - Informations importantes
- 🔙 **La carte du Retour** - Cycles et recommencements
- 🕰️ **La carte du Passé** - Influences antérieures
- 💬 **La carte des Discussions** - Communications importantes
- 📏 **La carte de l'Éloignement** - Distance physique/émotionnelle

### Émotions Positives
- 😊 **La carte du Bonheur** - Joie et satisfaction

</details>

## 💡 Exemples d'Utilisation

### TypeScript/JavaScript

```typescript
import CartesHomme from './data/cartes-homme';

// Toutes les cartes
console.log(`${CartesHomme.length} cartes disponibles`);

// Carte spécifique
const carteAmour = CartesHomme.find(c => c.name === 'la-carte-de-lamour');

// Cartes par thème
const cartesEmotions = CartesHomme.filter(c => 
    ['amour', 'bonheur', 'amitie'].some(mot => c.name.includes(mot))
);

// Tirage aléatoire
const tirage = CartesHomme.sort(() => 0.5 - Math.random()).slice(0, 3);
```

### Recherche et Filtres

```javascript
// Recherche par mot-clé
function rechercherCarte(motCle) {
    return CartesHomme.filter(carte => 
        carte.title.toLowerCase().includes(motCle.toLowerCase()) ||
        carte.content.toLowerCase().includes(motCle.toLowerCase())
    );
}

// Exemples
const cartesAmour = rechercherCarte('amour'); // 8 cartes
const cartesForce = rechercherCarte('force'); // 9 cartes
```

## 🎲 Fonctionnalités Bonus

Le fichier `example-usage-cartes.js` inclut :

- 📊 **Statistiques détaillées** 
- 🎭 **Classification par thématiques**
- 💫 **Citations inspirantes**
- 🔍 **Moteur de recherche**
- 🎲 **Générateur de tirage aléatoire**
- 📤 **Export optimisé pour frontend**

```bash
node example-usage-cartes.js
```

## 🛠️ Architecture Technique

- **Language** : TypeScript/Node.js
- **HTTP Client** : Axios
- **HTML Parser** : Cheerio
- **Gestion d'erreurs** : Retry automatique (3 tentatives)
- **Performance** : Traitement par batch (3 cartes simultanées)
- **Rate Limiting** : Pause de 2s entre batches

## 📈 Performance

- ⏱️ **Temps d'exécution** : ~28 secondes
- 🎯 **Taux de succès** : 100% (33/33 cartes)
- 🔄 **Retry intelligent** : 3 tentatives par carte
- 🚦 **Rate limiting** : Respectueux du serveur

## 🎨 Intégration Frontend

Les données sont prêtes pour intégration dans :

- ⚛️ **React/Vue/Angular** - Import direct du JSON
- 📱 **Applications mobiles** - API REST simple
- 🌐 **Sites web** - Données statiques optimisées
- 🎮 **Applications de tarot** - Système de tirage inclus

## ✅ Avantages

- 🔄 **Automatique** : Découverte auto des nouvelles cartes
- 📊 **Complet** : Toutes les données préservées
- 🎯 **Fiable** : Gestion d'erreurs robuste
- 🚀 **Rapide** : Optimisé pour la performance
- 📱 **Prêt à l'emploi** : Formats multiples
- 🎨 **Flexible** : Facile à personnaliser

---

**🃏 Données complètes de 33 cartes de tarot prêtes à être intégrées dans vos projets !**
