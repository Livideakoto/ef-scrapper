// src/test-download-image.ts
import axios from "axios";
const cheerio = require("cheerio");
import fs from "fs";
import path from "path";

async function testImageDownload() {
    const testUrl = "https://www.esteban-frederic.fr/carte-homme/";
    const imageFolder = path.join(__dirname, "../data/images");
    
    if (!fs.existsSync(imageFolder)) {
        fs.mkdirSync(imageFolder, { recursive: true });
    }
    
    try {
        console.log("🧪 Test de téléchargement d'image pour:", testUrl);
        
        const response = await axios.get(testUrl, {
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        
        const $ = cheerio.load(response.data);
        
        console.log("\n🔍 Recherche d'images...");
        
        // Analyser toutes les images trouvées
        $('img').each((index: any, element: any) => {
            const src = $(element).attr('src');
            const dataSrc = $(element).attr('data-src');
            const alt = $(element).attr('alt');
            const className = $(element).attr('class');
            
            console.log(`\nImage ${index + 1}:`);
            console.log(`  src: ${src || 'N/A'}`);
            console.log(`  data-src: ${dataSrc || 'N/A'}`);
            console.log(`  alt: ${alt || 'N/A'}`);
            console.log(`  class: ${className || 'N/A'}`);
        });
        
        // Rechercher spécifiquement les images de cartes
        console.log("\n🎯 Recherche d'images de cartes...");
        
        // Rechercher dans le HTML brut
        const htmlContent = response.data;
        const imagePatterns = [
            /data-src="([^"]*[Cc]arte[^"]*)"/g,
            /src="([^"]*[Cc]arte[^"]*)"/g,
            /data-lazy-src="([^"]*[Cc]arte[^"]*)"/g,
            /"([^"]*\.(?:jpg|jpeg|png|gif|webp)[^"]*)"/g
        ];
        
        imagePatterns.forEach((pattern, index) => {
            console.log(`\nPattern ${index + 1}: ${pattern}`);
            let match;
            let count = 0;
            while ((match = pattern.exec(htmlContent)) !== null && count < 5) {
                console.log(`  Trouvé: ${match[1]}`);
                count++;
            }
        });
        
        // Tenter de télécharger la première image valide trouvée
        const firstImg = $('img').first();
        let imageUrl = firstImg.attr('src') || firstImg.attr('data-src');
        
        if (imageUrl && !imageUrl.includes('data:image')) {
            if (imageUrl.startsWith('/')) {
                imageUrl = 'https://www.esteban-frederic.fr' + imageUrl;
            }
            
            console.log(`\n📸 Tentative de téléchargement: ${imageUrl}`);
            
            try {
                const imageResponse = await axios.get(imageUrl, {
                    responseType: 'stream',
                    timeout: 10000
                });
                
                const fileName = 'test-carte-homme.jpg';
                const filePath = path.join(imageFolder, fileName);
                const writer = fs.createWriteStream(filePath);
                
                imageResponse.data.pipe(writer);
                
                writer.on('finish', () => {
                    console.log(`✅ Image de test téléchargée: ${fileName}`);
                });
                
                writer.on('error', (error) => {
                    console.error(`❌ Erreur téléchargement:`, error);
                });
                
            } catch (error) {
                console.error(`❌ Erreur lors du téléchargement:`, error);
            }
        } else {
            console.log("❌ Aucune image valide trouvée pour le test");
        }
        
    } catch (error) {
        console.error("❌ Erreur lors du test:", error);
    }
}

if (require.main === module) {
    testImageDownload();
}
