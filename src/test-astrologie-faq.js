"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer = require('puppeteer');
// Test sur un seul signe pour validation
function testSingleSign() {
    return __awaiter(this, void 0, void 0, function* () {
        const browser = yield puppeteer.launch({ headless: true });
        const page = yield browser.newPage();
        try {
            const url = 'https://www.esteban-frederic.fr/astrologie-signe-belier/';
            console.log(`Testing scraping for: ${url}`);
            yield page.goto(url, { waitUntil: 'networkidle2' });
            // Attendre que le contenu soit chargé
            yield page.waitForTimeout(2000);
            const faqItems = yield page.evaluate(() => {
                const faqs = [];
                // Recherche des sections qui contiennent des questions (titres h3)
                const questionElements = document.querySelectorAll('h3');
                console.log(`Found ${questionElements.length} h3 elements`);
                questionElements.forEach((questionEl, index) => {
                    var _a;
                    const questionText = (_a = questionEl.textContent) === null || _a === void 0 ? void 0 : _a.trim();
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
            faqItems.forEach((item, index) => {
                console.log(`\nFAQ ${index + 1}:`);
                console.log(`Question: ${item.question}`);
                console.log(`Answer length: ${item.answer.length} characters`);
                console.log(`Answer preview: ${item.answer.substring(0, 100)}...`);
            });
            return faqItems;
        }
        catch (error) {
            console.error('Error:', error);
            return [];
        }
        finally {
            yield browser.close();
        }
    });
}
// Exécuter le test
if (require.main === module) {
    testSingleSign().then(() => {
        console.log('Test completed!');
    }).catch(error => {
        console.error('Test failed:', error);
    });
}
