const puppeteer = require('puppeteer');
import { formatHtmlContent } from './utils/html-formatter';

interface IAstrologieFaqItem {
  question: string;
  answer: string;
}

interface IAstrologieFaqBySign {
  [signe: string]: IAstrologieFaqItem[];
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
  'poisson'
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
  'poisson': 'Poissons'
};

async function extractAstrologieFaqForSign(signe: SigneAstrologique): Promise<IAstrologieFaqItem[]> {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    const url = `https://www.esteban-frederic.fr/astrologie-signe-${signe}/`;
    console.log(`Scraping FAQ for ${SIGNE_NAMES[signe]} from: ${url}`);
    
    await page.goto(url, { waitUntil: 'networkidle2' });
    
    // Attendre que le contenu soit chargé
    await page.waitForTimeout(2000);
    
    const faqItems = await page.evaluate(() => {
      const faqs: { question: string; answer: string }[] = [];
      
      // Recherche des sections qui contiennent des questions (titres h3)
      const questionElements = document.querySelectorAll('h3');
      
      questionElements.forEach((questionEl) => {
        const questionText = questionEl.textContent?.trim();
        
        // Filtrer les questions qui semblent être des FAQ (contiennent un point d'interrogation)
        if (questionText && questionText.includes('?')) {
          // Récupérer le contenu suivant jusqu'au prochain h3 ou h2
          let answerHtml = '';
          let currentElement = questionEl.nextElementSibling;
          
          while (currentElement && !['H2', 'H3'].includes(currentElement.tagName)) {
            if (currentElement.tagName === 'P' || currentElement.tagName === 'UL' || currentElement.tagName === 'OL') {
              answerHtml += currentElement.outerHTML;
            }
            currentElement = currentElement.nextElementSibling;
          }
          
          if (answerHtml.trim()) {
            faqs.push({
              question: questionText,
              answer: answerHtml.trim()
            });
          }
        }
      });
      
      return faqs;
    });
    
    console.log(`Found ${faqItems.length} FAQ items for ${SIGNE_NAMES[signe]}`);
    
    // Formatter le contenu HTML
    const formattedFaqItems = faqItems.map((item: { question: string; answer: string }) => ({
      question: item.question,
      answer: formatHtmlContent(item.answer)
    }));
    
    return formattedFaqItems;
    
  } catch (error) {
    console.error(`Error scraping FAQ for ${signe}:`, error);
    return [];
  } finally {
    await browser.close();
  }
}

async function extractAllAstrologieFaqs(): Promise<IAstrologieFaqBySign> {
  const allFaqs: IAstrologieFaqBySign = {};
  
  for (const signe of SIGNES_ASTROLOGIQUES) {
    const faqItems = await extractAstrologieFaqForSign(signe);
    if (faqItems.length > 0) {
      allFaqs[`/astrologie-signe-${signe}`] = faqItems;
    }
    
    // Attendre un peu entre les requêtes pour éviter de surcharger le serveur
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  return allFaqs;
}

async function main() {
  try {
    console.log('Starting astrologie FAQ extraction...');
    
    const allFaqs = await extractAllAstrologieFaqs();
    
    // Génération du contenu TypeScript
    const tsContent = `// Fichier généré automatiquement - Ne pas modifier manuellement
// Généré le: ${new Date().toISOString()}

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
    const outputPath = path.join(__dirname, '..', 'data', 'astrologie-faqs.ts');
    
    fs.writeFileSync(outputPath, tsContent);
    
    console.log(`✅ Astrologie FAQs extracted successfully!`);
    console.log(`📁 Output file: ${outputPath}`);
    
    // Afficher un résumé
    const totalFaqs = Object.values(allFaqs).reduce((sum, faqs) => sum + faqs.length, 0);
    console.log(`📊 Total FAQs extracted: ${totalFaqs}`);
    console.log(`🎯 Signs processed: ${Object.keys(allFaqs).length}`);
    
    Object.entries(allFaqs).forEach(([path, faqs]) => {
      const signe = path.replace('/astrologie-signe-', '') as SigneAstrologique;
      console.log(`   - ${SIGNE_NAMES[signe]}: ${faqs.length} FAQs`);
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
