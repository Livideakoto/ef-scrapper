// src/extract-cartes-avec-images.ts
import axios from "axios";
const cheerio = require("cheerio");
import fs from "fs";
import path from "path";

export interface ICardHommeAvecImage {
    name: string;
    url: string;
    image: string;
    imageLocal?: string;
    imageAlt?: string;
    title: string;
    subtitle: string;
    content: string;
    quote?: string;
}

interface CardData {
    currentCard: ICardHommeAvecImage;
    allCards: ICardHommeAvecImage[];
}

async function downloadImage(imageUrl: string, cardName: string, imageFolder: string): Promise<string | null> {
    if (!imageUrl || imageUrl.includes('data:image') || imageUrl.includes('svg+xml')) {
        return null;
    }

    try {
        console.log(`📸 Téléchargement de l'image pour ${cardName}: ${imageUrl}`);
        
        // Normaliser l'URL si elle est relative
        let fullImageUrl = imageUrl;
        if (imageUrl.startsWith('/')) {
            fullImageUrl = 'https://www.esteban-frederic.fr' + imageUrl;
        }

        const response = await axios.get(fullImageUrl, {
            responseType: 'stream',
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        // Déterminer l'extension du fichier
        const contentType = response.headers['content-type'];
        let extension = '.jpg';
        if (contentType) {
            if (contentType.includes('png')) extension = '.png';
            else if (contentType.includes('gif')) extension = '.gif';
            else if (contentType.includes('webp')) extension = '.webp';
            else if (contentType.includes('svg')) extension = '.svg';
        }

        // Nom du fichier local
        const fileName = `${cardName}${extension}`;
        const localPath = path.join(imageFolder, fileName);

        // Télécharger et sauvegarder
        const writer = fs.createWriteStream(localPath);
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', () => {
                console.log(`✅ Image sauvegardée: ${fileName}`);
                resolve(fileName);
            });
            writer.on('error', (error) => {
                console.error(`❌ Erreur sauvegarde ${fileName}:`, error);
                reject(error);
            });
        });

    } catch (error) {
        console.error(`❌ Erreur téléchargement image pour ${cardName}:`, error instanceof Error ? error.message : error);
        return null;
    }
}

