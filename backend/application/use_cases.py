"""
Cas d'usage du portail public.

Chaque classe orchestre un scénario métier sans dépendre de Django.
"""

from __future__ import annotations

import re
from typing import Optional, Sequence

from application.ports import (
    AccountRepositoryPort,
    AppointmentRepositoryPort,
    CaseEventRepositoryPort,
    CivilStatusRepositoryPort,
    ConsularRegistrationRepositoryPort,
    ConsularServiceRepositoryPort,
    ContactRepositoryPort,
    FaqRepositoryPort,
    NewsRepositoryPort,
    NotificationRepositoryPort,
    PassportRequestRepositoryPort,
    VisaCategoryRepositoryPort,
    VisaPreApplicationRepositoryPort,
)
from domain.entities import (
    AppointmentCommand,
    AuthenticatedCitizen,
    ChangePasswordCommand,
    CivilStatusSubmission,
    ConsularRegistrationSubmission,
    ConsularServiceEntity,
    ContactSubmission,
    FaqEntity,
    LoginCitizenCommand,
    NewsEntity,
    PassportRequestCommand,
    RegisterCitizenCommand,
    UpdateProfileCommand,
    VisaCategoryEntity,
    VisaDocumentUploadCommand,
    VisaPreApplicationCommand,
)

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
ALLOWED_CONTACT_CATEGORIES = {
    "visa",
    "passport",
    "civil",
    "consular_card",
    "assistance",
    "economic",
    "press",
    "other",
}
ALLOWED_SEXES = {"M", "F"}
ALLOWED_ETAT_CIVIL = {
    "celibataire",
    "marie",
    "divorce",
    "veuf",
    "autre",
}
ALLOWED_CIVIL_DOCUMENTS = {
    "composition_familiale",
    "certificat_mariage",
    "certificat_nationalite",
    "attestation_naissance",
    "certificat_deces",
    "certificat_celibat",
    "laissez_passer",
    "legalisation",
    "autre",
}
ALLOWED_LOCALES = {"fr", "en", "ko"}


class ValidationError(Exception):
    """Erreur de validation métier exposable à l'API."""

    def __init__(self, message: str, *, field: Optional[str] = None) -> None:
        super().__init__(message)
        self.message = message
        self.field = field


class ListPublishedNews:
    def __init__(self, repo: NewsRepositoryPort) -> None:
        self._repo = repo

    def execute(self, *, limit: int = 20) -> Sequence[NewsEntity]:
        return self._repo.list_published(limit=max(1, min(limit, 50)))


class GetNewsBySlug:
    def __init__(self, repo: NewsRepositoryPort) -> None:
        self._repo = repo

    def execute(self, slug: str) -> Optional[NewsEntity]:
        return self._repo.get_by_slug(slug)


class ListPublishedFaq:
    def __init__(self, repo: FaqRepositoryPort) -> None:
        self._repo = repo

    def execute(
        self, *, category: Optional[str] = None, limit: int = 50
    ) -> Sequence[FaqEntity]:
        return self._repo.list_published(
            category=category, limit=max(1, min(limit, 50))
        )


class ListConsularServices:
    def __init__(self, repo: ConsularServiceRepositoryPort) -> None:
        self._repo = repo

    def execute(self, *, limit: int = 50) -> Sequence[ConsularServiceEntity]:
        return self._repo.list_published(limit=max(1, min(limit, 50)))


class GetConsularService:
    def __init__(self, repo: ConsularServiceRepositoryPort) -> None:
        self._repo = repo

    def execute(self, slug: str) -> Optional[ConsularServiceEntity]:
        return self._repo.get_by_slug(slug)


class ListVisaCategories:
    def __init__(self, repo: VisaCategoryRepositoryPort) -> None:
        self._repo = repo

    def execute(self, *, limit: int = 50) -> Sequence[VisaCategoryEntity]:
        return self._repo.list_published(limit=max(1, min(limit, 50)))


