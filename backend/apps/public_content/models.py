"""
Modèles ORM — couche infrastructure pour le contenu public.

Ces modèles n'exposent pas la logique métier : celle-ci vit dans `domain/`
et `application/`. Les repositories mappent ORM ↔ entités de domaine.
"""

from __future__ import annotations

from django.conf import settings
from django.db import models


class TimeStampedModel(models.Model):
    """Horodatage immuable de création / mise à jour."""

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class NewsArticle(TimeStampedModel):
    """Actualité ou communiqué officiel publié sur le portail public."""

    class Category(models.TextChoices):
        NEWS = "news", "Actualité"
        COMMUNIQUE = "communique", "Communiqué"
        NOTICE = "notice", "Avis consulaire"
        EVENT = "event", "Événement"

    slug = models.SlugField(unique=True, max_length=120)
    category = models.CharField(max_length=32, choices=Category.choices, default=Category.NEWS)
    is_published = models.BooleanField(default=False)
    published_at = models.DateTimeField(null=True, blank=True)
    is_provisional = models.BooleanField(
        default=True,
        help_text="True tant que le contenu n'a pas été validé par l'Ambassade.",
    )

    title_fr = models.CharField(max_length=255)
    title_en = models.CharField(max_length=255, blank=True)
    title_ko = models.CharField(max_length=255, blank=True)
    summary_fr = models.TextField(blank=True)
    summary_en = models.TextField(blank=True)
    summary_ko = models.TextField(blank=True)
    body_fr = models.TextField()
    body_en = models.TextField(blank=True)
    body_ko = models.TextField(blank=True)

    class Meta:
        ordering = ["-published_at", "-created_at"]
        verbose_name = "Actualité"
        verbose_name_plural = "Actualités"

    def __str__(self) -> str:
        return self.title_fr


class FaqItem(TimeStampedModel):
    """Question / réponse de la FAQ dynamique."""

    class Category(models.TextChoices):
        VISA = "visa", "Visas"
        PASSPORT = "passport", "Passeports"
        CONSULAR_CARD = "consular_card", "Carte consulaire"
        CIVIL = "civil", "État civil"
        APPOINTMENT = "appointment", "Rendez-vous"
        ASSISTANCE = "assistance", "Assistance"
        INVESTMENT = "investment", "Investissement"
        UNIVERSITY = "university", "Coopération universitaire"

    category = models.CharField(max_length=32, choices=Category.choices)
    sort_order = models.PositiveIntegerField(default=0)
    is_published = models.BooleanField(default=True)
    is_provisional = models.BooleanField(default=True)

    question_fr = models.CharField(max_length=500)
    question_en = models.CharField(max_length=500, blank=True)
    question_ko = models.CharField(max_length=500, blank=True)
    answer_fr = models.TextField()
    answer_en = models.TextField(blank=True)
    answer_ko = models.TextField(blank=True)

    class Meta:
        ordering = ["category", "sort_order", "id"]
        verbose_name = "FAQ"
        verbose_name_plural = "FAQ"

    def __str__(self) -> str:
        return self.question_fr


class ConsularService(TimeStampedModel):
    """Fiche de service consulaire présentée sur le portail public."""

    slug = models.SlugField(unique=True, max_length=120)
    sort_order = models.PositiveIntegerField(default=0)
    is_published = models.BooleanField(default=True)
    is_provisional = models.BooleanField(default=True)
    requires_account = models.BooleanField(
        default=True,
        help_text="Indique si la démarche nécessite un compte usager.",
    )

    title_fr = models.CharField(max_length=255)
    title_en = models.CharField(max_length=255, blank=True)
    title_ko = models.CharField(max_length=255, blank=True)
    summary_fr = models.TextField()
    summary_en = models.TextField(blank=True)
    summary_ko = models.TextField(blank=True)
    conditions_fr = models.TextField(blank=True)
    conditions_en = models.TextField(blank=True)
    conditions_ko = models.TextField(blank=True)
    documents_fr = models.TextField(blank=True)
    documents_en = models.TextField(blank=True)
    documents_ko = models.TextField(blank=True)
    tariff_note_fr = models.CharField(
        max_length=255,
        blank=True,
        default="[PROVISOIRE] Tarif à confirmer par l'Ambassade.",
    )
    delay_note_fr = models.CharField(
        max_length=255,
        blank=True,
        default="[PROVISOIRE] Délai indicatif à confirmer.",
    )

    class Meta:
        ordering = ["sort_order", "title_fr"]
        verbose_name = "Service consulaire"
        verbose_name_plural = "Services consulaires"

    def __str__(self) -> str:
        return self.title_fr


