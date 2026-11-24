"""
Repositories Django ORM — adaptateurs des ports application.
"""

from __future__ import annotations

from typing import Optional, Sequence

from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

from django.core.files.base import ContentFile

from apps.accounts.models import CitizenProfile, VisaPreApplication, VisaSupportingDocument
from apps.public_content.models import (
    CivilStatusRequest,
    ConsularRegistrationRequest,
    ConsularService,
    ContactMessage,
    FaqItem,
    NewsArticle,
    VisaCategory,
)
from domain.entities import (
    AuthenticatedCitizen,
    CivilStatusSubmission,
    ConsularRegistrationSubmission,
    ConsularServiceEntity,
    ContactSubmission,
    FaqEntity,
    LocalizedText,
    LoginCitizenCommand,
    NewsEntity,
    RegisterCitizenCommand,
    UpdateProfileCommand,
    VisaCategoryEntity,
    VisaPreApplicationCommand,
)


def _loc(fr: str, en: str = "", ko: str = "") -> LocalizedText:
    return LocalizedText(fr=fr, en=en, ko=ko)


class DjangoNewsRepository:
    def list_published(self, *, limit: int = 20) -> Sequence[NewsEntity]:
        qs = NewsArticle.objects.filter(is_published=True).order_by(
            "-published_at", "-created_at"
        )[:limit]
        return [self._to_entity(obj) for obj in qs]

    def get_by_slug(self, slug: str) -> Optional[NewsEntity]:
        try:
            obj = NewsArticle.objects.get(slug=slug, is_published=True)
        except NewsArticle.DoesNotExist:
            return None
        return self._to_entity(obj)

    @staticmethod
    def _to_entity(obj: NewsArticle) -> NewsEntity:
        return NewsEntity(
            slug=obj.slug,
            category=obj.category,
            title=_loc(obj.title_fr, obj.title_en, obj.title_ko),
            summary=_loc(obj.summary_fr, obj.summary_en, obj.summary_ko),
            body=_loc(obj.body_fr, obj.body_en, obj.body_ko),
            published_at=obj.published_at,
            is_provisional=obj.is_provisional,
        )


class DjangoFaqRepository:
    def list_published(
        self, *, category: Optional[str] = None, limit: int = 50
    ) -> Sequence[FaqEntity]:
        qs = FaqItem.objects.filter(is_published=True)
        if category:
            qs = qs.filter(category=category)
        qs = qs[:limit]
        return [
            FaqEntity(
                id=obj.id,
                category=obj.category,
                question=_loc(obj.question_fr, obj.question_en, obj.question_ko),
                answer=_loc(obj.answer_fr, obj.answer_en, obj.answer_ko),
                is_provisional=obj.is_provisional,
            )
            for obj in qs
        ]


class DjangoConsularServiceRepository:
    def list_published(self, *, limit: int = 50) -> Sequence[ConsularServiceEntity]:
        qs = ConsularService.objects.filter(is_published=True)[:limit]
        return [self._to_entity(obj) for obj in qs]

    def get_by_slug(self, slug: str) -> Optional[ConsularServiceEntity]:
        try:
            obj = ConsularService.objects.get(slug=slug, is_published=True)
        except ConsularService.DoesNotExist:
            return None
        return self._to_entity(obj)

    @staticmethod
    def _to_entity(obj: ConsularService) -> ConsularServiceEntity:
        return ConsularServiceEntity(
            slug=obj.slug,
            title=_loc(obj.title_fr, obj.title_en, obj.title_ko),
            summary=_loc(obj.summary_fr, obj.summary_en, obj.summary_ko),
            conditions=_loc(obj.conditions_fr, obj.conditions_en, obj.conditions_ko),
            documents=_loc(obj.documents_fr, obj.documents_en, obj.documents_ko),
            tariff_note_fr=obj.tariff_note_fr,
            delay_note_fr=obj.delay_note_fr,
            requires_account=obj.requires_account,
            is_provisional=obj.is_provisional,
        )


