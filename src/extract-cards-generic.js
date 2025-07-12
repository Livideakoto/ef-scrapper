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
exports.generateCardsFile = generateCardsFile;
// src/extract-cards-generic.ts
const axios_1 = __importDefault(require("axios"));
const cheerio = require("cheerio");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function extractCards($, options) {
    const cards = [];
    console.log(`\n=== Recherche des cartes dans la section "${options.sectionTitle}" ===`);
    $("h3").each((_, el) => {
        var _a, _b, _c, _d, _e, _f, _g;
        const title = $(el).text().trim();
        // Vérifier si c'est l'un des titres attendus
        if (options.expectedTitles.some(expectedTitle => title.includes(expectedTitle) || expectedTitle.includes(title))) {
            const matchedTitle = options.expectedTitles.find(expectedTitle => title.includes(expectedTitle) || expectedTitle.includes(title)) || title;
            console.log(`\n=== Traitement de: "${title}" ===`);
            // Utilise l'image mappée si disponible
            const image = ((_a = options.imageMapping) === null || _a === void 0 ? void 0 : _a[matchedTitle]) || "";
            // Extrait le contenu HTML
            const content = [];
            let contentEl = $(el).next();
            while (contentEl.length &&
                ((_b = contentEl[0].tagName) === null || _b === void 0 ? void 0 : _b.toLowerCase()) !== 'h3' &&
                ((_c = contentEl[0].tagName) === null || _c === void 0 ? void 0 : _c.toLowerCase()) !== 'h2') {
                if (((_d = contentEl[0].tagName) === null || _d === void 0 ? void 0 : _d.toLowerCase()) === 'p') {
                    const htmlContent = contentEl.html();
                    if (htmlContent && htmlContent.trim()) {
                        content.push(`<p>${htmlContent}</p>`);
                    }
                }
                else if (((_e = contentEl[0].tagName) === null || _e === void 0 ? void 0 : _e.toLowerCase()) === 'ul') {
                    const htmlContent = contentEl.html();
                    if (htmlContent && htmlContent.trim()) {
                        content.push(`<ul>${htmlContent}</ul>`);
                    }
                }
                else if (((_f = contentEl[0].tagName) === null || _f === void 0 ? void 0 : _f.toLowerCase()) === 'ol') {
                    const htmlContent = contentEl.html();
                    if (htmlContent && htmlContent.trim()) {
                        content.push(`<ol>${htmlContent}</ol>`);
                    }
                }
                else if (((_g = contentEl[0].tagName) === null || _g === void 0 ? void 0 : _g.toLowerCase()) === 'div') {
                    const htmlContent = contentEl.html();
                    if (htmlContent && htmlContent.trim() && !contentEl.find('img').length) {
                        content.push(`<div>${htmlContent}</div>`);
                    }
                }
                contentEl = contentEl.next();
            }
            console.log(`Contenu HTML extrait: ${content.join(' ').substring(0, 100)}...`);
            if (matchedTitle && content.length > 0) {
                cards.push({
                    image: image,
                    title: matchedTitle,
                    content: `<div>${content.join('')}</div>`
                });
            }
        }
    });
    return cards;
}
function scrapeCards(options) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(`Scraping cards from: ${options.url}`);
            const res = yield axios_1.default.get(options.url);
            if (res.status !== 200 || !res.data) {
                throw new Error(`La page ${options.url} n'a pas pu être chargée.`);
            }
            const $ = cheerio.load(res.data);
            const cards = extractCards($, options);
            console.log(`✅ ${cards.length} cartes extraites`);
            return cards;
        }
        catch (err) {
            console.error(`Erreur lors du scraping : ${err.message}`);
            return [];
        }
    });
}
function generateCardsFile(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const cards = yield scrapeCards(options);
        if (cards.length === 0) {
            console.log("❌ Aucune carte trouvée");
            return;
        }
        // Génère le contenu TypeScript
        const output = `export interface ICard {
    image: string;
    title: string;
    content: string;
}

const ${options.constantName} = ${JSON.stringify(cards, null, 4)};

export const cards: Record<string, ICard[]> = {
    "${options.pathname}": ${options.constantName},
};
`;
        const outputFileName = options.outputFileName || `cards-${options.constantName.toLowerCase()}.ts`;
        const outPath = path_1.default.resolve(__dirname, `../data/${outputFileName}`);
        fs_1.default.writeFileSync(outPath, output, "utf-8");
        console.log(`✅ Fichier généré : data/${outputFileName}`);
        // Affiche un aperçu des cartes extraites
        console.log("\n📝 Aperçu des cartes extraites:");
        cards.forEach((card, index) => {
            console.log(`${index + 1}. ${card.title}`);
            console.log(`   Image: ${card.image}`);
            console.log(`   Contenu: ${card.content.substring(0, 100)}...`);
            console.log("");
        });
    });
}
// Script principal si exécuté directement
if (require.main === module) {
    const args = process.argv.slice(2);
    if (args.length < 1) {
        console.error("Usage: npm run build-cards-generic <CONFIG_FILE>");
        console.error("Exemple: npm run build-cards-generic sms-config.json");
        process.exit(1);
    }
    const configFile = args[0];
    const configPath = path_1.default.resolve(__dirname, `../config/${configFile}`);
    try {
        const config = JSON.parse(fs_1.default.readFileSync(configPath, 'utf-8'));
        generateCardsFile(config);
    }
    catch (err) {
        console.error(`Erreur lors de la lecture du fichier de configuration : ${err.message}`);
        process.exit(1);
    }
}
