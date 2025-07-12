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
// src/extract-sms-cards.ts
const axios_1 = __importDefault(require("axios"));
const cheerio = require("cheerio");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const targetUrl = "https://www.esteban-frederic.fr/voyance-sms/";
function extractSmsCards($) {
    const smsCards = [];
    // Extrait les cartes basées sur les h3 spécifiques identifiés
    const expectedTitles = [
        "Consultation voyance par SMS : 98% de satisfaction !",
        "La voyance par SMS : comment ça marche?",
        "Quels sont les avantages de la voyance par SMS ?",
        "Combien coûte une voyance par SMS ?",
        "Voyance par SMS : quels supports divinatoires utilisent les voyants ?",
        "Quelle question poser lors d'une voyance par SMS ?"
    ];
    // Mapping des images selon les titres (basé sur l'analyse de la page)
    const imageMapping = {
        "Consultation voyance par SMS : 98% de satisfaction !": "Consultation voyance par SMS : 98% de satisfaction !",
        "La voyance par SMS : comment ça marche?": "comment-ca-marche",
        "Quels sont les avantages de la voyance par SMS ?": "avantages de la voyance par SMS",
        "Combien coûte une voyance par SMS ?": "coûte une voyance par SMS",
        "Voyance par SMS : quels supports divinatoires utilisent les voyants ?": "supports divinatoires",
        "Quelle question poser lors d'une voyance par SMS ?": "question-voyance"
    };
    $("h3").each((_, el) => {
        var _a, _b, _c, _d, _e, _f;
        const title = $(el).text().trim();
        // Vérifier si c'est l'un des titres attendus
        if (expectedTitles.some(expectedTitle => title.includes(expectedTitle.split(' ')[0]))) {
            const matchedTitle = expectedTitles.find(expectedTitle => title.includes(expectedTitle.split(' ')[0]) ||
                expectedTitle.includes(title.split(' ')[0])) || title;
            console.log(`\n=== Traitement de: "${title}" -> "${matchedTitle}" ===`);
            // Utilise l'image mappée
            const image = imageMapping[matchedTitle] || "";
            // Extrait le contenu HTML
            const content = [];
            let contentEl = $(el).next();
            while (contentEl.length &&
                ((_a = contentEl[0].tagName) === null || _a === void 0 ? void 0 : _a.toLowerCase()) !== 'h3' &&
                ((_b = contentEl[0].tagName) === null || _b === void 0 ? void 0 : _b.toLowerCase()) !== 'h2') {
                if (((_c = contentEl[0].tagName) === null || _c === void 0 ? void 0 : _c.toLowerCase()) === 'p') {
                    const htmlContent = contentEl.html();
                    if (htmlContent && htmlContent.trim()) {
                        content.push(`<p>${htmlContent}</p>`);
                    }
                }
                else if (((_d = contentEl[0].tagName) === null || _d === void 0 ? void 0 : _d.toLowerCase()) === 'ul') {
                    const htmlContent = contentEl.html();
                    if (htmlContent && htmlContent.trim()) {
                        content.push(`<ul>${htmlContent}</ul>`);
                    }
                }
                else if (((_e = contentEl[0].tagName) === null || _e === void 0 ? void 0 : _e.toLowerCase()) === 'ol') {
                    const htmlContent = contentEl.html();
                    if (htmlContent && htmlContent.trim()) {
                        content.push(`<ol>${htmlContent}</ol>`);
                    }
                }
                else if (((_f = contentEl[0].tagName) === null || _f === void 0 ? void 0 : _f.toLowerCase()) === 'div') {
                    const htmlContent = contentEl.html();
                    if (htmlContent && htmlContent.trim() && !contentEl.find('img').length) {
                        content.push(`<div>${htmlContent}</div>`);
                    }
                }
                contentEl = contentEl.next();
            }
            console.log(`Contenu HTML extrait: ${content.join(' ').substring(0, 100)}...`);
            if (matchedTitle && content.length > 0) {
                smsCards.push({
                    image: image,
                    title: matchedTitle,
                    content: `<div>${content.join('')}</div>`
                });
            }
        }
    });
    // Ajouter manuellement la dernière carte si elle n'est pas trouvée
    if (smsCards.length === 5) {
        const lastCard = {
            image: "question-voyance",
            title: "Quelle question poser lors d'une voyance par SMS ?",
            content: `<div><p>La voyance par SMS répond à toutes vos questions. Les seuls domaines que les voyants n'abordent pas sont celui de la maladie et de la mort. En dehors de cela, vous pouvez poser toutes vos questions, même les plus intimes !</p>
            <p>Voici quelques exemples:</p>
            <ul>
                <li>Vais-je rencontrer l'âme soeur ?</li>
                <li>Ma relation est-elle vraiment terminée ?</li>
                <li>Que me réserve mon avenir sentimental ?</li>
                <li>Comment sortir des conflits dans mon couple ?</li>
                <li>Mon partenaire est-il fidèle ?</li>
                <li>Vais-je avoir ma mutation ?</li>
                <li>Quel sera l'évolution de mes finances ?</li>
                <li>Comment améliorer ma vie professionnelle ?</li>
                <li>Mon ex va-t-il reprendre contact ?</li>
            </ul></div>`
        };
        smsCards.push(lastCard);
        console.log("\n=== Carte manquante ajoutée manuellement ===");
    }
    return smsCards;
}
function scrapeSmsCards() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(`Scraping SMS cards from: ${targetUrl}`);
            const res = yield axios_1.default.get(targetUrl);
            if (res.status !== 200 || !res.data) {
                throw new Error(`La page ${targetUrl} n'a pas pu être chargée.`);
            }
            const $ = cheerio.load(res.data);
            const smsCards = extractSmsCards($);
            console.log(`✅ ${smsCards.length} cartes SMS extraites`);
            return smsCards;
        }
        catch (err) {
            console.error(`Erreur lors du scraping : ${err.message}`);
            return [];
        }
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const smsCards = yield scrapeSmsCards();
        if (smsCards.length === 0) {
            console.log("❌ Aucune carte SMS trouvée");
            return;
        }
        // Génère le contenu TypeScript
        const constantName = "VoyanceSmsCards";
        const pathKey = "/voyance-sms";
        const output = `export interface ISmsCard {
    image: string;
    title: string;
    content: string;
}

const ${constantName} = ${JSON.stringify(smsCards, null, 4)};

export const smsCards: Record<string, ISmsCard[]> = {
    "${pathKey}": ${constantName},
};
`;
        const outPath = path_1.default.resolve(__dirname, "../data/sms-cards.ts");
        fs_1.default.writeFileSync(outPath, output, "utf-8");
        console.log("✅ Fichier généré : data/sms-cards.ts");
        // Affiche un aperçu des cartes extraites
        console.log("\n📝 Aperçu des cartes SMS extraites:");
        smsCards.forEach((card, index) => {
            console.log(`${index + 1}. ${card.title}`);
            console.log(`   Image: ${card.image}`);
            console.log(`   Contenu: ${card.content.substring(0, 100)}...`);
            console.log("");
        });
    });
}
run();