class DjangoVisaCategoryRepository:
    def list_published(self, *, limit: int = 50) -> Sequence[VisaCategoryEntity]:
        qs = VisaCategory.objects.filter(is_published=True)[:limit]
        return [self._to_entity(obj) for obj in qs]

    def get_by_slug(self, slug: str) -> Optional[VisaCategoryEntity]:
        try:
            obj = VisaCategory.objects.get(slug=slug, is_published=True)
        except VisaCategory.DoesNotExist:
            return None
        return self._to_entity(obj)

    @staticmethod
    def _to_entity(obj: VisaCategory) -> VisaCategoryEntity:
        return VisaCategoryEntity(
            slug=obj.slug,
            title=_loc(obj.title_fr, obj.title_en, obj.title_ko),
            description=_loc(obj.description_fr, obj.description_en, obj.description_ko),
            eligibility_fr=obj.eligibility_fr,
            documents_fr=obj.documents_fr,
            tariff_note_fr=obj.tariff_note_fr,
            validity_note_fr=obj.validity_note_fr,
            is_provisional=obj.is_provisional,
        )


class DjangoContactRepository:
    def create(self, submission: ContactSubmission) -> int:
        obj = ContactMessage.objects.create(
            category=submission.category,
            full_name=submission.full_name.strip(),
            email=submission.email.strip().lower(),
            phone=submission.phone.strip(),
            subject=submission.subject.strip(),
            message=submission.message.strip(),
            locale=submission.locale,
            ip_address=submission.ip_address,
        )
        return obj.id


class DjangoCivilStatusRepository:
    def create(self, submission: CivilStatusSubmission) -> dict:
        from apps.accounts.case_utils import generate_case_reference
        from apps.accounts.models import CaseEvent, UserNotification

        reference = generate_case_reference("CIV")
        obj = CivilStatusRequest.objects.create(
            document_type=submission.document_type,
            nom=submission.nom.strip(),
            post_nom=submission.post_nom.strip(),
            prenom=submission.prenom.strip(),
            sexe=submission.sexe,
            etat_civil=submission.etat_civil,
            date_naissance=submission.date_naissance.strip(),
            lieu_naissance=submission.lieu_naissance.strip(),
            pays_naissance=submission.pays_naissance.strip(),
            nationalite=submission.nationalite.strip(),
            profession=submission.profession.strip(),
            numero_passeport=submission.numero_passeport.strip(),
            email=submission.email.strip().lower(),
            telephone=submission.telephone.strip(),
            password_hash=make_password(submission.password),
            adresse_coree=submission.adresse_coree.strip(),
            adresse_rdc=submission.adresse_rdc.strip(),
            nom_pere=submission.nom_pere.strip(),
            prenom_pere=submission.prenom_pere.strip(),
            nom_mere=submission.nom_mere.strip(),
            prenom_mere=submission.prenom_mere.strip(),
            motif=submission.motif.strip(),
            locale=submission.locale,
            ip_address=submission.ip_address,
            reference=reference,
            status="submitted",
            user_id=submission.user_id,
        )
        if submission.user_id:
            CaseEvent.objects.create(
                user_id=submission.user_id,
                case_type="civil",
                case_reference=reference,
                event_type="submitted",
                message="Demande d'état civil enregistrée.",
            )
            UserNotification.objects.create(
                user_id=submission.user_id,
                title="Demande d'état civil",
                body=f"Votre dossier {reference} a été enregistré.",
                link="/compte/dossiers",
            )
        return {"id": obj.id, "reference": reference}

    def list_for_user(self, user_id: int) -> list[dict]:
        qs = CivilStatusRequest.objects.filter(user_id=user_id).order_by("-created_at")
        return [
            {
                "case_type": "civil",
                "id": o.id,
                "reference": o.reference or f"CIV-{o.id}",
                "status": o.status,
                "title": o.document_type,
                "created_at": o.created_at.isoformat() if o.created_at else None,
            }
            for o in qs
        ]


