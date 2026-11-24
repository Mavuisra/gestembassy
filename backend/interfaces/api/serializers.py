"""
Serializers API — validation d'entrée / format de sortie.

La logique métier reste dans `application.use_cases`.
"""

from __future__ import annotations

from rest_framework import serializers


class RegisterCitizenSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(min_length=8, max_length=128, write_only=True)
    password_confirm = serializers.CharField(min_length=8, max_length=128, write_only=True)
    nom = serializers.CharField(max_length=200)
    post_nom = serializers.CharField(max_length=200)
    prenom = serializers.CharField(max_length=200)
    telephone = serializers.CharField(max_length=40, required=False, allow_blank=True)
    locale = serializers.ChoiceField(choices=["fr", "en", "ko"], default="fr")


class LoginCitizenSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(max_length=128, write_only=True)


class UpdateProfileSerializer(serializers.Serializer):
    nom = serializers.CharField(max_length=200)
    post_nom = serializers.CharField(max_length=200)
    prenom = serializers.CharField(max_length=200)
    telephone = serializers.CharField(max_length=40, required=False, allow_blank=True)
    locale = serializers.ChoiceField(choices=["fr", "en", "ko"], default="fr")


class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(max_length=128, write_only=True)
    new_password = serializers.CharField(min_length=8, max_length=128, write_only=True)
    new_password_confirm = serializers.CharField(min_length=8, max_length=128, write_only=True)


class VisaPreApplicationSerializer(serializers.Serializer):
    visa_type = serializers.ChoiceField(
        choices=[
            "touristique",
            "affaires",
            "diplomatique",
            "officiel",
            "travail",
            "transit",
            "court-sejour",
            "long-sejour",
        ]
    )
    nom = serializers.CharField(max_length=200)
    post_nom = serializers.CharField(max_length=200)
    prenom = serializers.CharField(max_length=200)
    date_naissance = serializers.CharField(max_length=32)
    nationalite = serializers.CharField(max_length=120)
    sexe = serializers.ChoiceField(choices=["M", "F"])
    email = serializers.EmailField()
    telephone = serializers.CharField(max_length=40)
    passeport_numero = serializers.CharField(max_length=64)
    passeport_delivre_le = serializers.CharField(max_length=32)
    passeport_expire_le = serializers.CharField(max_length=32)
    passeport_delivre_par = serializers.CharField(max_length=200)
    date_entree_prevue = serializers.CharField(max_length=32)
    date_sortie_prevue = serializers.CharField(max_length=32)
    motif_voyage = serializers.CharField(max_length=500)
    lieu_destination = serializers.CharField(max_length=200)
    hebergement_type = serializers.CharField(max_length=120)
    hebergement_adresse = serializers.CharField(max_length=500)
    hebergement_contact = serializers.CharField(max_length=200)
    accept_conditions = serializers.BooleanField(required=False, default=False)
    locale = serializers.ChoiceField(choices=["fr", "en", "ko"], default="fr")


class VisaDocumentUploadSerializer(serializers.Serializer):
    doc_type = serializers.ChoiceField(
        choices=[
            "passport",
            "photo",
            "invitation",
            "flight_ticket",
            "yellow_fever",
        ]
    )
    file = serializers.FileField()


class VisaFinalizeSerializer(serializers.Serializer):
    accept_conditions = serializers.BooleanField()


class PassportRequestSerializer(serializers.Serializer):
    request_kind = serializers.ChoiceField(choices=["first", "renewal", "loss"])
    nom = serializers.CharField(max_length=200)
    post_nom = serializers.CharField(max_length=200)
    prenom = serializers.CharField(max_length=200)
    date_naissance = serializers.CharField(max_length=32)
    lieu_naissance = serializers.CharField(max_length=200)
    numero_passeport_actuel = serializers.CharField(max_length=64, required=False, allow_blank=True)
    telephone = serializers.CharField(max_length=40)
    email = serializers.EmailField()
    motif = serializers.CharField(max_length=500)
    locale = serializers.ChoiceField(choices=["fr", "en", "ko"], default="fr")


class AppointmentSerializer(serializers.Serializer):
    service_type = serializers.ChoiceField(
        choices=["visa", "passport", "consular", "civil", "other"]
    )
    preferred_date = serializers.CharField(max_length=32)
    preferred_slot = serializers.ChoiceField(choices=["morning", "afternoon"])
    notes = serializers.CharField(max_length=500, required=False, allow_blank=True)
    related_case_reference = serializers.CharField(max_length=32, required=False, allow_blank=True)
    locale = serializers.ChoiceField(choices=["fr", "en", "ko"], default="fr")


