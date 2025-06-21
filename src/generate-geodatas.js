"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const slugify_1 = __importDefault(require("slugify"));
const urls_1 = require("./urls");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
let currentCountryId = 1;
let currentDeptId = 1;
// Détection et extraction
function parseUrl(url) {
    var _a, _b;
    const lower = url.toLowerCase();
    const parts = url.split("/").filter(Boolean);
    if (lower.includes("/voyance-par-ville/")) {
        // Ville avec code département optionnel
        const segment = (_a = parts.at(-1)) === null || _a === void 0 ? void 0 : _a.replace("voyance-a-", "").replace("voyance-en-", "");
        if (!segment)
            return null;
        const match = segment.match(/(.+?)-(\d{2,3}[a-z]?)$/i);
        const nom = match ? match[1] : segment;
        const code = match ? match[2] : null;
        return {
            type: "ville",
            nom: capitalize(nom),
            slug: (0, slugify_1.default)(nom, { lower: true }),
            departement_code: code
        };
    }
    else if (lower.includes("/voyance-par-pays/")) {
        const segment = (_b = parts.at(-1)) === null || _b === void 0 ? void 0 : _b.replace("voyance-a-", "").replace("voyance-en-", "").replace("voyance-au-", "").replace("voyance-dans-", "").replace("voyance-", "").replace(/-$/, "");
        if (!segment)
            return null;
        // Vérifie si c’est un vrai pays connu
        const paysConnus = ["france", "suisse", "belgique", "luxembourg", "canada"];
        const slug = (0, slugify_1.default)(segment, { lower: true });
        if (paysConnus.includes(slug)) {
            return {
                id: currentCountryId++,
                type: "pays",
                nom: capitalize(segment),
                slug
            };
        }
        else {
            // Département
            return {
                id: currentDeptId++,
                type: "departement",
                nom: capitalize(segment),
                slug,
                code: null
            };
        }
    }
    return null;
}
function capitalize(str) {
    return str
        .split("-")
        .map(s => s.charAt(0).toUpperCase() + s.slice(1))
        .join(" ");
}
// Exemple d’exécution
const result = urls_1.urls.map(parseUrl).filter(Boolean);
const output = `// AUTO-GENERATED FILE\nexport const geodatas = ${JSON.stringify(result, null, 2)};\n`;
const outPath = path_1.default.resolve(__dirname, "../data/geodatas.ts");
fs_1.default.writeFileSync(outPath, output, "utf-8");
console.log("✅ Fichier généré : data/geodatas.ts");