class DjangoConsularRegistrationRepository:
    def create(self, submission: ConsularRegistrationSubmission) -> dict:
        from apps.accounts.case_utils import generate_case_reference
        from apps.accounts.models import CaseEvent, UserNotification

        reference = generate_case_reference("CONS")
        obj = ConsularRegistrationRequest.objects.create(
            nom=submission.nom.strip(),
            post_nom=submission.post_nom.strip(),
            prenom=submission.prenom.strip(),
            sexe=submission.sexe,
            etat_civil=submission.etat_civil,
            date_naissance=submission.date_naissance.strip(),
            lieu_naissance=submission.lieu_naissance.strip(),
            pays_naissance=submission.pays_naissance.strip(),
            nationalite=submission.nationalite.strip(),
            profession=submission.profession.strip(),
            numero_passeport=submission.numero_passeport.strip(),
            email=submission.email.strip().lower(),
            telephone=submission.telephone.strip(),
            password_hash=make_password(submission.password),
            adresse_rue=submission.adresse_rue.strip(),
            adresse_numero=submission.adresse_numero.strip(),
            ville=submission.ville.strip(),
            code_postal=submission.code_postal.strip(),
            type_sejour=submission.type_sejour.strip(),
            adresse_rdc=submission.adresse_rdc.strip(),
            nom_pere=submission.nom_pere.strip(),
            prenom_pere=submission.prenom_pere.strip(),
            nom_mere=submission.nom_mere.strip(),
            prenom_mere=submission.prenom_mere.strip(),
            contact_urgence_nom=submission.contact_urgence_nom.strip(),
            contact_urgence_telephone=submission.contact_urgence_telephone.strip(),
            contact_urgence_lien=submission.contact_urgence_lien.strip(),
            locale=submission.locale,
            ip_address=submission.ip_address,
            reference=reference,
            status="submitted",
            user_id=submission.user_id,
        )
        if submission.user_id:
            CaseEvent.objects.create(
                user_id=submission.user_id,
                case_type="consular",
                case_reference=reference,
                event_type="submitted",
                message="Demande d'enregistrement consulaire enregistrée.",
            )
            UserNotification.objects.create(
                user_id=submission.user_id,
                title="Enregistrement consulaire",
                body=f"Votre dossier {reference} a été enregistré.",
                link="/compte/dossiers",
            )
        return {"id": obj.id, "reference": reference}

    def list_for_user(self, user_id: int) -> list[dict]:
        qs = ConsularRegistrationRequest.objects.filter(user_id=user_id).order_by("-created_at")
        return [
            {
                "case_type": "consular",
                "id": o.id,
                "reference": o.reference or f"CONS-{o.id}",
                "status": o.status,
                "title": f"{o.nom} {o.prenom}",
                "created_at": o.created_at.isoformat() if o.created_at else None,
            }
            for o in qs
        ]


