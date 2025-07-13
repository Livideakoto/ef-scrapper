# Récapitulatif des Scripts d'Extraction FAQ Astrologiques

## Scripts créés

### 1. Script spécifique : `extract-astrologie-faq-cheerio.ts`
- **Commande** : `npm run build-astrologie-faq`
- **Fonctionnalité** : Extrait les FAQs de tous les 12 signes astrologiques
- **Fichier de sortie** : `data/astrologie-faqs.ts`
- **URL pattern** : `https://www.esteban-frederic.fr/astrologie-signe-{signe}/`

### 2. Script générique : `extract-astrologie-faq-generic.ts`
- **Commande** : `npm run build-astrologie-faq-generic [CONFIG_FILE]`
- **Fonctionnalité** : Extrait les FAQs astrologiques avec configuration personnalisable
- **Fichier de sortie** : Configurable (par défaut `astrologie-faqs-generic.ts`)
- **Configuration** : `config/astrologie-faq-config.json`

### 3. Script de test : `debug-astrologie-faq.ts`
- **Fonctionnalité** : Debug et test du scraping sur la page Bélier
- **Usage** : Pour développement et débogage

## Fichiers générés

### Structure des FAQs astrologiques
```typescript
export interface IAstrologieFaqItem {
  question: string;
  answer: string;
}

export const astrologieFaqsByPath: Record<string, IAstrologieFaqItem[]> = {
  "/astrologie-signe-belier": [
    {
      question: "Quel est le caractère d'un Bélier ?",
      answer: "<div><p>Le Bélier est un signe astrologique connu pour son caractère dynamique et audacieux...</p></div>"
    },
    // ... autres FAQs
  ],
  // ... autres signes (taureau, gemeaux, cancer, etc.)
};
```

## Signes astrologiques supportés

1. **Bélier** (`/astrologie-signe-belier`) - 5 FAQs
2. **Taureau** (`/astrologie-signe-taureau`) - 5 FAQs
3. **Gémeaux** (`/astrologie-signe-gemeaux`) - 5 FAQs
4. **Cancer** (`/astrologie-signe-cancer`) - 6 FAQs
5. **Lion** (`/astrologie-signe-lion`) - 5 FAQs
6. **Vierge** (`/astrologie-signe-vierge`) - 5 FAQs
7. **Balance** (`/astrologie-signe-balance`) - 2 FAQs
8. **Scorpion** (`/astrologie-signe-scorpion`) - 5 FAQs
9. **Sagittaire** (`/astrologie-signe-sagittaire`) - 5 FAQs
10. **Capricorne** (`/astrologie-signe-capricorne`) - 5 FAQs
11. **Verseau** (`/astrologie-signe-verseau`) - 6 FAQs
12. **Poissons** (`/astrologie-signe-poissons`) - 5 FAQs

**Total** : 58 FAQs extraites sur 12 signes astrologiques

## Types de questions extraites

- "Quel est le caractère d'un {Signe} ?"
- "Quels sont les défauts du {Signe} ?"
- "Quel signe astrologique est compatible avec le {Signe} ?"
- "Femmes et hommes {Signe}, des personnalités différentes?"
- "Quel avenir pour les {Signe}s ?"
- "Comment sont les {Signe}s en amour ?" (certains signes)

## Utilisation dans le front-end

Le fichier généré peut être directement importé dans les composants React/Next.js :

```typescript
import { astrologieFaqsByPath } from './data/astrologie-faqs';

// Usage dans un composant
const SigneAstroPage = ({ signe }) => {
  const faqs = astrologieFaqsByPath[`/astrologie-signe-${signe}`] || [];
  
  return (
    <div>
      {faqs.map((faq, index) => (
        <div key={index}>
          <h3>{faq.question}</h3>
          <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
        </div>
      ))}
    </div>
  );
};
```

## Maintenance

- Le script peut être relancé pour mettre à jour les FAQs
- Les URLs sont configurables via le fichier de configuration
- Le formatage HTML est optimisé pour l'affichage web
- Le script gère automatiquement les erreurs et les timeouts

## Exemple d'intégration

Le fichier généré est prêt à être intégré dans le projet Next.js existant :

```typescript
// Dans le composant SigneAstroPage
import { astrologieFaqsByPath } from '@/data/astrologie-faqs';

// Dans la fonction qui génère la page
const pathname = `/astrologie-signe-${signe}`;
const faqsForSign = astrologieFaqsByPath[pathname] || [];
```
