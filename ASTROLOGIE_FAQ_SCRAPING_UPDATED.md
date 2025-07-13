# Scraping des FAQs Astrologiques - Mise à jour

## Aperçu

Ce script extrait automatiquement les FAQs astrologiques depuis les pages dédiées du site esteban-frederic.fr pour tous les signes du zodiaque, incluant maintenant les **Poissons**.

## Résultats actuels

Le script extrait automatiquement les FAQs astrologiques pour les **12 signes du zodiaque** complets :

- **59 FAQs** extraites au total
- **12 signes astrologiques** couverts
- Mapping par clé : nom du signe au singulier (`belier`, `taureau`, `gemeaux`, etc.)
- Interface `IFaqItem` avec les propriétés `title` et `content`

### Signes couverts :
1. **Bélier** (`belier`) - 5 FAQs
2. **Taureau** (`taureau`) - 5 FAQs
3. **Gémeaux** (`gemeaux`) - 5 FAQs
4. **Cancer** (`cancer`) - 6 FAQs
5. **Lion** (`lion`) - 5 FAQs
6. **Vierge** (`vierge`) - 5 FAQs
7. **Balance** (`balance`) - 2 FAQs
8. **Scorpion** (`scorpion`) - 5 FAQs
9. **Sagittaire** (`sagittaire`) - 5 FAQs
10. **Capricorne** (`capricorne`) - 5 FAQs
11. **Verseau** (`verseau`) - 6 FAQs
12. **Poissons** (`poissons`) - 5 FAQs ✨ *Nouveau*

### Note spéciale - Poissons
Le signe des Poissons utilise une URL différente : `/astrologie-le-signe-du-poissons/` au lieu de `/astrologie-signe-poissons/`. Cette spécificité est maintenant gérée automatiquement par le script.

## Structure du fichier généré

```typescript
export interface IFaqItem {
  title: string;
  content: string;
}

export const astrologieFaqsBySigne: Record<string, IFaqItem[]> = {
  "belier": [
    {
      title: "Quel est le caractère d'un Bélier ?",
      content: "<div><p>Le Bélier est un signe astrologique connu pour son caractère dynamique et audacieux...</p></div>"
    },
    // ... autres FAQs
  ],
  "poissons": [
    {
      title: "Quel est le caractère d'un Poisson ?",
      content: "<div><p>Les natifs du signe zodiaque Poisson sont caractérisés principalement par leur imagination...</p></div>"
    },
    // ... autres FAQs
  ],
  // ... autres signes
};
```

## Utilisation dans le front-end

Le fichier généré peut être directement importé dans les composants React/Next.js :

```typescript
import { astrologieFaqsBySigne } from './data/astrologie-faqs';

// Usage dans un composant
const SigneAstroPage = ({ signe }) => {
  const faqs = astrologieFaqsBySigne[signe] || [];
  
  return (
    <div>
      {faqs.map((faq, index) => (
        <div key={index}>
          <h3>{faq.title}</h3>
          <div dangerouslySetInnerHTML={{ __html: faq.content }} />
        </div>
      ))}
    </div>
  );
};
```

## Exemple d'intégration

Le fichier généré est prêt à être intégré dans le projet Next.js existant :

```typescript
// Dans le composant SigneAstroPage
import { astrologieFaqsBySigne } from '@/lib/datas/astrologie-faqs';

// Dans la fonction qui génère la page
const faqsForSign = astrologieFaqsBySigne[signe] || [];
```

## Commandes disponibles

```bash
# Exécuter l'extraction complète
npm run build-astrologie-faq

# Exécuter le script générique (configurable)
npm run build-astrologie-faq-generic
```

## Maintenance

- Le script peut être relancé pour mettre à jour les FAQs
- Les URLs sont configurables et gèrent les cas spéciaux (comme les Poissons)
- Le formatage HTML est optimisé pour l'affichage web
- Le script gère automatiquement les erreurs et les timeouts
- Interface `IFaqItem` standardisée pour une meilleure réutilisabilité

## Fichiers générés

- `/data/astrologie-faqs.ts` : Fichier principal avec toutes les FAQs
- Copie automatique vers `/ef_front_nextjs/src/lib/datas/astrologie-faqs.ts`