class SubmitContactMessage:
    """Valide et enregistre une demande de contact publique."""

    def __init__(self, repo: ContactRepositoryPort) -> None:
        self._repo = repo

    def execute(self, submission: ContactSubmission) -> int:
        self._validate(submission)
        return self._repo.create(submission)

    def _validate(self, s: ContactSubmission) -> None:
        if s.category not in ALLOWED_CONTACT_CATEGORIES:
            raise ValidationError("Catégorie de contact invalide.", field="category")
        if not s.full_name.strip() or len(s.full_name) > 200:
            raise ValidationError("Nom invalide.", field="full_name")
        if not EMAIL_RE.match(s.email):
            raise ValidationError("Adresse e-mail invalide.", field="email")
        if not s.subject.strip() or len(s.subject) > 255:
            raise ValidationError("Objet invalide.", field="subject")
        if len(s.message.strip()) < 20:
            raise ValidationError(
                "Le message doit contenir au moins 20 caractères.",
                field="message",
            )
        if len(s.message) > 5000:
            raise ValidationError("Message trop long.", field="message")


class SubmitConsularRegistration:
    """Valide et enregistre une demande d'inscription consulaire."""

    def __init__(self, repo: ConsularRegistrationRepositoryPort) -> None:
        self._repo = repo

    def execute(self, submission: ConsularRegistrationSubmission) -> dict:
        self._validate(submission)
        return self._repo.create(submission)

    def _require(self, value: str, field: str, *, max_len: int = 200) -> None:
        if not value.strip() or len(value) > max_len:
            raise ValidationError(f"Champ « {field} » invalide.", field=field)

    def _validate(self, s: ConsularRegistrationSubmission) -> None:
        self._require(s.nom, "nom")
        self._require(s.post_nom, "post_nom")
        self._require(s.prenom, "prenom")
        if s.sexe not in ALLOWED_SEXES:
            raise ValidationError("Sexe invalide.", field="sexe")
        if s.etat_civil not in ALLOWED_ETAT_CIVIL:
            raise ValidationError("État civil invalide.", field="etat_civil")
        self._require(s.date_naissance, "date_naissance", max_len=32)
        self._require(s.lieu_naissance, "lieu_naissance")
        self._require(s.pays_naissance, "pays_naissance")
        self._require(s.nationalite, "nationalite")
        self._require(s.profession, "profession")
        self._require(s.numero_passeport, "numero_passeport", max_len=64)
        if not EMAIL_RE.match(s.email):
            raise ValidationError("Adresse e-mail invalide.", field="email")
        self._require(s.telephone, "telephone", max_len=40)
        self._require(s.adresse_rue, "adresse_rue")
        self._require(s.adresse_numero, "adresse_numero", max_len=40)
        self._require(s.ville, "ville")
        self._require(s.code_postal, "code_postal", max_len=20)
        self._require(s.type_sejour, "type_sejour", max_len=64)
        self._require(s.adresse_rdc, "adresse_rdc", max_len=500)
        self._require(s.nom_pere, "nom_pere")
        self._require(s.prenom_pere, "prenom_pere")
        self._require(s.nom_mere, "nom_mere")
        self._require(s.prenom_mere, "prenom_mere")
        self._require(s.contact_urgence_nom, "contact_urgence_nom")
        self._require(s.contact_urgence_telephone, "contact_urgence_telephone", max_len=40)
        self._require(s.contact_urgence_lien, "contact_urgence_lien", max_len=80)
        if len(s.password) < 8:
            raise ValidationError(
                "Le mot de passe doit contenir au moins 8 caractères.",
                field="password",
            )
        if s.password != s.password_confirm:
            raise ValidationError(
                "La confirmation du mot de passe ne correspond pas.",
                field="password_confirm",
            )


