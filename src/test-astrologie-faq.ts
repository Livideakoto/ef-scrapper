const puppeteer = require('puppeteer');
import { formatHtmlContent } from './utils/html-formatter';

interface IAstrologieFaqItem {
  question: string;
  answer: string;
}

// Test sur un seul signe pour validation
async function testSingleSign() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    const url = 'https://www.esteban-frederic.fr/astrologie-signe-belier/';
    console.log(`Testing scraping for: ${url}`);
    
    await page.goto(url, { waitUntil: 'networkidle2' });
    
    // Attendre que le contenu soit chargé
    await page.waitForTimeout(2000);
    
    const faqItems = await page.evaluate(() => {
      const faqs: { question: string; answer: string }[] = [];
      
      // Recherche des sections qui contiennent des questions (titres h3)
      const questionElements = document.querySelectorAll('h3');
      console.log(`Found ${questionElements.length} h3 elements`);
      
      questionElements.forEach((questionEl, index) => {
        const questionText = questionEl.textContent?.trim();
        console.log(`H3 ${index}: "${questionText}"`);
        
        // Filtrer les questions qui semblent être des FAQ (contiennent un point d'interrogation)
        if (questionText && questionText.includes('?')) {
          console.log(`FAQ found: "${questionText}"`);
          
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
    
    console.log(`Found ${faqItems.length} FAQ items`);
    
    faqItems.forEach((item: { question: string; answer: string }, index: number) => {
      console.log(`\nFAQ ${index + 1}:`);
      console.log(`Question: ${item.question}`);
      console.log(`Answer length: ${item.answer.length} characters`);
      console.log(`Answer preview: ${item.answer.substring(0, 100)}...`);
    });
    
    return faqItems;
    
  } catch (error) {
    console.error('Error:', error);
    return [];
  } finally {
    await browser.close();
  }
}

// Exécuter le test
if (require.main === module) {
  testSingleSign().then(() => {
    console.log('Test completed!');
  }).catch(error => {
    console.error('Test failed:', error);
  });
}
