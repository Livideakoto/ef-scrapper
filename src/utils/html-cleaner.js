"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanHtmlContent = cleanHtmlContent;
exports.formatFaqContent = formatFaqContent;
// src/utils/html-cleaner.ts
function cleanHtmlContent(content) {
    // Nettoie les balises HTML excessives et les espaces
    return content
        .replace(/\n\s+/g, '\n') // Supprime les espaces en début de ligne
        .replace(/>\s+</g, '><') // Supprime les espaces entre balises
        .replace(/\s+/g, ' ') // Remplace plusieurs espaces par un seul
        .replace(/\s+"/g, '"') // Supprime les espaces avant les guillemets
        .replace(/"\s+/g, '"') // Supprime les espaces après les guillemets
        .replace(/<div>\s*<div>/g, '<div>') // Supprime les divs imbriquées vides
        .replace(/<\/div>\s*<\/div>/g, '</div>') // Supprime les divs imbriquées vides
        .trim();
}
function formatFaqContent(content) {
    // Formatage spécifique pour le contenu FAQ
    const cleaned = cleanHtmlContent(content);
    // Remplace les h4 par des h3 dans le contenu
    const formatted = cleaned.replace(/<h4>/g, '<h3>').replace(/<\/h4>/g, '</h3>');
    return formatted;
}