class DjangoAccountRepository:
    def email_exists(self, email: str) -> bool:
        normalized = email.strip().lower()
        return User.objects.filter(email__iexact=normalized).exists()

    def create_citizen(self, command: RegisterCitizenCommand) -> int:
        email = command.email.strip().lower()
        user = User.objects.create_user(
            username=email,
            email=email,
            password=command.password,
            first_name=command.prenom.strip(),
            last_name=command.nom.strip(),
        )
        CitizenProfile.objects.create(
            user=user,
            nom=command.nom.strip(),
            post_nom=command.post_nom.strip(),
            prenom=command.prenom.strip(),
            telephone=command.telephone.strip(),
            locale=command.locale,
        )
        return user.id

    def authenticate(self, command: LoginCitizenCommand) -> AuthenticatedCitizen | None:
        email = command.email.strip().lower()
        user = authenticate(username=email, password=command.password)
        if user is None or not user.is_active:
            return None
        profile, _ = CitizenProfile.objects.get_or_create(
            user=user,
            defaults={
                "nom": user.last_name or "—",
                "post_nom": "—",
                "prenom": user.first_name or "—",
                "telephone": "",
                "locale": "fr",
            },
        )
        token, _ = Token.objects.get_or_create(user=user)
        return AuthenticatedCitizen(
            id=user.id,
            email=user.email,
            nom=profile.nom,
            post_nom=profile.post_nom,
            prenom=profile.prenom,
            telephone=profile.telephone,
            locale=profile.locale,
            token=token.key,
        )

    def get_profile(self, user_id: int) -> dict | None:
        try:
            user = User.objects.select_related("citizen_profile").get(pk=user_id)
        except User.DoesNotExist:
            return None
        profile = getattr(user, "citizen_profile", None)
        if profile is None:
            return None
        return {
            "id": user.id,
            "email": user.email,
            "nom": profile.nom,
            "post_nom": profile.post_nom,
            "prenom": profile.prenom,
            "telephone": profile.telephone,
            "locale": profile.locale,
        }

    def update_profile(self, user_id: int, command: UpdateProfileCommand) -> dict:
        user = User.objects.get(pk=user_id)
        profile = user.citizen_profile
        profile.nom = command.nom.strip()
        profile.post_nom = command.post_nom.strip()
        profile.prenom = command.prenom.strip()
        profile.telephone = command.telephone.strip()
        profile.locale = command.locale
        profile.save()
        user.first_name = profile.prenom
        user.last_name = profile.nom
        user.save(update_fields=["first_name", "last_name"])
        return self.get_profile(user_id) or {}

    def check_password(self, user_id: int, password: str) -> bool:
        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return False
        return user.check_password(password)

    def set_password(self, user_id: int, password: str) -> None:
        user = User.objects.get(pk=user_id)
        user.set_password(password)
        user.save(update_fields=["password"])
        # Invalider toutes les sessions token après changement de mot de passe.
        Token.objects.filter(user_id=user_id).delete()


def _visa_doc_to_dict(doc: VisaSupportingDocument) -> dict:
    return {
        "id": doc.id,
        "doc_type": doc.doc_type,
        "original_name": doc.original_name,
        "content_type": doc.content_type,
        "size_bytes": doc.size_bytes,
        "uploaded_at": doc.uploaded_at.isoformat() if doc.uploaded_at else None,
    }


def _visa_to_dict(obj: VisaPreApplication) -> dict:
    docs = [_visa_doc_to_dict(d) for d in obj.documents.all()]
    return {
        "id": obj.id,
        "reference": obj.reference,
        "visa_type": obj.visa_type,
        "status": obj.status,
        "nom": obj.nom,
        "post_nom": obj.post_nom,
        "prenom": obj.prenom,
        "date_naissance": obj.date_naissance,
        "nationalite": obj.nationalite,
        "sexe": obj.sexe,
        "email": obj.email,
        "telephone": obj.telephone,
        "passeport_numero": obj.passeport_numero,
        "passeport_delivre_le": obj.passeport_delivre_le,
        "passeport_expire_le": obj.passeport_expire_le,
        "passeport_delivre_par": obj.passeport_delivre_par,
        "date_entree_prevue": obj.date_entree_prevue,
        "date_sortie_prevue": obj.date_sortie_prevue,
        "motif_voyage": obj.motif_voyage,
        "lieu_destination": obj.lieu_destination,
        "hebergement_type": obj.hebergement_type,
        "hebergement_adresse": obj.hebergement_adresse,
        "hebergement_contact": obj.hebergement_contact,
        "accept_conditions": obj.accept_conditions,
        "locale": obj.locale,
        "created_at": obj.created_at.isoformat() if obj.created_at else None,
        "documents": docs,
    }


