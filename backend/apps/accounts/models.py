"""
Profils usagers citoyens — Espace B (PHASE 6).

Le compte d'authentification repose sur django.contrib.auth.User
(username = e-mail). Les données consulaires complémentaires vivent ici.
"""

from __future__ import annotations

import secrets
import uuid
from datetime import datetime, timezone
from pathlib import Path

from django.conf import settings
from django.db import models


def visa_document_upload_to(instance: "VisaSupportingDocument", filename: str) -> str:
    """Chemin privé — jamais exposé via MEDIA_URL public."""
    ext = Path(filename).suffix.lower()[:10]
    safe_ext = ext if ext in {".pdf", ".jpg", ".jpeg", ".png"} else ".bin"
    ref = instance.application.reference
    user_id = instance.application.user_id
    return f"private/visa/{user_id}/{ref}/{instance.doc_type}_{uuid.uuid4().hex}{safe_ext}"


class CitizenProfile(models.Model):
    """Profil d'un ressortissant / usager du portail."""

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="citizen_profile",
    )
    nom = models.CharField(max_length=200)
    post_nom = models.CharField(max_length=200)
    prenom = models.CharField(max_length=200)
    telephone = models.CharField(max_length=40, blank=True)
    locale = models.CharField(max_length=5, default="fr")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Profil citoyen"
        verbose_name_plural = "Profils citoyens"
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.nom} {self.post_nom} {self.prenom} <{self.user.email}>"


class VisaPreApplication(models.Model):
    """
    Pré-demande de visa — ne constitue pas une délivrance.
    La décision finale appartient aux autorités compétentes.
    """

    class Status(models.TextChoices):
        DRAFT = "draft", "Brouillon"
        SUBMITTED = "submitted", "Soumise"
        UNDER_REVIEW = "under_review", "En examen"
        NEEDS_INFO = "needs_info", "Complément demandé"
        ACCEPTED = "accepted", "Acceptée (pré-filtre)"
        REJECTED = "rejected", "Refusée (pré-filtre)"

    class Sexe(models.TextChoices):
        M = "M", "Masculin"
        F = "F", "Féminin"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="visa_pre_applications",
    )
    reference = models.CharField(max_length=32, unique=True, db_index=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)
    visa_type = models.CharField(max_length=40)

    nom = models.CharField(max_length=200)
    post_nom = models.CharField(max_length=200)
    prenom = models.CharField(max_length=200)
    date_naissance = models.CharField(max_length=32)
    nationalite = models.CharField(max_length=120)
    sexe = models.CharField(max_length=1, choices=Sexe.choices)
    email = models.EmailField()
    telephone = models.CharField(max_length=40)

    passeport_numero = models.CharField(max_length=64)
    passeport_delivre_le = models.CharField(max_length=32)
    passeport_expire_le = models.CharField(max_length=32)
    passeport_delivre_par = models.CharField(max_length=200)

    date_entree_prevue = models.CharField(max_length=32)
    date_sortie_prevue = models.CharField(max_length=32)
    motif_voyage = models.CharField(max_length=500)
    lieu_destination = models.CharField(max_length=200)

    hebergement_type = models.CharField(max_length=120)
    hebergement_adresse = models.CharField(max_length=500)
    hebergement_contact = models.CharField(max_length=200)

    accept_conditions = models.BooleanField(default=False)
    locale = models.CharField(max_length=5, default="fr")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Pré-demande de visa"
        verbose_name_plural = "Pré-demandes de visa"

    def __str__(self) -> str:
        return f"{self.reference} — {self.nom} {self.prenom}"

    @staticmethod
    def generate_reference() -> str:
        stamp = datetime.now(timezone.utc).strftime("%Y%m%d")
        return f"VISA-{stamp}-{secrets.token_hex(3).upper()}"


