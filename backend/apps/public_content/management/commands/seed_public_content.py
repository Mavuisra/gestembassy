"""
Charge des contenus publics provisoires pour le développement.

Usage : python manage.py seed_public_content
"""

from __future__ import annotations

from datetime import datetime, timezone as dt_timezone

from django.core.management.base import BaseCommand
from django.utils import timezone

from apps.public_content.models import ConsularService, FaqItem, NewsArticle, VisaCategory


def _dt(year: int, month: int, day: int) -> datetime:
    return timezone.make_aware(datetime(year, month, day, 10, 0, 0), dt_timezone.utc)


class Command(BaseCommand):
    help = "Peuple le portail public avec des données [PROVISOIRE]."

    def handle(self, *args, **options):
        self._seed_news()
        self._seed_faq()
        self._seed_services()
        self._seed_visas()
        self.stdout.write(self.style.SUCCESS("Contenus publics provisoires chargés."))

    def _seed_news(self) -> None:
        # Actualités basées sur des faits publics (ANAPI/KOTRA, coopération, bourses).
        articles = [
            {
                "slug": "commission-mixte-rdc-coree-2025",
                "category": NewsArticle.Category.NEWS,
                "published_at": _dt(2025, 3, 27),
                "is_provisional": False,
                "title_fr": "Préparation de la commission mixte RDC – Corée (juin 2025)",
                "title_en": "Preparation of the DRC–Korea Joint Commission (June 2025)",
                "title_ko": "콩고–한국 합동위원회 준비 (2025년 6월)",
                "summary_fr": (
                    "La ministre déléguée à la Coopération internationale a reçu l'ambassadeur "
                    "de la République de Corée à Kinshasa en vue de la commission mixte prévue à Séoul."
                ),
                "summary_en": (
                    "The Deputy Minister for International Cooperation met the Ambassador of the "
                    "Republic of Korea in Kinshasa ahead of the joint commission planned in Seoul."
                ),
                "summary_ko": (
                    "국제협력 담당 장관이 서울 합동위원회를 앞두고 킨샤사에서 주콩고 한국 대사를 접견했습니다."
                ),
                "body_fr": (
                    "Les échanges ont porté sur le commerce, les investissements, les infrastructures "
                    "et les nouvelles technologies. La commission mixte vise à approfondir le partenariat "
                    "bilatéral et à concrétiser des projets d'intérêt commun."
                ),
            },
            {
                "slug": "protocole-anapi-kotra-juin-2024",
                "category": NewsArticle.Category.COMMUNIQUE,
                "published_at": _dt(2024, 6, 4),
                "is_provisional": False,
                "title_fr": "Protocole d'accord ANAPI – KOTRA signé à Séoul",
                "title_en": "ANAPI–KOTRA memorandum signed in Seoul",
                "title_ko": "서울에서 ANAPI–KOTRA 양해각서 체결",
                "summary_fr": (
                    "En marge du premier Sommet Corée–Afrique (juin 2024), l'ANAPI et la KOTRA "
                    "ont signé un protocole pour promouvoir les investissements et le transfert de savoir-faire."
                ),
                "summary_en": (
                    "On the sidelines of the first Korea–Africa Summit (June 2024), ANAPI and KOTRA "
                    "signed an MoU to promote investment and know-how transfer."
                ),
                "summary_ko": (
                    "제1차 한–아프리카 정상회의(2024.6) 계기에 ANAPI와 KOTRA가 투자 및 노하우 이전을 "
                    "위한 양해각서를 체결했습니다."
                ),
                "body_fr": (
                    "Les secteurs cités comprennent l'agriculture, l'énergie, les infrastructures, "
                    "l'éducation et les mines. La délégation ANAPI a également échangé avec la KOICA "
                    "sur les ressources humaines, les énergies renouvelables et les études de faisabilité. "
                    "S.E. Atoki Ileka, Ambassadeur de la RDC en République de Corée, a accompagné ces travaux."
                ),
            },
            {
                "slug": "bourses-koica-ciat-gks",
                "category": NewsArticle.Category.NOTICE,
                "published_at": _dt(2024, 2, 13),
                "is_provisional": False,
                "title_fr": "Bourses d'études : programmes KOICA CIAT et GKS",
                "title_en": "Scholarships: KOICA CIAT and GKS programmes",
                "title_ko": "장학금: KOICA CIAT 및 GKS 프로그램",
                "summary_fr": (
                    "La RDC figure parmi les pays éligibles aux bourses KOICA (CIAT) pour masters et doctorats, "
                    "destinées aux agents publics nominés. Le programme GKS du gouvernement coréen est également "
                    "annoncé via les canaux diplomatiques."
                ),
                "summary_en": (
                    "The DRC is among countries eligible for KOICA (CIAT) scholarships for master's and doctoral "
                    "degrees for nominated public officials. The Korean Government Scholarship (GKS) is also "
                    "announced through diplomatic channels."
                ),
                "summary_ko": (
                    "콩고민주공화국은 공직자 대상 KOICA(CIAT) 석·박사 장학금 대상국에 포함됩니다. "
                    "한국정부초청장학금(GKS)도 외교 경로로 안내됩니다."
                ),
                "body_fr": (
                    "Les candidats sont invités à suivre les appels officiels publiés chaque année "
                    "(Ambassade de Corée en RDC, KOICA, institutions compétentes). Les dates, quotas "
                    "et conditions varient selon l'année. L'Ambassade de la RDC à Séoul peut orienter "
                    "les usagers vers les informations publiées."
                ),
            },
            {
                "slug": "cooperation-minerais-critiques",
                "category": NewsArticle.Category.NEWS,
                "published_at": _dt(2025, 7, 9),
                "is_provisional": True,
                "title_fr": "Coopération sur les minerais critiques et l'énergie",
                "title_en": "Cooperation on critical minerals and energy",
                "title_ko": "핵심 광물·에너지 협력",
                "summary_fr": (
                    "S.E. Atoki Ileka a souligné l'intérêt d'accélérer la coopération RDC–Corée "
                    "sur les minerais critiques, les énergies renouvelables et les infrastructures intelligentes."
                ),
                "summary_en": (
                    "H.E. Atoki Ileka stressed the need to accelerate DRC–Korea cooperation on critical minerals, "
                    "renewable energy and smart infrastructure."
                ),
                "summary_ko": (
                    "아토키 일레카 대사는 핵심 광물, 재생에너지, 스마트 인프라 분야에서 "
                    "콩고–한국 협력을 가속할 필요성을 강조했습니다."
                ),
                "body_fr": (
                    "Dans le prolongement du Sommet Corée–Afrique 2024, le dialogue sur les minerais critiques "
                    "et le partage d'expérience technologique coréenne constituent des axes de travail. "
                    "Les entreprises intéressées sont invitées à se rapprocher de l'Ambassade et de l'ANAPI."
                ),
            },
            {
                "slug": "portail-numerique-ambassade",
                "category": NewsArticle.Category.NOTICE,
                "published_at": _dt(2026, 3, 1),
                "is_provisional": True,
                "title_fr": "Portail numérique de l'Ambassade",
                "title_en": "Embassy digital portal",
                "title_ko": "대사관 디지털 포털",
                "summary_fr": "Mise en ligne du portail d'information et d'orientation consulaire de l'Ambassade à Séoul.",
                "summary_en": "Launch of the Embassy's consular information and guidance portal in Seoul.",
                "summary_ko": "서울 대사관 영사 정보·안내 포털 개설.",
                "body_fr": (
                    "Ce site regroupe les informations sur les services consulaires, les visas, "
                    "l'assistance et l'orientation économique. Certaines mentions restent à valider "
                    "par les autorités compétentes."
                ),
            },
        ]
        for art in articles:
            NewsArticle.objects.update_or_create(
                slug=art["slug"],
                defaults={
                    "category": art["category"],
                    "is_published": True,
                    "published_at": art["published_at"],
                    "is_provisional": art["is_provisional"],
                    "title_fr": art["title_fr"],
                    "title_en": art["title_en"],
                    "title_ko": art["title_ko"],
                    "summary_fr": art["summary_fr"],
                    "summary_en": art["summary_en"],
                    "summary_ko": art["summary_ko"],
                    "body_fr": art["body_fr"],
                    "body_en": art.get("summary_en", art["body_fr"]),
                    "body_ko": art.get("summary_ko", art["body_fr"]),
                },
            )
        # Ancien seed factice : dépublier
        NewsArticle.objects.filter(slug="bienvenue-portail-numerique").update(is_published=False)

    def _seed_faq(self) -> None:
        items = [
            (
                "visa",
                "Comment déposer une pré-demande de visa ?",
                "How do I submit a visa pre-application?",
                "비자는 어떻게 사전 신청하나요?",
                "Consultez la rubrique Visas, préparez les pièces listées, puis utilisez le formulaire de pré-demande (espace usager — prochaine phase). La décision finale appartient aux autorités compétentes.",
            ),
            (
                "appointment",
                "Comment prendre un rendez-vous consulaire ?",
                "How do I book a consular appointment?",
                "영사 예약은 어떻게 하나요?",
                "Le module de rendez-vous sera activé après validation opérationnelle. En attendant, utilisez le formulaire de contact.",
            ),
            (
                "assistance",
                "Que faire en cas d'urgence ?",
                "What should I do in an emergency?",
                "긴급 상황에서는 어떻게 해야 하나요?",
                "Contactez immédiatement les services d'urgence locaux, puis signalez la situation via la rubrique Assistance. Les numéros officiels seront publiés après validation.",
            ),
        ]
        for i, (cat, qfr, qen, qko, afr) in enumerate(items):
            FaqItem.objects.update_or_create(
                question_fr=qfr,
                defaults={
                    "category": cat,
                    "sort_order": i,
                    "is_published": True,
                    "is_provisional": True,
                    "question_en": qen,
                    "question_ko": qko,
                    "answer_fr": afr,
                    "answer_en": afr,
                    "answer_ko": afr,
                },
            )

    def _seed_services(self) -> None:
        # Sources : pages services Ambassade RDC Séoul (passeport, carte consulaire, autres).
        services = [
            {
                "slug": "passeport",
                "sort_order": 1,
                "is_provisional": False,
                "requires_account": True,
                "title_fr": "Passeport biométrique",
                "title_en": "Biometric passport",
                "title_ko": "생체인식 여권",
                "summary_fr": (
                    "Demande de passeport biométrique à Séoul (99 USD publié). "
                    "Dépôt obligatoire en personne ; pièces : formulaire, page BIO, photos 2×2, preuve de résidence."
                ),
                "summary_en": (
                    "Biometric passport application in Seoul (USD 99 published). "
                    "In-person filing required; documents: form, bio page, 2×2 photos, proof of residence."
                ),
                "summary_ko": (
                    "서울 생체인식 여권 신청(공지 99 USD). "
                    "직접 제출 필수; 서류: 신청서, 인적사항 페이지, 2×2 사진, 체류증명."
                ),
                "conditions_fr": (
                    "Toute demande se fait en personne à l'Ambassade de la RDC à Séoul (Yongsan). "
                    "Réforme nationale 2025 (passeport.gouv.cd, NIF, 75 USD) : modalités diaspora à confirmer."
                ),
                "documents_fr": (
                    "1) Formulaire de demande complété ;\n"
                    "2) Copie du passeport actuel/précédent (page BIO) ;\n"
                    "3) Perte/vol : rapport de police ou acte de naissance ;\n"
                    "4) 2 photos 2″×2″ (< 6 mois) ;\n"
                    "5) Preuve de résidence (carte, visa D-2/D-4, permis de travail)."
                ),
                "tariff_note_fr": "99,00 USD (tarif Ambassade Séoul) — tarif national publié 75 USD",
                "delay_note_fr": "Délai selon le volume des dossiers — se renseigner auprès du service consulaire.",
            },
            {
                "slug": "enregistrement-consulaire",
                "sort_order": 2,
                "is_provisional": False,
                "requires_account": True,
                "title_fr": "Carte / enregistrement consulaire",
                "title_en": "Consular card / registration",
                "title_ko": "영사 카드 / 등록",
                "summary_fr": (
                    "Inscription au registre des Congolais établis en République de Corée. "
                    "Vivement recommandée pour tout séjour de plus de 6 mois."
                ),
                "summary_en": (
                    "Registration on the register of Congolese nationals established in the Republic of Korea. "
                    "Strongly recommended for stays longer than 6 months."
                ),
                "summary_ko": "대한민국 거주 콩고인 등록부 등재. 6개월 이상 체류 시 강력히 권장.",
                "conditions_fr": (
                    "Tout Congolais qui s'établit pour plus de 6 mois en République de Corée. "
                    "Facilite passeport / attestations, recensement, délais, information et contact d'urgence "
                    "(source : Ambassade RDC Séoul — carte consulaire)."
                ),
                "documents_fr": (
                    "Formulaire de demande en ligne (e-mail + mot de passe) selon la procédure publiée. "
                    "Pièces détaillées non listées sur le site Séoul — confirmer au guichet "
                    "(passeport, séjour, adresse, photos souvent demandés)."
                ),
                "tariff_note_fr": "Tarif à confirmer auprès de l'Ambassade.",
                "delay_note_fr": "Selon le dossier et le calendrier consulaire.",
            },
            {
                "slug": "etat-civil",
                "sort_order": 3,
                "is_provisional": False,
                "requires_account": True,
                "title_fr": "État civil et légalisations",
                "title_en": "Civil status and legalisations",
                "title_ko": "신분 증명 및 공증",
                "summary_fr": (
                    "Composition familiale, mariage, nationalité/naissance/décès, célibat, "
                    "légalisation, laissez-passer — formulaire en ligne puis pièces au guichet."
                ),
                "summary_en": (
                    "Family composition, marriage, nationality/birth/death, celibacy, "
                    "legalisation, laissez-passer — online form then documents at the counter."
                ),
                "summary_ko": (
                    "가족관계·혼인·국적/출생/사망·미혼·공증·통과증 — "
                    "온라인 신청 후 창구 서류 제출."
                ),
                "conditions_fr": (
                    "Citoyens relevant de la juridiction de l'Ambassade à Séoul. "
                    "Laissez-passer : passeport expiré ou volé, voyage unique vers la RDC "
                    "(source : Ambassade RDC Séoul — légalisations)."
                ),
                "documents_fr": (
                    "Formulaire en ligne (e-mail + mot de passe) ; original + copies selon l'acte "
                    "(passeport, séjour, actes concernés). Pièces détaillées indicatives hors laissez-passer."
                ),
                "tariff_note_fr": "Selon le type d'acte — se renseigner auprès du service consulaire.",
                "delay_note_fr": "Selon le type de document demandé.",
            },
            {
                "slug": "visas",
                "sort_order": 4,
                "is_provisional": False,
                "requires_account": False,
                "title_fr": "Visas pour la RDC",
                "title_en": "Visas for the DRC",
                "title_ko": "콩고민주공화국 비자",
                "summary_fr": "Orientation et tarifs pour les demandes de visa auprès de l'Ambassade à Séoul et via e-Visa DGM.",
                "summary_en": "Guidance and fees for visa applications at the Embassy in Seoul and via the DGM e-Visa.",
                "summary_ko": "서울 대사관 및 DGM 전자비자를 통한 비자 안내·수수료.",
                "conditions_fr": (
                    "Voir la rubrique Visas pour le détail des procédures, délais et montants (KRW). "
                    "Les frais ne sont pas remboursables. Documents en français ou anglais."
                ),
                "documents_fr": (
                    "Formulaire signé ; passeport + copie ; photo ; invitation notariée (selon motif) ; "
                    "billet aller-retour ; ARC pour résidents étrangers en Corée. Voir /visas."
                ),
                "tariff_note_fr": "1 mois : 120 000 / 240 000 KRW · Multi 3 mois : 360 000 / 720 000 KRW",
                "delay_note_fr": "Général : 10 j. ouvrables · Express : 2–4 j. ouvrables",
            },
            {
                "slug": "assistance",
                "sort_order": 5,
                "is_provisional": True,
                "requires_account": False,
                "title_fr": "Assistance consulaire",
                "title_en": "Consular assistance",
                "title_ko": "영사 지원",
                "summary_fr": "Soutien aux ressortissants en situation d'urgence ou de difficulté (arrestation, hospitalisation, perte de documents, etc.).",
                "summary_en": "Support for nationals in emergency or difficulty (arrest, hospitalisation, loss of documents, etc.).",
                "summary_ko": "긴급·곤란 상황(체포, 입원, 서류 분실 등)에 있는 국민 지원.",
                "conditions_fr": (
                    "En cas d'urgence, contactez d'abord les services locaux (112 / 119), "
                    "puis informez l'Ambassade (+82 2-722-7958)."
                ),
                "documents_fr": "Pièce d'identité si disponible ; éléments décrivant la situation ; contacts utiles.",
                "tariff_note_fr": "Selon la nature de l'intervention.",
                "delay_note_fr": "Traitement selon l'urgence signalée.",
            },
        ]
        for svc in services:
            ConsularService.objects.update_or_create(
                slug=svc["slug"],
                defaults={
                    "sort_order": svc["sort_order"],
                    "is_published": True,
                    "is_provisional": svc["is_provisional"],
                    "requires_account": svc["requires_account"],
                    "title_fr": svc["title_fr"],
                    "title_en": svc["title_en"],
                    "title_ko": svc["title_ko"],
                    "summary_fr": svc["summary_fr"],
                    "summary_en": svc["summary_en"],
                    "summary_ko": svc["summary_ko"],
                    "conditions_fr": svc["conditions_fr"],
                    "conditions_en": svc["conditions_fr"],
                    "conditions_ko": svc["conditions_fr"],
                    "documents_fr": svc["documents_fr"],
                    "documents_en": svc["documents_fr"],
                    "documents_ko": svc["documents_fr"],
                    "tariff_note_fr": svc["tariff_note_fr"],
                    "delay_note_fr": svc["delay_note_fr"],
                },
            )

    def _seed_visas(self) -> None:
        # Tarifs publiés sur le site de l'Ambassade RDC à Séoul (congokoreaembassy.com).
        # e-Visa DGM : evisa.gouv.cd (frais dossier 50 USD + visa).
        VisaCategory.objects.filter(
            slug__in=[
                "transit",
                "court-sejour",
                "long-sejour",
                "touristique",
                "affaires",
                "travail",
                "diplomatique",
                "officiel",
            ]
        ).update(is_published=False)

        visas = [
            {
                "slug": "visite-1-mois",
                "title_fr": "Visa de visite — 1 mois",
                "title_en": "Visit visa — 1 month",
                "title_ko": "방문 비자 — 1개월",
                "description_fr": (
                    "Visa pour visite, tourisme ou séjour de courte durée. "
                    "Délivrance via l'Ambassade à Séoul après examen du dossier."
                ),
                "description_en": (
                    "Visa for visit, tourism or short stay. Issued via the Embassy in Seoul after file review."
                ),
                "description_ko": "방문·관광·단기체류용 비자. 서울 대사관에서 서류 심사 후 발급.",
                "eligibility_fr": "Voyageurs se rendant en RDC pour visite ou tourisme, munis d'une invitation notariée.",
                "documents_fr": (
                    "Formulaire signé ; passeport + copie ; 1 photo (format coréen) ; "
                    "invitation notariée en RDC ; pièce d'identité de l'invitant ; "
                    "billet aller-retour ; ARC pour les résidents étrangers en Corée ; "
                    "autorisation parentale (mineurs). Documents en français ou anglais."
                ),
                "tariff_note_fr": "Général : 120 000 KRW (10 j. ouvrables) · Express : 240 000 KRW (2–4 j.)",
                "validity_note_fr": "Séjour d'un mois. Frais non remboursables.",
                "is_provisional": False,
            },
            {
                "slug": "affaires-travail",
                "title_fr": "Visa affaires / travail",
                "title_en": "Business / work visa",
                "title_ko": "상용·취업 비자",
                "description_fr": (
                    "Pour missions professionnelles ou activités en entreprise. "
                    "Un ordre de mission ou documents professionnels sont requis."
                ),
                "description_en": (
                    "For professional missions or business activities. A travel order or professional documents are required."
                ),
                "description_ko": "업무·상용 목적. 출장명령서 등 업무 관련 서류 필요.",
                "eligibility_fr": "Travailleurs, entreprises et voyageurs d'affaires.",
                "documents_fr": (
                    "Formulaire ; passeport + copie ; 1 photo ; invitation notariée ; "
                    "pièce de l'invitant ; ordre de mission ; billet aller-retour ; ARC si applicable."
                ),
                "tariff_note_fr": "Selon durée : 1 mois 120 000 / 240 000 KRW · 3 mois multi. 360 000 / 720 000 KRW",
                "validity_note_fr": "Selon la catégorie demandée (1 mois ou 3 mois entrées multiples).",
                "is_provisional": False,
            },
            {
                "slug": "multiples-3-mois",
                "title_fr": "Visa entrées multiples — 3 mois",
                "title_en": "Multiple-entry visa — 3 months",
                "title_ko": "복수 입국 비자 — 3개월",
                "description_fr": "Visa permettant plusieurs entrées et sorties pendant la période de validité.",
                "description_en": "Visa allowing multiple entries and exits during its validity period.",
                "description_ko": "유효기간 동안 여러 차례 출입국이 가능한 비자.",
                "eligibility_fr": "Voyageurs justifiant d'entrées répétées en RDC.",
                "documents_fr": "Même base documentaire que le visa de visite, selon le motif (visite ou affaires).",
                "tariff_note_fr": "Général : 360 000 KRW (10 j.) · Express : 720 000 KRW (2–4 j.)",
                "validity_note_fr": "3 mois, entrées multiples. Frais non remboursables.",
                "is_provisional": False,
            },
            {
                "slug": "diplomatique-officiel",
                "title_fr": "Visa diplomatique / officiel",
                "title_en": "Diplomatic / official visa",
                "title_ko": "외교·공용 비자",
                "description_fr": (
                    "Pour titulaires de passeports diplomatiques ou officiels. "
                    "Note verbale ou invitation d'une institution officielle / organisation internationale."
                ),
                "description_en": (
                    "For holders of diplomatic or official passports. "
                    "Verbal note or invitation from an official institution / international organization."
                ),
                "description_ko": "외교·공용 여권 소지자. 구두공한 또는 공식 기관·국제기구 초청장.",
                "eligibility_fr": "Passeports diplomatiques et officiels.",
                "documents_fr": (
                    "Formulaire ; passeport + copie ; 1 photo ; note verbale (gouvernement coréen) "
                    "ou invitation d'une institution officielle congolaise / organisation internationale ; "
                    "ordre de mission. Pas de billet aller-retour requis."
                ),
                "tariff_note_fr": "Gratuit (pas de frais de demande pour passeports spéciaux)",
                "validity_note_fr": "Selon la mission et les documents présentés.",
                "is_provisional": False,
            },
            {
                "slug": "e-visa-dgm",
                "title_fr": "e-Visa (portail DGM)",
                "title_en": "e-Visa (DGM portal)",
                "title_ko": "전자비자 (DGM)",
                "description_fr": (
                    "Demande en ligne via le portail officiel de la Direction Générale de Migration "
                    "(evisa.gouv.cd). Complément possible à l'entrée selon les règles en vigueur."
                ),
                "description_en": (
                    "Online application via the official DGM portal (evisa.gouv.cd). "
                    "Additional steps on arrival may apply under current rules."
                ),
                "description_ko": "DGM 공식 포털(evisa.gouv.cd)을 통한 온라인 신청. 입국 시 추가 절차가 있을 수 있음.",
                "eligibility_fr": "Selon les critères publiés sur evisa.gouv.cd (affaires, visite, tourisme, etc.).",
                "documents_fr": "Compte en ligne ; formulaire ; paiement sécurisé ; documents exigés par le portail.",
                "tariff_note_fr": "Frais dossier 50 USD + visa volant ordinaire 250 USD (7 j.) ou spécifique 800 USD (30 j.)",
                "validity_note_fr": "Analyse sous 72 h environ. Voir evisa.gouv.cd.",
                "is_provisional": True,
            },
        ]
        for i, visa in enumerate(visas):
            VisaCategory.objects.update_or_create(
                slug=visa["slug"],
                defaults={
                    "sort_order": i,
                    "is_published": True,
                    "is_provisional": visa["is_provisional"],
                    "title_fr": visa["title_fr"],
                    "title_en": visa["title_en"],
                    "title_ko": visa["title_ko"],
                    "description_fr": visa["description_fr"],
                    "description_en": visa["description_en"],
                    "description_ko": visa["description_ko"],
                    "eligibility_fr": visa["eligibility_fr"],
                    "documents_fr": visa["documents_fr"],
                    "tariff_note_fr": visa["tariff_note_fr"],
                    "validity_note_fr": visa["validity_note_fr"],
                },
            )