class DjangoVisaPreApplicationRepository:
    def create(self, command: VisaPreApplicationCommand) -> dict:
        reference = VisaPreApplication.generate_reference()
        obj = VisaPreApplication.objects.create(
            user_id=command.user_id,
            reference=reference,
            visa_type=command.visa_type,
            status=VisaPreApplication.Status.DRAFT,
            nom=command.nom.strip(),
            post_nom=command.post_nom.strip(),
            prenom=command.prenom.strip(),
            date_naissance=command.date_naissance.strip(),
            nationalite=command.nationalite.strip(),
            sexe=command.sexe,
            email=command.email.strip().lower(),
            telephone=command.telephone.strip(),
            passeport_numero=command.passeport_numero.strip(),
            passeport_delivre_le=command.passeport_delivre_le.strip(),
            passeport_expire_le=command.passeport_expire_le.strip(),
            passeport_delivre_par=command.passeport_delivre_par.strip(),
            date_entree_prevue=command.date_entree_prevue.strip(),
            date_sortie_prevue=command.date_sortie_prevue.strip(),
            motif_voyage=command.motif_voyage.strip(),
            lieu_destination=command.lieu_destination.strip(),
            hebergement_type=command.hebergement_type.strip(),
            hebergement_adresse=command.hebergement_adresse.strip(),
            hebergement_contact=command.hebergement_contact.strip(),
            accept_conditions=False,
            locale=command.locale,
        )
        return _visa_to_dict(obj)

    def list_for_user(self, user_id: int) -> list[dict]:
        qs = (
            VisaPreApplication.objects.filter(user_id=user_id)
            .prefetch_related("documents")
            .order_by("-created_at")
        )
        return [_visa_to_dict(obj) for obj in qs]

    def get_for_user(self, user_id: int, reference: str) -> dict | None:
        try:
            obj = VisaPreApplication.objects.prefetch_related("documents").get(
                user_id=user_id, reference=reference
            )
        except VisaPreApplication.DoesNotExist:
            return None
        return _visa_to_dict(obj)

    def save_document(
        self,
        user_id: int,
        reference: str,
        *,
        doc_type: str,
        original_name: str,
        content_type: str,
        size_bytes: int,
        file_bytes: bytes,
    ) -> dict:
        app = VisaPreApplication.objects.get(user_id=user_id, reference=reference)
        existing = VisaSupportingDocument.objects.filter(
            application=app, doc_type=doc_type
        ).first()
        if existing is not None:
            if existing.file:
                existing.file.delete(save=False)
            existing.delete()
        doc = VisaSupportingDocument(
            application=app,
            doc_type=doc_type,
            original_name=original_name,
            content_type=content_type,
            size_bytes=size_bytes,
        )
        doc.file.save(original_name, ContentFile(file_bytes), save=True)
        return _visa_doc_to_dict(doc)

    def list_document_types(self, user_id: int, reference: str) -> list[str]:
        return list(
            VisaSupportingDocument.objects.filter(
                application__user_id=user_id,
                application__reference=reference,
            ).values_list("doc_type", flat=True)
        )

    def finalize(self, user_id: int, reference: str) -> dict:
        from apps.accounts.models import CaseEvent
        from infrastructure.notifications.service import notify_user

        obj = VisaPreApplication.objects.prefetch_related("documents").get(
            user_id=user_id, reference=reference
        )
        obj.status = VisaPreApplication.Status.SUBMITTED
        obj.accept_conditions = True
        obj.save(update_fields=["status", "accept_conditions", "updated_at"])
        CaseEvent.objects.create(
            user_id=user_id,
            case_type="visa",
            case_reference=reference,
            event_type="submitted",
            message="Pré-demande de visa soumise.",
        )
        notify_user(
            user_id=user_id,
            email=obj.email,
            title="Pré-demande de visa",
            body=f"Votre dossier {reference} a été soumis.",
            link=f"/compte/visas/{reference}",
        )
        required = {"passport", "photo"}
        present = {d.doc_type for d in obj.documents.all()}
        missing = sorted(required - present)
        if missing:
            notify_user(
                user_id=user_id,
                email=obj.email,
                title="Documents manquants",
                body=(
                    f"Votre dossier {reference} a été reçu, mais des pièces manquent : "
                    + ", ".join(missing)
                    + ". Merci de les déposer depuis votre espace."
                ),
                link=f"/compte/visas/{reference}",
            )
        return _visa_to_dict(obj)


