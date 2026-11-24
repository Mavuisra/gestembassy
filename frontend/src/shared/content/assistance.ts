/**
 * Orientation assistance consulaire cadre général des missions diplomatiques
 * et informations publiées pour l'Ambassade RDC à Séoul.
 * Urgences locales Corée : 112 (police) / 119 (secours / incendie / médical).
 */

export const ASSISTANCE_CASES = [
 {
 key: "arrest",
 titleFr: "Arrestation ou détention",
 titleEn: "Arrest or detention",
 titleKo: "체포·구금",
 bodyFr:
 "Demandez aux autorités locales de prévenir l'Ambassade. Le poste peut, avec votre accord, informer vos proches et orienter vers un avocat. Il ne se substitue pas à la justice locale.",
 bodyEn:
 "Ask local authorities to notify the Embassy. With your consent, the mission may inform relatives and help you find a lawyer. It does not replace local justice.",
 bodyKo:
 "현지 당국에 대사관 통보를 요청하세요. 동의 시 가족 연락 및 변호사 안내가 가능합니다. 현지 사법 절차를 대신하지 않습니다.",
 },
 {
 key: "passportLoss",
 titleFr: "Perte ou vol de passeport",
 titleEn: "Lost or stolen passport",
 titleKo: "여권 분실·도난",
 bodyFr:
 "Déclarez le vol à la police locale, conservez le procès-verbal, puis contactez l'Ambassade. Un laissez-passer peut être délivré pour un retour unique en RDC si le passeport est expiré ou volé.",
 bodyEn:
 "Report theft to local police, keep the report, then contact the Embassy. A laissez-passer may be issued for a single return trip to the DRC if the passport is expired or stolen.",
 bodyKo:
 "도난은 현지 경찰에 신고하고 확인서를 보관한 뒤 대사관에 연락하세요. 여권 만료·도난 시 콩고 귀국용 통과증이 발급될 수 있습니다.",
 },
 {
 key: "hospital",
 titleFr: "Hospitalisation / accident",
 titleEn: "Hospitalisation / accident",
 titleKo: "입원·사고",
 bodyFr:
 "Appelez d'abord le 119. Informez ensuite l'Ambassade pour un suivi et, le cas échéant, la liaison avec la famille.",
 bodyEn:
 "Call 119 first. Then inform the Embassy for follow-up and, if needed, contact with family.",
 bodyKo:
 "먼저 119에 연락한 뒤, 필요 시 가족 연락을 위해 대사관에 알리세요.",
 },
 {
 key: "death",
 titleFr: "Décès",
 titleEn: "Death",
 titleKo: "사망",
 bodyFr:
 "L'Ambassade accompagne les proches dans les formalités administratives et oriente vers les autorités compétentes.",
 bodyEn:
 "The Embassy assists relatives with administrative formalities and refers them to the competent authorities.",
 bodyKo:
 "대사관은 행정 절차에서 유족을 돕고 관할 당국으로 안내합니다.",
 },
 {
 key: "legal",
 titleFr: "Orientation juridique",
 titleEn: "Legal guidance",
 titleKo: "법률 안내",
 bodyFr:
 "Informations générales et orientation vers des professionnels locaux. Les frais d'avocat restent à la charge du ressortissant.",
 bodyEn:
 "General information and referral to local professionals. Lawyer fees remain the national's responsibility.",
 bodyKo:
 "일반 안내 및 현지 전문가 소개. 변호사 비용은 본인 부담입니다.",
 },
 {
 key: "social",
 titleFr: "Situation de détresse",
 titleEn: "Distress situations",
 titleKo: "곤란 상황",
 bodyFr:
 "En cas de difficulté sociale grave, contactez l'Ambassade pour une orientation. L'enregistrement consulaire facilite le contact d'urgence.",
 bodyEn:
 "In serious social difficulty, contact the Embassy for guidance. Consular registration helps emergency contact.",
 bodyKo:
 "심각한 곤란 시 대사관에 안내를 요청하세요. 영사 등록은 긴급 연락에 도움이 됩니다.",
 },
] as const;

export const ASSISTANCE_LIMITS = {
 fr: {
 can: [
 "Être contacté et assurer un suivi humanitaire dans la mesure du possible",
 "Informer la famille avec l'accord de l'intéressé",
 "Orienter vers un avocat ou des services locaux",
 "Accompagner les démarches de documents de voyage d'urgence (laissez-passer)",
 ],
 cannot: [
 "Obtenir la libération d'un détenu ou intervenir dans la procédure judiciaire",
 "Assurer la défense en justice (rôle exclusif d'un avocat)",
 "Prendre en charge les frais (avocat, amendes, hôpital, billet)",
 "Se porter garant ou caution",
 ],
 },
 en: {
 can: [
 "Be contacted and provide humanitarian follow-up where possible",
 "Inform family with the person's consent",
 "Refer to a lawyer or local services",
 "Support emergency travel-document procedures (laissez-passer)",
 ],
 cannot: [
 "Secure a detainee's release or intervene in judicial proceedings",
 "Provide legal defence (exclusive role of a lawyer)",
 "Cover costs (lawyer, fines, hospital, tickets)",
 "Act as guarantor or surety",
 ],
 },
 ko: {
 can: [
 "연락을 받고 가능한 범위에서 인도적 지원·후속 조치",
 "본인 동의 시 가족에게 통보",
 "변호사 또는 현지 기관 안내",
 "긴급 여행서류(통과증) 절차 지원",
 ],
 cannot: [
 "구금자 석방 확보 또는 사법 절차 개입",
 "법정 변호(변호사 전담)",
 "비용 부담(변호사, 벌금, 병원, 항공권)",
 "보증인 역할",
 ],
 },
} as const;
