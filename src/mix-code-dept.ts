import fs from "fs";
import path from "path";

// map des slugs vers leur code officiel
type TDepartement = {
    id: number;
    nom: string;
    slug: string;
    type: "departement";
    code: string | null;
    paysId: number;
}

export const originalDepartements: TDepartement[] = [
    { id: 1, type: "departement", nom: "L'herault", slug: "lherault", code: null, paysId: 2 },
    { id: 2, type: "departement", nom: "Le Tarnes", slug: "le-tarnes", code: null, paysId: 2 },
    { id: 3, type: "departement", nom: "Martinique", slug: "martinique", code: null, paysId: 2 },
    { id: 4, type: "departement", nom: "Le Nord", slug: "le-nord", code: null, paysId: 2 },
    { id: 5, type: "departement", nom: "Guyane", slug: "guyane", code: null, paysId: 2 },
    { id: 6, type: "departement", nom: "La Moselle", slug: "la-moselle", code: null, paysId: 2 },
    { id: 7, type: "departement", nom: "La Meurthe Et Moselle", slug: "la-meurthe-et-moselle", code: null, paysId: 2 },
    { id: 8, type: "departement", nom: "Le Tarn Et Garonne", slug: "le-tarn-et-garonne", code: null, paysId: 2 },
    { id: 9, type: "departement", nom: "La Saone Et Loire", slug: "la-saone-et-loire", code: null, paysId: 2 },
    { id: 10, type: "departement", nom: "Le Puy De Dome", slug: "le-puy-de-dome", code: null, paysId: 2 },
    { id: 11, type: "departement", nom: "Lindre", slug: "lindre", code: null, paysId: 2 },
    { id: 12, type: "departement", nom: "La Savoie", slug: "la-savoie", code: null, paysId: 2 },
    { id: 13, type: "departement", nom: "Lain", slug: "lain", code: null, paysId: 2 },
    { id: 14, type: "departement", nom: "Le Vaucluse", slug: "le-vaucluse", code: null, paysId: 2 },
    { id: 15, type: "departement", nom: "Le Loire Et Cher", slug: "le-loire-et-cher", code: null, paysId: 2 },
    { id: 16, type: "departement", nom: "Guadeloupe", slug: "guadeloupe", code: null, paysId: 2 },
    { id: 17, type: "departement", nom: "Le Val De Marne", slug: "le-val-de-marne", code: null, paysId: 2 },
    { id: 18, type: "departement", nom: "La Haute Savoie", slug: "la-haute-savoie", code: null, paysId: 2 },
    { id: 19, type: "departement", nom: "La Correze", slug: "la-correze", code: null, paysId: 2 },
    { id: 20, type: "departement", nom: "Le Morbihan", slug: "le-morbihan", code: null, paysId: 2 },
    { id: 21, type: "departement", nom: "Laude", slug: "laude", code: null, paysId: 2 },
    { id: 22, type: "departement", nom: "Le Guard", slug: "le-guard", code: null, paysId: 2 },
    { id: 23, type: "departement", nom: "Les Yvelines", slug: "les-yvelines", code: null, paysId: 2 },
    { id: 24, type: "departement", nom: "Lessonne", slug: "lessonne", code: null, paysId: 2 },
    { id: 25, type: "departement", nom: "Les Cotes Darmor", slug: "les-cotes-darmor", code: null, paysId: 2 },
    { id: 26, type: "departement", nom: "Les Hauts De Seine", slug: "les-hauts-de-seine", code: null, paysId: 2 },
    { id: 27, type: "departement", nom: "Le Loire", slug: "le-loire", code: null, paysId: 2 },
    { id: 28, type: "departement", nom: "Leure Et Loire", slug: "leure-et-loire", code: null, paysId: 2 },
    { id: 29, type: "departement", nom: "Les Hautes Pyrenees", slug: "les-hautes-pyrenees", code: null, paysId: 2 },
    { id: 30, type: "departement", nom: "La Loire Atlantique", slug: "la-loire-atlantique", code: null, paysId: 2 },
    { id: 31, type: "departement", nom: "La Nievre", slug: "la-nievre", code: null, paysId: 2 },
    { id: 32, type: "departement", nom: "Lallier", slug: "lallier", code: null, paysId: 2 },
    { id: 33, type: "departement", nom: "Le Maine Et Loire", slug: "le-maine-et-loire", code: null, paysId: 2 },
    { id: 34, type: "departement", nom: "La Mayenne", slug: "la-mayenne", code: null, paysId: 2 },
    { id: 35, type: "departement", nom: "Les Pyrenees Orientales", slug: "les-pyrenees-orientales", code: null, paysId: 2 },
    { id: 36, type: "departement", nom: "Le Territoire De Belfort", slug: "le-territoire-de-belfort", code: null, paysId: 2 },
    { id: 37, type: "departement", nom: "Le Haut Rhin", slug: "le-haut-rhin", code: null, paysId: 2 },
    { id: 38, type: "departement", nom: "La Marne", slug: "la-marne", code: null, paysId: 2 },
    { id: 39, type: "departement", nom: "Charentes Maritimes", slug: "charentes-maritimes", code: null, paysId: 2 },
    { id: 40, type: "departement", nom: "Leure", slug: "leure", code: null, paysId: 2 },
    { id: 41, type: "departement", nom: "Les Deux Sevres", slug: "les-deux-sevres", code: null, paysId: 2 },
    { id: 42, type: "departement", nom: "Lisere", slug: "lisere", code: null, paysId: 2 },
    { id: 43, type: "departement", nom: "La Reunion", slug: "la-reunion", code: null, paysId: 2 },
    { id: 44, type: "departement", nom: "Lille Et Vilaine", slug: "lille-et-vilaine", code: null, paysId: 2 },
    { id: 45, type: "departement", nom: "La Sarthe", slug: "la-sarthe", code: null, paysId: 2 },
    { id: 46, type: "departement", nom: "La Somme", slug: "la-somme", code: null, paysId: 2 },
    { id: 47, type: "departement", nom: "Lyonne", slug: "lyonne", code: null, paysId: 2 },
    { id: 48, type: "departement", nom: "Le Finistere", slug: "le-finistere", code: null, paysId: 2 },
    { id: 49, type: "departement", nom: "Haute Corse", slug: "haute-corse", code: null, paysId: 2 },
    { id: 50, type: "departement", nom: "Les Pyrenees Atlantiques", slug: "les-pyrenees-atlantiques", code: null, paysId: 2 },
    { id: 51, type: "departement", nom: "Les Hautes Alpes", slug: "les-hautes-alpes", code: null, paysId: 2 },
    { id: 52, type: "departement", nom: "Laube", slug: "laube", code: null, paysId: 2 },
    { id: 53, type: "departement", nom: "Les Alpes Maritimes", slug: "les-alpes-maritimes", code: null, paysId: 2 },
    { id: 54, type: "departement", nom: "La Gironde", slug: "la-gironde", code: null, paysId: 2 },
    { id: 55, type: "departement", nom: "La Drome", slug: "la-drome", code: null, paysId: 2 },
    { id: 56, type: "departement", nom: "Le Calvados", slug: "le-calvados", code: null, paysId: 2 },
    { id: 57, type: "departement", nom: "Mayotte", slug: "mayotte", code: null, paysId: 2 },
    { id: 58, type: "departement", nom: "Le Bas Rhin", slug: "le-bas-rhin", code: null, paysId: 2 },
    { id: 59, type: "departement", nom: "Le Pas De Calais", slug: "le-pas-de-calais", code: null, paysId: 2 },
    { id: 60, type: "departement", nom: "Corse Du Sud", slug: "corse-du-sud", code: null, paysId: 2 },
    { id: 61, type: "departement", nom: "Le Vienne", slug: "le-vienne", code: null, paysId: 2 },
    { id: 62, type: "departement", nom: "Les Vosges", slug: "les-vosges", code: null, paysId: 2 },
    { id: 63, type: "departement", nom: "La Manche", slug: "la-manche", code: null, paysId: 2 },
    { id: 64, type: "departement", nom: "La Seine St Denis", slug: "la-seine-st-denis", code: null, paysId: 2 },
    { id: 65, type: "departement", nom: "Charentes", slug: "charentes", code: null, paysId: 2 },
    { id: 66, type: "departement", nom: "Les Ardennes", slug: "les-ardennes", code: null, paysId: 2 },
    { id: 67, type: "departement", nom: "Le Val Doise", slug: "le-val-doise", code: null, paysId: 2 },
    { id: 68, type: "departement", nom: "La Vendee", slug: "la-vendee", code: null, paysId: 2 },
    { id: 69, type: "departement", nom: "Cotes Dor", slug: "cotes-dor", code: null, paysId: 2 },
    { id: 70, type: "departement", nom: "La Seine Maritime", slug: "la-seine-maritime", code: null, paysId: 2 },
    { id: 71, type: "departement", nom: "Le Loiret", slug: "le-loiret", code: null, paysId: 2 },
    { id: 72, type: "departement", nom: "Le Cher", slug: "le-cher", code: null, paysId: 2 },
    { id: 73, type: "departement", nom: "Aisne", slug: "aisne", code: null, paysId: 2 },
    { id: 74, type: "departement", nom: "Le Var", slug: "le-var", code: null, paysId: 2 },
    { id: 75, type: "departement", nom: "Loise", slug: "loise", code: null, paysId: 2 },
    { id: 76, type: "departement", nom: "Le Lot Et Garonne", slug: "le-lot-et-garonne", code: null, paysId: 2 }
];

