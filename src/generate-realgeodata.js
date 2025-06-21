"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const divided_geodatas_1 = require("../data/divided-geodatas");
function getPaysIdForVille(slug, departementCode) {
    if (departementCode) {
        return 2; // France
    }
    const canadaCities = ["montreal", "quebec", "sherbrooke", "longueuil", "gatineau", "victoriaville", "saguenay"];
    const belgiqueCities = ["bruxelles", "anvers", "liege", "charleroi", "mons", "tournai", "verviers", "mouscron", "namur"];
    const suisseCities = ["geneve", "sion", "neuchatel", "lausanne", "fribourg"];
    if (canadaCities.includes(slug))
        return 1;
    if (belgiqueCities.includes(slug))
        return 3;
    if (suisseCities.includes(slug))
        return 5;
    if (slug === "luxembourg")
        return 4;
    return 2; // par défaut France
}
function getDepartementId(departementCode) {
    if (!departementCode)
        return null;
    const dept = divided_geodatas_1.departements.find(d => d.slug.endsWith(departementCode.toLowerCase()));
    return dept ? dept.id : null;
}
const villeList = divided_geodatas_1.villeListRaw.map((v, idx) => {
    const paysId = getPaysIdForVille(v.slug, v.departement_code);
    const departementId = getDepartementId(v.departement_code);
    return {
        id: idx + 1 + divided_geodatas_1.pays.length + divided_geodatas_1.departements.length,
        type: "ville",
        nom: v.nom,
        slug: v.slug,
        departement_code: v.departement_code,
        paysId,
        departementId
    };
});
const output = `// AUTO-GENERATED FILE\nexport const villeDatas = ${JSON.stringify(villeList, null, 2)};\n`;
const outPath = path_1.default.resolve(__dirname, "../data/villeDatas.ts");
fs_1.default.writeFileSync(outPath, output, "utf-8");
console.log("✅ Fichier généré : data/villeDatas.ts");
