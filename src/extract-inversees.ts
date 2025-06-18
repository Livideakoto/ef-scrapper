import axios from "axios";
const cheerio = require("cheerio");
import fs from "fs";
import path from "path";

const inversees = [
	"0110", "0220", "0330", "0440", "0550", "1001", "1221", "1331", "1441", "1551", "2002", "2112", "2332"
];
const baseURL = "https://www.esteban-frederic.fr/heure-miroir-inversee-";

type HeureMiroirInverseeData = {
	titre: string;
	signification: string;
	spirituel: string;
	ange: string;
	messageAnges: string;
	numerologie: string;
	amour: string;
	travail: string;
	finance: string;
	tarot: string;
    quefaire: string;
	resume: string;
};

function extractSections($: any): Partial<HeureMiroirInverseeData> {
	const result: Partial<HeureMiroirInverseeData> = {};
	$("h2, h3").each((_: any, el: any) => {
		const title = $(el).text().toLowerCase();
		const key =
			title.includes("signification") ? "signification" :
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

async function scrapeInversee(slug: string): Promise<[string, HeureMiroirInverseeData | null]> {
	try {
		const url = `${baseURL}${slug}/`;
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
	} catch (err) {
		console.error(`Erreur sur ${slug} : ${(err as Error).message}`);
		return [slug, null];
	}
}

async function run() {
	const result: Record<string, HeureMiroirInverseeData> = {};

	for (const slug of inversees) {
		console.log(`Scraping ${slug}...`);
		const [key, data] = await scrapeInversee(slug);
		if (data) result[key] = data;
	}

	const output = `// AUTO-GENERATED FILE\nexport const heuresMiroirsInversees = ${JSON.stringify(result, null, 2)};\n`;

	const outPath = path.resolve(__dirname, "../data/heuresMiroirsInversees.ts");
	fs.writeFileSync(outPath, output, "utf-8");
	console.log("✅ Fichier généré : data/heuresMiroirsInversees.ts");
}

run();
