import slugify from "slugify";
import fs from "fs";
import path from "path";

import { pays, departements, villeListRaw } from "../data/divided-geodatas";

function getPaysIdForVille(slug: string, departementCode: string | null): number {
    if (departementCode) {
        return 2; // France
    }

  const canadaCities = ["montreal","quebec","sherbrooke","longueuil","gatineau","victoriaville","saguenay"];
  const belgiqueCities = ["bruxelles","anvers","liege","charleroi","mons","tournai","verviers","mouscron","namur"];
  const suisseCities = ["geneve","sion","neuchatel","lausanne","fribourg"];
  if (canadaCities.includes(slug)) return 1;
  if (belgiqueCities.includes(slug)) return 3;
  if (suisseCities.includes(slug)) return 5;
  if (slug === "luxembourg") return 4;

  return 2; // par défaut France
}

function getDepartementId(departementCode: string | null): number | null {
  if (!departementCode) return null;
  const dept = departements.find(d => d.slug.endsWith(departementCode.toLowerCase()));
  return dept ? dept.id : null;
}

const villeList = villeListRaw.map((v, idx) => {
    const paysId = getPaysIdForVille(v.slug, v.departement_code);
    const departementId = getDepartementId(v.departement_code);
    
    return {
        id: idx + 1 + pays.length + departements.length,
        type: "ville",
        nom: v.nom,
        slug: v.slug,
        departement_code: v.departement_code,
        paysId,
        departementId
    };
});

const output = `// AUTO-GENERATED FILE\nexport const villeDatas = ${JSON.stringify(villeList, null, 2)};\n`;
const outPath = path.resolve(__dirname, "../data/villeDatas.ts");
fs.writeFileSync(outPath, output, "utf-8");
console.log("✅ Fichier généré : data/villeDatas.ts");