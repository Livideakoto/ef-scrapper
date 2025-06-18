import axios from "axios";
const cheerio = require("cheerio");
import fs from "fs";
import path from "path";

const nombres = [111, 222, 333, 444, 555, 666, 777, 888, 999];
const baseURL = "https://www.esteban-frederic.fr/nombre-";

type NombreTripleData = {
	titre: string;
	signification: string;
	ange: string;
	messageAnges: string;
	numerologie: string;
	tarot: string;
	amour: string;
	travail: string;
	spirituel: string;
	resume: string;
};

function extractSections($: any): Partial<NombreTripleData> {
	const result: Partial<NombreTripleData> = {};
	$("h2, h3").each((_: any, el: any) => {
		const title = $(el).text().toLowerCase();
		const key =
			title.includes("signification") ? "signification" :
			title.includes("ange") ? "ange" :
			title.includes("numérologie") ? "numerologie" :
			title.includes("tarot") ? "tarot" :
			title.includes("amour") ? "amour" :
			title.includes("travail") ? "travail" :
			title.includes("spirituel") || title.includes("spiritualité") ? "spirituel" :
			title.includes("résumé") ? "resume" :
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

async function scrapeNombre(slug: string): Promise<[string, NombreTripleData | null]> {
	try {
		const url = `${baseURL}${slug}-signification-et-symbolique/`;
		const res = await axios.get(url);

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
				ange: ange || "",
				messageAnges: messageAnges || "",
				numerologie: raw.numerologie || "",
				tarot: raw.tarot || "",
				amour: raw.amour || "",
				travail: raw.travail || "",
				spirituel: raw.spirituel || "",
				resume: raw.resume || "",
			}
		];
	} catch (err) {
		console.error(`Erreur sur ${slug} : ${(err as Error).message}`);
		return [slug, null];
	}
}

async function run() {
	const result: Record<string, NombreTripleData> = {};

	for (const nombre of nombres) {
		const slug = nombre.toString();
		console.log(`Scraping ${slug}...`);
		const [slugKey, data] = await scrapeNombre(slug);
		if (data) result[slugKey] = data;
	}

	const output = `// AUTO-GENERATED FILE\nexport const nombresTriples = ${JSON.stringify(result, null, 2)};\n`;

	const outPath = path.resolve(__dirname, "../data/nombresTriples.ts");
	fs.writeFileSync(outPath, output, "utf-8");
	console.log("✅ Fichier généré : data/nombresTriples.ts");
}

run();