class SubmitCivilStatusRequest:
    """Valide et enregistre une demande d'acte d'état civil / légalisation."""

    def __init__(self, repo: CivilStatusRepositoryPort) -> None:
        self._repo = repo

    def execute(self, submission: CivilStatusSubmission) -> dict:
        self._validate(submission)
        return self._repo.create(submission)

    def _require(self, value: str, field: str, *, max_len: int = 200) -> None:
        if not value.strip() or len(value) > max_len:
            raise ValidationError(f"Champ « {field} » invalide.", field=field)

    def _validate(self, s: CivilStatusSubmission) -> None:
        if s.document_type not in ALLOWED_CIVIL_DOCUMENTS:
            raise ValidationError("Type de document invalide.", field="document_type")
        self._require(s.nom, "nom")
        self._require(s.post_nom, "post_nom")
        self._require(s.prenom, "prenom")
        if s.sexe not in ALLOWED_SEXES:
            raise ValidationError("Sexe invalide.", field="sexe")
        if s.etat_civil not in ALLOWED_ETAT_CIVIL:
            raise ValidationError("État civil invalide.", field="etat_civil")
        self._require(s.date_naissance, "date_naissance", max_len=32)
        self._require(s.lieu_naissance, "lieu_naissance")
        self._require(s.pays_naissance, "pays_naissance")
        self._require(s.nationalite, "nationalite")
        self._require(s.profession, "profession")
        self._require(s.numero_passeport, "numero_passeport", max_len=64)
        if not EMAIL_RE.match(s.email):
            raise ValidationError("Adresse e-mail invalide.", field="email")
        self._require(s.telephone, "telephone", max_len=40)
        self._require(s.adresse_coree, "adresse_coree", max_len=500)
        self._require(s.adresse_rdc, "adresse_rdc", max_len=500)
        self._require(s.nom_pere, "nom_pere")
        self._require(s.prenom_pere, "prenom_pere")
        self._require(s.nom_mere, "nom_mere")
        self._require(s.prenom_mere, "prenom_mere")
        if len(s.motif.strip()) < 20:
            raise ValidationError(
                "Le motif doit contenir au moins 20 caractères.",
                field="motif",
            )
        if len(s.motif) > 2000:
            raise ValidationError("Motif trop long.", field="motif")
        if len(s.password) < 8:
            raise ValidationError(
                "Le mot de passe doit contenir au moins 8 caractères.",
                field="password",
            )
        if s.password != s.password_confirm:
            raise ValidationError(
                "La confirmation du mot de passe ne correspond pas.",
                field="password_confirm",
            )


class RegisterCitizen:
    """Inscription d'un usager citoyen (PHASE 6.1)."""

    def __init__(self, repo: AccountRepositoryPort) -> None:
        self._repo = repo

    def execute(self, command: RegisterCitizenCommand) -> int:
        self._validate(command)
        if self._repo.email_exists(command.email):
            raise ValidationError(
                "Un compte existe déjà avec cette adresse e-mail.",
                field="email",
            )
        return self._repo.create_citizen(command)

    def _validate(self, c: RegisterCitizenCommand) -> None:
        if not EMAIL_RE.match(c.email):
            raise ValidationError("Adresse e-mail invalide.", field="email")
        if len(c.password) < 8:
            raise ValidationError(
                "Le mot de passe doit contenir au moins 8 caractères.",
                field="password",
            )
        if c.password != c.password_confirm:
            raise ValidationError(
                "La confirmation du mot de passe ne correspond pas.",
                field="password_confirm",
            )
        for field, value, max_len in (
            ("nom", c.nom, 200),
            ("post_nom", c.post_nom, 200),
            ("prenom", c.prenom, 200),
        ):
            if not value.strip() or len(value) > max_len:
                raise ValidationError(f"Champ « {field} » invalide.", field=field)
        if len(c.telephone) > 40:
            raise ValidationError("Téléphone invalide.", field="telephone")
        if c.locale not in ALLOWED_LOCALES:
            raise ValidationError("Langue invalide.", field="locale")


class LoginCitizen:
    """Connexion usager (PHASE 6.2)."""

    def __init__(self, repo: AccountRepositoryPort) -> None:
        self._repo = repo

    def execute(self, command: LoginCitizenCommand) -> AuthenticatedCitizen:
        if not EMAIL_RE.match(command.email):
            raise ValidationError("Adresse e-mail invalide.", field="email")
        if not command.password:
            raise ValidationError("Mot de passe requis.", field="password")
        citizen = self._repo.authenticate(command)
        if citizen is None:
            raise ValidationError(
                "Identifiants incorrects.",
                field="email",
            )
        return citizen


