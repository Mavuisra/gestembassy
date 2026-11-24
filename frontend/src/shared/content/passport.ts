/**
 * Passeport biométrique sources croisées :
 * - Ambassade RDC Séoul (congokoreaembassy.com service passeport)
 * - MAE RDC : diplomatie.gouv.cd / FAQ nouveau passeport (mai 2025)
 * - Portail national : passeport.gouv.cd ; NIF : e-nif / app.dgirdc.cd
 * Tarif Séoul (99 USD) et modalités nationales (75 USD) : confirmer auprès du service consulaire.
 */

export const PASSPORT_PORTALS = {
 national: "https://www.passeport.gouv.cd",
 nif: "https://app.dgirdc.cd/e-nif",
 maeFaq: "https://diplomatie.gouv.cd/foire-aux-questions/",
} as const;

export const PASSPORT_TARIFF_SEOUL = {
 amount: "99,00 USD",
 labelFr: "Passeport biométrique Ambassade à Séoul",
 labelEn: "Biometric passport Embassy in Seoul",
 labelKo: "생체인식 여권 서울 대사관",
} as const;

export const PASSPORT_DOCS = [
 {
 key: "form",
 fr: "Formulaire de demande de passeport dûment rempli (en ligne, puis dépôt en personne).",
 en: "Completed passport application form (online, then in-person filing).",
 ko: "여권 신청서 작성 완료 (온라인 작성 후 직접 제출).",
 },
 {
 key: "bio",
 fr: "Copie du passeport actuel ou précédent (page BIO uniquement).",
 en: "Copy of the current or previous passport (bio page only).",
 ko: "현행 또는 이전 여권 사본 (인적사항 페이지만).",
 },
 {
 key: "loss",
 fr: "En cas de perte ou de vol : rapport de police écrit, ou copie de l'acte de naissance.",
 en: "If lost or stolen: written police report, or a copy of the birth certificate.",
 ko: "분실·도난 시: 경찰 신고서 또는 출생증명서 사본.",
 },
 {
 key: "photos",
 fr: "Deux photos d'identité (2″ × 2″) prises au cours des six derniers mois.",
 en: "Two identity photos (2″ × 2″) taken within the last six months.",
 ko: "최근 6개월 이내 촬영한 증명사진 2매 (2″ × 2″).",
 },
 {
 key: "residence",
 fr: "Preuve de résidence en République de Corée (carte de résidence, visa d'études D-2 / D-4, permis de travail ou autorisation d'emploi).",
 en: "Proof of residence in the Republic of Korea (residence card, student visa D-2 / D-4, work permit or employment authorization).",
 ko: "대한민국 체류 증명 (거주카드, D-2/D-4 유학비자, 취업허가 등).",
 },
] as const;

export const PASSPORT_STEPS = [
 {
 key: "prepare",
 titleFr: "Préparer le dossier",
 titleEn: "Prepare the file",
 titleKo: "서류 준비",
 bodyFr:
 "Réunissez le formulaire, la page BIO, les photos et la preuve de résidence. En cas de perte, ajoutez le procès-verbal de police ou l'acte de naissance.",
 bodyEn:
 "Gather the form, bio page, photos and proof of residence. If lost, add the police report or birth certificate.",
 bodyKo:
 "신청서, 인적사항 페이지, 사진, 체류증명을 준비하십시오. 분실 시 경찰 신고서 또는 출생증명서를 추가합니다.",
 },
 {
 key: "person",
 titleFr: "Dépôt en personne",
 titleEn: "In-person filing",
 titleKo: "직접 제출",
 bodyFr:
 "Toute demande de passeport se fait obligatoirement en personne à l'Ambassade de la RDC à Séoul (Yongsan). Aucune procédure entièrement à distance n'est publiée.",
 bodyEn:
 "All passport applications must be filed in person at the DRC Embassy in Seoul (Yongsan). No fully remote procedure is published.",
 bodyKo:
 "모든 여권 신청은 서울(용산) 주한 콩고민주공화국 대사관에 직접 제출해야 합니다. 완전 비대면 절차는 공지되어 있지 않습니다.",
 },
 {
 key: "biometrics",
 titleFr: "Contrôle et biométrie",
 titleEn: "Checks and biometrics",
 titleKo: "확인 및 생체정보",
 bodyFr:
 "Le service consulaire vérifie les pièces. Selon le dispositif national en vigueur, une capture biométrique (photo, empreintes) peut être requise à l'Ambassade ou via le circuit passeport.gouv.cd.",
 bodyEn:
 "The consular service checks your documents. Under the national scheme, biometric capture (photo, fingerprints) may be required at the Embassy or via passeport.gouv.cd.",
 bodyKo:
 "영사 부서가 서류를 확인합니다. 국가 절차에 따라 대사관 또는 passeport.gouv.cd를 통해 생체정보(사진·지문) 채취가 필요할 수 있습니다.",
 },
 {
 key: "collect",
 titleFr: "Retrait",
 titleEn: "Collection",
 titleKo: "수령",
 bodyFr:
 "Le délai dépend du volume des dossiers. Renseignez-vous auprès du service consulaire pour la date de retrait.",
 bodyEn:
 "Processing time depends on caseload. Check with the consular service for the collection date.",
 bodyKo:
 "처리 기간은 접수량에 따라 다릅니다. 수령일은 영사 부서에 문의하십시오.",
 },
] as const;

export const PASSPORT_NATIONAL = {
 fee: "75 USD",
 validityFr: "5 ans",
 validityEn: "5 years",
 validityKo: "5년",
 coexistenceFr:
 "Les passeports antérieurs restent utilisables jusqu'à leur date d'expiration ; coexistence annoncée jusqu'en 2030.",
 coexistenceEn:
 "Previous passports remain usable until their expiry date; coexistence announced until 2030.",
 coexistenceKo:
 "기존 여권은 만료일까지 사용 가능하며, 2030년까지 병행이 공지되어 있습니다.",
 notesFr: [
 "Obtenir un NIF (Numéro d'identification fiscale) via le portail e-NIF.",
 "Préinscription démographique sur passeport.gouv.cd (code QR et référence de paiement).",
 "Paiement des frais nationaux (75 USD) en ligne ou via Equity BCDC, selon le circuit publié.",
 "À l'étranger, les ressortissants s'adressent à l'ambassade ou au consulat du pays de résidence pour la suite (capture / dépôt).",
 ],
 notesEn: [
 "Obtain a TIN/NIF (tax identification number) via the e-NIF portal.",
 "Demographic pre-registration on passeport.gouv.cd (QR code and payment reference).",
 "Pay the national fee (USD 75) online or via Equity BCDC, as published.",
 "Abroad, nationals contact the embassy or consulate in their country of residence for capture / filing.",
 ],
 notesKo: [
 "e-NIF 포털에서 납세식별번호(NIF)를 발급받습니다.",
 "passeport.gouv.cd에서 인구통계 사전등록(QR 코드 및 납부 참조번호).",
 "국가 수수료(75 USD)를 온라인 또는 Equity BCDC로 납부합니다.",
 "해외에서는 거주국 대사관·영사관에서 채취/제출 절차를 진행합니다.",
 ],
} as const;