class VisaSupportingDocument(models.Model):
    """Pièce justificative liée à une pré-demande (stockage privé)."""

    class DocType(models.TextChoices):
        PASSPORT = "passport", "Passeport"
        PHOTO = "photo", "Photo d'identité"
        INVITATION = "invitation", "Lettre d'invitation"
        FLIGHT_TICKET = "flight_ticket", "Billet d'avion"
        YELLOW_FEVER = "yellow_fever", "Certificat fièvre jaune"

    application = models.ForeignKey(
        VisaPreApplication,
        on_delete=models.CASCADE,
        related_name="documents",
    )
    doc_type = models.CharField(max_length=32, choices=DocType.choices)
    original_name = models.CharField(max_length=255)
    content_type = models.CharField(max_length=100)
    size_bytes = models.PositiveIntegerField()
    file = models.FileField(upload_to=visa_document_upload_to, max_length=500)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["doc_type", "-uploaded_at"]
        verbose_name = "Pièce justificative visa"
        verbose_name_plural = "Pièces justificatives visa"
        constraints = [
            models.UniqueConstraint(
                fields=["application", "doc_type"],
                name="uniq_visa_doc_type_per_application",
            )
        ]

    def __str__(self) -> str:
        return f"{self.application.reference} — {self.doc_type}"


class PassportRequest(models.Model):
    """Demande de passeport liée au compte usager (pré-demande, pas délivrance)."""

    class Status(models.TextChoices):
        SUBMITTED = "submitted", "Soumise"
        UNDER_REVIEW = "under_review", "En examen"
        NEEDS_INFO = "needs_info", "Complément demandé"
        ACCEPTED = "accepted", "Acceptée (pré-filtre)"
        REJECTED = "rejected", "Refusée (pré-filtre)"

    class RequestKind(models.TextChoices):
        FIRST = "first", "Première demande"
        RENEWAL = "renewal", "Renouvellement"
        LOSS = "loss", "Perte / vol"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="passport_requests",
    )
    reference = models.CharField(max_length=32, unique=True, db_index=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.SUBMITTED)
    request_kind = models.CharField(max_length=20, choices=RequestKind.choices)
    nom = models.CharField(max_length=200)
    post_nom = models.CharField(max_length=200)
    prenom = models.CharField(max_length=200)
    date_naissance = models.CharField(max_length=32)
    lieu_naissance = models.CharField(max_length=200)
    numero_passeport_actuel = models.CharField(max_length=64, blank=True)
    telephone = models.CharField(max_length=40)
    email = models.EmailField()
    motif = models.CharField(max_length=500)
    locale = models.CharField(max_length=5, default="fr")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Demande de passeport"
        verbose_name_plural = "Demandes de passeport"

    def __str__(self) -> str:
        return f"{self.reference} — {self.nom} {self.prenom}"


class Appointment(models.Model):
    """Rendez-vous consulaire réservé par un usager."""

    class Status(models.TextChoices):
        REQUESTED = "requested", "Demandé"
        CONFIRMED = "confirmed", "Confirmé"
        CANCELLED = "cancelled", "Annulé"
        COMPLETED = "completed", "Honoré"

    class ServiceType(models.TextChoices):
        VISA = "visa", "Visa"
        PASSPORT = "passport", "Passeport"
        CONSULAR = "consular", "Enregistrement consulaire"
        CIVIL = "civil", "État civil"
        OTHER = "other", "Autre"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="appointments",
    )
    reference = models.CharField(max_length=32, unique=True, db_index=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.REQUESTED)
    service_type = models.CharField(max_length=20, choices=ServiceType.choices)
    preferred_date = models.CharField(max_length=32)
    preferred_slot = models.CharField(max_length=32)
    notes = models.CharField(max_length=500, blank=True)
    related_case_reference = models.CharField(max_length=32, blank=True)
    locale = models.CharField(max_length=5, default="fr")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Rendez-vous"
        verbose_name_plural = "Rendez-vous"

    def __str__(self) -> str:
        return f"{self.reference} — {self.service_type} ({self.preferred_date})"


