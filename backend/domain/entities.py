"""
Entités de domaine du portail public.

Ces dataclasses sont indépendantes de Django / DRF.
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from typing import Optional


@dataclass(frozen=True)
class LocalizedText:
    """Texte trilingue institutionnel."""

    fr: str
    en: str = ""
    ko: str = ""

    def for_locale(self, locale: str) -> str:
        """Retourne la meilleure traduction disponible (fallback FR)."""
        value = {
            "fr": self.fr,
            "en": self.en,
            "ko": self.ko,
        }.get(locale, self.fr)
        return value or self.fr


@dataclass(frozen=True)
class NewsEntity:
    slug: str
    category: str
    title: LocalizedText
    summary: LocalizedText
    body: LocalizedText
    published_at: Optional[datetime]
    is_provisional: bool


@dataclass(frozen=True)
class FaqEntity:
    id: int
    category: str
    question: LocalizedText
    answer: LocalizedText
    is_provisional: bool


@dataclass(frozen=True)
class ConsularServiceEntity:
    slug: str
    title: LocalizedText
    summary: LocalizedText
    conditions: LocalizedText
    documents: LocalizedText
    tariff_note_fr: str
    delay_note_fr: str
    requires_account: bool
    is_provisional: bool


@dataclass(frozen=True)
class VisaCategoryEntity:
    slug: str
    title: LocalizedText
    description: LocalizedText
    eligibility_fr: str
    documents_fr: str
    tariff_note_fr: str
    validity_note_fr: str
    is_provisional: bool


@dataclass(frozen=True)
class ContactSubmission:
    """Commande de création d'un message de contact."""

    category: str
    full_name: str
    email: str
    phone: str
    subject: str
    message: str
    locale: str
    ip_address: Optional[str]


@dataclass(frozen=True)
class RegisterCitizenCommand:
    """Inscription d'un usager (Espace B)."""

    email: str
    password: str
    password_confirm: str
    nom: str
    post_nom: str
    prenom: str
    telephone: str
    locale: str


@dataclass(frozen=True)
class LoginCitizenCommand:
    """Connexion usager."""

    email: str
    password: str


@dataclass(frozen=True)
class AuthenticatedCitizen:
    """Usager authentifié exposé à l'API."""

    id: int
    email: str
    nom: str
    post_nom: str
    prenom: str
    telephone: str
    locale: str
    token: str


@dataclass(frozen=True)
class UpdateProfileCommand:
    nom: str
    post_nom: str
    prenom: str
    telephone: str
    locale: str


@dataclass(frozen=True)
class ChangePasswordCommand:
    current_password: str
    new_password: str
    new_password_confirm: str


@dataclass(frozen=True)
class VisaPreApplicationCommand:
    """Pré-demande de visa (brouillon ou soumission — pas une délivrance)."""

    user_id: int
    visa_type: str
    nom: str
    post_nom: str
    prenom: str
    date_naissance: str
    nationalite: str
    sexe: str
    email: str
    telephone: str
    passeport_numero: str
    passeport_delivre_le: str
    passeport_expire_le: str
    passeport_delivre_par: str
    date_entree_prevue: str
    date_sortie_prevue: str
    motif_voyage: str
    lieu_destination: str
    hebergement_type: str
    hebergement_adresse: str
    hebergement_contact: str
    accept_conditions: bool
    locale: str


@dataclass(frozen=True)
class VisaDocumentUploadCommand:
    """Téléversement d'une pièce liée à une pré-demande."""

    user_id: int
    reference: str
    doc_type: str
    original_name: str
    content_type: str
    size_bytes: int
    file_bytes: bytes


@dataclass(frozen=True)
class CivilStatusSubmission:
    """
    Demande d'acte d'état civil / légalisation (Séoul).

    Types publiés par l'Ambassade ; champs du formulaire d'attestations RDC
    (Nom, Post-nom, Prénom, motif, etc.) + compte e-mail / mot de passe.
    """

    document_type: str
    nom: str
    post_nom: str
    prenom: str
    sexe: str
    etat_civil: str
    date_naissance: str
    lieu_naissance: str
    pays_naissance: str
    nationalite: str
    profession: str
    numero_passeport: str
    email: str
    telephone: str
    adresse_coree: str
    adresse_rdc: str
    nom_pere: str
    prenom_pere: str
    nom_mere: str
    prenom_mere: str
    motif: str
    password: str
    password_confirm: str
    locale: str
    ip_address: Optional[str]
    user_id: Optional[int] = None


@dataclass(frozen=True)
class ConsularRegistrationSubmission:
    """
    Demande d'inscription au registre consulaire (carte consulaire).

    Libellés alignés sur les formulaires RDC publiés (Nom, Post-nom, Prénom,
    etc.) et la procédure Séoul (compte e-mail + mot de passe).
    """

    nom: str
    post_nom: str
    prenom: str
    sexe: str
    etat_civil: str
    date_naissance: str
    lieu_naissance: str
    pays_naissance: str
    nationalite: str
    profession: str
    numero_passeport: str
    email: str
    telephone: str
    adresse_rue: str
    adresse_numero: str
    ville: str
    code_postal: str
    type_sejour: str
    adresse_rdc: str
    nom_pere: str
    prenom_pere: str
    nom_mere: str
    prenom_mere: str
    contact_urgence_nom: str
    contact_urgence_telephone: str
    contact_urgence_lien: str
    password: str
    password_confirm: str
    locale: str
    ip_address: Optional[str]
    user_id: Optional[int] = None


@dataclass(frozen=True)
class PassportRequestCommand:
    user_id: int
    request_kind: str
    nom: str
    post_nom: str
    prenom: str
    date_naissance: str
    lieu_naissance: str
    numero_passeport_actuel: str
    telephone: str
    email: str
    motif: str
    locale: str


@dataclass(frozen=True)
class AppointmentCommand:
    user_id: int
    service_type: str
    preferred_date: str
    preferred_slot: str
    notes: str
    related_case_reference: str
    locale: str
