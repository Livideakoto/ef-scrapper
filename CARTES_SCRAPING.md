# Scrapper de Cartes Tarot - Esteban Frédéric

Ce scrapper extrait automatiquement toutes les cartes de tarot disponibles sur le site d'Esteban Frédéric, en commençant par la page https://www.esteban-frederic.fr/carte-homme/.

## Fonctionnalités

- ✅ **Extraction automatique** de toutes les cartes de tarot trouvées
- ✅ **Détection intelligente** des liens vers les autres cartes
- ✅ **Extraction du contenu** : titre, sous-titre, contenu HTML, citations
- ✅ **Gestion des erreurs** avec retry automatique
- ✅ **Traitement par batch** pour éviter la surcharge du serveur
- ✅ **Sauvegarde multiple** : TypeScript (.ts) et JSON (.json)
- ✅ **Rapport détaillé** avec résumé des données extraites

## Structure des données extraites

```typescript
interface ICardHomme {
    name: string;        // Nom technique de la carte (slug URL)
    url: string;         // URL complète de la carte
    image: string;       // URL de l'image principale
    title: string;       // Titre principal de la carte
    subtitle: string;    // Sous-titre
    content: string;     // Contenu HTML de la carte
    quote?: string;      // Citation associée à la carte
}
```

## Utilisation

### Extraction complète (recommandée)

```bash
npm run build-cartes-homme-opt
```

### Extraction basique (plus lente)

```bash
npm run build-cartes-homme
```

## Fichiers générés

Après exécution, le scrapper génère 3 fichiers dans le dossier `data/` :

### 1. `cartes-homme.ts`
Fichier TypeScript contenant toutes les cartes extraites avec l'interface et les exports.

```typescript
export interface ICardHomme { ... }
const CartesHomme: ICardHomme[] = [ ... ];
export const cartes: Record<string, ICardHomme[]> = {
    "/cartes-tarot": CartesHomme,
};
export default CartesHomme;
```

### 2. `cartes-homme.json`
Fichier JSON contenant les données brutes pour faciliter l'utilisation dans d'autres projets.

### 3. `cartes-homme-summary.json`
Fichier de résumé avec statistiques et informations sur l'extraction :

```json
{
    "totalCards": 33,
    "extractionDate": "2025-07-26T19:53:00.583Z",
    "cards": [
        {
            "name": "carte-homme",
            "title": "La carte de l'Homme",
            "url": "https://www.esteban-frederic.fr/carte-homme/",
            "hasImage": false,
            "hasQuote": true,
            "contentLength": 1377
        }
        // ... autres cartes
    ]
}
```

## Cartes extraites

Au total, **33 cartes** ont été extraites :

1. **La carte de l'Homme** - Puissance, autorité, courage
2. **La carte de la Femme** - Harmonie, intelligence, intuition
3. **La carte de la Réussite** - Succès et accomplissement
4. **La carte de l'Élévation** - Progression spirituelle
5. **La carte du Retard** - Patience et attente
6. **La carte de l'Amitié** - Relations et solidarité
7. **La carte de la Maison** - Foyer et sécurité
8. **La carte de la Force** - Volonté et détermination
9. **La carte de l'Instabilité** - Changements nécessaires
10. **La carte de la Trahison** - Méfiance et révélations
11. **La carte du Danger** - Vigilance requise
12. **La carte de l'Argent** - Aspects financiers
13. **La carte du Retour** - Cycles et recommencements
14. **La carte de la Difficulté** - Obstacles à surmonter
15. **La carte du Travail** - Activité professionnelle
16. **La carte des Vacances** - Repos et détente
17. **La carte de la Nouvelle** - Informations importantes
18. **La carte de l'Union** - Associations et mariages
19. **La carte de la Famille** - Liens familiaux
20. **La carte de l'Amour** - Sentiments et passion
21. **La carte du Conflit** - Tensions et disputes
22. **La carte de la Séparation** - Ruptures et éloignement
23. **La carte du Changement** - Transformations majeures
24. **La carte des Discussions** - Communications importantes
25. **La carte de l'Échec** - Revers et leçons
26. **La carte de la Jalousie** - Émotions destructrices
27. **La carte du Mensonge** - Tromperies et illusions
28. **La carte du Passé** - Influences antérieures
29. **La carte du Choix** - Décisions cruciales
30. **La carte de l'Éloignement** - Distance physique/émotionnelle
31. **La carte du Bonheur** - Joie et satisfaction
32. **La carte de la Jeunesse** - Vitalité et nouveaux départs
33. **La carte de la Vieillesse** - Sagesse et expérience

## Utilisation des données

### Dans un projet TypeScript

```typescript
import CartesHomme, { ICardHomme } from './data/cartes-homme';

// Utiliser toutes les cartes
console.log(`Total des cartes: ${CartesHomme.length}`);

// Rechercher une carte spécifique
const carteHomme = CartesHomme.find(carte => carte.name === 'carte-homme');

// Filtrer les cartes avec citation
const cartesAvecCitation = CartesHomme.filter(carte => carte.quote);
```

### Dans un projet JavaScript/Node.js

```javascript
const cartes = require('./data/cartes-homme.json');

// Accéder aux données
console.log(cartes.allCards.length); // Nombre total de cartes
console.log(cartes.currentCard.title); // Titre de la carte principale
```

## Configuration et personnalisation

Le scrapper peut être facilement adapté pour d'autres types de contenus :

- Modifier les sélecteurs CSS dans `scrapCardPage()`
- Ajuster les patterns de reconnaissance des cartes
- Changer les URLs de base
- Personnaliser les formats de sortie

## Performance

- **Temps d'exécution** : ~28 secondes pour 33 cartes
- **Traitement par batch** : 3 cartes simultanément
- **Gestion des erreurs** : 3 tentatives par carte
- **Pause entre batches** : 2 secondes

## Dépendances

- `axios` : Requêtes HTTP
- `cheerio` : Parsing HTML (jQuery-like)
- `fs` : Gestion des fichiers
- `path` : Manipulation des chemins

## Logs et debugging

Le scrapper affiche des logs détaillés pendant l'exécution :

```
🃏 Début de l'extraction optimisée des cartes...
=== Extraction de la carte principale ===
Scraping (tentative 1): https://www.esteban-frederic.fr/carte-homme/
✅ Extrait: La carte de l'Homme
=== Extraction des liens depuis la page principale ===
Found 32 card URLs
=== Extraction de 32 autres cartes ===

--- Batch 1/11 ---
Scraping (tentative 1): https://www.esteban-frederic.fr/carte-femme/
✅ Extrait: La carte de la Femme
...

✅ Extraction terminée avec succès en 28 secondes!
```

## Notes importantes

- Le scrapper respecte les pauses pour ne pas surcharger le serveur
- Les images lazy-loaded ne sont pas toujours correctement extraites
- Le contenu HTML est préservé tel quel pour un maximum de flexibilité
- Chaque carte contient une citation inspirante d'Esteban Frédéric