ALLOWED_VISA_TYPES = {
    "touristique",
    "affaires",
    "diplomatique",
    "officiel",
    "travail",
    "transit",
    "court-sejour",
    "long-sejour",
}


class UpdateCitizenProfile:
    def __init__(self, repo: AccountRepositoryPort) -> None:
        self._repo = repo

    def execute(self, user_id: int, command: UpdateProfileCommand) -> dict:
        for field, value in (
            ("nom", command.nom),
            ("post_nom", command.post_nom),
            ("prenom", command.prenom),
        ):
            if not value.strip() or len(value) > 200:
                raise ValidationError(f"Champ « {field} » invalide.", field=field)
        if len(command.telephone) > 40:
            raise ValidationError("Téléphone invalide.", field="telephone")
        if command.locale not in ALLOWED_LOCALES:
            raise ValidationError("Langue invalide.", field="locale")
        if self._repo.get_profile(user_id) is None:
            raise ValidationError("Profil introuvable.", field="user")
        return self._repo.update_profile(user_id, command)


class ChangeCitizenPassword:
    def __init__(self, repo: AccountRepositoryPort) -> None:
        self._repo = repo

    def execute(self, user_id: int, command: ChangePasswordCommand) -> None:
        if not self._repo.check_password(user_id, command.current_password):
            raise ValidationError("Mot de passe actuel incorrect.", field="current_password")
        if len(command.new_password) < 8:
            raise ValidationError(
                "Le nouveau mot de passe doit contenir au moins 8 caractères.",
                field="new_password",
            )
        if command.new_password != command.new_password_confirm:
            raise ValidationError(
                "La confirmation du mot de passe ne correspond pas.",
                field="new_password_confirm",
            )
        self._repo.set_password(user_id, command.new_password)


ALLOWED_VISA_DOC_TYPES = {
    "passport",
    "photo",
    "invitation",
    "flight_ticket",
    "yellow_fever",
}
REQUIRED_VISA_DOC_TYPES = ("passport", "photo")
ALLOWED_VISA_DOC_CONTENT_TYPES = {
    "application/pdf",
    "image/jpeg",
    "image/png",
}
MAX_VISA_DOC_BYTES = 5 * 1024 * 1024


class SubmitVisaPreApplication:
    """Crée un brouillon de pré-demande (pièces + soumission ensuite)."""

    def __init__(self, repo: VisaPreApplicationRepositoryPort) -> None:
        self._repo = repo

    def execute(self, command: VisaPreApplicationCommand) -> dict:
        self._validate(command)
        return self._repo.create(command)

    def _require(self, value: str, field: str, *, max_len: int = 200) -> None:
        if not value.strip() or len(value) > max_len:
            raise ValidationError(f"Champ « {field} » invalide.", field=field)

    def _validate(self, c: VisaPreApplicationCommand) -> None:
        if c.visa_type not in ALLOWED_VISA_TYPES:
            raise ValidationError("Type de visa invalide.", field="visa_type")
        for field, value, max_len in (
            ("nom", c.nom, 200),
            ("post_nom", c.post_nom, 200),
            ("prenom", c.prenom, 200),
            ("date_naissance", c.date_naissance, 32),
            ("nationalite", c.nationalite, 120),
            ("passeport_numero", c.passeport_numero, 64),
            ("passeport_delivre_le", c.passeport_delivre_le, 32),
            ("passeport_expire_le", c.passeport_expire_le, 32),
            ("passeport_delivre_par", c.passeport_delivre_par, 200),
            ("date_entree_prevue", c.date_entree_prevue, 32),
            ("date_sortie_prevue", c.date_sortie_prevue, 32),
            ("motif_voyage", c.motif_voyage, 500),
            ("lieu_destination", c.lieu_destination, 200),
            ("hebergement_type", c.hebergement_type, 120),
            ("hebergement_adresse", c.hebergement_adresse, 500),
            ("hebergement_contact", c.hebergement_contact, 200),
        ):
            self._require(value, field, max_len=max_len)
        if c.sexe not in ALLOWED_SEXES:
            raise ValidationError("Sexe invalide.", field="sexe")
        if not EMAIL_RE.match(c.email):
            raise ValidationError("Adresse e-mail invalide.", field="email")
        self._require(c.telephone, "telephone", max_len=40)
        if c.locale not in ALLOWED_LOCALES:
            raise ValidationError("Langue invalide.", field="locale")


