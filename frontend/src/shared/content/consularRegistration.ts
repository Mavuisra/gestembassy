/**
 * Enregistrement / carte consulaire sources :
 * - Ambassade RDC Séoul : https://congokoreaembassy.com/?act=carteconsulaire&p=services
 * - Coordonnées : congokoreaembassy@gmail.com ; 73-1 Hoenamu-ro, Yongsan-gu
 * Liste détaillée des pièces non publiée sur la page Séoul confirmer au guichet.
 */

export const CONSULAR_REG_SOURCE =
 "https://congokoreaembassy.com/?act=carteconsulaire&p=services" as const;

export const CONSULAR_BENEFITS = [
 {
 key: "identity",
 titleFr: "Documents d'identité",
 titleEn: "Identity documents",
 titleKo: "신분 서류",
 bodyFr:
 "Facilite les démarches pour le passeport, la carte nationale d'identité et les attestations auprès de l'Ambassade.",
 bodyEn:
 "Makes it easier to process passport, national ID and certificates with the Embassy.",
 bodyKo:
 "대사관에서의 여권, 신분증, 증명서 절차를 원활하게 합니다.",
 },
 {
 key: "census",
 titleFr: "Recensement",
 titleEn: "Census / register",
 titleKo: "인구조사·등록",
 bodyFr:
 "Vous êtes inscrit au registre des Congolais établis en République de Corée.",
 bodyEn:
 "You are entered on the register of Congolese nationals established in the Republic of Korea.",
 bodyKo:
 "대한민국에 거주하는 콩고인 등록부에 등재됩니다.",
 },
 {
 key: "delay",
 titleFr: "Délais de traitement",
 titleEn: "Processing times",
 titleKo: "처리 기간",
 bodyFr:
 "Réduction des délais de traitement des documents à l'Ambassade lorsque le dossier est déjà connu.",
 bodyEn:
 "Shorter processing times at the Embassy when your file is already on record.",
 bodyKo:
 "이미 등록된 경우 대사관 서류 처리 기간이 단축됩니다.",
 },
 {
 key: "info",
 titleFr: "Information",
 titleEn: "Information",
 titleKo: "정보 안내",
 bodyFr:
 "Les services consulaires peuvent vous communiquer des informations (élections, sécurité, événements particuliers).",
 bodyEn:
 "Consular services can send you information (elections, security, special events).",
 bodyKo:
 "영사 부서가 선거, 안전, 특별 행사 등의 정보를 안내할 수 있습니다.",
 },
 {
 key: "emergency",
 titleFr: "Urgence",
 titleEn: "Emergency",
 titleKo: "긴급 상황",
 bodyFr:
 "En cas d'urgence, l'Ambassade peut vous contacter, ainsi que vos proches, plus rapidement.",
 bodyEn:
 "In an emergency, the Embassy can reach you and your relatives more quickly.",
 bodyKo:
 "긴급 시 대사관이 본인과 가족에게 더 빠르게 연락할 수 있습니다.",
 },
] as const;

export const CONSULAR_STEPS = [
 {
 key: "eligibility",
 titleFr: "Vérifier l'éligibilité",
 titleEn: "Check eligibility",
 titleKo: "대상 확인",
 bodyFr:
 "L'inscription concerne tout Congolais qui s'établit pour plus de six mois en République de Corée. Elle est vivement recommandée.",
 bodyEn:
 "Registration concerns any Congolese national establishing themselves for more than six months in the Republic of Korea. It is strongly recommended.",
 bodyKo:
 "대한민국에 6개월 이상 정착하는 모든 콩고 국민이 대상이며, 강력히 권장됩니다.",
 },
 {
 key: "online",
 titleFr: "Formulaire en ligne",
 titleEn: "Online form",
 titleKo: "온라인 양식",
 bodyFr:
 "Remplissez le formulaire de demande en ligne en vous connectant avec votre adresse e-mail et un mot de passe (procédure publiée par l'Ambassade).",
 bodyEn:
 "Complete the online application form by signing in with your email address and a password (procedure published by the Embassy).",
 bodyKo:
 "이메일과 비밀번호로 로그인하여 온라인 신청서를 작성합니다(대사관 공지 절차).",
 },
 {
 key: "follow",
 titleFr: "Suivi auprès de l'Ambassade",
 titleEn: "Follow-up with the Embassy",
 titleKo: "대사관 후속 절차",
 bodyFr:
 "Présentez-vous ou contactez le service consulaire selon les instructions du formulaire pour finaliser l'enregistrement et obtenir la carte / confirmation.",
 bodyEn:
 "Appear in person or contact the consular service as instructed on the form to complete registration and obtain the card / confirmation.",
 bodyKo:
 "양식 안내에 따라 영사 부서에 방문하거나 연락하여 등록을 완료하고 카드/확인을 받습니다.",
 },
] as const;

/** Pièces typiques non listées en détail sur la page Séoul ; à confirmer. */
export const CONSULAR_DOCS_PROVISIONAL = [
 {
 key: "passport",
 fr: "Passeport congolais valide (ou document d'identité) et copie.",
 en: "Valid Congolese passport (or identity document) and copy.",
 ko: "유효한 콩고 여권(또는 신분증) 및 사본.",
 },
 {
 key: "residence",
 fr: "Justificatif de séjour / résidence en République de Corée (carte de résidence, visa, etc.).",
 en: "Proof of stay / residence in the Republic of Korea (residence card, visa, etc.).",
 ko: "대한민국 체류·거주 증명(거주카드, 비자 등).",
 },
 {
 key: "address",
 fr: "Adresse de résidence en Corée et coordonnées de contact à jour.",
 en: "Residential address in Korea and up-to-date contact details.",
 ko: "한국 내 거주지 주소 및 최신 연락처.",
 },
 {
 key: "photos",
 fr: "Photographies d'identité récentes (format indiqué sur le formulaire).",
 en: "Recent identity photographs (format indicated on the form).",
 ko: "최근 증명사진(양식에 명시된 규격).",
 },
] as const;
