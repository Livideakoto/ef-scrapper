// src/extract-cartes-homme-optimized.ts
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

async function scrapCardPage(url: string, maxRetries = 3): Promise<ICardHomme | null> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`Scraping (tentative ${attempt}): ${url}`);
            
            const response = await axios.get(url, {
                timeout: 10000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });
            
            const $ = cheerio.load(response.data);
            
            // Extraire le nom de la carte depuis l'URL
            const urlParts = url.split('/').filter(part => part);
            const cardSlug = urlParts[urlParts.length - 1] || 'unknown';
            
            // Extraire le titre principal
            const mainTitle = $('h1').first().text().trim() || $('title').text().trim();
            
            // Extraire le sous-titre
            const subtitle = $('h2').first().text().trim();
            
            // Extraire l'image principale
            let image = '';
            const imageSelectors = [
                'img[alt*="CARTE"]',
                'img[alt*="carte"]', 
                'img[src*="carte"]',
                '.entry-content img',
                'article img',
                'main img'
            ];
            
            for (const selector of imageSelectors) {
                const imgEl = $(selector).first();
                if (imgEl.length) {
                    image = imgEl.attr('src') || imgEl.attr('data-src') || imgEl.attr('data-lazy-src') || '';
                    if (image && !image.startsWith('data:image')) {
                        break;
                    }
                }
            }
            
            // Extraire le contenu principal de manière plus ciblée
            let content = '';
            
            // Rechercher le contenu dans des zones spécifiques
            const contentSelectors = [
                '.entry-content',
                '.post-content', 
                '.content',
                'main article',
                'article .content',
                '.page-content'
            ];
            
            for (const selector of contentSelectors) {
                const contentEl = $(selector);
                if (contentEl.length > 0) {
                    // Nettoyer le contenu
                    contentEl.find('script, style, .comments, .sidebar, nav, header, footer, .share, .social').remove();
                    const htmlContent = contentEl.html();
                    if (htmlContent && htmlContent.trim().length > 100) {
                        content = htmlContent.trim();
                        break;
                    }
                }
            }
            
            // Si pas de contenu trouvé, extraire les paragraphes principaux
            if (!content) {
                const paragraphs: string[] = [];
                $('p').each((_: any, el: any) => {
                    const text = $(el).text().trim();
                    const html = $(el).html();
                    if (text.length > 30 && html) {
                        paragraphs.push(html.trim());
                    }
                });
                content = paragraphs.slice(0, 10).join('\n'); // Limiter à 10 paragraphes
            }
            
            // Extraire une citation si elle existe
            let quote = '';
            const quoteSelectors = ['blockquote', '.quote', '.citation', 'q'];
            for (const selector of quoteSelectors) {
                const quoteEl = $(selector).first();
                if (quoteEl.length) {
                    quote = quoteEl.text().trim();
                    if (quote.length > 10) break;
                }
            }
            
            const card: ICardHomme = {
                name: cardSlug,
                url: url,
                image: image,
                title: mainTitle,
                subtitle: subtitle,
                content: content,
                quote: quote || undefined
            };
            
            console.log(`✅ Extrait: ${card.title}`);
            return card;
            
        } catch (error) {
            console.error(`❌ Erreur (tentative ${attempt}) pour ${url}:`, error instanceof Error ? error.message : error);
            if (attempt === maxRetries) {
                return null;
            }
            // Attendre avant de réessayer
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
    return null;
}

