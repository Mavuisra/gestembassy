/**
 * Module 7.2 — Visiter la RDC.
 * Données issues de sources publiques officielles (à vérifier sur les sites cités).
 */

export const TOURISM_LINKS = {
 evisa: "https://evisa.gouv.cd/",
 evisaFaq: "https://evisa.gouv.cd/helps/faqs",
 ont: "https://www.officetourisme.cd/",
 iccn: "https://iccn.cd/aires-protegees/",
 unesco: "https://whc.unesco.org/fr/etatsparties/cd/",
 anapiTourism: "https://investindrc.cd/fr/Tourisme?lang=fr",
 dgm: "https://dgm.cd/",
} as const;

/** Sites UNESCO (naturels) — Centre du patrimoine mondial, État partie CD. */
export const UNESCO_SITES = [
 {
 key: "virunga",
 titleFr: "Parc national des Virunga",
 titleEn: "Virunga National Park",
 titleKo: "비룽가 국립공원",
 year: "1979",
 bodyFr:
 "Inscrit en 1979. Environ 790 000–800 000 ha : volcans actifs, savanes, forêts et massifs (dont Rwenzori). Refuge du gorille de montagne ; forte diversité d'habitats.",
 bodyEn:
 "Inscribed in 1979. About 790,000–800,000 ha: active volcanoes, savannas, forests and massifs (including the Rwenzori). Mountain gorilla habitat; outstanding habitat diversity.",
 bodyKo:
 "1979년 등재. 약 79–80만 ha: 활화산, 사바나, 숲, 산악(르웬조리 포함). 산악고릴라 서식지와 뛰어난 서식지 다양성.",
 },
 {
 key: "kahuzi",
 titleFr: "Parc national de Kahuzi-Biega",
 titleEn: "Kahuzi-Biega National Park",
 titleKo: "카후지비에가 국립공원",
 year: "1980",
 bodyFr:
 "Inscrit en 1980. Principal refuge du gorille de Grauer (plaine orientale), géré dans le réseau d'aires protégées de l'ICCN.",
 bodyEn:
 "Inscribed in 1980. Main refuge of Grauer's gorilla (eastern lowland), within the ICCN protected-area network.",
 bodyKo:
 "1980년 등재. 그라워 고릴라(동부 저지)의 주요 서식지. ICCN 보호지역 네트워크에 속합니다.",
 },
 {
 key: "garamba",
 titleFr: "Parc national de la Garamba",
 titleEn: "Garamba National Park",
 titleKo: "가람바 국립공원",
 year: "1980",
 bodyFr:
 "Inscrit en 1980. Savanes du nord-est ; historiquement associé à la conservation des grands mammifères (éléphants, girafes, rhinocéros selon les périodes).",
 bodyEn:
 "Inscribed in 1980. North-eastern savannas; historically linked to the conservation of large mammals (elephants, giraffes, rhinos depending on period).",
 bodyKo:
 "1980년 등재. 북동부 사바나. 대형 포유류(코끼리·기린·코뿔소 등, 시기에 따라) 보전과 연관됩니다.",
 },
 {
 key: "salonga",
 titleFr: "Parc national de la Salonga",
 titleEn: "Salonga National Park",
 titleKo: "살롱가 국립공원",
 year: "1984",
 bodyFr:
 "Inscrit en 1984. Plus vaste réserve de forêt tropicale humide du pays au patrimoine mondial ; bassin du Congo.",
 bodyEn:
 "Inscribed in 1984. The country's largest tropical rainforest reserve on the World Heritage List; Congo Basin.",
 bodyKo:
 "1984년 등재. 세계유산에 오른 국내 최대 열대우림 보호구역(콩고 분지).",
 },
 {
 key: "okapi",
 titleFr: "Réserve de faune à okapis",
 titleEn: "Okapi Wildlife Reserve",
 titleKo: "오카피 야생동물 보호구역",
 year: "1996",
 bodyFr:
 "Inscrite en 1996. Forêt dense du nord-est, connue pour l'okapi et une biodiversité forestière remarquable.",
 bodyEn:
 "Inscribed in 1996. Dense north-eastern forest, known for the okapi and remarkable forest biodiversity.",
 bodyKo:
 "1996년 등재. 북동부 밀림. 오카피와 뛰어난 산림 생물다양성으로 유명합니다.",
 },
] as const;

