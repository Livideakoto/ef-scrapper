import axios from 'axios';
import * as cheerio from 'cheerio';
import { formatHtmlContent } from './utils/html-formatter';

async function debugBelierFaq() {
  try {
    const url = 'https://www.esteban-frederic.fr/astrologie-signe-belier/';
    console.log(`Debugging: ${url}`);
    
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    
    // Recherche des questions FAQ
    $('h3').each((index, element) => {
      const questionText = $(element).text().trim();
      
      if (questionText && questionText.includes('?')) {
        console.log(`\n=== FAQ ${index + 1} ===`);
        console.log(`Question: "${questionText}"`);
        
        // Récupérer le contenu suivant
        let answerHtml = '';
        let currentElement = $(element).next();
        let elementCount = 0;
        
        console.log(`Starting from next element after h3...`);
        
        while (currentElement.length > 0 && elementCount < 10) {
          const tagName = currentElement.prop('tagName') || '';
          console.log(`  Element ${elementCount}: ${tagName} - "${currentElement.text().trim().substring(0, 100)}..."`);
          
          if (['H2', 'H3'].includes(tagName)) {
            console.log(`  -> Stopping at ${tagName}`);
            break;
          }
          
          if (['P', 'UL', 'OL', 'DIV'].includes(tagName)) {
            const elementHtml = $.html(currentElement);
            answerHtml += elementHtml;
            console.log(`  -> Added ${tagName}: ${elementHtml.length} chars`);
          }
          
          currentElement = currentElement.next();
          elementCount++;
        }
        
        console.log(`Total answer HTML length: ${answerHtml.length}`);
        if (answerHtml.trim()) {
          console.log(`Answer preview: ${answerHtml.substring(0, 200)}...`);
        } else {
          console.log(`No answer content found!`);
        }
        
        // Limiter à 3 FAQ pour le debug
        if (index >= 2) return false;
      }
    });
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Exécuter le debug
if (require.main === module) {
  debugBelierFaq();
}
