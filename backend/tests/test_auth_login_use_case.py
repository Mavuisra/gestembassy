"""Tests unitaires — connexion usager (PHASE 6.2)."""

from __future__ import annotations

from application.use_cases import LoginCitizen, ValidationError
from domain.entities import AuthenticatedCitizen, LoginCitizenCommand, RegisterCitizenCommand


class FakeAccountRepo:
    def __init__(self) -> None:
        self.password = "SecurePass1"

    def email_exists(self, email: str) -> bool:
        return False

    def create_citizen(self, command: RegisterCitizenCommand) -> int:
        return 1

    def authenticate(self, command: LoginCitizenCommand) -> AuthenticatedCitizen | None:
        if command.email == "citoyen@example.com" and command.password == self.password:
            return AuthenticatedCitizen(
                id=1,
                email=command.email,
                nom="Mukendi",
                post_nom="Kabongo",
                prenom="Jean",
                telephone="",
                locale="fr",
                token="tok-test",
            )
        return None


def test_login_success():
    citizen = LoginCitizen(FakeAccountRepo()).execute(
        LoginCitizenCommand(email="citoyen@example.com", password="SecurePass1")
    )
    assert citizen.token == "tok-test"


def test_login_rejects_bad_credentials():
    try:
        LoginCitizen(FakeAccountRepo()).execute(
            LoginCitizenCommand(email="citoyen@example.com", password="wrong")
        )
        assert False
    except ValidationError as exc:
        assert exc.field == "email"
