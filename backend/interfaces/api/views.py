"""
Vues API du portail public.

Chaque vue délègue à un cas d'usage (Clean Architecture).
"""

from __future__ import annotations

from drf_spectacular.utils import OpenApiParameter, extend_schema
from rest_framework import status
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle, UserRateThrottle
from rest_framework.views import APIView

from rest_framework.permissions import IsAuthenticated

from application.use_cases import (
    AttachVisaDocument,
    ChangeCitizenPassword,
    FinalizeVisaPreApplication,
    GetConsularService,
    GetNewsBySlug,
    GetVisaPreApplication,
    ListAppointments,
    ListCaseHistory,
    ListCitizenCases,
    ListConsularServices,
    ListNotifications,
    ListPublishedFaq,
    ListPublishedNews,
    ListVisaCategories,
    ListVisaPreApplications,
    LoginCitizen,
    MarkAllNotificationsRead,
    MarkNotificationRead,
    RegisterCitizen,
    RequestAppointment,
    SubmitCivilStatusRequest,
    SubmitConsularRegistration,
    SubmitContactMessage,
    SubmitPassportRequest,
    SubmitVisaPreApplication,
    UnreadNotificationCount,
    UpdateCitizenProfile,
)
from domain.entities import (
    AppointmentCommand,
    ChangePasswordCommand,
    CivilStatusSubmission,
    ConsularRegistrationSubmission,
    ContactSubmission,
    LoginCitizenCommand,
    PassportRequestCommand,
    RegisterCitizenCommand,
    UpdateProfileCommand,
    VisaDocumentUploadCommand,
    VisaPreApplicationCommand,
)
from infrastructure.repositories import (
    DjangoAccountRepository,
    DjangoAppointmentRepository,
    DjangoCaseEventRepository,
    DjangoCitizenCasesRepository,
    DjangoCivilStatusRepository,
    DjangoConsularRegistrationRepository,
    DjangoConsularServiceRepository,
    DjangoContactRepository,
    DjangoFaqRepository,
    DjangoNewsRepository,
    DjangoNotificationRepository,
    DjangoPassportRequestRepository,
    DjangoVisaCategoryRepository,
    DjangoVisaPreApplicationRepository,
)
from interfaces.api.query import parse_limit
from interfaces.api.serializers import (
    AppointmentSerializer,
    ChangePasswordSerializer,
    CivilStatusRequestSerializer,
    ConsularRegistrationSerializer,
    ContactCreateSerializer,
    LoginCitizenSerializer,
    PassportRequestSerializer,
    RegisterCitizenSerializer,
    UpdateProfileSerializer,
    VisaDocumentUploadSerializer,
    VisaFinalizeSerializer,
    VisaPreApplicationSerializer,
)


def ok(data, *, status_code: int = status.HTTP_200_OK, meta: dict | None = None) -> Response:
    payload = {"success": True, "data": data, "error": None}
    if meta is not None:
        payload["meta"] = meta
    return Response(payload, status=status_code)


def _localized(entity_text, locale: str) -> str:
    return entity_text.for_locale(locale)


class ContactThrottle(AnonRateThrottle):
    scope = "contact"


class ConsularRegistrationThrottle(AnonRateThrottle):
    scope = "consular_registration"


class CivilStatusThrottle(AnonRateThrottle):
    scope = "civil_status"


class AuthThrottle(AnonRateThrottle):
    scope = "auth"
    rate = "20/hour"


class VisaPreApplicationThrottle(UserRateThrottle):
    scope = "visa_preapplication"


class HealthView(APIView):
    """Santé de l'API — monitoring basique."""

    authentication_classes: list = []
    permission_classes: list = []

    @extend_schema(tags=["Système"], summary="Healthcheck")
    def get(self, request):
        return ok({"status": "ok", "service": "ambadrcor-api", "version": "0.1.0"})