class VisaCategory(TimeStampedModel):
    """Catégorie de visa présentée au public (données administrables)."""

    slug = models.SlugField(unique=True, max_length=120)
    sort_order = models.PositiveIntegerField(default=0)
    is_published = models.BooleanField(default=True)
    is_provisional = models.BooleanField(default=True)

    title_fr = models.CharField(max_length=255)
    title_en = models.CharField(max_length=255, blank=True)
    title_ko = models.CharField(max_length=255, blank=True)
    description_fr = models.TextField()
    description_en = models.TextField(blank=True)
    description_ko = models.TextField(blank=True)
    eligibility_fr = models.TextField(blank=True)
    documents_fr = models.TextField(blank=True)
    tariff_note_fr = models.CharField(max_length=255, blank=True, default="[PROVISOIRE]")
    validity_note_fr = models.CharField(max_length=255, blank=True, default="[PROVISOIRE]")

    class Meta:
        ordering = ["sort_order", "title_fr"]
        verbose_name = "Catégorie de visa"
        verbose_name_plural = "Catégories de visa"

    def __str__(self) -> str:
        return self.title_fr


class ContactMessage(TimeStampedModel):
    """Demande de contact reçue via le formulaire public."""

    class Category(models.TextChoices):
        VISA = "visa", "Visa"
        PASSPORT = "passport", "Passeport"
        CIVIL = "civil", "État civil"
        CONSULAR_CARD = "consular_card", "Carte consulaire"
        ASSISTANCE = "assistance", "Assistance"
        ECONOMIC = "economic", "Coopération économique"
        PRESS = "press", "Presse"
        OTHER = "other", "Autre"

    category = models.CharField(max_length=32, choices=Category.choices)
    full_name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=40, blank=True)
    subject = models.CharField(max_length=255)
    message = models.TextField()
    locale = models.CharField(max_length=5, default="fr")
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    is_handled = models.BooleanField(default=False)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Message de contact"
        verbose_name_plural = "Messages de contact"

    def __str__(self) -> str:
        return f"{self.subject} — {self.full_name}"


class ConsularRegistrationRequest(TimeStampedModel):
    """
    Demande d'inscription au registre des Congolais (carte consulaire).

    Champs alignés sur les formulaires RDC (Nom, Post-nom, Prénom…)
    et la procédure Séoul (e-mail + mot de passe).
    """

    class Sexe(models.TextChoices):
        M = "M", "Masculin"
        F = "F", "Féminin"

    class EtatCivil(models.TextChoices):
        CELIBATAIRE = "celibataire", "Célibataire"
        MARIE = "marie", "Marié(e)"
        DIVORCE = "divorce", "Divorcé(e)"
        VEUF = "veuf", "Veuf / Veuve"
        AUTRE = "autre", "Autre"

    # Identité
    nom = models.CharField(max_length=200)
    post_nom = models.CharField(max_length=200)
    prenom = models.CharField(max_length=200)
    sexe = models.CharField(max_length=1, choices=Sexe.choices)
    etat_civil = models.CharField(max_length=20, choices=EtatCivil.choices)
    date_naissance = models.CharField(max_length=32)
    lieu_naissance = models.CharField(max_length=200)
    pays_naissance = models.CharField(max_length=200)
    nationalite = models.CharField(max_length=120)
    profession = models.CharField(max_length=200)
    numero_passeport = models.CharField(max_length=64)

    # Compte / contact (procédure Séoul)
    email = models.EmailField()
    telephone = models.CharField(max_length=40)
    password_hash = models.CharField(max_length=128)

    # Adresse en République de Corée
    adresse_rue = models.CharField(max_length=200)
    adresse_numero = models.CharField(max_length=40)
    ville = models.CharField(max_length=120)
    code_postal = models.CharField(max_length=20)
    type_sejour = models.CharField(max_length=64)

    # Adresse en RDC
    adresse_rdc = models.CharField(max_length=500)

    # Parents
    nom_pere = models.CharField(max_length=200)
    prenom_pere = models.CharField(max_length=200)
    nom_mere = models.CharField(max_length=200)
    prenom_mere = models.CharField(max_length=200)

    # Contact d'urgence
    contact_urgence_nom = models.CharField(max_length=200)
    contact_urgence_telephone = models.CharField(max_length=40)
    contact_urgence_lien = models.CharField(max_length=80)

    locale = models.CharField(max_length=5, default="fr")
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    is_handled = models.BooleanField(default=False)
    reference = models.CharField(max_length=32, unique=True, db_index=True, null=True, blank=True)
    status = models.CharField(max_length=20, default="submitted")
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="consular_registration_requests",
    )

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Demande d'enregistrement consulaire"
        verbose_name_plural = "Demandes d'enregistrement consulaire"

    def __str__(self) -> str:
        return f"{self.nom} {self.post_nom} {self.prenom} — {self.email}"


