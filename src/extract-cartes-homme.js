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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractCartesHomme = extractCartesHomme;
exports.saveCartesData = saveCartesData;
// src/extract-cartes-homme.ts
const axios_1 = __importDefault(require("axios"));
const cheerio = require("cheerio");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function scrapCardPage(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(`Scraping: ${url}`);
            const response = yield axios_1.default.get(url);
            const $ = cheerio.load(response.data);
            // Extraire le nom de la carte depuis l'URL
            const urlParts = url.split('/');
            const cardSlug = urlParts[urlParts.length - 2] || urlParts[urlParts.length - 1];
            // Extraire le titre principal
            const mainTitle = $('h1').first().text().trim();
            // Extraire le sous-titre
            const subtitle = $('h2').first().text().trim();
            // Extraire l'image
            let image = '';
            const imgEl = $('img[alt*="HOMME"], img[alt*="FEMME"], img[alt*="CARTE"], img[src*="carte"]').first();
            if (imgEl.length) {
                image = imgEl.attr('src') || '';
                if (image.startsWith('data:image')) {
                    // Si c'est une image lazy-loaded, chercher dans data-src
                    image = imgEl.attr('data-src') || imgEl.attr('data-lazy-src') || '';
                }
            }
            // Extraire le contenu principal
            let content = '';
            const contentSelectors = [
                '.entry-content',
                '.post-content',
                '.content',
                'main article',
                'article'
            ];
            for (const selector of contentSelectors) {
                const contentEl = $(selector);
                if (contentEl.length) {
                    // Nettoyer le contenu des éléments indésirables
                    contentEl.find('script, style, .comments, .sidebar, nav, header, footer').remove();
                    content = contentEl.html() || '';
                    break;
                }
            }
            // Si aucun contenu trouvé avec les sélecteurs, prendre tous les paragraphes
            if (!content) {
                const paragraphs = [];
                $('p').each((_, el) => {
                    const text = $(el).html();
                    if (text && text.trim().length > 20) {
                        paragraphs.push(text.trim());
                    }
                });
                content = paragraphs.join('\n');
            }
            // Extraire la citation si elle existe
            let quote = '';
            const quoteSelectors = ['blockquote', '.quote', '.citation', 'q'];
            for (const selector of quoteSelectors) {
                const quoteEl = $(selector).first();
                if (quoteEl.length) {
                    quote = quoteEl.text().trim();
                    break;
                }
            }
            return {
                name: cardSlug,
                url: url,
                image: image,
                title: mainTitle,
                subtitle: subtitle,
                content: content,
                quote: quote || undefined
            };
        }
        catch (error) {
            console.error(`Erreur lors du scraping de ${url}:`, error);
            return null;
        }
    });
}
function extractCartesHomme() {
    return __awaiter(this, void 0, void 0, function* () {
        const baseUrl = "https://www.esteban-frederic.fr/carte-homme/";
        try {
            console.log("=== Extraction des cartes depuis la page Homme ===");
            const response = yield axios_1.default.get(baseUrl);
            const $ = cheerio.load(response.data);
            // Extraire tous les liens vers les autres cartes
            const cardLinks = new Set();
            // Chercher dans les liens avec des patterns de cartes
            $('a[href*="/carte-"], a[href*="/la-carte-"]').each((_, el) => {
                const href = $(el).attr('href');
                if (href) {
                    let fullUrl = href;
                    if (href.startsWith('/')) {
                        fullUrl = 'https://www.esteban-frederic.fr' + href;
                    }
                    if (fullUrl !== baseUrl) {
                        cardLinks.add(fullUrl);
                    }
                }
            });
            // Chercher dans le texte des liens qui pourraient être des cartes
            $('a').each((_, el) => {
                const text = $(el).text().trim().toUpperCase();
                const href = $(el).attr('href');
                if (href && (text.includes('CARTE') ||
                    text.includes('FEMME') ||
                    text.includes('HOMME') ||
                    text.includes('RÉUSSITE') ||
                    text.includes('ÉLÉVATION') ||
                    text.includes('RETARD') ||
                    text.includes('AMITIÉ') ||
                    text.includes('MAISON') ||
                    text.includes('FORCE') ||
                    text.match(/^[A-Z\s]+$/) // Texte en majuscules
                )) {
                    let fullUrl = href;
                    if (href.startsWith('/')) {
                        fullUrl = 'https://www.esteban-frederic.fr' + href;
                    }
                    if (fullUrl !== baseUrl && fullUrl.includes('esteban-frederic.fr')) {
                        cardLinks.add(fullUrl);
                    }
                }
            });
            console.log(`Liens trouvés: ${cardLinks.size}`);
            cardLinks.forEach(link => console.log(`- ${link}`));
            // Scraper la carte actuelle (Homme)
            const currentCard = yield scrapCardPage(baseUrl);
            if (!currentCard) {
                throw new Error("Impossible d'extraire la carte Homme");
            }
            // Scraper toutes les autres cartes
            const allCards = [currentCard];
            for (const url of Array.from(cardLinks)) {
                const card = yield scrapCardPage(url);
                if (card) {
                    allCards.push(card);
                }
                // Petite pause pour éviter de surcharger le serveur
                yield new Promise(resolve => setTimeout(resolve, 1000));
            }
            console.log(`\n=== Total des cartes extraites: ${allCards.length} ===`);
            allCards.forEach(card => console.log(`- ${card.name}: ${card.title}`));
            return {
                currentCard,
                allCards
            };
        }
        catch (error) {
            console.error("Erreur lors de l'extraction:", error);
            throw error;
        }
    });
}
function saveCartesData(cardData) {
    return __awaiter(this, void 0, void 0, function* () {
        const dataDir = path_1.default.join(__dirname, "../data");
        if (!fs_1.default.existsSync(dataDir)) {
            fs_1.default.mkdirSync(dataDir, { recursive: true });
        }
        // Sauvegarder toutes les cartes
        const allCardsContent = `export interface ICardHomme {
    name: string;
    url: string;
    image: string;
    title: string;
    subtitle: string;
    content: string;
    quote?: string;
}

const CartesHomme: ICardHomme[] = ${JSON.stringify(cardData.allCards, null, 4)};

export const cartes: Record<string, ICardHomme[]> = {
    "/cartes-tarot": CartesHomme,
};

export default CartesHomme;
`;
        const allCardsPath = path_1.default.join(dataDir, "cartes-homme.ts");
        fs_1.default.writeFileSync(allCardsPath, allCardsContent, "utf8");
        console.log(`✅ Toutes les cartes sauvegardées dans: ${allCardsPath}`);
        // Sauvegarder aussi en JSON pour faciliter l'utilisation
        const jsonPath = path_1.default.join(dataDir, "cartes-homme.json");
        fs_1.default.writeFileSync(jsonPath, JSON.stringify(cardData, null, 2), "utf8");
        console.log(`✅ Données JSON sauvegardées dans: ${jsonPath}`);
    });
}
// Fonction principale
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("🃏 Début de l'extraction des cartes...");
            const cardData = yield extractCartesHomme();
            yield saveCartesData(cardData);
            console.log("✅ Extraction terminée avec succès!");
            console.log(`\n📊 Résumé:`);
            console.log(`- Carte principale: ${cardData.currentCard.title}`);
            console.log(`- Total des cartes: ${cardData.allCards.length}`);
            console.log(`- Cartes trouvées:`);
            cardData.allCards.forEach(card => {
                console.log(`  • ${card.title} (${card.name})`);
            });
        }
        catch (error) {
            console.error("❌ Erreur:", error);
            process.exit(1);
        }
    });
}
// Exécuter si appelé directement
if (require.main === module) {
    main();
}
