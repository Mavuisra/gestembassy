"""
Ports (interfaces) de la couche application.

Les adaptateurs concrets vivent dans `infrastructure/`.
"""

from __future__ import annotations

from typing import Optional, Protocol, Sequence

from domain.entities import (
    AuthenticatedCitizen,
    ChangePasswordCommand,
    CivilStatusSubmission,
    ConsularRegistrationSubmission,
    ConsularServiceEntity,
    ContactSubmission,
    FaqEntity,
    LoginCitizenCommand,
    NewsEntity,
    RegisterCitizenCommand,
    UpdateProfileCommand,
    VisaCategoryEntity,
    VisaPreApplicationCommand,
)


class NewsRepositoryPort(Protocol):
    def list_published(self, *, limit: int = 20) -> Sequence[NewsEntity]: ...

    def get_by_slug(self, slug: str) -> Optional[NewsEntity]: ...


class FaqRepositoryPort(Protocol):
    def list_published(
        self, *, category: Optional[str] = None, limit: int = 50
    ) -> Sequence[FaqEntity]: ...


class ConsularServiceRepositoryPort(Protocol):
    def list_published(self, *, limit: int = 50) -> Sequence[ConsularServiceEntity]: ...

    def get_by_slug(self, slug: str) -> Optional[ConsularServiceEntity]: ...


class VisaCategoryRepositoryPort(Protocol):
    def list_published(self, *, limit: int = 50) -> Sequence[VisaCategoryEntity]: ...

    def get_by_slug(self, slug: str) -> Optional[VisaCategoryEntity]: ...


class ContactRepositoryPort(Protocol):
    def create(self, submission: ContactSubmission) -> int: ...


class ConsularRegistrationRepositoryPort(Protocol):
    def create(self, submission: ConsularRegistrationSubmission) -> dict: ...

    def list_for_user(self, user_id: int) -> Sequence[dict]: ...


class CivilStatusRepositoryPort(Protocol):
    def create(self, submission: CivilStatusSubmission) -> dict: ...

    def list_for_user(self, user_id: int) -> Sequence[dict]: ...


class PassportRequestRepositoryPort(Protocol):
    def create(self, command) -> dict: ...

    def list_for_user(self, user_id: int) -> Sequence[dict]: ...


class AppointmentRepositoryPort(Protocol):
    def create(self, command) -> dict: ...

    def list_for_user(self, user_id: int) -> Sequence[dict]: ...


class NotificationRepositoryPort(Protocol):
    def list_for_user(self, user_id: int, *, unread_only: bool = False) -> Sequence[dict]: ...

    def mark_read(self, user_id: int, notification_id: int) -> None: ...

    def mark_all_read(self, user_id: int) -> int: ...

    def unread_count(self, user_id: int) -> int: ...

    def create(self, user_id: int, *, title: str, body: str, link: str = "") -> dict: ...


class CaseEventRepositoryPort(Protocol):
    def list_for_user(self, user_id: int) -> Sequence[dict]: ...

    def add(
        self,
        user_id: int,
        *,
        case_type: str,
        case_reference: str,
        event_type: str,
        message: str,
    ) -> dict: ...


class AccountRepositoryPort(Protocol):
    def email_exists(self, email: str) -> bool: ...

    def create_citizen(self, command: RegisterCitizenCommand) -> int: ...

    def authenticate(self, command: LoginCitizenCommand) -> Optional[AuthenticatedCitizen]: ...

    def get_profile(self, user_id: int) -> Optional[dict]: ...

    def update_profile(self, user_id: int, command: UpdateProfileCommand) -> dict: ...

    def check_password(self, user_id: int, password: str) -> bool: ...

    def set_password(self, user_id: int, password: str) -> None: ...


class VisaPreApplicationRepositoryPort(Protocol):
    def create(self, command: VisaPreApplicationCommand) -> dict: ...

    def list_for_user(self, user_id: int) -> Sequence[dict]: ...

    def get_for_user(self, user_id: int, reference: str) -> Optional[dict]: ...

    def save_document(
        self,
        user_id: int,
        reference: str,
        *,
        doc_type: str,
        original_name: str,
        content_type: str,
        size_bytes: int,
        file_bytes: bytes,
    ) -> dict: ...

    def list_document_types(self, user_id: int, reference: str) -> Sequence[str]: ...

    def finalize(self, user_id: int, reference: str) -> dict: ...