class NewsListView(APIView):
    authentication_classes: list = []
    permission_classes: list = []

    @extend_schema(
        tags=["Public — Actualités"],
        summary="Liste des actualités publiées",
        parameters=[
            OpenApiParameter(name="locale", description="fr | en | ko", required=False, type=str),
            OpenApiParameter(name="limit", required=False, type=int),
        ],
    )
    def get(self, request):
        locale = request.query_params.get("locale", "fr")
        limit = parse_limit(request.query_params.get("limit"))
        items = ListPublishedNews(DjangoNewsRepository()).execute(limit=limit)
        payload = [
            {
                "slug": n.slug,
                "category": n.category,
                "title": _localized(n.title, locale),
                "summary": _localized(n.summary, locale),
                "published_at": n.published_at,
                "is_provisional": n.is_provisional,
            }
            for n in items
        ]
        return ok(payload, meta={"limit": limit, "count": len(payload)})


class NewsDetailView(APIView):
    authentication_classes: list = []
    permission_classes: list = []

    @extend_schema(tags=["Public — Actualités"], summary="Détail d'une actualité")
    def get(self, request, slug: str):
        locale = request.query_params.get("locale", "fr")
        news = GetNewsBySlug(DjangoNewsRepository()).execute(slug)
        if not news:
            return Response(
                {
                    "success": False,
                    "data": None,
                    "error": {"message": "Actualité introuvable.", "code": "not_found"},
                },
                status=status.HTTP_404_NOT_FOUND,
            )
        return ok(
            {
                "slug": news.slug,
                "category": news.category,
                "title": _localized(news.title, locale),
                "summary": _localized(news.summary, locale),
                "body": _localized(news.body, locale),
                "published_at": news.published_at,
                "is_provisional": news.is_provisional,
            }
        )


class FaqListView(APIView):
    authentication_classes: list = []
    permission_classes: list = []

    @extend_schema(
        tags=["Public — FAQ"],
        summary="Liste FAQ",
        parameters=[
            OpenApiParameter(name="category", required=False, type=str),
            OpenApiParameter(name="locale", required=False, type=str),
            OpenApiParameter(name="limit", required=False, type=int),
        ],
    )
    def get(self, request):
        locale = request.query_params.get("locale", "fr")
        category = request.query_params.get("category")
        limit = parse_limit(request.query_params.get("limit"), default=50)
        items = ListPublishedFaq(DjangoFaqRepository()).execute(
            category=category, limit=limit
        )
        payload = [
            {
                "id": f.id,
                "category": f.category,
                "question": _localized(f.question, locale),
                "answer": _localized(f.answer, locale),
                "is_provisional": f.is_provisional,
            }
            for f in items
        ]
        return ok(payload, meta={"limit": limit, "count": len(payload)})


class ConsularServiceListView(APIView):
    authentication_classes: list = []
    permission_classes: list = []

    @extend_schema(
        tags=["Public — Services"],
        summary="Services consulaires",
        parameters=[OpenApiParameter(name="limit", required=False, type=int)],
    )
    def get(self, request):
        locale = request.query_params.get("locale", "fr")
        limit = parse_limit(request.query_params.get("limit"), default=50)
        items = ListConsularServices(DjangoConsularServiceRepository()).execute(
            limit=limit
        )
        payload = [
            {
                "slug": s.slug,
                "title": _localized(s.title, locale),
                "summary": _localized(s.summary, locale),
                "requires_account": s.requires_account,
                "is_provisional": s.is_provisional,
                "tariff_note": s.tariff_note_fr,
                "delay_note": s.delay_note_fr,
            }
            for s in items
        ]
        return ok(payload, meta={"limit": limit, "count": len(payload)})


