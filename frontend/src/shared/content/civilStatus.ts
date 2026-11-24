/**
 * État civil & légalisations Ambassade RDC Séoul.
 * Source principale : https://congokoreaembassy.com/?act=autres&p=services
 * Pièces indicatives croisées (missions RDC Benelux / Madrid) tarifs Séoul à confirmer.
 */

export const CIVIL_SOURCE = "https://congokoreaembassy.com/?act=autres&p=services" as const;

export const CIVIL_DOCUMENT_TYPES = [
 "composition_familiale",
 "certificat_mariage",
 "certificat_nationalite",
 "attestation_naissance",
 "certificat_deces",
 "certificat_celibat",
 "laissez_passer",
 "legalisation",
 "autre",
] as const;

export type CivilDocumentType = (typeof CIVIL_DOCUMENT_TYPES)[number];

export const CIVIL_SERVICES = [
 {
 key: "composition_familiale",
 titleFr: "Composition familiale",
 titleEn: "Family composition",
 titleKo: "가족관계 증명",
 bodyFr:
 "Attestation de composition familiale / ménage pour les ressortissants relevant de la juridiction de l'Ambassade.",
 bodyEn:
 "Family composition / household certificate for nationals under the Embassy's jurisdiction.",
 bodyKo: "대사관 관할 국민을 위한 가족관계·세대 증명.",
 docsFr: [
 "Copie du passeport",
 "Justificatif de séjour ou de domicile en Corée",
 "Actes de naissance des enfants (le cas échéant)",
 "Acte de mariage ou attestation de monogamie (le cas échéant)",
 ],
 docsEn: [
 "Passport copy",
 "Proof of stay or residence in Korea",
 "Children's birth certificates (if applicable)",
 "Marriage certificate or monogamy attestation (if applicable)",
 ],
 docsKo: [
 "여권 사본",
 "한국 체류·거주 증명",
 "자녀 출생증명서(해당 시)",
 "혼인증명 또는 일부일처 증명(해당 시)",
 ],
 provisionalDocs: true,
 },
 {
 key: "certificat_mariage",
 titleFr: "Certificat de mariage",
 titleEn: "Marriage certificate",
 titleKo: "혼인증명서",
 bodyFr: "Certificat ou attestation de mariage délivré par le service consulaire.",
 bodyEn: "Marriage certificate or attestation issued by the consular service.",
 bodyKo: "영사 부서가 발급하는 혼인증명·확인서.",
 docsFr: [
 "Copie du passeport",
 "Justificatif de séjour / domicile",
 "Éléments relatifs au mariage (acte, témoins) selon le dossier",
 ],
 docsEn: [
 "Passport copy",
 "Proof of stay / residence",
 "Marriage-related documents (act, witnesses) as required",
 ],
 docsKo: ["여권 사본", "체류·거주 증명", "혼인 관련 서류(해당 시)"],
 provisionalDocs: true,
 },
 {
 key: "certificat_nationalite",
 titleFr: "Certificat de nationalité",
 titleEn: "Nationality certificate",
 titleKo: "국적증명서",
 bodyFr: "Attestation de nationalité congolaise.",
 bodyEn: "Congolese nationality attestation.",
 bodyKo: "콩고 국적 증명.",
 docsFr: ["Copie du passeport congolais", "Justificatif de séjour en Corée"],
 docsEn: ["Congolese passport copy", "Proof of stay in Korea"],
 docsKo: ["콩고 여권 사본", "한국 체류 증명"],
 provisionalDocs: true,
 },
 {
 key: "attestation_naissance",
 titleFr: "Attestation / certificat de naissance",
 titleEn: "Birth attestation / certificate",
 titleKo: "출생증명·확인서",
 bodyFr: "Attestation tenant lieu d'acte de naissance ou actualisation.",
 bodyEn: "Attestation standing in for a birth certificate, or update.",
 bodyKo: "출생증명에 갈음하는 확인서 또는 갱신.",
 docsFr: [
 "Copie du passeport",
 "Justificatif de séjour ou de domicile",
 "Copie de l'acte / attestation de naissance antérieure (si actualisation)",
 ],
 docsEn: [
 "Passport copy",
 "Proof of stay or residence",
 "Copy of previous birth act / attestation (if updating)",
 ],
 docsKo: ["여권 사본", "체류·거주 증명", "기존 출생증명·확인서 사본(갱신 시)"],
 provisionalDocs: true,
 },
 {
 key: "certificat_deces",
 titleFr: "Certificat de décès",
 titleEn: "Death certificate",
 titleKo: "사망증명서",
 bodyFr: "Certificat ou attestation relative à un décès, selon le dossier.",
 bodyEn: "Death-related certificate or attestation, case by case.",
 bodyKo: "사망 관련 증명·확인서(사안별).",
 docsFr: ["Pièces d'identité", "Éléments relatifs au décès selon les instructions du service"],
 docsEn: ["Identity documents", "Death-related evidence as instructed by the service"],
 docsKo: ["신분 서류", "영사 안내의 사망 관련 증빙"],
 provisionalDocs: true,
 },
 {
 key: "certificat_celibat",
 titleFr: "Certificat de célibat",
 titleEn: "Certificate of celibacy / single status",
 titleKo: "미혼증명서",
 bodyFr: "Attestation de célibat, de non-mariage ou de non-remariage.",
 bodyEn: "Celibacy / non-marriage / non-remarriage attestation.",
 bodyKo: "미혼·비혼·재혼하지 않음 증명.",
 docsFr: [
 "Copie du passeport congolais",
 "Justificatif de séjour / domicile",
 "Copie de l'acte de naissance",
 "Déclaration sur l'honneur d'un proche (souvent exigée ailleurs) confirmer à Séoul",
 ],
 docsEn: [
 "Congolese passport copy",
 "Proof of stay / residence",
 "Birth certificate copy",
 "Sworn statement by a relative (often required elsewhere) confirm in Seoul",
 ],
 docsKo: [
 "콩고 여권 사본",
 "체류·거주 증명",
 "출생증명서 사본",
 "친족 서약서(타 공관에서 자주 요구) 서울에서 확인",
 ],
 provisionalDocs: true,
 },
 {
 key: "laissez_passer",
 titleFr: "Laissez-passer / tenant lieu de passeport",
 titleEn: "Laissez-passer / emergency travel document",
 titleKo: "통과증 / 여권 대용",
 bodyFr:
 "Délivré uniquement aux Congolais dont le passeport a expiré ou a été volé et qui désirent se rendre en RDC. Valable pour un seul voyage.",
 bodyEn:
 "Issued only to Congolese nationals whose passport has expired or been stolen and who wish to travel to the DRC. Valid for a single journey.",
 bodyKo:
 "여권이 만료되었거나 도난당한 뒤 콩고로 귀국하려는 콩고 국민에게만 발급. 편도 1회만 유효.",
 docsFr: [
 "Déclaration de perte / vol (police) si applicable",
 "Ancien passeport ou éléments d'identité",
 "Preuve du projet de voyage vers la RDC",
 ],
 docsEn: [
 "Police loss/theft report if applicable",
 "Former passport or identity evidence",
 "Proof of intended travel to the DRC",
 ],
 docsKo: ["분실·도난 경찰 신고서(해당 시)", "이전 여권 또는 신분 증빙", "콩고 귀국 여행 증빙"],
 provisionalDocs: false,
 },
 {
 key: "legalisation",
 titleFr: "Légalisation de documents",
 titleEn: "Document legalisation",
 titleKo: "서류 공증·인증",
 bodyFr:
 "Légalisation de documents pour les citoyens relevant de la juridiction de l'Ambassade. Présentez l'original et une copie.",
 bodyEn:
 "Legalisation of documents for nationals under the Embassy's jurisdiction. Bring the original and a copy.",
 bodyKo: "대사관 관할 국민 대상 서류 인증. 원본과 사본을 지참하십시오.",
 docsFr: [
 "Original du document à légaliser",
 "Copie du document",
 "Copie du passeport ou du titre de séjour",
 ],
 docsEn: [
 "Original document to legalise",
 "Copy of the document",
 "Passport or residence title copy",
 ],
 docsKo: ["인증할 서류 원본", "서류 사본", "여권 또는 체류증 사본"],
 provisionalDocs: true,
 },
] as const;
