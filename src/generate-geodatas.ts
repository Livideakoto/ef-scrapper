import slugify from "slugify";
import { urls } from "./urls";

import fs from "fs";
import path from "path";

let currentCountryId = 1;
let currentDeptId = 1;

// Détection et extraction
function parseUrl(url: string) {
	const lower = url.toLowerCase();
	const parts = url.split("/").filter(Boolean);

	if (lower.includes("/voyance-par-ville/")) {
		// Ville avec code département optionnel
		const segment = parts.at(-1)?.replace("voyance-a-", "").replace("voyance-en-", "");
		if (!segment) return null;

		const match = segment.match(/(.+?)-(\d{2,3}[a-z]?)$/i);
		const nom = match ? match[1] : segment;
		const code = match ? match[2] : null;

		return {
			type: "ville",
			nom: capitalize(nom),
			slug: slugify(nom, { lower: true }),
			departement_code: code
		};
	} else if (lower.includes("/voyance-par-pays/")) {
		const segment = parts.at(-1)?.replace("voyance-a-", "")
			.replace("voyance-en-", "")
			.replace("voyance-au-", "")
			.replace("voyance-dans-", "")
			.replace("voyance-", "")
			.replace(/-$/, "");
		if (!segment) return null;

		// Vérifie si c’est un vrai pays connu
		const paysConnus = ["france", "suisse", "belgique", "luxembourg", "canada"];
		const slug = slugify(segment, { lower: true });

		if (paysConnus.includes(slug)) {
			return {
                id: currentCountryId++,
				type: "pays",
				nom: capitalize(segment),
				slug
			};
		} else {
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

function capitalize(str: string): string {
	return str
		.split("-")
		.map(s => s.charAt(0).toUpperCase() + s.slice(1))
		.join(" ");
}

// Exemple d’exécution
const result = urls.map(parseUrl).filter(Boolean);
const output = `// AUTO-GENERATED FILE\nexport const geodatas = ${JSON.stringify(result, null, 2)};\n`;
const outPath = path.resolve(__dirname, "../data/geodatas.ts");
fs.writeFileSync(outPath, output, "utf-8");
console.log("✅ Fichier généré : data/geodatas.ts");

