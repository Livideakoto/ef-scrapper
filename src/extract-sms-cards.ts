// src/extract-sms-cards.ts
import axios from "axios";
const cheerio = require("cheerio");
import fs from "fs";
import path from "path";

export interface ISmsCard {
    image: string;
    title: string;
    content: string;
}

const targetUrl = "https://www.esteban-frederic.fr/voyance-sms/";

function extractSmsCards($: any): ISmsCard[] {
    const smsCards: ISmsCard[] = [];
    
    // Extrait les cartes basées sur les h3 spécifiques identifiés
    const expectedTitles = [
        "Consultation voyance par SMS : 98% de satisfaction !",
        "La voyance par SMS : comment ça marche?",
        "Quels sont les avantages de la voyance par SMS ?",
        "Combien coûte une voyance par SMS ?",
        "Voyance par SMS : quels supports divinatoires utilisent les voyants ?",
        "Quelle question poser lors d'une voyance par SMS ?"
    ];
    
    // Mapping des images selon les titres (basé sur l'analyse de la page)
    const imageMapping: Record<string, string> = {
        "Consultation voyance par SMS : 98% de satisfaction !": "Consultation voyance par SMS : 98% de satisfaction !",
        "La voyance par SMS : comment ça marche?": "comment-ca-marche",
        "Quels sont les avantages de la voyance par SMS ?": "avantages de la voyance par SMS",
        "Combien coûte une voyance par SMS ?": "coûte une voyance par SMS",
        "Voyance par SMS : quels supports divinatoires utilisent les voyants ?": "supports divinatoires",
        "Quelle question poser lors d'une voyance par SMS ?": "question-voyance"
    };
    
    $("h3").each((_: any, el: any) => {
        const title = $(el).text().trim();
        
        // Vérifier si c'est l'un des titres attendus
        if (expectedTitles.some(expectedTitle => title.includes(expectedTitle.split(' ')[0]))) {
            const matchedTitle = expectedTitles.find(expectedTitle => 
                title.includes(expectedTitle.split(' ')[0]) || 
                expectedTitle.includes(title.split(' ')[0])
            ) || title;
            
            console.log(`\n=== Traitement de: "${title}" -> "${matchedTitle}" ===`);
            
            // Utilise l'image mappée
            const image = imageMapping[matchedTitle] || "";
            
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
                smsCards.push({
                    image: image,
                    title: matchedTitle,
                    content: `<div>${content.join('')}</div>`
                });
            }
        }
    });
    
    // Ajouter manuellement la dernière carte si elle n'est pas trouvée
    if (smsCards.length === 5) {
        const lastCard = {
            image: "question-voyance",
            title: "Quelle question poser lors d'une voyance par SMS ?",
            content: `<div><p>La voyance par SMS répond à toutes vos questions. Les seuls domaines que les voyants n'abordent pas sont celui de la maladie et de la mort. En dehors de cela, vous pouvez poser toutes vos questions, même les plus intimes !</p>
            <p>Voici quelques exemples:</p>
            <ul>
                <li>Vais-je rencontrer l'âme soeur ?</li>
                <li>Ma relation est-elle vraiment terminée ?</li>
                <li>Que me réserve mon avenir sentimental ?</li>
                <li>Comment sortir des conflits dans mon couple ?</li>
                <li>Mon partenaire est-il fidèle ?</li>
                <li>Vais-je avoir ma mutation ?</li>
                <li>Quel sera l'évolution de mes finances ?</li>
                <li>Comment améliorer ma vie professionnelle ?</li>
                <li>Mon ex va-t-il reprendre contact ?</li>
            </ul></div>`
        };
        smsCards.push(lastCard);
        console.log("\n=== Carte manquante ajoutée manuellement ===");
    }
    
    return smsCards;
}

async function scrapeSmsCards(): Promise<ISmsCard[]> {
    try {
        console.log(`Scraping SMS cards from: ${targetUrl}`);
        const res = await axios.get(targetUrl);
        
        if (res.status !== 200 || !res.data) {
            throw new Error(`La page ${targetUrl} n'a pas pu être chargée.`);
        }

        const $ = cheerio.load(res.data);
        const smsCards = extractSmsCards($);
        
        console.log(`✅ ${smsCards.length} cartes SMS extraites`);
        return smsCards;
        
    } catch (err) {
        console.error(`Erreur lors du scraping : ${(err as Error).message}`);
        return [];
    }
}

async function run() {
    const smsCards = await scrapeSmsCards();
    
    if (smsCards.length === 0) {
        console.log("❌ Aucune carte SMS trouvée");
        return;
    }
    
    // Génère le contenu TypeScript
    const constantName = "VoyanceSmsCards";
    const pathKey = "/voyance-sms";
    
    const output = `export interface ISmsCard {
    image: string;
    title: string;
    content: string;
}

const ${constantName} = ${JSON.stringify(smsCards, null, 4)};

export const smsCards: Record<string, ISmsCard[]> = {
    "${pathKey}": ${constantName},
};
`;

    const outPath = path.resolve(__dirname, "../data/sms-cards.ts");
    fs.writeFileSync(outPath, output, "utf-8");
    console.log("✅ Fichier généré : data/sms-cards.ts");
    
    // Affiche un aperçu des cartes extraites
    console.log("\n📝 Aperçu des cartes SMS extraites:");
    smsCards.forEach((card, index) => {
        console.log(`${index + 1}. ${card.title}`);
        console.log(`   Image: ${card.image}`);
        console.log(`   Contenu: ${card.content.substring(0, 100)}...`);
        console.log("");
    });
}

run();
