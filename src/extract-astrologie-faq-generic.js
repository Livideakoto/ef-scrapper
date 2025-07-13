"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractAstrologieFaqForSign = extractAstrologieFaqForSign;
exports.extractAstrologieFaqsGeneric = extractAstrologieFaqsGeneric;
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
const html_formatter_1 = require("./utils/html-formatter");
// Configuration par défaut
const DEFAULT_CONFIG = {
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
    'poissons': 'Poissons'
};
function extractAstrologieFaqForSign(signe, baseUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const url = `${baseUrl}${signe}/`;
            console.log(`Scraping FAQ for ${SIGNE_NAMES[signe] || signe} from: ${url}`);
            const response = yield axios_1.default.get(url);
            const $ = cheerio.load(response.data);
            const faqItems = [];
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
                            answer: (0, html_formatter_1.formatHtmlContent)(answerHtml.trim())
                        });
                    }
                }
            });
            console.log(`Found ${faqItems.length} FAQ items for ${SIGNE_NAMES[signe] || signe}`);
            return faqItems;
        }
        catch (error) {
            console.error(`Error scraping FAQ for ${signe}:`, error);
            return [];
        }
    });
}
function extractAstrologieFaqsGeneric(config) {
    return __awaiter(this, void 0, void 0, function* () {
        const allFaqs = {};
        for (const signe of config.signes) {
            try {
                const faqItems = yield extractAstrologieFaqForSign(signe, config.baseUrl);
                if (faqItems.length > 0) {
                    allFaqs[signe] = faqItems;
                }
                // Attendre un peu entre les requêtes pour éviter de surcharger le serveur
                yield new Promise(resolve => setTimeout(resolve, 1000));
            }
            catch (error) {
                console.error(`Error processing ${signe}:`, error);
            }
        }
        return allFaqs;
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Configuration depuis les arguments de ligne de commande ou fichier de config
            const configFile = process.argv[2];
            let config = DEFAULT_CONFIG;
            if (configFile) {
                try {
                    const configData = require(configFile);
                    config = Object.assign(Object.assign({}, DEFAULT_CONFIG), configData);
                }
                catch (error) {
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
            const allFaqs = yield extractAstrologieFaqsGeneric(config);
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