class ConsularServiceDetailView(APIView):
    authentication_classes: list = []
    permission_classes: list = []

    @extend_schema(tags=["Public — Services"], summary="Détail d'un service")
    def get(self, request, slug: str):
        locale = request.query_params.get("locale", "fr")
        service = GetConsularService(DjangoConsularServiceRepository()).execute(slug)
        if not service:
            return Response(
                {
                    "success": False,
                    "data": None,
                    "error": {"message": "Service introuvable.", "code": "not_found"},
                },
                status=status.HTTP_404_NOT_FOUND,
            )
        return ok(
            {
                "slug": service.slug,
                "title": _localized(service.title, locale),
                "summary": _localized(service.summary, locale),
                "conditions": _localized(service.conditions, locale),
                "documents": _localized(service.documents, locale),
                "tariff_note": service.tariff_note_fr,
                "delay_note": service.delay_note_fr,
                "requires_account": service.requires_account,
                "is_provisional": service.is_provisional,
            }
        )


class VisaCategoryListView(APIView):
    authentication_classes: list = []
    permission_classes: list = []

    @extend_schema(
        tags=["Public — Visas"],
        summary="Catégories de visa",
        parameters=[OpenApiParameter(name="limit", required=False, type=int)],
    )
    def get(self, request):
        locale = request.query_params.get("locale", "fr")
        limit = parse_limit(request.query_params.get("limit"), default=50)
        items = ListVisaCategories(DjangoVisaCategoryRepository()).execute(limit=limit)
        payload = [
            {
                "slug": v.slug,
                "title": _localized(v.title, locale),
                "description": _localized(v.description, locale),
                "eligibility": v.eligibility_fr,
                "documents": v.documents_fr,
                "tariff_note": v.tariff_note_fr,
                "validity_note": v.validity_note_fr,
                "is_provisional": v.is_provisional,
            }
            for v in items
        ]
        return ok(payload, meta={"limit": limit, "count": len(payload)})


class ContactCreateView(APIView):
    authentication_classes: list = []
    permission_classes: list = []
    throttle_classes = [ContactThrottle]

    @extend_schema(
        tags=["Public — Contact"],
        summary="Soumettre une demande de contact",
        request=ContactCreateSerializer,
    )
    def post(self, request):
        serializer = ContactCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        ip = request.META.get("HTTP_X_FORWARDED_FOR", "").split(",")[0].strip() or request.META.get(
            "REMOTE_ADDR"
        )
        submission = ContactSubmission(
            category=data["category"],
            full_name=data["full_name"],
            email=data["email"],
            phone=data.get("phone", ""),
            subject=data["subject"],
            message=data["message"],
            locale=data.get("locale", "fr"),
            ip_address=ip,
        )
        message_id = SubmitContactMessage(DjangoContactRepository()).execute(submission)
        return ok(
            {
                "id": message_id,
                "message": "Votre demande a été enregistrée. Un agent vous répondra selon les horaires du service.",
            },
            status_code=status.HTTP_201_CREATED,
        )


class ConsularRegistrationCreateView(APIView):
    # Auth optionnelle : si token présent, le dossier est lié au compte.
    permission_classes = []
    throttle_classes = [ConsularRegistrationThrottle]

    @extend_schema(
        tags=["Public — Enregistrement consulaire"],
        summary="Soumettre une demande d'inscription / carte consulaire",
        request=ConsularRegistrationSerializer,
    )
    def post(self, request):
        serializer = ConsularRegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        ip = request.META.get("HTTP_X_FORWARDED_FOR", "").split(",")[0].strip() or request.META.get(
            "REMOTE_ADDR"
        )
        submission = ConsularRegistrationSubmission(
            nom=data["nom"],
            post_nom=data["post_nom"],
            prenom=data["prenom"],
            sexe=data["sexe"],
            etat_civil=data["etat_civil"],
            date_naissance=data["date_naissance"],
            lieu_naissance=data["lieu_naissance"],
            pays_naissance=data["pays_naissance"],
            nationalite=data["nationalite"],
            profession=data["profession"],
            numero_passeport=data["numero_passeport"],
            email=data["email"],
            telephone=data["telephone"],
            adresse_rue=data["adresse_rue"],
            adresse_numero=data["adresse_numero"],
            ville=data["ville"],
            code_postal=data["code_postal"],
            type_sejour=data["type_sejour"],
            adresse_rdc=data["adresse_rdc"],
            nom_pere=data["nom_pere"],
            prenom_pere=data["prenom_pere"],
            nom_mere=data["nom_mere"],
            prenom_mere=data["prenom_mere"],
            contact_urgence_nom=data["contact_urgence_nom"],
            contact_urgence_telephone=data["contact_urgence_telephone"],
            contact_urgence_lien=data["contact_urgence_lien"],
            password=data["password"],
            password_confirm=data["password_confirm"],
            locale=data.get("locale", "fr"),
            ip_address=ip,
            user_id=request.user.id if getattr(request.user, "is_authenticated", False) else None,
        )
        created = SubmitConsularRegistration(DjangoConsularRegistrationRepository()).execute(
            submission
        )
        return ok(
            {
                "id": created["id"],
                "reference": created["reference"],
                "message": (
                    "Votre demande d'enregistrement consulaire a été enregistrée. "
                    "Le service consulaire vous contactera selon les horaires de l'Ambassade."
                ),
            },
            status_code=status.HTTP_201_CREATED,
        )


