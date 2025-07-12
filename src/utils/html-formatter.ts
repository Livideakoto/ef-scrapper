// src/utils/html-formatter.ts
export function formatHtmlContent(html: string): string {
    // Nettoie et formate le HTML
    return html
        .replace(/\n\s+/g, '') // Supprime les sauts de ligne et espaces
        .replace(/>\s+</g, '><') // Supprime les espaces entre balises
        .replace(/\s+/g, ' ') // Remplace plusieurs espaces par un seul
        .trim();
}

export function beautifyHtmlContent(html: string): string {
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