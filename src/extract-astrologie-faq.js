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
exports.extractAstrologieFaqForSign = extractAstrologieFaqForSign;
exports.extractAllAstrologieFaqs = extractAllAstrologieFaqs;
const puppeteer = require('puppeteer');
const html_formatter_1 = require("./utils/html-formatter");
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
];
const SIGNE_NAMES = {
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
function extractAstrologieFaqForSign(signe) {
    return __awaiter(this, void 0, void 0, function* () {
        const browser = yield puppeteer.launch({ headless: true });
        const page = yield browser.newPage();
        try {
            const url = `https://www.esteban-frederic.fr/astrologie-signe-${signe}/`;
            console.log(`Scraping FAQ for ${SIGNE_NAMES[signe]} from: ${url}`);
            yield page.goto(url, { waitUntil: 'networkidle2' });
            // Attendre que le contenu soit chargé
            yield page.waitForTimeout(2000);
            const faqItems = yield page.evaluate(() => {
                const faqs = [];
                // Recherche des sections qui contiennent des questions (titres h3)
                const questionElements = document.querySelectorAll('h3');
                questionElements.forEach((questionEl) => {
                    var _a;
                    const questionText = (_a = questionEl.textContent) === null || _a === void 0 ? void 0 : _a.trim();
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
            const formattedFaqItems = faqItems.map((item) => ({
                question: item.question,
                answer: (0, html_formatter_1.formatHtmlContent)(item.answer)
            }));
            return formattedFaqItems;
        }
        catch (error) {
            console.error(`Error scraping FAQ for ${signe}:`, error);
            return [];
        }
        finally {
            yield browser.close();
        }
    });
}
function extractAllAstrologieFaqs() {
    return __awaiter(this, void 0, void 0, function* () {
        const allFaqs = {};
        for (const signe of SIGNES_ASTROLOGIQUES) {
            const faqItems = yield extractAstrologieFaqForSign(signe);
            if (faqItems.length > 0) {
                allFaqs[`/astrologie-signe-${signe}`] = faqItems;
            }
            // Attendre un peu entre les requêtes pour éviter de surcharger le serveur
            yield new Promise(resolve => setTimeout(resolve, 1000));
        }
        return allFaqs;
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('Starting astrologie FAQ extraction...');
            const allFaqs = yield extractAllAstrologieFaqs();
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
                const signe = path.replace('/astrologie-signe-', '');
                console.log(`   - ${SIGNE_NAMES[signe]}: ${faqs.length} FAQs`);
            });
        }
        catch (error) {
            console.error('Error during extraction:', error);
            process.exit(1);
        }
    });
}
// Exécuter si appelé directement
if (require.main === module) {
    main();
}