async function scrapCardPageAvecImage(url: string, imageFolder: string, maxRetries = 3): Promise<ICardHommeAvecImage | null> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`\n🃏 Scraping (tentative ${attempt}): ${url}`);
            
            const response = await axios.get(url, {
                timeout: 15000,
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
            
            // Extraire l'image principale avec plusieurs stratégies
            let image = '';
            let imageAlt = '';
            
            // Stratégie 1: Chercher les images spécifiques aux cartes
            const imageSelectors = [
                'img[alt*="CARTE"]',
                'img[alt*="carte"]',
                'img[alt*="HOMME"]',
                'img[alt*="FEMME"]',
                'img[src*="/carte"]',
                'img[src*="/tarot"]',
                '.card-image img',
                '.entry-content img:first-of-type',
                'article img:first-of-type',
                'main img:first-of-type'
            ];
            
            for (const selector of imageSelectors) {
                const imgEl = $(selector).first();
                if (imgEl.length) {
                    image = imgEl.attr('src') || imgEl.attr('data-src') || imgEl.attr('data-lazy-src') || '';
                    imageAlt = imgEl.attr('alt') || '';
                    
                    // Si c'est une image lazy-loaded, essayer de récupérer la vraie URL
                    if (!image || image.includes('data:image')) {
                        image = imgEl.attr('data-src') || imgEl.attr('data-lazy-src') || imgEl.attr('data-original') || '';
                    }
                    
                    if (image && !image.includes('data:image') && !image.includes('svg+xml')) {
                        console.log(`🖼️  Image trouvée: ${image}`);
                        break;
                    }
                }
            }
            
            // Stratégie 2: Si pas d'image trouvée, chercher dans le contenu HTML brut
            if (!image || image.includes('data:image')) {
                const htmlContent = response.data;
                
                // Rechercher des patterns d'images dans le HTML
                const imagePatterns = [
                    /data-src="([^"]*carte[^"]*)"/gi,
                    /data-lazy-src="([^"]*carte[^"]*)"/gi,
                    /src="([^"]*carte[^"]*)"/gi,
                    /data-src="([^"]*tarot[^"]*)"/gi,
                    /href="([^"]*\.(?:jpg|jpeg|png|gif|webp)[^"]*)"/gi
                ];
                
                for (const pattern of imagePatterns) {
                    const matches = htmlContent.match(pattern);
                    if (matches && matches.length > 0) {
                        const match = matches[0];
                        const urlMatch = match.match(/="([^"]*)"/);
                        if (urlMatch) {
                            const foundUrl = urlMatch[1];
                            if (!foundUrl.includes('data:image') && !foundUrl.includes('svg+xml')) {
                                image = foundUrl;
                                console.log(`🔍 Image trouvée dans HTML: ${image}`);
                                break;
                            }
                        }
                    }
                }
            }
            
            // Télécharger l'image si trouvée
            let imageLocal: string | null = null;
            if (image && !image.includes('data:image')) {
                imageLocal = await downloadImage(image, cardSlug, imageFolder);
            }
            
            // Extraire le contenu principal
            let content = '';
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
                content = paragraphs.slice(0, 10).join('\n');
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
            
            const card: ICardHommeAvecImage = {
                name: cardSlug,
                url: url,
                image: image,
                imageLocal: imageLocal || undefined,
                imageAlt: imageAlt || undefined,
                title: mainTitle,
                subtitle: subtitle,
                content: content,
                quote: quote || undefined
            };
            
            console.log(`✅ Extrait: ${card.title} ${imageLocal ? '(avec image)' : '(sans image)'}`);
            return card;
            
        } catch (error) {
            console.error(`❌ Erreur (tentative ${attempt}) pour ${url}:`, error instanceof Error ? error.message : error);
            if (attempt === maxRetries) {
                return null;
            }
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

async function extractCartesAvecImages(): Promise<CardData> {
    const baseUrl = "https://www.esteban-frederic.fr/carte-homme/";
    
    // Créer le dossier d'images s'il n'existe pas
    const imageFolder = path.join(__dirname, "../data/images");
    if (!fs.existsSync(imageFolder)) {
        fs.mkdirSync(imageFolder, { recursive: true });
    }
    
    try {
        // Extraire la carte principale (Homme)
        console.log("=== Extraction de la carte principale avec image ===");
        const currentCard = await scrapCardPageAvecImage(baseUrl, imageFolder);
        if (!currentCard) {
            throw new Error("Impossible d'extraire la carte Homme");
        }
        
        // Extraire les URLs de toutes les autres cartes
        const cardUrls = await extractCartesFromMainPage();
        const otherCardUrls = cardUrls.filter(url => url !== baseUrl);
        
        console.log(`\n=== Extraction de ${otherCardUrls.length} autres cartes avec images ===`);
        
        const allCards: ICardHommeAvecImage[] = [currentCard];
        
        // Traiter les cartes par batch plus petit pour éviter la surcharge
        const batchSize = 2;
        for (let i = 0; i < otherCardUrls.length; i += batchSize) {
            const batch = otherCardUrls.slice(i, i + batchSize);
            
            console.log(`\n--- Batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(otherCardUrls.length / batchSize)} ---`);
            
            // Traiter séquentiellement pour éviter les erreurs de téléchargement
            for (const url of batch) {
                const card = await scrapCardPageAvecImage(url, imageFolder);
                if (card) {
                    allCards.push(card);
                }
                // Pause entre chaque carte
                await new Promise(resolve => setTimeout(resolve, 1500));
            }
            
            // Pause entre les batches
            if (i + batchSize < otherCardUrls.length) {
                console.log("⏱️  Pause de 3 secondes...");
                await new Promise(resolve => setTimeout(resolve, 3000));
            }
        }
        
        console.log(`\n=== Extraction terminée: ${allCards.length} cartes extraites ===`);
        
        // Statistiques des images
        const cartesAvecImages = allCards.filter(card => card.imageLocal);
        console.log(`📸 Images téléchargées: ${cartesAvecImages.length}/${allCards.length}`);
        
        return {
            currentCard,
            allCards
        };
        
    } catch (error) {
        console.error("Erreur lors de l'extraction:", error);
        throw error;
    }
}

async function saveCartesDataAvecImages(cardData: CardData): Promise<void> {
    const dataDir = path.join(__dirname, "../data");
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Sauvegarder toutes les cartes en TypeScript
    const allCardsContent = `export interface ICardHommeAvecImage {
    name: string;
    url: string;
    image: string;
    imageLocal?: string;
    imageAlt?: string;
    title: string;
    subtitle: string;
    content: string;
    quote?: string;
}

const CartesHommeAvecImages: ICardHommeAvecImage[] = ${JSON.stringify(cardData.allCards, null, 4)};

export const cartes: Record<string, ICardHommeAvecImage[]> = {
    "/cartes-tarot-avec-images": CartesHommeAvecImages,
};

export default CartesHommeAvecImages;
`;
    
    const allCardsPath = path.join(dataDir, "cartes-homme-avec-images.ts");
    fs.writeFileSync(allCardsPath, allCardsContent, "utf8");
    console.log(`✅ Toutes les cartes avec images sauvegardées dans: ${allCardsPath}`);
    
    // Sauvegarder aussi en JSON
    const jsonPath = path.join(dataDir, "cartes-homme-avec-images.json");
    fs.writeFileSync(jsonPath, JSON.stringify(cardData, null, 2), "utf8");
    console.log(`✅ Données JSON avec images sauvegardées dans: ${jsonPath}`);
    
    // Créer un fichier de résumé avec statistiques d'images
    const cartesAvecImages = cardData.allCards.filter(card => card.imageLocal);
    const summary = {
        totalCards: cardData.allCards.length,
        cardsWithImages: cartesAvecImages.length,
        cardsWithoutImages: cardData.allCards.length - cartesAvecImages.length,
        extractionDate: new Date().toISOString(),
        imageFolder: './data/images/',
        cards: cardData.allCards.map(card => ({
            name: card.name,
            title: card.title,
            url: card.url,
            hasImage: !!card.image,
            hasLocalImage: !!card.imageLocal,
            imageLocal: card.imageLocal,
            imageAlt: card.imageAlt,
            hasQuote: !!card.quote,
            contentLength: card.content.length
        }))
    };
    
    const summaryPath = path.join(dataDir, "cartes-homme-avec-images-summary.json");
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2), "utf8");
    console.log(`✅ Résumé avec statistiques d'images sauvegardé dans: ${summaryPath}`);
}

