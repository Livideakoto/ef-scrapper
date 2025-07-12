# Scripts de Scraping FAQ

Ce projet contient des scripts pour extraire automatiquement les FAQs des pages web et les formater en TypeScript.

## Scripts disponibles

### 1. Script spécifique FAQ Tchat
```bash
npm run build-faq-tchat
```
Extrait spécifiquement la FAQ de la page voyance par tchat.

### 2. Script générique FAQ
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

## Structure des fichiers générés

Les fichiers générés suivent cette structure :

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

## Comment intégrer une nouvelle FAQ

1. Utilisez le script générique pour extraire la FAQ :
   ```bash
   npm run build-faq-generic "https://example.com/page" "/page" "PageName"
   ```

2. Le fichier sera généré dans `data/faq-pagename.ts`

3. Copiez le contenu dans `data/example-faqs.ts` pour l'intégrer avec les autres FAQs

## Fonctionnalités

- ✅ Extraction automatique des sections H3 comme titres FAQ
- ✅ Récupération du contenu HTML complet (p, ul, ol, blockquote, h4, div)
- ✅ Évite les doublons de titres
- ✅ Filtre les sections non-FAQ
- ✅ Génération de fichiers TypeScript formatés
- ✅ Aperçu des FAQs extraites dans la console

## Dépendances

- `axios` : Pour les requêtes HTTP
- `cheerio` : Pour le parsing HTML
- `typescript` : Pour la compilation TypeScript

## Utilisation programmatique

Vous pouvez également utiliser la fonction `generateFaqFile` directement :

```typescript
import { generateFaqFile } from './src/extract-faq-generic';

await generateFaqFile({
    url: "https://example.com/page",
    pathname: "/page",
    constantName: "PageName",
    outputFileName: "faq-page.ts"
});
```
