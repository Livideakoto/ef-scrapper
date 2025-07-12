// src/extract-faq-tchat.ts
import axios from "axios";
const cheerio = require("cheerio");
import fs from "fs";
import path from "path";

export interface IFaqItem {
    title: string;
    content: string;
}

const targetUrl = "https://www.esteban-frederic.fr/voyance-par-tchat-serieuse-et-immediate/";

function extractFaqSections($: any): IFaqItem[] {
    const faqItems: IFaqItem[] = [];
    const processedTitles = new Set<string>();
    
    // Trouve toutes les sections FAQ principales (h3 uniquement pour éviter les doublons)
    $("h3").each((_: any, el: any) => {
        const title = $(el).text().trim();
        
        // Ignore les titres qui ne sont pas des FAQ ou qui sont déjà traités
        if (!title || 
            title.includes("Choisissez un forfait") || 
            title.includes("L'excellence") ||
            title.includes("Des médiums et voyants fiables") ||
            title.includes("Bénéficiez d'une consultation") ||
            title.includes("Que vous soyez à Paris") ||
            title.includes("Votre première consultation") ||
            title.match(/^\d+\./) || // Ignore les titres numériques comme "1.", "2.", etc.
            processedTitles.has(title)) {
            return;
        }
        
        processedTitles.add(title);
        
        const content: string[] = [];
        let next = $(el).next();
        
        // Collecte tout le contenu jusqu'au prochain h2 ou h3
        while (next.length && !["h2", "h3"].includes(next[0].tagName?.toLowerCase())) {
            if (next[0].tagName?.toLowerCase() === "p") {
                content.push(`<p>${next.html()}</p>`);
            } else if (next[0].tagName?.toLowerCase() === "ul") {
                content.push(`<ul>${next.html()}</ul>`);
            } else if (next[0].tagName?.toLowerCase() === "ol") {
                content.push(`<ol>${next.html()}</ol>`);
            } else if (next[0].tagName?.toLowerCase() === "blockquote") {
                content.push(`<blockquote>${next.html()}</blockquote>`);
            } else if (next[0].tagName?.toLowerCase() === "h4") {
                // Inclure les h4 dans le contenu
                content.push(`<h4>${next.html()}</h4>`);
            } else if (next[0].tagName?.toLowerCase() === "div") {
                const divContent = next.html();
                if (divContent && divContent.trim()) {
                    content.push(`<div>${divContent}</div>`);
                }
            }
            next = next.next();
        }
        
        if (content.length > 0) {
            faqItems.push({
                title,
                content: `<div>${content.join("")}</div>`
            });
        }
    });
    
    return faqItems;
}

async function scrapeFaqTchat(): Promise<IFaqItem[]> {
    try {
        console.log(`Scraping FAQ from: ${targetUrl}`);
        const res = await axios.get(targetUrl);
        
        if (res.status !== 200 || !res.data) {
            throw new Error(`La page ${targetUrl} n'a pas pu être chargée.`);
        }

        const $ = cheerio.load(res.data);
        const faqItems = extractFaqSections($);
        
        console.log(`✅ ${faqItems.length} sections FAQ extraites`);
        return faqItems;
        
    } catch (err) {
        console.error(`Erreur lors du scraping : ${(err as Error).message}`);
        return [];
    }
}

async function run() {
    const faqItems = await scrapeFaqTchat();
    
    if (faqItems.length === 0) {
        console.log("❌ Aucune FAQ trouvée");
        return;
    }
    
    // Génère le contenu TypeScript
    const constantName = "VoyanceParTchat";
    const pathKey = "/voyance-par-tchat-serieuse-et-immediate";
    
    const output = `export interface IFaqItem {
    title: string;
    content: string;
}

const ${constantName} = ${JSON.stringify(faqItems, null, 4)};

export const faqs: Record<string, IFaqItem[]> = {
    "${pathKey}": ${constantName},
};
`;

    const outPath = path.resolve(__dirname, "../data/faq-tchat.ts");
    fs.writeFileSync(outPath, output, "utf-8");
    console.log("✅ Fichier généré : data/faq-tchat.ts");
    
    // Affiche un aperçu des FAQ extraites
    console.log("\n📝 Aperçu des FAQ extraites:");
    faqItems.forEach((item, index) => {
        console.log(`${index + 1}. ${item.title}`);
    });
}

run();
