# Scripts de Scraping FAQ et Cartes

Ce projet contient des scripts pour extraire automatiquement les FAQs et cartes d'information des pages web et les formater en TypeScript.

## Scripts disponibles

### 1. Scripts FAQ

#### Script spécifique FAQ Tchat
```bash
npm run build-faq-tchat
```
Extrait spécifiquement la FAQ de la page voyance par tchat.

#### Script générique FAQ
```bash
npm run build-faq-generic <URL> <PATHNAME> <CONSTANT_NAME> [OUTPUT_FILE]
```

**Paramètres :**
- `URL` : L'URL complète de la page à scraper
- `PATHNAME` : Le chemin de l'URL (utilisé comme clé dans l'objet faqs)
- `CONSTANT_NAME` : Le nom de la constante TypeScript à générer
- `OUTPUT_FILE` : (optionnel) Le nom du fichier de sortie

**Exemple :**
```bash
npm run build-faq-generic "https://www.esteban-frederic.fr/voyance-par-tchat-serieuse-et-immediate/" "/voyance-par-tchat-serieuse-et-immediate" "VoyanceParTchat" "faq-tchat.ts"
```

### 2. Scripts Cartes SMS

#### Script spécifique cartes SMS
```bash
npm run build-sms-cards
```
Extrait les cartes de la section "Tout savoir sur la voyance par SMS" avec images, titres et contenus.

#### Script générique cartes
```bash
npm run build-cards-generic <CONFIG_FILE>
```

**Exemple :**
```bash
npm run build-cards-generic sms-cards.json
```

## Structure des fichiers générés

### FAQs
```typescript
export interface IFaqItem {
    title: string;
    content: string;
}

const [CONSTANT_NAME] = [
    {
        title: "Titre de la FAQ",
        content: `<div>Contenu HTML de la FAQ</div>`
    },
    // ... autres FAQs
];

export const faqs: Record<string, IFaqItem[]> = {
    "[PATHNAME]": [CONSTANT_NAME],
};
```

### Cartes SMS
```typescript
export interface ISmsCard {
    image: string;
    title: string;
    content: string; // Contenu HTML
}

const VoyanceSmsCards = [
    {
        image: "nom-image",
        title: "Titre de la carte",
        content: "<div><p>Contenu HTML de la carte...</p><ul><li>Item 1</li><li>Item 2</li></ul></div>"
    },
    // ... autres cartes
];

export const smsCards: Record<string, ISmsCard[]> = {
    "/voyance-sms": VoyanceSmsCards,
};
```

## Configuration pour les cartes

Créez un fichier JSON dans le dossier `config/` avec cette structure :

```json
{
    "url": "https://example.com/page",
    "pathname": "/page",
    "constantName": "PageCards",
    "sectionTitle": "Section à scraper",
    "expectedTitles": [
        "Titre 1",
        "Titre 2"
    ],
    "imageMapping": {
        "Titre 1": "image-1",
        "Titre 2": "image-2"
    },
    "outputFileName": "page-cards.ts"
}
```

## Cartes SMS extraites

Le script extrait automatiquement 6 cartes de la section "Tout savoir sur la voyance par SMS" :

1. **Consultation voyance par SMS : 98% de satisfaction !**
   - Image: consultation-sms-satisfaction
   - Contenu: Informations sur la satisfaction client

2. **La voyance par SMS : comment ça marche?**
   - Image: comment-ca-marche
   - Contenu: Explication du fonctionnement

3. **Quels sont les avantages de la voyance par SMS ?**
   - Image: avantages-voyance-sms
   - Contenu: Liste des avantages

4. **Combien coûte une voyance par SMS ?**
   - Image: cout-voyance-sms
   - Contenu: Tarification

5. **Voyance par SMS : quels supports divinatoires utilisent les voyants ?**
   - Image: supports-divinatoires
   - Contenu: Liste des supports utilisés

6. **Quelle question poser lors d'une voyance par SMS ?**
   - Image: questions-voyance-sms
   - Contenu: Exemples de questions

## Fonctionnalités

- ✅ Extraction automatique des sections H3 comme titres
- ✅ Récupération du contenu HTML complet (p, ul, ol, blockquote, div)
- ✅ Mapping des images selon les titres
- ✅ Évite les doublons de titres
- ✅ Filtre les sections non-pertinentes
- ✅ Génération de fichiers TypeScript formatés
- ✅ Contenu HTML préservé avec balises et formatage
- ✅ Aperçu des FAQs/cartes extraites dans la console
- ✅ Support des fichiers de configuration JSON

## Dépendances

- `axios` : Pour les requêtes HTTP
- `cheerio` : Pour le parsing HTML
- `typescript` : Pour la compilation TypeScript

## Utilisation programmatique

### FAQs
```typescript
import { generateFaqFile } from './src/extract-faq-generic';

await generateFaqFile({
    url: "https://example.com/page",
    pathname: "/page",
    constantName: "PageName",
    outputFileName: "faq-page.ts"
});
```

### Cartes
```typescript
import { generateCardsFile } from './src/extract-cards-generic';

await generateCardsFile({
    url: "https://example.com/page",
    pathname: "/page",
    constantName: "PageCards",
    sectionTitle: "Section à scraper",
    expectedTitles: ["Titre 1", "Titre 2"],
    imageMapping: {"Titre 1": "image-1"},
    outputFileName: "page-cards.ts"
});
```