class DjangoPassportRequestRepository:
    def create(self, command) -> dict:
        from apps.accounts.case_utils import generate_case_reference
        from apps.accounts.models import CaseEvent, PassportRequest
        from infrastructure.notifications.service import notify_user

        reference = generate_case_reference("PASS")
        obj = PassportRequest.objects.create(
            user_id=command.user_id,
            reference=reference,
            request_kind=command.request_kind,
            nom=command.nom.strip(),
            post_nom=command.post_nom.strip(),
            prenom=command.prenom.strip(),
            date_naissance=command.date_naissance.strip(),
            lieu_naissance=command.lieu_naissance.strip(),
            numero_passeport_actuel=command.numero_passeport_actuel.strip(),
            telephone=command.telephone.strip(),
            email=command.email.strip().lower(),
            motif=command.motif.strip(),
            locale=command.locale,
        )
        CaseEvent.objects.create(
            user_id=command.user_id,
            case_type="passport",
            case_reference=reference,
            event_type="submitted",
            message="Demande de passeport enregistrée.",
        )
        notify_user(
            user_id=command.user_id,
            email=obj.email,
            phone=obj.telephone,
            title="Demande de passeport",
            body=f"Votre dossier {reference} a été enregistré.",
            link="/compte/dossiers",
        )
        return {
            "case_type": "passport",
            "id": obj.id,
            "reference": obj.reference,
            "status": obj.status,
            "title": obj.request_kind,
            "created_at": obj.created_at.isoformat() if obj.created_at else None,
        }

    def list_for_user(self, user_id: int) -> list[dict]:
        from apps.accounts.models import PassportRequest

        qs = PassportRequest.objects.filter(user_id=user_id).order_by("-created_at")
        return [
            {
                "case_type": "passport",
                "id": o.id,
                "reference": o.reference,
                "status": o.status,
                "title": o.request_kind,
                "created_at": o.created_at.isoformat() if o.created_at else None,
            }
            for o in qs
        ]


class DjangoAppointmentRepository:
    def create(self, command) -> dict:
        from apps.accounts.case_utils import generate_case_reference
        from apps.accounts.models import Appointment, CaseEvent
        from infrastructure.notifications.service import notify_appointment

        reference = generate_case_reference("RDV")
        obj = Appointment.objects.create(
            user_id=command.user_id,
            reference=reference,
            service_type=command.service_type,
            preferred_date=command.preferred_date.strip(),
            preferred_slot=command.preferred_slot.strip(),
            notes=command.notes.strip(),
            related_case_reference=command.related_case_reference.strip(),
            locale=command.locale,
        )
        CaseEvent.objects.create(
            user_id=command.user_id,
            case_type="appointment",
            case_reference=reference,
            event_type="requested",
            message="Demande de rendez-vous enregistrée.",
        )
        user_email = ""
        try:
            from django.contrib.auth.models import User

            user_email = User.objects.get(pk=command.user_id).email
        except User.DoesNotExist:
            user_email = ""
        notify_appointment(
            user_id=command.user_id,
            email=user_email,
            reference=reference,
            status=obj.status,
            preferred_date=obj.preferred_date,
            preferred_slot=obj.preferred_slot,
            kind="update",
        )
        return {
            "id": obj.id,
            "reference": obj.reference,
            "status": obj.status,
            "service_type": obj.service_type,
            "preferred_date": obj.preferred_date,
            "preferred_slot": obj.preferred_slot,
            "notes": obj.notes,
            "related_case_reference": obj.related_case_reference,
            "created_at": obj.created_at.isoformat() if obj.created_at else None,
        }

    def list_for_user(self, user_id: int) -> list[dict]:
        from apps.accounts.models import Appointment

        qs = Appointment.objects.filter(user_id=user_id).order_by("-created_at")
        return [
            {
                "id": o.id,
                "reference": o.reference,
                "status": o.status,
                "service_type": o.service_type,
                "preferred_date": o.preferred_date,
                "preferred_slot": o.preferred_slot,
                "notes": o.notes,
                "related_case_reference": o.related_case_reference,
                "created_at": o.created_at.isoformat() if o.created_at else None,
            }
            for o in qs
        ]


