// src/extract.ts
import axios from "axios";
const cheerio = require("cheerio");
import fs from "fs";
import path from "path";

// const heures = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, "0")}${i.toString().padStart(2, "0")}`);

const heures = [
	"2226", "1118", "1114", "1112", "1110", "0110", "0005"
];
const baseURL = "https://www.esteban-frederic.fr/heure-miroir-";

type HeureMiroirData = {
	titre: string;
	signification: string;
	spirituel?: string; // Optional field for spiritual meaning
	ange: string;
	// messageAnges: string;
	numerologie: string;
	amour: string;
	travail: string;
	finance: string;
	tarot: string;
	quefaire?: string; // Optional field for "que faire"
    resume: string; // Optional field for summary
};

function extractSections($: any): Partial<HeureMiroirData> {
	const result: Partial<HeureMiroirData> = {};
	$("h2, h3").each((_: any, el: any) => {
		const title = $(el).text().toLowerCase();
		const key =
			title.includes("signification") ? "signification" :
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

		if (!key) return;

		const texts: string[] = [];
		let next = $(el).next();
		while (next.length && !["h2", "h3"].includes(next[0].tagName.toLowerCase())) {
			texts.push(next.text().trim());
			next = next.next();
		}
		result[key] = texts.join("\n\n");
	});
	return result;
}

async function scrapeHeure(slug: string): Promise<[string, HeureMiroirData | null]> {
	try {
		const url = `${baseURL}${slug}/`;
		const res = await axios.get(url);
        // console.log("cheerio object:", cheerio);
        if (res.status !== 200 || !res.data) {
            throw new Error(`La page ${url} n'a pas pu être chargée.`);
        }

		const $ = cheerio.load(res.data);

		const titre = $("h1").first().text().trim();
		const raw = extractSections($);

		let ange = raw.ange || "";
		let messageAnges = raw.ange || "";
		if (raw.ange?.includes(":")) {
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
	} catch (err) {
		console.error(`Erreur sur ${slug} : ${(err as Error).message}`);
		return [slug, null];
	}
}

async function run() {
	const result: Record<string, HeureMiroirData> = {};

	for (const heure of heures) {
		console.log(`Scraping ${heure}...`);
		const [slug, data] = await scrapeHeure(heure);
		if (data) result[slug] = data;
	}

	const output = `// AUTO-GENERATED FILE\nexport const heuresMiroirs = ${JSON.stringify(result, null, 2)};\n`;

	const outPath = path.resolve(__dirname, "../data/heuresMiroirs.ts");
	fs.writeFileSync(outPath, output, "utf-8");
	console.log("✅ Fichier généré : data/heuresMiroirs.ts");
}

run();
