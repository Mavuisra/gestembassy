/**
 * Orientation investissement sources publiques :
 * - ANAPI (anapi.cd) : Code des investissements, potentialités, incitations
 * - Primature RDC / AIM Congress 2025 : diversification
 * - Protocole ANAPI KOTRA (juin 2024, Séoul)
 * L'Ambassade oriente ; les procédures d'agrément relèvent de l'ANAPI / autorités compétentes.
 */

export const INVEST_LINKS = {
 anapi: "https://anapi.cd/",
 anapiPotentialites: "https://anapi.cd/potentialites",
 evisa: "https://evisa.gouv.cd/",
} as const;

export const INVEST_SECTORS = [
 {
 key: "mining",
 titleFr: "Mines et minerais critiques",
 titleEn: "Mining and critical minerals",
 titleKo: "광업·핵심 광물",
 bodyFr:
 "Cuivre, cobalt, lithium, coltan et or : secteurs majeurs d'intérêt pour les partenaires industriels, notamment dans les chaînes électriques et électroniques.",
 bodyEn:
 "Copper, cobalt, lithium, coltan and gold: key sectors for industrial partners, especially electric and electronics supply chains.",
 bodyKo:
 "구리, 코발트, 리튬, 콜탄, 금: 전기·전자 공급망 등 산업 파트너의 주요 관심 분야.",
 },
 {
 key: "energy",
 titleFr: "Énergie et électrification",
 titleEn: "Energy and electrification",
 titleKo: "에너지·전력화",
 bodyFr:
 "Potentiel hydroélectrique élevé (dont Inga), solaire et renouvelables. Priorité nationale pour l'industrialisation et l'électrification rurale.",
 bodyEn:
 "High hydropower potential (including Inga), solar and renewables. A national priority for industrialisation and rural electrification.",
 bodyKo:
 "높은 수력 잠재력(잉가 포함), 태양광·재생에너지. 산업화와 농촌 전력화의 국가 우선과제.",
 },
 {
 key: "infra",
 titleFr: "Infrastructures et BTP",
 titleEn: "Infrastructure and construction",
 titleKo: "인프라·건설",
 bodyFr:
 "Routes, ports, aéroports, ferroviaire, génie civil et logements pilier de la stratégie de diversification présentée par le Gouvernement.",
 bodyEn:
 "Roads, ports, airports, rail, civil engineering and housing a pillar of the Government's diversification strategy.",
 bodyKo:
 "도로, 항만, 공항, 철도, 토목, 주택 정부의 다각화 전략의 핵심 축.",
 },
 {
 key: "agriculture",
 titleFr: "Agriculture et agro-industrie",
 titleEn: "Agriculture and agribusiness",
 titleKo: "농업·농식품",
 bodyFr:
 "Vastes terres arables, pêche, élevage, stockage et transformation. Éligible au Code des investissements ; axe de diversification hors mines.",
 bodyEn:
 "Vast arable land, fisheries, livestock, storage and processing. Eligible under the Investment Code; a diversification priority beyond mining.",
 bodyKo:
 "광활한 경작지, 어업, 축산, 저장·가공. 투자법 적용 가능; 광업 외 다각화 축.",
 },
 {
 key: "tech",
 titleFr: "Numérique et services",
 titleEn: "Digital and services",
 titleKo: "디지털·서비스",
 bodyFr:
 "Programme « RDC Digital 2030 », télécoms, e-commerce, santé, éducation, transports et services industriels éligibles.",
 bodyEn:
 "“DRC Digital 2030” programme, telecoms, e-commerce, health, education, transport and eligible industrial services.",
 bodyKo:
 "「RDC Digital 2030」, 통신, 전자상거래, 보건, 교육, 운송 및 적격 산업 서비스.",
 },
 {
 key: "tourism",
 titleFr: "Tourisme et industries culturelles",
 titleEn: "Tourism and cultural industries",
 titleKo: "관광·문화산업",
 bodyFr:
 "Aménagements touristiques, hôtellerie et industries culturelles (livre, cinéma, audiovisuel) figurent parmi les secteurs éligibles à l'ANAPI.",
 bodyEn:
 "Tourism development, hospitality and cultural industries (publishing, film, audiovisual) are among ANAPI-eligible sectors.",
 bodyKo:
 "관광 개발, 호텔, 문화산업(출판·영화·영상)은 ANAPI 적격 분야에 포함됩니다.",
 },
] as const;

