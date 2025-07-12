"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatHtmlContent = formatHtmlContent;
exports.beautifyHtmlContent = beautifyHtmlContent;
// src/utils/html-formatter.ts
function formatHtmlContent(html) {
    // Nettoie et formate le HTML
    return html
        .replace(/\n\s+/g, '') // Supprime les sauts de ligne et espaces
        .replace(/>\s+</g, '><') // Supprime les espaces entre balises
        .replace(/\s+/g, ' ') // Remplace plusieurs espaces par un seul
        .trim();
}
function beautifyHtmlContent(html) {
    // Formate le HTML pour l'affichage (avec indentation)
    return html
        .replace(/><p>/g, '>\n    <p>')
        .replace(/><ul>/g, '>\n    <ul>')
        .replace(/><li>/g, '>\n        <li>')
        .replace(/<\/ul>/g, '\n    </ul>')
        .replace(/<\/div>/g, '\n</div>')
        .replace(/^<div>/, '<div>\n    ')
        .trim();
}
