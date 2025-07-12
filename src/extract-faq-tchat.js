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
// src/extract-faq-tchat.ts
const axios_1 = __importDefault(require("axios"));
const cheerio = require("cheerio");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const targetUrl = "https://www.esteban-frederic.fr/voyance-par-tchat-serieuse-et-immediate/";
function extractFaqSections($) {
    const faqItems = [];
    const processedTitles = new Set();
    // Trouve toutes les sections FAQ principales (h3 uniquement pour éviter les doublons)
    $("h3").each((_, el) => {
        var _a, _b, _c, _d, _e, _f, _g;
        const title = $(el).text().trim();
        // Ignore les titres qui ne sont pas des FAQ ou qui sont déjà traités
        if (!title ||
            title.includes("Choisissez un forfait") ||
            title.includes("L'excellence") ||
            title.includes("Des médiums et voyants fiables") ||
            title.includes("Bénéficiez d'une consultation") ||
            title.includes("Que vous soyez à Paris") ||
            title.includes("Votre première consultation") ||
            title.match(/^\d+\./) || // Ignore les titres numériques comme "1.", "2.", etc.
            processedTitles.has(title)) {
            return;
        }
        processedTitles.add(title);
        const content = [];
        let next = $(el).next();
        // Collecte tout le contenu jusqu'au prochain h2 ou h3
        while (next.length && !["h2", "h3"].includes((_a = next[0].tagName) === null || _a === void 0 ? void 0 : _a.toLowerCase())) {
            if (((_b = next[0].tagName) === null || _b === void 0 ? void 0 : _b.toLowerCase()) === "p") {
                content.push(`<p>${next.html()}</p>`);
            }
            else if (((_c = next[0].tagName) === null || _c === void 0 ? void 0 : _c.toLowerCase()) === "ul") {
                content.push(`<ul>${next.html()}</ul>`);
            }
            else if (((_d = next[0].tagName) === null || _d === void 0 ? void 0 : _d.toLowerCase()) === "ol") {
                content.push(`<ol>${next.html()}</ol>`);
            }
            else if (((_e = next[0].tagName) === null || _e === void 0 ? void 0 : _e.toLowerCase()) === "blockquote") {
                content.push(`<blockquote>${next.html()}</blockquote>`);
            }
            else if (((_f = next[0].tagName) === null || _f === void 0 ? void 0 : _f.toLowerCase()) === "h4") {
                // Inclure les h4 dans le contenu
                content.push(`<h4>${next.html()}</h4>`);
            }
            else if (((_g = next[0].tagName) === null || _g === void 0 ? void 0 : _g.toLowerCase()) === "div") {
                const divContent = next.html();
                if (divContent && divContent.trim()) {
                    content.push(`<div>${divContent}</div>`);
                }
            }
            next = next.next();
        }
        if (content.length > 0) {
            faqItems.push({
                title,
                content: `<div>${content.join("")}</div>`
            });
        }
    });
    return faqItems;
}
function scrapeFaqTchat() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(`Scraping FAQ from: ${targetUrl}`);
            const res = yield axios_1.default.get(targetUrl);
            if (res.status !== 200 || !res.data) {
                throw new Error(`La page ${targetUrl} n'a pas pu être chargée.`);
            }
            const $ = cheerio.load(res.data);
            const faqItems = extractFaqSections($);
            console.log(`✅ ${faqItems.length} sections FAQ extraites`);
            return faqItems;
        }
        catch (err) {
            console.error(`Erreur lors du scraping : ${err.message}`);
            return [];
        }
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const faqItems = yield scrapeFaqTchat();
        if (faqItems.length === 0) {
            console.log("❌ Aucune FAQ trouvée");
            return;
        }
        // Génère le contenu TypeScript
        const constantName = "VoyanceParTchat";
        const pathKey = "/voyance-par-tchat-serieuse-et-immediate";
        const output = `export interface IFaqItem {
    title: string;
    content: string;
}

const ${constantName} = ${JSON.stringify(faqItems, null, 4)};

export const faqs: Record<string, IFaqItem[]> = {
    "${pathKey}": ${constantName},
};
`;
        const outPath = path_1.default.resolve(__dirname, "../data/faq-tchat.ts");
        fs_1.default.writeFileSync(outPath, output, "utf-8");
        console.log("✅ Fichier généré : data/faq-tchat.ts");
        // Affiche un aperçu des FAQ extraites
        console.log("\n📝 Aperçu des FAQ extraites:");
        faqItems.forEach((item, index) => {
            console.log(`${index + 1}. ${item.title}`);
        });
    });
}
run();
