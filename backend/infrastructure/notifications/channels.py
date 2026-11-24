"""Canaux d'envoi configurables — e-mail, SMS (stub)."""

from __future__ import annotations

import logging
from typing import Protocol

from django.conf import settings
from django.core.mail import send_mail

logger = logging.getLogger(__name__)


class MessageChannel(Protocol):
    def send(self, *, to: str, subject: str, body: str, meta: dict | None = None) -> dict: ...


class EmailChannel:
    def send(self, *, to: str, subject: str, body: str, meta: dict | None = None) -> dict:
        if not to:
            return {"ok": False, "channel": "email", "error": "missing_recipient"}
        send_mail(
            subject=subject,
            message=body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[to],
            fail_silently=False,
        )
        return {"ok": True, "channel": "email", "to": to, "subject": subject}


class ConsoleSmsChannel:
    """Architecture SMS prête — backend console / log (pas d'opérateur branché)."""

    def send(self, *, to: str, subject: str, body: str, meta: dict | None = None) -> dict:
        if not to:
            return {"ok": False, "channel": "sms", "error": "missing_recipient"}
        logger.info("[SMS:%s] to=%s subject=%s body=%s", settings.SMS_BACKEND, to, subject, body[:200])
        return {"ok": True, "channel": "sms", "to": to, "backend": settings.SMS_BACKEND, "simulated": True}


def get_email_channel() -> MessageChannel:
    return EmailChannel()


def get_sms_channel() -> MessageChannel:
    backend = getattr(settings, "SMS_BACKEND", "console")
    if backend in {"console", "log", "stub"}:
        return ConsoleSmsChannel()
    # Extension future : Twilio, etc.
    return ConsoleSmsChannel()