class CivilStatusRequest(TimeStampedModel):
    """Demande d'acte d'état civil / légalisation (Ambassade Séoul)."""

    class DocumentType(models.TextChoices):
        COMPOSITION = "composition_familiale", "Composition familiale"
        MARIAGE = "certificat_mariage", "Certificat de mariage"
        NATIONALITE = "certificat_nationalite", "Certificat de nationalité"
        NAISSANCE = "attestation_naissance", "Attestation de naissance"
        DECES = "certificat_deces", "Certificat de décès"
        CELIBAT = "certificat_celibat", "Certificat de célibat"
        LAISSEZ = "laissez_passer", "Laissez-passer"
        LEGALISATION = "legalisation", "Légalisation"
        AUTRE = "autre", "Autre"

    class Sexe(models.TextChoices):
        M = "M", "Masculin"
        F = "F", "Féminin"

    class EtatCivil(models.TextChoices):
        CELIBATAIRE = "celibataire", "Célibataire"
        MARIE = "marie", "Marié(e)"
        DIVORCE = "divorce", "Divorcé(e)"
        VEUF = "veuf", "Veuf / Veuve"
        AUTRE = "autre", "Autre"

    document_type = models.CharField(max_length=40, choices=DocumentType.choices)
    nom = models.CharField(max_length=200)
    post_nom = models.CharField(max_length=200)
    prenom = models.CharField(max_length=200)
    sexe = models.CharField(max_length=1, choices=Sexe.choices)
    etat_civil = models.CharField(max_length=20, choices=EtatCivil.choices)
    date_naissance = models.CharField(max_length=32)
    lieu_naissance = models.CharField(max_length=200)
    pays_naissance = models.CharField(max_length=200)
    nationalite = models.CharField(max_length=120)
    profession = models.CharField(max_length=200)
    numero_passeport = models.CharField(max_length=64)
    email = models.EmailField()
    telephone = models.CharField(max_length=40)
    password_hash = models.CharField(max_length=128)
    adresse_coree = models.CharField(max_length=500)
    adresse_rdc = models.CharField(max_length=500)
    nom_pere = models.CharField(max_length=200)
    prenom_pere = models.CharField(max_length=200)
    nom_mere = models.CharField(max_length=200)
    prenom_mere = models.CharField(max_length=200)
    motif = models.TextField()
    locale = models.CharField(max_length=5, default="fr")
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    is_handled = models.BooleanField(default=False)
    reference = models.CharField(max_length=32, unique=True, db_index=True, null=True, blank=True)
    status = models.CharField(max_length=20, default="submitted")
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="civil_status_requests",
    )

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Demande d'état civil"
        verbose_name_plural = "Demandes d'état civil"

    def __str__(self) -> str:
        return f"{self.document_type} — {self.nom} {self.prenom}"
