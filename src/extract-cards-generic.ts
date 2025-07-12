// src/extract-cards-generic.ts
import axios from "axios";
const cheerio = require("cheerio");
import fs from "fs";
import path from "path";

export interface ICard {
    image: string;
    title: string;
    content: string;
}

interface CardScrapingOptions {
    url: string;
    pathname: string;
    constantName: string;
    sectionTitle: string;
    expectedTitles: string[];
    imageMapping?: Record<string, string>;
    outputFileName?: string;
}

function extractCards($: any, options: CardScrapingOptions): ICard[] {
    const cards: ICard[] = [];
    
    console.log(`\n=== Recherche des cartes dans la section "${options.sectionTitle}" ===`);
    
    $("h3").each((_: any, el: any) => {
        const title = $(el).text().trim();
        
        // Vérifier si c'est l'un des titres attendus
        if (options.expectedTitles.some(expectedTitle => 
            title.includes(expectedTitle) || expectedTitle.includes(title)
        )) {
            const matchedTitle = options.expectedTitles.find(expectedTitle => 
                title.includes(expectedTitle) || expectedTitle.includes(title)
            ) || title;
            
            console.log(`\n=== Traitement de: "${title}" ===`);
            
            // Utilise l'image mappée si disponible
            const image = options.imageMapping?.[matchedTitle] || "";
            
            // Extrait le contenu HTML
            const content: string[] = [];
            let contentEl = $(el).next();
            
            while (contentEl.length && 
                   contentEl[0].tagName?.toLowerCase() !== 'h3' && 
                   contentEl[0].tagName?.toLowerCase() !== 'h2') {
                
                if (contentEl[0].tagName?.toLowerCase() === 'p') {
                    const htmlContent = contentEl.html();
                    if (htmlContent && htmlContent.trim()) {
                        content.push(`<p>${htmlContent}</p>`);
                    }
                } else if (contentEl[0].tagName?.toLowerCase() === 'ul') {
                    const htmlContent = contentEl.html();
                    if (htmlContent && htmlContent.trim()) {
                        content.push(`<ul>${htmlContent}</ul>`);
                    }
                } else if (contentEl[0].tagName?.toLowerCase() === 'ol') {
                    const htmlContent = contentEl.html();
                    if (htmlContent && htmlContent.trim()) {
                        content.push(`<ol>${htmlContent}</ol>`);
                    }
                } else if (contentEl[0].tagName?.toLowerCase() === 'div') {
                    const htmlContent = contentEl.html();
                    if (htmlContent && htmlContent.trim() && !contentEl.find('img').length) {
                        content.push(`<div>${htmlContent}</div>`);
                    }
                }
                
                contentEl = contentEl.next();
            }
            
            console.log(`Contenu HTML extrait: ${content.join(' ').substring(0, 100)}...`);
            
            if (matchedTitle && content.length > 0) {
                cards.push({
                    image: image,
                    title: matchedTitle,
                    content: `<div>${content.join('')}</div>`
                });
            }
        }
    });
    
    return cards;
}

async function scrapeCards(options: CardScrapingOptions): Promise<ICard[]> {
    try {
        console.log(`Scraping cards from: ${options.url}`);
        const res = await axios.get(options.url);
        
        if (res.status !== 200 || !res.data) {
            throw new Error(`La page ${options.url} n'a pas pu être chargée.`);
        }

        const $ = cheerio.load(res.data);
        const cards = extractCards($, options);
        
        console.log(`✅ ${cards.length} cartes extraites`);
        return cards;
        
    } catch (err) {
        console.error(`Erreur lors du scraping : ${(err as Error).message}`);
        return [];
    }
}

export async function generateCardsFile(options: CardScrapingOptions): Promise<void> {
    const cards = await scrapeCards(options);
    
    if (cards.length === 0) {
        console.log("❌ Aucune carte trouvée");
        return;
    }
    
    // Génère le contenu TypeScript
    const output = `export interface ICard {
    image: string;
    title: string;
    content: string;
}

const ${options.constantName} = ${JSON.stringify(cards, null, 4)};

export const cards: Record<string, ICard[]> = {
    "${options.pathname}": ${options.constantName},
};
`;

    const outputFileName = options.outputFileName || `cards-${options.constantName.toLowerCase()}.ts`;
    const outPath = path.resolve(__dirname, `../data/${outputFileName}`);
    fs.writeFileSync(outPath, output, "utf-8");
    console.log(`✅ Fichier généré : data/${outputFileName}`);
    
    // Affiche un aperçu des cartes extraites
    console.log("\n📝 Aperçu des cartes extraites:");
    cards.forEach((card, index) => {
        console.log(`${index + 1}. ${card.title}`);
        console.log(`   Image: ${card.image}`);
        console.log(`   Contenu: ${card.content.substring(0, 100)}...`);
        console.log("");
    });
}

// Script principal si exécuté directement
if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args.length < 1) {
        console.error("Usage: npm run build-cards-generic <CONFIG_FILE>");
        console.error("Exemple: npm run build-cards-generic sms-config.json");
        process.exit(1);
    }
    
    const configFile = args[0];
    const configPath = path.resolve(__dirname, `../config/${configFile}`);
    
    try {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        generateCardsFile(config);
    } catch (err) {
        console.error(`Erreur lors de la lecture du fichier de configuration : ${(err as Error).message}`);
        process.exit(1);
    }
}