class CivilStatusCreateView(APIView):
    permission_classes = []
    throttle_classes = [CivilStatusThrottle]

    @extend_schema(
        tags=["Public — État civil"],
        summary="Soumettre une demande d'acte d'état civil / légalisation",
        request=CivilStatusRequestSerializer,
    )
    def post(self, request):
        serializer = CivilStatusRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        ip = request.META.get("HTTP_X_FORWARDED_FOR", "").split(",")[0].strip() or request.META.get(
            "REMOTE_ADDR"
        )
        submission = CivilStatusSubmission(
            document_type=data["document_type"],
            nom=data["nom"],
            post_nom=data["post_nom"],
            prenom=data["prenom"],
            sexe=data["sexe"],
            etat_civil=data["etat_civil"],
            date_naissance=data["date_naissance"],
            lieu_naissance=data["lieu_naissance"],
            pays_naissance=data["pays_naissance"],
            nationalite=data["nationalite"],
            profession=data["profession"],
            numero_passeport=data["numero_passeport"],
            email=data["email"],
            telephone=data["telephone"],
            adresse_coree=data["adresse_coree"],
            adresse_rdc=data["adresse_rdc"],
            nom_pere=data["nom_pere"],
            prenom_pere=data["prenom_pere"],
            nom_mere=data["nom_mere"],
            prenom_mere=data["prenom_mere"],
            motif=data["motif"],
            password=data["password"],
            password_confirm=data["password_confirm"],
            locale=data.get("locale", "fr"),
            ip_address=ip,
            user_id=request.user.id if getattr(request.user, "is_authenticated", False) else None,
        )
        created = SubmitCivilStatusRequest(DjangoCivilStatusRepository()).execute(submission)
        return ok(
            {
                "id": created["id"],
                "reference": created["reference"],
                "message": (
                    "Votre demande d'état civil a été enregistrée. "
                    "Présentez-vous ensuite au service consulaire avec les pièces originales."
                ),
            },
            status_code=status.HTTP_201_CREATED,
        )


class RegisterCitizenView(APIView):
    authentication_classes: list = []
    permission_classes: list = []
    throttle_classes = [AuthThrottle]

    @extend_schema(
        tags=["Espace usager — Auth"],
        summary="Inscription citoyen",
        request=RegisterCitizenSerializer,
    )
    def post(self, request):
        serializer = RegisterCitizenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        user_id = RegisterCitizen(DjangoAccountRepository()).execute(
            RegisterCitizenCommand(
                email=data["email"],
                password=data["password"],
                password_confirm=data["password_confirm"],
                nom=data["nom"],
                post_nom=data["post_nom"],
                prenom=data["prenom"],
                telephone=data.get("telephone", ""),
                locale=data.get("locale", "fr"),
            )
        )
        return ok(
            {
                "id": user_id,
                "message": "Compte créé. Vous pouvez vous connecter.",
            },
            status_code=status.HTTP_201_CREATED,
        )


