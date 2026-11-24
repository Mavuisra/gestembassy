"""Tests unitaires — demande d'acte d'état civil / légalisation."""

from __future__ import annotations

from application.use_cases import SubmitCivilStatusRequest, ValidationError
from domain.entities import CivilStatusSubmission


class FakeCivilRepo:
    def __init__(self) -> None:
        self.created: list[CivilStatusSubmission] = []

    def create(self, submission: CivilStatusSubmission) -> dict:
        self.created.append(submission)
        return {"id": 11, "reference": "CIV-TEST"}

    def list_for_user(self, user_id: int) -> list[dict]:
        return []


def _valid(**overrides) -> CivilStatusSubmission:
    data = dict(
        document_type="attestation_naissance",
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
        adresse_coree="Yongsan-gu, Seoul 04344",
        adresse_rdc="Avenue de la Libération, Kinshasa",
        nom_pere="Mukendi",
        prenom_pere="Paul",
        nom_mere="Kabongo",
        prenom_mere="Marie",
        motif="Demande d'attestation de naissance pour formalités administratives en Corée.",
        password="SecurePass1",
        password_confirm="SecurePass1",
        locale="fr",
        ip_address="127.0.0.1",
    )
    data.update(overrides)
    return CivilStatusSubmission(**data)


def test_submit_civil_success():
    repo = FakeCivilRepo()
    assert SubmitCivilStatusRequest(repo).execute(_valid())["id"] == 11


def test_submit_rejects_bad_document():
    repo = FakeCivilRepo()
    try:
        SubmitCivilStatusRequest(repo).execute(_valid(document_type="inconnu"))
        assert False
    except ValidationError as exc:
        assert exc.field == "document_type"


def test_submit_rejects_short_motif():
    repo = FakeCivilRepo()
    try:
        SubmitCivilStatusRequest(repo).execute(_valid(motif="court"))
        assert False
    except ValidationError as exc:
        assert exc.field == "motif"
