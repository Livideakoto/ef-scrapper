// src/extract-cartes-homme.ts
import axios from "axios";
const cheerio = require("cheerio");
import fs from "fs";
import path from "path";

export interface ICardHomme {
    name: string;
    url: string;
    image: string;
    title: string;
    subtitle: string;
    content: string;
    quote?: string;
}

interface CardData {
    currentCard: ICardHomme;
    allCards: ICardHomme[];
}

async function scrapCardPage(url: string): Promise<ICardHomme | null> {
    try {
        console.log(`Scraping: ${url}`);
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        
        // Extraire le nom de la carte depuis l'URL
        const urlParts = url.split('/');
        const cardSlug = urlParts[urlParts.length - 2] || urlParts[urlParts.length - 1];
        
        // Extraire le titre principal
        const mainTitle = $('h1').first().text().trim();
        
        // Extraire le sous-titre
        const subtitle = $('h2').first().text().trim();
        
        // Extraire l'image
        let image = '';
        const imgEl = $('img[alt*="HOMME"], img[alt*="FEMME"], img[alt*="CARTE"], img[src*="carte"]').first();
        if (imgEl.length) {
            image = imgEl.attr('src') || '';
            if (image.startsWith('data:image')) {
                // Si c'est une image lazy-loaded, chercher dans data-src
                image = imgEl.attr('data-src') || imgEl.attr('data-lazy-src') || '';
            }
        }
        
        // Extraire le contenu principal
        let content = '';
        const contentSelectors = [
            '.entry-content',
            '.post-content',
            '.content',
            'main article',
            'article'
        ];
        
        for (const selector of contentSelectors) {
            const contentEl = $(selector);
            if (contentEl.length) {
                // Nettoyer le contenu des éléments indésirables
                contentEl.find('script, style, .comments, .sidebar, nav, header, footer').remove();
                content = contentEl.html() || '';
                break;
            }
        }
        
        // Si aucun contenu trouvé avec les sélecteurs, prendre tous les paragraphes
        if (!content) {
            const paragraphs: string[] = [];
            $('p').each((_: any, el: any) => {
                const text = $(el).html();
                if (text && text.trim().length > 20) {
                    paragraphs.push(text.trim());
                }
            });
            content = paragraphs.join('\n');
        }
        
        // Extraire la citation si elle existe
        let quote = '';
        const quoteSelectors = ['blockquote', '.quote', '.citation', 'q'];
        for (const selector of quoteSelectors) {
            const quoteEl = $(selector).first();
            if (quoteEl.length) {
                quote = quoteEl.text().trim();
                break;
            }
        }
        
        return {
            name: cardSlug,
            url: url,
            image: image,
            title: mainTitle,
            subtitle: subtitle,
            content: content,
            quote: quote || undefined
        };
        
    } catch (error) {
        console.error(`Erreur lors du scraping de ${url}:`, error);
        return null;
    }
}

async function extractCartesHomme(): Promise<CardData> {
    const baseUrl = "https://www.esteban-frederic.fr/carte-homme/";
    
    try {
        console.log("=== Extraction des cartes depuis la page Homme ===");
        const response = await axios.get(baseUrl);
        const $ = cheerio.load(response.data);
        
        // Extraire tous les liens vers les autres cartes
        const cardLinks = new Set<string>();
        
        // Chercher dans les liens avec des patterns de cartes
        $('a[href*="/carte-"], a[href*="/la-carte-"]').each((_: any, el: any) => {
            const href = $(el).attr('href');
            if (href) {
                let fullUrl = href;
                if (href.startsWith('/')) {
                    fullUrl = 'https://www.esteban-frederic.fr' + href;
                }
                if (fullUrl !== baseUrl) {
                    cardLinks.add(fullUrl);
                }
            }
        });
        
        // Chercher dans le texte des liens qui pourraient être des cartes
        $('a').each((_: any, el: any) => {
            const text = $(el).text().trim().toUpperCase();
            const href = $(el).attr('href');
            
            if (href && (
                text.includes('CARTE') || 
                text.includes('FEMME') || 
                text.includes('HOMME') ||
                text.includes('RÉUSSITE') ||
                text.includes('ÉLÉVATION') ||
                text.includes('RETARD') ||
                text.includes('AMITIÉ') ||
                text.includes('MAISON') ||
                text.includes('FORCE') ||
                text.match(/^[A-Z\s]+$/) // Texte en majuscules
            )) {
                let fullUrl = href;
                if (href.startsWith('/')) {
                    fullUrl = 'https://www.esteban-frederic.fr' + href;
                }
                if (fullUrl !== baseUrl && fullUrl.includes('esteban-frederic.fr')) {
                    cardLinks.add(fullUrl);
                }
            }
        });
        
        console.log(`Liens trouvés: ${cardLinks.size}`);
        cardLinks.forEach(link => console.log(`- ${link}`));
        
        // Scraper la carte actuelle (Homme)
        const currentCard = await scrapCardPage(baseUrl);
        if (!currentCard) {
            throw new Error("Impossible d'extraire la carte Homme");
        }
        
        // Scraper toutes les autres cartes
        const allCards: ICardHomme[] = [currentCard];
        
        for (const url of Array.from(cardLinks)) {
            const card = await scrapCardPage(url);
            if (card) {
                allCards.push(card);
            }
            // Petite pause pour éviter de surcharger le serveur
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        console.log(`\n=== Total des cartes extraites: ${allCards.length} ===`);
        allCards.forEach(card => console.log(`- ${card.name}: ${card.title}`));
        
        return {
            currentCard,
            allCards
        };
        
    } catch (error) {
        console.error("Erreur lors de l'extraction:", error);
        throw error;
    }
}

async function saveCartesData(cardData: CardData): Promise<void> {
    const dataDir = path.join(__dirname, "../data");
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Sauvegarder toutes les cartes
    const allCardsContent = `export interface ICardHomme {
    name: string;
    url: string;
    image: string;
    title: string;
    subtitle: string;
    content: string;
    quote?: string;
}

const CartesHomme: ICardHomme[] = ${JSON.stringify(cardData.allCards, null, 4)};

export const cartes: Record<string, ICardHomme[]> = {
    "/cartes-tarot": CartesHomme,
};

export default CartesHomme;
`;
    
    const allCardsPath = path.join(dataDir, "cartes-homme.ts");
    fs.writeFileSync(allCardsPath, allCardsContent, "utf8");
    console.log(`✅ Toutes les cartes sauvegardées dans: ${allCardsPath}`);
    
    // Sauvegarder aussi en JSON pour faciliter l'utilisation
    const jsonPath = path.join(dataDir, "cartes-homme.json");
    fs.writeFileSync(jsonPath, JSON.stringify(cardData, null, 2), "utf8");
    console.log(`✅ Données JSON sauvegardées dans: ${jsonPath}`);
}

// Fonction principale
async function main() {
    try {
        console.log("🃏 Début de l'extraction des cartes...");
        const cardData = await extractCartesHomme();
        await saveCartesData(cardData);
        console.log("✅ Extraction terminée avec succès!");
        
        console.log(`\n📊 Résumé:`);
        console.log(`- Carte principale: ${cardData.currentCard.title}`);
        console.log(`- Total des cartes: ${cardData.allCards.length}`);
        console.log(`- Cartes trouvées:`);
        cardData.allCards.forEach(card => {
            console.log(`  • ${card.title} (${card.name})`);
        });
        
    } catch (error) {
        console.error("❌ Erreur:", error);
        process.exit(1);
    }
}

// Exécuter si appelé directement
if (require.main === module) {
    main();
}

export { extractCartesHomme, saveCartesData };
