"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
function debugBelierFaq() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const url = 'https://www.esteban-frederic.fr/astrologie-signe-belier/';
            console.log(`Debugging: ${url}`);
            const response = yield axios_1.default.get(url);
            const $ = cheerio.load(response.data);
            // Recherche des questions FAQ
            $('h3').each((index, element) => {
                const questionText = $(element).text().trim();
                if (questionText && questionText.includes('?')) {
                    console.log(`\n=== FAQ ${index + 1} ===`);
                    console.log(`Question: "${questionText}"`);
                    // Récupérer le contenu suivant
                    let answerHtml = '';
                    let currentElement = $(element).next();
                    let elementCount = 0;
                    console.log(`Starting from next element after h3...`);
                    while (currentElement.length > 0 && elementCount < 10) {
                        const tagName = currentElement.prop('tagName') || '';
                        console.log(`  Element ${elementCount}: ${tagName} - "${currentElement.text().trim().substring(0, 100)}..."`);
                        if (['H2', 'H3'].includes(tagName)) {
                            console.log(`  -> Stopping at ${tagName}`);
                            break;
                        }
                        if (['P', 'UL', 'OL', 'DIV'].includes(tagName)) {
                            const elementHtml = $.html(currentElement);
                            answerHtml += elementHtml;
                            console.log(`  -> Added ${tagName}: ${elementHtml.length} chars`);
                        }
                        currentElement = currentElement.next();
                        elementCount++;
                    }
                    console.log(`Total answer HTML length: ${answerHtml.length}`);
                    if (answerHtml.trim()) {
                        console.log(`Answer preview: ${answerHtml.substring(0, 200)}...`);
                    }
                    else {
                        console.log(`No answer content found!`);
                    }
                    // Limiter à 3 FAQ pour le debug
                    if (index >= 2)
                        return false;
                }
            });
        }
        catch (error) {
            console.error('Error:', error);
        }
    });
}
// Exécuter le debug
if (require.main === module) {
    debugBelierFaq();
}
