/**
 * Module 7.3 — Bourses & coopération universitaire RDC–Corée.
 * Données issues de Study in Korea / NIIED, KOICA CIAT et annonces publiques.
 * Quotas et calendriers changent chaque année : vérifier les sites officiels.
 */

export const SCHOLARSHIP_LINKS = {
 studyInKorea: "https://www.studyinkorea.go.kr/",
 gks: "https://www.studyinkorea.go.kr/en/plan/scholarship.do?tab=gks-tab1",
 koica: "https://www.koica.go.kr/",
 koicaCiat: "https://www.koica.go.kr/ciat/7815/subview.do",
} as const;

export const SCHOLARSHIP_PROGRAMS = [
 {
 key: "gks",
 titleFr: "Global Korea Scholarship (GKS) — NIIED",
 titleEn: "Global Korea Scholarship (GKS) — NIIED",
 titleKo: "글로벌 코리아 장학금(GKS) — NIIED",
 bodyFr:
 "Bourse du Gouvernement de la République de Corée (NIIED), présentée sur Study in Korea. Deux voies principales : Embassy Track (via l'ambassade/consulat de Corée du pays) et University Track (candidature auprès d'une université coréenne participante). Pour la RDC, les lignes directrices GKS-G ont prévu un quota Embassy Track graduate (ex. 2 places sur le cycle documenté) ; les quotas undergraduate évoluent chaque année. Candidature en ligne sur studyinkorea.go.kr selon le calendrier publié.",
 bodyEn:
 "Scholarship of the Government of the Republic of Korea (NIIED), presented on Study in Korea. Two main routes: Embassy Track (via the Korean embassy/consulate in your country) and University Track (apply to a participating Korean university). For the DRC, GKS-G guidelines have listed a graduate Embassy Track quota (e.g. 2 places in the documented cycle); undergraduate quotas change yearly. Apply online at studyinkorea.go.kr per the published calendar.",
 bodyKo:
 "대한민국 정부(NIIED) 장학금으로 Study in Korea에 안내됩니다. 주요 경로 2가지: Embassy Track(자국 한국 대사관·영사관)과 University Track(참여 한국 대학 직접 지원). 콩고민주공화국은 GKS 대학원 Embassy Track 쿼터가 안내된 바 있으며(문서화된 주기에 예: 2석), 학부 쿼터는 매년 달라집니다. studyinkorea.go.kr에서 공고 일정에 따라 온라인 지원하세요.",
 },
 {
 key: "koica",
 titleFr: "KOICA Scholarship Program (CIAT)",
 titleEn: "KOICA Scholarship Program (CIAT)",
 titleKo: "KOICA 장학금 프로그램(CIAT)",
 bodyFr:
 "Programme de l'Agence coréenne de coopération internationale pour cadres / agents du secteur public des pays partenaires (dont la RDC). Master (durée type ~17 mois) ou doctorat (~36 mois) dans des universités coréennes. Nomination officielle du gouvernement / hiérarchie requise ; dépôt via le bureau KOICA du pays (Kinshasa) ou les canaux indiqués. Prise en charge typique : scolarité, allocation, billet, logement universitaire, assurance (détails sur koica.go.kr / CIAT).",
 bodyEn:
 "Programme of the Korea International Cooperation Agency for public-sector officials from partner countries (including the DRC). Master's (typically ~17 months) or doctoral (~36 months) study at Korean universities. Official government / hierarchy nomination required; submit via the country KOICA office (Kinshasa) or the channels indicated. Typical coverage: tuition, stipend, airfare, dormitory, insurance (see koica.go.kr / CIAT).",
 bodyKo:
 "파트너국(콩고 포함) 공공 부문 인력을 위한 KOICA 프로그램. 한국 대학에서 석사(통상 ~17개월) 또는 박사(~36개월). 정부·소속 기관의 공식 추천이 필요하며, 현지 KOICA 사무소(킨샤사) 등 안내 채널로 제출합니다. 전형적 지원: 등록금, 생활비, 항공, 기숙사, 보험(koica.go.kr / CIAT 확인).",
 },
 {
 key: "tracks",
 titleFr: "Embassy Track vs University Track (GKS)",
 titleEn: "Embassy Track vs University Track (GKS)",
 titleKo: "GKS Embassy Track vs University Track",
 bodyFr:
 "Embassy Track : sélection locale puis recommandation à NIIED (pour la RDC, filtrage typiquement via l'Ambassade de Corée à Kinshasa — pas via l'Ambassade de la RDC à Séoul). University Track : dépôt direct auprès d'une université coréenne ; certains programmes (ex. UIC) peuvent être ouverts plus largement. Toujours lire les Application Guidelines de l'année en cours sur Study in Korea.",
 bodyEn:
 "Embassy Track: local screening then recommendation to NIIED (for the DRC, typically via the Korean Embassy in Kinshasa — not the DRC Embassy in Seoul). University Track: apply directly to a Korean university; some programmes (e.g. UIC) may be open more widely. Always read the current year's Application Guidelines on Study in Korea.",
 bodyKo:
 "Embassy Track: 현지 심사 후 NIIED 추천(콩고의 경우 보통 킨샤사 주재 한국 대사관 — 서울 주재 콩고 대사관이 아님). University Track: 한국 대학 직접 지원, 일부 프로그램(예: UIC)은 더 폭넓게 열릴 수 있습니다. 반드시 Study in Korea의 해당 연도 Application Guidelines를 확인하세요.",
 },
] as const;

