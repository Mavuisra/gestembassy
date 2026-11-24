"""Tests unitaires — inscription usager (PHASE 6.1)."""

from __future__ import annotations

from application.use_cases import RegisterCitizen, ValidationError
from domain.entities import RegisterCitizenCommand


class FakeAccountRepo:
    def __init__(self) -> None:
        self.emails: set[str] = set()
        self.created: list[RegisterCitizenCommand] = []

    def email_exists(self, email: str) -> bool:
        return email.strip().lower() in self.emails

    def create_citizen(self, command: RegisterCitizenCommand) -> int:
        self.emails.add(command.email.strip().lower())
        self.created.append(command)
        return 3


def _valid(**overrides) -> RegisterCitizenCommand:
    data = dict(
        email="citoyen@example.com",
        password="SecurePass1",
        password_confirm="SecurePass1",
        nom="Mukendi",
        post_nom="Kabongo",
        prenom="Jean",
        telephone="+82 10-1234-5678",
        locale="fr",
    )
    data.update(overrides)
    return RegisterCitizenCommand(**data)


def test_register_success():
    repo = FakeAccountRepo()
    user_id = RegisterCitizen(repo).execute(_valid())
    assert user_id == 3
    assert len(repo.created) == 1


def test_register_rejects_duplicate_email():
    repo = FakeAccountRepo()
    repo.emails.add("citoyen@example.com")
    try:
        RegisterCitizen(repo).execute(_valid())
        assert False
    except ValidationError as exc:
        assert exc.field == "email"


def test_register_rejects_password_mismatch():
    repo = FakeAccountRepo()
    try:
        RegisterCitizen(repo).execute(_valid(password_confirm="autre"))
        assert False
    except ValidationError as exc:
        assert exc.field == "password_confirm"


def test_register_rejects_short_password():
    repo = FakeAccountRepo()
    try:
        RegisterCitizen(repo).execute(_valid(password="short", password_confirm="short"))
        assert False
    except ValidationError as exc:
        assert exc.field == "password"