export const INVEST_INCENTIVES = {
 fr: {
 title: "Cadre d'incitations (ANAPI)",
 items: [
 "Code des investissements (loi n°004/2002) : exonérations douanières et fiscales pour projets agréés.",
 "Avantages douaniers : exonération des droits à l'importation d'équipements et matériels (sous conditions).",
 "Avantages fiscaux : exonération de l'impôt sur les bénéfices et profits (IBP) et de l'impôt foncier pendant la durée d'agrément.",
 "Durée selon la région économique : 3 ans (A Kinshasa), 4 ans (B), 5 ans (C reste du pays).",
 "Seuil indicatif d'investissement : à partir de 200 000 USD (10 000 USD pour PME/PMI), valeur ajoutée ≥ 35 %.",
 "Frais de dépôt ANAPI (indicatif) : 1 000 USD (grande entreprise) / 500 USD (PME-PMI).",
 ],
 },
 en: {
 title: "Incentive framework (ANAPI)",
 items: [
 "Investment Code (Act No. 004/2002): customs and tax exemptions for approved projects.",
 "Customs benefits: exemption from import duties on equipment and materials (subject to conditions).",
 "Tax benefits: exemption from corporate income tax (IBP) and property tax for the approval period.",
 "Duration by economic region: 3 years (A Kinshasa), 4 years (B), 5 years (C rest of the country).",
 "Indicative investment threshold: from USD 200,000 (USD 10,000 for SMEs), value added ≥ 35%.",
 "ANAPI filing fees (indicative): USD 1,000 (large company) / USD 500 (SME).",
 ],
 },
 ko: {
 title: "인센티브 체계 (ANAPI)",
 items: [
 "투자법(법률 제004/2002호): 승인 프로젝트에 대한 관세·세제 면제.",
 "관세 혜택: 설비·기자재 수입 관세 면제(조건 적용).",
 "세제 혜택: 승인 기간 동안 법인세(IBP) 및 재산세 면제.",
 "경제권역별 기간: A(킨샤사) 3년, B 4년, C(기타) 5년.",
 "투자 규모 안내: 20만 USD 이상(중소기업 1만 USD), 부가가치 ≥ 35%.",
 "ANAPI 접수비(안내): 대기업 1,000 USD / 중소기업 500 USD.",
 ],
 },
} as const;

export const INVEST_KOREA = {
 fr: {
 title: "Partenariat RDC République de Corée",
 body: "En juin 2024, l'ANAPI et la KOTRA ont signé à Séoul un protocole d'accord visant à favoriser les investissements, les échanges commerciaux et le transfert de savoir-faire. Les secteurs cités incluent l'agriculture, l'énergie, les infrastructures, l'éducation et les mines. L'Ambassade accompagne l'orientation des partenaires intéressés.",
 },
 en: {
 title: "DRC Republic of Korea partnership",
 body: "In June 2024, ANAPI and KOTRA signed a memorandum of understanding in Seoul to promote investment, trade and know-how transfer. Sectors cited include agriculture, energy, infrastructure, education and mining. The Embassy helps orient interested partners.",
 },
 ko: {
 title: "콩고 대한민국 파트너십",
 body: "2024년 6월 서울에서 ANAPI와 KOTRA가 투자·교역·노하우 이전을 위한 양해각서를 체결했습니다. 농업, 에너지, 인프라, 교육, 광업 등이 언급되었습니다. 대사관은 관심 파트너의 안내를 지원합니다.",
 },
} as const;
