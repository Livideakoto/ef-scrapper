import axios from 'axios';
import * as cheerio from 'cheerio';
import { formatHtmlContent } from './utils/html-formatter';

interface IAstrologieFaqConfig {
  signes: string[];
  baseUrl: string;
  outputFile: string;
  pathPrefix: string;
}

interface IAstrologieFaqItem {
  question: string;
  answer: string;
}

// Configuration par défaut
const DEFAULT_CONFIG: IAstrologieFaqConfig = {
  signes: [
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
  ],
  baseUrl: 'https://www.esteban-frederic.fr/astrologie-signe-',
  outputFile: 'astrologie-faqs-generic.ts',
  pathPrefix: '/astrologie-signe-'
};

const SIGNE_NAMES: Record<string, string> = {
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

async function extractAstrologieFaqForSign(signe: string, baseUrl: string): Promise<IAstrologieFaqItem[]> {
  try {
    const url = `${baseUrl}${signe}/`;
    console.log(`Scraping FAQ for ${SIGNE_NAMES[signe] || signe} from: ${url}`);
    
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    
    const faqItems: IAstrologieFaqItem[] = [];
    
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
            question: questionText,
            answer: formatHtmlContent(answerHtml.trim())
          });
        }
      }
    });
    
    console.log(`Found ${faqItems.length} FAQ items for ${SIGNE_NAMES[signe] || signe}`);
    return faqItems;
    
  } catch (error) {
    console.error(`Error scraping FAQ for ${signe}:`, error);
    return [];
  }
}

async function extractAstrologieFaqsGeneric(config: IAstrologieFaqConfig): Promise<Record<string, IAstrologieFaqItem[]>> {
  const allFaqs: Record<string, IAstrologieFaqItem[]> = {};
  
  for (const signe of config.signes) {
    try {
      const faqItems = await extractAstrologieFaqForSign(signe, config.baseUrl);
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
    // Configuration depuis les arguments de ligne de commande ou fichier de config
    const configFile = process.argv[2];
    let config = DEFAULT_CONFIG;
    
    if (configFile) {
      try {
        const configData = require(configFile);
        config = { ...DEFAULT_CONFIG, ...configData };
      } catch (error) {
        console.error(`Error loading config file: ${configFile}`, error);
        console.log('Using default configuration...');
      }
    }
    
    console.log('Starting astrologie FAQ extraction with config:', {
      signes: config.signes.length,
      baseUrl: config.baseUrl,
      outputFile: config.outputFile,
      pathPrefix: config.pathPrefix
    });
    
    const allFaqs = await extractAstrologieFaqsGeneric(config);
    
    // Génération du contenu TypeScript
    const tsContent = `// Fichier généré automatiquement - Ne pas modifier manuellement
// Généré le: ${new Date().toISOString()}
// Configuration: ${JSON.stringify(config, null, 2)}

export interface IAstrologieFaqItem {
  question: string;
  answer: string;
}

export const astrologieFaqsByPath: Record<string, IAstrologieFaqItem[]> = ${JSON.stringify(allFaqs, null, 2)};

export default astrologieFaqsByPath;
`;
    
    // Écrire le fichier
    const fs = require('fs');
    const path = require('path');
    const outputPath = path.join(__dirname, '..', 'data', config.outputFile);
    
    fs.writeFileSync(outputPath, tsContent);
    
    console.log(`✅ Astrologie FAQs extracted successfully!`);
    console.log(`📁 Output file: ${outputPath}`);
    
    // Afficher un résumé
    const totalFaqs = Object.values(allFaqs).reduce((sum, faqs) => sum + faqs.length, 0);
    console.log(`📊 Total FAQs extracted: ${totalFaqs}`);
    console.log(`🎯 Signs processed: ${Object.keys(allFaqs).length}`);
    
    Object.entries(allFaqs).forEach(([signe, faqs]) => {
      console.log(`   - ${SIGNE_NAMES[signe] || signe}: ${faqs.length} FAQs`);
    });
    
  } catch (error) {
    console.error('Error during extraction:', error);
    process.exit(1);
  }
}

// Exporter les fonctions pour usage externe
export { extractAstrologieFaqForSign, extractAstrologieFaqsGeneric };

// Exécuter si appelé directement
if (require.main === module) {
  main();
}
