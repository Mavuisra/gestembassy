/**
 * Images illustratives par article :
 * - commission : réunion diplomatique (Séoul)
 * - partenariat : skyline Yongsan / affaires
 * - bourses : amphithéâtre universitaire (Séoul)
 * - minerais : raffinerie cuivre Gécamines (RDC)
 * - portail : photo de la mission à Séoul
 */
export const NEWS_IMAGES: Record<string, string> = {
 "commission-mixte-rdc-coree-2025": "/images/news-commission.jpg",
 "protocole-anapi-kotra-juin-2024": "/images/news-partnership.jpg",
 "bourses-koica-ciat-gks": "/images/news-bourses.jpg",
 "cooperation-minerais-critiques": "/images/news-mines.jpg",
 "portail-numerique-ambassade": "/images/news-embassy.jpg",
};

export function newsImage(slug: string): string {
 return NEWS_IMAGES[slug] ?? "/images/news1.jpg";
}
