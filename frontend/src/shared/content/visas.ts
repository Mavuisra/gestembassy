/**
 * Informations visas sources croisées :
 * - Ambassade RDC Séoul (congokoreaembassy.com / services visa)
 * - Portail e-Visa DGM : https://evisa.gouv.cd/
 * Tarifs Ambassade Séoul à confirmer auprès du service consulaire.
 */

export const VISA_TARIFFS_SEOUL = [
 {
 key: "month1",
 labelFr: "Séjour 1 mois procédure générale",
 labelEn: "1-month stay standard",
 labelKo: "1개월 일반",
 delayFr: "10 jours ouvrables",
 delayEn: "10 business days",
 delayKo: "영업일 10일",
 amount: "120 000 KRW",
 },
 {
 key: "month1x",
 labelFr: "Séjour 1 mois express",
 labelEn: "1-month stay express",
 labelKo: "1개월 급행",
 delayFr: "2 4 jours ouvrables",
 delayEn: "2 4 business days",
 delayKo: "영업일 2 4일",
 amount: "240 000 KRW",
 },
 {
 key: "multi3",
 labelFr: "Entrées multiples 3 mois générale",
 labelEn: "3-month multiple entry standard",
 labelKo: "3개월 복수 일반",
 delayFr: "10 jours ouvrables",
 delayEn: "10 business days",
 delayKo: "영업일 10일",
 amount: "360 000 KRW",
 },
 {
 key: "multi3x",
 labelFr: "Entrées multiples 3 mois express",
 labelEn: "3-month multiple entry express",
 labelKo: "3개월 복수 급행",
 delayFr: "2 4 jours ouvrables",
 delayEn: "2 4 business days",
 delayKo: "영업일 2 4일",
 amount: "720 000 KRW",
 },
 {
 key: "diplo",
 labelFr: "Passeports diplomatiques / officiels",
 labelEn: "Diplomatic / official passports",
 labelKo: "외교·공용 여권",
 delayFr: "Selon dossier",
 delayEn: "Case by case",
 delayKo: "서류에 따름",
 amount: "Gratuit",
 },
] as const;

export const VISA_NOTES = {
 fr: [
 "Les frais de demande de visa ne sont pas remboursables.",
 "Les demandes ne sont pas traitées plus de trois mois avant la date de voyage.",
 "Tous les documents doivent être rédigés en français ou en anglais.",
 "L'octroi du visa relève des autorités compétentes ; une pré-demande n'emporte aucune délivrance automatique.",
 ],
 en: [
 "Visa application fees are non-refundable.",
 "Applications are not processed more than three months before the travel date.",
 "All documents must be in French or English.",
 "Visa issuance is decided by the competent authorities; a pre-application does not guarantee a visa.",
 ],
 ko: [
 "비자 신청 수수료는 환불되지 않습니다.",
 "여행일 3개월 이전의 신청은 처리되지 않습니다.",
 "모든 서류는 프랑스어 또는 영어로 작성해야 합니다.",
 "비자 발급은 관할 당국의 결정이며, 사전 신청이 자동 발급을 의미하지 않습니다.",
 ],
} as const;

export const EVISA = {
 url: "https://evisa.gouv.cd/",
 feeFile: "50 USD",
 ordinary: "250 USD (7 jours)",
 specific: "800 USD (30 jours)",
} as const;