class AttachVisaDocument:
    """Attache une pièce justificative à un brouillon de pré-demande."""

    def __init__(self, repo: VisaPreApplicationRepositoryPort) -> None:
        self._repo = repo

    def execute(self, command: VisaDocumentUploadCommand) -> dict:
        if command.doc_type not in ALLOWED_VISA_DOC_TYPES:
            raise ValidationError("Type de pièce invalide.", field="doc_type")
        if command.content_type not in ALLOWED_VISA_DOC_CONTENT_TYPES:
            raise ValidationError(
                "Format non autorisé. Utilisez PDF, JPG ou PNG.",
                field="file",
            )
        if command.size_bytes <= 0 or command.size_bytes > MAX_VISA_DOC_BYTES:
            raise ValidationError(
                "Fichier trop volumineux (maximum 5 Mo) ou vide.",
                field="file",
            )
        if not command.original_name.strip() or len(command.original_name) > 255:
            raise ValidationError("Nom de fichier invalide.", field="file")
        if not command.file_bytes:
            raise ValidationError("Fichier vide.", field="file")
        lower = command.original_name.lower()
        if command.content_type == "application/pdf" and not lower.endswith(".pdf"):
            raise ValidationError("Extension incohérente avec le type PDF.", field="file")
        if command.content_type == "image/jpeg" and not lower.endswith((".jpg", ".jpeg")):
            raise ValidationError("Extension incohérente avec le type JPEG.", field="file")
        if command.content_type == "image/png" and not lower.endswith(".png"):
            raise ValidationError("Extension incohérente avec le type PNG.", field="file")

        app = self._repo.get_for_user(command.user_id, command.reference)
        if app is None:
            raise ValidationError("Pré-demande introuvable.", field="reference")
        if app.get("status") != "draft":
            raise ValidationError(
                "Les pièces ne peuvent être ajoutées que sur un brouillon.",
                field="reference",
            )
        return self._repo.save_document(
            command.user_id,
            command.reference,
            doc_type=command.doc_type,
            original_name=command.original_name.strip(),
            content_type=command.content_type,
            size_bytes=command.size_bytes,
            file_bytes=command.file_bytes,
        )


class FinalizeVisaPreApplication:
    """Soumet le brouillon après pièces obligatoires + acceptation des conditions."""

    def __init__(self, repo: VisaPreApplicationRepositoryPort) -> None:
        self._repo = repo

    def execute(self, user_id: int, reference: str, *, accept_conditions: bool) -> dict:
        if not accept_conditions:
            raise ValidationError(
                "Vous devez accepter les conditions de la pré-demande.",
                field="accept_conditions",
            )
        app = self._repo.get_for_user(user_id, reference)
        if app is None:
            raise ValidationError("Pré-demande introuvable.", field="reference")
        if app.get("status") != "draft":
            raise ValidationError("Cette pré-demande a déjà été soumise.", field="reference")
        present = set(self._repo.list_document_types(user_id, reference))
        missing = [doc for doc in REQUIRED_VISA_DOC_TYPES if doc not in present]
        if missing:
            raise ValidationError(
                "Pièces obligatoires manquantes : " + ", ".join(missing) + ".",
                field="documents",
            )
        return self._repo.finalize(user_id, reference)


class ListVisaPreApplications:
    def __init__(self, repo: VisaPreApplicationRepositoryPort) -> None:
        self._repo = repo

    def execute(self, user_id: int) -> Sequence[dict]:
        return self._repo.list_for_user(user_id)