class ContactCreateSerializer(serializers.Serializer):
    category = serializers.ChoiceField(
        choices=[
            "visa",
            "passport",
            "civil",
            "consular_card",
            "assistance",
            "economic",
            "press",
            "other",
        ]
    )
    full_name = serializers.CharField(max_length=200)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=40, required=False, allow_blank=True)
    subject = serializers.CharField(max_length=255)
    message = serializers.CharField(min_length=20, max_length=5000)
    locale = serializers.ChoiceField(choices=["fr", "en", "ko"], default="fr")


class CivilStatusRequestSerializer(serializers.Serializer):
    """Formulaire d'attestations / légalisations (Séoul + libellés RDC)."""

    document_type = serializers.ChoiceField(
        choices=[
            "composition_familiale",
            "certificat_mariage",
            "certificat_nationalite",
            "attestation_naissance",
            "certificat_deces",
            "certificat_celibat",
            "laissez_passer",
            "legalisation",
            "autre",
        ]
    )
    nom = serializers.CharField(max_length=200)
    post_nom = serializers.CharField(max_length=200)
    prenom = serializers.CharField(max_length=200)
    sexe = serializers.ChoiceField(choices=["M", "F"])
    etat_civil = serializers.ChoiceField(
        choices=["celibataire", "marie", "divorce", "veuf", "autre"]
    )
    date_naissance = serializers.CharField(max_length=32)
    lieu_naissance = serializers.CharField(max_length=200)
    pays_naissance = serializers.CharField(max_length=200)
    nationalite = serializers.CharField(max_length=120)
    profession = serializers.CharField(max_length=200)
    numero_passeport = serializers.CharField(max_length=64)
    email = serializers.EmailField()
    telephone = serializers.CharField(max_length=40)
    password = serializers.CharField(min_length=8, max_length=128, write_only=True)
    password_confirm = serializers.CharField(min_length=8, max_length=128, write_only=True)
    adresse_coree = serializers.CharField(max_length=500)
    adresse_rdc = serializers.CharField(max_length=500)
    nom_pere = serializers.CharField(max_length=200)
    prenom_pere = serializers.CharField(max_length=200)
    nom_mere = serializers.CharField(max_length=200)
    prenom_mere = serializers.CharField(max_length=200)
    motif = serializers.CharField(min_length=20, max_length=2000)
    locale = serializers.ChoiceField(choices=["fr", "en", "ko"], default="fr")


class ConsularRegistrationSerializer(serializers.Serializer):
    """Champs alignés sur les formulaires RDC + procédure Séoul."""

    nom = serializers.CharField(max_length=200)
    post_nom = serializers.CharField(max_length=200)
    prenom = serializers.CharField(max_length=200)
    sexe = serializers.ChoiceField(choices=["M", "F"])
    etat_civil = serializers.ChoiceField(
        choices=["celibataire", "marie", "divorce", "veuf", "autre"]
    )
    date_naissance = serializers.CharField(max_length=32)
    lieu_naissance = serializers.CharField(max_length=200)
    pays_naissance = serializers.CharField(max_length=200)
    nationalite = serializers.CharField(max_length=120)
    profession = serializers.CharField(max_length=200)
    numero_passeport = serializers.CharField(max_length=64)
    email = serializers.EmailField()
    telephone = serializers.CharField(max_length=40)
    password = serializers.CharField(min_length=8, max_length=128, write_only=True)
    password_confirm = serializers.CharField(min_length=8, max_length=128, write_only=True)
    adresse_rue = serializers.CharField(max_length=200)
    adresse_numero = serializers.CharField(max_length=40)
    ville = serializers.CharField(max_length=120)
    code_postal = serializers.CharField(max_length=20)
    type_sejour = serializers.CharField(max_length=64)
    adresse_rdc = serializers.CharField(max_length=500)
    nom_pere = serializers.CharField(max_length=200)
    prenom_pere = serializers.CharField(max_length=200)
    nom_mere = serializers.CharField(max_length=200)
    prenom_mere = serializers.CharField(max_length=200)
    contact_urgence_nom = serializers.CharField(max_length=200)
    contact_urgence_telephone = serializers.CharField(max_length=40)
    contact_urgence_lien = serializers.CharField(max_length=80)
    locale = serializers.ChoiceField(choices=["fr", "en", "ko"], default="fr")