async function extractCartesFromMainPage(): Promise<string[]> {
    const baseUrl = "https://www.esteban-frederic.fr/carte-homme/";
    
    try {
        console.log("=== Extraction des liens depuis la page principale ===");
        const response = await axios.get(baseUrl, {
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        
        const $ = cheerio.load(response.data);
        const cardLinks = new Set<string>();
        
        // Patterns de cartes connus
        const cardPatterns = [
            'carte-femme',
            'la-carte-de-la-reussite',
            'carte-elevation', 
            'la-carte-du-retard',
            'carte-amitie',
            'carte-maison',
            'carte-force',
            'carte-instabilite',
            'carte-trahison',
            'carte-danger',
            'carte-argent',
            'la-carte-du-retour',
            'carte-difficulte',
            'carte-travail',
            'carte-vacances',
            'la-carte-de-la-nouvelle',
            'carte-union',
            'la-carte-de-la-famille',
            'la-carte-de-lamour',
            'carte-conflit',
            'carte-separation',
            'la-carte-du-changement',
            'carte-discussions',
            'carte-echec',
            'carte-jalousie',
            'la-carte-du-mensonge',
            'carte-passe',
            'carte-choix',
            'carte-eloignement',
            'carte-bonheur',
            'carte-jeunesse',
            'carte-vieillesse'
        ];
        
        // Ajouter les patterns connus
        cardPatterns.forEach(pattern => {
            cardLinks.add(`https://www.esteban-frederic.fr/${pattern}/`);
        });
        
        // Rechercher aussi dynamiquement les liens
        $('a[href*="/carte-"], a[href*="/la-carte-"]').each((_: any, el: any) => {
            const href = $(el).attr('href');
            if (href) {
                let fullUrl = href;
                if (href.startsWith('/')) {
                    fullUrl = 'https://www.esteban-frederic.fr' + href;
                }
                if (fullUrl !== baseUrl && fullUrl.includes('/carte')) {
                    cardLinks.add(fullUrl);
                }
            }
        });
        
        const urls = Array.from(cardLinks);
        console.log(`Found ${urls.length} card URLs`);
        
        return urls;
        
    } catch (error) {
        console.error("Erreur lors de l'extraction des liens:", error);
        throw error;
    }
}

async function extractCartesHommeOptimized(): Promise<CardData> {
    const baseUrl = "https://www.esteban-frederic.fr/carte-homme/";
    
    try {
        // Extraire la carte principale (Homme)
        console.log("=== Extraction de la carte principale ===");
        const currentCard = await scrapCardPage(baseUrl);
        if (!currentCard) {
            throw new Error("Impossible d'extraire la carte Homme");
        }
        
        // Extraire les URLs de toutes les autres cartes
        const cardUrls = await extractCartesFromMainPage();
        
        // Filtrer l'URL de la carte actuelle
        const otherCardUrls = cardUrls.filter(url => url !== baseUrl);
        
        console.log(`=== Extraction de ${otherCardUrls.length} autres cartes ===`);
        
        const allCards: ICardHomme[] = [currentCard];
        
        // Traiter les cartes par batch pour éviter la surcharge
        const batchSize = 3;
        for (let i = 0; i < otherCardUrls.length; i += batchSize) {
            const batch = otherCardUrls.slice(i, i + batchSize);
            
            console.log(`\n--- Batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(otherCardUrls.length / batchSize)} ---`);
            
            const batchPromises = batch.map(url => scrapCardPage(url));
            const batchResults = await Promise.all(batchPromises);
            
            for (const card of batchResults) {
                if (card) {
                    allCards.push(card);
                }
            }
            
            // Pause entre les batches
            if (i + batchSize < otherCardUrls.length) {
                console.log("⏱️  Pause de 2 secondes...");
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
        
        console.log(`\n=== Extraction terminée: ${allCards.length} cartes extraites ===`);
        
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
    
    // Sauvegarder toutes les cartes en TypeScript
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
    
    // Créer un fichier de résumé
    const summary = {
        totalCards: cardData.allCards.length,
        extractionDate: new Date().toISOString(),
        cards: cardData.allCards.map(card => ({
            name: card.name,
            title: card.title,
            url: card.url,
            hasImage: !!card.image,
            hasQuote: !!card.quote,
            contentLength: card.content.length
        }))
    };
    
    const summaryPath = path.join(dataDir, "cartes-homme-summary.json");
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2), "utf8");
    console.log(`✅ Résumé sauvegardé dans: ${summaryPath}`);
}

// Fonction principale
async function main() {
    try {
        console.log("🃏 Début de l'extraction optimisée des cartes...");
        const startTime = Date.now();
        
        const cardData = await extractCartesHommeOptimized();
        await saveCartesData(cardData);
        
        const endTime = Date.now();
        const duration = Math.round((endTime - startTime) / 1000);
        
        console.log(`\n✅ Extraction terminée avec succès en ${duration} secondes!`);
        
        console.log(`\n📊 Résumé:`);
        console.log(`- Carte principale: ${cardData.currentCard.title}`);
        console.log(`- Total des cartes: ${cardData.allCards.length}`);
        console.log(`- Cartes avec images: ${cardData.allCards.filter(c => c.image).length}`);
        console.log(`- Cartes avec citations: ${cardData.allCards.filter(c => c.quote).length}`);
        
        console.log(`\n🃏 Cartes extraites:`);
        cardData.allCards.forEach((card, index) => {
            console.log(`  ${index + 1}. ${card.title} (${card.name})`);
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

export { extractCartesHommeOptimized, saveCartesData };