export const TOURISM_HIGHLIGHTS = [
 {
 key: "ont",
 titleFr: "Office National du Tourisme (ONT)",
 titleEn: "National Tourism Office (ONT)",
 titleKo: "국가관광청(ONT)",
 bodyFr:
 "Organe officiel de promotion de la destination RDC (officetourisme.cd). Programme d'actions 2024-2028 : marketing destination, infrastructures, tourisme durable, formation et partenariats. Contact public indiqué : info@tourismerdc.cd — 16, Colonel Lukusa, Gombe / Kinshasa.",
 bodyEn:
 "Official body promoting the DRC as a destination (officetourisme.cd). 2024–2028 action programme: destination marketing, infrastructure, sustainable tourism, training and partnerships. Public contact listed: info@tourismerdc.cd — 16 Colonel Lukusa, Gombe / Kinshasa.",
 bodyKo:
 "콩고 관광 목적지 공식 홍보 기관(officetourisme.cd). 2024–2028 실행 계획: 마케팅, 인프라, 지속가능 관광, 교육·파트너십. 공개 연락처: info@tourismerdc.cd — 킨샤사 곰베, Colonel Lukusa 16.",
 },
 {
 key: "iccn",
 titleFr: "Aires protégées (ICCN)",
 titleEn: "Protected areas (ICCN)",
 titleKo: "보호지역(ICCN)",
 bodyFr:
 "Selon l'Institut congolais pour la conservation de la nature (ICCN) : 8 parcs nationaux, des dizaines de réserves et domaines de chasse, jardins botaniques et zoologiques. Accès et visites : conditions à confirmer auprès de l'ICCN / gestionnaires de site.",
 bodyEn:
 "According to the Congolese Institute for Nature Conservation (ICCN): 8 national parks, dozens of reserves and hunting domains, botanical and zoological gardens. Access and visits: confirm conditions with ICCN / site managers.",
 bodyKo:
 "콩고자연보전연구소(ICCN)에 따르면 국립공원 8곳, 다수의 보호·수렵구역, 식물원·동물원이 있습니다. 방문 조건은 ICCN/관리 기관에 확인하세요.",
 },
 {
 key: "biodiversity",
 titleFr: "Potentiel touristique (ANAPI)",
 titleEn: "Tourism potential (ANAPI)",
 titleKo: "관광 잠재력(ANAPI)",
 bodyFr:
 "Fiche ANAPI Tourisme : second massif de forêts tropicales au monde après l'Amazonie ; espèces emblématiques citées (gorille de montagne, okapi, bonobo, paon congolais) ; aires protégées représentant une part significative du territoire. Secteur identifié comme priorité de relance.",
 bodyEn:
 "ANAPI Tourism factsheet: second-largest tropical forest massif after the Amazon; emblematic species cited (mountain gorilla, okapi, bonobo, Congo peafowl); protected areas cover a significant share of the territory. Tourism is listed as a recovery priority.",
 bodyKo:
 "ANAPI 관광 안내: 아마존 다음으로 큰 열대림 지대, 상징 종(산악고릴라·오카피·보노보·콩고공작), 넓은 보호지역. 관광은 재활성화 우선 분야로 제시됩니다.",
 },
 {
 key: "kinshasa",
 titleFr: "Kinshasa, porte d'entrée",
 titleEn: "Kinshasa as gateway",
 titleKo: "관문 도시 킨샤사",
 bodyFr:
 "L'ONT met en avant Kinshasa (culture, musique, fleuve Congo, créativité urbaine) comme capitale et point d'entrée stratégique pour les arrivées internationales.",
 bodyEn:
 "The ONT highlights Kinshasa (culture, music, Congo River, urban creativity) as the capital and a strategic gateway for international arrivals.",
 bodyKo:
 "ONT는 킨샤사(문화·음악·콩고강·도시 창의성)를 수도이자 국제 도착의 전략적 관문으로 강조합니다.",
 },
] as const;