class DjangoNotificationRepository:
    def list_for_user(self, user_id: int, *, unread_only: bool = False) -> list[dict]:
        from apps.accounts.models import UserNotification

        qs = UserNotification.objects.filter(user_id=user_id)
        if unread_only:
            qs = qs.filter(is_read=False)
        return [
            {
                "id": n.id,
                "title": n.title,
                "body": n.body,
                "link": n.link,
                "is_read": n.is_read,
                "created_at": n.created_at.isoformat() if n.created_at else None,
            }
            for n in qs.order_by("-created_at")[:50]
        ]

    def mark_read(self, user_id: int, notification_id: int) -> None:
        from apps.accounts.models import UserNotification

        UserNotification.objects.filter(user_id=user_id, id=notification_id).update(is_read=True)

    def mark_all_read(self, user_id: int) -> int:
        from apps.accounts.models import UserNotification

        return UserNotification.objects.filter(user_id=user_id, is_read=False).update(is_read=True)

    def unread_count(self, user_id: int) -> int:
        from apps.accounts.models import UserNotification

        return UserNotification.objects.filter(user_id=user_id, is_read=False).count()

    def create(self, user_id: int, *, title: str, body: str, link: str = "") -> dict:
        from infrastructure.notifications.service import notify_user

        result = notify_user(
            user_id=user_id,
            email=None,
            title=title,
            body=body,
            link=link,
            channels=("in_app",),
        )
        from apps.accounts.models import UserNotification

        n = UserNotification.objects.filter(pk=result.in_app_id).first()
        if n is None:
            return {"id": 0, "title": title, "body": body, "link": link, "is_read": False, "created_at": None}
        return {
            "id": n.id,
            "title": n.title,
            "body": n.body,
            "link": n.link,
            "is_read": n.is_read,
            "created_at": n.created_at.isoformat() if n.created_at else None,
        }


class DjangoCaseEventRepository:
    def list_for_user(self, user_id: int) -> list[dict]:
        from apps.accounts.models import CaseEvent

        qs = CaseEvent.objects.filter(user_id=user_id).order_by("-created_at")[:100]
        return [
            {
                "id": e.id,
                "case_type": e.case_type,
                "case_reference": e.case_reference,
                "event_type": e.event_type,
                "message": e.message,
                "created_at": e.created_at.isoformat() if e.created_at else None,
            }
            for e in qs
        ]

    def add(
        self,
        user_id: int,
        *,
        case_type: str,
        case_reference: str,
        event_type: str,
        message: str,
    ) -> dict:
        from apps.accounts.models import CaseEvent

        e = CaseEvent.objects.create(
            user_id=user_id,
            case_type=case_type,
            case_reference=case_reference,
            event_type=event_type,
            message=message,
        )
        return {
            "id": e.id,
            "case_type": e.case_type,
            "case_reference": e.case_reference,
            "event_type": e.event_type,
            "message": e.message,
            "created_at": e.created_at.isoformat() if e.created_at else None,
        }


class DjangoCitizenCasesRepository:
    """Agrège les dossiers usager sans dupliquer les formulaires métier."""

    def list_for_user(self, user_id: int) -> list[dict]:
        items: list[dict] = []
        items.extend(DjangoConsularRegistrationRepository().list_for_user(user_id))
        items.extend(DjangoCivilStatusRepository().list_for_user(user_id))
        items.extend(DjangoPassportRequestRepository().list_for_user(user_id))
        for visa in DjangoVisaPreApplicationRepository().list_for_user(user_id):
            items.append(
                {
                    "case_type": "visa",
                    "id": visa["id"],
                    "reference": visa["reference"],
                    "status": visa["status"],
                    "title": visa["visa_type"],
                    "created_at": visa.get("created_at"),
                    "detail_path": f"/compte/visas/{visa['reference']}",
                }
            )
        items.sort(key=lambda x: x.get("created_at") or "", reverse=True)
        return items