class LoginCitizenView(APIView):
    authentication_classes: list = []
    permission_classes: list = []
    throttle_classes = [AuthThrottle]

    @extend_schema(
        tags=["Espace usager — Auth"],
        summary="Connexion citoyen",
        request=LoginCitizenSerializer,
    )
    def post(self, request):
        serializer = LoginCitizenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        citizen = LoginCitizen(DjangoAccountRepository()).execute(
            LoginCitizenCommand(email=data["email"], password=data["password"])
        )
        return ok(
            {
                "id": citizen.id,
                "email": citizen.email,
                "nom": citizen.nom,
                "post_nom": citizen.post_nom,
                "prenom": citizen.prenom,
                "telephone": citizen.telephone,
                "locale": citizen.locale,
                "token": citizen.token,
            }
        )


def _unauthorized() -> Response:
    return Response(
        {
            "success": False,
            "data": None,
            "error": {"message": "Authentification requise.", "code": "unauthorized"},
        },
        status=status.HTTP_401_UNAUTHORIZED,
    )


class MeCitizenView(APIView):
    """Profil de l'usager authentifié (token)."""

    permission_classes = [IsAuthenticated]

    @extend_schema(tags=["Espace usager — Auth"], summary="Profil courant")
    def get(self, request):
        profile = DjangoAccountRepository().get_profile(request.user.id)
        if profile is None:
            return _unauthorized()
        return ok(profile)

    @extend_schema(
        tags=["Espace usager — Auth"],
        summary="Mettre à jour le profil",
        request=UpdateProfileSerializer,
    )
    def patch(self, request):
        serializer = UpdateProfileSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        profile = UpdateCitizenProfile(DjangoAccountRepository()).execute(
            request.user.id,
            UpdateProfileCommand(
                nom=data["nom"],
                post_nom=data["post_nom"],
                prenom=data["prenom"],
                telephone=data.get("telephone", ""),
                locale=data.get("locale", "fr"),
            ),
        )
        return ok(profile)


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        tags=["Espace usager — Auth"],
        summary="Changer le mot de passe",
        request=ChangePasswordSerializer,
    )
    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        ChangeCitizenPassword(DjangoAccountRepository()).execute(
            request.user.id,
            ChangePasswordCommand(
                current_password=data["current_password"],
                new_password=data["new_password"],
                new_password_confirm=data["new_password_confirm"],
            ),
        )
        return ok({"message": "Mot de passe mis à jour."})


class VisaPreApplicationListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get_throttles(self):
        if self.request.method == "POST":
            return [VisaPreApplicationThrottle()]
        return super().get_throttles()

    @extend_schema(tags=["Espace usager — Visas"], summary="Lister mes pré-demandes")
    def get(self, request):
        items = ListVisaPreApplications(DjangoVisaPreApplicationRepository()).execute(
            request.user.id
        )
        return ok(list(items), meta={"count": len(items)})

    @extend_schema(
        tags=["Espace usager — Visas"],
        summary="Soumettre une pré-demande de visa",
        request=VisaPreApplicationSerializer,
    )
    def post(self, request):
        serializer = VisaPreApplicationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        created = SubmitVisaPreApplication(DjangoVisaPreApplicationRepository()).execute(
            VisaPreApplicationCommand(
                user_id=request.user.id,
                visa_type=data["visa_type"],
                nom=data["nom"],
                post_nom=data["post_nom"],
                prenom=data["prenom"],
                date_naissance=data["date_naissance"],
                nationalite=data["nationalite"],
                sexe=data["sexe"],
                email=data["email"],
                telephone=data["telephone"],
                passeport_numero=data["passeport_numero"],
                passeport_delivre_le=data["passeport_delivre_le"],
                passeport_expire_le=data["passeport_expire_le"],
                passeport_delivre_par=data["passeport_delivre_par"],
                date_entree_prevue=data["date_entree_prevue"],
                date_sortie_prevue=data["date_sortie_prevue"],
                motif_voyage=data["motif_voyage"],
                lieu_destination=data["lieu_destination"],
                hebergement_type=data["hebergement_type"],
                hebergement_adresse=data["hebergement_adresse"],
                hebergement_contact=data["hebergement_contact"],
                accept_conditions=data.get("accept_conditions", False),
                locale=data.get("locale", "fr"),
            )
        )
        return ok(
            {
                **created,
                "message": (
                    "Brouillon créé. Téléversez les pièces obligatoires puis soumettez "
                    "la pré-demande. Ce n'est pas une délivrance de visa."
                ),
            },
            status_code=status.HTTP_201_CREATED,
        )


