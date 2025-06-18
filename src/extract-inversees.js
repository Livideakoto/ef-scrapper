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
const axios_1 = __importDefault(require("axios"));
const cheerio = require("cheerio");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const inversees = [
    "0110", "0220", "0330", "0440", "0550", "1001", "1221", "1331", "1441", "1551", "2002", "2112", "2332"
];
const baseURL = "https://www.esteban-frederic.fr/heure-miroir-inversee-";
function extractSections($) {
    const result = {};
    $("h2, h3").each((_, el) => {
        const title = $(el).text().toLowerCase();
        const key = title.includes("signification") ? "signification" :
            title.includes("spirituel") ? "spirituel" :
                title.includes("ange") ? "ange" :
                    title.includes("numérologie") ? "numerologie" :
                        title.includes("amour") ? "amour" :
                            title.includes("travail") ? "travail" :
                                title.includes("finance") || title.includes("argent") ? "finance" :
                                    title.includes("tarot") ? "tarot" :
                                        title.includes("que faire") ? "quefaire" :
                                            title.includes("résumé") ? "resume" :
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
function scrapeInversee(slug) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const url = `${baseURL}${slug}/`;
            const res = yield axios_1.default.get(url);
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
                    messageAnges: messageAnges || "",
                    numerologie: raw.numerologie || "",
                    amour: raw.amour || "",
                    travail: raw.travail || "",
                    finance: raw.finance || "",
                    tarot: raw.tarot || "",
                    quefaire: raw.quefaire || "",
                    resume: raw.resume || "",
                }
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
        for (const slug of inversees) {
            console.log(`Scraping ${slug}...`);
            const [key, data] = yield scrapeInversee(slug);
            if (data)
                result[key] = data;
        }
        const output = `// AUTO-GENERATED FILE\nexport const heuresMiroirsInversees = ${JSON.stringify(result, null, 2)};\n`;
        const outPath = path_1.default.resolve(__dirname, "../data/heuresMiroirsInversees.ts");
        fs_1.default.writeFileSync(outPath, output, "utf-8");
        console.log("✅ Fichier généré : data/heuresMiroirsInversees.ts");
    });
}
run();