export const SCHOLARSHIP_STEPS = {
 fr: {
 title: "Comment postuler (repères officiels)",
 items: [
 "Consulter Study in Korea (GKS) ou KOICA CIAT pour le calendrier et les guidelines de l'année.",
 "GKS : créer un compte et déposer le dossier en ligne sur studyinkorea.go.kr (Embassy Track) ou suivre la procédure de l'université (University Track).",
 "KOICA CIAT : obtenir la nomination institutionnelle, télécharger les formulaires sur le site CIAT, déposer au bureau KOICA RDC / canal indiqué avant la date limite du cycle.",
 "Vérifier nationalité, âge, diplômes, moyenne (CGPA) et documents exigés dans les guidelines NIIED / KOICA.",
 "L'Ambassade de la RDC à Séoul peut orienter la diaspora ; elle n'attribue pas les bourses GKS/KOICA à la place de NIIED ou de KOICA.",
 ],
 },
 en: {
 title: "How to apply (official landmarks)",
 items: [
 "Check Study in Korea (GKS) or KOICA CIAT for the year's calendar and guidelines.",
 "GKS: create an account and apply online at studyinkorea.go.kr (Embassy Track) or follow the university procedure (University Track).",
 "KOICA CIAT: secure institutional nomination, download forms from the CIAT site, submit to the KOICA DRC office / indicated channel before the cycle deadline.",
 "Verify nationality, age, degrees, GPA and required documents in the NIIED / KOICA guidelines.",
 "The DRC Embassy in Seoul can guide the diaspora; it does not award GKS/KOICA scholarships on behalf of NIIED or KOICA.",
 ],
 },
 ko: {
 title: "지원 방법(공식 기준)",
 items: [
 "해당 연도 일정·요강은 Study in Korea(GKS) 또는 KOICA CIAT에서 확인.",
 "GKS: studyinkorea.go.kr에서 계정 생성 후 온라인 지원(Embassy Track) 또는 대학 절차(University Track) 준수.",
 "KOICA CIAT: 기관 추천을 받고 CIAT 양식을 내려받아 주기 마감 전 KOICA 콩고 사무소 등 안내 채널에 제출.",
 "국적·연령·학위·평점(CGPA)·서류는 NIIED/KOICA 요강에서 확인.",
 "서울 주재 콩고 대사관은 교민 안내가 가능하나 NIIED·KOICA를 대신해 장학금을 수여하지 않습니다.",
 ],
 },
} as const;