class VisaPreApplicationDetailView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(tags=["Espace usager — Visas"], summary="Détail d'une pré-demande")
    def get(self, request, reference: str):
        item = GetVisaPreApplication(DjangoVisaPreApplicationRepository()).execute(
            request.user.id, reference
        )
        return ok(item)


def _guess_upload_content_type(uploaded) -> str:
    ctype = (getattr(uploaded, "content_type", None) or "").lower()
    if ctype in {"application/pdf", "image/jpeg", "image/png"}:
        return ctype
    name = (getattr(uploaded, "name", "") or "").lower()
    if name.endswith(".pdf"):
        return "application/pdf"
    if name.endswith((".jpg", ".jpeg")):
        return "image/jpeg"
    if name.endswith(".png"):
        return "image/png"
    return ctype or "application/octet-stream"


class VisaDocumentUploadView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [VisaPreApplicationThrottle]

    def get_parsers(self):
        from rest_framework.parsers import FormParser, MultiPartParser

        return [MultiPartParser(), FormParser()]

    @extend_schema(
        tags=["Espace usager — Visas"],
        summary="Téléverser une pièce justificative",
        request=VisaDocumentUploadSerializer,
    )
    def post(self, request, reference: str):
        serializer = VisaDocumentUploadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        uploaded = data["file"]
        content = uploaded.read()
        doc = AttachVisaDocument(DjangoVisaPreApplicationRepository()).execute(
            VisaDocumentUploadCommand(
                user_id=request.user.id,
                reference=reference,
                doc_type=data["doc_type"],
                original_name=getattr(uploaded, "name", "fichier") or "fichier",
                content_type=_guess_upload_content_type(uploaded),
                size_bytes=len(content),
                file_bytes=content,
            )
        )
        return ok(doc, status_code=status.HTTP_201_CREATED)


class VisaFinalizeView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [VisaPreApplicationThrottle]

    @extend_schema(
        tags=["Espace usager — Visas"],
        summary="Soumettre définitivement une pré-demande",
        request=VisaFinalizeSerializer,
    )
    def post(self, request, reference: str):
        serializer = VisaFinalizeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        finalized = FinalizeVisaPreApplication(DjangoVisaPreApplicationRepository()).execute(
            request.user.id,
            reference,
            accept_conditions=serializer.validated_data["accept_conditions"],
        )
        return ok(
            {
                **finalized,
                "message": (
                    "Pré-demande soumise. Conservez votre numéro de référence. "
                    "La décision finale appartient aux autorités compétentes."
                ),
            }
        )


class CitizenCasesListView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(tags=["Espace usager — Dossiers"], summary="Liste agrégée de mes dossiers")
    def get(self, request):
        items = ListCitizenCases(DjangoCitizenCasesRepository()).execute(request.user.id)
        return ok(list(items), meta={"count": len(items)})


class PassportRequestCreateView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        tags=["Espace usager — Passeport"],
        summary="Soumettre une demande de passeport",
        request=PassportRequestSerializer,
    )
    def post(self, request):
        serializer = PassportRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        created = SubmitPassportRequest(DjangoPassportRequestRepository()).execute(
            PassportRequestCommand(
                user_id=request.user.id,
                request_kind=data["request_kind"],
                nom=data["nom"],
                post_nom=data["post_nom"],
                prenom=data["prenom"],
                date_naissance=data["date_naissance"],
                lieu_naissance=data["lieu_naissance"],
                numero_passeport_actuel=data.get("numero_passeport_actuel", ""),
                telephone=data["telephone"],
                email=data["email"],
                motif=data["motif"],
                locale=data.get("locale", "fr"),
            )
        )
        return ok(
            {
                **created,
                "message": (
                    "Demande de passeport enregistrée. Ce n'est pas une délivrance. "
                    "Présentez-vous ensuite au service consulaire avec les originaux."
                ),
            },
            status_code=status.HTTP_201_CREATED,
        )


class AppointmentListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(tags=["Espace usager — Rendez-vous"], summary="Lister mes rendez-vous")
    def get(self, request):
        items = ListAppointments(DjangoAppointmentRepository()).execute(request.user.id)
        return ok(list(items), meta={"count": len(items)})

    @extend_schema(
        tags=["Espace usager — Rendez-vous"],
        summary="Demander un rendez-vous",
        request=AppointmentSerializer,
    )
    def post(self, request):
        serializer = AppointmentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        created = RequestAppointment(DjangoAppointmentRepository()).execute(
            AppointmentCommand(
                user_id=request.user.id,
                service_type=data["service_type"],
                preferred_date=data["preferred_date"],
                preferred_slot=data["preferred_slot"],
                notes=data.get("notes", ""),
                related_case_reference=data.get("related_case_reference", ""),
                locale=data.get("locale", "fr"),
            )
        )
        return ok(created, status_code=status.HTTP_201_CREATED)


class NotificationListView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(tags=["Espace usager — Notifications"], summary="Lister mes notifications")
    def get(self, request):
        unread = request.query_params.get("unread") == "1"
        repo = DjangoNotificationRepository()
        items = ListNotifications(repo).execute(request.user.id, unread_only=unread)
        unread_count = UnreadNotificationCount(repo).execute(request.user.id)
        return ok(list(items), meta={"count": len(items), "unread_count": unread_count})


class NotificationUnreadCountView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(tags=["Espace usager — Notifications"], summary="Nombre de non lues")
    def get(self, request):
        count = UnreadNotificationCount(DjangoNotificationRepository()).execute(request.user.id)
        return ok({"unread_count": count})


class NotificationReadView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(tags=["Espace usager — Notifications"], summary="Marquer une notification lue")
    def post(self, request, notification_id: int):
        MarkNotificationRead(DjangoNotificationRepository()).execute(
            request.user.id, notification_id
        )
        return ok({"id": notification_id, "is_read": True})


class NotificationMarkAllReadView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(tags=["Espace usager — Notifications"], summary="Tout marquer comme lu")
    def post(self, request):
        updated = MarkAllNotificationsRead(DjangoNotificationRepository()).execute(request.user.id)
        return ok({"updated": updated})


class AppointmentPdfView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(tags=["Espace usager — RDV"], summary="Télécharger la convocation PDF + QR")
    def get(self, request, reference: str):
        from django.http import HttpResponse
        from apps.accounts.models import Appointment
        from infrastructure.notifications.pdf_qr import generate_appointment_pdf

        try:
            appt = Appointment.objects.select_related("user").get(
                user_id=request.user.id, reference=reference
            )
        except Appointment.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "data": None,
                    "error": {"message": "Rendez-vous introuvable.", "code": "not_found"},
                },
                status=status.HTTP_404_NOT_FOUND,
            )
        pdf = generate_appointment_pdf(
            reference=appt.reference,
            applicant=request.user.get_full_name() or request.user.email,
            email=request.user.email,
            service_type=appt.service_type,
            preferred_date=appt.preferred_date,
            preferred_slot=appt.preferred_slot,
            status=appt.status,
        )
        response = HttpResponse(pdf, content_type="application/pdf")
        response["Content-Disposition"] = f'attachment; filename="convocation-{reference}.pdf"'
        return response


class CaseHistoryListView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(tags=["Espace usager — Historique"], summary="Historique de mes dossiers")
    def get(self, request):
        items = ListCaseHistory(DjangoCaseEventRepository()).execute(request.user.id)
        return ok(list(items), meta={"count": len(items)})
