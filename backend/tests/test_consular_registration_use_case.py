"""Tests unitaires — formulaire d'enregistrement consulaire."""

from __future__ import annotations

from application.use_cases import SubmitConsularRegistration, ValidationError
from domain.entities import ConsularRegistrationSubmission


class FakeRegRepo:
    def __init__(self) -> None:
        self.created: list[ConsularRegistrationSubmission] = []

    def create(self, submission: ConsularRegistrationSubmission) -> dict:
        self.created.append(submission)
        return {"id": 7, "reference": "CONS-TEST"}

    def list_for_user(self, user_id: int) -> list[dict]:
        return []


def _valid(**overrides) -> ConsularRegistrationSubmission:
    data = dict(
        nom="Mukendi",
        post_nom="Kabongo",
        prenom="Jean",
        sexe="M",
        etat_civil="celibataire",
        date_naissance="1990-05-12",
        lieu_naissance="Kinshasa",
        pays_naissance="République démocratique du Congo",
        nationalite="Congolaise",
        profession="Étudiant",
        numero_passeport="OP1234567",
        email="jean.mukendi@example.com",
        telephone="+82 10-1234-5678",
        adresse_rue="Hoenamu-ro",
        adresse_numero="73-1",
        ville="Séoul",
        code_postal="04344",
        type_sejour="D-2",
        adresse_rdc="Avenue de la Libération, Kinshasa",
        nom_pere="Mukendi",
        prenom_pere="Paul",
        nom_mere="Kabongo",
        prenom_mere="Marie",
        contact_urgence_nom="Paul Mukendi",
        contact_urgence_telephone="+243 812 000 000",
        contact_urgence_lien="Père",
        password="SecurePass1",
        password_confirm="SecurePass1",
        locale="fr",
        ip_address="127.0.0.1",
    )
    data.update(overrides)
    return ConsularRegistrationSubmission(**data)


def test_submit_registration_success():
    repo = FakeRegRepo()
    result = SubmitConsularRegistration(repo).execute(_valid())
    assert result["id"] == 7
    assert result["reference"] == "CONS-TEST"
    assert len(repo.created) == 1
    assert repo.created[0].nom == "Mukendi"


def test_submit_rejects_password_mismatch():
    repo = FakeRegRepo()
    try:
        SubmitConsularRegistration(repo).execute(_valid(password_confirm="autre"))
        assert False
    except ValidationError as exc:
        assert exc.field == "password_confirm"


def test_submit_rejects_missing_nom():
    repo = FakeRegRepo()
    try:
        SubmitConsularRegistration(repo).execute(_valid(nom=""))
        assert False
    except ValidationError as exc:
        assert exc.field == "nom"


def test_submit_rejects_bad_email():
    repo = FakeRegRepo()
    try:
        SubmitConsularRegistration(repo).execute(_valid(email="bad"))
        assert False
    except ValidationError as exc:
        assert exc.field == "email"