// Fonction principale
async function main() {
    try {
        console.log("🃏 Début de l'extraction des cartes avec téléchargement d'images...");
        const startTime = Date.now();
        
        const cardData = await extractCartesAvecImages();
        await saveCartesDataAvecImages(cardData);
        
        const endTime = Date.now();
        const duration = Math.round((endTime - startTime) / 1000);
        
        console.log(`\n✅ Extraction terminée avec succès en ${duration} secondes!`);
        
        const cartesAvecImages = cardData.allCards.filter(card => card.imageLocal);
        
        console.log(`\n📊 Résumé:`);
        console.log(`- Carte principale: ${cardData.currentCard.title}`);
        console.log(`- Total des cartes: ${cardData.allCards.length}`);
        console.log(`- Cartes avec images téléchargées: ${cartesAvecImages.length}`);
        console.log(`- Cartes avec citations: ${cardData.allCards.filter(c => c.quote).length}`);
        
        console.log(`\n📸 Images téléchargées:`);
        cartesAvecImages.forEach((card, index) => {
            console.log(`  ${index + 1}. ${card.title} → ${card.imageLocal}`);
        });
        
        if (cartesAvecImages.length < cardData.allCards.length) {
            console.log(`\n⚠️  Cartes sans images:`);
            cardData.allCards.filter(card => !card.imageLocal).forEach(card => {
                console.log(`  • ${card.title} (${card.image || 'aucune image'})`);
            });
        }
        
    } catch (error) {
        console.error("❌ Erreur:", error);
        process.exit(1);
    }
}

// Exécuter si appelé directement
if (require.main === module) {
    main();
}

export { extractCartesAvecImages, saveCartesDataAvecImages };