class GetVisaPreApplication:
    def __init__(self, repo: VisaPreApplicationRepositoryPort) -> None:
        self._repo = repo

    def execute(self, user_id: int, reference: str) -> dict:
        item = self._repo.get_for_user(user_id, reference)
        if item is None:
            raise ValidationError("Pré-demande introuvable.", field="reference")
        return item


ALLOWED_PASSPORT_KINDS = {"first", "renewal", "loss"}
ALLOWED_APPOINTMENT_SERVICES = {"visa", "passport", "consular", "civil", "other"}
ALLOWED_APPOINTMENT_SLOTS = {"morning", "afternoon"}


class SubmitPassportRequest:
    def __init__(self, repo: PassportRequestRepositoryPort) -> None:
        self._repo = repo

    def execute(self, command: PassportRequestCommand) -> dict:
        if command.request_kind not in ALLOWED_PASSPORT_KINDS:
            raise ValidationError("Type de demande invalide.", field="request_kind")
        for field, value, max_len in (
            ("nom", command.nom, 200),
            ("post_nom", command.post_nom, 200),
            ("prenom", command.prenom, 200),
            ("date_naissance", command.date_naissance, 32),
            ("lieu_naissance", command.lieu_naissance, 200),
            ("telephone", command.telephone, 40),
            ("motif", command.motif, 500),
        ):
            if not value.strip() or len(value) > max_len:
                raise ValidationError(f"Champ « {field} » invalide.", field=field)
        if not EMAIL_RE.match(command.email):
            raise ValidationError("Adresse e-mail invalide.", field="email")
        if command.locale not in ALLOWED_LOCALES:
            raise ValidationError("Langue invalide.", field="locale")
        return self._repo.create(command)


class RequestAppointment:
    def __init__(self, repo: AppointmentRepositoryPort) -> None:
        self._repo = repo

    def execute(self, command: AppointmentCommand) -> dict:
        if command.service_type not in ALLOWED_APPOINTMENT_SERVICES:
            raise ValidationError("Service invalide.", field="service_type")
        if not command.preferred_date.strip():
            raise ValidationError("Date préférée invalide.", field="preferred_date")
        if command.preferred_slot not in ALLOWED_APPOINTMENT_SLOTS:
            raise ValidationError("Créneau invalide.", field="preferred_slot")
        if len(command.notes) > 500:
            raise ValidationError("Notes trop longues.", field="notes")
        return self._repo.create(command)


class ListCitizenCases:
    def __init__(self, repo) -> None:
        self._repo = repo

    def execute(self, user_id: int) -> Sequence[dict]:
        return self._repo.list_for_user(user_id)


class ListAppointments:
    def __init__(self, repo: AppointmentRepositoryPort) -> None:
        self._repo = repo

    def execute(self, user_id: int) -> Sequence[dict]:
        return self._repo.list_for_user(user_id)


class ListNotifications:
    def __init__(self, repo: NotificationRepositoryPort) -> None:
        self._repo = repo

    def execute(self, user_id: int, *, unread_only: bool = False) -> Sequence[dict]:
        return self._repo.list_for_user(user_id, unread_only=unread_only)


class MarkNotificationRead:
    def __init__(self, repo: NotificationRepositoryPort) -> None:
        self._repo = repo

    def execute(self, user_id: int, notification_id: int) -> None:
        self._repo.mark_read(user_id, notification_id)


class MarkAllNotificationsRead:
    def __init__(self, repo: NotificationRepositoryPort) -> None:
        self._repo = repo

    def execute(self, user_id: int) -> int:
        return self._repo.mark_all_read(user_id)


class UnreadNotificationCount:
    def __init__(self, repo: NotificationRepositoryPort) -> None:
        self._repo = repo

    def execute(self, user_id: int) -> int:
        return self._repo.unread_count(user_id)


class ListCaseHistory:
    def __init__(self, repo: CaseEventRepositoryPort) -> None:
        self._repo = repo

    def execute(self, user_id: int) -> Sequence[dict]:
        return self._repo.list_for_user(user_id)
