"""Tests unitaires — validation du cas d'usage contact."""

from __future__ import annotations

from application.use_cases import SubmitContactMessage, ValidationError
from domain.entities import ContactSubmission


class FakeContactRepo:
    def __init__(self) -> None:
        self.created: list[ContactSubmission] = []

    def create(self, submission: ContactSubmission) -> int:
        self.created.append(submission)
        return 42


def _valid(**overrides) -> ContactSubmission:
    data = dict(
        category="visa",
        full_name="Jean Mukendi",
        email="jean@example.com",
        phone="",
        subject="Demande d'information visa",
        message="Je souhaite obtenir des informations sur les pièces requises pour un visa d'affaires.",
        locale="fr",
        ip_address="127.0.0.1",
    )
    data.update(overrides)
    return ContactSubmission(**data)


def test_submit_contact_success():
    repo = FakeContactRepo()
    result = SubmitContactMessage(repo).execute(_valid())
    assert result == 42
    assert len(repo.created) == 1


def test_submit_contact_rejects_short_message():
    repo = FakeContactRepo()
    try:
        SubmitContactMessage(repo).execute(_valid(message="trop court"))
        assert False, "aurait dû lever ValidationError"
    except ValidationError as exc:
        assert exc.field == "message"


def test_submit_contact_rejects_bad_email():
    repo = FakeContactRepo()
    try:
        SubmitContactMessage(repo).execute(_valid(email="pas-un-email"))
        assert False
    except ValidationError as exc:
        assert exc.field == "email"