/**
 * Synthèse e-visa d'après evisa.gouv.cd (DGM) — montants et règles peuvent changer :
 * toujours vérifier le portail avant toute demande.
 */
export const TOURISM_PRACTICAL = {
 fr: {
 title: "Formalités et préparation (sources officielles)",
 items: [
 "e-Visa (DGM) : portail officiel https://evisa.gouv.cd — démarche 100 % en ligne, analyse annoncée sous 72 h.",
 "Frais publiés sur le portail (à confirmer) : 50 USD de frais de dossier (non remboursables) + visa (ex. visa volant ordinaire 250 USD / 7 jours de séjour ; visa volant spécifique 800 USD / 30 jours).",
 "Après délivrance : e-visa à utiliser dans les 3 mois ; VAP (visa aéroportuaire) 7 jours, 1 entrée ; 90 USD payables au poste d'entrée selon la FAQ officielle.",
 "Public cible indiqué par la DGM : pays sans représentation diplomatique RDC, motifs affaires, visite et tourisme (détails sur le portail).",
 "Promotion destination : Office National du Tourisme — officetourisme.cd ; nature / parcs : ICCN et fiches UNESCO.",
 "Sécurité et santé : consulter les avis officiels de votre pays de résidence avant le départ.",
 "L'Ambassade à Séoul oriente ; les visas et le tourisme relèvent de la DGM, de l'ONT et des gestionnaires de sites.",
 ],
 },
 en: {
 title: "Formalities and preparation (official sources)",
 items: [
 "e-Visa (DGM): official portal https://evisa.gouv.cd — fully online; review announced within 72 hours.",
 "Fees published on the portal (verify before applying): USD 50 filing fee (non-refundable) + visa fee (e.g. ordinary flying visa USD 250 / 7-day stay; specific flying visa USD 800 / 30 days).",
 "After issuance: use the e-visa within 3 months; airport visa (VAP) 7 days, single entry; USD 90 payable at the entry point per the official FAQ.",
 "Eligibility noted by DGM: countries without a DRC diplomatic mission, business, visit and tourism (see portal for details).",
 "Destination promotion: National Tourism Office — officetourisme.cd; nature/parks: ICCN and UNESCO listings.",
 "Safety and health: check official advisories from your country of residence before travel.",
 "The Embassy in Seoul provides guidance; visas and tourism fall under DGM, ONT and site managers.",
 ],
 },
 ko: {
 title: "절차 및 준비(공식 출처)",
 items: [
 "e-Visa(DGM): 공식 포털 https://evisa.gouv.cd — 전 과정 온라인, 심사 안내 72시간.",
 "포털 게시 수수료(신청 전 재확인): 서류비 50 USD(환불 불가) + 비자비(예: 일반 250 USD/체류 7일, 특정 800 USD/체류 30일).",
 "발급 후: 3개월 내 사용, 공항 비자(VAP) 7일·1회 입국, 입국 시 90 USD(공식 FAQ).",
 "DGM이 안내하는 대상: 콩고 공관이 없는 국적, 비즈니스·방문·관광 등(상세는 포털).",
 "목적지 홍보: 국가관광청 officetourisme.cd / 자연·공원: ICCN·유네스코.",
 "안전·건강: 출국 전 거주국 공식 여행·보건 안내를 확인하세요.",
 "서울 대사관은 안내하며, 비자·관광은 DGM·ONT·현장 관리 기관 소관입니다.",
 ],
 },
} as const;
