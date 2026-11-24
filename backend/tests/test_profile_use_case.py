"""Tests — gestion du profil usager (PHASE 6.3)."""

from __future__ import annotations

from application.use_cases import ChangeCitizenPassword, UpdateCitizenProfile, ValidationError
from domain.entities import ChangePasswordCommand, UpdateProfileCommand


class FakeProfileRepo:
    def __init__(self) -> None:
        self.profile = {
            "id": 1,
            "email": "citoyen@example.com",
            "nom": "Mukendi",
            "post_nom": "Kabongo",
            "prenom": "Jean",
            "telephone": "",
            "locale": "fr",
        }
        self.password = "SecurePass1"

    def get_profile(self, user_id: int) -> dict | None:
        return self.profile if user_id == 1 else None

    def update_profile(self, user_id: int, command: UpdateProfileCommand) -> dict:
        self.profile.update(
            {
                "nom": command.nom,
                "post_nom": command.post_nom,
                "prenom": command.prenom,
                "telephone": command.telephone,
                "locale": command.locale,
            }
        )
        return self.profile

    def check_password(self, user_id: int, password: str) -> bool:
        return user_id == 1 and password == self.password

    def set_password(self, user_id: int, password: str) -> None:
        self.password = password


def test_update_profile_success():
    repo = FakeProfileRepo()
    result = UpdateCitizenProfile(repo).execute(
        1,
        UpdateProfileCommand(
            nom="Ilunga",
            post_nom="Kabongo",
            prenom="Jean",
            telephone="+82 10-0000-0000",
            locale="en",
        ),
    )
    assert result["nom"] == "Ilunga"
    assert result["locale"] == "en"


def test_update_profile_rejects_empty_nom():
    repo = FakeProfileRepo()
    try:
        UpdateCitizenProfile(repo).execute(
            1,
            UpdateProfileCommand(nom="", post_nom="K", prenom="J", telephone="", locale="fr"),
        )
        assert False
    except ValidationError as exc:
        assert exc.field == "nom"


def test_change_password_success():
    repo = FakeProfileRepo()
    ChangeCitizenPassword(repo).execute(
        1,
        ChangePasswordCommand(
            current_password="SecurePass1",
            new_password="NewSecure9",
            new_password_confirm="NewSecure9",
        ),
    )
    assert repo.password == "NewSecure9"


def test_change_password_rejects_wrong_current():
    repo = FakeProfileRepo()
    try:
        ChangeCitizenPassword(repo).execute(
            1,
            ChangePasswordCommand(
                current_password="bad",
                new_password="NewSecure9",
                new_password_confirm="NewSecure9",
            ),
        )
        assert False
    except ValidationError as exc:
        assert exc.field == "current_password"