const codeParSlug: Record<string, number|string> = {
  "lherault": 34,
  "le-tarnes": 81,
  "martinique": 972,
  "le-nord": 59,
  "guyane": 973,
  "la-moselle": 57,
  "la-meurthe-et-moselle": 54,
  "le-tarn-et-garonne": 82,
  "la-saone-et-loire": 71,
  "le-puy-de-dome": 63,
  "lindre": 12,
  "la-savoie": 73,
  "lain": "01",
  "le-vaucluse": 84,
  "le-loire-et-cher": 41,
  "guadeloupe": 971,
  "le-val-de-marne": 94,
  "la-haute-savoie": 74,
  "la-correze": 19,
  "le-morbihan": 56,
  "laude": 11,               // Aude
  "le-guard": 30,            // Gard
  "les-yvelines": 78,
  "lessonne": 91,            // Essonne
  "les-cotes-darmor": 22,
  "les-hauts-de-seine": 92,
  "le-loire": 42,
  "leure-et-loire": 37,      // Indre-et-Loire
  "les-hautes-pyrenees": 65,
  "la-loire-atlantique": 44,
  "la-nievre": 58,
  "lallier": "03",             // Allier
  "le-maine-et-loire": 49,
  "la-mayenne": 53,
  "les-pyrenees-orientales": 66,
  "le-territoire-de-belfort": 90,
  "le-haut-rhin": 68,
  "la-marne": 51,
  "charentes-maritimes": 17,
  "leure": 27,               // Eure
  "les-deux-sevres": 79,
  "lisere": 38,              // Isère
  "la-reunion": 974,
  "lille-et-vilaine": 35,    // Ille-et-Vilaine
  "la-sarthe": 72,
  "la-somme": 80,
  "lyonne": 89,
  "le-finistere": 29,
  "haute-corse": "2B",
  "les-pyrenees-atlantiques": 64,
  "les-hautes-alpes": "05",
  "laube": 10,
  "les-alpes-maritimes": "06",
  "la-gironde": 33,
  "la-drome": 26,
  "le-calvados": 14,
  "mayotte": 976,
  "le-bas-rhin": 67,
  "le-pas-de-calais": 62,
  "corse-du-sud": "2A",
  "le-vienne": 86,
  "les-vosges": 88,
  "la-manche": 50,
  "la-seine-st-denis": 93,
  "charentes": 16,
  "les-ardennes": "08",
  "le-val-doise": 95,
  "la-vendee": 85,
  "cotes-dor": 21,
  "la-seine-maritime": 76,
  "le-loiret": 45,
  "le-cher": 18,
  "aisne": "02",
  "le-var": 83,
  "loise": 10,               // Oise
  "le-lot-et-garonne": 47
};

export const departements: TDepartement[] = originalDepartements.map(d => ({
  ...d,
  code: String(codeParSlug[d.slug]) ?? null
}));

const output = `// AUTO-GENERATED FILE\nexport const departements = ${JSON.stringify(departements, null, 2)};\n`;
const outPath = path.resolve(__dirname, "../data/mixedDepts.ts");
fs.writeFileSync(outPath, output, "utf-8");
console.log("✅ Fichier généré : data/mixedDepts.ts");