class UserNotification(models.Model):
    """Notification in-app (canaux e-mail / SMS via NotificationService)."""

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notifications",
    )
    title = models.CharField(max_length=200)
    body = models.CharField(max_length=500)
    link = models.CharField(max_length=255, blank=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Notification usager"
        verbose_name_plural = "Notifications usager"

    def __str__(self) -> str:
        return f"{self.user_id} — {self.title}"


class NotificationDelivery(models.Model):
    """Journal des envois multi-canal (e-mail / SMS)."""

    class Channel(models.TextChoices):
        EMAIL = "email", "E-mail"
        SMS = "sms", "SMS"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="notification_deliveries",
    )
    channel = models.CharField(max_length=16, choices=Channel.choices)
    recipient = models.CharField(max_length=254, blank=True)
    subject = models.CharField(max_length=200)
    body = models.CharField(max_length=500, blank=True)
    success = models.BooleanField(default=False)
    detail = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Envoi de notification"
        verbose_name_plural = "Envois de notifications"

    def __str__(self) -> str:
        return f"{self.channel} → {self.recipient} ({'ok' if self.success else 'ko'})"


class CaseEvent(models.Model):
    """Historique d'événements sur les dossiers usager."""

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="case_events",
    )
    case_type = models.CharField(max_length=40)
    case_reference = models.CharField(max_length=32, db_index=True)
    event_type = models.CharField(max_length=40)
    message = models.CharField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Événement de dossier"
        verbose_name_plural = "Événements de dossier"

    def __str__(self) -> str:
        return f"{self.case_reference} — {self.event_type}"


class StaffProfile(models.Model):
    """Profil agent — Espace C (PHASE 7). Nécessite User.is_staff=True."""

    class Role(models.TextChoices):
        ADMIN = "admin", "Administrateur"
        CONSULAR = "consular", "Agent consulaire"
        COMMS = "comms", "Communication"
        ASSISTANCE = "assistance", "Assistance"

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="staff_profile",
    )
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.CONSULAR)
    display_name = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Profil agent"
        verbose_name_plural = "Profils agents"

    def __str__(self) -> str:
        return f"{self.display_name or self.user.email} ({self.role})"


class AuditLog(models.Model):
    """Journal d'audit des actions administratives."""

    actor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="audit_logs",
    )
    action = models.CharField(max_length=64)
    entity_type = models.CharField(max_length=64)
    entity_ref = models.CharField(max_length=64, blank=True)
    before = models.JSONField(default=dict, blank=True)
    after = models.JSONField(default=dict, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Entrée d'audit"
        verbose_name_plural = "Journal d'audit"

    def __str__(self) -> str:
        return f"{self.action} — {self.entity_type}:{self.entity_ref}"


class Incident(models.Model):
    """Signalement d'assistance / urgence (PHASE 7 ops)."""

    class Category(models.TextChoices):
        ARREST = "arrest", "Arrestation"
        PASSPORT_LOSS = "passport_loss", "Perte de passeport"
        HOSPITAL = "hospital", "Hospitalisation"
        DEATH = "death", "Décès"
        LEGAL = "legal", "Assistance juridique"
        SOCIAL = "social", "Assistance sociale"
        OTHER = "other", "Autre"

    class Priority(models.TextChoices):
        LOW = "low", "Basse"
        MEDIUM = "medium", "Moyenne"
        HIGH = "high", "Haute"
        CRITICAL = "critical", "Critique"

    class Status(models.TextChoices):
        OPEN = "open", "Ouvert"
        IN_PROGRESS = "in_progress", "En cours"
        WAITING = "waiting", "En attente"
        CLOSED = "closed", "Clôturé"

    reference = models.CharField(max_length=32, unique=True, db_index=True)
    category = models.CharField(max_length=32, choices=Category.choices)
    priority = models.CharField(max_length=16, choices=Priority.choices, default=Priority.MEDIUM)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.OPEN)
    full_name = models.CharField(max_length=200)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=40, blank=True)
    description = models.TextField()
    locale = models.CharField(max_length=5, default="fr")
    linked_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="incidents",
    )
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_incidents",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Incident"
        verbose_name_plural = "Incidents"

    def __str__(self) -> str:
        return f"{self.reference} — {self.category}"
