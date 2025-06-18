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
// src/extract.ts
const axios_1 = __importDefault(require("axios"));
const cheerio = require("cheerio");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// const heures = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, "0")}${i.toString().padStart(2, "0")}`);
const heures = [
    "2226", "1118", "1114", "1112", "1110", "0110", "0005"
];
const baseURL = "https://www.esteban-frederic.fr/heure-miroir-";
function extractSections($) {
    const result = {};
    $("h2, h3").each((_, el) => {
        const title = $(el).text().toLowerCase();
        const key = title.includes("signification") ? "signification" :
            title.includes("spirituel") ? "spirituel" :
                title.includes("ange") ? "ange" :
                    title.includes("numérologie") ? "numerologie" :
                        title.includes("amour") || title.includes("amoureux") ? "amour" :
                            title.includes("travail") ? "travail" :
                                title.includes("finance") || title.includes("argent") ? "finance" :
                                    title.includes("tarot") ? "tarot" :
                                        title.includes("que faire") ? "quefaire" :
                                            title.includes("résumé") || title.includes("récapitulatif") ? "resume" :
                                                null;
        if (!key)
            return;
        const texts = [];
        let next = $(el).next();
        while (next.length && !["h2", "h3"].includes(next[0].tagName.toLowerCase())) {
            texts.push(next.text().trim());
            next = next.next();
        }
        result[key] = texts.join("\n\n");
    });
    return result;
}
function scrapeHeure(slug) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const url = `${baseURL}${slug}/`;
            const res = yield axios_1.default.get(url);
            // console.log("cheerio object:", cheerio);
            if (res.status !== 200 || !res.data) {
                throw new Error(`La page ${url} n'a pas pu être chargée.`);
            }
            const $ = cheerio.load(res.data);
            const titre = $("h1").first().text().trim();
            const raw = extractSections($);
            let ange = raw.ange || "";
            let messageAnges = raw.ange || "";
            if ((_a = raw.ange) === null || _a === void 0 ? void 0 : _a.includes(":")) {
                const [nom, ...msg] = raw.ange.split(":");
                ange = nom.trim();
                messageAnges = msg.join(":").trim();
            }
            return [
                slug,
                {
                    titre,
                    signification: raw.signification || "",
                    spirituel: raw.spirituel || "",
                    ange: ange || "",
                    // messageAnges: messageAnges || "",
                    numerologie: raw.numerologie || "",
                    amour: raw.amour || "",
                    travail: raw.travail || "",
                    finance: raw.finance || "",
                    tarot: raw.tarot || "",
                    quefaire: raw.quefaire || "",
                    resume: raw.resume || "",
                },
            ];
        }
        catch (err) {
            console.error(`Erreur sur ${slug} : ${err.message}`);
            return [slug, null];
        }
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const result = {};
        for (const heure of heures) {
            console.log(`Scraping ${heure}...`);
            const [slug, data] = yield scrapeHeure(heure);
            if (data)
                result[slug] = data;
        }
        const output = `// AUTO-GENERATED FILE\nexport const heuresMiroirs = ${JSON.stringify(result, null, 2)};\n`;
        const outPath = path_1.default.resolve(__dirname, "../data/heuresMiroirs.ts");
        fs_1.default.writeFileSync(outPath, output, "utf-8");
        console.log("✅ Fichier généré : data/heuresMiroirs.ts");
    });
}
run();
