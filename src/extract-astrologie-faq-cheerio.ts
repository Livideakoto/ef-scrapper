import axios from 'axios';
import * as cheerio from 'cheerio';
import { formatHtmlContent } from './utils/html-formatter';

interface IFaqItem {
  title: string;
  content: string;
}

interface IAstrologieFaqBySign {
  [signe: string]: IFaqItem[];
}

// Configuration des signes astrologiques
const SIGNES_ASTROLOGIQUES = [
  'belier',
  'taureau',
  'gemeaux',
  'cancer',
  'lion',
  'vierge',
  'balance',
  'scorpion',
  'sagittaire',
  'capricorne',
  'verseau',
  'poissons'
] as const;

type SigneAstrologique = typeof SIGNES_ASTROLOGIQUES[number];

const SIGNE_NAMES: Record<SigneAstrologique, string> = {
  'belier': 'Bélier',
  'taureau': 'Taureau',
  'gemeaux': 'Gémeaux',
  'cancer': 'Cancer',
  'lion': 'Lion',
  'vierge': 'Vierge',
  'balance': 'Balance',
  'scorpion': 'Scorpion',
  'sagittaire': 'Sagittaire',
  'capricorne': 'Capricorne',
  'verseau': 'Verseau',
  'poissons': 'Poissons'
};

async function extractAstrologieFaqForSign(signe: SigneAstrologique): Promise<IFaqItem[]> {
  try {
    // URL spéciale pour les Poissons
    const url = signe === 'poissons' 
      ? `https://www.esteban-frederic.fr/astrologie-le-signe-du-poissons/`
      : `https://www.esteban-frederic.fr/astrologie-signe-${signe}/`;
    
    console.log(`Scraping FAQ for ${SIGNE_NAMES[signe]} from: ${url}`);
    
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    
    const faqItems: IFaqItem[] = [];
    
    // Recherche des sections qui contiennent des questions (titres h3)
    $('h3').each((index, element) => {
      const questionText = $(element).text().trim();
      
      // Filtrer les questions qui semblent être des FAQ (contiennent un point d'interrogation)
      if (questionText && questionText.includes('?')) {
        console.log(`Found FAQ: "${questionText}"`);
        
        // Récupérer le contenu suivant jusqu'au prochain h3 ou h2
        let answerHtml = '';
        let currentElement = $(element).next();
        
        while (currentElement.length > 0 && !['H2', 'H3'].includes(currentElement.prop('tagName') || '')) {
          if (['P', 'UL', 'OL', 'DIV'].includes(currentElement.prop('tagName') || '')) {
            answerHtml += $.html(currentElement);
          }
          currentElement = currentElement.next();
        }
        
        if (answerHtml.trim()) {
          faqItems.push({
            title: questionText,
            content: formatHtmlContent(answerHtml.trim())
          });
        }
      }
    });
    
    console.log(`Found ${faqItems.length} FAQ items for ${SIGNE_NAMES[signe]}`);
    return faqItems;
    
  } catch (error) {
    console.error(`Error scraping FAQ for ${signe}:`, error);
    return [];
  }
}

async function extractAllAstrologieFaqs(): Promise<IAstrologieFaqBySign> {
  const allFaqs: IAstrologieFaqBySign = {};
  
  for (const signe of SIGNES_ASTROLOGIQUES) {
    try {    const faqItems = await extractAstrologieFaqForSign(signe);
    if (faqItems.length > 0) {
      allFaqs[signe] = faqItems;
    }
      
      // Attendre un peu entre les requêtes pour éviter de surcharger le serveur
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Error processing ${signe}:`, error);
    }
  }
  
  return allFaqs;
}

async function main() {
  try {
    console.log('Starting astrologie FAQ extraction...');
    
    const allFaqs = await extractAllAstrologieFaqs();
    
    // Les clés sont déjà correctes (nom du signe au singulier)
    const faqsBySigne: Record<string, IFaqItem[]> = allFaqs;
    
    // Génération du contenu TypeScript
    const tsContent = `// Fichier généré automatiquement - Ne pas modifier manuellement
// Généré le: ${new Date().toISOString()}

export interface IFaqItem {
  title: string;
  content: string;
}

export const astrologieFaqsBySigne: Record<string, IFaqItem[]> = ${JSON.stringify(faqsBySigne, null, 2)};

export default astrologieFaqsBySigne;
`;
    
    // Écrire le fichier
    const fs = require('fs');
    const path = require('path');
    const outputPath = path.join(__dirname, '..', 'data', 'astrologie-faqs.ts');
    
    fs.writeFileSync(outputPath, tsContent);
    
    console.log(`✅ Astrologie FAQs extracted successfully!`);
    console.log(`📁 Output file: ${outputPath}`);
    
    // Afficher un résumé
    const totalFaqs = Object.values(faqsBySigne).reduce((sum, faqs) => sum + faqs.length, 0);
    console.log(`📊 Total FAQs extracted: ${totalFaqs}`);
    console.log(`🎯 Signs processed: ${Object.keys(faqsBySigne).length}`);
    
    Object.entries(faqsBySigne).forEach(([signe, faqs]) => {
      console.log(`   - ${SIGNE_NAMES[signe as SigneAstrologique]}: ${faqs.length} FAQs`);
    });
    
  } catch (error) {
    console.error('Error during extraction:', error);
    process.exit(1);
  }
}

// Exporter les fonctions pour usage externe
export { extractAstrologieFaqForSign, extractAllAstrologieFaqs };

// Exécuter si appelé directement
if (require.main === module) {
  main();
}
